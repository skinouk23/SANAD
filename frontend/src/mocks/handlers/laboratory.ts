/**
 * Laboratory MSW Handlers
 *
 * Intercepts all /api/laboratory requests during development
 * and returns realistic mock data extracted from the old useLaboratory hook.
 */

import { http } from 'msw';

import type { Laboratory, PopularTest } from '@/features/laboratory/schema';
import { apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA
// ============================================

const mockLaboratories: Laboratory[] = [
  {
    id: '1',
    name: 'Laboratoire Central',
    address: 'Avenue Habib Bourguiba, Tunis 1000',
    distance: '1.2 km',
    rating: 4.8,
    reviews: 245,
    phone: '+216 71 123 456',
    hours: 'Lun-Sam: 7h-19h, Dim: 8h-13h',
    services: ['Analyses sanguines', 'Prélèvements à domicile', 'Résultats en ligne'],
    priceRange: '15-150 TND',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400&h=300',
    homeService: true,
  },
  {
    id: '2',
    name: 'BioLab Tunisie',
    address: 'Rue de la Liberté, Ariana 2080',
    distance: '3.5 km',
    rating: 4.6,
    reviews: 189,
    phone: '+216 71 234 567',
    hours: 'Lun-Ven: 7h-18h, Sam: 8h-14h',
    services: ['Analyses complètes', 'Bilan pré-opératoire', 'Tests COVID'],
    priceRange: '20-180 TND',
    image:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400&h=300',
    homeService: true,
  },
  {
    id: '3',
    name: 'MediLab Express',
    address: 'Les Berges du Lac, Tunis 1053',
    distance: '5.8 km',
    rating: 4.9,
    reviews: 312,
    phone: '+216 71 345 678',
    hours: 'Lun-Sam: 6h30-20h, Dim: 7h-15h',
    services: ['Analyses express', 'Bilan hormonal', 'Génétique'],
    priceRange: '25-200 TND',
    image:
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400&h=300',
    homeService: false,
  },
];

const mockPopularTests: PopularTest[] = [
  { name: 'Bilan sanguin complet', price: '45 TND' },
  { name: 'Glycémie', price: '15 TND' },
  { name: 'Cholestérol', price: '25 TND' },
  { name: 'Bilan hépatique', price: '60 TND' },
  { name: 'Bilan rénal', price: '55 TND' },
  { name: 'Hormones thyroïdiennes', price: '80 TND' },
];

// ============================================
// HANDLERS
// ============================================

export const laboratoryHandlers = [
  // ── GET /api/laboratory ─────────────────────────────────────
  http.get('*/api/v1/laboratory', ({ request }) => {
    const url = new URL(request.url);
    // Avoid matching /api/laboratory/popular-tests
    if (url.pathname.includes('/popular-tests')) return;
    return apiOk(mockLaboratories);
  }),

  // ── GET /api/laboratory/popular-tests ───────────────────────
  http.get('*/api/v1/laboratory/popular-tests', () => {
    return apiOk(mockPopularTests);
  }),
];
