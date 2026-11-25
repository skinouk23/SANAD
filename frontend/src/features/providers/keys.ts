/**
 * Provider Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   providerKeys.all            → invalidate everything provider-related
 *   providerKeys.lists()        → invalidate all list queries
 *   providerKeys.list(filters)  → invalidate one filtered list
 *   providerKeys.details()      → invalidate all detail queries
 *   providerKeys.detail(id)     → invalidate one detail
 */

import type {
  ProviderFilters,
  ReviewParams,
  ProviderMonthAvailabilityParams,
  ProviderRangeAvailabilityParams,
  ProviderPlanningParams,
  ProviderUnavailabilityListParams,
} from './service';

export const providerKeys = {
  all: ['providers'] as const,

  lists: () => [...providerKeys.all, 'list'] as const,
  list: (filters?: ProviderFilters) => [...providerKeys.lists(), filters ?? {}] as const,

  filterOptions: (serviceCategory?: string) =>
    [...providerKeys.all, 'filterOptions', serviceCategory ?? null] as const,

  details: () => [...providerKeys.all, 'detail'] as const,
  detail: (id: string) => [...providerKeys.details(), id] as const,

  serviceCategory: (type: string) => [...providerKeys.all, 'serviceCategory', type] as const,

  /** @deprecated Use serviceCategory instead. */
  serviceType: (type: string) => providerKeys.serviceCategory(type),

  available: (type: string) => [...providerKeys.all, 'available', type] as const,

  topRated: (limit: number) => [...providerKeys.all, 'topRated', limit] as const,

  schedules: () => [...providerKeys.all, 'schedule'] as const,
  schedule: (id: string) => [...providerKeys.all, 'schedule', id] as const,

  monthAvailabilities: () => [...providerKeys.all, 'monthAvailability'] as const,
  monthAvailability: (id: string, params: ProviderMonthAvailabilityParams) =>
    [...providerKeys.monthAvailabilities(), id, params] as const,

  rangeAvailabilities: () => [...providerKeys.all, 'rangeAvailability'] as const,
  rangeAvailability: (id: string, params: ProviderRangeAvailabilityParams) =>
    [...providerKeys.rangeAvailabilities(), id, params] as const,

  profile: () => [...providerKeys.all, 'profile'] as const,

  myPreferences: () => [...providerKeys.all, 'myPreferences'] as const,

  dashboard: () => [...providerKeys.all, 'dashboard'] as const,

  reviews: (params?: ReviewParams) => [...providerKeys.all, 'reviews', params ?? {}] as const,

  myAvailability: () => [...providerKeys.all, 'myAvailability'] as const,

  myPlanningRoot: () => [...providerKeys.all, 'myPlanning'] as const,
  myPlanning: (params: ProviderPlanningParams) =>
    [...providerKeys.myPlanningRoot(), params] as const,

  mySchedules: () => [...providerKeys.all, 'mySchedules'] as const,

  myUnavailabilitiesRoot: () => [...providerKeys.all, 'myUnavailabilities'] as const,
  myUnavailabilities: (params: ProviderUnavailabilityListParams) =>
    [...providerKeys.myUnavailabilitiesRoot(), params] as const,

  myServices: () => [...providerKeys.all, 'myServices'] as const,

  myServicePresets: () => [...providerKeys.all, 'myServices', 'presets'] as const,

  myServiceDetail: (id: string) => [...providerKeys.all, 'myServices', 'detail', id] as const,

  myServiceStats: () => [...providerKeys.all, 'myServices', 'stats'] as const,
} as const;
