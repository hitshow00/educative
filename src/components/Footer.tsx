'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} ExamQuiz.ma — {t.footerCopy}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/classement" className="hover:text-slate-900">
            {t.navLeaderboard}
          </Link>
          <Link href="/progression" className="hover:text-slate-900">
            {t.navProgress}
          </Link>
          <Link href="/a-revoir" className="hover:text-slate-900">
            {t.navReview}
          </Link>
          <Link href="/admin" className="hover:text-slate-900">
            {t.footerAdmin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
