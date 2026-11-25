/**
 * Auth MSW Handlers
 *
 * Intercepts /api/v1/Auth/* requests during development.
 * Replaces the inline `if (env.ENABLE_MOCK_DATA)` branching in auth/service.ts.
 *
 * All responses are wrapped in the ApiResponse shape per K003:
 *   { data: T, status: 'success', message: null }
 */

import { http, HttpResponse, delay } from 'msw';
import {
  ChangePasswordRequestSchema,
  DeleteAccountRequestSchema,
  parseRegisterUserRequest,
} from '@/features/auth/schema';
import {
  getAuthProfile,
  setCurrentMockPatientContext,
  updateAuthAccount,
} from '@/mocks/handlers/patientProfileStore';
import {
  getProviderAuthProfile,
  setCurrentMockProviderContext,
  updateProviderAuthAccount,
} from '@/mocks/handlers/providerAuthoringStore';
import { apiNotFound, apiOk } from '@/mocks/utils';

import type { UpdateAccountProfileRequest } from '@/features/auth/account-service';
import type { SecurityOverviewResponse, SessionSummary } from '@/features/auth/schema';

// ============================================
// HELPERS
// ============================================

type MockRole = 'patient' | 'provider' | 'admin';

interface AuthDeviceRequestBody {
  deviceFingerprint?: unknown;
}

interface LoginRequestBody extends AuthDeviceRequestBody {
  email: string;
  password: string;
}

interface RequestLoginOtpRequestBody extends AuthDeviceRequestBody {
  channel?: unknown;
  email?: unknown;
  phoneNumber?: unknown;
}

interface VerifyLoginOtpRequestBody extends AuthDeviceRequestBody {
  challengeId?: unknown;
  code?: unknown;
  rememberMe?: unknown;
}

interface MockOtpChallenge {
  channel: 'email' | 'sms';
  email: string;
  role: MockRole;
  deviceFingerprint: string | null;
  expiresAt: number;
}

let currentMockRole: MockRole = 'patient';
const otpChallenges = new Map<string, MockOtpChallenge>();

function secureId(length = 16): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function cloneSessionSummary(session: SessionSummary): SessionSummary {
  return { ...session };
}

function cloneSecurityOverview(overview: SecurityOverviewResponse): SecurityOverviewResponse {
  return {
    ...overview,
    sessions: overview.sessions.map(cloneSessionSummary),
  };
}

function createSessionSummary(
  id: string,
  data: {
    ipAddress: string | null;
    deviceType: string | null;
    displayName: string | null;
    browserName: string | null;
    operatingSystem: string | null;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
  },
): SessionSummary {
  return {
    id,
    ipAddress: data.ipAddress,
    deviceType: data.deviceType,
    displayName: data.displayName,
    browserName: data.browserName,
    operatingSystem: data.operatingSystem,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    isCurrent: data.isCurrent,
  };
}

function createInitialSecurityState(): Record<MockRole, SecurityOverviewResponse> {
  return {
    patient: {
      twoFactorEnabled: false,
      passwordChangedAt: '2026-03-15T09:30:00Z',
      sessions: [
        createSessionSummary('11111111-1111-1111-1111-111111111111', {
          ipAddress: '197.0.0.21',
          deviceType: 'Chrome on Windows',
          displayName: 'Chrome on Windows',
          browserName: 'Chrome',
          operatingSystem: 'Windows',
          createdAt: '2026-04-14T18:00:00Z',
          expiresAt: '2026-04-15T18:00:00Z',
          isCurrent: true,
        }),
        createSessionSummary('22222222-2222-2222-2222-222222222222', {
          ipAddress: '197.1.1.44',
          deviceType: 'Safari on iPhone',
          displayName: 'Safari on iPhone',
          browserName: 'Safari',
          operatingSystem: 'iPhone',
          createdAt: '2026-04-13T08:30:00Z',
          expiresAt: '2026-04-20T08:30:00Z',
          isCurrent: false,
        }),
      ],
    },
    provider: {
      twoFactorEnabled: true,
      passwordChangedAt: '2026-04-01T10:45:00Z',
      sessions: [
        createSessionSummary('33333333-3333-3333-3333-333333333333', {
          ipAddress: '41.226.12.77',
          deviceType: 'Edge on Windows',
          displayName: 'Edge on Windows',
          browserName: 'Edge',
          operatingSystem: 'Windows',
          createdAt: '2026-04-14T17:30:00Z',
          expiresAt: '2026-04-15T17:30:00Z',
          isCurrent: true,
        }),
        createSessionSummary('44444444-4444-4444-4444-444444444444', {
          ipAddress: '105.16.2.98',
          deviceType: 'Samsung Internet on Android',
          displayName: 'Samsung Internet on Android',
          browserName: 'Samsung Internet',
          operatingSystem: 'Android',
          createdAt: '2026-04-12T13:15:00Z',
          expiresAt: '2026-04-19T13:15:00Z',
          isCurrent: false,
        }),
      ],
    },
    admin: {
      twoFactorEnabled: true,
      passwordChangedAt: '2026-02-20T07:00:00Z',
      sessions: [
        createSessionSummary('55555555-5555-5555-5555-555555555555', {
          ipAddress: '10.10.10.10',
          deviceType: 'Firefox on Linux',
          displayName: 'Firefox on Linux',
          browserName: 'Firefox',
          operatingSystem: 'Linux',
          createdAt: '2026-04-14T12:00:00Z',
          expiresAt: '2026-04-15T12:00:00Z',
          isCurrent: true,
        }),
        createSessionSummary('66666666-6666-6666-6666-666666666666', {
          ipAddress: '10.10.10.11',
          deviceType: 'Chrome on macOS',
          displayName: 'Chrome on macOS',
          browserName: 'Chrome',
          operatingSystem: 'macOS',
          createdAt: '2026-04-11T14:45:00Z',
          expiresAt: '2026-04-18T14:45:00Z',
          isCurrent: false,
        }),
      ],
    },
  };
}

let securityStateByRole = createInitialSecurityState();
let deletedAccountByRole: Record<MockRole, boolean> = {
  patient: false,
  provider: false,
  admin: false,
};
let sessionFingerprintByRole: Record<MockRole, Record<string, string>> = {
  patient: {},
  provider: {},
  admin: {},
};

async function readOptionalJsonBody(request: Request): Promise<unknown> {
  const text = await request.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

function getRequestDeviceFingerprint(body: AuthDeviceRequestBody): string | null {
  if (typeof body.deviceFingerprint !== 'string') {
    return null;
  }

  const fingerprint = body.deviceFingerprint.trim();
  return fingerprint.length > 0 && fingerprint.length <= 255 ? fingerprint : null;
}

function bindFingerprintToInitialCurrentSession(role: MockRole, fingerprint: string): boolean {
  const boundSessionIds = new Set(Object.values(sessionFingerprintByRole[role]));
  const currentSession = securityStateByRole[role].sessions.find(
    (session) => session.isCurrent && !boundSessionIds.has(session.id),
  );

  if (!currentSession) {
    return false;
  }

  sessionFingerprintByRole = {
    ...sessionFingerprintByRole,
    [role]: {
      ...sessionFingerprintByRole[role],
      [fingerprint]: currentSession.id,
    },
  };

  return true;
}

function createDeviceSessionSummary(): SessionSummary {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return createSessionSummary(crypto.randomUUID(), {
    ipAddress: '127.0.0.1',
    deviceType: 'Current browser',
    displayName: 'Current browser',
    browserName: null,
    operatingSystem: null,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isCurrent: true,
  });
}

function updateMockSecurityForRole(
  role: MockRole,
  updater: (overview: SecurityOverviewResponse) => SecurityOverviewResponse,
): SecurityOverviewResponse {
  const nextState = updater(cloneSecurityOverview(securityStateByRole[role]));

  securityStateByRole = {
    ...securityStateByRole,
    [role]: cloneSecurityOverview(nextState),
  };

  return cloneSecurityOverview(securityStateByRole[role]);
}

function syncMockSessionForDevice(role: MockRole, deviceFingerprint: string | null): void {
  if (!deviceFingerprint) {
    return;
  }

  const bindings = sessionFingerprintByRole[role];
  const boundSessionId = bindings[deviceFingerprint];
  const boundSession = securityStateByRole[role].sessions.find(
    (session) => session.id === boundSessionId,
  );

  if (boundSession) {
    updateMockSecurityForRole(role, (overview) => ({
      ...overview,
      sessions: overview.sessions.map((session) => ({
        ...session,
        isCurrent: session.id === boundSession.id,
      })),
    }));
    return;
  }

  if (boundSessionId) {
    sessionFingerprintByRole = {
      ...sessionFingerprintByRole,
      [role]: Object.fromEntries(
        Object.entries(bindings).filter(([fingerprint]) => fingerprint !== deviceFingerprint),
      ),
    };
  }

  if (bindFingerprintToInitialCurrentSession(role, deviceFingerprint)) {
    return;
  }

  const newSession = createDeviceSessionSummary();

  sessionFingerprintByRole = {
    ...sessionFingerprintByRole,
    [role]: {
      ...sessionFingerprintByRole[role],
      [deviceFingerprint]: newSession.id,
    },
  };

  updateMockSecurityForRole(role, (overview) => ({
    ...overview,
    sessions: [
      newSession,
      ...overview.sessions.map((session) => ({
        ...session,
        isCurrent: false,
      })),
    ],
  }));
}

function resetMockSessionFingerprints(role: MockRole): void {
  sessionFingerprintByRole = {
    ...sessionFingerprintByRole,
    [role]: {},
  };
}

function markCurrentMockAccountDeleted(): void {
  deletedAccountByRole = {
    ...deletedAccountByRole,
    [currentMockRole]: true,
  };
}

function isCurrentMockAccountDeleted(): boolean {
  return deletedAccountByRole[currentMockRole];
}

function buildUnauthorizedAuthResponse() {
  return HttpResponse.json(
    {
      success: false,
      data: null,
      status: 'error',
      message: 'Session expired. Please log in again.',
    },
    { status: 401 },
  );
}

export function getCurrentMockRole(): MockRole {
  return currentMockRole;
}

function getCurrentMockSecurityOverview(): SecurityOverviewResponse {
  return cloneSecurityOverview(securityStateByRole[currentMockRole]);
}

function updateCurrentMockSecurity(
  updater: (overview: SecurityOverviewResponse) => SecurityOverviewResponse,
): SecurityOverviewResponse {
  return updateMockSecurityForRole(currentMockRole, updater);
}

function determineMockRole(
  email: string,
  serviceType?: string,
  requestedRole?: MockRole,
): MockRole {
  let nextRole: MockRole = 'patient';

  if (requestedRole === 'admin' || email.includes('admin')) {
    nextRole = 'admin';
  } else if (
    requestedRole === 'provider' ||
    serviceType ||
    email.includes('provider') ||
    email.includes('professional')
  ) {
    nextRole = 'provider';
  }

  currentMockRole = nextRole;
  return nextRole;
}

/** Build a LoginResponse-shaped object matching LoginResponseSchema. */
function buildLoginResponse(email: string, role: MockRole) {
  const name = role === 'admin' ? 'Administrateur' : email.split('@')[0];
  return {
    user: {
      id: crypto.randomUUID(),
      email,
      role,
      name,
      phone: '+216 98 123 456',
      avatar: null,
      avatarFileId: null,
      countryCode: 'TN',
      createdAt: new Date().toISOString(),
    },
    token: `mock_jwt_${secureId(32)}`,
    refreshToken: `mock_refresh_${secureId(32)}`,
    expiresIn: 3600,
  };
}

function buildValidationError(message: string, field: string) {
  return HttpResponse.json(
    {
      success: false,
      data: null,
      status: 'error',
      message,
      errors: {
        [field]: [message],
      },
    },
    { status: 400 },
  );
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return email;
  }

  const visiblePrefix = localPart.slice(0, Math.min(2, localPart.length));
  return `${visiblePrefix}${'*'.repeat(Math.max(2, localPart.length - visiblePrefix.length))}@${domain}`;
}

function normalizeTunisiaPhoneInput(phoneNumber: string): string | null {
  let compact = phoneNumber
    .trim()
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '');

  if (compact.startsWith('00216')) {
    compact = `+216${compact.slice(5)}`;
  } else if (compact.startsWith('216')) {
    compact = `+${compact}`;
  } else if (!compact.startsWith('+') && compact.length === 8) {
    compact = `+216${compact}`;
  }

  return /^\+216\d{8}$/.test(compact) ? compact : null;
}

function maskPhone(phoneNumber: string): string {
  return `${phoneNumber.slice(0, 4)} ** *** ${phoneNumber.slice(-3)}`;
}

// ============================================
// HANDLERS
// ============================================

export const authHandlers = [
  // POST /Auth/login/otp/request
  http.post('*/Auth/login/otp/request', async ({ request }) => {
    await delay(300);
    const body = (await readOptionalJsonBody(request)) as RequestLoginOtpRequestBody;

    if (body.channel !== 'email' && body.channel !== 'sms') {
      return buildValidationError("Canal d'OTP invalide.", 'channel');
    }

    const isEmailChannel = body.channel === 'email';
    let email = 'sms.user@sanad.test';
    let maskedDestination = '';
    let role: MockRole = 'patient';

    if (isEmailChannel) {
      if (typeof body.email !== 'string' || !body.email.includes('@')) {
        return buildValidationError('Adresse e-mail invalide.', 'email');
      }

      email = body.email.trim().toLowerCase();
      maskedDestination = maskEmail(email);
      role = determineMockRole(email);
    } else {
      if (typeof body.phoneNumber !== 'string') {
        return buildValidationError('Numéro de téléphone invalide.', 'phoneNumber');
      }

      const normalizedPhoneNumber = normalizeTunisiaPhoneInput(body.phoneNumber);
      if (!normalizedPhoneNumber) {
        return buildValidationError('Numéro tunisien invalide.', 'phoneNumber');
      }

      maskedDestination = maskPhone(normalizedPhoneNumber);
    }

    if (deletedAccountByRole[role]) {
      return buildUnauthorizedAuthResponse();
    }

    const challengeId = crypto.randomUUID();
    otpChallenges.set(challengeId, {
      channel: body.channel,
      email,
      role,
      deviceFingerprint: getRequestDeviceFingerprint(body),
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return apiOk({
      challengeId,
      channel: body.channel,
      maskedDestination,
      expiresIn: 300,
      resendAvailableIn: 60,
    });
  }),

  // POST /Auth/login/otp/verify
  http.post('*/Auth/login/otp/verify', async ({ request }) => {
    await delay(300);
    const body = (await readOptionalJsonBody(request)) as VerifyLoginOtpRequestBody;

    if (typeof body.challengeId !== 'string') {
      return buildValidationError('Challenge OTP invalide.', 'challengeId');
    }

    const challenge = otpChallenges.get(body.challengeId);

    if (!challenge || challenge.expiresAt < Date.now()) {
      otpChallenges.delete(body.challengeId);
      return HttpResponse.json(
        {
          success: false,
          data: null,
          status: 'error',
          message: 'Code invalide ou expiré.',
        },
        { status: 401 },
      );
    }

    if (body.code !== '123456') {
      return HttpResponse.json(
        {
          success: false,
          data: null,
          status: 'error',
          message: 'Code invalide ou expiré.',
        },
        { status: 401 },
      );
    }

    otpChallenges.delete(body.challengeId);
    currentMockRole = challenge.role;
    syncMockSessionForDevice(
      challenge.role,
      getRequestDeviceFingerprint(body) ?? challenge.deviceFingerprint,
    );

    return apiOk(buildLoginResponse(challenge.email, challenge.role));
  }),

  // POST /Auth/login
  http.post('*/Auth/login', async ({ request }) => {
    await delay(300);
    const body = (await readOptionalJsonBody(request)) as LoginRequestBody;
    const url = new URL(request.url);
    const serviceType = url.searchParams.get('serviceType') ?? undefined;
    const role = determineMockRole(body.email, serviceType);
    const deviceFingerprint = getRequestDeviceFingerprint(body);

    // Deleted accounts cannot log in within the same mock session
    if (deletedAccountByRole[role]) {
      return buildUnauthorizedAuthResponse();
    }

    syncMockSessionForDevice(role, deviceFingerprint);

    return apiOk(buildLoginResponse(body.email, role));
  }),

  // POST /Auth/register
  http.post('*/Auth/register', async ({ request }) => {
    await delay(500);

    try {
      const body = await readOptionalJsonBody(request);
      const parsedRequest = parseRegisterUserRequest(body);
      const role = determineMockRole(
        parsedRequest.email ?? '',
        parsedRequest.role === 'provider' ? parsedRequest.serviceType : undefined,
        parsedRequest.role,
      );
      const deviceFingerprint = getRequestDeviceFingerprint(parsedRequest);

      // Registration is a new account boundary: clear deleted flag and restore the role snapshot
      deletedAccountByRole = {
        ...deletedAccountByRole,
        [role]: false,
      };
      resetMockSessionFingerprints(role);
      securityStateByRole = {
        ...securityStateByRole,
        [role]: cloneSecurityOverview(createInitialSecurityState()[role]),
      };
      syncMockSessionForDevice(role, deviceFingerprint);

      if (role === 'provider') {
        setCurrentMockProviderContext({
          serviceType: parsedRequest.serviceType,
          nutritionProviderSubtype: parsedRequest.nutritionProviderSubtype ?? null,
          address: parsedRequest.address ?? null,
          city: parsedRequest.city ?? null,
          firstName: parsedRequest.firstName,
          lastName: parsedRequest.lastName,
          email: parsedRequest.email,
          phone: parsedRequest.phone ?? null,
          verificationConsentGiven: parsedRequest.verificationConsentGiven ?? true,
          seedServices: false,
        });
      } else if (role === 'patient') {
        setCurrentMockPatientContext({
          firstName: parsedRequest.firstName,
          lastName: parsedRequest.lastName,
          email: parsedRequest.email,
          phone: parsedRequest.phone ?? null,
        });
      }

      const storedAuthProfile = role === 'provider' ? getProviderAuthProfile() : getAuthProfile();
      const name =
        [storedAuthProfile.firstName, storedAuthProfile.lastName].filter(Boolean).join(' ') || '';

      return apiOk({
        user: {
          id: storedAuthProfile.id,
          email: storedAuthProfile.email,
          role: storedAuthProfile.role,
          name,
          phone: storedAuthProfile.phoneNumber,
          countryCode: parsedRequest.countryCode ?? 'TN',
        },
        token: `mock_jwt_${secureId(32)}`,
        refreshToken: `mock_refresh_${secureId(32)}`,
        expiresIn: 3600,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Requête d'inscription invalide.";

      return HttpResponse.json(
        {
          success: false,
          data: null,
          status: 'error',
          message,
          errors: {
            registration: [message],
          },
        },
        { status: 400 },
      );
    }
  }),

  // POST /Auth/refresh-token
  http.post('*/Auth/refresh-token', async ({ request }) => {
    await delay(200);
    const body = (await readOptionalJsonBody(request)) as AuthDeviceRequestBody;

    // Deleted accounts cannot refresh within the same mock session
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    syncMockSessionForDevice(currentMockRole, getRequestDeviceFingerprint(body));

    return apiOk(buildLoginResponse('mock@user.com', currentMockRole));
  }),

  // GET /Auth/profile — returns UserResponseSchema shape
  http.get('*/Auth/profile', async () => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    return apiOk(getCurrentMockRole() === 'provider' ? getProviderAuthProfile() : getAuthProfile());
  }),

  // PUT /Auth/account — updates shared phone/avatar account state
  http.put('*/Auth/account', async ({ request }) => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    await delay(250);

    const body = (await request.json()) as UpdateAccountProfileRequest;
    return apiOk(
      getCurrentMockRole() === 'provider'
        ? updateProviderAuthAccount(body)
        : updateAuthAccount(body),
    );
  }),

  // GET /Auth/security — returns live mock session inventory and 2FA status
  http.get('*/Auth/security', async () => {
    await delay(150);

    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    return apiOk(getCurrentMockSecurityOverview());
  }),

  // POST /Auth/change-password — validates request, simulates wrong-current-password, revokes others
  http.post('*/Auth/change-password', async ({ request }) => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    await delay(250);

    const parsedBody = ChangePasswordRequestSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      const issue = parsedBody.error.issues[0];
      const field = issue?.path[0]?.toString() ?? 'changePassword';
      const message = issue?.message ?? 'Requête de changement de mot de passe invalide.';

      return buildValidationError(message, field);
    }

    if (parsedBody.data.currentPassword !== 'CurrentPass123!') {
      return buildValidationError('Current password is incorrect', 'currentPassword');
    }

    updateCurrentMockSecurity((overview) => ({
      ...overview,
      passwordChangedAt: new Date().toISOString(),
      sessions: overview.sessions.filter((session) => session.isCurrent),
    }));

    return apiOk({});
  }),

  // POST /Auth/delete-account — validates confirmation password and clears sessions on success
  http.post('*/Auth/delete-account', async ({ request }) => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    await delay(250);

    const parsedBody = DeleteAccountRequestSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      const issue = parsedBody.error.issues[0];
      const field = issue?.path[0]?.toString() ?? 'deleteAccount';
      const message = issue?.message ?? 'Requête de suppression de compte invalide.';

      return buildValidationError(message, field);
    }

    if (parsedBody.data.currentPassword !== 'CurrentPass123!') {
      return buildValidationError('Current password is incorrect', 'currentPassword');
    }

    updateCurrentMockSecurity((overview) => ({
      ...overview,
      sessions: [],
    }));
    markCurrentMockAccountDeleted();

    return apiOk({});
  }),

  // DELETE /Auth/sessions/:id — revokes one owned non-current session
  http.delete('*/Auth/sessions/:id', async ({ params }) => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    await delay(200);

    const sessionId = params.id?.toString();
    const currentOverview = getCurrentMockSecurityOverview();
    const targetSession = currentOverview.sessions.find((session) => session.id === sessionId);

    if (!sessionId || !targetSession) {
      return apiNotFound('Session not found');
    }

    if (targetSession.isCurrent) {
      return buildValidationError('Cannot revoke the current session', 'sessionId');
    }

    updateCurrentMockSecurity((overview) => ({
      ...overview,
      sessions: overview.sessions.filter((session) => session.id !== sessionId),
    }));

    return apiOk({});
  }),

  // POST /Auth/sessions/revoke-others — leaves only the current session active
  http.post('*/Auth/sessions/revoke-others', async () => {
    if (isCurrentMockAccountDeleted()) {
      return buildUnauthorizedAuthResponse();
    }

    await delay(200);

    updateCurrentMockSecurity((overview) => ({
      ...overview,
      sessions: overview.sessions.filter((session) => session.isCurrent),
    }));

    return apiOk({});
  }),
];
