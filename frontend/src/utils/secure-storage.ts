/**
 * Hardened browser storage helpers.
 *
 * Browser storage is not a secret vault: anything persisted client-side should
 * be treated as user-accessible. This wrapper focuses on scoping, expiry,
 * malformed-entry cleanup, and legacy migration rather than pretending to
 * provide strong at-rest secrecy.
 */

import { resolveRolePolicy } from '@/shared/lib/auth/role-policy';
import type { SupportedRuntimeRole } from '@/shared/lib/auth/role-policy';

// ============================================
// LEGACY MIGRATION HELPERS
// ============================================

const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

async function deriveLegacyKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['decrypt'],
  );
}

function getLegacyDevicePassphrase(): string {
  return [
    window.location.origin,
    navigator.userAgent.slice(0, 50),
    'sanad-health-platform-2024',
  ].join(':');
}

async function decryptLegacyValue(ciphertext: string): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = combined.slice(SALT_LENGTH + IV_LENGTH);
    const key = await deriveLegacyKey(getLegacyDevicePassphrase(), salt);
    const decrypted = await crypto.subtle.decrypt({ name: ENCRYPTION_ALGORITHM, iv }, key, data);

    return new TextDecoder().decode(decrypted);
  } catch {
    try {
      return decodeURIComponent(atob(ciphertext));
    } catch {
      return '';
    }
  }
}

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_PREFIX = '__sanad_sec_';

interface StoredEnvelope<T> {
  version: 2;
  storedAt: number;
  data: T;
}

interface LegacyEnvelope<T> {
  version: number;
  timestamp: number;
  data: T;
}

interface PersistedSessionState {
  id: string;
  createdAt: number;
  lastActivity: number;
}

export interface PersistedAuthUserAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  fullAddress: string;
}

export interface PersistedAuthUser {
  id: string;
  email: string;
  role: SupportedRuntimeRole;
  backendRole: string;
  name: string;
  phone?: string;
  avatarFileId?: string;
  countryCode?: string;
  serviceType?: string;
  address?: PersistedAuthUserAddress;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const AUTH_USER_KEY = 'auth_user';
const SESSION_STATE_KEY = 'session_state';
const PERSISTENT_SESSION_PREFERENCE_KEY = 'persistent_session_preference';
const DEVICE_FINGERPRINT_KEY = 'device_fingerprint';

const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE = 30 * 60 * 1000;
const DEVICE_FINGERPRINT_PREFIX = 'dfp_';
const DEVICE_FINGERPRINT_RANDOM_BYTES = 32;
const DEVICE_FINGERPRINT_MAX_LENGTH = 255;

const LEGACY_PLAINTEXT_KEYS = ['authToken', 'refreshToken', 'user', 'isAuthenticated'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage access and quota failures.
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage access failures.
  }
}

function safeParseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getRequiredString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function getOptionalString(value: unknown): string | undefined {
  return getRequiredString(value) ?? undefined;
}

function isStoredEnvelope(value: unknown): value is StoredEnvelope<unknown> {
  return (
    isRecord(value) && value.version === 2 && typeof value.storedAt === 'number' && 'data' in value
  );
}

function isLegacyEnvelope(value: unknown): value is LegacyEnvelope<unknown> {
  return (
    isRecord(value) &&
    typeof value.version === 'number' &&
    typeof value.timestamp === 'number' &&
    'data' in value
  );
}

function isPersistedSessionState(value: unknown): value is PersistedSessionState {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'number' &&
    typeof value.lastActivity === 'number'
  );
}

function isExpired(storedAt: number, maxAgeMs?: number): boolean {
  return typeof maxAgeMs === 'number' && Date.now() - storedAt > maxAgeMs;
}

function buildStoredEnvelope<T>(data: T): StoredEnvelope<T> {
  return {
    version: 2,
    storedAt: Date.now(),
    data,
  };
}

function generateSessionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(value: string): Promise<string | null> {
  if (!crypto.subtle) {
    return null;
  }

  try {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return bytesToHex(new Uint8Array(digest));
  } catch {
    return null;
  }
}

function generateBrowserInstallationId(): string {
  const randomBytes = new Uint8Array(DEVICE_FINGERPRINT_RANDOM_BYTES);
  crypto.getRandomValues(randomBytes);
  return bytesToHex(randomBytes);
}

function normalizeDeviceFingerprint(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 && normalizedValue.length <= DEVICE_FINGERPRINT_MAX_LENGTH
    ? normalizedValue
    : null;
}

async function createStableDeviceFingerprint(): Promise<string> {
  const installationId = generateBrowserInstallationId();
  const hashedInstallationId = await sha256Hex(`sanad-device:${installationId}`);
  const fingerprint = `${DEVICE_FINGERPRINT_PREFIX}${hashedInstallationId ?? installationId}`;

  return fingerprint.slice(0, DEVICE_FINGERPRINT_MAX_LENGTH);
}

function buildPersistedAuthUser(user: unknown): PersistedAuthUser | null {
  if (!isRecord(user)) {
    return null;
  }

  const id = getRequiredString(user.id);
  const email = getRequiredString(user.email);
  const rawRole = getRequiredString(user.backendRole);
  const name = getRequiredString(user.name);
  const persistedRole = getRequiredString(user.role);

  if (!id || !email || !rawRole || !name || !persistedRole) {
    return null;
  }

  const rolePolicy = resolveRolePolicy(rawRole);

  if (!rolePolicy.isSupportedInSpa || rolePolicy.normalizedRole !== persistedRole) {
    return null;
  }

  const persistedUser: PersistedAuthUser = {
    id,
    email,
    role: rolePolicy.normalizedRole,
    backendRole: rolePolicy.rawRole,
    name,
  };

  const optionalScalarFields = ['phone', 'avatarFileId', 'countryCode', 'serviceType'] as const;

  optionalScalarFields.forEach((field) => {
    const value = getOptionalString(user[field]);
    if (value) {
      persistedUser[field] = value;
    }
  });

  if (isRecord(user.address)) {
    const sourceAddress = user.address as Record<string, unknown>;
    const street = getRequiredString(sourceAddress.street);
    const city = getRequiredString(sourceAddress.city);
    const region = getRequiredString(sourceAddress.region);
    const postalCode = getRequiredString(sourceAddress.postalCode);
    const country = getRequiredString(sourceAddress.country);
    const fullAddress = getRequiredString(sourceAddress.fullAddress);

    if (street && city && region && postalCode && country && fullAddress) {
      const address: PersistedAuthUserAddress = {
        street,
        city,
        region,
        postalCode,
        country,
        fullAddress,
      };

      if (typeof sourceAddress.latitude === 'number' && Number.isFinite(sourceAddress.latitude)) {
        address.latitude = sourceAddress.latitude;
      }

      if (typeof sourceAddress.longitude === 'number' && Number.isFinite(sourceAddress.longitude)) {
        address.longitude = sourceAddress.longitude;
      }

      persistedUser.address = address;
    }
  }

  return persistedUser;
}

async function readLegacyEnvelope(rawValue: string): Promise<LegacyEnvelope<unknown> | null> {
  const decrypted = await decryptLegacyValue(rawValue);
  if (!decrypted) {
    return null;
  }

  const parsed = safeParseJson<unknown>(decrypted);
  return isLegacyEnvelope(parsed) ? parsed : null;
}

function clearLegacyPlaintextStorage(): void {
  LEGACY_PLAINTEXT_KEYS.forEach((key) => {
    safeRemove(localStorage, key);
    safeRemove(sessionStorage, key);
  });
}

// ============================================
// STORAGE CLASS
// ============================================

export class SecureStorage {
  private storage: Storage;
  private prefix: string;

  constructor(storageType: 'local' | 'session' = 'local') {
    this.storage = storageType === 'session' ? sessionStorage : localStorage;
    this.prefix = STORAGE_PREFIX;
  }

  async setItem(key: string, value: unknown): Promise<void> {
    safeSet(this.storage, this.prefix + key, JSON.stringify(buildStoredEnvelope(value)));
  }

  async getItem<T = unknown>(key: string, maxAgeMs?: number): Promise<T | null> {
    const storageKey = this.prefix + key;
    const rawValue = safeGet(this.storage, storageKey);

    if (!rawValue) {
      return null;
    }

    const parsedEnvelope = safeParseJson<unknown>(rawValue);
    if (isStoredEnvelope(parsedEnvelope)) {
      if (isExpired(parsedEnvelope.storedAt, maxAgeMs)) {
        this.removeItem(key);
        return null;
      }

      return parsedEnvelope.data as T;
    }

    const legacyEnvelope = await readLegacyEnvelope(rawValue);
    if (legacyEnvelope) {
      if (isExpired(legacyEnvelope.timestamp, maxAgeMs)) {
        this.removeItem(key);
        return null;
      }

      return legacyEnvelope.data as T;
    }

    this.removeItem(key);
    return null;
  }

  removeItem(key: string): void {
    safeRemove(this.storage, this.prefix + key);
  }

  clear(): void {
    const keysToRemove: string[] = [];
    try {
      for (let index = 0; index < this.storage.length; index += 1) {
        const key = this.storage.key(index);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
    } catch {
      return;
    }

    keysToRemove.forEach((key) => safeRemove(this.storage, key));
  }

  async hasItem(key: string, maxAgeMs?: number): Promise<boolean> {
    const value = await this.getItem(key, maxAgeMs);
    return value !== null;
  }
}

// ============================================
// SINGLETONS
// ============================================

export const secureLocalStorage = new SecureStorage('local');
export const secureSessionStorage = new SecureStorage('session');

// ============================================
// AUTH AND SESSION HELPERS
// ============================================

export async function setAuthToken(token: string): Promise<void> {
  if (!token) {
    secureSessionStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  await secureSessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return secureSessionStorage.getItem<string>(AUTH_TOKEN_KEY, TOKEN_MAX_AGE);
}

export function clearStoredRefreshToken(): void {
  secureSessionStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  secureLocalStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}

export async function setPersistentSessionPreference(enabled: boolean): Promise<void> {
  if (!enabled) {
    secureLocalStorage.removeItem(PERSISTENT_SESSION_PREFERENCE_KEY);
    return;
  }

  await secureLocalStorage.setItem(PERSISTENT_SESSION_PREFERENCE_KEY, true);
}

export async function getPersistentSessionPreference(): Promise<boolean> {
  return (await secureLocalStorage.getItem<boolean>(PERSISTENT_SESSION_PREFERENCE_KEY)) === true;
}

export async function getDeviceFingerprint(): Promise<string> {
  const storedFingerprint = normalizeDeviceFingerprint(
    await secureLocalStorage.getItem<string>(DEVICE_FINGERPRINT_KEY),
  );

  if (storedFingerprint) {
    return storedFingerprint;
  }

  const fingerprint = await createStableDeviceFingerprint();
  await secureLocalStorage.setItem(DEVICE_FINGERPRINT_KEY, fingerprint);

  return fingerprint;
}

export async function setAuthRefreshToken(
  token: string,
  options?: { persistAcrossSessions?: boolean },
): Promise<void> {
  if (!token) {
    clearStoredRefreshToken();
    return;
  }

  const persistAcrossSessions =
    options?.persistAcrossSessions ?? (await getPersistentSessionPreference());

  clearStoredRefreshToken();

  if (persistAcrossSessions) {
    await secureLocalStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
    return;
  }

  await secureSessionStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
}

export async function getAuthRefreshToken(): Promise<string | null> {
  const sessionToken = await secureSessionStorage.getItem<string>(
    AUTH_REFRESH_TOKEN_KEY,
    REFRESH_TOKEN_MAX_AGE,
  );

  if (sessionToken) {
    return sessionToken;
  }

  const localToken = await secureLocalStorage.getItem<string>(
    AUTH_REFRESH_TOKEN_KEY,
    REFRESH_TOKEN_MAX_AGE,
  );

  if (!localToken) {
    return null;
  }

  const hasPersistentSessionPreference = await getPersistentSessionPreference();

  if (!hasPersistentSessionPreference) {
    secureLocalStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    return null;
  }

  return localToken;
}

export async function setAuthUser(user: unknown): Promise<void> {
  const persistedUser = buildPersistedAuthUser(user);

  if (!persistedUser) {
    secureSessionStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  await secureSessionStorage.setItem(AUTH_USER_KEY, persistedUser);
}

export async function getAuthUser(): Promise<PersistedAuthUser | null> {
  const storedUser = await secureSessionStorage.getItem<unknown>(AUTH_USER_KEY);

  if (storedUser === null) {
    return null;
  }

  const persistedUser = buildPersistedAuthUser(storedUser);

  if (!persistedUser) {
    secureSessionStorage.removeItem(AUTH_USER_KEY);
    return null;
  }

  return persistedUser;
}

export async function createSession(): Promise<string> {
  const now = Date.now();
  const sessionState: PersistedSessionState = {
    id: generateSessionId(),
    createdAt: now,
    lastActivity: now,
  };

  await secureSessionStorage.setItem(SESSION_STATE_KEY, sessionState);
  return sessionState.id;
}

export async function getSessionState(): Promise<PersistedSessionState | null> {
  const sessionState = await secureSessionStorage.getItem<unknown>(SESSION_STATE_KEY);

  if (!isPersistedSessionState(sessionState)) {
    secureSessionStorage.removeItem(SESSION_STATE_KEY);
    return null;
  }

  return sessionState;
}

export async function touchSession(activityAt: number = Date.now()): Promise<void> {
  const currentSession = await getSessionState();
  if (!currentSession) {
    return;
  }

  await secureSessionStorage.setItem(SESSION_STATE_KEY, {
    ...currentSession,
    lastActivity: activityAt,
  });
}

export async function isSessionValid(): Promise<boolean> {
  const sessionState = await getSessionState();
  if (!sessionState) {
    return false;
  }

  if (Date.now() - sessionState.lastActivity >= SESSION_MAX_AGE) {
    secureSessionStorage.removeItem(SESSION_STATE_KEY);
    return false;
  }

  return true;
}

export function clearAuthData(): void {
  secureSessionStorage.clear();
  clearStoredRefreshToken();
  secureLocalStorage.removeItem(PERSISTENT_SESSION_PREFERENCE_KEY);
  clearLegacyPlaintextStorage();
}

export type { PersistedSessionState };
