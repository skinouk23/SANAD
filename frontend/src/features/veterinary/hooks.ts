/**
 * Veterinary Fetch Hooks (TanStack Query)
 *
 * Combined query keys, options, and hook for veterinary config lookups.
 */

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getAnimalTypes } from './service';
import type { VeterinaryAnimalType } from './service';

export const veterinaryKeys = {
  all: ['veterinary'] as const,
  animalTypes: () => [...veterinaryKeys.all, 'animal-types'] as const,
} as const;

export function veterinaryAnimalTypesOptions() {
  return queryOptions({
    queryKey: veterinaryKeys.animalTypes(),
    queryFn: getAnimalTypes,
  });
}

export function useVeterinaryAnimalTypes() {
  const query = useQuery(veterinaryAnimalTypesOptions());

  return {
    data: (query.data as VeterinaryAnimalType[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
