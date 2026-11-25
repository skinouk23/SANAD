/**
 * Equipment Schemas
 * Zod schemas for equipment catalog, detail, and query DTOs.
 * Matches the .NET backend equipment feature DTOs.
 */

import { z } from 'zod';
import type { CreateEquipmentData } from '@/features/equipment/admin-service';
import { PaginationMetadataSchema, uuidSchema } from '@/shared/schemas/common';

// ============================================
// PROVIDER DTOs
// ============================================

/** Embedded provider summary in catalog list items. */
export const EquipmentProviderDtoSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  city: z.string(),
});

/** Embedded provider detail in equipment detail response. */
export const EquipmentProviderDetailDtoSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  city: z.string(),
  rating: z.number(),
  verified: z.boolean(),
  phone: z.string().nullable().optional(),
});

// ============================================
// CATEGORY
// ============================================

/** EquipmentCategoryResponse — returned by GET /equipment/categories */
export const EquipmentCategoryResponseSchema = z.object({
  id: uuidSchema,
  code: z.string(),
  label: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

// ============================================
// CATALOG ITEM
// ============================================

/** EquipmentResponse — a single item inside the paginated catalog list. */
export const EquipmentResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  categoryCode: z.string(),
  categoryName: z.string(),
  brand: z.string(),
  imageUrl: z.string(),
  pricePerDay: z.number(),
  availableQuantity: z.number().int(),
  provider: EquipmentProviderDtoSchema,
  rating: z.number(),
  reviewCount: z.number().int(),
});

/** EquipmentCatalogResponse — paginated catalog response. */
export const EquipmentCatalogResponseSchema = z.object({
  items: z.array(EquipmentResponseSchema),
  pagination: PaginationMetadataSchema,
});

// ============================================
// DETAIL
// ============================================

/** EquipmentDetailResponse — returned by GET /equipment/{id} */
export const EquipmentDetailResponseSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  description: z.string().nullable().optional(),
  categoryCode: z.string(),
  categoryName: z.string(),
  brand: z.string(),
  model: z.string(),
  images: z.array(z.string()),
  pricePerDay: z.number(),
  pricePerWeek: z.number(),
  pricePerMonth: z.number(),
  deposit: z.number(),
  availableQuantity: z.number().int(),
  specifications: z.record(z.string(), z.unknown()).nullable().optional(),
  features: z.array(z.string()),
  provider: EquipmentProviderDetailDtoSchema,
  rating: z.number(),
  reviewCount: z.number().int(),
});

// ============================================
// QUERY PARAMS
// ============================================

/** GetEquipmentRequest — query params for GET /equipment/catalog */
export const GetEquipmentRequestSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  category: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  sortBy: z.string().nullable().optional(),
  sortDesc: z.boolean().optional(),
  available: z.boolean().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
});

// ============================================
// ADMIN FORM
// ============================================

export const EquipmentSpecificationRowSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const EquipmentFeatureRowSchema = z.object({
  value: z.string(),
});

const requiredCurrencyFieldSchema = z
  .string()
  .trim()
  .min(1, 'Ce champ est requis.')
  .refine((value) => Number.isFinite(Number(value)), 'Saisissez un montant valide.')
  .refine((value) => Number(value) >= 0, 'Le montant ne peut pas etre negatif.');

const optionalCurrencyFieldSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0),
    'Saisissez un montant valide.',
  );

export const EquipmentAdminFormSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.'),
  description: z.string(),
  categoryCode: z.string().trim().min(1, 'La categorie est requise.'),
  brand: z.string(),
  model: z.string(),
  pricePerDay: requiredCurrencyFieldSchema,
  pricePerWeek: optionalCurrencyFieldSchema,
  pricePerMonth: optionalCurrencyFieldSchema,
  deposit: requiredCurrencyFieldSchema,
  specifications: z.array(EquipmentSpecificationRowSchema),
  features: z.array(EquipmentFeatureRowSchema),
});

// ============================================
// INFERRED TYPES
// ============================================

export type EquipmentProviderDto = z.infer<typeof EquipmentProviderDtoSchema>;
export type EquipmentProviderDetailDto = z.infer<typeof EquipmentProviderDetailDtoSchema>;
export type EquipmentCategoryResponse = z.infer<typeof EquipmentCategoryResponseSchema>;
export type EquipmentResponse = z.infer<typeof EquipmentResponseSchema>;
export type EquipmentCatalogResponse = z.infer<typeof EquipmentCatalogResponseSchema>;
export type EquipmentDetailResponse = z.infer<typeof EquipmentDetailResponseSchema>;
export type GetEquipmentRequest = z.infer<typeof GetEquipmentRequestSchema>;
export type EquipmentSpecificationRow = z.infer<typeof EquipmentSpecificationRowSchema>;
export type EquipmentFeatureRow = z.infer<typeof EquipmentFeatureRowSchema>;
export type EquipmentAdminFormValues = z.infer<typeof EquipmentAdminFormSchema>;

export function toCreateEquipmentData(values: EquipmentAdminFormValues): CreateEquipmentData {
  const specifications = values.specifications.reduce<Record<string, string>>(
    (accumulator, row) => {
      const key = row.key.trim();

      if (key) {
        accumulator[key] = row.value.trim();
      }

      return accumulator;
    },
    {},
  );

  const features = values.features
    .map((feature) => feature.value.trim())
    .filter((feature) => feature.length > 0);

  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    pricePerDay: Number(values.pricePerDay),
    typeConfig: {
      equipment_type_code: values.categoryCode,
      brand: values.brand.trim() || undefined,
      model: values.model.trim() || undefined,
      deposit_amount: Number(values.deposit),
      pricing: {
        weekly: values.pricePerWeek ? Number(values.pricePerWeek) : 0,
        monthly: values.pricePerMonth ? Number(values.pricePerMonth) : 0,
      },
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
      features: features.length > 0 ? features : undefined,
    },
  };
}
