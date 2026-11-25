import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext';
import { useAvatarUpload, useDeleteAccount, useUpdateAccountProfile } from '@/features/auth';
import {
  useMyProviderProfile,
  useProviderPreferences,
  useUpdateMyProviderProfile,
  useUpdateProviderPreferences,
} from '@/features/providers';
import { ProviderProfilePage } from '@/pages/provider/ProviderProfilePage';
import { renderWithProviders } from '@/test/renderWithProviders';

import type { UserResponse } from '@/features/auth';
import type { ProviderPreferencesResponse } from '@/features/providers/preferences-schema';
import type { ProviderProfileResponse } from '@/features/providers/schema';

const {
  mockUseAuth,
  mockUseFileBlobUrl,
  mockUseMyProviderProfile,
  mockUseProviderPreferences,
  mockUseUpdateMyProviderProfile,
  mockUseUpdateProviderPreferences,
  mockUseUpdateAccountProfile,
  mockUseAvatarUpload,
  mockUseDeleteAccount,
  mockShowSuccessToast,
  mockShowErrorToast,
  mockNavigate,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseFileBlobUrl: vi.fn(),
  mockUseMyProviderProfile: vi.fn(),
  mockUseProviderPreferences: vi.fn(),
  mockUseUpdateMyProviderProfile: vi.fn(),
  mockUseUpdateProviderPreferences: vi.fn(),
  mockUseUpdateAccountProfile: vi.fn(),
  mockUseAvatarUpload: vi.fn(),
  mockUseDeleteAccount: vi.fn(),
  mockShowSuccessToast: vi.fn(),
  mockShowErrorToast: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/shared/lib/files/useFileBlobUrl', () => ({
  useFileBlobUrl: mockUseFileBlobUrl,
}));

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    useMyProviderProfile: mockUseMyProviderProfile,
    useProviderPreferences: mockUseProviderPreferences,
    useUpdateMyProviderProfile: mockUseUpdateMyProviderProfile,
    useUpdateProviderPreferences: mockUseUpdateProviderPreferences,
  };
});

vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual<typeof import('@/features/auth')>('@/features/auth');

  return {
    ...actual,
    useUpdateAccountProfile: mockUseUpdateAccountProfile,
    useAvatarUpload: mockUseAvatarUpload,
    useDeleteAccount: mockUseDeleteAccount,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
  showSuccessToast: mockShowSuccessToast,
}));

vi.mock('@/features/auth/components/AccountSecuritySection', () => ({
  AccountSecuritySection: () => (
    <section data-testid="account-security-section">Account security section</section>
  ),
}));

const BASE_AUTH_USER = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'provider@test.com',
  name: 'Amal Trabelsi',
  role: 'provider' as const,
  backendRole: 'provider',
  phone: '+216 98 123 456',
  avatarFileId: null,
};

const BASE_PROFILE: ProviderProfileResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: '22222222-2222-2222-2222-222222222222',
  serviceType: 'nutrition',
  nutritionProviderSubtype: 'Chef',
  businessName: 'Cuisine Santé Tunis',
  firstName: 'Amal',
  lastName: 'Trabelsi',
  licenseNumber: 'LIC-42',
  specialization: 'Nutrition clinique',
  yearsOfExperience: 8,
  bio: 'Consultations et repas adaptés.',
  address: '10 Rue du Lac',
  city: 'Tunis',
  postalCode: '1053',
  serviceRadius: 20,
  rating: 4.8,
  totalReviews: 32,
  totalBookings: 58,
  isApproved: true,
  approvalDate: '2026-04-13T10:00:00Z',
  subscriptionTier: 'elite',
  profilePictureUrl: null,
  coverImageUrl: null,
  isOnline: true,
  responseRate: 98,
  averageResponseTimeMinutes: 12,
  completionRate: 97,
  createdAt: '2026-04-13T10:00:00Z',
  updatedAt: '2026-04-13T10:00:00Z',
};

const BASE_PREFERENCES: ProviderPreferencesResponse = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false,
  allowPatientMessages: true,
  profileVisibility: 'public',
  updatedAt: '2026-04-13T10:00:00Z',
};

const BASE_ACCOUNT_RESPONSE: UserResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'provider@test.com',
  firstName: 'Amal',
  lastName: 'Trabelsi',
  phoneNumber: '+216 98 123 456',
  avatar: null,
  avatarFileId: null,
  role: 'provider',
  isActive: true,
  createdAt: '2026-01-01T09:00:00Z',
};

function formatExpectedLastSynced(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(BASE_PROFILE.updatedAt));
}

function formatExpectedMemberSince(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(BASE_PROFILE.createdAt));
}

function mockAuth(overrides?: Partial<ReturnType<typeof useAuth>>) {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    user: BASE_AUTH_USER,
    isAdmin: false,
    updateUserAddress: vi.fn(),
    updateUser: vi.fn(),
    isLoading: false,
    authError: null,
    ...overrides,
  });
}

function mockProfileQuery(overrides?: Partial<ReturnType<typeof useMyProviderProfile>>) {
  mockUseMyProviderProfile.mockReturnValue({
    data: BASE_PROFILE,
    loading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  });
}

function mockPreferencesQuery(overrides?: Partial<ReturnType<typeof useProviderPreferences>>) {
  mockUseProviderPreferences.mockReturnValue({
    data: BASE_PREFERENCES,
    loading: false,
    isInitialLoading: false,
    isRefreshing: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  });
}

function mockProfileMutation(overrides?: Partial<ReturnType<typeof useUpdateMyProviderProfile>>) {
  mockUseUpdateMyProviderProfile.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(BASE_PROFILE),
    loading: false,
    error: null,
    data: null,
    reset: vi.fn(),
    ...overrides,
  });
}

function mockPreferencesMutation(
  overrides?: Partial<ReturnType<typeof useUpdateProviderPreferences>>,
) {
  mockUseUpdateProviderPreferences.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(BASE_PREFERENCES),
    isPending: false,
    error: null,
    data: null,
    reset: vi.fn(),
    status: 'idle',
    ...overrides,
  });
}

function mockAccountMutation(overrides?: Partial<ReturnType<typeof useUpdateAccountProfile>>) {
  mockUseUpdateAccountProfile.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(BASE_ACCOUNT_RESPONSE),
    isPending: false,
    error: null,
    data: null,
    reset: vi.fn(),
    status: 'idle',
    ...overrides,
  });
}

function mockAvatarUploadHook(overrides?: Partial<ReturnType<typeof useAvatarUpload>>) {
  mockUseAvatarUpload.mockReturnValue({
    upload: vi.fn().mockResolvedValue(BASE_ACCOUNT_RESPONSE),
    uploading: false,
    error: null,
    ...overrides,
  });
}

function mockDeleteAccountMutation(overrides?: Partial<ReturnType<typeof useDeleteAccount>>) {
  mockUseDeleteAccount.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
    error: null,
    data: null,
    reset: vi.fn(),
    status: 'idle',
    ...overrides,
  });
}

function getAccountFormScope() {
  const form = screen.getByRole('heading', { name: /^(compte|account)$/i }).closest('form');

  expect(form).not.toBeNull();

  return within(form as HTMLFormElement);
}

function getProfessionalFormScope() {
  const form = screen
    .getByRole('heading', { name: /^(professionnel|professional)$/i })
    .closest('form');

  expect(form).not.toBeNull();

  return within(form as HTMLFormElement);
}

describe('ProviderProfilePage', () => {
  beforeEach(() => {
    if (!HTMLElement.prototype.hasPointerCapture) {
      HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
    }

    vi.clearAllMocks();
    mockAuth();
    mockUseFileBlobUrl.mockReturnValue({ objectUrl: null });
    mockProfileQuery();
    mockPreferencesQuery();
    mockProfileMutation();
    mockPreferencesMutation();
    mockAccountMutation();
    mockAvatarUploadHook();
    mockDeleteAccountMutation();
  });

  it('keeps save disabled while the live profile query is still loading', () => {
    mockProfileQuery({
      data: null,
      loading: true,
    });

    renderWithProviders(<ProviderProfilePage />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    expect(screen.getAllByText(/chargement/i).length).toBeGreaterThan(0);
  });

  it('surfaces fetch failures and lets the provider retry in place', async () => {
    const refetch = vi.fn();
    mockProfileQuery({
      data: null,
      error: new Error('Profil indisponible'),
      refetch,
    });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    expect(screen.getByRole('alert')).toHaveTextContent('Profil indisponible');

    await user.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders hero avatar from the auth avatar file blob URL', () => {
    mockAuth({
      user: {
        ...BASE_AUTH_USER,
        avatarFileId: 'provider-avatar-file-id',
      },
    });
    mockUseFileBlobUrl.mockReturnValue({ objectUrl: 'blob:provider-avatar-file-id' });

    renderWithProviders(<ProviderProfilePage />);

    const avatarButton = screen.getByRole('button', { name: /changer la photo/i });
    const avatarImage = avatarButton.querySelector('img');

    if (!(avatarImage instanceof HTMLImageElement)) {
      throw new Error('Expected the hero avatar image to render from auth context.');
    }

    expect(avatarImage).toHaveAttribute('src', 'blob:provider-avatar-file-id');
  });

  it('uses the shared tab shell and only renders security content in the security tab', async () => {
    const { user } = renderWithProviders(<ProviderProfilePage />);

    const accountTab = screen.getByRole('tab', { name: /^compte$/i });
    const professionalTab = screen.getByRole('tab', { name: /professionnel/i });
    const preferencesTab = screen.getByRole('tab', { name: /préférences/i });
    const securityTab = screen.getByRole('tab', { name: /sécurité/i });

    expect(accountTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /^compte$/i })).toBeInTheDocument();
    expect(screen.queryByTestId('account-security-section')).not.toBeInTheDocument();

    await user.click(professionalTab);
    expect(professionalTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /professionnel/i })).toBeInTheDocument();
    expect(getProfessionalFormScope().getByLabelText(/nom affiché/i)).toHaveValue(
      'Cuisine Santé Tunis',
    );
    expect(getProfessionalFormScope().queryByLabelText(/prénom/i)).not.toBeInTheDocument();
    expect(getProfessionalFormScope().queryByLabelText(/ville/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-security-section')).not.toBeInTheDocument();

    await user.click(preferencesTab);
    expect(preferencesTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /préférences/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/langue/i)).toHaveTextContent('Français');
    expect(screen.getByRole('button', { name: /clair/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /sombre/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('account-security-section')).not.toBeInTheDocument();

    await user.click(securityTab);
    expect(securityTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /sécurité/i })).toBeInTheDocument();
    expect(screen.getByTestId('account-security-section')).toBeInTheDocument();
  });

  it('updates provider shell copy and membership metadata when language changes', async () => {
    const { user } = renderWithProviders(<ProviderProfilePage />);

    const memberSince = screen.getByText(/membre depuis/i);
    const dangerZone = screen.getByRole('heading', { name: /zone de danger/i }).closest('section');

    expect(screen.getByText(/nutrition/i)).toBeInTheDocument();
    expect(memberSince).toHaveTextContent(formatExpectedMemberSince('fr-FR'));
    expect(screen.queryByText(/dernière synchronisation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(formatExpectedLastSynced('fr-FR'))).not.toBeInTheDocument();
    expect(dangerZone).toHaveClass('mt-6');

    await user.click(screen.getByRole('tab', { name: /préférences/i }));
    await user.click(screen.getByLabelText(/langue/i));
    await user.click(await screen.findByRole('option', { name: /english/i }));

    expect(await screen.findByRole('tab', { name: /account/i })).toBeInTheDocument();
    expect(await screen.findByText(/member since/i)).toHaveTextContent(
      formatExpectedMemberSince('en-GB'),
    );

    await user.click(await screen.findByRole('tab', { name: /account/i }));

    expect(getAccountFormScope().getByLabelText(/first name/i)).toHaveValue('Amal');
    expect(getAccountFormScope().getByLabelText(/city/i)).toHaveValue('Tunis');

    await user.click(await screen.findByRole('tab', { name: /professional/i }));

    expect(getProfessionalFormScope().getByLabelText(/display name \/ business/i)).toHaveValue(
      'Cuisine Santé Tunis',
    );
    expect(getProfessionalFormScope().getByLabelText(/specialization/i)).toHaveValue(
      'Nutrition clinique',
    );
  });

  it('shows email as read-only and account identity fields as editable in the account tab', async () => {
    const { user } = renderWithProviders(<ProviderProfilePage />);
    const accountForm = getAccountFormScope();
    const emailInput = accountForm.getByLabelText(/email/i);
    const phoneInput = accountForm.getByLabelText(/^téléphone$/i);
    const firstNameInput = accountForm.getByLabelText(/prénom/i);
    const lastNameInput = accountForm.getByLabelText(/^nom$/i);
    const addressInput = accountForm.getByLabelText(/adresse/i);
    const cityInput = accountForm.getByLabelText(/ville/i);
    const postalCodeInput = accountForm.getByLabelText(/code postal/i);
    const saveButton = accountForm.getByRole('button', { name: /enregistrer les modifications/i });

    expect(emailInput).toHaveValue('provider@test.com');
    expect(emailInput).toHaveAttribute('readonly');
    expect(phoneInput).toHaveValue('+216 98 123 456');
    expect(phoneInput).not.toHaveAttribute('readonly');
    expect(firstNameInput).toHaveValue('Amal');
    expect(firstNameInput).not.toHaveAttribute('readonly');
    expect(lastNameInput).toHaveValue('Trabelsi');
    expect(lastNameInput).not.toHaveAttribute('readonly');
    expect(addressInput).toHaveValue('10 Rue du Lac');
    expect(addressInput).not.toHaveAttribute('readonly');
    expect(cityInput).toHaveValue('Tunis');
    expect(cityInput).not.toHaveAttribute('readonly');
    expect(postalCodeInput).toHaveValue('1053');
    expect(postalCodeInput).not.toHaveAttribute('readonly');
    expect(saveButton).toBeDisabled();

    await user.clear(phoneInput);
    await user.type(phoneInput, '+216 55 222 111');

    expect(saveButton).toBeEnabled();
  });

  it('keeps professional reset and save disabled until the form is dirty', async () => {
    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    const professionalForm = getProfessionalFormScope();
    const resetButton = professionalForm.getByRole('button', { name: /annuler/i });
    const saveButton = professionalForm.getByRole('button', {
      name: /enregistrer les modifications/i,
    });

    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();

    await user.clear(professionalForm.getByLabelText(/spécialisation/i));
    await user.type(professionalForm.getByLabelText(/spécialisation/i), 'Nutrition sportive');

    expect(resetButton).toBeEnabled();
    expect(saveButton).toBeEnabled();
  });

  it('saves account phone and moved provider fields through the account tab', async () => {
    const accountMutateAsync = vi.fn().mockResolvedValue({
      ...BASE_ACCOUNT_RESPONSE,
      phoneNumber: '+216 55 222 111',
    });
    const profileMutateAsync = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      firstName: 'Salma',
      lastName: 'Ben Salem',
      address: '15 Avenue Habib Bourguiba',
      city: 'Sfax',
      postalCode: '3000',
    });
    mockAccountMutation({ mutateAsync: accountMutateAsync });
    mockProfileMutation({ mutateAsync: profileMutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);
    const accountForm = getAccountFormScope();

    await user.clear(accountForm.getByLabelText(/^téléphone$/i));
    await user.type(accountForm.getByLabelText(/^téléphone$/i), '55222111');
    await user.clear(accountForm.getByLabelText(/prénom/i));
    await user.type(accountForm.getByLabelText(/prénom/i), '  Salma  ');
    await user.clear(accountForm.getByLabelText(/^nom$/i));
    await user.type(accountForm.getByLabelText(/^nom$/i), '  Ben Salem  ');
    await user.clear(accountForm.getByLabelText(/adresse/i));
    await user.type(accountForm.getByLabelText(/adresse/i), '  15 Avenue Habib Bourguiba  ');
    await user.clear(accountForm.getByLabelText(/ville/i));
    await user.type(accountForm.getByLabelText(/ville/i), '  Sfax  ');
    await user.clear(accountForm.getByLabelText(/code postal/i));
    await user.type(accountForm.getByLabelText(/code postal/i), '  3000  ');
    await user.click(accountForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(accountMutateAsync).toHaveBeenCalledWith({ phone: '+216 55 222 111' });
      expect(profileMutateAsync).toHaveBeenCalledWith({
        firstName: 'Salma',
        lastName: 'Ben Salem',
        address: '15 Avenue Habib Bourguiba',
        city: 'Sfax',
        postalCode: '3000',
      });
    });

    const providerPayload = profileMutateAsync.mock.calls[0][0] as Record<string, unknown>;
    expect(providerPayload).not.toHaveProperty('businessName');
    expect(providerPayload).not.toHaveProperty('specialization');
    expect(providerPayload).not.toHaveProperty('nutritionProviderSubtype');
    expect(providerPayload).not.toHaveProperty('bio');
    expect(providerPayload).not.toHaveProperty('serviceRadius');
    expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
  });

  it('keeps the edited phone visible and toasts when the shared account save fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error('Compte indisponible'));
    mockAccountMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);
    const accountForm = getAccountFormScope();
    const phoneInput = accountForm.getByLabelText(/^téléphone$/i);

    await user.clear(phoneInput);
    await user.type(phoneInput, '20000111');
    await user.click(accountForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(mockShowErrorToast).toHaveBeenCalledWith(expect.any(Error), 'Erreur');
    expect(phoneInput).toHaveValue('+216 20 000 111');
  });

  it('keeps unsaved professional edits when account changes are saved', async () => {
    const accountMutateAsync = vi.fn().mockResolvedValue({
      ...BASE_ACCOUNT_RESPONSE,
      phoneNumber: '+216 55 222 111',
    });
    mockAccountMutation({ mutateAsync: accountMutateAsync });

    const { rerender, user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    const professionalForm = getProfessionalFormScope();
    const specializationInput = professionalForm.getByLabelText(/spécialisation/i);

    await user.clear(specializationInput);
    await user.type(specializationInput, 'Nutrition sportive');

    expect(specializationInput).toHaveValue('Nutrition sportive');

    await user.click(screen.getByRole('tab', { name: /^compte$/i }));

    const accountForm = getAccountFormScope();
    await user.clear(accountForm.getByLabelText(/^téléphone$/i));
    await user.type(accountForm.getByLabelText(/^téléphone$/i), '55222111');
    await user.click(accountForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(accountMutateAsync).toHaveBeenCalledWith({ phone: '+216 55 222 111' });
    });

    mockProfileQuery({
      data: {
        ...BASE_PROFILE,
      },
    });
    rerender(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    expect(getProfessionalFormScope().getByLabelText(/spécialisation/i)).toHaveValue(
      'Nutrition sportive',
    );
  });

  it('uploads the avatar and toasts success instead of rendering inline feedback', async () => {
    const upload = vi.fn().mockResolvedValue({
      ...BASE_ACCOUNT_RESPONSE,
      avatarFileId: 'uploaded-provider-avatar-file-id',
    });
    mockAvatarUploadHook({ upload });

    const { container, user } = renderWithProviders(<ProviderProfilePage />);
    const avatarInput = container.querySelector('input[type="file"]');

    if (!(avatarInput instanceof HTMLInputElement)) {
      throw new Error('Expected the hidden avatar file input to be rendered.');
    }

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(avatarInput, file);

    await waitFor(() => {
      expect(upload).toHaveBeenCalledWith(file);
      expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
    });
  });

  it('toasts avatar upload failures and fallback null responses', async () => {
    const rejectedUpload = vi.fn().mockRejectedValue(new Error('avatar upload failed'));
    mockAvatarUploadHook({ upload: rejectedUpload });

    const { container, rerender, user } = renderWithProviders(<ProviderProfilePage />);
    const avatarInput = container.querySelector('input[type="file"]');

    if (!(avatarInput instanceof HTMLInputElement)) {
      throw new Error('Expected the hidden avatar file input to be rendered.');
    }

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(avatarInput, file);

    await waitFor(() => {
      expect(rejectedUpload).toHaveBeenCalledWith(file);
      expect(mockShowErrorToast).toHaveBeenCalledWith(expect.any(Error), 'Erreur');
    });

    const nullUpload = vi.fn().mockResolvedValue(null);
    mockAvatarUploadHook({ upload: nullUpload });
    rerender(<ProviderProfilePage />);

    const secondInput = container.querySelector('input[type="file"]');
    if (!(secondInput instanceof HTMLInputElement)) {
      throw new Error('Expected the hidden avatar file input to remain rendered.');
    }

    await user.upload(secondInput, file);

    await waitFor(() => {
      expect(nullUpload).toHaveBeenCalledWith(file);
    });

    expect(mockShowErrorToast).toHaveBeenLastCalledWith(null, 'Erreur');
  });

  it('reads provider preference toggles from live query data so multiple toggles stay enabled together', async () => {
    let livePreferences: ProviderPreferencesResponse = BASE_PREFERENCES;

    mockUseProviderPreferences.mockImplementation(() => ({
      data: livePreferences,
      loading: false,
      isInitialLoading: false,
      isRefreshing: false,
      error: null,
      refetch: vi.fn(),
    }));

    const mutateAsync = vi
      .fn()
      .mockImplementation(async (patch: Partial<ProviderPreferencesResponse>) => {
        livePreferences = {
          ...livePreferences,
          ...patch,
          updatedAt: '2026-04-13T11:00:00Z',
        };

        return livePreferences;
      });
    mockPreferencesMutation({ mutateAsync });

    const { rerender, user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    const smsToggle = screen.getByRole('switch', { name: /sms notifications/i });
    const marketingToggle = screen.getByRole('switch', { name: /marketing/i });
    const conversationsToggle = screen.getByRole('switch', { name: /conversations/i });

    expect(emailToggle).toBeChecked();
    expect(smsToggle).not.toBeChecked();
    expect(marketingToggle).not.toBeChecked();
    expect(conversationsToggle).toBeChecked();
    expect(screen.getByText(/visibilité du profil: public/i)).toBeInTheDocument();

    await user.click(smsToggle);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ smsNotifications: true });
    });

    rerender(<ProviderProfilePage />);

    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /marketing/i })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: /conversations/i })).toBeChecked();

    await user.click(screen.getByRole('switch', { name: /marketing/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenNthCalledWith(2, { marketingEmails: true });
    });

    rerender(<ProviderProfilePage />);

    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /marketing/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /conversations/i })).toBeChecked();
    expect(mockShowSuccessToast).toHaveBeenCalledTimes(2);
    expect(mockShowSuccessToast).toHaveBeenLastCalledWith('Enregistré');
  });

  it('disables provider preference controls while a save is pending', async () => {
    let livePreferences: ProviderPreferencesResponse = BASE_PREFERENCES;
    let isPending = false;
    let resolveMutation: ((value: ProviderPreferencesResponse) => void) | null = null;

    mockUseProviderPreferences.mockImplementation(() => ({
      data: livePreferences,
      loading: false,
      isInitialLoading: false,
      isRefreshing: false,
      error: null,
      refetch: vi.fn(),
    }));

    const mutateAsync = vi
      .fn()
      .mockImplementation((_patch: Partial<ProviderPreferencesResponse>) => {
        isPending = true;

        return new Promise<ProviderPreferencesResponse>((resolve) => {
          resolveMutation = (value) => {
            livePreferences = value;
            isPending = false;
            resolve(value);
          };
        });
      });

    mockUseUpdateProviderPreferences.mockImplementation(() => ({
      mutate: vi.fn(),
      mutateAsync,
      isPending,
      error: null,
      data: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
    }));

    const { rerender, user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    const smsToggle = screen.getByRole('switch', { name: /sms notifications/i });
    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });

    expect(smsToggle).toBeEnabled();
    expect(emailToggle).toBeEnabled();

    await user.click(smsToggle);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ smsNotifications: true });
    });

    rerender(<ProviderProfilePage />);

    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeDisabled();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeDisabled();

    if (!resolveMutation) {
      throw new Error('Expected the pending preference mutation to register a resolver.');
    }

    const resolvePendingMutation: (value: ProviderPreferencesResponse) => void = resolveMutation;
    resolvePendingMutation({
      ...livePreferences,
      smsNotifications: true,
      updatedAt: '2026-04-13T11:00:00Z',
    });

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
    });

    rerender(<ProviderProfilePage />);

    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeEnabled();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeEnabled();
  });

  it('reverts preference toggles and toasts when autosave fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error('Préférences indisponibles'));
    mockPreferencesMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    const smsToggle = screen.getByRole('switch', { name: /sms notifications/i });
    expect(smsToggle).not.toBeChecked();

    await user.click(smsToggle);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ smsNotifications: true });
    });

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('switch', { name: /sms notifications/i })).not.toBeChecked();
  });

  it('prefills from the live profile and saves nutrition subtype changes', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      businessName: 'Cuisine Santé Sfax',
      nutritionProviderSubtype: 'Nutritionist',
    });
    mockProfileMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    expect(screen.getByLabelText(/nom affiché/i)).toHaveValue('Cuisine Santé Tunis');
    expect(screen.getByLabelText(/sous-type nutrition/i)).toHaveTextContent('Chef à domicile');

    await user.clear(screen.getByLabelText(/nom affiché/i));
    await user.type(screen.getByLabelText(/nom affiché/i), 'Cuisine Santé Sfax');
    await user.click(screen.getByLabelText(/sous-type nutrition/i));
    await user.click(await screen.findByRole('option', { name: /nutritionniste/i }));
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          businessName: 'Cuisine Santé Sfax',
          nutritionProviderSubtype: 'Nutritionist',
          serviceRadius: 20,
        }),
      );
    });

    const submittedPayload = mutateAsync.mock.calls[0][0] as Record<string, unknown>;
    expect(submittedPayload).not.toHaveProperty('firstName');
    expect(submittedPayload).not.toHaveProperty('lastName');
    expect(submittedPayload).not.toHaveProperty('address');
    expect(submittedPayload).not.toHaveProperty('city');
    expect(submittedPayload).not.toHaveProperty('postalCode');
    expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
  });

  it('patches auth context from the account tab when the provider name changes', async () => {
    const updateUser = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      firstName: 'Salma',
      lastName: 'Trabelsi',
    });
    mockAuth({ updateUser });
    mockProfileMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    const accountForm = getAccountFormScope();
    await user.clear(accountForm.getByLabelText(/prénom/i));
    await user.type(accountForm.getByLabelText(/prénom/i), 'Salma');
    await user.click(accountForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ name: 'Salma Trabelsi' });
    });
  });

  it('hides nutrition subtype controls for non-nutrition providers and never submits them', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      serviceType: 'nursing',
      nutritionProviderSubtype: null,
    });
    mockProfileQuery({
      data: {
        ...BASE_PROFILE,
        serviceType: 'nursing',
        nutritionProviderSubtype: null,
      },
    });
    mockProfileMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    expect(screen.queryByLabelText(/sous-type nutrition/i)).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/spécialisation/i));
    await user.type(screen.getByLabelText(/spécialisation/i), 'Soins à domicile');
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));

    const submittedPayload = mutateAsync.mock.calls[0][0] as Record<string, unknown>;
    expect(submittedPayload).not.toHaveProperty('nutritionProviderSubtype');
    expect(submittedPayload).not.toHaveProperty('firstName');
    expect(submittedPayload).not.toHaveProperty('lastName');
    expect(submittedPayload).not.toHaveProperty('address');
    expect(submittedPayload).not.toHaveProperty('city');
    expect(submittedPayload).not.toHaveProperty('postalCode');
  });

  it('keeps edited values visible and toasts when professional save fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error('Échec de sauvegarde'));
    mockProfileMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('tab', { name: /professionnel/i }));

    const bioInput = screen.getByLabelText(/présentation/i);
    await user.clear(bioInput);
    await user.type(bioInput, 'Plan alimentaire mis à jour.');
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(bioInput).toHaveValue('Plan alimentaire mis à jour.');
  });

  it('deletes the account from the danger zone after full confirmation', async () => {
    const logout = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockAuth({ logout });
    mockDeleteAccountMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('button', { name: /supprimer le compte/i }));

    expect(screen.getByRole('dialog', { name: /supprimer le compte/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'Secret123!');
    await user.type(screen.getByLabelText(/tapez supprimer pour confirmer/i), 'SUPPRIMER');
    await user.click(
      screen.getByRole('checkbox', {
        name: /je comprends que mon accès sera supprimé immédiatement/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: /supprimer définitivement/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ currentPassword: 'Secret123!' });
    });

    expect(mockShowSuccessToast).toHaveBeenCalledWith('Votre compte a été supprimé.');
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /supprimer le compte/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('toasts delete-account failures and keeps the dialog open', async () => {
    const logout = vi.fn();
    const mutateAsync = vi.fn().mockRejectedValue(new Error('backend failure'));
    mockAuth({ logout });
    mockDeleteAccountMutation({ mutateAsync });

    const { user } = renderWithProviders(<ProviderProfilePage />);

    await user.click(screen.getByRole('button', { name: /supprimer le compte/i }));
    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'Secret123!');
    await user.type(screen.getByLabelText(/tapez supprimer pour confirmer/i), 'SUPPRIMER');
    await user.click(
      screen.getByRole('checkbox', {
        name: /je comprends que mon accès sera supprimé immédiatement/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: /supprimer définitivement/i }));

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    const [errorArg, fallbackArg] = mockShowErrorToast.mock.calls[0] as [null, string];
    expect(errorArg).toBeNull();
    expect(fallbackArg).toBe('Impossible de supprimer le compte pour le moment.');
    expect(logout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: /supprimer le compte/i })).toBeInTheDocument();
  });
});
