/**
 * Currency Hook
 * Custom React hook for currency formatting and display
 */

import { useCallback, useMemo } from 'react';
import { env } from '../config/env';
import {
  formatPrice,
  formatPriceRange,
  formatPriceWithUnit,
  formatCompactPrice,
  getCurrencySymbol,
  getCurrencyCode,
  calculateCommission,
  calculateNetAmount,
  formatCommission,
  roundPrice,
  getPriceDisplayConfig } from
'../utils/currency';
import { getCurrencyByCountry, getCountry } from '../constants/countries';
import type { Currency, CurrencyCode } from '../types';

/**
 * Hook return type
 */
interface UseCurrencyReturn {
  /** Current currency object */
  currency: Currency;
  /** Current currency code (e.g., 'TND') */
  currencyCode: CurrencyCode;
  /** Current currency symbol (e.g., 'DT') */
  currencySymbol: string;
  /** Current country code */
  countryCode: string;

  /** Format a price with currency */
  format: (amount: number) => string;
  /** Format a price range */
  formatRange: (min: number, max: number) => string;
  /** Format a price with unit (e.g., "40 TND/jour") */
  formatWithUnit: (amount: number, unit: string) => string;
  /** Format a compact price (e.g., "1.5K TND") */
  formatCompact: (amount: number) => string;
  /** Round price to appropriate decimal places */
  round: (amount: number) => number;

  /** Calculate commission amount */
  getCommission: (amount: number, rate?: number) => number;
  /** Calculate net amount after commission */
  getNetAmount: (amount: number, rate?: number) => number;
  /** Format commission display */
  formatCommission: (amount: number, rate?: number) => string;

  /** Price display configuration */
  displayConfig: {
    symbolPosition: 'before' | 'after';
    thousandsSeparator: string;
    decimalSeparator: string;
  };
}

/**
 * Custom hook for currency operations
 * Uses the configured country code from environment
 */
export function useCurrency(overrideCountryCode?: string): UseCurrencyReturn {
  const countryCode = overrideCountryCode || env.COUNTRY_CODE;

  // Memoize currency data
  const currency = useMemo(() => {
    return getCurrencyByCountry(countryCode);
  }, [countryCode]);

  const currencyCode = currency.code;
  const currencySymbol = currency.symbol;

  // Memoize display config
  const displayConfig = useMemo(() => {
    const config = getPriceDisplayConfig(countryCode);
    return {
      symbolPosition: config.symbolPosition,
      thousandsSeparator: config.thousandsSeparator,
      decimalSeparator: config.decimalSeparator
    };
  }, [countryCode]);

  // Format functions
  const format = useCallback(
    (amount: number) => {
      return formatPrice(amount, countryCode);
    },
    [countryCode]
  );

  const formatRange = useCallback(
    (min: number, max: number) => {
      return formatPriceRange(min, max, countryCode);
    },
    [countryCode]
  );

  const formatWithUnit = useCallback(
    (amount: number, unit: string) => {
      return formatPriceWithUnit(amount, unit, countryCode);
    },
    [countryCode]
  );

  const formatCompact = useCallback(
    (amount: number) => {
      return formatCompactPrice(amount, countryCode);
    },
    [countryCode]
  );

  const round = useCallback(
    (amount: number) => {
      return roundPrice(amount, countryCode);
    },
    [countryCode]
  );

  // Commission functions
  const getCommission = useCallback((amount: number, rate: number = 0.15) => {
    return calculateCommission(amount, rate);
  }, []);

  const getNetAmount = useCallback((amount: number, rate: number = 0.15) => {
    return calculateNetAmount(amount, rate);
  }, []);

  const formatCommissionDisplay = useCallback(
    (amount: number, rate: number = 0.15) => {
      return formatCommission(amount, rate, countryCode);
    },
    [countryCode]
  );

  return {
    currency,
    currencyCode,
    currencySymbol,
    countryCode,
    format,
    formatRange,
    formatWithUnit,
    formatCompact,
    round,
    getCommission,
    getNetAmount,
    formatCommission: formatCommissionDisplay,
    displayConfig
  };
}

/**
 * Hook for getting price display in a specific format
 * Useful for forms and inputs
 */
export function usePriceInput(initialValue: number = 0, countryCode?: string) {
  const { format, round, currencySymbol, displayConfig } =
  useCurrency(countryCode);

  const formatForDisplay = useCallback(
    (value: number) => {
      return format(value);
    },
    [format]
  );

  const formatForInput = useCallback(
    (value: number) => {
      // Return just the number for input fields
      return round(value).toString();
    },
    [round]
  );

  const parseFromInput = useCallback(
    (inputValue: string) => {
      // Remove currency symbols and format characters
      const cleaned = inputValue.
      replace(/[^\d.,\-]/g, '').
      replace(displayConfig.thousandsSeparator, '').
      replace(displayConfig.decimalSeparator, '.');

      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : round(parsed);
    },
    [displayConfig, round]
  );

  return {
    formatForDisplay,
    formatForInput,
    parseFromInput,
    currencySymbol,
    placeholder: `0 ${currencySymbol}`
  };
}

/**
 * Hook for displaying prices in service cards
 */
export function useServicePrice(
basePrice: number,
maxPrice?: number,
unit?: string,
countryCode?: string)
{
  const { format, formatRange, formatWithUnit } = useCurrency(countryCode);

  const displayPrice = useMemo(() => {
    if (maxPrice && maxPrice > basePrice) {
      return formatRange(basePrice, maxPrice);
    }
    if (unit) {
      return formatWithUnit(basePrice, unit);
    }
    return format(basePrice);
  }, [basePrice, maxPrice, unit, format, formatRange, formatWithUnit]);

  const priceLabel = useMemo(() => {
    if (maxPrice && maxPrice > basePrice) {
      return 'À partir de';
    }
    return '';
  }, [basePrice, maxPrice]);

  return {
    displayPrice,
    priceLabel,
    hasRange: maxPrice !== undefined && maxPrice > basePrice
  };
}

/**
 * Hook for transaction/payment displays
 */
export function useTransactionAmount(
amount: number,
commissionRate: number = 0.15,
countryCode?: string)
{
  const {
    format,
    getCommission,
    getNetAmount,
    formatCommission: formatComm
  } = useCurrency(countryCode);

  const commission = useMemo(
    () => getCommission(amount, commissionRate),
    [amount, commissionRate, getCommission]
  );
  const netAmount = useMemo(
    () => getNetAmount(amount, commissionRate),
    [amount, commissionRate, getNetAmount]
  );

  const formattedAmount = useMemo(() => format(amount), [amount, format]);
  const formattedCommission = useMemo(
    () => format(commission),
    [commission, format]
  );
  const formattedNetAmount = useMemo(
    () => format(netAmount),
    [netAmount, format]
  );
  const commissionDisplay = useMemo(
    () => formatComm(amount, commissionRate),
    [amount, commissionRate, formatComm]
  );

  return {
    amount,
    commission,
    netAmount,
    formattedAmount,
    formattedCommission,
    formattedNetAmount,
    commissionDisplay,
    commissionPercentage: Math.round(commissionRate * 100)
  };
}

export default useCurrency;