/**
 * Provider Query Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useProviders.ts query hooks.
 * Each returns { providers, data, loading, error, refetch } where
 * `providers` is the ProviderResponse[] from the API.
 */

import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import {
  providerListOptions,
  providerDetailOptions,
  providersByCategoryOptions,
  availableProvidersOptions,
  topRatedProvidersOptions,
  providerScheduleOptions,
  providerFilterOptionsOptions,
  providerMonthAvailabilityOptions,
  providerRangeAvailabilityOptions,
  activeProvidersOptions,
} from '@/features/providers/options';
import type {
  ProviderFilters,
  PaginatedProviders,
  ProviderMonthAvailabilityParams,
  ProviderRangeAvailabilityParams,
} from '@/features/providers/service';

interface ProviderAvailabilityQueryOptions {
  pollingEnabled?: boolean;
}

// ============================================
// LIST / DETAIL HOOKS
// ============================================

/**
 * Fetch paginated providers with optional filters.
 * Returns the full PaginatedProviders shape.
 */
export function useProviders(filters?: ProviderFilters) {
  const query = useQuery({
    ...providerListOptions(filters),
    placeholderData: keepPreviousData,
  });

  return {
    providers: query.data?.items ?? [],
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch all active providers (no filters).
 */
export function useActiveProviders() {
  const query = useQuery(activeProvidersOptions());

  return {
    providers: query.data ?? [],
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch a single provider's public profile by ID.
 */
export function usePublicProvider(providerId?: string) {
  const query = useQuery({
    ...providerDetailOptions(providerId ?? ''),
    enabled: !!providerId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Server-paginated providers with flicker-free page transitions.
 * Uses keepPreviousData so the UI doesn't flash empty on page changes.
 */
export function usePaginatedProviders(initialFilters?: ProviderFilters) {
  const [filters, setFilters] = useState<ProviderFilters>(initialFilters ?? {});
  const [page, setPage] = useState(initialFilters?.page ?? 1);

  // Sync page into filters
  const mergedFilters = useMemo(() => ({ ...filters, page }), [filters, page]);

  const query = useQuery({
    ...providerListOptions(mergedFilters),
    placeholderData: keepPreviousData,
  });

  const result: PaginatedProviders | null = query.data ?? null;
  const totalPages = result?.pagination?.totalPages ?? 1;

  return {
    providers: result?.items ?? [],
    data: result,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
  };
}

// ============================================
// FILTERED QUERY HOOKS
// ============================================

/**
 * Fetch providers by service category.
 */
export function useProvidersByCategory(serviceCategory?: string) {
  const query = useQuery({
    ...providersByCategoryOptions(serviceCategory ?? ''),
    enabled: !!serviceCategory,
    placeholderData: keepPreviousData,
  });

  return {
    providers: query.data ?? [],
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/** @deprecated Use useProvidersByCategory instead. */
export const useProvidersByServiceType = useProvidersByCategory;

/**
 * Fetch available providers for a service category.
 */
export function useAvailableProviders(serviceCategory?: string) {
  const query = useQuery({
    ...availableProvidersOptions(serviceCategory ?? ''),
    enabled: !!serviceCategory,
    placeholderData: keepPreviousData,
  });

  return {
    providers: query.data?.items ?? [],
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch top-rated providers.
 */
export function useTopRatedProviders(limit: number = 5) {
  const query = useQuery({
    ...topRatedProvidersOptions(limit),
    placeholderData: keepPreviousData,
  });

  return {
    providers: query.data?.items ?? [],
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProviderFilterOptions(serviceCategory?: string) {
  const query = useQuery(providerFilterOptionsOptions(serviceCategory));

  return {
    data: query.data ?? null,
    cities: query.data?.cities ?? [],
    specialties: query.data?.specialties ?? [],
    nutritionProviderSubtypes: query.data?.nutritionProviderSubtypes ?? [],
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

// ============================================
// SCHEDULE HOOK
// ============================================

/**
 * Fetch a provider's schedule (availability slots).
 */
export function useProviderSchedule(providerId?: string) {
  const query = useQuery({
    ...providerScheduleOptions(providerId ?? ''),
    enabled: !!providerId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProviderMonthAvailability(
  providerId: string | undefined,
  params: ProviderMonthAvailabilityParams | null,
  options?: ProviderAvailabilityQueryOptions,
) {
  const debouncedParams = useDebouncedValue(params, 300);

  const query = useQuery({
    ...providerMonthAvailabilityOptions(
      providerId ?? '',
      debouncedParams ?? { year: 0, month: 1, serviceIds: [] },
      { pollingEnabled: options?.pollingEnabled },
    ),
    enabled: !!providerId && !!debouncedParams && debouncedParams.serviceIds.length > 0,
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProviderRangeAvailability(
  providerId: string | undefined,
  params: ProviderRangeAvailabilityParams | null,
  options?: ProviderAvailabilityQueryOptions,
) {
  const debouncedParams = useDebouncedValue(params, 300);

  const query = useQuery({
    ...providerRangeAvailabilityOptions(
      providerId ?? '',
      debouncedParams ?? { startDate: '', endDate: '', serviceIds: [] },
      { pollingEnabled: options?.pollingEnabled },
    ),
    enabled: !!providerId && !!debouncedParams && debouncedParams.serviceIds.length > 0,
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}
