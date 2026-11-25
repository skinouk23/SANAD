import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupServer } from 'msw/node';

import type { SecurityOverviewResponse, UserResponse } from '@/features/auth/schema';

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string | null;
}

async function createServer() {
  const { authHandlers } = await import('@/mocks/handlers/auth');

  return setupServer(...authHandlers);
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  expect(response.ok).toBe(true);

  const payload = (await response.json()) as ApiResponse<T>;

  expect(payload.status).toBe('success');
  return payload.data;
}

describe('authHandlers', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns provider-shaped auth profile data after provider login', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      await parseApiResponse(
        await fetch('http://localhost/api/v1/Auth/login?serviceType=nursing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'provider@test.com',
            password: 'Password123!',
          }),
        }),
      );

      const profile = await parseApiResponse<UserResponse>(
        await fetch('http://localhost/api/v1/Auth/profile'),
      );

      expect(profile).toEqual(
        expect.objectContaining({
          email: 'provider@test.com',
          role: 'provider',
          firstName: 'Amel',
          lastName: 'Ben Youssef',
          phoneNumber: '+216 98 123 456',
        }),
      );
    } finally {
      server.close();
    }
  });

  it('routes shared account updates through provider auth state when a provider is logged in', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      await parseApiResponse(
        await fetch('http://localhost/api/v1/Auth/login?serviceType=nursing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'provider@test.com',
            password: 'Password123!',
          }),
        }),
      );

      const updatedProfile = await parseApiResponse<UserResponse>(
        await fetch('http://localhost/api/v1/Auth/account', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: '  +216 55 444 333  ',
            avatarFileId: '22222222-2222-2222-2222-222222222222',
          }),
        }),
      );

      expect(updatedProfile.phoneNumber).toBe('+216 55 444 333');
      expect(updatedProfile.avatar).toBeNull();
      expect(updatedProfile.avatarFileId).toBe('22222222-2222-2222-2222-222222222222');

      const reloadedProfile = await parseApiResponse<UserResponse>(
        await fetch('http://localhost/api/v1/Auth/profile'),
      );

      expect(reloadedProfile.phoneNumber).toBe('+216 55 444 333');
      expect(reloadedProfile.avatar).toBeNull();
      expect(reloadedProfile.avatarFileId).toBe('22222222-2222-2222-2222-222222222222');
      expect(reloadedProfile.email).toBe('provider@test.com');
      expect(reloadedProfile.role).toBe('provider');
    } finally {
      server.close();
    }
  });

  it('does not duplicate active sessions for repeated logins from the same device fingerprint', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const loginBody = {
        email: 'provider@test.com',
        password: 'Password123!',
        deviceFingerprint: 'test-device-fingerprint',
      };

      await parseApiResponse(
        await fetch('http://localhost/api/v1/Auth/login?serviceType=nursing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginBody),
        }),
      );
      const firstOverview = await parseApiResponse<SecurityOverviewResponse>(
        await fetch('http://localhost/api/v1/Auth/security'),
      );

      await parseApiResponse(
        await fetch('http://localhost/api/v1/Auth/login?serviceType=nursing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginBody),
        }),
      );
      const secondOverview = await parseApiResponse<SecurityOverviewResponse>(
        await fetch('http://localhost/api/v1/Auth/security'),
      );

      expect(secondOverview.sessions).toHaveLength(firstOverview.sessions.length);
      expect(secondOverview.sessions.filter((session) => session.isCurrent)).toHaveLength(1);
      expect(secondOverview.sessions.find((session) => session.isCurrent)?.id).toBe(
        firstOverview.sessions.find((session) => session.isCurrent)?.id,
      );
    } finally {
      server.close();
    }
  });
});
