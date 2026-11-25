import {
  bookingBothLocationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingProviderLocationBadgeClassName,
} from './BookingFlowUi';

export type BookingLocationBadgeTone = 'home' | 'provider' | 'both';

const bookingLocationBadgeClassNames: Record<BookingLocationBadgeTone, string> = {
  home: bookingHomeLocationBadgeClassName,
  provider: bookingProviderLocationBadgeClassName,
  both: bookingBothLocationBadgeClassName,
};

export function getBookingLocationBadgeClassName(tone: BookingLocationBadgeTone): string {
  return bookingLocationBadgeClassNames[tone];
}
