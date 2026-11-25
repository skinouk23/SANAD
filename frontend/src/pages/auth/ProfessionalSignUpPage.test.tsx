import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfessionalSignUpPage } from '@/pages/auth/ProfessionalSignUpPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const { mockRegister } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

function getStep1Inputs(container: HTMLElement) {
  const textInputs = container.querySelectorAll<HTMLInputElement>('input[type="text"]');
  const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
  const phoneInput = container.querySelector<HTMLInputElement>('input[type="tel"]');
  const experienceInput = container.querySelector<HTMLInputElement>('input[type="number"]');
  const passwordInputs = container.querySelectorAll<HTMLInputElement>('input[type="password"]');

  if (
    textInputs.length < 3 ||
    !emailInput ||
    !phoneInput ||
    !experienceInput ||
    passwordInputs.length < 2
  ) {
    throw new Error('Professional signup step 1 inputs are unavailable.');
  }

  return {
    firstNameInput: textInputs[0],
    lastNameInput: textInputs[1],
    cityInput: textInputs[2],
    emailInput,
    phoneInput,
    experienceInput,
    passwordInput: passwordInputs[0],
    confirmPasswordInput: passwordInputs[1],
  };
}

async function completeStep1(
  user: ReturnType<typeof renderWithProviders>['user'],
  container: HTMLElement,
  overrides?: Partial<{ firstName: string; lastName: string; city: string; email: string }>,
) {
  const {
    firstNameInput,
    lastNameInput,
    cityInput,
    emailInput,
    phoneInput,
    experienceInput,
    passwordInput,
    confirmPasswordInput,
  } = getStep1Inputs(container);

  await user.type(firstNameInput, overrides?.firstName ?? 'Amal');
  await user.type(lastNameInput, overrides?.lastName ?? 'Trabelsi');
  await user.type(emailInput, overrides?.email ?? 'amal@example.com');
  await user.type(phoneInput, '+21698123456');
  await user.type(cityInput, overrides?.city ?? 'Tunis');
  await user.type(experienceInput, '8');
  await user.type(passwordInput, 'StrongPass123!');
  await user.type(confirmPasswordInput, 'StrongPass123!');
  await user.click(screen.getByRole('button', { name: /continuer/i }));
}

async function completeStep3(
  user: ReturnType<typeof renderWithProviders>['user'],
  container: HTMLElement,
) {
  await user.click(screen.getByRole('button', { name: /^\+\s*ajouter$/i }));
  await user.type(screen.getByPlaceholderText(/nom du diplôme/i), 'Master Nutrition');

  const diplomaFileInput = container.querySelector<HTMLInputElement>('input[id^="diploma-file-"]');
  if (!diplomaFileInput) {
    throw new Error('Diploma file input is unavailable.');
  }

  await user.upload(
    diplomaFileInput,
    new File(['diploma'], 'diploma.pdf', { type: 'application/pdf' }),
  );
  await user.click(screen.getByRole('button', { name: /continuer/i }));
}

async function prepareFinalStep(user: ReturnType<typeof renderWithProviders>['user']) {
  await user.click(screen.getByText(/^standard$/i));
  await user.click(screen.getByRole('checkbox'));
}

describe('ProfessionalSignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockResolvedValue({ role: 'provider' });
  });

  it('requires a nutrition subtype and submits a single canonical nutrition payload', async () => {
    const { user, container } = renderWithProviders(<ProfessionalSignUpPage />);

    await completeStep1(user, container);

    const equipmentButton = screen.getByRole('button', { name: /équipement médical/i });
    const nutritionButton = screen.getByRole('button', { name: /nutrition/i });
    const continueButton = screen.getByRole('button', { name: /continuer/i });

    await user.click(equipmentButton);
    expect(equipmentButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(nutritionButton);

    expect(equipmentButton).toHaveAttribute('aria-pressed', 'false');
    expect(nutritionButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(continueButton);
    expect(screen.getByLabelText(/sous-type nutrition/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/sous-type nutrition/i), 'Chef');

    await user.click(continueButton);
    await completeStep3(user, container);
    await prepareFinalStep(user);
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));

    const submittedPayload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
    expect(submittedPayload).toEqual(
      expect.objectContaining({
        role: 'provider',
        serviceType: 'nutrition',
        nutritionProviderSubtype: 'Chef',
      }),
    );
    expect(submittedPayload).not.toHaveProperty('services');
  }, 15000);

  it('normalizes legacy category ids before submit and omits nutrition subtype for non-nutrition providers', async () => {
    const { user, container } = renderWithProviders(<ProfessionalSignUpPage />);

    await completeStep1(user, container);
    await user.click(screen.getByRole('button', { name: /équipement médical/i }));
    await user.click(screen.getByRole('button', { name: /continuer/i }));
    await completeStep3(user, container);
    await prepareFinalStep(user);
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));

    const submittedPayload = mockRegister.mock.calls[0][0] as Record<string, unknown>;
    expect(submittedPayload).toEqual(
      expect.objectContaining({
        role: 'provider',
        serviceType: 'equipment_rental',
      }),
    );
    expect(submittedPayload).not.toHaveProperty('nutritionProviderSubtype');
  }, 15000);

  it('keeps the provider on the form with values intact when registration fails', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Inscription impossible'));

    const { user, container } = renderWithProviders(<ProfessionalSignUpPage />);

    await completeStep1(user, container, {
      firstName: 'Salma',
      city: 'Sfax',
      email: 'salma@example.com',
    });
    await user.click(screen.getByRole('button', { name: /équipement médical/i }));
    await user.click(screen.getByRole('button', { name: /continuer/i }));
    await completeStep3(user, container);
    await prepareFinalStep(user);
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByText(/inscription impossible/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /créer mon compte/i })).not.toBeDisabled();
    expect(screen.getByText(/choisissez votre plan/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /retour/i }));
    await user.click(screen.getByRole('button', { name: /retour/i }));
    await user.click(screen.getByRole('button', { name: /retour/i }));

    const { firstNameInput, cityInput } = getStep1Inputs(container);
    expect(firstNameInput).toHaveValue('Salma');
    expect(cityInput).toHaveValue('Sfax');
  }, 15000);
});
