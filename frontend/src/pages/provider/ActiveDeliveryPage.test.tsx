import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProviderDelivery } from '@/features/delivery';
import { englishTranslations } from '@/i18n/translations/en';
import { ActiveDeliveryPage } from '@/pages/provider/ActiveDeliveryPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockNavigate,
  mockUseParams,
  mockUseProviderDelivery,
  mockUseStartBookingSessionJourney,
  mockUseArriveBookingSession,
  mockUseStartBookingSessionService,
  mockUseCompleteBookingSession,
  mockShowErrorToast,
  mockProviderDeliveryTrackingMap,
} = vi.hoisted(() => {
  return {
    mockNavigate: vi.fn(),
    mockUseParams: vi.fn(),
    mockUseProviderDelivery: vi.fn(),
    mockUseStartBookingSessionJourney: vi.fn(),
    mockUseArriveBookingSession: vi.fn(),
    mockUseStartBookingSessionService: vi.fn(),
    mockUseCompleteBookingSession: vi.fn(),
    mockShowErrorToast: vi.fn(),
    mockProviderDeliveryTrackingMap: vi.fn(() => (
      <div data-testid="provider-delivery-tracking-map" />
    )),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: mockUseParams,
  };
});

vi.mock('@/integrations/maps/ProviderDeliveryTrackingMap', () => ({
  ProviderDeliveryTrackingMap: mockProviderDeliveryTrackingMap,
}));

vi.mock('@/features/delivery', async () => {
  const actual = await vi.importActual<typeof import('@/features/delivery')>('@/features/delivery');

  return {
    ...actual,
    useProviderDelivery: mockUseProviderDelivery,
  };
});

vi.mock('@/features/bookings', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings')>('@/features/bookings');

  return {
    ...actual,
    useStartBookingSessionJourney: mockUseStartBookingSessionJourney,
    useArriveBookingSession: mockUseArriveBookingSession,
    useStartBookingSessionService: mockUseStartBookingSessionService,
    useCompleteBookingSession: mockUseCompleteBookingSession,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
}));

const BASE_DELIVERY: ProviderDelivery = {
  id: '99999999-9999-9999-9999-999999999999',
  sessionId: '99999999-9999-9999-9999-999999999999',
  bookingId: '88888888-8888-8888-8888-888888888888',
  status: 'Confirmed',
  bookingStatus: 'Confirmed',
  parentStatus: 'Confirmed',
  paymentMethod: 'cash',
  scheduledAt: '2026-04-17T09:00:00.000Z',
  scheduledDate: '2026-04-17',
  scheduledStartTime: '09:00:00',
  scheduledEndTime: '10:00:00',
  startDate: '2026-04-17',
  endDate: '2026-04-17',
  dailyStartTime: '09:00:00',
  dailyEndTime: '10:00:00',
  notes: 'Please bring supplies',
  totalAmount: 95,
  currency: 'TND',
  patientName: 'Amel Ben Salem',
  patientPhone: '+21612345678',
  serviceName: 'Wound dressing',
  serviceCategory: 'nursing',
  location: {
    lat: null,
    lng: null,
    address: '15 Rue de Marseille, Tunis',
  },
  providerDepartedAt: null,
  providerArrivedAt: null,
  serviceStartedAt: null,
  serviceCompletedAt: null,
  verifiedAt: null,
  cancelledAt: null,
  cancelledBy: null,
  cancellationReason: null,
};

function renderPage(delivery: ProviderDelivery) {
  mockUseProviderDelivery.mockReturnValue({
    data: delivery,
    loading: false,
    error: null,
    refetch: vi.fn(),
  });

  return renderWithProviders(<ActiveDeliveryPage />, {
    locale: 'en-GB',
    route: `/provider/active-delivery/${delivery.id}`,
  });
}

describe('ActiveDeliveryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({ sessionId: BASE_DELIVERY.id });

    mockUseProviderDelivery.mockReturnValue({
      data: BASE_DELIVERY,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseStartBookingSessionJourney.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: BASE_DELIVERY.id, status: 'ProviderOnWay' }),
      loading: false,
    });

    mockUseArriveBookingSession.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: BASE_DELIVERY.id, status: 'ProviderOnWay' }),
      loading: false,
    });

    mockUseStartBookingSessionService.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: BASE_DELIVERY.id, status: 'InProgress' }),
      loading: false,
    });

    mockUseCompleteBookingSession.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: BASE_DELIVERY.id, status: 'Completed' }),
      loading: false,
    });
  });

  it('shows aggregate loading state', async () => {
    mockUseProviderDelivery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<ActiveDeliveryPage />, {
      locale: 'en-GB',
      route: `/provider/active-delivery/${BASE_DELIVERY.id}`,
    });

    expect(await screen.findByText(englishTranslations.common.loading)).toBeInTheDocument();
  });

  it.each([
    {
      name: 'pending',
      delivery: {
        ...BASE_DELIVERY,
        status: 'Confirmed',
        providerDepartedAt: null,
        providerArrivedAt: null,
      },
      label: englishTranslations.provider.deliveryPending,
      action: englishTranslations.provider.deliveryStartJourney,
    },
    {
      name: 'en_route',
      delivery: {
        ...BASE_DELIVERY,
        status: 'ProviderOnWay',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: null,
      },
      label: englishTranslations.provider.deliveryEnRoute,
      action: englishTranslations.provider.deliveryMarkArrived,
    },
    {
      name: 'arrived',
      delivery: {
        ...BASE_DELIVERY,
        status: 'ProviderOnWay',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: '2026-04-17T08:55:00.000Z',
      },
      label: englishTranslations.provider.deliveryArrived,
      action: englishTranslations.provider.deliveryStartService,
    },
    {
      name: 'in_progress',
      delivery: {
        ...BASE_DELIVERY,
        status: 'InProgress',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: '2026-04-17T08:55:00.000Z',
        serviceStartedAt: '2026-04-17T09:00:00.000Z',
      },
      label: englishTranslations.provider.deliveryInProgress,
      action: englishTranslations.provider.deliveryCompleteService,
    },
    {
      name: 'completed',
      delivery: {
        ...BASE_DELIVERY,
        status: 'Completed',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: '2026-04-17T08:55:00.000Z',
        serviceStartedAt: '2026-04-17T09:00:00.000Z',
        serviceCompletedAt: '2026-04-17T09:45:00.000Z',
      },
      label: englishTranslations.provider.deliveryCompletedTitle,
      action: englishTranslations.provider.backToDashboard,
    },
  ])(
    'renders derived $name delivery state from aggregate data',
    async ({ delivery, label, action }) => {
      renderPage(delivery);

      expect(await screen.findByText(label)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: action })).toBeInTheDocument();
    },
  );

  it('wires session execution buttons to the correct mutations', async () => {
    const startJourney = vi.fn().mockResolvedValue(undefined);
    const arriveSession = vi.fn().mockResolvedValue(undefined);
    const startService = vi.fn().mockResolvedValue(undefined);
    const completeSession = vi.fn().mockResolvedValue(undefined);

    mockUseStartBookingSessionJourney.mockReturnValue({
      mutateAsync: startJourney,
      loading: false,
    });
    mockUseArriveBookingSession.mockReturnValue({
      mutateAsync: arriveSession,
      loading: false,
    });
    mockUseStartBookingSessionService.mockReturnValue({
      mutateAsync: startService,
      loading: false,
    });
    mockUseCompleteBookingSession.mockReturnValue({
      mutateAsync: completeSession,
      loading: false,
    });

    const { rerender } = renderPage({
      ...BASE_DELIVERY,
      status: 'Confirmed',
      providerDepartedAt: null,
      providerArrivedAt: null,
    });

    await userEvent.click(
      await screen.findByRole('button', {
        name: englishTranslations.provider.deliveryStartJourney,
      }),
    );
    expect(startJourney).toHaveBeenCalledWith(BASE_DELIVERY.id);

    mockUseProviderDelivery.mockReturnValue({
      data: {
        ...BASE_DELIVERY,
        status: 'ProviderOnWay',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: null,
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    rerender(<ActiveDeliveryPage />);

    await userEvent.click(
      await screen.findByRole('button', { name: englishTranslations.provider.deliveryMarkArrived }),
    );
    expect(arriveSession).toHaveBeenCalledWith(BASE_DELIVERY.id);

    mockUseProviderDelivery.mockReturnValue({
      data: {
        ...BASE_DELIVERY,
        status: 'ProviderOnWay',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: '2026-04-17T08:55:00.000Z',
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    rerender(<ActiveDeliveryPage />);

    await userEvent.click(
      await screen.findByRole('button', {
        name: englishTranslations.provider.deliveryStartService,
      }),
    );
    expect(startService).toHaveBeenCalledWith(BASE_DELIVERY.id);

    mockUseProviderDelivery.mockReturnValue({
      data: {
        ...BASE_DELIVERY,
        status: 'InProgress',
        providerDepartedAt: '2026-04-17T08:30:00.000Z',
        providerArrivedAt: '2026-04-17T08:55:00.000Z',
        serviceStartedAt: '2026-04-17T09:00:00.000Z',
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    rerender(<ActiveDeliveryPage />);

    await userEvent.click(
      await screen.findByRole('button', {
        name: englishTranslations.provider.deliveryCompleteService,
      }),
    );

    const codeInput = await screen.findByLabelText(
      englishTranslations.provider.deliveryCompletionCodeLabel,
    );
    await userEvent.type(codeInput, '123456');

    await userEvent.click(
      screen.getByRole('button', {
        name: englishTranslations.provider.deliverySubmitCompletionCode,
      }),
    );

    expect(completeSession).toHaveBeenCalledWith({
      sessionId: BASE_DELIVERY.id,
      data: { validationCode: '123456' },
    });
  });
});
