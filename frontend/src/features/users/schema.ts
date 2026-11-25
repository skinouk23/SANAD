/**
 * Users Schemas
 * Zod schemas for patient- and provider-facing DTOs still used by this SPA.
 * These model the API response contract, NOT the full mock User/Patient/Provider types.
 * Deeply nested objects use z.unknown() per K005.
 */

import { z } from 'zod';
import {
  UserRoleSchema,
  UserStatusSchema,
  UserSegmentSchema,
  dateTimeSchema,
} from '@/shared/schemas/common';

// ============================================
// PATIENT LISTING / DETAIL
// ============================================

export const AdminPatientSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: UserRoleSchema,
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  status: UserStatusSchema.optional(),
  segment: UserSegmentSchema.optional(),
  city: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  dateOfBirth: z.string().nullable().optional(),
  emergencyContact: z.unknown().optional(),
  medicalInfo: z.unknown().optional(),
});

// ============================================
// PROVIDER LISTING
// ============================================

export const AdminProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  specialties: z.array(z.string()).nullable().optional(),
  rating: z.number(),
  reviewCount: z.number().int(),
  verified: z.boolean(),
  available: z.boolean(),
  status: z.string().nullable().optional(),
  experience: z.number().int().nullable().optional(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  serviceType: z.string().nullable().optional(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

// ============================================
// INFERRED TYPES
// ============================================

export type AdminPatient = z.infer<typeof AdminPatientSchema>;
export type AdminProvider = z.infer<typeof AdminProviderSchema>;
