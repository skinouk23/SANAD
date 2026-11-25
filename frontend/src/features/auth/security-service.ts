/**
 * Auth Security Service
 * Handles account-security API calls (security overview, password change, account deletion, session revocation).
 */

import type { SilentErrorConfig } from '@/api/client';

import { api } from '@/api/client';
import {
  ChangePasswordRequestSchema,
  DeleteAccountRequestSchema,
  SecurityOverviewResponseSchema,
} from '@/features/auth/schema';

import type {
  ChangePasswordRequest,
  DeleteAccountRequest,
  SecurityOverviewResponse,
} from '@/features/auth/schema';

function createSilentMutationConfig(): SilentErrorConfig {
  return { _silentError: true };
}

/**
 * Get the current user's live security overview.
 */
export async function getSecurityOverview(): Promise<SecurityOverviewResponse> {
  const raw = await api.get<SecurityOverviewResponse>('/Auth/security');
  return SecurityOverviewResponseSchema.parse(raw);
}

/**
 * Change the current user's password.
 */
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  const request = ChangePasswordRequestSchema.parse(data);

  await api.post<Record<string, never>>(
    '/Auth/change-password',
    request,
    createSilentMutationConfig(),
  );
}

/**
 * Delete the current user's account after password confirmation.
 */
export async function deleteAccount(data: DeleteAccountRequest): Promise<void> {
  const request = DeleteAccountRequestSchema.parse(data);

  await api.post<Record<string, never>>(
    '/Auth/delete-account',
    request,
    createSilentMutationConfig(),
  );
}

/**
 * Revoke one non-current session owned by the current user.
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await api.delete<Record<string, never>>(
    `/Auth/sessions/${sessionId}`,
    createSilentMutationConfig(),
  );
}

/**
 * Revoke all other active sessions for the current user.
 */
export async function revokeOtherSessions(): Promise<void> {
  await api.post<Record<string, never>>(
    '/Auth/sessions/revoke-others',
    undefined,
    createSilentMutationConfig(),
  );
}

export const securityService = {
  getSecurityOverview,
  changePassword,
  deleteAccount,
  revokeSession,
  revokeOtherSessions,
};

export default securityService;
