/**
 * Auth Hooks
 *
 * TanStack Query wrappers for auth operations.
 * AuthContext remains the primary auth state manager;
 * these hooks are for components that need query-based access
 * to profile data or mutation wrappers for login/register.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authProfileOptions } from '@/features/auth/options';
import { authKeys } from '@/features/auth/keys';
import { login, register, refreshToken, toAuthUser } from '@/features/auth/service';
import type {
  RegisterUserRequestInput,
  RefreshTokenRequest,
  LoginResponse,
  RegistrationResponse,
} from '@/features/auth/schema';

/**
 * Fetch the current user's profile via React Query.
 * Enabled only when `isAuthenticated` is true (caller controls this).
 */
export function useProfile(enabled = true) {
  return useQuery({
    ...authProfileOptions(),
    enabled,
  });
}

/**
 * Login mutation — calls the auth service and returns tokens + user data.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<
    LoginResponse,
    Error,
    { email: string; password: string; rememberMe?: boolean; serviceType?: string }
  >({
    mutationFn: ({ email, password, rememberMe, serviceType }) =>
      login({ email, password, rememberMe }, serviceType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Registration mutation.
 */
export function useRegister() {
  return useMutation<RegistrationResponse, Error, RegisterUserRequestInput>({
    mutationFn: (data) => register(data),
  });
}

/**
 * Token refresh mutation.
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, RefreshTokenRequest | undefined>({
    mutationFn: (data) => refreshToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Re-export mapper for convenience
export { toAuthUser };
export { useUpdateAccountProfile } from './useUpdateAccountProfile';
export { useAvatarUpload } from './useAvatarUpload';
export {
  useAccountSecurity,
  useChangePassword,
  useDeleteAccount,
  useRevokeSession,
  useRevokeOtherSessions,
} from './useAccountSecurity';
