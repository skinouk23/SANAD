/**
 * Review Schemas
 * Zod schemas for review-related DTOs.
 * Matches: ProviderReviewDto, ReviewSummaryDto, ProviderReviewsResponse, PatientBriefDto
 */

import { z } from 'zod';
import {
  uuidSchema,
  dateTimeSchema,
  nullableDateTime,
  PaginationMetadataSchema,
} from '@/shared/schemas/common';

// ============================================
// PATIENT BRIEF (nested in reviews)
// ============================================

export const PatientBriefDtoSchema = z.object({
  name: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

// ============================================
// PROVIDER REVIEW
// ============================================

export const ProviderReviewDtoSchema = z.object({
  id: uuidSchema,
  bookingId: uuidSchema,
  patientId: uuidSchema,
  patient: PatientBriefDtoSchema.optional(),
  rating: z.number().int(),
  comment: z.string().nullable().optional(),
  professionalismRating: z.number().int().nullable().optional(),
  punctualityRating: z.number().int().nullable().optional(),
  qualityRating: z.number().int().nullable().optional(),
  providerResponse: z.string().nullable().optional(),
  providerRespondedAt: nullableDateTime,
  createdAt: dateTimeSchema,
});

// ============================================
// REVIEW SUMMARY
// ============================================

export const ReviewSummaryDtoSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number().int(),
  ratingDistribution: z.record(z.string(), z.number().int()).nullable().optional(),
});

// ============================================
// PROVIDER REVIEWS (paginated with summary)
// ============================================

export const ProviderReviewsResponseSchema = z.object({
  items: z.array(ProviderReviewDtoSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
  summary: ReviewSummaryDtoSchema.optional(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type PatientBriefDto = z.infer<typeof PatientBriefDtoSchema>;
export type ProviderReviewDto = z.infer<typeof ProviderReviewDtoSchema>;
export type ReviewSummaryDto = z.infer<typeof ReviewSummaryDtoSchema>;
export type ProviderReviewsResponse = z.infer<typeof ProviderReviewsResponseSchema>;
