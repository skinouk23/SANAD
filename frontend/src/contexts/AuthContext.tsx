import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { AuthContext } from '@/contexts/auth-context';
import { auditLogger } from '@/utils/audit-logger';
import { checkRateLimit, resetRateLimit } from '@/utils/security';
import {
  buildDeviceRefreshTokenRequest,
  clearPersistedAuthSession,
  getStoredRefreshToken,
  persistAuthSession,
  persistAuthUser,
  restoreAuthSession,
  shouldAttemptSessionRefreshRestore,
  touchPersistedSession,
} from '@/shared/lib/http/auth-session';
import {
  login as authLogin,
  logout as authLogout,
  requestLoginOtp as authRequestLoginOtp,
  register as authRegister,
  refreshToken as authRefreshToken,
  verifyLoginOtp as authVerifyLoginOtp,
  getProfile as authGetProfile,
  toAuthUser,
  DEFAULT_PATIENT_ADDRESS,
} from '@/features/auth/service';
import { UpdatePatientProfileRequestSchema } from '@/features/family-circle/schema';
import { resolveRolePolicy } from '@/features/auth/role-policy';
import { parseRegisterUserRequest } from '@/features/auth/schema';
import { providerKeys } from '@/features/providers/keys';
import { UpdateMyProviderProfileRequestSchema } from '@/features/providers/schema';
import { updateMyProviderProfile } from '@/features/providers/service';
import { usersKeys } from '@/features/users/keys';
import { updateCurrentPatient } from '@/features/users/service';
import { getTokenCache, setTokenCache } from '@/api/client';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';
import { queryClient } from '@/shared/lib/query/client';
import type {
  AuthUser,
  UserRole,
  UserAddress,
  LoginResponse,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  RegisterUserRequestInput,
  VerifyLoginOtpRequest,
} from '@/features/auth/service';
import type { ApiError } from '@/shared/schemas';

export type { AuthUser, UserRole, UserAddress };
// eslint-disable-next-line react-refresh/only-export-components
export { useAuth } from '@/contexts/auth-context';

const UNSUPPORTED_ROLE_ERROR = "Ce compte n'est pas pris en charge dans cette application.";

type AuthRoleDecisionSource =
  | 'login'
  | 'register'
  | 'session_restore'
  | 'profile_refresh'
  | 'refresh_restore';

interface AuthUserCandidate {
  id: string;
  email: string;
  name: string;
  rawRole: unknown;
  phone?: string | null;
  avatarFileId?: string | null;
  countryCode?: string | null;
  serviceType?: string;
  address?: UserAddress;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const ACTIVITY_PERSIST_INTERVAL_MS = 15 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const lastActivityRef = useRef(Date.now());
  const sessionTimeRemainingRef = useRef(SESSION_TIMEOUT_MS);
  const lastPersistedActivityRef = useRef(0);
  const pendingActivityPersistRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const applyAuthenticatedState = useCallback(
    async (response: LoginResponse, authUser: AuthUser, rememberMe: boolean) => {
      queryClient.clear();

      const { sessionId, activityAt } = await persistAuthSession({
        token: response.token,
        refreshToken: response.refreshToken,
        user: authUser,
        rememberMe,
      });

      lastActivityRef.current = activityAt;
      lastPersistedActivityRef.current = activityAt;
      pendingActivityPersistRef.current = null;
      setTokenCache(response.token ?? '');
      setIsAuthenticated(true);
      setUser(authUser);
      setAuthError(null);
      auditLogger.setUserContext(authUser.id, authUser.role, sessionId);
      runtimeDiagnostics.setActorContext({
        userId: authUser.id,
        role: authUser.role,
        sessionId,
      });
    },
    [],
  );

  const performLogout = useCallback(() => {
    queryClient.clear();
    auditLogger.log('AUTH_LOGOUT', 'User logged out', { severity: 'info' });
    auditLogger.clearUserContext();
    runtimeDiagnostics.clearActorContext();
    setTokenCache(null);
    setIsAuthenticated(false);
    setUser(null);
    setAuthError(null);
    lastActivityRef.current = Date.now();
    lastPersistedActivityRef.current = 0;
    pendingActivityPersistRef.current = null;
    sessionTimeRemainingRef.current = SESSION_TIMEOUT_MS;
    clearPersistedAuthSession();
  }, []);

  const rejectUnsupportedRole = useCallback(
    (candidate: AuthUserCandidate, source: AuthRoleDecisionSource) => {
      const policy = resolveRolePolicy(candidate.rawRole);

      auditLogger.log('SECURITY_SUSPICIOUS_ACTIVITY', 'Unsupported role rejected in public SPA', {
        severity: 'warning',
        resource: 'auth',
        details: {
          source,
          userId: candidate.id,
          email: candidate.email,
          rawRole: policy.rawRole,
          normalizedRole: policy.normalizedRole,
          isKnownRole: policy.isKnownRole,
          isSupportedInSpa: policy.isSupportedInSpa,
          capabilityBucket: policy.capabilityBucket,
          defaultRoute: policy.defaultRoute,
          rejectionReason: policy.rejectionReason,
        },
      });

      performLogout();
      setAuthError(UNSUPPORTED_ROLE_ERROR);
    },
    [performLogout],
  );

  const normalizeAuthCandidate = useCallback((candidate: AuthUserCandidate) => {
    const policy = resolveRolePolicy(candidate.rawRole);

    if (!policy.isSupportedInSpa || !policy.normalizedRole) {
      return {
        ok: false as const,
        policy,
      };
    }

    return {
      ok: true as const,
      policy,
      user: toAuthUser(
        {
          id: candidate.id,
          email: candidate.email,
          name: candidate.name,
          phone: candidate.phone,
          avatarFileId: candidate.avatarFileId,
          countryCode: candidate.countryCode,
        },
        {
          role: policy.normalizedRole,
          backendRole: policy.rawRole,
          serviceType: candidate.serviceType,
          address: candidate.address,
        },
      ),
    };
  }, []);

  const buildAuthUserCandidateFromProfile = useCallback(
    (
      profile: Awaited<ReturnType<typeof authGetProfile>>,
      currentUser?: AuthUser | null,
    ): AuthUserCandidate => {
      const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
      const avatarFileId =
        profile.avatarFileId === undefined ? currentUser?.avatarFileId : profile.avatarFileId;

      return {
        id: profile.id,
        email: profile.email ?? '',
        name: fullName || profile.email || '',
        rawRole: profile.role,
        phone: profile.phoneNumber ?? undefined,
        avatarFileId,
        countryCode: currentUser?.countryCode,
        serviceType: currentUser?.serviceType,
        address: currentUser?.address ?? DEFAULT_PATIENT_ADDRESS,
      };
    },
    [],
  );

  const handleMalformedAuthPayload = useCallback(
    (source: Extract<AuthRoleDecisionSource, 'profile_refresh' | 'refresh_restore'>) => {
      auditLogger.log('SECURITY_SUSPICIOUS_ACTIVITY', 'Malformed auth payload rejected', {
        severity: 'warning',
        resource: 'auth',
        details: {
          source,
          rejectionReason: 'invalid_role',
        },
      });

      performLogout();
    },
    [performLogout],
  );

  const syncActivity = useCallback(
    (activityAt: number, options?: { persist?: boolean }) => {
      lastActivityRef.current = activityAt;

      if (!isAuthenticated || options?.persist === false) {
        return;
      }

      pendingActivityPersistRef.current = activityAt;
    },
    [isAuthenticated],
  );

  const persistPendingActivity = useCallback(
    (options?: { force?: boolean }) => {
      if (!isAuthenticated) {
        pendingActivityPersistRef.current = null;
        return;
      }

      const activityAt = pendingActivityPersistRef.current;

      if (activityAt === null) {
        return;
      }

      if (
        !options?.force &&
        activityAt - lastPersistedActivityRef.current < ACTIVITY_PERSIST_INTERVAL_MS
      ) {
        return;
      }

      pendingActivityPersistRef.current = null;
      lastPersistedActivityRef.current = activityAt;
      void touchPersistedSession(activityAt);
    },
    [isAuthenticated],
  );

  useEffect(() => {
    async function restoreSession() {
      try {
        const restored = await restoreAuthSession();

        if (restored.token && restored.user) {
          if (!(restored.sessionState && restored.hasValidSession)) {
            performLogout();
            return;
          }

          const restoredUserResult = normalizeAuthCandidate({
            id: restored.user.id,
            email: restored.user.email,
            name: restored.user.name,
            rawRole: restored.user.backendRole,
            phone: restored.user.phone,
            avatarFileId: restored.user.avatarFileId,
            countryCode: restored.user.countryCode,
            serviceType: restored.user.serviceType,
            address: restored.user.address,
          });

          if (!restoredUserResult.ok) {
            rejectUnsupportedRole(
              {
                id: restored.user.id,
                email: restored.user.email,
                name: restored.user.name,
                rawRole: restored.user.backendRole,
              },
              'session_restore',
            );
            return;
          }

          const restoredUser = restoredUserResult.user;
          const restoredSession = restored.sessionState;

          lastActivityRef.current = restoredSession.lastActivity;
          lastPersistedActivityRef.current = restoredSession.lastActivity;
          pendingActivityPersistRef.current = null;
          setTokenCache(restored.token);
          setIsAuthenticated(true);
          setUser(restoredUser);
          setAuthError(null);
          auditLogger.setUserContext(restoredUser.id, restoredUser.role, restoredSession.id);
          runtimeDiagnostics.setActorContext({
            userId: restoredUser.id,
            role: restoredUser.role,
            sessionId: restoredSession.id,
          });

          void authGetProfile()
            .then((profile) => {
              const profileCandidate = buildAuthUserCandidateFromProfile(profile, restoredUser);
              const freshUserResult = normalizeAuthCandidate(profileCandidate);

              if (!freshUserResult.ok) {
                rejectUnsupportedRole(profileCandidate, 'profile_refresh');
                return;
              }

              const freshUser = {
                ...restoredUser,
                ...freshUserResult.user,
              };

              setUser(freshUser);
              void persistAuthUser(freshUser);
            })
            .catch((error: unknown) => {
              if (error instanceof ZodError) {
                handleMalformedAuthPayload('profile_refresh');
              }
            });

          return;
        }

        if (await shouldAttemptSessionRefreshRestore()) {
          const refreshRequest = await buildDeviceRefreshTokenRequest(restored.refreshToken);
          const response = await authRefreshToken(refreshRequest);
          setTokenCache(response.token ?? '');
          const profile = await authGetProfile();
          const authUserCandidate = buildAuthUserCandidateFromProfile(profile);
          const authUserResult = normalizeAuthCandidate(authUserCandidate);

          if (!authUserResult.ok) {
            rejectUnsupportedRole(authUserCandidate, 'refresh_restore');
            return;
          }

          await applyAuthenticatedState(
            response,
            authUserResult.user,
            restored.hasPersistentSessionPreference,
          );

          return;
        }

        if (restored.token || restored.user || restored.sessionState) {
          performLogout();
        }
      } catch (error) {
        if (error instanceof ZodError) {
          handleMalformedAuthPayload('refresh_restore');
          return;
        }

        performLogout();
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, [
    applyAuthenticatedState,
    buildAuthUserCandidateFromProfile,
    handleMalformedAuthPayload,
    normalizeAuthCandidate,
    performLogout,
    rejectUnsupportedRole,
  ]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthError('Session expiree. Veuillez vous reconnecter.');
      performLogout();
    };

    const handleForbidden = () => {
      setAuthError('Acces non autorise.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:forbidden', handleForbidden);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:forbidden', handleForbidden);
    };
  }, [performLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTimeout = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
      sessionTimeRemainingRef.current = remaining;

      if (remaining <= 0) {
        auditLogger.log('AUTH_SESSION_EXPIRED', 'Session timed out due to inactivity', {
          severity: 'warning',
          details: { inactiveMs: elapsed },
        });
        performLogout();
        return;
      }

      persistPendingActivity();
    }, 10000);

    return () => clearInterval(checkTimeout);
  }, [isAuthenticated, performLogout, persistPendingActivity]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistPendingActivity({ force: true });
      }
    };

    const handlePageHide = () => {
      persistPendingActivity({ force: true });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [isAuthenticated, persistPendingActivity]);

  const handleActivity = useCallback(() => {
    syncActivity(Date.now());
  }, [syncActivity]);

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [handleActivity]);

  const login = useCallback(
    async (email: string, password: string, serviceType?: string, rememberMe: boolean = false) => {
      if (!checkRateLimit('login_attempt', LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW)) {
        auditLogger.log('SECURITY_RATE_LIMITED', 'Login rate limit exceeded', {
          severity: 'warning',
          details: { email: email.split('@')[0] + '@***' },
        });
        throw new Error('Trop de tentatives de connexion. Veuillez patienter 15 minutes.');
      }

      setAuthError(null);

      auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login attempt', {
        severity: 'info',
        details: {
          accountType: serviceType ? 'provider' : 'patient',
          rememberMe,
        },
      });

      try {
        const response: LoginResponse = await authLogin(
          { email, password, rememberMe },
          serviceType,
        );
        const authUserCandidate: AuthUserCandidate = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          rawRole: response.user.role,
          phone: response.user.phone,
          avatarFileId: response.user.avatarFileId,
          countryCode: response.user.countryCode,
          serviceType,
        };
        const authUserResult = normalizeAuthCandidate(authUserCandidate);

        if (!authUserResult.ok) {
          rejectUnsupportedRole(authUserCandidate, 'login');
          throw new Error(UNSUPPORTED_ROLE_ERROR);
        }

        const authUser = authUserResult.user;

        await applyAuthenticatedState(response, authUser, rememberMe);

        auditLogger.log('AUTH_LOGIN_SUCCESS', 'User logged in successfully', {
          severity: 'info',
          details: { role: authUser.role },
        });

        resetRateLimit('login_attempt');

        return authUser;
      } catch (error) {
        const message =
          (error as ApiError)?.message ||
          (error instanceof Error ? error.message : 'Erreur de connexion');

        setAuthError(message);
        auditLogger.log('AUTH_LOGIN_FAILURE', 'Login attempt failed', {
          severity: 'warning',
          details: {
            email: email.split('@')[0] + '@***',
            message,
          },
        });
        throw new Error(message);
      }
    },
    [applyAuthenticatedState, normalizeAuthCandidate, rejectUnsupportedRole],
  );

  const requestLoginOtp = useCallback(
    async (
      request: Omit<RequestLoginOtpRequest, 'deviceFingerprint'>,
    ): Promise<RequestLoginOtpResponse> => {
      if (!checkRateLimit('login_otp_request', LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW)) {
        auditLogger.log('SECURITY_RATE_LIMITED', 'Login OTP request rate limit exceeded', {
          severity: 'warning',
          details: { channel: request.channel },
        });
        throw new Error('Trop de tentatives de connexion. Veuillez patienter 15 minutes.');
      }

      setAuthError(null);

      auditLogger.log('AUTH_LOGIN_ATTEMPT', 'Login OTP requested', {
        severity: 'info',
        details: {
          channel: request.channel,
          rememberMe: request.rememberMe ?? false,
        },
      });

      try {
        return await authRequestLoginOtp(request);
      } catch (error) {
        const message =
          (error as ApiError)?.message ||
          (error instanceof Error ? error.message : 'Erreur de connexion');

        setAuthError(message);
        auditLogger.log('AUTH_LOGIN_FAILURE', 'Login OTP request failed', {
          severity: 'warning',
          details: { message },
        });
        throw new Error(message);
      }
    },
    [],
  );

  const verifyLoginOtp = useCallback(
    async (
      request: Omit<VerifyLoginOtpRequest, 'deviceFingerprint'>,
      serviceType?: string,
    ): Promise<AuthUser> => {
      if (!checkRateLimit('login_otp_verify', LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW)) {
        auditLogger.log('SECURITY_RATE_LIMITED', 'Login OTP verify rate limit exceeded', {
          severity: 'warning',
        });
        throw new Error('Trop de tentatives de connexion. Veuillez patienter 15 minutes.');
      }

      setAuthError(null);

      try {
        const response = await authVerifyLoginOtp(request);
        const authUserCandidate: AuthUserCandidate = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          rawRole: response.user.role,
          phone: response.user.phone,
          avatarFileId: response.user.avatarFileId,
          countryCode: response.user.countryCode,
          serviceType,
        };
        const authUserResult = normalizeAuthCandidate(authUserCandidate);

        if (!authUserResult.ok) {
          rejectUnsupportedRole(authUserCandidate, 'login');
          throw new Error(UNSUPPORTED_ROLE_ERROR);
        }

        const authUser = authUserResult.user;

        await applyAuthenticatedState(response, authUser, request.rememberMe ?? false);

        auditLogger.log('AUTH_LOGIN_SUCCESS', 'User logged in successfully with OTP', {
          severity: 'info',
          details: { role: authUser.role },
        });

        resetRateLimit('login_otp_request');
        resetRateLimit('login_otp_verify');

        return authUser;
      } catch (error) {
        const message =
          (error as ApiError)?.message ||
          (error instanceof Error ? error.message : 'Erreur de connexion');

        setAuthError(message);
        auditLogger.log('AUTH_LOGIN_FAILURE', 'Login OTP verification failed', {
          severity: 'warning',
          details: { message },
        });
        throw new Error(message);
      }
    },
    [applyAuthenticatedState, normalizeAuthCandidate, rejectUnsupportedRole],
  );

  const register = useCallback(
    async (request: RegisterUserRequestInput) => {
      setAuthError(null);

      try {
        const normalizedRequest = parseRegisterUserRequest(request);
        const response = await authRegister(normalizedRequest);
        const authUserCandidate: AuthUserCandidate = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          rawRole: response.user.role,
          phone: response.user.phone,
          avatarFileId: response.user.avatarFileId,
          countryCode: response.user.countryCode,
          serviceType: normalizedRequest.serviceType ?? undefined,
        };
        const authUserResult = normalizeAuthCandidate(authUserCandidate);

        if (!authUserResult.ok) {
          rejectUnsupportedRole(authUserCandidate, 'register');
          throw new Error(UNSUPPORTED_ROLE_ERROR);
        }

        const authUser = authUserResult.user;

        if (!response.token) {
          throw new Error("La réponse d'inscription ne contient pas de session active.");
        }

        await applyAuthenticatedState(response as LoginResponse, authUser, false);

        auditLogger.log('AUTH_LOGIN_SUCCESS', 'User registered successfully', {
          severity: 'info',
          details: { role: authUser.role },
        });

        return authUser;
      } catch (error) {
        const message =
          (error as ApiError)?.message ||
          (error instanceof Error ? error.message : "Erreur d'inscription");

        setAuthError(message);
        auditLogger.log('AUTH_LOGIN_FAILURE', 'Registration failed', {
          severity: 'warning',
          details: {
            role: request.role,
            message,
          },
        });
        throw new Error(message);
      }
    },
    [applyAuthenticatedState, normalizeAuthCandidate, rejectUnsupportedRole],
  );

  const logout = useCallback(async () => {
    const accessToken = getTokenCache();
    const refreshToken = await getStoredRefreshToken();

    performLogout();

    try {
      await authLogout({
        accessToken,
        refreshToken: refreshToken ?? undefined,
      });
    } catch (error) {
      auditLogger.log('AUTH_LOGOUT', 'Backend logout revocation failed', {
        severity: 'warning',
        resource: 'auth',
        details: {
          message: error instanceof Error ? error.message : 'Unknown logout revocation error',
        },
      });
    }
  }, [performLogout]);

  const updateUserAddress = useCallback(
    (address: UserAddress) => {
      if (user) {
        const updatedUser = { ...user, address };
        setUser(updatedUser);
        void persistAuthUser(updatedUser);
        auditLogger.log('DATA_MODIFICATION', 'User address updated', {
          severity: 'info',
          resource: 'user_address',
        });
      }
    },
    [user],
  );

  const saveProfileAddress = useCallback(
    async (address: UserAddress) => {
      if (!user) {
        throw new Error('No authenticated user is available.');
      }

      const profilePatch = {
        address: address.street || address.fullAddress,
        city: address.city || null,
        postalCode: address.postalCode || null,
        latitude: address.latitude,
        longitude: address.longitude,
      };

      if (user.role === 'patient') {
        const updatedProfile = await updateCurrentPatient(
          UpdatePatientProfileRequestSchema.parse(profilePatch),
        );

        if (updatedProfile) {
          queryClient.setQueryData(usersKeys.currentPatient(), updatedProfile);
        }

        updateUserAddress(address);
        await queryClient.invalidateQueries({ queryKey: usersKeys.currentPatient() });
        return;
      }

      const updatedProfile = await updateMyProviderProfile(
        UpdateMyProviderProfileRequestSchema.parse(profilePatch),
      );

      queryClient.setQueryData(providerKeys.profile(), updatedProfile);
      updateUserAddress(address);
      await queryClient.invalidateQueries({ queryKey: providerKeys.profile() });
    },
    [updateUserAddress, user],
  );

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = { ...currentUser, ...patch };
      void persistAuthUser(updatedUser);
      return updatedUser;
    });
  }, []);

  const isAdmin = user?.backendRole === 'admin' || user?.backendRole === 'super_admin';

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      requestLoginOtp,
      verifyLoginOtp,
      register,
      logout,
      user,
      isAdmin,
      updateUserAddress,
      saveProfileAddress,
      updateUser,
      isLoading,
      authError,
    }),
    [
      isAuthenticated,
      login,
      requestLoginOtp,
      verifyLoginOtp,
      register,
      logout,
      user,
      isAdmin,
      updateUserAddress,
      saveProfileAddress,
      updateUser,
      isLoading,
      authError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
