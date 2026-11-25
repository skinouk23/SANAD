import { BarChart3 } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { MetricCard } from '@/shared/ui/composites/metric-card';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { ProviderDashboardStat } from '@/features/providers/dashboard/useProviderDashboardScreen';

const DEFAULT_STAT_GRADIENT = 'from-cyan-500 to-blue-500';
const DASHBOARD_STAT_SKELETON_ITEMS = 4;

function ProviderDashboardMetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="mb-3 flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="mb-1.5 h-3 w-20 rounded" />
      <div className="flex items-baseline gap-1">
        <Skeleton className="h-7 w-16 rounded" />
        <Skeleton className="h-3 w-8 rounded" />
      </div>
      <Skeleton className="mt-1 h-2.5 w-24 rounded" />
    </div>
  );
}

export function ProviderDashboardStatsSection({
  dashboardError,
  dashboardLoading,
  dashboardRefreshing,
  onRetry,
  stats,
}: {
  dashboardError: unknown;
  dashboardLoading: boolean;
  dashboardRefreshing: boolean;
  onRetry: () => void;
  stats: ProviderDashboardStat[];
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      {dashboardRefreshing ? (
        <div className="col-span-2 -mb-2">
          <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
            Mise à jour...
          </span>
        </div>
      ) : null}
      {dashboardLoading ? (
        Array.from({ length: DASHBOARD_STAT_SKELETON_ITEMS }).map((_, index) => (
          <ProviderDashboardMetricCardSkeleton key={index} />
        ))
      ) : dashboardError ? (
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
          <BarChart3 className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            {t.common.loadingError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-100 dark:border-cyan-500/50 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30"
          >
            {t.common.retry}
          </button>
        </div>
      ) : (
        stats.map((stat) => (
          <MetricCard
            key={stat.label}
            className="group p-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
            icon={stat.icon}
            iconClassName="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110"
            iconGradient={stat.gradient ?? DEFAULT_STAT_GRADIENT}
            iconRowClassName="mb-3 flex items-start justify-between"
            iconSvgClassName="h-5 w-5 text-white"
            label={stat.label}
            labelClassName="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400"
            subtitle={stat.subtitle}
            subtitleClassName="mt-1 text-[10px] text-slate-500 dark:text-slate-500"
            value={stat.value}
            valueClassName="text-2xl font-bold text-slate-900 dark:text-white"
            valueSuffix={stat.unit}
            valueSuffixClassName="text-xs text-slate-500 dark:text-slate-400"
            valueWrapperClassName="flex items-baseline gap-1"
          />
        ))
      )}
    </div>
  );
}
