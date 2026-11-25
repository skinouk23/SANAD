import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { VeterinaryBookingPage } from '@/pages/bookings/VeterinaryBookingPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { ProviderResponse } from '@/features/providers/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { VeterinaryAnimalType } from '@/features/veterinary/service';

const {
  mockUseAvailability,
  mockUseBookingProvider,
  mockUseBookingQuote,
  mockUseBookingSubmission,
  mockUseMonthAvailability,
  mockUseServiceCatalog,
  mockUseVeterinaryAnimalTypes,
} = vi.hoisted(() => ({
  mockUseAvailability: vi.fn(),
  mockUseBookingProvider: vi.fn(),
  mockUseBookingQuote: vi.fn(),
  mockUseBookingSubmission: vi.fn(),
  mockUseMonthAvailability: vi.fn(),
  mockUseServiceCatalog: vi.fn(),
  mockUseVeterinaryAnimalTypes: vi.fn(),
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

vi.mock('@/features/veterinary/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/features/veterinary/hooks')>(
    '@/features/veterinary/hooks',
  );

  return {
    ...actual,
    useVeterinaryAnimalTypes: mockUseVeterinaryAnimalTypes,
  };
});

vi.mock('@/features/providers/public-api', async () => {
  const actual = await vi.importActual<typeof import('@/features/providers/public-api')>(
    '@/features/providers/public-api',
  );

  return {
    ...actual,
    getProviderDisplayName: (provider: Record<string, unknown>) =>
      String(provider.displayName ?? provider.businessName ?? 'Clinique Vétérinaire Sanad'),
    getProviderLocation: (provider: Record<string, unknown>) =>
      String(provider.city ?? provider.addressLine1 ?? 'Tunis'),
  };
});

vi.mock('@/features/bookings/flow/ui', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/flow/ui')>(
    '@/features/bookings/flow/ui',
  );

  return {
    ...actual,
    BookingStepIndicator: () => null,
    BookingSuccessPanel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    PaymentStep: () => <div data-testid="payment-step" />,
    DaySlotPicker: ({
      slots,
      onSelectSlot,
    }: {
      slots: Array<{ value: string; label: string }>;
      onSelectSlot: (slot: string) => void;
    }) => (
      <div>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <button key={slot.value} type="button" onClick={() => onSelectSlot(slot.value)}>
              {slot.label}
            </button>
          ))
        ) : (
          <span>Aucun créneau</span>
        )}
      </div>
    ),
    MonthCalendar: ({
      maxDate,
      onSelectDate,
    }: {
      maxDate?: string;
      onSelectDate: (date: string) => void;
    }) => (
      <div>
        <div data-testid="month-calendar-max-date">{maxDate ?? 'none'}</div>
        <button type="button" onClick={() => onSelectDate('2026-04-20')}>
          Choisir une date
        </button>
      </div>
    ),
  };
});

const BASE_PROVIDER = {
  id: '00000000-0000-0000-0000-000000000111',
  displayName: 'Clinique Vétérinaire Sanad',
  city: 'Tunis',
  ratingAverage: 4.9,
  ratingCount: 18,
  isIndividual: false,
  isVerified: true,
  isAvailable: true,
  createdAt: '2024-01-01T00:00:00Z',
  specialties: ['Vétérinaire'],
} as unknown as ProviderResponse;

const BASE_QUOTE = {
  dayCount: 1,
  pricing: {
    bookingSubtotal: 75,
    platformFee: 10,
    totalAmount: 85,
    currency: 'TND',
  },
} as const;

const BASE_ANIMAL_TYPES: VeterinaryAnimalType[] = [
  { code: 'dog', label: 'Chien', icon: '🐕', color: null },
  { code: 'cat', label: 'Chat', icon: '🐈', color: null },
  { code: 'bird', label: 'Oiseau', icon: '🐦', color: null },
];

function createService(
  overrides: Partial<PatientServiceItemResponse> = {},
): PatientServiceItemResponse {
  return {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Consultation vétérinaire',
    shortDescription: 'Consultation et soins vétérinaires.',
    category: 'veterinary',
    price: 75,
    priceType: 'fixed',
    currency: 'TND',
    serviceLocation: 'both',
    requiresPrescription: false,
    isUrgent: false,
    durationMinutes: 45,
    imageUrl: null,
    typeConfig: { animalTypes: ['dog', 'cat'] },
    subServices: [],
    provider: {
      id: BASE_PROVIDER.id,
      name: 'Clinique Vétérinaire Sanad',
      city: 'Tunis',
      rating: 4.9,
      reviewCount: 18,
      isVerified: BASE_PROVIDER.isVerified,
    },
    ...overrides,
  } as PatientServiceItemResponse;
}

function mockVeterinaryBookingPage({
  provider = BASE_PROVIDER,
  services = [createService()],
  animalTypes = BASE_ANIMAL_TYPES,
  animalTypesLoading = false,
  animalTypesError = null,
  animalTypesRefetch = vi.fn().mockResolvedValue(undefined),
}: {
  provider?: ProviderResponse;
  services?: PatientServiceItemResponse[];
  animalTypes?: VeterinaryAnimalType[] | null;
  animalTypesLoading?: boolean;
  animalTypesError?: Error | null;
  animalTypesRefetch?: ReturnType<typeof vi.fn>;
} = {}) {
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

  mockUseVeterinaryAnimalTypes.mockReturnValue({
    data: animalTypes,
    loading: animalTypesLoading,
    error: animalTypesError,
    refetch: animalTypesRefetch,
  });

  mockUseMonthAvailability.mockReturnValue({
    days: [],
    loading: false,
    error: null,
    timezone: null,
    maxBookableDate: '2027-04-13',
  });

  mockUseAvailability.mockImplementation(
    (
      _providerId: string | undefined,
      params: { startDate: string; endDate: string; serviceIds: string[] } | null,
    ) => {
      const [bookingTime, setBookingTime] = useState('');
      const hasSelection = Boolean(params?.startDate && params?.serviceIds.length);

      return {
        availableStartTimes: hasSelection ? ['09:00'] : [],
        availabilityLoading: false,
        availabilityError: null,
        availabilityErrorMessage: '',
        rangeAvailability: hasSelection ? { dayCount: 1 } : null,
        bookingTime,
        setBookingTime,
      };
    },
  );

  mockUseBookingQuote.mockImplementation((request: BookingQuoteRequest | null) => ({
    quote: request ? BASE_QUOTE : undefined,
    quoteLoading: false,
    quoteError: null,
    refetchQuote: vi.fn().mockResolvedValue(undefined),
  }));

  mockUseBookingSubmission.mockReturnValue({
    submit: vi.fn().mockResolvedValue(null),
    isSubmitting: false,
    bookingResult: null,
  });

  return { animalTypesRefetch };
}

function renderBookingPage(routeProviderId = BASE_PROVIDER.id) {
  return renderWithProviders(
    <Routes>
      <Route path="/veterinary/booking/:providerId" element={<VeterinaryBookingPage />} />
    </Routes>,
    {
      initialEntries: [`/veterinary/booking/${routeProviderId}`],
    },
  );
}

function getLatestQuoteRequest(): BookingQuoteRequest {
  const requests = mockUseBookingQuote.mock.calls
    .map(([request]) => request)
    .filter((request): request is BookingQuoteRequest => request !== null && request !== undefined);

  expect(requests.length).toBeGreaterThan(0);

  return requests.at(-1) as BookingQuoteRequest;
}

describe('VeterinaryBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVeterinaryBookingPage();
  });

  it('forwards maxBookableDate to MonthCalendar', async () => {
    const { user } = renderBookingPage();

    await user.click(screen.getByRole('button', { name: /consultation vétérinaire/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    await user.click(screen.getByRole('button', { name: /chien/i }));
    await user.type(screen.getByPlaceholderText('Ex: Rex'), 'Rex');
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    await user.click(screen.getByRole('button', { name: /en clinique/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    expect(screen.getByTestId('month-calendar-max-date')).toHaveTextContent('2027-04-13');
  });

  it('renders urgency badges for urgent veterinary services', () => {
    mockVeterinaryBookingPage({
      services: [
        createService({
          id: '10000000-0000-0000-0000-000000000010',
          name: 'Consultation vétérinaire urgente',
          isUrgent: true,
        }),
        createService({
          id: '10000000-0000-0000-0000-000000000011',
          name: 'Consultation vétérinaire standard',
        }),
      ],
    });

    renderBookingPage();

    const urgentServiceCard = screen.getByRole('button', {
      name: /consultation vétérinaire urgente/i,
    });
    const standardServiceCard = screen.getByRole('button', {
      name: /consultation vétérinaire standard/i,
    });

    expect(within(urgentServiceCard).getByText('Urgence')).toBeInTheDocument();
    expect(within(standardServiceCard).queryByText('Urgence')).not.toBeInTheDocument();
  });

  it('filters lookup animal types by selected service metadata and forwards provider-site booking requests', async () => {
    const { user } = renderBookingPage();

    await user.click(screen.getByRole('button', { name: /consultation vétérinaire/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    expect(screen.getByRole('button', { name: /chien/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /oiseau/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /chien/i }));
    await user.type(screen.getByPlaceholderText('Ex: Rex'), 'Rex');
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    await user.click(screen.getByRole('button', { name: /en clinique/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    await user.click(screen.getByRole('button', { name: 'Choisir une date' }));
    await user.click(screen.getByRole('button', { name: '09:00' }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    await waitFor(() => {
      expect(getLatestQuoteRequest()).toMatchObject({
        patientLocationChoice: 'provider_site',
        typeConfig: {
          animalType: 'dog',
          animalName: 'Rex',
        },
      });
    });
  });

  it.each([
    {
      label: 'missing typeConfig',
      typeConfig: null,
    },
    {
      label: 'empty animalTypes',
      typeConfig: { animalTypes: [] },
    },
  ])('shows all lookup animal types when service metadata has $label', async ({ typeConfig }) => {
    mockVeterinaryBookingPage({
      services: [
        createService({
          id: '10000000-0000-0000-0000-000000000002',
          name: 'Service sans restriction animale',
          typeConfig,
        }),
      ],
    });

    const { user } = renderBookingPage();

    await user.click(screen.getByRole('button', { name: /service sans restriction animale/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    expect(screen.getByRole('button', { name: /chien/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /oiseau/i })).toBeInTheDocument();
  });

  it('shows a retryable error state when the animal-type lookup fails', async () => {
    const animalTypesRefetch = vi.fn().mockResolvedValue(undefined);

    mockVeterinaryBookingPage({
      animalTypes: null,
      animalTypesError: new Error('Le référentiel vétérinaire est indisponible.'),
      animalTypesRefetch,
    });

    const { user } = renderBookingPage();

    await user.click(screen.getByRole('button', { name: /consultation vétérinaire/i }));
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    expect(screen.getByText('Le référentiel vétérinaire est indisponible.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /chien/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(animalTypesRefetch).toHaveBeenCalledTimes(1);
  });
});
