/**
 * Provider MSW Handlers
 *
 * Intercepts all /api/providers/* requests during development and
 * returns realistic mock data shaped to match the Zod schemas.
 * Since providers.data.ts now produces MockProviderData (extends ProviderResponse),
 * listing endpoints return data directly without mapping.
 */

import { http, HttpResponse } from 'msw';
import {
  providersData,
  getProviderById as findProviderById,
  getAvailableProviders as getAvailableMockProviders,
  getTopRatedProviders as getTopRatedMock,
  getProvidersByServiceType as getMockByServiceType,
} from '@/data/providers.data';
import type { MockProviderData } from '@/data/providers.data';
import {
  NUTRITION_PROVIDER_SUBTYPE_VALUES,
  isNutritionProviderCategory,
} from '@/features/providers/providerAuthoring';
import {
  attachCurrentMockProviderServicePhoto,
  createCurrentMockProviderService,
  deleteCurrentMockProviderService,
  getCurrentMockProviderPreferences,
  getCurrentMockProviderProfile,
  getCurrentMockProviderServiceDetail,
  getCurrentMockProviderServiceStats,
  getCurrentMockProviderServiceSummaries,
  mockAmbulanceServiceTypeLookups,
  mockVeterinaryAnimalTypeLookups,
  toggleCurrentMockProviderService,
  updateCurrentMockProviderPreferences,
  updateCurrentMockProviderProfile,
  updateCurrentMockProviderService,
} from '@/mocks/handlers/providerAuthoringStore';
import {
  createMockProviderUnavailability,
  deleteMockProviderUnavailability,
  getMockProviderSchedules,
  getMockProviderUnavailabilities,
  getProviderDashboardMetrics,
  getProviderPlanningData,
  replaceMockProviderSchedules,
  updateMockProviderUnavailability,
} from '@/mocks/handlers/providerPlanningStore';
import { apiOk, apiNotFound } from '@/mocks/utils';
import type { UpsertProviderScheduleInterval } from '@/features/providers/schema';

function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calculateDayCount(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  return Math.floor(diffMs / 86400000) + 1;
}

function getRequestedServiceIds(searchParams: URLSearchParams): string[] {
  return [...new Set(searchParams.getAll('serviceIds'))].flatMap((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function paginateProviders(items: MockProviderData[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: { page, limit, total, totalPages },
  };
}

function providerMatchesSearch(provider: MockProviderData, query: string): boolean {
  const searchTerm = query.trim().toLowerCase();

  if (!searchTerm) {
    return true;
  }

  return [
    provider.displayName,
    provider.businessName,
    provider.firstName,
    provider.lastName,
    provider.bio,
    provider.shortDescription,
    provider.addressLine1,
    provider.city,
    ...(provider.specialties ?? []),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(searchTerm));
}

function getDistinctSortedValues(values: Array<string | null | undefined>): string[] {
  return [
    ...new Set(values.map((value) => value?.trim()).filter((value): value is string => !!value)),
  ].sort((a, b) => a.localeCompare(b));
}

function getRangeAvailableStartTimes(dayCount: number, serviceCount: number): string[] {
  const baseSlots = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

  if (dayCount > 7 || serviceCount > 4) return [];

  const durationFiltered =
    dayCount > 4 ? baseSlots.filter((slot) => !['08:00', '16:00'].includes(slot)) : baseSlots;
  if (serviceCount >= 3) return durationFiltered.filter((_, index) => index % 2 === 1);

  return durationFiltered;
}

function getMonthAvailabilityDays(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month - 1, index + 1);
    const isPast = date.getTime() < today.getTime();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return {
      date: formatDateOnly(date),
      slotCount: isPast || isWeekend ? 0 : 3 + Math.floor(Math.random() * 4),
    };
  });
}

function apiBadRequest(message: string, field: string = 'request') {
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

// ============================================
// HANDLERS
// ============================================

export const providerHandlers = [
  // ── GET /api/providers/active ───────────────────────────────
  http.get('*/api/v1/providers/active', () => {
    const active = providersData.filter((p) => p.status === 'active' && p.isAvailable);
    return apiOk(active);
  }),

  // ── GET /api/providers/available ────────────────────────────
  http.get('*/api/v1/providers/available', ({ request }) => {
    const url = new URL(request.url);
    const serviceCategory = url.searchParams.get('serviceCategory') ?? '';
    const results = serviceCategory
      ? getAvailableMockProviders(
          serviceCategory as Parameters<typeof getAvailableMockProviders>[0],
        )
      : providersData.filter((p) => p.isAvailable);
    return apiOk(results);
  }),

  // ── GET /api/providers/top-rated ────────────────────────────
  http.get('*/api/v1/providers/top-rated', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? '5');
    return apiOk(getTopRatedMock(limit));
  }),

  // ── GET /api/providers/by-service-type ──────────────────────
  http.get('*/api/v1/providers/by-service-type', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') ?? '';
    const results = type
      ? getMockByServiceType(type as Parameters<typeof getMockByServiceType>[0])
      : [];
    return apiOk(results);
  }),

  // ── GET /api/providers/filter-options ───────────────────────
  http.get('*/api/v1/providers/filter-options', ({ request }) => {
    const url = new URL(request.url);
    const serviceCategory = url.searchParams.get('serviceCategory')?.trim();
    const activeProviders = providersData.filter(
      (provider) =>
        provider.status === 'active' &&
        (!serviceCategory || provider.serviceCategory === serviceCategory),
    );

    return apiOk({
      cities: getDistinctSortedValues(activeProviders.map((provider) => provider.city)),
      specialties: getDistinctSortedValues(
        activeProviders.flatMap((provider) => provider.specialties ?? []),
      ),
      nutritionProviderSubtypes: getDistinctSortedValues(
        activeProviders.map((provider) => provider.nutritionProviderSubtype),
      ),
    });
  }),

  // ── GET /api/v1/ambulance/service-types ──────────────────
  http.get('*/api/v1/ambulance/service-types', () => {
    return apiOk(mockAmbulanceServiceTypeLookups);
  }),

  // ── GET /api/v1/veterinary/animal-types ──────────────────
  http.get('*/api/v1/veterinary/animal-types', () => {
    return apiOk(mockVeterinaryAnimalTypeLookups);
  }),

  // ── GET /api/providers/me/dashboard ─────────────────────────
  http.get('*/api/v1/providers/me/dashboard', () => {
    const profile = getCurrentMockProviderProfile();
    const metrics = getProviderDashboardMetrics();
    const providerName =
      profile.businessName?.trim() ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
      'Prestataire mock';

    return apiOk({
      provider: {
        id: profile.id,
        name: providerName,
        providerType: profile.serviceType,
        specialties: profile.specialization ? [profile.specialization] : [],
        rating: profile.rating,
        reviewCount: profile.totalReviews,
        available: profile.isOnline,
        isVerified: profile.isVerified ?? false,
        verificationConsentGiven: profile.verificationConsentGiven ?? false,
        verificationStatus: profile.verificationStatus ?? 'not_requested',
        verificationRequestedAt: profile.verificationRequestedAt ?? null,
        verificationReviewedAt: profile.verificationReviewedAt ?? null,
        canRequestVerification: profile.canRequestVerification ?? false,
        subscriptionTier: profile.subscriptionTier,
        availableBalance: 1250.5,
      },
      appointmentStats: {
        todayCount: metrics.todayCount,
        weekCount: metrics.weekCount,
        completionRate: metrics.completionRate,
      },
      revenueStats: {
        thisWeekRevenue: metrics.thisWeekRevenue,
        thisMonthRevenue: metrics.thisMonthRevenue,
      },
    });
  }),

  // ── GET /api/v1/providers/me/planning ───────────────────────
  http.get('*/api/v1/providers/me/planning', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (!from || !to) {
      return apiBadRequest('Both from and to query parameters are required.');
    }

    return apiOk(getProviderPlanningData(from, to));
  }),

  // ── GET /api/v1/providers/me/schedules ──────────────────────
  http.get('*/api/v1/providers/me/schedules', () => {
    return apiOk(getMockProviderSchedules());
  }),

  // ── PUT /api/v1/providers/me/schedules ──────────────────────
  http.put('*/api/v1/providers/me/schedules', async ({ request }) => {
    const body = (await request.json()) as UpsertProviderScheduleInterval[];
    return apiOk(replaceMockProviderSchedules(body));
  }),

  // ── GET /api/v1/providers/me/unavailabilities ───────────────
  http.get('*/api/v1/providers/me/unavailabilities', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (!from || !to) {
      return apiBadRequest('Both from and to query parameters are required.');
    }

    return apiOk(getMockProviderUnavailabilities(from, to));
  }),

  // ── POST /api/v1/providers/me/unavailabilities ──────────────
  http.post('*/api/v1/providers/me/unavailabilities', async ({ request }) => {
    const body = (await request.json()) as {
      startDatetime: string;
      endDatetime: string;
      isAllDay: boolean;
      isRecurring: boolean;
      recurrenceRule?: string | null;
      reason?: string | null;
      notes?: string | null;
    };

    return apiOk(
      createMockProviderUnavailability({
        startDatetime: body.startDatetime,
        endDatetime: body.endDatetime,
        isAllDay: body.isAllDay,
        isRecurring: body.isRecurring,
        recurrenceRule: body.recurrenceRule ?? null,
        reason: body.reason ?? null,
        notes: body.notes ?? null,
      }),
    );
  }),

  // ── PATCH /api/v1/providers/me/unavailabilities/:id ─────────
  http.patch('*/api/v1/providers/me/unavailabilities/:id', async ({ params, request }) => {
    const body = (await request.json()) as {
      startDatetime?: string;
      endDatetime?: string;
      isAllDay?: boolean;
      isRecurring?: boolean;
      recurrenceRule?: string | null;
      reason?: string | null;
      notes?: string | null;
    };
    const updated = updateMockProviderUnavailability(params.id as string, body);

    if (!updated) {
      return apiNotFound(`Unavailability ${params.id as string} not found`);
    }

    return apiOk(updated);
  }),

  // ── DELETE /api/v1/providers/me/unavailabilities/:id ────────
  http.delete('*/api/v1/providers/me/unavailabilities/:id', ({ params }) => {
    const deleted = deleteMockProviderUnavailability(params.id as string);

    if (!deleted) {
      return apiNotFound(`Unavailability ${params.id as string} not found`);
    }

    return apiOk(null);
  }),

  // ── GET /api/providers/me/reviews ───────────────────────────
  http.get('*/api/v1/providers/me/reviews', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const mockReviews = Array.from({ length: 5 }, (_, i) => ({
      id: `review-${i + 1}`,
      bookingId: `booking-${i + 1}`,
      patientId: `patient-${i + 1}`,
      patient: {
        name: ['Sophie Martin', 'Ahmed Khelifi', 'Marie Dupont', 'Omar Trabelsi', 'Fatma Sassi'][i],
        avatar: null,
      },
      rating: [5, 4, 5, 4, 5][i],
      comment: [
        'Excellent service, très professionnelle.',
        'Bon suivi, ponctuel.',
        'Très satisfaite du service.',
        'Service correct, rien à redire.',
        'Je recommande vivement !',
      ][i],
      professionalismRating: [5, 4, 5, 5, 5][i],
      punctualityRating: [5, 5, 4, 4, 5][i],
      qualityRating: [5, 4, 5, 4, 5][i],
      providerResponse: null,
      providerRespondedAt: null,
      createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    }));

    const total = mockReviews.length;
    const start = (page - 1) * limit;
    const items = mockReviews.slice(start, start + limit);

    return apiOk({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: {
        averageRating: 4.6,
        totalReviews: total,
        ratingDistribution: { '5': 3, '4': 2, '3': 0, '2': 0, '1': 0 },
      },
    });
  }),

  // ── GET /api/providers/me/availability ──────────────────────
  http.get('*/api/v1/providers/me/availability', () => {
    const profile = getCurrentMockProviderProfile();
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return apiOk({
      providerId: profile.id,
      date: dateStr,
      availableSlots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      unavailableSlots: ['12:00', '13:00'],
      unavailableDates: null,
      timezone: 'Africa/Tunis',
    });
  }),

  // ── GET /api/providers/me/services ──────────────────────────
  http.get('*/api/v1/providers/me/services', () => {
    const services = getCurrentMockProviderServiceSummaries();

    return apiOk({
      items: services,
      pagination: { page: 1, limit: 20, total: services.length, totalPages: 1 },
    });
  }),

  // ── GET /api/providers/me ───────────────────────────────────
  http.get('*/api/v1/providers/me', () => {
    return apiOk(getCurrentMockProviderProfile());
  }),

  // ── GET /api/providers/me/preferences ──────────────────────
  http.get('*/api/v1/providers/me/preferences', () => {
    return apiOk(getCurrentMockProviderPreferences());
  }),

  // ── PUT /api/providers/me/preferences ──────────────────────
  http.put('*/api/v1/providers/me/preferences', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return apiOk(
      updateCurrentMockProviderPreferences({
        ...(typeof body.emailNotifications === 'boolean'
          ? { emailNotifications: body.emailNotifications }
          : {}),
        ...(typeof body.smsNotifications === 'boolean'
          ? { smsNotifications: body.smsNotifications }
          : {}),
        ...(typeof body.pushNotifications === 'boolean'
          ? { pushNotifications: body.pushNotifications }
          : {}),
        ...(typeof body.marketingEmails === 'boolean'
          ? { marketingEmails: body.marketingEmails }
          : {}),
        ...(typeof body.allowPatientMessages === 'boolean'
          ? { allowPatientMessages: body.allowPatientMessages }
          : {}),
        ...(typeof body.profileVisibility === 'string' && body.profileVisibility.trim().length > 0
          ? { profileVisibility: body.profileVisibility.trim().toLowerCase() }
          : {}),
      }),
    );
  }),

  // ── GET /api/providers/:id/schedule ─────────────────────────
  http.get('*/api/v1/providers/:id/schedule', ({ params }) => {
    const { id } = params;
    const provider = findProviderById(id as string);
    if (!provider) return apiNotFound(`Provider ${id as string} not found`);

    const slots: Array<{ date: string; availableSlots: string[] }> = [];
    const today = new Date();
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() + d);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      slots.push({
        date: dateStr,
        availableSlots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      });
    }
    return apiOk(slots);
  }),

  // ── GET /api/providers/:id/availability/range ──────────────────
  http.get('*/api/v1/providers/:id/availability/range', ({ params, request }) => {
    const { id } = params;
    const provider = findProviderById(id as string);
    if (!provider) return apiNotFound(`Provider ${id as string} not found`);

    const url = new URL(request.url);
    const today = formatDateOnly(new Date());
    const startDate = url.searchParams.get('startDate') ?? today;
    const endDate = url.searchParams.get('endDate') ?? startDate;
    const serviceIds = getRequestedServiceIds(url.searchParams);
    const dayCount = calculateDayCount(startDate, endDate);
    const dailyDurationMinutes = 60 + Math.max(0, serviceIds.length - 1) * 30;

    return apiOk({
      providerId: provider.id,
      startDate,
      endDate,
      dayCount,
      dailyDurationMinutes,
      availableStartTimes: getRangeAvailableStartTimes(dayCount, serviceIds.length),
      timezone: 'Africa/Tunis',
    });
  }),

  // ── GET /api/providers/:id/availability/month ──────────────────
  http.get('*/api/v1/providers/:id/availability/month', ({ params, request }) => {
    const { id } = params;
    const provider = findProviderById(id as string);
    if (!provider) return apiNotFound(`Provider ${id as string} not found`);

    const url = new URL(request.url);
    const now = new Date();
    const rawYear = Number(url.searchParams.get('year') ?? now.getFullYear());
    const rawMonth = Number(url.searchParams.get('month') ?? now.getMonth() + 1);
    const serviceIds = getRequestedServiceIds(url.searchParams);
    const year = Number.isInteger(rawYear) && rawYear > 0 ? rawYear : now.getFullYear();
    const month =
      Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth : now.getMonth() + 1;
    const maxBookableDate = new Date(now);
    maxBookableDate.setDate(maxBookableDate.getDate() + 365);

    return apiOk({
      providerId: provider.id,
      year,
      month,
      dailyDurationMinutes: 60 + Math.max(0, serviceIds.length - 1) * 30,
      timezone: 'Africa/Tunis',
      maxBookableDate: formatDateOnly(maxBookableDate),
      days: getMonthAvailabilityDays(year, month),
    });
  }),

  // ── GET /api/providers/:id (single provider) ───────────────
  http.get('*/api/v1/providers/:id', ({ params }) => {
    const { id } = params;
    const provider = findProviderById(id as string);
    if (!provider) return apiNotFound(`Provider ${id as string} not found`);
    return apiOk({
      ...provider,
      yearsOfExperience: provider.experience ?? 0,
      phone: provider.phone ?? null,
    });
  }),

  // ── GET /api/providers (paginated list with filters) ────────
  http.get('*/api/v1/providers', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const serviceCategory = url.searchParams.get('serviceCategory');
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy');
    const sortDesc = url.searchParams.get('sortDesc') === 'true';
    const city = url.searchParams.get('city');
    const searchQuery = url.searchParams.get('searchQuery');

    let items: MockProviderData[] = [...providersData];

    if (serviceCategory) {
      items = items.filter((p) => p.serviceCategory === serviceCategory);
    }
    if (status === 'active') {
      items = items.filter((p) => p.status === 'active');
    }
    if (city) {
      items = items.filter((p) => p.city?.toLowerCase().includes(city.toLowerCase()));
    }
    if (searchQuery) {
      items = items.filter((p) => providerMatchesSearch(p, searchQuery));
    }
    if (sortBy === 'rating') {
      items.sort((a, b) =>
        sortDesc ? a.ratingAverage - b.ratingAverage : b.ratingAverage - a.ratingAverage,
      );
    } else if (sortBy === 'reviewCount') {
      items.sort((a, b) =>
        sortDesc ? a.ratingCount - b.ratingCount : b.ratingCount - a.ratingCount,
      );
    }

    return apiOk(paginateProviders(items, page, limit));
  }),

  // ── PUT /api/providers/me (update profile) ──────────────────
  http.put('*/api/v1/providers/me', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const currentProfile = getCurrentMockProviderProfile();
    const requestedNutritionSubtype = body.nutritionProviderSubtype;

    if (requestedNutritionSubtype !== undefined) {
      if (!isNutritionProviderCategory(currentProfile.serviceType)) {
        return apiBadRequest(
          'Le sous-type nutrition est réservé à la catégorie nutrition.',
          'nutritionProviderSubtype',
        );
      }

      if (
        requestedNutritionSubtype !== null &&
        (typeof requestedNutritionSubtype !== 'string' ||
          !NUTRITION_PROVIDER_SUBTYPE_VALUES.includes(
            requestedNutritionSubtype as (typeof NUTRITION_PROVIDER_SUBTYPE_VALUES)[number],
          ))
      ) {
        return apiBadRequest('Sous-type nutrition invalide.', 'nutritionProviderSubtype');
      }
    }

    return apiOk(
      updateCurrentMockProviderProfile({
        ...(typeof body.businessName === 'string' || body.businessName === null
          ? { businessName: body.businessName as string | null }
          : {}),
        ...(typeof body.firstName === 'string' || body.firstName === null
          ? { firstName: body.firstName as string | null }
          : {}),
        ...(typeof body.lastName === 'string' || body.lastName === null
          ? { lastName: body.lastName as string | null }
          : {}),
        ...(typeof body.specialization === 'string' || body.specialization === null
          ? { specialization: body.specialization as string | null }
          : {}),
        ...(requestedNutritionSubtype !== undefined
          ? {
              nutritionProviderSubtype: requestedNutritionSubtype as
                | typeof currentProfile.nutritionProviderSubtype
                | null,
            }
          : {}),
        ...(typeof body.bio === 'string' || body.bio === null
          ? { bio: body.bio as string | null }
          : {}),
        ...(typeof body.address === 'string' || body.address === null
          ? { address: body.address as string | null }
          : {}),
        ...(typeof body.city === 'string' || body.city === null
          ? { city: body.city as string | null }
          : {}),
        ...(typeof body.postalCode === 'string' || body.postalCode === null
          ? { postalCode: body.postalCode as string | null }
          : {}),
        ...(typeof body.latitude === 'number' || body.latitude === null
          ? { latitude: body.latitude as number | null }
          : {}),
        ...(typeof body.longitude === 'number' || body.longitude === null
          ? { longitude: body.longitude as number | null }
          : {}),
        ...(typeof body.serviceRadius === 'number' ? { serviceRadius: body.serviceRadius } : {}),
      }),
    );
  }),

  // ── PUT /api/providers/me/availability (toggle) ─────────────
  http.put('*/api/v1/providers/me/availability', async ({ request }) => {
    const body = (await request.json()) as { available?: boolean };
    const updatedProfile = updateCurrentMockProviderProfile({
      isOnline: body.available ?? true,
    });

    return apiOk({
      id: updatedProfile.id,
      available: updatedProfile.isOnline,
      updatedAt: updatedProfile.updatedAt,
    });
  }),

  // ── POST /api/providers/me/verification-request ─────────────
  http.post('*/api/v1/providers/me/verification-request', () => {
    const now = new Date().toISOString();
    const updatedProfile = updateCurrentMockProviderProfile({
      isVerified: false,
      verificationConsentGiven: true,
      verificationStatus: 'requested',
      verificationRequestedAt: now,
      verificationReviewedAt: null,
      canRequestVerification: false,
    });

    return apiOk({
      providerId: updatedProfile.id,
      isVerified: updatedProfile.isVerified,
      verificationConsentGiven: updatedProfile.verificationConsentGiven,
      verificationStatus: updatedProfile.verificationStatus,
      verificationRequestedAt: updatedProfile.verificationRequestedAt,
      verificationReviewedAt: updatedProfile.verificationReviewedAt,
      canRequestVerification: updatedProfile.canRequestVerification,
    });
  }),

  // ── POST /api/providers/me/services (add service) ──────────
  http.post('*/api/v1/providers/me/services', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (
      body.typeConfig !== undefined &&
      (body.typeConfig === null ||
        typeof body.typeConfig !== 'object' ||
        Array.isArray(body.typeConfig))
    ) {
      return apiBadRequest('Type config must be a JSON object.', 'typeConfig');
    }

    const createdService = createCurrentMockProviderService(body);

    return HttpResponse.json(
      {
        success: true,
        data: createdService,
        status: 'success',
        message: null,
      },
      { status: 201 },
    );
  }),

  // ── PUT /api/v1/providers/me/services/:id (update) ──────────
  http.put('*/api/v1/providers/me/services/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;

    if (
      body.typeConfig !== undefined &&
      (body.typeConfig === null ||
        typeof body.typeConfig !== 'object' ||
        Array.isArray(body.typeConfig))
    ) {
      return apiBadRequest('Type config must be a JSON object.', 'typeConfig');
    }

    const updatedService = updateCurrentMockProviderService(id as string, body);

    if (!updatedService) {
      return apiNotFound(`Service ${id as string} not found`);
    }

    return apiOk(updatedService);
  }),

  // ── POST /api/v1/providers/me/services/:id/photos (attach service photo) ──────────
  http.post('*/api/v1/providers/me/services/:id/photos', async ({ params, request }) => {
    const body = (await request.json()) as {
      fileId?: string;
      isMain?: boolean;
      sortOrder?: number;
    };

    if (!body.fileId) {
      return apiBadRequest('fileId is required.', 'fileId');
    }

    const attachedPhoto = attachCurrentMockProviderServicePhoto({
      serviceId: params.id as string,
      fileId: body.fileId,
      isMain: body.isMain,
      sortOrder: body.sortOrder,
    });

    if (!attachedPhoto) {
      return apiNotFound(`Service ${params.id as string} not found`);
    }

    return apiOk(attachedPhoto);
  }),

  // ── DELETE /api/v1/providers/me/services/:id (remove) ─────────
  http.delete('*/api/v1/providers/me/services/:id', ({ params }) => {
    const deleted = deleteCurrentMockProviderService(params.id as string);

    if (!deleted) {
      return apiNotFound(`Service ${params.id as string} not found`);
    }

    return apiOk(null);
  }),

  // ── PATCH /api/v1/providers/me/services/:id/toggle ──────────
  http.patch('*/api/v1/providers/me/services/:id/toggle', async ({ params, request }) => {
    const body = (await request.json()) as { isActive: boolean };
    const toggled = toggleCurrentMockProviderService(params.id as string, body.isActive);

    if (!toggled) {
      return apiNotFound(`Service ${params.id as string} not found`);
    }

    return apiOk(null);
  }),

  // ── GET /api/v1/providers/me/services/stats ─────────────────
  http.get('*/api/v1/providers/me/services/stats', () => {
    return apiOk(getCurrentMockProviderServiceStats());
  }),

  // ── GET /api/v1/providers/me/services/presets ───────────────
  http.get('*/api/v1/providers/me/services/presets', () => {
    return apiOk([]);
  }),

  // ── GET /api/v1/providers/me/services/:id (detail) ──────────
  http.get('*/api/v1/providers/me/services/:id', ({ params }) => {
    const service = getCurrentMockProviderServiceDetail(params.id as string);

    if (!service) {
      return apiNotFound(`Service ${params.id as string} not found`);
    }

    return apiOk(service);
  }),
];
