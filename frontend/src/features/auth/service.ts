/**
 * Auth Service
 * Handles authentication API calls (login, register, refresh, profile).
 *
 * Mock data is provided by MSW handlers (src/mocks/handlers/auth.ts).
 * This module contains only real API calls — no inline mock branching.
 */

import { api } from '@/api/client';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutRequestSchema,
  RefreshTokenRequestSchema,
  RequestLoginOtpRequestSchema,
  RequestLoginOtpResponseSchema,
  RegistrationResponseSchema,
  VerifyLoginOtpRequestSchema,
  UserResponseSchema,
  parseRegisterUserRequest,
} from './schema';
import { parseSchemaOrThrow } from '@/shared/schemas/api.schema';
import { getDeviceFingerprint } from '@/utils/secure-storage';
import type { SupportedRuntimeRole } from './role-policy';
import type { SilentErrorConfig } from '@/api/client';

import type {
  LoginResponse,
  LoginUserResponse,
  LogoutRequest,
  ProviderRegistrationDocumentReference,
  RefreshTokenRequest,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  RegistrationResponse,
  RegisterUserRequest,
  RegisterUserRequestInput,
  UserResponse,
  VerifyLoginOtpRequest,
} from './schema';

// ============================================
// AUTH VIEW TYPES
// ============================================

export type UserRole = SupportedRuntimeRole;

export interface UserAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  fullAddress: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  backendRole: string;
  name: string;
  phone?: string;
  avatarFileId?: string;
  countryCode?: string;
  serviceType?: string;
  address?: UserAddress;
}

interface ToAuthUserInput {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatarFileId?: string | null;
  countryCode?: string | null;
}

interface ToAuthUserOptions {
  role: UserRole;
  backendRole: string;
  serviceType?: string;
  address?: UserAddress;
}

interface LogoutOptions extends LogoutRequest {
  accessToken?: string | null;
}

// ============================================
// AUTH USER MAPPER
// ============================================

/**
 * Extract an AuthUser view from a normalized auth candidate.
 * Used by AuthContext after the role policy accepts the backend role.
 */
export function toAuthUser(loginUser: ToAuthUserInput, options: ToAuthUserOptions): AuthUser {
  return {
    id: loginUser.id,
    email: loginUser.email ?? '',
    role: options.role,
    backendRole: options.backendRole,
    name: loginUser.name ?? '',
    phone: loginUser.phone ?? undefined,
    avatarFileId: loginUser.avatarFileId ?? undefined,
    countryCode: loginUser.countryCode ?? undefined,
    serviceType: options.serviceType,
    address: options.address,
  };
}

// ============================================
// CONSTANTS
// ============================================

export const DEFAULT_PATIENT_ADDRESS: UserAddress = {
  street: '15 Rue de la Liberté',
  city: 'Tunis',
  region: 'Tunis',
  postalCode: '1000',
  country: 'Tunisie',
  latitude: 36.8065,
  longitude: 10.1815,
  fullAddress: '15 Rue de la Liberté, 1000 Tunis, Tunisie',
};

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Login user with email and password.
 * In mock mode MSW intercepts this call and returns mock data.
 */
export async function login(
  credentials: { email: string; password: string; rememberMe?: boolean },
  serviceType?: string,
): Promise<LoginResponse> {
  const request = LoginRequestSchema.parse({
    ...credentials,
    deviceFingerprint: await getDeviceFingerprint(),
  });
  const config: SilentErrorConfig = {
    ...(serviceType ? { params: { serviceType } } : {}),
    _skipAuthRefresh: true,
  };
  const raw = await api.post<LoginResponse>('/Auth/login', request, config);
  return parseSchemaOrThrow(LoginResponseSchema, raw, 'auth.login');
}

/**
 * Request an email or SMS OTP for login.
 */
export async function requestLoginOtp(
  data: Omit<RequestLoginOtpRequest, 'deviceFingerprint'>,
): Promise<RequestLoginOtpResponse> {
  const request = RequestLoginOtpRequestSchema.parse({
    ...data,
    deviceFingerprint: await getDeviceFingerprint(),
  });
  const raw = await api.post<RequestLoginOtpResponse>('/Auth/login/otp/request', request, {
    _skipAuthRefresh: true,
  } as SilentErrorConfig);
  return parseSchemaOrThrow(RequestLoginOtpResponseSchema, raw, 'auth.requestLoginOtp');
}

/**
 * Verify a login OTP and receive the normal login response.
 */
export async function verifyLoginOtp(
  data: Omit<VerifyLoginOtpRequest, 'deviceFingerprint'>,
): Promise<LoginResponse> {
  const request = VerifyLoginOtpRequestSchema.parse({
    ...data,
    deviceFingerprint: await getDeviceFingerprint(),
  });
  const raw = await api.post<LoginResponse>('/Auth/login/otp/verify', request, {
    _skipAuthRefresh: true,
  } as SilentErrorConfig);
  return parseSchemaOrThrow(LoginResponseSchema, raw, 'auth.verifyLoginOtp');
}

/**
 * Register a new user.
 */
export async function register(data: RegisterUserRequestInput): Promise<RegistrationResponse> {
  const request = parseRegisterUserRequest({
    ...data,
    deviceFingerprint: await getDeviceFingerprint(),
  });
  const raw = await api.post<RegistrationResponse>('/Auth/register', request);
  return parseSchemaOrThrow(RegistrationResponseSchema, raw, 'auth.register');
}

/**
 * Refresh an expired access token.
 * Sends an empty body when the backend is using cookie-based refresh,
 * and falls back to a body refresh token when one is still persisted.
 */
export async function refreshToken(request?: RefreshTokenRequest): Promise<LoginResponse> {
  const payload = RefreshTokenRequestSchema.parse({
    ...(request ?? {}),
    deviceFingerprint: await getDeviceFingerprint(),
  });
  const raw = await api.post<LoginResponse>('/Auth/refresh-token', payload);
  return parseSchemaOrThrow(LoginResponseSchema, raw, 'auth.refreshToken');
}

/**
 * Revoke the current backend session when a token is still available.
 */
export async function logout(options: LogoutOptions = {}): Promise<void> {
  const { accessToken, ...requestOptions } = options;
  const payload = LogoutRequestSchema.parse(requestOptions);
  const config: SilentErrorConfig = {
    _silentError: true,
    _skipAuthRefresh: true,
    ...(accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {}),
  };

  await api.post<object>('/Auth/logout', payload, config);
}

/**
 * Get the current user's profile.
 */
export async function getProfile(): Promise<UserResponse> {
  const raw = await api.get<UserResponse>('/Auth/profile');
  return parseSchemaOrThrow(UserResponseSchema, raw, 'auth.getProfile');
}

// ============================================
// RE-EXPORTS
// ============================================

export type {
  LoginResponse,
  LoginUserResponse,
  LogoutRequest,
  ProviderRegistrationDocumentReference,
  RefreshTokenRequest,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  RegistrationResponse,
  RegisterUserRequest,
  RegisterUserRequestInput,
  UserResponse,
  VerifyLoginOtpRequest,
};

// ============================================
// SERVICE OBJECT (for barrel export)
// ============================================

export const authService = {
  login,
  logout,
  requestLoginOtp,
  register,
  refreshToken,
  verifyLoginOtp,
  getProfile,
  toAuthUser,
};

export default authService;
