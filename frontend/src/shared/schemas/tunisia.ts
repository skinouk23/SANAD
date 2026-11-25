/**
 * Tunisia-Specific Validation Schemas
 * Wraps existing validators from input-validation.ts as Zod refinements.
 * Preserves the battle-tested regex patterns and validation logic.
 */

import { z } from 'zod';

// ============================================
// PHONE NUMBER (Tunisia format)
// ============================================

/**
 * Tunisia phone: +216 XX XXX XXX, 216XXXXXXXX, or XX XXX XXX
 * Reuses the same regex from input-validation.ts
 */
const TUNISIA_PHONE_REGEX = /^(\+?216)?[2-9]\d{7}$/;

/** Strips spaces, dashes, dots, and parentheses before validation */
function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-.()]/g, '');
}

export const TunisiaPhoneSchema = z
  .string()
  .min(1, 'Numéro de téléphone requis')
  .transform(cleanPhone)
  .refine((val) => TUNISIA_PHONE_REGEX.test(val), {
    message: 'Format de numéro tunisien invalide',
  });

/** Optional Tunisia phone (nullable) */
export const OptionalTunisiaPhoneSchema = z
  .string()
  .nullable()
  .optional()
  .transform((val) => (val ? cleanPhone(val) : val))
  .refine((val) => !val || TUNISIA_PHONE_REGEX.test(val), {
    message: 'Format de numéro tunisien invalide',
  });

// ============================================
// CIN / NATIONAL ID (Tunisia: 8 digits)
// ============================================

const CIN_REGEX = /^\d{8}$/;

export const TunisiaCINSchema = z
  .string()
  .min(1, 'Numéro CIN requis')
  .transform((val) => val.replace(/\s/g, ''))
  .refine((val) => CIN_REGEX.test(val), {
    message: 'Le CIN doit contenir exactement 8 chiffres',
  });

/** Optional CIN (nullable) */
export const OptionalTunisiaCINSchema = z
  .string()
  .nullable()
  .optional()
  .transform((val) => (val ? val.replace(/\s/g, '') : val))
  .refine((val) => !val || CIN_REGEX.test(val), {
    message: 'Le CIN doit contenir exactement 8 chiffres',
  });

// ============================================
// EMAIL (RFC 5322 compliant)
// ============================================

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const EmailSchema = z
  .string()
  .min(1, 'Adresse email requise')
  .max(254, 'Adresse email trop longue')
  .transform((val) => val.trim().toLowerCase())
  .refine((val) => EMAIL_REGEX.test(val), {
    message: 'Format email invalide',
  });

// ============================================
// PASSWORD (NIST SP 800-63B)
// ============================================

const COMMON_PASSWORDS = [
  'password',
  '12345678',
  'qwerty123',
  'admin123',
  'letmein',
  'welcome1',
  'monkey123',
  'dragon12',
  'master12',
  'abc12345',
];

export const PasswordSchema = z
  .string()
  .min(8, 'Minimum 8 caractères requis')
  .max(128, 'Maximum 128 caractères')
  .refine(
    (val) => {
      const hasUppercase = /[A-Z]/.test(val);
      const hasLowercase = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val);
      const score = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
      return score >= 3;
    },
    {
      message:
        'Le mot de passe doit contenir au moins 3 des éléments suivants : majuscule, minuscule, chiffre, caractère spécial',
    },
  )
  .refine((val) => !COMMON_PASSWORDS.includes(val.toLowerCase()), {
    message: 'Ce mot de passe est trop courant',
  });

// ============================================
// NAME (supports Arabic, French, Latin)
// ============================================

const NAME_REGEX = /^[\p{L}\s\-'.]+$/u;

export function nameSchema(fieldLabel = 'Nom') {
  return z
    .string()
    .min(1, `${fieldLabel} requis`)
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, {
      message: `${fieldLabel} trop court (min. 2 caractères)`,
    })
    .refine((val) => val.length <= 100, {
      message: `${fieldLabel} trop long (max. 100 caractères)`,
    })
    .refine((val) => NAME_REGEX.test(val), {
      message: `${fieldLabel} contient des caractères non autorisés`,
    });
}

export const NameSchema = nameSchema('Nom');
export const FirstNameSchema = nameSchema('Prénom');
export const LastNameSchema = nameSchema('Nom de famille');

// ============================================
// ADDRESS
// ============================================

export const AddressTextSchema = z
  .string()
  .min(5, 'Adresse trop courte')
  .max(500, 'Adresse trop longue');

// ============================================
// PRICE
// ============================================

export const PriceSchema = z
  .number()
  .min(0, 'Le montant ne peut pas être négatif')
  .max(999999, 'Montant trop élevé');

// ============================================
// INFERRED TYPES
// ============================================

export type TunisiaPhone = z.infer<typeof TunisiaPhoneSchema>;
export type TunisiaCIN = z.infer<typeof TunisiaCINSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;
