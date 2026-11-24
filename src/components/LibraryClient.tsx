'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { LEVELS, getSubjectStyle, type LevelId } from '@/types/quiz';
import {
  buildDocumentUrl,
  formatFileSize,
  type DocCategory,
  type LibraryDoc,
  type LibraryMeta,
} from '@/types/library';
import { loadProgress, setSelectedLevel } from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import { LEVEL_AR, translateSubject } from '@/lib/i18n';
import { AiTutorWidget } from '@/components/AiTutorWidget';

const PAGE_SIZE = 24;

const CATEGORIES: Array<{ id: DocCategory | 'ALL'; fr: string; ar: string }> = [
  { id: 'ALL', fr: 'Tous', ar: 'الكل' },
  { id: 'Cours', fr: 'Cours', ar: 'الدروس' },
  { id: 'Résumés', fr: 'Résumés', ar: 'الملخصات' },
  { id: 'Exercices', fr: 'Exercices', ar: 'التمارين' },
  { id: 'Contrôles', fr: 'Contrôles', ar: 'الفروض' },
  { id: 'Examens', fr: 'Examens', ar: 'الامتحانات' },
];

export function LibraryClient() {
  const { lang } = useLanguage();
  const [level, setLevel] = useState<LevelId>('2bac');
  const [meta, setMeta] = useState<LibraryMeta | null>(null);
  const [docs, setDocs] = useState<LibraryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<DocCategory | 'ALL'>('ALL');
  const [subject, setSubject] = useState<string>('ALL');
  const [track, setTrack] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [previewDoc, setPreviewDoc] = useState<LibraryDoc | null>(null);

  // Initialisation du niveau + chargement des métadonnées globales
  useEffect(() => {
    setLevel(loadProgress().selectedLevel);
    fetch('/data/library-meta.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setMeta(data as LibraryMeta);
      })
      .catch(() => {});
  }, []);

  // Chargement à la demande du catalogue JSON du niveau actif
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/data/library-${level}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) {
          setDocs(Array.isArray(data) ? (data as LibraryDoc[]) : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDocs([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [level]);

  const subjects = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of docs) {
      counts.set(d.sub, (counts.get(d.sub) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [docs]);

  const tracks = useMemo(() => {
    const set = new Set<string>();
    for (const d of docs) set.add(d.tr);
    return Array.from(set).sort();
  }, [docs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((d) => {
      if (category !== 'ALL' && d.cat !== category) return false;
      if (subject !== 'ALL' && d.sub !== subject) return false;
      if (track !== 'ALL' && d.tr !== track) return false;
      if (q && !d.t.toLowerCase().includes(q) && !d.sub.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [docs, category, subject, track, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  function handleLevelChange(next: LevelId) {
    setSelectedLevel(next);
    setLevel(next);
    setCategory('ALL');
    setSubject('ALL');
    setTrack('ALL');
    setSearch('');
    setPage(1);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* En-tête Bibliothèque Officielle */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>
              {meta
                ? `${meta.totalFiles.toLocaleString('fr-FR')} ${
                    lang === 'ar' ? 'ملف رسمي مغربي' : 'documents officiels Maroc'
                  }`
                : lang === 'ar'
                ? 'المكتبة الرسمية المغربية'
                : 'Bibliothèque Officielle Maroc'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {lang === 'ar'
              ? 'مكتبة الدروس، الملخصات، التمارين والامتحانات الرسمية (PDF)'
              : 'Cours, Résumés, Exercices, Contrôles & Examens Officiels (PDF)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'ar'
              ? 'اقرأ الملفات مباشرة على الموقع أو قم بتحميلها ثم انتقل لاختبار معارفك في مسار الـ 10 مستويات.'
              : 'Consulte les PDF officiels directement en ligne ou télécharge-les, puis valide tes acquis dans le parcours Quiz.'}
          </p>
        </div>

        <Link
          href="/"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 transition-colors"
        >
          <span>{lang === 'ar' ? 'الانتقال إلى مسار الاختبارات' : 'Aller aux Quiz 10 niveaux'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </section>

      {/* Sélecteur des 4 Niveaux */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LEVELS.map((lvl) => {
          const active = level === lvl.id;
          const count = meta?.levels?.[lvl.id]?.count;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleLevelChange(lvl.id)}
              className={`text-start rounded-2xl p-3.5 border transition-all ${
                active
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-white/15 text-white' : `${lvl.accentBg} ${lvl.accentText}`
                  }`}
                >
                  {lang === 'ar' ? LEVEL_AR[lvl.id].examTitle : lvl.examTitle}
                </span>
                {typeof count === 'number' && (
                  <span className={`text-[11px] font-bold ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                    {count.toLocaleString('fr-FR')}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-extrabold">
                {lang === 'ar' ? LEVEL_AR[lvl.id].label : lvl.label}
              </p>
            </button>
          );
        })}
      </section>

      {/* Barre de Filtres (Catégorie + Matière + Option + Recherche) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition-colors ${
                  active
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? c.ar : c.fr}
              </button>
            );
          })}
        </div>

        {/* Recherche + Matière + Option */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={
                lang === 'ar' ? 'ابحث بعنوان الدرس أو الامتحان...' : 'Rechercher un cours, exercice, examen...'
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white ps-9 pe-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">
              {lang === 'ar' ? 'جميع المواد' : 'Toutes les matières'} ({docs.length})
            </option>
            {subjects.map(([subName, cnt]) => (
              <option key={subName} value={subName}>
                {translateSubject(subName, lang)} ({cnt})
              </option>
            ))}
          </select>

          <select
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">
              {lang === 'ar' ? 'جميع المسالك (عربي / دولي BIOF)' : 'Toutes les options (BIOF / Arabe)'}
            </option>
            {tracks.map((tr) => (
              <option key={tr} value={tr}>
                {tr}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            <strong>{filtered.length.toLocaleString('fr-FR')}</strong>{' '}
            {lang === 'ar' ? 'ملف مطابق' : 'document(s) trouvé(s)'}
          </span>
          <span>
            {lang === 'ar' ? 'صفحة' : 'Page'} {safePage} / {totalPages}
          </span>
        </div>
      </section>

      {/* Liste des Documents */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center gap-3 text-slate-500 text-sm">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          <span>{lang === 'ar' ? 'جاري تحميل فهرس الملفات...' : 'Chargement du catalogue officiel...'}</span>
        </div>
      ) : pageItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
          {lang === 'ar' ? 'لم يتم العثور على أي ملف مطابق للبحث.' : 'Aucun document ne correspond à vos filtres.'}
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {pageItems.map((doc, idx) => {
            const style = getSubjectStyle(doc.sub);
            const isPdf = doc.e === 'pdf';
            const viewUrl = buildDocumentUrl(doc.p, false);
            const dlUrl = buildDocumentUrl(doc.p, true);

            return (
              <article
                key={`${doc.p}-${idx}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-4 flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                      {translateSubject(doc.sub, lang)}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {doc.cat}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                      {doc.tr}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{doc.t}</span>
                  </h3>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase" dir="ltr">
                    {doc.e} • {formatFileSize(doc.sz)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isPdf && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'قراءة' : 'Lire'}</span>
                      </button>
                    )}

                    <a
                      href={dlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تحميل' : 'Télécharger'}</span>
                    </a>

                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ouvrir dans un nouvel onglet"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 text-xs font-bold text-slate-700"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{lang === 'ar' ? 'السابق' : 'Précédent'}</span>
          </button>

          <span className="text-xs font-bold text-slate-600 tabular-nums">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 text-xs font-bold text-slate-700"
          >
            <span>{lang === 'ar' ? 'التالي' : 'Suivant'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* Lecteur PDF intégré (Modale) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
          <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                <p className="text-xs sm:text-sm font-bold truncate">{previewDoc.t}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={buildDocumentUrl(previewDoc.p, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'تحميل' : 'Télécharger'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <iframe
              src={buildDocumentUrl(previewDoc.p, false)}
              title={previewDoc.t}
              className="flex-1 w-full bg-slate-100"
            />
          </div>
        </div>
      )}

      <AiTutorWidget
        level={level.toUpperCase()}
        subject={subject === 'ALL' ? 'Bibliothèque Officielle' : subject}
      />
    </main>
  );
}
