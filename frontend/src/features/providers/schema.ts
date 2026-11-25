/**
 * Provider Schemas
 * Zod schemas for provider-related DTOs.
 * Matches: ProviderResponse, ProviderProfileResponse, ProviderDashboardResponse,
 *          ProviderAvailabilityResponse, UpdateProviderAvailabilityRequest/Response,
 *          ProviderAvailabilityHistoryDto
 */

import { z } from 'zod';
import {
  DayOfWeekSchema,
  uuidSchema,
  nullableUuid,
  dateTimeSchema,
  nullableDateTime,
  DateOnlyResponseSchema,
  TimeOnlyResponseSchema,
  PaginationMetadataSchema,
  paginatedResponseSchema,
} from '@/shared/schemas/common';
import {
  BookingPaymentMethodSchema,
  BookingSessionCountsSchema,
  BookingSessionStatusSchema,
  BookingSessionTimeResponseSchema,
  BookingSessionListItemResponseSchema,
} from '@/features/bookings/schema';

import { NUTRITION_PROVIDER_SUBTYPE_VALUES } from './providerAuthoring';

// ============================================
// SHARED ENUMS
// ============================================

export const NutritionProviderSubtypeSchema = z.enum(NUTRITION_PROVIDER_SUBTYPE_VALUES);

export const ProviderVerificationStatusSchema = z.enum([
  'not_requested',
  'requested',
  'ai_prechecked',
  'approved',
  'rejected',
]);

const optionalProviderVerificationStatusSchema = z.preprocess(
  (value) => (value === '' ? null : value),
  ProviderVerificationStatusSchema.nullable().optional(),
);

const nullableProviderDateTimeSchema = z.preprocess(
  (value) => (value === '' ? null : value),
  nullableDateTime,
);

const ProviderVerificationStateFieldsSchema = z.object({
  isVerified: z.boolean().optional(),
  verificationConsentGiven: z.boolean().optional(),
  verificationStatus: optionalProviderVerificationStatusSchema,
  verificationRequestedAt: nullableProviderDateTimeSchema,
  verificationReviewedAt: nullableProviderDateTimeSchema,
  canRequestVerification: z.boolean().optional(),
});

// ============================================
// PROVIDER RESPONSE (public/listing)
// ============================================

export const ProviderResponseSchema = z.object({
  id: uuidSchema,
  serviceCategory: z.string().nullable().optional(),
  nutritionProviderSubtype: NutritionProviderSubtypeSchema.nullable().optional(),
  isIndividual: z.boolean(),
  businessName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  addressLine1: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  countryCode: z.string().nullable().optional(),
  ratingAverage: z.number(),
  ratingCount: z.number().int(),
  isVerified: z.boolean(),
  verificationConsentGiven: z.boolean().optional(),
  verificationStatus: optionalProviderVerificationStatusSchema,
  verificationRequestedAt: nullableProviderDateTimeSchema,
  verificationReviewedAt: nullableProviderDateTimeSchema,
  canRequestVerification: z.boolean().optional(),
  isAvailable: z.boolean(),
  availabilityStatus: z.string().nullable().optional(),
  profilePictureUrl: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
  minPrice: z.number().nullable().optional(),
  serviceCount: z.number().int().optional(),
  specialties: z.array(z.string()).optional().default([]),
});

export const ProviderFilterOptionsResponseSchema = z.object({
  cities: z.array(z.string()),
  specialties: z.array(z.string()),
  nutritionProviderSubtypes: z.array(z.string()),
});

// ============================================
// PROVIDER DETAIL (public/detail)
// ============================================

export const ProviderDetailResponseSchema = ProviderResponseSchema.extend({
  yearsOfExperience: z.number().int(),
  phone: z.string().nullable().optional(),
});

// ============================================
// PROVIDER PROFILE (authenticated provider's own)
// ============================================

export const ProviderProfileResponseSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  serviceType: z.string().nullable().optional(),
  nutritionProviderSubtype: NutritionProviderSubtypeSchema.nullable().optional(),
  businessName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  licenseNumber: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
  yearsOfExperience: z.number().int(),
  bio: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  serviceRadius: z.number().int(),
  rating: z.number(),
  totalReviews: z.number().int(),
  totalBookings: z.number().int(),
  isApproved: z.boolean(),
  isVerified: z.boolean().optional(),
  verificationConsentGiven: z.boolean().optional(),
  verificationStatus: optionalProviderVerificationStatusSchema,
  verificationRequestedAt: nullableProviderDateTimeSchema,
  verificationReviewedAt: nullableProviderDateTimeSchema,
  canRequestVerification: z.boolean().optional(),
  approvalDate: nullableDateTime,
  subscriptionTier: z.string().nullable().optional(),
  profilePictureUrl: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  isOnline: z.boolean(),
  responseRate: z.number(),
  averageResponseTimeMinutes: z.number().int(),
  completionRate: z.number(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

// ============================================
// PROVIDER DASHBOARD
// ============================================

export const ProviderDashboardProviderInfoSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  providerType: z.string().nullable().optional(),
  specialties: z.array(z.string()).nullable().optional(),
  rating: z.number(),
  reviewCount: z.number().int(),
  available: z.boolean(),
  isVerified: z.boolean().optional(),
  verificationConsentGiven: z.boolean().optional(),
  verificationStatus: optionalProviderVerificationStatusSchema,
  verificationRequestedAt: nullableProviderDateTimeSchema,
  verificationReviewedAt: nullableProviderDateTimeSchema,
  canRequestVerification: z.boolean().optional(),
  subscriptionTier: z.string().nullable().optional(),
  availableBalance: z.number(),
});

export const ProviderVerificationRequestResponseSchema =
  ProviderVerificationStateFieldsSchema.extend({
    providerId: uuidSchema.optional(),
  });

export const ProviderDashboardAppointmentStatsSchema = z.object({
  todayCount: z.number().int(),
  weekCount: z.number().int(),
  completionRate: z.number(),
});

export const ProviderDashboardRevenueStatsSchema = z.object({
  thisWeekRevenue: z.number(),
  thisMonthRevenue: z.number(),
});

export const ProviderDashboardResponseSchema = z.object({
  provider: ProviderDashboardProviderInfoSchema.optional(),
  appointmentStats: ProviderDashboardAppointmentStatsSchema.optional(),
  revenueStats: ProviderDashboardRevenueStatsSchema.optional(),
});

// ============================================
// PROVIDER AVAILABILITY
// ============================================

export const ProviderAvailabilityIntervalSchema = z.object({
  startTime: TimeOnlyResponseSchema,
  endTime: TimeOnlyResponseSchema,
});

export const ProviderAvailabilityResponseSchema = z.object({
  providerId: uuidSchema,
  date: DateOnlyResponseSchema,
  availableSlots: z.array(z.string()).nullable().optional(),
  unavailableSlots: z.array(z.string()).nullable().optional(),
  availableIntervals: z.array(ProviderAvailabilityIntervalSchema).nullable().optional(),
  unavailableIntervals: z.array(ProviderAvailabilityIntervalSchema).nullable().optional(),
  unavailableDates: z.array(DateOnlyResponseSchema).nullable().optional(),
  timezone: z.string().optional(),
});

export const ProviderRangeAvailabilityResponseSchema = z.object({
  providerId: uuidSchema,
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dayCount: z.number().int(),
  dailyDurationMinutes: z.number().int(),
  availableStartTimes: z.array(z.string()).nullable().optional(),
  availableIntervals: z.array(ProviderAvailabilityIntervalSchema).nullable().optional(),
  unavailableIntervals: z.array(ProviderAvailabilityIntervalSchema).nullable().optional(),
  timezone: z.string().optional(),
});

export const ProviderMonthAvailabilityDayResponseSchema = z.object({
  date: DateOnlyResponseSchema,
  slotCount: z.number().int(),
});

export const ProviderMonthAvailabilityResponseSchema = z.object({
  providerId: uuidSchema,
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  dailyDurationMinutes: z.number().int(),
  timezone: z.string(),
  maxBookableDate: z.string().nullable().optional(),
  days: z.array(ProviderMonthAvailabilityDayResponseSchema),
});

export const UpdateProviderAvailabilityRequestSchema = z.object({
  available: z.boolean(),
});

export const UpdateProviderAvailabilityResponseSchema = z.object({
  id: uuidSchema,
  available: z.boolean(),
  updatedAt: dateTimeSchema,
});

// ============================================
// PROVIDER SELF-SERVICE PLANNING
// ============================================

export const ProviderScheduleIntervalSchema = z.object({
  id: uuidSchema,
  dayOfWeek: DayOfWeekSchema,
  serviceId: nullableUuid,
  startTime: TimeOnlyResponseSchema,
  endTime: TimeOnlyResponseSchema,
});

export const UpsertProviderScheduleIntervalSchema = z.object({
  id: uuidSchema.optional(),
  dayOfWeek: DayOfWeekSchema,
  serviceId: nullableUuid,
  startTime: TimeOnlyResponseSchema,
  endTime: TimeOnlyResponseSchema,
});

export const ProviderUnavailabilityResponseSchema = z.object({
  id: uuidSchema,
  startDatetime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/)
    .or(dateTimeSchema),
  endDatetime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/)
    .or(dateTimeSchema),
  isAllDay: z.boolean(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const CreateProviderUnavailabilityRequestSchema = z.object({
  startDatetime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/)
    .or(dateTimeSchema),
  endDatetime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/)
    .or(dateTimeSchema),
  isAllDay: z.boolean(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateProviderUnavailabilityRequestSchema =
  CreateProviderUnavailabilityRequestSchema.partial();

export const ProviderPlanningBookingServiceSchema = z.object({
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export const ProviderPlanningBookingPatientSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const ProviderPlanningBookingResponseSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema,
  bookingNumber: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  sessionId: uuidSchema,
  sessionStatus: BookingSessionStatusSchema.nullable().optional(),
  paymentMethod: BookingPaymentMethodSchema.nullable().optional(),
  paymentId: uuidSchema.nullable().optional(),
  paymentStatus: z.string().nullable().optional(),
  paymentMethodType: z.string().nullable().optional(),
  paymentReferenceNumber: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  scheduledAt: dateTimeSchema,
  startDate: DateOnlyResponseSchema,
  endDate: DateOnlyResponseSchema,
  dailyStartTime: BookingSessionTimeResponseSchema,
  dailyEndTime: BookingSessionTimeResponseSchema.nullable().optional(),
  dailyDurationMinutes: z.number().int().nullable().optional(),
  dayCount: z.number().int(),
  totalAmount: z.number(),
  currency: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  service: ProviderPlanningBookingServiceSchema.nullable().optional(),
  patient: ProviderPlanningBookingPatientSchema.nullable().optional(),
  providerAmount: z.number().nullable().optional(),
  autoValidateAt: nullableDateTime,
  providerAcceptedAt: nullableDateTime,
  providerDepartedAt: nullableDateTime,
  providerArrivedAt: nullableDateTime,
  serviceStartedAt: nullableDateTime,
  serviceCompletedAt: nullableDateTime,
  validatedAt: nullableDateTime,
  cancelledAt: nullableDateTime,
  cancelledBy: nullableUuid,
  cancellationReason: z.string().nullable().optional(),
  noShowAt: nullableDateTime,
  noShowReason: z.string().nullable().optional(),
  statusChangedBy: nullableUuid,
  statusChangeReason: z.string().nullable().optional(),
  totalSessions: z.number().int().nullable().optional(),
  confirmedSessions: z.number().int().nullable().optional(),
  inProgressSessions: z.number().int().nullable().optional(),
  validatedSessions: z.number().int().nullable().optional(),
  cancelledSessions: z.number().int().nullable().optional(),
  disputedSessions: z.number().int().nullable().optional(),
  noShowSessions: z.number().int().nullable().optional(),
  remainingSessions: z.number().int().nullable().optional(),
  sessionCounts: BookingSessionCountsSchema.nullable().optional(),
  sessions: z.array(BookingSessionListItemResponseSchema).nullable().optional(),
});

export const ProviderPlanningResponseSchema = z.object({
  timezone: z.string(),
  isOnline: z.boolean(),
  availabilityStatus: z.string(),
  schedules: z.array(ProviderScheduleIntervalSchema),
  unavailabilities: z.array(ProviderUnavailabilityResponseSchema),
  bookings: z.array(ProviderPlanningBookingResponseSchema),
});

// ============================================
// PROVIDER AVAILABILITY HISTORY
// ============================================

export const ProviderAvailabilityHistoryDtoSchema = z.object({
  id: uuidSchema,
  providerId: uuidSchema,
  isAvailable: z.boolean(),
  statusChangedAt: dateTimeSchema,
  reason: z.string().nullable().optional(),
  changedBy: uuidSchema,
});

export const ProviderAvailabilityHistoryResponseSchema = z.object({
  items: z.array(ProviderAvailabilityHistoryDtoSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// UPDATE PROVIDER PROFILE
// ============================================

export const UpdateMyProviderProfileRequestSchema = z.object({
  businessName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
  nutritionProviderSubtype: NutritionProviderSubtypeSchema.nullable().optional(),
  bio: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  serviceRadius: z.number().int().nullable().optional(),
});

// ============================================
// PROVIDER PROFILE FORM SCHEMAS
// ============================================

export const ProviderAccountFormSchema = z.object({
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

export const ProviderProfileFormSchema = z.object({
  businessName: z.string(),
  specialization: z.string(),
  nutritionProviderSubtype: z.string(),
  bio: z.string(),
  serviceRadius: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;
export type ProviderFilterOptionsResponse = z.infer<typeof ProviderFilterOptionsResponseSchema>;
export type ProviderDetailResponse = z.infer<typeof ProviderDetailResponseSchema>;
export type ProviderProfileResponse = z.infer<typeof ProviderProfileResponseSchema>;
export type ProviderDashboardResponse = z.infer<typeof ProviderDashboardResponseSchema>;
export type ProviderVerificationStatus = z.infer<typeof ProviderVerificationStatusSchema>;
export type ProviderVerificationRequestResponse = z.infer<
  typeof ProviderVerificationRequestResponseSchema
>;
export type ProviderAvailabilityInterval = z.infer<typeof ProviderAvailabilityIntervalSchema>;
export type ProviderAvailabilityResponse = z.infer<typeof ProviderAvailabilityResponseSchema>;
export type ProviderRangeAvailabilityResponse = z.infer<
  typeof ProviderRangeAvailabilityResponseSchema
>;
export type ProviderMonthAvailabilityDayResponse = z.infer<
  typeof ProviderMonthAvailabilityDayResponseSchema
>;
export type ProviderMonthAvailabilityResponse = z.infer<
  typeof ProviderMonthAvailabilityResponseSchema
>;
export type UpdateProviderAvailabilityRequest = z.infer<
  typeof UpdateProviderAvailabilityRequestSchema
>;
export type UpdateProviderAvailabilityResponse = z.infer<
  typeof UpdateProviderAvailabilityResponseSchema
>;
export type ProviderScheduleInterval = z.infer<typeof ProviderScheduleIntervalSchema>;
export type UpsertProviderScheduleInterval = z.infer<typeof UpsertProviderScheduleIntervalSchema>;
export type ProviderUnavailabilityResponse = z.infer<typeof ProviderUnavailabilityResponseSchema>;
export type CreateProviderUnavailabilityRequest = z.infer<
  typeof CreateProviderUnavailabilityRequestSchema
>;
export type UpdateProviderUnavailabilityRequest = z.infer<
  typeof UpdateProviderUnavailabilityRequestSchema
>;
export type ProviderPlanningBookingResponse = z.infer<typeof ProviderPlanningBookingResponseSchema>;
export type ProviderPlanningResponse = z.infer<typeof ProviderPlanningResponseSchema>;
export type ProviderAvailabilityHistoryDto = z.infer<typeof ProviderAvailabilityHistoryDtoSchema>;
export type UpdateMyProviderProfileRequest = z.infer<typeof UpdateMyProviderProfileRequestSchema>;
export type ProviderAccountFormValues = z.infer<typeof ProviderAccountFormSchema>;
export type ProviderProfileFormValues = z.infer<typeof ProviderProfileFormSchema>;

// ============================================
// PROVIDER SCHEDULE SLOT
// ============================================

export const ProviderScheduleSlotSchema = z.object({
  date: z.string(),
  availableSlots: z.array(z.string()),
  availableIntervals: z.array(ProviderAvailabilityIntervalSchema).nullable().optional(),
});

// ============================================
// PAGINATED PROVIDERS (public listing)
// ============================================

export const PaginatedProvidersSchema = paginatedResponseSchema(ProviderResponseSchema);

// ============================================
// ADDITIONAL INFERRED TYPES
// ============================================

export type ProviderScheduleSlot = z.infer<typeof ProviderScheduleSlotSchema>;
export type PaginatedProviders = z.infer<typeof PaginatedProvidersSchema>;
