/**
 * Service Query Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useServices.ts query hooks.
 * Each returns { data, loading, error, refetch } to match the existing useApi interface.
 */

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  serviceCatalogOptions,
  serviceDetailOptions,
  serviceCategoriesOptions,
  servicesByTypeOptions,
} from '@/features/services/options';
import type { CatalogParams } from '@/features/services/service';

// ============================================
// CATALOG HOOKS
// ============================================

/**
 * Paginated service catalog with optional filters.
 */
export function useServiceCatalog(params?: CatalogParams) {
  const query = useQuery({
    ...serviceCatalogOptions(params),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data ?? null,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Single service detail by ID.
 */
export function useServiceDetail(serviceId?: string) {
  const query = useQuery({
    ...serviceDetailOptions(serviceId ?? ''),
    enabled: !!serviceId,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Service category groups.
 */
export function useServiceCategories() {
  const query = useQuery(serviceCategoriesOptions());

  return {
    data: query.data ?? [],
    allCategories: (query.data ?? []).flatMap((g) => g.categories ?? []),
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * First service matching a category/type code.
 * Returns the raw PatientServiceItemResponse (no legacy enrichment).
 */
export function useServiceByType(serviceType?: string) {
  const query = useQuery({
    ...servicesByTypeOptions(serviceType ?? ''),
    enabled: !!serviceType,
    placeholderData: keepPreviousData,
  });

  const firstItem = query.data?.items?.[0] ?? null;

  return {
    data: firstItem,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}
