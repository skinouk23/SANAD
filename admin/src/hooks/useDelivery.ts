/**
 * Delivery Hooks
 * Custom React hooks for active delivery/service tracking data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface ServiceRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  serviceType: string;
  price: number;
  currency: string;
  patientLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  scheduledTime: string;
  notes?: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockServiceRequest: ServiceRequest = {
  id: 'apt-001',
  patientName: 'Mme. Fatma Ben Ali',
  patientPhone: '+216 98 765 432',
  serviceName: 'Soins Infirmiers - Injection',
  serviceType: 'nursing',
  price: 45,
  currency: 'TND',
  patientLocation: {
    lat: 36.8065,
    lng: 10.1815,
    address: '15 Rue de la Liberté, Tunis 1000'
  },
  scheduledTime: '14:30',
  notes: 'Injection intramusculaire. Patiente diabétique.'
};

// ============================================
// HOOKS
// ============================================

export function useServiceRequest(appointmentId?: string) {
  return useApi<ServiceRequest>(
    () => Promise.resolve(mockServiceRequest),
    [appointmentId],
    { immediate: true }
  );
}