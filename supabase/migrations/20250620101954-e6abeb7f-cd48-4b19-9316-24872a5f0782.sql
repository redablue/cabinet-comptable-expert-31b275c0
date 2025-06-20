
-- Supprimer les tables liées aux stations-service qui ne sont pas pertinentes pour un cabinet comptable

-- D'abord supprimer la table sales qui référence fuel_tanks
DROP TABLE IF EXISTS public.sales CASCADE;

-- Supprimer la table pumps qui référence fuel_tanks
DROP TABLE IF EXISTS public.pumps CASCADE;

-- Supprimer la table fuel_tanks
DROP TABLE IF EXISTS public.fuel_tanks CASCADE;

-- Supprimer les types énumérés liés aux carburants
DROP TYPE IF EXISTS public.fuel_type CASCADE;

-- Supprimer la table inventory_items qui semble aussi liée à la station-service
DROP TABLE IF EXISTS public.inventory_items CASCADE;
