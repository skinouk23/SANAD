import { z } from 'zod';

import { dateTimeSchema, paginatedResponseSchema, uuidSchema } from '@/shared/schemas/common';

const NormalizedTokenSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.toLowerCase());

const CurrencyCodeSchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase());

const OptionalStringSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  });

const OptionalGuidSchema = uuidSchema
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

export const FinanceTimelineItemSchema = z.object({
  id: uuidSchema,
  type: NormalizedTokenSchema,
  direction: NormalizedTokenSchema,
  status: NormalizedTokenSchema,
  amount: z.number(),
  currency: CurrencyCodeSchema,
  title: z.string().trim().min(1),
  description: OptionalStringSchema,
  occurredAt: dateTimeSchema,
  createdAt: dateTimeSchema,
  sourceType: NormalizedTokenSchema,
  sourceId: uuidSchema,
  providerId: OptionalGuidSchema,
  patientId: OptionalGuidSchema,
  bookingId: OptionalGuidSchema,
  paymentId: OptionalGuidSchema,
  paymentAttemptId: OptionalGuidSchema,
  providerWalletTopUpId: OptionalGuidSchema,
  ledgerTransactionId: OptionalGuidSchema,
  referenceNumber: OptionalStringSchema,
});

export const FinanceTimelineResponseSchema = paginatedResponseSchema(FinanceTimelineItemSchema);

export type FinanceTimelineItem = z.infer<typeof FinanceTimelineItemSchema>;
export type FinanceTimelineResponse = z.infer<typeof FinanceTimelineResponseSchema>;
