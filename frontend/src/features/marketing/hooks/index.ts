/**
 * Marketing Hooks — barrel re-export
 */

export {
  useMarketingCampaigns,
  useMarketingStats,
  useCampaignIdeas,
  useCampaignDetail,
  useCampaignPerformance,
  useCampaignAudience,
} from './useMarketing';

// Re-export types for consumer convenience
export type {
  MarketingCampaign,
  MarketingStats,
  CampaignIdea,
  CampaignDetail,
  DailyPerformance,
  AudienceAgeGroup,
  AudienceLocation,
  AudienceDevice,
  AudienceData,
} from '@/features/marketing/schema';
