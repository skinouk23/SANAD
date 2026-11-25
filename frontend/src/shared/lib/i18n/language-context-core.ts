import { createContext, useContext } from 'react';

import type { TranslationKeys } from '@/i18n/types';
import type { LanguageCode, LanguageDefinition } from '@/shared/lib/i18n/languages';

export interface LanguageContextType {
  currentLanguage: LanguageDefinition;
  setLanguage: (code: LanguageCode) => void;
  t: TranslationKeys;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
