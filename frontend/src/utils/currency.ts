/**
 * Currency Utility Functions
 * Handles currency formatting, conversion, and display throughout the application
 */

import { env } from '@/config/env';
import { countries, getCurrencyByCountry } from '@/constants/countries';
import { resolveFormattingLocale } from '@/shared/lib/i18n/formatting';
import type { CurrencyCode, Currency } from '@/shared/schemas/geo';

/**
 * Format a price with the appropriate currency symbol and locale
 * @param amount - The numeric amount to format
 * @param countryCode - Optional country code (defaults to env.COUNTRY_CODE)
 * @param options - Additional formatting options
 */
export function formatPrice(
  amount: number,
  countryCode?: string,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  const code = countryCode || env.COUNTRY_CODE;
  const country = countries[code];
  const currency = getCurrencyByCountry(code);

  const {
    showSymbol = true,
    showCode = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = currency.decimalPlaces,
  } = options || {};

  // Format the number
  const formattedNumber = new Intl.NumberFormat(country?.locale || resolveFormattingLocale(), {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  // Build the output string
  if (showCode) {
    return `${formattedNumber} ${currency.code}`;
  }

  if (showSymbol) {
    // For currencies like EUR, symbol comes before
    if (['EUR', 'GBP', 'USD'].includes(currency.code)) {
      return `${currency.symbol}${formattedNumber}`;
    }
    // For most other currencies (TND, MAD, etc.), symbol/code comes after
    return `${formattedNumber} ${currency.symbol}`;
  }

  return formattedNumber;
}

/**
 * Format price with full currency display (e.g., "150 TND" or "€150")
 */
export function formatPriceWithCurrency(amount: number, countryCode?: string): string {
  return formatPrice(amount, countryCode, { showSymbol: true });
}

/**
 * Format price range (e.g., "80-200 TND")
 */
export function formatPriceRange(minPrice: number, maxPrice: number, countryCode?: string): string {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);

  const formattedMin = formatPrice(minPrice, code, { showSymbol: false });
  const formattedMax = formatPrice(maxPrice, code, { showSymbol: false });

  // For currencies where symbol comes after
  if (!['EUR', 'GBP', 'USD'].includes(currency.code)) {
    return `${formattedMin}-${formattedMax} ${currency.symbol}`;
  }

  // For currencies where symbol comes before
  return `${currency.symbol}${formattedMin}-${formattedMax}`;
}

/**
 * Format price with unit (e.g., "40 TND/jour" or "€40/day")
 */
export function formatPriceWithUnit(amount: number, unit: string, countryCode?: string): string {
  const formattedPrice = formatPrice(amount, countryCode);
  return `${formattedPrice}/${unit}`;
}

/**
 * Get the currency symbol for a country
 */
export function getCurrencySymbol(countryCode?: string): string {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);
  return currency.symbol;
}

/**
 * Get the currency code for a country
 */
export function getCurrencyCode(countryCode?: string): CurrencyCode {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);
  return currency.code;
}

/**
 * Parse a formatted price string back to a number
 */
export function parsePrice(priceString: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = priceString.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert amount between currencies (placeholder for future implementation)
 * Note: In production, this would use real exchange rates from an API
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
): number {
  // Placeholder exchange rates (would be fetched from API in production)
  const exchangeRates: Record<CurrencyCode, number> = {
    TND: 1,
    MAD: 3.3,
    DZD: 44,
    EGP: 10,
    SAR: 1.2,
    AED: 1.2,
    EUR: 0.29,
    GBP: 0.25,
    USD: 0.32,
  };

  // Convert to TND first, then to target currency
  const amountInTND = amount / exchangeRates[fromCurrency];
  return amountInTND * exchangeRates[toCurrency];
}

/**
 * Format a compact price for display in tight spaces (e.g., "1.5K TND")
 */
export function formatCompactPrice(amount: number, countryCode?: string): string {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);

  let formattedNumber: string;

  if (amount >= 1000000) {
    formattedNumber = `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    formattedNumber = `${(amount / 1000).toFixed(1)}K`;
  } else {
    formattedNumber = amount.toString();
  }

  // Remove trailing .0
  formattedNumber = formattedNumber.replace(/\.0([KM]?)$/, '$1');

  return `${formattedNumber} ${currency.symbol}`;
}

/**
 * Validate if a price is within acceptable range
 */
export function isValidPrice(
  price: number,
  minPrice: number = 0,
  maxPrice: number = 1000000,
): boolean {
  return typeof price === 'number' && !isNaN(price) && price >= minPrice && price <= maxPrice;
}

/**
 * Round price to appropriate decimal places for currency
 */
export function roundPrice(amount: number, countryCode?: string): number {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);
  const multiplier = Math.pow(10, currency.decimalPlaces);
  return Math.round(amount * multiplier) / multiplier;
}

/**
 * Get price display configuration for a country
 */
export function getPriceDisplayConfig(countryCode?: string): {
  currency: Currency;
  symbolPosition: 'before' | 'after';
  thousandsSeparator: string;
  decimalSeparator: string;
} {
  const code = countryCode || env.COUNTRY_CODE;
  const currency = getCurrencyByCountry(code);
  const country = countries[code];

  // Determine separators based on locale
  const isEuropeanFormat = ['fr-FR', 'de-DE', 'fr-TN', 'fr-MA', 'fr-DZ'].includes(
    country?.locale || '',
  );

  return {
    currency,
    symbolPosition: ['EUR', 'GBP', 'USD'].includes(currency.code) ? 'before' : 'after',
    thousandsSeparator: isEuropeanFormat ? ' ' : ',',
    decimalSeparator: isEuropeanFormat ? ',' : '.',
  };
}
