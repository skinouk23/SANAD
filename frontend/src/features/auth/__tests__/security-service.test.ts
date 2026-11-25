import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupServer } from 'msw/node';

import {
  ChangePasswordRequestSchema,
  DeleteAccountRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  RegisterUserRequestSchema,
} from '@/features/auth/schema';

const { mockShowErrorToast, mockAuditLog } = vi.hoisted(() => ({
  mockShowErrorToast: vi.fn(),
  mockAuditLog: vi.fn(),
}));

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
}));

vi.mock('@/utils/audit-logger', () => ({
  auditLogger: {
    log: mockAuditLog,
  },
}));

async function createServer() {
  const { authHandlers } = await import('@/mocks/handlers/auth');

  return setupServer(...authHandlers);
}

async function importAuthService() {
  return import('@/features/auth/service');
}

async function importSecurityService() {
  return import('@/features/auth/security-service');
}

describe('ChangePasswordRequestSchema', () => {
  it('rejects an empty current password', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: '',
      newPassword: 'StrongPass123!',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected schema validation to fail for an empty current password.');
    }

    expect(result.error.flatten().fieldErrors.currentPassword).toContain(
      'Mot de passe actuel requis',
    );
  });

  it('rejects a new password shorter than 8 characters', () => {
    const result = ChangePasswordRequestSchema.safeParse({
      currentPassword: 'CurrentPass123!',
      newPassword: 'Short1!',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected schema validation to fail for a short new password.');
    }

    expect(result.error.flatten().fieldErrors.newPassword).toContain('Minimum 8 caractères requis');
  });
});

describe('DeleteAccountRequestSchema', () => {
  it('rejects an empty current password', () => {
    const result = DeleteAccountRequestSchema.safeParse({
      currentPassword: '',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected schema validation to fail for an empty current password.');
    }

    expect(result.error.flatten().fieldErrors.currentPassword).toContain(
      'Mot de passe actuel requis',
    );
  });
});

describe('auth device fingerprint request schemas', () => {
  it('allow optional device fingerprints on auth session requests', () => {
    const deviceFingerprint = 'dfp_test_device_fingerprint';

    expect(
      LoginRequestSchema.safeParse({
        email: 'patient@example.com',
        password: 'Password123!',
        deviceFingerprint,
      }).success,
    ).toBe(true);
    expect(
      RegisterUserRequestSchema.safeParse({
        email: 'patient@example.com',
        firstName: 'Patient',
        lastName: 'User',
        password: 'Password123!',
        role: 'patient',
        deviceFingerprint,
      }).success,
    ).toBe(true);
    expect(
      RefreshTokenRequestSchema.safeParse({
        refreshToken: 'mock-refresh-token',
        deviceFingerprint,
      }).success,
    ).toBe(true);
  });
});

describe('security service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the mocked security overview contract', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { getSecurityOverview } = await importSecurityService();

      const overview = await getSecurityOverview();

      expect(overview.twoFactorEnabled).toBe(false);
      expect(overview.passwordChangedAt).toBe('2026-03-15T09:30:00Z');
      expect(overview.sessions).toHaveLength(2);
      expect(overview.sessions.filter((session) => session.isCurrent)).toHaveLength(1);
      expect(overview.sessions[0]).toEqual(
        expect.objectContaining({
          id: '11111111-1111-1111-1111-111111111111',
          browserName: 'Chrome',
          deviceType: 'Chrome on Windows',
          displayName: 'Chrome on Windows',
          ipAddress: '197.0.0.21',
          isCurrent: true,
          operatingSystem: 'Windows',
        }),
      );
    } finally {
      server.close();
    }
  }, 10_000);

  it('propagates backend 400 errors when the current password is incorrect', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { changePassword } = await importSecurityService();

      await expect(
        changePassword({
          currentPassword: 'WrongPass123!',
          newPassword: 'StrongPass123!',
        }),
      ).rejects.toMatchObject({
        message: 'Current password is incorrect',
        statusCode: 400,
        errors: {
          currentPassword: ['Current password is incorrect'],
        },
      });

      expect(mockShowErrorToast).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });

  it('makes follow-up auth reads fail after account deletion without showing a delete error toast', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { deleteAccount, getSecurityOverview } = await importSecurityService();
      const { getProfile } = await importAuthService();

      await expect(
        deleteAccount({
          currentPassword: 'CurrentPass123!',
        }),
      ).resolves.toBeUndefined();

      expect(mockShowErrorToast).not.toHaveBeenCalled();

      await expect(getProfile()).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });
      await expect(getSecurityOverview()).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });

      expect(mockShowErrorToast).toHaveBeenCalledTimes(2);
    } finally {
      server.close();
    }
  });

  it('preserves legitimate security mutations on normal re-login after changePassword', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { login } = await importAuthService();
      const { changePassword, getSecurityOverview } = await importSecurityService();

      // Initial login
      await expect(
        login({
          email: 'patient@example.com',
          password: 'password',
        }),
      ).resolves.toBeDefined();

      // Get initial security state (2 sessions)
      let overview = await getSecurityOverview();
      expect(overview.sessions).toHaveLength(2);
      const initialPasswordChangedAt = overview.passwordChangedAt;

      // Change password (revokes non-current sessions)
      await expect(
        changePassword({
          currentPassword: 'CurrentPass123!',
          newPassword: 'NewPass123!',
        }),
      ).resolves.toBeUndefined();

      // Verify password change took effect (only 1 current session now)
      overview = await getSecurityOverview();
      expect(overview.sessions).toHaveLength(1);
      expect(overview.sessions[0].isCurrent).toBe(true);
      expect(overview.passwordChangedAt).not.toBe(initialPasswordChangedAt);
      const postChangePasswordAt = overview.passwordChangedAt;

      // Re-login (fresh session, same role)
      await expect(
        login({
          email: 'patient@example.com',
          password: 'password',
        }),
      ).resolves.toBeDefined();

      // Normal re-login should preserve the mutation: still 1 session + updated passwordChangedAt
      overview = await getSecurityOverview();
      expect(overview.sessions).toHaveLength(1);
      expect(overview.sessions[0].isCurrent).toBe(true);
      expect(overview.passwordChangedAt).toBe(postChangePasswordAt);
    } finally {
      server.close();
    }
  });

  it('keeps one active session for repeated login from the same browser device', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { login } = await importAuthService();
      const { getSecurityOverview } = await importSecurityService();

      await login({
        email: 'patient@example.com',
        password: 'password',
      });
      const firstOverview = await getSecurityOverview();
      const firstCurrentSession = firstOverview.sessions.find((session) => session.isCurrent);

      await login({
        email: 'patient@example.com',
        password: 'password',
      });
      const secondOverview = await getSecurityOverview();
      const secondCurrentSessions = secondOverview.sessions.filter((session) => session.isCurrent);

      expect(secondOverview.sessions).toHaveLength(firstOverview.sessions.length);
      expect(secondCurrentSessions).toHaveLength(1);
      expect(secondCurrentSessions[0]?.id).toBe(firstCurrentSession?.id);
    } finally {
      server.close();
    }
  });

  it('sends the same stable device fingerprint on login, register, and refresh token calls', async () => {
    const server = await createServer();
    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
    const requestReads: Array<Promise<void>> = [];

    server.events.on('request:start', ({ request }) => {
      const isAuthSessionRequest =
        request.url.includes('/Auth/login') ||
        request.url.includes('/Auth/register') ||
        request.url.includes('/Auth/refresh-token');

      if (request.method !== 'POST' || !isAuthSessionRequest) {
        return;
      }

      const clonedRequest = request.clone();
      requestReads.push(
        clonedRequest.json().then((body) => {
          requests.push({ url: request.url, body: body as Record<string, unknown> });
        }),
      );
    });
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { login, register, refreshToken } = await importAuthService();

      await login({
        email: 'patient@example.com',
        password: 'password',
      });
      await register({
        email: 'freshpatient@example.com',
        firstName: 'Fresh',
        lastName: 'Patient',
        password: 'FreshPass123!',
        role: 'patient',
        countryCode: 'TN',
      });
      await refreshToken({ refreshToken: 'mock_refresh_token' });

      await Promise.all(requestReads);

      const authRequests = requests.filter(
        ({ url }) =>
          url.includes('/Auth/login') ||
          url.includes('/Auth/register') ||
          url.includes('/Auth/refresh-token'),
      );
      const fingerprints = authRequests.map(({ body }) => body.deviceFingerprint);

      expect(authRequests).toHaveLength(3);
      expect(new Set(fingerprints).size).toBe(1);
      expect(fingerprints[0]).toEqual(expect.stringMatching(/^dfp_[a-f0-9]+$/));
      expect(String(fingerprints[0]).length).toBeLessThanOrEqual(255);
    } finally {
      server.close();
    }
  });

  it('[Task 2 Regression] rejects login for a deleted account in the same session', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { login } = await importAuthService();
      const { deleteAccount } = await importSecurityService();

      // Delete the account
      await expect(
        deleteAccount({
          currentPassword: 'CurrentPass123!',
        }),
      ).resolves.toBeUndefined();

      // Login should be rejected for deleted account
      await expect(
        login({
          email: 'patient@example.com',
          password: 'password',
        }),
      ).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });
    } finally {
      server.close();
    }
  });

  it('[Task 2 Regression] rejects refresh-token for a deleted account in the same session', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { refreshToken } = await importAuthService();
      const { deleteAccount } = await importSecurityService();

      // Delete the account
      await expect(
        deleteAccount({
          currentPassword: 'CurrentPass123!',
        }),
      ).resolves.toBeUndefined();

      // Refresh-token should be rejected for deleted account
      await expect(
        refreshToken({
          refreshToken: 'mock_refresh_token',
        }),
      ).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });
    } finally {
      server.close();
    }
  });

  it('[Task 2 Regression] prevents auth mutations after account deletion in the same session', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { deleteAccount, changePassword, getSecurityOverview } = await importSecurityService();

      // Delete the account
      await expect(
        deleteAccount({
          currentPassword: 'CurrentPass123!',
        }),
      ).resolves.toBeUndefined();

      // Reads should fail with 401
      await expect(getSecurityOverview()).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });

      // Mutations should also fail with 401 (regression)
      await expect(
        changePassword({
          currentPassword: 'CurrentPass123!',
          newPassword: 'NewPass123!',
        }),
      ).rejects.toMatchObject({
        message: 'Session expired. Please log in again.',
        statusCode: 401,
      });
    } finally {
      server.close();
    }
  });

  it('[Task 2 Regression] register resets the live security snapshot after prior mutations', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { login, register } = await importAuthService();
      const { changePassword, getSecurityOverview } = await importSecurityService();

      await expect(
        login({
          email: 'patient@example.com',
          password: 'password',
        }),
      ).resolves.toBeDefined();

      const initialOverview = await getSecurityOverview();
      const initialState = {
        ...initialOverview,
        sessions: initialOverview.sessions.map((session) => ({ ...session })),
      };

      await expect(
        changePassword({
          currentPassword: 'CurrentPass123!',
          newPassword: 'NewPass123!',
        }),
      ).resolves.toBeUndefined();

      let overview = await getSecurityOverview();
      expect(overview.sessions).toHaveLength(1);
      expect(overview.passwordChangedAt).not.toBe(initialState.passwordChangedAt);

      await expect(
        register({
          email: 'freshpatient@example.com',
          firstName: 'Fresh',
          lastName: 'Patient',
          password: 'FreshPass123!',
          role: 'patient',
          countryCode: 'TN',
        }),
      ).resolves.toBeDefined();

      overview = await getSecurityOverview();
      expect(overview).toEqual(initialState);
    } finally {
      server.close();
    }
  });

  it('[Task 2 Regression] register response identity matches the follow-up auth profile', async () => {
    const server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });

    try {
      const { register, getProfile } = await importAuthService();

      const registration = await register({
        email: 'identitypatient@example.com',
        firstName: 'Identity',
        lastName: 'Patient',
        password: 'IdentityPass123!',
        phone: '+216 22 333 444',
        role: 'patient',
        countryCode: 'TN',
      });
      const profile = await getProfile();

      expect(registration.user).toMatchObject({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        phone: profile.phoneNumber,
      });
      expect(registration.user.name).toBe(
        [profile.firstName, profile.lastName].filter(Boolean).join(' '),
      );
    } finally {
      server.close();
    }
  });
});
