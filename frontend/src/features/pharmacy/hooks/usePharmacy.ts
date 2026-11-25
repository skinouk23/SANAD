/**
 * Pharmacy Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks from
 * usePharmacy.ts (patient-side) and usePharmacyOrders.ts (provider-side).
 * Each returns { data, loading, error, refetch } to match the existing API.
 */

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  pharmacyOrdersOptions,
  pharmacyOrderStatsOptions,
  pharmacyOrdersListOptions,
  providerPharmacyOrderPrescriptionContentOptions,
} from '@/features/pharmacy/options';
import type { PharmacyOrderFilter } from '@/features/pharmacy/service';
import type {
  PharmacyOrder,
  PharmacyOrderStats,
  ProviderPharmacyOrder,
} from '@/features/pharmacy/schema';

interface ProviderOrderPrescriptionContentOptions {
  enabled?: boolean;
}

/**
 * Fetch patient pharmacy orders, optionally filtered.
 */
export function usePharmacyOrders(filter?: PharmacyOrderFilter) {
  const query = useQuery(pharmacyOrdersOptions(filter));

  return {
    data: (query.data as PharmacyOrder[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch patient pharmacy order stats.
 */
export function usePharmacyOrderStats() {
  const query = useQuery(pharmacyOrderStatsOptions());

  return {
    data: (query.data as PharmacyOrderStats | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch provider-side pharmacy orders list.
 */
export function usePharmacyOrdersList() {
  const query = useQuery(pharmacyOrdersListOptions());

  return {
    data: (query.data as ProviderPharmacyOrder[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch provider-scoped pharmacy order prescription content and expose a preview URL.
 */
export function useProviderPharmacyOrderPrescriptionContent(
  orderId: string | null | undefined,
  options?: ProviderOrderPrescriptionContentOptions,
) {
  const query = useQuery(providerPharmacyOrderPrescriptionContentOptions(orderId, options));
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = query.data?.blob;

    if (!blob) {
      setObjectUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(blob);
    setObjectUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [query.data?.blob]);

  return {
    ...query,
    objectUrl,
    blob: query.data?.blob ?? null,
    contentType: query.data?.contentType ?? null,
    fileName: query.data?.fileName ?? null,
  };
}
