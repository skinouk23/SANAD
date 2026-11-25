/**
 * usePatientFavorites — Query + mutation hooks for patient favorite providers.
 *
 * usePatientFavorites()  → read favorite providers list
 * useAddFavorite()       → add a provider to favorites, invalidates cache
 * useRemoveFavorite()    → remove a provider from favorites, invalidates cache
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientFavoritesOptions } from '@/features/users/options';
import { usersKeys } from '@/features/users/keys';
import { addPatientFavorite, removePatientFavorite } from '@/features/users/service';
import type { AddFavoriteRequest } from '@/features/family-circle/schema';

// ============================================
// HOOKS
// ============================================

/**
 * Fetch the authenticated patient's favorite providers.
 */
export function usePatientFavorites() {
  const query = useQuery(patientFavoritesOptions());

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Add a provider to the patient's favorites.
 * Invalidates the favorites cache on success.
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddFavoriteRequest) => addPatientFavorite(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.patientFavorites() });
    },
  });
}

/**
 * Remove a provider from the patient's favorites.
 * Invalidates the favorites cache on success.
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providerId: string) => removePatientFavorite(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.patientFavorites() });
    },
  });
}
