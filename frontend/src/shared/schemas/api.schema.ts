/**
 * API Response Schemas
 * Zod schemas for the standard API response envelope.
 * Matches the .NET backend's ApiResponse<T> wrapper.
 */

import { z } from 'zod';
import { env } from '@/config/env';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';

// ============================================
// API RESPONSE ENVELOPE
// ============================================

/**
 * Creates a typed ApiResponse<T> schema for a given data schema.
 * The backend wraps every response in: { success, message, data, errors }
 */
export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    message: z.string().nullable().optional(),
    data: dataSchema,
    errors: z.record(z.string(), z.array(z.string()).nullable()).nullable().optional(),
  });
}

/**
 * ApiResponse with unknown/any data (for error responses or untyped endpoints).
 */
export const ObjectApiResponseSchema = apiResponseSchema(z.unknown().nullable());

// ============================================
// API ERROR
// ============================================

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  /** Field-level validation errors from the backend (fixes #9). */
  errors: z.record(z.string(), z.array(z.string()).nullable()).nullable().optional(),
  statusCode: z.number().int(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data: T;
  errors?: Record<string, string[] | null> | null;
};

export type ApiError = z.infer<typeof ApiErrorSchema>;

export function parseSchemaOrThrow<T>(schema: z.ZodType<T>, data: unknown, context: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      runtimeDiagnostics.captureSchemaParseFailure(error, {
        context,
        source: 'schema.parse',
      });
    }

    throw error;
  }
}

// ============================================
// SAFE PARSE HELPER
// ============================================

/**
 * Validates data against a Zod schema at runtime.
 * - In development: logs detailed warnings on validation failure
 * - Always returns the original data (cast to T) so the app doesn't break
 * - Use this in service functions where the backend shape may not yet
 *   perfectly match the Zod schema (transition period)
 *
 * For endpoints where we are confident the schema is correct, use
 * `schema.parse(data)` directly instead.
 */
export function safeParseResponse<T>(schema: z.ZodTypeAny, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    runtimeDiagnostics.captureSchemaParseFailure(result.error, {
      context,
      source: 'schema.safeParse',
    });

    if (env.ENABLE_DEBUG_MODE) {
      console.warn(`[Zod] Validation failed for ${context}:`, result.error.issues);
    }
    // Return raw data so the app keeps working during transition
    return data as T;
  }
  return result.data as T;
}
