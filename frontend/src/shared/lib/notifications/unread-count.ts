import { useQuery, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { api, type SilentErrorConfig } from '@/api/client';

const NotificationUnreadCountResponseSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type NotificationUnreadCountResponse = z.infer<typeof NotificationUnreadCountResponseSchema>;

export const notificationUnreadCountKey = ['notifications', 'unread-count'] as const;

function tryCountUnreadNotifications(raw: unknown): number | null {
  if (Array.isArray(raw)) {
    return raw.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        !('archivedAt' in item) &&
        !('isRead' in item && item.isRead === true),
    ).length;
  }

  if (raw && typeof raw === 'object' && 'items' in raw && Array.isArray(raw.items)) {
    return raw.items.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        !('archivedAt' in item && item.archivedAt) &&
        !('readAt' in item && item.readAt),
    ).length;
  }

  return null;
}

async function getNotificationsUnreadCount(): Promise<NotificationUnreadCountResponse> {
  try {
    const raw = await api.get<NotificationUnreadCountResponse>('/notifications/unread-count');

    return NotificationUnreadCountResponseSchema.parse(raw);
  } catch (error) {
    const rawFallbackFeed = await api.get<unknown>('/notifications', {
      params: { unreadOnly: true, limit: 100 },
      _silentError: true,
    } as SilentErrorConfig);
    const fallbackCount = tryCountUnreadNotifications(rawFallbackFeed);

    if (fallbackCount !== null) {
      return { count: fallbackCount };
    }

    throw error;
  }
}

export function notificationsUnreadCountOptions() {
  return queryOptions({
    queryKey: notificationUnreadCountKey,
    queryFn: getNotificationsUnreadCount,
    staleTime: 30_000,
  });
}

export function useNotificationsUnreadCount(options: { enabled?: boolean } = {}) {
  const query = useQuery({
    ...notificationsUnreadCountOptions(),
    enabled: options.enabled ?? true,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
