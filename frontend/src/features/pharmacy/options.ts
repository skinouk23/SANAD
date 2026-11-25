/**
 * Pharmacy Query Options
 *
 * Pre-built queryOptions for every pharmacy query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { pharmacyKeys } from './keys';
import {
  getPharmacyOrders,
  getPharmacyOrderStats,
  getPharmacyOrdersList,
  getProviderPharmacyOrderPrescriptionContent,
} from './service';
import type { PharmacyOrderFilter } from './service';

export function pharmacyOrdersOptions(filter?: PharmacyOrderFilter) {
  return queryOptions({
    queryKey: pharmacyKeys.order(filter),
    queryFn: () => getPharmacyOrders(filter),
  });
}

export function pharmacyOrderStatsOptions() {
  return queryOptions({
    queryKey: pharmacyKeys.stats(),
    queryFn: () => getPharmacyOrderStats(),
  });
}

export function pharmacyOrdersListOptions() {
  return queryOptions({
    queryKey: pharmacyKeys.providerOrders(),
    queryFn: () => getPharmacyOrdersList(),
  });
}

export function providerPharmacyOrderPrescriptionContentOptions(
  orderId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return queryOptions({
    queryKey: pharmacyKeys.providerOrderPrescriptionContent(orderId ?? ''),
    queryFn: ({ signal }) => {
      if (!orderId) {
        throw new Error('Order id is required.');
      }

      return getProviderPharmacyOrderPrescriptionContent(orderId, signal);
    },
    enabled: Boolean(orderId) && (options?.enabled ?? true),
    staleTime: 60_000,
    gcTime: 60_000,
    retry: false,
  });
}
