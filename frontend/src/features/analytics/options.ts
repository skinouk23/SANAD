import { queryOptions } from '@tanstack/react-query';

import { analyticsKeys } from './keys';
import { getProviderAnalytics } from './service';

import type { ProviderAnalyticsPeriod } from './schema';

export function providerAnalyticsOptions(period: ProviderAnalyticsPeriod) {
  return queryOptions({
    queryKey: analyticsKeys.providerAnalytics(period),
    queryFn: () => getProviderAnalytics(period),
  });
}
