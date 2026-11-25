/**
 * Provider Self-Service Query Hooks (TanStack Query)
 *
 * Hooks for authenticated providers to manage their own profile,
 * dashboard, reviews, availability, and services.
 */

import { useQuery } from '@tanstack/react-query';
import {
  myProviderProfileOptions,
  providerDashboardOptions,
  myProviderReviewsOptions,
  myProviderAvailabilityOptions,
  myProviderPlanningOptions,
  myProviderSchedulesOptions,
  myProviderUnavailabilitiesOptions,
  myServicesOptions,
  myServicePresetsOptions,
  myServiceDetailOptions,
  myServiceStatsOptions,
} from '@/features/providers/options';
import type {
  ReviewParams,
  ProviderPlanningParams,
  ProviderUnavailabilityListParams,
} from '@/features/providers/service';

// ============================================
// SELF-SERVICE QUERY HOOKS
// ============================================

/**
 * Fetch the authenticated provider's own profile.
 */
export function useMyProviderProfile() {
  const query = useQuery(myProviderProfileOptions());

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
 * Fetch the authenticated provider's dashboard data.
 */
export function useProviderDashboard() {
  const query = useQuery(providerDashboardOptions());

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
 * Fetch the authenticated provider's reviews with optional pagination.
 */
export function useMyProviderReviews(params?: ReviewParams) {
  const query = useQuery(myProviderReviewsOptions(params));

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
 * Fetch the authenticated provider's services.
 */
export function useMyServices() {
  const query = useQuery(myServicesOptions());

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
 * Fetch provider-authored service presets for the authenticated provider.
 */
export function useMyServicePresets() {
  const query = useQuery(myServicePresetsOptions());

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch full detail of a single service owned by the authenticated provider.
 */
export function useMyServiceDetail(id: string) {
  const query = useQuery(myServiceDetailOptions(id));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch aggregate statistics for the authenticated provider's services.
 */
export function useMyServiceStats() {
  const query = useQuery(myServiceStatsOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch the authenticated provider's availability settings.
 */
export function useProviderAvailability() {
  const query = useQuery(myProviderAvailabilityOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch the authenticated provider's planning state for a date range.
 */
export function useMyProviderPlanning(params: ProviderPlanningParams) {
  const query = useQuery(myProviderPlanningOptions(params));

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch the authenticated provider's weekly schedule intervals.
 */
export function useMyProviderSchedules(options?: { enabled?: boolean }) {
  const query = useQuery(myProviderSchedulesOptions(options));

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch the authenticated provider's unavailabilities for a date range.
 */
export function useMyProviderUnavailabilities(params: ProviderUnavailabilityListParams) {
  const query = useQuery(myProviderUnavailabilitiesOptions(params));

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
