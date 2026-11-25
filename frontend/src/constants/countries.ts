/**
 * Country and Currency Constants
 * Defines all supported countries with their currencies, locales, and regions
 */

import type { Country, Currency, CurrencyCode, Region } from '@/shared/schemas/geo';

/**
 * Supported currencies with formatting details
 */
export const currencies: Record<CurrencyCode, Currency> = {
  TND: {
    code: 'TND',
    symbol: 'DT',
    name: 'Tunisian Dinar',
    decimalPlaces: 3,
  },
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: 'Moroccan Dirham',
    decimalPlaces: 2,
  },
  DZD: {
    code: 'DZD',
    symbol: 'DA',
    name: 'Algerian Dinar',
    decimalPlaces: 2,
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    decimalPlaces: 2,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SR',
    name: 'Saudi Riyal',
    decimalPlaces: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimalPlaces: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2,
  },
};

/**
 * Tunisia regions
 */
const tunisiaRegions: Region[] = [
  { id: 'tunis', name: 'Tunis', countryCode: 'TN' },
  { id: 'ariana', name: 'Ariana', countryCode: 'TN' },
  { id: 'ben-arous', name: 'Ben Arous', countryCode: 'TN' },
  { id: 'manouba', name: 'Manouba', countryCode: 'TN' },
  { id: 'nabeul', name: 'Nabeul', countryCode: 'TN' },
  { id: 'zaghouan', name: 'Zaghouan', countryCode: 'TN' },
  { id: 'bizerte', name: 'Bizerte', countryCode: 'TN' },
  { id: 'beja', name: 'Béja', countryCode: 'TN' },
  { id: 'jendouba', name: 'Jendouba', countryCode: 'TN' },
  { id: 'kef', name: 'Le Kef', countryCode: 'TN' },
  { id: 'siliana', name: 'Siliana', countryCode: 'TN' },
  { id: 'sousse', name: 'Sousse', countryCode: 'TN' },
  { id: 'monastir', name: 'Monastir', countryCode: 'TN' },
  { id: 'mahdia', name: 'Mahdia', countryCode: 'TN' },
  { id: 'sfax', name: 'Sfax', countryCode: 'TN' },
  { id: 'kairouan', name: 'Kairouan', countryCode: 'TN' },
  { id: 'kasserine', name: 'Kasserine', countryCode: 'TN' },
  { id: 'sidi-bouzid', name: 'Sidi Bouzid', countryCode: 'TN' },
  { id: 'gabes', name: 'Gabès', countryCode: 'TN' },
  { id: 'medenine', name: 'Médenine', countryCode: 'TN' },
  { id: 'tataouine', name: 'Tataouine', countryCode: 'TN' },
  { id: 'gafsa', name: 'Gafsa', countryCode: 'TN' },
  { id: 'tozeur', name: 'Tozeur', countryCode: 'TN' },
  { id: 'kebili', name: 'Kébili', countryCode: 'TN' },
];

/**
 * Morocco regions
 */
const moroccoRegions: Region[] = [
  { id: 'casablanca', name: 'Casablanca-Settat', countryCode: 'MA' },
  { id: 'rabat', name: 'Rabat-Salé-Kénitra', countryCode: 'MA' },
  { id: 'marrakech', name: 'Marrakech-Safi', countryCode: 'MA' },
  { id: 'fes', name: 'Fès-Meknès', countryCode: 'MA' },
  { id: 'tanger', name: 'Tanger-Tétouan-Al Hoceïma', countryCode: 'MA' },
  { id: 'agadir', name: 'Souss-Massa', countryCode: 'MA' },
];

/**
 * France regions
 */
const franceRegions: Region[] = [
  { id: 'ile-de-france', name: 'Île-de-France', countryCode: 'FR' },
  { id: 'provence', name: "Provence-Alpes-Côte d'Azur", countryCode: 'FR' },
  { id: 'auvergne', name: 'Auvergne-Rhône-Alpes', countryCode: 'FR' },
  { id: 'occitanie', name: 'Occitanie', countryCode: 'FR' },
  { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine', countryCode: 'FR' },
  { id: 'hauts-de-france', name: 'Hauts-de-France', countryCode: 'FR' },
];

/**
 * Supported countries with full configuration
 */
export const countries: Record<string, Country> = {
  TN: {
    code: 'TN',
    name: 'Tunisie',
    flag: '🇹🇳',
    currency: 'TND',
    locale: 'fr-TN',
    phonePrefix: '+216',
    regions: tunisiaRegions,
  },
  MA: {
    code: 'MA',
    name: 'Maroc',
    flag: '🇲🇦',
    currency: 'MAD',
    locale: 'fr-MA',
    phonePrefix: '+212',
    regions: moroccoRegions,
  },
  DZ: {
    code: 'DZ',
    name: 'Algérie',
    flag: '🇩🇿',
    currency: 'DZD',
    locale: 'fr-DZ',
    phonePrefix: '+213',
    regions: [],
  },
  EG: {
    code: 'EG',
    name: 'Égypte',
    flag: '🇪🇬',
    currency: 'EGP',
    locale: 'ar-EG',
    phonePrefix: '+20',
    regions: [],
  },
  SA: {
    code: 'SA',
    name: 'Arabie Saoudite',
    flag: '🇸🇦',
    currency: 'SAR',
    locale: 'ar-SA',
    phonePrefix: '+966',
    regions: [],
  },
  AE: {
    code: 'AE',
    name: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    currency: 'AED',
    locale: 'ar-AE',
    phonePrefix: '+971',
    regions: [],
  },
  FR: {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    locale: 'fr-FR',
    phonePrefix: '+33',
    regions: franceRegions,
  },
  DE: {
    code: 'DE',
    name: 'Allemagne',
    flag: '🇩🇪',
    currency: 'EUR',
    locale: 'de-DE',
    phonePrefix: '+49',
    regions: [],
  },
  NL: {
    code: 'NL',
    name: 'Pays-Bas',
    flag: '🇳🇱',
    currency: 'EUR',
    locale: 'nl-NL',
    phonePrefix: '+31',
    regions: [],
  },
  GB: {
    code: 'GB',
    name: 'Royaume-Uni',
    flag: '🇬🇧',
    currency: 'GBP',
    locale: 'en-GB',
    phonePrefix: '+44',
    regions: [],
  },
  US: {
    code: 'US',
    name: 'États-Unis',
    flag: '🇺🇸',
    currency: 'USD',
    locale: 'en-US',
    phonePrefix: '+1',
    regions: [],
  },
};

/**
 * Get country by code
 */
export function getCountry(countryCode: string): Country | undefined {
  return countries[countryCode.toUpperCase()];
}

/**
 * Get currency by country code
 */
export function getCurrencyByCountry(countryCode: string): Currency {
  const country = getCountry(countryCode);
  if (country) {
    return currencies[country.currency];
  }
  // Default to TND
  return currencies.TND;
}

/**
 * Get currency by currency code
 */
export function getCurrency(currencyCode: CurrencyCode): Currency {
  return currencies[currencyCode] || currencies.TND;
}

/**
 * Get regions for a country
 */
export function getRegions(countryCode: string): Region[] {
  const country = getCountry(countryCode);
  return country?.regions || [];
}

/**
 * Get all supported country codes
 */
export function getSupportedCountryCodes(): string[] {
  return Object.keys(countries);
}

/**
 * Check if a country is supported
 */
export function isCountrySupported(countryCode: string): boolean {
  return countryCode.toUpperCase() in countries;
}

/**
 * Get countries as array for dropdowns
 */
export function getCountriesArray(): Country[] {
  return Object.values(countries);
}

/**
 * Default country code
 */
export const DEFAULT_COUNTRY_CODE = 'TN';

/**
 * Default currency
 */
export const DEFAULT_CURRENCY: CurrencyCode = 'TND';
