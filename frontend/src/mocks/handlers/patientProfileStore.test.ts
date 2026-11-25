import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadStore() {
  return import('@/mocks/handlers/patientProfileStore');
}

describe('patientProfileStore', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips flat patient profile updates as nested emergency contact data', async () => {
    const store = await loadStore();

    expect(store.getPatientProfile().emergencyContact).toEqual({
      name: 'Fatma Ben Ali',
      phone: '+216 98 765 432',
      relationship: 'Spouse',
    });

    vi.setSystemTime(new Date('2026-04-14T11:00:00.000Z'));

    const updatedProfile = store.updatePatientProfile({
      firstName: 'Leila',
      lastName: 'Trabelsi',
      medicalHistory: 'Asthme léger.',
      insuranceProvider: 'CNAM Plus',
      insuranceNumber: 'CNAM-PLUS-77',
      emergencyContactName: 'Sami Trabelsi',
      emergencyContactPhone: '+216 22 333 444',
      emergencyContactRelationship: 'Brother',
    });

    expect(updatedProfile.firstName).toBe('Leila');
    expect(updatedProfile.lastName).toBe('Trabelsi');
    expect(updatedProfile.medicalHistory).toBe('Asthme léger.');
    expect(updatedProfile.insuranceProvider).toBe('CNAM Plus');
    expect(updatedProfile.insuranceNumber).toBe('CNAM-PLUS-77');
    expect(updatedProfile.emergencyContact).toEqual({
      name: 'Sami Trabelsi',
      phone: '+216 22 333 444',
      relationship: 'Brother',
    });
    expect(updatedProfile.updatedAt).toBe('2026-04-14T11:00:00.000Z');

    expect(store.getAuthProfile()).toEqual(
      expect.objectContaining({
        firstName: 'Leila',
        lastName: 'Trabelsi',
      }),
    );
  });

  it('persists partial patient preference updates with refreshed timestamps', async () => {
    const store = await loadStore();

    vi.setSystemTime(new Date('2026-04-14T12:00:00.000Z'));

    const updatedPreferences = store.updatePatientPreferences({
      pushNotifications: true,
      shareWithFamily: true,
      validationReminderHours: 12,
    });

    expect(updatedPreferences).toEqual({
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      autoValidationEnabled: true,
      validationReminderHours: 12,
      shareWithFamily: true,
      allowProviderMessages: true,
      updatedAt: '2026-04-14T12:00:00.000Z',
    });
    expect(store.getPatientPreferences()).toEqual(updatedPreferences);
  });

  it('stores the avatar file id without exposing a protected content URL', async () => {
    const store = await loadStore();

    vi.setSystemTime(new Date('2026-04-14T13:00:00.000Z'));

    const updatedAuthProfile = store.updateAuthAccount({
      phone: '  +216 55 444 333  ',
      avatarFileId: '11111111-1111-1111-1111-111111111111',
    });

    expect(updatedAuthProfile.phoneNumber).toBe('+216 55 444 333');
    expect(updatedAuthProfile.avatar).toBeNull();
    expect(updatedAuthProfile.avatarFileId).toBe('11111111-1111-1111-1111-111111111111');
    expect(store.getPatientProfile()).toEqual(
      expect.objectContaining({
        profilePictureUrl: null,
        updatedAt: '2026-04-14T13:00:00.000Z',
      }),
    );

    vi.setSystemTime(new Date('2026-04-14T14:00:00.000Z'));

    const clearedAuthProfile = store.updateAuthAccount({
      avatarFileId: '   ',
    });

    expect(clearedAuthProfile.avatar).toBeNull();
    expect(clearedAuthProfile.avatarFileId).toBeNull();
    expect(store.getPatientProfile().profilePictureUrl).toBeNull();
  });
});
