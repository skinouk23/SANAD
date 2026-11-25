/**
 * Insurance Hooks
 * Custom React hooks for provider insurance data
 * Replace Promise.resolve() with actual API calls when backend is ready
 */

import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface CoverageItem {
  text: string;
  limit: string;
}

export interface CoverageSection {
  category: string;
  items: CoverageItem[];
}

export interface InsuranceClaim {
  id: number;
  date: string;
  type: string;
  status: 'resolved' | 'in-progress' | 'pending';
  amount: number;
  description: string;
}

export interface InsuranceDocument {
  name: string;
  size: string;
  date: string;
}

export interface InsuranceStats {
  status: string;
  validUntil: string;
  maxCoverage: string;
  claimsCount: number;
  franchise: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockCoverageDetails: CoverageSection[] = [
{
  category: 'Responsabilité Civile Professionnelle',
  items: [
  { text: 'Dommages corporels causés aux patients', limit: '500 000 TND' },
  {
    text: 'Dommages matériels lors des interventions',
    limit: '100 000 TND'
  },
  { text: 'Erreurs professionnelles et fautes', limit: '300 000 TND' },
  { text: "Défense juridique et frais d'avocat", limit: '50 000 TND' }]

},
{
  category: 'Protection Étendue',
  items: [
  {
    text: 'Accidents lors des déplacements professionnels',
    limit: '200 000 TND'
  },
  { text: 'Vol ou perte de matériel médical', limit: '20 000 TND' },
  { text: 'Protection juridique administrative', limit: '30 000 TND' },
  { text: 'Assistance psychologique post-incident', limit: 'Illimité' }]

}];


const mockClaims: InsuranceClaim[] = [
{
  id: 1,
  date: '15 Déc 2023',
  type: 'Dommage matériel',
  status: 'resolved',
  amount: 850,
  description: 'Bris de matériel chez un patient'
},
{
  id: 2,
  date: '3 Nov 2023',
  type: 'Défense juridique',
  status: 'in-progress',
  amount: 2500,
  description: 'Contestation de prestation'
}];


const mockDocuments: InsuranceDocument[] = [
{ name: "Attestation d'assurance 2024", size: '245 KB', date: '1 Jan 2024' },
{ name: 'Conditions générales', size: '1.2 MB', date: '1 Jan 2024' },
{ name: 'Guide des garanties', size: '890 KB', date: '1 Jan 2024' }];


const mockInsuranceStats: InsuranceStats = {
  status: 'Active',
  validUntil: '31 Déc 2024',
  maxCoverage: '500K TND',
  claimsCount: 2,
  franchise: '0 TND'
};

// ============================================
// HOOKS
// ============================================

export function useInsuranceCoverage() {
  return useApi<CoverageSection[]>(
    () => Promise.resolve(mockCoverageDetails),
    []
  );
}

export function useInsuranceClaims() {
  return useApi<InsuranceClaim[]>(() => Promise.resolve(mockClaims), []);
}

export function useInsuranceDocuments() {
  return useApi<InsuranceDocument[]>(() => Promise.resolve(mockDocuments), []);
}

export function useInsuranceStats() {
  return useApi<InsuranceStats>(() => Promise.resolve(mockInsuranceStats), []);
}