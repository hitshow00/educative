import type { Metadata } from 'next';
import { LeaderboardClient } from '@/components/LeaderboardClient';

export const metadata: Metadata = {
  title: 'Classement & Ligues | ExamQuiz.ma',
  description:
    'Compare ton score XP avec les élèves du Maroc, débloque des badges et monte en Ligue Major de Promo.',
};

export default function ClassementPage() {
  return <LeaderboardClient />;
}
