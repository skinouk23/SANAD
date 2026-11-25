/**
 * Nutrition Schemas
 * Zod schemas for nutrition types: subcategories, diet types, providers, user profile, meals, foods.
 */

import { z } from 'zod';

// ============================================
// SUBCATEGORY / DIET TYPE
// ============================================

export const NutritionSubcategorySchema = z.object({
  code: z.string(),
  label: z.string(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export const NutritionDietTypeSchema = z.object({
  code: z.string(),
  label: z.string(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

// ============================================
// NUTRITION PROVIDER
// ============================================

export const NutritionProviderSchema = z.object({
  id: z.number(),
  type: z.string(),
  name: z.string(),
  specialty: z.string(),
  rating: z.number(),
  reviews: z.number(),
  zone: z.string(),
  price: z.string(),
  image: z.string(),
  dietTypes: z.array(z.string()),
  delivery: z.boolean(),
  description: z.string(),
  certifications: z.array(z.string()),
});

// ============================================
// USER PROFILE
// ============================================

export const NutritionUserProfileSchema = z.object({
  age: z.number(),
  weight: z.number(),
  objective: z.string(),
  allergies: z.array(z.string()),
  maladies: z.array(z.string()),
});

// ============================================
// MEAL RECOMMENDATIONS
// ============================================

export const MealOptionSchema = z.object({
  name: z.string(),
  calories: z.number(),
  description: z.string(),
  benefits: z.array(z.string()),
  ingredients: z.array(z.string()),
  aiReason: z.string(),
});

/** MealRecommendations is keyed by meal type (string → MealOption[]). */
export const MealRecommendationsSchema = z.record(z.string(), z.array(MealOptionSchema));

// ============================================
// FOOD TO AVOID
// ============================================

export const FoodToAvoidSchema = z.object({
  name: z.string(),
  reason: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type NutritionSubcategory = z.infer<typeof NutritionSubcategorySchema>;
export type NutritionDietType = z.infer<typeof NutritionDietTypeSchema>;
export type NutritionProvider = z.infer<typeof NutritionProviderSchema>;
export type NutritionUserProfile = z.infer<typeof NutritionUserProfileSchema>;
export type MealOption = z.infer<typeof MealOptionSchema>;
export type MealRecommendations = z.infer<typeof MealRecommendationsSchema>;
export type FoodToAvoid = z.infer<typeof FoodToAvoidSchema>;
