import { FileX, ArrowLeft } from 'lucide-react';

export default function DownloadNotFound() {
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL || 'https://www.monsite.ma';

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-7 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <FileX className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">Fichier introuvable</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ce lien de téléchargement n&apos;existe pas ou a été supprimé. Retournez sur le blog pour
          trouver la version mise à jour du cours.
        </p>

        <a
          href={blogUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 px-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retourner aux cours</span>
        </a>
      </div>
    </main>
  );
}
