import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { queryClient } from '@/shared/lib/query/client';

const UNSUPPORTED_ACCOUNT_ERROR = "Ce compte n'est pas pris en charge dans cette application.";

const {
  mockAuthLogin,
  mockRegister,
  mockRefreshToken,
  mockGetProfile,
  mockToAuthUser,
  mockPersistAuthSession,
  mockPersistAuthUser,
  mockRestoreAuthSession,
  mockShouldAttemptSessionRefreshRestore,
  mockTouchPersistedSession,
  mockClearPersistedAuthSession,
  mockBuildDeviceRefreshTokenRequest,
  mockCheckRateLimit,
  mockResetRateLimit,
  mockSetTokenCache,
  mockAuditLog,
  mockSetUserContext,
  mockClearUserContext,
  mockParseRegisterUserRequest,
} = vi.hoisted(() => ({
  mockAuthLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockRefreshToken: vi.fn(),
  mockGetProfile: vi.fn(),
  mockToAuthUser: vi.fn(),
  mockPersistAuthSession: vi.fn(),
  mockPersistAuthUser: vi.fn(),
  mockRestoreAuthSession: vi.fn(),
  mockShouldAttemptSessionRefreshRestore: vi.fn(),
  mockTouchPersistedSession: vi.fn(),
  mockClearPersistedAuthSession: vi.fn(),
  mockBuildDeviceRefreshTokenRequest: vi.fn(),
  mockCheckRateLimit: vi.fn(),
  mockResetRateLimit: vi.fn(),
  mockSetTokenCache: vi.fn(),
  mockAuditLog: vi.fn(),
  mockSetUserContext: vi.fn(),
  mockClearUserContext: vi.fn(),
  mockParseRegisterUserRequest: vi.fn(),
}));

vi.mock('@/features/auth/service', () => ({
  login: mockAuthLogin,
  register: mockRegister,
  refreshToken: mockRefreshToken,
  getProfile: mockGetProfile,
  toAuthUser: mockToAuthUser,
  DEFAULT_PATIENT_ADDRESS: {
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    fullAddress: '',
  },
}));

vi.mock('@/shared/lib/http/auth-session', () => ({
  persistAuthSession: mockPersistAuthSession,
  persistAuthUser: mockPersistAuthUser,
  restoreAuthSession: mockRestoreAuthSession,
  shouldAttemptSessionRefreshRestore: mockShouldAttemptSessionRefreshRestore,
  touchPersistedSession: mockTouchPersistedSession,
  clearPersistedAuthSession: mockClearPersistedAuthSession,
  buildDeviceRefreshTokenRequest: mockBuildDeviceRefreshTokenRequest,
}));

vi.mock('@/features/auth/schema', () => ({
  parseRegisterUserRequest: mockParseRegisterUserRequest,
}));

vi.mock('@/utils/security', async () => {
  const actual = await vi.importActual<typeof import('@/utils/security')>('@/utils/security');

  return {
    ...actual,
    checkRateLimit: mockCheckRateLimit,
    resetRateLimit: mockResetRateLimit,
  };
});

vi.mock('@/api/client', () => ({
  setTokenCache: mockSetTokenCache,
}));

vi.mock('@/utils/audit-logger', () => ({
  auditLogger: {
    log: mockAuditLog,
    setUserContext: mockSetUserContext,
    clearUserContext: mockClearUserContext,
  },
}));

function AuthWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

function buildLoginUser(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: 'user-1',
    email: 'user@test.com',
    role: 'patient',
    name: 'Patient User',
    phone: null,
    avatar: null,
    avatarFileId: null,
    countryCode: null,
    ...(overrides ?? {}),
  };
}

function buildLoginResponse(overrides?: {
  user?: Partial<Record<string, unknown>>;
  token?: string;
  refreshToken?: string | null;
}) {
  return {
    token: overrides?.token ?? 'token-1',
    refreshToken: overrides?.refreshToken ?? 'refresh-token-1',
    expiresIn: 3600,
    user: buildLoginUser(overrides?.user),
  };
}

function buildProfileResponse(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: 'user-1',
    email: 'user@test.com',
    firstName: 'Patient',
    lastName: 'User',
    phoneNumber: null,
    avatar: null,
    avatarFileId: null,
    role: 'patient',
    isActive: true,
    createdAt: new Date().toISOString(),
    ...(overrides ?? {}),
  };
}

function buildStoredUser(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: 'stored-user-1',
    email: 'stored@test.com',
    role: 'patient',
    backendRole: 'patient',
    name: 'Stored User',
    phone: '+216 20 111 222',
    ...(overrides ?? {}),
  };
}

function buildRestoredSession(overrides?: Partial<Record<string, unknown>>) {
  return {
    token: 'stored-token',
    refreshToken: 'stored-refresh-token',
    user: buildStoredUser(),
    sessionState: {
      id: 'session-1',
      createdAt: Date.now(),
      lastActivity: Date.now(),
    },
    hasPersistentSessionPreference: false,
    hasValidSession: true,
    ...(overrides ?? {}),
  };
}

describe('AuthProvider role handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCheckRateLimit.mockReturnValue(true);
    mockRestoreAuthSession.mockResolvedValue({
      token: null,
      refreshToken: null,
      user: null,
      sessionState: null,
      hasPersistentSessionPreference: false,
      hasValidSession: false,
    });
    mockShouldAttemptSessionRefreshRestore.mockResolvedValue(false);
    mockPersistAuthSession.mockResolvedValue({
      sessionId: 'session-id',
      activityAt: Date.now(),
    });
    mockPersistAuthUser.mockResolvedValue(undefined);
    mockBuildDeviceRefreshTokenRequest.mockImplementation((refreshToken: string | null) =>
      Promise.resolve({
        ...(refreshToken ? { refreshToken } : {}),
        deviceFingerprint: 'dfp_test',
      }),
    );
    mockParseRegisterUserRequest.mockImplementation((input: unknown) => input);
    mockAuthLogin.mockResolvedValue(buildLoginResponse());
    mockRegister.mockResolvedValue(buildLoginResponse());
    mockRefreshToken.mockResolvedValue(buildLoginResponse({ token: 'refreshed-token' }));
    mockGetProfile.mockResolvedValue(buildProfileResponse());
    mockToAuthUser.mockImplementation(
      (
        user: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          avatarFileId?: string | null;
          countryCode?: string | null;
        },
        options: {
          role: 'patient' | 'provider';
          backendRole: string;
          serviceType?: string;
          address?: unknown;
        },
      ) => ({
        id: user.id,
        email: user.email,
        role: options.role,
        backendRole: options.backendRole,
        name: user.name,
        phone: user.phone ?? undefined,
        avatarFileId: user.avatarFileId ?? undefined,
        countryCode: user.countryCode ?? undefined,
        serviceType: options.serviceType,
        address: options.address,
      }),
    );
  });

  it('clears cached queries when a new session is persisted during login', async () => {
    const clearSpy = vi.spyOn(queryClient, 'clear');
    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login('user@test.com', 'secret');
    });

    expect(mockPersistAuthSession).toHaveBeenCalledTimes(1);
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('rejects unsupported admin roles before persisting a session during login', async () => {
    mockAuthLogin.mockResolvedValue(
      buildLoginResponse({
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          role: 'admin',
          name: 'Admin User',
        },
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(result.current.login('admin@test.com', 'secret')).rejects.toThrow(
      UNSUPPORTED_ACCOUNT_ERROR,
    );

    await waitFor(() => {
      expect(result.current.authError).toBe(UNSUPPORTED_ACCOUNT_ERROR);
    });

    expect(mockPersistAuthSession).not.toHaveBeenCalled();
    expect(mockClearPersistedAuthSession).toHaveBeenCalled();
  });

  it('rejects unsupported roles during registration before persisting a session', async () => {
    mockRegister.mockResolvedValue(
      buildLoginResponse({
        user: {
          id: 'pilot-1',
          email: 'pilot@test.com',
          role: 'pilot',
          name: 'Pilot User',
        },
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.register({
        email: 'pilot@test.com',
        password: 'secret',
        firstName: 'Pilot',
        lastName: 'User',
        role: 'patient',
      }),
    ).rejects.toThrow(UNSUPPORTED_ACCOUNT_ERROR);

    await waitFor(() => {
      expect(result.current.authError).toBe(UNSUPPORTED_ACCOUNT_ERROR);
    });

    expect(mockPersistAuthSession).not.toHaveBeenCalled();
    expect(mockClearPersistedAuthSession).toHaveBeenCalled();
  });

  it('persists a session immediately after provider registration', async () => {
    mockRegister.mockResolvedValue(
      buildLoginResponse({
        user: {
          id: 'provider-1',
          email: 'provider@test.com',
          role: 'provider',
          name: 'Provider User',
        },
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const registeredUser = await result.current.register({
        email: 'provider@test.com',
        password: 'secret',
        firstName: 'Provider',
        lastName: 'User',
        role: 'provider',
        serviceType: 'doctor',
      });

      expect(registeredUser.role).toBe('provider');
    });

    expect(mockPersistAuthSession).toHaveBeenCalledTimes(1);
    expect(mockClearPersistedAuthSession).not.toHaveBeenCalled();
  });

  it('rejects restored sessions whose persisted backend role is unsupported', async () => {
    mockRestoreAuthSession.mockResolvedValue(
      buildRestoredSession({
        user: buildStoredUser({
          role: 'patient',
          backendRole: 'admin',
        }),
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.authError).toBe(UNSUPPORTED_ACCOUNT_ERROR);
    });

    expect(mockClearPersistedAuthSession).toHaveBeenCalled();
    expect(mockPersistAuthUser).not.toHaveBeenCalled();
  });

  it('logs out a restored user when profile refresh resolves to an unsupported role', async () => {
    mockRestoreAuthSession.mockResolvedValue(buildRestoredSession());
    mockGetProfile.mockResolvedValue(
      buildProfileResponse({
        role: 'pilot',
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.authError).toBe(UNSUPPORTED_ACCOUNT_ERROR);
    });

    expect(mockPersistAuthUser).not.toHaveBeenCalled();
    expect(mockClearPersistedAuthSession).toHaveBeenCalled();
  });

  it('rejects refresh-token restore when the refreshed profile has an unsupported role', async () => {
    mockRestoreAuthSession.mockResolvedValue(
      buildRestoredSession({
        token: null,
        user: null,
        sessionState: null,
        hasPersistentSessionPreference: true,
        hasValidSession: false,
      }),
    );
    mockShouldAttemptSessionRefreshRestore.mockResolvedValue(true);
    mockBuildDeviceRefreshTokenRequest.mockResolvedValue({
      refreshToken: 'stored-refresh-token',
      deviceFingerprint: 'dfp_test',
    });
    mockGetProfile.mockResolvedValue(
      buildProfileResponse({
        role: 'pilot',
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.authError).toBe(UNSUPPORTED_ACCOUNT_ERROR);
    });

    expect(mockPersistAuthSession).not.toHaveBeenCalled();
    expect(mockClearPersistedAuthSession).toHaveBeenCalled();
  });
});
