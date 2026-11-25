/**
 * Provider Service
 *
 * Pure API client for the providers domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';

import {
  ProviderResponseSchema,
  ProviderDetailResponseSchema,
  ProviderProfileResponseSchema,
  ProviderDashboardResponseSchema,
  ProviderAvailabilityResponseSchema,
  ProviderRangeAvailabilityResponseSchema,
  ProviderMonthAvailabilityResponseSchema,
  UpdateProviderAvailabilityResponseSchema,
  ProviderVerificationRequestResponseSchema,
  ProviderPlanningResponseSchema,
  ProviderScheduleIntervalSchema,
  UpsertProviderScheduleIntervalSchema,
  ProviderUnavailabilityResponseSchema,
  CreateProviderUnavailabilityRequestSchema,
  UpdateProviderUnavailabilityRequestSchema,
  ProviderScheduleSlotSchema,
  ProviderFilterOptionsResponseSchema,
  PaginatedProvidersSchema,
} from './schema';
import { ProviderReviewsResponseSchema } from './review-schema';
import {
  ServiceDetailResponseSchema,
  ServiceStatsResponseSchema,
  ProviderServiceListResponseSchema,
  ProviderServicePresetResponseSchema,
  ServicePhotoResponseSchema,
  AttachServicePhotoRequestSchema,
  CreateServiceRequestSchema,
  UpdateServiceRequestSchema,
} from '@/features/services/schema';

import type { SilentErrorConfig } from '@/api/client';
import type {
  ProviderResponse,
  ProviderDetailResponse,
  ProviderProfileResponse,
  ProviderDashboardResponse,
  ProviderAvailabilityResponse,
  ProviderRangeAvailabilityResponse,
  ProviderMonthAvailabilityResponse,
  UpdateProviderAvailabilityRequest,
  UpdateProviderAvailabilityResponse,
  ProviderVerificationRequestResponse,
  UpdateMyProviderProfileRequest,
  ProviderPlanningResponse,
  ProviderScheduleInterval,
  UpsertProviderScheduleInterval,
  ProviderUnavailabilityResponse,
  CreateProviderUnavailabilityRequest,
  UpdateProviderUnavailabilityRequest,
  ProviderFilterOptionsResponse,
} from './schema';
import type { ProviderReviewsResponse } from './review-schema';
import type {
  ServiceDetailResponse,
  ServiceStatsResponse,
  ProviderServiceListResponse,
  ProviderServicePresetResponse,
  ServicePhotoResponse,
  AttachServicePhotoRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '@/features/services/schema';
import type { TimeOnlyResponse } from '@/shared/schemas/common';

function createSilentMutationConfig(): SilentErrorConfig {
  return { _silentError: true };
}

function toBackendTimeOnly(value: TimeOnlyResponse): string {
  if (typeof value === 'string') {
    return /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  }

  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`;
}

// ============================================
// FILTER TYPES
// ============================================

export interface ProviderFilters {
  page?: number;
  limit?: number;
  status?: string;
  serviceCategory?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDesc?: boolean;
  city?: string;
}

export interface ReviewParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

// ============================================
// PAGINATED RESPONSE TYPE
// ============================================

export interface PaginatedProviders {
  items: ProviderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// SCHEDULE TYPE
// ============================================

export interface ProviderScheduleSlot {
  date: string;
  availableSlots: string[];
}

export interface ProviderRangeAvailabilityParams {
  startDate: string;
  endDate: string;
  serviceIds: string[];
}

export interface ProviderMonthAvailabilityParams {
  year: number;
  month: number;
  serviceIds: string[];
}

export interface ProviderPlanningParams {
  from: string;
  to: string;
}

export interface ProviderUnavailabilityListParams {
  from: string;
  to: string;
}

// ============================================
// PUBLIC QUERIES
// ============================================

/** Fetch all active providers. */
export async function getActiveProviders(): Promise<ProviderResponse[]> {
  const raw = await api.get<ProviderResponse[]>('/providers/active');
  return z.array(ProviderResponseSchema).parse(raw);
}

/** Fetch a single provider's public profile by ID. */
export async function getPublicProvider(id: string): Promise<ProviderDetailResponse> {
  const raw = await api.get<ProviderDetailResponse>(`/providers/${id}`);
  return ProviderDetailResponseSchema.parse(raw);
}

/** Fetch providers by service category — delegates to paginated providers with serviceCategory filter. */
export async function getProvidersByCategory(type: string): Promise<ProviderResponse[]> {
  const result = await getPaginatedProviders({ serviceCategory: type });
  return result.items;
}

/** @deprecated Use getProvidersByCategory instead. */
export const getProvidersByServiceType = getProvidersByCategory;

/** Fetch paginated providers with filters. */
export async function getPaginatedProviders(
  filters?: ProviderFilters,
): Promise<PaginatedProviders> {
  const raw = await api.get<PaginatedProviders>('/providers', {
    params: filters,
  });
  return PaginatedProvidersSchema.parse(raw) as unknown as PaginatedProviders;
}

/** Fetch distinct values used to populate active provider filters. */
export async function getProviderFilterOptions(
  serviceCategory?: string,
): Promise<ProviderFilterOptionsResponse> {
  const raw = await api.get<ProviderFilterOptionsResponse>('/providers/filter-options', {
    params: serviceCategory ? { serviceCategory } : undefined,
  });
  return ProviderFilterOptionsResponseSchema.parse(raw);
}

/** Fetch available providers for a service type. */
export async function getAvailableProviders(serviceCategory: string): Promise<PaginatedProviders> {
  const raw = await api.get<PaginatedProviders>('/providers/available', {
    params: { serviceCategory },
  });
  return PaginatedProvidersSchema.parse(raw) as unknown as PaginatedProviders;
}

/** Fetch top-rated providers. */
export async function getTopRatedProviders(limit: number = 5): Promise<PaginatedProviders> {
  const raw = await api.get<PaginatedProviders>('/providers/top-rated', {
    params: { page: 1, limit },
  });
  return PaginatedProvidersSchema.parse(raw) as unknown as PaginatedProviders;
}

/**
 * Fetch a provider's schedule (availability slots) for the next few days.
 */
export async function getProviderSchedule(id: string): Promise<ProviderScheduleSlot[]> {
  const raw = await api.get<ProviderScheduleSlot[]>(`/providers/${id}/schedule`);
  return z.array(ProviderScheduleSlotSchema).parse(raw);
}

/** Fetch the daily start times that remain valid for the entire selected booking range. */
export async function getProviderRangeAvailability(
  id: string,
  params: ProviderRangeAvailabilityParams,
): Promise<ProviderRangeAvailabilityResponse> {
  const raw = await api.get<ProviderRangeAvailabilityResponse>(
    `/providers/${id}/availability/range`,
    {
      params,
      paramsSerializer: {
        serialize: (requestParams) => {
          const searchParams = new URLSearchParams();
          const { serviceIds, ...rest } = requestParams as ProviderRangeAvailabilityParams;

          for (const [key, value] of Object.entries(rest)) {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          }

          for (const serviceId of serviceIds) {
            searchParams.append('serviceIds', serviceId);
          }

          return searchParams.toString();
        },
      },
    },
  );
  return ProviderRangeAvailabilityResponseSchema.parse(raw);
}

/** Fetch a provider's month-level availability summary. */
export async function getProviderMonthAvailability(
  id: string,
  params: ProviderMonthAvailabilityParams,
): Promise<ProviderMonthAvailabilityResponse> {
  const raw = await api.get<ProviderMonthAvailabilityResponse>(
    `/providers/${id}/availability/month`,
    {
      params,
      paramsSerializer: {
        serialize: (requestParams) => {
          const searchParams = new URLSearchParams();
          const { serviceIds, ...rest } = requestParams as ProviderMonthAvailabilityParams;

          for (const [key, value] of Object.entries(rest)) {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          }

          for (const serviceId of serviceIds) {
            searchParams.append('serviceIds', serviceId);
          }

          return searchParams.toString();
        },
      },
    },
  );
  return ProviderMonthAvailabilityResponseSchema.parse(raw);
}

// ============================================
// SELF-SERVICE (AUTHENTICATED PROVIDER) QUERIES
// ============================================

/** Fetch the authenticated provider's own profile. */
export async function getMyProviderProfile(): Promise<ProviderProfileResponse> {
  const raw = await api.get<ProviderProfileResponse>('/providers/me');
  return ProviderProfileResponseSchema.parse(raw);
}

/** Fetch the authenticated provider's dashboard data. */
export async function getProviderDashboard(): Promise<ProviderDashboardResponse> {
  const raw = await api.get<ProviderDashboardResponse>('/providers/me/dashboard');
  return ProviderDashboardResponseSchema.parse(raw);
}

/** Fetch the authenticated provider's reviews. */
export async function getMyProviderReviews(
  params?: ReviewParams,
): Promise<ProviderReviewsResponse> {
  const raw = await api.get<ProviderReviewsResponse>('/providers/me/reviews', {
    params,
  });
  return ProviderReviewsResponseSchema.parse(raw);
}

/**
 * Fetch the authenticated provider's availability for today.
 *
 * The backend's GET /providers/me/availability endpoint is being added (fixes #11).
 * Falls back to today's date so the endpoint returns the provider's current-day slots.
 */
export async function getMyProviderAvailability(): Promise<ProviderAvailabilityResponse> {
  const today = new Date().toISOString().split('T')[0];
  const raw = await api.get<ProviderAvailabilityResponse>('/providers/me/availability', {
    params: { date: today },
  });
  return ProviderAvailabilityResponseSchema.parse(raw);
}

/** Fetch the authenticated provider's planning state for a date range. */
export async function getMyProviderPlanning(
  params: ProviderPlanningParams,
): Promise<ProviderPlanningResponse> {
  const raw = await api.get<ProviderPlanningResponse>('/providers/me/planning', {
    params,
  });
  return ProviderPlanningResponseSchema.parse(raw);
}

/** Fetch the authenticated provider's weekly schedule intervals. */
export async function getMyProviderSchedules(): Promise<ProviderScheduleInterval[]> {
  const raw = await api.get<ProviderScheduleInterval[]>('/providers/me/schedules');
  return z.array(ProviderScheduleIntervalSchema).parse(raw);
}

/** Replace the authenticated provider's weekly schedule intervals. */
export async function replaceMyProviderSchedules(
  data: UpsertProviderScheduleInterval[],
): Promise<ProviderScheduleInterval[]> {
  const payload = z
    .array(UpsertProviderScheduleIntervalSchema)
    .parse(data)
    .map((interval) => ({
      ...interval,
      startTime: toBackendTimeOnly(interval.startTime),
      endTime: toBackendTimeOnly(interval.endTime),
    }));
  const raw = await api.put<ProviderScheduleInterval[]>(
    '/providers/me/schedules',
    payload,
    createSilentMutationConfig(),
  );
  return z.array(ProviderScheduleIntervalSchema).parse(raw);
}

/** Fetch the authenticated provider's unavailabilities for a date range. */
export async function getMyProviderUnavailabilities(
  params: ProviderUnavailabilityListParams,
): Promise<ProviderUnavailabilityResponse[]> {
  const raw = await api.get<ProviderUnavailabilityResponse[]>('/providers/me/unavailabilities', {
    params,
  });
  return z.array(ProviderUnavailabilityResponseSchema).parse(raw);
}

/** Create a provider unavailability entry. */
export async function createMyProviderUnavailability(
  data: CreateProviderUnavailabilityRequest,
): Promise<ProviderUnavailabilityResponse> {
  const payload = CreateProviderUnavailabilityRequestSchema.parse(data);
  const raw = await api.post<ProviderUnavailabilityResponse>(
    '/providers/me/unavailabilities',
    payload,
    createSilentMutationConfig(),
  );
  return ProviderUnavailabilityResponseSchema.parse(raw);
}

/** Update a provider unavailability entry. */
export async function updateMyProviderUnavailability(
  id: string,
  data: UpdateProviderUnavailabilityRequest,
): Promise<ProviderUnavailabilityResponse> {
  const payload = UpdateProviderUnavailabilityRequestSchema.parse(data);
  const raw = await api.patch<ProviderUnavailabilityResponse>(
    `/providers/me/unavailabilities/${id}`,
    payload,
    createSilentMutationConfig(),
  );
  return ProviderUnavailabilityResponseSchema.parse(raw);
}

/** Delete a provider unavailability entry. */
export async function deleteMyProviderUnavailability(id: string): Promise<void> {
  return api.delete<void>(`/providers/me/unavailabilities/${id}`, createSilentMutationConfig());
}

/** Fetch the authenticated provider's services. */
export async function getMyServices(): Promise<ProviderServiceListResponse> {
  const raw = await api.get<ProviderServiceListResponse>('/providers/me/services');
  return ProviderServiceListResponseSchema.parse(raw);
}

/** Fetch provider-authored service presets for the authenticated provider. */
export async function getMyServicePresets(): Promise<ProviderServicePresetResponse[]> {
  const raw = await api.get<ProviderServicePresetResponse[]>(
    '/providers/me/services/presets',
    createSilentMutationConfig(),
  );
  return z.array(ProviderServicePresetResponseSchema).parse(raw);
}

/** Fetch full detail of a single service owned by the authenticated provider. */
export async function getMyServiceDetail(id: string): Promise<ServiceDetailResponse> {
  const raw = await api.get<ServiceDetailResponse>(`/providers/me/services/${id}`);
  return ServiceDetailResponseSchema.parse(raw);
}

/** Fetch aggregate statistics for the authenticated provider's services. */
export async function getMyServiceStats(): Promise<ServiceStatsResponse> {
  const raw = await api.get<ServiceStatsResponse>('/providers/me/services/stats');
  return ServiceStatsResponseSchema.parse(raw);
}

// ============================================
// SELF-SERVICE MUTATIONS
// ============================================

/** Update the authenticated provider's profile. */
export async function updateMyProviderProfile(
  data: UpdateMyProviderProfileRequest,
): Promise<ProviderProfileResponse> {
  const raw = await api.put<ProviderProfileResponse>(
    '/providers/me',
    data,
    createSilentMutationConfig(),
  );
  return ProviderProfileResponseSchema.parse(raw);
}

/** Toggle the authenticated provider's availability. */
export async function toggleMyAvailability(
  data: UpdateProviderAvailabilityRequest,
): Promise<UpdateProviderAvailabilityResponse> {
  const raw = await api.put<UpdateProviderAvailabilityResponse>('/providers/me/availability', data);
  return UpdateProviderAvailabilityResponseSchema.parse(raw);
}

/** Request document verification for the authenticated provider. */
export async function requestMyProviderVerification(): Promise<ProviderVerificationRequestResponse> {
  const raw = await api.post<ProviderVerificationRequestResponse>(
    '/providers/me/verification-request',
    undefined,
    createSilentMutationConfig(),
  );
  return ProviderVerificationRequestResponseSchema.parse(raw);
}

/** Add a new service to the provider's offerings. */
export async function addService(data: CreateServiceRequest): Promise<ServiceDetailResponse> {
  const payload = CreateServiceRequestSchema.parse({
    ...data,
    currency: 'TND',
  });
  const raw = await api.post<ServiceDetailResponse>('/providers/me/services', payload);
  return ServiceDetailResponseSchema.parse(raw);
}

/** Update an existing provider service. */
export async function updateService(
  id: string,
  data: UpdateServiceRequest,
): Promise<ServiceDetailResponse> {
  const payload = UpdateServiceRequestSchema.parse({
    ...data,
    currency: 'TND',
  });
  const raw = await api.put<ServiceDetailResponse>(`/providers/me/services/${id}`, payload);
  return ServiceDetailResponseSchema.parse(raw);
}

/** Attach an uploaded asset to an existing provider service as a service photo. */
export async function attachServicePhoto(
  serviceId: string,
  data: AttachServicePhotoRequest,
  config?: Parameters<typeof api.post>[2],
): Promise<ServicePhotoResponse> {
  const payload = AttachServicePhotoRequestSchema.parse(data);
  const raw = await api.post<ServicePhotoResponse>(
    `/providers/me/services/${encodeURIComponent(serviceId)}/photos`,
    payload,
    config,
  );

  return ServicePhotoResponseSchema.parse(raw);
}

/** Remove a service from the provider's offerings. */
export async function removeService(id: string): Promise<void> {
  return api.delete<void>(`/providers/me/services/${id}`);
}

/** Toggle a service's active status. */
export async function toggleService(id: string, isActive: boolean): Promise<void> {
  return api.patch<void>(`/providers/me/services/${id}/toggle`, { isActive });
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const providerService = {
  // Public
  getActiveProviders,
  getPublicProvider,
  getProvidersByCategory,
  getProvidersByServiceType,
  getPaginatedProviders,
  getProviderFilterOptions,
  getAvailableProviders,
  getTopRatedProviders,
  getProviderSchedule,
  getProviderMonthAvailability,
  getProviderRangeAvailability,
  // Self-service
  getMyProviderProfile,
  getProviderDashboard,
  getMyProviderReviews,
  getMyProviderAvailability,
  getMyProviderPlanning,
  getMyProviderSchedules,
  replaceMyProviderSchedules,
  getMyProviderUnavailabilities,
  createMyProviderUnavailability,
  updateMyProviderUnavailability,
  deleteMyProviderUnavailability,
  getMyServices,
  getMyServicePresets,
  getMyServiceDetail,
  getMyServiceStats,
  updateMyProviderProfile,
  toggleMyAvailability,
  requestMyProviderVerification,
  addService,
  updateService,
  attachServicePhoto,
  removeService,
  toggleService,
};
