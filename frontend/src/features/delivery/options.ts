/**
 * Delivery Query Options
 *
 * Pre-built queryOptions for every delivery query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { deliveryKeys } from './keys';
import { getProviderDelivery } from './service';

export function providerDeliveryOptions(sessionId?: string) {
  return queryOptions({
    queryKey: deliveryKeys.providerDelivery(sessionId),
    queryFn: () => getProviderDelivery(sessionId!),
    enabled: !!sessionId,
  });
}
