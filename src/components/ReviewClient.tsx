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

interface ReviewClientProps {
  quizzes: Quiz[];
}

export function ReviewClient({ quizzes }: ReviewClientProps) {
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

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">À revoir en priorité</h1>
          <p className="text-sm text-slate-500">
            Concentre tes révisions sur les chapitres &lt; 12/20 et ceux pas encore tentés (
            {activeLevelInfo.label}).
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
              {lvl.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {isAllMastered ? (
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-extrabold text-emerald-950">
            Bravo ! Tous les chapitres de {activeLevelInfo.label} sont au-dessus de 12/20 !
          </h2>
          <p className="text-sm text-emerald-800">
            Continue en mode Examen Blanc pour viser la mention Très Bien.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            <span>Revoir le catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      ) : (
        <div className="space-y-8">
          {/* 1. Chapitres sous 12/20 */}
          {priorityGroups.weak.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Priorité haute — Note inférieure à 12/20 ({priorityGroups.weak.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityGroups.weak.map((quiz) => {
                  const rec = store.records[quiz.slug];
                  const style = getSubjectStyle(quiz.subject);
                  return (
                    <div
                      key={quiz.slug}
                      className="bg-white rounded-2xl border border-red-200 border-l-4 border-l-red-500 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {quiz.subject}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700">
                            Meilleure note : {formatScore20(rec.bestScore20)}/20
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{quiz.chapter_title}</h3>
                        <p className="text-xs text-slate-600">{quiz.description}</p>
                      </div>

                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Réviser ce chapitre maintenant</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 2. Chapitres pas encore tentés */}
          {priorityGroups.untried.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Pas encore tentés ({priorityGroups.untried.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityGroups.untried.map((quiz) => {
                  const style = getSubjectStyle(quiz.subject);
                  return (
                    <div
                      key={quiz.slug}
                      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {quiz.subject}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {quiz.questions.length} QCM
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{quiz.chapter_title}</h3>
                        <p className="text-xs text-slate-600">{quiz.description}</p>
                      </div>

                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 transition-colors"
                      >
                        <span>Tester mes connaissances</span>
                        <ArrowRight className="w-4 h-4" />
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
