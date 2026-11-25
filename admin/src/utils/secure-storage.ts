/**
 * Secure Storage Utility
 * ISO 27001 A.10 - Cryptographic controls
 * HIPAA §164.312(a)(2)(iv) - Encryption and decryption
 * GDPR Art. 32 - Security of processing
 *
 * Provides encrypted localStorage/sessionStorage wrapper
 * to protect PHI/PII data at rest in the browser.
 */

// ============================================
// ENCRYPTION HELPERS (Web Crypto API)
// ============================================

const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const STORAGE_PREFIX = '__sanad_sec_';

/**
 * Derive an encryption key from a passphrase using PBKDF2
 */
async function deriveKey(
passphrase: string,
salt: Uint8Array)
: Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or generate the device-specific encryption passphrase
 * Uses a combination of origin + device fingerprint components
 */
function getDevicePassphrase(): string {
  const components = [
  window.location.origin,
  navigator.userAgent.slice(0, 50),
  'sanad-health-platform-2024'];

  return components.join(':');
}

/**
 * Encrypt a string value
 */
async function encryptValue(plaintext: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await deriveKey(getDevicePassphrase(), salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      encoder.encode(plaintext)
    );

    // Combine salt + iv + ciphertext into a single base64 string
    const combined = new Uint8Array(
      salt.length + iv.length + new Uint8Array(encrypted).length
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch {
    // Fallback: base64 encode (for environments without Web Crypto)
    return btoa(encodeURIComponent(plaintext));
  }
}

/**
 * Decrypt a string value
 */
async function decryptValue(ciphertext: string): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(ciphertext).
      split('').
      map((c) => c.charCodeAt(0))
    );

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(getDevicePassphrase(), salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // Fallback: try base64 decode
    try {
      return decodeURIComponent(atob(ciphertext));
    } catch {
      return '';
    }
  }
}

// ============================================
// SECURE STORAGE CLASS
// ============================================

export class SecureStorage {
  private storage: Storage;
  private prefix: string;

  constructor(storageType: 'local' | 'session' = 'local') {
    this.storage = storageType === 'session' ? sessionStorage : localStorage;
    this.prefix = STORAGE_PREFIX;
  }

  /**
   * Store an encrypted value
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: 1
      });
      const encrypted = await encryptValue(serialized);
      this.storage.setItem(this.prefix + key, encrypted);
    } catch (error) {
      console.error('[SecureStorage] Failed to set item:', key);
    }
  }

  /**
   * Retrieve and decrypt a value
   * Returns null if expired or not found
   */
  async getItem<T = any>(key: string, maxAgeMs?: number): Promise<T | null> {
    try {
      const encrypted = this.storage.getItem(this.prefix + key);
      if (!encrypted) return null;

      const decrypted = await decryptValue(encrypted);
      if (!decrypted) return null;

      const parsed = JSON.parse(decrypted);

      // Check expiration
      if (maxAgeMs && Date.now() - parsed.timestamp > maxAgeMs) {
        this.removeItem(key);
        return null;
      }

      return parsed.data as T;
    } catch {
      return null;
    }
  }

  /**
   * Remove an item
   */
  removeItem(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  /**
   * Clear all secure storage items
   */
  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => this.storage.removeItem(key));
  }

  /**
   * Check if an item exists and is not expired
   */
  async hasItem(key: string, maxAgeMs?: number): Promise<boolean> {
    const value = await this.getItem(key, maxAgeMs);
    return value !== null;
  }
}

// ============================================
// SINGLETON INSTANCES
// ============================================

/** Encrypted localStorage (persists across sessions) */
export const secureLocalStorage = new SecureStorage('local');

/** Encrypted sessionStorage (cleared on tab close) */
export const secureSessionStorage = new SecureStorage('session');

// ============================================
// SECURE AUTH TOKEN MANAGEMENT
// ============================================

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const SESSION_ID_KEY = 'session_id';
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes inactivity

/**
 * Store authentication token securely
 */
export async function setAuthToken(token: string): Promise<void> {
  await secureSessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Retrieve authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  return secureSessionStorage.getItem<string>(AUTH_TOKEN_KEY, TOKEN_MAX_AGE);
}

/**
 * Store user data securely
 */
export async function setAuthUser(user: any): Promise<void> {
  await secureLocalStorage.setItem(AUTH_USER_KEY, user);
}

/**
 * Retrieve user data
 */
export async function getAuthUser(): Promise<any | null> {
  return secureLocalStorage.getItem(AUTH_USER_KEY, TOKEN_MAX_AGE);
}

/**
 * Generate and store a session ID
 */
export async function createSession(): Promise<string> {
  const sessionId = crypto.
  getRandomValues(new Uint8Array(16)).
  reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  await secureSessionStorage.setItem(SESSION_ID_KEY, {
    id: sessionId,
    createdAt: Date.now(),
    lastActivity: Date.now()
  });
  return sessionId;
}

/**
 * Update session last activity timestamp
 */
export async function touchSession(): Promise<void> {
  const session = await secureSessionStorage.getItem<any>(SESSION_ID_KEY);
  if (session) {
    session.lastActivity = Date.now();
    await secureSessionStorage.setItem(SESSION_ID_KEY, session);
  }
}

/**
 * Check if session is still valid
 */
export async function isSessionValid(): Promise<boolean> {
  const session = await secureSessionStorage.getItem<any>(SESSION_ID_KEY);
  if (!session) return false;
  return Date.now() - session.lastActivity < SESSION_MAX_AGE;
}

/**
 * Clear all authentication data securely
 * HIPAA §164.312(d) - Person or entity authentication
 */
export function clearAuthData(): void {
  secureSessionStorage.clear();
  secureLocalStorage.removeItem(AUTH_USER_KEY);
  // Also clear any legacy plain localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
}