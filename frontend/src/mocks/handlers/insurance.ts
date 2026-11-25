/**
 * Insurance MSW Handlers
 *
 * Intercepts all /api/insurance requests during development
 * and returns realistic mock data extracted from the old useInsurance hook.
 */

import { http } from 'msw';

import type {
  CoverageSection,
  InsuranceClaim,
  InsuranceDocument,
  InsuranceStats,
} from '@/features/insurance/schema';
import { apiOk } from '@/mocks/utils';

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
        limit: '100 000 TND',
      },
      { text: 'Erreurs professionnelles et fautes', limit: '300 000 TND' },
      { text: "Défense juridique et frais d'avocat", limit: '50 000 TND' },
    ],
  },
  {
    category: 'Protection Étendue',
    items: [
      {
        text: 'Accidents lors des déplacements professionnels',
        limit: '200 000 TND',
      },
      { text: 'Vol ou perte de matériel médical', limit: '20 000 TND' },
      { text: 'Protection juridique administrative', limit: '30 000 TND' },
      { text: 'Assistance psychologique post-incident', limit: 'Illimité' },
    ],
  },
];

const mockClaims: InsuranceClaim[] = [
  {
    id: 'e5f6a7b8-c9d0-1234-afab-345678901234',
    date: '2023-12-15',
    type: 'Dommage matériel',
    status: 'resolved',
    amount: 850,
    description: 'Bris de matériel chez un patient',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-babc-456789012345',
    date: '2023-11-03',
    type: 'Défense juridique',
    status: 'in-progress',
    amount: 2500,
    description: 'Contestation de prestation',
  },
];

const mockDocuments: InsuranceDocument[] = [
  {
    name: "Attestation d'assurance 2024",
    size: '245 KB',
    date: '2024-01-01',
  },
  { name: 'Conditions générales', size: '1.2 MB', date: '2024-01-01' },
  { name: 'Guide des garanties', size: '890 KB', date: '2024-01-01' },
];

const mockInsuranceStats: InsuranceStats = {
  status: 'Active',
  validUntil: '31 Déc 2024',
  maxCoverage: '500K TND',
  claimsCount: 2,
  franchise: '0 TND',
};

// ============================================
// HANDLERS
// ============================================

export const insuranceHandlers = [
  // ── GET /api/insurance/coverage ─────────────────────────────
  http.get('*/api/v1/insurance/coverage', () => {
    return apiOk(mockCoverageDetails);
  }),

  // ── GET /api/insurance/claims ───────────────────────────────
  http.get('*/api/v1/insurance/claims', () => {
    return apiOk(mockClaims);
  }),

  // ── GET /api/insurance/documents ────────────────────────────
  http.get('*/api/v1/insurance/documents', () => {
    return apiOk(mockDocuments);
  }),

  // ── GET /api/insurance/stats ────────────────────────────────
  http.get('*/api/v1/insurance/stats', () => {
    return apiOk(mockInsuranceStats);
  }),
];
