import { api, type SilentErrorConfig } from '@/api/client';
import { AppFeatureListSchema } from './schema';
import type { AppFeature } from './schema';

export async function getAppFeatures(): Promise<AppFeature[]> {
  const raw = await api.get<unknown>('/features', {
    _silentError: true,
  } as SilentErrorConfig);

  return AppFeatureListSchema.parse(raw);
}

export const appFeaturesService = {
  getAppFeatures,
};
