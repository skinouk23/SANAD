/**
 * Pharmacy Orders Hooks
 * Custom React hooks for pharmacy order management (provider side)
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface PharmacyOrder {
  id: string;
  patientName: string;
  date: string;
  status: string;
  items: string;
  prescriptionUrl: string;
  address: string;
  phone: string;
  amount?: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_PHARMACY_ORDERS: PharmacyOrder[] = [
{
  id: 'CMD-001',
  patientName: 'Ahmed Ben Ali',
  date: "Aujourd'hui, 10:30",
  status: 'pending',
  items: 'Ordonnance #12345',
  prescriptionUrl: 'https://placehold.co/400x600/png?text=Ordonnance',
  address: 'Les Berges du Lac 2, Tunis',
  phone: '+216 20 123 456'
},
{
  id: 'CMD-002',
  patientName: 'Sarah Mansour',
  date: "Aujourd'hui, 09:15",
  status: 'processing',
  items: 'Doliprane, Vitamine C',
  prescriptionUrl: 'https://placehold.co/400x600/png?text=Ordonnance',
  address: 'La Marsa, Tunis',
  phone: '+216 55 987 654'
},
{
  id: 'CMD-003',
  patientName: 'Mohamed Karray',
  date: 'Hier, 16:45',
  status: 'delivery',
  items: 'Antibiotiques, Sirop',
  amount: '45.500',
  prescriptionUrl: 'https://placehold.co/400x600/png?text=Ordonnance',
  address: 'Carthage, Tunis',
  phone: '+216 98 765 432'
}];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching pharmacy orders list
 */
export function usePharmacyOrdersList() {
  return useApi<PharmacyOrder[]>(
    () => Promise.resolve(MOCK_PHARMACY_ORDERS),
    []
  );
}