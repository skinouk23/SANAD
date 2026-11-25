/**
 * Nutrition Fetch Hooks (TanStack Query)
 *
 * Merges the old useNutrition.ts and useNutritionTracking.ts into one module.
 * Each returns { data, loading, error, refetch } to match the existing API.
 */

import { useQuery } from '@tanstack/react-query';
import {
  subcategoriesOptions,
  dietTypesOptions,
  nutritionZonesOptions,
  nutritionProvidersOptions,
  nutritionUserProfileOptions,
  mealRecommendationsOptions,
  foodsToAvoidOptions,
} from '@/features/nutrition/options';
import type {
  NutritionSubcategory,
  NutritionDietType,
  NutritionProvider,
  NutritionUserProfile,
  MealRecommendations,
  FoodToAvoid,
} from '@/features/nutrition/schema';

/**
 * Fetch nutrition subcategories.
 */
export function useNutritionSubcategories() {
  const query = useQuery(subcategoriesOptions());

  return {
    data: (query.data as NutritionSubcategory[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch nutrition diet types.
 */
export function useNutritionDietTypes() {
  const query = useQuery(dietTypesOptions());

  return {
    data: (query.data as NutritionDietType[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch nutrition zones.
 */
export function useNutritionZones() {
  const query = useQuery(nutritionZonesOptions());

  return {
    data: (query.data as string[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch nutrition providers list.
 */
export function useNutritionProvidersList() {
  const query = useQuery(nutritionProvidersOptions());

  return {
    data: (query.data as NutritionProvider[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch nutrition user profile.
 */
export function useNutritionUserProfile() {
  const query = useQuery(nutritionUserProfileOptions());

  return {
    data: (query.data as NutritionUserProfile | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch AI meal recommendations.
 */
export function useMealRecommendations() {
  const query = useQuery(mealRecommendationsOptions());

  return {
    data: (query.data as MealRecommendations | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch foods to avoid based on user profile.
 */
export function useFoodsToAvoid() {
  const query = useQuery(foodsToAvoidOptions());

  return {
    data: (query.data as FoodToAvoid[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
