import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import { updateAccountProfile } from '@/features/auth/account-service';
import { UserResponseSchema } from '@/features/auth/schema';

const VALID_USER_RESPONSE = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  email: 'patient@test.com',
  firstName: 'Mohamed',
  lastName: 'Ben Ali',
  phoneNumber: '+216 98 123 456',
  avatar: null,
  avatarFileId: '11111111-1111-1111-1111-111111111111',
  role: 'patient',
  isActive: true,
  createdAt: '2026-04-13T10:00:00Z',
} as const;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('account service contract', () => {
  it('updates the shared account profile with silent-error semantics and zod parsing', async () => {
    const payload = {
      phone: '+216 98 765 432',
      avatarFileId: '11111111-1111-1111-1111-111111111111',
    };
    const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(VALID_USER_RESPONSE);

    await expect(updateAccountProfile(payload)).resolves.toEqual(
      UserResponseSchema.parse(VALID_USER_RESPONSE),
    );
    expect(apiPutSpy).toHaveBeenCalledWith(
      '/Auth/account',
      payload,
      expect.objectContaining({ _silentError: true }),
    );
  });
});
