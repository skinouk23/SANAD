import { readDocumentLanguageCode } from '@/shared/lib/i18n/document';
import { resolveDefaultLanguageCode } from '@/shared/lib/i18n/locale-loader';
import { readStoredLanguageCode } from '@/shared/lib/i18n/storage';

type DateValue = Date | number | string;

function toDate(value: DateValue): Date {
  return value instanceof Date ? value : new Date(value);
}

export function resolveFormattingLocale(): string {
  return readDocumentLanguageCode() ?? readStoredLanguageCode() ?? resolveDefaultLanguageCode();
}

export function formatDate(
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale = resolveFormattingLocale(),
): string {
  return toDate(value).toLocaleDateString(locale, options);
}

export function formatTime(
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale = resolveFormattingLocale(),
): string {
  return toDate(value).toLocaleTimeString(locale, options);
}

export function formatDateTime(
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale = resolveFormattingLocale(),
): string {
  return toDate(value).toLocaleString(locale, options);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = resolveFormattingLocale(),
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>,
  locale = resolveFormattingLocale(),
): string {
  return new Intl.NumberFormat(locale, {
    ...options,
    currency,
    style: 'currency',
  }).format(value);
}
