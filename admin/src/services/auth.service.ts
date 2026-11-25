import { api } from '../api/client';
import { buildStoredAdminSession } from './authSession';
import {
  clearStoredAdminSession,
  getStoredAdminSession,
  setStoredAdminSession
} from './adminAuthStorage';
import type { AuthApiResponse, StoredAdminSession } from '../types/auth.types';

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

async function persistSession(
  response: AuthApiResponse,
  existingSession?: StoredAdminSession | null
): Promise<StoredAdminSession> {
  const session = buildStoredAdminSession(response, existingSession?.user);
  setStoredAdminSession(session);
  return session;
}

export async function loginWithPassword(payload: LoginPayload): Promise<StoredAdminSession> {
  const response = await api.post<AuthApiResponse>('/auth/login', {
    email: payload.email,
    password: payload.password,
    rememberMe: payload.rememberMe ?? true
  });

  return persistSession(response, getStoredAdminSession());
}

export async function refreshStoredSession(
  refreshToken?: string | null
): Promise<StoredAdminSession> {
  const currentSession = getStoredAdminSession();
  const response = await api.post<AuthApiResponse>('/auth/refresh-token', {
    refreshToken: refreshToken || currentSession?.refreshToken || ''
  });

  return persistSession(response, currentSession);
}

export function logoutFromSession(): void {
  clearStoredAdminSession();
}

export const authService = {
  loginWithPassword,
  refreshStoredSession,
  logoutFromSession
};
