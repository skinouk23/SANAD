/**
 * usePatientPreferences — Query + mutation hooks for patient notification/sharing preferences.
 *
 * usePatientPreferences()   → read current preferences
 * useUpdatePreferences()    → update preferences with optimistic cache sync
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersKeys } from '@/features/users/keys';
import { patientPreferencesOptions } from '@/features/users/options';
import { updatePatientPreferences } from '@/features/users/service';

import type {
  PatientPreferencesResponse,
  UpdatePatientPreferencesRequest,
} from '@/features/family-circle/schema';

// ============================================
// HOOKS
// ============================================

/**
 * Fetch the authenticated patient's preferences.
 */
export function usePatientPreferences() {
  const query = useQuery(patientPreferencesOptions());

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

interface UpdatePreferencesContext {
  previousPreferences: PatientPreferencesResponse | null;
}

/**
 * Update the authenticated patient's preferences.
 * Owns the optimistic cache lifecycle for the patient preferences query.
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const preferencesQueryKey = usersKeys.patientPreferences();

  return useMutation({
    scope: { id: 'patient-preferences' },
    mutationFn: (data: UpdatePatientPreferencesRequest) => updatePatientPreferences(data),
    onMutate: async (patch): Promise<UpdatePreferencesContext> => {
      await queryClient.cancelQueries({ queryKey: preferencesQueryKey });

      const previousPreferences =
        queryClient.getQueryData<PatientPreferencesResponse | null>(preferencesQueryKey) ?? null;

      if (previousPreferences) {
        queryClient.setQueryData<PatientPreferencesResponse>(preferencesQueryKey, {
          ...previousPreferences,
          ...patch,
        });
      }

      return { previousPreferences };
    },
    onError: (_error, _patch, context) => {
      queryClient.setQueryData(preferencesQueryKey, context?.previousPreferences ?? null);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: preferencesQueryKey }),
  });
}
