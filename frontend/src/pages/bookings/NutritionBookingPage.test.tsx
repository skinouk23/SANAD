import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProviderResponse } from '@/features/providers/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import { NutritionBookingPage } from '@/pages/bookings/NutritionBookingPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockUseAvailability,
  mockUseBookingProvider,
  mockUseBookingQuote,
  mockUseBookingSubmission,
  mockUseMonthAvailability,
  mockUseServiceCatalog,
} = vi.hoisted(() => ({
  mockUseAvailability: vi.fn(),
  mockUseBookingProvider: vi.fn(),
  mockUseBookingQuote: vi.fn(),
  mockUseBookingSubmission: vi.fn(),
  mockUseMonthAvailability: vi.fn(),
  mockUseServiceCatalog: vi.fn(),
}));

vi.mock('@/features/bookings/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/hooks')>(
    '@/features/bookings/hooks',
  );

  return {
    ...actual,
    useAvailability: mockUseAvailability,
    useBookingProvider: mockUseBookingProvider,
    useBookingQuote: mockUseBookingQuote,
    useBookingSubmission: mockUseBookingSubmission,
    useMonthAvailability: mockUseMonthAvailability,
  };
});

vi.mock('@/features/services', async () => {
  const actual = await vi.importActual<typeof import('@/features/services')>('@/features/services');

  return {
    ...actual,
    useServiceCatalog: mockUseServiceCatalog,
  };
});

vi.mock('@/features/bookings/flow/ui', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/flow/ui')>(
    '@/features/bookings/flow/ui',
  );

  return {
    ...actual,
    MonthCalendar: ({ maxDate }: { maxDate?: string }) => (
      <div data-testid="month-calendar-max-date">{maxDate ?? 'none'}</div>
    ),
  };
});

// ============================================
// FIXTURES
// ============================================

const BASE_PROVIDER: ProviderResponse = {
  id: '00000000-0000-0000-0000-000000000111',
  serviceCategory: 'nutrition',
  nutritionProviderSubtype: 'Restaurant',
  isIndividual: false,
  businessName: 'Maison Nutrition Santé',
  firstName: null,
  lastName: null,
  bio: null,
  shortDescription: 'Prestataire nutritionnel spécialisé.',
  addressLine1: '1 Rue du Lac',
  city: 'Tunis',
  countryCode: 'TN',
  ratingAverage: 4.9,
  ratingCount: 24,
  isVerified: true,
  isAvailable: true,
  availabilityStatus: 'available',
  profilePictureUrl: null,
  createdAt: '2026-04-13T10:00:00Z',
  minPrice: 35,
  serviceCount: 3,
  specialties: ['Nutrition'],
};

const BASE_SERVICE: PatientServiceItemResponse = {
  id: '10000000-0000-0000-0000-000000000001',
  name: 'Service nutrition',
  shortDescription: 'Description du service nutritionnel.',
  category: 'nutrition',
  price: 45,
  priceType: 'fixed',
  currency: 'TND',
  serviceLocation: 'clinic',
  requiresPrescription: false,
  durationMinutes: 45,
  imageUrl: null,
  typeConfig: null,
  subServices: [],
  provider: {
    id: BASE_PROVIDER.id,
    name: BASE_PROVIDER.businessName,
    city: BASE_PROVIDER.city,
    rating: 4.9,
    reviewCount: 24,
    isVerified: BASE_PROVIDER.isVerified,
  },
};

function createProvider(overrides: Partial<ProviderResponse> = {}): ProviderResponse {
  return {
    ...BASE_PROVIDER,
    ...overrides,
  };
}

function createService(
  overrides: Partial<PatientServiceItemResponse> = {},
): PatientServiceItemResponse {
  return {
    ...BASE_SERVICE,
    ...overrides,
  };
}

function mockBookingPage(options?: {
  provider?: ProviderResponse;
  services?: PatientServiceItemResponse[];
}) {
  const provider = options?.provider ?? createProvider();
  const services = options?.services ?? [
    createService({
      id: '10000000-0000-0000-0000-000000000010',
      name: 'Consultation nutritionnelle',
      typeConfig: { subcategoryCode: 'consultation' },
    }),
    createService({
      id: '10000000-0000-0000-0000-000000000020',
      name: 'Plan alimentaire 7 jours',
      typeConfig: { subcategoryCode: 'meal-plan' },
    }),
    createService({
      id: '10000000-0000-0000-0000-000000000030',
      name: 'Coaching nutrition sportive',
      typeConfig: { subcategoryCode: 'sports-nutrition' },
    }),
  ];

  mockUseBookingProvider.mockReturnValue({
    provider,
    loading: false,
    error: null,
    fromState: false,
  });

  mockUseServiceCatalog.mockReturnValue({
    data: null,
    items: services,
    pagination: null,
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });

  mockUseMonthAvailability.mockReturnValue({
    days: [],
    loading: false,
    error: null,
    timezone: null,
    maxBookableDate: '2027-04-13',
    refetch: vi.fn().mockResolvedValue(undefined),
  });

  mockUseAvailability.mockReturnValue({
    availableStartTimes: [],
    availabilityLoading: false,
    availabilityError: null,
    availabilityErrorMessage: null,
    rangeAvailability: null,
    bookingTime: '',
    setBookingTime: vi.fn(),
  });

  mockUseBookingQuote.mockReturnValue({
    quote: undefined,
    quoteLoading: false,
    quoteError: null,
    refetchQuote: vi.fn().mockResolvedValue(undefined),
  });

  mockUseBookingSubmission.mockReturnValue({
    submit: vi.fn().mockResolvedValue(null),
    isSubmitting: false,
    bookingResult: null,
    reset: vi.fn(),
  });
}

function renderBookingPage(routeProviderId = BASE_PROVIDER.id) {
  return renderWithProviders(
    <Routes>
      <Route path="/nutrition/booking/:providerId" element={<NutritionBookingPage />} />
    </Routes>,
    { route: `/nutrition/booking/${routeProviderId}` },
  );
}

// ============================================
// TESTS
// ============================================

describe('NutritionBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBookingPage();
  });

  it('forwards maxBookableDate to MonthCalendar', () => {
    renderBookingPage();

    expect(screen.getByTestId('month-calendar-max-date')).toHaveTextContent('2027-04-13');
  });

  it('renders the provider subtype badge', () => {
    renderBookingPage();

    expect(screen.getByText('Maison Nutrition Santé')).toBeInTheDocument();
    expect(screen.getByText('Restaurant diététique')).toBeInTheDocument();
  });

  it('does not render service-type filter heading', () => {
    renderBookingPage();

    expect(screen.queryByText(/filtrer par type/i)).not.toBeInTheDocument();
  });

  it('renders all nutrition services as flat cards without filtering', () => {
    renderBookingPage();

    expect(screen.getByText('Consultation nutritionnelle')).toBeInTheDocument();
    expect(screen.getByText('Plan alimentaire 7 jours')).toBeInTheDocument();
    expect(screen.getByText('Coaching nutrition sportive')).toBeInTheDocument();
  });

  it('omits the subtype badge when the provider has no nutrition subtype', () => {
    mockBookingPage({
      provider: createProvider({
        id: '00000000-0000-0000-0000-000000000222',
        nutritionProviderSubtype: null,
        businessName: 'Prestataire Nutrition Sans Sous-type',
      }),
    });

    renderBookingPage('00000000-0000-0000-0000-000000000222');

    expect(screen.getByText('Prestataire Nutrition Sans Sous-type')).toBeInTheDocument();
    expect(screen.queryByText('Restaurant diététique')).not.toBeInTheDocument();
  });
});
