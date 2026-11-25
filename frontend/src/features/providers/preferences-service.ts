import { api } from '@/api/client';
import type { SilentErrorConfig } from '@/api/client';
import {
  ProviderPreferencesResponseSchema,
  UpdateProviderPreferencesRequestSchema,
} from './preferences-schema';

import type {
  ProviderPreferencesResponse,
  UpdateProviderPreferencesRequest,
} from './preferences-schema';

// ============================================
// SELF-SERVICE PROVIDER PREFERENCES
// ============================================

export async function getMyProviderPreferences(): Promise<ProviderPreferencesResponse | null> {
  const raw = await api.get<ProviderPreferencesResponse>('/providers/me/preferences');
  return raw ? ProviderPreferencesResponseSchema.parse(raw) : null;
}

export async function updateMyProviderPreferences(
  data: UpdateProviderPreferencesRequest,
): Promise<ProviderPreferencesResponse | null> {
  const payload = UpdateProviderPreferencesRequestSchema.parse(data);
  const raw = await api.put<ProviderPreferencesResponse>('/providers/me/preferences', payload, {
    _silentError: true,
  } as SilentErrorConfig);
  return raw ? ProviderPreferencesResponseSchema.parse(raw) : null;
}

export const providerPreferencesService = {
  getMyProviderPreferences,
  updateMyProviderPreferences,
};

export default providerPreferencesService;
