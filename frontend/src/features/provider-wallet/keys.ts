import type { ProviderWalletMovementsFilters } from '@/features/provider-wallet/service';

export const providerWalletKeys = {
  all: ['provider-wallet'] as const,
  summary: () => [...providerWalletKeys.all, 'summary'] as const,
  stats: () => [...providerWalletKeys.all, 'stats'] as const,
  topUps: () => [...providerWalletKeys.all, 'top-ups'] as const,
  ledger: () => [...providerWalletKeys.all, 'ledger'] as const,
  movementsRoot: () => [...providerWalletKeys.all, 'movements'] as const,
  movements: (filters?: ProviderWalletMovementsFilters) =>
    [...providerWalletKeys.movementsRoot(), filters ?? {}] as const,
} as const;
