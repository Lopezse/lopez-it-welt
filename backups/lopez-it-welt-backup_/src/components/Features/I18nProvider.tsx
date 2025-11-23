'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Import der Übersetzungsdateien
import deTranslations from '../../i18n/locales/de.json';
import enTranslations from '../../i18n/locales/en.json';
import esTranslations from '../../i18n/locales/es.json';

const translations: Record<string, Record<string, any>> = {
  de: deTranslations,
  en: enTranslations,
  es: esTranslations,
};

type Language = 'de' | 'en' | 'es';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sprache aus localStorage laden
    try {
      const savedLanguage = localStorage.getItem(
        'lopez-it-welt-sprache'
      ) as Language;
      if (savedLanguage && ['de', 'en', 'es'].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.warn('Fehler beim Laden der Sprache aus localStorage:', error);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (isClient) {
      try {
        localStorage.setItem('lopez-it-welt-sprache', lang);
      } catch (error) {
        console.warn(
          'Fehler beim Speichern der Sprache in localStorage:',
          error
        );
      }
    }
  };

  const t = (key: string): string => {
    try {
      // Nested key lookup (e.g., "hauptbereiche.elemente.it_support.titel")
      const keys = key.split('.');
      let value: any = translations[language];

      // Prüfen ob die Sprache existiert
      if (!value) {
        console.warn(`Language ${language} not found in translations`);
        return key;
      }

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, any>)[k];
        } else {
          // Debugging: Log missing keys in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `Missing translation key: ${key} for language: ${language}`
            );
          }
          // Fallback: Versuche deutsche Übersetzung
          if (language !== 'de') {
            let fallbackValue: any = translations['de'];
            for (const fallbackKey of keys) {
              if (
                fallbackValue &&
                typeof fallbackValue === 'object' &&
                fallbackKey in fallbackValue
              ) {
                fallbackValue = (fallbackValue as Record<string, any>)[
                  fallbackKey
                ];
              } else {
                return key;
              }
            }
            return typeof fallbackValue === 'string' ? fallbackValue : key;
          }
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error('Fehler bei der Übersetzung:', error);
      return key;
    }
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
