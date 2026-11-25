export const appFeatureKeys = {
  all: ['app-features'] as const,
  list: () => [...appFeatureKeys.all, 'list'] as const,
} as const;
