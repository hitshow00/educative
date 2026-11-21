import { getAllQuizzes } from '@/lib/quizzes';
import { HomeClient } from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const quizzes = await getAllQuizzes();
  return <HomeClient quizzes={quizzes} />;
}
