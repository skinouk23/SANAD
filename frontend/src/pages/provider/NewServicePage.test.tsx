import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildCreatePayload, NewServicePage } from '@/pages/provider/NewServicePage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { ProviderProfileResponse } from '@/features/providers/schema';
import type { ProviderServicePresetResponse } from '@/features/services/schema';

const {
  mockUseMyProviderProfile,
  mockUseMyServicePresets,
  mockUseAddService,
  mockUseMyServices,
  mockUseToggleService,
  mockUseUpdateService,
  mockUseRemoveService,
  mockUseNutritionDietTypes,
  mockUseNutritionSubcategories,
  mockUseAmbulanceServiceTypes,
  mockUseVeterinaryAnimalTypes,
  mockShowSuccessToast,
} = vi.hoisted(() => ({
  mockUseMyProviderProfile: vi.fn(),
  mockUseMyServicePresets: vi.fn(),
  mockUseAddService: vi.fn(),
  mockUseMyServices: vi.fn(),
  mockUseToggleService: vi.fn(),
  mockUseUpdateService: vi.fn(),
  mockUseRemoveService: vi.fn(),
  mockUseNutritionDietTypes: vi.fn(),
  mockUseNutritionSubcategories: vi.fn(),
  mockUseAmbulanceServiceTypes: vi.fn(),
  mockUseVeterinaryAnimalTypes: vi.fn(),
  mockShowSuccessToast: vi.fn(),
}));

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    useMyProviderProfile: mockUseMyProviderProfile,
    useMyServicePresets: mockUseMyServicePresets,
    useAddService: mockUseAddService,
    useMyServices: mockUseMyServices,
    useToggleService: mockUseToggleService,
    useUpdateService: mockUseUpdateService,
    useRemoveService: mockUseRemoveService,
  };
});

vi.mock('@/features/nutrition', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/nutrition')>('@/features/nutrition');

  return {
    ...actual,
    useNutritionDietTypes: mockUseNutritionDietTypes,
    useNutritionSubcategories: mockUseNutritionSubcategories,
  };
});

vi.mock('@/features/ambulance', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/ambulance')>('@/features/ambulance');

  return {
    ...actual,
    useAmbulanceServiceTypes: mockUseAmbulanceServiceTypes,
  };
});

vi.mock('@/features/veterinary', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/veterinary')>('@/features/veterinary');

  return {
    ...actual,
    useVeterinaryAnimalTypes: mockUseVeterinaryAnimalTypes,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showSuccessToast: mockShowSuccessToast,
}));

const BASE_PROFILE: ProviderProfileResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: '22222222-2222-2222-2222-222222222222',
  serviceType: 'nutrition',
  nutritionProviderSubtype: 'Chef',
  businessName: 'Cuisine Santé Tunis',
  firstName: 'Amal',
  lastName: 'Trabelsi',
  licenseNumber: 'LIC-42',
  specialization: 'Nutrition clinique',
  yearsOfExperience: 8,
  bio: 'Consultations et repas adaptés.',
  address: '10 Rue du Lac',
  city: 'Tunis',
  postalCode: '1053',
  serviceRadius: 20,
  rating: 4.8,
  totalReviews: 32,
  totalBookings: 58,
  isApproved: true,
  approvalDate: '2026-04-13T10:00:00Z',
  subscriptionTier: 'elite',
  profilePictureUrl: null,
  coverImageUrl: null,
  isOnline: true,
  responseRate: 98,
  averageResponseTimeMinutes: 12,
  completionRate: 97,
  createdAt: '2026-04-13T10:00:00Z',
  updatedAt: '2026-04-13T10:00:00Z',
};

const BASE_PRESET_DRAFT: ProviderServicePresetResponse['draft'] = {
  price: 90,
  priceType: 'fixed',
  currency: 'TND',
  durationMinutes: 30,
  serviceLocation: 'home',
  requiresPrescription: false,
  isUrgent: false,
  requiresMedicalHistory: false,
  typeConfig: null,
};

function createProfile(serviceType: ProviderProfileResponse['serviceType']) {
  return {
    ...BASE_PROFILE,
    serviceType,
    nutritionProviderSubtype: serviceType === 'nutrition' ? 'Chef' : null,
  } satisfies ProviderProfileResponse;
}

function createPreset(
  overrides: Omit<Partial<ProviderServicePresetResponse>, 'draft'> & {
    draft?: Partial<ProviderServicePresetResponse['draft']>;
  } = {},
): ProviderServicePresetResponse {
  const { draft: draftOverrides, ...presetOverrides } = overrides;

  return {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'preset-default',
    name: 'Preset par défaut',
    description: 'Description par défaut du preset.',
    displayOrder: 1,
    ...presetOverrides,
    draft: {
      ...BASE_PRESET_DRAFT,
      ...draftOverrides,
    },
  };
}

function mockProfileQuery(overrides?: Partial<ReturnType<typeof mockUseMyProviderProfile>>) {
  mockUseMyProviderProfile.mockReturnValue({
    data: createProfile('nutrition'),
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

function mockPresetsQuery(overrides?: Partial<ReturnType<typeof mockUseMyServicePresets>>) {
  mockUseMyServicePresets.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

function mockAddServiceHook(overrides?: Partial<ReturnType<typeof mockUseAddService>>) {
  mockUseAddService.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({ id: 'service-1' }),
    loading: false,
    error: null,
    data: null,
    reset: vi.fn(),
    ...overrides,
  });
}

function mockServicesQuery(overrides?: Partial<ReturnType<typeof mockUseMyServices>>) {
  mockUseMyServices.mockReturnValue({
    data: {
      items: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
      },
    },
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

function mockUpdateServiceHook(overrides?: Partial<ReturnType<typeof mockUseUpdateService>>) {
  mockUseUpdateService.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({ id: 'service-1' }),
    loading: false,
    error: null,
    data: null,
    reset: vi.fn(),
    ...overrides,
  });
}

function mockMutationHooks() {
  mockUseToggleService.mockReturnValue({ mutate: vi.fn() });
  mockUpdateServiceHook();
  mockUseRemoveService.mockReturnValue({ mutate: vi.fn() });
}

function mockNutritionLookups(overrides?: {
  dietTypes?: Partial<ReturnType<typeof mockUseNutritionDietTypes>>;
  subcategories?: Partial<ReturnType<typeof mockUseNutritionSubcategories>>;
}) {
  mockUseNutritionDietTypes.mockReturnValue({
    data: [
      { code: 'diabetic', label: 'Diabétique live' },
      { code: 'low_salt', label: 'Faible en sel live' },
    ],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides?.dietTypes,
  });

  mockUseNutritionSubcategories.mockReturnValue({
    data: [
      { code: 'meal_delivery', label: 'Livraison live' },
      { code: 'consultation', label: 'Consultation live' },
    ],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides?.subcategories,
  });
}

function mockAmbulanceLookup(overrides?: Partial<ReturnType<typeof mockUseAmbulanceServiceTypes>>) {
  mockUseAmbulanceServiceTypes.mockReturnValue({
    data: [{ code: 'emergency', label: 'Urgence live' }],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

function mockVeterinaryLookup(
  overrides?: Partial<ReturnType<typeof mockUseVeterinaryAnimalTypes>>,
) {
  mockUseVeterinaryAnimalTypes.mockReturnValue({
    data: [{ code: 'dog', label: 'Chien live' }],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

describe('NewServicePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfileQuery();
    mockPresetsQuery();
    mockAddServiceHook();
    mockServicesQuery();
    mockMutationHooks();
    mockNutritionLookups();
    mockAmbulanceLookup();
    mockVeterinaryLookup();
  });

  it.each([
    ['doctor', 'Médecin'],
    ['maternity', 'Maternité'],
    ['night_care', 'Garde de Nuit'],
    ['gym', 'Salle de Sport'],
    ['checkup', 'Bilan de Santé'],
    ['chronic_care', 'Soins Chroniques'],
    ['medical_companion', 'Accompagnement Médical'],
    ['babysitting', "Garde d'Enfants"],
  ] as const)('renders the shared fallback form for %s providers', (serviceType, title) => {
    mockProfileQuery({
      data: createProfile(serviceType),
    });

    renderWithProviders(<NewServicePage />);

    expect(screen.getByRole('heading', { name: /^nouveau service$/i })).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom du service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disponible en urgence/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^enregistrer$/i })).toBeEnabled();
    expect(
      screen.queryByText(/aucune catégorie exploitable pour créer un service/i),
    ).not.toBeInTheDocument();
  });

  it('blocks authoring while the live provider profile query is still loading', () => {
    mockProfileQuery({
      data: null,
      loading: true,
    });

    renderWithProviders(<NewServicePage />);

    expect(screen.getByRole('status')).toHaveTextContent(/chargement du profil prestataire/i);
    expect(screen.queryByRole('button', { name: /^enregistrer$/i })).not.toBeInTheDocument();
  });

  it('blocks submit on lookup failure and exposes an in-page retry path', async () => {
    const refetch = vi.fn().mockResolvedValue(undefined);
    mockProfileQuery({
      data: createProfile('ambulance'),
    });
    mockAmbulanceLookup({
      data: null,
      loading: false,
      error: new Error('Types ambulance indisponibles'),
      refetch,
    });

    const { user } = renderWithProviders(<NewServicePage />);

    expect(screen.getByRole('alert')).toHaveTextContent('Types ambulance indisponibles');
    expect(screen.getByRole('button', { name: /^enregistrer$/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('shows preset cards for a fallback category (doctor) when presets exist', () => {
    mockProfileQuery({
      data: createProfile('doctor'),
    });
    mockPresetsQuery({
      data: [
        createPreset({
          id: '44444444-4444-4444-4444-444444444444',
          code: 'doctor-home-visit',
          name: 'Consultation générale',
        }),
        createPreset({
          id: '55555555-5555-5555-5555-555555555555',
          code: 'doctor-follow-up',
          name: 'Visite de suivi',
          displayOrder: 2,
        }),
      ],
    });

    renderWithProviders(<NewServicePage />);

    expect(screen.getByRole('heading', { name: /suggestions/i })).toBeInTheDocument();
    expect(screen.getByText('Consultation générale')).toBeInTheDocument();
    expect(screen.getByText('Visite de suivi')).toBeInTheDocument();
  });

  it('hides preset panel when presets array is empty', () => {
    mockProfileQuery({
      data: createProfile('doctor'),
    });
    mockPresetsQuery({
      data: [],
    });

    renderWithProviders(<NewServicePage />);

    expect(screen.queryByRole('heading', { name: /suggestions/i })).not.toBeInTheDocument();
  });

  it('save button remains enabled when preset fetch errors', () => {
    mockProfileQuery({
      data: createProfile('doctor'),
    });
    mockPresetsQuery({
      data: [],
      error: new Error('network'),
    });

    renderWithProviders(<NewServicePage />);

    expect(screen.getByRole('button', { name: /^enregistrer$/i })).toBeEnabled();
  });

  it('applies a preset with null typeConfig without leaking stale fallback values', async () => {
    mockProfileQuery({
      data: createProfile('doctor'),
    });
    mockPresetsQuery({
      data: [
        createPreset({
          name: 'Visite de suivi à domicile',
          description: 'Contrôle post-traitement',
          draft: {
            price: 75,
            durationMinutes: 25,
            serviceLocation: 'home',
            requiresPrescription: false,
            isUrgent: false,
            typeConfig: null,
          },
        }),
      ],
    });

    const { user } = renderWithProviders(<NewServicePage />);

    await user.type(screen.getByLabelText(/nom du service/i), 'Ancienne saisie');
    await user.selectOptions(screen.getByLabelText(/lieu d'intervention/i), 'online');
    await user.click(screen.getByLabelText(/disponible en urgence/i));
    await user.click(screen.getByText('Visite de suivi à domicile'));

    expect(screen.getByLabelText(/nom du service/i)).toHaveValue('Visite de suivi à domicile');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Contrôle post-traitement');
    expect(screen.getByLabelText(/prix \(tnd\)/i)).toHaveValue(75);
    expect(screen.getByLabelText(/durée \(min\)/i)).toHaveValue(25);
    expect(screen.getByLabelText(/lieu d'intervention/i)).toHaveValue('home');
    expect(screen.getByLabelText(/disponible en urgence/i)).not.toBeChecked();
  });

  it('applies nutrition presets truthfully and submits hidden draft overrides', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({ id: 'service-1' });
    mockAddServiceHook({ mutateAsync });
    mockProfileQuery({
      data: createProfile('nutrition'),
    });
    mockPresetsQuery({
      data: [
        createPreset({
          id: '66666666-6666-6666-6666-666666666666',
          code: 'nutrition-weight-loss',
          name: 'Programme minceur premium',
          description: 'Accompagnement nutritionnel intensif.',
          draft: {
            price: 150,
            priceType: 'hourly',
            currency: 'EUR',
            durationMinutes: 45,
            serviceLocation: 'online',
            requiresPrescription: true,
            isUrgent: true,
            requiresMedicalHistory: true,
            typeConfig: {
              subcategoryCode: 'meal_delivery',
              dietTypes: ['diabetic'],
            },
          },
        }),
      ],
    });

    const { user } = renderWithProviders(<NewServicePage />);

    await user.type(screen.getByLabelText(/nom du service/i), 'Brouillon manuel');
    await user.selectOptions(screen.getByLabelText(/sous-catégorie/i), 'consultation');
    await user.click(screen.getByRole('checkbox', { name: /faible en sel live/i }));
    await user.click(screen.getByText('Programme minceur premium'));

    expect(screen.getByLabelText(/nom du service/i)).toHaveValue('Programme minceur premium');
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      'Accompagnement nutritionnel intensif.',
    );
    expect(screen.getByLabelText(/prix \(tnd\)/i)).toHaveValue(150);
    expect(screen.getByLabelText(/durée \(min\)/i)).toHaveValue(45);
    expect(screen.getByLabelText(/sous-catégorie/i)).toHaveValue('meal_delivery');
    expect(screen.getByRole('checkbox', { name: /diabétique live/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /faible en sel live/i })).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: /^enregistrer$/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Programme minceur premium',
          price: 150,
          priceType: 'hourly',
          currency: 'EUR',
          durationMinutes: 45,
          serviceLocation: 'online',
          requiresPrescription: true,
          requiresMedicalHistory: true,
          isUrgent: true,
          typeConfig: {
            subcategoryCode: 'meal_delivery',
            dietTypes: ['diabetic'],
          },
        }),
      );
    });
  });

  it('submits nutrition services with live lookup codes and an object typeConfig payload', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({ id: 'service-1' });
    mockAddServiceHook({ mutateAsync });
    mockProfileQuery({
      data: createProfile('nutrition'),
    });

    const { user } = renderWithProviders(<NewServicePage />);

    expect(screen.getByText('Faible en sel live')).toBeInTheDocument();
    expect(screen.queryByText('Pauvre en sel')).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Livraison live' })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nom du service/i), 'Menu thérapeutique');
    await user.type(screen.getByLabelText(/prix \(tnd\)/i), '95');
    await user.selectOptions(screen.getByLabelText(/sous-catégorie/i), 'meal_delivery');
    await user.click(screen.getByRole('checkbox', { name: /diabétique live/i }));
    await user.click(screen.getByRole('checkbox', { name: /faible en sel live/i }));
    await user.click(screen.getByRole('button', { name: /^enregistrer$/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Menu thérapeutique',
          price: 95,
          priceType: 'fixed',
          currency: 'TND',
          serviceLocation: 'home',
          requiresPrescription: false,
          requiresMedicalHistory: false,
          isUrgent: false,
          typeConfig: {
            subcategoryCode: 'meal_delivery',
            dietTypes: ['diabetic', 'low_salt'],
          },
        }),
      );
    });

    const submittedPayload = mutateAsync.mock.calls[0][0] as Record<string, unknown>;
    expect(submittedPayload.typeConfig).toStrictEqual({
      subcategoryCode: 'meal_delivery',
      dietTypes: ['diabetic', 'low_salt'],
    });
    expect(typeof submittedPayload.typeConfig).toBe('object');
    expect(mockShowSuccessToast).toHaveBeenCalledWith('Service créé avec succès.');
  });
});

describe('buildCreatePayload', () => {
  it('buildCreatePayload includes isUrgent as top-level field when checked', () => {
    const payload = buildCreatePayload(
      {
        name: 'Consultation à domicile',
        price: '120',
        isUrgent: true,
      },
      'doctor',
    );

    expect(payload).toEqual(
      expect.objectContaining({
        name: 'Consultation à domicile',
        price: 120,
        serviceLocation: 'home',
        requiresPrescription: false,
        requiresMedicalHistory: false,
        isUrgent: true,
      }),
    );
    expect(payload).not.toHaveProperty('typeConfig.isUrgent');
  });

  it('buildCreatePayload veterinary sets isUrgent from emergency24h', () => {
    const payload = buildCreatePayload(
      {
        name: 'Urgence vétérinaire',
        price: '220',
        animalTypes: ['dog', 'cat'],
        homeVisit: true,
        emergency24h: true,
      },
      'veterinary',
    );

    expect(payload.isUrgent).toBe(true);
    expect(payload.typeConfig).toEqual({
      animalTypes: ['dog', 'cat'],
      homeVisit: true,
      emergency24h: true,
    });
    expect(payload).not.toHaveProperty('typeConfig.isUrgent');
  });

  it('buildCreatePayload defaults isUrgent to false when unchecked', () => {
    const payload = buildCreatePayload(
      {
        name: 'Soin à domicile',
        price: '50',
      },
      'nursing',
    );

    expect(payload.isUrgent).toBe(false);
    expect(payload.requiresMedicalHistory).toBe(false);
  });

  it('buildCreatePayload carries preset draft overrides', () => {
    const payload = buildCreatePayload(
      {
        name: 'Consultation experte',
        price: '130',
      },
      'doctor',
      {
        priceType: 'hourly',
        currency: 'EUR',
        requiresMedicalHistory: true,
      },
    );

    expect(payload).toEqual(
      expect.objectContaining({
        name: 'Consultation experte',
        price: 130,
        priceType: 'hourly',
        currency: 'EUR',
        requiresMedicalHistory: true,
      }),
    );
  });
});
