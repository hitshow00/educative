-- ============================================================================
-- SCHÉMA SQL SUPABASE : Plateforme Éducative Maroc (Blogger + Supabase + Vercel)
-- À exécuter dans : Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. TABLE PRINCIPALE : resources
-- Stocke les métadonnées des cours, résumés et examens ainsi que les liens externes.
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subject text NOT NULL,
  grade_level text NOT NULL,
  file_size text NOT NULL,
  file_format text NOT NULL DEFAULT 'PDF',
  external_url text NOT NULL CHECK (external_url ~* '^https?://'),
  download_count integer NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Commentaires descriptifs (bonne pratique PostgreSQL)
COMMENT ON TABLE public.resources IS 'Catalogue des ressources pédagogiques téléchargeables (cours, résumés, examens).';
COMMENT ON COLUMN public.resources.slug IS 'Identifiant URL unique utilisé dans /download/[slug] et dans Blogger (data-slug).';
COMMENT ON COLUMN public.resources.external_url IS 'Lien final vers l''hébergeur externe (Up-4ever, MediaFire, Google Drive).';

-- 2. INDEXES DE PERFORMANCE
-- Note : La contrainte UNIQUE sur `slug` crée automatiquement un index B-Tree unique.
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_grade_subject ON public.resources (grade_level, subject);

-- 3. TRIGGER DE MISE À JOUR AUTOMATIQUE DE `updated_at`
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_resources_updated ON public.resources;
CREATE TRIGGER on_resources_updated
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. ACTIVATION DE ROW LEVEL SECURITY (RLS) & DROITS D'ACCÈS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Droits SQL explicites pour l'API Data (PostgREST)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.resources TO authenticated;

-- Politique 1 : Lecture publique autorisée (Blogger + Page Safelink Vercel)
DROP POLICY IF EXISTS "Lecture publique des ressources" ON public.resources;
CREATE POLICY "Lecture publique des ressources"
  ON public.resources
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique 2 : Insertion réservée à l'administrateur authentifié
-- IMPORTANT : Désactivez les inscriptions publiques dans Supabase Dashboard :
-- Authentication -> Providers -> Email -> décochez "Allow new users to sign up"
DROP POLICY IF EXISTS "Insertion admin uniquement" ON public.resources;
CREATE POLICY "Insertion admin uniquement"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique 3 : Modification réservée à l'administrateur authentifié
DROP POLICY IF EXISTS "Modification admin uniquement" ON public.resources;
CREATE POLICY "Modification admin uniquement"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique 4 : Suppression réservée à l'administrateur authentifié
DROP POLICY IF EXISTS "Suppression admin uniquement" ON public.resources;
CREATE POLICY "Suppression admin uniquement"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (true);

-- [OPTIONNEL - SI VOUS AJOUTEZ DES COMPTES ÉLÈVES PLUS TARD]
-- Remplacez `USING (true)` / `WITH CHECK (true)` ci-dessus par :
--   ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
-- Et promouvez votre compte admin via :
--   UPDATE auth.users
--   SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
--   WHERE email = 'votre-email@domaine.ma';

-- 5. FONCTION RPC SÉCURISÉE : increment_download
-- Permet au public (rôle anon) d'incrémenter UNIQUEMENT `download_count` de +1
-- sans donner de droit UPDATE global sur la table `resources`.
CREATE OR REPLACE FUNCTION public.increment_download(resource_slug text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.resources
  SET download_count = download_count + 1
  WHERE slug = resource_slug
  RETURNING download_count INTO new_count;

  RETURN new_count;
END;
$$;

-- Sécurisation des privilèges d'exécution de la RPC
REVOKE ALL ON FUNCTION public.increment_download(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_download(text) TO anon, authenticated;

-- 6. DONNÉE D'EXEMPLE (Optionnel - pour tester immédiatement)
INSERT INTO public.resources (
  slug,
  title,
  subject,
  grade_level,
  file_size,
  file_format,
  external_url
)
VALUES (
  'pack-maths-2bac-pc-svt',
  'Pack Complet Maths 2ème Bac PC & SVT (Cours + Exercices + Examens Nationaux 2010-2025)',
  'Mathématiques',
  '2Bac',
  '145 Mo',
  'ZIP / PDF',
  'https://www.mediafire.com/file/exemple-pack-maths-2bac'
)
ON CONFLICT (slug) DO NOTHING;
