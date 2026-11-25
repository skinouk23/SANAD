/**
 * Rewards Query Key Factory
 *
 * Hierarchical keys enable granular invalidation.
 */

export const rewardsKeys = {
  all: ['rewards'] as const,

  profile: () => [...rewardsKeys.all, 'profile'] as const,
  levels: () => [...rewardsKeys.all, 'levels'] as const,
  activity: () => [...rewardsKeys.all, 'activity'] as const,
  earnActions: () => [...rewardsKeys.all, 'earn-actions'] as const,
} as const;
