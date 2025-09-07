import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Language, LANGUAGES } from '../types';
import { storage } from '../utils/helpers';

type Translations = { [key: string]: string | Translations };

const translationCache: Partial<Record<Language, Translations>> = {};

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

  const [translations, setTranslations] = useState<Translations | null>(translationCache[locale] || null);

  useEffect(() => {
    let isMounted = true;
    const loadTranslations = async () => {
      if (translationCache[locale]) {
        if (isMounted) setTranslations(translationCache[locale] as Translations);
        return;
      }
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) throw new Error(`Failed to fetch translations: ${response.statusText}`);
        const data = await response.json();
        translationCache[locale] = data;
        if (isMounted) {
          setTranslations(data);
        }
      } catch (error) {
        console.error(`Error loading translations for ${locale}:`, error);
      }
    };
    loadTranslations();
    return () => { isMounted = false; };
  }, [locale]);
  
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
  
  if (!translations) {
    return null; // Don't render app until translations are loaded
  }

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
