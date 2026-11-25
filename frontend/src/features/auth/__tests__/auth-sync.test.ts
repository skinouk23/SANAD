import { createElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

import type { AuthUser } from '@/features/auth/service';

const {
  mockToAuthUser,
  mockPersistAuthUser,
  mockRestoreAuthSession,
  mockShouldAttemptSessionRefreshRestore,
  mockBuildDeviceRefreshTokenRequest,
  mockGetProfile,
} = vi.hoisted(() => ({
  mockToAuthUser: vi.fn(),
  mockPersistAuthUser: vi.fn(),
  mockRestoreAuthSession: vi.fn(),
  mockShouldAttemptSessionRefreshRestore: vi.fn(),
  mockBuildDeviceRefreshTokenRequest: vi.fn(),
  mockGetProfile: vi.fn(),
}));

vi.mock('@/shared/lib/http/auth-session', () => ({
  persistAuthSession: vi.fn(),
  persistAuthUser: mockPersistAuthUser,
  restoreAuthSession: mockRestoreAuthSession,
  shouldAttemptSessionRefreshRestore: mockShouldAttemptSessionRefreshRestore,
  touchPersistedSession: vi.fn(),
  clearPersistedAuthSession: vi.fn(),
  buildDeviceRefreshTokenRequest: mockBuildDeviceRefreshTokenRequest,
}));

vi.mock('@/features/auth/service', () => ({
  login: vi.fn(),
  register: vi.fn(),
  refreshToken: vi.fn(),
  getProfile: mockGetProfile,
  toAuthUser: mockToAuthUser,
  DEFAULT_PATIENT_ADDRESS: {
    street: '15 Rue de la Liberté',
    city: 'Tunis',
    region: 'Tunis',
    postalCode: '1000',
    country: 'Tunisie',
    latitude: 36.8065,
    longitude: 10.1815,
    fullAddress: '15 Rue de la Liberté, 1000 Tunis, Tunisie',
  },
}));

vi.mock('@/utils/audit-logger', () => ({
  auditLogger: {
    setUserContext: vi.fn(),
    clearUserContext: vi.fn(),
    log: vi.fn(),
  },
}));

function AuthConsumer() {
  const { isLoading, user, updateUser } = useAuth();

  if (isLoading) {
    return createElement('div', null, 'loading');
  }

  return createElement(
    'div',
    null,
    createElement('div', { 'data-testid': 'phone' }, user?.phone ?? 'none'),
    createElement('div', { 'data-testid': 'avatar-file-id' }, user?.avatarFileId ?? 'none'),
    createElement(
      'button',
      {
        type: 'button',
        onClick: () =>
          updateUser({
            phone: '+216 55 444 333',
            avatarFileId: 'avatar-updated-file-id',
          }),
      },
      'Update user',
    ),
  );
}

describe('AuthContext auth sync', () => {
  const initialUser: AuthUser = {
    id: 'user-1',
    email: 'stored@test.com',
    role: 'patient',
    backendRole: 'patient',
    name: 'Stored User',
    phone: '+216 20 111 222',
    avatarFileId: 'avatar-initial-file-id',
    address: {
      street: '15 Rue de la Liberté',
      city: 'Tunis',
      region: 'Tunis',
      postalCode: '1000',
      country: 'Tunisie',
      fullAddress: '15 Rue de la Liberté, 1000 Tunis, Tunisie',
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('updateUser persists patched user to context', async () => {
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
    mockRestoreAuthSession.mockResolvedValue({
      token: 'stored-token',
      refreshToken: null,
      user: initialUser,
      sessionState: {
        id: 'session-1',
        createdAt: Date.now(),
        lastActivity: Date.now(),
      },
      hasPersistentSessionPreference: false,
      hasValidSession: true,
    });
    mockShouldAttemptSessionRefreshRestore.mockResolvedValue(false);
    mockPersistAuthUser.mockResolvedValue(undefined);
    mockBuildDeviceRefreshTokenRequest.mockResolvedValue({ deviceFingerprint: 'dfp_test' });
    mockGetProfile.mockResolvedValue({
      id: initialUser.id,
      email: initialUser.email,
      firstName: 'Stored',
      lastName: 'User',
      phoneNumber: initialUser.phone,
      avatar: null,
      avatarFileId: initialUser.avatarFileId,
      role: initialUser.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    render(createElement(AuthProvider, null, createElement(AuthConsumer)));

    await waitFor(() => {
      expect(screen.getByTestId('phone')).toHaveTextContent(initialUser.phone ?? '');
    });

    await waitFor(() => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1);
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Update user' }));

    await waitFor(() => {
      expect(screen.getByTestId('phone')).toHaveTextContent('+216 55 444 333');
      expect(screen.getByTestId('avatar-file-id')).toHaveTextContent('avatar-updated-file-id');
    });

    await waitFor(() => {
      expect(mockPersistAuthUser).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: initialUser.id,
          email: initialUser.email,
          role: initialUser.role,
          backendRole: initialUser.backendRole,
          name: initialUser.name,
          phone: '+216 55 444 333',
          avatarFileId: 'avatar-updated-file-id',
        }),
      );
    });
  });
});
