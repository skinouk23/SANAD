/**
 * Marketing Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 *
 * useCampaignAudience maps icon type strings from MSW to lucide-react components.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Smartphone, Monitor, Tablet, type LucideIcon } from 'lucide-react';
import {
  campaignsOptions,
  marketingStatsOptions,
  campaignIdeasOptions,
  campaignDetailOptions,
  campaignPerformanceOptions,
  campaignAudienceOptions,
} from '@/features/marketing/options';
import type {
  MarketingCampaign,
  MarketingStats,
  CampaignIdea,
  CampaignDetail,
  DailyPerformance,
  AudienceData,
  AudienceDataRaw,
} from '@/features/marketing/schema';

// ============================================
// ICON MAPPING
// ============================================

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  mobile: Smartphone,
  monitor: Monitor,
  desktop: Monitor,
  tablet: Tablet,
};

// ============================================
// HOOKS
// ============================================

/**
 * Fetch campaigns, optionally filtered by status.
 */
export function useMarketingCampaigns(status?: 'active' | 'scheduled' | 'completed') {
  const query = useQuery(campaignsOptions(status));

  return {
    data: (query.data as MarketingCampaign[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch marketing dashboard stats.
 */
export function useMarketingStats() {
  const query = useQuery(marketingStatsOptions());

  return {
    data: (query.data as MarketingStats | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch campaign ideas / templates.
 */
export function useCampaignIdeas() {
  const query = useQuery(campaignIdeasOptions());

  return {
    data: (query.data as CampaignIdea[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch a single campaign detail by ID.
 */
export function useCampaignDetail(id?: string) {
  const query = useQuery(campaignDetailOptions(id));

  return {
    data: (query.data as CampaignDetail | null | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch daily performance data for a campaign.
 */
export function useCampaignPerformance(id?: string) {
  const query = useQuery(campaignPerformanceOptions(id));

  return {
    data: (query.data as DailyPerformance[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch audience data for a campaign.
 * Maps icon type strings from the API to lucide-react components.
 */
export function useCampaignAudience(id?: string) {
  const query = useQuery(campaignAudienceOptions(id));

  const data = useMemo<AudienceData | null>(() => {
    const raw = query.data as AudienceDataRaw | null | undefined;
    if (!raw) return null;

    return {
      ageGroups: raw.ageGroups,
      topLocations: raw.topLocations,
      devices: raw.devices.map((d) => ({
        type: d.type,
        percentage: d.percentage,
        icon: iconMap[d.icon.toLowerCase()] ?? Monitor,
      })),
    };
  }, [query.data]);

  return {
    data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
