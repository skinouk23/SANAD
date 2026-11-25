import { AlertCircle, Ban, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { normalizeBookingStatus, normalizeBookingStatusKey } from '@/features/bookings/status';
import type { BookingSessionListItemResponse } from '@/features/bookings/schema';
import type {
  ProviderPlanningBookingResponse,
  ProviderScheduleInterval,
  ProviderUnavailabilityResponse,
} from '@/features/providers/schema';
import type { DateOnlyResponse, TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';
import type {
  AppointmentStatus,
  AppointmentStatusLabels,
  AppointmentType,
  CalendarAppointment,
  CalendarBlockedInterval,
  ScheduleEditorDay,
  ScheduleEditorInterval,
  ViewMode,
} from '@/features/providers/schedule-planning/types';
import type { ScheduleStat } from '@/features/providers/schedule-planning/types';

export const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0] as const;
export const DAY_START_MINUTES = 8 * 60;
export const DAY_END_MINUTES = 20 * 60;
export const SLOT_MINUTES = 30;
export const SLOT_HEIGHT = 56;
export const TIME_COLUMN_WIDTH = 64;

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateOnly(value: DateOnlyResponse): Date {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value.year, value.month - 1, value.day);
}

export function parseTimeOnly(value: TimeOnlyResponse): string {
  if (typeof value === 'string') {
    return value.slice(0, 5);
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
}

export function toLocalDateTimeString(date: string, time: string): string {
  return `${date}T${time.length === 5 ? `${time}:00` : time}`;
}

export function parseTimeSpanToMinutes(value: TimeSpanResponse | TimeOnlyResponse): number {
  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    const [hours, minutes] = timePart.split(':').map(Number);
    return hours * 60 + minutes;
  }

  if ('hour' in value) {
    return value.hour * 60 + value.minute;
  }

  return (value.hours ?? 0) * 60 + (value.minutes ?? 0);
}

export function formatMinutes(minutes: number, locale: string): string {
  const safeMinutes = Math.max(0, minutes);
  const date = new Date(2000, 0, 1, Math.floor(safeMinutes / 60), safeMinutes % 60);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), diff));
}

export function enumerateDates(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let cursor = startOfDay(start);

  while (cursor <= end) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export function clampMinutes(value: number): number {
  return Math.min(Math.max(value, DAY_START_MINUTES), DAY_END_MINUTES);
}

export function getMonthGrid(currentDate: Date) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startPadding = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -startPadding);
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      isCurrentMonth: date.getMonth() === currentDate.getMonth(),
    };
  });

  return {
    days,
    start: days[0]?.date ?? firstDay,
    end: days[days.length - 1]?.date ?? firstDay,
  };
}

export function createDefaultInterval(): ScheduleEditorInterval {
  return {
    localId: crypto.randomUUID(),
    serviceId: null,
    startTime: '08:00',
    endTime: '18:00',
  };
}

export function buildScheduleEditorDays(
  schedules: ProviderScheduleInterval[],
): ScheduleEditorDay[] {
  const grouped = new Map<number, ScheduleEditorInterval[]>();

  for (const schedule of schedules) {
    const currentIntervals = grouped.get(schedule.dayOfWeek) ?? [];
    currentIntervals.push({
      localId: schedule.id,
      id: schedule.id,
      serviceId: schedule.serviceId ?? null,
      startTime: parseTimeOnly(schedule.startTime),
      endTime: parseTimeOnly(schedule.endTime),
    });
    grouped.set(schedule.dayOfWeek, currentIntervals);
  }

  for (const intervals of grouped.values()) {
    intervals.sort((left, right) => left.startTime.localeCompare(right.startTime));
  }

  return ORDERED_DAYS.map((dayOfWeek) => {
    const intervals = grouped.get(dayOfWeek) ?? [];

    return {
      dayOfWeek,
      enabled: intervals.length > 0,
      intervals,
    };
  });
}

export function normalizeAppointmentType(type?: string | null): AppointmentType {
  const normalizedType = normalizeBookingStatusKey(type ?? '');
  return normalizedType.includes('video') || normalizedType.includes('tele') ? 'video' : 'home';
}

function isProviderDeclineReason(value?: string | null): boolean {
  const normalizedValue = normalizeBookingStatusKey(value ?? '');
  return normalizedValue === 'provider_declined' || normalizedValue === 'declined_by_provider';
}

function isDeliveryOpenSessionStatus(status: string): boolean {
  return ['Confirmed', 'ProviderOnWay', 'Arrived', 'InProgress'].includes(status);
}

export function derivePresentationStatus(
  booking: ProviderPlanningBookingResponse,
  providerUserId?: string,
): AppointmentStatus {
  const normalizedStatus = normalizeBookingStatus(booking.sessionStatus ?? booking.status ?? '');

  if (normalizedStatus === 'Cancelled') {
    const rejectedByProvider = Boolean(
      providerUserId &&
      (booking.cancelledBy === providerUserId || booking.statusChangedBy === providerUserId) &&
      (isProviderDeclineReason(booking.statusChangeReason) ||
        isProviderDeclineReason(booking.cancellationReason)),
    );

    return rejectedByProvider ? 'rejected' : 'cancelled';
  }

  if (normalizedStatus === 'NoShow') {
    return 'no_show';
  }

  if (normalizedStatus === 'Disputed') {
    return 'disputed';
  }

  if (normalizedStatus === 'Pending') {
    return 'pending';
  }

  if (normalizedStatus === 'Completed' || normalizedStatus === 'Validated') {
    return 'completed';
  }

  return 'confirmed';
}

export function canOpenDelivery(booking: ProviderPlanningBookingResponse): boolean {
  const session = pickExecutableSession(booking);
  const normalizedStatus = normalizeBookingStatus(
    session?.status ?? booking.sessionStatus ?? booking.status ?? '',
  );
  const appointmentType = normalizeAppointmentType(session?.type ?? booking.type);

  return (
    Boolean(session?.id || booking.sessionId) &&
    appointmentType === 'home' &&
    isDeliveryOpenSessionStatus(normalizedStatus)
  );
}

function getSessionScheduledAt(session: BookingSessionListItemResponse): Date {
  if (session.scheduledAt) {
    return new Date(session.scheduledAt);
  }

  const date = parseDateOnly(session.scheduledDate);
  const startMinutes = parseTimeSpanToMinutes(session.scheduledStartTime);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Math.floor(startMinutes / 60),
    startMinutes % 60,
  );
}

function pickExecutableSession(
  booking: ProviderPlanningBookingResponse,
): BookingSessionListItemResponse | null {
  const sessions = booking.sessions ?? [];

  if (sessions.length === 0) {
    return null;
  }

  const explicit = booking.sessionId
    ? sessions.find((session) => session.id === booking.sessionId)
    : null;

  if (explicit) {
    return explicit;
  }

  return (
    [...sessions].sort(
      (left, right) =>
        getSessionScheduledAt(left).getTime() - getSessionScheduledAt(right).getTime(),
    )[0] ?? null
  );
}

export function expandBookings(
  bookings: ProviderPlanningBookingResponse[],
  visibleFrom: Date,
  visibleTo: Date,
  locale: string,
  providerUserId: string | undefined,
  fallbackTeleconsultationLabel: string,
  noDataLabel: string,
): CalendarAppointment[] {
  const appointments: CalendarAppointment[] = [];

  for (const booking of bookings) {
    const sessions = booking.sessions ?? [];

    if (sessions.length > 0) {
      for (const session of sessions) {
        const sessionDate = startOfDay(parseDateOnly(session.scheduledDate));

        if (sessionDate < visibleFrom || sessionDate > visibleTo) {
          continue;
        }

        const startMinutes = parseTimeSpanToMinutes(session.scheduledStartTime);
        const durationMinutes = session.scheduledEndTime
          ? parseTimeSpanToMinutes(session.scheduledEndTime) - startMinutes
          : (booking.dailyDurationMinutes ?? 60);
        const safeDurationMinutes = Math.max(durationMinutes, SLOT_MINUTES);
        const appointmentType = normalizeAppointmentType(session.type ?? booking.type);
        const location =
          appointmentType === 'video'
            ? fallbackTeleconsultationLabel
            : session.address?.trim() || booking.address?.trim() || noDataLabel;
        const sessionStatus = normalizeBookingStatus(session.status ?? '');
        const status = derivePresentationStatus(
          {
            ...booking,
            sessionStatus: session.status ?? null,
            status: session.status ?? booking.status,
            cancelledAt: session.cancelledAt ?? booking.cancelledAt,
            cancelledBy: session.cancelledBy ?? booking.cancelledBy,
            cancellationReason: session.cancellationReason ?? booking.cancellationReason,
            statusChangedBy: session.cancelledBy ?? booking.statusChangedBy,
          },
          providerUserId,
        );

        appointments.push({
          id: session.id,
          bookingId: booking.bookingId,
          sessionId: session.id,
          date: sessionDate,
          patientName:
            session.patient?.name?.trim() || booking.patient?.name?.trim() || noDataLabel,
          service: session.service?.name?.trim() || booking.service?.name?.trim() || noDataLabel,
          timeLabel: formatMinutes(startMinutes, locale),
          durationMinutes: safeDurationMinutes,
          startMinutes,
          endMinutes: startMinutes + safeDurationMinutes,
          status,
          type: appointmentType,
          location,
          canApprove: sessionStatus === 'Pending',
          canReject: sessionStatus === 'Pending',
          canOpenDelivery:
            appointmentType === 'home' &&
            isDeliveryOpenSessionStatus(sessionStatus) &&
            status !== 'cancelled' &&
            status !== 'rejected' &&
            status !== 'completed' &&
            status !== 'disputed' &&
            status !== 'no_show',
          totalSessions: booking.totalSessions ?? booking.sessionCounts?.totalSessions ?? null,
          validatedSessions:
            booking.validatedSessions ?? booking.sessionCounts?.validatedSessions ?? null,
          remainingSessions:
            booking.remainingSessions ?? booking.sessionCounts?.remainingSessions ?? null,
        });
      }

      continue;
    }

    const bookingStartDate = parseDateOnly(booking.startDate);
    const bookingEndDate = parseDateOnly(booking.endDate);
    const rangeStart = bookingStartDate > visibleFrom ? bookingStartDate : visibleFrom;
    const rangeEnd = bookingEndDate < visibleTo ? bookingEndDate : visibleTo;

    if (rangeStart > rangeEnd) {
      continue;
    }

    const startMinutes = parseTimeSpanToMinutes(booking.dailyStartTime);
    const durationMinutes =
      booking.dailyDurationMinutes ??
      (booking.dailyEndTime ? parseTimeSpanToMinutes(booking.dailyEndTime) - startMinutes : 60);
    const safeDurationMinutes = Math.max(durationMinutes, SLOT_MINUTES);
    const endMinutes = startMinutes + safeDurationMinutes;
    const appointmentType = normalizeAppointmentType(booking.type);
    const location =
      appointmentType === 'video'
        ? fallbackTeleconsultationLabel
        : booking.address?.trim() || noDataLabel;
    const sessionStatus = normalizeBookingStatus(booking.sessionStatus ?? '');
    const status = derivePresentationStatus(
      {
        ...booking,
        status: booking.sessionStatus ?? booking.status,
      },
      providerUserId,
    );

    for (const date of enumerateDates(rangeStart, rangeEnd)) {
      appointments.push({
        id: booking.sessionId,
        bookingId: booking.bookingId,
        sessionId: booking.sessionId,
        date,
        patientName: booking.patient?.name?.trim() || noDataLabel,
        service: booking.service?.name?.trim() || noDataLabel,
        timeLabel: formatMinutes(startMinutes, locale),
        durationMinutes: safeDurationMinutes,
        startMinutes,
        endMinutes,
        status,
        type: appointmentType,
        location,
        canApprove: sessionStatus === 'Pending',
        canReject: sessionStatus === 'Pending',
        canOpenDelivery:
          appointmentType === 'home' &&
          isDeliveryOpenSessionStatus(sessionStatus) &&
          Boolean(booking.sessionId) &&
          status !== 'cancelled' &&
          status !== 'rejected' &&
          status !== 'completed' &&
          status !== 'disputed' &&
          status !== 'no_show',
        totalSessions: booking.totalSessions ?? booking.sessionCounts?.totalSessions ?? null,
        validatedSessions:
          booking.validatedSessions ?? booking.sessionCounts?.validatedSessions ?? null,
        remainingSessions:
          booking.remainingSessions ?? booking.sessionCounts?.remainingSessions ?? null,
      });
    }
  }

  return appointments.sort((left, right) => {
    const dateDiff = left.date.getTime() - right.date.getTime();
    return dateDiff !== 0 ? dateDiff : left.startMinutes - right.startMinutes;
  });
}

export function expandUnavailabilities(
  unavailabilities: ProviderUnavailabilityResponse[],
  visibleFrom: Date,
  visibleTo: Date,
  fallbackReason: string,
): CalendarBlockedInterval[] {
  const items: CalendarBlockedInterval[] = [];

  for (const unavailability of unavailabilities) {
    const start = new Date(unavailability.startDatetime);
    const end = new Date(unavailability.endDatetime);
    const rangeStart = start > visibleFrom ? start : visibleFrom;
    const rangeEnd = end < addDays(visibleTo, 1) ? end : addDays(visibleTo, 1);

    if (rangeStart >= rangeEnd) {
      continue;
    }

    for (const date of enumerateDates(startOfDay(rangeStart), startOfDay(addDays(rangeEnd, -1)))) {
      const dayStart = startOfDay(date);
      const dayEnd = addDays(dayStart, 1);
      const segmentStart = start > dayStart ? start : dayStart;
      const segmentEnd = end < dayEnd ? end : dayEnd;

      if (segmentStart >= segmentEnd) {
        continue;
      }

      const startMinutes = segmentStart.getHours() * 60 + segmentStart.getMinutes();
      const endMinutes =
        segmentEnd.getHours() * 60 +
        segmentEnd.getMinutes() +
        (segmentEnd.getDate() !== segmentStart.getDate() ? 24 * 60 : 0);

      items.push({
        id: `${unavailability.id}-${toIsoDate(date)}`,
        date,
        startMinutes,
        endMinutes: Math.max(startMinutes + SLOT_MINUTES, endMinutes),
        reason: unavailability.reason?.trim() || fallbackReason,
      });
    }
  }

  return items.sort((left, right) => {
    const dateDiff = left.date.getTime() - right.date.getTime();
    return dateDiff !== 0 ? dateDiff : left.startMinutes - right.startMinutes;
  });
}

export function getDayLabel(dayOfWeek: number, labels: Record<number, string>): string {
  return labels[dayOfWeek] ?? String(dayOfWeek);
}

export function formatDateTitle(
  viewMode: ViewMode,
  currentDate: Date,
  range: { from: Date; to: Date },
  locale: string,
) {
  if (viewMode === 'day') {
    return currentDate.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (viewMode === 'week') {
    return `${range.from.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
    })} - ${range.to.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  }

  return currentDate.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

export function buildScheduleStats(
  appointments: CalendarAppointment[],
  blockedCount: number,
  todayAppointmentsCount: number,
  labels: {
    blocked: string;
    today: string;
    confirmed: string;
    pending: string;
  },
): ScheduleStat[] {
  return [
    {
      label: labels.today,
      value: String(todayAppointmentsCount),
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: labels.confirmed,
      value: String(
        appointments.filter((appointment) => appointment.status === 'confirmed').length,
      ),
      icon: CheckCircle2,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: labels.pending,
      value: String(appointments.filter((appointment) => appointment.status === 'pending').length),
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      label: labels.blocked,
      value: String(blockedCount),
      icon: Ban,
      gradient: 'from-red-500 to-rose-500',
    },
  ];
}

export function getAppointmentStatusConfig(
  status: AppointmentStatus,
  labels: AppointmentStatusLabels,
) {
  const statusConfig = {
    confirmed: {
      badgeVariant: 'success' as const,
      colorClassName: 'border-green-500/50 bg-green-500/10',
      icon: CheckCircle2,
      iconClassName: 'text-green-500',
      label: labels.confirmed,
    },
    pending: {
      badgeVariant: 'warning' as const,
      colorClassName: 'border-amber-500/50 bg-amber-500/10',
      icon: AlertCircle,
      iconClassName: 'text-amber-500',
      label: labels.pending,
    },
    cancelled: {
      badgeVariant: 'destructive' as const,
      colorClassName: 'border-red-500/50 bg-red-500/10',
      icon: XCircle,
      iconClassName: 'text-red-500',
      label: labels.cancelled,
    },
    rejected: {
      badgeVariant: 'destructive' as const,
      colorClassName: 'border-rose-500/50 bg-rose-500/10',
      icon: Ban,
      iconClassName: 'text-rose-500',
      label: labels.rejected,
    },
    completed: {
      badgeVariant: 'secondary' as const,
      colorClassName: 'border-slate-500/30 bg-slate-500/10',
      icon: CheckCircle2,
      iconClassName: 'text-slate-500 dark:text-slate-400',
      label: labels.completed,
    },
    disputed: {
      badgeVariant: 'destructive' as const,
      colorClassName: 'border-red-500/50 bg-red-500/10',
      icon: AlertCircle,
      iconClassName: 'text-red-500',
      label: labels.disputed,
    },
    no_show: {
      badgeVariant: 'secondary' as const,
      colorClassName: 'border-slate-500/40 bg-slate-500/10',
      icon: Ban,
      iconClassName: 'text-slate-500 dark:text-slate-400',
      label: labels.noShow,
    },
  };

  return statusConfig[status];
}
