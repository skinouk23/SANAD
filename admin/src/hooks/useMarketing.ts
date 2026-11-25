/**
 * Marketing Hooks
 * Custom React hooks for marketing campaigns data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface MarketingCampaign {
  id: number;
  name: string;
  type: 'social' | 'email' | 'other';
  status: 'active' | 'scheduled' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  roi?: number;
}

export interface MarketingStats {
  totalImpressions: string;
  totalClicks: string;
  totalConversions: string;
  averageRoi: string;
  impressionsChange: string;
  clicksChange: string;
  conversionsChange: string;
  roiChange: string;
}

export interface CampaignIdea {
  title: string;
  desc: string;
  template: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockActiveCampaigns: MarketingCampaign[] = [
{
  id: 1,
  name: 'Promotion Soins à Domicile - Janvier',
  type: 'social',
  status: 'active',
  startDate: '10 Jan 2024',
  endDate: '31 Jan 2024',
  budget: 150,
  spent: 87,
  impressions: 12500,
  clicks: 340,
  conversions: 18,
  ctr: 2.72,
  roi: 245
},
{
  id: 2,
  name: 'Email - Nouveaux patients',
  type: 'email',
  status: 'active',
  startDate: '15 Jan 2024',
  endDate: '15 Fév 2024',
  budget: 50,
  spent: 12,
  impressions: 850,
  clicks: 127,
  conversions: 8,
  ctr: 14.94,
  roi: 180
}];


const mockScheduledCampaigns: MarketingCampaign[] = [
{
  id: 3,
  name: 'Campagne Saint-Valentin',
  type: 'social',
  status: 'scheduled',
  startDate: '1 Fév 2024',
  endDate: '14 Fév 2024',
  budget: 200
}];


const mockCompletedCampaigns: MarketingCampaign[] = [
{
  id: 4,
  name: 'Lancement Décembre',
  type: 'social',
  status: 'completed',
  startDate: '1 Déc 2023',
  endDate: '31 Déc 2023',
  budget: 150,
  spent: 150,
  impressions: 15200,
  clicks: 425,
  conversions: 24,
  ctr: 2.8,
  roi: 310
}];


const mockMarketingStats: MarketingStats = {
  totalImpressions: '13.4K',
  totalClicks: '467',
  totalConversions: '26',
  averageRoi: '212%',
  impressionsChange: '+15%',
  clicksChange: '+22%',
  conversionsChange: '+18%',
  roiChange: '+35%'
};

const mockCampaignIdeas: CampaignIdea[] = [
{
  title: 'Promotion Hiver',
  desc: '-15% sur les soins à domicile',
  template: 'winter'
},
{
  title: 'Nouveaux patients',
  desc: 'Offre de bienvenue spéciale',
  template: 'new-patients'
},
{
  title: 'Fidélité',
  desc: 'Récompensez vos patients réguliers',
  template: 'loyalty'
}];


// ============================================
// HOOKS
// ============================================

export function useMarketingCampaigns(
status?: 'active' | 'scheduled' | 'completed')
{
  return useApi<MarketingCampaign[]>(() => {
    switch (status) {
      case 'active':
        return Promise.resolve(mockActiveCampaigns);
      case 'scheduled':
        return Promise.resolve(mockScheduledCampaigns);
      case 'completed':
        return Promise.resolve(mockCompletedCampaigns);
      default:
        return Promise.resolve([
        ...mockActiveCampaigns,
        ...mockScheduledCampaigns,
        ...mockCompletedCampaigns]
        );
    }
  }, [status]);
}

export function useMarketingStats() {
  return useApi<MarketingStats>(() => Promise.resolve(mockMarketingStats), []);
}

export function useCampaignIdeas() {
  return useApi<CampaignIdea[]>(() => Promise.resolve(mockCampaignIdeas), []);
}

export function useCampaignById(campaignId: number | string | undefined) {
  return useApi<MarketingCampaign | null>(
    () => {
      if (!campaignId) return Promise.resolve(null);
      const id =
      typeof campaignId === 'string' ? parseInt(campaignId, 10) : campaignId;
      const allCampaigns = [
      ...mockActiveCampaigns,
      ...mockScheduledCampaigns,
      ...mockCompletedCampaigns];

      return Promise.resolve(allCampaigns.find((c) => c.id === id) || null);
    },
    [campaignId],
    { immediate: !!campaignId }
  );
}