import type {
  AuthApiResponse,
  AuthUser,
  AuthUserRole,
  StoredAdminSession
} from '../types/auth.types';

function normalizeRole(role: string): AuthUserRole {
  if (role === 'admin' || role === 'provider' || role === 'patient' || role === 'professional') {
    return role;
  }

  return 'patient';
}

export function mapAuthUser(
  response: AuthApiResponse['user'],
  previousUser?: Partial<AuthUser>
): AuthUser {
  return {
    id: response.id,
    email: response.email,
    name: response.name,
    role: normalizeRole(response.role),
    phone: response.phone || previousUser?.phone,
    avatar: response.avatar || previousUser?.avatar,
    countryCode: response.countryCode || previousUser?.countryCode,
    createdAt: response.createdAt,
    updatedAt: previousUser?.updatedAt || response.createdAt,
    serviceType: previousUser?.serviceType,
    address: previousUser?.address
  };
}

export function buildStoredAdminSession(
  response: AuthApiResponse,
  previousUser?: Partial<AuthUser>
): StoredAdminSession {
  const expiresIn = Number.isFinite(response.expiresIn) && response.expiresIn > 0
    ? response.expiresIn
    : 3600;

  return {
    token: response.token,
    refreshToken: response.refreshToken || null,
    expiresAt: Date.now() + expiresIn * 1000,
    user: mapAuthUser(response.user, previousUser)
  };
}
