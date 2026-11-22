'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BookOpenCheck,
  Flame,
  GraduationCap,
  Languages,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getLeagueForXp } from '@/types/quiz';
import { computeStreak, loadProgress, toggleSoundEnabled } from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import { translateLeague } from '@/lib/i18n';

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const sync = () => {
      const store = loadProgress();
      setXp(store.xp);
      setStreak(computeStreak(store.activeDays));
      setSoundOn(store.soundEnabled);
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('examquiz-progress', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('examquiz-progress', sync);
    };
  }, [pathname]);

  const league = getLeagueForXp(xp);
  const leagueName = translateLeague(league.id, league.name, lang);

  const navItems = [
    { href: '/', label: t.navRoadmap, icon: BookOpenCheck },
    { href: '/cours', label: t.navCourses, icon: GraduationCap },
    { href: '/classement', label: t.navLeaderboard, icon: Trophy },
    { href: '/progression', label: t.navProgress, icon: TrendingUp },
    { href: '/a-revoir', label: t.navReview, icon: RotateCcw },
  ];

  function handleSoundToggle() {
    const next = toggleSoundEnabled();
    setSoundOn(next.soundEnabled);
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white flex items-center justify-center transition-colors">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div className="leading-tight hidden sm:block">
            <span className="block text-sm font-extrabold text-slate-900 tracking-tight" dir="ltr">
              ExamQuiz<span className="text-indigo-600">.ma</span>
            </span>
            <span className="block text-[10px] text-slate-500">{t.brandSub}</span>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Navigation principale">
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
                className={`inline-flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Badges + Bouton Langue FR / العربية + Son */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLang}
            title={lang === 'fr' ? 'Passer en arabe (العربية)' : 'التبديل إلى الفرنسية (Français)'}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 text-xs font-extrabold transition-colors"
          >
            <Languages className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'fr' ? 'العربية' : 'FR'}</span>
          </button>

          <Link
            href="/classement"
            title={leagueName}
            className={`hidden md:inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${league.badgeBg} ${league.colorClass}`}
          >
            <span>{league.emoji}</span>
            <span dir="ltr">{xp} XP</span>
          </Link>

          <span
            title={t.progStreak}
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-1 text-xs font-bold text-amber-700"
          >
            <Flame className="w-3.5 h-3.5" />
            {streak}
            {t.daysShort}
          </span>

          <button
            type="button"
            onClick={handleSoundToggle}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <Link
            href="/classement"
            className="md:hidden inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            {xp}
          </Link>
        </div>
      </div>
    </header>
  );
}
