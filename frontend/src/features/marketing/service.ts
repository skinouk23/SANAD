/**
 * Marketing Service
 *
 * Pure API client for the marketing domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import {
  MarketingCampaignSchema,
  MarketingStatsSchema,
  CampaignIdeaSchema,
  CampaignDetailSchema,
  DailyPerformanceSchema,
  AudienceDataRawSchema,
} from './schema';
import type {
  MarketingCampaign,
  MarketingStats,
  CampaignIdea,
  CampaignDetail,
  DailyPerformance,
  AudienceDataRaw,
} from './schema';

/** Fetch campaigns optionally filtered by status. */
export async function getCampaigns(
  status?: 'active' | 'scheduled' | 'completed',
): Promise<MarketingCampaign[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const raw = await api.get<MarketingCampaign[]>('/marketing/campaigns', { params });
  return z.array(MarketingCampaignSchema).parse(raw);
}

/** Fetch marketing dashboard stats. */
export async function getMarketingStats(): Promise<MarketingStats> {
  const raw = await api.get<MarketingStats>('/marketing/stats');
  return MarketingStatsSchema.parse(raw);
}

/** Fetch campaign ideas / templates. */
export async function getCampaignIdeas(): Promise<CampaignIdea[]> {
  const raw = await api.get<CampaignIdea[]>('/marketing/ideas');
  return z.array(CampaignIdeaSchema).parse(raw);
}

/** Fetch a single campaign detail by ID. */
export async function getCampaignDetail(id?: string): Promise<CampaignDetail | null> {
  if (!id) return null;
  const raw = await api.get<CampaignDetail>(`/marketing/campaigns/${id}`);
  return raw ? CampaignDetailSchema.parse(raw) : null;
}

/** Fetch daily performance data for a campaign. */
export async function getCampaignPerformance(id?: string): Promise<DailyPerformance[]> {
  if (!id) return [];
  const raw = await api.get<DailyPerformance[]>(`/marketing/campaigns/${id}/performance`);
  return z.array(DailyPerformanceSchema).parse(raw);
}

/** Fetch audience data for a campaign (returns raw icon strings). */
export async function getCampaignAudience(id?: string): Promise<AudienceDataRaw | null> {
  if (!id) return null;
  const raw = await api.get<AudienceDataRaw>(`/marketing/campaigns/${id}/audience`);
  return raw ? AudienceDataRawSchema.parse(raw) : null;
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const marketingService = {
  getCampaigns,
  getMarketingStats,
  getCampaignIdeas,
  getCampaignDetail,
  getCampaignPerformance,
  getCampaignAudience,
};
