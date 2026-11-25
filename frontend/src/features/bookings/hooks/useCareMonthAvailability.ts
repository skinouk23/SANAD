/**
 * useCareMonthAvailability — care-booking month availability orchestration.
 *
 * Wraps provider month availability with care-specific service gating.
 */

import { useMemo } from 'react';

import { useProviderMonthAvailability } from '@/features/providers/public-api';
import type { ProviderMonthAvailabilityDayResponse } from '@/features/providers/public-api';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

interface CareMonthAvailabilityOptions {
  errorFallback?: string;
  pollingEnabled?: boolean;
}

interface UseCareMonthAvailabilityResult {
  days: ProviderMonthAvailabilityDayResponse[];
  loading: boolean;
  error: Error | null;
  errorMessage: string | null;
  timezone: string | null;
  maxBookableDate: string | null;
  refetch: ReturnType<typeof useProviderMonthAvailability>['refetch'];
}

export function useCareMonthAvailability(
  providerId: string | undefined,
  year: number,
  month: number,
  serviceIds: string[],
  options?: CareMonthAvailabilityOptions,
): UseCareMonthAvailabilityResult {
  const errorFallback = options?.errorFallback ?? 'Unable to load availability.';
  const availabilityParams = useMemo(() => {
    if (serviceIds.length === 0) {
      return null;
    }

    return {
      year,
      month,
      serviceIds: [...serviceIds],
    };
  }, [month, serviceIds, year]);

  const { data, loading, error, refetch } = useProviderMonthAvailability(
    providerId,
    availabilityParams,
    { pollingEnabled: options?.pollingEnabled },
  );
  const monthError = availabilityParams && error instanceof Error ? error : null;
  const errorMessage = useMemo(
    () => (monthError ? getApiErrorMessage(monthError, errorFallback) : null),
    [errorFallback, monthError],
  );

  return {
    days: availabilityParams ? (data?.days ?? []) : [],
    loading: Boolean(availabilityParams && loading),
    error: monthError,
    errorMessage,
    timezone: availabilityParams ? (data?.timezone ?? null) : null,
    maxBookableDate: availabilityParams ? (data?.maxBookableDate ?? null) : null,
    refetch,
  };
}
