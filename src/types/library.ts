import type { LevelId } from './quiz';

export type DocCategory = 'Cours' | 'Résumés' | 'Exercices' | 'Contrôles' | 'Examens';

export interface LibraryDoc {
  /** Titre nettoyé du document */
  t: string;
  /** Matière normalisée */
  sub: string;
  /** Catégorie (Cours, Résumés, Exercices, Contrôles, Examens) */
  cat: DocCategory;
  /** Filière / Option (BIOF, Arabe / Général, BIOF PC, etc.) */
  tr: string;
  /** Taille en Ko */
  sz: number;
  /** Extension (pdf, doc, docx, zip) */
  e: string;
  /** Chemin relatif POSIX dans C:\Users\hit\Desktop\cour ou sur CDN */
  p: string;
}

export interface LibraryMeta {
  generatedAt: string;
  totalFiles: number;
  levels: Record<
    LevelId,
    {
      count: number;
      subjects: Record<string, number>;
      categories: Record<string, number>;
    }
  >;
}

/**
 * Construit l'URL publique ou locale d'un document PDF/DOC.
 * - Si NEXT_PUBLIC_PDF_CDN_URL est défini (ex: Cloudflare R2), pointe vers le CDN en production.
 * - Sinon, pointe vers la route API locale `/api/local-pdf?file=...` qui lit C:\Users\hit\Desktop\cour.
 */
export function buildDocumentUrl(relativePath: string, download = false): string {
  const cdnBase = (process.env.NEXT_PUBLIC_PDF_CDN_URL || '').trim().replace(/\/$/, '');
  if (cdnBase) {
    const encoded = relativePath
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
    return `${cdnBase}/${encoded}`;
  }
  const params = new URLSearchParams({ file: relativePath });
  if (download) params.set('download', '1');
  return `/api/local-pdf?${params.toString()}`;
}

export function formatFileSize(sizeKb: number): string {
  if (sizeKb >= 1024) {
    return `${(sizeKb / 1024).toFixed(1).replace('.', ',')} Mo`;
  }
  return `${sizeKb} Ko`;
}
