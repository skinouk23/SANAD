import { beforeEach, describe, expect, it } from 'vitest';

import { getAuthUser, getDeviceFingerprint, setAuthUser } from '@/utils/secure-storage';

const AUTH_USER_STORAGE_KEY = '__sanad_sec_auth_user';

function writeStoredAuthEnvelope(data: unknown) {
  sessionStorage.setItem(
    AUTH_USER_STORAGE_KEY,
    JSON.stringify({
      version: 2,
      storedAt: Date.now(),
      data,
    }),
  );
}

describe('secure auth user storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('persists the normalized auth user shape with backendRole', async () => {
    await setAuthUser({
      id: 'user-1',
      email: 'user@test.com',
      role: 'patient',
      backendRole: 'patient',
      name: 'Patient User',
      phone: '+216 20 111 222',
      avatarFileId: 'avatar-file-1',
      address: {
        street: '15 Rue de la Liberte',
        city: 'Tunis',
        region: 'Tunis',
        postalCode: '1000',
        country: 'Tunisie',
        fullAddress: '15 Rue de la Liberte, 1000 Tunis, Tunisie',
      },
    });

    await expect(getAuthUser()).resolves.toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'user@test.com',
        role: 'patient',
        backendRole: 'patient',
        name: 'Patient User',
        avatarFileId: 'avatar-file-1',
      }),
    );
  });

  it('persists a stable random device fingerprint outside session cleanup', async () => {
    const firstFingerprint = await getDeviceFingerprint();

    sessionStorage.clear();

    const secondFingerprint = await getDeviceFingerprint();

    expect(firstFingerprint).toBe(secondFingerprint);
    expect(firstFingerprint).toMatch(/^dfp_[a-f0-9]+$/);
    expect(firstFingerprint.length).toBeLessThanOrEqual(255);
  });

  it('clears legacy stored users that are missing backendRole', async () => {
    writeStoredAuthEnvelope({
      id: 'legacy-user-1',
      email: 'legacy@test.com',
      role: 'patient',
      name: 'Legacy User',
    });

    await expect(getAuthUser()).resolves.toBeNull();
    expect(sessionStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
  });

  it('clears tampered stored users whose backend role does not match the normalized role', async () => {
    writeStoredAuthEnvelope({
      id: 'tampered-user-1',
      email: 'tampered@test.com',
      role: 'patient',
      backendRole: 'admin',
      name: 'Tampered User',
    });

    await expect(getAuthUser()).resolves.toBeNull();
    expect(sessionStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
  });
});
