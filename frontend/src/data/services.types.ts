/**
 * Service UI Display Types
 * Pure UI types with display properties (icon, badge, basePrice).
 * NOT Zod API schemas — these decorate the view layer (per K002).
 */

// ============================================
// SERVICE TYPE & CATEGORY
// ============================================

export type ServiceType =
  | 'nursing'
  | 'elderly_care'
  | 'physiotherapy'
  | 'maternity'
  | 'checkup'
  | 'night_care'
  | 'ambulance'
  | 'doctor'
  | 'chronic_care'
  | 'medical_companion'
  | 'babysitting'
  | 'nutrition'
  | 'psychology'
  | 'laboratory'
  | 'radiology'
  | 'pharmacy'
  | 'gym'
  | 'funeral'
  | 'veterinary';

export type ServiceCategory = 'medical' | 'daily' | 'rehabilitation' | 'wellness';

// ============================================
// SERVICE
// ============================================

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  maxPrice?: number;
  currency: string;
  priceUnit: string;
  icon: string;
  badge?: string;
  popular?: boolean;
  recurring?: boolean;
  countryCode: string;
  providerId?: string;
  serviceLocation?: string;
  requiresPrescription?: boolean;
  durationMinutes?: number;
  typeConfig?: Record<string, unknown> | null;
}

// ============================================
// SUB-SERVICE
// ============================================

export interface SubService {
  id: string;
  parentServiceType: ServiceType;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration?: number; // minutes
}
