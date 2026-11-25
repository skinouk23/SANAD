import type { NotificationFeedItem } from '@/shared/lib/notifications/feed';
import { type SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';

function normalizeNotificationUrl(url: string | null | undefined): string | null {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return null;
  }

  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedUrl, window.location.origin);

    if (parsedUrl.origin !== window.location.origin) {
      return null;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return null;
  }
}

function resolveBookingDestination(role: SupportedRuntimeRole): string {
  return role === 'provider' ? '/provider/schedule' : '/mon-espace';
}

function resolveProfileDestination(role: SupportedRuntimeRole): string {
  return role === 'provider' ? '/provider/profile' : '/patient/profile';
}

function resolveFinanceDestination(role: SupportedRuntimeRole): string | null {
  return role === 'provider' ? '/provider/transactions' : null;
}

export function resolveNotificationDestination(
  notification: NotificationFeedItem,
  role: SupportedRuntimeRole,
): string | null {
  const actionUrl = normalizeNotificationUrl(notification.action?.url);

  if (actionUrl) {
    return actionUrl;
  }

  const legacyType =
    typeof notification.metadata.type === 'string'
      ? notification.metadata.type.trim().toLowerCase()
      : null;

  if (notification.category === 'message' || legacyType === 'new_message') {
    return '/messages';
  }

  if (
    notification.category === 'booking' ||
    notification.category === 'schedule' ||
    notification.category === 'reminder' ||
    legacyType === 'validation_pending' ||
    legacyType?.startsWith('booking_')
  ) {
    return resolveBookingDestination(role);
  }

  if (notification.category === 'account' || notification.category === 'security') {
    return resolveProfileDestination(role);
  }

  if (notification.category === 'finance') {
    return resolveFinanceDestination(role);
  }

  return null;
}
