import {
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  getNutritionSubtypeLabel,
  isNutritionProviderCategory,
  normalizeProviderCategory,
  type NutritionProviderSubtype,
} from '@/features/providers';

import type { TranslationKeys } from '@/i18n/types';
import type {
  ProviderAccountFormValues,
  ProviderProfileFormValues,
  ProviderProfileResponse,
  UpdateMyProviderProfileRequest,
} from '@/features/providers/schema';
import type { ProviderPreferencesFormValues } from '@/features/providers/preferences-schema';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';

export type ToggleablePreferenceKey =
  | 'emailNotifications'
  | 'smsNotifications'
  | 'pushNotifications'
  | 'marketingEmails'
  | 'allowPatientMessages';

export type ProviderProfileTab = 'compte' | 'professionnel' | 'preferences' | 'securite';

export interface PreferenceToggleConfig {
  key: ToggleablePreferenceKey;
  label: string;
  description?: string;
}

export const PROVIDER_PROFILE_TAB_ID_BASE = 'provider-profile';

function toInputValue(value: string | null | undefined): string {
  return typeof value === 'string' ? value : '';
}

export function createProviderAccountFormValues(
  profile: ProviderProfileResponse | null | undefined,
  phone: string | null | undefined,
): ProviderAccountFormValues {
  return {
    phone: createDefaultTunisiaPhoneValue(phone),
    firstName: toInputValue(profile?.firstName),
    lastName: toInputValue(profile?.lastName),
    address: toInputValue(profile?.address),
    city: toInputValue(profile?.city),
    postalCode: toInputValue(profile?.postalCode),
  };
}

export function createProviderProfileFormValues(
  profile: ProviderProfileResponse,
): ProviderProfileFormValues {
  return {
    businessName: toInputValue(profile.businessName),
    specialization: toInputValue(profile.specialization),
    nutritionProviderSubtype: isNutritionProviderCategory(profile.serviceType)
      ? toInputValue(profile.nutritionProviderSubtype)
      : '',
    bio: toInputValue(profile.bio),
    serviceRadius: String(profile.serviceRadius ?? ''),
  };
}

export function createProviderPreferencesFormValues(
  preferences: ProviderPreferencesFormValues,
): ProviderPreferencesFormValues {
  return {
    emailNotifications: preferences.emailNotifications,
    smsNotifications: preferences.smsNotifications,
    pushNotifications: preferences.pushNotifications,
    marketingEmails: preferences.marketingEmails,
    allowPatientMessages: preferences.allowPatientMessages,
    profileVisibility: preferences.profileVisibility,
  };
}

function toNullableString(value: string): string | null {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function toNullableInteger(value: string): number | null {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return Math.max(0, Math.round(parsedValue));
}

function toNutritionProviderSubtype(value: string): NutritionProviderSubtype | null {
  const trimmedValue = value.trim();

  if (NUTRITION_PROVIDER_SUBTYPE_VALUES.includes(trimmedValue as NutritionProviderSubtype)) {
    return trimmedValue as NutritionProviderSubtype;
  }

  return null;
}

export function buildUpdatePayload(
  formState: ProviderProfileFormValues,
  isNutritionProvider: boolean,
): UpdateMyProviderProfileRequest {
  return {
    businessName: toNullableString(formState.businessName),
    specialization: toNullableString(formState.specialization),
    ...(isNutritionProvider
      ? {
          nutritionProviderSubtype: toNutritionProviderSubtype(formState.nutritionProviderSubtype),
        }
      : {}),
    bio: toNullableString(formState.bio),
    serviceRadius: toNullableInteger(formState.serviceRadius),
  };
}

export function buildAccountProviderUpdatePayload(
  formState: ProviderAccountFormValues,
): UpdateMyProviderProfileRequest {
  return {
    firstName: toNullableString(formState.firstName),
    lastName: toNullableString(formState.lastName),
    address: toNullableString(formState.address),
    city: toNullableString(formState.city),
    postalCode: toNullableString(formState.postalCode),
  };
}

function getPersonalName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
) {
  return [firstName, lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ')
    .trim();
}

export { getPersonalName };

export function getProviderDisplayName(
  profile: ProviderProfileResponse | null,
  fallbackLabel: string,
): string {
  if (!profile) {
    return fallbackLabel;
  }

  const personalName = getPersonalName(profile.firstName, profile.lastName);
  return profile.businessName?.trim() || personalName || fallbackLabel;
}

export function getProviderDisplayNameFromDraft(
  accountFormState: ProviderAccountFormValues,
  professionalFormState: ProviderProfileFormValues,
  fallbackProfile: ProviderProfileResponse | null,
  fallbackLabel: string,
): string {
  const businessName = professionalFormState.businessName.trim();
  const personalName = getPersonalName(accountFormState.firstName, accountFormState.lastName);

  return businessName || personalName || getProviderDisplayName(fallbackProfile, fallbackLabel);
}

export function formatProviderCategoryLabel(value: string | null | undefined, t: TranslationKeys) {
  const normalizedCategory = normalizeProviderCategory(value);

  switch (normalizedCategory) {
    case 'nursing':
      return t.services.nursing;
    case 'elderly_care':
      return t.services.elderly_care;
    case 'physiotherapy':
      return t.services.physiotherapy;
    case 'doctor':
      return t.services.doctorHome;
    case 'maternity':
      return t.services.maternityService;
    case 'night_care':
      return t.services.nightGuard;
    case 'psychology':
      return t.services.psychology;
    case 'nutrition':
      return t.services.nutrition;
    case 'laboratory':
      return t.services.laboratory;
    case 'radiology':
      return t.services.radiology;
    case 'ambulance':
      return t.services.ambulance;
    case 'equipment_rental':
      return t.nav.equipment;
    case 'gym':
      return t.services.gym;
    case 'checkup':
      return t.services.checkup;
    case 'chronic_care':
      return t.services.chronicCare;
    case 'medical_companion':
      return t.services.medicalCompanion;
    case 'babysitting':
      return t.services.babysitting;
    case 'pharmacy':
      return t.services.pharmacy;
    case 'funeral':
      return t.services.funeral;
    case 'veterinary':
      return t.serviceListing.veterinaryTitle;
    default: {
      const category = value?.trim();

      if (!category) {
        return t.common.noData;
      }

      return category
        .split(/[_\s-]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
  }
}

export function formatLastUpdated(
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

export function formatProfileVisibilityLabel(
  value: string | null | undefined,
  labels: {
    visibilityPublic: string;
    visibilityPrivate: string;
    visibilityHidden: string;
    visibilityUnset: string;
  },
): string {
  const normalizedValue = value?.trim().toLowerCase();

  switch (normalizedValue) {
    case 'public':
      return labels.visibilityPublic;
    case 'private':
      return labels.visibilityPrivate;
    case 'hidden':
      return labels.visibilityHidden;
    default:
      return labels.visibilityUnset;
  }
}

export { NUTRITION_PROVIDER_SUBTYPE_VALUES, getNutritionSubtypeLabel };
