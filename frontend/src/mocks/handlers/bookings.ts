/**
 * Booking MSW Handlers
 *
 * Intercepts all /api/bookings/* requests during development and
 * returns realistic mock data shaped to match the Zod schemas.
 * Replaces the in-code mock branching from appointments.service.ts.
 */

import { http } from 'msw';
import { decrementMockEquipmentStock, getMockEquipmentPricing } from './equipment';
import { getServiceById } from '@/data/services.data';
import { generateAppointment } from '@/data/mock/generators';

// Appointment type removed — mock data uses 'any' since generator shape diverges from types/index.ts
import type {
  BookingListItemResponse,
  BookingPaymentMethod,
  BookingSessionMutationResponse,
  BookingResponse,
  CancelBookingResponse,
  CreateBookingResponse,
  BookingQuoteResponse,
  ConfirmBookingResponse,
  DeclineBookingResponse,
  RateBookingResponse,
  UpdateBookingResponse,
} from '@/features/bookings/schema';
import { normalizeBookingStatus } from '@/features/bookings/status';
import { getCurrentMockProviderProfile } from '@/mocks/handlers/providerAuthoringStore';
import {
  createDefaultDailyEndTime,
  createMockBookingPaymentState,
  createMockBookingRecord,
  findMockBookingRecord,
  getMockBookingSessionDetail,
  getMockProviderSessionDelivery,
  getProviderTodayBookingRecords,
  listMockBookingSessionsForBooking,
  findMockBookingSession,
  listMockBookingSessions,
  listMockBookingRecords,
  updateMockBookingSession,
  updateMockBookingRecord,
} from '@/mocks/handlers/providerPlanningStore';
import { apiBadRequest, apiConflict, apiOk, apiNotFound, randomId } from '@/mocks/utils';

const SLOT_CONFLICT_CODE = 'BOOKING_SLOT_CONFLICT';
const PRICE_MISMATCH_CODE = 'BOOKING_PRICE_MISMATCH';
const SLOT_CONFLICT_TRIGGER_TOKEN = '[mock-slot-conflict]';

type MockBookingServiceItem = NonNullable<CreateBookingResponse['serviceItems']>[number] & {
  serviceName: string | null;
  serviceCategory: string | null;
  currency: string | null;
};
type MockBookingPricing = BookingQuoteResponse['pricing'] & { currency: string };
type MockBookingEquipmentRental = NonNullable<CreateBookingResponse['equipmentRental']> & {
  endDate: string;
  rentalDurationType: string | null;
  periodCount: number | null;
  periodRate: number | null;
  depositAmount: number | null;
  depositStatus: string | null;
};

function toApiStatus(status?: string | null): string | null {
  return status ? normalizeBookingStatus(status) : null;
}

interface MockBookingRequestBody {
  providerId?: string;
  serviceItems?: Array<{ serviceId: string; quantity: number }>;
  startDate?: string;
  endDate?: string;
  dailyStartTime?: string;
  paymentMethod?: BookingPaymentMethod;
  patientLocationChoice?: 'home' | 'provider_site' | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    instructions?: string | null;
  } | null;
  patientNotes?: string | null;
  expectedTotalAmount?: number;
  typeConfig?: {
    endDate?: string;
    rentalDurationType?: string;
    periodCount?: number;
    periodRate?: number;
    items?: string;
  } | null;
}

interface ResolvedMockBookingDraft {
  requestedItems: Array<{ serviceId: string; quantity: number }>;
  bookingType: string;
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dayCount: number;
  dailyDurationMinutes: number;
  dailyEndTime: string;
  scheduledAt: string;
  pricing: MockBookingPricing;
  serviceItems: MockBookingServiceItem[];
  primaryService: MockBookingServiceItem | null;
  equipmentRental: MockBookingEquipmentRental | null;
}

function roundAmount(value: number): number {
  return Number(value.toFixed(2));
}

function mockCommission(amount: number, rate: number = 0.15): number {
  return Math.round(amount * rate * 100) / 100;
}

function hasSlotConflictTrigger(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.toLowerCase().includes(SLOT_CONFLICT_TRIGGER_TOKEN);
}

// ============================================
// MAPPING HELPERS
// ============================================

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function normalizeDateOnly(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback;
  return value.includes('T') ? value.slice(0, 10) : value;
}

function normalizeTimeOnly(value: unknown, fallback: string = '09:00:00'): string {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback;
  return value.length === 5 ? `${value}:00` : value;
}

function addMinutesToTime(time: string, minutesToAdd: number): string {
  const normalized = normalizeTimeOnly(time);
  const [hours = 0, minutes = 0, seconds = 0] = normalized.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function calculateDayCount(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  return Math.floor(diffMs / 86400000) + 1;
}

function buildScheduledAt(startDate: string, dailyStartTime: string): string {
  return new Date(`${startDate}T${normalizeTimeOnly(dailyStartTime)}`).toISOString();
}

function normalizePaymentMethod(value: unknown): BookingPaymentMethod {
  return value === 'card' || value === 'd17' || value === 'cash' ? value : 'cash';
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.max(1, Math.round(value))
    : fallback;
}

function resolveMockBookingType(body: MockBookingRequestBody, hasRental: boolean): string {
  if (hasRental) {
    return 'equipment';
  }

  return body.patientLocationChoice === 'provider_site' ? 'clinic' : 'home';
}

function resolveEquipmentPeriodCount(
  typeConfig: MockBookingRequestBody['typeConfig'],
  dayCount: number,
): number {
  const fallback =
    typeConfig?.rentalDurationType === 'weekly'
      ? Math.max(1, Math.ceil(dayCount / 7))
      : typeConfig?.rentalDurationType === 'monthly'
        ? Math.max(1, Math.ceil(dayCount / 30))
        : dayCount;

  return normalizePositiveInteger(typeConfig?.periodCount, fallback);
}

function resolveEquipmentPeriodRate(
  typeConfig: MockBookingRequestBody['typeConfig'],
  equipmentPricing: ReturnType<typeof getMockEquipmentPricing>,
  fallback: number,
): number {
  if (typeof typeConfig?.periodRate === 'number' && Number.isFinite(typeConfig.periodRate)) {
    return roundAmount(typeConfig.periodRate);
  }

  if (!equipmentPricing) {
    return roundAmount(fallback);
  }

  switch (typeConfig?.rentalDurationType) {
    case 'weekly':
      return roundAmount(equipmentPricing.pricePerWeek);
    case 'monthly':
      return roundAmount(equipmentPricing.pricePerMonth);
    default:
      return roundAmount(equipmentPricing.pricePerDay);
  }
}

function resolveBookingDraft(body: MockBookingRequestBody): ResolvedMockBookingDraft {
  const requestedItems = (body.serviceItems ?? []).filter((item) => item.quantity > 0);
  const today = new Date().toISOString().slice(0, 10);
  const hasRental = Boolean(body.typeConfig?.rentalDurationType);
  const bookingType = resolveMockBookingType(body, hasRental);
  const startDate = normalizeDateOnly(body.startDate, today);
  const rangeEndDate = normalizeDateOnly(body.endDate, startDate);
  const endDate = hasRental
    ? normalizeDateOnly(body.typeConfig?.endDate, rangeEndDate)
    : rangeEndDate;
  const dailyStartTime = normalizeTimeOnly(body.dailyStartTime);
  const dayCount = calculateDayCount(startDate, endDate);
  const dailyDurationMinutes = 60 + Math.max(0, requestedItems.length - 1) * 30;
  const dailyEndTime = createDefaultDailyEndTime(dailyStartTime, dailyDurationMinutes);
  const scheduledAt = buildScheduledAt(startDate, dailyStartTime);
  const primaryRequestedItem = requestedItems[0] ?? null;
  const primaryEquipmentPricing = primaryRequestedItem
    ? getMockEquipmentPricing(primaryRequestedItem.serviceId)
    : null;

  const serviceItems = requestedItems.map((item, index) => {
    const responseServiceId = isUuid(item.serviceId) ? item.serviceId : randomId();
    const catalogService = getServiceById(item.serviceId);
    const equipmentPricing =
      primaryRequestedItem && item.serviceId === primaryRequestedItem.serviceId
        ? primaryEquipmentPricing
        : getMockEquipmentPricing(item.serviceId);
    const unitPrice = hasRental
      ? resolveEquipmentPeriodRate(body.typeConfig, equipmentPricing, 45 + index * 15)
      : roundAmount(catalogService?.basePrice ?? 45 + index * 15);

    return {
      id: randomId(),
      serviceId: responseServiceId,
      serviceName:
        equipmentPricing?.name ??
        catalogService?.name ??
        (index === 0 ? (body.typeConfig?.items ?? null) : null),
      serviceCategory:
        equipmentPricing?.categoryName ?? catalogService?.type ?? catalogService?.category ?? null,
      currency: equipmentPricing?.currency ?? catalogService?.currency ?? 'TND',
      quantity: item.quantity,
      unitPrice,
      subtotal: roundAmount(unitPrice * item.quantity),
    };
  });

  const primaryService = serviceItems[0] ?? null;

  if (hasRental) {
    const periodCount = resolveEquipmentPeriodCount(body.typeConfig, dayCount);
    const periodRate = resolveEquipmentPeriodRate(body.typeConfig, primaryEquipmentPricing, 45);
    const depositAmount = primaryEquipmentPricing
      ? roundAmount(primaryEquipmentPricing.deposit)
      : null;
    const bookingSubtotal = roundAmount(periodRate * periodCount);
    const totalAmount = roundAmount(bookingSubtotal + (depositAmount ?? 0));

    return {
      requestedItems,
      bookingType,
      startDate,
      endDate,
      dailyStartTime,
      dayCount,
      dailyDurationMinutes,
      dailyEndTime,
      scheduledAt,
      pricing: {
        perDaySubtotal: periodRate,
        bookingSubtotal,
        platformFee: 0,
        totalAmount,
        currency: primaryEquipmentPricing?.currency ?? primaryService?.currency ?? 'TND',
      },
      serviceItems,
      primaryService,
      equipmentRental: {
        endDate,
        rentalDurationType: body.typeConfig?.rentalDurationType ?? null,
        periodCount,
        periodRate,
        depositAmount,
        depositStatus: depositAmount !== null ? 'pending' : null,
      },
    };
  }

  const perDaySubtotal = roundAmount(serviceItems.reduce((sum, item) => sum + item.subtotal, 0));
  const bookingSubtotal = roundAmount(perDaySubtotal * dayCount);
  const platformFee = roundAmount(mockCommission(bookingSubtotal));

  return {
    requestedItems,
    bookingType,
    startDate,
    endDate,
    dailyStartTime,
    dayCount,
    dailyDurationMinutes,
    dailyEndTime,
    scheduledAt,
    pricing: {
      perDaySubtotal,
      bookingSubtotal,
      platformFee,
      totalAmount: roundAmount(bookingSubtotal + platformFee),
      currency: primaryService?.currency ?? 'TND',
    },
    serviceItems,
    primaryService,
    equipmentRental: null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLineItems(a: any) {
  return a.lineItems ?? a.serviceItems ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPrimaryServiceId(a: any): string {
  const lineItems = getLineItems(a);
  if (isUuid(a.primaryServiceId)) return a.primaryServiceId;
  if (isUuid(a.service?.id)) return a.service.id;
  if (isUuid(a.serviceId)) return a.serviceId;
  if (Array.isArray(lineItems) && lineItems.length > 0 && isUuid(lineItems[0].serviceId)) {
    return lineItems[0].serviceId;
  }
  return a.id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAddressSummary(a: any): string | null {
  if (typeof a.address === 'string') return a.address;
  return a.address?.line1 ?? a.addressLine1 ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListItem(a: any): BookingListItemResponse {
  const startDate = normalizeDateOnly(
    a.startDate,
    normalizeDateOnly(a.scheduledAt, new Date().toISOString().slice(0, 10)),
  );
  const endDate = normalizeDateOnly(a.endDate, startDate);
  const dailyStartTime = normalizeTimeOnly(a.dailyStartTime ?? a.startTime);
  const dailyDurationMinutes = a.dailyDurationMinutes ?? a.duration ?? 60;
  const lineItems = getLineItems(a);
  const perDaySubtotal = a.perDaySubtotal ?? a.pricing?.perDaySubtotal ?? a.price ?? 0;
  const platformFee = a.platformFee ?? a.pricing?.platformFee ?? 0;
  const totalAmount = a.totalAmount ?? a.pricing?.totalAmount ?? perDaySubtotal + platformFee;
  const sessions = typeof a.id === 'string' ? listMockBookingSessionsForBooking(a.id) : [];
  const activeSession =
    sessions.find((session) =>
      ['ProviderOnWay', 'Arrived', 'InProgress'].includes(
        normalizeBookingStatus(session.status ?? ''),
      ),
    ) ??
    sessions.find((session) =>
      ['Pending', 'Confirmed'].includes(normalizeBookingStatus(session.status ?? '')),
    ) ??
    null;
  const sessionCounts = getMockSessionCounts(sessions);

  return {
    id: a.id,
    bookingNumber: a.bookingNumber ?? undefined,
    status: toApiStatus(a.status),
    paymentMethod: normalizePaymentMethod(a.paymentMethod),
    paymentId: a.paymentId ?? null,
    paymentStatus: a.paymentStatus ?? null,
    paymentMethodType: a.paymentMethodType ?? a.paymentMethod ?? null,
    paymentReferenceNumber: a.paymentReferenceNumber ?? null,
    type: a.type ?? null,
    scheduledAt: a.scheduledAt ?? buildScheduledAt(startDate, dailyStartTime),
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime: a.dailyEndTime ?? addMinutesToTime(dailyStartTime, dailyDurationMinutes),
    dailyDurationMinutes,
    dayCount: a.dayCount ?? calculateDayCount(startDate, endDate),
    perDaySubtotal,
    platformFee,
    totalAmount,
    currency: a.currency ?? a.pricing?.currency ?? 'TND',
    address: getAddressSummary(a),
    service: a.service
      ? { name: a.service.name ?? null, category: a.service.category ?? null }
      : a.serviceName
        ? { name: a.serviceName, category: null }
        : undefined,
    lineItems: lineItems ?? undefined,
    equipmentRental: a.equipmentRental ?? null,
    provider: a.provider
      ? {
          id: a.provider.id,
          name: a.provider.name ?? null,
          phone: a.provider.phone ?? null,
          rating: a.provider.rating ?? 0,
        }
      : undefined,
    notes: a.notes ?? a.patientNotes ?? null,
    sessionId: activeSession?.id ?? null,
    bookingId: a.id,
    activeSessionId: activeSession?.id ?? null,
    nextSessionId: activeSession?.id ?? null,
    totalSessions: sessionCounts.totalSessions,
    confirmedSessions: sessionCounts.confirmedSessions,
    inProgressSessions: sessionCounts.inProgressSessions,
    validatedSessions: sessionCounts.validatedSessions,
    cancelledSessions: sessionCounts.cancelledSessions,
    disputedSessions: sessionCounts.disputedSessions,
    noShowSessions: sessionCounts.noShowSessions,
    remainingSessions: sessionCounts.remainingSessions,
    sessionCounts,
    validationCode: a.validationCode ?? null,
    autoValidateAt:
      normalizeBookingStatus(a.status ?? '') === 'Completed'
        ? new Date(new Date(a.scheduledAt).getTime() + 48 * 60 * 60 * 1000).toISOString()
        : null,
    rating: typeof a.rating === 'number' ? a.rating : null,
    reviewComment: a.review ?? null,
    patient: a.patient
      ? {
          id: a.patient.id,
          name: a.patient.name ?? null,
          phone: a.patient.phone ?? null,
        }
      : a.patientId
        ? { id: a.patientId, name: null, phone: null }
        : undefined,
    providerAmount: null,
    providerAcceptedAt: a.providerAcceptedAt ?? null,
    providerDepartedAt: a.providerDepartedAt ?? null,
    providerArrivedAt: a.providerArrivedAt ?? null,
    serviceStartedAt: a.serviceStartedAt ?? null,
    serviceCompletedAt: a.serviceCompletedAt ?? null,
    validatedAt: a.validatedAt ?? null,
    cancelledAt: a.cancelledAt ?? null,
    cancelledBy: a.cancelledBy ?? null,
    cancellationReason: a.cancellationReason ?? null,
    noShowAt: activeSession?.noShowAt ?? a.noShowAt ?? null,
    noShowReason: activeSession?.noShowReason ?? a.noShowReason ?? null,
    statusChangedBy: a.statusChangedBy ?? null,
    statusChangeReason: a.statusChangeReason ?? null,
  };
}

function getMockSessionCounts(sessions: ReturnType<typeof listMockBookingSessionsForBooking>) {
  const counts = sessions.reduce(
    (currentCounts, session) => {
      switch (session.status) {
        case 'Confirmed':
          currentCounts.confirmedSessions += 1;
          break;
        case 'ProviderOnWay':
        case 'Arrived':
        case 'InProgress':
          currentCounts.inProgressSessions += 1;
          break;
        case 'Validated':
          currentCounts.validatedSessions += 1;
          break;
        case 'Cancelled':
          currentCounts.cancelledSessions += 1;
          break;
        case 'Disputed':
          currentCounts.disputedSessions += 1;
          break;
        case 'NoShow':
          currentCounts.noShowSessions += 1;
          break;
      }

      return currentCounts;
    },
    {
      confirmedSessions: 0,
      inProgressSessions: 0,
      validatedSessions: 0,
      cancelledSessions: 0,
      disputedSessions: 0,
      noShowSessions: 0,
    },
  );
  const terminalSessions =
    counts.validatedSessions +
    counts.cancelledSessions +
    counts.disputedSessions +
    counts.noShowSessions;

  return {
    totalSessions: sessions.length || null,
    ...counts,
    remainingSessions: sessions.length ? Math.max(0, sessions.length - terminalSessions) : null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBookingResponse(a: any): BookingResponse {
  const now = new Date().toISOString();
  const startDate = normalizeDateOnly(
    a.startDate,
    normalizeDateOnly(a.scheduledAt, now.slice(0, 10)),
  );
  const endDate = normalizeDateOnly(a.endDate, startDate);
  const dailyStartTime = normalizeTimeOnly(a.dailyStartTime ?? a.startTime);
  const dailyDurationMinutes = a.dailyDurationMinutes ?? a.duration ?? 60;
  const lineItems = getLineItems(a);
  const perDaySubtotal = a.perDaySubtotal ?? a.pricing?.perDaySubtotal ?? a.price ?? 0;
  const platformFee = a.platformFee ?? a.pricing?.platformFee ?? 0;
  const totalAmount = a.totalAmount ?? a.pricing?.totalAmount ?? perDaySubtotal + platformFee;
  const primaryServiceId = getPrimaryServiceId(a);
  const sessions = typeof a.id === 'string' ? listMockBookingSessionsForBooking(a.id) : [];
  const activeSession =
    sessions.find((session) =>
      ['ProviderOnWay', 'Arrived', 'InProgress'].includes(
        normalizeBookingStatus(session.status ?? ''),
      ),
    ) ??
    sessions.find((session) =>
      ['Pending', 'Confirmed'].includes(normalizeBookingStatus(session.status ?? '')),
    ) ??
    null;
  const sessionCounts = getMockSessionCounts(sessions);

  return {
    id: a.id,
    bookingNumber: a.bookingNumber ?? undefined,
    patientId: a.patientId,
    providerId: a.providerId ?? a.provider?.id ?? a.id,
    primaryServiceId,
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime: a.dailyEndTime ?? addMinutesToTime(dailyStartTime, dailyDurationMinutes),
    dailyDurationMinutes,
    dayCount: a.dayCount ?? calculateDayCount(startDate, endDate),
    timezone: null,
    status: toApiStatus(a.status),
    totalSessions: sessionCounts.totalSessions,
    confirmedSessions: sessionCounts.confirmedSessions,
    inProgressSessions: sessionCounts.inProgressSessions,
    validatedSessions: sessionCounts.validatedSessions,
    cancelledSessions: sessionCounts.cancelledSessions,
    disputedSessions: sessionCounts.disputedSessions,
    noShowSessions: sessionCounts.noShowSessions,
    remainingSessions: sessionCounts.remainingSessions,
    sessionCounts,
    activeSessionId: activeSession?.id ?? null,
    nextSessionId: activeSession?.id ?? null,
    paymentMethod: normalizePaymentMethod(a.paymentMethod),
    paymentId: a.paymentId ?? null,
    paymentStatus: a.paymentStatus ?? null,
    paymentMethodType: a.paymentMethodType ?? a.paymentMethod ?? null,
    paymentReferenceNumber: a.paymentReferenceNumber ?? null,
    patientName: a.patient?.name ?? null,
    patientPhoneNumber: a.patient?.phone ?? null,
    patientEmail: null,
    providerName: a.provider?.name ?? null,
    providerPhoneNumber: a.provider?.phone ?? null,
    providerProfilePhotoUrl: null,
    serviceName: a.serviceName ?? a.service?.name ?? null,
    estimatedCost: totalAmount,
    serviceModality: a.type ?? null,
    serviceCategory: a.service?.category ?? null,
    addressLine1: a.address?.line1 ?? a.addressLine1 ?? null,
    addressLine2: a.address?.line2 ?? a.addressLine2 ?? null,
    city: a.address?.city ?? a.city ?? null,
    postalCode: a.address?.postalCode ?? a.postalCode ?? null,
    latitude: a.address?.latitude ?? a.latitude ?? null,
    longitude: a.address?.longitude ?? a.longitude ?? null,
    addressInstructions: a.address?.instructions ?? a.addressInstructions ?? null,
    perDaySubtotal,
    platformFee,
    totalAmount,
    currency: a.currency ?? a.pricing?.currency ?? 'TND',
    isProviderConfirmed: ['Confirmed', 'Completed'].includes(
      normalizeBookingStatus(a.status ?? ''),
    ),
    providerConfirmedAt: a.providerConfirmedAt ?? a.providerAcceptedAt ?? null,
    isRescheduleRequested: false,
    rescheduleCount: 0,
    createdAt: a.createdAt ?? now,
    updatedAt: a.updatedAt ?? now,
    autoValidateAt:
      normalizeBookingStatus(a.status ?? '') === 'Completed'
        ? new Date(new Date(a.scheduledAt).getTime() + 48 * 60 * 60 * 1000).toISOString()
        : null,
    patient: a.patient
      ? {
          id: a.patient.id,
          firstName: a.patient.name?.split(' ')[0] ?? null,
          lastName: a.patient.name?.split(' ').slice(1).join(' ') ?? null,
          profilePhotoUrl: a.patient.avatar ?? null,
        }
      : undefined,
    provider: a.provider
      ? {
          id: a.provider.id,
          firstName: a.provider.name?.split(' ')[0] ?? null,
          lastName: a.provider.name?.split(' ').slice(1).join(' ') ?? null,
          profilePhotoUrl: a.provider.avatar ?? null,
          averageRating: a.provider.rating ?? null,
          totalReviews: a.provider.reviewCount ?? 0,
        }
      : undefined,
    service: a.service
      ? {
          id: primaryServiceId,
          name: a.service.name ?? null,
          description: null,
          category: a.service.category ?? null,
          price: perDaySubtotal,
          estimatedDurationMinutes: dailyDurationMinutes,
        }
      : undefined,
    lineItems: lineItems ?? undefined,
    providerAcceptedAt: a.providerAcceptedAt ?? null,
    providerDepartedAt: a.providerDepartedAt ?? null,
    providerArrivedAt: a.providerArrivedAt ?? null,
    serviceStartedAt: a.serviceStartedAt ?? null,
    serviceCompletedAt: a.serviceCompletedAt ?? null,
    validatedAt: a.validatedAt ?? null,
    cancelledAt: a.cancelledAt ?? null,
    cancelledBy: a.cancelledBy ?? null,
    cancellationReason: a.cancellationReason ?? null,
    noShowAt: activeSession?.noShowAt ?? a.noShowAt ?? null,
    noShowReason: activeSession?.noShowReason ?? a.noShowReason ?? null,
    statusChangedBy: a.statusChangedBy ?? null,
    statusChangeReason: a.statusChangeReason ?? null,
  };
}

// ============================================
// HANDLERS
// ============================================

export const bookingHandlers = [
  // ── GET /api/booking-sessions (paginated list) ───────────────
  http.get('*/api/v1/booking-sessions', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '100');
    const status = url.searchParams.get('status');
    const bookingId = url.searchParams.get('bookingId');
    const scheduledDateFrom =
      url.searchParams.get('scheduledDateFrom') ?? url.searchParams.get('startDateFrom');
    const scheduledDateTo =
      url.searchParams.get('scheduledDateTo') ?? url.searchParams.get('startDateTo');

    let items = listMockBookingSessions();

    if (status) {
      const normalizedStatus = normalizeBookingStatus(status);
      items = items.filter(
        (session) => normalizeBookingStatus(session.status ?? '') === normalizedStatus,
      );
    }

    if (bookingId) {
      items = items.filter((session) => session.bookingId === bookingId);
    }

    if (scheduledDateFrom) {
      items = items.filter((session) => String(session.scheduledDate) >= scheduledDateFrom);
    }

    if (scheduledDateTo) {
      items = items.filter((session) => String(session.scheduledDate) <= scheduledDateTo);
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;

    return apiOk({
      items: items.slice(start, start + limit),
      pagination: { page, limit, total, totalPages },
    });
  }),

  // ── GET /api/booking-sessions/:sessionId ─────────────────────
  http.get('*/api/v1/booking-sessions/:sessionId', ({ params }) => {
    const detail = getMockBookingSessionDetail(params.sessionId as string);

    if (!detail) {
      return apiNotFound(`Booking session ${params.sessionId as string} not found`);
    }

    return apiOk(detail);
  }),

  // ── GET /api/booking-sessions/:sessionId/delivery ─────────────
  http.get('*/api/v1/booking-sessions/:sessionId/delivery', ({ params }) => {
    const delivery = getMockProviderSessionDelivery(params.sessionId as string);

    if (!delivery) {
      return apiNotFound(`Booking session ${params.sessionId as string} not found`);
    }

    return apiOk(delivery);
  }),

  // ── POST /api/booking-sessions/:sessionId/confirm ─────────────
  http.post('*/api/v1/booking-sessions/:sessionId/confirm', ({ params }) => {
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'Confirmed',
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/start-journey ──────
  http.post('*/api/v1/booking-sessions/:sessionId/start-journey', ({ params }) => {
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'ProviderOnWay',
      providerDepartedAt: session.providerDepartedAt ?? now,
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/arrive ─────────────
  http.post('*/api/v1/booking-sessions/:sessionId/arrive', ({ params }) => {
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'arrived',
      providerArrivedAt: session.providerArrivedAt ?? now,
      verificationCode:
        session.verificationCode ?? String(Math.floor(100000 + Math.random() * 900000)),
      verificationCodeGeneratedAt: session.verificationCodeGeneratedAt ?? now,
      verificationCodeExpiresAt:
        session.verificationCodeExpiresAt ??
        new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/start-service ──────
  http.post('*/api/v1/booking-sessions/:sessionId/start-service', ({ params }) => {
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'InProgress',
      serviceStartedAt: session.serviceStartedAt ?? now,
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/complete ───────────
  http.post('*/api/v1/booking-sessions/:sessionId/complete', async ({ params, request }) => {
    const body = (await request.json()) as { validationCode?: string };
    const found = getMockBookingSessionDetail(params.sessionId as string);

    if (!found) {
      return apiNotFound(`Booking session ${params.sessionId as string} not found`);
    }

    if (!/^\d{6}$/.test(body.validationCode ?? '')) {
      return apiBadRequest(
        'A 6-digit validation code is required.',
        'BOOKING_SESSION_CODE_REQUIRED',
      );
    }

    if (body.validationCode !== found.verificationCode) {
      let wrongCodeResponse: BookingSessionMutationResponse | null = null;
      wrongCodeResponse = updateMockBookingSession(params.sessionId as string, (session) => ({
        ...session,
        verificationAttempts: session.verificationAttempts + 1,
      }));

      return apiBadRequest('The validation code is incorrect.', 'BOOKING_SESSION_CODE_INVALID', {
        remainingAttempts: wrongCodeResponse?.verificationAttemptsRemaining ?? 0,
      });
    }

    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'Validated',
      serviceCompletedAt: session.serviceCompletedAt ?? now,
      verifiedAt: now,
      verificationMethod: 'provider_entered_patient_code',
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/dispute ────────────
  http.post('*/api/v1/booking-sessions/:sessionId/dispute', async ({ params, request }) => {
    const body = (await request.json()) as { disputeReason?: string | null };
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'Disputed',
      disputedAt: now,
      disputeReason: body.disputeReason ?? 'patient_refused_or_missing_code',
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/no-show ───────────
  http.post('*/api/v1/booking-sessions/:sessionId/no-show', async ({ params, request }) => {
    const body = (await request.json()) as { noShowReason?: string | null };
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session) => ({
      ...session,
      status: 'NoShow',
      noShowAt: now,
      noShowReason: body.noShowReason ?? 'PatientNoShow',
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── POST /api/booking-sessions/:sessionId/cancel ─────────────
  http.post('*/api/v1/booking-sessions/:sessionId/cancel', async ({ params, request }) => {
    const body = (await request.json()) as { cancellationReason?: string | null };
    const now = new Date().toISOString();
    const response = updateMockBookingSession(params.sessionId as string, (session, booking) => ({
      ...session,
      status: 'Cancelled',
      cancelledAt: now,
      cancelledBy: booking.patientId,
      cancellationReason: body.cancellationReason ?? null,
    }));

    return response
      ? apiOk(response)
      : apiNotFound(`Booking session ${params.sessionId as string} not found`);
  }),

  // ── GET /api/providers/me/bookings/today ────────────────────
  http.get('*/api/v1/providers/me/bookings/today', () => {
    const items = getProviderTodayBookingRecords().map(toListItem);

    return apiOk(items);
  }),

  // ── GET /api/bookings (paginated list) ──────────────────────
  http.get('*/api/v1/bookings', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const status = url.searchParams.get('status');
    const patientId = url.searchParams.get('patientId');
    const providerId = url.searchParams.get('providerId');
    const startDateFrom = url.searchParams.get('startDateFrom');
    const startDateTo = url.searchParams.get('startDateTo');

    let items = listMockBookingRecords();
    const now = new Date();

    // Status filtering (supports special values for convenience)
    if (status === 'upcoming') {
      items = items.filter(
        (a) =>
          ['Pending', 'Confirmed'].includes(normalizeBookingStatus(a.status ?? '')) &&
          new Date(a.scheduledAt) > now,
      );
    } else if (status === 'past') {
      items = items.filter(
        (a) =>
          ['Completed', 'Cancelled', 'NoShow'].includes(normalizeBookingStatus(a.status ?? '')) ||
          new Date(a.scheduledAt) <= now,
      );
    } else if (status) {
      const normalizedStatus = normalizeBookingStatus(status);
      items = items.filter((a) => normalizeBookingStatus(a.status ?? '') === normalizedStatus);
    }

    if (patientId && patientId !== 'current-user') {
      items = items.filter((a) => a.patientId === patientId);
    }
    if (providerId && providerId !== 'current-provider') {
      items = items.filter((a) => a.providerId === providerId);
    }
    if (startDateFrom) {
      const from = new Date(startDateFrom);
      items = items.filter((a) => new Date(a.scheduledAt) >= from);
    }
    if (startDateTo) {
      const to = new Date(startDateTo);
      to.setDate(to.getDate() + 1); // inclusive end
      items = items.filter((a) => new Date(a.scheduledAt) < to);
    }

    // Sort by date ascending
    items.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(toListItem);

    return apiOk({
      items: paged,
      pagination: { page, limit, total, totalPages },
    });
  }),

  // ── GET /api/bookings/:id ───────────────────────────────────
  http.get('*/api/v1/bookings/:id', ({ params }) => {
    const { id } = params;
    const found = findMockBookingRecord(id as string);
    if (!found) return apiNotFound(`Booking ${id as string} not found`);
    return apiOk(toBookingResponse(found));
  }),

  // ── POST /api/bookings/quote ───────────────────────────────
  http.post('*/api/v1/bookings/quote', async ({ request }) => {
    const body = (await request.json()) as MockBookingRequestBody;
    const draft = resolveBookingDraft(body);

    if (hasSlotConflictTrigger(body.address?.line1)) {
      return apiConflict(
        'The selected daily start time is not available for the full booking range.',
        SLOT_CONFLICT_CODE,
        {
          startDate: draft.startDate,
          endDate: draft.endDate,
          dailyStartTime: draft.dailyStartTime,
          dailyEndTime: draft.dailyEndTime,
          conflictType: 'range_availability',
        },
      );
    }

    const response: BookingQuoteResponse = {
      bookingType: draft.bookingType,
      startDate: draft.startDate,
      endDate: draft.endDate,
      dayCount: draft.dayCount,
      dailyDurationMinutes: draft.dailyDurationMinutes,
      pricing: draft.pricing,
      cashAvailable: true,
      cashUnavailableReasonCode: null,
      equipmentRental: draft.equipmentRental,
    };

    return apiOk(response);
  }),

  // ── POST /api/bookings (create) ────────────────────────────
  http.post('*/api/v1/bookings', async ({ request }) => {
    const body = (await request.json()) as MockBookingRequestBody;
    const draft = resolveBookingDraft(body);

    const template = generateAppointment(undefined, undefined, {
      status: 'pending',
      id: randomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }) as unknown as {
      id: string;
      type?: string;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
      provider?: {
        id: string;
        name?: string;
        phone?: string;
        rating?: number;
        reviewCount?: number;
      };
      patient?: { id: string; name?: string; phone?: string; avatar?: string | null };
      patientId?: string;
    };

    const bookingNumber = `BKG-${String(listMockBookingRecords().length + 1).padStart(6, '0')}`;
    const providerProfile = getCurrentMockProviderProfile();
    const providerName =
      providerProfile.businessName?.trim() ||
      [providerProfile.firstName, providerProfile.lastName].filter(Boolean).join(' ').trim() ||
      template.provider?.name ||
      'Prestataire mock';
    const providerId = isUuid(body.providerId)
      ? body.providerId
      : (template.provider?.id ?? randomId());
    const paymentMethod = normalizePaymentMethod(body.paymentMethod);
    const expectedTotalAmount =
      typeof body.expectedTotalAmount === 'number' ? roundAmount(body.expectedTotalAmount) : null;

    if (hasSlotConflictTrigger(body.address?.line1)) {
      return apiConflict(
        'The selected daily start time is not available for the full booking range.',
        SLOT_CONFLICT_CODE,
        {
          startDate: draft.startDate,
          endDate: draft.endDate,
          dailyStartTime: draft.dailyStartTime,
          dailyEndTime: draft.dailyEndTime,
          conflictType: 'range_availability',
        },
      );
    }

    if (expectedTotalAmount !== null && expectedTotalAmount !== draft.pricing.totalAmount) {
      return apiConflict(
        `Price mismatch: the expected total ${expectedTotalAmount.toFixed(2)} does not match the current quote ${draft.pricing.totalAmount.toFixed(2)}. Please refresh the quote and try again.`,
        PRICE_MISMATCH_CODE,
        {
          perDaySubtotal: draft.pricing.perDaySubtotal,
          bookingSubtotal: draft.pricing.bookingSubtotal,
          platformFee: draft.pricing.platformFee,
          totalAmount: draft.pricing.totalAmount,
          currency: draft.pricing.currency,
          expectedTotalAmount,
        },
      );
    }

    if (draft.equipmentRental && draft.requestedItems[0]) {
      decrementMockEquipmentStock(draft.requestedItems[0].serviceId);
    }

    const record = {
      ...template,
      id: template.id,
      bookingNumber,
      status: 'Pending',
      paymentMethod,
      ...createMockBookingPaymentState({ bookingNumber, paymentMethod }),
      type: draft.bookingType,
      providerId,
      patientId: template.patientId ?? template.patient?.id ?? randomId(),
      patient: template.patient
        ? {
            id: template.patient.id,
            name: template.patient.name ?? null,
            phone: template.patient.phone ?? null,
            avatar: template.patient.avatar ?? null,
          }
        : null,
      scheduledAt: draft.scheduledAt,
      startDate: draft.startDate,
      endDate: draft.endDate,
      dailyStartTime: draft.dailyStartTime,
      dailyEndTime: draft.dailyEndTime,
      dailyDurationMinutes: draft.dailyDurationMinutes,
      dayCount: draft.dayCount,
      timezone: 'Africa/Tunis',
      perDaySubtotal: draft.pricing.perDaySubtotal,
      platformFee: draft.pricing.platformFee,
      totalAmount: draft.pricing.totalAmount,
      currency: draft.pricing.currency,
      address: body.address ?? null,
      notes: body.patientNotes ?? null,
      typeConfig: body.typeConfig ?? null,
      lineItems: draft.serviceItems,
      equipmentRental: draft.equipmentRental
        ? {
            ...draft.equipmentRental,
            actualReturnDate: null,
          }
        : null,
      validationCode: null,
      providerAmount: draft.equipmentRental
        ? draft.pricing.bookingSubtotal
        : draft.pricing.perDaySubtotal,
      service: draft.primaryService
        ? {
            id: draft.primaryService.serviceId,
            name: draft.primaryService.serviceName ?? null,
            category: draft.primaryService.serviceCategory ?? null,
            price: draft.primaryService.unitPrice,
            duration: draft.dailyDurationMinutes,
          }
        : null,
      serviceName: draft.primaryService?.serviceName ?? null,
      primaryServiceId: draft.primaryService?.serviceId ?? template.id,
      provider: template.provider
        ? {
            ...template.provider,
            id: providerId,
            name: providerName,
            phone: template.provider.phone ?? '+216 71 000 000',
            rating: template.provider.rating ?? providerProfile.rating,
            reviewCount: template.provider.reviewCount ?? providerProfile.totalReviews,
          }
        : {
            id: providerId,
            name: providerName,
            phone: '+216 71 000 000',
            rating: providerProfile.rating,
            reviewCount: providerProfile.totalReviews,
          },
      providerAcceptedAt: null,
      providerDepartedAt: null,
      providerArrivedAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      validatedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      cancellationReason: null,
      statusChangedBy: null,
      statusChangeReason: null,
      providerConfirmedAt: null,
      createdAt: template.createdAt ?? new Date().toISOString(),
      updatedAt: template.updatedAt ?? new Date().toISOString(),
    };

    createMockBookingRecord(record);

    const response: CreateBookingResponse = {
      id: record.id,
      bookingNumber,
      bookingType: draft.bookingType,
      status: record.status ?? null,
      paymentMethod: record.paymentMethod,
      paymentId: record.paymentId,
      paymentStatus: record.paymentStatus,
      paymentMethodType: record.paymentMethodType,
      paymentReferenceNumber: record.paymentReferenceNumber,
      scheduledAt: draft.scheduledAt,
      startDate: draft.startDate,
      endDate: draft.endDate,
      dailyStartTime: draft.dailyStartTime,
      dailyEndTime: draft.dailyEndTime,
      dailyDurationMinutes: draft.dailyDurationMinutes,
      dayCount: draft.dayCount,
      pricing: draft.pricing,
      equipmentRental: draft.equipmentRental,
      validationCode: null,
      provider: record.provider
        ? { id: record.provider.id, name: record.provider.name ?? null }
        : undefined,
      service: draft.primaryService
        ? { id: draft.primaryService.serviceId, name: draft.primaryService.serviceName ?? null }
        : null,
      serviceItems: draft.serviceItems,
    };

    return apiOk(response);
  }),

  // ── PATCH /api/bookings/:id (update) ───────────────────────
  http.patch('*/api/v1/bookings/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const updated = updateMockBookingRecord(id as string, (booking) => ({
      ...booking,
      address:
        body.address && typeof body.address === 'object'
          ? {
              ...booking.address,
              ...(body.address as Record<string, unknown>),
            }
          : booking.address,
      notes:
        typeof body.patientNotes === 'string' || body.patientNotes === null
          ? body.patientNotes
          : booking.notes,
      updatedAt: now,
    }));

    if (!updated) return apiNotFound(`Booking ${id as string} not found`);

    const response: UpdateBookingResponse = {
      id: updated.id,
      address: body.address as UpdateBookingResponse['address'],
      updatedAt: now,
    };

    return apiOk(response);
  }),

  // ── POST /api/bookings/:id/confirm ─────────────────────────
  http.post('*/api/v1/bookings/:id/confirm', ({ params }) => {
    const { id } = params;
    const validationCode = String(Math.floor(1000 + Math.random() * 9000));
    const now = new Date().toISOString();
    const profile = getCurrentMockProviderProfile();
    const updated = updateMockBookingRecord(id as string, (booking) => ({
      ...booking,
      status: 'Confirmed',
      validationCode,
      providerAcceptedAt: now,
      providerConfirmedAt: now,
      statusChangedBy: profile.userId,
      statusChangeReason: 'provider_confirmed',
      updatedAt: now,
    }));

    if (!updated) return apiNotFound(`Booking ${id as string} not found`);

    const response: ConfirmBookingResponse = {
      id: updated.id,
      status: 'Confirmed',
      confirmedAt: now,
    };

    return apiOk(response);
  }),

  // ── POST /api/bookings/:id/decline ──────────────────────────
  http.post('*/api/v1/bookings/:id/decline', async ({ params, request }) => {
    const body = (await request.json()) as { cancellationReason?: string | null };
    const now = new Date().toISOString();
    const profile = getCurrentMockProviderProfile();
    const updated = updateMockBookingRecord(params.id as string, (booking) => ({
      ...booking,
      status: 'Cancelled',
      paymentStatus: 'cancelled',
      cancelledAt: now,
      cancelledBy: profile.userId,
      cancellationReason: body.cancellationReason ?? null,
      statusChangedBy: profile.userId,
      statusChangeReason: body.cancellationReason ?? 'provider_declined',
      updatedAt: now,
    }));

    if (!updated) return apiNotFound(`Booking ${params.id as string} not found`);

    const response: DeclineBookingResponse = {
      id: updated.id,
      status: 'Cancelled',
      cancelledAt: now,
      cancelledBy: profile.userId,
      cancellationReason: body.cancellationReason ?? null,
      statusChangedBy: profile.userId,
      statusChangeReason: body.cancellationReason ?? 'provider_declined',
      refundAmount: null,
      refundStatus: null,
    };

    return apiOk(response);
  }),

  // ── POST /api/bookings/:id/cancel ──────────────────────────
  http.post('*/api/v1/bookings/:id/cancel', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as {
      cancellationReason?: string;
    };
    const now = new Date().toISOString();
    const updated = updateMockBookingRecord(id as string, (booking) => ({
      ...booking,
      status: 'Cancelled',
      paymentStatus: 'cancelled',
      cancellationReason: body.cancellationReason ?? null,
      cancelledAt: now,
      cancelledBy: booking.patientId,
      statusChangedBy: booking.patientId,
      statusChangeReason: body.cancellationReason ?? 'patient_cancelled',
      updatedAt: now,
    }));

    if (!updated) return apiNotFound(`Booking ${id as string} not found`);

    const response: CancelBookingResponse = {
      id: updated.id,
      status: 'Cancelled',
      cancelledAt: now,
      cancelledBy: updated.patientId,
      cancellationReason: body.cancellationReason ?? null,
      statusChangedBy: updated.patientId,
      statusChangeReason: body.cancellationReason ?? 'patient_cancelled',
      refundAmount: null,
      refundStatus: null,
    };

    return apiOk(response);
  }),

  // ── POST /api/booking-sessions/:sessionId/rate ─────────────
  http.post('*/api/v1/booking-sessions/:sessionId/rate', async ({ params, request }) => {
    const sessionId = params.sessionId as string;
    const body = (await request.json()) as {
      rating: number;
      comment?: string;
    };
    const found = findMockBookingSession(sessionId);

    if (!found) {
      return apiNotFound(`Booking session ${sessionId} not found`);
    }

    const normalizedStatus = normalizeBookingStatus(found.session.status ?? '');

    if (normalizedStatus !== 'Validated') {
      return apiBadRequest(
        `Only validated booking sessions can be rated. Current status: '${normalizedStatus || 'Unknown'}'.`,
        'BOOKING_SESSION_NOT_VALIDATED',
      );
    }

    if (typeof found.session.rating === 'number' && found.session.rating > 0) {
      return apiConflict(
        'This booking session has already been rated.',
        'BOOKING_SESSION_ALREADY_RATED',
      );
    }

    const now = new Date().toISOString();
    const updated = updateMockBookingSession(sessionId, (session) => ({
      ...session,
      rating: body.rating,
      review: body.comment ?? null,
    }));

    if (!updated) return apiNotFound(`Booking session ${sessionId} not found`);

    const response: RateBookingResponse = {
      id: randomId(),
      bookingId: found.booking.id,
      bookingSessionId: sessionId,
      rating: body.rating,
      comment: body.comment ?? null,
      createdAt: now,
    };

    return apiOk(response);
  }),
];
