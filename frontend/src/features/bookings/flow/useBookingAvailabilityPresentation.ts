import { useMemo } from 'react';
import { convertProviderTimeToLocal, getPatientTimezone, isSameTimezone } from '@/utils/timezone';
import { formatDateValue } from './utils';
import type { DateOnlyResponse } from '@/shared/schemas/common';

interface AvailabilityPresentationOptions {
  bookingDate: string;
  availableStartTimes: string[];
  providerTimezone: string | null;
  monthAvailabilityDays: Array<{ date: DateOnlyResponse | undefined; slotCount: number }>;
}

export function useBookingAvailabilityPresentation({
  availableStartTimes,
  bookingDate,
  monthAvailabilityDays,
  providerTimezone,
}: AvailabilityPresentationOptions) {
  const patientTimezone = useMemo(() => {
    try {
      return getPatientTimezone();
    } catch {
      return null;
    }
  }, []);

  const monthDays = useMemo(
    () =>
      monthAvailabilityDays.reduce<Array<{ date: string; slotCount: number }>>((days, day) => {
        const date = formatDateValue(day.date);

        if (!date) {
          return days;
        }

        days.push({ date, slotCount: day.slotCount });
        return days;
      }, []),
    [monthAvailabilityDays],
  );

  const displaySlots = useMemo(() => {
    const shouldConvertTimezones = Boolean(
      bookingDate &&
      providerTimezone &&
      patientTimezone &&
      !isSameTimezone(providerTimezone, patientTimezone),
    );

    return availableStartTimes.map((time) => {
      if (!shouldConvertTimezones || !bookingDate || !providerTimezone) {
        return { value: time, label: time };
      }

      try {
        const { localLabel, rawValue } = convertProviderTimeToLocal(
          providerTimezone,
          bookingDate,
          time,
        );

        return { value: rawValue, label: localLabel };
      } catch {
        return { value: time, label: time };
      }
    });
  }, [availableStartTimes, bookingDate, patientTimezone, providerTimezone]);

  return {
    displaySlots,
    monthDays,
    patientTimezone,
  };
}
