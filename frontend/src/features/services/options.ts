/**
 * Service Query Options
 *
 * Pre-built queryOptions for every service query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { serviceKeys } from './keys';
import {
  getServiceCatalog,
  getServiceDetail,
  getServiceCategories,
  getServicesByType,
  getServices,
} from './service';
import type { CatalogParams } from './service';

export function serviceCatalogOptions(params?: CatalogParams) {
  return queryOptions({
    queryKey: serviceKeys.list(params),
    queryFn: () => getServiceCatalog(params),
  });
}

export function serviceDetailOptions(serviceId: string) {
  return queryOptions({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => getServiceDetail(serviceId),
    enabled: !!serviceId,
  });
}

export function serviceCategoriesOptions() {
  return queryOptions({
    queryKey: serviceKeys.categories(),
    queryFn: () => getServiceCategories(),
  });
}

export function servicesByTypeOptions(serviceType: string) {
  return queryOptions({
    queryKey: serviceKeys.byType(serviceType),
    queryFn: () => getServicesByType(serviceType),
    enabled: !!serviceType,
  });
}

export function servicesOptions(category?: string) {
  return queryOptions({
    queryKey: [...serviceKeys.lists(), 'byCategory', category ?? 'all'] as const,
    queryFn: () => getServices(category),
  });
}
