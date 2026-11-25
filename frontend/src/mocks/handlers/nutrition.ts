/**
 * Nutrition MSW Handlers
 *
 * Intercepts all /api/nutrition requests during development
 * and returns realistic mock data extracted from the old nutrition hooks.
 */

import { http } from 'msw';

import type {
  NutritionSubcategory,
  NutritionDietType,
  NutritionProvider,
  NutritionUserProfile,
  MealRecommendations,
  FoodToAvoid,
} from '@/features/nutrition/schema';
import { apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA
// ============================================

const mockSubcategories: NutritionSubcategory[] = [
  { code: 'consultation', label: 'Consultation', icon: 'stethoscope', color: '#06b6d4' },
  { code: 'meal_plan', label: 'Plan alimentaire', icon: 'clipboard-list', color: '#f59e0b' },
  { code: 'meal_delivery', label: 'Livraison de repas', icon: 'truck', color: '#22c55e' },
];

const mockDietTypes: NutritionDietType[] = [
  { code: 'diabetic', label: 'Diabétique', icon: 'heart-pulse', color: '#ef4444' },
  { code: 'low_salt', label: 'Pauvre en sel', icon: 'droplets', color: '#0ea5e9' },
  { code: 'cardiac', label: 'Cardiaque', icon: 'heart', color: '#dc2626' },
  { code: 'gluten_free', label: 'Sans gluten', icon: 'wheat-off', color: '#f59e0b' },
  { code: 'vegetarian', label: 'Végétarien', icon: 'leaf', color: '#22c55e' },
  { code: 'vegan', label: 'Vegan', icon: 'sprout', color: '#10b981' },
];

const mockZones: string[] = [
  'Tunis Centre',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous',
];

const mockProviders: NutritionProvider[] = [
  {
    id: 1,
    type: 'restaurant',
    name: 'Restaurant Santé Plus',
    specialty: 'Cuisine diététique tunisienne',
    rating: 4.8,
    reviews: 156,
    zone: 'Tunis Centre',
    price: '15-25',
    image: '🍽️',
    dietTypes: ['diabetic', 'low_salt', 'cardiac'],
    delivery: true,
    description: 'Spécialiste des repas adaptés aux régimes médicaux',
    certifications: ['Nutritionniste agréé', 'Cuisine médicalisée'],
  },
  {
    id: 2,
    type: 'chef',
    name: 'Chef Amira Trabelsi',
    specialty: 'Cuisinière à domicile - Repas thérapeutiques',
    rating: 5.0,
    reviews: 89,
    zone: 'Ariana',
    price: '20-30',
    image: '👩‍🍳',
    dietTypes: ['diabetic', 'gluten_free', 'cardiac', 'vegetarian'],
    delivery: false,
    description: 'Préparation de repas personnalisés à votre domicile',
    certifications: ['Formation nutrition médicale', "15 ans d'expérience"],
  },
  {
    id: 3,
    type: 'nutritionist',
    name: 'Dr. Leila Ben Ali',
    specialty: 'Nutritionniste-Diététicienne',
    rating: 4.9,
    reviews: 203,
    zone: 'La Marsa',
    price: '60',
    image: '👩‍⚕️',
    dietTypes: ['diabetic', 'low_salt', 'cardiac', 'gluten_free', 'vegetarian'],
    delivery: false,
    description: 'Consultation et plans nutritionnels personnalisés',
    certifications: ['Doctorat en nutrition', 'Spécialiste diabète'],
  },
  {
    id: 4,
    type: 'restaurant',
    name: 'Green & Healthy',
    specialty: 'Cuisine végétarienne et bio',
    rating: 4.7,
    reviews: 124,
    zone: 'Carthage',
    price: '12-20',
    image: '🥗',
    dietTypes: ['vegetarian', 'low_salt', 'cardiac', 'vegan'],
    delivery: true,
    description: 'Repas équilibrés et savoureux pour tous les régimes',
    certifications: ['Bio certifié', 'Cuisine santé'],
  },
  {
    id: 5,
    type: 'chef',
    name: 'Chef Mohamed Gharbi',
    specialty: 'Traiteur spécialisé repas médicaux',
    rating: 4.8,
    reviews: 67,
    zone: 'Tunis Centre',
    price: '18-28',
    image: '👨‍🍳',
    dietTypes: ['diabetic', 'low_salt', 'gluten_free', 'vegetarian'],
    delivery: true,
    description: 'Livraison de repas thérapeutiques quotidiens',
    certifications: ['Agrément sanitaire', 'Formation diététique'],
  },
  {
    id: 6,
    type: 'nutritionist',
    name: 'Fatma Mansour',
    specialty: 'Diététicienne clinique',
    rating: 5.0,
    reviews: 145,
    zone: 'Ariana',
    price: '50',
    image: '👩‍⚕️',
    dietTypes: ['diabetic', 'cardiac', 'gluten_free', 'vegan'],
    delivery: false,
    description: 'Suivi nutritionnel et éducation thérapeutique',
    certifications: ['Master en nutrition', 'Spécialiste maladies chroniques'],
  },
];

const mockUserProfile: NutritionUserProfile = {
  age: 45,
  weight: 78,
  objective: 'Perte de poids',
  allergies: ['Lactose', 'Fruits à coque'],
  maladies: ['Diabète Type 2', 'Hypertension'],
};

const mockMealRecommendations: MealRecommendations = {
  'Petit-déjeuner': [
    {
      name: 'Omelette aux légumes',
      calories: 280,
      description: 'Omelette avec tomates, poivrons, épinards',
      benefits: ['Riche en protéines', 'Faible en glucides', 'Sans lactose'],
      ingredients: ['3 œufs', 'Tomates', 'Poivrons', 'Épinards', "Huile d'olive"],
      aiReason: 'Adapté pour diabète : faible index glycémique, riche en protéines pour la satiété',
    },
    {
      name: 'Yaourt végétal aux fruits',
      calories: 220,
      description: 'Yaourt soja nature avec fruits frais',
      benefits: ['Sans lactose', 'Riche en fibres', 'Antioxydants'],
      ingredients: ['Yaourt soja', 'Fraises', 'Myrtilles', 'Graines de chia'],
      aiReason: 'Alternative sans lactose, contrôle glycémique avec fruits à faible IG',
    },
  ],
  Déjeuner: [
    {
      name: 'Poulet grillé aux légumes',
      calories: 420,
      description: 'Blanc de poulet avec légumes vapeur',
      benefits: ['Riche en protéines', 'Faible en sel', 'Équilibré'],
      ingredients: ['Poulet', 'Brocoli', 'Carottes', 'Courgettes', 'Citron'],
      aiReason: 'Protéines maigres pour perte de poids, légumes pour contrôle tension',
    },
    {
      name: 'Salade méditerranéenne',
      calories: 380,
      description: 'Salade complète avec thon et légumes',
      benefits: ['Oméga-3', 'Vitamines', 'Satiété'],
      ingredients: ['Thon', 'Laitue', 'Tomates', 'Concombre', 'Olives', "Huile d'olive"],
      aiReason: 'Oméga-3 pour santé cardiovasculaire, faible en glucides',
    },
  ],
  Dîner: [
    {
      name: 'Poisson au four avec quinoa',
      calories: 390,
      description: 'Filet de poisson blanc avec quinoa et légumes',
      benefits: ['Protéines légères', 'Fibres', 'Digestion facile'],
      ingredients: ['Poisson blanc', 'Quinoa', 'Asperges', 'Citron', 'Herbes'],
      aiReason: 'Repas léger le soir, quinoa à IG bas, bon pour diabète',
    },
    {
      name: 'Soupe de légumes maison',
      calories: 180,
      description: 'Soupe épaisse aux légumes de saison',
      benefits: ['Faible en calories', 'Hydratation', 'Vitamines'],
      ingredients: ['Carottes', 'Courgettes', 'Tomates', 'Oignon', 'Bouillon'],
      aiReason: 'Léger pour le soir, aide à la perte de poids, faible en sodium',
    },
  ],
};

const mockFoodsToAvoid: FoodToAvoid[] = [
  { name: 'Produits laitiers', reason: 'Allergie au lactose' },
  { name: 'Noix et amandes', reason: 'Allergie aux fruits à coque' },
  { name: 'Sucres raffinés', reason: 'Diabète - pic glycémique' },
  { name: 'Sel en excès', reason: 'Hypertension' },
  { name: 'Aliments frits', reason: 'Perte de poids' },
];

// ============================================
// HANDLERS
// ============================================

export const nutritionHandlers = [
  // ── GET /api/nutrition/subcategories ───────────────────────
  http.get('*/api/v1/nutrition/subcategories', () => {
    return apiOk(mockSubcategories);
  }),

  // ── GET /api/nutrition/diet-types ──────────────────────────
  http.get('*/api/v1/nutrition/diet-types', () => {
    return apiOk(mockDietTypes);
  }),

  // ── GET /api/nutrition/zones ───────────────────────────────
  http.get('*/api/v1/nutrition/zones', () => {
    return apiOk(mockZones);
  }),

  // ── GET /api/nutrition/providers ───────────────────────────
  http.get('*/api/v1/nutrition/providers', () => {
    return apiOk(mockProviders);
  }),

  // ── GET /api/nutrition/user-profile ────────────────────────
  http.get('*/api/v1/nutrition/user-profile', () => {
    return apiOk(mockUserProfile);
  }),

  // ── GET /api/nutrition/meal-recommendations ────────────────
  http.get('*/api/v1/nutrition/meal-recommendations', () => {
    return apiOk(mockMealRecommendations);
  }),

  // ── GET /api/nutrition/foods-to-avoid ──────────────────────
  http.get('*/api/v1/nutrition/foods-to-avoid', () => {
    return apiOk(mockFoodsToAvoid);
  }),
];
