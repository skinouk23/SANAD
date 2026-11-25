/**
 * Equipment Query Options
 *
 * Pre-built queryOptions for every equipment query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { equipmentKeys } from './keys';
import {
  getEquipment,
  getEquipmentPaginated,
  getEquipmentItem,
  getEquipmentCategories,
  getFeaturedEquipment,
  searchEquipment,
} from './service';
import type { EquipmentFilters } from './service';

// ============================================
// EQUIPMENT LIST / DETAIL OPTIONS
// ============================================

export function equipmentListOptions(filters?: EquipmentFilters) {
  return queryOptions({
    queryKey: equipmentKeys.list(filters),
    queryFn: () => getEquipment(filters),
  });
}

export function equipmentPaginatedOptions(filters?: EquipmentFilters) {
  return queryOptions({
    queryKey: equipmentKeys.catalog(filters),
    queryFn: () => getEquipmentPaginated(filters),
  });
}

export function equipmentDetailOptions(id: string) {
  return queryOptions({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => getEquipmentItem(id),
    enabled: !!id,
  });
}

export function equipmentCategoriesOptions() {
  return queryOptions({
    queryKey: equipmentKeys.categories(),
    queryFn: () => getEquipmentCategories(),
    staleTime: 5 * 60 * 1000, // Categories change rarely
  });
}

export function featuredEquipmentOptions() {
  return queryOptions({
    queryKey: equipmentKeys.featured(),
    queryFn: () => getFeaturedEquipment(),
  });
}

export function equipmentSearchOptions(query: string) {
  return queryOptions({
    queryKey: equipmentKeys.search(query),
    queryFn: () => searchEquipment(query),
    enabled: query.length >= 2,
  });
}
