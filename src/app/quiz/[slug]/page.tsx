import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuizBySlug } from '@/lib/quizzes';
import { QuizPlayer } from './QuizPlayer';

export const dynamic = 'force-dynamic';

interface QuizPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) return { title: 'Quiz introuvable | ExamQuiz.ma' };

  return {
    title: `Quiz ${quiz.subject} : ${quiz.chapter_title} (${quiz.level.toUpperCase()}) | ExamQuiz.ma`,
    description: quiz.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) notFound();

  return <QuizPlayer quiz={quiz} />;
}
