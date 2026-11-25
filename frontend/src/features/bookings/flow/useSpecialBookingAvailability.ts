import { useMemo } from 'react';
import { useBookingAvailabilityPresentation } from './useBookingAvailabilityPresentation';
import type { DateOnlyResponse } from '@/shared/schemas/common';

interface UseSpecialBookingAvailabilityOptions {
  bookingDate: string;
  bookingTime: string;
  availableStartTimes: string[];
  providerTimezone: string | null;
  monthAvailabilityDays: Array<{ date: DateOnlyResponse | undefined; slotCount: number }>;
}

export function useSpecialBookingAvailability({
  availableStartTimes,
  bookingDate,
  bookingTime,
  monthAvailabilityDays,
  providerTimezone,
}: UseSpecialBookingAvailabilityOptions) {
  const { displaySlots, monthDays } = useBookingAvailabilityPresentation({
    availableStartTimes,
    bookingDate,
    monthAvailabilityDays,
    providerTimezone,
  });

  const selectedTimeLabel = useMemo(
    () => displaySlots.find((slot) => slot.value === bookingTime)?.label ?? bookingTime,
    [bookingTime, displaySlots],
  );

  return {
    displaySlots,
    monthDays,
    selectedTimeLabel,
  };
}
