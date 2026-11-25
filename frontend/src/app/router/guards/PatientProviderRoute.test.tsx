import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';

import { sharedMessagingRoutes } from '@/app/router/routes/sharedMessagingRoutes';
import { PatientProviderRoute } from '@/app/router/guards/PatientProviderRoute';

const { mockUseAuth, mockAuditLog } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockAuditLog: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));
vi.mock('@/shared/lib/i18n/language-context', () => ({
  useLanguage: () => ({
    t: { common: { loading: 'Loading' } },
  }),
}));

vi.mock('@/pages/messaging/MessagesPage', () => ({
  MessagesPage: () => <div>shared messaging outlet</div>,
  loader: () => null,
}));

vi.mock('@/pages/messaging/MessageChatPage', () => ({
  MessageChatPage: () => <div>shared messaging deep link</div>,
  loader: () => null,
}));

vi.mock('@/utils/audit-logger', () => ({
  auditLogger: {
    log: mockAuditLog,
  },
}));

function LocationStateProbe() {
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? 'missing';

  return <div>{`${location.pathname}|${returnTo}`}</div>;
}

function renderGuard(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Outlet />,
        children: [sharedMessagingRoutes, { path: 'auth/login', element: <LocationStateProbe /> }],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(<RouterProvider router={router} />);
}

function mockAuth(overrides?: Record<string, unknown>) {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    isAdmin: false,
    user: {
      id: 'user-1',
      email: 'user@test.com',
      role: 'provider',
      backendRole: 'provider',
      name: 'Test User',
    },
    authError: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUserAddress: vi.fn(),
    updateUser: vi.fn(),
    ...overrides,
  });
}

describe('PatientProviderRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(['patient', 'provider'] as const)(
    'allows authenticated %s users through to the outlet',
    async (role) => {
      mockAuth({
        user: {
          id: `${role}-1`,
          email: `${role}@test.com`,
          role,
          backendRole: role,
          name: `${role} user`,
        },
      });

      renderGuard('/messages');

      expect(await screen.findByText('shared messaging outlet')).toBeInTheDocument();
    },
  );

  it('allows authenticated providers through to the conversation deep link route', async () => {
    mockAuth({
      user: {
        id: 'provider-1',
        email: 'provider@test.com',
        role: 'provider',
        backendRole: 'provider',
        name: 'provider user',
      },
    });

    renderGuard('/messages/conversation-1');

    expect(await screen.findByText('shared messaging deep link')).toBeInTheDocument();
  });

  it.each(['admin', 'super_admin'] as const)(
    'blocks %s users from shared messaging',
    async (role) => {
      mockAuth({
        isAdmin: true,
        user: {
          id: `${role}-1`,
          email: `${role}@test.com`,
          role,
          backendRole: role,
          name: `${role} user`,
        },
      });

      renderGuard('/messages');

      expect(await screen.findByText('/auth/login|missing')).toBeInTheDocument();
    },
  );

  it('redirects unauthenticated users to login and preserves the full returnTo URL', async () => {
    mockAuth({
      isAuthenticated: false,
      user: null,
    });

    renderGuard('/messages/conversation-1?filter=unread#reply');

    expect(
      await screen.findByText('/auth/login|/messages/conversation-1?filter=unread#reply'),
    ).toBeInTheDocument();
  });

  it('shows translated shared-session loading copy while auth is resolving', () => {
    mockAuth({
      isLoading: true,
    });

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Outlet />,
          children: [
            {
              element: <PatientProviderRoute />,
              children: [{ path: 'messages', element: <div>shared messaging outlet</div> }],
            },
          ],
        },
      ],
      { initialEntries: ['/messages'] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('redirects unexpected authenticated roles away from shared messaging', async () => {
    mockAuth({
      user: {
        id: 'unknown-1',
        email: 'unknown@test.com',
        role: 'unknown',
        backendRole: 'unknown',
        name: 'Unknown User',
      },
    });

    renderGuard('/messages');

    expect(await screen.findByText('/auth/login|missing')).toBeInTheDocument();
  });
});
