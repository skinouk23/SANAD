import type {
  MyPatientProfileResponse,
  PatientAccountFormValues,
  PatientPreferencesFormValues,
  PatientProfileFormValues,
  UpdatePatientProfileRequest,
} from '@/features/family-circle/schema';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';

export type ToggleablePreferenceKey =
  | 'emailNotifications'
  | 'smsNotifications'
  | 'pushNotifications'
  | 'marketingEmails'
  | 'autoValidationEnabled'
  | 'shareWithFamily'
  | 'allowProviderMessages';

export type PatientProfileTab = 'compte' | 'sante' | 'preferences' | 'securite';

export interface PreferenceToggleConfig {
  key: ToggleablePreferenceKey;
  label: string;
}

export const PATIENT_PROFILE_TAB_ID_BASE = 'patient-profile';

function toInputValue(value: string | null | undefined): string {
  return typeof value === 'string' ? value : '';
}

function toNullableString(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function createPatientAccountFormValues(
  profile: MyPatientProfileResponse | null | undefined,
  phone: string | null | undefined,
): PatientAccountFormValues {
  return {
    firstName: toInputValue(profile?.firstName),
    lastName: toInputValue(profile?.lastName),
    address: toInputValue(profile?.address),
    city: toInputValue(profile?.city),
    postalCode: toInputValue(profile?.postalCode),
    phone: createDefaultTunisiaPhoneValue(phone),
  };
}

export function toAccountProfileUpdateRequest(
  formState: PatientAccountFormValues,
): UpdatePatientProfileRequest {
  return {
    firstName: toNullableString(formState.firstName),
    lastName: toNullableString(formState.lastName),
    address: toNullableString(formState.address),
    city: toNullableString(formState.city),
    postalCode: toNullableString(formState.postalCode),
  };
}

export function createPatientProfileFormValues(
  profile: MyPatientProfileResponse,
): PatientProfileFormValues {
  return {
    medicalHistory: toInputValue(profile.medicalHistory),
    allergies: toInputValue(profile.allergies),
    currentMedications: toInputValue(profile.currentMedications),
    insuranceProvider: toInputValue(profile.insuranceProvider),
    insuranceNumber: toInputValue(profile.insuranceNumber),
    emergencyContactName: toInputValue(profile.emergencyContact?.name),
    emergencyContactPhone: createDefaultTunisiaPhoneValue(profile.emergencyContact?.phone),
    emergencyContactRelationship: toInputValue(profile.emergencyContact?.relationship),
  };
}

export function createPatientPreferencesFormValues(
  preferences: PatientPreferencesFormValues,
): PatientPreferencesFormValues {
  return {
    emailNotifications: preferences.emailNotifications,
    smsNotifications: preferences.smsNotifications,
    pushNotifications: preferences.pushNotifications,
    marketingEmails: preferences.marketingEmails,
    autoValidationEnabled: preferences.autoValidationEnabled,
    shareWithFamily: preferences.shareWithFamily,
    allowProviderMessages: preferences.allowProviderMessages,
  };
}

export function toUpdateRequest(formState: PatientProfileFormValues): UpdatePatientProfileRequest {
  return {
    medicalHistory: toNullableString(formState.medicalHistory),
    allergies: toNullableString(formState.allergies),
    currentMedications: toNullableString(formState.currentMedications),
    insuranceProvider: toNullableString(formState.insuranceProvider),
    insuranceNumber: toNullableString(formState.insuranceNumber),
    emergencyContactName: toNullableString(formState.emergencyContactName),
    emergencyContactPhone: toNullableString(formState.emergencyContactPhone),
    emergencyContactRelationship: toNullableString(formState.emergencyContactRelationship),
  };
}

export function getPatientProfileName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  return [firstName, lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ')
    .trim();
}

export function getDisplayName(
  profile: MyPatientProfileResponse | null,
  fallbackName: string | null | undefined,
  fallbackLabel: string,
): string {
  const profileName = getPatientProfileName(profile?.firstName, profile?.lastName);

  if (profileName) {
    return profileName;
  }

  const trimmedFallbackName = fallbackName?.trim();
  return trimmedFallbackName ? trimmedFallbackName : fallbackLabel;
}

export function formatUpdatedAt(
  value: string | null | undefined,
  locale: string,
  fallback: string,
): string {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

export function formatMemberSince(
  value: string | null | undefined,
  locale: string,
  fallback: string,
): string {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}
