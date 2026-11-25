import { MetricCard } from '@/shared/ui/composites/metric-card';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { ScheduleStat } from '@/features/providers/schedule-planning/types';

const DEFAULT_STAT_GRADIENT = 'from-cyan-500 to-blue-500';

export function ProviderPlanningStats({ stats }: { stats: ScheduleStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          className="p-3 transition-colors hover:border-cyan-500/40"
          icon={stat.icon}
          iconClassName="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br"
          iconGradient={stat.gradient ?? DEFAULT_STAT_GRADIENT}
          iconRowClassName="mb-2 flex items-center justify-between"
          iconSvgClassName="h-4 w-4 text-white"
          label={stat.label}
          labelClassName="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400"
          value={stat.value}
          valueClassName="text-xl font-bold text-slate-900 dark:text-white"
        />
      ))}
    </div>
  );
}

export function ProviderPlanningStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className={`h-8 w-8 rounded-lg bg-gradient-to-br ${DEFAULT_STAT_GRADIENT}`} />
          </div>
          <Skeleton className="mb-1 h-3 w-20 rounded" />
          <Skeleton className="h-7 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}
