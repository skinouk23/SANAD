/**
 * Ambulance Fetch Hooks (TanStack Query)
 *
 * Combined query keys, options, and hook for ambulance config lookups.
 */

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getServiceTypes } from './service';
import type { AmbulanceServiceType } from './service';

export const ambulanceKeys = {
  all: ['ambulance'] as const,
  serviceTypes: () => [...ambulanceKeys.all, 'service-types'] as const,
} as const;

export function ambulanceServiceTypesOptions() {
  return queryOptions({
    queryKey: ambulanceKeys.serviceTypes(),
    queryFn: getServiceTypes,
  });
}

export function useAmbulanceServiceTypes() {
  const query = useQuery(ambulanceServiceTypesOptions());

  return {
    data: (query.data as AmbulanceServiceType[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
