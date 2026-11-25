/**
 * Common Schemas
 * Zod schemas for shared/foundational types used across multiple domains.
 * Matches the .NET backend serialization of DateOnly, TimeOnly, TimeSpan, etc.
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

/** .NET DayOfWeek enum (0=Sunday, 6=Saturday) */
export const DayOfWeekSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

/**
 * DocumentType integer enum (0-9).
 * Exact meanings TBD from backend — schema enforces valid range.
 */
export const DocumentTypeSchema = z.number().int().min(0).max(9);

/**
 * RetentionPolicy integer enum (0-3).
 * 0 = Indefinite, 1-3 = time-bound policies.
 */
export const RetentionPolicySchema = z.number().int().min(0).max(3);

// ============================================
// USER ENUMS
// ============================================

/** User role — shared across auth, admin, and display contexts. */
export const UserRoleSchema = z.enum(['patient', 'provider', 'admin', 'super_admin']);

/** User segment — behavioral cohort for analytics and targeting. */
export const UserSegmentSchema = z.enum(['vip', 'active', 'occasional', 'inactive', 'at_risk']);

/** User account status. */
export const UserStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);

// ============================================
// .NET DATE/TIME TYPES
// ============================================

/**
 * .NET DateOnly serialization.
 * Serialized as { year, month, day, dayOfWeek, dayOfYear, dayNumber }.
 */
export const DateOnlySchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  dayOfWeek: DayOfWeekSchema.optional(),
  dayOfYear: z.number().int().optional(),
  dayNumber: z.number().int().optional(),
});

/**
 * .NET TimeOnly serialization.
 * Serialized as { hour, minute, second, millisecond, microsecond, nanosecond, ticks }.
 */
export const TimeOnlySchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  second: z.number().int().optional(),
  millisecond: z.number().int().optional(),
  microsecond: z.number().int().optional(),
  nanosecond: z.number().int().optional(),
  ticks: z.number().int().optional(),
});

/**
 * .NET TimeSpan serialization.
 * Contains both the canonical `ticks` and computed convenience fields.
 */
export const TimeSpanSchema = z.object({
  ticks: z.number().int(),
  days: z.number().int().optional(),
  hours: z.number().int().optional(),
  milliseconds: z.number().int().optional(),
  microseconds: z.number().int().optional(),
  nanoseconds: z.number().int().optional(),
  minutes: z.number().int().optional(),
  seconds: z.number().int().optional(),
  totalDays: z.number().optional(),
  totalHours: z.number().optional(),
  totalMilliseconds: z.number().optional(),
  totalMicroseconds: z.number().optional(),
  totalNanoseconds: z.number().optional(),
  totalMinutes: z.number().optional(),
  totalSeconds: z.number().optional(),
});

// ============================================
// PAGINATION
// ============================================

/** Common pagination metadata returned by paginated endpoints. */
export const PaginationMetadataSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});

/**
 * Creates a paginated response schema for a given item schema.
 * Shape: { items: T[], pagination: PaginationMetadata }
 */
export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).nullable().optional(),
    pagination: PaginationMetadataSchema,
  });
}

// ============================================
// LEGACY PAGINATION (types/index.ts compat)
// ============================================

/**
 * Legacy Pagination shape with hasNext/hasPrev.
 * PaginationMetadata (from Zod) lacks these — keep both for backward compat.
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Generic paginated response using the legacy Pagination shape. */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

/** Common pagination query parameters. */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// ADDRESS (shared across booking requests/responses)
// ============================================

export const AddressSchema = z.object({
  line1: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
});

// ============================================
// HELPER: UUID STRING
// ============================================

/**
 * GUID/UUID string validator.
 * Accepts any 8-4-4-4-12 hex string (the format .NET serializes for System.Guid).
 * Zod's built-in z.string().uuid() enforces RFC 4122 version+variant bits,
 * which rejects synthetic/sequential GUIDs commonly used in seed data.
 */
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Invalid GUID format',
  );

/** Nullable GUID */
export const nullableUuid = uuidSchema.nullable().optional();

// ============================================
// HELPER: ISO DATE-TIME STRING
// ============================================

/** ISO 8601 datetime string (what .NET serializes for DateTime/DateTimeOffset) */
export const dateTimeSchema = z.string().datetime({ offset: true }).or(z.string().datetime());

/** Nullable datetime */
export const nullableDateTime = dateTimeSchema.nullable().optional();

// ============================================
// .NET RESPONSE UNION SCHEMAS
// ============================================
// System.Text.Json may serialize these as ISO strings instead of structured objects.
// These unions accept both the object form (MSW mock data) and the string form (real backend).

/** TimeSpan — accepts `{ ticks, ... }` (MSW) or `"HH:mm:ss"` / `"d.HH:mm:ss"` (backend) */
export const TimeSpanResponseSchema = z.union([TimeSpanSchema, z.string()]);

/** DateOnly — accepts `{ year, month, day }` (MSW) or `"yyyy-MM-dd"` (backend) */
export const DateOnlyResponseSchema = z.union([DateOnlySchema, z.string()]);

/** Nullable DateOnly — accepts "YYYY-MM-DD" (backend), { year, month, day } (MSW), or null */
export const nullableDateOnlyResponse = DateOnlyResponseSchema.nullable().optional();

/** TimeOnly — accepts `{ hour, minute, ... }` (MSW) or `"HH:mm:ss"` (backend) */
export const TimeOnlyResponseSchema = z.union([TimeOnlySchema, z.string()]);

// ============================================
// INFERRED TYPES
// ============================================

export type DateOnly = z.infer<typeof DateOnlySchema>;
export type TimeOnly = z.infer<typeof TimeOnlySchema>;
export type TimeSpan = z.infer<typeof TimeSpanSchema>;
export type DateOnlyResponse = z.infer<typeof DateOnlyResponseSchema>;
export type TimeOnlyResponse = z.infer<typeof TimeOnlyResponseSchema>;
export type TimeSpanResponse = z.infer<typeof TimeSpanResponseSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserSegment = z.infer<typeof UserSegmentSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
