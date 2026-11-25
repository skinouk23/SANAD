/**
 * useBookingQuote — backend-authoritative quote query wrapper.
 *
 * Fetches a booking quote only when the payment-step request payload is ready
 * and exposes a small UI-facing state shape for booking pages.
 */

import { useQuery } from '@tanstack/react-query';
import { bookingQuoteOptions } from '@/features/bookings/options';
import type { BookingQuoteRequest, BookingQuoteResponse } from '@/features/bookings/schema';

export function useBookingQuote(request: BookingQuoteRequest | null) {
  const { data, isLoading, error, refetch } = useQuery(bookingQuoteOptions(request));
  const quote: BookingQuoteResponse | undefined = data;

  return {
    quote,
    quoteLoading: isLoading,
    quoteError: error,
    refetchQuote: refetch,
  };
}
