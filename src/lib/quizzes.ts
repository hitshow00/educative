import { createClient } from '@/utils/supabase/server';
import { CURRICULUM_QUIZZES } from '@/data/curriculum';
import type { LevelId, Quiz, QuizQuestion } from '@/types/quiz';

interface SupabaseQuizRow {
  id: string;
  slug: string;
  level: LevelId;
  branch: string;
  subject: string;
  chapter_title: string;
  description: string;
  exam_type: 'National' | 'Régional' | 'Local' | 'Provincial';
  difficulty: 'Facile' | 'Moyen' | 'Examen';
  estimated_minutes: number;
  questions: Array<{
    id: string;
    question_text: string;
    options: string[];
    correct_index: number;
    explanation: string;
    exam_tip?: string | null;
    order_index: number;
  }>;
}

/**
 * Charge tous les quiz (fusionne les quiz publiés dans Supabase avec la banque intégrée).
 * Si un quiz Supabase partage le même `slug`, la version Supabase est prioritaire.
 */
export async function getAllQuizzes(): Promise<Quiz[]> {
  const bySlug = new Map<string, Quiz>();
  for (const quiz of CURRICULUM_QUIZZES) {
    bySlug.set(quiz.slug, quiz);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select(
        'id, slug, level, branch, subject, chapter_title, description, exam_type, difficulty, estimated_minutes, questions(id, question_text, options, correct_index, explanation, exam_tip, order_index)'
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      for (const row of data as unknown as SupabaseQuizRow[]) {
        const sortedQuestions: QuizQuestion[] = (row.questions || [])
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
          .map((q) => ({
            id: q.id,
            question_text: q.question_text,
            options: Array.isArray(q.options) ? q.options : [],
            correct_index: q.correct_index,
            explanation: q.explanation,
            exam_tip: q.exam_tip || undefined,
          }));

        if (sortedQuestions.length > 0) {
          bySlug.set(row.slug, {
            id: row.id,
            slug: row.slug,
            level: row.level,
            branch: row.branch,
            subject: row.subject,
            chapter_title: row.chapter_title,
            description: row.description,
            exam_type: row.exam_type,
            difficulty: row.difficulty,
            estimated_minutes: row.estimated_minutes,
            questions: sortedQuestions,
          });
        }
      }
    }
  } catch {
    // Fallback silencieux sur CURRICULUM_QUIZZES si les tables ne sont pas encore créées
  }

  return Array.from(bySlug.values());
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  const all = await getAllQuizzes();
  return all.find((q) => q.slug === slug) || null;
}
