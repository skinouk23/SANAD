import { useQuery } from '@tanstack/react-query';
import { fileMetadataOptions } from '@/features/files/options';

export function useFileMetadata(fileId: string | null | undefined) {
  return useQuery(fileMetadataOptions(fileId));
}
