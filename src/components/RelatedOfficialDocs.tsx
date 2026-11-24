'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Download, Eye, FileText, FolderOpen, X } from 'lucide-react';
import type { LevelId } from '@/types/quiz';
import { buildDocumentUrl, formatFileSize, type LibraryDoc } from '@/types/library';
import { useLanguage } from '@/components/LanguageProvider';

interface RelatedOfficialDocsProps {
  level: LevelId;
  subject: string;
  chapterTitle: string;
}

/**
 * Pont intelligent Quiz <-> Bibliothèque Officielle :
 * Affiche jusqu'à 6 documents PDF officiels pertinents (Cours, Résumés, Examens)
 * directement liés au niveau et à la matière du quiz en cours.
 */
export function RelatedOfficialDocs({ level, subject, chapterTitle }: RelatedOfficialDocsProps) {
  const { lang } = useLanguage();
  const [docs, setDocs] = useState<LibraryDoc[]>([]);
  const [totalForSubject, setTotalForSubject] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<LibraryDoc | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/data/library-${level}.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((all: LibraryDoc[]) => {
        if (cancelled || !Array.isArray(all)) return;

        const sameSubject = all.filter((d) => d.sub === subject && d.e === 'pdf');
        setTotalForSubject(sameSubject.length);

        // Priorise les fichiers dont le titre correspond aux mots clés du chapitre, puis Résumés/Cours/Examens
        const keywords = chapterTitle
          .toLowerCase()
          .split(/[^a-z0-9àâéèêëîïôùûç]+/i)
          .filter((w) => w.length >= 4);

        const scored = sameSubject.map((d) => {
          const titleLower = d.t.toLowerCase();
          let score = 0;
          for (const kw of keywords) {
            if (titleLower.includes(kw)) score += 5;
          }
          if (d.cat === 'Résumés') score += 3;
          else if (d.cat === 'Cours') score += 2;
          else if (d.cat === 'Examens') score += 2;
          return { doc: d, score };
        });

        scored.sort((a, b) => b.score - a.score);
        setDocs(scored.slice(0, 6).map((s) => s.doc));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [level, subject, chapterTitle]);

  if (docs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 pb-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'ar'
                ? 'ملفات PDF رسمية موصى بها لهذا الدرس'
                : 'Documents Officiels PDF liés à cette matière'}
            </span>
          </h3>
          <Link
            href="/bibliotheque"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
          >
            <span>
              {lang === 'ar'
                ? `عرض كل الملفات (${totalForSubject})`
                : `Voir les ${totalForSubject} PDF`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {docs.map((doc, idx) => (
            <div
              key={`${doc.p}-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {doc.cat} • {doc.tr}
                </span>
                <p className="text-xs font-bold text-slate-900 line-clamp-2 flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{doc.t}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-semibold" dir="ltr">
                  PDF • {formatFileSize(doc.sz)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2.5 py-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'قراءة' : 'Lire'}</span>
                  </button>
                  <a
                    href={buildDocumentUrl(doc.p, true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lecteur PDF rapide */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
          <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-bold truncate">{previewDoc.t}</p>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src={buildDocumentUrl(previewDoc.p, false)}
              title={previewDoc.t}
              className="flex-1 w-full bg-slate-100"
            />
          </div>
        </div>
      )}
    </section>
  );
}
