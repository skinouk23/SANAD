import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  ProviderPlanningBookingResponse,
  ProviderPlanningResponse,
  ProviderScheduleInterval,
  ProviderUnavailabilityResponse,
  UpsertProviderScheduleInterval,
} from '@/features/providers';
import { englishTranslations } from '@/i18n/translations/en';
import { ScheduleManagementPage } from '@/pages/provider/ScheduleManagementPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockNavigate,
  mockUseMyProviderProfile,
  mockUseMyProviderPlanning,
  mockUseMyProviderSchedules,
  mockUseConfirmBookingSession,
  mockUseCancelBookingSession,
  mockUseReplaceProviderSchedules,
  mockUseCreateProviderUnavailability,
  mockUseDeleteProviderUnavailability,
  mockShowErrorToast,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseMyProviderProfile: vi.fn(),
  mockUseMyProviderPlanning: vi.fn(),
  mockUseMyProviderSchedules: vi.fn(),
  mockUseConfirmBookingSession: vi.fn(),
  mockUseCancelBookingSession: vi.fn(),
  mockUseReplaceProviderSchedules: vi.fn(),
  mockUseCreateProviderUnavailability: vi.fn(),
  mockUseDeleteProviderUnavailability: vi.fn(),
  mockShowErrorToast: vi.fn(),
}));

function toLocalDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TODAY = toLocalDateOnly(new Date());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/bookings', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings')>('@/features/bookings');

  return {
    ...actual,
    useConfirmBookingSession: mockUseConfirmBookingSession,
    useCancelBookingSession: mockUseCancelBookingSession,
  };
});

vi.mock('@/features/providers/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/features/providers/hooks')>(
    '@/features/providers/hooks',
  );

  return {
    ...actual,
    useMyProviderProfile: mockUseMyProviderProfile,
    useMyProviderPlanning: mockUseMyProviderPlanning,
    useMyProviderSchedules: mockUseMyProviderSchedules,
    useReplaceProviderSchedules: mockUseReplaceProviderSchedules,
    useCreateProviderUnavailability: mockUseCreateProviderUnavailability,
    useDeleteProviderUnavailability: mockUseDeleteProviderUnavailability,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
}));

const BASE_BOOKING: ProviderPlanningBookingResponse = {
  id: '11111111-1111-1111-1111-111111111111',
  bookingId: '11111111-1111-1111-1111-111111111111',
  sessionId: 'aaaaaaaa-1111-1111-1111-111111111111',
  bookingNumber: 'BK-PLN-1',
  status: 'Pending',
  sessionStatus: 'Pending',
  type: 'service',
  scheduledAt: new Date(`${TODAY}T09:00:00`).toISOString(),
  startDate: TODAY,
  endDate: TODAY,
  dailyStartTime: '09:00:00',
  dailyEndTime: '10:00:00',
  dailyDurationMinutes: 60,
  dayCount: 1,
  totalAmount: 90,
  currency: 'TND',
  address: '10 Rue de Tunis',
  notes: null,
  service: {
    name: 'Home visit',
    category: 'nursing',
  },
  patient: {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Mohamed Ali',
    phone: '+21699887766',
  },
  providerAmount: 80,
  autoValidateAt: null,
  providerAcceptedAt: null,
  providerDepartedAt: null,
  providerArrivedAt: null,
  serviceStartedAt: null,
  serviceCompletedAt: null,
  validatedAt: null,
  cancelledAt: null,
  cancelledBy: null,
  cancellationReason: null,
  statusChangedBy: null,
  statusChangeReason: null,
};

const DEFAULT_SCHEDULES: ProviderScheduleInterval[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    dayOfWeek: 1,
    serviceId: null,
    startTime: '08:00:00',
    endTime: '12:00:00',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    dayOfWeek: 3,
    serviceId: null,
    startTime: '14:00:00',
    endTime: '18:00:00',
  },
];

const DEFAULT_UNAVAILABILITY: ProviderUnavailabilityResponse = {
  id: '55555555-5555-5555-5555-555555555555',
  startDatetime: new Date(`${TODAY}T12:00:00`).toISOString(),
  endDatetime: new Date(`${TODAY}T13:00:00`).toISOString(),
  isAllDay: false,
  isRecurring: false,
  recurrenceRule: null,
  reason: 'Lunch break',
  notes: null,
};

function createPlanningData(
  overrides: Partial<ProviderPlanningResponse> = {},
): ProviderPlanningResponse {
  return {
    timezone: 'Africa/Tunis',
    isOnline: true,
    availabilityStatus: 'available',
    schedules: DEFAULT_SCHEDULES,
    unavailabilities: [DEFAULT_UNAVAILABILITY],
    bookings: [BASE_BOOKING],
    ...overrides,
  };
}

function renderScheduleManagement() {
  return renderWithProviders(<ScheduleManagementPage />, { locale: 'en-GB' });
}

describe('ScheduleManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMyProviderProfile.mockReturnValue({
      data: {
        id: 'provider-1',
        userId: 'provider-user-1',
      },
    });

    mockUseMyProviderPlanning.mockReturnValue({
      data: createPlanningData(),
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseMyProviderSchedules.mockReturnValue({
      data: DEFAULT_SCHEDULES,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseConfirmBookingSession.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        id: BASE_BOOKING.sessionId,
        bookingId: BASE_BOOKING.id,
        status: 'Confirmed',
      }),
      loading: false,
    });

    mockUseCancelBookingSession.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        id: BASE_BOOKING.sessionId,
        bookingId: BASE_BOOKING.id,
        status: 'Cancelled',
      }),
      loading: false,
    });

    mockUseReplaceProviderSchedules.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      loading: false,
    });

    mockUseCreateProviderUnavailability.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      loading: false,
    });

    mockUseDeleteProviderUnavailability.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      loading: false,
    });
  });

  it('shows planning loading and retry state', async () => {
    const refetch = vi.fn().mockResolvedValue(undefined);

    mockUseMyProviderPlanning.mockReturnValue({
      data: undefined,
      loading: true,
      error: null,
      refetch,
    });

    const { rerender } = renderScheduleManagement();

    expect(await screen.findByText(englishTranslations.common.loading)).toBeInTheDocument();

    mockUseMyProviderPlanning.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('planning unavailable'),
      refetch,
    });

    rerender(<ScheduleManagementPage />);

    expect(await screen.findByText(englishTranslations.common.loadingError)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: englishTranslations.common.retry }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders grouped schedules, blocked slots, and correct half-hour and duration-based appointments', async () => {
    mockUseMyProviderPlanning.mockReturnValue({
      data: createPlanningData({
        bookings: [
          {
            ...BASE_BOOKING,
            id: '66666666-6666-6666-6666-666666666666',
            bookingId: '66666666-6666-6666-6666-666666666666',
            sessionId: 'aaaaaaaa-6666-6666-6666-666666666666',
            patient: {
              ...(BASE_BOOKING.patient ?? { id: '22222222-2222-2222-2222-222222222222' }),
              name: 'Half Hour Patient',
            },
            dailyStartTime: '08:30:00',
            dailyEndTime: '09:00:00',
            dailyDurationMinutes: 30,
            service: { name: 'Quick check', category: 'nursing' },
          },
          {
            ...BASE_BOOKING,
            id: '77777777-7777-7777-7777-777777777777',
            bookingId: '77777777-7777-7777-7777-777777777777',
            sessionId: 'aaaaaaaa-7777-7777-7777-777777777777',
            status: 'Confirmed',
            sessionStatus: 'Confirmed',
            patient: {
              ...(BASE_BOOKING.patient ?? { id: '22222222-2222-2222-2222-222222222222' }),
              name: 'Duration Patient',
            },
            dailyStartTime: '11:00:00',
            dailyEndTime: null,
            dailyDurationMinutes: 90,
            service: { name: 'Extended therapy', category: 'physiotherapy' },
            address: '22 Avenue Habib Bourguiba',
          },
          {
            ...BASE_BOOKING,
            id: '88888888-8888-8888-8888-888888888888',
            bookingId: '88888888-8888-8888-8888-888888888888',
            sessionId: 'aaaaaaaa-8888-8888-8888-888888888888',
            status: 'Cancelled',
            sessionStatus: 'Cancelled',
            cancelledBy: 'provider-user-1',
            statusChangedBy: 'provider-user-1',
            statusChangeReason: 'provider_declined',
            patient: {
              ...(BASE_BOOKING.patient ?? { id: '22222222-2222-2222-2222-222222222222' }),
              name: 'Rejected Patient',
            },
            dailyStartTime: '15:00:00',
            dailyDurationMinutes: 60,
          },
          {
            ...BASE_BOOKING,
            id: '99999999-9999-9999-9999-999999999998',
            bookingId: '99999999-9999-9999-9999-999999999998',
            sessionId: 'aaaaaaaa-9999-9999-9999-999999999998',
            status: 'Cancelled',
            sessionStatus: 'Cancelled',
            cancelledBy: 'provider-user-1',
            statusChangedBy: 'provider-user-1',
            cancellationReason: 'Provider unavailable today',
            statusChangeReason: 'provider_unavailable_today',
            patient: {
              ...(BASE_BOOKING.patient ?? { id: '22222222-2222-2222-2222-222222222222' }),
              name: 'Cancelled Patient',
            },
            dailyStartTime: '16:30:00',
            dailyDurationMinutes: 60,
          },
        ],
      }),
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderScheduleManagement();

    expect(await screen.findByText('Half Hour Patient')).toBeInTheDocument();
    expect(screen.getByText('08:30 - Half Hour Patient')).toBeInTheDocument();
    expect(screen.getAllByText('Quick check').length).toBeGreaterThan(0);
    expect(screen.getByText('30 min')).toBeInTheDocument();

    expect(screen.getByText('11:00 - Duration Patient')).toBeInTheDocument();
    expect(screen.getAllByText('Extended therapy').length).toBeGreaterThan(0);
    expect(screen.getByText('90 min')).toBeInTheDocument();
    expect(screen.getByText('Lunch break')).toBeInTheDocument();
    expect(screen.getAllByText(englishTranslations.provider.rejected).length).toBeGreaterThan(0);
    expect(screen.getAllByText(englishTranslations.provider.cancelled).length).toBeGreaterThan(0);
  });

  it('wires approve to session confirmation and reject to session cancellation mutation', async () => {
    const confirmBookingSession = vi.fn().mockResolvedValue({
      id: BASE_BOOKING.sessionId,
      bookingId: BASE_BOOKING.id,
      status: 'Confirmed',
    });
    const cancelBookingSession = vi.fn().mockResolvedValue({
      id: BASE_BOOKING.sessionId,
      bookingId: BASE_BOOKING.id,
      status: 'Cancelled',
    });

    mockUseConfirmBookingSession.mockReturnValue({
      mutateAsync: confirmBookingSession,
      loading: false,
    });

    mockUseCancelBookingSession.mockReturnValue({
      mutateAsync: cancelBookingSession,
      loading: false,
    });

    renderScheduleManagement();

    await userEvent.click(
      await screen.findByRole('button', { name: englishTranslations.provider.approve }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: englishTranslations.provider.reject }),
    );

    expect(confirmBookingSession).toHaveBeenCalledWith(BASE_BOOKING.sessionId);
    expect(cancelBookingSession).toHaveBeenCalledWith({
      sessionId: BASE_BOOKING.sessionId,
      data: { cancellationReason: 'provider_declined' },
    });
  });

  it('wires saving weekly availability to replace schedules with edited intervals', async () => {
    const replaceSchedules = vi.fn().mockResolvedValue(undefined);

    mockUseReplaceProviderSchedules.mockReturnValue({
      mutateAsync: replaceSchedules,
      loading: false,
    });

    renderScheduleManagement();

    await userEvent.click(
      await screen.findByRole('button', { name: englishTranslations.provider.setAvailability }),
    );

    expect(
      await screen.findByText(englishTranslations.provider.setAvailabilities),
    ).toBeInTheDocument();

    const mondaySection = screen
      .getByText(englishTranslations.provider.monday)
      .closest('div.rounded-xl.border');

    expect(mondaySection).not.toBeNull();

    const mondayInputs = within(mondaySection as HTMLElement).getAllByDisplayValue(/08:00|12:00/);
    await userEvent.clear(mondayInputs[0]);
    await userEvent.type(mondayInputs[0], '09:30');
    await userEvent.clear(mondayInputs[1]);
    await userEvent.type(mondayInputs[1], '12:30');

    await userEvent.click(
      screen.getByRole('button', { name: englishTranslations.provider.saveAvailabilities }),
    );

    expect(replaceSchedules).toHaveBeenCalledTimes(1);
    expect(replaceSchedules).toHaveBeenCalledWith([
      {
        id: '33333333-3333-3333-3333-333333333333',
        dayOfWeek: 1,
        serviceId: null,
        startTime: '09:30',
        endTime: '12:30',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        dayOfWeek: 3,
        serviceId: null,
        startTime: '14:00',
        endTime: '18:00',
      },
    ] satisfies UpsertProviderScheduleInterval[]);
  });

  it('wires blocked slot creation and deletion mutations', async () => {
    const createUnavailability = vi.fn().mockResolvedValue(undefined);
    const deleteUnavailability = vi.fn().mockResolvedValue(undefined);

    mockUseCreateProviderUnavailability.mockReturnValue({
      mutateAsync: createUnavailability,
      loading: false,
    });

    mockUseDeleteProviderUnavailability.mockReturnValue({
      mutateAsync: deleteUnavailability,
      loading: false,
    });

    renderScheduleManagement();

    await userEvent.click(
      await screen.findByRole('button', { name: englishTranslations.provider.blockSlot }),
    );

    expect(await screen.findByText(englishTranslations.provider.blockThisSlot)).toBeInTheDocument();

    const startInput = screen.getByLabelText(englishTranslations.provider.startTime);
    const endInput = screen.getByLabelText(englishTranslations.provider.endTime);
    const reasonInput = screen.getByLabelText(englishTranslations.provider.reasonOptional);

    await userEvent.clear(startInput);
    await userEvent.type(startInput, '14:00');
    await userEvent.clear(endInput);
    await userEvent.type(endInput, '15:30');
    await userEvent.type(reasonInput, 'Travel time');

    const modalButtons = screen.getAllByRole('button', {
      name: englishTranslations.provider.blockSlot,
    });
    await userEvent.click(modalButtons[modalButtons.length - 1]);

    expect(createUnavailability).toHaveBeenCalledWith({
      startDatetime: `${TODAY}T14:00:00`,
      endDatetime: `${TODAY}T15:30:00`,
      isAllDay: false,
      isRecurring: false,
      recurrenceRule: null,
      reason: 'Travel time',
      notes: null,
    });

    await userEvent.click(
      screen.getByRole('button', { name: `${englishTranslations.common.delete}: Lunch break` }),
    );

    expect(deleteUnavailability).toHaveBeenCalledWith(DEFAULT_UNAVAILABILITY.id);
  });
});
