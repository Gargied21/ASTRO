import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultVal?: string) => string;
  loc: (en: string, mr?: string, hi?: string, gu?: string) => string;
  syncTranslate: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const setGoogleTranslateCookie = (lang: Language) => {
  const cookieVal = `/en/${lang}`;
  const hostname = window.location.hostname;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
  
  if (lang === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
  }
};

const triggerGoogleTranslateCombo = (lang: Language): boolean => {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = lang === 'en' ? 'en' : lang;
    combo.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cvp_lang') as Language;
    return saved && ['en', 'mr', 'hi', 'gu'].includes(saved) ? saved : 'mr';
  });

  const syncTranslate = useCallback(() => {
    document.documentElement.lang = language;
    setGoogleTranslateCookie(language);
    if (!triggerGoogleTranslateCombo(language)) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerGoogleTranslateCombo(language) || attempts > 25) {
          clearInterval(interval);
        }
      }, 200);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('cvp_lang', lang);
    setGoogleTranslateCookie(lang);
    if (!triggerGoogleTranslateCombo(lang)) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerGoogleTranslateCombo(lang) || attempts > 25) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    syncTranslate();
  }, [syncTranslate, language]);

  const t = (key: string, defaultVal?: string): string => {
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key]) return langDict[key];
    const fallback = translations['en'] ? translations['en'][key] : undefined;
    return fallback || defaultVal || key;
  };

  const loc = (en: string, mr?: string, hi?: string, gu?: string): string => {
    if (language === 'gu' && gu) return gu;
    if (language === 'hi' && hi) return hi;
    if (language === 'mr' && mr) return mr;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loc, syncTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
