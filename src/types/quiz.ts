/**
 * Types partagés pour la plateforme Quiz Interactifs Examens Maroc
 */

export type LevelId = '2bac' | '1bac' | '3ac' | '6eme';

export type QuizDifficulty = 'Facile' | 'Moyen' | 'Examen';

export type QuizMode = 'training' | 'exam' | 'mistakes';

export interface QuizQuestion {
  id: string;
  question_text: string;
  options: [string, string, string, string] | string[];
  correct_index: number;
  explanation: string;
  exam_tip?: string;
}

export interface Quiz {
  id: string;
  slug: string;
  level: LevelId;
  branch: string;
  subject: string;
  chapter_title: string;
  description: string;
  exam_type: 'National' | 'Régional' | 'Local' | 'Provincial';
  difficulty: QuizDifficulty;
  estimated_minutes: number;
  questions: QuizQuestion[];
}

export interface LevelInfo {
  id: LevelId;
  label: string;
  shortLabel: string;
  examTitle: string;
  description: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export interface QuizProgressRecord {
  quizSlug: string;
  level: LevelId;
  subject: string;
  chapterTitle: string;
  bestScore20: number;
  lastScore20: number;
  bestPct: number;
  attempts: number;
  lastDate: string; // YYYY-MM-DD
  wrongIndices: number[];
}

export interface AttemptHistoryItem {
  id: string;
  quizSlug: string;
  level: LevelId;
  subject: string;
  chapterTitle: string;
  score20: number;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  mode: QuizMode;
  date: string; // YYYY-MM-DD
}

export interface ProgressStore {
  selectedLevel: LevelId;
  xp: number;
  records: Record<string, QuizProgressRecord>;
  history: AttemptHistoryItem[];
  activeDays: string[];
}

export const LEVELS: LevelInfo[] = [
  {
    id: '2bac',
    label: '2ème Bac',
    shortLabel: '2Bac',
    examTitle: 'Examen National',
    description: 'Sciences PC, SVT, SM, Éco & Lettres — Maths, PC, SVT, Philo, Anglais.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    accentBorder: 'border-indigo-200',
  },
  {
    id: '1bac',
    label: '1ère Bac',
    shortLabel: '1Bac',
    examTitle: 'Examen Régional',
    description: 'Français (œuvres intégrales), Histoire-Géo, Éducation Islamique.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200',
  },
  {
    id: '3ac',
    label: '3ème Année Collège',
    shortLabel: '3AC',
    examTitle: 'Brevet / Régional',
    description: 'Parcours BIOF & Général — Maths, Physique-Chimie, SVT.',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
  },
  {
    id: '6eme',
    label: '6ème Primaire',
    shortLabel: '6ème',
    examTitle: 'Examen Provincial',
    description: 'Certificat d’études primaires — Maths, Français, Activité Scientifique.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-200',
  },
];

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'Mathématiques': { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-600' },
  'Physique-Chimie': { bg: 'bg-cyan-50', text: 'text-cyan-700', bar: 'bg-cyan-600' },
  'SVT': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-600' },
  'Français': { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
  'Philosophie': { bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-600' },
  'Anglais': { bg: 'bg-rose-50', text: 'text-rose-700', bar: 'bg-rose-600' },
  'Histoire-Géographie': { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500' },
  'Éducation Islamique': { bg: 'bg-teal-50', text: 'text-teal-700', bar: 'bg-teal-600' },
  'Activité Scientifique': { bg: 'bg-lime-50', text: 'text-lime-700', bar: 'bg-lime-600' },
};

export function getSubjectStyle(subject: string) {
  return (
    SUBJECT_COLORS[subject] || {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      bar: 'bg-slate-600',
    }
  );
}
