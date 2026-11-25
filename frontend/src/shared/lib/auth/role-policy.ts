const DEFAULT_LOGIN_ROUTE = '/auth/login';

export type SupportedRuntimeRole = 'patient' | 'provider';
export type CapabilityBucket = SupportedRuntimeRole | 'none';
export type RoleRejectionReason = 'unsupported_role' | 'missing_role' | 'invalid_role';

export interface RolePolicyResult {
  rawRole: string;
  normalizedRole: SupportedRuntimeRole | null;
  isKnownRole: boolean;
  isSupportedInSpa: boolean;
  capabilityBucket: CapabilityBucket;
  defaultRoute: string;
  rejectionReason: RoleRejectionReason | null;
}

interface RoleRegistryEntry {
  normalizedRole: SupportedRuntimeRole | null;
  capabilityBucket: CapabilityBucket;
  defaultRoute: string;
}

const roleRegistry = {
  patient: {
    normalizedRole: 'patient',
    capabilityBucket: 'patient',
    defaultRoute: '/patient-dashboard',
  },
  provider: {
    normalizedRole: 'provider',
    capabilityBucket: 'provider',
    defaultRoute: '/provider-dashboard',
  },
  admin: {
    normalizedRole: null,
    capabilityBucket: 'none',
    defaultRoute: DEFAULT_LOGIN_ROUTE,
  },
  super_admin: {
    normalizedRole: null,
    capabilityBucket: 'none',
    defaultRoute: DEFAULT_LOGIN_ROUTE,
  },
} satisfies Record<string, RoleRegistryEntry>;

function buildRejectedRolePolicy(
  rawRole: string,
  rejectionReason: RoleRejectionReason,
): RolePolicyResult {
  return {
    rawRole,
    normalizedRole: null,
    isKnownRole: false,
    isSupportedInSpa: false,
    capabilityBucket: 'none',
    defaultRoute: DEFAULT_LOGIN_ROUTE,
    rejectionReason,
  };
}

export function isSupportedRuntimeRole(value: unknown): value is SupportedRuntimeRole {
  return value === 'patient' || value === 'provider';
}

export function getDefaultRouteForRuntimeRole(role: SupportedRuntimeRole): string {
  return roleRegistry[role].defaultRoute;
}

export function resolveRolePolicy(role: unknown): RolePolicyResult {
  if (role === null || role === undefined) {
    return buildRejectedRolePolicy('', 'missing_role');
  }

  if (typeof role !== 'string') {
    return buildRejectedRolePolicy('', 'invalid_role');
  }

  const rawRole = role.trim();

  if (!rawRole) {
    return buildRejectedRolePolicy('', 'missing_role');
  }

  const registryEntry = roleRegistry[rawRole as keyof typeof roleRegistry];

  if (!registryEntry) {
    return {
      rawRole,
      normalizedRole: null,
      isKnownRole: false,
      isSupportedInSpa: false,
      capabilityBucket: 'none',
      defaultRoute: DEFAULT_LOGIN_ROUTE,
      rejectionReason: 'unsupported_role',
    };
  }

  return {
    rawRole,
    normalizedRole: registryEntry.normalizedRole,
    isKnownRole: true,
    isSupportedInSpa: registryEntry.normalizedRole !== null,
    capabilityBucket: registryEntry.capabilityBucket,
    defaultRoute: registryEntry.defaultRoute,
    rejectionReason: registryEntry.normalizedRole === null ? 'unsupported_role' : null,
  };
}
