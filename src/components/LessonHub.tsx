'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  HelpCircle,
  Layers,
  Lightbulb,
  PenTool,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { Quiz } from '@/types/quiz';
import type { CourseSummary } from '@/data/study-content';
import { QuizPlayer } from '@/app/quiz/[slug]/QuizPlayer';
import { AiTutorWidget } from '@/components/AiTutorWidget';
import { useLanguage } from '@/components/LanguageProvider';
import {
  markMissionFlashcardsDone,
  markMissionSummaryRead,
} from '@/lib/progress';

type LessonTab = 'quiz' | 'summary' | 'flashcards' | 'exercise';

interface LessonHubProps {
  quiz: Quiz;
  nextStage: Quiz | null;
  studyPack: CourseSummary;
}

export function LessonHub({ quiz, nextStage, studyPack }: LessonHubProps) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<LessonTab>('quiz');

  // État Résumé
  const [summaryMarked, setSummaryMarked] = useState(false);

  // État Flashcards
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [cardsFinished, setCardsFinished] = useState(false);

  // État Exercice Guidé
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const [xpNotice, setXpNotice] = useState<string | null>(null);

  function triggerXpToast(xp: number, labelFr: string, labelAr: string) {
    if (xp <= 0) return;
    setXpNotice(lang === 'ar' ? `${labelAr} (+${xp} XP)` : `${labelFr} (+${xp} XP)`);
    setTimeout(() => setXpNotice(null), 3500);
  }

  function handleConfirmSummary() {
    setSummaryMarked(true);
    const { awardedXp } = markMissionSummaryRead();
    triggerXpToast(awardedXp, 'Mission Résumé validée !', 'تم إنجاز مهمة الملخص!');
  }

  function handleFlashcardAnswer(known: boolean) {
    if (known) setKnownCount((c) => c + 1);
    setFlipped(false);
    if (cardIdx < studyPack.flashcards.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      setCardsFinished(true);
      const { awardedXp } = markMissionFlashcardsDone();
      triggerXpToast(awardedXp, 'Mission Flashcards validée !', 'تم إنجاز مهمة البطاقات!');
    }
  }

  function resetFlashcards() {
    setCardIdx(0);
    setFlipped(false);
    setKnownCount(0);
    setCardsFinished(false);
  }

  const tabs: Array<{ id: LessonTab; labelFr: string; labelAr: string; icon: typeof BookOpen }> = [
    { id: 'summary', labelFr: 'Résumé', labelAr: 'الملخص', icon: BookOpen },
    { id: 'flashcards', labelFr: 'Flashcards', labelAr: 'البطاقات', icon: Layers },
    { id: 'exercise', labelFr: 'Exercice', labelAr: 'تمرين موجه', icon: PenTool },
    { id: 'quiz', labelFr: 'Quiz & Défi', labelAr: 'الاختبار', icon: HelpCircle },
  ];

  const currentCard = studyPack.flashcards[cardIdx];

  return (
    <div className="space-y-4">
      {/* Barre des 4 onglets de la mini-leçon */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-4 gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-[11px] sm:text-xs font-bold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? item.labelAr : item.labelFr}</span>
              </button>
            );
          })}
        </div>

        {xpNotice && (
          <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{xpNotice}</span>
          </div>
        )}
      </div>

      {/* ONGLET 1 : QUIZ & DÉFI */}
      {tab === 'quiz' && <QuizPlayer quiz={quiz} nextStage={nextStage} />}

      {/* ONGLET 2 : RÉSUMÉ EXPRESS */}
      {tab === 'summary' && (
        <main className="max-w-3xl mx-auto px-4 pb-8">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">
                📖 {lang === 'ar' ? studyPack.titleAr : studyPack.titleFr}
              </h2>
              <button
                type="button"
                onClick={handleConfirmSummary}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                  summaryMarked
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {summaryMarked
                    ? lang === 'ar'
                      ? 'تمت القراءة'
                      : 'Lu ✓'
                    : lang === 'ar'
                    ? 'أنهيت القراءة (+30 XP)'
                    : 'J’ai compris (+30 XP)'}
                </span>
              </button>
            </div>

            <div className="space-y-2" dir="ltr">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                L’essentiel à retenir
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc ps-5">
                {studyPack.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-900 text-slate-100 p-4 space-y-1.5" dir="ltr">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Formules &amp; Règles clés
              </p>
              {studyPack.formulas.map((f, i) => (
                <p key={i} className="text-xs sm:text-sm font-mono text-emerald-300">
                  • {f}
                </p>
              ))}
            </div>

            <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 space-y-2" dir="ltr">
              <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Exemple : {studyPack.solvedExample.problem}</span>
              </p>
              <ol className="space-y-1 text-xs sm:text-sm text-slate-700 list-decimal ps-5">
                {studyPack.solvedExample.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>

            {studyPack.examTraps.length > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1" dir="ltr">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pièges d’examen</span>
                </p>
                {studyPack.examTraps.map((tr, i) => (
                  <p key={i} className="text-xs text-amber-900">
                    — {tr}
                  </p>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTab('flashcards')}
                className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 transition-colors"
              >
                {lang === 'ar' ? 'المتابعة إلى البطاقات (Flashcards) →' : 'Passer aux Flashcards →'}
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ONGLET 3 : FLASHCARDS INTERACTIVES */}
      {tab === 'flashcards' && (
        <main className="max-w-3xl mx-auto px-4 pb-8">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-center">
            {cardsFinished ? (
              <div className="space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  {lang === 'ar' ? 'أحسنت! أنهيت جميع البطاقات' : 'Série de Flashcards terminée !'}
                </h2>
                <p className="text-sm text-slate-600">
                  {lang === 'ar'
                    ? `أتقنت ${knownCount} من أصل ${studyPack.flashcards.length} بطاقات.`
                    : `Tu maîtrises ${knownCount} carte(s) sur ${studyPack.flashcards.length}.`}
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetFlashcards}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إعادة البطاقات' : 'Recommencer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('quiz')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold"
                  >
                    <span>{lang === 'ar' ? 'اختبر نفسك الآن (Quiz)' : 'Lancer le Quiz maintenant'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>
                    {lang === 'ar' ? 'بطاقة' : 'Carte'} {cardIdx + 1} / {studyPack.flashcards.length}
                  </span>
                  <span>
                    {lang === 'ar' ? 'انقر لقلب البطاقة' : 'Clique sur la carte pour retourner'}
                  </span>
                </div>

                {/* Carte tactile Recto / Verso */}
                <button
                  type="button"
                  onClick={() => setFlipped((f) => !f)}
                  className={`w-full min-h-[210px] rounded-2xl border-2 p-6 sm:p-8 flex flex-col items-center justify-center gap-3 transition-all ${
                    flipped
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {flipped
                      ? lang === 'ar'
                        ? 'الإجابة'
                        : 'RÉPONSE'
                      : lang === 'ar'
                      ? 'السؤال / القاعدة'
                      : 'QUESTION / FORMULE'}
                  </span>
                  <p className="text-base sm:text-lg font-bold leading-relaxed" dir="ltr">
                    {flipped ? currentCard.back : currentCard.front}
                  </p>
                </button>

                {flipped ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleFlashcardAnswer(false)}
                      className="rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm py-3"
                    >
                      {lang === 'ar' ? 'تحتاج مراجعة' : 'À revoir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFlashcardAnswer(true)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3"
                    >
                      {lang === 'ar' ? 'أعرفها جيداً ✓' : 'Je connais ✓'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFlipped(true)}
                    className="w-full rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm py-3 transition-colors"
                  >
                    {lang === 'ar' ? 'إظهار الإجابة' : 'Voir la réponse'}
                  </button>
                )}
              </>
            )}
          </section>
        </main>
      )}

      {/* ONGLET 4 : EXERCICE TYPE EXAMEN PAS À PAS */}
      {tab === 'exercise' && (
        <main className="max-w-3xl mx-auto px-4 pb-8">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5">
            <div className="space-y-1.5">
              {studyPack.exercise.examSource && (
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  📄 {studyPack.exercise.examSource}
                </span>
              )}
              <h2 className="text-lg font-extrabold text-slate-900" dir="ltr">
                {studyPack.exercise.title}
              </h2>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm sm:text-base font-medium text-slate-900 leading-relaxed" dir="ltr">
              {studyPack.exercise.statement}
            </div>

            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'حاول حل التمرين على ورقة أولاً، ثم افتح التلميحات أو التصحيح المفصل:'
                : 'Essaie de rédiger la réponse sur papier, puis débloque les indices ou la correction :'}
            </p>

            {/* Boutons progressifs */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowHint1((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-2"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تلميح 1 (المنهجية)' : 'Indice 1 (Méthode)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHint2((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold px-3.5 py-2"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تلميح 2 (العلاقة)' : 'Indice 2 (Formule)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSolution((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض التصحيح وسلم التنقيط' : 'Voir la correction & barème'}</span>
              </button>
            </div>

            {showHint1 && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 text-xs sm:text-sm text-amber-950" dir="ltr">
                <strong>Indice 1 :</strong> {studyPack.exercise.hint1}
              </div>
            )}

            {showHint2 && (
              <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3.5 text-xs sm:text-sm text-blue-950" dir="ltr">
                <strong>Indice 2 :</strong> {studyPack.exercise.hint2}
              </div>
            )}

            {showSolution && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2" dir="ltr">
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  Correction rédigée type examen
                </p>
                <p className="text-xs sm:text-sm text-emerald-950 whitespace-pre-line leading-relaxed">
                  {studyPack.exercise.solution}
                </p>
                <p className="text-[11px] font-bold text-emerald-700 pt-2 border-t border-emerald-200">
                  Barème indicatif : {studyPack.exercise.bareme}
                </p>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Agent Prof IA contextuel */}
      <AiTutorWidget
        level={quiz.level.toUpperCase()}
        subject={quiz.subject}
        chapter={quiz.chapter_title}
      />
    </div>
  );
}
