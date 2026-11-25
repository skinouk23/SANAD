/**
 * Provider Mutation Hooks (TanStack Query)
 *
 * All 5 provider mutations with standard invalidation-on-success.
 * No optimistic updates — these aren't latency-critical like booking cancel/rate.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from '@/features/bookings/keys';
import { providerKeys } from '@/features/providers/keys';
import {
  updateMyProviderProfile,
  toggleMyAvailability,
  replaceMyProviderSchedules,
  createMyProviderUnavailability,
  updateMyProviderUnavailability,
  deleteMyProviderUnavailability,
  addService,
  requestMyProviderVerification,
  updateService,
  attachServicePhoto,
  removeService,
  toggleService,
} from '@/features/providers/service';
import { uploadFile, waitForFileReady } from '@/features/files';
import type {
  UpdateMyProviderProfileRequest,
  UpdateProviderAvailabilityRequest,
  UpsertProviderScheduleInterval,
  CreateProviderUnavailabilityRequest,
  UpdateProviderUnavailabilityRequest,
} from '@/features/providers/schema';
import type {
  CreateServiceRequest,
  ServicePhotoResponse,
  UpdateServiceRequest,
} from '@/features/services/schema';

interface UploadAndAttachServicePhotoVariables {
  serviceId: string;
  file: File;
  isMain?: boolean;
  sortOrder?: number;
  signal?: AbortSignal;
}

function invalidateProviderPlanningQueries(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: providerKeys.dashboard() });
  void qc.invalidateQueries({ queryKey: providerKeys.myAvailability() });
  void qc.invalidateQueries({ queryKey: providerKeys.myPlanningRoot() });
  void qc.invalidateQueries({ queryKey: providerKeys.mySchedules() });
  void qc.invalidateQueries({ queryKey: providerKeys.myUnavailabilitiesRoot() });
  void qc.invalidateQueries({ queryKey: providerKeys.schedules() });
  void qc.invalidateQueries({ queryKey: providerKeys.monthAvailabilities() });
  void qc.invalidateQueries({ queryKey: providerKeys.rangeAvailabilities() });
  void qc.invalidateQueries({ queryKey: bookingKeys.providerDashboardToday() });
}

// ============================================
// PROFILE MUTATION
// ============================================

/**
 * Update the authenticated provider's profile.
 * Invalidates profile cache on success.
 */
export function useUpdateMyProviderProfile() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateMyProviderProfileRequest) => updateMyProviderProfile(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.profile() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// AVAILABILITY MUTATION
// ============================================

/**
 * Toggle the authenticated provider's availability status.
 * Invalidates availability cache on success.
 */
export function useToggleAvailability() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateProviderAvailabilityRequest) => toggleMyAvailability(data),
    onSuccess: () => {
      invalidateProviderPlanningQueries(qc);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// VERIFICATION MUTATION
// ============================================

/** Request document verification for the authenticated provider. */
export function useRequestProviderVerification() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => requestMyProviderVerification(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.profile() });
      void qc.invalidateQueries({ queryKey: providerKeys.dashboard() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// PLANNING MUTATIONS
// ============================================

/**
 * Replace the authenticated provider's weekly schedule intervals.
 */
export function useReplaceProviderSchedules() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpsertProviderScheduleInterval[]) => replaceMyProviderSchedules(data),
    onSuccess: () => {
      invalidateProviderPlanningQueries(qc);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? [],
    reset: mutation.reset,
  };
}

/**
 * Create a provider unavailability entry.
 */
export function useCreateProviderUnavailability() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateProviderUnavailabilityRequest) => createMyProviderUnavailability(data),
    onSuccess: () => {
      invalidateProviderPlanningQueries(qc);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Update a provider unavailability entry.
 */
export function useUpdateProviderUnavailability() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProviderUnavailabilityRequest }) =>
      updateMyProviderUnavailability(id, data),
    onSuccess: () => {
      invalidateProviderPlanningQueries(qc);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Delete a provider unavailability entry.
 */
export function useDeleteProviderUnavailability() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteMyProviderUnavailability(id),
    onSuccess: () => {
      invalidateProviderPlanningQueries(qc);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

// ============================================
// SERVICE MUTATIONS
// ============================================

/**
 * Add a new service to the provider's offerings.
 * Invalidates myServices cache on success.
 */
export function useAddService() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateServiceRequest) => addService(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.myServices() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Update an existing provider service.
 * Invalidates myServices cache on success.
 */
export function useUpdateService() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      updateService(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.myServices() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Upload a service photo asset and attach it to an existing provider service.
 */
export function useUploadAndAttachServicePhoto() {
  const qc = useQueryClient();
  const mutation = useMutation<ServicePhotoResponse, Error, UploadAndAttachServicePhotoVariables>({
    mutationFn: async ({ serviceId, file, isMain, sortOrder, signal }) => {
      const uploaded = await uploadFile({
        file,
        useCase: 'ServicePhoto',
        relatedServiceId: serviceId,
        signal,
      });

      if (!uploaded.fileId) {
        throw new Error('Service photo upload did not return a file id.');
      }

      await waitForFileReady(uploaded.fileId, { signal });

      return attachServicePhoto(serviceId, {
        fileId: uploaded.fileId,
        isMain,
        sortOrder,
      });
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: providerKeys.myServices() });
      void qc.invalidateQueries({ queryKey: providerKeys.myServiceDetail(variables.serviceId) });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Remove a service from the provider's offerings.
 * Invalidates myServices cache on success.
 */
export function useRemoveService() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => removeService(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.myServices() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}

/**
 * Toggle a service's active status.
 * Invalidates myServices cache on success.
 */
export function useToggleService() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleService(id, isActive),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerKeys.myServices() });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
