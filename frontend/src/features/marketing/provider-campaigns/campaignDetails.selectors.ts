import {
  BarChart3,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type { AudienceData, CampaignDetail, DailyPerformance } from '@/features/marketing/schema';

export type CampaignDetailsTab = 'overview' | 'audience' | 'performance';

export interface CampaignStatItem {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
  icon: LucideIcon;
  gradient: string;
}

export interface CampaignPerformanceHighlight {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
}

export const CAMPAIGN_DETAILS_TABS: Array<{
  key: CampaignDetailsTab;
  label: string;
  icon: LucideIcon;
}> = [
  { key: 'overview', label: "Vue d'ensemble", icon: BarChart3 },
  { key: 'audience', label: 'Audience', icon: Users },
  { key: 'performance', label: 'Performance', icon: TrendingUp },
];

export const EMPTY_CAMPAIGN_DETAIL: CampaignDetail = {
  id: '',
  name: '',
  type: 'social',
  status: 'active',
  startDate: '',
  endDate: '',
  budget: 0,
  spent: 0,
  impressions: 0,
  clicks: 0,
  conversions: 0,
  ctr: 0,
  roi: 0,
  objective: '',
  content: {
    headline: '',
    description: '',
    cta: '',
  },
};

export const EMPTY_AUDIENCE_DATA: AudienceData = {
  ageGroups: [],
  topLocations: [],
  devices: [],
};

export const PERFORMANCE_HIGHLIGHTS: CampaignPerformanceHighlight[] = [
  {
    label: 'Meilleure performance',
    value: '1,420 impressions',
    sub: '16 Jan 2024',
    icon: TrendingUp,
  },
  {
    label: 'Taux de conversion',
    value: '5.3%',
    sub: '18 conversions / 340 clics',
    icon: Target,
  },
  {
    label: 'Coût par conversion',
    value: '4.83 TND',
    sub: '87 TND / 18 conversions',
    icon: DollarSign,
  },
];

export function buildCampaignStats(campaign: CampaignDetail): CampaignStatItem[] {
  return [
    {
      label: 'Impressions',
      value: campaign.impressions.toLocaleString(),
      change: '+12%',
      up: true,
      icon: Eye,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Clics',
      value: campaign.clicks,
      change: '+8%',
      up: true,
      icon: MousePointer,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Conversions',
      value: campaign.conversions,
      change: '+15%',
      up: true,
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'CTR',
      value: `${campaign.ctr}%`,
      change: '-0.3%',
      up: false,
      icon: Target,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      label: 'ROI',
      value: `${campaign.roi}%`,
      change: '+22%',
      up: true,
      icon: DollarSign,
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];
}

export function getBudgetUsage(campaign: CampaignDetail) {
  const percentage = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

  return {
    percentage,
    roundedPercentage: Math.round(percentage),
    remaining: Math.max(campaign.budget - campaign.spent, 0),
  };
}

export function getPerformanceChartMax(performance: DailyPerformance[]) {
  return Math.max(1, ...performance.map((day) => day.impressions));
}

export function buildAudienceActivityHours(seed: number | string) {
  const numericSeed =
    typeof seed === 'number'
      ? seed
      : Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0);

  return Array.from({ length: 24 }, (_, hour) => {
    const normalized = ((hour + 3) % 24) / 24;
    const wave = Math.sin(normalized * Math.PI * 2) * 0.25 + 0.4;
    const offset = ((numericSeed + hour * 7) % 10) / 100;
    return {
      hour,
      opacity: Number(Math.min(0.85, Math.max(0.15, wave + offset)).toFixed(2)),
    };
  });
}
