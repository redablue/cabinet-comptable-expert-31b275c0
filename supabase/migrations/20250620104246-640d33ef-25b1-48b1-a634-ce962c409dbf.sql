
-- Créer une fonction pour créer un superadmin directement
CREATE OR REPLACE FUNCTION create_superadmin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_full_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Vérifier si l'utilisateur existe déjà
  IF EXISTS (SELECT 1 FROM profiles WHERE email = admin_email) THEN
    result := json_build_object('error', 'Un utilisateur avec cet email existe déjà');
    RETURN result;
  END IF;
  
  -- Générer un UUID pour le nouvel utilisateur
  new_user_id := gen_random_uuid();
  
  -- Créer le profil superadmin
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (new_user_id, admin_email, admin_full_name, 'superadmin'::user_role);
  
  result := json_build_object(
    'success', true, 
    'message', 'Compte superadmin créé avec succès',
    'user_id', new_user_id,
    'email', admin_email
  );
  RETURN result;
END;
$$;
