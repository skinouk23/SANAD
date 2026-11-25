import { type ApiError } from '@/shared/schemas/api.schema';

import type { ServiceSummaryResponse } from '@/features/services/schema';

export type ServiceLocation = 'home' | 'clinic' | 'both' | 'online';

export interface ServiceView {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
  category: string;
  location: ServiceLocation | string;
  requiresPrescription: boolean;
  isUrgent: boolean;
  imageUrl?: string | null;
  ceremonyType?: 'religious' | 'civil' | 'both';
  burialType?: 'burial' | 'cremation' | 'both';
  repatriation?: boolean;
  floralService?: boolean;
  transportService?: boolean;
  adminAssistance?: boolean;
  griefSupport?: boolean;
  available24h?: boolean;
}

export function toServiceView(service: ServiceSummaryResponse): ServiceView {
  return {
    id: service.id,
    name: service.name ?? '',
    description: service.description ?? service.shortDescription ?? '',
    price: service.price,
    duration: service.durationMinutes ?? 0,
    active: service.isActive,
    category: service.category ?? '',
    location: service.serviceLocation ?? 'home',
    requiresPrescription: service.requiresPrescription ?? false,
    isUrgent: service.isUrgent ?? false,
    imageUrl: service.imageUrl,
  };
}

export function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const { statusCode } = error as Partial<ApiError>;
    return typeof statusCode === 'number' ? statusCode : null;
  }

  return null;
}
