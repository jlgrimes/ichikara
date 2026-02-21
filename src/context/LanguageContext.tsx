import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { LanguageBundle } from '../data/languages/japanese';
import { getLanguageContent } from '../data/languages/index';

const STORAGE_KEY = 'ichikara_language';

interface LanguageContextValue {
  language: LanguageBundle;
  languageId: string;
  setLanguageId: (id: string) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>');
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [languageId, setLanguageIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? 'japanese';
  });

  const setLanguageId = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setLanguageIdState(id);
  };

  // Default to Japanese if the selected language isn't available yet
  const language = (getLanguageContent(languageId) ?? getLanguageContent('japanese'))!;

  return (
    <LanguageContext.Provider value={{ language, languageId, setLanguageId }}>
      {children}
    </LanguageContext.Provider>
  );
}
