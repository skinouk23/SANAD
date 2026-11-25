/**
 * Delivery Fetch Hooks (TanStack Query)
 *
 * Returns { data, loading, error, refetch } to match the existing API.
 */

import { useQuery } from '@tanstack/react-query';
import { providerDeliveryOptions } from '@/features/delivery/options';
import type { ProviderDelivery } from '@/features/delivery/schema';

/**
 * Fetch provider delivery aggregate details for a booking session.
 */
export function useProviderDelivery(sessionId?: string) {
  const query = useQuery(providerDeliveryOptions(sessionId));

  return {
    data: (query.data as ProviderDelivery | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
