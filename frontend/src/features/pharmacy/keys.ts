/**
 * Pharmacy Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   pharmacyKeys.all                    → invalidate everything
 *   pharmacyKeys.orders()               → invalidate all patient order queries
 *   pharmacyKeys.order(filter)          → invalidate one filtered order list
 *   pharmacyKeys.stats()                → invalidate order stats
 *   pharmacyKeys.providerOrders()       → invalidate provider order list
 *   pharmacyKeys.providerOrderPrescriptionContent(orderId)
 *                                        → invalidate one provider prescription preview
 */

export const pharmacyKeys = {
  all: ['pharmacy'] as const,

  orders: () => [...pharmacyKeys.all, 'orders'] as const,
  order: (filter?: string) => [...pharmacyKeys.orders(), filter ?? 'all'] as const,

  stats: () => [...pharmacyKeys.all, 'stats'] as const,

  providerOrders: () => [...pharmacyKeys.all, 'provider-orders'] as const,
  providerOrderPrescriptionContent: (orderId: string) =>
    [...pharmacyKeys.providerOrders(), orderId, 'prescription', 'content'] as const,
} as const;
