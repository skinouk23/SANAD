import { z } from 'zod';

import { ProviderWalletSummarySchema } from '@/features/provider-wallet/schema';

// ============================================
// ANALYTICS FILTERS
// ============================================

export const ProviderAnalyticsPeriodSchema = z.enum(['week', 'month', 'year']);

// ============================================
// PROVIDER ANALYTICS RESPONSE
// ============================================

export const ProviderAnalyticsOverviewSchema = z.object({
  revenue: z.number(),
  appointments: z.number().int(),
  uniquePatients: z.number().int(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
});

export const ProviderAnalyticsRevenuePointSchema = z.object({
  label: z.string(),
  amount: z.number(),
});

export const ProviderAnalyticsTopZoneSchema = z.object({
  city: z.string(),
  bookingCount: z.number().int(),
  percentage: z.number(),
});

export const ProviderAnalyticsAppointmentsByStatusSchema = z.object({
  confirmed: z.number().int(),
  pending: z.number().int(),
  completed: z.number().int(),
  total: z.number().int(),
});

export const ProviderAnalyticsWalletActivitySchema = z.object({
  currentMonthDeposits: z.number(),
  currentMonthDeductions: z.number(),
});

export const ProviderAnalyticsSchema = z.object({
  overview: ProviderAnalyticsOverviewSchema,
  revenueSeries: z.array(ProviderAnalyticsRevenuePointSchema),
  topZones: z.array(ProviderAnalyticsTopZoneSchema),
  appointmentsByStatus: ProviderAnalyticsAppointmentsByStatusSchema,
  walletSummary: ProviderWalletSummarySchema,
  walletActivity: ProviderAnalyticsWalletActivitySchema,
});

// ============================================
// INFERRED TYPES
// ============================================

export type ProviderAnalyticsPeriod = z.infer<typeof ProviderAnalyticsPeriodSchema>;
export type ProviderAnalytics = z.infer<typeof ProviderAnalyticsSchema>;
export type ProviderAnalyticsRevenuePoint = z.infer<typeof ProviderAnalyticsRevenuePointSchema>;
export type ProviderAnalyticsTopZone = z.infer<typeof ProviderAnalyticsTopZoneSchema>;
