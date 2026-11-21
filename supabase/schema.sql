-- ============================================================================
-- SCHÉMA SQL SUPABASE : Plateforme Quiz Interactifs & Suivi Examens Maroc
-- À exécuter dans : Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. TABLE DES QUIZ (Chapitres d'examens par niveau et matière)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  level text NOT NULL CHECK (level IN ('2bac', '1bac', '3ac', '6eme')),
  branch text NOT NULL DEFAULT 'Tronc Commun / Général',
  subject text NOT NULL,
  stage_number integer NOT NULL DEFAULT 1 CHECK (stage_number >= 1 AND stage_number <= 10),
  chapter_title text NOT NULL,
  description text NOT NULL,
  exam_type text NOT NULL DEFAULT 'National',
  exam_source text,
  difficulty text NOT NULL DEFAULT 'Moyen' CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile', 'Boss Examen')),
  estimated_minutes integer NOT NULL DEFAULT 5 CHECK (estimated_minutes > 0),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. TABLE DES QUESTIONS QCM
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation text NOT NULL,
  exam_tip text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. TABLE DE PROGRESSION DES ÉLÈVES (Synchronisation cloud optionnelle)
CREATE TABLE IF NOT EXISTS public.user_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_slug text NOT NULL,
  level text NOT NULL CHECK (level IN ('2bac', '1bac', '3ac', '6eme')),
  subject text NOT NULL,
  chapter_title text NOT NULL,
  score_20 numeric(4,1) NOT NULL CHECK (score_20 >= 0 AND score_20 <= 20),
  correct_count integer NOT NULL CHECK (correct_count >= 0),
  total_count integer NOT NULL CHECK (total_count > 0),
  duration_seconds integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  mode text NOT NULL DEFAULT 'training' CHECK (mode IN ('training', 'exam', 'mistakes')),
  wrong_indices jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. INDEXES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quizzes_level_subject ON public.quizzes (level, subject) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_questions_quiz_order ON public.questions (quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_attempts_user_created ON public.user_attempts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_user_slug ON public.user_attempts (user_id, quiz_slug);

-- 5. TRIGGER UPDATED_AT SUR `quizzes`
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

DROP TRIGGER IF EXISTS on_quizzes_updated ON public.quizzes;
CREATE TRIGGER on_quizzes_updated
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS) & DROITS D'ACCÈS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.quizzes, public.questions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.quizzes, public.questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_attempts TO authenticated;

-- Politiques `quizzes` : lecture publique des quiz publiés, gestion réservée à l'admin
DROP POLICY IF EXISTS "Lecture publique des quiz publiés" ON public.quizzes;
CREATE POLICY "Lecture publique des quiz publiés"
  ON public.quizzes
  FOR SELECT
  TO anon, authenticated
  USING (
    is_published = true
    OR ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  );

DROP POLICY IF EXISTS "Gestion admin des quiz (insert)" ON public.quizzes;
CREATE POLICY "Gestion admin des quiz (insert)"
  ON public.quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Gestion admin des quiz (update)" ON public.quizzes;
CREATE POLICY "Gestion admin des quiz (update)"
  ON public.quizzes
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Gestion admin des quiz (delete)" ON public.quizzes;
CREATE POLICY "Gestion admin des quiz (delete)"
  ON public.quizzes
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Politiques `questions` : lecture publique, gestion réservée à l'admin
DROP POLICY IF EXISTS "Lecture publique des questions" ON public.questions;
CREATE POLICY "Lecture publique des questions"
  ON public.questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Gestion admin des questions (insert)" ON public.questions;
CREATE POLICY "Gestion admin des questions (insert)"
  ON public.questions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Gestion admin des questions (update)" ON public.questions;
CREATE POLICY "Gestion admin des questions (update)"
  ON public.questions
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Gestion admin des questions (delete)" ON public.questions;
CREATE POLICY "Gestion admin des questions (delete)"
  ON public.questions
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Politiques `user_attempts` : chaque élève accède uniquement à SES propres résultats
DROP POLICY IF EXISTS "Élève lit ses tentatives" ON public.user_attempts;
CREATE POLICY "Élève lit ses tentatives"
  ON public.user_attempts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Élève enregistre sa tentative" ON public.user_attempts;
CREATE POLICY "Élève enregistre sa tentative"
  ON public.user_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Élève supprime ses tentatives" ON public.user_attempts;
CREATE POLICY "Élève supprime ses tentatives"
  ON public.user_attempts
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- NOTE ADMIN : Pour donner les droits admin à votre compte, exécutez :
-- UPDATE auth.users
-- SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
-- WHERE email = 'votre-email-admin@domaine.ma';
