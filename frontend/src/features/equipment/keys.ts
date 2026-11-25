/**
 * Equipment Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   equipmentKeys.all            → invalidate everything equipment-related
 *   equipmentKeys.lists()        → invalidate all list queries
 *   equipmentKeys.list(f)        → invalidate one filtered list
 *   equipmentKeys.details()      → invalidate all detail queries
 *   equipmentKeys.detail(id)     → invalidate one detail
 *   equipmentKeys.categories()   → invalidate category queries
 *   equipmentKeys.catalog(f)     → invalidate one catalog query
 */

import type { EquipmentFilters } from './service';

export const equipmentKeys = {
  all: ['equipment'] as const,

  lists: () => [...equipmentKeys.all, 'list'] as const,
  list: (filters?: EquipmentFilters) => [...equipmentKeys.lists(), filters ?? {}] as const,

  details: () => [...equipmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,

  categories: () => [...equipmentKeys.all, 'categories'] as const,

  featured: () => [...equipmentKeys.all, 'featured'] as const,

  search: (query: string) => [...equipmentKeys.all, 'search', query] as const,

  catalog: (filters?: EquipmentFilters) =>
    [...equipmentKeys.all, 'catalog', filters ?? {}] as const,
} as const;
