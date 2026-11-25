import { screen, waitFor, within } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockShowErrorToast, mockShowSuccessToast } = vi.hoisted(() => ({
  mockShowErrorToast: vi.fn(),
  mockShowSuccessToast: vi.fn(),
}));

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
  showSuccessToast: mockShowSuccessToast,
}));

import { AccountSecuritySection } from '@/features/auth/components/AccountSecuritySection';
import { renderWithProviders } from '@/test/renderWithProviders';
async function createServer() {
  const { authHandlers } = await import('@/mocks/handlers/auth');

  return setupServer(...authHandlers);
}

describe('AccountSecuritySection', () => {
  let server: ReturnType<typeof setupServer>;

  beforeEach(async () => {
    vi.resetModules();
    mockShowErrorToast.mockReset();
    mockShowSuccessToast.mockReset();
    server = await createServer();
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.close();
    vi.restoreAllMocks();
  });

  it('shows a loading state before the live security overview resolves', async () => {
    renderWithProviders(<AccountSecuritySection />);

    expect(screen.getByRole('heading', { name: /sécurité/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/mot de passe actuel/i)).not.toBeInTheDocument();

    await screen.findByLabelText(/mot de passe actuel/i);
  });

  it('renders the live password form, compact session cards, current-session badge, revoke action, and 2FA badge', async () => {
    renderWithProviders(<AccountSecuritySection />);

    await screen.findByLabelText(/mot de passe actuel/i);

    expect(screen.getByLabelText(/^nouveau mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le nouveau mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sessions actives/i })).toBeInTheDocument();
    expect(screen.getByText(/^actuel$/i)).toBeInTheDocument();
    expect(screen.getAllByText('Chrome on Windows').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Safari on iPhone').length).toBeGreaterThan(0);
    expect(screen.getByText(/ip: 197\.0\.\*\*\*\.\*\*\*/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^déconnecter$/i })).toHaveLength(1);
    expect(screen.getByText(/désactivée/i)).toBeInTheDocument();
    expect(screen.getByText(/affichage uniquement/i)).toBeInTheDocument();
  });

  it('disables password submission until all password fields are filled, matching, and strong', async () => {
    const { user } = renderWithProviders(<AccountSecuritySection />);

    const currentPasswordInput = await screen.findByLabelText(/mot de passe actuel/i);
    const newPasswordInput = screen.getByLabelText(/^nouveau mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le nouveau mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /changer le mot de passe/i });

    expect(submitButton).toBeDisabled();

    await user.click(newPasswordInput);
    await user.paste('StrongPass123!');
    await user.click(confirmPasswordInput);
    await user.paste('StrongPass123!');
    expect(submitButton).toBeDisabled();

    await user.click(currentPasswordInput);
    await user.paste('CurrentPass123!');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.clear(confirmPasswordInput);
    await user.paste('StrongPass124!');
    expect(submitButton).toBeDisabled();

    await user.clear(confirmPasswordInput);
    await user.paste('StrongPass123!');
    await user.clear(newPasswordInput);
    await user.paste('weak');
    expect(submitButton).toBeDisabled();
  });

  it('maps wrong current password responses to an error toast and keeps the form values', async () => {
    const { user } = renderWithProviders(<AccountSecuritySection />);

    const currentPasswordInput = await screen.findByLabelText(/mot de passe actuel/i);
    const newPasswordInput = screen.getByLabelText(/^nouveau mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le nouveau mot de passe/i);

    await user.type(currentPasswordInput, 'WrongPass123!');
    await user.type(newPasswordInput, 'StrongPass123!');
    await user.type(confirmPasswordInput, 'StrongPass123!');
    await user.click(screen.getByRole('button', { name: /changer le mot de passe/i }));

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(mockShowErrorToast.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ message: 'Le mot de passe actuel est incorrect.' }),
    );
    expect(currentPasswordInput).toHaveValue('WrongPass123!');
    expect(newPasswordInput).toHaveValue('StrongPass123!');
    expect(confirmPasswordInput).toHaveValue('StrongPass123!');
  });

  it('toasts success and clears the password form after a successful password change', async () => {
    const { user } = renderWithProviders(<AccountSecuritySection />);

    const currentPasswordInput = await screen.findByLabelText(/mot de passe actuel/i);
    const newPasswordInput = screen.getByLabelText(/^nouveau mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le nouveau mot de passe/i);

    await user.type(currentPasswordInput, 'CurrentPass123!');
    await user.type(newPasswordInput, 'StrongPass123!');
    await user.type(confirmPasswordInput, 'StrongPass123!');
    await user.click(screen.getByRole('button', { name: /changer le mot de passe/i }));

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith('Le mot de passe a été mis à jour.');
    });

    expect(mockShowErrorToast).not.toHaveBeenCalled();
    expect(currentPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });

  it('shows the no-other-sessions indicator instead of an empty list after revoking the remaining sessions', async () => {
    const { user } = renderWithProviders(<AccountSecuritySection />);

    await screen.findByLabelText(/mot de passe actuel/i);

    await user.click(screen.getByRole('button', { name: /révoquer toutes les autres sessions/i }));
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', {
        name: /révoquer toutes les autres sessions/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByText(/aucune autre session active/i)).toHaveLength(1);
    });
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /révoquer toutes les autres sessions/i }),
    ).toBeDisabled();
    expect(screen.queryByRole('button', { name: /^déconnecter$/i })).not.toBeInTheDocument();
  });
});
