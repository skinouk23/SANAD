import {
  getCurrentMockProviderProfile,
  getCurrentMockProviderServiceSummaries,
} from '@/mocks/handlers/providerAuthoringStore';
import { randomId } from '@/mocks/utils';

import type {
  ProviderPlanningBookingResponse,
  ProviderPlanningResponse,
  ProviderScheduleInterval,
  ProviderUnavailabilityResponse,
  UpsertProviderScheduleInterval,
} from '@/features/providers/schema';

import type { BookingPaymentMethod } from '@/features/bookings/schema';
import { normalizeBookingStatus } from '@/features/bookings/status';
import type {
  BookingSessionDetailResponse,
  BookingSessionListItemResponse,
  BookingSessionMutationResponse,
  ProviderSessionDeliveryResponse,
} from '@/features/bookings/schema';

export interface MockBookingRecord {
  id: string;
  bookingNumber: string | null;
  patientId: string;
  providerId: string;
  primaryServiceId: string;
  status: string | null;
  paymentMethod: BookingPaymentMethod;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentMethodType: string | null;
  paymentReferenceNumber: string | null;
  type: string | null;
  scheduledAt: string;
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string | null;
  dailyDurationMinutes: number | null;
  dayCount: number;
  timezone: string | null;
  patient: {
    id: string;
    name: string | null;
    phone: string | null;
    avatar?: string | null;
  } | null;
  provider: {
    id: string;
    name: string | null;
    phone: string | null;
    rating: number | null;
    reviewCount?: number;
    avatar?: string | null;
  } | null;
  service: {
    id: string;
    name: string | null;
    category: string | null;
    price?: number | null;
    duration?: number | null;
  } | null;
  serviceName: string | null;
  perDaySubtotal: number;
  platformFee: number;
  totalAmount: number;
  currency: string | null;
  address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    instructions?: string | null;
  } | null;
  notes: string | null;
  lineItems: Array<{
    id: string;
    serviceId: string;
    serviceName: string | null;
    serviceCategory: string | null;
    currency: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }> | null;
  equipmentRental: {
    endDate: string | null;
    actualReturnDate?: string | null;
    rentalDurationType: string | null;
    periodCount: number | null;
    periodRate: number | null;
    depositAmount: number | null;
    depositStatus: string | null;
  } | null;
  validationCode: string | null;
  providerAmount: number | null;
  providerAcceptedAt: string | null;
  providerDepartedAt: string | null;
  providerArrivedAt: string | null;
  serviceStartedAt: string | null;
  serviceCompletedAt: string | null;
  validatedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  statusChangedBy: string | null;
  statusChangeReason: string | null;
  providerConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  rating?: number | null;
  review?: string | null;
}

export interface MockBookingSessionRecord {
  id: string;
  bookingId: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string | null;
  status: string | null;
  providerDepartedAt: string | null;
  providerArrivedAt: string | null;
  serviceStartedAt: string | null;
  serviceCompletedAt: string | null;
  verificationCode: string | null;
  verificationCodeGeneratedAt: string | null;
  verificationCodeExpiresAt: string | null;
  verificationAttempts: number;
  verifiedAt: string | null;
  verificationMethod: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  noShowAt: string | null;
  noShowReason: string | null;
  disputedAt: string | null;
  disputeReason: string | null;
  sessionIndex: number;
  rating: number | null;
  review: string | null;
}

interface ProviderPlanningState {
  schedules: ProviderScheduleInterval[];
  unavailabilities: ProviderUnavailabilityResponse[];
  bookings: MockBookingRecord[];
  sessions: MockBookingSessionRecord[];
}

interface MockBookingPaymentStateInput {
  bookingNumber: string | null;
  paymentId?: string | null;
  paymentMethod: BookingPaymentMethod;
  paymentMethodType?: string | null;
  paymentReferenceNumber?: string | null;
  paymentStatus?: string | null;
}

function toApiStatus(status?: string | null): string | null {
  return status ? normalizeBookingStatus(status) : null;
}

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeTextSegment(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function formatBookingAddress(address: MockBookingRecord['address']): string | null {
  if (!address) {
    return null;
  }

  const street = [normalizeTextSegment(address.line1), normalizeTextSegment(address.line2)]
    .filter((segment): segment is string => segment !== null)
    .join(', ');
  const locality = [normalizeTextSegment(address.city), normalizeTextSegment(address.postalCode)]
    .filter((segment): segment is string => segment !== null)
    .join(' ');
  const formattedAddress = [street, locality].filter(Boolean).join(', ');

  return formattedAddress.length > 0 ? formattedAddress : null;
}

function toProviderPlanningBookingResponse(
  booking: MockBookingRecord,
): ProviderPlanningBookingResponse {
  const sessions = listMockBookingSessionsForBooking(booking.id);
  const sessionCounts = getSessionCounts(sessions);
  const activeSession = pickActiveSession(sessions);

  return {
    id: activeSession?.id ?? booking.id,
    bookingId: booking.id,
    sessionId: activeSession?.id ?? booking.id,
    sessionStatus: toApiStatus(activeSession?.status),
    bookingNumber: booking.bookingNumber,
    status: toApiStatus(booking.status),
    paymentId: booking.paymentId,
    paymentStatus: booking.paymentStatus,
    paymentMethodType: booking.paymentMethodType,
    paymentReferenceNumber: booking.paymentReferenceNumber,
    type: booking.type,
    scheduledAt: booking.scheduledAt,
    startDate: booking.startDate,
    endDate: booking.endDate,
    dailyStartTime: booking.dailyStartTime,
    dailyEndTime: booking.dailyEndTime,
    dailyDurationMinutes: booking.dailyDurationMinutes,
    dayCount: booking.dayCount,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    address: formatBookingAddress(booking.address),
    notes: booking.notes,
    service: booking.service
      ? {
          name: booking.service.name ?? null,
          category: booking.service.category ?? null,
        }
      : null,
    patient: booking.patient
      ? {
          id: booking.patient.id,
          name: booking.patient.name ?? null,
          phone: booking.patient.phone ?? null,
        }
      : null,
    providerAmount: booking.providerAmount,
    providerAcceptedAt: booking.providerAcceptedAt,
    providerDepartedAt: booking.providerDepartedAt,
    providerArrivedAt: booking.providerArrivedAt,
    serviceStartedAt: booking.serviceStartedAt,
    serviceCompletedAt: booking.serviceCompletedAt,
    validatedAt: booking.validatedAt,
    cancelledAt: booking.cancelledAt,
    cancelledBy: booking.cancelledBy,
    cancellationReason: booking.cancellationReason,
    noShowAt: activeSession?.noShowAt ?? null,
    noShowReason: activeSession?.noShowReason ?? null,
    statusChangedBy: booking.statusChangedBy,
    statusChangeReason: booking.statusChangeReason,
    ...sessionCounts,
    sessionCounts,
    sessions: sessions.map((session) => toBookingSessionListItem(session, booking)),
  };
}

function getProviderPlanningStateKey(): string {
  const profile = getCurrentMockProviderProfile();
  return `${profile.id}:${profile.userId}`;
}

function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeTimeOnly(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function buildScheduledAt(dateOnly: string, timeOnly: string): string {
  return new Date(`${dateOnly}T${normalizeTimeOnly(timeOnly)}`).toISOString();
}

function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hours = 0, minutes = 0, seconds = 0] = normalizeTimeOnly(time).split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function computePlatformFee(amount: number): number {
  return Math.round(amount * 0.15 * 100) / 100;
}

export function getDefaultMockBookingPaymentStatus(paymentMethod: BookingPaymentMethod): string {
  return paymentMethod === 'cash' ? 'reserved' : 'processing';
}

function getMockBookingPaymentReferencePrefix(paymentMethod: BookingPaymentMethod): string {
  switch (paymentMethod) {
    case 'card':
      return 'CRD';
    case 'd17':
      return 'D17';
    case 'cash':
      return 'CSH';
    default:
      return 'PMT';
  }
}

function buildMockBookingPaymentReferenceNumber(
  bookingNumber: string | null,
  paymentMethod: BookingPaymentMethod,
): string {
  const normalizedBookingNumber = bookingNumber?.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const referenceSuffix =
    normalizedBookingNumber?.slice(-6) ?? randomId().replace(/-/g, '').slice(0, 6).toUpperCase();

  return `${getMockBookingPaymentReferencePrefix(paymentMethod)}-${referenceSuffix}`;
}

export function createMockBookingPaymentState(
  input: MockBookingPaymentStateInput,
): Pick<
  MockBookingRecord,
  'paymentId' | 'paymentStatus' | 'paymentMethodType' | 'paymentReferenceNumber'
> {
  return {
    paymentId: input.paymentId ?? randomId(),
    paymentStatus: input.paymentStatus ?? getDefaultMockBookingPaymentStatus(input.paymentMethod),
    paymentMethodType: input.paymentMethodType ?? input.paymentMethod,
    paymentReferenceNumber:
      input.paymentReferenceNumber ??
      buildMockBookingPaymentReferenceNumber(input.bookingNumber, input.paymentMethod),
  };
}

function overlapsDateRange(startDate: string, endDate: string, from: string, to: string): boolean {
  return startDate <= to && endDate >= from;
}

function overlapsDateTimeRange(
  startDatetime: string,
  endDatetime: string,
  from: string,
  to: string,
): boolean {
  const fromDateTime = new Date(`${from}T00:00:00`).getTime();
  const toDateTime = new Date(`${to}T23:59:59.999`).getTime();
  const start = new Date(startDatetime).getTime();
  const end = new Date(endDatetime).getTime();

  return start <= toDateTime && end >= fromDateTime;
}

function toAvailabilityStatus(isOnline: boolean): string {
  return isOnline ? 'online' : 'offline';
}

function createSeedSchedules(): ProviderScheduleInterval[] {
  return [
    { id: randomId(), dayOfWeek: 1, serviceId: null, startTime: '08:00:00', endTime: '12:00:00' },
    { id: randomId(), dayOfWeek: 1, serviceId: null, startTime: '14:00:00', endTime: '18:00:00' },
    { id: randomId(), dayOfWeek: 2, serviceId: null, startTime: '08:00:00', endTime: '12:00:00' },
    { id: randomId(), dayOfWeek: 2, serviceId: null, startTime: '14:00:00', endTime: '18:00:00' },
    { id: randomId(), dayOfWeek: 3, serviceId: null, startTime: '08:00:00', endTime: '12:00:00' },
    { id: randomId(), dayOfWeek: 3, serviceId: null, startTime: '14:00:00', endTime: '18:00:00' },
    { id: randomId(), dayOfWeek: 4, serviceId: null, startTime: '08:00:00', endTime: '12:00:00' },
    { id: randomId(), dayOfWeek: 4, serviceId: null, startTime: '14:00:00', endTime: '18:00:00' },
    { id: randomId(), dayOfWeek: 5, serviceId: null, startTime: '08:00:00', endTime: '13:00:00' },
  ];
}

function createPatient(index: number, name: string, phone: string): MockBookingRecord['patient'] {
  return {
    id: `00000000-0000-0000-0000-${String(index).padStart(12, '0')}`,
    name,
    phone,
    avatar: null,
  };
}

function createSeedBookingRecords(): MockBookingRecord[] {
  const profile = getCurrentMockProviderProfile();
  const services = getCurrentMockProviderServiceSummaries();
  const primaryService = services[0];
  const secondaryService = services[1] ?? primaryService;
  const providerName =
    profile.businessName?.trim() ||
    [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
    'Prestataire mock';
  const providerPhone = '+216 71 000 000';
  const provider = {
    id: profile.id,
    name: providerName,
    phone: providerPhone,
    rating: profile.rating,
    reviewCount: profile.totalReviews,
    avatar: profile.profilePictureUrl ?? null,
  };
  const today = new Date();
  const todayDate = formatDateOnly(today);
  const tomorrowDate = formatDateOnly(addDays(today, 1));
  const yesterdayDate = formatDateOnly(addDays(today, -1));
  const twoDaysAgoDate = formatDateOnly(addDays(today, -2));
  const nextWeekDate = formatDateOnly(addDays(today, 6));

  const bookings: MockBookingRecord[] = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      bookingNumber: 'BKG-000101',
      patientId: '00000000-0000-0000-0000-000000000101',
      providerId: profile.id,
      primaryServiceId: primaryService?.id ?? randomId(),
      status: 'Pending',
      paymentMethod: 'cash',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000101',
        paymentMethod: 'cash',
        paymentStatus: 'reserved',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(tomorrowDate, '09:00:00'),
      startDate: tomorrowDate,
      endDate: tomorrowDate,
      dailyStartTime: '09:00:00',
      dailyEndTime: '10:00:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(101, 'Amina Trabelsi', '+216 20 111 222'),
      provider,
      service: {
        id: primaryService?.id ?? randomId(),
        name: primaryService?.name ?? 'Soin a domicile',
        category: primaryService?.category ?? profile.serviceType ?? 'nursing',
        price: 65,
        duration: 60,
      },
      serviceName: primaryService?.name ?? 'Soin a domicile',
      perDaySubtotal: 65,
      platformFee: computePlatformFee(65),
      totalAmount: 74.75,
      currency: 'TND',
      address: {
        line1: '22 Rue de Marseille',
        city: 'Tunis',
        postalCode: '1000',
        latitude: 36.8008,
        longitude: 10.1801,
        instructions: 'Interphone B, 2eme etage',
      },
      notes: 'Verifier la tension avant le soin.',
      lineItems: [
        {
          id: randomId(),
          serviceId: primaryService?.id ?? randomId(),
          serviceName: primaryService?.name ?? 'Soin a domicile',
          serviceCategory: primaryService?.category ?? profile.serviceType ?? 'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 65,
          subtotal: 65,
        },
      ],
      equipmentRental: null,
      validationCode: null,
      providerAmount: 65,
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
      createdAt: new Date(`${tomorrowDate}T07:00:00`).toISOString(),
      updatedAt: new Date(`${tomorrowDate}T07:00:00`).toISOString(),
      rating: null,
      review: null,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      bookingNumber: 'BKG-000102',
      patientId: '00000000-0000-0000-0000-000000000102',
      providerId: profile.id,
      primaryServiceId: primaryService?.id ?? randomId(),
      status: 'Confirmed',
      paymentMethod: 'card',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000102',
        paymentMethod: 'card',
        paymentStatus: 'settled',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(todayDate, '10:00:00'),
      startDate: todayDate,
      endDate: todayDate,
      dailyStartTime: '10:00:00',
      dailyEndTime: '11:00:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(102, 'Mohamed Ali', '+216 99 887 766'),
      provider,
      service: {
        id: primaryService?.id ?? randomId(),
        name: primaryService?.name ?? 'Home visit',
        category: primaryService?.category ?? profile.serviceType ?? 'nursing',
        price: 60,
        duration: 60,
      },
      serviceName: primaryService?.name ?? 'Home visit',
      perDaySubtotal: 60,
      platformFee: 5,
      totalAmount: 65,
      currency: 'TND',
      address: {
        line1: '10 Rue de Tunis',
        city: 'Tunis',
        postalCode: '1001',
        latitude: 36.8065,
        longitude: 10.1815,
        instructions: 'Appeler avant d arriver',
      },
      notes: 'Patient post-operatoire.',
      lineItems: [
        {
          id: randomId(),
          serviceId: primaryService?.id ?? randomId(),
          serviceName: primaryService?.name ?? 'Home visit',
          serviceCategory: primaryService?.category ?? profile.serviceType ?? 'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 60,
          subtotal: 60,
        },
      ],
      equipmentRental: null,
      validationCode: '4821',
      providerAmount: 60,
      providerAcceptedAt: new Date(`${todayDate}T08:15:00`).toISOString(),
      providerDepartedAt: null,
      providerArrivedAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      validatedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      cancellationReason: null,
      statusChangedBy: profile.userId,
      statusChangeReason: 'provider_confirmed',
      providerConfirmedAt: new Date(`${todayDate}T08:15:00`).toISOString(),
      createdAt: new Date(`${todayDate}T07:30:00`).toISOString(),
      updatedAt: new Date(`${todayDate}T08:15:00`).toISOString(),
      rating: null,
      review: null,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      bookingNumber: 'BKG-000103',
      patientId: '00000000-0000-0000-0000-000000000103',
      providerId: profile.id,
      primaryServiceId: secondaryService?.id ?? primaryService?.id ?? randomId(),
      status: 'ProviderOnWay',
      paymentMethod: 'd17',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000103',
        paymentMethod: 'd17',
        paymentStatus: 'settled',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(todayDate, '15:30:00'),
      startDate: todayDate,
      endDate: todayDate,
      dailyStartTime: '15:30:00',
      dailyEndTime: '16:30:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(103, 'Leila Ben Salem', '+216 54 222 111'),
      provider,
      service: {
        id: secondaryService?.id ?? primaryService?.id ?? randomId(),
        name: secondaryService?.name ?? primaryService?.name ?? 'Suivi a domicile',
        category:
          secondaryService?.category ??
          primaryService?.category ??
          profile.serviceType ??
          'nursing',
        price: 55,
        duration: 60,
      },
      serviceName: secondaryService?.name ?? primaryService?.name ?? 'Suivi a domicile',
      perDaySubtotal: 55,
      platformFee: 4.5,
      totalAmount: 59.5,
      currency: 'TND',
      address: {
        line1: '5 Avenue de Carthage',
        city: 'Ariana',
        postalCode: '2080',
        latitude: 36.8665,
        longitude: 10.1647,
        instructions: 'Sonner chez le gardien',
      },
      notes: 'Se presenter avec le materiel de pansement.',
      lineItems: [
        {
          id: randomId(),
          serviceId: secondaryService?.id ?? primaryService?.id ?? randomId(),
          serviceName: secondaryService?.name ?? primaryService?.name ?? 'Suivi a domicile',
          serviceCategory:
            secondaryService?.category ??
            primaryService?.category ??
            profile.serviceType ??
            'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 55,
          subtotal: 55,
        },
      ],
      equipmentRental: null,
      validationCode: '5930',
      providerAmount: 55,
      providerAcceptedAt: new Date(`${todayDate}T12:00:00`).toISOString(),
      providerDepartedAt: new Date(`${todayDate}T15:05:00`).toISOString(),
      providerArrivedAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      validatedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      cancellationReason: null,
      statusChangedBy: profile.userId,
      statusChangeReason: 'provider_departed',
      providerConfirmedAt: new Date(`${todayDate}T12:00:00`).toISOString(),
      createdAt: new Date(`${todayDate}T10:00:00`).toISOString(),
      updatedAt: new Date(`${todayDate}T15:05:00`).toISOString(),
      rating: null,
      review: null,
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      bookingNumber: 'BKG-000104',
      patientId: '00000000-0000-0000-0000-000000000104',
      providerId: profile.id,
      primaryServiceId: primaryService?.id ?? randomId(),
      status: 'Completed',
      paymentMethod: 'cash',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000104',
        paymentMethod: 'cash',
        paymentStatus: 'reserved',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(twoDaysAgoDate, '08:30:00'),
      startDate: twoDaysAgoDate,
      endDate: twoDaysAgoDate,
      dailyStartTime: '08:30:00',
      dailyEndTime: '09:30:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(104, 'Sonia Kallel', '+216 26 555 888'),
      provider,
      service: {
        id: primaryService?.id ?? randomId(),
        name: primaryService?.name ?? 'Injection a domicile',
        category: primaryService?.category ?? profile.serviceType ?? 'nursing',
        price: 70,
        duration: 60,
      },
      serviceName: primaryService?.name ?? 'Injection a domicile',
      perDaySubtotal: 70,
      platformFee: 6,
      totalAmount: 76,
      currency: 'TND',
      address: {
        line1: '3 Rue Ibn Khaldoun',
        city: 'La Marsa',
        postalCode: '2070',
        latitude: 36.879,
        longitude: 10.324,
        instructions: null,
      },
      notes: 'Patient satisfaite du suivi.',
      lineItems: [
        {
          id: randomId(),
          serviceId: primaryService?.id ?? randomId(),
          serviceName: primaryService?.name ?? 'Injection a domicile',
          serviceCategory: primaryService?.category ?? profile.serviceType ?? 'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 70,
          subtotal: 70,
        },
      ],
      equipmentRental: null,
      validationCode: '3184',
      providerAmount: 70,
      providerAcceptedAt: new Date(`${twoDaysAgoDate}T07:45:00`).toISOString(),
      providerDepartedAt: new Date(`${twoDaysAgoDate}T08:00:00`).toISOString(),
      providerArrivedAt: new Date(`${twoDaysAgoDate}T08:25:00`).toISOString(),
      serviceStartedAt: new Date(`${twoDaysAgoDate}T08:30:00`).toISOString(),
      serviceCompletedAt: new Date(`${twoDaysAgoDate}T09:28:00`).toISOString(),
      validatedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      cancellationReason: null,
      statusChangedBy: profile.userId,
      statusChangeReason: 'service_completed',
      providerConfirmedAt: new Date(`${twoDaysAgoDate}T07:45:00`).toISOString(),
      createdAt: new Date(`${twoDaysAgoDate}T07:00:00`).toISOString(),
      updatedAt: new Date(`${twoDaysAgoDate}T09:28:00`).toISOString(),
      rating: 5,
      review: 'Service excellent et ponctuel.',
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      bookingNumber: 'BKG-000105',
      patientId: '00000000-0000-0000-0000-000000000105',
      providerId: profile.id,
      primaryServiceId: primaryService?.id ?? randomId(),
      status: 'Cancelled',
      paymentMethod: 'card',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000105',
        paymentMethod: 'card',
        paymentStatus: 'cancelled',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(yesterdayDate, '13:00:00'),
      startDate: yesterdayDate,
      endDate: yesterdayDate,
      dailyStartTime: '13:00:00',
      dailyEndTime: '14:00:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(105, 'Karim Gharbi', '+216 28 999 111'),
      provider,
      service: {
        id: primaryService?.id ?? randomId(),
        name: primaryService?.name ?? 'Consultation a domicile',
        category: primaryService?.category ?? profile.serviceType ?? 'nursing',
        price: 52,
        duration: 60,
      },
      serviceName: primaryService?.name ?? 'Consultation a domicile',
      perDaySubtotal: 52,
      platformFee: 4,
      totalAmount: 56,
      currency: 'TND',
      address: {
        line1: '14 Rue de la Liberte',
        city: 'Ben Arous',
        postalCode: '2013',
        latitude: 36.7531,
        longitude: 10.2189,
        instructions: null,
      },
      notes: 'Annulation cote prestataire.',
      lineItems: [
        {
          id: randomId(),
          serviceId: primaryService?.id ?? randomId(),
          serviceName: primaryService?.name ?? 'Consultation a domicile',
          serviceCategory: primaryService?.category ?? profile.serviceType ?? 'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 52,
          subtotal: 52,
        },
      ],
      equipmentRental: null,
      validationCode: null,
      providerAmount: null,
      providerAcceptedAt: null,
      providerDepartedAt: null,
      providerArrivedAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      validatedAt: null,
      cancelledAt: new Date(`${yesterdayDate}T09:20:00`).toISOString(),
      cancelledBy: profile.userId,
      cancellationReason: 'Provider unavailable today',
      statusChangedBy: profile.userId,
      statusChangeReason: 'provider_declined',
      providerConfirmedAt: null,
      createdAt: new Date(`${yesterdayDate}T08:00:00`).toISOString(),
      updatedAt: new Date(`${yesterdayDate}T09:20:00`).toISOString(),
      rating: null,
      review: null,
    },
    {
      id: '10000000-0000-0000-0000-000000000006',
      bookingNumber: 'BKG-000106',
      patientId: '00000000-0000-0000-0000-000000000106',
      providerId: profile.id,
      primaryServiceId: primaryService?.id ?? randomId(),
      status: 'Confirmed',
      paymentMethod: 'd17',
      ...createMockBookingPaymentState({
        bookingNumber: 'BKG-000106',
        paymentMethod: 'd17',
        paymentStatus: 'processing',
      }),
      type: 'home',
      scheduledAt: buildScheduledAt(nextWeekDate, '11:00:00'),
      startDate: nextWeekDate,
      endDate: nextWeekDate,
      dailyStartTime: '11:00:00',
      dailyEndTime: '12:00:00',
      dailyDurationMinutes: 60,
      dayCount: 1,
      timezone: 'Africa/Tunis',
      patient: createPatient(106, 'Rim Bouazizi', '+216 52 123 555'),
      provider,
      service: {
        id: primaryService?.id ?? randomId(),
        name: primaryService?.name ?? 'Suivi infirmier',
        category: primaryService?.category ?? profile.serviceType ?? 'nursing',
        price: 68,
        duration: 60,
      },
      serviceName: primaryService?.name ?? 'Suivi infirmier',
      perDaySubtotal: 68,
      platformFee: 5.5,
      totalAmount: 73.5,
      currency: 'TND',
      address: {
        line1: '7 Rue de Sousse',
        city: 'Sousse',
        postalCode: '4000',
        latitude: 35.8256,
        longitude: 10.6084,
        instructions: 'Maison blanche',
      },
      notes: null,
      lineItems: [
        {
          id: randomId(),
          serviceId: primaryService?.id ?? randomId(),
          serviceName: primaryService?.name ?? 'Suivi infirmier',
          serviceCategory: primaryService?.category ?? profile.serviceType ?? 'nursing',
          currency: 'TND',
          quantity: 1,
          unitPrice: 68,
          subtotal: 68,
        },
      ],
      equipmentRental: null,
      validationCode: '7410',
      providerAmount: 68,
      providerAcceptedAt: new Date(`${nextWeekDate}T08:00:00`).toISOString(),
      providerDepartedAt: null,
      providerArrivedAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      validatedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      cancellationReason: null,
      statusChangedBy: profile.userId,
      statusChangeReason: 'provider_confirmed',
      providerConfirmedAt: new Date(`${nextWeekDate}T08:00:00`).toISOString(),
      createdAt: new Date(`${todayDate}T09:00:00`).toISOString(),
      updatedAt: new Date(`${todayDate}T09:00:00`).toISOString(),
      rating: null,
      review: null,
    },
  ];

  return bookings;
}

function enumerateSessionDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cursor <= end) {
    dates.push(formatDateOnly(cursor));
    cursor = addDays(cursor, 1);
  }

  return dates.length > 0 ? dates : [startDate];
}

function deriveInitialSessionStatus(booking: MockBookingRecord): string | null {
  const normalizedStatus = normalizeBookingStatus(booking.status ?? '');

  if (normalizedStatus === 'Completed' || normalizedStatus === 'Validated') {
    return 'Validated';
  }

  if (normalizedStatus === 'ProviderOnWay' && booking.providerArrivedAt) {
    return booking.serviceStartedAt ? 'InProgress' : 'Arrived';
  }

  return normalizedStatus || null;
}

function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createSessionRecordsForBooking(booking: MockBookingRecord): MockBookingSessionRecord[] {
  return enumerateSessionDates(booking.startDate, booking.endDate).map((scheduledDate, index) => {
    const status = deriveInitialSessionStatus(booking);
    const hasVisibleCode = status === 'Arrived' || status === 'InProgress';

    const isFirstValidatedSession =
      index === 0 && normalizeBookingStatus(status ?? '') === 'Validated';

    return {
      id: randomId(),
      bookingId: booking.id,
      scheduledDate,
      scheduledStartTime: booking.dailyStartTime,
      scheduledEndTime: booking.dailyEndTime,
      status,
      providerDepartedAt: index === 0 ? booking.providerDepartedAt : null,
      providerArrivedAt: index === 0 ? booking.providerArrivedAt : null,
      serviceStartedAt: index === 0 ? booking.serviceStartedAt : null,
      serviceCompletedAt: index === 0 ? booking.serviceCompletedAt : null,
      verificationCode: hasVisibleCode
        ? booking.validationCode || generateVerificationCode()
        : null,
      verificationCodeGeneratedAt: hasVisibleCode
        ? (booking.providerArrivedAt ?? booking.updatedAt)
        : null,
      verificationCodeExpiresAt: hasVisibleCode
        ? new Date(
            new Date(booking.providerArrivedAt ?? booking.updatedAt).getTime() + 2 * 60 * 60 * 1000,
          ).toISOString()
        : null,
      verificationAttempts: 0,
      verifiedAt: index === 0 ? (booking.validatedAt ?? booking.serviceCompletedAt) : null,
      verificationMethod:
        booking.validatedAt || booking.serviceCompletedAt ? 'legacy_parent_validation' : null,
      cancelledAt: index === 0 ? booking.cancelledAt : null,
      cancelledBy: index === 0 ? booking.cancelledBy : null,
      cancellationReason: index === 0 ? booking.cancellationReason : null,
      noShowAt: null,
      noShowReason: null,
      disputedAt: null,
      disputeReason: null,
      sessionIndex: index + 1,
      rating: isFirstValidatedSession && typeof booking.rating === 'number' ? booking.rating : null,
      review: isFirstValidatedSession ? (booking.review ?? null) : null,
    };
  });
}

function listSessionRecordsForBooking(bookingId: string): MockBookingSessionRecord[] {
  return ensureState()
    .sessions.filter((session) => session.bookingId === bookingId)
    .sort((left, right) =>
      `${left.scheduledDate}T${left.scheduledStartTime}`.localeCompare(
        `${right.scheduledDate}T${right.scheduledStartTime}`,
      ),
    );
}

function getSessionCounts(sessions: MockBookingSessionRecord[]) {
  const statusCounts = sessions.reduce(
    (counts, session) => {
      switch (session.status) {
        case 'Confirmed':
          counts.confirmedSessions += 1;
          break;
        case 'ProviderOnWay':
        case 'Arrived':
        case 'InProgress':
          counts.inProgressSessions += 1;
          break;
        case 'Validated':
          counts.validatedSessions += 1;
          break;
        case 'Cancelled':
          counts.cancelledSessions += 1;
          break;
        case 'Disputed':
          counts.disputedSessions += 1;
          break;
        case 'NoShow':
          counts.noShowSessions += 1;
          break;
      }

      return counts;
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
    statusCounts.validatedSessions +
    statusCounts.cancelledSessions +
    statusCounts.disputedSessions +
    statusCounts.noShowSessions;

  return {
    totalSessions: sessions.length,
    ...statusCounts,
    remainingSessions: Math.max(0, sessions.length - terminalSessions),
  };
}

function pickActiveSession(sessions: MockBookingSessionRecord[]): MockBookingSessionRecord | null {
  const sortedSessions = [...sessions].sort((left, right) =>
    `${left.scheduledDate}T${left.scheduledStartTime}`.localeCompare(
      `${right.scheduledDate}T${right.scheduledStartTime}`,
    ),
  );

  return (
    sortedSessions.find((session) =>
      ['ProviderOnWay', 'Arrived', 'InProgress'].includes(
        normalizeBookingStatus(session.status ?? ''),
      ),
    ) ??
    sortedSessions.find((session) =>
      ['Pending', 'Confirmed'].includes(normalizeBookingStatus(session.status ?? '')),
    ) ??
    sortedSessions[0] ??
    null
  );
}

function rollUpBookingStatus(sessions: MockBookingSessionRecord[]): string | null {
  if (sessions.length === 0) {
    return null;
  }

  if (sessions.some((session) => normalizeBookingStatus(session.status ?? '') === 'Disputed')) {
    return 'Disputed';
  }

  if (sessions.every((session) => normalizeBookingStatus(session.status ?? '') === 'Cancelled')) {
    return 'Cancelled';
  }

  if (sessions.every((session) => normalizeBookingStatus(session.status ?? '') === 'Validated')) {
    return 'Validated';
  }

  if (
    sessions.some((session) =>
      ['ProviderOnWay', 'Arrived', 'InProgress'].includes(
        normalizeBookingStatus(session.status ?? ''),
      ),
    )
  ) {
    return 'InProgress';
  }

  if (sessions.some((session) => normalizeBookingStatus(session.status ?? '') === 'Confirmed')) {
    return 'Confirmed';
  }

  return sessions[0]?.status ?? null;
}

function syncSessionsForBooking(booking: MockBookingRecord): void {
  const sessions = ensureState()
    .sessions.filter((session) => session.bookingId === booking.id)
    .sort((left, right) =>
      `${left.scheduledDate}T${left.scheduledStartTime}`.localeCompare(
        `${right.scheduledDate}T${right.scheduledStartTime}`,
      ),
    );

  if (sessions.length === 0) {
    ensureState().sessions.push(...createSessionRecordsForBooking(booking));
    return;
  }

  if (['Confirmed', 'ProviderOnWay'].includes(normalizeBookingStatus(booking.status ?? ''))) {
    for (const session of sessions) {
      if (normalizeBookingStatus(session.status ?? '') === 'Pending') {
        session.status = 'Confirmed';
      }
    }
  }

  const firstSession = sessions[0];

  if (firstSession && normalizeBookingStatus(booking.status ?? '') === 'ProviderOnWay') {
    firstSession.status = 'ProviderOnWay';
    firstSession.providerDepartedAt = booking.providerDepartedAt;
  }

  if (normalizeBookingStatus(booking.status ?? '') === 'Cancelled') {
    for (const session of sessions) {
      if (!['Validated', 'Cancelled'].includes(normalizeBookingStatus(session.status ?? ''))) {
        session.status = 'Cancelled';
        session.cancelledAt = booking.cancelledAt;
        session.cancelledBy = booking.cancelledBy;
        session.cancellationReason = booking.cancellationReason;
      }
    }
  }
}

function toBookingSessionListItem(
  session: MockBookingSessionRecord,
  booking: MockBookingRecord,
): BookingSessionListItemResponse {
  const sessions = listSessionRecordsForBooking(booking.id);

  return {
    id: session.id,
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    patientId: booking.patientId,
    providerId: booking.providerId,
    scheduledAt: buildScheduledAt(session.scheduledDate, session.scheduledStartTime),
    scheduledDate: session.scheduledDate,
    scheduledStartTime: session.scheduledStartTime,
    scheduledEndTime: session.scheduledEndTime,
    dailyStartTime: session.scheduledStartTime,
    dailyEndTime: session.scheduledEndTime,
    timezone: booking.timezone,
    status: toApiStatus(session.status),
    parentStatus: toApiStatus(booking.status),
    bookingStatus: toApiStatus(booking.status),
    type: booking.type,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    patient: booking.patient
      ? {
          id: booking.patient.id,
          name: booking.patient.name,
          phone: booking.patient.phone,
          profilePhotoUrl: booking.patient.avatar ?? null,
        }
      : null,
    provider: booking.provider
      ? {
          id: booking.provider.id,
          name: booking.provider.name,
          phone: booking.provider.phone,
          profilePhotoUrl: booking.provider.avatar ?? null,
        }
      : null,
    service: booking.service
      ? {
          id: booking.service.id,
          name: booking.service.name,
          category: booking.service.category,
        }
      : null,
    address: formatBookingAddress(booking.address),
    location: {
      lat: booking.address?.latitude ?? null,
      lng: booking.address?.longitude ?? null,
      address: formatBookingAddress(booking.address),
    },
    notes: booking.notes,
    sessionIndex: session.sessionIndex,
    totalSessions: sessions.length,
    counts: getSessionCounts(sessions),
    requiresVerificationCode: true,
    verificationCodeRequired: true,
    completionLocked: session.verificationAttempts >= 3,
    verificationLocked: session.verificationAttempts >= 3,
    rating: typeof session.rating === 'number' ? session.rating : null,
    reviewComment: session.review ?? null,
    providerDepartedAt: session.providerDepartedAt,
    providerArrivedAt: session.providerArrivedAt,
    serviceStartedAt: session.serviceStartedAt,
    serviceCompletedAt: session.serviceCompletedAt,
    verificationCodeGeneratedAt: session.verificationCodeGeneratedAt,
    verificationCodeExpiresAt: session.verificationCodeExpiresAt,
    verificationAttempts: session.verificationAttempts,
    verificationAttemptsRemaining: Math.max(0, 3 - session.verificationAttempts),
    verifiedAt: session.verifiedAt,
    verificationMethod: session.verificationMethod,
    cancelledAt: session.cancelledAt,
    cancelledBy: session.cancelledBy,
    cancellationReason: session.cancellationReason,
    noShowAt: session.noShowAt,
    noShowReason: session.noShowReason,
    disputedAt: session.disputedAt,
    disputeReason: session.disputeReason,
  };
}

function toBookingSessionDetail(
  session: MockBookingSessionRecord,
  booking: MockBookingRecord,
): BookingSessionDetailResponse {
  const listItem = toBookingSessionListItem(session, booking);
  const canShowCode = ['Arrived', 'InProgress'].includes(
    normalizeBookingStatus(session.status ?? ''),
  );

  return {
    ...listItem,
    paymentMethod: booking.paymentMethod,
    paymentId: booking.paymentId,
    paymentStatus: booking.paymentStatus,
    paymentMethodType: booking.paymentMethodType,
    paymentReferenceNumber: booking.paymentReferenceNumber,
    patientName: booking.patient?.name ?? null,
    patientPhone: booking.patient?.phone ?? null,
    providerName: booking.provider?.name ?? null,
    providerPhone: booking.provider?.phone ?? null,
    providerProfilePhotoUrl: booking.provider?.avatar ?? null,
    serviceName: booking.serviceName,
    serviceCategory: booking.service?.category ?? null,
    verificationCode: canShowCode ? session.verificationCode : null,
    parent: {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: toApiStatus(booking.status),
      totalAmount: booking.totalAmount,
      currency: booking.currency,
    },
  };
}

function toProviderSessionDelivery(
  session: MockBookingSessionRecord,
  booking: MockBookingRecord,
): ProviderSessionDeliveryResponse {
  return {
    id: session.id,
    sessionId: session.id,
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    status: toApiStatus(session.status),
    parentStatus: toApiStatus(booking.status),
    bookingStatus: toApiStatus(booking.status),
    paymentMethod: booking.paymentMethod,
    paymentId: booking.paymentId,
    paymentStatus: booking.paymentStatus,
    paymentMethodType: booking.paymentMethodType,
    paymentReferenceNumber: booking.paymentReferenceNumber,
    scheduledAt: buildScheduledAt(session.scheduledDate, session.scheduledStartTime),
    scheduledDate: session.scheduledDate,
    scheduledStartTime: session.scheduledStartTime,
    scheduledEndTime: session.scheduledEndTime,
    startDate: session.scheduledDate,
    endDate: session.scheduledDate,
    dailyStartTime: session.scheduledStartTime,
    dailyEndTime: session.scheduledEndTime,
    dailyDurationMinutes: booking.dailyDurationMinutes,
    timezone: booking.timezone,
    notes: booking.notes,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    patientName: booking.patient?.name ?? null,
    patientPhone: booking.patient?.phone ?? null,
    serviceName: booking.serviceName,
    serviceCategory: booking.service?.category ?? null,
    location: {
      lat: booking.address?.latitude ?? null,
      lng: booking.address?.longitude ?? null,
      address: formatBookingAddress(booking.address),
    },
    requiresVerificationCode: true,
    verificationCodeRequired: true,
    verificationAttemptsRemaining: Math.max(0, 3 - session.verificationAttempts),
    completionLocked: session.verificationAttempts >= 3,
    verificationLocked: session.verificationAttempts >= 3,
    providerDepartedAt: session.providerDepartedAt,
    providerArrivedAt: session.providerArrivedAt,
    serviceStartedAt: session.serviceStartedAt,
    serviceCompletedAt: session.serviceCompletedAt,
    verificationCodeGeneratedAt: session.verificationCodeGeneratedAt,
    verificationCodeExpiresAt: session.verificationCodeExpiresAt,
    verificationAttempts: session.verificationAttempts,
    verifiedAt: session.verifiedAt,
    verificationMethod: session.verificationMethod,
    cancelledAt: session.cancelledAt,
    cancelledBy: session.cancelledBy,
    cancellationReason: session.cancellationReason,
    noShowAt: session.noShowAt,
    noShowReason: session.noShowReason,
    disputedAt: session.disputedAt,
    disputeReason: session.disputeReason,
  };
}

function toBookingSessionMutationResponse(
  session: MockBookingSessionRecord,
  booking: MockBookingRecord,
): BookingSessionMutationResponse {
  return {
    id: session.id,
    sessionId: session.id,
    bookingId: booking.id,
    status: toApiStatus(session.status),
    parentStatus: toApiStatus(booking.status),
    bookingStatus: toApiStatus(booking.status),
    providerDepartedAt: session.providerDepartedAt,
    providerArrivedAt: session.providerArrivedAt,
    serviceStartedAt: session.serviceStartedAt,
    serviceCompletedAt: session.serviceCompletedAt,
    verifiedAt: session.verifiedAt,
    cancelledAt: session.cancelledAt,
    noShowAt: session.noShowAt,
    noShowReason: session.noShowReason,
    disputedAt: session.disputedAt,
    verificationCodeRequired: ['Arrived', 'InProgress'].includes(
      normalizeBookingStatus(session.status ?? ''),
    ),
    requiresVerificationCode: ['Arrived', 'InProgress'].includes(
      normalizeBookingStatus(session.status ?? ''),
    ),
    verificationAttemptsRemaining: Math.max(0, 3 - session.verificationAttempts),
    verificationLocked: session.verificationAttempts >= 3,
    completionLocked: session.verificationAttempts >= 3,
    parentSettled: booking.paymentStatus === 'settled',
    settlementStatus: booking.paymentStatus,
    counts: getSessionCounts(listSessionRecordsForBooking(booking.id)),
  };
}

function createSeedUnavailabilities(): ProviderUnavailabilityResponse[] {
  const now = new Date();
  const blockDate = formatDateOnly(addDays(now, 3));
  const vacationStart = formatDateOnly(addDays(now, 9));
  const vacationEnd = formatDateOnly(addDays(now, 10));

  return [
    {
      id: randomId(),
      startDatetime: new Date(`${blockDate}T13:00:00`).toISOString(),
      endDatetime: new Date(`${blockDate}T17:00:00`).toISOString(),
      isAllDay: false,
      isRecurring: false,
      recurrenceRule: null,
      reason: 'medical_appointment',
      notes: 'Indisponible pour rendez-vous personnel.',
    },
    {
      id: randomId(),
      startDatetime: new Date(`${vacationStart}T00:00:00`).toISOString(),
      endDatetime: new Date(`${vacationEnd}T23:59:59`).toISOString(),
      isAllDay: true,
      isRecurring: false,
      recurrenceRule: null,
      reason: 'personal_leave',
      notes: 'Conge planifie.',
    },
  ];
}

let providerPlanningState: ProviderPlanningState | null = null;
let providerPlanningStateKey: string | null = null;

function ensureState(): ProviderPlanningState {
  const nextStateKey = getProviderPlanningStateKey();

  if (!providerPlanningState || providerPlanningStateKey !== nextStateKey) {
    providerPlanningState = {
      schedules: createSeedSchedules(),
      unavailabilities: createSeedUnavailabilities(),
      bookings: createSeedBookingRecords(),
      sessions: [],
    };
    providerPlanningState.sessions = providerPlanningState.bookings.flatMap(
      createSessionRecordsForBooking,
    );
    providerPlanningStateKey = nextStateKey;
  }

  return providerPlanningState;
}

export function listMockBookingRecords(): MockBookingRecord[] {
  return ensureState().bookings;
}

export function listMockBookingSessionsForBooking(bookingId: string): MockBookingSessionRecord[] {
  return listSessionRecordsForBooking(bookingId).map((session) => cloneDeep(session));
}

export function listMockBookingSessions(): BookingSessionListItemResponse[] {
  const state = ensureState();

  return state.sessions
    .map((session) => {
      const booking = state.bookings.find((item) => item.id === session.bookingId);
      return booking ? toBookingSessionListItem(session, booking) : null;
    })
    .filter((session): session is BookingSessionListItemResponse => session !== null)
    .sort((left, right) =>
      `${left.scheduledDate}T${left.scheduledStartTime}`.localeCompare(
        `${right.scheduledDate}T${right.scheduledStartTime}`,
      ),
    );
}

export function findMockBookingSession(
  sessionId: string,
): { session: MockBookingSessionRecord; booking: MockBookingRecord } | null {
  const state = ensureState();
  const session = state.sessions.find((item) => item.id === sessionId);

  if (!session) {
    return null;
  }

  const booking = state.bookings.find((item) => item.id === session.bookingId);
  return booking ? { session, booking } : null;
}

export function getMockBookingSessionDetail(
  sessionId: string,
): BookingSessionDetailResponse | null {
  const found = findMockBookingSession(sessionId);
  return found ? toBookingSessionDetail(found.session, found.booking) : null;
}

export function getMockProviderSessionDelivery(
  sessionId: string,
): ProviderSessionDeliveryResponse | null {
  const found = findMockBookingSession(sessionId);
  const providerId = getCurrentMockProviderProfile().id;

  if (!found || found.booking.providerId !== providerId) {
    return null;
  }

  return toProviderSessionDelivery(found.session, found.booking);
}

export function findMockBookingRecord(id: string): MockBookingRecord | undefined {
  return ensureState().bookings.find((booking) => booking.id === id);
}

export function createMockBookingRecord(record: MockBookingRecord): MockBookingRecord {
  const state = ensureState();
  state.bookings.push(record);
  state.sessions.push(...createSessionRecordsForBooking(record));
  return cloneDeep(record);
}

export function updateMockBookingRecord(
  id: string,
  recipe: (booking: MockBookingRecord) => MockBookingRecord,
): MockBookingRecord | null {
  const bookings = ensureState().bookings;
  const index = bookings.findIndex((booking) => booking.id === id);

  if (index === -1) {
    return null;
  }

  bookings[index] = recipe(bookings[index]);
  syncSessionsForBooking(bookings[index]);
  return cloneDeep(bookings[index]);
}

export function updateMockBookingSession(
  sessionId: string,
  recipe: (
    session: MockBookingSessionRecord,
    booking: MockBookingRecord,
  ) => MockBookingSessionRecord,
): BookingSessionMutationResponse | null {
  const state = ensureState();
  const sessionIndex = state.sessions.findIndex((session) => session.id === sessionId);

  if (sessionIndex === -1) {
    return null;
  }

  const bookingIndex = state.bookings.findIndex(
    (booking) => booking.id === state.sessions[sessionIndex].bookingId,
  );

  if (bookingIndex === -1) {
    return null;
  }

  const booking = state.bookings[bookingIndex];
  state.sessions[sessionIndex] = recipe(state.sessions[sessionIndex], booking);

  const bookingSessions = state.sessions.filter((session) => session.bookingId === booking.id);
  const rolledUpStatus = rollUpBookingStatus(bookingSessions) ?? booking.status;
  state.bookings[bookingIndex] = {
    ...booking,
    status: rolledUpStatus,
    providerDepartedAt:
      state.sessions[sessionIndex].providerDepartedAt ?? booking.providerDepartedAt,
    providerArrivedAt: state.sessions[sessionIndex].providerArrivedAt ?? booking.providerArrivedAt,
    serviceStartedAt: state.sessions[sessionIndex].serviceStartedAt ?? booking.serviceStartedAt,
    serviceCompletedAt:
      state.sessions[sessionIndex].serviceCompletedAt ?? booking.serviceCompletedAt,
    validatedAt: state.sessions[sessionIndex].verifiedAt ?? booking.validatedAt,
    updatedAt: new Date().toISOString(),
  };

  return toBookingSessionMutationResponse(
    cloneDeep(state.sessions[sessionIndex]),
    cloneDeep(state.bookings[bookingIndex]),
  );
}

export function getProviderTodayBookingRecords(): MockBookingRecord[] {
  const providerId = getCurrentMockProviderProfile().id;
  const today = formatDateOnly(new Date());
  const sessionBookingIds = new Set(
    ensureState()
      .sessions.filter((session) => session.scheduledDate === today)
      .map((session) => session.bookingId),
  );

  return ensureState()
    .bookings.filter(
      (booking) => booking.providerId === providerId && sessionBookingIds.has(booking.id),
    )
    .sort((left, right) => left.dailyStartTime.localeCompare(right.dailyStartTime))
    .map((booking) => cloneDeep(booking));
}

export function getProviderPlanningData(from: string, to: string): ProviderPlanningResponse {
  const profile = getCurrentMockProviderProfile();
  const state = ensureState();

  return {
    timezone: 'Africa/Tunis',
    isOnline: profile.isOnline,
    availabilityStatus: toAvailabilityStatus(profile.isOnline),
    schedules: cloneDeep(state.schedules),
    unavailabilities: state.unavailabilities
      .filter((entry) => overlapsDateTimeRange(entry.startDatetime, entry.endDatetime, from, to))
      .map((entry) => cloneDeep(entry)),
    bookings: state.bookings
      .filter((booking) => {
        if (booking.providerId !== profile.id) {
          return false;
        }

        const bookingSessions = state.sessions.filter(
          (session) => session.bookingId === booking.id,
        );

        return bookingSessions.length > 0
          ? bookingSessions.some(
              (session) => session.scheduledDate >= from && session.scheduledDate <= to,
            )
          : overlapsDateRange(booking.startDate, booking.endDate, from, to);
      })
      .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))
      .map((booking) => toProviderPlanningBookingResponse(booking)),
  };
}

export function getMockProviderSchedules(): ProviderScheduleInterval[] {
  return cloneDeep(ensureState().schedules);
}

export function replaceMockProviderSchedules(
  intervals: UpsertProviderScheduleInterval[],
): ProviderScheduleInterval[] {
  ensureState().schedules = intervals.map((interval) => ({
    id: interval.id ?? randomId(),
    dayOfWeek: interval.dayOfWeek,
    serviceId: interval.serviceId ?? null,
    startTime: interval.startTime,
    endTime: interval.endTime,
  }));

  return getMockProviderSchedules();
}

export function getMockProviderUnavailabilities(
  from: string,
  to: string,
): ProviderUnavailabilityResponse[] {
  return ensureState()
    .unavailabilities.filter((entry) =>
      overlapsDateTimeRange(entry.startDatetime, entry.endDatetime, from, to),
    )
    .map((entry) => cloneDeep(entry));
}

export function createMockProviderUnavailability(
  input: Omit<ProviderUnavailabilityResponse, 'id'>,
): ProviderUnavailabilityResponse {
  const created: ProviderUnavailabilityResponse = {
    id: randomId(),
    ...cloneDeep(input),
  };

  ensureState().unavailabilities = [...ensureState().unavailabilities, created].sort(
    (left, right) => left.startDatetime.localeCompare(right.startDatetime),
  );

  return cloneDeep(created);
}

export function updateMockProviderUnavailability(
  id: string,
  patch: Partial<Omit<ProviderUnavailabilityResponse, 'id'>>,
): ProviderUnavailabilityResponse | null {
  const entries = ensureState().unavailabilities;
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  entries[index] = {
    ...entries[index],
    ...cloneDeep(patch),
  };

  return cloneDeep(entries[index]);
}

export function deleteMockProviderUnavailability(id: string): boolean {
  const entries = ensureState().unavailabilities;
  const nextEntries = entries.filter((entry) => entry.id !== id);

  if (nextEntries.length === entries.length) {
    return false;
  }

  ensureState().unavailabilities = nextEntries;
  return true;
}

export function getProviderDashboardMetrics() {
  const profile = getCurrentMockProviderProfile();
  const today = formatDateOnly(new Date());
  const weekEnd = formatDateOnly(addDays(new Date(), 6));
  const monthKey = today.slice(0, 7);
  const providerBookings = ensureState().bookings.filter(
    (booking) => booking.providerId === profile.id,
  );
  const nonCancelled = providerBookings.filter(
    (booking) => normalizeBookingStatus(booking.status ?? '') !== 'Cancelled',
  );
  const completed = providerBookings.filter((booking) =>
    ['Completed', 'Validated'].includes(normalizeBookingStatus(booking.status ?? '')),
  );
  const thisWeekBookings = nonCancelled.filter((booking) =>
    overlapsDateRange(booking.startDate, booking.endDate, today, weekEnd),
  );
  const thisWeekRevenue = completed
    .filter((booking) => booking.startDate >= today && booking.startDate <= weekEnd)
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  const thisMonthRevenue = completed
    .filter((booking) => booking.startDate.startsWith(monthKey))
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  const todayCount = providerBookings.filter(
    (booking) =>
      normalizeBookingStatus(booking.status ?? '') !== 'Cancelled' &&
      ensureState().sessions.some(
        (session) => session.bookingId === booking.id && session.scheduledDate === today,
      ),
  ).length;
  const completionRate = providerBookings.length
    ? Math.round((completed.length / providerBookings.length) * 1000) / 10
    : profile.completionRate;

  return {
    todayCount,
    weekCount: thisWeekBookings.length,
    completionRate,
    thisWeekRevenue: Math.round(thisWeekRevenue * 100) / 100,
    thisMonthRevenue: Math.round(thisMonthRevenue * 100) / 100,
  };
}

export function createDefaultDailyEndTime(startTime: string, durationMinutes: number): string {
  return addMinutesToTime(startTime, durationMinutes);
}
