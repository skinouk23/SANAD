/**
 * Nutrition Query Key Factory
 *
 * Hierarchical keys enable granular invalidation.
 */

export const nutritionKeys = {
  all: ['nutrition'] as const,

  subcategories: () => [...nutritionKeys.all, 'subcategories'] as const,
  dietTypes: () => [...nutritionKeys.all, 'diet-types'] as const,
  zones: () => [...nutritionKeys.all, 'zones'] as const,
  providers: () => [...nutritionKeys.all, 'providers'] as const,
  userProfile: () => [...nutritionKeys.all, 'user-profile'] as const,
  mealRecommendations: () => [...nutritionKeys.all, 'meal-recommendations'] as const,
  foodsToAvoid: () => [...nutritionKeys.all, 'foods-to-avoid'] as const,
} as const;
