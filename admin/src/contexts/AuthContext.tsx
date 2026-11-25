import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext
} from 'react';
import { auditLogger } from '../utils/audit-logger';
import {
  checkRateLimit,
  resetRateLimit,
  generateSecureId
} from '../utils/security';
import { env } from '../config/env';
import { authService } from '../services/auth.service';
import {
  clearStoredAdminSession,
  getStoredAdminSession,
  isStoredAdminSessionExpired,
  setStoredAdminSession
} from '../services/adminAuthStorage';
import type {
  AuthAddress,
  AuthUser,
  AuthUserRole,
  StoredAdminSession
} from '../types/auth.types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, serviceType?: string) => Promise<AuthUser>;
  logout: () => void;
  user: AuthUser | null;
  isAdmin: boolean;
  updateUserAddress: (address: AuthAddress) => void;
  sessionTimeRemaining: number;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

const defaultPatientAddress: AuthAddress = {
  street: '15 Rue de la Liberte',
  city: 'Tunis',
  region: 'Tunis',
  postalCode: '1000',
  country: 'Tunisie',
  latitude: 36.8065,
  longitude: 10.1815,
  fullAddress: '15 Rue de la Liberte, 1000 Tunis, Tunisie'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildMockSession(
  email: string,
  password: string,
  serviceType?: string
): StoredAdminSession {
  let role: AuthUserRole = 'patient';
  let name = email.split('@')[0];

  if (email === 'admin@gmail.com' && password === 'admin') {
    role = 'admin';
    name = 'Administrateur';
  } else if (serviceType || email.includes('provider') || email.includes('professional')) {
    role = 'provider';
  }

  const now = new Date().toISOString();

  return {
    token: `mock-token-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
    user: {
      id: generateSecureId(16),
      email,
      role,
      name,
      phone: '+216 98 123 456',
      serviceType,
      address: role === 'patient' ? defaultPatientAddress : undefined,
      createdAt: now,
      updatedAt: now
    }
  };
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(SESSION_TIMEOUT_MS);
  const [sessionId] = useState(() => generateSecureId(32));

  const applySession = useCallback((session: StoredAdminSession) => {
    setIsAuthenticated(true);
    setUser(session.user);
    setLastActivity(Date.now());
    setSessionTimeRemaining(SESSION_TIMEOUT_MS);
    auditLogger.setUserContext(session.user.id, session.user.role, sessionId);
  }, [sessionId]);

  const performLogout = useCallback(() => {
    auditLogger.log('AUTH_LOGOUT', 'User logged out', {
      severity: 'info'
    });
    auditLogger.clearUserContext();
    clearStoredAdminSession();
    setIsAuthenticated(false);
    setUser(null);
    setSessionTimeRemaining(SESSION_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      try {
        const storedSession = getStoredAdminSession();

        if (!storedSession) {
          return;
        }

        if (!isStoredAdminSessionExpired(storedSession)) {
          if (isMounted) {
            applySession(storedSession);
          }
          return;
        }

        if (storedSession.refreshToken) {
          const refreshedSession = await authService.refreshStoredSession(storedSession.refreshToken);
          if (isMounted) {
            applySession(refreshedSession);
          }
          return;
        }

        clearStoredAdminSession();
      } catch {
        clearStoredAdminSession();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleUnauthorized = () => {
      performLogout();
      setIsLoading(false);
    };

    hydrateSession();
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [applySession, performLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const checkTimeout = window.setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
      setSessionTimeRemaining(remaining);

      if (remaining <= 0) {
        auditLogger.log(
          'AUTH_SESSION_EXPIRED',
          'Session timed out due to inactivity',
          {
            severity: 'warning',
            details: {
              inactiveMs: elapsed
            }
          }
        );
        performLogout();
      }
    }, 10000);

    return () => window.clearInterval(checkTimeout);
  }, [isAuthenticated, lastActivity, performLogout]);

  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      setLastActivity(Date.now());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [handleActivity]);

  const login = useCallback(async (
    email: string,
    password: string,
    serviceType?: string
  ): Promise<AuthUser> => {
    if (!checkRateLimit('login_attempt', LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW)) {
      auditLogger.log('SECURITY_RATE_LIMITED', 'Login rate limit exceeded', {
        severity: 'warning',
        details: {
          email: `${email.split('@')[0]}@***`
        }
      });
      throw new Error('Trop de tentatives de connexion. Veuillez patienter 15 minutes.');
    }

    auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login attempt', {
      severity: 'info',
      details: {
        accountType: serviceType ? 'provider' : 'patient'
      }
    });

    try {
      const session = env.ENABLE_MOCK_DATA
        ? buildMockSession(email, password, serviceType)
        : await authService.loginWithPassword({
          email,
          password,
          rememberMe: true
        });

      const normalizedSession = serviceType && session.user.role !== 'admin'
        ? {
          ...session,
          user: {
            ...session.user,
            serviceType
          }
        }
        : session;

      setStoredAdminSession(normalizedSession);
      applySession(normalizedSession);
      resetRateLimit('login_attempt');

      auditLogger.log('AUTH_LOGIN_SUCCESS', 'User logged in successfully', {
        severity: 'info',
        details: {
          role: normalizedSession.user.role
        }
      });

      return normalizedSession.user;
    } catch (error) {
      auditLogger.log('AUTH_LOGIN_FAILURE', 'Login failed', {
        severity: 'warning',
        details: {
          email: `${email.split('@')[0]}@***`
        }
      });

      throw error instanceof Error
        ? error
        : new Error('Connexion impossible. Veuillez verifier vos identifiants.');
    }
  }, [applySession]);

  const updateUserAddress = useCallback((address: AuthAddress) => {
    if (!user) {
      return;
    }

    const nextUser = {
      ...user,
      address
    };

    setUser(nextUser);

    const storedSession = getStoredAdminSession();
    if (storedSession) {
      setStoredAdminSession({
        ...storedSession,
        user: nextUser
      });
    }

    auditLogger.log('DATA_MODIFICATION', 'User address updated', {
      severity: 'info',
      resource: 'user_address'
    });
  }, [user]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout: performLogout,
        user,
        isAdmin,
        updateUserAddress,
        sessionTimeRemaining
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
