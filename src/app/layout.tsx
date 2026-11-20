import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Espace Téléchargement | Soutien Scolaire Maroc',
  description:
    'Téléchargez gratuitement vos cours, résumés et examens corrigés (Baccalauréat, Régional, Brevet) au Maroc.',
  // Par défaut on évite d'indexer le sous-domaine Safelink pour concentrer le SEO sur Blogger
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
