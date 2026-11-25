import { getLanguageDefinition, isLanguageCode } from '@/shared/lib/i18n/languages';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

export function readDocumentLanguageCode(): LanguageCode | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const documentLanguageCode = document.documentElement.lang;
  return isLanguageCode(documentLanguageCode) ? documentLanguageCode : undefined;
}

export function applyLanguageToDocument(code: LanguageCode): void {
  if (typeof document === 'undefined') {
    return;
  }

  const language = getLanguageDefinition(code);
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
}
