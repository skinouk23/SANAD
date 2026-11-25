/**
 * Nutrition Hooks
 * Custom React hooks for nutrition providers, diet types, and zones
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface NutritionDietType {
  id: string;
  label: string;
  icon: string;
}

export interface NutritionProvider {
  id: number;
  type: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  zone: string;
  price: string;
  image: string;
  dietTypes: string[];
  delivery: boolean;
  description: string;
  certifications: string[];
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_DIET_TYPES: NutritionDietType[] = [
{ id: 'diabetic', label: 'Diabétique', icon: '🩺' },
{ id: 'low-salt', label: 'Pauvre en sel', icon: '🧂' },
{ id: 'post-surgery', label: 'Post-hospitalisation', icon: '🏥' },
{ id: 'cardiac', label: 'Cardiaque', icon: '❤️' },
{ id: 'renal', label: 'Rénal', icon: '💧' },
{ id: 'vegetarian', label: 'Végétarien', icon: '🥗' }];


const MOCK_ZONES: string[] = [
'Tunis Centre',
'Ariana',
'La Marsa',
'Carthage',
'Manouba',
'Ben Arous'];


const MOCK_NUTRITION_PROVIDERS: NutritionProvider[] = [
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
  dietTypes: ['diabetic', 'low-salt', 'cardiac'],
  delivery: true,
  description: 'Spécialiste des repas adaptés aux régimes médicaux',
  certifications: ['Nutritionniste agréé', 'Cuisine médicalisée']
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
  dietTypes: ['diabetic', 'post-surgery', 'cardiac', 'renal'],
  delivery: false,
  description: 'Préparation de repas personnalisés à votre domicile',
  certifications: ['Formation nutrition médicale', "15 ans d'expérience"]
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
  dietTypes: ['diabetic', 'low-salt', 'cardiac', 'renal', 'post-surgery'],
  delivery: false,
  description: 'Consultation et plans nutritionnels personnalisés',
  certifications: ['Doctorat en nutrition', 'Spécialiste diabète']
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
  dietTypes: ['vegetarian', 'low-salt', 'cardiac'],
  delivery: true,
  description: 'Repas équilibrés et savoureux pour tous les régimes',
  certifications: ['Bio certifié', 'Cuisine santé']
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
  dietTypes: ['diabetic', 'low-salt', 'post-surgery', 'renal'],
  delivery: true,
  description: 'Livraison de repas thérapeutiques quotidiens',
  certifications: ['Agrément sanitaire', 'Formation diététique']
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
  dietTypes: ['diabetic', 'cardiac', 'renal', 'post-surgery'],
  delivery: false,
  description: 'Suivi nutritionnel et éducation thérapeutique',
  certifications: ['Master en nutrition', 'Spécialiste maladies chroniques']
}];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching nutrition diet types
 */
export function useNutritionDietTypes() {
  return useApi<NutritionDietType[]>(() => Promise.resolve(MOCK_DIET_TYPES), []);
}

/**
 * Hook for fetching nutrition zones
 */
export function useNutritionZones() {
  return useApi<string[]>(() => Promise.resolve(MOCK_ZONES), []);
}

/**
 * Hook for fetching nutrition providers list
 */
export function useNutritionProvidersList() {
  return useApi<NutritionProvider[]>(
    () => Promise.resolve(MOCK_NUTRITION_PROVIDERS),
    []
  );
}