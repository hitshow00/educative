import type { Metadata } from 'next';
import { getAllQuizzes } from '@/lib/quizzes';
import { ProgressionClient } from '@/components/ProgressionClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ma Progression | ExamQuiz.ma',
  description: 'Suivez vos notes sur 20, votre maîtrise par matière et votre série de révision.',
};

export default async function ProgressionPage() {
  const quizzes = await getAllQuizzes();
  return <ProgressionClient quizzes={quizzes} />;
}
