import React, { useState } from 'react';
import {
  ArrowLeft,
  Apple,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChefHat,
  Clock } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  useNutritionUserProfile,
  useMealRecommendations,
  useFoodsToAvoid } from
'../../hooks/useNutritionTracking';
export function NutritionTracking() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  // Hook-based data fetching
  const { data: userProfile } = useNutritionUserProfile();
  const { data: mealRecommendations } = useMealRecommendations();
  const { data: foodsToAvoid } = useFoodsToAvoid();
  const safeUserProfile = userProfile ?? {
    age: 0,
    weight: 0,
    objective: '',
    allergies: [],
    maladies: []
  };
  const safeMealRecommendations = mealRecommendations ?? {};
  const safeFoodsToAvoid = foodsToAvoid ?? [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 pt-8 pb-12">
        <button
          onClick={() => navigate('/health')}
          className="flex items-center text-white/90 hover:text-white mb-6">
          
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Apple className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nutrition Personnalisée</h1>
              <p className="text-emerald-100">
                Recommandations adaptées à votre profil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* User Profile Summary */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">
                  Votre profil nutritionnel
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/health/nutrition/profile')}>
                  
                  Modifier
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Âge:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {safeUserProfile.age} ans
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Poids:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {safeUserProfile.weight} kg
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Objectif:</span>
                  <span className="ml-2 font-medium text-emerald-600">
                    {safeUserProfile.objective}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Allergies:
              </div>
              <div className="flex flex-wrap gap-2">
                {safeUserProfile.allergies.map((allergy, index) =>
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                  
                    {allergy}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Conditions médicales:
              </div>
              <div className="flex flex-wrap gap-2">
                {safeUserProfile.maladies.map((maladie, index) =>
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                  
                    {maladie}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Meal Recommendations */}
        <div className="space-y-6 mb-6">
          {Object.entries(safeMealRecommendations).map(([mealType, meals]) =>
          <div key={mealType}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">{mealType}</h2>
              </div>

              <div className="space-y-3">
                {meals.map((meal, index) =>
              <Card
                key={index}
                className="bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                setSelectedMeal(
                  selectedMeal === meal.name ? null : meal.name
                )
                }>
                
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <ChefHat className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {meal.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {meal.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                              {meal.calories} kcal
                            </span>
                            <span className="text-xs text-gray-500">
                              Recommandé par IA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedMeal === meal.name &&
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {/* AI Reasoning */}
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-blue-900 mb-1">
                                Pourquoi ce repas ?
                              </div>
                              <p className="text-xs text-blue-800">
                                {meal.aiReason}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Bénéfices:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meal.benefits.map((benefit, i) =>
                      <span
                        key={i}
                        className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        
                                <CheckCircle2 className="h-3 w-3" />
                                {benefit}
                              </span>
                      )}
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Ingrédients:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, i) =>
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        
                                {ingredient}
                              </span>
                      )}
                          </div>
                        </div>
                      </div>
                }
                  </Card>
              )}
              </div>
            </div>
          )}
        </div>

        {/* Foods to Avoid */}
        <Card className="bg-white shadow-md border-0 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-bold text-gray-900">Aliments à éviter</h3>
          </div>
          <div className="space-y-2">
            {safeFoodsToAvoid.map((food, index) =>
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-red-50 rounded-lg">
              
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {food.name}
                  </div>
                  <div className="text-xs text-red-700 mt-1">{food.reason}</div>
                </div>
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              </div>
            )}
          </div>
        </Card>

        {/* AI Disclaimer */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md border-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold mb-2">
                Recommandations IA personnalisées
              </h4>
              <p className="text-sm text-purple-100">
                Ces recommandations sont générées par intelligence artificielle
                en fonction de votre profil. Consultez un nutritionniste pour un
                suivi personnalisé.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}