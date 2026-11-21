'use client';

import type {
  AttemptHistoryItem,
  LevelId,
  ProgressStore,
  Quiz,
  QuizMode,
} from '@/types/quiz';

const STORAGE_KEY = 'taalim_quiz_progress_v1';

export function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function getDefaultStore(): ProgressStore {
  return {
    selectedLevel: '2bac',
    xp: 0,
    records: {},
    history: [],
    activeDays: [],
  };
}

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return getDefaultStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStore();
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    return {
      selectedLevel: parsed.selectedLevel || '2bac',
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      records: parsed.records || {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      activeDays: Array.isArray(parsed.activeDays) ? parsed.activeDays : [],
    };
  } catch {
    return getDefaultStore();
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

export function setSelectedLevel(level: LevelId): ProgressStore {
  const store = loadProgress();
  store.selectedLevel = level;
  saveProgress(store);
  return store;
}

export function recordAttempt(params: {
  quiz: Quiz;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  mode: QuizMode;
  wrongIndices: number[];
}): { store: ProgressStore; score20: number; xpEarned: number } {
  const store = loadProgress();
  const { quiz, correctCount, totalCount, durationSeconds, mode, wrongIndices } = params;
  const pct = Math.round((correctCount / Math.max(1, totalCount)) * 100);
  const score20 = Math.round((correctCount / Math.max(1, totalCount)) * 20 * 10) / 10;
  const today = todayIso();

  // Calcul des points XP (bonus en mode Examen)
  const xpEarned = correctCount * 15 + (mode === 'exam' ? 25 : 10) + (score20 >= 16 ? 20 : 0);
  store.xp += xpEarned;

  const prev = store.records[quiz.slug];
  store.records[quiz.slug] = {
    quizSlug: quiz.slug,
    level: quiz.level,
    subject: quiz.subject,
    chapterTitle: quiz.chapter_title,
    bestScore20: prev ? Math.max(prev.bestScore20, score20) : score20,
    lastScore20: score20,
    bestPct: prev ? Math.max(prev.bestPct, pct) : pct,
    attempts: prev ? prev.attempts + 1 : 1,
    lastDate: today,
    wrongIndices,
  };

  if (!store.activeDays.includes(today)) {
    store.activeDays.push(today);
  }

  const historyItem: AttemptHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    quizSlug: quiz.slug,
    level: quiz.level,
    subject: quiz.subject,
    chapterTitle: quiz.chapter_title,
    score20,
    correctCount,
    totalCount,
    durationSeconds,
    mode,
    date: today,
  };

  store.history = [historyItem, ...store.history].slice(0, 30);
  saveProgress(store);

  return { store, score20, xpEarned };
}

export function resetAllProgress(): ProgressStore {
  const empty = getDefaultStore();
  saveProgress(empty);
  return empty;
}

export function computeStreak(activeDays: string[]): number {
  if (!activeDays.length) return 0;
  const daySet = new Set(activeDays);
  let streak = 0;
  const cursor = new Date();
  const today = todayIso();

  if (!daySet.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(
      cursor.getDate()
    ).padStart(2, '0')}`;
    if (!daySet.has(iso)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function formatScore20(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return String(rounded).replace('.', ',');
}

export function formatDuration(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function getMentionMaroc(score20: number): { label: string; color: string } {
  if (score20 >= 16) return { label: 'Mention Très Bien', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score20 >= 14) return { label: 'Mention Bien', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (score20 >= 12) return { label: 'Mention Assez Bien', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  if (score20 >= 10) return { label: 'Passable — À consolider', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'À revoir en priorité', color: 'text-red-700 bg-red-50 border-red-200' };
}
