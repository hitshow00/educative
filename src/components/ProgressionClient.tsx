'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import {
  LEVELS,
  getSubjectStyle,
  type LevelId,
  type ProgressStore,
  type Quiz,
} from '@/types/quiz';
import {
  computeStreak,
  formatDuration,
  formatScore20,
  getDefaultStore,
  loadProgress,
  resetAllProgress,
  setSelectedLevel,
} from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import { LEVEL_AR, translateSubject } from '@/lib/i18n';
import { getLocalizedStage } from '@/lib/stage-translations-ar';

interface ProgressionClientProps {
  quizzes: Quiz[];
}

export function ProgressionClient({ quizzes }: ProgressionClientProps) {
  const { lang, t } = useLanguage();
  const [store, setStore] = useState<ProgressStore>(getDefaultStore);

  useEffect(() => {
    setStore(loadProgress());
  }, []);

  const activeLevelInfo = useMemo(
    () => LEVELS.find((l) => l.id === store.selectedLevel) || LEVELS[0],
    [store.selectedLevel]
  );

  const levelQuizzes = useMemo(
    () => quizzes.filter((q) => q.level === store.selectedLevel),
    [quizzes, store.selectedLevel]
  );

  const stats = useMemo(() => {
    let completed = 0;
    let sum20 = 0;
    let priority = 0;

    const bySubject = new Map<
      string,
      { total: number; done: number; sum20: number }
    >();

    for (const q of levelQuizzes) {
      const entry = bySubject.get(q.subject) || { total: 0, done: 0, sum20: 0 };
      entry.total += 1;

      const rec = store.records[q.slug];
      if (rec) {
        completed += 1;
        sum20 += rec.bestScore20;
        entry.done += 1;
        entry.sum20 += rec.bestScore20;
        if (rec.bestScore20 < 12) priority += 1;
      } else {
        priority += 1;
      }

      bySubject.set(q.subject, entry);
    }

    const avg20 = completed > 0 ? sum20 / completed : null;
    const streak = computeStreak(store.activeDays);
    const subjectBreakdown = Array.from(bySubject.entries()).map(([subject, data]) => ({
      subject,
      total: data.total,
      done: data.done,
      masteryPct: data.total > 0 ? Math.round((data.sum20 / (data.total * 20)) * 100) : 0,
      avg20: data.done > 0 ? data.sum20 / data.done : null,
    }));

    const recentHistory = store.history
      .filter((h) => h.level === store.selectedLevel)
      .slice(0, 8);

    return {
      completed,
      total: levelQuizzes.length,
      avg20,
      priority,
      streak,
      subjectBreakdown,
      recentHistory,
    };
  }, [levelQuizzes, store]);

  function handleLevelSwitch(level: LevelId) {
    setStore(setSelectedLevel(level));
  }

  function handleReset() {
    if (window.confirm(t.progResetConfirm)) {
      setStore(resetAllProgress());
    }
  }

  const activeLvlLabel =
    lang === 'ar' ? LEVEL_AR[activeLevelInfo.id].label : activeLevelInfo.label;
  const activeLvlExam =
    lang === 'ar' ? LEVEL_AR[activeLevelInfo.id].examTitle : activeLevelInfo.examTitle;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t.progTitle}</h1>
          <p className="text-sm text-slate-500">
            {t.progSub} — {activeLvlLabel} ({activeLvlExam})
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleLevelSwitch(lvl.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
                store.selectedLevel === lvl.id
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? LEVEL_AR[lvl.id].shortLabel : lvl.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>{t.progEstScore}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums" dir="ltr">
            {stats.avg20 === null ? '— / 20' : `${formatScore20(stats.avg20)} / 20`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t.progCompleted}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums" dir="ltr">
            {stats.completed} / {stats.total}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>{t.progStreak}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {stats.streak} {stats.streak > 1 ? t.daysLabel : t.dayLabel}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>{t.progXp}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums" dir="ltr">
            {store.xp} XP
          </p>
        </div>
      </section>

      {/* Maîtrise par matière */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">{t.progMastery}</h2>
          {stats.priority > 0 && (
            <Link
              href="/a-revoir"
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
            >
              <Target className="w-3.5 h-3.5" />
              <span>
                {stats.priority} {t.progToReviewLink}
              </span>
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {stats.subjectBreakdown.map((item) => {
            const style = getSubjectStyle(item.subject);
            return (
              <div key={item.subject} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-bold text-slate-900">
                    {translateSubject(item.subject, lang)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {item.masteryPct}% • {t.lbAvg}{' '}
                    {item.avg20 === null ? '—' : `${formatScore20(item.avg20)}/20`} ({item.done}/
                    {item.total})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
                    style={{ width: `${item.masteryPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historique récent */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">{t.progRecent}</h2>

        {stats.recentHistory.length === 0 ? (
          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 text-center space-y-3">
            <p className="text-sm text-slate-500">{t.progEmpty}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
            >
              <span>{t.progStartFirst}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentHistory.map((h) => {
              const badgeColor =
                h.score20 >= 14
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : h.score20 >= 12
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-red-50 text-red-700 border-red-200';
              const loc = getLocalizedStage(
                h.quizSlug,
                { title: h.chapterTitle, desc: '' },
                lang
              );

              return (
                <div
                  key={h.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <Link
                      href={`/quiz/${h.quizSlug}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600"
                    >
                      {loc.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {translateSubject(h.subject, lang)} • {h.correctCount}/{h.totalCount}{' '}
                      {t.progCorrectAnswers} • {formatDuration(h.durationSeconds)} • {h.date}
                    </p>
                  </div>
                  <span
                    dir="ltr"
                    className={`self-start sm:self-center text-xs font-bold px-2.5 py-1 rounded-full border tabular-nums ${badgeColor}`}
                  >
                    {formatScore20(h.score20)} / 20
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.progReset}</span>
        </button>
      </div>
    </main>
  );
}
