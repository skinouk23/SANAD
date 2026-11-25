/**
 * Laboratory Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 */

import { useQuery } from '@tanstack/react-query';
import { laboratoryListOptions, popularTestsOptions } from '@/features/laboratory/options';
import type { Laboratory, PopularTest } from '@/features/laboratory/schema';

/**
 * Fetch laboratory listings.
 */
export function useLaboratoryList() {
  const query = useQuery(laboratoryListOptions());

  return {
    data: (query.data as Laboratory[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch popular tests.
 */
export function usePopularTests() {
  const query = useQuery(popularTestsOptions());

  return {
    data: (query.data as PopularTest[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
