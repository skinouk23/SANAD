/**
 * Pharmacy MSW Handlers
 *
 * Intercepts all /api/pharmacy requests during development
 * and returns realistic mock data extracted from the old
 * usePharmacy.ts and usePharmacyOrders.ts hooks.
 */

import { http, HttpResponse } from 'msw';

import type {
  PharmacyOrder,
  PharmacyOrderStats,
  ProviderPharmacyOrder,
} from '@/features/pharmacy/schema';
import { apiNotFound, apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA — Patient-side orders
// ============================================

const mockPharmacyOrders: PharmacyOrder[] = [
  {
    id: 'REQ-001',
    pharmacyName: 'Pharmacie Centrale',
    date: "Aujourd'hui, 10:30",
    status: 'delivery',
    amount: '45.500',
    items: 'Doliprane, Vitamine C, Antibiotique',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx',
  },
  {
    id: 'REQ-002',
    pharmacyName: 'Pharmacie El Manar',
    date: 'Hier, 14:15',
    status: 'processing',
    items: 'Sirop toux, Pastilles',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx',
  },
  {
    id: 'REQ-003',
    pharmacyName: 'Pharmacie Les Berges',
    date: '25 Jan, 09:00',
    status: 'completed',
    amount: '12.800',
    items: 'Bandes, Antiseptique',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx',
  },
];

// ============================================
// MOCK DATA — Provider-side orders
// ============================================

const mockProviderOrders: ProviderPharmacyOrder[] = [
  {
    id: 'CMD-001',
    patientName: 'Ahmed Ben Ali',
    date: "Aujourd'hui, 10:30",
    status: 'pending',
    items: 'Ordonnance #12345',
    prescriptionFileId: '11111111-1111-1111-1111-111111111111',
    address: 'Les Berges du Lac 2, Tunis',
    phone: '+216 20 123 456',
  },
  {
    id: 'CMD-002',
    patientName: 'Sarah Mansour',
    date: "Aujourd'hui, 09:15",
    status: 'processing',
    items: 'Doliprane, Vitamine C',
    prescriptionFileId: '22222222-2222-2222-2222-222222222222',
    address: 'La Marsa, Tunis',
    phone: '+216 55 987 654',
  },
  {
    id: 'CMD-003',
    patientName: 'Mohamed Karray',
    date: 'Hier, 16:45',
    status: 'delivery',
    items: 'Antibiotiques, Sirop',
    amount: '45.500',
    prescriptionFileId: '33333333-3333-3333-3333-333333333333',
    address: 'Carthage, Tunis',
    phone: '+216 98 765 432',
  },
];

// ============================================
// HELPERS
// ============================================

function computeStats(orders: PharmacyOrder[]): PharmacyOrderStats {
  const activeCount = orders.filter((o) => o.status !== 'completed').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalSpent = orders
    .filter((o) => o.amount)
    .reduce((sum, o) => sum + parseFloat(o.amount || '0'), 0)
    .toFixed(3);
  return { activeCount, completedCount, totalSpent };
}

function createMockPrescriptionContentResponse(order: ProviderPharmacyOrder) {
  const safeOrderId = order.id.replace(/[^a-zA-Z0-9-]/g, '-');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960"><rect width="720" height="960" fill="#ffffff"/><rect x="48" y="48" width="624" height="864" rx="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><text x="96" y="140" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#0f172a">Prescription</text><text x="96" y="205" font-family="Arial, sans-serif" font-size="24" fill="#334155">Order: ${order.id}</text><text x="96" y="255" font-family="Arial, sans-serif" font-size="24" fill="#334155">Patient: ${order.patientName}</text><line x1="96" y1="315" x2="624" y2="315" stroke="#cbd5e1" stroke-width="2"/><text x="96" y="380" font-family="Arial, sans-serif" font-size="26" fill="#0f172a">${order.items}</text><text x="96" y="800" font-family="Arial, sans-serif" font-size="20" fill="#64748b">Mock provider prescription preview</text></svg>`;

  return new HttpResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `inline; filename="prescription-${safeOrderId}.svg"`,
      'Cache-Control': 'private, max-age=60',
    },
  });
}

// ============================================
// HANDLERS
// ============================================

export const pharmacyHandlers = [
  // ── GET /api/pharmacy/orders/stats ──────────────────────────
  // Must be registered before the broader /api/pharmacy/orders route
  http.get('*/api/v1/pharmacy/orders/stats', () => {
    return apiOk(computeStats(mockPharmacyOrders));
  }),

  // ── GET /api/pharmacy/orders ────────────────────────────────
  http.get('*/api/v1/pharmacy/orders', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');

    let orders = [...mockPharmacyOrders];
    if (filter === 'active') {
      orders = orders.filter((o) => o.status !== 'completed');
    } else if (filter === 'completed') {
      orders = orders.filter((o) => o.status === 'completed');
    }

    return apiOk(orders);
  }),

  // ── GET /api/pharmacy/provider-orders ───────────────────────
  http.get('*/api/v1/pharmacy/provider-orders/:orderId/prescription/content', ({ params }) => {
    const order = mockProviderOrders.find((item) => item.id === params.orderId);

    if (!order) {
      return apiNotFound('Prescription not found');
    }

    return createMockPrescriptionContentResponse(order);
  }),

  http.get('*/api/v1/pharmacy/provider-orders', () => {
    return apiOk(mockProviderOrders);
  }),
];
