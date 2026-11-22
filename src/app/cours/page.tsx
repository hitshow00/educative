import type { Metadata } from 'next';
import { CoursesClient } from '@/components/CoursesClient';

export const metadata: Metadata = {
  title: 'Résumés de Cours & Formules (2Bac, 1Bac, 3AC, 6ème) | ExamQuiz.ma',
  description:
    'Fiches de révision complètes, formules clés, exemples résolus et pièges d’examens pour les élèves au Maroc.',
};

export default function CoursesPage() {
  return <CoursesClient />;
}
