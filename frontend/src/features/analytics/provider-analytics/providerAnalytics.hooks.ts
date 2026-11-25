import { useEffect, useMemo, useState } from 'react';

import {
  useProviderAnalytics,
  type ProviderAnalyticsPeriod,
  type ProviderAnalyticsRevenuePoint,
  type ProviderAnalyticsTopZone,
} from '@/features/analytics';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { formatNumber } from '@/shared/lib/i18n/formatting';

export interface ProviderAnalyticsStat {
  label: string;
  value: string;
  unit: string;
  subtitle: string;
  iconName: 'revenue' | 'appointments' | 'patients' | 'rating';
}

export interface ProviderAnalyticsRevenuePointViewModel {
  label: string;
  amount: number;
}

function parseRevenueLabel(label: string, period: ProviderAnalyticsPeriod): Date | null {
  if (period === 'year') {
    const match = /^(\d{4})-(\d{2})$/.exec(label);
    if (!match) {
      return null;
    }

    const [, year, month] = match;
    return new Date(Number(year), Number(month) - 1, 1);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(label);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatRevenueLabel(
  label: string,
  period: ProviderAnalyticsPeriod,
  locale: string,
): string {
  const date = parseRevenueLabel(label, period);

  if (!date || Number.isNaN(date.getTime())) {
    return label;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    ...(period === 'year'
      ? {
          month: 'short',
          year: 'numeric',
        }
      : {
          day: 'numeric',
          month: 'short',
        }),
  });

  return formatter.format(date);
}

function getPeriodLabel(
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

export function useProviderAnalyticsScreen() {
  const { currentLanguage, t } = useLanguage();
  const [period, setPeriod] = useState<ProviderAnalyticsPeriod>('month');
  const [confirmedDataPeriod, setConfirmedDataPeriod] = useState<ProviderAnalyticsPeriod>('month');
  const analyticsQuery = useProviderAnalytics(period);

  const analytics = analyticsQuery.data;
  const locale = currentLanguage.code;
  const currency = analytics?.walletSummary.currency ?? 'TND';
  const displayPeriod = analyticsQuery.isPlaceholderData ? confirmedDataPeriod : period;
  const displayPeriodLabel = getPeriodLabel(displayPeriod, {
    week: t.provider.weekShort,
    month: t.provider.monthShort,
    year: t.provider.yearShort,
  });

  useEffect(() => {
    if (analytics && !analyticsQuery.isPlaceholderData) {
      setConfirmedDataPeriod(period);
    }
  }, [analytics, analyticsQuery.isPlaceholderData, period]);

  const stats = useMemo<ProviderAnalyticsStat[]>(() => {
    const overview = analytics?.overview;

    return [
      {
        label: t.provider.revenue,
        value: formatNumber(overview?.revenue ?? 0, { maximumFractionDigits: 0 }, locale),
        unit: currency,
        subtitle: `${t.provider.analyticsSelectedPeriod}: ${displayPeriodLabel}`,
        iconName: 'revenue',
      },
      {
        label: t.provider.appointments,
        value: formatNumber(overview?.appointments ?? 0, undefined, locale),
        unit: '',
        subtitle: `${t.provider.analyticsSelectedPeriod}: ${displayPeriodLabel}`,
        iconName: 'appointments',
      },
      {
        label: t.provider.patients,
        value: formatNumber(overview?.uniquePatients ?? 0, undefined, locale),
        unit: '',
        subtitle: `${t.provider.analyticsSelectedPeriod}: ${displayPeriodLabel}`,
        iconName: 'patients',
      },
      {
        label: t.provider.rating,
        value: formatNumber(
          overview?.averageRating ?? 0,
          { maximumFractionDigits: 1, minimumFractionDigits: 1 },
          locale,
        ),
        unit: '/5',
        subtitle: `${formatNumber(overview?.reviewCount ?? 0, undefined, locale)} ${t.provider.reviews} • ${t.provider.allTime}`,
        iconName: 'rating',
      },
    ];
  }, [analytics?.overview, currency, displayPeriodLabel, locale, t]);

  const revenueData = useMemo<ProviderAnalyticsRevenuePointViewModel[]>(() => {
    return (analytics?.revenueSeries ?? []).map((point: ProviderAnalyticsRevenuePoint) => ({
      label: formatRevenueLabel(point.label, displayPeriod, locale),
      amount: point.amount,
    }));
  }, [analytics?.revenueSeries, displayPeriod, locale]);

  const topZones = useMemo<ProviderAnalyticsTopZone[]>(
    () => analytics?.topZones ?? [],
    [analytics],
  );

  return {
    analytics,
    error: analyticsQuery.error,
    displayPeriod,
    displayPeriodLabel,
    isPlaceholderData: analyticsQuery.isPlaceholderData,
    isRefreshing: analyticsQuery.isRefreshing,
    loading: analyticsQuery.loading,
    period,
    refetchAll: () => {
      void analyticsQuery.refetch();
    },
    revenueData,
    revenueMax: Math.max(...revenueData.map((item) => item.amount), 1),
    setPeriod,
    stats,
    topZones,
  };
}
