import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  Gift,
  MessageCircle,
  Settings,
  Shield,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';

import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsFeed,
  type NotificationCategory,
  type NotificationFeedItem,
} from '@/shared/lib/notifications/feed';
import { resolveNotificationDestination } from '@/shared/lib/notifications/navigation';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { Skeleton } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/primitives/sheet';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeTime(value: string, locale: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffMinutes = Math.round((date.getTime() - Date.now()) / (1000 * 60));
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
}

function getNotificationGradient(
  category: NotificationCategory,
  notification: NotificationFeedItem,
): string {
  switch (category) {
    case 'booking':
    case 'schedule':
      return 'from-cyan-500 to-blue-500';
    case 'message':
      return 'from-blue-500 to-violet-500';
    case 'reward':
      return 'from-fuchsia-500 to-pink-500';
    case 'finance':
      return 'from-emerald-500 to-green-500';
    case 'security':
      return notification.severity === 'warning'
        ? 'from-amber-500 to-orange-500'
        : 'from-rose-500 to-red-500';
    case 'account':
      return 'from-slate-500 to-slate-700';
    case 'reminder':
      return 'from-amber-500 to-orange-500';
    case 'system':
    default:
      return 'from-teal-500 to-cyan-500';
  }
}

function getNotificationIcon(category: NotificationCategory, notification: NotificationFeedItem) {
  const className = 'h-5 w-5 text-white';

  switch (category) {
    case 'booking':
    case 'schedule':
      return <Calendar className={className} />;
    case 'message':
      return <MessageCircle className={className} />;
    case 'reward':
      return <Gift className={className} />;
    case 'finance':
      return <Wallet className={className} />;
    case 'security':
      return notification.severity === 'warning' ? (
        <AlertCircle className={className} />
      ) : (
        <Shield className={className} />
      );
    case 'account':
      return <Shield className={className} />;
    case 'system':
      return <Settings className={className} />;
    case 'reminder':
    default:
      return <Bell className={className} />;
  }
}

function NotificationsLoadingState() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40"
        >
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  const { data, loading, error, refetch } = useNotificationsFeed(
    { limit: 50 },
    { enabled: isOpen },
  );
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();
  const notifications = data.items;
  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.readAt && !notification.archivedAt)
      .length;
  }, [notifications]);

  const handleNotificationActivation = (
    notification: NotificationFeedItem,
    destination: string,
    isDeleting: boolean,
    isMarkingRead: boolean,
  ) => {
    if (isDeleting) {
      return;
    }

    if (!notification.readAt && !notification.archivedAt && !isMarkingRead) {
      void markReadMutation.mutateAsync(notification.id).catch(() => undefined);
    }

    onClose();
    navigate(destination);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        size="sm"
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="flex-row items-center justify-between gap-4 border-b border-slate-200 bg-white/85 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shadow-sm">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    {t.notifications.title}
                  </SheetTitle>
                  {unreadCount > 0 ? (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </div>
                <SheetDescription className="sr-only">{t.notifications.title}</SheetDescription>
              </div>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                aria-label={t.common.close}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>

          {unreadCount > 0 ? (
            <div className="border-b border-slate-200 bg-cyan-50/80 p-3 dark:border-slate-700/50 dark:bg-slate-900/30">
              <button
                type="button"
                disabled={markAllMutation.isPending}
                onClick={() => void markAllMutation.mutateAsync()}
                className="flex items-center gap-2 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                <Check className="h-4 w-4" />
                {t.notifications.markAllRead}
              </button>
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/20">
            {loading ? (
              <NotificationsLoadingState />
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {t.common.loadingError}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => void refetch()}>
                  {t.common.retry}
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200/70 dark:bg-slate-800">
                  <Bell className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {t.notifications.noNotifications}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {notifications.map((notification) => {
                  const isUnread = !notification.readAt && !notification.archivedAt;
                  const isMarkingRead =
                    markReadMutation.isPending && markReadMutation.variables === notification.id;
                  const isDeleting =
                    deleteMutation.isPending && deleteMutation.variables === notification.id;
                  const destination = resolveNotificationDestination(notification, 'patient');
                  const isNavigable = Boolean(destination);

                  return (
                    <div
                      key={notification.id}
                      role={isNavigable ? 'button' : undefined}
                      tabIndex={isNavigable ? 0 : undefined}
                      aria-label={
                        isNavigable
                          ? `${notification.title}. ${notification.action?.label ?? t.common.details}`
                          : undefined
                      }
                      onClick={
                        destination
                          ? () =>
                              handleNotificationActivation(
                                notification,
                                destination,
                                isDeleting,
                                isMarkingRead,
                              )
                          : undefined
                      }
                      onKeyDown={
                        destination
                          ? (event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleNotificationActivation(
                                  notification,
                                  destination,
                                  isDeleting,
                                  isMarkingRead,
                                );
                              }
                            }
                          : undefined
                      }
                      className={`p-4 transition-colors hover:bg-cyan-50/70 dark:hover:bg-slate-900/40 ${isUnread ? 'bg-cyan-500/10' : ''} ${
                        isNavigable
                          ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
                          : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getNotificationGradient(notification.category, notification)} shadow-sm`}
                        >
                          {getNotificationIcon(notification.category, notification)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3
                                className={`text-sm font-semibold ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                              >
                                {notification.title}
                              </h3>
                              {notification.actor?.name ? (
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  {notification.actor.name}
                                </p>
                              ) : null}
                            </div>
                            {isUnread ? (
                              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-rose-500" />
                            ) : null}
                          </div>

                          <p className="mb-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {notification.body}
                          </p>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatRelativeTime(notification.createdAt, currentLanguage.code)}
                            </span>

                            <div className="flex items-center gap-1">
                              {isUnread ? (
                                <button
                                  type="button"
                                  disabled={isMarkingRead || isDeleting}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void markReadMutation.mutateAsync(notification.id);
                                  }}
                                  className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                  title={t.notifications.markRead}
                                  aria-label={`${t.notifications.markRead}: ${notification.title}`}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              ) : null}

                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void deleteMutation.mutateAsync(notification.id);
                                }}
                                className="rounded-md p-1.5 text-rose-500 transition-colors hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                title={t.common.delete}
                                aria-label={`${t.common.delete}: ${notification.title}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white/85 p-4 dark:border-slate-700/50 dark:bg-slate-900/80">
            <Button variant="outline" size="sm" onClick={onClose} className="w-full">
              {t.common.close}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
