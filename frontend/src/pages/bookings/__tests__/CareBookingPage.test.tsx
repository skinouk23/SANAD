import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { CareBookingPage } from '@/pages/bookings/CareBookingPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { ProviderResponse } from '@/features/providers/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';

const {
  mockUseBookingProvider,
  mockUseBookingQuote,
  mockUseBookingSubmission,
  mockUseCareAvailability,
  mockUseCareMonthAvailability,
  mockUseServiceCatalog,
  mockUseServiceCategories,
} = vi.hoisted(() => ({
  mockUseBookingProvider: vi.fn(),
  mockUseBookingQuote: vi.fn(),
  mockUseBookingSubmission: vi.fn(),
  mockUseCareAvailability: vi.fn(),
  mockUseCareMonthAvailability: vi.fn(),
  mockUseServiceCatalog: vi.fn(),
  mockUseServiceCategories: vi.fn(),
}));

vi.mock('@/features/bookings/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings/hooks')>(
    '@/features/bookings/hooks',
  );

  return {
    ...actual,
    useBookingProvider: mockUseBookingProvider,
    useBookingQuote: mockUseBookingQuote,
    useBookingSubmission: mockUseBookingSubmission,
    useCareAvailability: mockUseCareAvailability,
    useCareMonthAvailability: mockUseCareMonthAvailability,
  };
});

vi.mock('@/features/services', async () => {
  const actual = await vi.importActual<typeof import('@/features/services')>('@/features/services');

  return {
    ...actual,
    useServiceCatalog: mockUseServiceCatalog,
    useServiceCategories: mockUseServiceCategories,
  };
});

vi.mock('@/features/providers/public-api', async () => {
  const actual = await vi.importActual<typeof import('@/features/providers/public-api')>(
    '@/features/providers/public-api',
  );

  return {
    ...actual,
    getProviderDisplayName: (provider: Record<string, unknown>) =>
      String(provider.displayName ?? provider.businessName ?? 'Maison Care Santé'),
    getProviderImageUrl: () => null,
    providerKeys: {
      monthAvailability: (...args: unknown[]) => ['month-availability', ...args],
      rangeAvailability: (...args: unknown[]) => ['range-availability', ...args],
    },
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('@/integrations/maps/AddressPickerModal', () => ({
  AddressPickerModal: () => null,
}));

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
      onRangeSelect,
    }: {
      maxDate?: string;
      onRangeSelect: (startDate: string, endDate: string | null) => void;
    }) => (
      <div>
        <div data-testid="month-calendar-max-date">{maxDate ?? 'none'}</div>
        <button type="button" onClick={() => onRangeSelect('2026-04-20', '2026-04-22')}>
          Choisir une plage
        </button>
      </div>
    ),
    PrescriptionUploadGate: ({
      onFileReady,
    }: {
      required: boolean;
      onFileReady: (fileId: string | null) => void;
      isDark: boolean;
    }) => (
      <div>
        <p>Prescription gate</p>
        <button type="button" onClick={() => onFileReady('11111111-1111-1111-1111-111111111111')}>
          Simuler ordonnance valide
        </button>
        <button type="button" onClick={() => onFileReady(null)}>
          Simuler échec ordonnance
        </button>
      </div>
    ),
    ServiceLocationToggle: ({
      onLocationChange,
      selectedLocation,
    }: {
      selectedLocation: 'home' | 'provider_site' | null;
      onLocationChange: (location: 'home' | 'provider_site') => void;
      isDark: boolean;
    }) => (
      <div>
        <p>Choix du lieu</p>
        <button
          type="button"
          aria-pressed={selectedLocation === 'provider_site'}
          onClick={() => onLocationChange('provider_site')}
        >
          Choisir sur place
        </button>
        <button
          type="button"
          aria-pressed={selectedLocation === 'home'}
          onClick={() => onLocationChange('home')}
        >
          Choisir à domicile
        </button>
      </div>
    ),
  };
});

const BASE_PROVIDER = {
  id: '00000000-0000-0000-0000-000000000111',
  displayName: 'Maison Care Santé',
  ratingAverage: 4.9,
  ratingCount: 12,
  isIndividual: true,
  isVerified: true,
  isAvailable: true,
  createdAt: '2024-01-01T00:00:00Z',
  specialties: ['Aide à domicile'],
} as unknown as ProviderResponse;

const BASE_QUOTE = {
  dayCount: 3,
  pricing: {
    bookingSubtotal: 120,
    platformFee: 15,
    totalAmount: 135,
    currency: 'TND',
  },
} as const;

function createService(
  overrides: Partial<PatientServiceItemResponse> = {},
): PatientServiceItemResponse {
  return {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Aide quotidienne',
    shortDescription: 'Assistance pour les soins du quotidien.',
    category: 'care-daily',
    price: 80,
    currency: 'TND',
    serviceLocation: 'home',
    requiresPrescription: false,
    isUrgent: false,
    durationMinutes: 45,
    isActive: true,
    isFeatured: false,
    imageUrl: null,
    typeConfig: null,
    ...overrides,
  } as PatientServiceItemResponse;
}

function mockCareBookingPage({
  provider = BASE_PROVIDER,
  services = [createService()],
  servicesError = null,
}: {
  provider?: ProviderResponse;
  services?: PatientServiceItemResponse[];
  servicesError?: Error | null;
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
    error: servicesError,
    refetch: vi.fn().mockResolvedValue(undefined),
  });

  mockUseServiceCategories.mockReturnValue({
    data: [],
    allCategories: [{ code: 'care-daily', label: 'Soins à domicile' }],
    loading: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  });

  mockUseCareMonthAvailability.mockReturnValue({
    days: [],
    loading: false,
    error: null,
    timezone: null,
    maxBookableDate: '2027-04-13',
  });

  mockUseCareAvailability.mockImplementation(
    (
      _providerId: string | undefined,
      params: { startDate: string; endDate: string; serviceIds: string[] } | null,
    ) => {
      const [bookingTime, setBookingTime] = useState('');
      const hasSelection = Boolean(
        params?.startDate && params?.endDate && params?.serviceIds.length,
      );

      return {
        availableStartTimes: hasSelection ? ['09:00'] : [],
        availabilityLoading: false,
        availabilityError: null,
        availabilityErrorMessage: '',
        rangeAvailability: hasSelection ? { dayCount: 3 } : null,
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
}

function renderBookingPage(routeProviderId = BASE_PROVIDER.id) {
  return renderWithProviders(
    <Routes>
      <Route path="/care/:serviceId/booking/:providerId" element={<CareBookingPage />} />
    </Routes>,
    {
      initialEntries: [`/care/care-daily/booking/${routeProviderId}`],
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

async function completeStepOne(
  user: ReturnType<typeof renderWithProviders>['user'],
  serviceName: RegExp | string,
) {
  await user.click(screen.getByRole('button', { name: serviceName }));
  await user.click(screen.getByRole('button', { name: 'Choisir une plage' }));
  await user.click(screen.getByRole('button', { name: '09:00' }));
}

async function completeStepTwo(
  user: ReturnType<typeof renderWithProviders>['user'],
  container: HTMLElement,
) {
  const nameInput = container.querySelector('input[type="text"]');
  const phoneInput = container.querySelector('input[type="tel"]');

  expect(nameInput).not.toBeNull();
  expect(phoneInput).not.toBeNull();

  await user.type(nameInput as HTMLInputElement, 'Amal Ben Salah');
  await user.type(phoneInput as HTMLInputElement, '22111222');
  await user.click(screen.getByRole('button', { name: /suivant/i }));
}

describe('CareBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCareBookingPage();
  });

  it('forwards maxBookableDate to MonthCalendar', () => {
    renderBookingPage();

    expect(screen.getByTestId('month-calendar-max-date')).toHaveTextContent('2027-04-13');
  });

  it('renders urgency badges for urgent services', () => {
    mockCareBookingPage({
      services: [
        createService({
          id: '10000000-0000-0000-0000-000000000010',
          name: 'Consultation urgente',
          isUrgent: true,
        }),
        createService({
          id: '10000000-0000-0000-0000-000000000011',
          name: 'Consultation standard',
        }),
      ],
    });

    renderBookingPage();

    const urgentServiceCard = screen.getByRole('button', { name: /consultation urgente/i });
    const standardServiceCard = screen.getByRole('button', { name: /consultation standard/i });

    expect(within(urgentServiceCard).getByText('Urgence')).toBeInTheDocument();
    expect(within(standardServiceCard).queryByText('Urgence')).not.toBeInTheDocument();
  });

  it('renders booking-critical badges and forwards provider-site choice with the prescription document id', async () => {
    mockCareBookingPage({
      services: [
        createService({
          name: 'Aide mixte médicale',
          serviceLocation: 'both',
          requiresPrescription: true,
          durationMinutes: 90,
        }),
      ],
    });

    const { user, container } = renderBookingPage();

    expect(screen.getByText('90 min')).toBeInTheDocument();
    expect(screen.getByText('À domicile / Chez le prestataire')).toBeInTheDocument();
    expect(screen.getByText('Ordonnance requise')).toBeInTheDocument();

    await completeStepOne(user, /aide mixte médicale/i);

    expect(screen.getByText('Choix du lieu')).toBeInTheDocument();
    expect(screen.getByText('Prescription gate')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Choisir sur place' }));

    const nextButton = screen.getByRole('button', { name: /suivant/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Simuler ordonnance valide' }));
    expect(nextButton).toBeEnabled();

    await user.click(nextButton);

    expect(screen.queryByLabelText(/adresse du service/i)).not.toBeInTheDocument();
    expect(screen.getByText('Chez le prestataire')).toBeInTheDocument();

    await completeStepTwo(user, container);

    await waitFor(() => {
      expect(getLatestQuoteRequest()).toMatchObject({
        patientLocationChoice: 'provider_site',
        prescriptionFileId: '11111111-1111-1111-1111-111111111111',
      });
    });

    expect(getLatestQuoteRequest().address).toBeUndefined();
  });

  it('defaults malformed serviceLocation metadata to provider_site and skips address collection', async () => {
    mockCareBookingPage({
      services: [
        createService({
          id: '10000000-0000-0000-0000-000000000002',
          name: 'Accompagnement clinique',
          serviceLocation: undefined,
        }),
      ],
    });

    const { user, container } = renderBookingPage();

    await completeStepOne(user, /accompagnement clinique/i);
    await user.click(screen.getByRole('button', { name: /suivant/i }));

    expect(screen.queryByText('Choix du lieu')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/adresse du service/i)).not.toBeInTheDocument();
    expect(screen.getByText('Chez le prestataire')).toBeInTheDocument();

    await completeStepTwo(user, container);

    await waitFor(() => {
      expect(getLatestQuoteRequest()).toMatchObject({
        patientLocationChoice: 'provider_site',
      });
    });

    expect(getLatestQuoteRequest().address).toBeUndefined();
  });

  it('keeps step 1 blocked after prescription upload failure and resets location/prescription gating when all services are deselected', async () => {
    mockCareBookingPage({
      services: [
        createService({
          name: 'Aide mixte sous ordonnance',
          serviceLocation: 'both',
          requiresPrescription: true,
        }),
      ],
    });

    const { user } = renderBookingPage();

    await completeStepOne(user, /aide mixte sous ordonnance/i);
    await user.click(screen.getByRole('button', { name: 'Choisir sur place' }));

    const nextButton = screen.getByRole('button', { name: /suivant/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Simuler échec ordonnance' }));
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /aide mixte sous ordonnance/i }));

    expect(screen.queryByText('Choix du lieu')).not.toBeInTheDocument();
    expect(screen.queryByText('Prescription gate')).not.toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });
});
