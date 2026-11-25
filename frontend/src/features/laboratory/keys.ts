/**
 * Laboratory Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   laboratoryKeys.all            → invalidate everything
 *   laboratoryKeys.lists()        → invalidate all lab listings
 *   laboratoryKeys.popularTests() → invalidate popular tests
 */

export const laboratoryKeys = {
  all: ['laboratory'] as const,

  lists: () => [...laboratoryKeys.all, 'list'] as const,
  popularTests: () => [...laboratoryKeys.all, 'popular-tests'] as const,
} as const;
