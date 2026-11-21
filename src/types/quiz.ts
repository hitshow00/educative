/**
 * Types partagés — ExamQuiz.ma (Parcours 10 Niveaux + Compétition & Ligues)
 */

export type LevelId = '2bac' | '1bac' | '3ac' | '6eme';

export type QuizDifficulty = 'Facile' | 'Moyen' | 'Difficile' | 'Boss Examen';

export type QuizMode = 'training' | 'exam' | 'mistakes';

export interface QuizQuestion {
  id: string;
  question_text: string;
  options: [string, string, string, string] | string[];
  correct_index: number;
  explanation: string;
  exam_tip?: string;
  /** Source officielle (ex: "National 2023 • Normale") */
  exam_source?: string;
}

export interface Quiz {
  id: string;
  slug: string;
  level: LevelId;
  branch: string;
  subject: string;
  /** Numéro d'étape dans la matière (1 à 10 : du plus simple au Boss Examen) */
  stage_number: number;
  chapter_title: string;
  description: string;
  exam_type: 'National' | 'Régional' | 'Local' | 'Provincial';
  difficulty: QuizDifficulty;
  estimated_minutes: number;
  exam_source?: string;
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

export interface StudentProfile {
  pseudo: string;
  city: string;
}

export interface QuizProgressRecord {
  quizSlug: string;
  level: LevelId;
  subject: string;
  chapterTitle: string;
  stageNumber: number;
  bestScore20: number;
  lastScore20: number;
  bestPct: number;
  stars: number; // 0 à 3
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
  stageNumber: number;
  score20: number;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  mode: QuizMode;
  date: string;
}

export interface ProgressStore {
  selectedLevel: LevelId;
  profile: StudentProfile;
  soundEnabled: boolean;
  freeAccess: boolean;
  xp: number;
  bestComboEver: number;
  dailyChallengeDoneDate: string | null;
  records: Record<string, QuizProgressRecord>;
  history: AttemptHistoryItem[];
  activeDays: string[];
}

export interface LeagueInfo {
  id: string;
  name: string;
  minXp: number;
  nextXp: number | null;
  colorClass: string;
  badgeBg: string;
  emoji: string;
}

export interface LeaderboardEntry {
  id: string;
  pseudo: string;
  city: string;
  level: LevelId;
  xp: number;
  streak: number;
  avg20: number;
  isCurrentUser?: boolean;
}

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Mohammédia',
  'El Jadida',
  'Béni Mellal',
  'Nador',
  'Safi',
] as const;

export const LEAGUES: LeagueInfo[] = [
  {
    id: 'bronze',
    name: 'Ligue Bronze',
    minXp: 0,
    nextXp: 300,
    colorClass: 'text-amber-800',
    badgeBg: 'bg-amber-50 border-amber-200',
    emoji: '🥉',
  },
  {
    id: 'argent',
    name: 'Ligue Argent',
    minXp: 300,
    nextXp: 800,
    colorClass: 'text-slate-700',
    badgeBg: 'bg-slate-100 border-slate-300',
    emoji: '🥈',
  },
  {
    id: 'or',
    name: 'Ligue Or',
    minXp: 800,
    nextXp: 1600,
    colorClass: 'text-yellow-700',
    badgeBg: 'bg-yellow-50 border-yellow-300',
    emoji: '🥇',
  },
  {
    id: 'platine',
    name: 'Ligue Platine',
    minXp: 1600,
    nextXp: 3000,
    colorClass: 'text-cyan-700',
    badgeBg: 'bg-cyan-50 border-cyan-300',
    emoji: '💎',
  },
  {
    id: 'diamant',
    name: 'Major de Promo',
    minXp: 3000,
    nextXp: null,
    colorClass: 'text-indigo-700',
    badgeBg: 'bg-indigo-50 border-indigo-300',
    emoji: '👑',
  },
];

export function getLeagueForXp(xp: number): LeagueInfo {
  let current = LEAGUES[0];
  for (const league of LEAGUES) {
    if (xp >= league.minXp) current = league;
  }
  return current;
}

export function getStarsForScore(score20: number): number {
  if (score20 >= 18) return 3;
  if (score20 >= 14) return 2;
  if (score20 >= 10) return 1;
  return 0;
}

export const LEVELS: LevelInfo[] = [
  {
    id: '2bac',
    label: '2ème Bac',
    shortLabel: '2Bac',
    examTitle: 'Examen National',
    description: 'Parcours 10 niveaux (Bases → Annales Nationales 2018-2025 → Boss).',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    accentBorder: 'border-indigo-200',
  },
  {
    id: '1bac',
    label: '1ère Bac',
    shortLabel: '1Bac',
    examTitle: 'Examen Régional',
    description: '10 niveaux par matière : Français (œuvres), Histoire-Géo, Éd. Islamique.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200',
  },
  {
    id: '3ac',
    label: '3ème Année Collège',
    shortLabel: '3AC',
    examTitle: 'Brevet / Régional',
    description: '10 niveaux progressifs BIOF : Maths, Physique-Chimie, SVT.',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
  },
  {
    id: '6eme',
    label: '6ème Primaire',
    shortLabel: '6ème',
    examTitle: 'Examen Provincial',
    description: '10 niveaux progressifs : Maths, Français & Activité Scientifique.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-200',
  },
];

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; bar: string; ring: string }> = {
  'Mathématiques': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
    ring: 'ring-indigo-500',
  },
  'Physique-Chimie': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    bar: 'bg-cyan-600',
    ring: 'ring-cyan-500',
  },
  'SVT': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
    ring: 'ring-emerald-500',
  },
  'Français': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    ring: 'ring-amber-500',
  },
  'Histoire-Géographie': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    bar: 'bg-orange-500',
    ring: 'ring-orange-500',
  },
  'Éducation Islamique': {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    bar: 'bg-teal-600',
    ring: 'ring-teal-500',
  },
  'Activité Scientifique': {
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    bar: 'bg-lime-600',
    ring: 'ring-lime-500',
  },
};

export function getSubjectStyle(subject: string) {
  return (
    SUBJECT_COLORS[subject] || {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      bar: 'bg-slate-600',
      ring: 'ring-slate-500',
    }
  );
}
