/**
 * Nutrition Hooks — barrel re-export
 */

export {
  useNutritionSubcategories,
  useNutritionDietTypes,
  useNutritionZones,
  useNutritionProvidersList,
  useNutritionUserProfile,
  useMealRecommendations,
  useFoodsToAvoid,
} from './useNutrition';

// Re-export types for consumer convenience
export type {
  NutritionSubcategory,
  NutritionDietType,
  NutritionProvider,
  NutritionUserProfile,
  MealOption,
  MealRecommendations,
  FoodToAvoid,
} from '@/features/nutrition/schema';
