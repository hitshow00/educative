'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Target } from 'lucide-react';
import {
  LEVELS,
  getSubjectStyle,
  type LevelId,
  type ProgressStore,
  type Quiz,
} from '@/types/quiz';
import {
  formatScore20,
  getDefaultStore,
  loadProgress,
  setSelectedLevel,
} from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import { LEVEL_AR, translateSubject } from '@/lib/i18n';
import { getLocalizedStage } from '@/lib/stage-translations-ar';

interface ReviewClientProps {
  quizzes: Quiz[];
}

export function ReviewClient({ quizzes }: ReviewClientProps) {
  const { lang, t } = useLanguage();
  const [store, setStore] = useState<ProgressStore>(getDefaultStore);

  useEffect(() => {
    setStore(loadProgress());
  }, []);

  const activeLevelInfo = useMemo(
    () => LEVELS.find((l) => l.id === store.selectedLevel) || LEVELS[0],
    [store.selectedLevel]
  );

  const priorityGroups = useMemo(() => {
    const levelQuizzes = quizzes.filter((q) => q.level === store.selectedLevel);
    const weak: Quiz[] = [];
    const untried: Quiz[] = [];

    for (const q of levelQuizzes) {
      const rec = store.records[q.slug];
      if (!rec) {
        untried.push(q);
      } else if (rec.bestScore20 < 12) {
        weak.push(q);
      }
    }

    weak.sort(
      (a, b) =>
        (store.records[a.slug]?.bestScore20 || 0) -
        (store.records[b.slug]?.bestScore20 || 0)
    );

    return { weak, untried };
  }, [quizzes, store]);

  function handleLevelSwitch(level: LevelId) {
    setStore(setSelectedLevel(level));
  }

  const isAllMastered =
    priorityGroups.weak.length === 0 && priorityGroups.untried.length === 0;

  const activeLvlLabel =
    lang === 'ar' ? LEVEL_AR[activeLevelInfo.id].label : activeLevelInfo.label;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t.revTitle}</h1>
          <p className="text-sm text-slate-500">
            {t.revSub} ({activeLvlLabel}).
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

      {isAllMastered ? (
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-extrabold text-emerald-950">{t.revAllGoodTitle}</h2>
          <p className="text-sm text-emerald-800">{t.revAllGoodSub}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            <span>{t.revBackCatalog}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </section>
      ) : (
        <div className="space-y-8">
          {priorityGroups.weak.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>
                  {t.revHighPriority} ({priorityGroups.weak.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityGroups.weak.map((quiz) => {
                  const rec = store.records[quiz.slug];
                  const style = getSubjectStyle(quiz.subject);
                  const loc = getLocalizedStage(
                    quiz.slug,
                    { title: quiz.chapter_title, desc: quiz.description },
                    lang
                  );

                  return (
                    <div
                      key={quiz.slug}
                      className="bg-white rounded-2xl border border-red-200 border-s-4 border-s-red-500 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
                          >
                            {t.levelPrefix} {quiz.stage_number} •{' '}
                            {translateSubject(quiz.subject, lang)}
                          </span>
                          <span
                            dir="ltr"
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700"
                          >
                            {formatScore20(rec.bestScore20)}/20
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{loc.title}</h3>
                        <p className="text-xs text-slate-600">{loc.desc}</p>
                      </div>

                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{t.revReviewNow}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {priorityGroups.untried.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {t.revUntried} ({priorityGroups.untried.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityGroups.untried.map((quiz) => {
                  const style = getSubjectStyle(quiz.subject);
                  const loc = getLocalizedStage(
                    quiz.slug,
                    { title: quiz.chapter_title, desc: quiz.description },
                    lang
                  );

                  return (
                    <div
                      key={quiz.slug}
                      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
                          >
                            {t.levelPrefix} {quiz.stage_number} •{' '}
                            {translateSubject(quiz.subject, lang)}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {quiz.questions.length} QCM
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{loc.title}</h3>
                        <p className="text-xs text-slate-600">{loc.desc}</p>
                      </div>

                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 transition-colors"
                      >
                        <span>{t.revTestMe}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
