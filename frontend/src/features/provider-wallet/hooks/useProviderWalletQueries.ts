import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  providerWalletLedgerOptions,
  providerWalletMovementsOptions,
  providerWalletStatsOptions,
  providerWalletSummaryOptions,
  providerWalletTopUpsOptions,
} from '@/features/provider-wallet/options';

import type { ProviderWalletMovementsFilters } from '@/features/provider-wallet/service';

export function useProviderWalletSummary() {
  const query = useQuery(providerWalletSummaryOptions());

  return {
    data: query.data ?? null,
    error: query.error,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useProviderWalletStats() {
  const query = useQuery(providerWalletStatsOptions());

  return {
    data: query.data ?? null,
    error: query.error,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useProviderWalletTopUps() {
  const query = useQuery(providerWalletTopUpsOptions());

  return {
    data: query.data ?? null,
    error: query.error,
    isFetching: query.isFetching,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useProviderWalletLedger() {
  const query = useQuery(providerWalletLedgerOptions());

  return {
    data: query.data ?? null,
    error: query.error,
    isFetching: query.isFetching,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useProviderWalletMovements(filters?: ProviderWalletMovementsFilters) {
  const query = useQuery({
    ...providerWalletMovementsOptions(filters),
    placeholderData: keepPreviousData,
  });

  const result = query.data ?? null;

  return {
    data: result?.items ?? [],
    error: query.error,
    isFetching: query.isFetching,
    isRefreshing: query.isFetching && !query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    loading: query.isLoading,
    pagination: result?.pagination ?? null,
    refetch: query.refetch,
  };
}
