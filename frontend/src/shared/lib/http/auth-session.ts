import {
  clearAuthData,
  clearStoredRefreshToken,
  createSession,
  getAuthRefreshToken,
  getAuthToken,
  getAuthUser,
  getDeviceFingerprint,
  getPersistentSessionPreference,
  getSessionState,
  isSessionValid,
  setAuthRefreshToken,
  setAuthToken,
  setAuthUser,
  setPersistentSessionPreference,
  touchSession,
} from '@/utils/secure-storage';

import type { PersistedAuthUser, PersistedSessionState } from '@/utils/secure-storage';

export interface PersistAuthSessionInput {
  token: string | null | undefined;
  refreshToken?: string | null;
  user: PersistedAuthUser;
  rememberMe?: boolean;
}

export interface PersistAuthSessionResult {
  sessionId: string;
  activityAt: number;
}

export interface RestoredAuthSession {
  token: string | null;
  refreshToken: string | null;
  user: PersistedAuthUser | null;
  sessionState: PersistedSessionState | null;
  hasPersistentSessionPreference: boolean;
  hasValidSession: boolean;
}

export function buildRefreshTokenRequest(
  refreshToken: string | null,
): { refreshToken?: string; deviceFingerprint?: string } | undefined {
  if (!refreshToken) {
    return undefined;
  }

  return { refreshToken };
}

export async function buildDeviceRefreshTokenRequest(
  refreshToken: string | null,
): Promise<{ refreshToken?: string; deviceFingerprint: string }> {
  return {
    ...(refreshToken ? { refreshToken } : {}),
    deviceFingerprint: await getDeviceFingerprint(),
  };
}

export async function persistAuthSession({
  token,
  refreshToken,
  user,
  rememberMe = false,
}: PersistAuthSessionInput): Promise<PersistAuthSessionResult> {
  const activityAt = Date.now();

  clearAuthData();
  await setPersistentSessionPreference(rememberMe);

  const sessionId = await createSession();
  await setAuthToken(token ?? '');
  await setAuthUser(user);

  if (refreshToken) {
    await setAuthRefreshToken(refreshToken, { persistAcrossSessions: rememberMe });
  } else {
    clearStoredRefreshToken();
  }

  return {
    sessionId,
    activityAt,
  };
}

export async function persistRefreshedAuthSession(response: {
  token?: string | null;
  refreshToken?: string | null;
}): Promise<void> {
  if (typeof response.token === 'string') {
    await setAuthToken(response.token);
  }

  if (typeof response.refreshToken === 'string' && response.refreshToken.length > 0) {
    await setAuthRefreshToken(response.refreshToken);
  }
}

export async function restoreAuthSession(): Promise<RestoredAuthSession> {
  const [token, user, refreshToken, sessionState, hasPersistentSessionPreference] =
    await Promise.all([
      getAuthToken(),
      getAuthUser(),
      getAuthRefreshToken(),
      getSessionState(),
      getPersistentSessionPreference(),
    ]);

  const hasValidSession = sessionState ? await isSessionValid() : false;

  return {
    token,
    refreshToken,
    user,
    sessionState,
    hasPersistentSessionPreference,
    hasValidSession,
  };
}

export async function shouldAttemptSessionRefreshRestore(): Promise<boolean> {
  const [refreshToken, hasPersistentSessionPreference] = await Promise.all([
    getAuthRefreshToken(),
    getPersistentSessionPreference(),
  ]);

  return Boolean(refreshToken || hasPersistentSessionPreference);
}

export async function persistAuthUser(user: PersistedAuthUser): Promise<void> {
  await setAuthUser(user);
}

export async function touchPersistedSession(activityAt: number = Date.now()): Promise<void> {
  await touchSession(activityAt);
}

export function clearPersistedAuthSession(): void {
  clearAuthData();
}

export async function getStoredRefreshToken(): Promise<string | null> {
  return getAuthRefreshToken();
}
