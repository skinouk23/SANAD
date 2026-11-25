import type { StoredAdminSession } from '../types/auth.types';

const ADMIN_AUTH_TOKEN_KEY = 'sanad.admin.auth.token';
const ADMIN_AUTH_REFRESH_TOKEN_KEY = 'sanad.admin.auth.refreshToken';
const ADMIN_AUTH_USER_KEY = 'sanad.admin.auth.user';
const ADMIN_AUTH_EXPIRES_AT_KEY = 'sanad.admin.auth.expiresAt';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getStoredAdminSession(): StoredAdminSession | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
    const refreshToken = localStorage.getItem(ADMIN_AUTH_REFRESH_TOKEN_KEY);
    const userRaw = localStorage.getItem(ADMIN_AUTH_USER_KEY);
    const expiresAtRaw = localStorage.getItem(ADMIN_AUTH_EXPIRES_AT_KEY);

    if (!token || !userRaw || !expiresAtRaw) {
      return null;
    }

    return {
      token,
      refreshToken,
      user: JSON.parse(userRaw) as StoredAdminSession['user'],
      expiresAt: Number(expiresAtRaw)
    };
  } catch {
    return null;
  }
}

export function setStoredAdminSession(session: StoredAdminSession): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, session.token);
  if (session.refreshToken) {
    localStorage.setItem(ADMIN_AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    localStorage.removeItem(ADMIN_AUTH_REFRESH_TOKEN_KEY);
  }
  localStorage.setItem(ADMIN_AUTH_USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(ADMIN_AUTH_EXPIRES_AT_KEY, String(session.expiresAt));
}

export function clearStoredAdminSession(): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_AUTH_USER_KEY);
  localStorage.removeItem(ADMIN_AUTH_EXPIRES_AT_KEY);

  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
}

export function getAdminAccessToken(): string | null {
  return getStoredAdminSession()?.token || null;
}

export function getAdminRefreshToken(): string | null {
  return getStoredAdminSession()?.refreshToken || null;
}

export function isStoredAdminSessionExpired(session: StoredAdminSession): boolean {
  return session.expiresAt <= Date.now();
}
