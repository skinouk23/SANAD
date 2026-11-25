/**
 * useBookingSubmission — shared booking creation orchestration.
 *
 * Wraps the base create-booking mutation with UI-facing state used across
 * booking flows: success toast feedback, provider cache invalidation, and
 * persisted booking result state for confirmation panels.
 *
 * Booking-specific conflict recovery is handled here so booking pages can
 * opt into structured actions without duplicating API error inspection.
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { bookingKeys } from '@/features/bookings/keys';
import { showErrorToast, showSuccessToast, toast } from '@/shared/lib/notifications/toast';
import { useCreateAppointment } from './useBookingMutations';
import type { ApiError } from '@/shared/schemas/api.schema';
import type { CreateBookingRequest, CreateBookingResponse } from '@/features/bookings/schema';

type BookingRecoveryDetails = ApiError['details'];

interface UseBookingSubmissionConfig {
  onSuccess?: (result: CreateBookingResponse) => void;
  onSlotConflict?: () => void;
  onPriceMismatch?: (details: BookingRecoveryDetails) => void;
  successMessage?: string;
}

interface UseBookingSubmissionResult {
  submit: (payload: CreateBookingRequest) => Promise<CreateBookingResponse | null>;
  isSubmitting: boolean;
  bookingResult: CreateBookingResponse | null;
  reset: () => void;
}

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as Partial<ApiError>;

  return typeof candidate.code === 'string' && typeof candidate.message === 'string';
}

export function useBookingSubmission(
  config?: UseBookingSubmissionConfig,
): UseBookingSubmissionResult {
  const { t } = useLanguage();
  const createBooking = useCreateAppointment({ silentError: true });
  const queryClient = useQueryClient();
  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null);

  const successMessage =
    config?.successMessage ?? t.bookingFlow.bookingSuccessMessage ?? 'Booking created successfully';
  const slotConflictMessage =
    t.bookingFlow.slotConflictMessage || 'This slot was just taken. Please pick another time.';
  const slotConflictAction = t.bookingFlow.slotConflictAction || 'Pick another time';
  const priceMismatchMessage =
    t.bookingFlow.priceMismatchMessage || 'The price changed. Refresh the quote and try again.';
  const priceMismatchAction = t.bookingFlow.priceMismatchAction || 'Refresh quote';
  const cashUnavailableRecoveryMessage =
    t.bookingFlow.cashUnavailableRecovery ||
    'Cash payment is no longer available for this time slot. Please choose another payment method.';

  const submit = async (payload: CreateBookingRequest): Promise<CreateBookingResponse | null> => {
    setBookingResult(null);

    try {
      const result = await createBooking.mutateAsync(payload);

      setBookingResult(result);
      showSuccessToast(successMessage);
      config?.onSuccess?.(result);

      return result;
    } catch (error) {
      if (isApiError(error)) {
        if (error.code === 'BOOKING_SLOT_CONFLICT') {
          toast.error(slotConflictMessage, {
            action: {
              label: slotConflictAction,
              onClick: () => {
                config?.onSlotConflict?.();
              },
            },
          });
          return null;
        }

        if (error.code === 'BOOKING_PRICE_MISMATCH') {
          toast.error(priceMismatchMessage, {
            action: {
              label: priceMismatchAction,
              onClick: () => {
                config?.onPriceMismatch?.(error.details);
              },
            },
          });
          return null;
        }

        if (error.code === 'BOOKING_CASH_UNAVAILABLE') {
          void queryClient.invalidateQueries({ queryKey: bookingKeys.quotes() });
          toast.error(cashUnavailableRecoveryMessage);
          return null;
        }
      }

      showErrorToast(error);
      return null;
    }
  };

  const reset = (): void => {
    createBooking.reset();
    setBookingResult(null);
  };

  return {
    submit,
    isSubmitting: createBooking.loading,
    bookingResult,
    reset,
  };
}
