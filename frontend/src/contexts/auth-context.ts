import { createContext, useContext } from 'react';

import type {
  AuthUser,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  RegisterUserRequestInput,
  UserAddress,
  VerifyLoginOtpRequest,
} from '@/features/auth/service';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    serviceType?: string,
    rememberMe?: boolean,
  ) => Promise<AuthUser>;
  requestLoginOtp: (
    request: Omit<RequestLoginOtpRequest, 'deviceFingerprint'>,
  ) => Promise<RequestLoginOtpResponse>;
  verifyLoginOtp: (
    request: Omit<VerifyLoginOtpRequest, 'deviceFingerprint'>,
    serviceType?: string,
  ) => Promise<AuthUser>;
  register: (request: RegisterUserRequestInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  user: AuthUser | null;
  isAdmin: boolean;
  updateUserAddress: (address: UserAddress) => void;
  saveProfileAddress: (address: UserAddress) => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
  isLoading: boolean;
  authError: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
