'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpenCheck, Flame, GraduationCap, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';
import { computeStreak, loadProgress } from '@/lib/progress';

export function Navbar() {
  const pathname = usePathname();
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const sync = () => {
      const store = loadProgress();
      setXp(store.xp);
      setStreak(computeStreak(store.activeDays));
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Quiz', icon: BookOpenCheck },
    { href: '/progression', label: 'Progression', icon: TrendingUp },
    { href: '/a-revoir', label: 'À revoir', icon: RotateCcw },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white flex items-center justify-center transition-colors">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div className="leading-tight">
            <span className="block text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              ExamQuiz<span className="text-indigo-600">.ma</span>
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500">
              Révision Examens Maroc
            </span>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="flex items-center gap-1" aria-label="Navigation principale">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/'
                ? pathname === '/' || pathname.startsWith('/quiz')
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Badges XP & Série */}
        <div className="hidden md:flex items-center gap-2">
          <span
            title="Série de jours de révision"
            className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700"
          >
            <Flame className="w-3.5 h-3.5" />
            {streak} j
          </span>
          <span
            title="Points d'expérience gagnés"
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {xp} XP
          </span>
        </div>
      </div>
    </header>
  );
}
