/**
 * Marketing Query Options
 *
 * Pre-built queryOptions for every marketing query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { marketingKeys } from './keys';
import {
  getCampaigns,
  getMarketingStats,
  getCampaignIdeas,
  getCampaignDetail,
  getCampaignPerformance,
  getCampaignAudience,
} from './service';

export function campaignsOptions(status?: 'active' | 'scheduled' | 'completed') {
  return queryOptions({
    queryKey: marketingKeys.campaignsByStatus(status),
    queryFn: () => getCampaigns(status),
  });
}

export function marketingStatsOptions() {
  return queryOptions({
    queryKey: marketingKeys.stats(),
    queryFn: getMarketingStats,
  });
}

export function campaignIdeasOptions() {
  return queryOptions({
    queryKey: marketingKeys.ideas(),
    queryFn: getCampaignIdeas,
  });
}

export function campaignDetailOptions(id?: string) {
  return queryOptions({
    queryKey: marketingKeys.detail(id),
    queryFn: () => getCampaignDetail(id),
    enabled: !!id,
  });
}

export function campaignPerformanceOptions(id?: string) {
  return queryOptions({
    queryKey: marketingKeys.campaignPerformance(id),
    queryFn: () => getCampaignPerformance(id),
    enabled: !!id,
  });
}

export function campaignAudienceOptions(id?: string) {
  return queryOptions({
    queryKey: marketingKeys.campaignAudience(id),
    queryFn: () => getCampaignAudience(id),
    enabled: !!id,
  });
}
