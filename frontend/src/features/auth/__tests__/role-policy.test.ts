import { describe, expect, it } from 'vitest';

import { resolveRolePolicy } from '@/features/auth/role-policy';

describe('resolveRolePolicy', () => {
  it('supports patient roles for the SPA runtime', () => {
    expect(resolveRolePolicy('patient')).toEqual({
      rawRole: 'patient',
      normalizedRole: 'patient',
      isKnownRole: true,
      isSupportedInSpa: true,
      capabilityBucket: 'patient',
      defaultRoute: '/patient-dashboard',
      rejectionReason: null,
    });
  });

  it('supports provider roles for the SPA runtime', () => {
    expect(resolveRolePolicy('provider')).toEqual({
      rawRole: 'provider',
      normalizedRole: 'provider',
      isKnownRole: true,
      isSupportedInSpa: true,
      capabilityBucket: 'provider',
      defaultRoute: '/provider-dashboard',
      rejectionReason: null,
    });
  });

  it.each(['admin', 'super_admin'] as const)('rejects known but unsupported %s roles', (role) => {
    expect(resolveRolePolicy(role)).toEqual({
      rawRole: role,
      normalizedRole: null,
      isKnownRole: true,
      isSupportedInSpa: false,
      capabilityBucket: 'none',
      defaultRoute: '/auth/login',
      rejectionReason: 'unsupported_role',
    });
  });

  it('rejects unknown backend roles by default', () => {
    expect(resolveRolePolicy('pilot')).toEqual({
      rawRole: 'pilot',
      normalizedRole: null,
      isKnownRole: false,
      isSupportedInSpa: false,
      capabilityBucket: 'none',
      defaultRoute: '/auth/login',
      rejectionReason: 'unsupported_role',
    });
  });

  it.each([undefined, null, '', '   '])('treats %p as a missing role', (role) => {
    expect(resolveRolePolicy(role)).toEqual({
      rawRole: '',
      normalizedRole: null,
      isKnownRole: false,
      isSupportedInSpa: false,
      capabilityBucket: 'none',
      defaultRoute: '/auth/login',
      rejectionReason: 'missing_role',
    });
  });

  it.each([123, true, {}, []])('treats %p as an invalid role payload', (role) => {
    expect(resolveRolePolicy(role)).toEqual({
      rawRole: '',
      normalizedRole: null,
      isKnownRole: false,
      isSupportedInSpa: false,
      capabilityBucket: 'none',
      defaultRoute: '/auth/login',
      rejectionReason: 'invalid_role',
    });
  });
});
