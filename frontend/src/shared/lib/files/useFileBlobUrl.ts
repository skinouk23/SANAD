import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchAuthenticatedFileContent } from '@/shared/lib/files/file-content';

interface UseFileBlobUrlOptions {
  enabled?: boolean;
}

export function useFileBlobUrl(fileId: string | null | undefined, options?: UseFileBlobUrlOptions) {
  const query = useQuery({
    queryKey: ['files', 'content', fileId ?? ''] as const,
    queryFn: ({ signal }) => {
      if (!fileId) {
        throw new Error('File id is required.');
      }

      return fetchAuthenticatedFileContent(fileId, signal);
    },
    enabled: Boolean(fileId) && (options?.enabled ?? true),
    staleTime: 60_000,
    gcTime: 60_000,
    retry: false,
  });
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = query.data?.blob;

    if (!blob) {
      setObjectUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(blob);
    setObjectUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [query.data?.blob]);

  return {
    ...query,
    objectUrl,
    blob: query.data?.blob ?? null,
    contentType: query.data?.contentType ?? null,
    fileName: query.data?.fileName ?? null,
  };
}
