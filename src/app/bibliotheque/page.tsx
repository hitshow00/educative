import type { Metadata } from 'next';
import { LibraryClient } from '@/components/LibraryClient';

export const metadata: Metadata = {
  title: 'Bibliothèque Officielle (12 659 Cours, Exercices & Examens PDF) | ExamQuiz.ma',
  description:
    'Accédez gratuitement aux cours, résumés, exercices, contrôles et examens officiels marocains (2ème Bac, 1ère Bac, 3ème Collège, 6ème Primaire).',
};

export default function LibraryPage() {
  return <LibraryClient />;
}
