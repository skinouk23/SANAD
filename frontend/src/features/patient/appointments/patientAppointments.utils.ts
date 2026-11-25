import { formatDate, formatTime } from '@/shared/lib/i18n/formatting';
import { getApiErrorMessage } from '@/utils/get-api-error-message';
import type {
  BookingListItemResponse,
  BookingSessionListItemResponse,
} from '@/features/bookings/schema';
import type { TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';

export function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, 'Une erreur est survenue.');
}

export function formatAppointmentDate(dateStr: string): string {
  return formatDate(dateStr, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAppointmentTime(dateStr: string): string {
  return formatTime(dateStr, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateOnly(value: BookingSessionListItemResponse['scheduledDate']): string {
  return typeof value === 'string'
    ? value
    : `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

export function getValidationHoursLeft(
  autoValidateAt: string | null | undefined,
  scheduledAt: string,
): number {
  const autoValidationTime = autoValidateAt
    ? new Date(autoValidateAt).getTime()
    : new Date(scheduledAt).getTime() + 48 * 60 * 60 * 1000;
  const now = new Date();
  const diff = autoValidationTime - now.getTime();

  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}

function normalizeSessionTime(value: TimeOnlyResponse | TimeSpanResponse): string {
  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    return timePart.length === 5 ? `${timePart}:00` : timePart;
  }

  if ('hour' in value) {
    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`;
  }

  return `${String(value.hours ?? 0).padStart(2, '0')}:${String(value.minutes ?? 0).padStart(2, '0')}:${String(value.seconds ?? 0).padStart(2, '0')}`;
}

function timeToMinutes(value: string): number {
  const [hours = 0, minutes = 0] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildSessionScheduledAt(session: BookingSessionListItemResponse): string {
  const date = formatDateOnly(session.scheduledDate);

  return `${date}T${normalizeSessionTime(session.scheduledStartTime)}`;
}

export function toAppointmentFromSession(
  session: BookingSessionListItemResponse,
): BookingListItemResponse {
  const scheduledAt = buildSessionScheduledAt(session);
  const dailyStartTime = normalizeSessionTime(session.scheduledStartTime);
  const dailyEndTime = session.scheduledEndTime
    ? normalizeSessionTime(session.scheduledEndTime)
    : null;
  const dailyDurationMinutes = dailyEndTime
    ? Math.max(0, timeToMinutes(dailyEndTime) - timeToMinutes(dailyStartTime))
    : (session.scheduledDurationMinutes ?? null);

  return {
    id: session.id,
    bookingId: session.bookingId,
    sessionId: session.id,
    bookingNumber: session.bookingNumber ?? undefined,
    status: session.status ?? session.bookingStatus ?? session.parentStatus ?? null,
    paymentMethod: session.paymentMethod ?? 'cash',
    paymentId: session.paymentId ?? null,
    paymentStatus: session.paymentStatus ?? null,
    paymentMethodType: session.paymentMethodType ?? session.paymentMethod ?? null,
    paymentReferenceNumber: session.paymentReferenceNumber ?? null,
    type: session.type ?? null,
    scheduledAt,
    startDate: session.scheduledDate,
    endDate: session.scheduledDate,
    dailyStartTime,
    dailyEndTime,
    dailyDurationMinutes,
    dayCount: 1,
    perDaySubtotal: session.totalAmount ?? 0,
    platformFee: 0,
    totalAmount: session.totalAmount ?? 0,
    currency: session.currency ?? 'TND',
    address: session.address ?? session.location?.address ?? null,
    service: {
      name: session.service?.name ?? session.serviceName ?? null,
      category: session.service?.category ?? session.serviceCategory ?? null,
    },
    lineItems: undefined,
    equipmentRental: null,
    provider: session.provider
      ? {
          id: session.provider.id,
          name: session.provider.name ?? null,
          phone: session.provider.phone ?? null,
          rating: 0,
        }
      : session.providerId || session.providerName || session.providerPhone
        ? {
            id: session.providerId ?? session.bookingId,
            name: session.providerName ?? null,
            phone: session.providerPhone ?? null,
            rating: 0,
          }
        : undefined,
    notes: session.notes ?? null,
    validationCode: null,
    autoValidateAt: null,
    rating: session.rating ?? null,
    reviewComment: session.reviewComment ?? null,
    patient: session.patient
      ? {
          id: session.patient.id,
          name: session.patient.name ?? null,
          phone: session.patient.phone ?? null,
        }
      : session.patientId || session.patientName || session.patientPhone
        ? {
            id: session.patientId ?? session.bookingId,
            name: session.patientName ?? null,
            phone: session.patientPhone ?? null,
          }
        : undefined,
    providerAmount: null,
    providerLocation: session.providerLocation ?? session.provider?.location ?? null,
    providerLatitude:
      session.providerLatitude ??
      session.providerLocation?.lat ??
      session.provider?.location?.lat ??
      null,
    providerLongitude:
      session.providerLongitude ??
      session.providerLocation?.lng ??
      session.provider?.location?.lng ??
      null,
    providerAddress:
      session.providerAddress ??
      session.providerLocation?.address ??
      session.provider?.location?.address ??
      null,
    activeSessionId: session.id,
    nextSessionId: session.id,
    totalSessions: session.totalSessions ?? session.counts?.totalSessions ?? null,
    confirmedSessions: session.counts?.confirmedSessions ?? null,
    inProgressSessions: session.counts?.inProgressSessions ?? null,
    validatedSessions: session.counts?.validatedSessions ?? null,
    cancelledSessions: session.counts?.cancelledSessions ?? null,
    disputedSessions: session.counts?.disputedSessions ?? null,
    noShowSessions: session.counts?.noShowSessions ?? null,
    remainingSessions: session.counts?.remainingSessions ?? null,
    sessionCounts: session.counts ?? null,
    providerAcceptedAt: null,
    providerDepartedAt: session.providerDepartedAt ?? null,
    providerArrivedAt: session.providerArrivedAt ?? null,
    serviceStartedAt: session.serviceStartedAt ?? null,
    serviceCompletedAt: session.serviceCompletedAt ?? null,
    validatedAt: session.verifiedAt ?? null,
    cancelledAt: session.cancelledAt ?? null,
    cancelledBy: session.cancelledBy ?? null,
    cancellationReason: session.cancellationReason ?? null,
    noShowAt: session.noShowAt ?? null,
    noShowReason: session.noShowReason ?? null,
    statusChangedBy: null,
    statusChangeReason: null,
  };
}

export interface AppointmentGroup {
  bookingId: string;
  bookingNumber: string | null;
  appointments: BookingListItemResponse[];
}

export function groupAppointmentsByBooking(
  appointments: BookingListItemResponse[],
): AppointmentGroup[] {
  const groups = new Map<string, AppointmentGroup>();

  for (const appointment of appointments) {
    const bookingId = appointment.bookingId ?? appointment.id;
    const existing = groups.get(bookingId);

    if (existing) {
      existing.appointments.push(appointment);
    } else {
      groups.set(bookingId, {
        bookingId,
        bookingNumber: appointment.bookingNumber ?? null,
        appointments: [appointment],
      });
    }
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    appointments: [...group.appointments].sort(
      (left, right) => new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime(),
    ),
  }));
}
