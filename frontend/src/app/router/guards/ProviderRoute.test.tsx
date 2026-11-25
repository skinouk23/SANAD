import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';

import { ProviderRoute } from '@/app/router/guards/ProviderRoute';

const { mockUseAuth, mockAuditLog } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockAuditLog: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
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
        children: [
          {
            element: <ProviderRoute />,
            children: [
              { path: 'provider-dashboard', element: <div>provider dashboard outlet</div> },
            ],
          },
          { path: 'auth/login', element: <LocationStateProbe /> },
          { path: 'patient-dashboard', element: <LocationStateProbe /> },
        ],
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
      id: 'provider-1',
      email: 'provider@test.com',
      role: 'provider',
      backendRole: 'provider',
      name: 'Provider User',
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

describe('ProviderRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows authenticated providers through to the outlet', async () => {
    mockAuth();

    renderGuard('/provider-dashboard');

    expect(await screen.findByText('provider dashboard outlet')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login and preserves the full returnTo URL', async () => {
    mockAuth({
      isAuthenticated: false,
      user: null,
    });

    renderGuard('/provider-dashboard?tab=analytics#today');

    expect(
      await screen.findByText('/auth/login|/provider-dashboard?tab=analytics#today'),
    ).toBeInTheDocument();
  });

  it('redirects patients to /patient-dashboard', async () => {
    mockAuth({
      user: {
        id: 'patient-1',
        email: 'patient@test.com',
        role: 'patient',
        backendRole: 'patient',
        name: 'Patient User',
      },
    });

    renderGuard('/provider-dashboard');

    expect(await screen.findByText('/patient-dashboard|missing')).toBeInTheDocument();
  });

  it.each(['admin', 'super_admin'] as const)(
    'blocks %s users from provider routes',
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

      renderGuard('/provider-dashboard');

      expect(await screen.findByText('/auth/login|missing')).toBeInTheDocument();
    },
  );

  it('shows provider session loading copy while auth is resolving', () => {
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
              element: <ProviderRoute />,
              children: [
                { path: 'provider-dashboard', element: <div>provider dashboard outlet</div> },
              ],
            },
          ],
        },
      ],
      { initialEntries: ['/provider-dashboard'] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Validation de votre session professionnelle.')).toBeInTheDocument();
  });
});
