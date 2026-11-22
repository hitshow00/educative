'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lightbulb,
  Search,
  Sparkles,
} from 'lucide-react';
import { LEVELS, getSubjectStyle, type LevelId } from '@/types/quiz';
import { COURSE_SUMMARIES } from '@/data/study-content';
import {
  loadDailyMissions,
  loadProgress,
  markMissionSummaryRead,
  setSelectedLevel,
} from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import { LEVEL_AR, translateSubject } from '@/lib/i18n';
import { AiTutorWidget } from '@/components/AiTutorWidget';

export function CoursesClient() {
  const { lang } = useLanguage();
  const [level, setLevel] = useState<LevelId>('2bac');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});
  const [xpToast, setXpToast] = useState<string | null>(null);

  useEffect(() => {
    setLevel(loadProgress().selectedLevel);
    if (loadDailyMissions().summaryRead) {
      setReadIds((prev) => ({ ...prev, _daily: true }));
    }
  }, []);

  const levelSummaries = useMemo(
    () => COURSE_SUMMARIES.filter((s) => s.level === level),
    [level]
  );

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const s of levelSummaries) set.add(s.subject);
    return Array.from(set);
  }, [levelSummaries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return levelSummaries.filter((s) => {
      const matchSubj = subjectFilter === 'ALL' || s.subject === subjectFilter;
      const matchText =
        !q ||
        s.titleFr.toLowerCase().includes(q) ||
        s.titleAr.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q);
      return matchSubj && matchText;
    });
  }, [levelSummaries, subjectFilter, query]);

  function handleLevelSwitch(next: LevelId) {
    setSelectedLevel(next);
    setLevel(next);
    setSubjectFilter('ALL');
  }

  function handleMarkRead(id: string) {
    setReadIds((prev) => ({ ...prev, [id]: true }));
    const { awardedXp } = markMissionSummaryRead();
    if (awardedXp > 0) {
      setXpToast(
        lang === 'ar'
          ? `تم إنجاز مهمة قراءة ملخص اليوم: +${awardedXp} XP!`
          : `Mission « Résumé lu » validée : +${awardedXp} XP !`
      );
      setTimeout(() => setXpToast(null), 3500);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-7">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>
              {lang === 'ar' ? 'مكتبة ملخصات الدروس' : 'Bibliothèque des Résumés de Cours'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'ar'
              ? 'افهم الدرس والقواعد الأساسية في 3 دقائق قبل خوض الاختبار وتحدي الامتحان.'
              : 'Comprends l’essentiel, les formules clés et les pièges d’examen en 3 minutes avant de lancer le quiz.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleLevelSwitch(lvl.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
                level === lvl.id
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? LEVEL_AR[lvl.id].shortLabel : lvl.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {xpToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{xpToast}</span>
        </div>
      )}

      {/* Filtres matières + recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubjectFilter('ALL')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold border ${
              subjectFilter === 'ALL'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'ar' ? 'جميع المواد' : 'Toutes'} ({levelSummaries.length})
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubjectFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold border ${
                subjectFilter === s
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {translateSubject(s, lang)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث عن ملخص درس...' : 'Chercher un résumé...'}
            className="w-full rounded-xl border border-slate-200 bg-white ps-9 pe-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Cartes de Résumés complets */}
      <div className="space-y-5">
        {filtered.map((item) => {
          const style = getSubjectStyle(item.subject);
          const isRead = Boolean(readIds[item.id]);

          return (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {translateSubject(item.subject, lang)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {item.readMinutes} min
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleMarkRead(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
                    isRead
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isRead
                      ? lang === 'ar'
                        ? 'تمت القراءة'
                        : 'Lu ✓'
                      : lang === 'ar'
                      ? 'تأكيد القراءة (+30 XP)'
                      : 'Marquer comme lu (+30 XP)'}
                  </span>
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? item.titleAr : item.titleFr}
              </h2>

              {/* Points clés */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {lang === 'ar' ? 'الأفكار الأساسية للدرس' : 'L’essentiel à retenir'}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700 list-disc ps-5" dir="ltr">
                  {item.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Formules & Règles */}
              <div className="rounded-xl bg-slate-900 text-slate-100 p-4 space-y-2" dir="ltr">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Formules &amp; Règles clés
                </p>
                {item.formulas.map((f, i) => (
                  <p key={i} className="text-xs sm:text-sm font-mono text-emerald-300">
                    • {f}
                  </p>
                ))}
              </div>

              {/* Exemple résolu */}
              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 space-y-2" dir="ltr">
                <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Exemple résolu : {item.solvedExample.problem}</span>
                </p>
                <ol className="space-y-1 text-xs sm:text-sm text-slate-700 list-decimal ps-5">
                  {item.solvedExample.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>

              {/* Pièges d'examen */}
              {item.examTraps.length > 0 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1.5" dir="ltr">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Pièges fréquents à l’examen</span>
                  </p>
                  {item.examTraps.map((trap, i) => (
                    <p key={i} className="text-xs text-amber-900">
                      — {trap}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/quiz/${item.quizSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 transition-colors"
                >
                  <span>
                    {lang === 'ar'
                      ? 'التدرب على هذا الدرس (بطاقات + تمرين + اختبار)'
                      : 'S’entraîner sur ce chapitre (Flashcards + Exercice + Quiz)'}
                  </span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <AiTutorWidget
        level={level.toUpperCase()}
        subject={subjectFilter === 'ALL' ? 'Cours & Résumés' : subjectFilter}
      />
    </main>
  );
}
