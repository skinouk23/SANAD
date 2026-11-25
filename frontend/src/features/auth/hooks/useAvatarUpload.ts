import { useCallback } from 'react';
import { useUpdateAccountProfile } from '@/features/auth/hooks/useUpdateAccountProfile';
import { useUploadFile, waitForFileReady } from '@/features/files';

import type { UserResponse } from '@/features/auth/schema';
import type { UploadUseCase } from '@/features/files';

type AvatarUploadUseCase = Extract<UploadUseCase, 'Avatar' | 'ProviderAvatar'>;

export interface UseAvatarUploadResult {
  upload: (file: File) => Promise<UserResponse | null>;
  uploading: boolean;
  error: Error | null;
}

function normalizeMutationError(error: unknown): Error | null {
  if (error instanceof Error) {
    return error;
  }

  return null;
}

export function useAvatarUpload(useCase: AvatarUploadUseCase = 'Avatar'): UseAvatarUploadResult {
  const {
    mutateAsync: uploadAvatarAsset,
    isPending: avatarUploading,
    error: uploadError,
  } = useUploadFile();
  const {
    mutateAsync: persistAvatar,
    isPending: avatarPersisting,
    error: mutationError,
  } = useUpdateAccountProfile();

  const upload = useCallback(
    async (file: File): Promise<UserResponse | null> => {
      const uploadedFile = await uploadAvatarAsset({
        file,
        useCase,
      }).catch(() => null);

      if (!uploadedFile?.fileId) {
        return null;
      }

      try {
        await waitForFileReady(uploadedFile.fileId, { timeoutMs: 30_000 });

        return await persistAvatar({
          avatarFileId: uploadedFile.fileId,
        });
      } catch {
        return null;
      }
    },
    [persistAvatar, uploadAvatarAsset, useCase],
  );

  return {
    upload,
    uploading: avatarUploading || avatarPersisting,
    error: uploadError ?? normalizeMutationError(mutationError),
  };
}
