import { sanitizeHtml } from '@/utils/security';

export function getErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return getErrorMessage(error) ?? fallback;
}

export function sanitizeTextValue(value: unknown): string {
  return sanitizeHtml(typeof value === 'string' ? value : '');
}

export function splitPersonName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}
