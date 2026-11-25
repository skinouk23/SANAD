import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { providerAnalyticsOptions } from '@/features/analytics/options';

import type { ProviderAnalyticsPeriod } from '@/features/analytics/schema';

export function useProviderAnalytics(period: ProviderAnalyticsPeriod) {
  const query = useQuery({
    ...providerAnalyticsOptions(period),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data ?? null,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    isRefreshing: query.isFetching && !query.isLoading,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
