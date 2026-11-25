/**
 * Booking Schemas
 * Zod schemas for booking-related DTOs.
 */

import { z } from 'zod';
import {
  uuidSchema,
  dateTimeSchema,
  nullableDateTime,
  nullableDateOnlyResponse,
  DateOnlyResponseSchema,
  TimeOnlySchema,
  TimeOnlyResponseSchema,
  TimeSpanResponseSchema,
  AddressSchema,
  PaginationMetadataSchema,
} from '@/shared/schemas/common';
import { toBookingStatusApiValue } from './status';

// ============================================
// NESTED SUMMARY DTOS
// ============================================

export const PatientSummarySchema = z.object({
  id: uuidSchema,
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profilePhotoUrl: z.string().nullable().optional(),
});

export const ProviderSummarySchema = z.object({
  id: uuidSchema,
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profilePhotoUrl: z.string().nullable().optional(),
  averageRating: z.number().nullable().optional(),
  totalReviews: z.number().int(),
});

export const ServiceSummarySchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.number(),
  estimatedDurationMinutes: z.number().int(),
});

export const BookingLifecycleMetadataSchema = z.object({
  providerAcceptedAt: nullableDateTime,
  providerDepartedAt: nullableDateTime,
  providerArrivedAt: nullableDateTime,
  serviceStartedAt: nullableDateTime,
  serviceCompletedAt: nullableDateTime,
  validatedAt: nullableDateTime,
  cancelledAt: nullableDateTime,
  cancelledBy: z.string().nullable().optional(),
  cancellationReason: z.string().nullable().optional(),
  noShowAt: nullableDateTime,
  noShowReason: z.string().nullable().optional(),
  statusChangedBy: z.string().nullable().optional(),
  statusChangeReason: z.string().nullable().optional(),
});

export const BookingSessionStatusSchema = z.preprocess(
  (value) => (typeof value === 'string' ? (toBookingStatusApiValue(value) ?? value) : value),
  z.string(),
);

const BookingSessionCountsShape = {
  totalSessions: z.number().int().nullable().optional(),
  confirmedSessions: z.number().int().nullable().optional(),
  inProgressSessions: z.number().int().nullable().optional(),
  validatedSessions: z.number().int().nullable().optional(),
  cancelledSessions: z.number().int().nullable().optional(),
  disputedSessions: z.number().int().nullable().optional(),
  noShowSessions: z.number().int().nullable().optional(),
  remainingSessions: z.number().int().nullable().optional(),
};

export const BookingSessionCountsSchema = z.object(BookingSessionCountsShape);

export const BookingSessionTimeResponseSchema = z.union([
  TimeSpanResponseSchema,
  TimeOnlyResponseSchema,
]);

// ============================================
// BOOKING LINE ITEM
// ============================================

export const BookingLineItemResponseSchema = z.object({
  id: uuidSchema,
  serviceId: uuidSchema,
  serviceName: z.string().nullable().optional(),
  serviceCategory: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  subtotal: z.number(),
});

export const CreateBookingServiceItemRequestSchema = z.object({
  serviceId: uuidSchema,
  quantity: z.number().int().min(1).max(10),
});

export const BookingPaymentMethodSchema = z.enum(['card', 'd17', 'cash']);

const BookingPaymentMetadataShape = {
  paymentId: uuidSchema.nullable().optional(),
  paymentStatus: z.string().nullable().optional(),
  paymentMethodType: z.string().nullable().optional(),
  paymentReferenceNumber: z.string().nullable().optional(),
};

export const BookingPaymentMetadataSchema = z.object(BookingPaymentMetadataShape);

export const ProviderDeliveryLocationSchema = z.object({
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
});

// ============================================
// BOOKING RESPONSE (full detail)
// ============================================

export const BookingResponseSchema = BookingLifecycleMetadataSchema.extend({
  id: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  patientId: uuidSchema,
  providerId: uuidSchema,
  primaryServiceId: uuidSchema,
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dailyStartTime: BookingSessionTimeResponseSchema,
  dailyEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  dailyDurationMinutes: z.number().int().nullable().optional(),
  dayCount: z.number().int(),
  timezone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  ...BookingSessionCountsShape,
  sessionCounts: BookingSessionCountsSchema.nullable().optional(),
  activeSessionId: uuidSchema.nullable().optional(),
  nextSessionId: uuidSchema.nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema,
  ...BookingPaymentMetadataShape,
  patientName: z.string().nullable().optional(),
  patientPhoneNumber: z.string().nullable().optional(),
  patientEmail: z.string().nullable().optional(),
  providerName: z.string().nullable().optional(),
  providerPhoneNumber: z.string().nullable().optional(),
  providerProfilePhotoUrl: z.string().nullable().optional(),
  serviceName: z.string().nullable().optional(),
  estimatedCost: z.number().nullable().optional(),
  serviceModality: z.string().nullable().optional(),
  serviceCategory: z.string().nullable().optional(),
  addressLine1: z.string().nullable().optional(),
  addressLine2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  addressInstructions: z.string().nullable().optional(),
  perDaySubtotal: z.number(),
  platformFee: z.number(),
  totalAmount: z.number(),
  currency: z.string().nullable().optional(),
  isProviderConfirmed: z.boolean(),
  providerConfirmedAt: nullableDateTime,
  isRescheduleRequested: z.boolean(),
  rescheduleCount: z.number().int(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  autoValidateAt: nullableDateTime,
  patient: PatientSummarySchema.nullable().optional(),
  provider: ProviderSummarySchema.nullable().optional(),
  service: ServiceSummarySchema.nullable().optional(),
  lineItems: z.array(BookingLineItemResponseSchema).nullable().optional(),
});

// ============================================
// BOOKING LIST (paginated)
// ============================================

export const BookingListServiceDtoSchema = z.object({
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export const BookingListProviderDtoSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  rating: z.number(),
});

export const BookingListPatientDtoSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const EquipmentRentalResponseSchema = z
  .object({
    endDate: nullableDateOnlyResponse,
    actualReturnDate: nullableDateOnlyResponse,
    rentalDurationType: z.string().nullable().optional(),
    periodCount: z.number().int().nullable().optional(),
    periodRate: z.number().nullable().optional(),
    depositStatus: z.string().nullable().optional(),
    depositAmount: z.number().nullable().optional(),
  })
  .nullable()
  .optional();

export const BookingListItemResponseSchema = BookingLifecycleMetadataSchema.extend({
  id: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema,
  ...BookingPaymentMetadataShape,
  type: z.string().nullable().optional(),
  scheduledAt: dateTimeSchema,
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dailyStartTime: BookingSessionTimeResponseSchema,
  dailyEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  dailyDurationMinutes: z.number().int().nullable().optional(),
  dayCount: z.number().int(),
  perDaySubtotal: z.number(),
  platformFee: z.number(),
  totalAmount: z.number(),
  currency: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  service: BookingListServiceDtoSchema.nullable().optional(),
  lineItems: z.array(BookingLineItemResponseSchema).nullable().optional(),
  equipmentRental: EquipmentRentalResponseSchema,
  provider: BookingListProviderDtoSchema.nullable().optional(),
  providerLocation: ProviderDeliveryLocationSchema.nullable().optional(),
  providerLatitude: z.number().nullable().optional(),
  providerLongitude: z.number().nullable().optional(),
  providerAddress: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  sessionId: uuidSchema.nullable().optional(),
  bookingId: uuidSchema.nullable().optional(),
  activeSessionId: uuidSchema.nullable().optional(),
  nextSessionId: uuidSchema.nullable().optional(),
  ...BookingSessionCountsShape,
  sessionCounts: BookingSessionCountsSchema.nullable().optional(),
  validationCode: z.string().nullable().optional(),
  autoValidateAt: nullableDateTime,
  rating: z.number().int().nullable().optional(),
  reviewComment: z.string().nullable().optional(),
  patient: BookingListPatientDtoSchema.nullable().optional(),
  providerAmount: z.number().nullable().optional(),
});

export const GetBookingsResponseSchema = z.object({
  items: z.array(BookingListItemResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// CREATE BOOKING
// ============================================

export const CreateBookingAddressRequestSchema = AddressSchema.extend({
  line2: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  instructions: z.string().nullable().optional(),
});

export const CreateBookingRequestSchema = z.object({
  providerId: uuidSchema,
  serviceItems: z.array(CreateBookingServiceItemRequestSchema).min(1),
  startDate: z.union([DateOnlyResponseSchema, z.string()]),
  endDate: z.union([DateOnlyResponseSchema, z.string()]),
  dailyStartTime: z.union([TimeOnlySchema, TimeOnlyResponseSchema, z.string()]),
  paymentMethod: BookingPaymentMethodSchema,
  patientLocationChoice: z.enum(['home', 'provider_site']).nullable().optional(),
  address: CreateBookingAddressRequestSchema.optional(),
  patientNotes: z.string().nullable().optional(),
  prescriptionFileId: uuidSchema.nullable().optional(),
  expectedTotalAmount: z.number().optional(),
  typeConfig: z.unknown().nullable().optional(),
});

export const BookingQuoteRequestSchema = CreateBookingRequestSchema.omit({
  expectedTotalAmount: true,
  paymentMethod: true,
});

export const CreateBookingPricingResponseSchema = z.object({
  perDaySubtotal: z.number(),
  bookingSubtotal: z.number(),
  platformFee: z.number(),
  totalAmount: z.number(),
  currency: z.string().nullable().optional(),
});

export const BookingPartyResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
});

export const BookingServiceResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
});

export const CreateBookingEquipmentRentalResponseSchema = z
  .object({
    endDate: z.union([DateOnlyResponseSchema, z.string()]),
    rentalDurationType: z.string().nullable().optional(),
    periodCount: z.number().int().nullable().optional(),
    periodRate: z.number().nullable().optional(),
    depositAmount: z.number().nullable().optional(),
    depositStatus: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const BookingQuoteResponseSchema = z.object({
  bookingType: z.string(),
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dayCount: z.number().int(),
  dailyDurationMinutes: z.number().int(),
  pricing: CreateBookingPricingResponseSchema,
  cashAvailable: z.boolean().default(true),
  cashUnavailableReasonCode: z.string().nullable().optional(),
  equipmentRental: CreateBookingEquipmentRentalResponseSchema,
});

export const CreateBookingResponseSchema = z.object({
  id: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  bookingType: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema,
  ...BookingPaymentMetadataShape,
  scheduledAt: dateTimeSchema,
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dailyStartTime: TimeOnlyResponseSchema,
  dailyEndTime: TimeOnlyResponseSchema.nullable().optional(),
  dailyDurationMinutes: z.number().int(),
  dayCount: z.number().int(),
  pricing: CreateBookingPricingResponseSchema.optional(),
  equipmentRental: CreateBookingEquipmentRentalResponseSchema,
  validationCode: z.string().nullable().optional(),
  provider: BookingPartyResponseSchema.optional(),
  service: BookingServiceResponseSchema.nullable().optional(),
  serviceItems: z.array(BookingLineItemResponseSchema).nullable().optional(),
});

// ============================================
// UPDATE BOOKING
// ============================================

export const UpdateBookingAddressRequestSchema = AddressSchema;
export const UpdateBookingAddressResponseSchema = AddressSchema;

export const UpdateBookingRequestSchema = z.object({
  address: UpdateBookingAddressRequestSchema.optional(),
  patientNotes: z.string().nullable().optional(),
});

export const UpdateBookingResponseSchema = z.object({
  id: uuidSchema,
  address: UpdateBookingAddressResponseSchema.optional(),
  updatedAt: dateTimeSchema,
});

export const ConfirmBookingResponseSchema = z.object({
  id: uuidSchema,
  status: z.string().nullable().optional(),
  confirmedAt: nullableDateTime,
});

export const DeclineBookingRequestSchema = z.object({
  cancellationReason: z.string().nullable().optional(),
});

// ============================================
// CANCEL BOOKING
// ============================================

export const CancelBookingResponseSchema = z.object({
  id: uuidSchema,
  status: z.string().nullable().optional(),
  cancelledAt: nullableDateTime,
  cancelledBy: z.string().nullable().optional(),
  cancellationReason: z.string().nullable().optional(),
  statusChangedBy: z.string().nullable().optional(),
  statusChangeReason: z.string().nullable().optional(),
  refundAmount: z.number().nullable().optional(),
  refundStatus: z.string().nullable().optional(),
});

export const DeclineBookingResponseSchema = CancelBookingResponseSchema;

// ============================================
// BOOKING SESSIONS
// ============================================

export const BookingSessionPartySchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  profilePhotoUrl: z.string().nullable().optional(),
  location: ProviderDeliveryLocationSchema.nullable().optional(),
});

export const BookingSessionServiceSchema = z.object({
  id: uuidSchema.nullable().optional(),
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export const BookingSessionLifecycleMetadataSchema = z.object({
  providerDepartedAt: nullableDateTime,
  providerArrivedAt: nullableDateTime,
  serviceStartedAt: nullableDateTime,
  serviceCompletedAt: nullableDateTime,
  verificationCodeGeneratedAt: nullableDateTime,
  verificationCodeExpiresAt: nullableDateTime,
  verificationAttempts: z.number().int().nullable().optional(),
  verificationAttemptsRemaining: z.number().int().nullable().optional(),
  verifiedAt: nullableDateTime,
  verificationMethod: z.string().nullable().optional(),
  cancelledAt: nullableDateTime,
  cancelledBy: z.string().nullable().optional(),
  cancellationReason: z.string().nullable().optional(),
  noShowAt: nullableDateTime,
  noShowReason: z.string().nullable().optional(),
  disputedAt: nullableDateTime,
  disputeReason: z.string().nullable().optional(),
});

export const BookingSessionListItemResponseSchema = BookingSessionLifecycleMetadataSchema.extend({
  id: uuidSchema,
  bookingId: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  patientId: uuidSchema.nullable().optional(),
  providerId: uuidSchema.nullable().optional(),
  scheduledAt: dateTimeSchema.nullable().optional(),
  scheduledDate: DateOnlyResponseSchema,
  scheduledStartTime: BookingSessionTimeResponseSchema,
  scheduledEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  scheduledDurationMinutes: z.number().int().nullable().optional(),
  dailyStartTime: BookingSessionTimeResponseSchema.nullable().optional(),
  dailyEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  timezone: z.string().nullable().optional(),
  status: BookingSessionStatusSchema.nullable().optional(),
  parentStatus: z.string().nullable().optional(),
  bookingStatus: z.string().nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema.nullable().optional(),
  ...BookingPaymentMetadataShape,
  type: z.string().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  patientName: z.string().nullable().optional(),
  patientPhone: z.string().nullable().optional(),
  providerName: z.string().nullable().optional(),
  providerPhone: z.string().nullable().optional(),
  providerLocation: ProviderDeliveryLocationSchema.nullable().optional(),
  providerLatitude: z.number().nullable().optional(),
  providerLongitude: z.number().nullable().optional(),
  providerAddress: z.string().nullable().optional(),
  serviceName: z.string().nullable().optional(),
  serviceCategory: z.string().nullable().optional(),
  patient: BookingSessionPartySchema.nullable().optional(),
  provider: BookingSessionPartySchema.nullable().optional(),
  service: BookingSessionServiceSchema.nullable().optional(),
  address: z.string().nullable().optional(),
  location: ProviderDeliveryLocationSchema.nullable().optional(),
  notes: z.string().nullable().optional(),
  sessionIndex: z.number().int().nullable().optional(),
  totalSessions: z.number().int().nullable().optional(),
  counts: BookingSessionCountsSchema.nullable().optional(),
  requiresVerificationCode: z.boolean().nullable().optional(),
  verificationCodeRequired: z.boolean().nullable().optional(),
  completionLocked: z.boolean().nullable().optional(),
  verificationLocked: z.boolean().nullable().optional(),
  rating: z.number().int().nullable().optional(),
  reviewComment: z.string().nullable().optional(),
});

export const BookingSessionDetailResponseSchema = BookingSessionListItemResponseSchema.extend({
  patientName: z.string().nullable().optional(),
  patientPhone: z.string().nullable().optional(),
  providerName: z.string().nullable().optional(),
  providerPhone: z.string().nullable().optional(),
  providerProfilePhotoUrl: z.string().nullable().optional(),
  serviceName: z.string().nullable().optional(),
  serviceCategory: z.string().nullable().optional(),
  verificationCode: z.string().nullable().optional(),
  parent: BookingResponseSchema.pick({
    id: true,
    bookingNumber: true,
    status: true,
    totalAmount: true,
    currency: true,
  })
    .partial()
    .nullable()
    .optional(),
});

export const GetBookingSessionsResponseSchema = z.object({
  items: z.array(BookingSessionListItemResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema.nullable().optional(),
});

export const ProviderSessionDeliveryResponseSchema = BookingSessionLifecycleMetadataSchema.extend({
  id: uuidSchema,
  sessionId: uuidSchema,
  bookingId: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  status: BookingSessionStatusSchema.nullable().optional(),
  parentStatus: z.string().nullable().optional(),
  bookingStatus: z.string().nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema.nullable().optional(),
  ...BookingPaymentMetadataShape,
  scheduledAt: dateTimeSchema,
  scheduledDate: DateOnlyResponseSchema,
  scheduledStartTime: BookingSessionTimeResponseSchema,
  scheduledEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dailyStartTime: BookingSessionTimeResponseSchema,
  dailyEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  dailyDurationMinutes: z.number().int().nullable().optional(),
  timezone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  totalAmount: z.number(),
  currency: z.string().nullable().optional(),
  patientName: z.string().nullable().optional(),
  patientPhone: z.string().nullable().optional(),
  serviceName: z.string().nullable().optional(),
  serviceCategory: z.string().nullable().optional(),
  location: ProviderDeliveryLocationSchema,
  requiresVerificationCode: z.boolean().nullable().optional(),
  verificationCodeRequired: z.boolean().nullable().optional(),
  verificationAttemptsRemaining: z.number().int().nullable().optional(),
  completionLocked: z.boolean().nullable().optional(),
  verificationLocked: z.boolean().nullable().optional(),
});

export const CompleteBookingSessionRequestSchema = z.object({
  validationCode: z.string().regex(/^\d{6}$/),
});

export const DisputeBookingSessionRequestSchema = z.object({
  disputeReason: z.string().min(1),
});

export const CancelBookingSessionRequestSchema = z.object({
  cancellationReason: z.string().nullable().optional(),
});

export const MarkBookingSessionNoShowRequestSchema = z.object({
  noShowReason: z.string().nullable().optional(),
});

export const BookingSessionMutationResponseSchema = z.object({
  id: uuidSchema,
  sessionId: uuidSchema.nullable().optional(),
  bookingId: uuidSchema,
  status: BookingSessionStatusSchema.nullable().optional(),
  parentStatus: z.string().nullable().optional(),
  bookingStatus: z.string().nullable().optional(),
  providerDepartedAt: nullableDateTime,
  providerArrivedAt: nullableDateTime,
  serviceStartedAt: nullableDateTime,
  serviceCompletedAt: nullableDateTime,
  verifiedAt: nullableDateTime,
  cancelledAt: nullableDateTime,
  cancelledBy: z.string().nullable().optional(),
  cancellationReason: z.string().nullable().optional(),
  noShowAt: nullableDateTime,
  noShowReason: z.string().nullable().optional(),
  disputedAt: nullableDateTime,
  allocatedSessionAmount: z.number().nullable().optional(),
  cancellationFee: z.number().nullable().optional(),
  refundAmount: z.number().nullable().optional(),
  refundStatus: z.string().nullable().optional(),
  paymentId: uuidSchema.nullable().optional(),
  paymentStatus: z.string().nullable().optional(),
  verificationAttempts: z.number().int().nullable().optional(),
  verificationAttemptsRemaining: z.number().int().nullable().optional(),
  verificationCodeRequired: z.boolean().nullable().optional(),
  requiresVerificationCode: z.boolean().nullable().optional(),
  verificationLocked: z.boolean().nullable().optional(),
  completionLocked: z.boolean().nullable().optional(),
  parentSettled: z.boolean().nullable().optional(),
  settlementStatus: z.string().nullable().optional(),
  counts: BookingSessionCountsSchema.nullable().optional(),
});

export const ConfirmBookingSessionResponseSchema = BookingSessionMutationResponseSchema;
export const StartBookingSessionJourneyResponseSchema = BookingSessionMutationResponseSchema;
export const ArriveBookingSessionResponseSchema = BookingSessionMutationResponseSchema;
export const StartBookingSessionServiceResponseSchema = BookingSessionMutationResponseSchema;
export const CompleteBookingSessionResponseSchema = BookingSessionMutationResponseSchema;
export const DisputeBookingSessionResponseSchema = BookingSessionMutationResponseSchema;
export const CancelBookingSessionResponseSchema = BookingSessionMutationResponseSchema;
export const MarkBookingSessionNoShowResponseSchema = BookingSessionMutationResponseSchema;

// ============================================
// RATE BOOKING SESSION
// ============================================

export const RateBookingRequestSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
});

export const RateBookingResponseSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema,
  bookingSessionId: uuidSchema,
  rating: z.number().int(),
  comment: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
});

// ============================================
// INFERRED TYPES
// ============================================

export type PatientSummary = z.infer<typeof PatientSummarySchema>;
export type ProviderSummary = z.infer<typeof ProviderSummarySchema>;
export type ServiceSummary = z.infer<typeof ServiceSummarySchema>;
export type BookingLifecycleMetadata = z.infer<typeof BookingLifecycleMetadataSchema>;
export type BookingSessionStatus = z.infer<typeof BookingSessionStatusSchema>;
export type BookingSessionCounts = z.infer<typeof BookingSessionCountsSchema>;
export type BookingLineItemResponse = z.infer<typeof BookingLineItemResponseSchema>;
export type BookingPaymentMethod = z.infer<typeof BookingPaymentMethodSchema>;
export type BookingPaymentMetadata = z.infer<typeof BookingPaymentMetadataSchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
export type BookingListItemResponse = z.infer<typeof BookingListItemResponseSchema>;
export type GetBookingsResponse = z.infer<typeof GetBookingsResponseSchema>;
export type CreateBookingRequest = z.input<typeof CreateBookingRequestSchema>;
export type BookingQuoteRequest = z.input<typeof BookingQuoteRequestSchema>;
export type BookingQuoteResponse = z.infer<typeof BookingQuoteResponseSchema>;
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
export type UpdateBookingRequest = z.infer<typeof UpdateBookingRequestSchema>;
export type UpdateBookingResponse = z.infer<typeof UpdateBookingResponseSchema>;
export type ConfirmBookingResponse = z.infer<typeof ConfirmBookingResponseSchema>;
export type DeclineBookingRequest = z.infer<typeof DeclineBookingRequestSchema>;
export type DeclineBookingResponse = z.infer<typeof DeclineBookingResponseSchema>;
export type CancelBookingResponse = z.infer<typeof CancelBookingResponseSchema>;
export type RateBookingRequest = z.infer<typeof RateBookingRequestSchema>;
export type RateBookingResponse = z.infer<typeof RateBookingResponseSchema>;
export type ProviderDeliveryLocation = z.infer<typeof ProviderDeliveryLocationSchema>;
export type BookingSessionTimeResponse = z.infer<typeof BookingSessionTimeResponseSchema>;
export type BookingSessionParty = z.infer<typeof BookingSessionPartySchema>;
export type BookingSessionService = z.infer<typeof BookingSessionServiceSchema>;
export type BookingSessionLifecycleMetadata = z.infer<typeof BookingSessionLifecycleMetadataSchema>;
export type BookingSessionListItemResponse = z.infer<typeof BookingSessionListItemResponseSchema>;
export type BookingSessionDetailResponse = z.infer<typeof BookingSessionDetailResponseSchema>;
export type GetBookingSessionsResponse = z.infer<typeof GetBookingSessionsResponseSchema>;
export type ProviderSessionDeliveryResponse = z.infer<typeof ProviderSessionDeliveryResponseSchema>;
export type CompleteBookingSessionRequest = z.infer<typeof CompleteBookingSessionRequestSchema>;
export type DisputeBookingSessionRequest = z.infer<typeof DisputeBookingSessionRequestSchema>;
export type CancelBookingSessionRequest = z.infer<typeof CancelBookingSessionRequestSchema>;
export type MarkBookingSessionNoShowRequest = z.infer<typeof MarkBookingSessionNoShowRequestSchema>;
export type BookingSessionMutationResponse = z.infer<typeof BookingSessionMutationResponseSchema>;
export type ConfirmBookingSessionResponse = z.infer<typeof ConfirmBookingSessionResponseSchema>;
export type StartBookingSessionJourneyResponse = z.infer<
  typeof StartBookingSessionJourneyResponseSchema
>;
export type ArriveBookingSessionResponse = z.infer<typeof ArriveBookingSessionResponseSchema>;
export type StartBookingSessionServiceResponse = z.infer<
  typeof StartBookingSessionServiceResponseSchema
>;
export type CompleteBookingSessionResponse = z.infer<typeof CompleteBookingSessionResponseSchema>;
export type DisputeBookingSessionResponse = z.infer<typeof DisputeBookingSessionResponseSchema>;
export type CancelBookingSessionResponse = z.infer<typeof CancelBookingSessionResponseSchema>;
export type MarkBookingSessionNoShowResponse = z.infer<
  typeof MarkBookingSessionNoShowResponseSchema
>;
