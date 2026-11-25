/**
 * Insurance Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 */

import { useQuery } from '@tanstack/react-query';
import {
  insuranceCoverageOptions,
  insuranceClaimsOptions,
  insuranceDocumentsOptions,
  insuranceStatsOptions,
} from '@/features/insurance/options';
import type {
  CoverageSection,
  InsuranceClaim,
  InsuranceDocument,
  InsuranceStats,
} from '@/features/insurance/schema';

/**
 * Fetch insurance coverage details.
 */
export function useInsuranceCoverage() {
  const query = useQuery(insuranceCoverageOptions());

  return {
    data: (query.data as CoverageSection[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch insurance claims.
 */
export function useInsuranceClaims() {
  const query = useQuery(insuranceClaimsOptions());

  return {
    data: (query.data as InsuranceClaim[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch insurance documents.
 */
export function useInsuranceDocuments() {
  const query = useQuery(insuranceDocumentsOptions());

  return {
    data: (query.data as InsuranceDocument[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch insurance stats.
 */
export function useInsuranceStats() {
  const query = useQuery(insuranceStatsOptions());

  return {
    data: (query.data as InsuranceStats | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
