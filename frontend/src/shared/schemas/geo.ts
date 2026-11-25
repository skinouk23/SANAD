/**
 * Geographic & Currency Types
 * Plain TypeScript interfaces for location, country, and currency config types.
 * These are NOT API contracts — no Zod schemas needed (per K002).
 */

// ============================================
// LOCATION
// ============================================

export interface Location {
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

// ============================================
// REGION
// ============================================

export interface Region {
  id: string;
  name: string;
  countryCode: string;
}

// ============================================
// COUNTRY & CURRENCY
// ============================================

export type CurrencyCode = 'TND' | 'MAD' | 'DZD' | 'EGP' | 'SAR' | 'AED' | 'EUR' | 'GBP' | 'USD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: CurrencyCode;
  locale: string;
  phonePrefix: string;
  regions: Region[];
}
