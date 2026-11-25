import type { TranslationKeys } from '@/i18n/types';

// ============================================
// CANONICAL PROVIDER AUTHORING VALUES
// ============================================

export const CANONICAL_PROVIDER_CATEGORY_VALUES = [
  'nursing',
  'elderly_care',
  'physiotherapy',
  'doctor',
  'maternity',
  'night_care',
  'psychology',
  'nutrition',
  'laboratory',
  'radiology',
  'ambulance',
  'equipment_rental',
  'gym',
  'checkup',
  'chronic_care',
  'medical_companion',
  'babysitting',
  'pharmacy',
  'funeral',
  'veterinary',
] as const;

export type ProviderCategory = (typeof CANONICAL_PROVIDER_CATEGORY_VALUES)[number];
export type ProviderCategoryConfigKey = Exclude<ProviderCategory, 'equipment_rental'> | 'equipment';

export const NUTRITION_PROVIDER_SUBTYPE_VALUES = ['Restaurant', 'Chef', 'Nutritionist'] as const;

export type NutritionProviderSubtype = (typeof NUTRITION_PROVIDER_SUBTYPE_VALUES)[number];

const NUTRITION_SUBTYPE_TRANSLATION_KEYS: Record<
  NutritionProviderSubtype,
  keyof TranslationKeys['serviceListing']
> = {
  Restaurant: 'nutritionRestaurant',
  Chef: 'nutritionChef',
  Nutritionist: 'nutritionNutritionist',
};

export function getNutritionSubtypeLabel(
  subtype: NutritionProviderSubtype | null | undefined,
  t: TranslationKeys,
): string | null {
  if (!subtype) {
    return null;
  }

  return t.serviceListing[NUTRITION_SUBTYPE_TRANSLATION_KEYS[subtype]];
}

// ============================================
// LEGACY AUTHORING NORMALIZATION
// ============================================

const LEGACY_PROVIDER_CATEGORY_MAP = {
  equipment: 'equipment_rental',
  chronic: 'chronic_care',
  accompagnement: 'medical_companion',
} as const satisfies Record<string, ProviderCategory>;

const CANONICAL_PROVIDER_CATEGORY_SET = new Set<string>(CANONICAL_PROVIDER_CATEGORY_VALUES);

function normalizeProviderCategoryKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function normalizeProviderCategory(
  value: string | null | undefined,
): ProviderCategory | null {
  if (!value) {
    return null;
  }

  const normalizedKey = normalizeProviderCategoryKey(value);
  const mappedLegacyValue =
    LEGACY_PROVIDER_CATEGORY_MAP[normalizedKey as keyof typeof LEGACY_PROVIDER_CATEGORY_MAP];

  if (mappedLegacyValue) {
    return mappedLegacyValue;
  }

  if (CANONICAL_PROVIDER_CATEGORY_SET.has(normalizedKey)) {
    return normalizedKey as ProviderCategory;
  }

  return null;
}

export function isSupportedProviderCategory(value: string | null | undefined): boolean {
  return normalizeProviderCategory(value) !== null;
}

export function resolveProviderCategoryConfigKey(
  value: string | null | undefined,
): ProviderCategoryConfigKey | null {
  const normalizedCategory = normalizeProviderCategory(value);

  if (!normalizedCategory) {
    return null;
  }

  return normalizedCategory === 'equipment_rental' ? 'equipment' : normalizedCategory;
}

export function isNutritionProviderCategory(value: string | null | undefined): boolean {
  return normalizeProviderCategory(value) === 'nutrition';
}
