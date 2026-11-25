/**
 * useBookingProvider — shared hook for all provider-based booking pages.
 *
 * Uses `location.state?.provider` for immediate rendering during normal
 * navigation, while still hydrating authoritative provider details from the
 * API whenever a `providerId` is available. Refreshes, direct URL access,
 * and shared links still work through the fetch path alone.
 *
 * 9 of 10 booking pages use this hook. EquipmentBooking uses its own
 * equipment fetch instead.
 */

import { useLocation } from 'react-router-dom';

import { usePublicProvider } from '@/features/providers/public-api';
import type { ProviderResponse } from '@/features/providers/public-api';

interface UseBookingProviderResult {
  provider: ProviderResponse | null;
  loading: boolean;
  error: Error | null;
  /** True when the current provider value still comes from navigation state. */
  fromState: boolean;
}

export function useBookingProvider(providerId: string | undefined): UseBookingProviderResult {
  const location = useLocation();
  const stateProvider = (location.state?.provider as ProviderResponse) ?? null;
  const { data: fetched, loading, error } = usePublicProvider(providerId);
  const provider = fetched ?? stateProvider;

  return {
    provider,
    loading: !provider && loading,
    error,
    fromState: Boolean(stateProvider && !fetched),
  };
}
