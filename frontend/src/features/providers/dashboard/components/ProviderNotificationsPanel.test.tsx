import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { ProviderNotificationsPanel } from '@/features/providers/dashboard/components/ProviderNotificationsPanel';

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

describe('ProviderNotificationsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseNotificationsFeed.mockReturnValue({
      data: {
        items: [
          {
            id: 'notif-provider-1',
            category: 'booking',
            title: 'Nouvelle reservation',
            body: 'Une nouvelle reservation attend votre validation.',
            createdAt: '2026-06-02T12:00:00.000Z',
            readAt: null,
            archivedAt: null,
            severity: 'info',
            action: null,
            actor: { name: 'Yasin Kammoun', avatarUrl: null },
            metadata: { type: 'booking_pending' },
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

  it('routes provider booking notifications to the schedule page when no action URL is provided', async () => {
    const markRead = vi.fn().mockResolvedValue(null);

    mockUseMarkNotificationRead.mockReturnValue({
      mutateAsync: markRead,
      isPending: false,
      variables: undefined,
    });

    const { user } = renderWithProviders(
      <ProviderNotificationsPanel isOpen={true} onClose={vi.fn()} />,
      {
        locale: 'fr-FR',
      },
    );

    await user.click(await screen.findByText('Nouvelle reservation'));

    expect(markRead).toHaveBeenCalledWith('notif-provider-1');
    expect(mockNavigate).toHaveBeenCalledWith('/provider/schedule');
  });
});
