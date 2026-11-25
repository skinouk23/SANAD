/**
 * Marketing Schemas
 * Zod schemas for marketing campaign types.
 */

import { z } from 'zod';

// ============================================
// MARKETING CAMPAIGN
// ============================================

export const MarketingCampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['social', 'email', 'other']),
  status: z.enum(['active', 'scheduled', 'completed']),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  spent: z.number().optional(),
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  conversions: z.number().optional(),
  ctr: z.number().optional(),
  roi: z.number().optional(),
});

// ============================================
// MARKETING STATS
// ============================================

export const MarketingStatsSchema = z.object({
  totalImpressions: z.string(),
  totalClicks: z.string(),
  totalConversions: z.string(),
  averageRoi: z.string(),
  impressionsChange: z.string(),
  clicksChange: z.string(),
  conversionsChange: z.string(),
  roiChange: z.string(),
});

// ============================================
// CAMPAIGN IDEA
// ============================================

export const CampaignIdeaSchema = z.object({
  title: z.string(),
  desc: z.string(),
  template: z.string(),
});

// ============================================
// CAMPAIGN DETAIL
// ============================================

export const CampaignContentSchema = z.object({
  headline: z.string(),
  description: z.string(),
  cta: z.string(),
});

export const CampaignDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  spent: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  ctr: z.number(),
  roi: z.number(),
  objective: z.string(),
  content: CampaignContentSchema,
});

// ============================================
// DAILY PERFORMANCE
// ============================================

export const DailyPerformanceSchema = z.object({
  date: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
});

// ============================================
// AUDIENCE DATA
// ============================================

export const AudienceAgeGroupSchema = z.object({
  range: z.string(),
  percentage: z.number(),
});

export const AudienceLocationSchema = z.object({
  city: z.string(),
  percentage: z.number(),
});

/** MSW returns icon as a string key; hooks map to React components. */
export const AudienceDeviceRawSchema = z.object({
  type: z.string(),
  percentage: z.number(),
  icon: z.string(),
});

export const AudienceDataRawSchema = z.object({
  ageGroups: z.array(AudienceAgeGroupSchema),
  topLocations: z.array(AudienceLocationSchema),
  devices: z.array(AudienceDeviceRawSchema),
});

// ============================================
// INFERRED TYPES
// ============================================

export type MarketingCampaign = z.infer<typeof MarketingCampaignSchema>;
export type MarketingStats = z.infer<typeof MarketingStatsSchema>;
export type CampaignIdea = z.infer<typeof CampaignIdeaSchema>;
export type CampaignDetail = z.infer<typeof CampaignDetailSchema>;
export type DailyPerformance = z.infer<typeof DailyPerformanceSchema>;
export type AudienceAgeGroup = z.infer<typeof AudienceAgeGroupSchema>;
export type AudienceLocation = z.infer<typeof AudienceLocationSchema>;
export type AudienceDeviceRaw = z.infer<typeof AudienceDeviceRawSchema>;
export type AudienceDataRaw = z.infer<typeof AudienceDataRawSchema>;

/**
 * Client-side audience device with React component icon.
 * The hook maps AudienceDeviceRaw.icon string → React.ElementType.
 */
export interface AudienceDevice {
  type: string;
  percentage: number;
  icon: React.ElementType;
}

export interface AudienceData {
  ageGroups: AudienceAgeGroup[];
  topLocations: AudienceLocation[];
  devices: AudienceDevice[];
}
