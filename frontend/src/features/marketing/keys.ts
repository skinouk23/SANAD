/**
 * Marketing Query Key Factory
 *
 * Hierarchical keys enable granular invalidation.
 */

export const marketingKeys = {
  all: ['marketing'] as const,

  campaigns: () => [...marketingKeys.all, 'campaigns'] as const,
  campaignsByStatus: (status?: string) => [...marketingKeys.campaigns(), status ?? 'all'] as const,

  stats: () => [...marketingKeys.all, 'stats'] as const,
  ideas: () => [...marketingKeys.all, 'ideas'] as const,

  details: () => [...marketingKeys.all, 'detail'] as const,
  detail: (id?: string) => [...marketingKeys.details(), id ?? ''] as const,

  performance: () => [...marketingKeys.all, 'performance'] as const,
  campaignPerformance: (id?: string) => [...marketingKeys.performance(), id ?? ''] as const,

  audience: () => [...marketingKeys.all, 'audience'] as const,
  campaignAudience: (id?: string) => [...marketingKeys.audience(), id ?? ''] as const,
} as const;
