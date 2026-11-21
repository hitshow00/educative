'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Crown,
  Flame,
  Lock,
  Play,
  Sparkles,
  Star,
  Trophy,
  Unlock,
} from 'lucide-react';
import {
  LEVELS,
  getLeagueForXp,
  getSubjectStyle,
  type LevelId,
  type ProgressStore,
  type Quiz,
} from '@/types/quiz';
import {
  buildLeaderboard,
  computeStreak,
  formatScore20,
  getDefaultStore,
  loadProgress,
  setSelectedLevel,
  todayIso,
  toggleFreeAccess,
} from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import {
  LEVEL_AR,
  translateDifficulty,
  translateLeague,
  translateSubject,
} from '@/lib/i18n';
import { getLocalizedStage } from '@/lib/stage-translations-ar';

interface HomeClientProps {
  quizzes: Quiz[];
}

export function HomeClient({ quizzes }: HomeClientProps) {
  const { lang, t } = useLanguage();
  const [store, setStore] = useState<ProgressStore>(getDefaultStore);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const sync = () => setStore(loadProgress());
    sync();
    window.addEventListener('examquiz-progress', sync);
    return () => window.removeEventListener('examquiz-progress', sync);
  }, []);

  const activeLevelInfo = useMemo(
    () => LEVELS.find((l) => l.id === store.selectedLevel) || LEVELS[0],
    [store.selectedLevel]
  );

  const activeLevelLabel =
    lang === 'ar' ? LEVEL_AR[activeLevelInfo.id].label : activeLevelInfo.label;
  const activeLevelShort =
    lang === 'ar' ? LEVEL_AR[activeLevelInfo.id].shortLabel : activeLevelInfo.shortLabel;

  const levelQuizzes = useMemo(
    () => quizzes.filter((q) => q.level === store.selectedLevel),
    [quizzes, store.selectedLevel]
  );

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const q of levelQuizzes) set.add(q.subject);
    return Array.from(set);
  }, [levelQuizzes]);

  const activeSubject = useMemo(() => {
    if (selectedSubject && subjects.includes(selectedSubject)) return selectedSubject;
    return subjects[0] || '';
  }, [selectedSubject, subjects]);

  const trackStages = useMemo(
    () =>
      levelQuizzes
        .filter((q) => q.subject === activeSubject)
        .sort((a, b) => a.stage_number - b.stage_number),
    [levelQuizzes, activeSubject]
  );

  const trackStats = useMemo(() => {
    let earnedStars = 0;
    let passedCount = 0;
    for (const stage of trackStages) {
      const rec = store.records[stage.slug];
      if (rec) {
        earnedStars += rec.stars || 0;
        if (rec.bestScore20 >= 10) passedCount += 1;
      }
    }
    return {
      earnedStars,
      maxStars: trackStages.length * 3,
      passedCount,
      total: trackStages.length,
    };
  }, [trackStages, store.records]);

  const league = useMemo(() => getLeagueForXp(store.xp), [store.xp]);
  const rankInfo = useMemo(
    () => buildLeaderboard(store, store.selectedLevel),
    [store]
  );
  const dailyDone = store.dailyChallengeDoneDate === todayIso();
  const streak = computeStreak(store.activeDays);

  function handleLevelSwitch(level: LevelId) {
    setStore(setSelectedLevel(level));
    setSelectedSubject('');
  }

  function handleFreeAccessToggle() {
    setStore(toggleFreeAccess());
  }

  function isStageUnlocked(stageIndex: number): boolean {
    if (store.freeAccess || stageIndex === 0) return true;
    const prevStage = trackStages[stageIndex - 1];
    if (!prevStage) return true;
    const prevRec = store.records[prevStage.slug];
    return Boolean(prevRec && prevRec.bestScore20 >= 10);
  }

  const nextRecommendedStage = useMemo(() => {
    for (let i = 0; i < trackStages.length; i++) {
      const rec = store.records[trackStages[i].slug];
      if (!rec || rec.bestScore20 < 10) {
        return trackStages[i];
      }
    }
    return trackStages[trackStages.length - 1] || null;
  }, [trackStages, store.records]);

  const subjectStyle = getSubjectStyle(activeSubject);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-7">
      {/* BANDEAU COMPÉTITION & DÉFI DU JOUR */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Carte Ligue & Classement */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${league.badgeBg} ${league.colorClass}`}
              >
                <span>{league.emoji}</span>
                <span>{translateLeague(league.id, league.name, lang)}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700">
                <Flame className="w-3.5 h-3.5" />
                {streak} {streak > 1 ? t.daysLabel : t.dayLabel}
              </span>
            </div>

            <Link
              href="/classement"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {t.rankLabel} #{rankInfo.userRank} ({activeLevelShort})
              </span>
            </Link>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {rankInfo.xpToNext && rankInfo.nextRivalName ? (
                <>
                  {t.heroMoreXpBefore}{' '}
                  <strong className="text-indigo-700" dir="ltr">
                    +{rankInfo.xpToNext} XP
                  </strong>{' '}
                  {t.heroMoreXpMiddle} <strong>{rankInfo.nextRivalName}</strong>{' '}
                  {t.heroMoreXpAfter} {activeLevelShort} !
                </>
              ) : (
                <>{t.heroTopRank}</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {nextRecommendedStage && (
              <Link
                href={`/quiz/${nextRecommendedStage.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {t.playLevel} {nextRecommendedStage.stage_number} (
                  {translateSubject(activeSubject, lang)})
                </span>
              </Link>
            )}
            <Link
              href="/classement"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{t.seeLeaderboard}</span>
            </Link>
          </div>
        </div>

        {/* Carte Défi du Jour */}
        <div
          className={`rounded-2xl border p-5 flex flex-col justify-between gap-3 ${
            dailyDone
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-indigo-50/60 border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-extrabold uppercase tracking-wider ${
                dailyDone ? 'text-emerald-700' : 'text-indigo-700'
              }`}
            >
              {t.dailyChallenge}
            </span>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-indigo-700 border border-indigo-200"
            >
              <Sparkles className="w-3 h-3" />
              +100 XP
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              {dailyDone ? t.dailyDoneTitle : t.dailyTodoTitle}
            </p>
            <p className="text-xs text-slate-600">
              {dailyDone ? t.dailyDoneDesc : t.dailyTodoDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            {dailyDone ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                {t.dailyDoneBadge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-indigo-700">
                <Award className="w-4 h-4" />
                {t.dailyTodoBadge}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 1. SÉLECTEUR DES 4 NIVEAUX SCOLAIRES */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.step1Title}
          </h2>
          <span className="text-xs text-slate-500">{t.officialSources}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {LEVELS.map((lvl) => {
            const isSelected = store.selectedLevel === lvl.id;
            const lvlLabel = lang === 'ar' ? LEVEL_AR[lvl.id].label : lvl.label;
            const lvlExam = lang === 'ar' ? LEVEL_AR[lvl.id].examTitle : lvl.examTitle;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleLevelSwitch(lvl.id)}
                className={`text-start rounded-2xl p-3.5 sm:p-4 border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
              >
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                    isSelected
                      ? 'bg-white/15 text-white'
                      : `${lvl.accentBg} ${lvl.accentText}`
                  }`}
                >
                  {lvlExam}
                </span>
                <p className="text-sm sm:text-base font-extrabold">{lvlLabel}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. PARCOURS INTERACTIF 10 NIVEAUX PAR MATIÈRE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {subjects.map((subject) => {
              const active = subject === activeSubject;
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold border transition-all ${
                    active
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {translateSubject(subject, lang)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              {trackStats.earnedStars} / {trackStats.maxStars} {t.starsLabel}
            </span>

            <button
              type="button"
              onClick={handleFreeAccessToggle}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                store.freeAccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {store.freeAccess ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{store.freeAccess ? t.freeAccessOn : t.unlockAll}</span>
            </button>
          </div>
        </div>

        {/* Barre d'avancement du parcours */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
            <span>
              {translateSubject(activeSubject, lang)} ({activeLevelLabel}) — {t.trackSubtitle}
            </span>
            <span className="font-bold text-slate-900">
              {trackStats.passedCount} / {trackStats.total} {t.validatedLabel}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${subjectStyle.bar}`}
              style={{
                width: `${
                  trackStats.total > 0
                    ? Math.round((trackStats.passedCount / trackStats.total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* GRILLE INTERACTIVE DES 10 NIVEAUX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {trackStages.map((stage, idx) => {
            const unlocked = isStageUnlocked(idx);
            const rec = store.records[stage.slug];
            const isBoss = stage.stage_number === 10;
            const isCurrent = nextRecommendedStage?.slug === stage.slug;
            const stars = rec?.stars || 0;

            const loc = getLocalizedStage(
              stage.slug,
              {
                title: stage.chapter_title,
                desc: stage.description,
                source: stage.exam_source,
              },
              lang
            );

            const diffPill =
              stage.difficulty === 'Facile'
                ? 'bg-emerald-50 text-emerald-700'
                : stage.difficulty === 'Moyen'
                ? 'bg-blue-50 text-blue-700'
                : stage.difficulty === 'Difficile'
                ? 'bg-orange-50 text-orange-700'
                : 'bg-slate-900 text-amber-300';

            return (
              <div
                key={stage.slug}
                className={`relative rounded-2xl border p-4 flex flex-col justify-between gap-3.5 transition-all ${
                  !unlocked
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : isBoss
                    ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-slate-800 text-white'
                    : isCurrent
                    ? `bg-white border-indigo-400 ring-2 ${subjectStyle.ring}/20 shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                          isBoss
                            ? 'bg-amber-400 text-slate-950'
                            : unlocked
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isBoss ? <Crown className="w-4 h-4" /> : stage.stage_number}
                      </span>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${diffPill}`}>
                        {t.levelPrefix} {stage.stage_number} •{' '}
                        {translateDifficulty(stage.difficulty, lang)}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= stars
                              ? 'fill-amber-400 text-amber-400'
                              : isBoss
                              ? 'text-slate-700'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug ${
                      isBoss ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {loc.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed ${
                      isBoss ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {loc.desc}
                  </p>

                  {loc.source && (
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isBoss
                          ? 'bg-white/10 text-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    >
                      📄 {loc.source}
                    </span>
                  )}
                </div>

                <div
                  className={`pt-3 border-t flex items-center justify-between gap-2 ${
                    isBoss ? 'border-white/10' : 'border-slate-100'
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isBoss ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {rec ? (
                      <>
                        {t.recordLabel} :{' '}
                        <strong
                          dir="ltr"
                          className={isBoss ? 'text-amber-300' : 'text-slate-900'}
                        >
                          {formatScore20(rec.bestScore20)}/20
                        </strong>
                      </>
                    ) : (
                      `${stage.questions.length} QCM • ~${stage.estimated_minutes} min`
                    )}
                  </span>

                  {unlocked ? (
                    <Link
                      href={`/quiz/${stage.slug}`}
                      className={`inline-flex items-center gap-1.5 rounded-xl text-xs font-bold px-3.5 py-2 transition-colors ${
                        isBoss
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                          : isCurrent
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-slate-900 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      <span>{rec ? t.improveBtn : isBoss ? t.bossBtn : t.playBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-slate-200/80 text-slate-500 text-xs font-semibold px-3 py-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {t.validatePrev} {stage.stage_number - 1}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
