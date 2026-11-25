import { isTerminalBookingStatus } from '@/features/bookings/status';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import type { TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';

function normalizeDashboardTime(time: TimeOnlyResponse | TimeSpanResponse): string {
  if (typeof time === 'string') {
    return time.length === 5 ? `${time}:00` : time;
  }

  if ('hour' in time) {
    const hours = String(time.hour).padStart(2, '0');
    const minutes = String(time.minute).padStart(2, '0');
    const seconds = String(time.second ?? 0).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  const hours = String(time.hours ?? 0).padStart(2, '0');
  const minutes = String(time.minutes ?? 0).padStart(2, '0');
  const seconds = String(time.seconds ?? 0).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function formatDashboardTime(
  time: TimeOnlyResponse | TimeSpanResponse,
  locale: string,
): string {
  const normalizedTime = normalizeDashboardTime(time);

  return new Date(`2000-01-01T${normalizedTime}`).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAppointmentSummary(
  appointment: BookingListItemResponse,
  patientLabel: string,
  noDataLabel: string,
) {
  return {
    addressLabel: appointment.address || noDataLabel,
    isCompleted: isTerminalBookingStatus(appointment.status),
    patientName: appointment.patient?.name || patientLabel,
    serviceName: appointment.service?.name || noDataLabel,
  };
}
