import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

// ============================================
// Project-level toast helpers
// ============================================

/**
 * Show an error toast with automatic API-error message extraction.
 * Falls back to the provided string (or a generic message) when the
 * error object doesn't contain a recognisable message.
 */
export function showErrorToast(error: unknown, fallback?: string): void {
  toast.error(getApiErrorMessage(error, fallback ?? 'An error occurred'));
}

/** Show a success toast. */
export function showSuccessToast(message: string): void {
  toast.success(message);
}

/** Show an informational toast. */
export function showInfoToast(message: string): void {
  toast.info(message);
}

// Re-export the raw `toast` object for callers that need full control
// (e.g. promise toasts, custom JSX, dismiss, etc.).
export { toast };
