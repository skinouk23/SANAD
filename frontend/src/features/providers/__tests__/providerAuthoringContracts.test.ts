import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import { parseRegisterUserRequest } from '@/features/auth/schema';
import { providerKeys } from '@/features/providers/keys';
import { useMyServicePresets } from '@/features/providers/hooks/useProviderSelfService';
import { myServicePresetsOptions } from '@/features/providers/options';
import {
  CANONICAL_PROVIDER_CATEGORY_VALUES,
  getNutritionSubtypeLabel,
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  normalizeProviderCategory,
  resolveProviderCategoryConfigKey,
} from '@/features/providers/providerAuthoring';
import { getServiceAuthoringConfig } from '@/features/providers/providerAuthoringConfig';
import { updateMyProviderPreferences } from '@/features/providers/preferences-service';
import { ProviderPreferencesResponseSchema } from '@/features/providers/preferences-schema';
import { getMyServicePresets, updateMyProviderProfile } from '@/features/providers/service';
import {
  ProviderProfileResponseSchema,
  UpdateMyProviderProfileRequestSchema,
} from '@/features/providers/schema';
import {
  ProviderServicePresetDraftPayloadSchema,
  ProviderServicePresetResponseSchema,
} from '@/features/services/schema';
import { englishTranslations } from '@/i18n/translations/en';

import type { ReactNode } from 'react';
import type { ProviderServicePresetResponse } from '@/features/services/schema';

const VALID_PROVIDER_PROFILE_RESPONSE = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: '22222222-2222-2222-2222-222222222222',
  serviceType: 'nutrition',
  nutritionProviderSubtype: 'Chef',
  businessName: null,
  firstName: 'Amal',
  lastName: 'Trabelsi',
  licenseNumber: null,
  specialization: null,
  yearsOfExperience: 8,
  bio: null,
  address: null,
  city: 'Tunis',
  postalCode: null,
  serviceRadius: 20,
  rating: 4.8,
  totalReviews: 24,
  totalBookings: 61,
  isApproved: true,
  approvalDate: '2026-04-13T10:00:00Z',
  subscriptionTier: null,
  profilePictureUrl: null,
  coverImageUrl: null,
  isOnline: true,
  responseRate: 98,
  averageResponseTimeMinutes: 12,
  completionRate: 97,
  createdAt: '2026-04-13T10:00:00Z',
  updatedAt: '2026-04-13T10:00:00Z',
} as const;

const VALID_PROVIDER_PREFERENCES_RESPONSE = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false,
  allowPatientMessages: true,
  profileVisibility: 'public',
  updatedAt: '2026-04-13T10:00:00Z',
} as const;

const VALID_PROVIDER_SERVICE_PRESET_RESPONSE = {
  id: '33333333-3333-4333-8333-333333333333',
  code: 'nutrition.initial-consultation',
  name: 'Nutrition Initial Consultation',
  description: 'Pre-fills the standard intake session.',
  displayOrder: 1,
  draft: {
    price: 95,
    priceType: 'fixed',
    currency: 'TND',
    durationMinutes: 60,
    serviceLocation: 'home',
    requiresPrescription: false,
    isUrgent: false,
    requiresMedicalHistory: true,
    typeConfig: {
      nutritionProviderSubtype: 'Nutritionist',
    },
  },
} as const;

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

describe('providerAuthoring', () => {
  describe('normalizeProviderCategory', () => {
    it.each([
      ['nutrition', 'nutrition'],
      ['equipment', 'equipment_rental'],
      ['chronic', 'chronic_care'],
      ['accompagnement', 'medical_companion'],
      ['  EQUIPMENT  ', 'equipment_rental'],
    ])('normalizes %s to %s', (input, expected) => {
      expect(normalizeProviderCategory(input)).toBe(expected);
    });

    it('returns null for unknown legacy category ids', () => {
      expect(normalizeProviderCategory('unknown-legacy-category')).toBeNull();
    });
  });

  describe('resolveProviderCategoryConfigKey', () => {
    it.each([
      ['nutrition', 'nutrition'],
      ['equipment', 'equipment'],
      ['equipment_rental', 'equipment'],
      ['ambulance', 'ambulance'],
    ])('maps %s to the provider UI config key %s', (input, expected) => {
      expect(resolveProviderCategoryConfigKey(input)).toBe(expected);
    });
  });

  describe('service authoring coverage', () => {
    it('every canonical provider category has an authoring config', () => {
      for (const category of CANONICAL_PROVIDER_CATEGORY_VALUES) {
        const configKey = resolveProviderCategoryConfigKey(category);

        expect(configKey, `${category} should resolve to a config key`).not.toBeNull();
        expect(
          getServiceAuthoringConfig(configKey),
          `${category} should map to an authoring config`,
        ).not.toBeNull();
      }
    });

    it('doctor category uses standard fallback with isUrgent field', () => {
      const config = getServiceAuthoringConfig('doctor');

      expect(config).not.toBeNull();
      expect(config?.isBespoke).toBe(false);
      expect(config?.fields).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'isUrgent' })]),
      );
    });

    it('standard fallback form includes name, price, isUrgent, and prescription fields', () => {
      const fallbackConfig = getServiceAuthoringConfig('doctor');
      const fieldIds = fallbackConfig?.fields.map((field) => field.id) ?? [];

      expect(fallbackConfig).not.toBeNull();
      expect(fieldIds).toEqual(
        expect.arrayContaining(['name', 'price', 'isUrgent', 'prescription']),
      );
    });
  });

  describe('registration request contract', () => {
    const BASE_PROVIDER_REGISTRATION = {
      email: 'amal@example.com',
      password: 'StrongPass123!',
      firstName: 'Amal',
      lastName: 'Trabelsi',
      role: 'provider' as const,
      countryCode: 'TN',
    };

    it('normalizes legacy provider categories before registration submit', () => {
      const result = parseRegisterUserRequest({
        ...BASE_PROVIDER_REGISTRATION,
        serviceType: 'equipment',
      });

      expect(result.serviceType).toBe('equipment_rental');
    });

    it('requires nutrition subtype only for nutrition registrations', () => {
      expect(() =>
        parseRegisterUserRequest({
          ...BASE_PROVIDER_REGISTRATION,
          serviceType: 'nutrition',
        }),
      ).toThrow('Sélectionnez un sous-type nutrition.');

      expect(() =>
        parseRegisterUserRequest({
          ...BASE_PROVIDER_REGISTRATION,
          serviceType: 'nursing',
          nutritionProviderSubtype: 'Chef',
        }),
      ).toThrow('Le sous-type nutrition est réservé à la catégorie nutrition.');
    });
  });

  describe('nutrition subtype contract', () => {
    it('locks the canonical nutrition subtype values', () => {
      expect(NUTRITION_PROVIDER_SUBTYPE_VALUES).toEqual(['Restaurant', 'Chef', 'Nutritionist']);
    });

    it('allows nullable nutritionProviderSubtype on provider profile responses', () => {
      const result = ProviderProfileResponseSchema.safeParse({
        ...VALID_PROVIDER_PROFILE_RESPONSE,
        serviceType: 'nursing',
        nutritionProviderSubtype: null,
      });

      expect(result.success).toBe(true);
    });

    it('allows nullable nutritionProviderSubtype on provider profile updates', () => {
      const result = UpdateMyProviderProfileRequestSchema.safeParse({
        firstName: 'Amal',
        nutritionProviderSubtype: null,
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid nutrition subtype strings', () => {
      const result = UpdateMyProviderProfileRequestSchema.safeParse({
        nutritionProviderSubtype: 'chef',
      });

      expect(result.success).toBe(false);
    });

    it('maps canonical nutrition subtypes to localized listing labels', () => {
      expect(getNutritionSubtypeLabel('Restaurant', englishTranslations)).toBe(
        englishTranslations.serviceListing.nutritionRestaurant,
      );
      expect(getNutritionSubtypeLabel('Chef', englishTranslations)).toBe(
        englishTranslations.serviceListing.nutritionChef,
      );
      expect(getNutritionSubtypeLabel('Nutritionist', englishTranslations)).toBe(
        englishTranslations.serviceListing.nutritionNutritionist,
      );
    });

    it('returns null when no nutrition subtype is provided', () => {
      expect(getNutritionSubtypeLabel(null, englishTranslations)).toBeNull();
      expect(getNutritionSubtypeLabel(undefined, englishTranslations)).toBeNull();
    });
  });

  describe('provider-owned mutation contracts', () => {
    it('updates provider profile with silent-error semantics and zod parsing', async () => {
      const updatedResponse = {
        ...VALID_PROVIDER_PROFILE_RESPONSE,
        firstName: 'Amina',
      };
      const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(updatedResponse);

      await expect(updateMyProviderProfile({ firstName: 'Amina' })).resolves.toEqual(
        ProviderProfileResponseSchema.parse(updatedResponse),
      );
      expect(apiPutSpy).toHaveBeenCalledWith(
        '/providers/me',
        { firstName: 'Amina' },
        expect.objectContaining({ _silentError: true }),
      );
    });

    it('updates provider preferences with silent-error semantics and zod parsing', async () => {
      const updatedResponse = {
        ...VALID_PROVIDER_PREFERENCES_RESPONSE,
        smsNotifications: true,
      };
      const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(updatedResponse);

      await expect(updateMyProviderPreferences({ smsNotifications: true })).resolves.toEqual(
        ProviderPreferencesResponseSchema.parse(updatedResponse),
      );
      expect(apiPutSpy).toHaveBeenCalledWith(
        '/providers/me/preferences',
        { smsNotifications: true },
        expect.objectContaining({ _silentError: true }),
      );
    });
  });

  describe('provider service presets contract', () => {
    it('matches the backend preset dto shape including nested draft payloads', () => {
      const result = ProviderServicePresetResponseSchema.safeParse(
        VALID_PROVIDER_SERVICE_PRESET_RESPONSE,
      );

      expect(result.success).toBe(true);
    });

    it('allows nullable hidden draft fields for preset-backed authoring flows', () => {
      const result = ProviderServicePresetDraftPayloadSchema.safeParse({
        ...VALID_PROVIDER_SERVICE_PRESET_RESPONSE.draft,
        durationMinutes: null,
        typeConfig: null,
      });

      expect(result.success).toBe(true);
    });

    it('uses a dedicated presets query key and options helper', () => {
      expect(providerKeys.myServicePresets()).toEqual(['providers', 'myServices', 'presets']);
      expect(myServicePresetsOptions().queryKey).toEqual(providerKeys.myServicePresets());
    });

    it('fetches provider service presets with silent-error semantics and zod parsing', async () => {
      const apiGetSpy = vi
        .spyOn(api, 'get')
        .mockResolvedValueOnce([VALID_PROVIDER_SERVICE_PRESET_RESPONSE]);

      await expect(getMyServicePresets()).resolves.toEqual([
        ProviderServicePresetResponseSchema.parse(VALID_PROVIDER_SERVICE_PRESET_RESPONSE),
      ]);
      expect(apiGetSpy).toHaveBeenCalledWith(
        '/providers/me/services/presets',
        expect.objectContaining({ _silentError: true }),
      );
    });

    it('rejects malformed preset payloads instead of accepting invalid contracts', async () => {
      vi.spyOn(api, 'get').mockResolvedValueOnce([
        {
          ...VALID_PROVIDER_SERVICE_PRESET_RESPONSE,
          draft: {
            ...VALID_PROVIDER_SERVICE_PRESET_RESPONSE.draft,
            currency: 'TN',
          },
        },
      ]);

      await expect(getMyServicePresets()).rejects.toThrow();
    });

    it('defaults the self-service preset hook to an empty array while loading', async () => {
      const deferred = createDeferred<ProviderServicePresetResponse[]>();
      vi.spyOn(api, 'get').mockReturnValueOnce(deferred.promise);

      const { result } = renderHook(() => useMyServicePresets(), {
        wrapper: createQueryWrapper(),
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.loading).toBe(true);

      deferred.resolve([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.data).toEqual([]);
    });
  });
});
