import { Crown, Percent, Star } from 'lucide-react';
import type { TranslationKeys } from '@/i18n/types';
import type { ProfessionalSignUpFormValues } from '@/features/auth/schema';
import type { NutritionProviderSubtype } from '@/features/providers';

export type ProfessionalSignUpStep = 1 | 2 | 3 | 4;

export const professionalStepFieldNames = {
  1: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'address',
    'experience',
    'password',
    'confirmPassword',
  ],
  2: ['serviceType', 'nutritionProviderSubtype'],
  3: ['verificationConsentGiven', 'licenseFile', 'identityFile', 'diplomas', 'certifications'],
  4: ['subscriptionPlan', 'termsAccepted'],
} as const satisfies Record<number, Array<keyof ProfessionalSignUpFormValues>>;

function createDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDiploma(): ProfessionalSignUpFormValues['diplomas'][number] {
  return {
    file: null,
    fileName: '',
    id: createDocumentId(),
    institution: '',
    name: '',
    year: '',
  };
}

export function createCertification(): ProfessionalSignUpFormValues['certifications'][number] {
  return {
    file: null,
    fileName: '',
    id: createDocumentId(),
    name: '',
  };
}

export interface ProfessionalPlanOption {
  commission: string;
  description: string;
  features: string[];
  icon: typeof Percent | typeof Star | typeof Crown;
  id: 'commission' | 'standard' | 'elite';
  name: string;
  period: string;
  popular: boolean;
  price: string;
}

export const PROFESSIONAL_SIGN_UP_PLANS: readonly ProfessionalPlanOption[] = [
  {
    commission: '20%',
    description: 'Commission sur chaque opération',
    features: ['Pas de frais mensuels', '20% commission', 'Profil basique', 'Support standard'],
    icon: Percent,
    id: 'commission',
    name: 'Commission',
    period: 'mois',
    popular: false,
    price: '0',
  },
  {
    commission: '0%',
    description: 'Le plus populaire',
    features: [
      'Aucune commission',
      'Badge vérifié',
      'Visibilité prioritaire',
      'Analytics',
      'Support prioritaire',
    ],
    icon: Star,
    id: 'standard',
    name: 'Standard',
    period: 'mois',
    popular: true,
    price: '100',
  },
  {
    commission: '0%',
    description: 'Pour les leaders',
    features: [
      'Aucune commission',
      'Position top',
      'Badge Elite',
      'Marketing inclus',
      'Assurance RC',
      'Support VIP 24/7',
    ],
    icon: Crown,
    id: 'elite',
    name: 'Elite',
    period: 'mois',
    popular: false,
    price: '200',
  },
];

export function getProfessionalNutritionSubtypeOptions(
  t: TranslationKeys,
): Array<{ label: string; value: NutritionProviderSubtype }> {
  return [
    { label: t.serviceListing.nutritionRestaurant, value: 'Restaurant' },
    { label: t.serviceListing.nutritionChef, value: 'Chef' },
    { label: t.serviceListing.nutritionNutritionist, value: 'Nutritionist' },
  ];
}
