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

const OptionalDateTimeSchema = dateTimeSchema
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

export const ProviderPaymentHistoryItemSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema,
  paymentId: OptionalGuidSchema,
  bookingNumber: z.string().trim().min(1),
  patientId: OptionalGuidSchema,
  patientName: z.string().trim().min(1),
  serviceName: z.string().trim().min(1),
  serviceCategory: OptionalStringSchema,
  status: NormalizedTokenSchema,
  amount: z.number(),
  commission: z.number(),
  netAmount: z.number(),
  currency: CurrencyCodeSchema,
  paymentMethod: NormalizedTokenSchema,
  paymentMethodType: OptionalStringSchema,
  paymentReferenceNumber: OptionalStringSchema,
  createdAt: dateTimeSchema,
  processedAt: OptionalDateTimeSchema,
});

export const ProviderPaymentHistoryResponseSchema = paginatedResponseSchema(
  ProviderPaymentHistoryItemSchema,
);

export const ProviderPaymentHistoryStatsSchema = z.object({
  totalRevenue: z.number(),
  pendingAmount: z.number(),
  completedCount: z.number().int(),
  averageTransaction: z.number(),
  currency: CurrencyCodeSchema,
});

export type ProviderPaymentHistoryItem = z.infer<typeof ProviderPaymentHistoryItemSchema>;
export type ProviderPaymentHistoryResponse = z.infer<typeof ProviderPaymentHistoryResponseSchema>;
export type ProviderPaymentHistoryStats = z.infer<typeof ProviderPaymentHistoryStatsSchema>;

export type ProviderPaymentHistoryStatus = ProviderPaymentHistoryItem['status'];
