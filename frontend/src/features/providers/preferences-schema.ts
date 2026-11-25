import { z } from 'zod';
import { dateTimeSchema } from '@/shared/schemas/common';

// ============================================
// PROVIDER PREFERENCES
// ============================================

export const ProviderPreferencesResponseSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  allowPatientMessages: z.boolean(),
  profileVisibility: z.string(),
  updatedAt: dateTimeSchema,
});

export const UpdateProviderPreferencesRequestSchema = z.object({
  emailNotifications: z.boolean().nullable().optional(),
  smsNotifications: z.boolean().nullable().optional(),
  pushNotifications: z.boolean().nullable().optional(),
  marketingEmails: z.boolean().nullable().optional(),
  allowPatientMessages: z.boolean().nullable().optional(),
  profileVisibility: z.string().nullable().optional(),
});

export const ProviderPreferencesFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  allowPatientMessages: z.boolean(),
  profileVisibility: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type ProviderPreferencesResponse = z.infer<typeof ProviderPreferencesResponseSchema>;
export type UpdateProviderPreferencesRequest = z.infer<
  typeof UpdateProviderPreferencesRequestSchema
>;
export type ProviderPreferencesFormValues = z.infer<typeof ProviderPreferencesFormSchema>;
