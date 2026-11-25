import type { TranslationKeys } from '@/i18n/types';

export const SIGN_UP_CITY_OPTIONS = [
  { label: 'Tunis', value: 'tunis' },
  { label: 'Sfax', value: 'sfax' },
  { label: 'Sousse', value: 'sousse' },
  { label: 'Ariana', value: 'ariana' },
  { label: 'Ben Arous', value: 'ben-arous' },
];

export interface SignUpVariantConfig {
  icon: string;
  subtitle: string;
  title: string;
}

export function getSignUpVariantConfig(
  t: TranslationKeys,
): Record<'patient' | 'professional', SignUpVariantConfig> {
  return {
    patient: {
      icon: '👤',
      subtitle: t.signup.accessBestCare,
      title: t.signup.createPatientAccount,
    },
    professional: {
      icon: '💼',
      subtitle: t.signup.growYourBusiness,
      title: t.signup.createProfessionalAccount,
    },
  };
}
