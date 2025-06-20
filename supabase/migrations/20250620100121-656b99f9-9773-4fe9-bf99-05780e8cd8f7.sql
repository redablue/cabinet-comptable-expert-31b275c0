
-- Créer la fonction pour créer des utilisateurs autorisés en utilisant le type existant
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

-- Ajouter les politiques RLS pour la table profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Politique pour permettre aux admins de voir tous les profils
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role::text IN ('admin', 'superadmin')
    )
  );

-- Politique pour permettre aux admins de modifier les profils
CREATE POLICY "Admins can update profiles"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role::text IN ('admin', 'superadmin')
    )
  );

-- Mise à jour de la fonction handle_new_user pour gérer les utilisateurs autorisés
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
      'pompiste'::user_role
    );
  END IF;
  
  RETURN NEW;
END;
$$;
