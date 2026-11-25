import type { BookingListItemResponse } from './schema';

const UPCOMING_BOOKING_STATUS_SET = new Set([
  'Pending',
  'Confirmed',
  'ProviderOnWay',
  'Arrived',
  'InProgress',
]);

const COMPLETED_BOOKING_STATUS_SET = new Set(['Completed', 'Validated']);
const PENDING_BOOKING_STATUS_SET = new Set(['Pending']);
const VALIDATION_PENDING_BOOKING_STATUS_SET = new Set(['Completed']);
const HISTORY_BOOKING_STATUS_SET = new Set(['Validated', 'Cancelled', 'NoShow', 'Disputed']);
const ACTIVE_SESSION_STATUS_SET = new Set(['ProviderOnWay', 'Arrived', 'InProgress']);

const BOOKING_STATUS_API_VALUE_BY_KEY: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  provider_on_way: 'ProviderOnWay',
  arrived: 'Arrived',
  in_progress: 'InProgress',
  completed: 'Completed',
  validated: 'Validated',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
  no_show: 'NoShow',
  disputed: 'Disputed',
};

// ============================================
// STATUS NORMALIZATION
// ============================================

/**
 * Convert a status-like token to a lower snake_case key for presentation-only maps.
 */
export function normalizeBookingStatusKey(status?: string | null): string {
  return (status ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .trim()
    .toLowerCase();
}

/** Convert known status tokens to the PascalCase API enum value. */
export function normalizeBookingStatus(status: string): string {
  const trimmedStatus = status.trim();

  if (!trimmedStatus) {
    return '';
  }

  return BOOKING_STATUS_API_VALUE_BY_KEY[normalizeBookingStatusKey(trimmedStatus)] ?? trimmedStatus;
}

/** Convert legacy/display status tokens to the PascalCase API enum value. */
export function toBookingStatusApiValue(status?: string | null): string | undefined {
  const trimmedStatus = status?.trim();

  if (!trimmedStatus) {
    return undefined;
  }

  return normalizeBookingStatus(trimmedStatus);
}

// ============================================
// STATUS GUARDS
// ============================================

export function isUpcomingBookingStatus(status?: string | null): boolean {
  return UPCOMING_BOOKING_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function isCompletedBookingStatus(status?: string | null): boolean {
  return COMPLETED_BOOKING_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function isTerminalBookingStatus(status?: string | null): boolean {
  const normalizedStatus = normalizeBookingStatus(status ?? '');
  return (
    isCompletedBookingStatus(normalizedStatus) || HISTORY_BOOKING_STATUS_SET.has(normalizedStatus)
  );
}

export function isPendingBookingStatus(status?: string | null): boolean {
  return PENDING_BOOKING_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function isValidationPendingBookingStatus(status?: string | null): boolean {
  return VALIDATION_PENDING_BOOKING_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function isHistoryBookingStatus(status?: string | null): boolean {
  return HISTORY_BOOKING_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function isActiveSessionStatus(status?: string | null): boolean {
  return ACTIVE_SESSION_STATUS_SET.has(normalizeBookingStatus(status ?? ''));
}

export function canPatientSeeSessionVerificationCode(status?: string | null): boolean {
  const normalizedStatus = normalizeBookingStatus(status ?? '');
  return normalizedStatus === 'Arrived' || normalizedStatus === 'InProgress';
}

// ============================================
// DATE HELPERS
// ============================================

export function isScheduledOnOrAfterToday(scheduledAt: string, now: Date = new Date()): boolean {
  const scheduledDate = new Date(scheduledAt);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return scheduledDate.getTime() >= todayStart.getTime();
}

export function isUpcomingBooking(
  booking: Pick<BookingListItemResponse, 'status' | 'scheduledAt'>,
  now: Date = new Date(),
): boolean {
  return (
    isUpcomingBookingStatus(booking.status) && isScheduledOnOrAfterToday(booking.scheduledAt, now)
  );
}

export function isPastOrHistoricalBooking(
  booking: Pick<BookingListItemResponse, 'status' | 'scheduledAt'>,
  now: Date = new Date(),
): boolean {
  return isValidationPendingBookingStatus(booking.status) || isHistoryBookingStatus(booking.status)
    ? true
    : !isUpcomingBooking(booking, now);
}
