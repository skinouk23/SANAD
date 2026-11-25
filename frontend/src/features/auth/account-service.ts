/**
 * Shared account profile service.
 * Persists phone/avatar state that is shared across patient and provider shells.
 */

import type { SilentErrorConfig } from '@/api/client';

import { api } from '@/api/client';
import { UserResponseSchema } from '@/features/auth/schema';

import type { UserResponse } from '@/features/auth/schema';

export interface UpdateAccountProfileRequest {
  phone?: string;
  avatarFileId?: string;
}

export async function updateAccountProfile(
  data: UpdateAccountProfileRequest,
): Promise<UserResponse> {
  const raw = await api.put<UserResponse>('/Auth/account', data, {
    _silentError: true,
  } as SilentErrorConfig);

  return UserResponseSchema.parse(raw);
}

export const accountService = {
  updateAccountProfile,
};

export default accountService;
