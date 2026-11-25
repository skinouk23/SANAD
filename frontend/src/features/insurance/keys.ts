/**
 * Insurance Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   insuranceKeys.all          → invalidate everything
 *   insuranceKeys.coverage()   → invalidate coverage query
 *   insuranceKeys.claims()     → invalidate claims query
 *   insuranceKeys.documents()  → invalidate documents query
 *   insuranceKeys.stats()      → invalidate stats query
 */

export const insuranceKeys = {
  all: ['insurance'] as const,

  coverage: () => [...insuranceKeys.all, 'coverage'] as const,
  claims: () => [...insuranceKeys.all, 'claims'] as const,
  documents: () => [...insuranceKeys.all, 'documents'] as const,
  stats: () => [...insuranceKeys.all, 'stats'] as const,
} as const;
