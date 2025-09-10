import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Language, LANGUAGES } from '../types';
import { storage } from '../utils/helpers';

// Import translations directly to include them in the build
import ptTranslations from '../locales/pt.ts';
import enTranslations from '../locales/en.ts';
import esTranslations from '../locales/es.ts';

type Translations = { [key: string]: string | Translations };

// Statically map locales to their imported translation objects
const translationsMap: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

interface LanguageContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: string, options?: { [key: string]: string | number | React.ReactNode }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>(() => {
    try {
        const raw = storage.getItem('finapp-data');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.settings?.language && LANGUAGES.includes(parsed.settings.language)) {
                return parsed.settings.language;
            }
        }
    } catch {}
    return 'pt';
  });

  // Translations are now available immediately from the static map
  const translations = translationsMap[locale];
  
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  
  const setLocale = (newLocale: Language) => {
      if (LANGUAGES.includes(newLocale)) {
        setLocaleState(newLocale);
      }
  };

  const t = useCallback((key: string, options?: { [key: string]: any }): any => {
    if (!translations) {
        return key;
    }
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof result === 'string' && options) {
      return Object.entries(options).reduce((acc, [optKey, optValue]) => {
        const regex = new RegExp(`\\{${optKey}\\}`, 'g');
        return acc.replace(regex, String(optValue));
      }, result);
    }
    
    return typeof result === 'string' ? result : key;
  }, [translations]);

  const value = { locale, setLocale, t };
  
  // No need to wait for async fetch, app can render right away
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
