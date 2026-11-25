import { http } from 'msw';

import { apiNotFound, apiOk } from '@/mocks/utils';

const NOTIFICATION_CATEGORIES = [
  'booking',
  'message',
  'finance',
  'account',
  'security',
  'system',
  'reminder',
  'schedule',
  'reward',
] as const;

const NOTIFICATION_STATUS_FILTERS = ['unread', 'archived'] as const;

type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';
type NotificationStatusFilter = (typeof NOTIFICATION_STATUS_FILTERS)[number];

interface NotificationResponse {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
  severity: NotificationSeverity;
  action: { label: string; url: string } | null;
  actor: { name?: string | null; avatarUrl?: string | null } | null;
  metadata: Record<string, unknown>;
}

const categorySet = new Set<string>(NOTIFICATION_CATEGORIES);
const statusSet = new Set<string>(NOTIFICATION_STATUS_FILTERS);

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}

const seedNotifications: NotificationResponse[] = [
  {
    id: 'notif_booking_confirmed',
    category: 'booking',
    title: 'Rendez-vous confirme',
    body: 'Votre rendez-vous de soins a domicile est confirme pour demain a 14:00.',
    createdAt: hoursAgo(2),
    readAt: null,
    archivedAt: null,
    severity: 'success',
    action: { label: 'Voir le rendez-vous', url: '/mon-espace' },
    actor: { name: 'Amira Mansour', avatarUrl: null },
    metadata: {},
  },
  {
    id: 'notif_message_new',
    category: 'message',
    title: 'Nouveau message',
    body: 'Votre prestataire a envoye une precision sur la visite de demain.',
    createdAt: hoursAgo(5),
    readAt: null,
    archivedAt: null,
    severity: 'info',
    action: { label: 'Ouvrir les messages', url: '/messages/conversation-1' },
    actor: { name: 'Dr. Fatma Ben Said', avatarUrl: null },
    metadata: {},
  },
  {
    id: 'notif_finance_paid',
    category: 'finance',
    title: 'Paiement recu',
    body: 'Votre dernier paiement a ete confirme par le service de paiement.',
    createdAt: daysAgo(1),
    readAt: daysAgo(1),
    archivedAt: null,
    severity: 'success',
    action: { label: 'Voir les transactions', url: '/provider/transactions' },
    actor: null,
    metadata: {},
  },
  {
    id: 'notif_security_review',
    category: 'security',
    title: 'Verification de securite',
    body: 'Un nouvel appareil a ete utilise pour acceder a votre compte.',
    createdAt: daysAgo(2),
    readAt: null,
    archivedAt: null,
    severity: 'warning',
    action: { label: 'Verifier le compte', url: '/patient/profile' },
    actor: null,
    metadata: {},
  },
  {
    id: 'notif_reward_points',
    category: 'reward',
    title: 'Points ajoutes',
    body: 'Vous avez gagne des points apres votre dernier rendez-vous termine.',
    createdAt: daysAgo(3),
    readAt: daysAgo(3),
    archivedAt: null,
    severity: 'info',
    action: null,
    actor: null,
    metadata: {},
  },
  {
    id: 'notif_archived_example',
    category: 'system',
    title: 'Notification archivee',
    body: 'Cette notification montre la vue archivee en mode mock.',
    createdAt: daysAgo(6),
    readAt: daysAgo(5),
    archivedAt: daysAgo(4),
    severity: 'info',
    action: null,
    actor: null,
    metadata: {},
  },
];

let notifications = seedNotifications.map(cloneNotification);

function cloneNotification(notification: NotificationResponse): NotificationResponse {
  return {
    ...notification,
    action: notification.action ? { ...notification.action } : notification.action,
    actor: notification.actor ? { ...notification.actor } : notification.actor,
    metadata: { ...notification.metadata },
  };
}

function parseCursor(cursor: string | null): number {
  if (!cursor) {
    return 0;
  }

  const offset = Number.parseInt(cursor, 10);
  return Number.isFinite(offset) && offset >= 0 ? offset : 0;
}

function parseLimit(limit: string | null): number {
  if (!limit) {
    return 20;
  }

  const parsed = Number.parseInt(limit, 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100) : 20;
}

function parseCategory(category: string | null): NotificationCategory | undefined {
  return category && categorySet.has(category) ? (category as NotificationCategory) : undefined;
}

function parseStatus(status: string | null): NotificationStatusFilter | undefined {
  return status && statusSet.has(status) ? (status as NotificationStatusFilter) : undefined;
}

function getVisibleNotifications(url: URL): NotificationResponse[] {
  const status = parseStatus(url.searchParams.get('status'));
  const category = parseCategory(url.searchParams.get('category'));

  return notifications
    .filter((notification) => {
      if (status === 'archived') {
        return Boolean(notification.archivedAt);
      }

      if (notification.archivedAt) {
        return false;
      }

      if (status === 'unread') {
        return !notification.readAt;
      }

      return true;
    })
    .filter((notification) => (category ? notification.category === category : true))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function findNotification(id: string): NotificationResponse | undefined {
  return notifications.find((notification) => notification.id === id);
}

function markRead(notification: NotificationResponse): NotificationResponse {
  if (!notification.readAt) {
    notification.readAt = new Date().toISOString();
  }

  return notification;
}

export const notificationHandlers = [
  http.get('*/api/v1/notifications', ({ request }) => {
    const url = new URL(request.url);
    const cursor = parseCursor(url.searchParams.get('cursor'));
    const limit = parseLimit(url.searchParams.get('limit'));
    const visibleNotifications = getVisibleNotifications(url);
    const items = visibleNotifications.slice(cursor, cursor + limit).map(cloneNotification);
    const nextCursor = cursor + limit < visibleNotifications.length ? String(cursor + limit) : null;

    return apiOk({ items, nextCursor });
  }),

  http.get('*/api/v1/notifications/unread-count', () => {
    const count = notifications.filter(
      (notification) => !notification.readAt && !notification.archivedAt,
    ).length;

    return apiOk({ count });
  }),

  http.patch('*/api/v1/notifications/read-all', () => {
    let count = 0;

    notifications = notifications.map((notification) => {
      if (notification.readAt || notification.archivedAt) {
        return notification;
      }

      count += 1;
      return markRead(notification);
    });

    return apiOk({ count, updatedCount: count });
  }),

  http.patch('*/api/v1/notifications/:id/read', ({ params }) => {
    const notification = findNotification(String(params.id));

    if (!notification) {
      return apiNotFound('Notification not found.');
    }

    return apiOk(cloneNotification(markRead(notification)));
  }),

  http.patch('*/api/v1/notifications/:id/archive', ({ params }) => {
    const notification = findNotification(String(params.id));

    if (!notification) {
      return apiNotFound('Notification not found.');
    }

    notification.archivedAt = notification.archivedAt ?? new Date().toISOString();

    return apiOk(cloneNotification(notification));
  }),

  http.patch('*/api/v1/notifications/:id/unarchive', ({ params }) => {
    const notification = findNotification(String(params.id));

    if (!notification) {
      return apiNotFound('Notification not found.');
    }

    notification.archivedAt = null;

    return apiOk(cloneNotification(notification));
  }),

  http.delete('*/api/v1/notifications/:id', ({ params }) => {
    const id = String(params.id);
    const beforeCount = notifications.length;
    notifications = notifications.filter((notification) => notification.id !== id);

    if (notifications.length === beforeCount) {
      return apiNotFound('Notification not found.');
    }

    return apiOk(null);
  }),
];
