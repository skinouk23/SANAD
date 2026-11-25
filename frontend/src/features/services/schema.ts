/**
 * Service Schemas
 * Zod schemas for service-related DTOs.
 * Matches: ServiceDetailResponse, ServiceSummaryResponse, ServiceCategoryGroupResponse,
 *          PatientServiceCatalogResponse, PatientServiceDetailResponse,
 *          ServiceStatsResponse, ServicePhotoResponse, ToggleServiceRequest,
 *          SubServiceRequest/Response, CreateServiceRequest, UpdateServiceRequest,
 *          ProviderServiceListResponse
 */

import { z } from 'zod';
import { uuidSchema, dateTimeSchema, PaginationMetadataSchema } from '@/shared/schemas/common';

// ============================================
// SUB-SERVICE (ADDON)
// ============================================

export const SubServiceRequestSchema = z.object({
  id: uuidSchema.nullable().optional(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number(),
  durationMinutes: z.number().int().nullable().optional(),
  icon: z.string().nullable().optional(),
  isSupplement: z.boolean(),
});

export const SubServiceResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number(),
  durationMinutes: z.number().int().nullable().optional(),
  icon: z.string().nullable().optional(),
  isSupplement: z.boolean(),
  isActive: z.boolean(),
});

// ============================================
// SERVICE DETAIL (provider management)
// ============================================

export const ServiceDetailResponseSchema = z.object({
  id: uuidSchema,
  providerId: uuidSchema,
  category: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  price: z.number(),
  priceType: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  minDurationMinutes: z.number().int().nullable().optional(),
  maxDurationMinutes: z.number().int().nullable().optional(),
  serviceLocation: z.string().nullable().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  requiresPrescription: z.boolean(),
  requiresMedicalHistory: z.boolean(),
  isUrgent: z.boolean(),
  ageRestrictionMin: z.number().int().nullable().optional(),
  ageRestrictionMax: z.number().int().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).nullable().optional(),
  bookingCount: z.number().int(),
  availableQuantity: z.number().int().nullable().optional(),
  typeConfig: z.unknown().nullable().optional(),
  subServices: z.array(SubServiceResponseSchema).nullable().optional(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

// ============================================
// SERVICE SUMMARY (list views)
// ============================================

export const ServiceSummaryResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  serviceLocation: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.number(),
  priceType: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isUrgent: z.boolean(),
  requiresPrescription: z.boolean().default(false),
  imageUrl: z.string().nullable().optional(),
  bookingCount: z.number().int(),
  availableQuantity: z.number().int().nullable().optional(),
  typeConfig: z.unknown().nullable().optional(),
  subServiceCount: z.number().int(),
  createdAt: dateTimeSchema,
});

// ============================================
// PROVIDER SERVICE LIST (paginated)
// ============================================

export const ProviderServiceListResponseSchema = z.object({
  items: z.array(ServiceSummaryResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// PROVIDER SERVICE PRESETS
// ============================================

export const ProviderServicePresetDraftPayloadSchema = z.object({
  price: z.number(),
  priceType: z.string(),
  currency: z.string().length(3),
  durationMinutes: z.number().int().nullable().optional(),
  serviceLocation: z.string(),
  requiresPrescription: z.boolean(),
  isUrgent: z.boolean(),
  requiresMedicalHistory: z.boolean(),
  typeConfig: z.unknown().nullable().optional(),
});

export const ProviderServicePresetResponseSchema = z.object({
  id: uuidSchema,
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  displayOrder: z.number().int(),
  draft: ProviderServicePresetDraftPayloadSchema,
});

// ============================================
// PATIENT-FACING SERVICE CATALOG
// ============================================

export const ServiceCatalogProviderDtoSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  rating: z.number(),
  reviewCount: z.number().int(),
  isVerified: z.boolean().default(false),
});

export const PatientServiceItemResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.number(),
  priceType: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  serviceLocation: z.string().nullable().optional(),
  requiresPrescription: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  typeConfig: z.unknown().nullable().optional(),
  subServices: z.array(SubServiceResponseSchema).nullable().optional(),
  provider: ServiceCatalogProviderDtoSchema.optional(),
});

export const PatientServiceCatalogResponseSchema = z.object({
  items: z.array(PatientServiceItemResponseSchema).nullable().optional(),
  pagination: PaginationMetadataSchema,
});

// ============================================
// PATIENT-FACING SERVICE DETAIL
// ============================================

export const PatientServiceDetailProviderDtoSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  rating: z.number(),
  reviewCount: z.number().int(),
  isVerified: z.boolean(),
});

export const PatientServiceDetailResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.number(),
  priceType: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  minDurationMinutes: z.number().int().nullable().optional(),
  maxDurationMinutes: z.number().int().nullable().optional(),
  serviceLocation: z.string().nullable().optional(),
  requiresPrescription: z.boolean(),
  requiresMedicalHistory: z.boolean(),
  isUrgent: z.boolean(),
  ageRestrictionMin: z.number().int().nullable().optional(),
  ageRestrictionMax: z.number().int().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).nullable().optional(),
  provider: PatientServiceDetailProviderDtoSchema.optional(),
});

// ============================================
// SERVICE CATEGORIES
// ============================================

export const ServiceCategoryResponseSchema = z.object({
  code: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  displayOrder: z.number().int(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
});

export const ServiceCategoryGroupResponseSchema = z.object({
  displayGroup: z.string().nullable().optional(),
  categories: z.array(ServiceCategoryResponseSchema).nullable().optional(),
});

// ============================================
// SERVICE STATS & PHOTOS
// ============================================

export const ServiceStatsResponseSchema = z.object({
  totalServices: z.number().int(),
  activeServices: z.number().int(),
  inactiveServices: z.number().int(),
  totalBookings: z.number().int(),
});

export const ServicePhotoResponseSchema = z.object({
  serviceId: uuidSchema,
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).nullable().optional(),
});

export const AttachServicePhotoRequestSchema = z
  .object({
    fileId: uuidSchema,
    isMain: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional(),
  })
  .strict();

// ============================================
// TOGGLE SERVICE
// ============================================

export const ToggleServiceRequestSchema = z.object({
  isActive: z.boolean(),
});

// ============================================
// CREATE SERVICE
// ============================================

const CreateServiceSubServiceRequestSchema = z.object({
  id: uuidSchema.nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  durationMinutes: z.number().int().nullable().optional(),
  icon: z.string().nullable().optional(),
  isSupplement: z.boolean().default(false),
});

export const CreateServiceRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  price: z.number(),
  priceType: z.enum(['fixed', 'hourly', 'range', 'starting_from']).default('fixed'),
  currency: z.string().length(3).default('TND'),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  minDurationMinutes: z.number().int().nullable().optional(),
  maxDurationMinutes: z.number().int().nullable().optional(),
  serviceLocation: z.enum(['home', 'clinic', 'both', 'online']).default('home'),
  requiresPrescription: z.boolean().default(false),
  requiresMedicalHistory: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  ageRestrictionMin: z.number().int().nullable().optional(),
  ageRestrictionMax: z.number().int().nullable().optional(),
  typeConfig: z
    .unknown()
    .nullable()
    .optional()
    .refine(
      (value) =>
        value === null ||
        value === undefined ||
        (typeof value === 'object' && !Array.isArray(value)),
      { message: 'Type config must be a JSON object.' },
    ),
  subServices: z.array(CreateServiceSubServiceRequestSchema).nullable().optional(),
});

// ============================================
// UPDATE SERVICE
// ============================================

export const UpdateServiceRequestSchema = z.object({
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  priceType: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  minDurationMinutes: z.number().int().nullable().optional(),
  maxDurationMinutes: z.number().int().nullable().optional(),
  serviceLocation: z.string().nullable().optional(),
  requiresPrescription: z.boolean().nullable().optional(),
  requiresMedicalHistory: z.boolean().nullable().optional(),
  isUrgent: z.boolean().nullable().optional(),
  ageRestrictionMin: z.number().int().nullable().optional(),
  ageRestrictionMax: z.number().int().nullable().optional(),
  typeConfig: z.unknown().nullable().optional(),
  subServices: z.array(SubServiceRequestSchema).nullable().optional(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type SubServiceRequest = z.infer<typeof SubServiceRequestSchema>;
export type SubServiceResponse = z.infer<typeof SubServiceResponseSchema>;
export type ServiceDetailResponse = z.infer<typeof ServiceDetailResponseSchema>;
export type ServiceSummaryResponse = z.infer<typeof ServiceSummaryResponseSchema>;
export type ProviderServiceListResponse = z.infer<typeof ProviderServiceListResponseSchema>;
export type ProviderServicePresetDraftPayload = z.infer<
  typeof ProviderServicePresetDraftPayloadSchema
>;
export type ProviderServicePresetResponse = z.infer<typeof ProviderServicePresetResponseSchema>;
export type ServiceCatalogProviderDto = z.infer<typeof ServiceCatalogProviderDtoSchema>;
export type PatientServiceItemResponse = z.infer<typeof PatientServiceItemResponseSchema>;
export type PatientServiceCatalogResponse = z.infer<typeof PatientServiceCatalogResponseSchema>;
export type PatientServiceDetailResponse = z.infer<typeof PatientServiceDetailResponseSchema>;
export type ServiceCategoryGroupResponse = z.infer<typeof ServiceCategoryGroupResponseSchema>;
export type ServiceCategoryResponse = z.infer<typeof ServiceCategoryResponseSchema>;
export type ServiceStatsResponse = z.infer<typeof ServiceStatsResponseSchema>;
export type ServicePhotoResponse = z.infer<typeof ServicePhotoResponseSchema>;
export type AttachServicePhotoRequest = z.infer<typeof AttachServicePhotoRequestSchema>;
export type ToggleServiceRequest = z.infer<typeof ToggleServiceRequestSchema>;
export type CreateServiceRequest = z.input<typeof CreateServiceRequestSchema>;
export type UpdateServiceRequest = z.infer<typeof UpdateServiceRequestSchema>;
