'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, Check, Flame, MapPin, Sparkles, Trophy, User } from 'lucide-react';
import {
  LEAGUES,
  LEVELS,
  MOROCCAN_CITIES,
  getLeagueForXp,
  type LevelId,
  type ProgressStore,
} from '@/types/quiz';
import {
  buildLeaderboard,
  formatScore20,
  getDefaultStore,
  getStudentBadges,
  loadProgress,
  updateStudentProfile,
} from '@/lib/progress';
import { useLanguage } from '@/components/LanguageProvider';
import {
  BADGES_AR,
  LEVEL_AR,
  translateCity,
  translateLeague,
} from '@/lib/i18n';

export function LeaderboardClient() {
  const { lang, t } = useLanguage();
  const [store, setStore] = useState<ProgressStore>(getDefaultStore);
  const [filterLevel, setFilterLevel] = useState<LevelId | 'ALL'>('2bac');
  const [pseudoInput, setPseudoInput] = useState('');
  const [cityInput, setCityInput] = useState('Casablanca');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setStore(loaded);
    setFilterLevel(loaded.selectedLevel);
    setPseudoInput(loaded.profile.pseudo);
    setCityInput(loaded.profile.city);
  }, []);

  const league = useMemo(() => getLeagueForXp(store.xp), [store.xp]);
  const badges = useMemo(() => getStudentBadges(store), [store]);
  const leaderboard = useMemo(
    () => buildLeaderboard(store, filterLevel),
    [store, filterLevel]
  );

  const leaguePct = useMemo(() => {
    if (!league.nextXp) return 100;
    const span = league.nextXp - league.minXp;
    const current = store.xp - league.minXp;
    return Math.min(100, Math.max(4, Math.round((current / span) * 100)));
  }, [league, store.xp]);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const updated = updateStudentProfile(pseudoInput, cityInput);
    setStore(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>{t.lbTitle}</span>
          </h1>
          <p className="text-sm text-slate-500">{t.lbSub}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterLevel('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
              filterLevel === 'ALL'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.lbAllMorocco}
          </button>
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setFilterLevel(lvl.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
                filterLevel === lvl.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? LEVEL_AR[lvl.id].shortLabel : lvl.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Profil + Ligue */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>{t.lbProfileTitle}</span>
            </h2>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                {t.lbSaved}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.lbPseudo}
              </label>
              <input
                type="text"
                maxLength={22}
                value={pseudoInput}
                onChange={(e) => setPseudoInput(e.target.value)}
                placeholder="Youssef_2Bac"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.lbCity}
              </label>
              <select
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:border-indigo-500 focus:outline-none"
              >
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {translateCity(c, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 transition-colors"
          >
            {t.lbUpdateBtn}
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{league.emoji}</span>
              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {translateLeague(league.id, league.name, lang)}
                </p>
                <p className="text-xs text-slate-500">
                  {league.nextXp
                    ? `${t.lbNextLeagueBefore} ${league.nextXp - store.xp} ${t.lbNextLeagueAfter}`
                    : t.lbMaxLeague}
                </p>
              </div>
            </div>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-extrabold text-indigo-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {store.xp} XP
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${leaguePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400" dir="ltr">
              {LEAGUES.map((l) => (
                <span key={l.id} className={store.xp >= l.minXp ? 'text-slate-700' : ''}>
                  {l.emoji} {l.minXp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tableau du Classement */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            {t.lbTopStudents} ({leaderboard.entries.length})
          </h2>
          {leaderboard.xpToNext && leaderboard.nextRivalName && (
            <span className="text-xs font-semibold text-indigo-700">
              +{leaderboard.xpToNext} XP {t.heroMoreXpMiddle} {leaderboard.nextRivalName}
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.entries.map((entry, idx) => {
            const rank = idx + 1;
            const entryLeague = getLeagueForXp(entry.xp);
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

            return (
              <div
                key={entry.id}
                className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 ${
                  entry.isCurrentUser ? 'bg-indigo-50/70' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 text-center text-sm font-extrabold text-slate-700 shrink-0">
                    {medal}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{entry.pseudo}</span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] font-extrabold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                          {t.lbYou}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {translateCity(entry.city, lang)}
                      </span>
                      <span>
                        • {lang === 'ar' ? LEVEL_AR[entry.level].shortLabel : entry.level.toUpperCase()}
                      </span>
                      <span>• {entryLeague.emoji}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs font-bold">
                  <span className="hidden sm:inline-flex items-center gap-1 text-amber-700">
                    <Flame className="w-3.5 h-3.5" />
                    {entry.streak}
                    {t.daysShort}
                  </span>
                  {entry.avg20 > 0 && (
                    <span className="hidden md:inline-block text-slate-500 tabular-nums" dir="ltr">
                      {t.lbAvg} {formatScore20(entry.avg20)}/20
                    </span>
                  )}
                  <span dir="ltr" className="rounded-full bg-slate-900 text-white px-3 py-1 tabular-nums">
                    {entry.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges & Trophées */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-600" />
          <span>{t.lbBadgesTitle}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b) => {
            const arBadge = BADGES_AR[b.id];
            return (
              <div
                key={b.id}
                className={`rounded-2xl border p-4 flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-white border-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                }`}
              >
                <span className="text-2xl shrink-0">{b.emoji}</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {lang === 'ar' && arBadge ? arBadge.title : b.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'ar' && arBadge ? arBadge.desc : b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
