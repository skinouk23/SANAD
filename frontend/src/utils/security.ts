/**
 * Core Security Utilities
 * ISO 27001 | HIPAA | GDPR | INPDP | ANCS Compliant
 *
 * Provides XSS sanitization, data masking,
 * secure hashing, and encryption helpers.
 */

// ============================================
// XSS SANITIZATION (OWASP A7)
// ============================================

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

/**
 * Sanitize string to prevent XSS attacks
 * Escapes HTML entities in user-provided content
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[&<>"'`/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strip all HTML tags from a string
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Validate and sanitize URL to prevent javascript: protocol attacks
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  return url;
}

// ============================================
// DATA MASKING (HIPAA PHI / GDPR PII)
// ============================================

const DEFAULT_SENSITIVE_FIELD_FRAGMENTS = [
  'password',
  'passcode',
  'secret',
  'token',
  'accessToken',
  'refreshToken',
  'authToken',
  'authorization',
  'cookie',
  'session',
  'email',
  'phone',
  'mobile',
  'contact',
  'name',
  'firstname',
  'lastname',
  'fullname',
  'address',
  'street',
  'postalcode',
  'zipcode',
  'zip',
  'ssn',
  'cin',
  'nationalid',
  'passport',
  'license',
  'creditcard',
  'cardnumber',
  'cvv',
  'iban',
  'bankaccount',
  'dateofbirth',
  'birthdate',
  'medicalrecord',
  'diagnosis',
  'prescription',
  'healthdata',
  'biometric',
  'geneticdata',
  'sexualhealth',
];

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\w)(?:\+?\d[\d().\s-]{7,}\d)(?!\w)/g;
const LONG_NUMERIC_IDENTIFIER_PATTERN = /\b\d{8,16}\b/g;
const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+\b/g;
const BEARER_TOKEN_PATTERN = /\bBearer\s+[A-Za-z0-9._-]+\b/gi;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function normalizeFieldName(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

export function isSensitiveFieldName(
  fieldName: string,
  sensitiveFields: string[] = DEFAULT_SENSITIVE_FIELD_FRAGMENTS,
): boolean {
  const normalizedFieldName = normalizeFieldName(fieldName);

  return sensitiveFields.some((field) => normalizedFieldName.includes(normalizeFieldName(field)));
}

export function redactSensitiveText(value: string): string {
  if (!value) {
    return value;
  }

  return value
    .replace(BEARER_TOKEN_PATTERN, 'Bearer [REDACTED_SECRET]')
    .replace(JWT_PATTERN, '[REDACTED_SECRET]')
    .replace(EMAIL_PATTERN, '[REDACTED_EMAIL]')
    .replace(PHONE_PATTERN, '[REDACTED_PHONE]')
    .replace(LONG_NUMERIC_IDENTIFIER_PATTERN, '[REDACTED_NUMBER]');
}

function redactUnknownValue(value: unknown, sensitiveFields: string[], keyHint?: string): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (keyHint && isSensitiveFieldName(keyHint, sensitiveFields)) {
    return '[REDACTED]';
  }

  if (typeof value === 'string') {
    return redactSensitiveText(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => redactUnknownValue(entry, sensitiveFields));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactSensitiveText(value.message),
    };
  }

  if (isPlainObject(value)) {
    const redacted: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      redacted[key] = redactUnknownValue(entry, sensitiveFields, key);
    }

    return redacted;
  }

  return value;
}

/**
 * Mask email address for display
 * "user@example.com" → "u***r@example.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}@${domain}`;
}

/**
 * Mask phone number for display
 * "+216 98 765 432" → "+216 ** *** *32"
 */
export function maskPhone(phone: string): string {
  if (!phone) return '*** *** ***';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return phone.slice(0, 4) + phone.slice(4, -2).replace(/\d/g, '*') + phone.slice(-2);
}

/**
 * Mask name for display (GDPR pseudonymization)
 * "Fatma Ben Ali" → "F*** B** A**"
 */
export function maskName(name: string): string {
  if (!name) return '***';
  return name
    .split(' ')
    .map((part) => (part.length > 0 ? part[0] + '*'.repeat(Math.min(part.length - 1, 3)) : ''))
    .join(' ');
}

/**
 * Mask national ID / CIN
 * "12345678" → "****5678"
 */
export function maskNationalId(id: string): string {
  if (!id || id.length < 4) return '****';
  return '*'.repeat(id.length - 4) + id.slice(-4);
}

/**
 * Redact sensitive fields from an object before logging
 * Prevents PHI/PII from appearing in logs (HIPAA Safe Harbor)
 */
export function redactSensitiveData<T>(
  data: T,
  sensitiveFields: string[] = DEFAULT_SENSITIVE_FIELD_FRAGMENTS,
): T {
  return redactUnknownValue(data, sensitiveFields) as T;
}

// ============================================
// SECURE HASHING (for client-side fingerprinting)
// ============================================

/**
 * SHA-256 hash using Web Crypto API
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a device/browser fingerprint for session binding
 * ISO 27001 A.9.4 - System access control
 */
export async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency?.toString() || 'unknown',
  ];

  return sha256(components.join('|'));
}

// ============================================
// SECURE RANDOM GENERATION
// ============================================

/**
 * Generate a cryptographically secure random hex string.
 * @param length - Number of hex characters (each char = 4 bits of entropy).
 *   E.g. length=32 produces a 32-char hex string with 128 bits of entropy.
 */
export function generateSecureId(length: number = 32): string {
  const byteCount = Math.ceil(length / 2);
  const array = new Uint8Array(byteCount);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * Generate a numeric OTP code
 */
export function generateOtp(length: number = 6): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => (byte % 10).toString()).join('');
}

// ============================================
// CONTENT SECURITY
// ============================================

/**
 * Validate file upload type (prevent malicious uploads)
 */
export function isAllowedFileType(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size (prevent DoS via large uploads)
 * Default max: 5MB
 */
export function isAllowedFileSize(file: File, maxSizeBytes: number = 5 * 1024 * 1024): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Check for potential SQL injection patterns in input
 */
export function containsSqlInjection(input: string): boolean {
  if (typeof input !== 'string') return false;
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /('|")\s*(OR|AND)\s*('|"|\d)/i,
    /(\b(1=1|1=2|'=')\b)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize input against injection attacks
 * Returns null if malicious content detected
 */
export function validateSafeInput(input: string): string | null {
  if (containsSqlInjection(input)) return null;
  return sanitizeHtml(stripHtmlTags(input));
}

// ============================================
// RATE LIMITING (Client-side)
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Client-side rate limiter
 * Returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(
  action: string,
  maxAttempts: number = 5,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(action);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(action, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Reset rate limit for an action
 */
export function resetRateLimit(action: string): void {
  rateLimitMap.delete(action);
}
