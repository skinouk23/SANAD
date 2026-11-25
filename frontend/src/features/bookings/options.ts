/**
 * Booking Query Options
 *
 * Pre-built queryOptions for every booking query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { bookingKeys } from './keys';
import {
  getBookings,
  getBookingsPaginated,
  getBookingById,
  getBookingQuote,
  getUpcomingBookings,
  getUpcomingBookingSessions,
  getTodayBookings,
  getProviderDashboardTodayBookings,
  getPastBookings,
  getPastBookingSessions,
  getPatientStats,
  getBookingSessions,
  getBookingSessionsPaginated,
  getBookingSessionById,
  getProviderSessionDelivery,
} from './service';
import type { BookingFilters, BookingSessionFilters } from './service';
import type { BookingQuoteRequest } from './schema';

export function bookingListOptions(filters?: BookingFilters) {
  return queryOptions({
    queryKey: bookingKeys.list(filters),
    queryFn: () => getBookings(filters),
  });
}

export function bookingDetailOptions(id: string, silentError = false) {
  return queryOptions({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBookingById(id, { _silentError: silentError }),
    enabled: !!id,
  });
}

export function bookingQuoteOptions(request: BookingQuoteRequest | null) {
  return queryOptions({
    queryKey: bookingKeys.quote(request as Record<string, unknown>),
    queryFn: () => getBookingQuote(request!),
    enabled: request !== null,
    staleTime: 60 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function bookingStatsOptions() {
  return queryOptions({
    queryKey: bookingKeys.stats(),
    queryFn: () => getPatientStats(),
  });
}

export function upcomingBookingsOptions() {
  return queryOptions({
    queryKey: bookingKeys.upcoming(),
    queryFn: () => getUpcomingBookings(),
  });
}

export function upcomingBookingSessionsOptions() {
  return queryOptions({
    queryKey: bookingKeys.upcomingSessions(),
    queryFn: () => getUpcomingBookingSessions(),
    retry: false,
  });
}

export function todayBookingsOptions() {
  return queryOptions({
    queryKey: bookingKeys.today(),
    queryFn: () => getTodayBookings(),
  });
}

export function providerDashboardTodayBookingsOptions() {
  return queryOptions({
    queryKey: bookingKeys.providerDashboardToday(),
    queryFn: () => getProviderDashboardTodayBookings(),
  });
}

export function bookingSessionListOptions(filters?: BookingSessionFilters) {
  return queryOptions({
    queryKey: bookingKeys.sessionList(filters),
    queryFn: () => getBookingSessions(filters),
  });
}

export function paginatedBookingSessionsOptions(filters?: BookingSessionFilters) {
  return queryOptions({
    queryKey: [...bookingKeys.sessionList(filters), 'paginated'] as const,
    queryFn: () => getBookingSessionsPaginated(filters),
  });
}

export function bookingSessionDetailOptions(id: string, silentError = false) {
  return queryOptions({
    queryKey: bookingKeys.sessionDetail(id),
    queryFn: () => getBookingSessionById(id, { _silentError: silentError }),
    enabled: !!id,
  });
}

export function bookingProviderSessionDeliveryOptions(sessionId: string, silentError = false) {
  return queryOptions({
    queryKey: bookingKeys.providerSessionDelivery(sessionId),
    queryFn: () => getProviderSessionDelivery(sessionId, { _silentError: silentError }),
    enabled: !!sessionId,
  });
}

export function pastBookingsOptions() {
  return queryOptions({
    queryKey: bookingKeys.past(),
    queryFn: () => getPastBookings(),
  });
}

export function pastBookingSessionsOptions() {
  return queryOptions({
    queryKey: bookingKeys.pastSessions(),
    queryFn: () => getPastBookingSessions(),
    retry: false,
  });
}

export function paginatedBookingsOptions(filters?: BookingFilters) {
  return queryOptions({
    queryKey: [...bookingKeys.list(filters), 'paginated'] as const,
    queryFn: () => getBookingsPaginated(filters),
  });
}
