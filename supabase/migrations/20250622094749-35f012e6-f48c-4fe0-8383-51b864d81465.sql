
-- Vérifier et créer les types énumérés seulement s'ils n'existent pas déjà
DO $$
BEGIN
    -- Créer client_type seulement s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_type') THEN
        CREATE TYPE public.client_type AS ENUM ('SARL', 'SA', 'SNC', 'Auto-entrepreneur', 'Particulier', 'Association');
    END IF;
    
    -- Créer client_status seulement s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_status') THEN
        CREATE TYPE public.client_status AS ENUM ('Actif', 'Inactif', 'Suspendu');
    END IF;
END $$;

-- Vérifier et créer la table clients seulement si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients' AND table_schema = 'public') THEN
        CREATE TABLE public.clients (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          nom_commercial TEXT NOT NULL,
          raison_sociale TEXT,
          type_client public.client_type NOT NULL DEFAULT 'SARL'::client_type,
          statut public.client_status NOT NULL DEFAULT 'Actif'::client_status,
          
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
        
        -- Activer RLS sur la nouvelle table clients
        ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Créer les politiques RLS pour la table clients (seulement si elles n'existent pas)
DO $$
BEGIN
    -- Politique pour voir les clients
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view clients' AND tablename = 'clients') THEN
        CREATE POLICY "Authenticated users can view clients"
          ON public.clients
          FOR SELECT
          TO authenticated
          USING (true);
    END IF;
    
    -- Politique pour créer des clients
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employees and above can create clients' AND tablename = 'clients') THEN
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
    END IF;
    
    -- Politique pour modifier des clients
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employees and above can update clients' AND tablename = 'clients') THEN
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
    END IF;
    
    -- Politique pour supprimer des clients
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete clients' AND tablename = 'clients') THEN
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
    END IF;
END $$;

-- Créer les index pour optimiser les performances (seulement s'ils n'existent pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_nom_commercial') THEN
        CREATE INDEX idx_clients_nom_commercial ON public.clients(nom_commercial);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_type') THEN
        CREATE INDEX idx_clients_type ON public.clients(type_client);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_statut') THEN
        CREATE INDEX idx_clients_statut ON public.clients(statut);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_created_by') THEN
        CREATE INDEX idx_clients_created_by ON public.clients(created_by);
    END IF;
END $$;

-- Créer le trigger pour mettre à jour updated_at sur la table clients
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_clients_updated_at') THEN
        CREATE TRIGGER update_clients_updated_at
            BEFORE UPDATE ON public.clients
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
