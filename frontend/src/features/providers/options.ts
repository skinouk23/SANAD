/**
 * Provider Query Options
 *
 * Pre-built queryOptions for every provider query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { providerKeys } from './keys';
import {
  getActiveProviders,
  getPublicProvider,
  getProvidersByCategory,
  getPaginatedProviders,
  getProviderFilterOptions,
  getAvailableProviders,
  getTopRatedProviders,
  getProviderSchedule,
  getProviderMonthAvailability,
  getProviderRangeAvailability,
  getMyProviderProfile,
  getProviderDashboard,
  getMyProviderReviews,
  getMyProviderAvailability,
  getMyProviderPlanning,
  getMyProviderSchedules,
  getMyProviderUnavailabilities,
  getMyServices,
  getMyServicePresets,
  getMyServiceDetail,
  getMyServiceStats,
} from './service';
import { getMyProviderPreferences } from './preferences-service';
import type {
  ProviderFilters,
  ReviewParams,
  ProviderMonthAvailabilityParams,
  ProviderRangeAvailabilityParams,
  ProviderPlanningParams,
  ProviderUnavailabilityListParams,
} from './service';

interface ProviderAvailabilityOptions {
  pollingEnabled?: boolean;
}

const VERIFIED_FIRST_PROVIDER_SORT: Pick<ProviderFilters, 'sortBy' | 'sortDesc'> = {
  sortBy: 'isverified',
  sortDesc: true,
};

function withVerifiedFirstServiceSort(filters?: ProviderFilters): ProviderFilters | undefined {
  if (!filters?.serviceCategory || filters.sortBy) {
    return filters;
  }

  return {
    ...filters,
    ...VERIFIED_FIRST_PROVIDER_SORT,
  };
}

export function providerListOptions(filters?: ProviderFilters) {
  const normalizedFilters = withVerifiedFirstServiceSort(filters);

  return queryOptions({
    queryKey: providerKeys.list(normalizedFilters),
    queryFn: () => getPaginatedProviders(normalizedFilters),
  });
}

export function providerDetailOptions(id: string) {
  return queryOptions({
    queryKey: providerKeys.detail(id),
    queryFn: () => getPublicProvider(id),
    enabled: !!id,
  });
}

export function providerSearchOptions(
  query: string,
  filters?: Omit<ProviderFilters, 'searchQuery'>,
) {
  const normalizedFilters: ProviderFilters = { ...filters, searchQuery: query };
  const finalFilters = withVerifiedFirstServiceSort(normalizedFilters);

  return queryOptions({
    queryKey: providerKeys.list(finalFilters),
    queryFn: () => getPaginatedProviders(finalFilters),
    enabled: !!query,
  });
}

export function providerFilterOptionsOptions(serviceCategory?: string) {
  return queryOptions({
    queryKey: providerKeys.filterOptions(serviceCategory),
    queryFn: () => getProviderFilterOptions(serviceCategory),
    enabled: serviceCategory === undefined || serviceCategory.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function providersByCategoryOptions(type: string) {
  return queryOptions({
    queryKey: providerKeys.serviceCategory(type),
    queryFn: () => getProvidersByCategory(type),
    enabled: !!type,
  });
}

/** @deprecated Use providersByCategoryOptions instead. */
export const providersByServiceTypeOptions = providersByCategoryOptions;

export function availableProvidersOptions(type: string) {
  return queryOptions({
    queryKey: providerKeys.available(type),
    queryFn: () => getAvailableProviders(type),
    enabled: !!type,
  });
}

export function topRatedProvidersOptions(limit: number = 5) {
  return queryOptions({
    queryKey: providerKeys.topRated(limit),
    queryFn: () => getTopRatedProviders(limit),
  });
}

export function providerScheduleOptions(id: string) {
  return queryOptions({
    queryKey: providerKeys.schedule(id),
    queryFn: () => getProviderSchedule(id),
    enabled: !!id,
  });
}

export function providerMonthAvailabilityOptions(
  id: string,
  params: ProviderMonthAvailabilityParams,
  options?: ProviderAvailabilityOptions,
) {
  return queryOptions({
    queryKey: providerKeys.monthAvailability(id, params),
    queryFn: () => getProviderMonthAvailability(id, params),
    enabled: !!id && params.serviceIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.pollingEnabled === false ? false : 30_000,
  });
}

export function providerRangeAvailabilityOptions(
  id: string,
  params: ProviderRangeAvailabilityParams,
  options?: ProviderAvailabilityOptions,
) {
  return queryOptions({
    queryKey: providerKeys.rangeAvailability(id, params),
    queryFn: () => getProviderRangeAvailability(id, params),
    enabled: !!id && !!params.startDate && !!params.endDate && params.serviceIds.length > 0,
    // Availability data changes frequently; keep cache shorter than the global 5min default.
    // Aligns with the backend's 2-minute schedule cache TTL.
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.pollingEnabled === false ? false : 30_000,
  });
}

export function myProviderProfileOptions() {
  return queryOptions({
    queryKey: providerKeys.profile(),
    queryFn: () => getMyProviderProfile(),
  });
}

export function myProviderPreferencesOptions() {
  return queryOptions({
    queryKey: providerKeys.myPreferences(),
    queryFn: () => getMyProviderPreferences(),
  });
}

export function providerDashboardOptions() {
  return queryOptions({
    queryKey: providerKeys.dashboard(),
    queryFn: () => getProviderDashboard(),
  });
}

export function myProviderReviewsOptions(params?: ReviewParams) {
  return queryOptions({
    queryKey: providerKeys.reviews(params),
    queryFn: () => getMyProviderReviews(params),
  });
}

export function myProviderAvailabilityOptions() {
  return queryOptions({
    queryKey: providerKeys.myAvailability(),
    queryFn: () => getMyProviderAvailability(),
  });
}

export function myProviderPlanningOptions(params: ProviderPlanningParams) {
  return queryOptions({
    queryKey: providerKeys.myPlanning(params),
    queryFn: () => getMyProviderPlanning(params),
    enabled: !!params.from && !!params.to,
  });
}

export function myProviderSchedulesOptions(options?: { enabled?: boolean }) {
  return queryOptions({
    queryKey: providerKeys.mySchedules(),
    queryFn: () => getMyProviderSchedules(),
    enabled: options?.enabled ?? true,
  });
}

export function myProviderUnavailabilitiesOptions(params: ProviderUnavailabilityListParams) {
  return queryOptions({
    queryKey: providerKeys.myUnavailabilities(params),
    queryFn: () => getMyProviderUnavailabilities(params),
    enabled: !!params.from && !!params.to,
  });
}

export function myServicesOptions() {
  return queryOptions({
    queryKey: providerKeys.myServices(),
    queryFn: () => getMyServices(),
  });
}

export function myServicePresetsOptions() {
  return queryOptions({
    queryKey: providerKeys.myServicePresets(),
    queryFn: () => getMyServicePresets(),
  });
}

export function myServiceDetailOptions(id: string) {
  return queryOptions({
    queryKey: providerKeys.myServiceDetail(id),
    queryFn: () => getMyServiceDetail(id),
    enabled: !!id,
  });
}

export function myServiceStatsOptions() {
  return queryOptions({
    queryKey: providerKeys.myServiceStats(),
    queryFn: () => getMyServiceStats(),
  });
}

export function activeProvidersOptions() {
  return queryOptions({
    queryKey: [...providerKeys.lists(), 'active'] as const,
    queryFn: () => getActiveProviders(),
  });
}
