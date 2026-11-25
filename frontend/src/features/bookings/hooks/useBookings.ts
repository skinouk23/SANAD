/**
 * Booking Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 */

import { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  isCompletedBookingStatus,
  isUpcomingBooking,
  isUpcomingBookingStatus,
} from '@/features/bookings/status';
import {
  bookingListOptions,
  bookingStatsOptions,
  upcomingBookingsOptions,
  todayBookingsOptions,
  providerDashboardTodayBookingsOptions,
  pastBookingsOptions,
  upcomingBookingSessionsOptions,
  pastBookingSessionsOptions,
  paginatedBookingsOptions,
  bookingSessionListOptions,
  paginatedBookingSessionsOptions,
} from '@/features/bookings/options';
import type { BookingFilters, BookingSessionFilters } from '@/features/bookings/service';
import type {
  BookingListItemResponse,
  BookingSessionListItemResponse,
  GetBookingsResponse,
  GetBookingSessionsResponse,
} from '@/features/bookings/schema';
import type { TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';

function getSessionSortDateTime(session: BookingSessionListItemResponse): string {
  const scheduledDate =
    typeof session.scheduledDate === 'string'
      ? session.scheduledDate
      : `${session.scheduledDate.year}-${String(session.scheduledDate.month).padStart(2, '0')}-${String(session.scheduledDate.day).padStart(2, '0')}`;

  return `${scheduledDate}T${normalizeSortTime(session.scheduledStartTime)}`;
}

function normalizeSortTime(value: TimeOnlyResponse | TimeSpanResponse): string {
  if (typeof value === 'string') {
    return value.length === 5 ? `${value}:00` : value;
  }

  if ('hour' in value) {
    const hours = String(value.hour).padStart(2, '0');
    const minutes = String(value.minute).padStart(2, '0');
    const seconds = String(value.second ?? 0).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  const hours = String(value.hours ?? 0).padStart(2, '0');
  const minutes = String(value.minutes ?? 0).padStart(2, '0');
  const seconds = String(value.seconds ?? 0).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

// ============================================
// LIST HOOKS
// ============================================

/**
 * Fetch a flat list of bookings, optionally filtered.
 * Returns BookingListItemResponse[] — same shape as the old useAppointments.
 */
export function useAppointments(filters?: BookingFilters) {
  const query = useQuery(bookingListOptions(filters));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Server-paginated bookings.
 * Uses keepPreviousData so the UI doesn't flash empty on page changes.
 */
export function usePaginatedAppointments(initialFilters?: BookingFilters) {
  const query = useQuery({
    ...paginatedBookingsOptions(initialFilters),
    placeholderData: keepPreviousData,
  });

  const result: GetBookingsResponse | null = query.data ?? null;

  return {
    data: result?.items ?? [],
    pagination: result?.pagination ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch a flat list of booking sessions, optionally filtered.
 */
export function useBookingSessions(filters?: BookingSessionFilters) {
  const query = useQuery(bookingSessionListOptions(filters));

  return {
    data: query.data ?? ([] as BookingSessionListItemResponse[]),
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Server-paginated booking sessions.
 */
export function usePaginatedBookingSessions(initialFilters?: BookingSessionFilters) {
  const query = useQuery({
    ...paginatedBookingSessionsOptions(initialFilters),
    placeholderData: keepPreviousData,
  });

  const result: GetBookingSessionsResponse | null = query.data ?? null;

  return {
    data: result?.items ?? [],
    pagination: result?.pagination ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Upcoming bookings for a user, sorted by scheduledAt ascending.
 */
export function useUpcomingAppointments() {
  const query = useQuery(upcomingBookingsOptions());

  const sortedData = useMemo(() => {
    if (!query.data) return [] as BookingListItemResponse[];
    return [...query.data].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  }, [query.data]);

  return {
    data: sortedData,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Upcoming booking sessions for a patient, sorted by session scheduledAt ascending.
 */
export function useUpcomingAppointmentSessions() {
  const query = useQuery(upcomingBookingSessionsOptions());

  const sortedData = useMemo(() => {
    if (!query.data) return [] as BookingSessionListItemResponse[];
    return [...query.data].sort(
      (a, b) =>
        new Date(getSessionSortDateTime(a)).getTime() -
        new Date(getSessionSortDateTime(b)).getTime(),
    );
  }, [query.data]);

  return {
    data: sortedData,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Today's bookings for a provider, with grouping by status.
 */
export function useTodayAppointments() {
  const query = useQuery(todayBookingsOptions());

  const sortedData = useMemo(() => {
    if (!query.data) return [] as BookingListItemResponse[];
    return [...query.data].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  }, [query.data]);
  const initialLoadError = query.data === undefined ? query.error : null;

  const grouped = useMemo(() => {
    const completed = sortedData.filter((a) => isCompletedBookingStatus(a.status));
    const upcoming = sortedData.filter(
      (a) => isUpcomingBookingStatus(a.status) || isUpcomingBooking(a),
    );
    return { completed, upcoming, all: sortedData };
  }, [sortedData]);

  return {
    data: sortedData,
    grouped,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    initialLoadError,
    refetch: query.refetch,
  };
}

/**
 * Today's bookings for the provider dashboard, using the dedicated backend-safe endpoint.
 */
export function useProviderDashboardTodayBookings() {
  const query = useQuery(providerDashboardTodayBookingsOptions());

  const sortedData = useMemo(() => {
    if (!query.data) return [] as BookingListItemResponse[];
    return [...query.data].sort((a, b) =>
      normalizeSortTime(a.dailyStartTime).localeCompare(normalizeSortTime(b.dailyStartTime)),
    );
  }, [query.data]);
  const initialLoadError = query.data === undefined ? query.error : null;

  const grouped = useMemo(() => {
    const completed = sortedData.filter((a) => isCompletedBookingStatus(a.status));
    const upcoming = sortedData.filter(
      (a) => isUpcomingBookingStatus(a.status) || isUpcomingBooking(a),
    );
    return { completed, upcoming, all: sortedData };
  }, [sortedData]);

  return {
    data: sortedData,
    grouped,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    initialLoadError,
    refetch: query.refetch,
  };
}

/**
 * Past bookings for a user.
 */
export function usePastAppointments() {
  const query = useQuery(pastBookingsOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Historical booking sessions for a patient.
 */
export function usePastAppointmentSessions() {
  const query = useQuery(pastBookingSessionsOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Booking statistics (total, completed, pending, etc.).
 */
export function useAppointmentStats() {
  const query = useQuery(bookingStatsOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
