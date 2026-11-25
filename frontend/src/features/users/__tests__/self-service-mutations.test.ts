import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import {
  MyPatientProfileResponseSchema,
  PatientPreferencesResponseSchema,
} from '@/features/family-circle/schema';
import { updateCurrentPatient, updatePatientPreferences } from '@/features/users/service';

const VALID_PATIENT_PROFILE_RESPONSE = {
  firstName: 'Mohamed',
  lastName: 'Ben Ali',
  dateOfBirth: '1990-05-12',
  gender: 'male',
  address: '12 Rue Habib Bourguiba',
  city: 'Tunis',
  postalCode: '1000',
  emergencyContact: {
    name: 'Fatma Ben Ali',
    phone: '+216 98 765 432',
    relationship: 'Spouse',
  },
  medicalHistory: 'Hypertension artérielle contrôlée.',
  allergies: 'Pénicilline',
  currentMedications: 'Amlodipine 5 mg',
  insuranceProvider: 'CNAM',
  insuranceNumber: 'CNAM-2024-001',
  profilePictureUrl: 'https://cdn.example.com/patient-avatar.png',
  updatedAt: '2026-04-13T10:00:00Z',
} as const;

const VALID_PATIENT_PREFERENCES_RESPONSE = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false,
  autoValidationEnabled: true,
  validationReminderHours: 12,
  shareWithFamily: true,
  allowProviderMessages: true,
  updatedAt: '2026-04-13T10:00:00Z',
} as const;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('patient self-service mutations contract', () => {
  it('updates the current patient profile with silent-error semantics and zod parsing', async () => {
    const payload = {
      city: 'Sfax',
      emergencyContactPhone: '+216 22 333 444',
      medicalHistory: 'Hypertension artérielle contrôlée.',
    };
    const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(VALID_PATIENT_PROFILE_RESPONSE);

    await expect(updateCurrentPatient(payload)).resolves.toEqual(
      MyPatientProfileResponseSchema.parse(VALID_PATIENT_PROFILE_RESPONSE),
    );
    expect(apiPutSpy).toHaveBeenCalledWith(
      '/patients/me',
      payload,
      expect.objectContaining({ _silentError: true }),
    );
  });

  it('updates patient preferences with silent-error semantics and zod parsing', async () => {
    const payload = {
      smsNotifications: true,
      validationReminderHours: 6,
      shareWithFamily: false,
    };
    const apiPutSpy = vi
      .spyOn(api, 'put')
      .mockResolvedValueOnce(VALID_PATIENT_PREFERENCES_RESPONSE);

    await expect(updatePatientPreferences(payload)).resolves.toEqual(
      PatientPreferencesResponseSchema.parse(VALID_PATIENT_PREFERENCES_RESPONSE),
    );
    expect(apiPutSpy).toHaveBeenCalledWith(
      '/patients/me/preferences',
      payload,
      expect.objectContaining({ _silentError: true }),
    );
  });
});
