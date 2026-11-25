import { queryOptions } from '@tanstack/react-query';

import { providerWalletKeys } from '@/features/provider-wallet/keys';
import {
  getProviderWalletLedger,
  getProviderWalletMovements,
  getProviderWalletStats,
  getProviderWalletSummary,
  getProviderWalletTopUps,
} from '@/features/provider-wallet/service';

import type { ProviderWalletMovementsFilters } from '@/features/provider-wallet/service';

export const defaultProviderWalletMovementFilters: Required<
  Pick<ProviderWalletMovementsFilters, 'limit' | 'page'>
> = {
  page: 1,
  limit: 10,
};

function normalizeProviderWalletMovementFilters(
  filters?: ProviderWalletMovementsFilters,
): ProviderWalletMovementsFilters {
  const page =
    filters?.page && filters.page > 0 ? filters.page : defaultProviderWalletMovementFilters.page;
  const limit =
    filters?.limit && filters.limit > 0
      ? filters.limit
      : defaultProviderWalletMovementFilters.limit;
  const search = filters?.search?.trim();

  return {
    page,
    limit,
    ...(filters?.type ? { type: filters.type } : {}),
    ...(search ? { search } : {}),
    ...(typeof filters?.month === 'number' ? { month: filters.month } : {}),
    ...(typeof filters?.year === 'number' ? { year: filters.year } : {}),
  };
}

export function providerWalletSummaryOptions() {
  return queryOptions({
    queryKey: providerWalletKeys.summary(),
    queryFn: () => getProviderWalletSummary(),
  });
}

export function providerWalletStatsOptions() {
  return queryOptions({
    queryKey: providerWalletKeys.stats(),
    queryFn: () => getProviderWalletStats(),
  });
}

export function providerWalletTopUpsOptions() {
  return queryOptions({
    queryKey: providerWalletKeys.topUps(),
    queryFn: () => getProviderWalletTopUps(),
  });
}

export function providerWalletLedgerOptions() {
  return queryOptions({
    queryKey: providerWalletKeys.ledger(),
    queryFn: () => getProviderWalletLedger(),
  });
}

export function providerWalletMovementsOptions(filters?: ProviderWalletMovementsFilters) {
  const normalizedFilters = normalizeProviderWalletMovementFilters(filters);

  return queryOptions({
    queryKey: providerWalletKeys.movements(normalizedFilters),
    queryFn: () => getProviderWalletMovements(normalizedFilters),
  });
}
