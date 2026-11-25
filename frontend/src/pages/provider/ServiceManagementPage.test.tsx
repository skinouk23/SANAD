import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceManagementPage } from '@/pages/provider/ServiceManagementPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { ProviderProfileResponse } from '@/features/providers/schema';
import type { ServiceSummaryResponse } from '@/features/services/schema';

const {
  mockUseMyProviderProfile,
  mockUseMyServices,
  mockUseToggleService,
  mockUseUpdateService,
  mockUseRemoveService,
  mockUseNutritionDietTypes,
  mockUseNutritionSubcategories,
  mockUseAmbulanceServiceTypes,
  mockUseVeterinaryAnimalTypes,
  mockToggleMutate,
  mockUpdateMutate,
  mockRemoveMutate,
} = vi.hoisted(() => ({
  mockUseMyProviderProfile: vi.fn(),
  mockUseMyServices: vi.fn(),
  mockUseToggleService: vi.fn(),
  mockUseUpdateService: vi.fn(),
  mockUseRemoveService: vi.fn(),
  mockUseNutritionDietTypes: vi.fn(),
  mockUseNutritionSubcategories: vi.fn(),
  mockUseAmbulanceServiceTypes: vi.fn(),
  mockUseVeterinaryAnimalTypes: vi.fn(),
  mockToggleMutate: vi.fn(),
  mockUpdateMutate: vi.fn(),
  mockRemoveMutate: vi.fn(),
}));

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    useMyProviderProfile: mockUseMyProviderProfile,
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

const BASE_PROFILE: ProviderProfileResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: '22222222-2222-2222-2222-222222222222',
  serviceType: 'checkup',
  nutritionProviderSubtype: null,
  businessName: 'Bilan Santé Tunis',
  firstName: 'Amal',
  lastName: 'Trabelsi',
  licenseNumber: 'LIC-42',
  specialization: 'Prévention',
  yearsOfExperience: 8,
  bio: 'Bilans et suivis de santé.',
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

function createProfile(serviceType: ProviderProfileResponse['serviceType']) {
  return {
    ...BASE_PROFILE,
    serviceType,
    nutritionProviderSubtype: serviceType === 'nutrition' ? 'Chef' : null,
  } satisfies ProviderProfileResponse;
}

function createServiceSummary(overrides?: Partial<ServiceSummaryResponse>): ServiceSummaryResponse {
  return {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Bilan express',
    shortDescription: 'Suivi rapide à distance',
    description: 'Suivi rapide à distance',
    serviceLocation: 'home',
    category: 'checkup',
    price: 75,
    priceType: 'fixed',
    currency: 'TND',
    durationMinutes: 30,
    isActive: true,
    isFeatured: false,
    isUrgent: false,
    requiresPrescription: false,
    imageUrl: null,
    bookingCount: 0,
    availableQuantity: null,
    typeConfig: null,
    subServiceCount: 0,
    createdAt: '2026-04-13T10:00:00Z',
    ...overrides,
  } satisfies ServiceSummaryResponse;
}

function mockProfileQuery(overrides?: Partial<ReturnType<typeof mockUseMyProviderProfile>>) {
  mockUseMyProviderProfile.mockReturnValue({
    data: createProfile('checkup'),
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });
}

function mockServicesQuery(items: ServiceSummaryResponse[]) {
  mockUseMyServices.mockReturnValue({
    data: {
      items,
      pagination: {
        page: 1,
        limit: 20,
        total: items.length,
        totalPages: 1,
      },
    },
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });
}

function mockMutationHooks() {
  mockToggleMutate.mockReset();
  mockUpdateMutate.mockReset();
  mockRemoveMutate.mockReset();

  mockUpdateMutate.mockResolvedValue({ id: 'service-1' });

  mockUseToggleService.mockReturnValue({ mutate: mockToggleMutate });
  mockUseUpdateService.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: mockUpdateMutate,
    loading: false,
    error: null,
    data: null,
    reset: vi.fn(),
  });
  mockUseRemoveService.mockReturnValue({ mutate: mockRemoveMutate });
}

function mockLookupHooks() {
  mockUseNutritionDietTypes.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });
  mockUseNutritionSubcategories.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });
  mockUseAmbulanceServiceTypes.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });
  mockUseVeterinaryAnimalTypes.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });
}

function getActiveServicesSection() {
  const heading = screen.getByRole('heading', { name: /services actifs/i });

  if (!heading.parentElement) {
    throw new Error('Active services section not found.');
  }

  return within(heading.parentElement);
}

describe('ServiceManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfileQuery();
    mockServicesQuery([]);
    mockMutationHooks();
    mockLookupHooks();
  });

  it('renders fallback category management without the false blocker', () => {
    mockProfileQuery({
      data: createProfile('checkup'),
    });

    renderWithProviders(<ServiceManagementPage />);

    expect(screen.getByText(/^Bilan de Santé$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows online location plus urgency and prescription badges on service cards', () => {
    mockServicesQuery([
      createServiceSummary({
        serviceLocation: 'online',
        requiresPrescription: true,
        isUrgent: true,
      }),
    ]);

    renderWithProviders(<ServiceManagementPage />);

    const activeServices = getActiveServicesSection();

    expect(activeServices.getByText(/^En ligne$/i)).toBeInTheDocument();
    expect(activeServices.getByText(/urgence/i)).toBeInTheDocument();
    expect(activeServices.getByText(/ordonnance/i)).toBeInTheDocument();
  });

  it("shows the 'both' location as Domicile et cabinet", () => {
    mockServicesQuery([
      createServiceSummary({
        serviceLocation: 'both',
      }),
    ]);

    renderWithProviders(<ServiceManagementPage />);

    expect(getActiveServicesSection().getByText(/^Domicile et cabinet$/i)).toBeInTheDocument();
  });

  it('sends fallback fields in the update payload when saving edits', async () => {
    const user = userEvent.setup();
    const service = createServiceSummary({
      serviceLocation: 'home',
      requiresPrescription: false,
      isUrgent: false,
    });

    mockServicesQuery([service]);

    renderWithProviders(<ServiceManagementPage />);

    await user.click(screen.getByRole('button', { name: /modifier bilan express/i }));
    await user.selectOptions(screen.getByLabelText(/lieu d'intervention/i), 'online');
    await user.click(screen.getByRole('checkbox', { name: /disponible en urgence/i }));
    await user.click(screen.getByRole('checkbox', { name: /ordonnance requise/i }));
    await user.click(screen.getByRole('button', { name: /^enregistrer$/i }));

    await waitFor(() => expect(mockUpdateMutate).toHaveBeenCalledTimes(1));

    expect(mockUpdateMutate).toHaveBeenCalledWith({
      id: service.id,
      data: expect.objectContaining({
        serviceLocation: 'online',
        requiresPrescription: true,
        isUrgent: true,
      }),
    });
  });

  it('sends explicit false values when urgent and prescription are unchecked', async () => {
    const user = userEvent.setup();
    const service = createServiceSummary({
      requiresPrescription: true,
      isUrgent: true,
    });

    mockServicesQuery([service]);

    renderWithProviders(<ServiceManagementPage />);

    await user.click(screen.getByRole('button', { name: /modifier bilan express/i }));

    const urgentCheckbox = screen.getByRole('checkbox', { name: /disponible en urgence/i });
    const prescriptionCheckbox = screen.getByRole('checkbox', { name: /ordonnance requise/i });

    expect(urgentCheckbox).toBeChecked();
    expect(prescriptionCheckbox).toBeChecked();

    await user.click(urgentCheckbox);
    await user.click(prescriptionCheckbox);
    await user.click(screen.getByRole('button', { name: /^enregistrer$/i }));

    await waitFor(() => expect(mockUpdateMutate).toHaveBeenCalledTimes(1));

    const payload = mockUpdateMutate.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };

    expect(payload.data).toHaveProperty('requiresPrescription', false);
    expect(payload.data).toHaveProperty('isUrgent', false);
  });
});
