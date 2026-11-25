import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  bookingFinanceTimelineOptions,
  myFinanceTimelineOptions,
} from '@/features/finance-timeline/options';

import type { FinanceTimelineFilters } from '@/features/finance-timeline/service';

export function useMyFinanceTimeline(filters?: FinanceTimelineFilters) {
  const query = useQuery({
    ...myFinanceTimelineOptions(filters),
    placeholderData: keepPreviousData,
  });

  const response = query.data ?? null;

  return {
    data: response?.items ?? [],
    error: query.error,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    loading: query.isLoading,
    pagination: response?.pagination ?? null,
    refetch: query.refetch,
  };
}

export function useBookingFinanceTimeline(
  bookingId: string | null,
  filters?: Omit<FinanceTimelineFilters, 'bookingId'>,
) {
  const query = useQuery({
    ...bookingFinanceTimelineOptions(bookingId ?? '', filters),
    enabled: Boolean(bookingId),
    placeholderData: keepPreviousData,
  });

  const response = query.data ?? null;

  return {
    data: response?.items ?? [],
    error: query.error,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    loading: Boolean(bookingId) && query.isLoading,
    pagination: response?.pagination ?? null,
    refetch: query.refetch,
  };
}
