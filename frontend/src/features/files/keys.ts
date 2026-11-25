export const fileKeys = {
  all: ['files'] as const,
  metadataRoot: () => [...fileKeys.all, 'metadata'] as const,
  metadata: (fileId: string) => [...fileKeys.metadataRoot(), fileId] as const,
  contentRoot: () => [...fileKeys.all, 'content'] as const,
  content: (fileId: string) => [...fileKeys.contentRoot(), fileId] as const,
} as const;
