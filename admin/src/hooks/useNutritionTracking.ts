/**
 * Nutrition Tracking Hooks
 * Custom React hooks for nutrition profile, meal recommendations, and foods to avoid
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface NutritionUserProfile {
  age: number;
  weight: number;
  objective: string;
  allergies: string[];
  maladies: string[];
}

export interface MealOption {
  name: string;
  calories: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  aiReason: string;
}

export interface MealRecommendations {
  [mealType: string]: MealOption[];
}

export interface FoodToAvoid {
  name: string;
  reason: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_USER_PROFILE: NutritionUserProfile = {
  age: 45,
  weight: 78,
  objective: 'Perte de poids',
  allergies: ['Lactose', 'Fruits à coque'],
  maladies: ['Diabète Type 2', 'Hypertension']
};

const MOCK_MEAL_RECOMMENDATIONS: MealRecommendations = {
  'Petit-déjeuner': [
  {
    name: 'Omelette aux légumes',
    calories: 280,
    description: 'Omelette avec tomates, poivrons, épinards',
    benefits: ['Riche en protéines', 'Faible en glucides', 'Sans lactose'],
    ingredients: [
    '3 œufs',
    'Tomates',
    'Poivrons',
    'Épinards',
    "Huile d'olive"],

    aiReason:
    'Adapté pour diabète : faible index glycémique, riche en protéines pour la satiété'
  },
  {
    name: 'Yaourt végétal aux fruits',
    calories: 220,
    description: 'Yaourt soja nature avec fruits frais',
    benefits: ['Sans lactose', 'Riche en fibres', 'Antioxydants'],
    ingredients: ['Yaourt soja', 'Fraises', 'Myrtilles', 'Graines de chia'],
    aiReason:
    'Alternative sans lactose, contrôle glycémique avec fruits à faible IG'
  }],

  Déjeuner: [
  {
    name: 'Poulet grillé aux légumes',
    calories: 420,
    description: 'Blanc de poulet avec légumes vapeur',
    benefits: ['Riche en protéines', 'Faible en sel', 'Équilibré'],
    ingredients: ['Poulet', 'Brocoli', 'Carottes', 'Courgettes', 'Citron'],
    aiReason:
    'Protéines maigres pour perte de poids, légumes pour contrôle tension'
  },
  {
    name: 'Salade méditerranéenne',
    calories: 380,
    description: 'Salade complète avec thon et légumes',
    benefits: ['Oméga-3', 'Vitamines', 'Satiété'],
    ingredients: [
    'Thon',
    'Laitue',
    'Tomates',
    'Concombre',
    'Olives',
    "Huile d'olive"],

    aiReason: 'Oméga-3 pour santé cardiovasculaire, faible en glucides'
  }],

  Dîner: [
  {
    name: 'Poisson au four avec quinoa',
    calories: 390,
    description: 'Filet de poisson blanc avec quinoa et légumes',
    benefits: ['Protéines légères', 'Fibres', 'Digestion facile'],
    ingredients: ['Poisson blanc', 'Quinoa', 'Asperges', 'Citron', 'Herbes'],
    aiReason: 'Repas léger le soir, quinoa à IG bas, bon pour diabète'
  },
  {
    name: 'Soupe de légumes maison',
    calories: 180,
    description: 'Soupe épaisse aux légumes de saison',
    benefits: ['Faible en calories', 'Hydratation', 'Vitamines'],
    ingredients: ['Carottes', 'Courgettes', 'Tomates', 'Oignon', 'Bouillon'],
    aiReason:
    'Léger pour le soir, aide à la perte de poids, faible en sodium'
  }]

};

const MOCK_FOODS_TO_AVOID: FoodToAvoid[] = [
{ name: 'Produits laitiers', reason: 'Allergie au lactose' },
{ name: 'Noix et amandes', reason: 'Allergie aux fruits à coque' },
{ name: 'Sucres raffinés', reason: 'Diabète - pic glycémique' },
{ name: 'Sel en excès', reason: 'Hypertension' },
{ name: 'Aliments frits', reason: 'Perte de poids' }];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching nutrition user profile
 */
export function useNutritionUserProfile() {
  return useApi<NutritionUserProfile>(
    () => Promise.resolve(MOCK_USER_PROFILE),
    []
  );
}

/**
 * Hook for fetching AI meal recommendations
 */
export function useMealRecommendations() {
  return useApi<MealRecommendations>(
    () => Promise.resolve(MOCK_MEAL_RECOMMENDATIONS),
    []
  );
}

/**
 * Hook for fetching foods to avoid
 */
export function useFoodsToAvoid() {
  return useApi<FoodToAvoid[]>(() => Promise.resolve(MOCK_FOODS_TO_AVOID), []);
}