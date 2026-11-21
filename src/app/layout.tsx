import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExamQuiz.ma — Quiz Interactifs & Suivi de Progression (Examens Maroc)',
  description:
    'Préparez gratuitement vos examens au Maroc (2ème Bac National, 1ère Bac Régional, 3ème Année Collège, 6ème Primaire) en français et en arabe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
