import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNextStageQuiz, getQuizBySlug } from '@/lib/quizzes';
import { getStudyPackForQuiz } from '@/data/study-content';
import { LessonHub } from '@/components/LessonHub';

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
    title: `Niveau ${quiz.stage_number} — ${quiz.subject} : ${quiz.chapter_title} | ExamQuiz.ma`,
    description: quiz.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) notFound();

  const nextStage = await getNextStageQuiz(quiz);
  const studyPack = getStudyPackForQuiz(quiz);

  return <LessonHub quiz={quiz} nextStage={nextStage} studyPack={studyPack} />;
}
