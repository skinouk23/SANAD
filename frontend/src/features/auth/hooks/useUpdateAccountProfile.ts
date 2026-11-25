import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { updateAccountProfile } from '@/features/auth/account-service';
import { authKeys } from '@/features/auth/keys';
import { providerKeys } from '@/features/providers/keys';
import { usersKeys } from '@/features/users/keys';

import type { UpdateAccountProfileRequest } from '@/features/auth/account-service';
import type { UserResponse } from '@/features/auth/schema';

export function useUpdateAccountProfile() {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UpdateAccountProfileRequest>({
    mutationFn: updateAccountProfile,
    onSuccess: async (profile) => {
      updateUser({
        phone: profile.phoneNumber ?? undefined,
        ...(profile.avatarFileId !== undefined
          ? { avatarFileId: profile.avatarFileId ?? undefined }
          : {}),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
        queryClient.invalidateQueries({ queryKey: usersKeys.currentPatient() }),
        queryClient.invalidateQueries({ queryKey: providerKeys.profile() }),
      ]);
    },
  });
}
