import { queryOptions } from '@tanstack/react-query';

import {
  getMyProviderPaymentHistory,
  getMyProviderPaymentHistoryStats,
  providerPaymentHistorySortOptions,
} from '@/features/transactions/provider-history/service';

import type {
  ProviderPaymentHistoryFilters,
  ProviderPaymentHistorySort,
} from '@/features/transactions/provider-history/service';

export { providerPaymentHistorySortOptions } from '@/features/transactions/provider-history/service';

const providerPaymentHistoryKeys = {
  all: ['provider-payment-history'] as const,
  list: (filters: ProviderPaymentHistoryFilters) =>
    [...providerPaymentHistoryKeys.all, 'list', filters] as const,
  stats: () => [...providerPaymentHistoryKeys.all, 'stats'] as const,
};

export const defaultProviderPaymentHistoryFilters: Required<
  Pick<ProviderPaymentHistoryFilters, 'page' | 'limit' | 'sort'>
> = {
  page: 1,
  limit: 10,
  sort: providerPaymentHistorySortOptions.createdAtDesc,
};

function normalizeSort(sort?: ProviderPaymentHistorySort): ProviderPaymentHistorySort {
  return sort === providerPaymentHistorySortOptions.processedAtDesc
    ? providerPaymentHistorySortOptions.processedAtDesc
    : providerPaymentHistorySortOptions.createdAtDesc;
}

export function normalizeProviderPaymentHistoryFilters(
  filters?: ProviderPaymentHistoryFilters,
): ProviderPaymentHistoryFilters {
  const page =
    filters?.page && filters.page > 0 ? filters.page : defaultProviderPaymentHistoryFilters.page;
  const limit =
    filters?.limit && filters.limit > 0
      ? filters.limit
      : defaultProviderPaymentHistoryFilters.limit;
  const search = filters?.search?.trim();

  return {
    page,
    limit,
    sort: normalizeSort(filters?.sort),
    ...(filters?.status ? { status: filters.status } : {}),
    ...(search ? { search } : {}),
    ...(filters?.dateFrom ? { dateFrom: filters.dateFrom } : {}),
    ...(filters?.dateTo ? { dateTo: filters.dateTo } : {}),
  };
}

export function providerPaymentHistoryOptions(filters?: ProviderPaymentHistoryFilters) {
  const normalizedFilters = normalizeProviderPaymentHistoryFilters(filters);

  return queryOptions({
    queryKey: providerPaymentHistoryKeys.list(normalizedFilters),
    queryFn: () => getMyProviderPaymentHistory(normalizedFilters),
  });
}

export function providerPaymentHistoryStatsOptions() {
  return queryOptions({
    queryKey: providerPaymentHistoryKeys.stats(),
    queryFn: () => getMyProviderPaymentHistoryStats(),
  });
}
