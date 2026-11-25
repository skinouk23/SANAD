import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { TranslationKeys } from '@/i18n/types';
import { LanguageContext } from '@/shared/lib/i18n/language-context-core';
import { applyLanguageToDocument } from '@/shared/lib/i18n/document';
import { getLanguageDefinition } from '@/shared/lib/i18n/languages';
import { loadTranslations } from '@/shared/lib/i18n/locale-loader';
import type { I18nState } from '@/shared/lib/i18n/locale-loader';
import type { LanguageCode, LanguageDefinition } from '@/shared/lib/i18n/languages';
import { persistLanguageCode } from '@/shared/lib/i18n/storage';
import type { LanguageContextType } from '@/shared/lib/i18n/language-context-core';

// eslint-disable-next-line react-refresh/only-export-components
export { useLanguage } from '@/shared/lib/i18n/language-context-core';

interface ApplyLanguageOptions {
  persist: boolean;
}

interface LanguageProviderProps {
  children: ReactNode;
  initialI18nState: I18nState;
  initialLanguageCode: LanguageCode;
}

export function LanguageProvider({
  children,
  initialI18nState,
  initialLanguageCode,
}: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageDefinition>(() =>
    getLanguageDefinition(initialLanguageCode),
  );
  const [translations, setTranslations] = useState<TranslationKeys>(initialI18nState.translations);
  const [translationCode, setTranslationCode] = useState<LanguageCode>(initialI18nState.code);
  const requestIdRef = useRef(0);

  const applyLanguage = useCallback(async (code: LanguageCode, options: ApplyLanguageOptions) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const nextTranslations = await loadTranslations(code);

      if (requestIdRef.current !== requestId) {
        return;
      }

      const nextLanguage = getLanguageDefinition(code);

      if (options.persist) {
        persistLanguageCode(code);
      }

      startTransition(() => {
        setCurrentLanguage(nextLanguage);
        setTranslations(nextTranslations);
        setTranslationCode(code);
      });
    } catch {
      // Keep the current locale active when a translation chunk fails to load.
    }
  }, []);

  useEffect(() => {
    applyLanguageToDocument(currentLanguage.code);
  }, [currentLanguage.code]);

  useEffect(() => {
    if (currentLanguage.code === translationCode) {
      return;
    }

    void applyLanguage(currentLanguage.code, { persist: false });
  }, [applyLanguage, currentLanguage.code, translationCode]);

  const setLanguage = useCallback(
    (code: LanguageCode) => {
      if (code === currentLanguage.code && code === translationCode) {
        return;
      }

      void applyLanguage(code, { persist: true });
    },
    [applyLanguage, currentLanguage.code, translationCode],
  );

  const dir = currentLanguage.dir;

  const value = useMemo<LanguageContextType>(
    () => ({
      currentLanguage,
      setLanguage,
      t: translations,
      dir,
    }),
    [currentLanguage, dir, setLanguage, translations],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
