/**
 * Patient Schemas
 * Zod schemas for patient-related DTOs.
 * Matches: MyPatientProfileResponse, PatientStatsResponse,
 *          PatientPreferencesResponse, UpdatePatientProfileRequest,
 *          UpdatePatientPreferencesRequest, EmergencyContactDto,
 *          FamilyMemberResponse, AddFamilyMemberRequest,
 *          FavoriteProviderDto, PatientFavoriteResponse,
 *          PatientFavoriteSlimResponse, AddFavoriteRequest
 */

import { z } from 'zod';
import {
  uuidSchema,
  dateTimeSchema,
  DateOnlySchema,
  DateOnlyResponseSchema,
} from '@/shared/schemas/common';

// ============================================
// EMERGENCY CONTACT
// ============================================

export const EmergencyContactDtoSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
});

// ============================================
// PATIENT PROFILE (authenticated patient)
// ============================================

export const MyPatientProfileResponseSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: DateOnlyResponseSchema.nullable().optional(),
  gender: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  emergencyContact: EmergencyContactDtoSchema.optional(),
  medicalHistory: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  currentMedications: z.string().nullable().optional(),
  insuranceProvider: z.string().nullable().optional(),
  insuranceNumber: z.string().nullable().optional(),
  profilePictureUrl: z.string().nullable().optional(),
  updatedAt: dateTimeSchema,
});

// ============================================
// PATIENT STATS
// ============================================

export const PatientStatsResponseSchema = z.object({
  totalAppointments: z.number().int(),
  completedAppointments: z.number().int(),
  upcomingAppointments: z.number().int(),
  totalSpent: z.number(),
  careStreakDays: z.number().int(),
  longestStreak: z.number().int(),
  totalPoints: z.number().int(),
  badgesEarned: z.number().int(),
  lastAppointmentDate: z.string().nullable().optional(),
  favoriteProviders: z.number().int(),
});

// ============================================
// PATIENT PREFERENCES
// ============================================

export const PatientPreferencesResponseSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  autoValidationEnabled: z.boolean(),
  validationReminderHours: z.number().int(),
  shareWithFamily: z.boolean(),
  allowProviderMessages: z.boolean(),
  updatedAt: dateTimeSchema,
});

// ============================================
// UPDATE PATIENT PROFILE
// ============================================

export const UpdatePatientProfileRequestSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: DateOnlySchema.optional(),
  gender: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhone: z.string().nullable().optional(),
  emergencyContactRelationship: z.string().nullable().optional(),
  medicalHistory: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  currentMedications: z.string().nullable().optional(),
  insuranceProvider: z.string().nullable().optional(),
  insuranceNumber: z.string().nullable().optional(),
});

// ============================================
// FAMILY CIRCLE
// ============================================

export const FamilyMemberResponseSchema = z.object({
  id: uuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  email: z.string().nullable().optional(),
  dateOfBirth: DateOnlyResponseSchema.nullable().optional(),
  gender: z.string().nullable().optional(),
  medicalHistory: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  currentMedications: z.string().nullable().optional(),
  addedAt: dateTimeSchema,
});

export const AddFamilyMemberRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  email: z.string().email().nullable().optional(),
  dateOfBirth: DateOnlySchema.nullable().optional(),
  gender: z.string().nullable().optional(),
  medicalHistory: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  currentMedications: z.string().nullable().optional(),
});

// ============================================
// FAVORITE PROVIDERS
// ============================================

export const FavoriteProviderDtoSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  serviceType: z.string().nullable().optional(),
  specialties: z.array(z.string()),
  rating: z.number(),
  reviewCount: z.number().int(),
  profilePictureUrl: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});

export const PatientFavoriteResponseSchema = z.object({
  provider: FavoriteProviderDtoSchema,
  addedAt: dateTimeSchema,
});

export const PatientFavoriteSlimResponseSchema = z.object({
  providerId: uuidSchema,
  addedAt: dateTimeSchema,
});

export const AddFavoriteRequestSchema = z.object({
  providerId: uuidSchema,
});

// ============================================
// UPDATE PATIENT PREFERENCES
// ============================================

export const UpdatePatientPreferencesRequestSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  autoValidationEnabled: z.boolean().optional(),
  validationReminderHours: z.number().int().optional(),
  shareWithFamily: z.boolean().optional(),
  allowProviderMessages: z.boolean().optional(),
});

// ============================================
// PATIENT PROFILE FORM SCHEMAS
// ============================================

export const PatientAccountFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string(),
});

export const PatientProfileFormSchema = z.object({
  medicalHistory: z.string(),
  allergies: z.string(),
  currentMedications: z.string(),
  insuranceProvider: z.string(),
  insuranceNumber: z.string(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  emergencyContactRelationship: z.string(),
});

export const PatientPreferencesFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  autoValidationEnabled: z.boolean(),
  shareWithFamily: z.boolean(),
  allowProviderMessages: z.boolean(),
});

// ============================================
// PENDING VALIDATION
// ============================================

export const PendingValidationSchema = z.object({
  id: z.string(),
  providerName: z.string(),
  providerImage: z.string(),
  serviceName: z.string(),
  amount: z.number(),
  date: z.string(),
  time: z.string(),
  hoursAgo: z.number(),
  autoValidationIn: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type PendingValidation = z.infer<typeof PendingValidationSchema>;
export type EmergencyContactDto = z.infer<typeof EmergencyContactDtoSchema>;
export type MyPatientProfileResponse = z.infer<typeof MyPatientProfileResponseSchema>;
export type PatientStatsResponse = z.infer<typeof PatientStatsResponseSchema>;
export type PatientPreferencesResponse = z.infer<typeof PatientPreferencesResponseSchema>;
export type UpdatePatientProfileRequest = z.infer<typeof UpdatePatientProfileRequestSchema>;
export type PatientAccountFormValues = z.infer<typeof PatientAccountFormSchema>;
export type PatientProfileFormValues = z.infer<typeof PatientProfileFormSchema>;
export type PatientPreferencesFormValues = z.infer<typeof PatientPreferencesFormSchema>;
export type FamilyMemberResponse = z.infer<typeof FamilyMemberResponseSchema>;
export type AddFamilyMemberRequest = z.infer<typeof AddFamilyMemberRequestSchema>;
export type FavoriteProviderDto = z.infer<typeof FavoriteProviderDtoSchema>;
export type PatientFavoriteResponse = z.infer<typeof PatientFavoriteResponseSchema>;
export type PatientFavoriteSlimResponse = z.infer<typeof PatientFavoriteSlimResponseSchema>;
export type AddFavoriteRequest = z.infer<typeof AddFavoriteRequestSchema>;
export type UpdatePatientPreferencesRequest = z.infer<typeof UpdatePatientPreferencesRequestSchema>;
