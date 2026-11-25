/**
 * Core Security Utilities
 * ISO 27001 | HIPAA | GDPR | INPDP | ANCS Compliant
 *
 * Provides XSS sanitization, CSRF protection, data masking,
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
  '`': '&#96;'
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
 * Sanitize an object's string values recursively
 * Use before rendering user-provided data
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
      typeof item === 'string' ?
      sanitizeHtml(item) :
      typeof item === 'object' && item !== null ?
      sanitizeObject(item) :
      item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
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
  trimmed.startsWith('vbscript:'))
  {
    return '';
  }
  return url;
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

/**
 * Get or create CSRF token for the session
 */
export function getCsrfToken(): string {
  const CSRF_KEY = '__sanad_csrf';
  let token = sessionStorage.getItem(CSRF_KEY);
  if (!token) {
    token = generateCsrfToken();
    sessionStorage.setItem(CSRF_KEY, token);
  }
  return token;
}

// ============================================
// DATA MASKING (HIPAA PHI / GDPR PII)
// ============================================

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
  return (
    phone.slice(0, 4) + phone.slice(4, -2).replace(/\d/g, '*') + phone.slice(-2));

}

/**
 * Mask name for display (GDPR pseudonymization)
 * "Fatma Ben Ali" → "F*** B** A**"
 */
export function maskName(name: string): string {
  if (!name) return '***';
  return name.
  split(' ').
  map((part) =>
  part.length > 0 ? part[0] + '*'.repeat(Math.min(part.length - 1, 3)) : ''
  ).
  join(' ');
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
export function redactSensitiveData<T extends Record<string, any>>(
data: T,
sensitiveFields: string[] = [
'password',
'token',
'accessToken',
'refreshToken',
'authToken',
'ssn',
'cin',
'nationalId',
'creditCard',
'cardNumber',
'cvv',
'dateOfBirth',
'medicalRecord',
'diagnosis',
'prescription',
'healthData',
'biometric',
'geneticData',
'sexualHealth'])

: T {
  const redacted: any = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (
    sensitiveFields.some((field) => lowerKey.includes(field.toLowerCase())))
    {
      redacted[key] = '[REDACTED]';
    } else if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value))
    {
      redacted[key] = redactSensitiveData(value, sensitiveFields);
    } else {
      redacted[key] = value;
    }
  }
  return redacted as T;
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
  navigator.hardwareConcurrency?.toString() || 'unknown'];

  return sha256(components.join('|'));
}

// ============================================
// SECURE RANDOM GENERATION
// ============================================

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).
  join('').
  slice(0, length);
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
allowedTypes: string[] = [
'image/jpeg',
'image/png',
'image/webp',
'application/pdf'])

: boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size (prevent DoS via large uploads)
 * Default max: 5MB
 */
export function isAllowedFileSize(
file: File,
maxSizeBytes: number = 5 * 1024 * 1024)
: boolean {
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
  /(\b(1=1|1=2|'=')\b)/i];

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

const rateLimitMap = new Map<string, {count: number;resetTime: number;}>();

/**
 * Client-side rate limiter
 * Returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(
action: string,
maxAttempts: number = 5,
windowMs: number = 60000)
: boolean {
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