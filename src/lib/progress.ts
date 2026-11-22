'use client';

import {
  getStarsForScore,
  type AttemptHistoryItem,
  type LeaderboardEntry,
  type LevelId,
  type ProgressStore,
  type Quiz,
  type QuizMode,
} from '@/types/quiz';

const STORAGE_KEY = 'taalim_quiz_progress_v2';

export function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function getDefaultStore(): ProgressStore {
  return {
    selectedLevel: '2bac',
    profile: {
      pseudo: 'Élève Maroc',
      city: 'Casablanca',
    },
    soundEnabled: true,
    freeAccess: false,
    xp: 0,
    bestComboEver: 0,
    dailyChallengeDoneDate: null,
    records: {},
    history: [],
    activeDays: [],
  };
}

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return getDefaultStore();
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem('taalim_quiz_progress_v1');
    if (!raw) return getDefaultStore();
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    const def = getDefaultStore();
    return {
      selectedLevel: parsed.selectedLevel || def.selectedLevel,
      profile: {
        pseudo: parsed.profile?.pseudo || def.profile.pseudo,
        city: parsed.profile?.city || def.profile.city,
      },
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      freeAccess: Boolean(parsed.freeAccess),
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      bestComboEver: typeof parsed.bestComboEver === 'number' ? parsed.bestComboEver : 0,
      dailyChallengeDoneDate: parsed.dailyChallengeDoneDate || null,
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
    window.dispatchEvent(new Event('examquiz-progress'));
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

export function updateStudentProfile(pseudo: string, city: string): ProgressStore {
  const store = loadProgress();
  store.profile = {
    pseudo: pseudo.trim().slice(0, 22) || 'Élève Maroc',
    city: city.trim() || 'Casablanca',
  };
  saveProgress(store);
  return store;
}

export function toggleSoundEnabled(): ProgressStore {
  const store = loadProgress();
  store.soundEnabled = !store.soundEnabled;
  saveProgress(store);
  return store;
}

export function toggleFreeAccess(): ProgressStore {
  const store = loadProgress();
  store.freeAccess = !store.freeAccess;
  saveProgress(store);
  return store;
}

const MISSIONS_KEY = 'taalim_daily_missions_v1';

export interface DailyMissionsState {
  date: string;
  summaryRead: boolean;
  flashcardsDone: boolean;
}

export function loadDailyMissions(): DailyMissionsState {
  const today = todayIso();
  if (typeof window === 'undefined') {
    return { date: today, summaryRead: false, flashcardsDone: false };
  }
  try {
    const raw = window.localStorage.getItem(MISSIONS_KEY);
    if (!raw) return { date: today, summaryRead: false, flashcardsDone: false };
    const parsed = JSON.parse(raw) as DailyMissionsState;
    if (parsed.date !== today) {
      return { date: today, summaryRead: false, flashcardsDone: false };
    }
    return parsed;
  } catch {
    return { date: today, summaryRead: false, flashcardsDone: false };
  }
}

export function markMissionSummaryRead(): { awardedXp: number } {
  if (typeof window === 'undefined') return { awardedXp: 0 };
  const missions = loadDailyMissions();
  if (missions.summaryRead) return { awardedXp: 0 };

  missions.summaryRead = true;
  window.localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));

  const store = loadProgress();
  store.xp += 30;
  const today = todayIso();
  if (!store.activeDays.includes(today)) store.activeDays.push(today);
  saveProgress(store);
  return { awardedXp: 30 };
}

export function markMissionFlashcardsDone(): { awardedXp: number } {
  if (typeof window === 'undefined') return { awardedXp: 0 };
  const missions = loadDailyMissions();
  if (missions.flashcardsDone) return { awardedXp: 0 };

  missions.flashcardsDone = true;
  window.localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));

  const store = loadProgress();
  store.xp += 40;
  const today = todayIso();
  if (!store.activeDays.includes(today)) store.activeDays.push(today);
  saveProgress(store);
  return { awardedXp: 40 };
}

/**
 * Calcule le nombre de jours restants jusqu'à la prochaine session officielle des examens de Juin au Maroc.
 */
export function getDaysUntilMoroccanExam(level: LevelId): { days: number; targetLabelFr: string; targetLabelAr: string } {
  const now = new Date();
  const examDay = level === '2bac' ? 10 : level === '1bac' ? 4 : level === '3ac' ? 16 : 22;
  let year = now.getFullYear();
  let target = new Date(year, 5, examDay); // Mois 5 = Juin
  if (target.getTime() < now.getTime()) {
    year += 1;
    target = new Date(year, 5, examDay);
  }
  const diffMs = target.getTime() - now.getTime();
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    days,
    targetLabelFr: `Juin ${year}`,
    targetLabelAr: `يونيو ${year}`,
  };
}

export function recordAttempt(params: {
  quiz: Quiz;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  mode: QuizMode;
  wrongIndices: number[];
  bestCombo: number;
}): {
  store: ProgressStore;
  score20: number;
  stars: number;
  xpEarned: number;
  dailyBonusEarned: boolean;
  unlockedNext: boolean;
} {
  const store = loadProgress();
  const { quiz, correctCount, totalCount, durationSeconds, mode, wrongIndices, bestCombo } =
    params;
  const pct = Math.round((correctCount / Math.max(1, totalCount)) * 100);
  const score20 = Math.round((correctCount / Math.max(1, totalCount)) * 20 * 10) / 10;
  const stars = getStarsForScore(score20);
  const today = todayIso();

  // Multiplicateur selon difficulté et combo
  const stageMultiplier = quiz.stage_number >= 7 ? 1.5 : quiz.stage_number >= 4 ? 1.2 : 1;
  const comboBonus = bestCombo >= 3 ? bestCombo * 8 : 0;
  let xpEarned = Math.round(
    (correctCount * 15 + (mode === 'exam' ? 30 : 10) + (score20 >= 16 ? 25 : 0)) *
      stageMultiplier +
      comboBonus
  );

  // Défi du jour : obtenir >= 14/20 sur un quiz aujourd'hui (+100 XP)
  let dailyBonusEarned = false;
  if (store.dailyChallengeDoneDate !== today && score20 >= 14) {
    store.dailyChallengeDoneDate = today;
    xpEarned += 100;
    dailyBonusEarned = true;
  }

  store.xp += xpEarned;
  if (bestCombo > store.bestComboEver) {
    store.bestComboEver = bestCombo;
  }

  const prev = store.records[quiz.slug];
  const wasPassed = Boolean(prev && prev.bestScore20 >= 10);
  const nowPassed = score20 >= 10;
  const unlockedNext = !wasPassed && nowPassed && quiz.stage_number < 10;

  store.records[quiz.slug] = {
    quizSlug: quiz.slug,
    level: quiz.level,
    subject: quiz.subject,
    chapterTitle: quiz.chapter_title,
    stageNumber: quiz.stage_number,
    bestScore20: prev ? Math.max(prev.bestScore20, score20) : score20,
    lastScore20: score20,
    bestPct: prev ? Math.max(prev.bestPct, pct) : pct,
    stars: prev ? Math.max(prev.stars || 0, stars) : stars,
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
    stageNumber: quiz.stage_number,
    score20,
    correctCount,
    totalCount,
    durationSeconds,
    mode,
    date: today,
  };

  store.history = [historyItem, ...store.history].slice(0, 40);
  saveProgress(store);

  return { store, score20, stars, xpEarned, dailyBonusEarned, unlockedNext };
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
  if (score20 >= 16)
    return {
      label: 'Mention Très Bien',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  if (score20 >= 14)
    return { label: 'Mention Bien', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (score20 >= 12)
    return {
      label: 'Mention Assez Bien',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    };
  if (score20 >= 10)
    return {
      label: 'Passable — Niveau débloqué',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  return {
    label: 'À revoir (< 10/20)',
    color: 'text-red-700 bg-red-50 border-red-200',
  };
}

export interface StudentBadge {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  unlocked: boolean;
}

export function getStudentBadges(store: ProgressStore): StudentBadge[] {
  const records = Object.values(store.records);
  const hasPerfect = records.some((r) => r.bestScore20 === 20);
  const hasBoss = records.some((r) => r.stageNumber === 10 && r.bestScore20 >= 12);
  const streak = computeStreak(store.activeDays);
  const totalStars = records.reduce((s, r) => s + (r.stars || 0), 0);

  return [
    {
      id: 'first-win',
      title: 'Premier Pas',
      desc: 'Terminer ton premier niveau',
      emoji: '🚀',
      unlocked: records.length >= 1,
    },
    {
      id: 'perfect-20',
      title: 'Sans Faute 20/20',
      desc: 'Obtenir 20/20 sur un quiz',
      emoji: '🎯',
      unlocked: hasPerfect,
    },
    {
      id: 'combo-3',
      title: 'En Feu (Combo x3)',
      desc: 'Enchaîner 3 bonnes réponses',
      emoji: '🔥',
      unlocked: store.bestComboEver >= 3,
    },
    {
      id: 'stars-15',
      title: 'Chasseur d’Étoiles',
      desc: 'Cumuler 15 étoiles ou plus',
      emoji: '⭐',
      unlocked: totalStars >= 15,
    },
    {
      id: 'streak-3',
      title: 'Régularité 3 Jours',
      desc: 'Réviser 3 jours d’affilée',
      emoji: '📅',
      unlocked: streak >= 3,
    },
    {
      id: 'boss-10',
      title: 'Vainqueur du Boss',
      desc: 'Réussir un Niveau 10 (≥ 12/20)',
      emoji: '🏆',
      unlocked: hasBoss,
    },
  ];
}

/**
 * Adversaires communautaires réalistes par niveau pour animer le classement
 * dès la première visite (fusionnés avec le classement réel Supabase si actif).
 */
const COMMUNITY_RIVALS: LeaderboardEntry[] = [
  { id: 'r1', pseudo: 'Salma_2Bac', city: 'Rabat', level: '2bac', xp: 2450, streak: 12, avg20: 17.8 },
  { id: 'r2', pseudo: 'Youssef_SM', city: 'Casablanca', level: '2bac', xp: 1890, streak: 9, avg20: 16.5 },
  { id: 'r3', pseudo: 'Aya_SVT', city: 'Marrakech', level: '2bac', xp: 1340, streak: 7, avg20: 15.9 },
  { id: 'r4', pseudo: 'Mehdi_PC', city: 'Tanger', level: '2bac', xp: 920, streak: 5, avg20: 14.8 },
  { id: 'r5', pseudo: 'Hiba_Fes', city: 'Fès', level: '2bac', xp: 510, streak: 4, avg20: 13.7 },
  { id: 'r6', pseudo: 'Omar_Agadir', city: 'Agadir', level: '2bac', xp: 240, streak: 2, avg20: 12.4 },
  { id: 'r7', pseudo: 'Lina_Regio', city: 'Casablanca', level: '1bac', xp: 1620, streak: 8, avg20: 17.2 },
  { id: 'r8', pseudo: 'Amine_1Bac', city: 'Rabat', level: '1bac', xp: 1120, streak: 6, avg20: 15.4 },
  { id: 'r9', pseudo: 'Kenza_Meknes', city: 'Meknès', level: '1bac', xp: 640, streak: 4, avg20: 14.2 },
  { id: 'r10', pseudo: 'Ilyas_3AC', city: 'Tétouan', level: '3ac', xp: 1480, streak: 10, avg20: 17.0 },
  { id: 'r11', pseudo: 'Nour_BIOF', city: 'Kénitra', level: '3ac', xp: 880, streak: 5, avg20: 15.1 },
  { id: 'r12', pseudo: 'Adam_Brevet', city: 'Oujda', level: '3ac', xp: 390, streak: 3, avg20: 13.5 },
  { id: 'r13', pseudo: 'Ines_6eme', city: 'Rabat', level: '6eme', xp: 980, streak: 6, avg20: 17.5 },
  { id: 'r14', pseudo: 'Rayan_Casa', city: 'Casablanca', level: '6eme', xp: 520, streak: 3, avg20: 15.0 },
];

export function buildLeaderboard(
  store: ProgressStore,
  filterLevel: LevelId | 'ALL'
): { entries: LeaderboardEntry[]; userRank: number; xpToNext: number | null; nextRivalName: string | null } {
  const userRecords = Object.values(store.records);
  const userAvg =
    userRecords.length > 0
      ? Math.round(
          (userRecords.reduce((sum, r) => sum + r.bestScore20, 0) / userRecords.length) * 10
        ) / 10
      : 0;

  const currentUserEntry: LeaderboardEntry = {
    id: 'current-user',
    pseudo: store.profile.pseudo || 'Toi',
    city: store.profile.city || 'Casablanca',
    level: store.selectedLevel,
    xp: store.xp,
    streak: computeStreak(store.activeDays),
    avg20: userAvg,
    isCurrentUser: true,
  };

  const rivals =
    filterLevel === 'ALL'
      ? COMMUNITY_RIVALS
      : COMMUNITY_RIVALS.filter((r) => r.level === filterLevel);

  const includeUser = filterLevel === 'ALL' || filterLevel === store.selectedLevel;
  const combined = includeUser ? [...rivals, currentUserEntry] : [...rivals];

  combined.sort((a, b) => b.xp - a.xp || b.avg20 - a.avg20);

  const idx = combined.findIndex((e) => e.isCurrentUser);
  const userRank = idx >= 0 ? idx + 1 : 0;
  const above = idx > 0 ? combined[idx - 1] : null;

  return {
    entries: combined,
    userRank,
    xpToNext: above ? Math.max(1, above.xp - store.xp + 1) : null,
    nextRivalName: above ? above.pseudo : null,
  };
}
