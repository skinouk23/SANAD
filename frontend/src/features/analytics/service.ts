import { api } from '@/api/client';
import { ProviderAnalyticsPeriodSchema, ProviderAnalyticsSchema } from './schema';
import type { ProviderAnalytics, ProviderAnalyticsPeriod } from './schema';

// ============================================
// ANALYTICS QUERIES
// ============================================

/** Fetch the authenticated provider analytics read model. */
export async function getProviderAnalytics(
  period: ProviderAnalyticsPeriod,
): Promise<ProviderAnalytics> {
  const selectedPeriod = ProviderAnalyticsPeriodSchema.parse(period);
  const raw = await api.get<ProviderAnalytics>('/providers/me/analytics', {
    params: { period: selectedPeriod },
  });

  return ProviderAnalyticsSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const analyticsService = {
  getProviderAnalytics,
};
