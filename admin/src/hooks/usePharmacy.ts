/**
 * Pharmacy Hooks
 * Custom React hooks for pharmacy orders and medicament data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface PharmacyOrder {
  id: string;
  pharmacyName: string;
  date: string;
  status: 'pending' | 'processing' | 'delivery' | 'completed';
  amount?: string;
  items: string;
  prescriptionPreview?: string;
}

export interface PharmacyOrderStats {
  activeCount: number;
  completedCount: number;
  totalSpent: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockPharmacyOrders: PharmacyOrder[] = [
{
  id: 'REQ-001',
  pharmacyName: 'Pharmacie Centrale',
  date: "Aujourd'hui, 10:30",
  status: 'delivery',
  amount: '45.500',
  items: 'Doliprane, Vitamine C, Antibiotique',
  prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
},
{
  id: 'REQ-002',
  pharmacyName: 'Pharmacie El Manar',
  date: 'Hier, 14:15',
  status: 'processing',
  items: 'Sirop toux, Pastilles',
  prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
},
{
  id: 'REQ-003',
  pharmacyName: 'Pharmacie Les Berges',
  date: '25 Jan, 09:00',
  status: 'completed',
  amount: '12.800',
  items: 'Bandes, Antiseptique',
  prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
}];


// ============================================
// HOOKS
// ============================================

export function usePharmacyOrders(filter?: 'all' | 'active' | 'completed') {
  return useApi<PharmacyOrder[]>(() => {
    let orders = [...mockPharmacyOrders];
    if (filter === 'active') {
      orders = orders.filter((o) => o.status !== 'completed');
    } else if (filter === 'completed') {
      orders = orders.filter((o) => o.status === 'completed');
    }
    return Promise.resolve(orders);
  }, [filter]);
}

export function usePharmacyOrderStats() {
  return useApi<PharmacyOrderStats>(() => {
    const activeCount = mockPharmacyOrders.filter(
      (r) => r.status !== 'completed'
    ).length;
    const completedCount = mockPharmacyOrders.filter(
      (r) => r.status === 'completed'
    ).length;
    const totalSpent = mockPharmacyOrders.
    filter((r) => r.amount).
    reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0).
    toFixed(3);
    return Promise.resolve({ activeCount, completedCount, totalSpent });
  }, []);
}