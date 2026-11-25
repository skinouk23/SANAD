/**
 * Input Validation Utilities
 * ISO 27001 A.14.2 - Security in development and support processes
 * OWASP Input Validation Cheat Sheet
 *
 * Comprehensive validation for all user inputs to prevent
 * injection attacks and ensure data integrity.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// ============================================
// EMAIL VALIDATION
// ============================================

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Adresse email requise' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Adresse email trop longue' };
  }

  // RFC 5322 compliant regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Format email invalide' };
  }

  return { isValid: true };
}

// ============================================
// PASSWORD VALIDATION (NIST SP 800-63B)
// ============================================

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Mot de passe requis' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Minimum 8 caractères requis' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Maximum 128 caractères' };
  }

  // Check complexity — must match backend: all 4 classes required (fixes #12)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // Backend allows only: !@#$%^&* — keep in sync with AuthenticationValidators.cs
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const complexityScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;

  if (complexityScore < 4) {
    return {
      isValid: false,
      error:
        'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*)',
    };
  }

  // Check common passwords
  const commonPasswords = [
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

  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Ce mot de passe est trop courant' };
  }

  return { isValid: true };
}

/**
 * Calculate password strength score (0-4)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: 'Aucun', color: 'gray' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  score = Math.min(score, 4);

  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const colors = ['red', 'orange', 'yellow', 'green', 'emerald'];

  return { score, label: labels[score], color: colors[score] };
}

// ============================================
// PHONE VALIDATION (Tunisia format)
// ============================================

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-.()]/g, '');
}

export const TUNISIA_PHONE_PREFIX = '+216';
export const TUNISIA_PHONE_DEFAULT_VALUE = `${TUNISIA_PHONE_PREFIX} `;
export const TUNISIA_PHONE_PLACEHOLDER = '+216 55 555 555';

function getTunisiaLocalPhoneDigits(value: string): string {
  const trimmedValue = value.trim();
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.startsWith('00216')) {
    return digitsOnly.slice(5, 13);
  }

  if (
    trimmedValue.startsWith(TUNISIA_PHONE_PREFIX) ||
    (digitsOnly.length > 8 && digitsOnly.startsWith('216'))
  ) {
    return digitsOnly.slice(3, 11);
  }

  return digitsOnly.slice(0, 8);
}

export function formatTunisiaPhoneInput(value: string | null | undefined): string {
  const localDigits = getTunisiaLocalPhoneDigits(value ?? '');
  const groups = [localDigits.slice(0, 2), localDigits.slice(2, 5), localDigits.slice(5, 8)].filter(
    Boolean,
  );

  return groups.length > 0
    ? [TUNISIA_PHONE_PREFIX, ...groups].join(' ')
    : TUNISIA_PHONE_DEFAULT_VALUE;
}

export function createDefaultTunisiaPhoneValue(value?: string | null): string {
  return value?.trim() ? formatTunisiaPhoneInput(value) : TUNISIA_PHONE_DEFAULT_VALUE;
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: 'Numéro de téléphone requis' };
  }

  // Remove spaces, dashes, dots
  const cleaned = normalizePhone(phone);

  if (cleaned === TUNISIA_PHONE_PREFIX || cleaned === TUNISIA_PHONE_PREFIX.slice(1)) {
    return { isValid: false, error: 'Numéro de téléphone requis' };
  }

  // Tunisia: +216 XX XXX XXX or 216XXXXXXXX or XX XXX XXX
  const tunisiaRegex = /^(\+?216)?[2-9]\d{7}$/;
  if (!tunisiaRegex.test(cleaned)) {
    return { isValid: false, error: 'Format de numéro tunisien invalide' };
  }

  return { isValid: true };
}

// ============================================
// NAME VALIDATION
// ============================================

export function validateName(name: string, fieldLabel: string = 'Nom'): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldLabel} requis` };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: `${fieldLabel} trop court (min. 2 caractères)`,
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: `${fieldLabel} trop long (max. 100 caractères)`,
    };
  }

  // Allow letters, spaces, hyphens, apostrophes (Arabic, French, Latin)
  const nameRegex = /^[\p{L}\s\-'.]+$/u;
  if (!nameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldLabel} contient des caractères non autorisés`,
    };
  }

  return { isValid: true };
}

// ============================================
// CIN / NATIONAL ID VALIDATION (Tunisia)
// ============================================

export function validateCIN(cin: string): ValidationResult {
  if (!cin) {
    return { isValid: false, error: 'Numéro CIN requis' };
  }

  const cleaned = cin.replace(/\s/g, '');

  // Tunisia CIN: 8 digits
  if (!/^\d{8}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Le CIN doit contenir exactement 8 chiffres',
    };
  }

  return { isValid: true };
}

// ============================================
// ADDRESS VALIDATION
// ============================================

export function validateAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Adresse requise' };
  }

  const trimmed = address.trim();

  if (trimmed.length < 5) {
    return { isValid: false, error: 'Adresse trop courte' };
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: 'Adresse trop longue' };
  }

  return { isValid: true };
}

// ============================================
// NUMERIC VALIDATION
// ============================================

export function validatePrice(value: number | string): ValidationResult {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: 'Montant invalide' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Le montant ne peut pas être négatif' };
  }

  if (num > 999999) {
    return { isValid: false, error: 'Montant trop élevé' };
  }

  return { isValid: true };
}

// ============================================
// DATE VALIDATION
// ============================================

export function validateFutureDate(dateStr: string): ValidationResult {
  if (!dateStr) {
    return { isValid: false, error: 'Date requise' };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Format de date invalide' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (date < now) {
    return { isValid: false, error: 'La date doit être dans le futur' };
  }

  // Max 1 year in advance
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  if (date > maxDate) {
    return { isValid: false, error: 'La date ne peut pas dépasser 1 an' };
  }

  return { isValid: true };
}

// ============================================
// GENERIC TEXT VALIDATION
// ============================================

export function validateText(
  value: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    fieldLabel?: string;
  } = {},
): ValidationResult {
  const { required = true, minLength = 0, maxLength = 5000, fieldLabel = 'Ce champ' } = options;

  if (!value || typeof value !== 'string') {
    return required ? { isValid: false, error: `${fieldLabel} est requis` } : { isValid: true };
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    return { isValid: false, error: `${fieldLabel} est requis` };
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldLabel} trop court (min. ${minLength} caractères)`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldLabel} trop long (max. ${maxLength} caractères)`,
    };
  }

  return { isValid: true };
}
