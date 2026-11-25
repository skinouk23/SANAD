/**
 * useCareAvailability — care-booking availability orchestration.
 *
 * Wraps provider range availability with care-specific param gating,
 * time normalization, API error message derivation, and selected-time state.
 */

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useProviderRangeAvailability } from '@/features/providers/public-api';
import type { ProviderRangeAvailabilityResponse } from '@/features/providers/public-api';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

interface CareAvailabilityParams {
  startDate: string;
  endDate: string;
  serviceIds: string[];
}

interface CareAvailabilityOptions {
  pollingEnabled?: boolean;
}

interface UseCareAvailabilityResult {
  availableStartTimes: string[];
  availabilityLoading: boolean;
  availabilityError: Error | null;
  availabilityErrorMessage: string | null;
  rangeAvailability: ProviderRangeAvailabilityResponse | null;
  bookingTime: string;
  setBookingTime: Dispatch<SetStateAction<string>>;
}

function normalizeTimeLabel(value: string | { hour: number; minute: number } | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value.length >= 5 ? value.slice(0, 5) : value;
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
}

export function useCareAvailability(
  providerId: string | undefined,
  params: CareAvailabilityParams | null,
  errorFallback: string,
  options?: CareAvailabilityOptions,
): UseCareAvailabilityResult {
  const availabilityParams = useMemo(() => {
    if (!params?.startDate || !params?.endDate || params.serviceIds.length === 0) {
      return null;
    }

    return {
      startDate: params.startDate,
      endDate: params.endDate,
      serviceIds: [...params.serviceIds],
    };
  }, [params?.endDate, params?.serviceIds, params?.startDate]);

  const { data, loading, error } = useProviderRangeAvailability(providerId, availabilityParams, {
    pollingEnabled: options?.pollingEnabled,
  });
  const [bookingTime, setBookingTime] = useState('');

  const rangeAvailability = availabilityParams ? (data ?? null) : null;
  const availabilityLoading = Boolean(availabilityParams && loading);
  const availabilityError = availabilityParams && error instanceof Error ? error : null;

  const availableStartTimes = useMemo(() => {
    if (!availabilityParams) {
      return [];
    }

    return (rangeAvailability?.availableStartTimes ?? []).map((time) => normalizeTimeLabel(time));
  }, [availabilityParams, rangeAvailability]);

  useEffect(() => {
    if (bookingTime && !availableStartTimes.includes(bookingTime)) {
      setBookingTime('');
    }
  }, [availableStartTimes, bookingTime]);

  const availabilityErrorMessage = useMemo(
    () => (availabilityError ? getApiErrorMessage(availabilityError, errorFallback) : null),
    [availabilityError, errorFallback],
  );

  return {
    availableStartTimes,
    availabilityLoading,
    availabilityError,
    availabilityErrorMessage,
    rangeAvailability,
    bookingTime,
    setBookingTime,
  };
}
