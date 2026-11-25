import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/AppLayout';
import { LanguageProvider } from '@/shared/lib/i18n/language-context';
import { ThemeProvider } from '@/shared/lib/theme/theme-context';
import { bootstrapTestI18n, createTestQueryClient } from '@/test/renderWithProviders';
import type { SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';

const { mockUseAuth, mockUseFileBlobUrl } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseFileBlobUrl: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/shared/lib/files/useFileBlobUrl', () => ({
  useFileBlobUrl: mockUseFileBlobUrl,
}));

vi.mock('@/app/shell/BottomNav', () => ({
  BottomNav: () => null,
}));

vi.mock('@/shared/ui/composites/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

vi.mock('@/shared/ui/composites/language-selector', () => ({
  LanguageSelector: () => <div data-testid="language-selector" />,
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

function renderLayout({
  initialEntries = ['/'],
  children = [{ index: true, element: <div>test page</div> }],
}: {
  initialEntries?: string[];
  children?: RouteObject[];
} = {}) {
  const queryClient = createTestQueryClient();
  const initialI18nState = bootstrapTestI18n();
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children,
      },
    ],
    { initialEntries },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider
          initialI18nState={initialI18nState}
          initialLanguageCode={initialI18nState.code}
        >
          <RouterProvider router={router} />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFileBlobUrl.mockReturnValue({ objectUrl: null });
  });

  it('shows authenticated theme, language, and patient profile links without notifications', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      user: buildAuthenticatedUser('patient'),
    });

    renderLayout();

    const notificationLink = document.querySelector('a[href="/notifications"]');
    const avatarLink = document.querySelector('a[href="/patient/profile"]');

    expect(notificationLink).not.toBeInTheDocument();
    expect(avatarLink).toBeInTheDocument();
    expect(avatarLink).toHaveTextContent('S');
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('shows a provider avatar link pointing to /provider/profile', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      user: buildAuthenticatedUser('provider'),
    });

    renderLayout();

    const avatarLink = document.querySelector('a[href="/provider/profile"]');
    expect(avatarLink).toBeInTheDocument();
    expect(avatarLink).toHaveTextContent('D');
  });

  it('renders an avatar image when the authenticated user has an avatar file id', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      user: buildAuthenticatedUser('patient', {
        id: '3',
        email: 'avatar@test.com',
        name: 'Avatar User',
        avatarFileId: 'avatar-file-id',
      }),
    });
    mockUseFileBlobUrl.mockReturnValue({ objectUrl: 'blob:avatar-file-id' });

    renderLayout();

    const avatarLink = document.querySelector('a[href="/patient/profile"]');
    const avatarImage = avatarLink?.querySelector('img[src="blob:avatar-file-id"]');

    expect(avatarLink).toBeInTheDocument();
    expect(avatarImage).toBeInTheDocument();
    expect(avatarLink).not.toHaveTextContent('A');
  });

  it('keeps the avatar visible on profile routes without notifications', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      user: buildAuthenticatedUser('patient'),
    });

    renderLayout({
      initialEntries: ['/patient/profile'],
      children: [
        {
          path: 'patient/profile',
          element: <div>profile page</div>,
          handle: { parent: '/patient-dashboard' },
        },
      ],
    });

    expect(document.querySelector('a[href="/notifications"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/patient/profile"]')).toBeInTheDocument();
  });

  it('keeps theme and language controls for guests without authenticated links', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
      user: null,
    });

    renderLayout();

    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(document.querySelector('a[href="/notifications"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/patient/account"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/account"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/patient/profile"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/provider/profile"]')).not.toBeInTheDocument();
  });
});
