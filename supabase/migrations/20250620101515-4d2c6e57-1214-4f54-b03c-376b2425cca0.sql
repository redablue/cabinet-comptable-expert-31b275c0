
-- Vérifier d'abord si la colonne role existe, sinon la créer
DO $$
BEGIN
    -- Créer le nouveau type d'enum
    DROP TYPE IF EXISTS user_role CASCADE;
    CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'employee', 'trainee');
    
    -- Vérifier si la colonne role existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        -- Ajouter la colonne role si elle n'existe pas
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'trainee'::user_role NOT NULL;
    ELSE
        -- Modifier le type de la colonne existante
        ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING 'employee'::user_role;
        ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'trainee'::user_role;
    END IF;
END $$;

-- Mettre à jour la fonction create_authorized_user pour utiliser les nouveaux rôles
CREATE OR REPLACE FUNCTION create_authorized_user(
  user_email TEXT,
  user_role TEXT,
  user_full_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_user_count INTEGER;
  result JSON;
BEGIN
  -- Vérifier si l'utilisateur existe déjà
  SELECT COUNT(*) INTO existing_user_count
  FROM profiles
  WHERE email = user_email;
  
  IF existing_user_count > 0 THEN
    result := json_build_object('error', 'Un utilisateur avec cet email existe déjà');
    RETURN result;
  END IF;
  
  -- Créer l'entrée dans la table profiles (pour autoriser l'inscription future)
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (gen_random_uuid(), user_email, user_full_name, user_role::user_role);
  
  result := json_build_object('success', true, 'message', 'Utilisateur autorisé créé avec succès');
  RETURN result;
END;
$$;

-- Mettre à jour la fonction handle_new_user pour utiliser le nouveau rôle par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Vérifier si l'utilisateur est autorisé (existe dans profiles avec juste l'email)
  IF EXISTS (SELECT 1 FROM profiles WHERE email = NEW.email AND id != NEW.id) THEN
    -- Mettre à jour le profil existant avec l'ID utilisateur
    UPDATE profiles 
    SET id = NEW.id, 
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
        updated_at = now()
    WHERE email = NEW.email;
  ELSE
    -- Créer un nouveau profil avec le rôle par défaut
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nouvel Utilisateur'),
      'trainee'::user_role
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Mettre à jour les fonctions de vérification des rôles
CREATE OR REPLACE FUNCTION public.is_manager_or_higher(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('superadmin', 'admin')
  )
$$;
