import { screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { englishTranslations } from '@/i18n/translations/en';
import { renderWithProviders } from '@/test/renderWithProviders';
import { NotificationsPanel } from '@/features/patient/dashboard/components/NotificationsPanel';

const {
  mockNavigate,
  mockUseNotificationsFeed,
  mockUseMarkNotificationRead,
  mockUseMarkAllNotificationsRead,
  mockUseDeleteNotification,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseNotificationsFeed: vi.fn(),
  mockUseMarkNotificationRead: vi.fn(),
  mockUseMarkAllNotificationsRead: vi.fn(),
  mockUseDeleteNotification: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/shared/lib/notifications/feed', () => ({
  useNotificationsFeed: mockUseNotificationsFeed,
  useMarkNotificationRead: mockUseMarkNotificationRead,
  useMarkAllNotificationsRead: mockUseMarkAllNotificationsRead,
  useDeleteNotification: mockUseDeleteNotification,
}));

describe('Patient NotificationsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseNotificationsFeed.mockReturnValue({
      data: {
        items: [
          {
            id: 'notif-1',
            category: 'booking',
            title: 'Appointment confirmed',
            body: 'Your provider confirmed the visit.',
            createdAt: '2026-06-02T12:00:00.000Z',
            readAt: null,
            archivedAt: null,
            severity: 'success',
            action: { label: 'View booking', url: '/mon-espace' },
            actor: { name: 'Amira Mansour', avatarUrl: null },
            metadata: {},
          },
        ],
        nextCursor: null,
      },
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

  it('renders live notifications and triggers mark-read actions', async () => {
    const markRead = vi.fn().mockResolvedValue(null);
    const markAll = vi.fn().mockResolvedValue({ count: 1, updatedCount: 1 });
    const deleteNotification = vi.fn().mockResolvedValue(null);

    mockUseMarkNotificationRead.mockReturnValue({
      mutateAsync: markRead,
      isPending: false,
      variables: undefined,
    });

    mockUseMarkAllNotificationsRead.mockReturnValue({
      mutateAsync: markAll,
      isPending: false,
      variables: undefined,
    });

    mockUseDeleteNotification.mockReturnValue({
      mutateAsync: deleteNotification,
      isPending: false,
      variables: undefined,
    });

    const { user } = renderWithProviders(<NotificationsPanel isOpen={true} onClose={vi.fn()} />, {
      locale: 'en-GB',
    });

    expect(await screen.findByText('Appointment confirmed')).toBeInTheDocument();
    expect(screen.getByText('Amira Mansour')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: englishTranslations.notifications.markAllRead }),
    );
    await user.click(
      screen.getByRole('button', {
        name: `${englishTranslations.notifications.markRead}: Appointment confirmed`,
      }),
    );
    await user.click(
      screen.getByRole('button', {
        name: `${englishTranslations.common.delete}: Appointment confirmed`,
      }),
    );

    expect(markAll).toHaveBeenCalledTimes(1);
    expect(markRead).toHaveBeenCalledWith('notif-1');
    expect(deleteNotification).toHaveBeenCalledWith('notif-1');
  });

  it('navigates to the notification destination when the card is clicked', async () => {
    const markRead = vi.fn().mockResolvedValue(null);

    mockUseMarkNotificationRead.mockReturnValue({
      mutateAsync: markRead,
      isPending: false,
      variables: undefined,
    });

    const { user } = renderWithProviders(<NotificationsPanel isOpen={true} onClose={vi.fn()} />, {
      locale: 'en-GB',
    });

    await user.click(await screen.findByText('Appointment confirmed'));

    expect(markRead).toHaveBeenCalledWith('notif-1');
    expect(mockNavigate).toHaveBeenCalledWith('/mon-espace');
  });
});
