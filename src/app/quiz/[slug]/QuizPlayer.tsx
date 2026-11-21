'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Timer,
  XCircle,
} from 'lucide-react';
import { getSubjectStyle, type Quiz, type QuizMode, type QuizQuestion } from '@/types/quiz';
import {
  formatDuration,
  formatScore20,
  getMentionMaroc,
  recordAttempt,
} from '@/lib/progress';
import { createClient } from '@/utils/supabase/client';

const LETTERS = ['A', 'B', 'C', 'D'];

interface QuizPlayerProps {
  quiz: Quiz;
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const supabase = useMemo(() => createClient(), []);
  const style = getSubjectStyle(quiz.subject);

  const [mode, setMode] = useState<QuizMode>('training');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(quiz.questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLocked, setIsLocked] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [finalScore20, setFinalScore20] = useState(0);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);

  // Chronomètre
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  const currentQuestion = activeQuestions[index];
  const chosenOption = answers[index];

  const finishQuiz = useCallback(
    async (finalAnswers: Record<number, number>) => {
      let correctCount = 0;
      const wrongs: number[] = [];

      activeQuestions.forEach((q, idx) => {
        if (finalAnswers[idx] === q.correct_index) {
          correctCount += 1;
        } else {
          wrongs.push(idx);
        }
      });

      const { score20, xpEarned: gained } = recordAttempt({
        quiz,
        correctCount,
        totalCount: activeQuestions.length,
        durationSeconds: seconds,
        mode,
        wrongIndices: wrongs,
      });

      setWrongIndices(wrongs);
      setFinalScore20(score20);
      setXpEarned(gained);
      setFinished(true);

      // Synchronisation cloud silencieuse si l'élève est connecté à Supabase
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_attempts').insert([
            {
              user_id: user.id,
              quiz_slug: quiz.slug,
              level: quiz.level,
              subject: quiz.subject,
              chapter_title: quiz.chapter_title,
              score_20: score20,
              correct_count: correctCount,
              total_count: activeQuestions.length,
              duration_seconds: seconds,
              mode,
              wrong_indices: wrongs,
            },
          ]);
        }
      } catch {
        // La sauvegarde localStorage est déjà assurée
      }
    },
    [activeQuestions, mode, quiz, seconds, supabase]
  );

  const handleSelectOption = useCallback(
    (optIdx: number) => {
      if (finished) return;
      if (mode === 'training' && isLocked) return;

      const updatedAnswers = { ...answers, [index]: optIdx };
      setAnswers(updatedAnswers);

      if (mode === 'training' || mode === 'mistakes') {
        setIsLocked(true);
        if (optIdx === currentQuestion.correct_index) {
          setCombo((prev) => {
            const next = prev + 1;
            setBestCombo((best) => Math.max(best, next));
            return next;
          });
        } else {
          setCombo(0);
        }
      }
    },
    [answers, currentQuestion, finished, index, isLocked, mode]
  );

  const handleNext = useCallback(() => {
    if (index < activeQuestions.length - 1) {
      setIndex((i) => i + 1);
      setIsLocked(false);
    } else {
      finishQuiz(answers);
    }
  }, [activeQuestions.length, answers, finishQuiz, index]);

  // Raccourcis clavier (A, B, C, D et Entrée)
  useEffect(() => {
    if (finished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const letterIdx = LETTERS.indexOf(key);
      if (letterIdx !== -1 && letterIdx < (currentQuestion?.options.length || 0)) {
        handleSelectOption(letterIdx);
      } else if (e.key === 'Enter' && (isLocked || (mode === 'exam' && chosenOption !== undefined))) {
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chosenOption, currentQuestion, finished, handleNext, handleSelectOption, isLocked, mode]);

  function restart(nextMode: QuizMode = mode, subset?: QuizQuestion[]) {
    setMode(nextMode);
    setActiveQuestions(subset && subset.length > 0 ? subset : quiz.questions);
    setIndex(0);
    setAnswers({});
    setIsLocked(false);
    setCombo(0);
    setBestCombo(0);
    setSeconds(0);
    setFinished(false);
    setWrongIndices([]);
  }

  function retryMistakesOnly() {
    const failedQuestions = wrongIndices
      .map((i) => activeQuestions[i])
      .filter((q): q is QuizQuestion => Boolean(q));
    if (failedQuestions.length > 0) {
      restart('mistakes', failedQuestions);
    }
  }

  // === ÉCRAN DE RÉSULTAT FINAL ===
  if (finished) {
    const total = activeQuestions.length;
    const correctCount = total - wrongIndices.length;
    const pct = Math.round((correctCount / total) * 100);
    const mention = getMentionMaroc(finalScore20);

    return (
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-6">
          <div className="space-y-2">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
              {quiz.subject} • {quiz.chapter_title}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {mode === 'exam' ? 'Examen Blanc Terminé !' : 'Session de Révision Terminée !'}
            </h1>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ta note estimée
            </p>
            <p className="text-5xl font-extrabold text-slate-900 tabular-nums">
              {formatScore20(finalScore20)}{' '}
              <span className="text-2xl text-slate-400 font-bold">/ 20</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${mention.color}`}
              >
                <Award className="w-3.5 h-3.5" />
                {mention.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />+{xpEarned} XP
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="text-slate-500">Réussite</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {correctCount}/{total} ({pct}%)
                </p>
              </div>
              <div>
                <p className="text-slate-500">Temps</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">
                  {formatDuration(seconds)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Meilleur combo</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {bestCombo > 0 ? `${bestCombo} d’affilée` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {wrongIndices.length > 0 && (
              <button
                type="button"
                onClick={retryMistakesOnly}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-3 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refaire mes {wrongIndices.length} erreur{wrongIndices.length > 1 ? 's' : ''}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => restart(mode, quiz.questions)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-3 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer tout le quiz</span>
            </button>

            <Link
              href="/progression"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-3 transition-colors"
            >
              <span>Voir ma progression</span>
            </Link>
          </div>
        </section>

        {/* Correction complète question par question */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Correction détaillée ({total} questions)
          </h2>

          {activeQuestions.map((q, idx) => {
            const userAns = answers[idx];
            const isRight = userAns === q.correct_index;

            return (
              <div
                key={q.id + idx}
                className={`bg-white rounded-2xl border p-5 space-y-2.5 ${
                  isRight ? 'border-emerald-200' : 'border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">
                    {idx + 1}. {q.question_text}
                  </p>
                  {isRight ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </div>

                {!isRight && userAns !== undefined && (
                  <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-1.5">
                    Ta réponse : <strong>{q.options[userAns]}</strong>
                  </p>
                )}

                <p className="text-xs text-emerald-800 bg-emerald-50 rounded-lg px-3 py-1.5">
                  Bonne réponse : <strong>{q.options[q.correct_index]}</strong>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                {q.exam_tip && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Piège d’examen :</strong> {q.exam_tip}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </section>
      </main>
    );
  }

  // === VUE QUIZ EN COURS ===
  const total = activeQuestions.length;
  const progressPct = Math.round(((index + (isLocked ? 1 : 0)) / total) * 100);
  const canGoNext = mode === 'exam' ? chosenOption !== undefined : isLocked;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* Barre retour + Sélecteur de Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les quiz</span>
        </Link>

        {/* Bascule Mode Entraînement vs Mode Examen Blanc */}
        {index === 0 && Object.keys(answers).length === 0 && mode !== 'mistakes' && (
          <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => restart('training')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                mode === 'training' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Entraînement</span>
            </button>
            <button
              type="button"
              onClick={() => restart('exam')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                mode === 'exam' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Examen Blanc</span>
            </button>
          </div>
        )}
      </div>

      {/* Carte Principale du Quiz */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-6">
        {/* En-tête progression + chrono + combo */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                {quiz.subject}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Question {index + 1} / {total}
              </span>
              {mode === 'mistakes' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  Mode Erreurs
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {combo >= 2 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                  <Flame className="w-3.5 h-3.5" />
                  {combo} d’affilée !
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(seconds)}
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Énoncé de la question */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-slate-400">{quiz.chapter_title}</p>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question_text}
          </h1>
        </div>

        {/* 4 Choix de réponses */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = chosenOption === optIdx;
            const isCorrect = optIdx === currentQuestion.correct_index;

            let optionClasses =
              'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-slate-900';
            let badgeClasses = 'bg-white border-slate-300 text-slate-600';

            if (mode === 'exam' && isSelected) {
              optionClasses = 'border-indigo-600 bg-indigo-50 text-indigo-950';
              badgeClasses = 'bg-indigo-600 border-indigo-600 text-white';
            } else if ((mode === 'training' || mode === 'mistakes') && isLocked) {
              if (isCorrect) {
                optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                badgeClasses = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isSelected) {
                optionClasses = 'border-red-500 bg-red-50 text-red-950';
                badgeClasses = 'bg-red-600 border-red-600 text-white';
              } else {
                optionClasses = 'border-slate-200 bg-white text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={(mode === 'training' || mode === 'mistakes') && isLocked}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full min-h-[54px] flex items-center gap-3.5 text-left rounded-xl border p-3.5 text-sm sm:text-base font-medium transition-all ${optionClasses}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg border shrink-0 flex items-center justify-center text-xs font-bold ${badgeClasses}`}
                >
                  {LETTERS[optIdx] || optIdx + 1}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Encadré Explication + Piège d'examen (Mode Entraînement) */}
        {(mode === 'training' || mode === 'mistakes') && isLocked && (
          <div className="space-y-3 pt-1">
            <div className="rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-600 p-4 text-sm text-slate-700 space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Explication</span>
              </p>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            {currentQuestion.exam_tip && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Piège fréquent à l’examen :</strong> {currentQuestion.exam_tip}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bouton Suivant */}
        {canGoNext && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm sm:text-base py-3.5 px-5 transition-colors"
          >
            <span>
              {index < total - 1 ? 'Question suivante' : 'Terminer et voir ma note / 20'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </section>
    </main>
  );
}
