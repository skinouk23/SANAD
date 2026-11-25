import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { DateOnlyResponse, TimeOnlyResponse, TimeSpanResponse } from '@/shared/schemas/common';

export type CareStyleLocationBadgeVariant = 'home' | 'clinic' | 'both';

export function formatDateValue(value: DateOnlyResponse | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.includes('T') ? value.slice(0, 10) : value;
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

export function formatDateLabel(value: DateOnlyResponse | undefined, fallback: string): string {
  return formatDateValue(value) ?? fallback;
}

export function formatTimeLabel(
  value: TimeOnlyResponse | TimeSpanResponse | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value.length >= 5 ? value.slice(0, 5) : value;
  if ('hour' in value) {
    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
  }
  return `${String(value.hours ?? 0).padStart(2, '0')}:${String(value.minutes ?? 0).padStart(2, '0')}`;
}

export function formatDailyStartTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

export function formatServiceDuration(
  durationMinutes: PatientServiceItemResponse['durationMinutes'],
  fallback: string | null = null,
): string | null {
  if (typeof durationMinutes === 'number' && durationMinutes > 0) {
    return `${durationMinutes} min`;
  }

  return fallback;
}

export function sumServiceDurationMinutes(
  services: readonly PatientServiceItemResponse[],
  quantities?: Record<string, number>,
): number {
  return services.reduce((total, service) => {
    const { durationMinutes } = service;

    if (
      typeof durationMinutes !== 'number' ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0
    ) {
      return total;
    }

    const configuredQuantity = quantities?.[service.id];
    const quantity =
      typeof configuredQuantity === 'number' && Number.isFinite(configuredQuantity)
        ? Math.max(1, configuredQuantity)
        : 1;

    return total + durationMinutes * quantity;
  }, 0);
}

export function formatSelectedServicesDuration(
  services: readonly PatientServiceItemResponse[],
  fallback: string | null = null,
  quantities?: Record<string, number>,
): string | null {
  return formatServiceDuration(sumServiceDurationMinutes(services, quantities), fallback);
}

export function formatServicePrice(price: number, currency?: string | null): string {
  return `${price.toFixed(2)} ${currency ?? 'TND'}`;
}

export function getServiceLocationBadgeVariant(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): CareStyleLocationBadgeVariant {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'clinic';
}
