/**
 * Single Booking Detail Hook (TanStack Query)
 */

import { useQuery } from '@tanstack/react-query';
import {
  bookingDetailOptions,
  bookingProviderSessionDeliveryOptions,
  bookingSessionDetailOptions,
} from '@/features/bookings/options';

/**
 * Fetch a single booking by ID.
 * Returns BookingResponse | null — same shape as the old useAppointment.
 */
export function useAppointment(appointmentId: string | undefined, silentError = false) {
  const query = useQuery({
    ...bookingDetailOptions(appointmentId ?? '', silentError),
    enabled: !!appointmentId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch a single booking session by ID.
 */
export function useBookingSession(sessionId: string | undefined, silentError = false) {
  const query = useQuery({
    ...bookingSessionDetailOptions(sessionId ?? '', silentError),
    enabled: !!sessionId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch provider delivery aggregate details for a booking session.
 */
export function useProviderSessionDeliveryBooking(
  sessionId: string | undefined,
  silentError = false,
) {
  const query = useQuery({
    ...bookingProviderSessionDeliveryOptions(sessionId ?? '', silentError),
    enabled: !!sessionId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
