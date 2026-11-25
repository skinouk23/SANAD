import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProviderSignupFile } from '@/features/files/api';
import { fileKeys } from '@/features/files/keys';

import type {
  ProviderSignupFileUploadRequest,
  ProviderSignupFileUploadResponse,
} from '@/features/files/types';

export function useProviderSignupFileUpload() {
  const queryClient = useQueryClient();

  return useMutation<ProviderSignupFileUploadResponse, Error, ProviderSignupFileUploadRequest>({
    mutationFn: uploadProviderSignupFile,
    onSuccess: (uploadedFile) => {
      queryClient.setQueryData(fileKeys.metadata(uploadedFile.fileId), uploadedFile);
    },
  });
}
