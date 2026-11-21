import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export default function QuizNotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
        <HelpCircle className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Quiz introuvable</h1>
      <p className="text-sm text-slate-600">
        Ce quiz n’existe pas ou a été déplacé. Retournez au catalogue pour choisir un autre chapitre.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-3 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux quiz</span>
      </Link>
    </main>
  );
}
