import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext';
import { useAppFeatures } from '@/features/app-features';
import {
  useAvatarUpload,
  useDeleteAccount,
  useProfile,
  useUpdateAccountProfile,
} from '@/features/auth';
import {
  useCurrentPatient,
  usePatientPreferences,
  useUpdatePatientProfile,
  useUpdatePreferences,
} from '@/features/users';
import { PatientProfilePage } from '@/pages/patient/PatientProfilePage';
import { renderWithProviders } from '@/test/renderWithProviders';

import type { UserResponse } from '@/features/auth/schema';
import type {
  MyPatientProfileResponse,
  PatientPreferencesResponse,
} from '@/features/family-circle/schema';

const {
  mockUseAuth,
  mockUseAppFeatures,
  mockUseFileBlobUrl,
  mockUseCurrentPatient,
  mockUseUpdatePatientProfile,
  mockUsePatientPreferences,
  mockUseUpdatePreferences,
  mockUseProfile,
  mockUseUpdateAccountProfile,
  mockUseAvatarUpload,
  mockUseDeleteAccount,
  mockShowSuccessToast,
  mockShowErrorToast,
  mockNavigate,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseAppFeatures: vi.fn(),
  mockUseFileBlobUrl: vi.fn(),
  mockUseCurrentPatient: vi.fn(),
  mockUseUpdatePatientProfile: vi.fn(),
  mockUsePatientPreferences: vi.fn(),
  mockUseUpdatePreferences: vi.fn(),
  mockUseProfile: vi.fn(),
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

vi.mock('@/features/app-features', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/app-features')>('@/features/app-features');

  return {
    ...actual,
    useAppFeatures: mockUseAppFeatures,
  };
});

vi.mock('@/shared/lib/files/useFileBlobUrl', () => ({
  useFileBlobUrl: mockUseFileBlobUrl,
}));

vi.mock('@/features/users', async () => {
  const actual = await vi.importActual<typeof import('@/features/users')>('@/features/users');

  return {
    ...actual,
    useCurrentPatient: mockUseCurrentPatient,
    usePatientPreferences: mockUsePatientPreferences,
    useUpdatePatientProfile: mockUseUpdatePatientProfile,
    useUpdatePreferences: mockUseUpdatePreferences,
  };
});

vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual<typeof import('@/features/auth')>('@/features/auth');

  return {
    ...actual,
    useProfile: mockUseProfile,
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
  email: 'patient@test.com',
  name: 'Mohamed Ben Ali',
  phone: '+216 98 123 456',
  avatarFileId: 'patient-avatar-file-id',
  role: 'patient' as const,
  backendRole: 'patient',
};

const BASE_PROFILE: MyPatientProfileResponse = {
  firstName: 'Mohamed',
  lastName: 'Ben Ali',
  dateOfBirth: {
    year: 1985,
    month: 3,
    day: 15,
  },
  gender: 'male',
  address: '12 Rue de la Liberté',
  city: 'Tunis',
  postalCode: '1000',
  emergencyContact: {
    name: 'Fatma Ben Ali',
    phone: '+216 98 765 432',
    relationship: 'Épouse',
  },
  medicalHistory: 'Hypertension artérielle contrôlée.',
  allergies: 'Pénicilline',
  currentMedications: 'Amlodipine 5 mg',
  insuranceProvider: 'CNAM',
  insuranceNumber: 'CNAM-2024-001',
  profilePictureUrl: 'https://profile.example.com/legacy-avatar.png',
  updatedAt: '2026-04-14T10:00:00Z',
};

const BASE_PREFERENCES: PatientPreferencesResponse = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  autoValidationEnabled: true,
  validationReminderHours: 24,
  shareWithFamily: false,
  allowProviderMessages: true,
  updatedAt: '2026-04-14T10:00:00Z',
};

const BASE_ACCOUNT_RESPONSE: UserResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'patient@test.com',
  firstName: 'Mohamed',
  lastName: 'Ben Ali',
  phoneNumber: '+216 98 123 456',
  avatar: null,
  avatarFileId: 'patient-avatar-file-id',
  role: 'patient',
  isActive: true,
  createdAt: '2026-01-01T09:00:00Z',
};

function formatExpectedMemberSince(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(BASE_ACCOUNT_RESPONSE.createdAt));
}

function formatExpectedUpdatedAt(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(BASE_PROFILE.updatedAt));
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

function mockAppFeatures(overrides?: Partial<ReturnType<typeof useAppFeatures>>) {
  mockUseAppFeatures.mockReturnValue({
    features: [],
    activeFeatureCodes: new Set(),
    isFeatureActive: vi.fn(() => true),
    loading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  });
}

function mockProfileQuery(overrides?: Partial<ReturnType<typeof useCurrentPatient>>) {
  mockUseCurrentPatient.mockReturnValue({
    data: BASE_PROFILE,
    loading: false,
    isInitialLoading: false,
    isRefreshing: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  });
}

function mockPreferencesQuery(overrides?: Partial<ReturnType<typeof usePatientPreferences>>) {
  mockUsePatientPreferences.mockReturnValue({
    data: BASE_PREFERENCES,
    loading: false,
    isInitialLoading: false,
    isRefreshing: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  });
}

function mockAccountProfileQuery(overrides?: Partial<ReturnType<typeof useProfile>>) {
  mockUseProfile.mockReturnValue({
    data: BASE_ACCOUNT_RESPONSE,
    isLoading: false,
    isFetching: false,
    error: null,
    ...overrides,
  });
}

function mockProfileMutation(overrides?: Partial<ReturnType<typeof useUpdatePatientProfile>>) {
  mockUseUpdatePatientProfile.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(BASE_PROFILE),
    isPending: false,
    error: null,
    data: null,
    reset: vi.fn(),
    status: 'idle',
    ...overrides,
  });
}

function mockPreferencesMutation(overrides?: Partial<ReturnType<typeof useUpdatePreferences>>) {
  mockUseUpdatePreferences.mockReturnValue({
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
function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

function getAccountFormScope() {
  const form = screen.getByRole('heading', { name: /informations du compte/i }).closest('form');

  expect(form).not.toBeNull();

  return within(form as HTMLFormElement);
}

function getMedicalFormScope() {
  const form = screen.getByRole('heading', { name: /informations médicales/i }).closest('form');

  expect(form).not.toBeNull();

  return within(form as HTMLFormElement);
}

describe('PatientProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth();
    mockAppFeatures();
    mockUseFileBlobUrl.mockReturnValue({ objectUrl: 'blob:patient-avatar-file-id' });
    mockProfileQuery();
    mockPreferencesQuery();
    mockAccountProfileQuery();
    mockProfileMutation();
    mockPreferencesMutation();
    mockAccountMutation();
    mockAvatarUploadHook();
    mockDeleteAccountMutation();
  });

  it('switches tabs and renders the matching patient profile content', async () => {
    const { user } = renderWithProviders(<PatientProfilePage />);

    const accountTab = screen.getByRole('tab', { name: /^compte$/i });
    const healthTab = screen.getByRole('tab', { name: /santé/i });
    const preferencesTab = screen.getByRole('tab', { name: /préférences/i });
    const securityTab = screen.getByRole('tab', { name: /sécurité/i });

    expect(accountTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /^compte$/i })).toBeInTheDocument();
    expect(screen.queryByTestId('account-security-section')).not.toBeInTheDocument();

    await user.click(healthTab);

    expect(healthTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /santé/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/antécédents médicaux/i)).toHaveValue(
      'Hypertension artérielle contrôlée.',
    );

    await user.click(preferencesTab);

    expect(preferencesTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /préférences/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /langue/i })).toHaveTextContent(/français/i);
    expect(screen.getByRole('switch', { name: /push notifications/i })).not.toBeChecked();

    await user.click(securityTab);

    expect(securityTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /sécurité/i })).toBeInTheDocument();
    expect(screen.getByTestId('account-security-section')).toBeInTheDocument();
  });

  it('renders inline patient membership metadata and hides yes-no helper text', async () => {
    const { user } = renderWithProviders(<PatientProfilePage />);

    const memberSince = screen.getByText(/membre depuis/i);
    const dangerZone = screen.getByRole('heading', { name: /zone de danger/i }).closest('section');

    expect(screen.getByText(/^patient$/i)).toBeInTheDocument();
    expect(memberSince).toHaveTextContent(formatExpectedMemberSince('fr-FR'));
    expect(screen.queryByText(formatExpectedUpdatedAt('fr-FR'))).not.toBeInTheDocument();
    expect(dangerZone).toHaveClass('mt-6');

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    const preferencesPanel = screen.getByRole('tabpanel', { name: /préférences/i });

    expect(within(preferencesPanel).queryByText(/^Oui$/i)).not.toBeInTheDocument();
    expect(within(preferencesPanel).queryByText(/^Non$/i)).not.toBeInTheDocument();
  });

  it('renders editable account identity and address fields from the patient profile', () => {
    renderWithProviders(<PatientProfilePage />);

    const accountForm = getAccountFormScope();
    const firstNameInput = accountForm.getByLabelText(/prénom/i);
    const lastNameInput = accountForm.getByLabelText(/^nom$/i);
    const addressInput = accountForm.getByLabelText(/adresse/i);
    const cityInput = accountForm.getByLabelText(/ville/i);
    const postalCodeInput = accountForm.getByLabelText(/code postal/i);

    expect(firstNameInput).toHaveValue(BASE_PROFILE.firstName);
    expect(lastNameInput).toHaveValue(BASE_PROFILE.lastName);
    expect(addressInput).toHaveValue(BASE_PROFILE.address);
    expect(cityInput).toHaveValue(BASE_PROFILE.city);
    expect(postalCodeInput).toHaveValue(BASE_PROFILE.postalCode);
    expect(firstNameInput).toBeEnabled();
    expect(lastNameInput).toBeEnabled();
    expect(addressInput).toBeEnabled();
    expect(cityInput).toBeEnabled();
    expect(postalCodeInput).toBeEnabled();
    expect(firstNameInput).not.toHaveAttribute('readonly');
    expect(lastNameInput).not.toHaveAttribute('readonly');
    expect(addressInput).not.toHaveAttribute('readonly');
    expect(cityInput).not.toHaveAttribute('readonly');
    expect(postalCodeInput).not.toHaveAttribute('readonly');
  });

  it('saves account phone and patient identity/address fields from the account tab', async () => {
    const updateAccountProfile = vi.fn().mockResolvedValue({
      ...BASE_ACCOUNT_RESPONSE,
      phoneNumber: '+216 55 222 111',
    });
    const updatePatientProfile = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      firstName: 'Amira',
      lastName: 'Trabelsi',
      address: '24 Avenue Habib Bourguiba',
      city: 'Sfax',
      postalCode: '3000',
    });
    mockAccountMutation({ mutateAsync: updateAccountProfile });
    mockProfileMutation({ mutateAsync: updatePatientProfile });

    const { user } = renderWithProviders(<PatientProfilePage />);
    const accountForm = getAccountFormScope();

    await user.clear(accountForm.getByLabelText(/^téléphone$/i));
    await user.type(accountForm.getByLabelText(/^téléphone$/i), '55222111');
    await user.clear(accountForm.getByLabelText(/prénom/i));
    await user.type(accountForm.getByLabelText(/prénom/i), 'Amira');
    await user.clear(accountForm.getByLabelText(/^nom$/i));
    await user.type(accountForm.getByLabelText(/^nom$/i), 'Trabelsi');
    await user.clear(accountForm.getByLabelText(/adresse/i));
    await user.type(accountForm.getByLabelText(/adresse/i), '24 Avenue Habib Bourguiba');
    await user.clear(accountForm.getByLabelText(/ville/i));
    await user.type(accountForm.getByLabelText(/ville/i), 'Sfax');
    await user.clear(accountForm.getByLabelText(/code postal/i));
    await user.type(accountForm.getByLabelText(/code postal/i), '3000');
    await user.click(accountForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(updateAccountProfile).toHaveBeenCalledWith({ phone: '+216 55 222 111' });
      expect(updatePatientProfile).toHaveBeenCalledWith({
        firstName: 'Amira',
        lastName: 'Trabelsi',
        address: '24 Avenue Habib Bourguiba',
        city: 'Sfax',
        postalCode: '3000',
      });
    });

    expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
  });

  it('saves health data with null normalization and toasts success', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      ...BASE_PROFILE,
      medicalHistory: 'Diabète de type 2',
      insuranceProvider: null,
      emergencyContact: {
        ...BASE_PROFILE.emergencyContact,
        relationship: null,
      },
    });
    mockProfileMutation({ mutateAsync });

    const { user } = renderWithProviders(<PatientProfilePage />);

    await user.click(screen.getByRole('tab', { name: /santé/i }));

    const medicalForm = getMedicalFormScope();
    await user.clear(medicalForm.getByLabelText(/antécédents médicaux/i));
    await user.type(medicalForm.getByLabelText(/antécédents médicaux/i), 'Diabète de type 2');
    await user.clear(medicalForm.getByLabelText(/assureur/i));
    await user.type(medicalForm.getByLabelText(/assureur/i), '   ');
    await user.clear(medicalForm.getByLabelText(/lien avec le patient/i));
    await user.type(medicalForm.getByLabelText(/lien avec le patient/i), '   ');
    await user.click(medicalForm.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        medicalHistory: 'Diabète de type 2',
        allergies: 'Pénicilline',
        currentMedications: 'Amlodipine 5 mg',
        insuranceProvider: null,
        insuranceNumber: 'CNAM-2024-001',
        emergencyContactName: 'Fatma Ben Ali',
        emergencyContactPhone: '+216 98 765 432',
        emergencyContactRelationship: null,
      });
    });

    expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
  });

  it('keeps multiple preference toggles enabled after sequential saves', async () => {
    let currentPreferences: PatientPreferencesResponse = {
      ...BASE_PREFERENCES,
      pushNotifications: false,
      marketingEmails: false,
    };
    const mutateAsync = vi
      .fn()
      .mockImplementation(async (patch: Partial<PatientPreferencesResponse>) => {
        currentPreferences = {
          ...currentPreferences,
          ...patch,
          updatedAt: '2026-04-14T11:00:00Z',
        };

        return currentPreferences;
      });

    mockUsePatientPreferences.mockImplementation(() => ({
      data: currentPreferences,
      loading: false,
      isInitialLoading: false,
      isRefreshing: false,
      error: null,
      refetch: vi.fn(),
    }));
    mockPreferencesMutation({ mutateAsync });

    const { rerender, user } = renderWithProviders(<PatientProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    expect(screen.getByRole('combobox', { name: /langue/i })).toHaveTextContent(/français/i);
    expect(screen.getByRole('button', { name: /clair/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /sombre/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('switch', { name: /push notifications/i })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: /marketing/i })).not.toBeChecked();

    await user.click(screen.getByRole('switch', { name: /push notifications/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenNthCalledWith(1, { pushNotifications: true });
    });

    rerender(<PatientProfilePage />);

    expect(screen.getByRole('switch', { name: /push notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /marketing/i })).not.toBeChecked();

    await user.click(screen.getByRole('switch', { name: /marketing/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenNthCalledWith(2, { marketingEmails: true });
    });

    rerender(<PatientProfilePage />);

    expect(screen.getByRole('switch', { name: /push notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /marketing/i })).toBeChecked();
    expect(mockShowSuccessToast).toHaveBeenCalledTimes(2);
  });

  it('does not force patient preference toggles to be mutually exclusive', async () => {
    let currentPreferences: PatientPreferencesResponse = {
      ...BASE_PREFERENCES,
      smsNotifications: false,
    };
    const mutateAsync = vi
      .fn()
      .mockImplementation(async (patch: Partial<PatientPreferencesResponse>) => {
        currentPreferences = {
          ...currentPreferences,
          ...patch,
          updatedAt: '2026-04-14T11:05:00Z',
        };

        return currentPreferences;
      });

    mockUsePatientPreferences.mockImplementation(() => ({
      data: currentPreferences,
      loading: false,
      isInitialLoading: false,
      isRefreshing: false,
      error: null,
      refetch: vi.fn(),
    }));
    mockPreferencesMutation({ mutateAsync });

    const { rerender, user } = renderWithProviders(<PatientProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).not.toBeChecked();

    await user.click(screen.getByRole('switch', { name: /sms notifications/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ smsNotifications: true });
    });

    rerender(<PatientProfilePage />);

    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeChecked();
  });

  it('disables patient preference controls while a save is pending', async () => {
    const deferred = createDeferred<PatientPreferencesResponse>();
    let isPending = false;
    const mutateAsync = vi.fn().mockImplementation(() => {
      isPending = true;
      return deferred.promise;
    });

    mockPreferencesQuery({
      data: {
        ...BASE_PREFERENCES,
        pushNotifications: false,
      },
    });
    mockUseUpdatePreferences.mockImplementation(() => ({
      mutate: vi.fn(),
      mutateAsync,
      isPending,
      error: null,
      data: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
    }));

    const { rerender, user } = renderWithProviders(<PatientProfilePage />);

    await user.click(screen.getByRole('tab', { name: /préférences/i }));

    expect(screen.getByRole('switch', { name: /push notifications/i })).not.toBeDisabled();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).not.toBeDisabled();

    await user.click(screen.getByRole('switch', { name: /push notifications/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ pushNotifications: true });
    });

    rerender(<PatientProfilePage />);

    expect(screen.getByRole('switch', { name: /push notifications/i })).toBeDisabled();
    expect(screen.getByRole('switch', { name: /sms notifications/i })).toBeDisabled();

    await user.click(screen.getByRole('switch', { name: /sms notifications/i }));
    expect(mutateAsync).toHaveBeenCalledTimes(1);

    deferred.resolve({
      ...BASE_PREFERENCES,
      pushNotifications: true,
      updatedAt: '2026-04-14T11:10:00Z',
    });

    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith('Enregistré');
    });
  });

  it('uploads the avatar and toasts success instead of rendering inline feedback', async () => {
    const upload = vi.fn().mockResolvedValue({
      ...BASE_ACCOUNT_RESPONSE,
      avatarFileId: 'uploaded-avatar-file-id',
    });
    mockAvatarUploadHook({ upload });

    const { container, user } = renderWithProviders(<PatientProfilePage />);
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

    expect(screen.queryByText('Enregistré')).not.toBeInTheDocument();
  });

  it('toasts avatar upload failures instead of rendering inline errors', async () => {
    const uploadError = new Error('avatar upload failed');
    const upload = vi.fn().mockRejectedValue(uploadError);
    mockAvatarUploadHook({ upload });

    const { container, user } = renderWithProviders(<PatientProfilePage />);
    const avatarInput = container.querySelector('input[type="file"]');

    if (!(avatarInput instanceof HTMLInputElement)) {
      throw new Error('Expected the hidden avatar file input to be rendered.');
    }

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(avatarInput, file);

    await waitFor(() => {
      expect(upload).toHaveBeenCalledWith(file);
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(mockShowErrorToast).toHaveBeenCalledWith(uploadError, 'Erreur');
    expect(screen.queryByText('avatar upload failed')).not.toBeInTheDocument();
  });

  it('toasts a fallback error when avatar upload resolves null (no rejection)', async () => {
    const upload = vi.fn().mockResolvedValue(null);
    mockAvatarUploadHook({ upload });

    const { container, user } = renderWithProviders(<PatientProfilePage />);
    const avatarInput = container.querySelector('input[type="file"]');

    if (!(avatarInput instanceof HTMLInputElement)) {
      throw new Error('Expected the hidden avatar file input to be rendered.');
    }

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(avatarInput, file);

    await waitFor(() => {
      expect(upload).toHaveBeenCalledWith(file);
      expect(mockShowErrorToast).toHaveBeenCalledTimes(1);
    });

    expect(mockShowErrorToast).toHaveBeenCalledWith(null, 'Erreur');
    expect(screen.queryByText('avatar upload failed')).not.toBeInTheDocument();
  });

  it('renders a top-level retry block when the initial profile fetch fails', async () => {
    const refetch = vi.fn();
    mockProfileQuery({
      data: null,
      loading: false,
      isInitialLoading: false,
      error: new Error('Profil indisponible'),
      refetch,
    });

    const { user } = renderWithProviders(<PatientProfilePage />);

    expect(screen.getByRole('alert')).toHaveTextContent('Profil indisponible');
    expect(screen.queryByRole('tab', { name: /santé/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders a top-level loading skeleton before patient profile data is available', () => {
    mockProfileQuery({
      data: null,
      loading: true,
      isInitialLoading: true,
      error: null,
    });

    renderWithProviders(<PatientProfilePage />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^compte$/i })).not.toBeInTheDocument();
  });

  it('deletes the account from the danger zone after full confirmation', async () => {
    const logout = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockAuth({ logout });
    mockDeleteAccountMutation({ mutateAsync });

    const { user } = renderWithProviders(<PatientProfilePage />);

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

    const { user } = renderWithProviders(<PatientProfilePage />);

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

    const [errorArg, fallbackArg] = mockShowErrorToast.mock.calls[0] as [Error, string];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('backend failure');
    expect(fallbackArg).toBe('Impossible de supprimer le compte pour le moment.');
    expect(logout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: /supprimer le compte/i })).toBeInTheDocument();
  });
});
