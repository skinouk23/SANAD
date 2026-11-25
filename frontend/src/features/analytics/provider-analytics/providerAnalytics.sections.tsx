import { motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Users,
  Wallet,
} from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';
import type {
  ProviderAnalytics,
  ProviderAnalyticsPeriod,
  ProviderAnalyticsTopZone,
} from '@/features/analytics';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { formatCurrency, formatNumber } from '@/shared/lib/i18n/formatting';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonMetricGrid } from '@/shared/ui/composites/loading';
import { MetricCard } from '@/shared/ui/composites/metric-card';

import type {
  ProviderAnalyticsRevenuePointViewModel,
  ProviderAnalyticsStat,
} from './providerAnalytics.hooks';

function formatMoney(value: number, currency: string, locale: string): string {
  return formatCurrency(
    value,
    currency,
    {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
    locale,
  );
}

function getPeriodButtonLabel(
  period: ProviderAnalyticsPeriod,
  labels: {
    week: string;
    month: string;
    year: string;
  },
): string {
  switch (period) {
    case 'week':
      return labels.week;
    case 'month':
      return labels.month;
    case 'year':
      return labels.year;
  }
}

function getStatGradient(iconName: ProviderAnalyticsStat['iconName']): string {
  switch (iconName) {
    case 'revenue':
      return 'from-green-500 to-emerald-500';
    case 'appointments':
      return 'from-blue-500 to-cyan-500';
    case 'patients':
      return 'from-purple-500 to-pink-500';
    case 'rating':
      return 'from-amber-500 to-orange-500';
  }
}

function getStatIcon(iconName: ProviderAnalyticsStat['iconName']) {
  switch (iconName) {
    case 'revenue':
      return DollarSign;
    case 'appointments':
      return Calendar;
    case 'patients':
      return Users;
    case 'rating':
      return Star;
  }
}

export function ProviderAnalyticsHeader({
  isUpdating,
  period,
  onPeriodChange,
}: {
  isUpdating: boolean;
  period: ProviderAnalyticsPeriod;
  onPeriodChange: (period: ProviderAnalyticsPeriod) => void;
}) {
  const { t } = useLanguage();

  return (
    <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
            {t.provider.analytics}
          </p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {t.provider.statisticsAnalytics}
          </h1>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            {t.provider.analyzePerformance}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div
            aria-busy={isUpdating || undefined}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
          >
            {(['week', 'month', 'year'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onPeriodChange(value)}
                className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-all sm:text-xs ${
                  period === value
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {getPeriodButtonLabel(value, {
                  week: t.provider.weekShort,
                  month: t.provider.monthShort,
                  year: t.provider.yearShort,
                })}
              </button>
            ))}
          </div>
          {isUpdating ? (
            <span
              aria-live="polite"
              className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
            >
              Mise a jour...
            </span>
          ) : null}
        </div>
      </div>
    </ProviderRouteHeader>
  );
}

export function ProviderAnalyticsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <EmptyState
        className="w-full max-w-2xl rounded-2xl border-rose-200 bg-rose-50/80 shadow-sm backdrop-blur-sm dark:border-red-500/30 dark:bg-red-950/20"
        icon={<AlertCircle className="h-8 w-8 text-rose-600 dark:text-red-400" />}
        title={t.provider.analyticsUnavailable}
        description={message}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-cyan-600 hover:to-blue-600"
          >
            {t.common.retry}
          </button>
        }
      />
    </div>
  );
}

export function ProviderAnalyticsStatGrid({
  isUpdating,
  loading,
  stats,
}: {
  isUpdating: boolean;
  loading: boolean;
  stats: ProviderAnalyticsStat[];
}) {
  if (loading) {
    return <SkeletonMetricGrid className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" />;
  }

  return (
    <div
      aria-busy={isUpdating || undefined}
      className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-4"
          icon={getStatIcon(stat.iconName)}
          iconClassName={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white sm:h-10 sm:w-10 ${getStatGradient(stat.iconName)}`}
          iconGradient=""
          iconRowClassName="mb-3 flex items-center justify-between"
          iconSvgClassName="h-4 w-4 sm:h-5 sm:w-5"
          label={stat.label}
          labelClassName="mb-1 text-[10px] font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400"
          subtitle={stat.subtitle}
          subtitleClassName="mt-1 text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs"
          value={stat.value}
          valueClassName="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl"
          valueSuffix={stat.unit}
          valueSuffixClassName="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs"
          valueWrapperClassName="flex items-baseline gap-1"
        />
      ))}
    </div>
  );
}

export function ProviderRevenueCard({
  currency,
  loading,
  maxValue,
  points,
}: {
  currency: string;
  loading: boolean;
  maxValue: number;
  points: ProviderAnalyticsRevenuePointViewModel[];
}) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.code;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          {t.provider.revenueEvolution}
        </h3>
        <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 sm:h-5 sm:w-5" />
      </div>

      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <div className="mb-1.5 flex justify-between sm:mb-2">
                <Skeleton className="h-3 w-16 rounded sm:h-4" />
                <Skeleton className="h-3 w-24 rounded sm:h-4" />
              </div>
              <Skeleton className="h-2 w-full rounded-full sm:h-2.5" />
            </div>
          ))}
        </div>
      ) : points.length ? (
        <div
          className={`space-y-3 sm:space-y-4 ${points.length > 8 ? 'max-h-80 overflow-y-auto pr-2' : ''}`}
        >
          {points.map((point, index) => (
            <div key={`${point.label}-${point.amount}`}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
                  {point.label}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                  {formatMoney(point.amount, currency, locale)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:h-2.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${maxValue > 0 ? (point.amount / maxValue) * 100 : 0}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          className="border-slate-200 bg-slate-50/80 py-10 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40"
          title={t.common.noData}
          description={t.provider.noRevenueData}
        />
      )}
    </div>
  );
}

export function ProviderTopZonesCard({
  loading,
  zones,
}: {
  loading: boolean;
  zones: ProviderAnalyticsTopZone[];
}) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.code;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          {t.provider.topZones}
        </h3>
        <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400 sm:h-5 sm:w-5" />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-1.5 flex justify-between sm:mb-2">
                  <Skeleton className="h-3 w-24 rounded sm:h-4" />
                  <Skeleton className="h-3 w-20 rounded sm:h-4" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full sm:h-2" />
              </div>
            ))
          : zones.map((zone, index) => (
              <div key={zone.city}>
                <div className="mb-1.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
                    {zone.city}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                    {formatNumber(zone.bookingCount, undefined, locale)} {t.provider.bookings}
                  </span>
                </div>
                <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:h-2">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(zone.percentage, 100))}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                  {formatNumber(zone.percentage, { maximumFractionDigits: 0 }, locale)}%
                </p>
              </div>
            ))}

        {!loading && !zones.length ? (
          <EmptyState
            className="border-slate-200 bg-slate-50/80 py-10 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/40"
            title={t.common.noData}
            description={t.provider.noZonesData}
          />
        ) : null}
      </div>
    </div>
  );
}

export function ProviderAnalyticsSummaryCards({
  analytics,
  loading,
}: {
  analytics: ProviderAnalytics | null | undefined;
  loading: boolean;
}) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.code;
  const walletSummary = analytics?.walletSummary;
  const walletActivity = analytics?.walletActivity;
  const appointmentStats = analytics?.appointmentsByStatus;
  const currency = walletSummary?.currency ?? 'TND';

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {t.provider.walletSummary}
          </h3>
          <Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400 sm:h-5 sm:w-5" />
        </div>

        {loading ? (
          <SummarySkeletonRows count={2} />
        ) : (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
              {t.provider.usableBalance}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-cyan-600 dark:text-cyan-400 sm:text-4xl">
              {formatMoney(walletSummary?.usableBalance ?? 0, currency, locale)}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {t.provider.reservedBalance}:{' '}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {formatMoney(walletSummary?.reservedBalance ?? 0, currency, locale)}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {t.provider.appointmentBreakdown}
          </h3>
          <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400 sm:h-5 sm:w-5" />
        </div>

        {loading ? (
          <SummarySkeletonRows count={4} />
        ) : (
          <div className="space-y-3 text-xs sm:text-sm">
            <SummaryRow
              label={t.provider.confirmed}
              value={formatNumber(appointmentStats?.confirmed ?? 0, undefined, locale)}
              valueClassName="text-green-600 dark:text-green-400"
            />
            <SummaryRow
              label={t.provider.pending}
              value={formatNumber(appointmentStats?.pending ?? 0, undefined, locale)}
              valueClassName="text-amber-600 dark:text-amber-400"
            />
            <SummaryRow
              label={t.provider.completed}
              value={formatNumber(appointmentStats?.completed ?? 0, undefined, locale)}
              valueClassName="text-blue-600 dark:text-cyan-400"
            />
            <SummaryRow
              label={t.provider.total}
              value={formatNumber(appointmentStats?.total ?? 0, undefined, locale)}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {t.provider.walletActivity}
          </h3>
          <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 sm:h-5 sm:w-5" />
        </div>

        {loading ? (
          <SummarySkeletonRows count={2} />
        ) : (
          <div className="space-y-3 text-xs sm:text-sm">
            <SummaryRow
              label={t.provider.currentMonthDeposits}
              value={formatMoney(walletActivity?.currentMonthDeposits ?? 0, currency, locale)}
              valueClassName="text-green-600 dark:text-green-400"
            />
            <SummaryRow
              label={t.provider.currentMonthDeductions}
              value={formatMoney(walletActivity?.currentMonthDeductions ?? 0, currency, locale)}
              valueClassName="text-red-600 dark:text-red-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SummarySkeletonRows({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={`text-right font-bold ${valueClassName ?? 'text-slate-900 dark:text-white'}`}
      >
        {value}
      </span>
    </div>
  );
}
