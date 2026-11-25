import { CheckCircle2 } from 'lucide-react';

import type { InsuranceStatCard } from '@/features/insurance/provider-insurance/providerInsurance.hooks';
import { MetricCard } from '@/shared/ui/composites/metric-card';

export function ProviderInsuranceStats({ stats }: { stats: InsuranceStatCard[] }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          className={`rounded-xl border bg-white/80 p-2.5 shadow-sm backdrop-blur-sm sm:p-3 dark:bg-slate-800/50 ${
            stat.highlight
              ? 'border-green-200 dark:border-green-500/30'
              : 'border-slate-200 dark:border-slate-700/50'
          }`}
          icon={stat.icon}
          iconClassName={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} sm:h-8 sm:w-8`}
          iconGradient=""
          iconRowClassName="mb-1.5 flex items-center justify-between sm:mb-2"
          iconSvgClassName="h-3.5 w-3.5 text-white sm:h-4 sm:w-4"
          label={stat.label}
          labelClassName="mb-0.5 text-[9px] font-medium uppercase text-cyan-600 sm:text-[10px] dark:text-cyan-400"
          subtitle={stat.sub}
          subtitleClassName="mt-0.5 text-[9px] text-slate-500 sm:text-[10px]"
          trailing={stat.highlight ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null}
          value={stat.value}
          valueClassName="text-base font-bold text-slate-900 sm:text-lg dark:text-white"
        />
      ))}
    </div>
  );
}
