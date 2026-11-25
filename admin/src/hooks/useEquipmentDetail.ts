/**
 * Equipment Detail Hook
 * Custom React hook for equipment detail page data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface EquipmentDetailData {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  provider: {
    name: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  deposit: number;
  specifications: Array<{label: string;value: string;}>;
  features: string[];
}

// ============================================
// MOCK DATA
// ============================================

const mockEquipmentDetail: EquipmentDetailData = {
  name: "Concentrateur d'Oxygène 5L/min",
  category: 'Respiration',
  description:
  "Concentrateur d'oxygène médical de qualité hospitalière, silencieux et économe en énergie. Idéal pour les patients nécessitant une oxygénothérapie à domicile.",
  imageUrl:
  'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=1200&h=800',
  provider: {
    name: 'MediEquip Tunisie',
    location: 'Ariana',
    rating: 4.8,
    verified: true
  },
  pricing: {
    daily: 35,
    weekly: 210,
    monthly: 750
  },
  deposit: 300,
  specifications: [
  { label: 'Débit', value: '0-5 L/min' },
  { label: 'Concentration O₂', value: '93% ± 3%' },
  { label: 'Niveau sonore', value: '< 45 dB' },
  { label: 'Poids', value: '18 kg' },
  { label: 'Garantie', value: '1 an' }],

  features: [
  'Installation et formation incluses',
  'Maintenance préventive gratuite',
  'Remplacement en cas de panne sous 24h',
  'Livraison et retour gratuits (Grand Tunis)',
  'Assistance téléphonique 24/7']

};

// ============================================
// HOOKS
// ============================================

export function useEquipmentDetailData(equipmentId: string | undefined) {
  return useApi<EquipmentDetailData | null>(
    () => {
      if (!equipmentId) return Promise.resolve(null);
      // In the future, fetch by ID from API
      return Promise.resolve(mockEquipmentDetail);
    },
    [equipmentId],
    { immediate: !!equipmentId }
  );
}