import type { UserResponse } from '@/features/auth/schema';
import type {
  MyPatientProfileResponse,
  PatientPreferencesResponse,
  UpdatePatientPreferencesRequest,
  UpdatePatientProfileRequest,
} from '@/features/family-circle/schema';
import type { DateOnly } from '@/shared/schemas/common';

interface UpdateAuthAccountRequest {
  phone?: string | null;
  avatarFileId?: string | null;
}

interface SetCurrentMockPatientContextOptions {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

interface MockAuthProfileState extends UserResponse {
  updatedAt: string;
}

interface PatientProfileStoreState {
  profile: MyPatientProfileResponse;
  preferences: PatientPreferencesResponse;
  authProfile: MockAuthProfileState;
}

const DEFAULT_CREATED_AT = '2024-01-10T10:00:00Z';
const DEFAULT_DATE_OF_BIRTH: DateOnly = {
  year: 1985,
  month: 3,
  day: 15,
};

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function hasOwn<T extends object>(value: T, key: keyof T): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function createMockUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
}

function createInitialState(): PatientProfileStoreState {
  const updatedAt = new Date().toISOString();
  const avatarFileId = null;

  return {
    profile: {
      firstName: 'Mohamed',
      lastName: 'Ben Ali',
      dateOfBirth: DEFAULT_DATE_OF_BIRTH,
      gender: 'male',
      address: '12 Rue de la Liberté',
      city: 'Tunis',
      postalCode: '1000',
      latitude: 36.8065,
      longitude: 10.1815,
      emergencyContact: {
        name: 'Fatma Ben Ali',
        phone: '+216 98 765 432',
        relationship: 'Spouse',
      },
      medicalHistory: 'Hypertension artérielle contrôlée.',
      allergies: 'Pénicilline',
      currentMedications: 'Amlodipine 5 mg',
      insuranceProvider: 'CNAM',
      insuranceNumber: 'CNAM-2024-001',
      profilePictureUrl: null,
      updatedAt,
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      autoValidationEnabled: true,
      validationReminderHours: 24,
      shareWithFamily: false,
      allowProviderMessages: true,
      updatedAt,
    },
    authProfile: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      email: 'patient@test.com',
      firstName: 'Mohamed',
      lastName: 'Ben Ali',
      phoneNumber: '+216 98 123 456',
      avatar: null,
      avatarFileId,
      role: 'patient',
      isActive: true,
      createdAt: DEFAULT_CREATED_AT,
      updatedAt,
    },
  };
}

function toAuthProfileResponse(authProfile: MockAuthProfileState): UserResponse {
  const authProfileResponse = cloneDeep(authProfile) as Partial<MockAuthProfileState>;

  delete authProfileResponse.updatedAt;

  return authProfileResponse as UserResponse;
}

let currentPatientProfileState = createInitialState();

export function setCurrentMockPatientContext(options: SetCurrentMockPatientContextOptions): void {
  const now = new Date().toISOString();
  const nextState = createInitialState();
  const firstName = normalizeNullableString(options.firstName) ?? nextState.authProfile.firstName;
  const lastName = normalizeNullableString(options.lastName) ?? nextState.authProfile.lastName;
  const email = normalizeNullableString(options.email) ?? nextState.authProfile.email;

  currentPatientProfileState = {
    ...nextState,
    profile: {
      ...nextState.profile,
      firstName,
      lastName,
      updatedAt: now,
    },
    preferences: {
      ...nextState.preferences,
      updatedAt: now,
    },
    authProfile: {
      ...nextState.authProfile,
      id: createMockUuid(),
      email,
      firstName,
      lastName,
      phoneNumber: normalizeNullableString(options.phone),
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function getPatientProfile(): MyPatientProfileResponse {
  return cloneDeep(currentPatientProfileState.profile);
}

export function updatePatientProfile(
  patch: Partial<UpdatePatientProfileRequest>,
): MyPatientProfileResponse {
  const updatedAt = new Date().toISOString();
  const nextProfile = cloneDeep(currentPatientProfileState.profile);
  const nextAuthProfile = cloneDeep(currentPatientProfileState.authProfile);

  if (hasOwn(patch, 'firstName')) {
    nextProfile.firstName = patch.firstName ?? null;
    nextAuthProfile.firstName = normalizeNullableString(patch.firstName) ?? '';
  }

  if (hasOwn(patch, 'lastName')) {
    nextProfile.lastName = patch.lastName ?? null;
    nextAuthProfile.lastName = normalizeNullableString(patch.lastName) ?? '';
  }

  if (hasOwn(patch, 'dateOfBirth')) {
    nextProfile.dateOfBirth = patch.dateOfBirth;
  }

  if (hasOwn(patch, 'gender')) {
    nextProfile.gender = patch.gender ?? null;
  }

  if (hasOwn(patch, 'address')) {
    nextProfile.address = patch.address ?? null;
  }

  if (hasOwn(patch, 'city')) {
    nextProfile.city = patch.city ?? null;
  }

  if (hasOwn(patch, 'postalCode')) {
    nextProfile.postalCode = patch.postalCode ?? null;
  }

  if (hasOwn(patch, 'latitude')) {
    nextProfile.latitude = patch.latitude ?? null;
  }

  if (hasOwn(patch, 'longitude')) {
    nextProfile.longitude = patch.longitude ?? null;
  }

  if (hasOwn(patch, 'medicalHistory')) {
    nextProfile.medicalHistory = patch.medicalHistory ?? null;
  }

  if (hasOwn(patch, 'allergies')) {
    nextProfile.allergies = patch.allergies ?? null;
  }

  if (hasOwn(patch, 'currentMedications')) {
    nextProfile.currentMedications = patch.currentMedications ?? null;
  }

  if (hasOwn(patch, 'insuranceProvider')) {
    nextProfile.insuranceProvider = patch.insuranceProvider ?? null;
  }

  if (hasOwn(patch, 'insuranceNumber')) {
    nextProfile.insuranceNumber = patch.insuranceNumber ?? null;
  }

  nextProfile.emergencyContact = {
    ...(nextProfile.emergencyContact ?? {
      name: null,
      phone: null,
      relationship: null,
    }),
    ...(hasOwn(patch, 'emergencyContactName') ? { name: patch.emergencyContactName ?? null } : {}),
    ...(hasOwn(patch, 'emergencyContactPhone')
      ? { phone: patch.emergencyContactPhone ?? null }
      : {}),
    ...(hasOwn(patch, 'emergencyContactRelationship')
      ? { relationship: patch.emergencyContactRelationship ?? null }
      : {}),
  };

  nextProfile.updatedAt = updatedAt;
  nextAuthProfile.updatedAt = updatedAt;

  currentPatientProfileState = {
    ...currentPatientProfileState,
    profile: nextProfile,
    authProfile: nextAuthProfile,
  };

  return getPatientProfile();
}

export function getPatientPreferences(): PatientPreferencesResponse {
  return cloneDeep(currentPatientProfileState.preferences);
}

export function updatePatientPreferences(
  patch: UpdatePatientPreferencesRequest,
): PatientPreferencesResponse {
  currentPatientProfileState.preferences = {
    ...currentPatientProfileState.preferences,
    ...cloneDeep(patch),
    updatedAt: new Date().toISOString(),
  };

  return getPatientPreferences();
}

export function getAuthProfile(): UserResponse {
  return toAuthProfileResponse(currentPatientProfileState.authProfile);
}

export function updateAuthAccount(patch: UpdateAuthAccountRequest): UserResponse {
  const updatedAt = new Date().toISOString();
  const nextAuthProfile = cloneDeep(currentPatientProfileState.authProfile);
  const nextProfile = cloneDeep(currentPatientProfileState.profile);

  if (hasOwn(patch, 'phone')) {
    nextAuthProfile.phoneNumber = normalizeNullableString(patch.phone);
  }

  if (hasOwn(patch, 'avatarFileId')) {
    const avatarFileId = normalizeNullableString(patch.avatarFileId);

    nextAuthProfile.avatar = null;
    nextAuthProfile.avatarFileId = avatarFileId;
    nextProfile.profilePictureUrl = null;
  }

  nextAuthProfile.updatedAt = updatedAt;
  nextProfile.updatedAt = updatedAt;

  currentPatientProfileState = {
    ...currentPatientProfileState,
    authProfile: nextAuthProfile,
    profile: nextProfile,
  };

  return getAuthProfile();
}
