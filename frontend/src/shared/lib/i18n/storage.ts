import { isLanguageCode } from '@/shared/lib/i18n/languages';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

export const LANGUAGE_STORAGE_KEY = 'language';

export function readStoredLanguageCode(): LanguageCode | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const storedCode = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguageCode(storedCode) ? storedCode : undefined;
  } catch {
    return undefined;
  }
}

export function persistLanguageCode(code: LanguageCode): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // Ignore storage access errors.
  }
}
