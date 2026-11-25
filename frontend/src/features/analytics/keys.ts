import type { ProviderAnalyticsPeriod } from './schema';

export const analyticsKeys = {
  all: ['analytics'] as const,

  provider: () => [...analyticsKeys.all, 'provider'] as const,
  providerAnalytics: (period: ProviderAnalyticsPeriod) =>
    [...analyticsKeys.provider(), 'me', period] as const,
} as const;
