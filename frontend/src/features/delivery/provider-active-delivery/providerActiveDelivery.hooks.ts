import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useArriveBookingSession,
  useCompleteBookingSession,
  useDisputeBookingSession,
  useMarkBookingSessionNoShow,
  useStartBookingSessionJourney,
  useStartBookingSessionService,
} from '@/features/bookings';
import { normalizeBookingStatus } from '@/features/bookings/status';
import { useProviderDelivery, type ProviderDelivery } from '@/features/delivery';
import type { ProviderDeliveryTrackingState } from '@/integrations/maps/ProviderDeliveryTrackingMap';
import { showErrorToast } from '@/shared/lib/notifications/toast';
import { useTheme } from '@/shared/lib/theme/theme-context';
import type { DateOnlyResponse, TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';
import type { ApiError } from '@/shared/schemas/api.schema';

type DeliveryStatus = 'pending' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'no_show';

export function useProviderActiveDeliveryScreen() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { t, currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const locale = currentLanguage.code === 'ar-TN' ? 'ar-TN' : currentLanguage.code;

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mapLoading, setMapLoading] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false);

  const deliveryQuery = useProviderDelivery(sessionId);
  const startJourneyMutation = useStartBookingSessionJourney();
  const arriveMutation = useArriveBookingSession();
  const startServiceMutation = useStartBookingSessionService();
  const completeMutation = useCompleteBookingSession();
  const disputeMutation = useDisputeBookingSession();
  const noShowMutation = useMarkBookingSessionNoShow();

  const deliveryStatus = useMemo<DeliveryStatus | null>(
    () => (deliveryQuery.data ? deriveDeliveryStatus(deliveryQuery.data) : null),
    [deliveryQuery.data],
  );

  const patientCoordinates = useMemo(() => {
    if (deliveryQuery.data?.location.lat == null || deliveryQuery.data.location.lng == null) {
      return null;
    }

    return {
      lat: deliveryQuery.data.location.lat,
      lng: deliveryQuery.data.location.lng,
    };
  }, [deliveryQuery.data]);

  const scheduledLabel = useMemo(() => {
    if (!deliveryQuery.data) {
      return '--';
    }

    return getScheduledDate(deliveryQuery.data).toLocaleString(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [deliveryQuery.data, locale]);

  const amountLabel = useMemo(() => {
    if (!deliveryQuery.data) {
      return '--';
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: deliveryQuery.data.currency || 'TND',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 2,
    }).format(deliveryQuery.data.totalAmount);
  }, [deliveryQuery.data, locale]);

  const statusText = useMemo(() => {
    if (!deliveryStatus) {
      return '';
    }

    switch (deliveryStatus) {
      case 'pending':
        return t.provider.deliveryPending;
      case 'en_route':
        return t.provider.deliveryEnRoute;
      case 'arrived':
        return t.provider.deliveryArrived;
      case 'in_progress':
        return t.provider.deliveryInProgress;
      case 'completed':
        return t.provider.deliveryCompleted;
      case 'no_show':
        return t.provider.deliveryMarkNoShow;
    }
  }, [deliveryStatus, t.provider]);

  const statusBadgeClassName = useMemo(() => {
    switch (deliveryStatus) {
      case 'pending':
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
      case 'en_route':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'arrived':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'in_progress':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'no_show':
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  }, [deliveryStatus]);

  const handleTrackingStateChange = useCallback((state: ProviderDeliveryTrackingState) => {
    setDistance(state.distance);
    setDuration(state.duration);
    setMapLoading(state.loading);
    setRouteError(state.routeError);
    setGeoError(state.geoError);
  }, []);

  const runMutation = async (operation: () => Promise<unknown>) => {
    try {
      await operation();
    } catch (error) {
      showErrorToast(error, t.common.error);
    }
  };

  const handleCompleteService = async (validationCode: string) => {
    if (!sessionId) {
      return;
    }

    try {
      await completeMutation.mutateAsync({
        sessionId,
        data: { validationCode },
      });
      setCompletionDialogOpen(false);
    } catch (error) {
      showErrorToast(error, t.common.error);
      throw error;
    }
  };

  const handleDisputeSession = async (disputeReason: string) => {
    if (!sessionId) {
      return;
    }

    try {
      await disputeMutation.mutateAsync({
        sessionId,
        data: { disputeReason },
      });
      setCompletionDialogOpen(false);
    } catch (error) {
      showErrorToast(error, t.common.error);
      throw error;
    }
  };

  const handleMarkNoShow = async (noShowReason?: string) => {
    if (!sessionId) {
      return;
    }

    try {
      await noShowMutation.mutateAsync({
        sessionId,
        data: { noShowReason: noShowReason?.trim() || 'PatientNoShow' },
      });
      setNoShowDialogOpen(false);
    } catch (error) {
      showErrorToast(error, t.common.error);
      throw error;
    }
  };

  return {
    amountLabel,
    completionDialogOpen,
    delivery: deliveryQuery.data,
    deliveryErrorStatus: getErrorStatus(deliveryQuery.error),
    deliveryStatus,
    distance,
    duration,
    error: deliveryQuery.error,
    geoError,
    handleArrived: () =>
      sessionId ? runMutation(() => arriveMutation.mutateAsync(sessionId)) : Promise.resolve(),
    handleCall: () => {
      if (!deliveryQuery.data?.patientPhone) {
        showErrorToast(null, t.provider.deliveryNoPhone);
        return;
      }

      window.location.href = `tel:${deliveryQuery.data.patientPhone}`;
    },
    handleCloseCompletionDialog: () => setCompletionDialogOpen(false),
    handleCompleteService,
    handleDisputeSession,
    handleMessage: () => navigate('/messages'),
    handleCloseNoShowDialog: () => setNoShowDialogOpen(false),
    handleMarkNoShow,
    handleOpenCompletionDialog: () => setCompletionDialogOpen(true),
    handleOpenNoShowDialog: () => setNoShowDialogOpen(true),
    handleStartJourney: () =>
      sessionId
        ? runMutation(() => startJourneyMutation.mutateAsync(sessionId))
        : Promise.resolve(),
    handleStartService: () =>
      sessionId
        ? runMutation(() => startServiceMutation.mutateAsync(sessionId))
        : Promise.resolve(),
    handleTrackingStateChange,
    isDark,
    isMutationPending:
      startJourneyMutation.loading ||
      arriveMutation.loading ||
      startServiceMutation.loading ||
      completeMutation.loading ||
      disputeMutation.loading ||
      noShowMutation.loading,
    loading: deliveryQuery.loading,
    mapLoading,
    mutateStates: {
      arriveLoading: arriveMutation.loading,
      completeLoading: completeMutation.loading,
      disputeLoading: disputeMutation.loading,
      noShowLoading: noShowMutation.loading,
      startJourneyLoading: startJourneyMutation.loading,
      startServiceLoading: startServiceMutation.loading,
    },
    noShowDialogOpen,
    patientCoordinates,
    refetch: () => void deliveryQuery.refetch(),
    routeError,
    scheduledLabel,
    sessionId,
    statusBadgeClassName,
    statusText,
    t,
  };
}

function parseDateOnly(value: DateOnlyResponse): Date {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value.year, value.month - 1, value.day);
}

function parseTimeSpanToParts(value: TimeOnlyResponse | TimeSpanResponse) {
  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    const [hours, minutes] = timePart.split(':').map(Number);
    return { hours, minutes };
  }

  if ('hour' in value) {
    return {
      hours: value.hour,
      minutes: value.minute,
    };
  }

  return {
    hours: value.hours ?? 0,
    minutes: value.minutes ?? 0,
  };
}

function getScheduledDate(delivery: ProviderDelivery): Date {
  const baseDate = parseDateOnly(delivery.scheduledDate ?? delivery.startDate);
  const time = parseTimeSpanToParts(delivery.scheduledStartTime ?? delivery.dailyStartTime);
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    time.hours,
    time.minutes,
  );
}

function deriveDeliveryStatus(delivery: ProviderDelivery): DeliveryStatus {
  const normalizedStatus = normalizeBookingStatus(delivery.status ?? '');

  if (normalizedStatus === 'NoShow' || delivery.noShowAt) {
    return 'no_show';
  }

  if (normalizedStatus === 'Completed' || normalizedStatus === 'Validated') {
    return 'completed';
  }

  if (normalizedStatus === 'InProgress' || delivery.serviceStartedAt) {
    return 'in_progress';
  }

  if (normalizedStatus === 'Arrived' || delivery.providerArrivedAt) {
    return 'arrived';
  }

  if (normalizedStatus === 'ProviderOnWay') {
    return 'en_route';
  }

  if (normalizedStatus === 'Confirmed') {
    if (delivery.providerDepartedAt && !delivery.providerArrivedAt) {
      return 'en_route';
    }

    if (delivery.providerArrivedAt) {
      return 'arrived';
    }

    return 'pending';
  }

  return 'pending';
}

function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const { statusCode } = error as Partial<ApiError>;
    return typeof statusCode === 'number' ? statusCode : null;
  }

  return null;
}
