'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Search,
  Sparkles,
  Target,
  TrendingUp,
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
  formatScore20,
  getDefaultStore,
  loadProgress,
  setSelectedLevel,
} from '@/lib/progress';

interface HomeClientProps {
  quizzes: Quiz[];
}

export function HomeClient({ quizzes }: HomeClientProps) {
  const [store, setStore] = useState<ProgressStore>(getDefaultStore);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const q of levelQuizzes) set.add(q.subject);
    return Array.from(set);
  }, [levelQuizzes]);

  const filteredQuizzes = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    return levelQuizzes.filter((quiz) => {
      const matchSubj = selectedSubject === 'ALL' || quiz.subject === selectedSubject;
      const matchSearch =
        !qLower ||
        quiz.chapter_title.toLowerCase().includes(qLower) ||
        quiz.subject.toLowerCase().includes(qLower) ||
        quiz.description.toLowerCase().includes(qLower);
      return matchSubj && matchSearch;
    });
  }, [levelQuizzes, selectedSubject, searchQuery]);

  // Stats rapides du niveau actif
  const levelStats = useMemo(() => {
    let completed = 0;
    let sum20 = 0;
    for (const q of levelQuizzes) {
      const rec = store.records[q.slug];
      if (rec) {
        completed += 1;
        sum20 += rec.bestScore20;
      }
    }
    const avg20 = completed > 0 ? sum20 / completed : null;
    const streak = computeStreak(store.activeDays);
    return { completed, total: levelQuizzes.length, avg20, streak };
  }, [levelQuizzes, store]);

  function handleLevelSwitch(level: LevelId) {
    const updated = setSelectedLevel(level);
    setStore(updated);
    setSelectedSubject('ALL');
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* HERO SIMPLE & CRÉATIF */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Programme officiel des examens au Maroc</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Révise tes examens activement avec des quiz corrigés et suis ta note sur 20.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Choisis ton niveau, entraîne-toi par chapitre avec les pièges d’examen expliqués, et
            repère immédiatement les notions à revoir avant le jour J.
          </p>
        </div>

        {/* Mini carte Progression en direct */}
        <div className="shrink-0 w-full lg:w-72 rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ton tableau ({activeLevelInfo.shortLabel})
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
              <Flame className="w-3.5 h-3.5" />
              {levelStats.streak} j
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-xl border border-slate-200 p-2.5">
              <p className="text-[11px] text-slate-500">Note estimée</p>
              <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                {levelStats.avg20 === null ? '— / 20' : `${formatScore20(levelStats.avg20)}/20`}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-2.5">
              <p className="text-[11px] text-slate-500">Chapitres faits</p>
              <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                {levelStats.completed} / {levelStats.total}
              </p>
            </div>
          </div>

          <Link
            href="/progression"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-3 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Voir ma progression complète</span>
          </Link>
        </div>
      </section>

      {/* SÉLECTEUR DES 4 NIVEAUX OFFICIELS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            1. Choisis ton niveau scolaire
          </h2>
          <span className="text-xs text-slate-500">{quizzes.length} quiz disponibles</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {LEVELS.map((lvl) => {
            const isSelected = store.selectedLevel === lvl.id;
            const count = quizzes.filter((q) => q.level === lvl.id).length;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleLevelSwitch(lvl.id)}
                className={`text-left rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : `${lvl.accentBg} ${lvl.accentText}`
                    }`}
                  >
                    {lvl.examTitle}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {count} quiz
                  </span>
                </div>
                <p className="text-base font-extrabold">{lvl.label}</p>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {lvl.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* CATALOGUE DES QUIZ PAR MATIÈRE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            2. Quiz {activeLevelInfo.label} — {activeLevelInfo.examTitle}
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un chapitre..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filtres par matière */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubject('ALL')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              selectedSubject === 'ALL'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toutes les matières ({levelQuizzes.length})
          </button>

          {subjects.map((subject) => {
            const active = selectedSubject === subject;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                  active
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>

        {/* Grille des cartes de quiz */}
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            Aucun quiz ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => {
              const rec = store.records[quiz.slug];
              const style = getSubjectStyle(quiz.subject);
              const masteryBadge = !rec ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Nouveau
                </span>
              ) : rec.bestScore20 >= 14 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Maîtrisé • {formatScore20(rec.bestScore20)}/20
                </span>
              ) : rec.bestScore20 >= 12 ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Acquis • {formatScore20(rec.bestScore20)}/20
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  <Target className="w-3 h-3" />
                  À revoir • {formatScore20(rec.bestScore20)}/20
                </span>
              );

              return (
                <article
                  key={quiz.slug}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
                      >
                        {quiz.subject}
                      </span>
                      {masteryBadge}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {quiz.chapter_title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {quiz.questions.length} QCM
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />~{quiz.estimated_minutes} min
                      </span>
                    </div>

                    <Link
                      href={`/quiz/${quiz.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 transition-colors"
                    >
                      <span>{rec ? 'Rejouer' : 'Commencer'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
