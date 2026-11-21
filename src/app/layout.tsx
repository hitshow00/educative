import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExamQuiz.ma — Quiz Interactifs & Suivi de Progression (Examens Maroc)',
  description:
    'Préparez gratuitement vos examens au Maroc (2ème Bac National, 1ère Bac Régional, 3ème Année Collège, 6ème Primaire) avec des quiz corrigés et un suivi de progression intelligent.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ExamQuiz.ma — Entraînement aux examens scolaires au Maroc.</p>
            <div className="flex items-center gap-4">
              <Link href="/progression" className="hover:text-slate-900">
                Ma progression
              </Link>
              <Link href="/a-revoir" className="hover:text-slate-900">
                Chapitres à revoir
              </Link>
              <Link href="/admin" className="hover:text-slate-900">
                Administration
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
