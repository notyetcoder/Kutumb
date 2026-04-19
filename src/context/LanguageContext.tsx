'use client';

/**
 * Language Context
 * 
 * Manages the global language state for the entire application.
 * Provides:
 * - Current language selection (gujarati, hindi, english)
 * - Function to change language
 * - Persistence to localStorage
 * - Default: Gujarati
 * 
 * Usage:
 * const { language, setLanguage } = useLanguage();
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '@/lib/relationshipData';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kutumb-language-preference';
const DEFAULT_LANGUAGE: Language = 'gujarati';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['gujarati', 'hindi', 'english'].includes(stored)) {
        setLanguageState(stored as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = (lang: Language) => {
    try {
      setLanguageState(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use the language context
 * 
 * Usage:
 * const { language, setLanguage } = useLanguage();
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
