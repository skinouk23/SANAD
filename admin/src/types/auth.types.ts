export type AuthUserRole = 'patient' | 'provider' | 'admin' | 'professional';

export interface AuthAddress {
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
  name: string;
  role: AuthUserRole;
  phone?: string;
  avatar?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
  serviceType?: string;
  address?: AuthAddress;
}

export interface AuthApiUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  avatar?: string | null;
  countryCode?: string | null;
  createdAt: string;
}

export interface AuthApiResponse {
  user: AuthApiUserResponse;
  token: string;
  refreshToken?: string | null;
  expiresIn: number;
}

export interface StoredAdminSession {
  token: string;
  refreshToken?: string | null;
  expiresAt: number;
  user: AuthUser;
}
