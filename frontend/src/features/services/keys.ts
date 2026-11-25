/**
 * Service Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   serviceKeys.all             → invalidate everything service-related
 *   serviceKeys.lists()         → invalidate all list queries
 *   serviceKeys.list(params)    → invalidate one filtered list
 *   serviceKeys.details()       → invalidate all detail queries
 *   serviceKeys.detail(id)      → invalidate one detail
 */

import type { CatalogParams } from './service';

export const serviceKeys = {
  all: ['services'] as const,

  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params?: CatalogParams) => [...serviceKeys.lists(), params ?? {}] as const,

  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,

  categories: () => [...serviceKeys.all, 'categories'] as const,

  byType: (type: string) => [...serviceKeys.all, 'byType', type] as const,
} as const;
