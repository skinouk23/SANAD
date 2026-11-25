import { queryOptions } from '@tanstack/react-query';
import { getFileContent, getFileMetadata } from '@/features/files/api';
import { fileKeys } from '@/features/files/keys';

import type { FileMetadata } from '@/features/files/types';

export function isFileProcessing(status: FileMetadata['status'] | undefined): boolean {
  return (
    status === 'pending_scan' ||
    status === 'scanning' ||
    status === 'uploading' ||
    status === 'staged'
  );
}

export function fileMetadataOptions(fileId: string | null | undefined) {
  return queryOptions({
    queryKey: fileKeys.metadata(fileId ?? ''),
    queryFn: ({ signal }) => {
      if (!fileId) {
        throw new Error('File id is required.');
      }

      return getFileMetadata(fileId, signal);
    },
    enabled: Boolean(fileId),
    refetchInterval: (query) => (isFileProcessing(query.state.data?.status) ? 2_500 : false),
    refetchIntervalInBackground: false,
    staleTime: 5_000,
  });
}

export function fileContentOptions(
  fileId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return queryOptions({
    queryKey: fileKeys.content(fileId ?? ''),
    queryFn: ({ signal }) => {
      if (!fileId) {
        throw new Error('File id is required.');
      }

      return getFileContent(fileId, signal);
    },
    enabled: Boolean(fileId) && (options?.enabled ?? true),
    staleTime: 60_000,
    gcTime: 60_000,
    retry: false,
  });
}
