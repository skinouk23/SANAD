import { env } from '@/config/env';
import { frenchTranslations } from '@/i18n/translations/fr';
import { FALLBACK_LANGUAGE_CODE, isLanguageCode } from '@/shared/lib/i18n/languages';
import type { TranslationKeys } from '@/i18n/types';
import type { LanguageCode } from '@/shared/lib/i18n/languages';
import { readStoredLanguageCode } from '@/shared/lib/i18n/storage';

export interface I18nState {
  code: LanguageCode;
  translations: TranslationKeys;
}

type TranslationLoader = () => Promise<TranslationKeys>;

const immediateFallbackI18nState: I18nState = {
  code: FALLBACK_LANGUAGE_CODE,
  translations: frenchTranslations,
};

const translationLoaders = {
  'ar-TN': () => import('@/i18n/translations/ar').then((module) => module.arabicTranslations),
  'de-DE': () => import('@/i18n/translations/de').then((module) => module.germanTranslations),
  'en-GB': () => import('@/i18n/translations/en').then((module) => module.englishTranslations),
  'fr-FR': () => Promise.resolve(frenchTranslations),
  'nl-NL': () => import('@/i18n/translations/nl').then((module) => module.dutchTranslations),
} satisfies Record<LanguageCode, TranslationLoader>;

const translationCache = new Map<LanguageCode, TranslationKeys>([
  [FALLBACK_LANGUAGE_CODE, frenchTranslations],
]);
const translationRequests = new Map<LanguageCode, Promise<TranslationKeys>>();

export function getImmediateI18nState(): I18nState {
  return immediateFallbackI18nState;
}

export function resolveDefaultLanguageCode(): LanguageCode {
  return isLanguageCode(env.DEFAULT_LOCALE) ? env.DEFAULT_LOCALE : FALLBACK_LANGUAGE_CODE;
}

export function resolveInitialLanguageCode(): LanguageCode {
  return readStoredLanguageCode() ?? resolveDefaultLanguageCode();
}

export async function loadTranslations(code: LanguageCode): Promise<TranslationKeys> {
  const cachedTranslations = translationCache.get(code);
  if (cachedTranslations) {
    return cachedTranslations;
  }

  const pendingRequest = translationRequests.get(code);
  if (pendingRequest) {
    return pendingRequest;
  }

  const loadTranslationsForCode =
    translationLoaders[code] ?? translationLoaders[resolveDefaultLanguageCode()];

  const translationRequest = loadTranslationsForCode()
    .then((loadedTranslations) => {
      translationCache.set(code, loadedTranslations);
      return loadedTranslations;
    })
    .finally(() => {
      translationRequests.delete(code);
    });

  translationRequests.set(code, translationRequest);

  return translationRequest;
}

export async function loadI18nState(code: LanguageCode): Promise<I18nState> {
  const translations = await loadTranslations(code);

  return {
    code,
    translations,
  };
}

export async function loadDefaultTranslations(): Promise<I18nState> {
  return loadI18nState(resolveDefaultLanguageCode());
}

export async function loadInitialTranslations(): Promise<I18nState> {
  return loadI18nState(resolveInitialLanguageCode());
}
