/**
 * Equipment Catalog Hooks
 * Custom React hooks for equipment catalog page-specific data
 * (categories, cities, provider info - complements useEquipment.ts)
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface EquipmentCategory {
  id: string;
  label: string;
  icon: string;
}

export interface City {
  id: string;
  name: string;
}

export interface EquipmentProviderInfo {
  id: string;
  name: string;
  type: 'parapharmacie' | 'agence';
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
}

export interface EquipmentProviderFilter {
  id: string;
  name: string;
  type: string;
}

export interface CatalogEquipmentItem {
  id: number;
  name: string;
  category: string;
  categoryId: string;
  pricePerDay: number;
  imageUrl: string;
  provider: string;
  providerId: string;
  location: string;
  city: string;
  available: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const mockCategories: EquipmentCategory[] = [
{ id: 'all', label: 'Tout', icon: '📦' },
{ id: 'mobility', label: 'Mobilité', icon: '🦽' },
{ id: 'respiratory', label: 'Respiration', icon: '💨' },
{ id: 'bed', label: 'Lit & Matelas', icon: '🛏️' },
{ id: 'monitoring', label: 'Monitoring', icon: '🩺' }];


const mockCities: City[] = [
{ id: 'all', name: 'Toutes les villes' },
{ id: 'tunis', name: 'Tunis' },
{ id: 'ariana', name: 'Ariana' },
{ id: 'manouba', name: 'Manouba' },
{ id: 'ben-arous', name: 'Ben Arous' },
{ id: 'sfax', name: 'Sfax' },
{ id: 'sousse', name: 'Sousse' },
{ id: 'nabeul', name: 'Nabeul' }];


const mockProvidersInfo: Record<string, EquipmentProviderInfo> = {
  'parapharmacie-centrale': {
    id: 'parapharmacie-centrale',
    name: 'Parapharmacie Centrale',
    type: 'parapharmacie',
    address: '15 Avenue Habib Bourguiba, Tunis 1000',
    city: 'tunis',
    phone: '+216 71 123 456',
    email: 'contact@parapharmacie-centrale.tn',
    hours: 'Lun-Sam: 8h-20h, Dim: 9h-13h',
    description:
    'Parapharmacie de référence au cœur de Tunis, spécialisée dans la location de matériel médical depuis 15 ans.'
  },
  mediequip: {
    id: 'mediequip',
    name: 'MediEquip Tunisie',
    type: 'agence',
    address: '42 Rue de la République, Ariana 2080',
    city: 'ariana',
    phone: '+216 71 234 567',
    email: 'info@mediequip.tn',
    hours: 'Lun-Ven: 8h-18h, Sam: 9h-14h',
    description:
    'Agence spécialisée dans la location et vente de matériel médical professionnel. Service de livraison et installation inclus.'
  },
  'care-solutions': {
    id: 'care-solutions',
    name: 'Care Solutions',
    type: 'agence',
    address: '28 Avenue de la Liberté, Manouba 2010',
    city: 'manouba',
    phone: '+216 71 345 678',
    email: 'contact@caresolutions.tn',
    hours: 'Lun-Ven: 9h-17h',
    description:
    "Solutions complètes pour l'équipement médical à domicile. Maintenance et support technique 24/7."
  }
};

const mockProviderFilters: EquipmentProviderFilter[] = [
{ id: 'all', name: 'Tous les fournisseurs', type: 'all' },
{
  id: 'parapharmacie-centrale',
  name: 'Parapharmacie Centrale',
  type: 'parapharmacie'
},
{ id: 'mediequip', name: 'MediEquip Tunisie', type: 'agence' },
{ id: 'care-solutions', name: 'Care Solutions', type: 'agence' }];


const mockCatalogEquipment: CatalogEquipmentItem[] = [
{
  id: 1,
  name: 'Fauteuil Roulant Manuel',
  category: 'Mobilité',
  categoryId: 'mobility',
  pricePerDay: 15,
  imageUrl:
  'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'Parapharmacie Centrale',
  providerId: 'parapharmacie-centrale',
  location: 'Tunis Centre',
  city: 'tunis',
  available: true
},
{
  id: 2,
  name: "Concentrateur d'Oxygène 5L",
  category: 'Respiration',
  categoryId: 'respiratory',
  pricePerDay: 35,
  imageUrl:
  'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'MediEquip Tunisie',
  providerId: 'mediequip',
  location: 'Ariana',
  city: 'ariana',
  available: true
},
{
  id: 3,
  name: 'Lit Médicalisé Électrique',
  category: 'Lit & Matelas',
  categoryId: 'bed',
  pricePerDay: 45,
  imageUrl:
  'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'Care Solutions',
  providerId: 'care-solutions',
  location: 'Manouba',
  city: 'manouba',
  available: true
},
{
  id: 4,
  name: 'Déambulateur avec Siège',
  category: 'Mobilité',
  categoryId: 'mobility',
  pricePerDay: 12,
  imageUrl:
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'Parapharmacie Centrale',
  providerId: 'parapharmacie-centrale',
  location: 'Tunis Centre',
  city: 'tunis',
  available: true
},
{
  id: 5,
  name: 'Matelas Anti-Escarres',
  category: 'Lit & Matelas',
  categoryId: 'bed',
  pricePerDay: 25,
  imageUrl:
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'MediEquip Tunisie',
  providerId: 'mediequip',
  location: 'Ariana',
  city: 'ariana',
  available: false
},
{
  id: 6,
  name: 'Tensiomètre Électronique',
  category: 'Monitoring',
  categoryId: 'monitoring',
  pricePerDay: 8,
  imageUrl:
  'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=800&h=600',
  provider: 'Care Solutions',
  providerId: 'care-solutions',
  location: 'Manouba',
  city: 'manouba',
  available: true
}];


// ============================================
// HOOKS
// ============================================

export function useEquipmentCategories2() {
  return useApi<EquipmentCategory[]>(() => Promise.resolve(mockCategories), []);
}

export function useEquipmentCities() {
  return useApi<City[]>(() => Promise.resolve(mockCities), []);
}

export function useEquipmentProviderFilters() {
  return useApi<EquipmentProviderFilter[]>(
    () => Promise.resolve(mockProviderFilters),
    []
  );
}

export function useEquipmentProviderInfo(providerId: string | undefined) {
  return useApi<EquipmentProviderInfo | null>(
    () => {
      if (!providerId || !mockProvidersInfo[providerId])
      return Promise.resolve(null);
      return Promise.resolve(mockProvidersInfo[providerId]);
    },
    [providerId],
    { immediate: !!providerId }
  );
}

export function useCatalogEquipment() {
  return useApi<CatalogEquipmentItem[]>(
    () => Promise.resolve(mockCatalogEquipment),
    []
  );
}