/**
 * Delivery Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   deliveryKeys.all                        → invalidate everything
 *   deliveryKeys.requests()                 → invalidate all request queries
 *   deliveryKeys.request(sessionId)         → invalidate one request
 */

export const deliveryKeys = {
  all: ['delivery'] as const,

  providerDeliveries: () => [...deliveryKeys.all, 'providerDelivery'] as const,
  providerDelivery: (sessionId?: string) =>
    [...deliveryKeys.providerDeliveries(), sessionId ?? ''] as const,

  requests: () => deliveryKeys.providerDeliveries(),
  request: (sessionId?: string) => deliveryKeys.providerDelivery(sessionId),
} as const;
