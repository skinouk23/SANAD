import type { LoaderFunctionArgs } from 'react-router-dom';

import { providerAnalyticsOptions } from '@/features/analytics';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import { useProviderAnalyticsScreen } from './providerAnalytics.hooks';
import {
  ProviderAnalyticsErrorState,
  ProviderAnalyticsHeader,
  ProviderAnalyticsStatGrid,
  ProviderAnalyticsSummaryCards,
  ProviderRevenueCard,
  ProviderTopZonesCard,
} from './providerAnalytics.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void queryClient.prefetchQuery(providerAnalyticsOptions('month')).catch(() => undefined);
  return null;
};

export function ProviderAnalyticsScreen() {
  const { t } = useLanguage();
  const screen = useProviderAnalyticsScreen();
  const isUpdating = screen.isRefreshing || screen.isPlaceholderData;

  if (screen.error && !screen.loading && !screen.analytics) {
    return (
      <div className="min-h-screen pb-20">
        <ProviderAnalyticsErrorState
          message={getApiErrorMessage(screen.error, t.common.loadingError)}
          onRetry={screen.refetchAll}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderAnalyticsHeader
        isUpdating={isUpdating}
        period={screen.period}
        onPeriodChange={screen.setPeriod}
      />

      <div
        aria-busy={isUpdating || undefined}
        className="relative z-10 mx-auto max-w-7xl px-4 py-6"
      >
        <ProviderAnalyticsStatGrid
          isUpdating={isUpdating}
          loading={screen.loading}
          stats={screen.stats}
        />

        <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
          <ProviderRevenueCard
            currency={screen.analytics?.walletSummary.currency ?? 'TND'}
            loading={screen.loading}
            maxValue={screen.revenueMax}
            points={screen.revenueData}
          />
          <ProviderTopZonesCard loading={screen.loading} zones={screen.topZones} />
        </div>

        <ProviderAnalyticsSummaryCards analytics={screen.analytics} loading={screen.loading} />
      </div>
    </div>
  );
}
