import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NutritionProvidersPage } from '@/pages/services/NutritionProvidersPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { ProviderResponse } from '@/features/providers/schema';

const { mockUseNutritionProviders, mockUseProviderFilterOptions } = vi.hoisted(() => ({
  mockUseNutritionProviders: vi.fn(),
  mockUseProviderFilterOptions: vi.fn(),
}));

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    ProviderContactModal: () => null,
    useNutritionProviders: mockUseNutritionProviders,
    useProviderFilterOptions: mockUseProviderFilterOptions,
  };
});

const BASE_PROVIDER: ProviderResponse = {
  id: '00000000-0000-0000-0000-000000000000',
  serviceCategory: 'nutrition',
  nutritionProviderSubtype: null,
  isIndividual: false,
  businessName: 'Provider',
  firstName: null,
  lastName: null,
  bio: null,
  shortDescription: 'Repas adaptés à domicile.',
  addressLine1: '1 Rue de Tunis',
  city: 'Tunis',
  countryCode: 'TN',
  ratingAverage: 4.7,
  ratingCount: 18,
  isVerified: true,
  isAvailable: true,
  availabilityStatus: 'available',
  profilePictureUrl: null,
  createdAt: '2026-04-13T10:00:00Z',
  minPrice: 45,
  serviceCount: 3,
  specialties: ['Repas santé'],
};

function createProvider(overrides: Partial<ProviderResponse>): ProviderResponse {
  return {
    ...BASE_PROVIDER,
    ...overrides,
  };
}

const NUTRITION_PROVIDERS: ProviderResponse[] = [
  createProvider({
    id: 'provider-restaurant',
    businessName: 'Restaurant Santé',
    nutritionProviderSubtype: 'Restaurant',
    shortDescription: 'Menus diététiques prêts à livrer.',
  }),
  createProvider({
    id: 'provider-chef',
    businessName: 'Chef Amal',
    city: 'Sousse',
    nutritionProviderSubtype: 'Chef',
    shortDescription: 'Chef privé spécialisé en repas thérapeutiques.',
  }),
  createProvider({
    id: 'provider-nutritionist',
    businessName: 'Studio Nutrition',
    city: 'Nabeul',
    nutritionProviderSubtype: 'Nutritionist',
    shortDescription: 'Accompagnement nutritionnel personnalisé.',
  }),
  createProvider({
    id: 'provider-generic',
    businessName: 'Cuisine Flexible',
    nutritionProviderSubtype: null,
    shortDescription: 'Repas équilibrés sans sous-type déclaré.',
  }),
];

function LocationStatus() {
  const location = useLocation();

  return <output role="status">{location.pathname}</output>;
}

function mockNutritionProviders(overrides?: Record<string, unknown>) {
  mockUseNutritionProviders.mockReturnValue({
    providers: NUTRITION_PROVIDERS,
    data: {
      items: NUTRITION_PROVIDERS,
      pagination: {
        page: 1,
        limit: 20,
        total: NUTRITION_PROVIDERS.length,
        totalPages: 1,
      },
    },
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    isRefreshing: false,
    isPlaceholderData: false,
    ...overrides,
  });
}

interface ProviderFilterOptionsTestData {
  cities: string[];
  specialties: string[];
  nutritionProviderSubtypes: string[];
}

function createFilterOptionsResult(overrides: Partial<ProviderFilterOptionsTestData> = {}) {
  const options: ProviderFilterOptionsTestData = {
    cities: ['Nabeul', 'Sousse', 'Tunis'],
    specialties: [],
    nutritionProviderSubtypes: ['Restaurant', 'Chef', 'Nutritionist'],
    ...overrides,
  };

  return {
    data: options,
    cities: options.cities,
    specialties: options.specialties,
    nutritionProviderSubtypes: options.nutritionProviderSubtypes,
    loading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
}

describe('NutritionProvidersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNutritionProviders();
    mockUseProviderFilterOptions.mockReturnValue(createFilterOptionsResult());
  });

  it('renders localized subtype chips and keeps null-subtype providers only under Tous', async () => {
    const { user } = renderWithProviders(
      <>
        <NutritionProvidersPage />
        <LocationStatus />
      </>,
      { route: '/nutrition/providers' },
    );

    expect(screen.getByRole('button', { name: 'Tous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restaurant diététique' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chef à domicile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nutritionniste' })).toBeInTheDocument();

    expect(screen.getByText('Restaurant Santé')).toBeInTheDocument();
    expect(screen.getByText('Chef Amal')).toBeInTheDocument();
    expect(screen.getByText('Studio Nutrition')).toBeInTheDocument();
    expect(screen.getByText('Cuisine Flexible')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Restaurant diététique' }));

    expect(screen.getByText('Restaurant Santé')).toBeInTheDocument();
    expect(screen.queryByText('Chef Amal')).not.toBeInTheDocument();
    expect(screen.queryByText('Studio Nutrition')).not.toBeInTheDocument();
    expect(screen.queryByText('Cuisine Flexible')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /réserver/i })).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Tous' }));

    expect(screen.getByText('Restaurant Santé')).toBeInTheDocument();
    expect(screen.getByText('Chef Amal')).toBeInTheDocument();
    expect(screen.getByText('Studio Nutrition')).toBeInTheDocument();
    expect(screen.getByText('Cuisine Flexible')).toBeInTheDocument();
  });

  it('derives zone options from the live provider list', async () => {
    renderWithProviders(<NutritionProvidersPage />, { route: '/nutrition/providers' });

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Zone géographique' }), {
      key: 'ArrowDown',
    });
    const optionLabels = (await screen.findAllByRole('option')).map((option) =>
      option.textContent?.trim(),
    );

    expect(optionLabels).toHaveLength(4);
    expect(optionLabels).toEqual(
      expect.arrayContaining(['Toutes les zones', 'Nabeul', 'Sousse', 'Tunis']),
    );
  });

  it('navigates to nutrition booking from the filtered provider set', async () => {
    const { user } = renderWithProviders(
      <>
        <NutritionProvidersPage />
        <LocationStatus />
      </>,
      { route: '/nutrition/providers' },
    );

    await user.click(screen.getByRole('button', { name: 'Restaurant diététique' }));
    await user.click(screen.getByRole('button', { name: /réserver/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        '/nutrition/booking/provider-restaurant',
      );
    });
  });
});
