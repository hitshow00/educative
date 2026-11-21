import type { Metadata } from 'next';
import { getAllQuizzes } from '@/lib/quizzes';
import { ReviewClient } from '@/components/ReviewClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'À revoir en priorité | ExamQuiz.ma',
  description: 'Révisez en priorité les chapitres où votre note est inférieure à 12/20.',
};

export default async function ReviewPage() {
  const quizzes = await getAllQuizzes();
  return <ReviewClient quizzes={quizzes} />;
}
