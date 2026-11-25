/**
 * useCurrentPatient — Query + mutation hooks for the authenticated patient's profile.
 *
 * useCurrentPatient()         → read current patient profile
 * useUpdatePatientProfile()   → mutate profile, invalidates cache on success
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myPatientProfileOptions } from '@/features/users/options';
import { usersKeys } from '@/features/users/keys';
import { updateCurrentPatient } from '@/features/users/service';
import type { UpdatePatientProfileRequest } from '@/features/family-circle/schema';

// ============================================
// HOOKS
// ============================================

/**
 * Fetch the authenticated patient's profile.
 * Shares the same cache key as the route loader (myPatientProfileOptions).
 */
export function useCurrentPatient() {
  const query = useQuery(myPatientProfileOptions());

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
 * Update the authenticated patient's profile.
 * Invalidates the current-patient cache on success.
 */
export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientProfileRequest) => updateCurrentPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.currentPatient() });
    },
  });
}
