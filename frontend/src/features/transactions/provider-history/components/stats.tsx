import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

import { SkeletonMetricGrid } from '@/shared/ui/composites/loading';

import type { ProviderTransactionHistoryStat } from '@/features/transactions/provider-history/providerTransactionHistory.hooks';

const statIconGradients: Record<ProviderTransactionHistoryStat['iconName'], string> = {
  revenue: 'from-green-500 to-emerald-500',
  pending: 'from-amber-500 to-orange-500',
  completed: 'from-blue-500 to-cyan-500',
  average: 'from-purple-500 to-pink-500',
};

function StatIcon({ iconName }: { iconName: ProviderTransactionHistoryStat['iconName'] }) {
  switch (iconName) {
    case 'revenue':
      return <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />;
    case 'pending':
      return <Clock className="h-4 w-4 sm:h-5 sm:w-5" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
    case 'average':
      return <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />;
  }
}

export function ProviderTransactionStats({
  loading,
  stats,
}: {
  loading: boolean;
  stats: ProviderTransactionHistoryStat[];
}) {
  if (loading) {
    return <SkeletonMetricGrid className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4" />;
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-4"
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white sm:h-10 sm:w-10 ${statIconGradients[stat.iconName]}`}
            >
              <StatIcon iconName={stat.iconName} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[9px] uppercase tracking-wide text-slate-500 transition-colors group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-400 sm:text-[10px]">
                {stat.label}
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white sm:text-xl">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
