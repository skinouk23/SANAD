import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/features/auth/keys';
import { authSecurityOptions } from '@/features/auth/options';
import {
  changePassword,
  deleteAccount,
  revokeOtherSessions,
  revokeSession,
} from '@/features/auth/security-service';

import type { ChangePasswordRequest, DeleteAccountRequest } from '@/features/auth/schema';
import type { ApiError } from '@/shared/schemas/api.schema';

export function useAccountSecurity(enabled = true) {
  return useQuery({
    ...authSecurityOptions(),
    enabled,
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.security() }),
        queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
      ]);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, DeleteAccountRequest>({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.profile() });
      queryClient.removeQueries({ queryKey: authKeys.security() });
      queryClient.removeQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: revokeSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.security() });
    },
  });
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: revokeOtherSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.security() });
    },
  });
}
