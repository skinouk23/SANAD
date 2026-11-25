/**
 * Equipment Admin Mutation Hooks (TanStack Query)
 *
 * Wraps equipment admin service functions with cache invalidation.
 * Follows the same return-shape convention as useProviderMutations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentKeys } from '@/features/equipment/keys';
import { providerKeys } from '@/features/providers/keys';
import {
  createEquipmentService,
  updateEquipmentService,
  deleteEquipmentService,
  uploadAndAttachEquipmentMainImage,
} from '@/features/equipment/admin-service';
import type {
  CreateEquipmentData,
  UpdateEquipmentData,
  UploadAndAttachEquipmentMainImageRequest,
} from '@/features/equipment/admin-service';

export function useCreateEquipment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateEquipmentData) => createEquipmentService(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: equipmentKeys.all });
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

export function useUpdateEquipment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentData }) =>
      updateEquipmentService(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: equipmentKeys.all });
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

export function useDeleteEquipment() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteEquipmentService(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: equipmentKeys.all });
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

export function useUploadAndAttachEquipmentMainImage() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: UploadAndAttachEquipmentMainImageRequest) =>
      uploadAndAttachEquipmentMainImage(request),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: equipmentKeys.all });
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
