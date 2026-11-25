import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '@/features/files/api';
import { fileKeys } from '@/features/files/keys';

import type { FileUploadResponse, UploadFileRequest } from '@/features/files/types';

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation<FileUploadResponse, Error, UploadFileRequest>({
    mutationFn: uploadFile,
    onSuccess: (uploadedFile) => {
      queryClient.setQueryData(fileKeys.metadata(uploadedFile.fileId), uploadedFile);
    },
  });
}
