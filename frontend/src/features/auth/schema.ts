/**
 * Auth Schemas
 * Zod schemas for authentication-related DTOs.
 * Matches: LoginRequest, LoginResponse, LoginUserResponse,
 *          RegisterUserRequest, RegistrationResponse, RegistrationUserResponse,
 *          RefreshTokenRequest, UserResponse.
 */

import { z } from 'zod';
import {
  CANONICAL_PROVIDER_CATEGORY_VALUES,
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  normalizeProviderCategory,
} from '@/features/providers/providerAuthoring';
import { dateTimeSchema, uuidSchema } from '@/shared/schemas/common';
import {
  normalizePhone,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '@/utils/input-validation';

// ============================================
// ROLE SCHEMAS
// ============================================

/** Backend auth payloads may contain any non-empty role string. */
const backendUserRoleResponseSchema = z.string().trim().min(1, 'Role utilisateur requis.');

/** Roles allowed during self-registration (admin/super_admin are server-assigned only, per D012) */
const registrationRoleEnum = z.enum(['patient', 'provider']);

const deviceFingerprintSchema = z.string().trim().min(1).max(255).optional();

const providerServiceTypeEnum = z.enum(CANONICAL_PROVIDER_CATEGORY_VALUES);
const nutritionProviderSubtypeEnum = z.enum(NUTRITION_PROVIDER_SUBTYPE_VALUES);

const providerServiceTypeSchema = z
  .string()
  .trim()
  .min(1, 'Sélectionnez une catégorie principale.')
  .transform((value, ctx) => {
    const normalizedValue = normalizeProviderCategory(value);

    if (!normalizedValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Catégorie professionnelle invalide.',
      });
      return z.NEVER;
    }

    return normalizedValue;
  })
  .pipe(providerServiceTypeEnum);

// ============================================
// LOGIN
// ============================================

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  deviceFingerprint: deviceFingerprintSchema,
});

export const OtpChannelSchema = z.enum(['email', 'sms']);

export const RequestLoginOtpRequestSchema = z.discriminatedUnion('channel', [
  z.object({
    channel: z.literal('email'),
    email: z.string().email(),
    rememberMe: z.boolean().optional(),
    deviceFingerprint: deviceFingerprintSchema,
  }),
  z.object({
    channel: z.literal('sms'),
    phoneNumber: z.string().trim().min(1).max(32).refine(isValidTunisiaSmsPhoneInput, {
      message: 'Numéro tunisien invalide.',
    }),
    rememberMe: z.boolean().optional(),
    deviceFingerprint: deviceFingerprintSchema,
  }),
]);

export const RequestLoginOtpResponseSchema = z.object({
  challengeId: uuidSchema,
  channel: OtpChannelSchema,
  maskedDestination: z.string(),
  expiresIn: z.number().int().positive(),
  resendAvailableIn: z.number().int().nonnegative(),
});

export const VerifyLoginOtpRequestSchema = z.object({
  challengeId: uuidSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Veuillez entrer le code complet à 6 chiffres'),
  rememberMe: z.boolean().optional(),
  deviceFingerprint: deviceFingerprintSchema,
});

export const OtpIdentifierFormSchema = z
  .object({
    channel: OtpChannelSchema,
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.channel === 'email') {
      const result = createValidationSchema(validateEmail, {
        requiredMessage: 'Adresse e-mail requise.',
      }).safeParse(value.email ?? '');

      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: result.error.issues[0]?.message ?? 'Adresse e-mail invalide.',
        });
      }

      return;
    }

    const phoneNumber = value.phoneNumber?.trim() ?? '';
    if (!phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Numéro de téléphone requis.',
      });
      return;
    }

    if (!isValidTunisiaSmsPhoneInput(phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Numéro tunisien invalide.',
      });
    }
  });

export const OtpCodeFormSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Veuillez entrer le code complet à 6 chiffres'),
});

export const LoginFormSchema = z.object({
  email: createValidationSchema(validateEmail, {
    requiredMessage: 'Adresse e-mail requise.',
  }),
  password: z.string().trim().min(1, 'Mot de passe requis.'),
  rememberMe: z.boolean().optional(),
});

export const ForgotPasswordEmailSchema = z.object({
  email: createValidationSchema(validateEmail, {
    requiredMessage: 'Adresse e-mail requise.',
  }),
});

export const ForgotPasswordCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Veuillez entrer le code complet à 6 chiffres'),
});

export const LoginUserResponseSchema = z.object({
  id: uuidSchema,
  email: z.string(),
  name: z.string(),
  role: backendUserRoleResponseSchema,
  phone: z.string().nullable(),
  avatar: z.string().nullable().optional(),
  avatarFileId: z.string().trim().min(1).nullable().optional(),
  countryCode: z.string().nullable(),
  createdAt: dateTimeSchema,
});

export const LoginResponseSchema = z.object({
  user: LoginUserResponseSchema,
  token: z.string(),
  refreshToken: z.string().nullable(),
  expiresIn: z.number().int(),
});

// ============================================
// REGISTRATION
// ============================================

export const ProviderRegistrationDocumentReferenceSchema = z.object({
  applicationId: uuidSchema.optional(),
  fileId: z.string().trim().min(1),
  documentType: z.string().trim().min(1),
  documentName: z.string().trim().nullable().optional(),
  documentUrl: z.string().trim().min(1).nullable().optional(),
  fileSizeBytes: z.number().int().positive().nullable().optional(),
  mimeType: z.string().trim().nullable().optional(),
});

export const RegisterUserRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z
      .string()
      .optional()
      .transform((value) => (value ? normalizePhone(value) : value)),
    address: z.string().trim().nullable().optional(),
    city: z.string().optional(),
    role: registrationRoleEnum,
    serviceType: providerServiceTypeSchema.optional(),
    nutritionProviderSubtype: nutritionProviderSubtypeEnum.optional(),
    providerApplicationId: uuidSchema.optional(),
    providerDocuments: z.array(ProviderRegistrationDocumentReferenceSchema).max(20).optional(),
    verificationConsentGiven: z.boolean().optional(),
    countryCode: z.string().optional(),
    deviceFingerprint: deviceFingerprintSchema,
  })
  .superRefine((value, ctx) => {
    if (value.serviceType === 'nutrition' && !value.nutritionProviderSubtype) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nutritionProviderSubtype'],
        message: 'Sélectionnez un sous-type nutrition.',
      });
    }

    if (value.nutritionProviderSubtype && value.serviceType !== 'nutrition') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nutritionProviderSubtype'],
        message: 'Le sous-type nutrition est réservé à la catégorie nutrition.',
      });
    }

    if (value.providerDocuments && value.role !== 'provider') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerDocuments'],
        message: 'Les documents prestataire sont reserves aux inscriptions prestataire.',
      });
    }

    if (value.providerApplicationId && value.role !== 'provider') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerApplicationId'],
        message: 'La reference de dossier prestataire est reservee aux inscriptions prestataire.',
      });
    }

    if (
      value.role === 'provider' &&
      value.providerDocuments?.length &&
      !value.providerApplicationId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerApplicationId'],
        message: 'La reference de dossier prestataire est requise avec les documents.',
      });
    }
  });

export const RegistrationUserResponseSchema = z.object({
  id: uuidSchema,
  email: z.string(),
  name: z.string(),
  role: backendUserRoleResponseSchema,
  phone: z.string().nullable(),
  avatarFileId: z.string().trim().min(1).nullable().optional(),
  countryCode: z.string().nullable(),
});

export const RegistrationResponseSchema = z.object({
  user: RegistrationUserResponseSchema,
  token: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  expiresIn: z.number().int().nullable().optional(),
  requiresApproval: z.boolean().optional(),
});

const signupUserTypeEnum = z.enum(['patient', 'professional']);
const professionalSubscriptionPlanEnum = z.enum(['commission', 'standard', 'elite']);

function isFileLike(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

const optionalFileSchema = z.custom<File | null>((value) => value === null || isFileLike(value), {
  message: 'Fichier invalide.',
});

const professionalDiplomaSchema = z.object({
  file: optionalFileSchema,
  fileName: z.string(),
  id: z.string().min(1),
  institution: z.string().trim(),
  name: z.string().trim(),
  year: z.string().trim(),
});

const professionalCertificationSchema = z.object({
  file: optionalFileSchema,
  fileName: z.string(),
  id: z.string().min(1),
  name: z.string().trim(),
});

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

function isValidTunisiaSmsPhoneInput(value: string): boolean {
  const compact = value
    .trim()
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '');

  if (compact.startsWith('+216')) {
    return /^\+216\d{8}$/.test(compact);
  }

  if (compact.startsWith('00216')) {
    return /^00216\d{8}$/.test(compact);
  }

  if (compact.startsWith('216')) {
    return /^216\d{8}$/.test(compact);
  }

  return /^\d{8}$/.test(compact);
}

export function parseRegisterUserRequest(input: unknown): RegisterUserRequest {
  const result = RegisterUserRequestSchema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  throw new Error(result.error.issues[0]?.message ?? "Requête d'inscription invalide.");
}

// ============================================
// REFRESH TOKEN
// ============================================

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1).optional(),
  deviceFingerprint: deviceFingerprintSchema,
});

export const LogoutRequestSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

// ============================================
// USER RESPONSE (GET /auth/profile)
// ============================================

export const UserResponseSchema = z.object({
  id: uuidSchema,
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  avatar: z.string().nullable().optional(),
  avatarFileId: z.string().trim().min(1).nullable().optional(),
  role: backendUserRoleResponseSchema,
  isActive: z.boolean(),
  createdAt: dateTimeSchema,
});

// ============================================
// SECURITY
// ============================================

const strongPasswordSchema = z.string().superRefine((value, ctx) => {
  const result = validatePassword(value);

  if (!result.isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error ?? 'Mot de passe invalide',
    });
  }
});

const SignUpFormBaseSchema = z.object({
  userType: signupUserTypeEnum,
  firstName: createValidationSchema(validateName, { fieldLabel: 'Prénom' }),
  lastName: createValidationSchema(validateName, { fieldLabel: 'Nom' }),
  email: createValidationSchema(validateEmail, {
    requiredMessage: 'Adresse e-mail requise.',
  }),
  phone: createValidationSchema(validatePhone, {
    requiredMessage: 'Numéro de téléphone requis.',
  }),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise.'),
  city: z.string().trim().min(1, 'Veuillez sélectionner une ville.'),
  termsAccepted: z.boolean().refine((value) => value, {
    message: 'Vous devez accepter les conditions.',
  }),
});

function addPasswordConfirmationIssue(
  value: { password: string; confirmPassword: string },
  ctx: z.RefinementCtx,
): void {
  if (value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Les mots de passe ne correspondent pas.',
    });
  }
}

export const SignUpFormSchema = SignUpFormBaseSchema.superRefine((value, ctx) => {
  addPasswordConfirmationIssue(value, ctx);
});

export const ProfessionalSignUpFormSchema = SignUpFormBaseSchema.pick({
  city: true,
  confirmPassword: true,
  email: true,
  firstName: true,
  lastName: true,
  password: true,
  phone: true,
  termsAccepted: true,
})
  .extend({
    address: z.string().trim().optional(),
    certifications: z.array(professionalCertificationSchema),
    experience: z
      .string()
      .trim()
      .min(1, "Le nombre d'annees d'experience est requis.")
      .refine((value) => /^\d+$/.test(value), {
        message: "Le nombre d'annees d'experience doit etre numerique.",
      }),
    license: z.string().trim(),
    licenseFile: optionalFileSchema,
    licenseFileName: z.string(),
    identityFile: optionalFileSchema,
    identityFileName: z.string(),
    nutritionProviderSubtype: z.union([nutritionProviderSubtypeEnum, z.literal('')]),
    serviceType: z.union([providerServiceTypeEnum, z.literal('')]),
    subscriptionPlan: z.union([professionalSubscriptionPlanEnum, z.literal('')]),
    useSameAccount: z.boolean(),
    userType: z.literal('professional'),
    verificationConsentGiven: z.boolean(),
    diplomas: z.array(professionalDiplomaSchema),
  })
  .superRefine((value, ctx) => {
    addPasswordConfirmationIssue(value, ctx);

    if (!value.serviceType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['serviceType'],
        message: 'Selectionnez une categorie principale.',
      });
    }

    if (value.serviceType === 'nutrition' && !value.nutritionProviderSubtype) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nutritionProviderSubtype'],
        message: 'Selectionnez un sous-type nutrition.',
      });
    }

    if (value.serviceType !== 'nutrition' && value.nutritionProviderSubtype) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nutritionProviderSubtype'],
        message: 'Le sous-type nutrition est reserve a la categorie nutrition.',
      });
    }

    if (!value.licenseFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['licenseFile'],
        message: 'Le document de licence est requis.',
      });
    }

    if (!value.identityFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['identityFile'],
        message: "La piece d'identite est requise.",
      });
    }

    value.diplomas.forEach((diploma, index) => {
      if (!diploma.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diplomas', index, 'name'],
          message: 'Le nom du diplome est requis.',
        });
      }

      if (!diploma.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diplomas', index, 'fileName'],
          message: 'Le document du diplome est requis.',
        });
      }
    });

    value.certifications.forEach((certification, index) => {
      const hasAnyValue = Boolean(
        certification.name || certification.file || certification.fileName,
      );

      if (!hasAnyValue) {
        return;
      }

      if (!certification.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['certifications', index, 'name'],
          message: 'Le nom de la certification est requis.',
        });
      }

      if (!certification.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['certifications', index, 'fileName'],
          message: 'Le document de certification est requis.',
        });
      }
    });

    const hasValidDiploma = value.diplomas.some((diploma) => diploma.name && diploma.file);

    if (!hasValidDiploma) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['diplomas'],
        message: 'Ajoutez au moins un diplome valide.',
      });
    }

    if (!value.subscriptionPlan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subscriptionPlan'],
        message: 'Selectionnez un abonnement.',
      });
    }
  });

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: strongPasswordSchema,
});

export const PasswordChangeConfirmSchema = z
  .object({
    confirmPassword: z.string().trim().min(1, 'Confirmation du mot de passe requise.'),
    newPassword: strongPasswordSchema,
  })
  .superRefine((value, ctx) => {
    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Les mots de passe ne correspondent pas.',
      });
    }
  });

export const ForgotPasswordResetSchema = PasswordChangeConfirmSchema;

export const ChangePasswordFormSchema = ChangePasswordRequestSchema.extend({
  confirmNewPassword: z.string().trim().min(1, 'Confirmation du mot de passe requise.'),
}).superRefine((value, ctx) => {
  if (value.newPassword !== value.confirmNewPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmNewPassword'],
      message: 'Les mots de passe ne correspondent pas.',
    });
  }
});

export const DeleteAccountRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
});

export const SessionSummarySchema = z.object({
  id: uuidSchema,
  ipAddress: z.string().nullable(),
  deviceType: z.string().nullable(),
  displayName: z.string().nullable(),
  browserName: z.string().nullable(),
  operatingSystem: z.string().nullable(),
  createdAt: dateTimeSchema,
  expiresAt: dateTimeSchema,
  isCurrent: z.boolean(),
});

export const SecurityOverviewResponseSchema = z.object({
  twoFactorEnabled: z.boolean(),
  passwordChangedAt: dateTimeSchema.nullable(),
  sessions: z.array(SessionSummarySchema),
});

// ============================================
// INFERRED TYPES
// ============================================

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type OtpChannel = z.infer<typeof OtpChannelSchema>;
export type RequestLoginOtpRequest = z.infer<typeof RequestLoginOtpRequestSchema>;
export type RequestLoginOtpResponse = z.infer<typeof RequestLoginOtpResponseSchema>;
export type VerifyLoginOtpRequest = z.infer<typeof VerifyLoginOtpRequestSchema>;
export type OtpIdentifierFormValues = z.infer<typeof OtpIdentifierFormSchema>;
export type OtpCodeFormValues = z.infer<typeof OtpCodeFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type LoginUserResponse = z.infer<typeof LoginUserResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type ForgotPasswordEmailValues = z.infer<typeof ForgotPasswordEmailSchema>;
export type ForgotPasswordCodeValues = z.infer<typeof ForgotPasswordCodeSchema>;
export type ForgotPasswordResetValues = z.infer<typeof ForgotPasswordResetSchema>;
export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;
export type RegisterUserRequestInput = z.input<typeof RegisterUserRequestSchema>;
export type ProfessionalSignUpFormValues = z.infer<typeof ProfessionalSignUpFormSchema>;
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
export type RegistrationUserResponse = z.infer<typeof RegistrationUserResponseSchema>;
export type RegistrationResponse = z.infer<typeof RegistrationResponseSchema>;
export type ProviderRegistrationDocumentReference = z.infer<
  typeof ProviderRegistrationDocumentReferenceSchema
>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;
export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;
export type SessionSummary = z.infer<typeof SessionSummarySchema>;
export type SecurityOverviewResponse = z.infer<typeof SecurityOverviewResponseSchema>;
