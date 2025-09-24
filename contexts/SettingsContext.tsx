import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Theme, PostLayout } from '../types';
import { translations, Language, availableLanguages } from '../i18n/translations';

type TranslationKey = keyof typeof translations.en;

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  postLayout: PostLayout;
  setPostLayout: (layout: PostLayout) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme && Object.values(Theme).includes(storedTheme)) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    }
    return Theme.DARK;
};

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang && availableLanguages.some(l => l.key === storedLang)) {
            return storedLang;
        }
        const browserLang = navigator.language.split('-')[0] as Language;
        return availableLanguages.some(l => l.key === browserLang) ? browserLang : 'en';
    }
    return 'en';
};


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [postLayout, setPostLayoutState] = useState<PostLayout>(() => (localStorage.getItem('postLayout') as PostLayout) || PostLayout.COMFORTABLE);
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Theme.LIGHT, Theme.DARK);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('postLayout', postLayout);
  }, [postLayout]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setPostLayout = (newLayout: PostLayout) => setPostLayoutState(newLayout);
  const setLanguage = (newLanguage: Language) => setLanguageState(newLanguage);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key];
  }, [language]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, postLayout, setPostLayout, language, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};