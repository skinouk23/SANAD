import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BottomNav } from '@/app/shell/BottomNav';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';

const { mockUseAuth, mockLogout } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockLogout: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

function buildAuthenticatedUser(
  role: SupportedRuntimeRole,
  overrides: Record<string, unknown> = {},
) {
  return {
    id: role === 'patient' ? 'patient-1' : 'provider-1',
    email: `${role}@test.com`,
    role,
    name: role === 'patient' ? 'Sami Test' : 'Dr Nadia',
    ...overrides,
  };
}

describe('BottomNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render a provider profile entry', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      logout: mockLogout,
      user: buildAuthenticatedUser('provider'),
    });

    renderWithProviders(<BottomNav />, { route: '/provider-dashboard', locale: 'en-GB' });

    expect(screen.queryByText(/^profil$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /profil|profile/i })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/profile"]')).not.toBeInTheDocument();
  });

  it('restores the provider top-level destinations and logout action', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      logout: mockLogout,
      user: buildAuthenticatedUser('provider', {
        id: 'provider-2',
        email: 'amel@test.com',
        name: 'Dr Amel',
      }),
    });

    const { user } = renderWithProviders(<BottomNav />, {
      route: '/provider-dashboard',
      locale: 'en-GB',
    });

    expect(screen.getByRole('link', { name: /^dashboard$/i })).toHaveTextContent(/^Home$/i);
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^finances$/i })).toHaveTextContent(/^Finance$/i);
    expect(document.querySelector('a[href="/provider/schedule"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/balance"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/analytics"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/transactions"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/messages"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/aide"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/finance"]')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('does not render a patient profile entry in the bottom nav', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      logout: mockLogout,
      user: buildAuthenticatedUser('patient'),
    });

    renderWithProviders(<BottomNav />, { route: '/patient-dashboard', locale: 'en-GB' });

    expect(screen.queryByText(/^profil$/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /profil|profile/i })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/patient/profile"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/services"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/patient/services"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/equipment"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/medicaments"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^my space$/i })).toHaveTextContent(/^History$/i);
    expect(screen.getByRole('link', { name: /^medications$/i })).toHaveTextContent(/^Meds$/i);
    expect(document.querySelector('a[href="/aide"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('keeps the public navigation for guests', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
      logout: mockLogout,
      user: null,
    });

    renderWithProviders(<BottomNav />, { route: '/', locale: 'en-GB' });

    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^how it works$/i })).toHaveTextContent(/^Guide$/i);
    expect(document.querySelector('a[href="/how-it-works"]')).toBeInTheDocument();
  });

  it('does not fall back to guest navigation for an authenticated session without a user', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      logout: mockLogout,
      user: null,
    });

    const { container } = renderWithProviders(<BottomNav />, {
      route: '/provider-dashboard',
      locale: 'en-GB',
    });

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/services/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });
});
