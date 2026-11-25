import { z } from 'zod';

export const APP_FEATURE_CODES = {
  bookingPaymentCard: 'booking_payment_card',
  bookingPaymentD17: 'booking_payment_d17',
  familyCircle: 'family_circle',
  healthConcierge: 'health_concierge',
  healthTracking: 'health_tracking',
  medicineDonation: 'medicine_donation',
} as const;

export const KNOWN_APP_FEATURE_CODES = Object.values(APP_FEATURE_CODES);

export type KnownAppFeatureCode = (typeof APP_FEATURE_CODES)[keyof typeof APP_FEATURE_CODES];

export const AppFeatureSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  displayOrder: z.number().int(),
});

export const AppFeatureListSchema = z.array(AppFeatureSchema);

export type AppFeature = z.infer<typeof AppFeatureSchema>;
export type AppFeatureCode = AppFeature['code'];
