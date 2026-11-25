export type LanguageCode = 'ar-TN' | 'en-GB' | 'fr-FR' | 'de-DE' | 'nl-NL';

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  shortCode: string;
  colors: string[];
  dir: 'ltr' | 'rtl';
}

export const languages: readonly LanguageDefinition[] = [
  {
    code: 'ar-TN',
    name: 'العربية',
    shortCode: 'TN',
    colors: ['#E70013', '#FFFFFF'],
    dir: 'rtl',
  },
  {
    code: 'en-GB',
    name: 'English',
    shortCode: 'GB',
    colors: ['#012169', '#C8102E'],
    dir: 'ltr',
  },
  {
    code: 'fr-FR',
    name: 'Français',
    shortCode: 'FR',
    colors: ['#002395', '#ED2939'],
    dir: 'ltr',
  },
  {
    code: 'de-DE',
    name: 'Deutsch',
    shortCode: 'DE',
    colors: ['#000000', '#FFCC00'],
    dir: 'ltr',
  },
  {
    code: 'nl-NL',
    name: 'Nederlands',
    shortCode: 'NL',
    colors: ['#AE1C28', '#21468B'],
    dir: 'ltr',
  },
];

export const FALLBACK_LANGUAGE_CODE: LanguageCode = 'fr-FR';

const languageMap = new Map<LanguageCode, LanguageDefinition>(
  languages.map((language) => [language.code, language]),
);

const fallbackLanguage = (() => {
  const language = languageMap.get(FALLBACK_LANGUAGE_CODE);

  if (!language) {
    throw new Error('Fallback language definition is missing.');
  }

  return language;
})();

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return typeof value === 'string' && languageMap.has(value as LanguageCode);
}

export function findLanguageDefinition(
  value: string | null | undefined,
): LanguageDefinition | undefined {
  return isLanguageCode(value) ? languageMap.get(value) : undefined;
}

export function getLanguageDefinition(code: LanguageCode): LanguageDefinition {
  return languageMap.get(code) ?? fallbackLanguage;
}
