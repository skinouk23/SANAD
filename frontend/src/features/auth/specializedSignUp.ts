import { z } from 'zod';
import type { ProviderCategory } from '@/features/providers/providerAuthoring';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '@/utils/input-validation';

function isFileLike(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function createValidationSchema(
  validator: (value: string, fieldLabel?: string) => { isValid: boolean; error?: string },
  options?: { fieldLabel?: string; requiredMessage?: string },
) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: options?.requiredMessage ?? 'Champ requis.',
        });
        return;
      }

      const result = validator(value, options?.fieldLabel);

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error ?? 'Valeur invalide.',
        });
      }
    });
}

const optionalFileSchema = z.custom<File | null>((value) => value === null || isFileLike(value), {
  message: 'Fichier invalide.',
});

const passwordSchema = z.string().superRefine((value, ctx) => {
  const result = validatePassword(value);

  if (!result.isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error ?? 'Mot de passe invalide.',
    });
  }
});

const subscriptionPlanSchema = z.enum(['commission', 'standard', 'elite']);

const requiredDocumentSchema = z.object({
  file: optionalFileSchema,
  fileName: z.string(),
  id: z.string().min(1),
  label: z.string().min(1),
});

const additionalDocumentSchema = z.object({
  file: optionalFileSchema,
  fileName: z.string(),
  id: z.string().min(1),
  name: z.string().trim(),
});

const optionalRequestDocumentSchema = z.object({
  file: optionalFileSchema,
  fileName: z.string(),
  id: z.string().min(1),
  label: z.string().min(1),
});

export function createDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSpecializedProviderAccountSchema(requiredDocumentCount: number) {
  return z
    .object({
      additionalDocuments: z.array(additionalDocumentSchema),
      address: z.string().trim().optional(),
      city: z.string().trim().min(1, 'La ville est requise.'),
      confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise.'),
      email: createValidationSchema(validateEmail, { requiredMessage: 'Adresse e-mail requise.' }),
      identifier: z.string().trim().min(1, 'Le numero requis est obligatoire.'),
      managerName: createValidationSchema(validateName, { fieldLabel: 'Responsable' }),
      offerings: z.array(z.string()).min(1, 'Selectionnez au moins une option.'),
      organizationName: z.string().trim().min(1, "Le nom de l'etablissement est requis."),
      password: passwordSchema,
      phone: createValidationSchema(validatePhone, {
        requiredMessage: 'Numero de telephone requis.',
      }),
      requiredDocuments: z.array(requiredDocumentSchema).length(requiredDocumentCount),
      subscriptionPlan: z.union([subscriptionPlanSchema, z.literal('')]),
      verificationConsentGiven: z.boolean(),
      yearsInBusiness: z
        .string()
        .trim()
        .min(1, "Le nombre d'annees est requis.")
        .refine((value) => /^\d+$/.test(value), {
          message: "Le nombre d'annees doit etre numerique.",
        }),
    })
    .superRefine((value, ctx) => {
      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Les mots de passe ne correspondent pas.',
        });
      }

      if (!value.subscriptionPlan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['subscriptionPlan'],
          message: 'Selectionnez un abonnement.',
        });
      }

      value.requiredDocuments.forEach((document, index) => {
        if (!document.file) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['requiredDocuments', index, 'fileName'],
            message: 'Document requis.',
          });
        }
      });

      value.additionalDocuments.forEach((document, index) => {
        const hasAnyValue = Boolean(document.name || document.file || document.fileName);

        if (!hasAnyValue) {
          return;
        }

        if (!document.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['additionalDocuments', index, 'name'],
            message: 'Nom du document requis.',
          });
        }

        if (!document.file) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['additionalDocuments', index, 'fileName'],
            message: 'Fichier requis.',
          });
        }
      });
    });
}

export const SpecializedReviewRequestSchema = z.object({
  address: z.string().trim().min(1, "L'adresse est requise."),
  documentUploads: z.array(optionalRequestDocumentSchema),
  identifier: z.string().trim().min(1, 'Le numero requis est obligatoire.'),
  managerName: createValidationSchema(validateName, { fieldLabel: 'Responsable' }),
  organizationName: z.string().trim().min(1, "Le nom de l'etablissement est requis."),
  phone: createValidationSchema(validatePhone, { requiredMessage: 'Numero de telephone requis.' }),
  services: z.array(z.string()),
  toggles: z.record(z.string(), z.boolean()),
});

export const SPECIALIZED_SIGNUP_PLANS = [
  {
    commission: '20%',
    description: 'Commission sur chaque operation',
    features: [
      'Pas de frais mensuels',
      '20% commission sur chaque reservation',
      'Profil basique',
      'Support standard',
      'Visibilite limitee',
    ],
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
      'Profil premium avec badge verifie',
      'Visibilite prioritaire',
      'Planning avance et rappels',
      'Analytics et statistiques',
      'Support prioritaire',
    ],
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
      'Tous les avantages Standard',
      'Position top dans les resultats',
      'Badge Elite exclusif',
      'Marketing et promotion',
      'Assurance responsabilite civile',
      'Formation continue gratuite',
      'Support VIP 24/7',
    ],
    id: 'elite',
    name: 'Elite',
    period: 'mois',
    popular: false,
    price: '200',
  },
] as const;

export type SpecializedProviderAccountFormValues = z.infer<
  ReturnType<typeof createSpecializedProviderAccountSchema>
>;
export type SpecializedReviewRequestFormValues = z.infer<typeof SpecializedReviewRequestSchema>;
export type SpecializedRequiredDocument = z.infer<typeof requiredDocumentSchema>;
export type SpecializedOptionalDocument = z.infer<typeof optionalRequestDocumentSchema>;
export type SpecializedAdditionalDocument = z.infer<typeof additionalDocumentSchema>;
export type SpecializedSubscriptionPlan = (typeof SPECIALIZED_SIGNUP_PLANS)[number]['id'];

export interface SpecializedOptionItem {
  id: string;
  icon: string;
  label: string;
}

export interface SpecializedRequiredDocumentConfig {
  description: string;
  id: string;
  label: string;
}

export interface SpecializedProviderAccountConfig {
  additionalDocumentsLabel: string;
  additionalDocumentsPlaceholder: string;
  additionalDocumentsTitle: string;
  documentsSubtitle: string;
  documentsTitle: string;
  iconBadge: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  managerLabel: string;
  managerPlaceholder: string;
  offerings: SpecializedOptionItem[];
  offeringsDescription: string;
  offeringsTitle: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  requiredDocuments: SpecializedRequiredDocumentConfig[];
  serviceType: ProviderCategory;
  subtitle: string;
  title: string;
  yearsLabel: string;
  yearsPlaceholder: string;
}

export interface SpecializedToggleOption {
  description: string;
  id: string;
  label: string;
}

export interface SpecializedReviewRequestConfig {
  confirmationBody: string;
  confirmationTitle: string;
  documents: SpecializedRequiredDocumentConfig[];
  documentsNotice: string;
  documentsSubtitle: string;
  documentsTitle: string;
  iconBadge: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  managerLabel: string;
  managerPlaceholder: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  services: string[];
  servicesSubtitle: string;
  servicesTitle: string;
  specialOptions?: SpecializedToggleOption[];
  subtitle: string;
  title: string;
}
