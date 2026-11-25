import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/api/client';
import {
  notificationUnreadCountKey,
  type NotificationUnreadCountResponse,
} from '@/shared/lib/notifications/unread-count';

const NotificationCategorySchema = z.enum([
  'booking',
  'message',
  'finance',
  'account',
  'security',
  'system',
  'reminder',
  'schedule',
  'reward',
]);

const NotificationSeveritySchema = z.enum(['info', 'success', 'warning', 'error']);

const NotificationActionSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const NotificationActorSchema = z.object({
  name: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const NotificationFeedItemSchema = z.object({
  id: z.string(),
  category: NotificationCategorySchema,
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
  archivedAt: z.string().nullable(),
  severity: NotificationSeveritySchema,
  action: NotificationActionSchema.nullable(),
  actor: NotificationActorSchema.nullable(),
  metadata: z.record(z.string(), z.unknown()),
});

export const NotificationFeedResponseSchema = z.object({
  items: z.array(NotificationFeedItemSchema),
  nextCursor: z.string().nullable(),
});

const LegacyNotificationFeedItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  bookingId: z.string().nullable().optional(),
  providerId: z.string().nullable().optional(),
  actionUrl: z.string().nullable().optional(),
  actionData: z.string().nullable().optional(),
  isRead: z.boolean(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

const LegacyNotificationsResponseSchema = z.array(LegacyNotificationFeedItemSchema);

export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;
export type NotificationSeverity = z.infer<typeof NotificationSeveritySchema>;
export type NotificationFeedItem = z.infer<typeof NotificationFeedItemSchema>;
export type NotificationFeedResponse = z.infer<typeof NotificationFeedResponseSchema>;
export type NotificationFeedStatus = 'unread' | 'archived';

export interface NotificationFeedFilters {
  category?: NotificationCategory;
  cursor?: string | null;
  limit?: number;
  status?: NotificationFeedStatus;
}

interface NotificationMutationContext {
  previousLists: Array<readonly [readonly unknown[], NotificationFeedResponse | undefined]>;
  previousUnreadCount: NotificationUnreadCountResponse | null;
}

const EMPTY_NOTIFICATION_FEED: NotificationFeedResponse = {
  items: [],
  nextCursor: null,
};

export const notificationFeedBaseKey = ['notifications', 'list'] as const;

export function notificationFeedKey(filters: NotificationFeedFilters = {}) {
  return [
    ...notificationFeedBaseKey,
    filters.status ?? 'active',
    filters.category ?? 'all',
    String(filters.limit ?? 20),
    filters.cursor ?? '0',
  ] as const;
}

function mapLegacyCategory(type: string): NotificationCategory {
  if (type.startsWith('booking_')) {
    return 'booking';
  }

  switch (type) {
    case 'new_message':
      return 'message';
    case 'validation_pending':
      return 'reminder';
    default:
      return 'system';
  }
}

function mapLegacySeverity(type: string): NotificationSeverity {
  switch (type) {
    case 'booking_confirmed':
      return 'success';
    case 'validation_pending':
      return 'warning';
    default:
      return 'info';
  }
}

function mapLegacyNotification(
  notification: z.infer<typeof LegacyNotificationFeedItemSchema>,
): NotificationFeedItem {
  return {
    id: notification.id,
    category: mapLegacyCategory(notification.type),
    title: notification.title,
    body: notification.message,
    createdAt: notification.createdAt,
    readAt: notification.readAt,
    archivedAt: null,
    severity: mapLegacySeverity(notification.type),
    action: notification.actionUrl
      ? {
          label: notification.actionUrl.includes('schedule')
            ? 'Voir le planning'
            : 'Voir le detail',
          url: notification.actionUrl,
        }
      : null,
    actor: null,
    metadata: {
      type: notification.type,
      bookingId: notification.bookingId ?? null,
      providerId: notification.providerId ?? null,
      actionData: notification.actionData ?? null,
    },
  };
}

function parseNotificationFeed(raw: unknown): NotificationFeedResponse {
  const modern = NotificationFeedResponseSchema.safeParse(raw);
  if (modern.success) {
    return modern.data;
  }

  const legacy = LegacyNotificationsResponseSchema.safeParse(raw);
  if (legacy.success) {
    return {
      items: legacy.data.map(mapLegacyNotification),
      nextCursor: null,
    };
  }

  throw modern.error;
}

function parseNotificationItem(raw: unknown): NotificationFeedItem {
  const modern = NotificationFeedItemSchema.safeParse(raw);
  if (modern.success) {
    return modern.data;
  }

  const legacy = LegacyNotificationFeedItemSchema.safeParse(raw);
  if (legacy.success) {
    return mapLegacyNotification(legacy.data);
  }

  throw modern.error;
}

async function getNotifications(
  filters: NotificationFeedFilters = {},
): Promise<NotificationFeedResponse> {
  const params: Record<string, string | number> = {};

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.category) {
    params.category = filters.category;
  }

  if (filters.limit) {
    params.limit = filters.limit;
  }

  if (filters.cursor) {
    params.cursor = filters.cursor;
  }

  const raw = await api.get<unknown>('/notifications', { params });
  return parseNotificationFeed(raw);
}

export async function markNotificationRead(id: string): Promise<NotificationFeedItem> {
  const raw = await api.patch<unknown>(`/notifications/${id}/read`);
  return parseNotificationItem(raw);
}

export async function markAllNotificationsRead(): Promise<{ count: number; updatedCount: number }> {
  return api.patch<{ count: number; updatedCount: number }>('/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<null> {
  return api.delete<null>(`/notifications/${id}`);
}

export function notificationsFeedOptions(filters: NotificationFeedFilters = {}) {
  return queryOptions({
    queryKey: notificationFeedKey(filters),
    queryFn: () => getNotifications(filters),
    staleTime: 30_000,
  });
}

export function useNotificationsFeed(
  filters: NotificationFeedFilters = {},
  options: { enabled?: boolean } = {},
) {
  const query = useQuery({
    ...notificationsFeedOptions(filters),
    enabled: options.enabled ?? true,
  });

  return {
    data: query.data ?? EMPTY_NOTIFICATION_FEED,
    loading: query.isLoading,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

function getCachedLists(
  queryClient: ReturnType<typeof useQueryClient>,
): Array<readonly [readonly unknown[], NotificationFeedResponse | undefined]> {
  return queryClient.getQueriesData<NotificationFeedResponse>({
    queryKey: notificationFeedBaseKey,
  });
}

function restoreCachedLists(
  queryClient: ReturnType<typeof useQueryClient>,
  previousLists: Array<readonly [readonly unknown[], NotificationFeedResponse | undefined]>,
): void {
  previousLists.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
}

function updateCachedLists(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (feed: NotificationFeedResponse) => NotificationFeedResponse,
): void {
  getCachedLists(queryClient).forEach(([queryKey, feed]) => {
    if (!feed) {
      return;
    }

    queryClient.setQueryData<NotificationFeedResponse>(queryKey, updater(feed));
  });
}

function findCachedNotification(
  cachedLists: Array<readonly [readonly unknown[], NotificationFeedResponse | undefined]>,
  id: string,
): NotificationFeedItem | null {
  for (const [, feed] of cachedLists) {
    const notification = feed?.items.find((item) => item.id === id);

    if (notification) {
      return notification;
    }
  }

  return null;
}

function setUnreadCount(queryClient: ReturnType<typeof useQueryClient>, count: number): void {
  queryClient.setQueryData<NotificationUnreadCountResponse>(notificationUnreadCountKey, {
    count: Math.max(0, count),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id): Promise<NotificationMutationContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.cancelQueries({ queryKey: notificationUnreadCountKey }),
      ]);

      const previousLists = getCachedLists(queryClient);
      const previousUnreadCount =
        queryClient.getQueryData<NotificationUnreadCountResponse>(notificationUnreadCountKey) ??
        null;
      const cachedNotification = findCachedNotification(previousLists, id);

      updateCachedLists(queryClient, (feed) => ({
        ...feed,
        items: feed.items.map((item) =>
          item.id === id && !item.readAt
            ? {
                ...item,
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      }));

      if (
        cachedNotification &&
        !cachedNotification.readAt &&
        !cachedNotification.archivedAt &&
        previousUnreadCount
      ) {
        setUnreadCount(queryClient, previousUnreadCount.count - 1);
      }

      return {
        previousLists,
        previousUnreadCount,
      };
    },
    onError: (_error, _id, context) => {
      if (!context) {
        return;
      }

      restoreCachedLists(queryClient, context.previousLists);

      if (context.previousUnreadCount) {
        queryClient.setQueryData(notificationUnreadCountKey, context.previousUnreadCount);
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.invalidateQueries({ queryKey: notificationUnreadCountKey }),
      ]),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async (): Promise<NotificationMutationContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.cancelQueries({ queryKey: notificationUnreadCountKey }),
      ]);

      const previousLists = getCachedLists(queryClient);
      const previousUnreadCount =
        queryClient.getQueryData<NotificationUnreadCountResponse>(notificationUnreadCountKey) ??
        null;

      updateCachedLists(queryClient, (feed) => ({
        ...feed,
        items: feed.items.map((item) =>
          item.readAt || item.archivedAt
            ? item
            : {
                ...item,
                readAt: new Date().toISOString(),
              },
        ),
      }));

      setUnreadCount(queryClient, 0);

      return {
        previousLists,
        previousUnreadCount,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      restoreCachedLists(queryClient, context.previousLists);

      if (context.previousUnreadCount) {
        queryClient.setQueryData(notificationUnreadCountKey, context.previousUnreadCount);
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.invalidateQueries({ queryKey: notificationUnreadCountKey }),
      ]),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onMutate: async (id): Promise<NotificationMutationContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.cancelQueries({ queryKey: notificationUnreadCountKey }),
      ]);

      const previousLists = getCachedLists(queryClient);
      const previousUnreadCount =
        queryClient.getQueryData<NotificationUnreadCountResponse>(notificationUnreadCountKey) ??
        null;
      const cachedNotification = findCachedNotification(previousLists, id);

      updateCachedLists(queryClient, (feed) => ({
        ...feed,
        items: feed.items.filter((item) => item.id !== id),
      }));

      if (
        cachedNotification &&
        !cachedNotification.readAt &&
        !cachedNotification.archivedAt &&
        previousUnreadCount
      ) {
        setUnreadCount(queryClient, previousUnreadCount.count - 1);
      }

      return {
        previousLists,
        previousUnreadCount,
      };
    },
    onError: (_error, _id, context) => {
      if (!context) {
        return;
      }

      restoreCachedLists(queryClient, context.previousLists);

      if (context.previousUnreadCount) {
        queryClient.setQueryData(notificationUnreadCountKey, context.previousUnreadCount);
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationFeedBaseKey }),
        queryClient.invalidateQueries({ queryKey: notificationUnreadCountKey }),
      ]),
  });
}
