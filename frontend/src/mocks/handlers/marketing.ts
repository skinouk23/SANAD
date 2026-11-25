/**
 * Marketing MSW Handlers
 *
 * Intercepts all /api/marketing requests during development
 * and returns realistic mock data extracted from the old marketing hooks.
 */

import { http } from 'msw';

import type {
  MarketingCampaign,
  MarketingStats,
  CampaignIdea,
  CampaignDetail,
  DailyPerformance,
  AudienceDataRaw,
} from '@/features/marketing/schema';
import { apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA
// ============================================

const mockActiveCampaigns: MarketingCampaign[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Promotion Soins à Domicile - Janvier',
    type: 'social',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    budget: 150,
    spent: 87,
    impressions: 12500,
    clicks: 340,
    conversions: 18,
    ctr: 2.72,
    roi: 245,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Email - Nouveaux patients',
    type: 'email',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 50,
    spent: 12,
    impressions: 850,
    clicks: 127,
    conversions: 8,
    ctr: 14.94,
    roi: 180,
  },
];

const mockScheduledCampaigns: MarketingCampaign[] = [
  {
    id: 'c3d4e5f6-a7b8-4012-adef-123456789012',
    name: 'Campagne Saint-Valentin',
    type: 'social',
    status: 'scheduled',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    budget: 200,
  },
];

const mockCompletedCampaigns: MarketingCampaign[] = [
  {
    id: 'd4e5f6a7-b8c9-4123-aefa-234567890123',
    name: 'Lancement Décembre',
    type: 'social',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    budget: 150,
    spent: 150,
    impressions: 15200,
    clicks: 425,
    conversions: 24,
    ctr: 2.8,
    roi: 310,
  },
];

const allCampaigns = [...mockActiveCampaigns, ...mockScheduledCampaigns, ...mockCompletedCampaigns];

const mockStats: MarketingStats = {
  totalImpressions: '13.4K',
  totalClicks: '467',
  totalConversions: '26',
  averageRoi: '212%',
  impressionsChange: '+15%',
  clicksChange: '+22%',
  conversionsChange: '+18%',
  roiChange: '+35%',
};

const mockIdeas: CampaignIdea[] = [
  {
    title: 'Promotion Hiver',
    desc: '-15% sur les soins à domicile',
    template: 'winter',
  },
  {
    title: 'Nouveaux patients',
    desc: 'Offre de bienvenue spéciale',
    template: 'new-patients',
  },
  {
    title: 'Fidélité',
    desc: 'Récompensez vos patients réguliers',
    template: 'loyalty',
  },
];

const mockCampaignDetail: CampaignDetail = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Promotion Soins à Domicile - Janvier',
  type: 'social',
  status: 'active',
  startDate: '2024-01-10',
  endDate: '2024-01-31',
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
    cta: 'Réserver maintenant',
  },
};

const mockPerformance: DailyPerformance[] = [
  { date: '10 Jan', impressions: 450, clicks: 12, conversions: 1 },
  { date: '11 Jan', impressions: 520, clicks: 15, conversions: 1 },
  { date: '12 Jan', impressions: 680, clicks: 18, conversions: 2 },
  { date: '13 Jan', impressions: 890, clicks: 25, conversions: 2 },
  { date: '14 Jan', impressions: 1100, clicks: 32, conversions: 3 },
  { date: '15 Jan', impressions: 1250, clicks: 38, conversions: 2 },
  { date: '16 Jan', impressions: 1420, clicks: 42, conversions: 3 },
];

/** Icon types as serializable strings — hooks map to React components */
const mockAudience: AudienceDataRaw = {
  ageGroups: [
    { range: '18-24', percentage: 12 },
    { range: '25-34', percentage: 28 },
    { range: '35-44', percentage: 35 },
    { range: '45-54', percentage: 18 },
    { range: '55+', percentage: 7 },
  ],
  topLocations: [
    { city: 'Tunis', percentage: 45 },
    { city: 'Sfax', percentage: 22 },
    { city: 'Sousse', percentage: 18 },
    { city: 'Bizerte', percentage: 10 },
    { city: 'Autres', percentage: 5 },
  ],
  devices: [
    { type: 'Mobile', percentage: 68, icon: 'smartphone' },
    { type: 'Desktop', percentage: 25, icon: 'monitor' },
    { type: 'Tablette', percentage: 7, icon: 'tablet' },
  ],
};

// ============================================
// ============================================
// HANDLERS
// ============================================

export const marketingHandlers = [
  // ── GET /api/marketing/campaigns/:id/audience ──────────────
  // (registered before generic /campaigns/:id to prevent shadowing)
  http.get('*/api/v1/marketing/campaigns/:id/audience', () => {
    return apiOk(mockAudience);
  }),

  // ── GET /api/marketing/campaigns/:id/performance ───────────
  http.get('*/api/v1/marketing/campaigns/:id/performance', () => {
    return apiOk(mockPerformance);
  }),

  // ── GET /api/marketing/campaigns/:id ───────────────────────
  http.get('*/api/v1/marketing/campaigns/:id', () => {
    return apiOk(mockCampaignDetail);
  }),

  // ── GET /api/marketing/campaigns ───────────────────────────
  http.get('*/api/v1/marketing/campaigns', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    if (status === 'active') return apiOk(mockActiveCampaigns);
    if (status === 'scheduled') return apiOk(mockScheduledCampaigns);
    if (status === 'completed') return apiOk(mockCompletedCampaigns);
    return apiOk(allCampaigns);
  }),

  // ── GET /api/marketing/stats ───────────────────────────────
  http.get('*/api/v1/marketing/stats', () => {
    return apiOk(mockStats);
  }),

  // ── GET /api/marketing/ideas ───────────────────────────────
  http.get('*/api/v1/marketing/ideas', () => {
    return apiOk(mockIdeas);
  }),
];
