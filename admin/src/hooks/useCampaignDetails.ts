/**
 * Campaign Details Hooks
 * Custom React hooks for marketing campaign detail data
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface CampaignDetail {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  roi: number;
  objective: string;
  content: {
    headline: string;
    description: string;
    cta: string;
  };
}

export interface DailyPerformance {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AudienceAgeGroup {
  range: string;
  percentage: number;
}

export interface AudienceLocation {
  city: string;
  percentage: number;
}

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

// ============================================
// MOCK DATA
// ============================================

import { Smartphone, Monitor, Tablet } from 'lucide-react';

const MOCK_CAMPAIGN: CampaignDetail = {
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
  roi: 245,
  objective: 'conversions',
  content: {
    headline: 'Soins infirmiers professionnels à domicile',
    description:
    'Bénéficiez de 15% de réduction sur votre première réservation. Infirmiers diplômés disponibles 7j/7.',
    cta: 'Réserver maintenant'
  }
};

const MOCK_PERFORMANCE: DailyPerformance[] = [
{ date: '10 Jan', impressions: 450, clicks: 12, conversions: 1 },
{ date: '11 Jan', impressions: 520, clicks: 15, conversions: 1 },
{ date: '12 Jan', impressions: 680, clicks: 18, conversions: 2 },
{ date: '13 Jan', impressions: 890, clicks: 25, conversions: 2 },
{ date: '14 Jan', impressions: 1100, clicks: 32, conversions: 3 },
{ date: '15 Jan', impressions: 1250, clicks: 38, conversions: 2 },
{ date: '16 Jan', impressions: 1420, clicks: 42, conversions: 3 }];


const MOCK_AUDIENCE: AudienceData = {
  ageGroups: [
  { range: '18-24', percentage: 12 },
  { range: '25-34', percentage: 28 },
  { range: '35-44', percentage: 35 },
  { range: '45-54', percentage: 18 },
  { range: '55+', percentage: 7 }],

  topLocations: [
  { city: 'Tunis', percentage: 45 },
  { city: 'Sfax', percentage: 22 },
  { city: 'Sousse', percentage: 18 },
  { city: 'Bizerte', percentage: 10 },
  { city: 'Autres', percentage: 5 }],

  devices: [
  { type: 'Mobile', percentage: 68, icon: Smartphone },
  { type: 'Desktop', percentage: 25, icon: Monitor },
  { type: 'Tablette', percentage: 7, icon: Tablet }]

};

// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching campaign detail by ID
 */
export function useCampaignDetail(_id?: string) {
  return useApi<CampaignDetail>(() => Promise.resolve(MOCK_CAMPAIGN), [_id]);
}

/**
 * Hook for fetching campaign daily performance
 */
export function useCampaignPerformance(_id?: string) {
  return useApi<DailyPerformance[]>(
    () => Promise.resolve(MOCK_PERFORMANCE),
    [_id]
  );
}

/**
 * Hook for fetching campaign audience data
 */
export function useCampaignAudience(_id?: string) {
  return useApi<AudienceData>(() => Promise.resolve(MOCK_AUDIENCE), [_id]);
}