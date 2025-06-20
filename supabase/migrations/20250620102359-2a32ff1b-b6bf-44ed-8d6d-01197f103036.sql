
-- Créer un type énuméré pour les types de clients
CREATE TYPE public.client_type AS ENUM ('SARL', 'SA', 'Auto-entrepreneur', 'Particulier', 'Association');

-- Créer un type énuméré pour les statuts de clients
CREATE TYPE public.client_status AS ENUM ('Actif', 'Inactif', 'Suspendu');

-- Créer la table clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_commercial TEXT NOT NULL,
  raison_sociale TEXT,
  type_client public.client_type NOT NULL DEFAULT 'SARL',
  statut public.client_status NOT NULL DEFAULT 'Actif',
  
  -- Informations fiscales
  identifiant_fiscal TEXT,
  numero_rc TEXT,
  ice TEXT,
  identifiant_dgi TEXT,
  mot_de_passe_dgi TEXT,
  identifiant_damancom TEXT,
  mot_de_passe_damancom TEXT,
  
  -- Informations de contact
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  
  -- Informations de gestion
  date_creation DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  
  -- Métadonnées
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs authentifiés de voir les clients
CREATE POLICY "Authenticated users can view clients"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique pour permettre aux employés et plus de créer des clients
CREATE POLICY "Employees and above can create clients"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role::text IN ('superadmin', 'admin', 'employee')
    )
  );

-- Politique pour permettre aux employés et plus de modifier les clients
CREATE POLICY "Employees and above can update clients"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role::text IN ('superadmin', 'admin', 'employee')
    )
  );

-- Politique pour permettre aux admins de supprimer les clients
CREATE POLICY "Admins can delete clients"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role::text IN ('superadmin', 'admin')
    )
  );

-- Créer un index sur les champs de recherche fréquents
CREATE INDEX idx_clients_nom_commercial ON public.clients(nom_commercial);
CREATE INDEX idx_clients_type ON public.clients(type_client);
CREATE INDEX idx_clients_statut ON public.clients(statut);
CREATE INDEX idx_clients_created_by ON public.clients(created_by);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at sur la table clients
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
