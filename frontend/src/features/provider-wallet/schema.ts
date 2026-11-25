import { z } from 'zod';

import { paginatedResponseSchema, uuidSchema } from '@/shared/schemas/common';

// ============================================
// ENUMS
// ============================================

export const ProviderWalletPaymentChannelSchema = z.enum(['bank_transfer', 'd17']);

export const ProviderWalletTopUpStatusSchema = z.enum([
  'credited',
  'failed',
  'cancelled',
  'expired',
]);

export const ProviderWalletLedgerDirectionSchema = z.enum(['credit', 'debit']);

export const ProviderWalletLedgerEntryTypeSchema = z.enum([
  'topup_credit',
  'cash_booking_hold',
  'cash_booking_hold_release',
  'cash_booking_debit',
  'admin_adjustment_credit',
  'admin_adjustment_debit',
  'topup_reversal',
]);

export const ProviderWalletMovementTypeSchema = z.enum(['deposit', 'deduction']);

export const ProviderWalletMovementSourceTypeSchema = z.enum(['topup_request', 'wallet_ledger']);

export const ProviderWalletMovementStatusSchema = z.union([
  ProviderWalletTopUpStatusSchema,
  z.literal('completed'),
]);

const CurrencyCodeSchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase());

const OptionalStringSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

const OptionalUuidSchema = z
  .union([uuidSchema, z.string().uuid()])
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

const OptionalDateTimeStringSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

const OptionalTrimmedInputStringSchema = z
  .string()
  .trim()
  .max(500)
  .transform((value) => (value.length ? value : undefined))
  .optional();

const OptionalPaymentChannelSchema = ProviderWalletPaymentChannelSchema.nullable()
  .optional()
  .transform((value) => value ?? undefined);

const OptionalBooleanSchema = z
  .boolean()
  .nullable()
  .transform((value) => value ?? undefined)
  .optional();

// ============================================
// RESPONSES
// ============================================

export const ProviderWalletSummarySchema = z.object({
  reservedBalance: z.number(),
  usableBalance: z.number(),
  currency: CurrencyCodeSchema,
});

export const ProviderWalletStatsSchema = z.object({
  currentMonthDeposits: z.number(),
  currentMonthDeductions: z.number(),
  currency: CurrencyCodeSchema,
  availableYears: z.array(z.number().int()),
});

export const ProviderWalletTopUpRequestSchema = z.object({
  id: uuidSchema,
  topUpNumber: z.string(),
  amount: z.number(),
  currency: CurrencyCodeSchema,
  paymentChannel: ProviderWalletPaymentChannelSchema,
  platformReference: z.string(),
  providerTransferReference: OptionalStringSchema,
  status: ProviderWalletTopUpStatusSchema,
  requestedAt: z.string(),
  markedTransferredAt: OptionalDateTimeStringSchema,
  expiresAt: z.string(),
  paymentId: OptionalUuidSchema,
  paymentStatus: OptionalStringSchema,
  paymentMethodType: OptionalStringSchema,
  paymentReferenceNumber: OptionalStringSchema,
  creditedAt: OptionalDateTimeStringSchema,
  failedAt: OptionalDateTimeStringSchema,
  cancelledAt: OptionalDateTimeStringSchema,
  evidenceUrl: OptionalStringSchema,
});

export const ProviderWalletLedgerEntrySchema = z.object({
  id: uuidSchema,
  entryType: ProviderWalletLedgerEntryTypeSchema,
  amount: z.number(),
  direction: ProviderWalletLedgerDirectionSchema,
  currentBalanceBefore: z.number(),
  currentBalanceAfter: z.number(),
  reservedBalanceBefore: z.number(),
  reservedBalanceAfter: z.number(),
  currency: CurrencyCodeSchema,
  reference: z.string(),
  description: z.string(),
  topUpRequestId: OptionalUuidSchema,
  bookingId: OptionalUuidSchema,
  adminId: OptionalUuidSchema,
  createdAt: z.string(),
});

export const ProviderWalletMovementSchema = z.object({
  id: z.string().min(1),
  type: ProviderWalletMovementTypeSchema,
  status: ProviderWalletMovementStatusSchema,
  amount: z.number(),
  currency: CurrencyCodeSchema,
  occurredAt: z.string(),
  reference: z.string(),
  description: z.string(),
  sourceType: ProviderWalletMovementSourceTypeSchema,
  topUpNumber: OptionalStringSchema,
  paymentChannel: OptionalPaymentChannelSchema,
  providerTransferReference: OptionalStringSchema,
  markedTransferredAt: OptionalDateTimeStringSchema,
  expiresAt: OptionalDateTimeStringSchema,
  canMarkTransferred: OptionalBooleanSchema,
  canCancel: OptionalBooleanSchema,
});

export const ProviderWalletPaginatedMovementsSchema = paginatedResponseSchema(
  ProviderWalletMovementSchema,
);

// ============================================
// INPUTS
// ============================================

export const CreateAndSubmitProviderWalletTopUpInputSchema = z.object({
  amount: z.number().positive(),
  currency: CurrencyCodeSchema,
  paymentChannel: ProviderWalletPaymentChannelSchema,
  providerTransferReference: z.string().trim().min(1).max(120),
  evidenceUrl: OptionalTrimmedInputStringSchema,
});

// ============================================
// INFERRED TYPES
// ============================================

export type ProviderWalletPaymentChannel = z.infer<typeof ProviderWalletPaymentChannelSchema>;
export type ProviderWalletTopUpStatus = z.infer<typeof ProviderWalletTopUpStatusSchema>;
export type ProviderWalletLedgerDirection = z.infer<typeof ProviderWalletLedgerDirectionSchema>;
export type ProviderWalletLedgerEntryType = z.infer<typeof ProviderWalletLedgerEntryTypeSchema>;
export type ProviderWalletMovementType = z.infer<typeof ProviderWalletMovementTypeSchema>;
export type ProviderWalletMovementSourceType = z.infer<
  typeof ProviderWalletMovementSourceTypeSchema
>;
export type ProviderWalletMovementStatus = z.infer<typeof ProviderWalletMovementStatusSchema>;
export type ProviderWalletSummary = z.infer<typeof ProviderWalletSummarySchema>;
export type ProviderWalletStats = z.infer<typeof ProviderWalletStatsSchema>;
export type ProviderWalletTopUpRequest = z.infer<typeof ProviderWalletTopUpRequestSchema>;
export type ProviderWalletLedgerEntry = z.infer<typeof ProviderWalletLedgerEntrySchema>;
export type ProviderWalletMovement = z.infer<typeof ProviderWalletMovementSchema>;
export type ProviderWalletPaginatedMovements = z.infer<
  typeof ProviderWalletPaginatedMovementsSchema
>;
export type CreateAndSubmitProviderWalletTopUpInput = z.infer<
  typeof CreateAndSubmitProviderWalletTopUpInputSchema
>;
