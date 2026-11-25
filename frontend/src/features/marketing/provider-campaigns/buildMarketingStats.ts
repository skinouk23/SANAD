import { Eye, MousePointer, Target, Users } from 'lucide-react';

import type { MarketingCampaignStatView } from '@/features/marketing/provider-campaigns/marketingCampaigns.sections';

export function buildMarketingStats(marketingStats?: {
  totalImpressions?: string;
  impressionsChange?: string;
  totalClicks?: string;
  clicksChange?: string;
  totalConversions?: string;
  conversionsChange?: string;
  averageRoi?: string;
  roiChange?: string;
}): MarketingCampaignStatView[] {
  return [
    {
      label: 'Impressions',
      value: marketingStats?.totalImpressions || '0',
      change: marketingStats?.impressionsChange || '+0%',
      icon: Eye,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Clics',
      value: marketingStats?.totalClicks || '0',
      change: marketingStats?.clicksChange || '+0%',
      icon: MousePointer,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Conversions',
      value: marketingStats?.totalConversions || '0',
      change: marketingStats?.conversionsChange || '+0%',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'ROI moyen',
      value: marketingStats?.averageRoi || '0%',
      change: marketingStats?.roiChange || '+0%',
      icon: Target,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];
}
