import Link from 'next/link';
import { BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL || 'https://www.monsite.ma';

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <BookOpen className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Portail de Téléchargement Éducatif
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ce serveur héberge les liens de téléchargement sécurisés pour nos cours, résumés et
            examens corrigés (Baccalauréat, Régional, Brevet).
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Fichiers vérifiés et gratuits pour les élèves au Maroc</span>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <a
            href={blogUrl}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 transition-colors"
          >
            <span>Accéder aux cours sur le blog</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Accès Administrateur
          </Link>
        </div>
      </div>
    </main>
  );
}
