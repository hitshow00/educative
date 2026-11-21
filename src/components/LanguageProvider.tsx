'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UI_TEXT, type Lang } from '@/lib/i18n';

const LANG_KEY = 'examquiz_lang_v1';

interface LanguageContextValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (next: Lang) => void;
  toggleLang: () => void;
  t: (typeof UI_TEXT)['fr'] | (typeof UI_TEXT)['ar'];
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  dir: 'ltr',
  setLang: () => {},
  toggleLang: () => {},
  t: UI_TEXT.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_KEY);
      if (saved === 'ar' || saved === 'fr') {
        setLangState(saved);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // Ignore
    }
  }

  function toggleLang() {
    setLang(lang === 'fr' ? 'ar' : 'fr');
  }

  const value: LanguageContextValue = {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    setLang,
    toggleLang,
    t: UI_TEXT[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
