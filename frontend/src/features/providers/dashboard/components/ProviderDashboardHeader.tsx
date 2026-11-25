import { Bell } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers/shared/ui/ProviderRouteHeader';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { ProviderDashboardScreenViewModel } from '@/features/providers/dashboard/useProviderDashboardScreen';

export function ProviderDashboardHeader({
  availabilityPending,
  currentProviderName,
  currentProviderSubtitle,
  dashboardLoading,
  isAvailable,
  notificationsLoading,
  notificationsUnreadCount,
  onOpenNotificationsPanel,
  onToggleAvailability,
}: Pick<
  ProviderDashboardScreenViewModel,
  | 'availabilityPending'
  | 'currentProviderName'
  | 'currentProviderSubtitle'
  | 'dashboardLoading'
  | 'isAvailable'
  | 'notificationsLoading'
  | 'notificationsUnreadCount'
  | 'onOpenNotificationsPanel'
  | 'onToggleAvailability'
>) {
  const { t } = useLanguage();

  return (
    <ProviderRouteHeader containerClassName="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
            {t.provider.greeting}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {dashboardLoading ? (
              <Skeleton className="inline-block h-7 w-40 rounded" />
            ) : (
              currentProviderName
            )}
          </h1>
          {dashboardLoading ? (
            <Skeleton className="mt-2 h-3 w-48 rounded" />
          ) : (
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              {currentProviderSubtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenNotificationsPanel}
            aria-label={t.notifications.title}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:shadow-none dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {!notificationsLoading && notificationsUnreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                {notificationsUnreadCount > 9 ? '9+' : notificationsUnreadCount}
              </span>
            ) : null}
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
            <span
              className={`text-xs font-medium ${
                isAvailable ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {isAvailable ? t.provider.online : t.provider.offline}
            </span>
            <button
              type="button"
              aria-label={t.provider.setAvailability}
              aria-pressed={isAvailable}
              disabled={availabilityPending}
              onClick={() => void onToggleAvailability()}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${
                isAvailable ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-4' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </ProviderRouteHeader>
  );
}
