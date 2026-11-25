import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authKeys } from '@/features/auth/keys';
import {
  useAccountSecurity,
  useChangePassword,
  useDeleteAccount,
  useRevokeOtherSessions,
  useRevokeSession,
} from '@/features/auth/hooks/useAccountSecurity';

import type { ReactNode } from 'react';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createQueryClient();

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

async function createServer() {
  const { authHandlers } = await import('@/mocks/handlers/auth');

  return setupServer(...authHandlers);
}

describe('account security hooks', () => {
  let server: ReturnType<typeof setupServer>;

  beforeEach(async () => {
    vi.resetModules();
    server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.close();
    vi.restoreAllMocks();
  });

  it('returns the live security overview with one current session', async () => {
    const { result } = renderHook(() => useAccountSecurity(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        twoFactorEnabled: false,
        sessions: expect.arrayContaining([
          expect.objectContaining({
            id: '11111111-1111-1111-1111-111111111111',
            browserName: 'Chrome',
            deviceType: 'Chrome on Windows',
            displayName: 'Chrome on Windows',
            ipAddress: '197.0.0.21',
            isCurrent: true,
            operatingSystem: 'Windows',
          }),
          expect.objectContaining({
            id: '22222222-2222-2222-2222-222222222222',
            browserName: 'Safari',
            deviceType: 'Safari on iPhone',
            displayName: 'Safari on iPhone',
            ipAddress: '197.1.1.44',
            isCurrent: false,
            operatingSystem: 'iPhone',
          }),
        ]),
      }),
    );
    expect(result.current.data?.sessions.filter((session) => session.isCurrent)).toHaveLength(1);
  });

  it('changes the password, invalidates the security/profile queries, and refetches sessions', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(
      () => ({
        security: useAccountSecurity(),
        changePassword: useChangePassword(),
      }),
      {
        wrapper: createQueryWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(2);
    });

    const originalPasswordChangedAt = result.current.security.data?.passwordChangedAt;

    await result.current.changePassword.mutateAsync({
      currentPassword: 'CurrentPass123!',
      newPassword: 'StrongPass123!',
    });

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(1);
    });

    expect(result.current.security.data?.sessions).toEqual([
      expect.objectContaining({
        id: '11111111-1111-1111-1111-111111111111',
        isCurrent: true,
      }),
    ]);
    expect(result.current.security.data?.passwordChangedAt).not.toBe(originalPasswordChangedAt);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.security() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.profile() });
  });

  it('propagates backend 400 errors through the change-password mutation state', async () => {
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createQueryWrapper(),
    });

    await expect(
      result.current.mutateAsync({
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

    await waitFor(() => {
      expect(result.current.error).toMatchObject({
        message: 'Current password is incorrect',
        statusCode: 400,
        errors: {
          currentPassword: ['Current password is incorrect'],
        },
      });
    });
  });

  it('deletes the account and removes auth queries from the cache on success', async () => {
    const queryClient = createQueryClient();
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');
    queryClient.setQueryData(authKeys.profile(), { id: 'cached-profile' });
    queryClient.setQueryData(authKeys.security(), { sessions: ['cached-security'] });
    queryClient.setQueryData(authKeys.session(), { token: 'cached-session' });

    const { result } = renderHook(() => useDeleteAccount(), {
      wrapper: createQueryWrapper(queryClient),
    });

    await expect(
      result.current.mutateAsync({
        currentPassword: 'CurrentPass123!',
      }),
    ).resolves.toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: authKeys.profile() });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: authKeys.security() });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: authKeys.session() });
    expect(queryClient.getQueryState(authKeys.profile())).toBeUndefined();
    expect(queryClient.getQueryState(authKeys.security())).toBeUndefined();
    expect(queryClient.getQueryState(authKeys.session())).toBeUndefined();
  });

  it('revokes one session by id, invalidates security, and refetches the remaining list', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(
      () => ({
        security: useAccountSecurity(),
        revokeSession: useRevokeSession(),
      }),
      {
        wrapper: createQueryWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(2);
    });

    await result.current.revokeSession.mutateAsync('22222222-2222-2222-2222-222222222222');

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(1);
    });

    expect(result.current.security.data?.sessions).toEqual([
      expect.objectContaining({
        id: '11111111-1111-1111-1111-111111111111',
        isCurrent: true,
      }),
    ]);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.security() });
  });

  it('revokes all other sessions, invalidates security, and leaves the current session active', async () => {
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(
      () => ({
        security: useAccountSecurity(),
        revokeOtherSessions: useRevokeOtherSessions(),
      }),
      {
        wrapper: createQueryWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(2);
    });

    await result.current.revokeOtherSessions.mutateAsync();

    await waitFor(() => {
      expect(result.current.security.data?.sessions).toHaveLength(1);
    });

    expect(result.current.security.data?.sessions).toEqual([
      expect.objectContaining({
        id: '11111111-1111-1111-1111-111111111111',
        isCurrent: true,
      }),
    ]);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.security() });
  });
});
