import { HttpResponse, http } from 'msw';

import type { ProviderAnalytics, ProviderAnalyticsPeriod } from '@/features/analytics/schema';
import { ProviderAnalyticsPeriodSchema } from '@/features/analytics/schema';
import { apiOk } from '@/mocks/utils';

const walletSummary = {
  reservedBalance: 55,
  usableBalance: 185,
  currency: 'TND',
} as const;

const walletActivity = {
  currentMonthDeposits: 345,
  currentMonthDeductions: 35,
} as const;

const providerAnalyticsByPeriod: Record<ProviderAnalyticsPeriod, ProviderAnalytics> = {
  week: {
    overview: {
      revenue: 480,
      appointments: 6,
      uniquePatients: 5,
      averageRating: 4.8,
      reviewCount: 12,
    },
    revenueSeries: [
      { label: '2026-04-19', amount: 40 },
      { label: '2026-04-20', amount: 80 },
      { label: '2026-04-21', amount: 60 },
      { label: '2026-04-22', amount: 120 },
      { label: '2026-04-23', amount: 55 },
      { label: '2026-04-24', amount: 50 },
      { label: '2026-04-25', amount: 75 },
    ],
    topZones: [
      { city: 'Tunis', bookingCount: 3, percentage: 50 },
      { city: 'Ariana', bookingCount: 2, percentage: 33.33 },
      { city: 'La Marsa', bookingCount: 1, percentage: 16.67 },
    ],
    appointmentsByStatus: {
      confirmed: 2,
      pending: 1,
      completed: 3,
      total: 6,
    },
    walletSummary,
    walletActivity,
  },
  month: {
    overview: {
      revenue: 1950,
      appointments: 24,
      uniquePatients: 16,
      averageRating: 4.8,
      reviewCount: 12,
    },
    revenueSeries: [
      { label: '2026-04-01', amount: 210 },
      { label: '2026-04-05', amount: 280 },
      { label: '2026-04-10', amount: 310 },
      { label: '2026-04-15', amount: 370 },
      { label: '2026-04-20', amount: 410 },
      { label: '2026-04-25', amount: 370 },
    ],
    topZones: [
      { city: 'Tunis', bookingCount: 10, percentage: 41.67 },
      { city: 'Ariana', bookingCount: 7, percentage: 29.17 },
      { city: 'Ben Arous', bookingCount: 4, percentage: 16.67 },
      { city: 'La Marsa', bookingCount: 3, percentage: 12.5 },
    ],
    appointmentsByStatus: {
      confirmed: 7,
      pending: 4,
      completed: 13,
      total: 24,
    },
    walletSummary,
    walletActivity,
  },
  year: {
    overview: {
      revenue: 18400,
      appointments: 138,
      uniquePatients: 72,
      averageRating: 4.8,
      reviewCount: 12,
    },
    revenueSeries: [
      { label: '2026-01', amount: 2100 },
      { label: '2026-02', amount: 2480 },
      { label: '2026-03', amount: 2860 },
      { label: '2026-04', amount: 1950 },
      { label: '2026-05', amount: 2200 },
      { label: '2026-06', amount: 1600 },
      { label: '2026-07', amount: 0 },
      { label: '2026-08', amount: 0 },
      { label: '2026-09', amount: 0 },
      { label: '2026-10', amount: 0 },
      { label: '2026-11', amount: 0 },
      { label: '2026-12', amount: 0 },
    ],
    topZones: [
      { city: 'Tunis', bookingCount: 54, percentage: 39.13 },
      { city: 'Ariana', bookingCount: 37, percentage: 26.81 },
      { city: 'Ben Arous', bookingCount: 25, percentage: 18.12 },
      { city: 'Sousse', bookingCount: 22, percentage: 15.94 },
    ],
    appointmentsByStatus: {
      confirmed: 35,
      pending: 18,
      completed: 85,
      total: 138,
    },
    walletSummary,
    walletActivity,
  },
};

function apiBadRequest(message: string, field = 'period') {
  return HttpResponse.json(
    {
      success: false,
      data: null,
      status: 'error',
      message,
      errors: {
        [field]: [message],
      },
    },
    { status: 400 },
  );
}

export const analyticsHandlers = [
  http.get('*/api/v1/providers/me/analytics', ({ request }) => {
    const url = new URL(request.url);
    const result = ProviderAnalyticsPeriodSchema.safeParse(
      url.searchParams.get('period') ?? 'month',
    );

    if (!result.success) {
      return apiBadRequest("Period must be one of 'week', 'month', or 'year'.");
    }

    return apiOk(providerAnalyticsByPeriod[result.data]);
  }),
];
