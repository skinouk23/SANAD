/**
 * Booking Hooks — barrel export
 *
 * Re-export booking domain hooks from sub-modules.
 */

// Fetch hooks
export {
  useAppointments,
  usePaginatedAppointments,
  useUpcomingAppointments,
  useUpcomingAppointmentSessions,
  useTodayAppointments,
  useProviderDashboardTodayBookings,
  usePastAppointments,
  usePastAppointmentSessions,
  useAppointmentStats,
  useBookingSessions,
  usePaginatedBookingSessions,
} from './useBookings';

// Detail hook
export { useAppointment, useBookingSession, useProviderSessionDeliveryBooking } from './useBooking';

// Mutation hooks
export {
  useCreateAppointment,
  useUpdateAppointment,
  useConfirmAppointment,
  useDeclineAppointment,
  useConfirmBookingSession,
  useStartBookingSessionJourney,
  useArriveBookingSession,
  useStartBookingSessionService,
  useCompleteBookingSession,
  useDisputeBookingSession,
  useCancelBookingSession,
  useMarkBookingSessionNoShow,
  useCancelAppointment,
  useRateAppointment,
} from './useBookingMutations';

// Submission orchestration hooks
export { useBookingSubmission } from './useBookingSubmission';
export { useBookingQuote } from './useBookingQuote';
export { useCareAvailability, useCareAvailability as useAvailability } from './useCareAvailability';
export {
  useCareMonthAvailability,
  useCareMonthAvailability as useMonthAvailability,
} from './useCareMonthAvailability';

// UI helper hooks
export {
  formatBookingPaymentMethodLabel,
  getBookingPaymentDisplay,
  normalizeBookingPaymentStatus,
  useAppointmentStatus,
  useAppointmentDateTime,
  useBookingPaymentDisplay,
} from './useBookingHelpers';
export type { BookingPaymentDisplay, BookingPaymentDisplayInput } from './useBookingHelpers';
export { useServiceLocationChoice } from './useServiceLocationChoice';
export type { ServiceLocation } from './useServiceLocationChoice';
export { usePatientBookingAddressPrefill } from './usePatientBookingAddressPrefill';

// Booking page provider resolution
export { useBookingProvider } from './useBookingProvider';
