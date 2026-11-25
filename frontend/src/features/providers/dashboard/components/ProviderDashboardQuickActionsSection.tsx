import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { ProviderDashboardQuickAction } from '@/features/providers/dashboard/useProviderDashboardScreen';

const DEFAULT_ACTION_GRADIENT = 'from-cyan-500 to-blue-500';

export function ProviderDashboardQuickActionsSection({
  dashboardLoading,
  dashboardRefreshing,
  onOpenSupportModal,
  quickActions,
}: {
  dashboardLoading: boolean;
  dashboardRefreshing: boolean;
  onOpenSupportModal: () => void;
  quickActions: ProviderDashboardQuickAction[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {dashboardRefreshing ? (
        <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
          Mise à jour...
        </span>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.link}>
            <div className="group relative h-full cursor-pointer overflow-hidden">
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10',
                  action.gradient ?? DEFAULT_ACTION_GRADIENT,
                )}
              />
              <div className="relative h-full rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all group-hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:group-hover:border-slate-600">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110',
                      action.gradient ?? DEFAULT_ACTION_GRADIENT,
                    )}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                      {action.title}
                    </h3>
                    {dashboardLoading && action.descriptionLoading ? (
                      <Skeleton className="mx-auto mt-1 h-3 w-20 rounded" />
                    ) : (
                      <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <div className="relative rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-500/20">
              <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.provider.proSupport}
            </h3>
          </div>
          <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
            {t.provider.needHelpIntervention}
          </p>
          <button
            type="button"
            onClick={onOpenSupportModal}
            className="w-full rounded-lg bg-cyan-500 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 active:scale-[0.98]"
          >
            {t.provider.contactSupport}
          </button>
        </div>
      </div>
    </div>
  );
}
