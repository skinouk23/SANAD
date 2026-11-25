/**
 * Equipment Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 *
 */

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  equipmentListOptions,
  equipmentDetailOptions,
  equipmentCategoriesOptions,
  featuredEquipmentOptions,
  equipmentSearchOptions,
  equipmentPaginatedOptions,
} from '@/features/equipment/options';
import type { EquipmentFilters } from '@/features/equipment/service';
// ============================================
// LIST HOOKS
// ============================================

/** Fetch a flat list of equipment, optionally filtered. */
export function useEquipment(filters?: EquipmentFilters) {
  const query = useQuery(equipmentListOptions(filters));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/** Fetch a single equipment item by ID. */
export function useEquipmentItem(id: string | undefined) {
  const stableId = id || '';
  const query = useQuery(equipmentDetailOptions(stableId));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/** Fetch equipment categories. */
export function useEquipmentCategories() {
  const query = useQuery(equipmentCategoriesOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/** Fetch featured / top-rated equipment. */
export function useFeaturedEquipment() {
  const query = useQuery(featuredEquipmentOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/** Search equipment by query string. */
export function useEquipmentSearch(searchQuery: string) {
  const query = useQuery(equipmentSearchOptions(searchQuery));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// ============================================
// PAGINATED HOOK
// ============================================

/**
 * Server-paginated equipment catalog.
 * Uses keepPreviousData so numbered pagination and filters keep visible results
 * while the next page is fetched in the background.
 */
export function usePaginatedEquipment(filters?: EquipmentFilters) {
  const query = useQuery({
    ...equipmentPaginatedOptions(filters),
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];

  return {
    /** Items from the current server page. */
    data: items,
    /** Compatibility alias for page-button UIs. */
    currentPageItems: items,
    /** Pagination metadata (page, limit, total, totalPages). */
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}
