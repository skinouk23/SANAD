/**
 * useProviderPreferences — Query + mutation hooks for provider notification/privacy preferences.
 *
 * useProviderPreferences()         → read current preferences
 * useUpdateProviderPreferences()   → update preferences with optimistic cache sync
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { providerKeys } from '@/features/providers/keys';
import { myProviderPreferencesOptions } from '@/features/providers/options';
import { updateMyProviderPreferences } from '@/features/providers/preferences-service';

import type {
  ProviderPreferencesResponse,
  UpdateProviderPreferencesRequest,
} from '@/features/providers/preferences-schema';

// ============================================
// HOOKS
// ============================================

/**
 * Fetch the authenticated provider's preferences.
 */
export function useProviderPreferences() {
  const query = useQuery(myProviderPreferencesOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Update the authenticated provider's preferences.
 * Owns the optimistic cache lifecycle for the provider preferences query.
 */
export function useUpdateProviderPreferences() {
  const queryClient = useQueryClient();
  const queryKey = providerKeys.myPreferences();

  return useMutation({
    scope: { id: 'provider-preferences' },
    mutationFn: (data: UpdateProviderPreferencesRequest) => updateMyProviderPreferences(data),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPreferences =
        queryClient.getQueryData<ProviderPreferencesResponse>(queryKey) ?? null;

      if (previousPreferences) {
        const optimisticPatch = Object.fromEntries(
          Object.entries(patch).filter(([, value]) => value !== null && value !== undefined),
        ) as Partial<ProviderPreferencesResponse>;

        queryClient.setQueryData<ProviderPreferencesResponse>(queryKey, {
          ...previousPreferences,
          ...optimisticPatch,
        });
      }

      return { previousPreferences };
    },
    onError: (_error, _patch, context) => {
      if (!context?.previousPreferences) {
        return;
      }

      queryClient.setQueryData(queryKey, context.previousPreferences);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
