import { useEffect, useMemo, useState } from 'react';
import { useCancelBookingSession, useConfirmBookingSession } from '@/features/bookings';
import {
  useCreateProviderUnavailability,
  useDeleteProviderUnavailability,
  useMyProviderPlanning,
  useMyProviderProfile,
  useMyProviderSchedules,
  useReplaceProviderSchedules,
} from '@/features/providers/hooks';
import type { UpsertProviderScheduleInterval } from '@/features/providers/schema';
import type {
  CalendarAppointment,
  ScheduleEditorDay,
  SchedulePlanningLabels,
  ViewMode,
} from '@/features/providers/schedule-planning/types';
import {
  addDays,
  buildScheduleEditorDays,
  buildScheduleStats,
  createDefaultInterval,
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  enumerateDates,
  expandBookings,
  expandUnavailabilities,
  formatDateTitle,
  getMonthGrid,
  getStartOfWeek,
  startOfDay,
  toIsoDate,
  toLocalDateTimeString,
} from '@/features/providers/schedule-planning/utils';
import { showErrorToast } from '@/shared/lib/notifications/toast';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export interface UseProviderSchedulePlanningOptions {
  labels: SchedulePlanningLabels;
  locale: string;
}

type BookingActionType = 'approve' | 'reject' | null;

export function useProviderSchedulePlanning({
  labels,
  locale,
}: UseProviderSchedulePlanningOptions) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [blockDate, setBlockDate] = useState(toIsoDate(startOfDay(new Date())));
  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('10:00');
  const [blockReason, setBlockReason] = useState('');
  const [scheduleEditorDays, setScheduleEditorDays] = useState<ScheduleEditorDay[]>([]);
  const [appointmentActionError, setAppointmentActionError] = useState<string | null>(null);
  const [blockMutationError, setBlockMutationError] = useState<string | null>(null);
  const [scheduleMutationError, setScheduleMutationError] = useState<string | null>(null);
  const [activeBookingActionId, setActiveBookingActionId] = useState<string | null>(null);
  const [activeBookingActionType, setActiveBookingActionType] = useState<BookingActionType>(null);
  const [activeBlockedSlotId, setActiveBlockedSlotId] = useState<string | null>(null);

  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  const visibleRange = useMemo(() => {
    if (viewMode === 'day') {
      const day = startOfDay(currentDate);
      return { from: day, to: day };
    }

    if (viewMode === 'week') {
      const from = getStartOfWeek(currentDate);
      return { from, to: addDays(from, 6) };
    }

    return { from: monthGrid.start, to: monthGrid.end };
  }, [currentDate, monthGrid.end, monthGrid.start, viewMode]);

  const planningParams = useMemo(
    () => ({
      from: toIsoDate(visibleRange.from),
      to: toIsoDate(visibleRange.to),
    }),
    [visibleRange.from, visibleRange.to],
  );

  const { data: profile } = useMyProviderProfile();
  const {
    data: planning,
    loading: planningLoading,
    error: planningError,
    refetch: refetchPlanning,
  } = useMyProviderPlanning(planningParams);
  const {
    data: schedules,
    loading: schedulesLoading,
    error: schedulesError,
    refetch: refetchSchedules,
  } = useMyProviderSchedules({ enabled: showAvailabilityModal });

  const { mutateAsync: confirmBookingSession, loading: confirmLoading } =
    useConfirmBookingSession();
  const { mutateAsync: cancelBookingSession, loading: declineLoading } = useCancelBookingSession();
  const { mutateAsync: replaceSchedules, loading: savingSchedules } = useReplaceProviderSchedules();
  const { mutateAsync: createUnavailability, loading: creatingUnavailability } =
    useCreateProviderUnavailability();
  const { mutateAsync: deleteUnavailability, loading: deletingUnavailability } =
    useDeleteProviderUnavailability();

  useEffect(() => {
    if (!showAvailabilityModal) {
      return;
    }

    setScheduleMutationError(null);
    setScheduleEditorDays(buildScheduleEditorDays(schedules));
  }, [schedules, showAvailabilityModal]);

  useEffect(() => {
    if (!showBlockModal) {
      return;
    }

    setBlockDate(toIsoDate(startOfDay(currentDate)));
    setBlockMutationError(null);
  }, [currentDate, showBlockModal]);

  const appointments = useMemo(
    () =>
      expandBookings(
        planning?.bookings ?? [],
        visibleRange.from,
        visibleRange.to,
        locale,
        profile?.userId,
        labels.teleconsultation,
        labels.commonNoData,
      ),
    [
      labels.commonNoData,
      labels.teleconsultation,
      locale,
      planning?.bookings,
      profile?.userId,
      visibleRange.from,
      visibleRange.to,
    ],
  );

  const blockedSlots = useMemo(
    () =>
      expandUnavailabilities(
        planning?.unavailabilities ?? [],
        visibleRange.from,
        visibleRange.to,
        labels.slotBlocked,
      ),
    [labels.slotBlocked, planning?.unavailabilities, visibleRange.from, visibleRange.to],
  );

  const focusDate = useMemo(() => startOfDay(currentDate), [currentDate]);

  const blockedList = useMemo(
    () =>
      [...(planning?.unavailabilities ?? [])]
        .filter((blockedSlot) => new Date(blockedSlot.endDatetime) >= focusDate)
        .sort(
          (left, right) =>
            new Date(left.startDatetime).getTime() - new Date(right.startDatetime).getTime(),
        ),
    [focusDate, planning?.unavailabilities],
  );

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const appointmentDate = startOfDay(appointment.date);

        return (
          appointmentDate >= focusDate &&
          appointment.status !== 'cancelled' &&
          appointment.status !== 'rejected' &&
          appointment.status !== 'completed'
        );
      })
      .slice(0, 4);
  }, [appointments, focusDate]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, CalendarAppointment[]>();

    for (const appointment of appointments) {
      const key = toIsoDate(appointment.date);
      const currentItems = map.get(key) ?? [];
      currentItems.push(appointment);
      map.set(key, currentItems);
    }

    return map;
  }, [appointments]);

  const blockedByDate = useMemo(() => {
    const map = new Map<string, (typeof blockedSlots)[number][]>();

    for (const blockedSlot of blockedSlots) {
      const key = toIsoDate(blockedSlot.date);
      const currentItems = map.get(key) ?? [];
      currentItems.push(blockedSlot);
      map.set(key, currentItems);
    }

    return map;
  }, [blockedSlots]);

  const weekDays = useMemo(
    () => enumerateDates(visibleRange.from, visibleRange.to),
    [visibleRange.from, visibleRange.to],
  );

  const todayAppointmentsCount = useMemo(() => {
    const todayKey = toIsoDate(new Date());
    return appointmentsByDate.get(todayKey)?.length ?? 0;
  }, [appointmentsByDate]);

  const stats = useMemo(
    () =>
      buildScheduleStats(
        appointments,
        planning?.unavailabilities?.length ?? 0,
        todayAppointmentsCount,
        {
          blocked: labels.blocked,
          today: labels.today,
          confirmed: labels.confirmed,
          pending: labels.pending,
        },
      ),
    [
      appointments,
      labels.blocked,
      labels.confirmed,
      labels.pending,
      labels.today,
      planning?.unavailabilities?.length,
      todayAppointmentsCount,
    ],
  );

  const timeSlots = useMemo(
    () =>
      Array.from(
        { length: (DAY_END_MINUTES - DAY_START_MINUTES) / 30 },
        (_, index) => DAY_START_MINUTES + index * 30,
      ),
    [],
  );

  const invalidScheduleIntervalIds = useMemo(() => {
    return new Set(
      scheduleEditorDays.flatMap((day) =>
        day.enabled
          ? day.intervals
              .filter((interval) => interval.startTime >= interval.endTime)
              .map((interval) => interval.localId)
          : [],
      ),
    );
  }, [scheduleEditorDays]);

  const planningInitialLoadError = planningError && !planning;
  const hasVisibleEntries = appointments.length > 0 || blockedSlots.length > 0;
  const selectedDateKey = toIsoDate(currentDate);
  const dayAppointments = appointmentsByDate.get(selectedDateKey) ?? [];
  const dayBlockedSlots = blockedByDate.get(selectedDateKey) ?? [];
  const selectedDateTitle = currentDate.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const goToToday = () => setCurrentDate(startOfDay(new Date()));

  const goToPrevious = () => {
    const nextDate = new Date(currentDate);

    if (viewMode === 'day') {
      nextDate.setDate(nextDate.getDate() - 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(nextDate.getDate() - 7);
    } else {
      nextDate.setMonth(nextDate.getMonth() - 1);
    }

    setCurrentDate(startOfDay(nextDate));
  };

  const goToNext = () => {
    const nextDate = new Date(currentDate);

    if (viewMode === 'day') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    setCurrentDate(startOfDay(nextDate));
  };

  const approveAppointment = async (id: string) => {
    setAppointmentActionError(null);
    setActiveBookingActionId(id);
    setActiveBookingActionType('approve');

    try {
      await confirmBookingSession(id);
    } catch (error) {
      const message = getApiErrorMessage(error, labels.commonError);
      setAppointmentActionError(message);
      showErrorToast(error, labels.commonError);
    } finally {
      setActiveBookingActionId(null);
      setActiveBookingActionType(null);
    }
  };

  const rejectAppointment = async (id: string) => {
    setAppointmentActionError(null);
    setActiveBookingActionId(id);
    setActiveBookingActionType('reject');

    try {
      await cancelBookingSession({
        sessionId: id,
        data: { cancellationReason: 'provider_declined' },
      });
    } catch (error) {
      const message = getApiErrorMessage(error, labels.commonError);
      setAppointmentActionError(message);
      showErrorToast(error, labels.commonError);
    } finally {
      setActiveBookingActionId(null);
      setActiveBookingActionType(null);
    }
  };

  const handleBlockSlot = async () => {
    if (!blockDate || !blockStartTime || !blockEndTime) {
      return;
    }

    const startDatetime = toLocalDateTimeString(blockDate, blockStartTime);
    const endDatetime = toLocalDateTimeString(blockDate, blockEndTime);

    if (startDatetime >= endDatetime) {
      setBlockMutationError(labels.invalidTimeRange);
      showErrorToast(null, labels.invalidTimeRange);
      return;
    }

    setBlockMutationError(null);

    try {
      await createUnavailability({
        startDatetime,
        endDatetime,
        isAllDay: false,
        isRecurring: false,
        recurrenceRule: null,
        reason: blockReason.trim() || labels.slotBlocked,
        notes: null,
      });
      setShowBlockModal(false);
      setBlockReason('');
      setBlockStartTime('09:00');
      setBlockEndTime('10:00');
    } catch (error) {
      const message = getApiErrorMessage(error, labels.commonError);
      setBlockMutationError(message);
      showErrorToast(error, labels.commonError);
    }
  };

  const removeBlockedSlot = async (id: string) => {
    setBlockMutationError(null);
    setActiveBlockedSlotId(id);

    try {
      await deleteUnavailability(id);
    } catch (error) {
      const message = getApiErrorMessage(error, labels.commonError);
      setBlockMutationError(message);
      showErrorToast(error, labels.commonError);
    } finally {
      setActiveBlockedSlotId(null);
    }
  };

  const updateScheduleDay = (
    dayOfWeek: number,
    updater: (day: ScheduleEditorDay) => ScheduleEditorDay,
  ) => {
    setScheduleEditorDays((currentDays) =>
      currentDays.map((day) => (day.dayOfWeek === dayOfWeek ? updater(day) : day)),
    );
  };

  const toggleScheduleDay = (dayOfWeek: number, enabled: boolean) => {
    setScheduleMutationError(null);

    updateScheduleDay(dayOfWeek, (day) => ({
      ...day,
      enabled,
      intervals: enabled
        ? day.intervals.length > 0
          ? day.intervals
          : [createDefaultInterval()]
        : [],
    }));
  };

  const addInterval = (dayOfWeek: number) => {
    setScheduleMutationError(null);

    updateScheduleDay(dayOfWeek, (day) => ({
      ...day,
      enabled: true,
      intervals: [...day.intervals, createDefaultInterval()],
    }));
  };

  const removeInterval = (dayOfWeek: number, localId: string) => {
    setScheduleMutationError(null);

    updateScheduleDay(dayOfWeek, (day) => {
      const intervals = day.intervals.filter((interval) => interval.localId !== localId);
      return {
        ...day,
        enabled: intervals.length > 0,
        intervals,
      };
    });
  };

  const updateInterval = (
    dayOfWeek: number,
    localId: string,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setScheduleMutationError(null);

    updateScheduleDay(dayOfWeek, (day) => ({
      ...day,
      intervals: day.intervals.map((interval) =>
        interval.localId === localId
          ? {
              ...interval,
              [field]: value,
            }
          : interval,
      ),
    }));
  };

  const handleSaveAvailability = async () => {
    if (invalidScheduleIntervalIds.size > 0) {
      setScheduleMutationError(labels.invalidTimeRange);
      showErrorToast(null, labels.invalidTimeRange);
      return;
    }

    setScheduleMutationError(null);

    const payload = scheduleEditorDays.flatMap<UpsertProviderScheduleInterval>((day) => {
      if (!day.enabled) {
        return [];
      }

      return day.intervals.map((interval) => ({
        id: interval.id,
        dayOfWeek: day.dayOfWeek as UpsertProviderScheduleInterval['dayOfWeek'],
        serviceId: interval.serviceId ?? null,
        startTime: interval.startTime,
        endTime: interval.endTime,
      }));
    });

    try {
      await replaceSchedules(payload);
      setShowAvailabilityModal(false);
    } catch (error) {
      const message = getApiErrorMessage(error, labels.commonError);
      setScheduleMutationError(message);
      showErrorToast(error, labels.commonError);
    }
  };

  return {
    activeBlockedSlotId,
    activeBookingActionId,
    activeBookingActionType,
    addInterval,
    appointmentActionError,
    approveAppointment,
    appointmentsByDate,
    blockedByDate,
    blockedList,
    blockDate,
    blockEndTime,
    blockMutationError,
    blockReason,
    blockStartTime,
    confirmLoading,
    creatingUnavailability,
    currentDate,
    dayAppointments,
    dayBlockedSlots,
    declineLoading,
    deletingUnavailability,
    goToNext,
    goToPrevious,
    goToToday,
    handleBlockSlot,
    handleSaveAvailability,
    hasVisibleEntries,
    invalidScheduleIntervalIds,
    isOnline: planning?.isOnline ?? false,
    monthGrid,
    planningInitialLoadError,
    planningLoading,
    refetchPlanning,
    refetchSchedules,
    rejectAppointment,
    removeBlockedSlot,
    removeInterval,
    savingSchedules,
    scheduleEditorDays,
    scheduleMutationError,
    schedulesError,
    schedulesLoading,
    selectedDateTitle,
    setBlockDate,
    setBlockEndTime,
    setBlockReason,
    setBlockStartTime,
    setCurrentDate,
    setShowAvailabilityModal,
    setShowBlockModal,
    setViewMode,
    showAvailabilityModal,
    showBlockModal,
    stats,
    timeSlots,
    title: formatDateTitle(viewMode, currentDate, visibleRange, locale),
    toggleScheduleDay,
    upcomingAppointments,
    updateInterval,
    viewMode,
    visibleRange,
    weekDays,
  };
}
