import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BookingListItemResponse } from '@/features/bookings/schema';
import { englishTranslations } from '@/i18n/translations/en';
import { ProviderDashboardPage } from '@/pages/provider/ProviderDashboardPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const {
  mockNavigate,
  mockUseAuth,
  mockUseProviderDashboardTodayBookings,
  mockUseProviderDashboard,
  mockUseGetOrCreateConversation,
  mockUseNotificationsFeed,
  mockUseNotificationsUnreadCount,
  mockUseDeleteNotification,
  mockUseMarkAllNotificationsRead,
  mockUseMarkNotificationRead,
  mockUseToggleAvailability,
  mockShowErrorToast,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseProviderDashboardTodayBookings: vi.fn(),
  mockUseProviderDashboard: vi.fn(),
  mockUseGetOrCreateConversation: vi.fn(),
  mockUseNotificationsFeed: vi.fn(),
  mockUseNotificationsUnreadCount: vi.fn(),
  mockUseDeleteNotification: vi.fn(),
  mockUseMarkAllNotificationsRead: vi.fn(),
  mockUseMarkNotificationRead: vi.fn(),
  mockUseToggleAvailability: vi.fn(),
  mockShowErrorToast: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/features/bookings', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookings')>('@/features/bookings');

  return {
    ...actual,
    useProviderDashboardTodayBookings: mockUseProviderDashboardTodayBookings,
  };
});

vi.mock('@/features/providers', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/providers')>('@/features/providers');

  return {
    ...actual,
    useProviderDashboard: mockUseProviderDashboard,
    useToggleAvailability: mockUseToggleAvailability,
  };
});

vi.mock('@/features/messaging', async () => {
  const actual =
    await vi.importActual<typeof import('@/features/messaging')>('@/features/messaging');

  return {
    ...actual,
    useGetOrCreateConversation: mockUseGetOrCreateConversation,
  };
});

vi.mock('@/shared/lib/notifications/toast', () => ({
  showErrorToast: mockShowErrorToast,
}));

vi.mock('@/shared/lib/notifications/unread-count', () => ({
  useNotificationsUnreadCount: mockUseNotificationsUnreadCount,
}));

vi.mock('@/shared/lib/notifications/feed', () => ({
  useNotificationsFeed: mockUseNotificationsFeed,
  useMarkNotificationRead: mockUseMarkNotificationRead,
  useMarkAllNotificationsRead: mockUseMarkAllNotificationsRead,
  useDeleteNotification: mockUseDeleteNotification,
}));

const TODAY_APPOINTMENT: BookingListItemResponse = {
  id: 'booking-1',
  sessionId: 'session-1',
  bookingNumber: 'BK-001',
  status: 'Confirmed',
  paymentMethod: 'card',
  type: 'service',
  scheduledAt: '2026-04-15T23:59:00.000Z',
  startDate: '2026-04-15',
  endDate: '2026-04-15',
  dailyStartTime: '10:00:00',
  dailyEndTime: '11:00:00',
  dailyDurationMinutes: 60,
  dayCount: 1,
  perDaySubtotal: 60,
  platformFee: 5,
  totalAmount: 65,
  currency: 'TND',
  address: '10 Rue de Tunis',
  service: {
    name: 'Home visit',
    category: 'nursing',
  },
  lineItems: [],
  equipmentRental: null,
  provider: {
    id: 'provider-1',
    name: 'Dr Fatma Ben Said',
    phone: '+21612345678',
    rating: 4.8,
  },
  notes: null,
  validationCode: null,
  autoValidateAt: null,
  rating: null,
  reviewComment: null,
  patient: {
    id: 'patient-1',
    name: 'Mohamed Ali',
    phone: '+21699887766',
  },
  providerAmount: 60,
};

const NOTIFICATIONS_RESPONSE = {
  items: [
    {
      id: 'notif-1',
      category: 'booking',
      title: 'Booking confirmed',
      body: 'Your next appointment is confirmed.',
      createdAt: '2026-04-15T10:00:00.000Z',
      readAt: null,
      archivedAt: null,
      severity: 'success',
      action: null,
      actor: { name: 'Amira Mansour', avatarUrl: null },
      metadata: {},
    },
    {
      id: 'notif-2',
      category: 'message',
      title: 'New message',
      body: 'A patient sent you a message.',
      createdAt: '2026-04-14T10:00:00.000Z',
      readAt: '2026-04-14T11:00:00.000Z',
      archivedAt: null,
      severity: 'info',
      action: null,
      actor: null,
      metadata: {},
    },
  ],
  nextCursor: null,
};

function renderDashboard() {
  return renderWithProviders(<ProviderDashboardPage />, { locale: 'en-GB' });
}

describe('ProviderDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseProviderDashboard.mockReturnValue({
      data: {
        provider: {
          id: 'provider-1',
          name: 'Dr Fatma Ben Said',
          providerType: 'Home care provider',
          specialties: ['Nursing'],
          rating: 4.8,
          reviewCount: 12,
          available: true,
          subscriptionTier: 'pro',
          availableBalance: 120,
        },
        appointmentStats: {
          todayCount: 1,
          weekCount: 3,
          completionRate: 98,
        },
        revenueStats: {
          thisWeekRevenue: 250,
          thisMonthRevenue: 980,
        },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseProviderDashboardTodayBookings.mockReturnValue({
      data: [TODAY_APPOINTMENT],
      loading: false,
      error: null,
      initialLoadError: null,
      refetch: vi.fn(),
    });

    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync: vi.fn(),
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    mockUseToggleAvailability.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({ available: false }),
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    mockUseAuth.mockReturnValue({
      user: { id: 'provider-1', role: 'provider', name: 'Provider User', avatar: null },
    });

    mockUseNotificationsUnreadCount.mockReturnValue({
      data: { count: 1 },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseNotificationsFeed.mockReturnValue({
      data: NOTIFICATIONS_RESPONSE,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseMarkNotificationRead.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(null),
      isPending: false,
      variables: undefined,
    });

    mockUseMarkAllNotificationsRead.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ count: 1, updatedCount: 1 }),
      isPending: false,
      variables: undefined,
    });

    mockUseDeleteNotification.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(null),
      isPending: false,
      variables: undefined,
    });
  });

  it('uses the real patient id from the booking card to open chat', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({ id: 'conversation-55' });

    mockUseGetOrCreateConversation.mockReturnValue({
      mutateAsync,
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderDashboard();

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.messages.messagePatient }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({ patientId: 'patient-1' });
    expect(mockNavigate).toHaveBeenCalledWith('/messages/conversation-55');
  });

  it('shows a retryable load error when dashboard today bookings fail', async () => {
    const refetch = vi.fn().mockResolvedValue(undefined);
    const error = new Error('appointments unavailable');

    mockUseProviderDashboardTodayBookings.mockReturnValue({
      data: [],
      loading: false,
      error,
      initialLoadError: error,
      refetch,
    });

    renderDashboard();

    expect(await screen.findByText(englishTranslations.common.loadingError)).toBeInTheDocument();
    expect(
      screen.queryByText(englishTranslations.provider.noAppointmentsToday),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: englishTranslations.common.retry }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('shows dashboard summary error with retry UI', async () => {
    const refetch = vi.fn().mockResolvedValue(undefined);

    mockUseProviderDashboard.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('dashboard unavailable'),
      refetch,
    });

    renderDashboard();

    const retryButtons = await screen.findAllByRole('button', {
      name: englishTranslations.common.retry,
    });
    expect(retryButtons).toHaveLength(1);

    await userEvent.click(retryButtons[0]);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders truthful KPI cards without synthetic delta chips', async () => {
    renderDashboard();

    expect(await screen.findByText('250')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.queryByText('+18%')).not.toBeInTheDocument();
    expect(screen.queryByText('-2')).not.toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
    expect(screen.queryByText('+0.2')).not.toBeInTheDocument();
    expect(screen.queryByText('+5%')).not.toBeInTheDocument();
  });

  it('calls the availability mutation and disables the switch while pending', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockImplementation(() => new Promise(() => undefined));

    mockUseToggleAvailability.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync,
      loading: true,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderDashboard();

    const toggle = await screen.findByRole('button', {
      name: englishTranslations.provider.setAvailability,
    });
    expect(toggle).toBeDisabled();

    await user.click(toggle);

    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('calls the availability mutation with the next backend state when enabled', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({ available: false });

    mockUseToggleAvailability.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync,
      loading: false,
      error: null,
      data: null,
      reset: vi.fn(),
    });

    renderDashboard();

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.provider.setAvailability }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({ available: false });
  });

  it('renders appointment time from dailyStartTime instead of scheduledAt', async () => {
    renderDashboard();

    expect(await screen.findByText('10:00')).toBeInTheDocument();
    expect(screen.queryByText('23:59')).not.toBeInTheDocument();
  });

  it('opens provider notifications from the dashboard header and marks all as read', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({ count: 1, updatedCount: 1 });

    mockUseMarkAllNotificationsRead.mockReturnValue({
      mutateAsync,
      isPending: false,
      variables: undefined,
    });

    renderDashboard();

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.notifications.title }),
    );

    expect(await screen.findByText('Booking confirmed')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: englishTranslations.notifications.markAllRead }),
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);
  });

  it('uses the notification actions to mark an item as read and delete another', async () => {
    const user = userEvent.setup();
    const markRead = vi.fn().mockResolvedValue(null);
    const deleteNotification = vi.fn().mockResolvedValue(null);

    mockUseMarkNotificationRead.mockReturnValue({
      mutateAsync: markRead,
      isPending: false,
      variables: undefined,
    });

    mockUseDeleteNotification.mockReturnValue({
      mutateAsync: deleteNotification,
      isPending: false,
      variables: undefined,
    });

    renderDashboard();

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.notifications.title }),
    );

    await user.click(
      screen.getByRole('button', {
        name: `${englishTranslations.notifications.markRead}: Booking confirmed`,
      }),
    );
    await user.click(
      screen.getByRole('button', {
        name: `${englishTranslations.common.delete}: New message`,
      }),
    );

    expect(markRead).toHaveBeenCalledWith('notif-1');
    expect(deleteNotification).toHaveBeenCalledWith('notif-2');
  });

  it('uses a truthful close action in the support modal', async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(
      await screen.findByRole('button', { name: englishTranslations.provider.contactSupport }),
    );

    expect(
      await screen.findByText(englishTranslations.provider.supportModalSubtitle),
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: englishTranslations.common.close });
    await user.click(closeButtons[closeButtons.length - 1]);

    await waitFor(() => {
      expect(
        screen.queryByText(englishTranslations.provider.supportModalSubtitle),
      ).not.toBeInTheDocument();
    });
  });
});
