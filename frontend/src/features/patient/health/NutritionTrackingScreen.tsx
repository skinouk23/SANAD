import { useState } from 'react';
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  foodsToAvoidOptions,
  mealRecommendationsOptions,
  nutritionUserProfileOptions,
  useFoodsToAvoid,
  useMealRecommendations,
  useNutritionUserProfile,
} from '@/features/nutrition';
import { queryClient } from '@/shared/lib/query/client';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  await Promise.all([
    queryClient.prefetchQuery(nutritionUserProfileOptions()),
    queryClient.prefetchQuery(mealRecommendationsOptions()),
    queryClient.prefetchQuery(foodsToAvoidOptions()),
  ]);

  return null;
};

export function NutritionTrackingScreen() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const {
    data: userProfile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useNutritionUserProfile();
  const {
    data: mealRecommendations,
    loading: mealsLoading,
    error: mealsError,
    refetch: refetchMeals,
  } = useMealRecommendations();
  const {
    data: foodsToAvoid,
    loading: foodsLoading,
    error: foodsError,
    refetch: refetchFoods,
  } = useFoodsToAvoid();

  const loading = profileLoading || mealsLoading || foodsLoading;
  const error = profileError ?? mealsError ?? foodsError;
  const safeUserProfile = userProfile ?? {
    age: 0,
    weight: 0,
    objective: '',
    allergies: [],
    maladies: [],
  };
  const safeMealRecommendations = mealRecommendations ?? {};
  const safeFoodsToAvoid = foodsToAvoid ?? [];

  const handleRetry = () => {
    void Promise.all([refetchProfile(), refetchMeals(), refetchFoods()]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20 dark:from-emerald-950 dark:to-teal-950">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-emerald-900/10 dark:from-emerald-700 dark:to-emerald-900">
          <button
            onClick={() => navigate('/health')}
            className="mb-6 flex items-center text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </button>
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-white/30" />
                <Skeleton className="h-4 w-64 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-8 max-w-4xl px-4">
          <SkeletonCard className="mb-6 border-0 bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-start gap-3">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="col-span-2 h-5 w-56" />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-slate-800">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="mb-2 h-4 w-36" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          <div className="mb-6 space-y-6">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-7 w-32" />
                </div>

                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, mealIndex) => (
                    <SkeletonCard
                      key={mealIndex}
                      className="border-0 bg-white p-6 shadow-md dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-1 items-start gap-3">
                          <Skeleton className="h-12 w-12 flex-shrink-0 rounded-xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-20 rounded" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SkeletonCard>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <SkeletonCard className="mb-6 border-0 bg-white p-6 shadow-md dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between rounded-lg bg-red-50 p-3 dark:bg-red-950/60"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-4 w-4 flex-shrink-0 rounded" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <SkeletonCard className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-md shadow-purple-500/20 dark:from-purple-600 dark:to-purple-800">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-64 bg-white/30" />
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="h-4 w-3/4 bg-white/20" />
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    );
  }

  if (error && !userProfile && !mealRecommendations && safeFoodsToAvoid.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20 dark:from-emerald-950 dark:to-teal-950">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-emerald-900/10 dark:from-emerald-700 dark:to-emerald-900">
          <button
            onClick={() => navigate('/health')}
            className="mb-6 flex items-center text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </button>
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner shadow-white/10">
                <Apple className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nutrition Personnalisée</h1>
                <p className="text-emerald-100">Recommandations adaptées à votre profil</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-8 max-w-4xl px-4">
          <EmptyState
            title="Impossible de charger vos recommandations"
            description={getApiErrorMessage(
              error,
              'Les conseils nutritionnels sont temporairement indisponibles.',
            )}
            icon={<AlertCircle className="h-5 w-5" />}
            action={
              <Button variant="outline" onClick={handleRetry}>
                Réessayer
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20 dark:from-emerald-950 dark:to-teal-950">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-emerald-900/10 dark:from-emerald-700 dark:to-emerald-900">
        <button
          onClick={() => navigate('/health')}
          className="mb-6 flex items-center text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </button>
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner shadow-white/10">
              <Apple className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nutrition Personnalisée</h1>
              <p className="text-emerald-100">Recommandations adaptées à votre profil</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-4xl px-4">
        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Votre profil nutritionnel
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/health/nutrition/profile')}
                  className="border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                  Modifier
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-slate-300">Âge:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {safeUserProfile.age} ans
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-slate-300">Poids:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {safeUserProfile.weight} kg
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-slate-300">Objectif:</span>
                  <span className="ml-2 font-medium text-emerald-600 dark:text-emerald-300">
                    {safeUserProfile.objective}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-slate-800">
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                Allergies:
              </div>
              <div className="flex flex-wrap gap-2">
                {safeUserProfile.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950/70 dark:text-red-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                Conditions médicales:
              </div>
              <div className="flex flex-wrap gap-2">
                {safeUserProfile.maladies.map((maladie, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/70 dark:text-orange-200"
                  >
                    {maladie}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6 space-y-6">
          {Object.entries(safeMealRecommendations).map(([mealType, meals]) => (
            <div key={mealType}>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{mealType}</h2>
              </div>

              <div className="space-y-3">
                {meals.map((meal, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer border-0 bg-white p-6 text-gray-900 shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900 dark:text-white"
                    onClick={() => setSelectedMeal(selectedMeal === meal.name ? null : meal.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                          <ChefHat className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                            {meal.name}
                          </h3>
                          <p className="mb-2 text-sm text-gray-600 dark:text-slate-300">
                            {meal.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                              {meal.calories} kcal
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              Recommandé par IA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedMeal === meal.name ? (
                      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 dark:border-slate-800">
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/60">
                          <div className="flex items-start gap-2">
                            <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                            <div>
                              <div className="mb-1 text-xs font-semibold text-blue-900 dark:text-blue-100">
                                Pourquoi ce repas ?
                              </div>
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                {meal.aiReason}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                            Bénéfices:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meal.benefits.map((benefit, benefitIndex) => (
                              <span
                                key={benefitIndex}
                                className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-950/70 dark:text-green-200"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                            Ingrédients:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, ingredientIndex) => (
                              <span
                                key={ingredientIndex}
                                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-md dark:bg-slate-900 dark:text-white">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">Aliments à éviter</h3>
          </div>
          <div className="space-y-2">
            {safeFoodsToAvoid.map((food, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg bg-red-50 p-3 dark:bg-red-950/60"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {food.name}
                  </div>
                  <div className="mt-1 text-xs text-red-700 dark:text-red-200">{food.reason}</div>
                </div>
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-300" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-md shadow-purple-500/20 dark:from-purple-600 dark:to-purple-800">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="mb-2 font-bold">Recommandations IA personnalisées</h4>
              <p className="text-sm text-purple-100">
                Ces recommandations sont générées par intelligence artificielle en fonction de votre
                profil. Consultez un nutritionniste pour un suivi personnalisé.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
