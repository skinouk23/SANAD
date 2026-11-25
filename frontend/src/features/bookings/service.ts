/**
 * Booking Service
 *
 * Pure API client for the bookings domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { api } from '@/api/client';
import type { SilentErrorConfig } from '@/api/client';
import { isPastOrHistoricalBooking, isUpcomingBooking, toBookingStatusApiValue } from './status';

import {
  BookingResponseSchema,
  GetBookingsResponseSchema,
  CreateBookingResponseSchema,
  BookingQuoteResponseSchema,
  UpdateBookingResponseSchema,
  ConfirmBookingResponseSchema,
  DeclineBookingResponseSchema,
  CancelBookingResponseSchema,
  RateBookingResponseSchema,
  GetBookingSessionsResponseSchema,
  BookingSessionListItemResponseSchema,
  BookingSessionDetailResponseSchema,
  ProviderSessionDeliveryResponseSchema,
  ConfirmBookingSessionResponseSchema,
  StartBookingSessionJourneyResponseSchema,
  ArriveBookingSessionResponseSchema,
  StartBookingSessionServiceResponseSchema,
  CompleteBookingSessionResponseSchema,
  DisputeBookingSessionResponseSchema,
  CancelBookingSessionResponseSchema,
  MarkBookingSessionNoShowResponseSchema,
} from './schema';
import { PatientStatsResponseSchema } from '@/features/family-circle/schema';
import type { PatientStatsResponse } from '@/features/family-circle/schema';

import type {
  BookingListItemResponse,
  BookingResponse,
  GetBookingsResponse,
  CreateBookingRequest,
  BookingQuoteRequest,
  BookingQuoteResponse,
  CreateBookingResponse,
  UpdateBookingRequest,
  UpdateBookingResponse,
  ConfirmBookingResponse,
  DeclineBookingResponse,
  CancelBookingResponse,
  RateBookingRequest,
  RateBookingResponse,
  BookingSessionListItemResponse,
  BookingSessionDetailResponse,
  GetBookingSessionsResponse,
  ProviderSessionDeliveryResponse,
  ConfirmBookingSessionResponse,
  CompleteBookingSessionRequest,
  StartBookingSessionJourneyResponse,
  ArriveBookingSessionResponse,
  StartBookingSessionServiceResponse,
  CompleteBookingSessionResponse,
  DisputeBookingSessionRequest,
  DisputeBookingSessionResponse,
  CancelBookingSessionRequest,
  CancelBookingSessionResponse,
  MarkBookingSessionNoShowRequest,
  MarkBookingSessionNoShowResponse,
} from './schema';

// ============================================
// FILTER TYPES
// ============================================

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDateFrom?: string;
  startDateTo?: string;
  patientId?: string;
  providerId?: string;
  serviceId?: string;
  serviceCategory?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface BookingSessionFilters {
  page?: number;
  limit?: number;
  status?: string;
  bookingId?: string;
  patientId?: string;
  providerId?: string;
  scheduledDateFrom?: string;
  scheduledDateTo?: string;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

const DEFAULT_PAGE_LIMIT = 100;

// ============================================
// STATS TYPE (canonical definition lives in family-circle/schema)
// ============================================

export type { PatientStatsResponse } from '@/features/family-circle/schema';

// ============================================
// BOOKING QUERIES
// ============================================

function formatDateParam(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeBookingSessionFilters(
  filters?: BookingSessionFilters,
): BookingSessionFilters | undefined {
  if (!filters) {
    return undefined;
  }

  if (!filters.status) {
    return filters;
  }

  const normalizedStatus = toBookingStatusApiValue(filters.status);

  return {
    ...filters,
    ...(normalizedStatus ? { status: normalizedStatus } : {}),
  };
}

async function getLimitedBookingItems(
  filters?: BookingFilters,
): Promise<BookingListItemResponse[]> {
  const page = await getBookingsPaginated({
    limit: DEFAULT_PAGE_LIMIT,
    page: 1,
    ...filters,
  });

  return page.items ?? [];
}

async function getLimitedBookingSessionItems(
  filters?: BookingSessionFilters,
): Promise<BookingSessionListItemResponse[]> {
  const page = await getBookingSessionsPaginated(
    {
      limit: DEFAULT_PAGE_LIMIT,
      page: 1,
      ...filters,
    },
    { _silentError: true },
  );

  return page.items ?? [];
}

/** Fetch a flat list of bookings (unwraps paginated items). */
export async function getBookings(filters?: BookingFilters): Promise<BookingListItemResponse[]> {
  const raw = await api.get<GetBookingsResponse>('/bookings', {
    params: filters,
  });
  const parsed = GetBookingsResponseSchema.parse(raw);
  return parsed.items ?? [];
}

/** Fetch a paginated bookings response. */
export async function getBookingsPaginated(filters?: BookingFilters): Promise<GetBookingsResponse> {
  const raw = await api.get<GetBookingsResponse>('/bookings', {
    params: filters,
  });
  return GetBookingsResponseSchema.parse(raw);
}

/** Fetch a single booking by ID. */
export async function getBookingById(
  id: string,
  config?: SilentErrorConfig,
): Promise<BookingResponse> {
  const raw = await api.get<BookingResponse>(`/bookings/${id}`, config);
  return BookingResponseSchema.parse(raw);
}

/** Fetch upcoming bookings for the authenticated user. */
export async function getUpcomingBookings(): Promise<BookingListItemResponse[]> {
  const baseFilters: BookingFilters = {
    startDateFrom: formatDateParam(new Date()),
    sortBy: 'startDate',
    sortDesc: false,
  };

  return (await getLimitedBookingItems(baseFilters)).filter((booking) =>
    isUpcomingBooking(booking),
  );
}

/** Fetch upcoming booking sessions for the authenticated patient. */
export async function getUpcomingBookingSessions(): Promise<BookingSessionListItemResponse[]> {
  const sessions = await getLimitedBookingSessionItems({
    scheduledDateFrom: formatDateParam(new Date()),
    sortBy: 'scheduledDate',
    sortDesc: false,
  });

  return sessions
    .filter((session) => {
      const scheduledAt = buildSessionScheduledAt(session);
      return isUpcomingBooking({ status: session.status, scheduledAt });
    })
    .sort(
      (left, right) =>
        new Date(buildSessionScheduledAt(left)).getTime() -
        new Date(buildSessionScheduledAt(right)).getTime(),
    );
}

/** Fetch today's bookings for the authenticated provider. */
export async function getTodayBookings(): Promise<BookingListItemResponse[]> {
  const dateStr = formatDateParam(new Date());

  return getBookings({
    startDateFrom: dateStr,
    startDateTo: dateStr,
  });
}

/** Fetch provider-dashboard today's bookings via the dedicated backend endpoint. */
export async function getProviderDashboardTodayBookings(): Promise<BookingListItemResponse[]> {
  const sessions = await getBookingSessions(
    {
      scheduledDateFrom: formatDateParam(new Date()),
      scheduledDateTo: formatDateParam(new Date()),
      sortBy: 'scheduledStartTime',
      sortDesc: false,
    },
    { _silentError: true },
  );

  return sessions.map(toBookingListItemFromSession);
}

function toBookingListItemFromSession(
  session: BookingSessionListItemResponse,
): BookingListItemResponse {
  const scheduledAt = buildSessionScheduledAt(session);
  const scheduledStartTime = normalizeSessionTime(session.scheduledStartTime);
  const scheduledEndTime = session.scheduledEndTime
    ? normalizeSessionTime(session.scheduledEndTime)
    : null;
  const dailyDurationMinutes = scheduledEndTime
    ? Math.max(0, timeToMinutes(scheduledEndTime) - timeToMinutes(scheduledStartTime))
    : null;

  return {
    id: session.bookingId,
    bookingId: session.bookingId,
    sessionId: session.id,
    bookingNumber: session.bookingNumber ?? undefined,
    status: session.status ?? session.bookingStatus ?? session.parentStatus ?? null,
    paymentMethod: session.paymentMethod ?? 'cash',
    paymentId: session.paymentId ?? null,
    paymentStatus: session.paymentStatus ?? null,
    paymentMethodType: session.paymentMethodType ?? session.paymentMethod ?? null,
    paymentReferenceNumber: session.paymentReferenceNumber ?? null,
    type: session.type ?? null,
    scheduledAt,
    startDate: session.scheduledDate,
    endDate: session.scheduledDate,
    dailyStartTime: scheduledStartTime,
    dailyEndTime: scheduledEndTime,
    dailyDurationMinutes,
    dayCount: 1,
    perDaySubtotal: session.totalAmount ?? 0,
    platformFee: 0,
    totalAmount: session.totalAmount ?? 0,
    currency: session.currency ?? 'TND',
    address: session.address ?? session.location?.address ?? null,
    service: {
      name: session.service?.name ?? session.serviceName ?? null,
      category: session.service?.category ?? session.serviceCategory ?? null,
    },
    lineItems: undefined,
    equipmentRental: null,
    provider: session.provider
      ? {
          id: session.provider.id,
          name: session.provider.name ?? null,
          phone: session.provider.phone ?? null,
          rating: 0,
        }
      : session.providerId || session.providerName || session.providerPhone
        ? {
            id: session.providerId ?? session.bookingId,
            name: session.providerName ?? null,
            phone: session.providerPhone ?? null,
            rating: 0,
          }
        : undefined,
    notes: session.notes ?? null,
    validationCode: null,
    autoValidateAt: null,
    rating: session.rating ?? null,
    reviewComment: session.reviewComment ?? null,
    patient: session.patient
      ? {
          id: session.patient.id,
          name: session.patient.name ?? null,
          phone: session.patient.phone ?? null,
        }
      : session.patientId || session.patientName || session.patientPhone
        ? {
            id: session.patientId ?? session.bookingId,
            name: session.patientName ?? null,
            phone: session.patientPhone ?? null,
          }
        : undefined,
    providerAmount: null,
    providerLocation: session.providerLocation ?? session.provider?.location ?? null,
    providerLatitude:
      session.providerLatitude ??
      session.providerLocation?.lat ??
      session.provider?.location?.lat ??
      null,
    providerLongitude:
      session.providerLongitude ??
      session.providerLocation?.lng ??
      session.provider?.location?.lng ??
      null,
    providerAddress:
      session.providerAddress ??
      session.providerLocation?.address ??
      session.provider?.location?.address ??
      null,
    activeSessionId: session.id,
    nextSessionId: session.id,
    totalSessions: session.totalSessions ?? session.counts?.totalSessions ?? null,
    confirmedSessions: session.counts?.confirmedSessions ?? null,
    inProgressSessions: session.counts?.inProgressSessions ?? null,
    validatedSessions: session.counts?.validatedSessions ?? null,
    cancelledSessions: session.counts?.cancelledSessions ?? null,
    disputedSessions: session.counts?.disputedSessions ?? null,
    noShowSessions: session.counts?.noShowSessions ?? null,
    remainingSessions: session.counts?.remainingSessions ?? null,
    sessionCounts: session.counts ?? null,
    providerAcceptedAt: null,
    providerDepartedAt: session.providerDepartedAt ?? null,
    providerArrivedAt: session.providerArrivedAt ?? null,
    serviceStartedAt: session.serviceStartedAt ?? null,
    serviceCompletedAt: session.serviceCompletedAt ?? null,
    validatedAt: session.verifiedAt ?? null,
    cancelledAt: session.cancelledAt ?? null,
    cancelledBy: session.cancelledBy ?? null,
    cancellationReason: session.cancellationReason ?? null,
    noShowAt: session.noShowAt ?? null,
    noShowReason: session.noShowReason ?? null,
    statusChangedBy: null,
    statusChangeReason: null,
  };
}

function normalizeSessionTime(value: BookingSessionListItemResponse['scheduledStartTime']): string {
  if (typeof value === 'string') {
    const timePart = value.includes('.') ? (value.split('.').at(-1) ?? value) : value;
    return timePart.length === 5 ? `${timePart}:00` : timePart;
  }

  if ('hour' in value) {
    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`;
  }

  return `${String(value.hours ?? 0).padStart(2, '0')}:${String(value.minutes ?? 0).padStart(2, '0')}:${String(value.seconds ?? 0).padStart(2, '0')}`;
}

function timeToMinutes(value: string): number {
  const [hours = 0, minutes = 0] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildSessionScheduledAt(session: BookingSessionListItemResponse): string {
  const date =
    typeof session.scheduledDate === 'string'
      ? session.scheduledDate
      : `${session.scheduledDate.year}-${String(session.scheduledDate.month).padStart(2, '0')}-${String(session.scheduledDate.day).padStart(2, '0')}`;

  return `${date}T${normalizeSessionTime(session.scheduledStartTime)}`;
}

/** Fetch past bookings for the authenticated user. */
export async function getPastBookings(): Promise<BookingListItemResponse[]> {
  const bookings = await getLimitedBookingItems({
    sortBy: 'startDate',
    sortDesc: true,
  });

  return bookings
    .filter((booking) => isPastOrHistoricalBooking(booking))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
}

/** Fetch historical booking sessions for the authenticated patient. */
export async function getPastBookingSessions(): Promise<BookingSessionListItemResponse[]> {
  const sessions = await getLimitedBookingSessionItems({
    sortBy: 'scheduledDate',
    sortDesc: true,
  });

  return sessions
    .filter((session) => {
      const scheduledAt = buildSessionScheduledAt(session);
      return isPastOrHistoricalBooking({ status: session.status, scheduledAt });
    })
    .sort(
      (left, right) =>
        new Date(buildSessionScheduledAt(right)).getTime() -
        new Date(buildSessionScheduledAt(left)).getTime(),
    );
}

/** Fetch booking statistics for a user. */
/** Fetch patient stats from the backend (replaces non-existent /bookings/stats). */
export async function getPatientStats(): Promise<PatientStatsResponse> {
  const raw = await api.get<PatientStatsResponse>('/patients/me/stats');
  return PatientStatsResponseSchema.parse(raw);
}

/** Fetch a backend-authoritative booking quote. */
export async function getBookingQuote(data: BookingQuoteRequest): Promise<BookingQuoteResponse> {
  const raw = await api.post<BookingQuoteResponse>('/bookings/quote', data);
  return BookingQuoteResponseSchema.parse(raw);
}

// ============================================
// BOOKING MUTATIONS
// ============================================

interface CreateBookingConfig {
  silentError?: boolean;
}

/** Create a new booking. */
export async function createBooking(
  data: CreateBookingRequest,
  config?: CreateBookingConfig,
): Promise<CreateBookingResponse> {
  const requestConfig: SilentErrorConfig = {
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    _silentError: config?.silentError ?? false,
  };

  const raw = await api.post<CreateBookingResponse>('/bookings', data, requestConfig);
  return CreateBookingResponseSchema.parse(raw);
}

/** Update an existing booking. */
export async function updateBooking(
  id: string,
  data: UpdateBookingRequest,
): Promise<UpdateBookingResponse> {
  const raw = await api.patch<UpdateBookingResponse>(`/bookings/${id}`, data);
  return UpdateBookingResponseSchema.parse(raw);
}

/**
 * Confirm a booking (provider action).
 */
export async function confirmBooking(id: string): Promise<ConfirmBookingResponse> {
  const raw = await api.post<ConfirmBookingResponse>(`/bookings/${id}/confirm`);
  return ConfirmBookingResponseSchema.parse(raw);
}

/** Decline a booking as the assigned provider. */
export async function declineBooking(
  id: string,
  cancellationReason?: string,
): Promise<DeclineBookingResponse> {
  const raw = await api.post<DeclineBookingResponse>(`/bookings/${id}/decline`, {
    cancellationReason,
  });
  return DeclineBookingResponseSchema.parse(raw);
}

/** Cancel a booking with an optional reason. */
export async function cancelBooking(id: string, reason?: string): Promise<CancelBookingResponse> {
  const raw = await api.post<CancelBookingResponse>(`/bookings/${id}/cancel`, {
    cancellationReason: reason,
  });
  return CancelBookingResponseSchema.parse(raw);
}

/** Rate a validated booking session. */
export async function rateBookingSession(
  sessionId: string,
  data: RateBookingRequest,
): Promise<RateBookingResponse> {
  const raw = await api.post<RateBookingResponse>(`/booking-sessions/${sessionId}/rate`, data);
  return RateBookingResponseSchema.parse(raw);
}

// ============================================
// BOOKING SESSION QUERIES
// ============================================

/** Fetch a flat list of booking sessions. */
export async function getBookingSessions(
  filters?: BookingSessionFilters,
  config?: SilentErrorConfig,
): Promise<BookingSessionListItemResponse[]> {
  const params = normalizeBookingSessionFilters(filters);
  const requestConfig: SilentErrorConfig = {
    ...config,
    params,
  };
  const raw = await api.get<GetBookingSessionsResponse | BookingSessionListItemResponse[]>(
    '/booking-sessions',
    requestConfig,
  );

  if (Array.isArray(raw)) {
    return BookingSessionListItemResponseSchema.array().parse(raw);
  }

  const parsed = GetBookingSessionsResponseSchema.parse(raw);
  return parsed.items ?? [];
}

/** Fetch a paginated booking-session response. */
export async function getBookingSessionsPaginated(
  filters?: BookingSessionFilters,
  config?: SilentErrorConfig,
): Promise<GetBookingSessionsResponse> {
  const params = normalizeBookingSessionFilters(filters);
  const requestConfig: SilentErrorConfig = {
    ...config,
    params,
  };
  const raw = await api.get<GetBookingSessionsResponse | BookingSessionListItemResponse[]>(
    '/booking-sessions',
    requestConfig,
  );

  if (Array.isArray(raw)) {
    const items = BookingSessionListItemResponseSchema.array().parse(raw);
    return {
      items,
      pagination: {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? items.length,
        total: items.length,
        totalPages: 1,
      },
    };
  }

  return GetBookingSessionsResponseSchema.parse(raw);
}

/** Fetch one booking session by ID. */
export async function getBookingSessionById(
  id: string,
  config?: SilentErrorConfig,
): Promise<BookingSessionDetailResponse> {
  const raw = await api.get<BookingSessionDetailResponse>(`/booking-sessions/${id}`, config);
  return BookingSessionDetailResponseSchema.parse(raw);
}

/** Fetch the provider-facing delivery aggregate for a booking session. */
export async function getProviderSessionDelivery(
  sessionId: string,
  config?: SilentErrorConfig,
): Promise<ProviderSessionDeliveryResponse> {
  const raw = await api.get<ProviderSessionDeliveryResponse>(
    `/booking-sessions/${sessionId}/delivery`,
    config,
  );
  return ProviderSessionDeliveryResponseSchema.parse(raw);
}

// ============================================
// BOOKING SESSION MUTATIONS
// ============================================

/** Confirm a single booking session as the assigned provider. */
export async function confirmBookingSession(
  sessionId: string,
): Promise<ConfirmBookingSessionResponse> {
  const raw = await api.post<ConfirmBookingSessionResponse>(
    `/booking-sessions/${sessionId}/confirm`,
  );
  return ConfirmBookingSessionResponseSchema.parse(raw);
}

/** Start provider journey for a booking session. */
export async function startBookingSessionJourney(
  sessionId: string,
): Promise<StartBookingSessionJourneyResponse> {
  const raw = await api.post<StartBookingSessionJourneyResponse>(
    `/booking-sessions/${sessionId}/start-journey`,
  );
  return StartBookingSessionJourneyResponseSchema.parse(raw);
}

/** Mark provider arrival for a booking session. */
export async function arriveBookingSession(
  sessionId: string,
): Promise<ArriveBookingSessionResponse> {
  const raw = await api.post<ArriveBookingSessionResponse>(`/booking-sessions/${sessionId}/arrive`);
  return ArriveBookingSessionResponseSchema.parse(raw);
}

/** Start service for a booking session. */
export async function startBookingSessionService(
  sessionId: string,
): Promise<StartBookingSessionServiceResponse> {
  const raw = await api.post<StartBookingSessionServiceResponse>(
    `/booking-sessions/${sessionId}/start-service`,
  );
  return StartBookingSessionServiceResponseSchema.parse(raw);
}

/** Complete a booking session by submitting the patient-provided code. */
export async function completeBookingSession(
  sessionId: string,
  data: CompleteBookingSessionRequest,
): Promise<CompleteBookingSessionResponse> {
  const raw = await api.post<CompleteBookingSessionResponse>(
    `/booking-sessions/${sessionId}/complete`,
    data,
  );
  return CompleteBookingSessionResponseSchema.parse(raw);
}

/** Open a dispute for a booking session. */
export async function disputeBookingSession(
  sessionId: string,
  data: DisputeBookingSessionRequest,
): Promise<DisputeBookingSessionResponse> {
  const raw = await api.post<DisputeBookingSessionResponse>(
    `/booking-sessions/${sessionId}/dispute`,
    data,
  );
  return DisputeBookingSessionResponseSchema.parse(raw);
}

/** Cancel one booking session without cancelling the parent booking. */
export async function cancelBookingSession(
  sessionId: string,
  data?: CancelBookingSessionRequest,
): Promise<CancelBookingSessionResponse> {
  const raw = await api.post<CancelBookingSessionResponse>(
    `/booking-sessions/${sessionId}/cancel`,
    data ?? {},
  );
  return CancelBookingSessionResponseSchema.parse(raw);
}

/** Mark a booking session as patient no-show. */
export async function markBookingSessionNoShow(
  sessionId: string,
  data?: MarkBookingSessionNoShowRequest,
): Promise<MarkBookingSessionNoShowResponse> {
  const raw = await api.post<MarkBookingSessionNoShowResponse>(
    `/booking-sessions/${sessionId}/no-show`,
    data ?? {},
  );
  return MarkBookingSessionNoShowResponseSchema.parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const bookingService = {
  getBookings,
  getBookingsPaginated,
  getBookingById,
  getUpcomingBookings,
  getUpcomingBookingSessions,
  getTodayBookings,
  getProviderDashboardTodayBookings,
  getPastBookings,
  getPastBookingSessions,
  getPatientStats,
  getBookingQuote,
  createBooking,
  updateBooking,
  confirmBooking,
  declineBooking,
  cancelBooking,
  rateBookingSession,
  getBookingSessions,
  getBookingSessionsPaginated,
  getBookingSessionById,
  getProviderSessionDelivery,
  confirmBookingSession,
  startBookingSessionJourney,
  arriveBookingSession,
  startBookingSessionService,
  completeBookingSession,
  disputeBookingSession,
  cancelBookingSession,
  markBookingSessionNoShow,
};
