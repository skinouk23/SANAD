/**
 * Family Circle Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   familyCircleKeys.all             → invalidate everything
 *   familyCircleKeys.members()       → invalidate member list
 *   familyCircleKeys.validations()   → invalidate pending validations
 */

export const familyCircleKeys = {
  all: ['family-circle'] as const,

  members: () => [...familyCircleKeys.all, 'members'] as const,
  validations: () => [...familyCircleKeys.all, 'validations'] as const,
} as const;
