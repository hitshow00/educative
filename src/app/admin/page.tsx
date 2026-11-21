import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { CURRICULUM_QUIZZES } from '@/data/curriculum';
import type { Quiz } from '@/types/quiz';
import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Administration | ExamQuiz.ma',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin');
  }

  let supabaseQuizzes: Quiz[] = [];
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(
        'id, slug, level, branch, subject, chapter_title, description, exam_type, difficulty, estimated_minutes, questions(id, question_text, options, correct_index, explanation, exam_tip, order_index)'
      )
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      supabaseQuizzes = data as unknown as Quiz[];
    }
  } catch {
    supabaseQuizzes = [];
  }

  return (
    <AdminDashboard
      userEmail={user.email || 'Administrateur'}
      initialSupabaseQuizzes={supabaseQuizzes}
      builtInCount={CURRICULUM_QUIZZES.length}
    />
  );
}
