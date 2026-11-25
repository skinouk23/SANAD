import { useCallback, useMemo, useState } from 'react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useCancelBookingSession,
  usePastAppointmentSessions,
  useRateAppointment,
  useUpcomingAppointmentSessions,
} from '@/features/bookings';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import { isHistoryBookingStatus, normalizeBookingStatus } from '@/features/bookings/status';
import {
  getErrorMessage,
  groupAppointmentsByBooking,
  toAppointmentFromSession,
  type AppointmentGroup,
} from '@/features/patient/appointments/patientAppointments.utils';

export type PatientAppointmentsTab = 'appointments' | 'history';

export interface PatientAppointmentsScreenViewModel {
  actionError: string | null;
  actionMessage: string | null;
  activeTab: PatientAppointmentsTab;
  actionableUpcomingAppointments: BookingListItemResponse[];
  actionableUpcomingGroups: AppointmentGroup[];
  cancelling: boolean;
  detailsModalOpen: string | null;
  historyAppointments: BookingListItemResponse[];
  historyGroups: AppointmentGroup[];
  historyError: unknown;
  historyLoading: boolean;
  isFavorite: (id: string) => boolean;
  rating: boolean;
  ratingModalOpen: string | null;
  reviewComment: string;
  selectedAppointment: BookingListItemResponse | null;
  selectedRating: number;
  text: ReturnType<typeof useLanguage>['t'];
  trackingModalOpen: string | null;
  upcomingError: unknown;
  upcomingLoading: boolean;
  onCall: (appointment: BookingListItemResponse) => void;
  onCancelAppointment: (appointmentId: string) => Promise<void>;
  onCloseDetails: () => void;
  onCloseRating: () => void;
  onCloseTracking: () => void;
  onOpenDetails: (appointmentId: string) => void;
  onOpenRating: (appointmentId: string) => void;
  onOpenTracking: (appointmentId: string) => void;
  onReviewCommentChange: (value: string) => void;
  onRetryHistory: () => void;
  onRetryUpcoming: () => void;
  onSelectedRatingChange: (value: number) => void;
  onSetActiveTab: (tab: PatientAppointmentsTab) => void;
  onSubmitRating: () => Promise<void>;
  onToggleFavorite: (id: string) => void;
}

function updateRatedAppointment(
  appointments: BookingListItemResponse[],
  appointmentId: string,
  rating: number,
  reviewComment: string,
): BookingListItemResponse[] {
  return appointments.map((appointment) =>
    appointment.id === appointmentId || appointment.sessionId === appointmentId
      ? {
          ...appointment,
          rating,
          reviewComment: reviewComment.trim() || appointment.reviewComment,
        }
      : appointment,
  );
}

export function usePatientAppointmentsScreen(): PatientAppointmentsScreenViewModel {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PatientAppointmentsTab>('appointments');
  const [ratingModalOpen, setRatingModalOpen] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trackingModalOpen, setTrackingModalOpen] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [locallyRatedAppointments, setLocallyRatedAppointments] = useState<
    Record<string, { rating: number; reviewComment: string }>
  >({});

  const {
    data: upcomingSessions,
    loading: upcomingSessionsLoading,
    error: upcomingSessionsError,
    refetch: refetchUpcomingSessions,
  } = useUpcomingAppointmentSessions();
  const {
    data: pastSessions,
    loading: pastSessionsLoading,
    error: pastSessionsError,
    refetch: refetchPastSessions,
  } = usePastAppointmentSessions();
  const { mutateAsync: cancelSession, loading: cancellingSession } = useCancelBookingSession();
  const { mutateAsync: rateAppointment, loading: rating } = useRateAppointment();

  const upcomingLoading = upcomingSessionsLoading;
  const historyLoading = pastSessionsLoading;
  const upcomingError = upcomingSessionsError;
  const historyError = pastSessionsError;

  const actionableUpcomingAppointments = useMemo(
    () => upcomingSessions.map(toAppointmentFromSession),
    [upcomingSessions],
  );
  const historyAppointments = useMemo(() => {
    const sourceAppointments = (pastSessions ?? [])
      .map(toAppointmentFromSession)
      .filter((appointment) => isHistoryBookingStatus(appointment.status));

    return Object.entries(locallyRatedAppointments).reduce(
      (appointments, [appointmentId, localRating]) =>
        updateRatedAppointment(
          appointments,
          appointmentId,
          localRating.rating,
          localRating.reviewComment,
        ),
      sourceAppointments,
    );
  }, [locallyRatedAppointments, pastSessions]);
  const actionableUpcomingGroups = useMemo(
    () => groupAppointmentsByBooking(actionableUpcomingAppointments),
    [actionableUpcomingAppointments],
  );
  const historyGroups = useMemo(
    () => groupAppointmentsByBooking(historyAppointments),
    [historyAppointments],
  );
  const selectedAppointment = useMemo(
    () =>
      detailsModalOpen
        ? (actionableUpcomingAppointments.find(
            (appointment) => appointment.id === detailsModalOpen,
          ) ?? null)
        : null,
    [actionableUpcomingAppointments, detailsModalOpen],
  );

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(id)
        ? currentFavorites.filter((favoriteId) => favoriteId !== id)
        : [...currentFavorites, id],
    );
  }, []);

  const handleCall = useCallback((appointment: BookingListItemResponse) => {
    setActionError(null);

    if (appointment.provider?.phone) {
      window.location.href = `tel:${appointment.provider.phone}`;
      return;
    }

    setActionMessage(
      `${appointment.provider?.name || 'Le professionnel'} n'a pas de numero disponible pour le moment.`,
    );
  }, []);

  const handleCancelAppointment = useCallback(
    async (appointmentId: string) => {
      setActionMessage(null);
      setActionError(null);

      try {
        const appointment = [...actionableUpcomingAppointments, ...historyAppointments].find(
          (item) => item.id === appointmentId,
        );
        if (!appointment?.sessionId) {
          throw new Error('Session ID is required to cancel this appointment.');
        }

        await cancelSession({
          sessionId: appointment.sessionId,
          data: { cancellationReason: 'Annule par le patient' },
        });

        setDetailsModalOpen(null);
      } catch (error) {
        setActionError(getErrorMessage(error));
      }
    },
    [actionableUpcomingAppointments, cancelSession, historyAppointments],
  );

  const handleSubmitRating = useCallback(async () => {
    if (!ratingModalOpen || selectedRating === 0) {
      return;
    }

    setActionMessage(null);
    setActionError(null);

    try {
      const appointment = historyAppointments.find(
        (item) => item.id === ratingModalOpen || item.sessionId === ratingModalOpen,
      );

      if (!appointment?.sessionId) {
        throw new Error('Session ID is required to rate this appointment.');
      }

      const sessionId = appointment.sessionId;

      await rateAppointment({
        sessionId,
        rating: selectedRating,
        review: reviewComment.trim() || undefined,
      });
      setLocallyRatedAppointments((current) => ({
        ...current,
        [sessionId]: {
          rating: selectedRating,
          reviewComment,
        },
      }));
      setRatingModalOpen(null);
      setSelectedRating(0);
      setReviewComment('');
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }, [ratingModalOpen, historyAppointments, rateAppointment, reviewComment, selectedRating]);

  return {
    actionError,
    actionMessage,
    activeTab,
    actionableUpcomingAppointments,
    actionableUpcomingGroups,
    cancelling: cancellingSession,
    detailsModalOpen,
    historyAppointments,
    historyGroups,
    historyError,
    historyLoading,
    isFavorite: (id: string) => favorites.includes(id),
    rating,
    ratingModalOpen,
    reviewComment,
    selectedAppointment,
    selectedRating,
    text: t,
    trackingModalOpen,
    upcomingError,
    upcomingLoading,
    onCall: handleCall,
    onCancelAppointment: handleCancelAppointment,
    onCloseDetails: () => {
      setDetailsModalOpen(null);
    },
    onCloseRating: () => {
      setRatingModalOpen(null);
      setSelectedRating(0);
      setReviewComment('');
    },
    onCloseTracking: () => {
      setTrackingModalOpen(null);
    },
    onOpenDetails: setDetailsModalOpen,
    onOpenRating: setRatingModalOpen,
    onOpenTracking: setTrackingModalOpen,
    onReviewCommentChange: setReviewComment,
    onRetryHistory: () => {
      void refetchPastSessions();
    },
    onRetryUpcoming: () => {
      void refetchUpcomingSessions();
    },
    onSelectedRatingChange: setSelectedRating,
    onSetActiveTab: setActiveTab,
    onSubmitRating: handleSubmitRating,
    onToggleFavorite: handleToggleFavorite,
  };
}

export function isRatedAppointment(appointment: BookingListItemResponse): boolean {
  return Boolean(appointment.rating && appointment.rating > 0);
}

export function canRateAppointment(appointment: BookingListItemResponse): boolean {
  return (
    normalizeBookingStatus(appointment.status ?? '') === 'Validated' &&
    !isRatedAppointment(appointment)
  );
}
