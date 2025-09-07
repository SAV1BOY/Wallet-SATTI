
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Language } from '../types';
import { storage } from '../utils/helpers';

type Translations = { [key: string]: string | Translations };

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
            if (parsed.settings?.language && ['pt', 'en', 'es'].includes(parsed.settings.language)) {
                return parsed.settings.language;
            }
        }
    } catch {}
    return 'pt';
  });
  
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) throw new Error(`Failed to load translations for ${locale}`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        if (locale !== 'pt') {
            setLocaleState('pt');
        }
      }
    };
    fetchTranslations();
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  
  const setLocale = (newLocale: Language) => {
      setLocaleState(newLocale);
  };

  const t = useCallback((key: string, options?: { [key: string]: any }): any => {
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
        return acc.replace(new RegExp(`\\{\\{${optKey}\\}\\}`, 'g'), String(optValue));
      }, result);
    }
    
    return typeof result === 'string' ? result : key;
  }, [translations]);

  const value = { locale, setLocale, t };

  return (
    <LanguageContext.Provider value={value}>
      {Object.keys(translations).length > 0 ? children : null}
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
