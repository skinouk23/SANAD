/**
 * Nutrition Service
 *
 * Pure API client for the nutrition domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import {
  NutritionSubcategorySchema,
  NutritionDietTypeSchema,
  NutritionProviderSchema,
  NutritionUserProfileSchema,
  MealRecommendationsSchema,
  FoodToAvoidSchema,
} from './schema';
import type {
  NutritionSubcategory,
  NutritionDietType,
  NutritionProvider,
  NutritionUserProfile,
  MealRecommendations,
  FoodToAvoid,
} from './schema';

/** Fetch available nutrition subcategories. */
export async function getSubcategories(): Promise<NutritionSubcategory[]> {
  const raw = await api.get<NutritionSubcategory[]>('/nutrition/subcategories');
  return z.array(NutritionSubcategorySchema).parse(raw);
}

/** Fetch available diet types. */
export async function getDietTypes(): Promise<NutritionDietType[]> {
  const raw = await api.get<NutritionDietType[]>('/nutrition/diet-types');
  return z.array(NutritionDietTypeSchema).parse(raw);
}

/** Fetch available zones. */
export async function getZones(): Promise<string[]> {
  const raw = await api.get<string[]>('/nutrition/zones');
  return z.array(z.string()).parse(raw);
}

/** Fetch nutrition providers list. */
export async function getProviders(): Promise<NutritionProvider[]> {
  const raw = await api.get<NutritionProvider[]>('/nutrition/providers');
  return z.array(NutritionProviderSchema).parse(raw);
}

/** Fetch nutrition user profile. */
export async function getUserProfile(): Promise<NutritionUserProfile> {
  const raw = await api.get<NutritionUserProfile>('/nutrition/user-profile');
  return NutritionUserProfileSchema.parse(raw);
}

/** Fetch AI meal recommendations. */
export async function getMealRecommendations(): Promise<MealRecommendations> {
  const raw = await api.get<MealRecommendations>('/nutrition/meal-recommendations');
  return MealRecommendationsSchema.parse(raw);
}

/** Fetch foods to avoid based on user profile. */
export async function getFoodsToAvoid(): Promise<FoodToAvoid[]> {
  const raw = await api.get<FoodToAvoid[]>('/nutrition/foods-to-avoid');
  return z.array(FoodToAvoidSchema).parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const nutritionService = {
  getSubcategories,
  getDietTypes,
  getZones,
  getProviders,
  getUserProfile,
  getMealRecommendations,
  getFoodsToAvoid,
};
