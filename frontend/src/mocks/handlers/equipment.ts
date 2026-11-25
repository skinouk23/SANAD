/**
 * Equipment MSW Handlers
 *
 * Intercepts all /api/equipment/* requests during development and
 * returns realistic mock data shaped to match the Zod schemas.
 * Replaces the in-code mock branching from equipment.service.ts.
 */

import { http } from 'msw';

import { providersData } from '@/data/providers.data';
import type {
  EquipmentResponse,
  EquipmentDetailResponse,
  EquipmentCategoryResponse,
  EquipmentCatalogResponse,
} from '@/features/equipment/schema';
import { apiOk, apiNotFound, randomId } from '@/mocks/utils';

// ============================================
// LOCAL MSW TYPES (no longer exported by feature layer)
// ============================================

interface MswEquipmentBooking {
  id: string;
  equipmentId: string;
  patientId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}

interface EquipmentProviderSeed {
  id: string;
  name: string;
  city: string;
  rating: number;
  verified: boolean;
  phone: string | null;
}

// ============================================
// HELPERS
// ============================================

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// ============================================
// MOCK DATA
// ============================================

const categoryData: { name: string; code: string }[] = [
  { name: 'Mobilité', code: 'mobilite' },
  { name: 'Respiratoire', code: 'respiratoire' },
  { name: 'Lit médicalisé', code: 'lit_medicalise' },
  { name: 'Monitoring', code: 'monitoring' },
  { name: 'Rééducation', code: 'reeducation' },
  { name: 'Aide quotidienne', code: 'aide_quotidienne' },
];

const equipmentItems: {
  name: string;
  category: string;
  pricePerDay: number;
  deposit: number;
  image: string;
}[] = [
  {
    name: 'Fauteuil roulant manuel',
    category: 'mobilite',
    pricePerDay: 15,
    deposit: 100,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
  },
  {
    name: 'Fauteuil roulant électrique',
    category: 'mobilite',
    pricePerDay: 45,
    deposit: 500,
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop',
  },
  {
    name: 'Déambulateur',
    category: 'mobilite',
    pricePerDay: 8,
    deposit: 50,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop',
  },
  {
    name: 'Béquilles (paire)',
    category: 'mobilite',
    pricePerDay: 5,
    deposit: 30,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
  },
  {
    name: "Concentrateur d'oxygène",
    category: 'respiratoire',
    pricePerDay: 35,
    deposit: 300,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop',
  },
  {
    name: 'Appareil CPAP',
    category: 'respiratoire',
    pricePerDay: 25,
    deposit: 200,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop',
  },
  {
    name: 'Nébuliseur',
    category: 'respiratoire',
    pricePerDay: 12,
    deposit: 80,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
  },
  {
    name: 'Lit médicalisé électrique',
    category: 'lit_medicalise',
    pricePerDay: 40,
    deposit: 400,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
  },
  {
    name: 'Matelas anti-escarres',
    category: 'lit_medicalise',
    pricePerDay: 20,
    deposit: 150,
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&h=300&fit=crop',
  },
  {
    name: 'Tensiomètre automatique',
    category: 'monitoring',
    pricePerDay: 5,
    deposit: 40,
    image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=400&h=300&fit=crop',
  },
  {
    name: 'Oxymètre de pouls',
    category: 'monitoring',
    pricePerDay: 4,
    deposit: 30,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
  },
  {
    name: 'Glucomètre',
    category: 'monitoring',
    pricePerDay: 3,
    deposit: 25,
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=400&h=300&fit=crop',
  },
  {
    name: 'Pédalier de rééducation',
    category: 'reeducation',
    pricePerDay: 10,
    deposit: 60,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop',
  },
  {
    name: 'Table de verticalisation',
    category: 'reeducation',
    pricePerDay: 30,
    deposit: 250,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  },
  {
    name: 'Siège de douche',
    category: 'aide_quotidienne',
    pricePerDay: 6,
    deposit: 40,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
  },
  {
    name: 'Rehausseur WC',
    category: 'aide_quotidienne',
    pricePerDay: 4,
    deposit: 30,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop',
  },
];

const brands = ['Invacare', 'Sunrise Medical', 'Drive Medical', 'Philips', 'ResMed'];

const categoryNameMap: Record<string, string> = {
  mobilite: 'Mobilité',
  respiratoire: 'Respiratoire',
  lit_medicalise: 'Lit médicalisé',
  monitoring: 'Monitoring',
  reeducation: 'Rééducation',
  aide_quotidienne: 'Aide quotidienne',
};

function toEquipmentProviderSeed(provider: (typeof providersData)[number]): EquipmentProviderSeed {
  return {
    id: provider.id,
    name: provider.businessName ?? provider.displayName,
    city: provider.city ?? provider.region ?? 'Tunis',
    rating: provider.ratingAverage,
    verified: provider.isVerified,
    phone: provider.phone ?? null,
  };
}

const fallbackEquipmentProviderSeed = toEquipmentProviderSeed(providersData[0]);

const equipmentProviderSeeds: EquipmentProviderSeed[] = providersData
  .filter((provider) => provider.serviceCategory === 'pharmacy' && provider.isAvailable)
  .map(toEquipmentProviderSeed);

function getEquipmentProviderSeed(index: number): EquipmentProviderSeed {
  return (
    equipmentProviderSeeds[index % equipmentProviderSeeds.length] ?? fallbackEquipmentProviderSeed
  );
}

// ---- Lazy-init caches ----
let mockEquipmentResponses: EquipmentResponse[] | null = null;
let mockEquipmentDetails: EquipmentDetailResponse[] | null = null;
let mockBookings: MswEquipmentBooking[] | null = null;

function ensureEquipment(): EquipmentResponse[] {
  if (!mockEquipmentResponses) {
    mockEquipmentResponses = equipmentItems.map((item, i) => {
      const id = uuid();
      const provider = getEquipmentProviderSeed(i);

      return {
        id,
        name: item.name,
        categoryCode: item.category,
        categoryName: categoryNameMap[item.category] ?? item.category,
        brand: brands[i % brands.length],
        imageUrl: item.image,
        pricePerDay: item.pricePerDay,
        availableQuantity: 1 + (i % 4),
        provider: {
          id: provider.id,
          name: provider.name,
          city: provider.city,
        },
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 50) + 5,
      };
    });
  }
  return mockEquipmentResponses;
}

function ensureDetails(): EquipmentDetailResponse[] {
  if (!mockEquipmentDetails) {
    const items = ensureEquipment();
    mockEquipmentDetails = items.map((item, i) => {
      const provider = getEquipmentProviderSeed(i);

      return {
        id: item.id,
        name: item.name,
        description: `${item.name} de qualité professionnelle, entretenu régulièrement et désinfecté après chaque utilisation.`,
        categoryCode: item.categoryCode,
        categoryName: item.categoryName,
        brand: item.brand,
        model: `Model ${2020 + (i % 5)}`,
        images: [item.imageUrl],
        pricePerDay: item.pricePerDay,
        pricePerWeek: Math.round(item.pricePerDay * 6),
        pricePerMonth: Math.round(item.pricePerDay * 22),
        deposit: equipmentItems[i].deposit,
        availableQuantity: item.availableQuantity,
        specifications: {
          'Poids max': `${100 + i * 10} kg`,
          Dimensions: `${50 + i * 5} x ${40 + i * 3} cm`,
        },
        features: [
          'Livraison gratuite Grand Tunis',
          'Installation incluse',
          'Maintenance préventive',
          'Assistance 24/7',
        ],
        provider: {
          id: item.provider.id,
          name: item.provider.name,
          city: item.provider.city,
          rating: provider.rating,
          verified: provider.verified,
          phone: provider.phone,
        },
        rating: item.rating,
        reviewCount: item.reviewCount,
      };
    });
  }
  return mockEquipmentDetails;
}

function ensureBookings(): MswEquipmentBooking[] {
  if (!mockBookings) {
    const items = ensureEquipment();
    mockBookings = Array.from({ length: 10 }, (_, i) => {
      const equip = items[i % items.length];
      const start = new Date();
      start.setDate(start.getDate() + Math.floor(Math.random() * 14));
      const end = new Date(start);
      end.setDate(end.getDate() + Math.floor(Math.random() * 30) + 7);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: randomId(),
        equipmentId: equip.id,
        patientId: randomId(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice: equip.pricePerDay * days,
        deposit: equipmentItems[i % equipmentItems.length].deposit,
        status: (['pending', 'confirmed', 'active', 'returned'] as const)[
          Math.floor(Math.random() * 4)
        ],
        deliveryAddress: `${Math.floor(Math.random() * 100) + 1} Rue de la Liberté, Tunis`,
        createdAt: new Date().toISOString(),
      };
    });
  }
  return mockBookings;
}

// ============================================
// HANDLERS
// ============================================

export const equipmentHandlers = [
  // ── GET /api/equipment/catalog (paginated) ──────────────────
  http.get('*/api/v1/equipment/catalog', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '12');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const available = url.searchParams.get('available');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sortBy = url.searchParams.get('sortBy');
    const sortDesc = url.searchParams.get('sortDesc') === 'true';

    let items = ensureEquipment();

    if (category) {
      items = items.filter((e) => e.categoryCode === category);
    }
    if (available === 'true') {
      items = items.filter((e) => e.availableQuantity > 0);
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.categoryCode.toLowerCase().includes(s) ||
          e.brand.toLowerCase().includes(s),
      );
    }
    if (minPrice) {
      items = items.filter((e) => e.pricePerDay >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter((e) => e.pricePerDay <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'rating') {
      items = [...items].sort((a, b) => (sortDesc ? b.rating - a.rating : a.rating - b.rating));
    } else if (sortBy === 'pricePerDay') {
      items = [...items].sort((a, b) =>
        sortDesc ? b.pricePerDay - a.pricePerDay : a.pricePerDay - b.pricePerDay,
      );
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    const response: EquipmentCatalogResponse = {
      items: paged,
      pagination: { page, limit, total, totalPages },
    };

    return apiOk(response);
  }),

  // ── GET /api/equipment/categories ───────────────────────────
  http.get('*/api/v1/equipment/categories', () => {
    const categories: EquipmentCategoryResponse[] = categoryData.map((c, i) => ({
      id: `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
      code: c.code,
      label: c.name,
      description: null,
      icon: null,
      color: null,
    }));
    return apiOk(categories);
  }),

  // ── GET /api/equipment/:id ──────────────────────────────────
  http.get('*/api/v1/equipment/:id', ({ params }) => {
    const { id } = params;
    const found = ensureDetails().find((e) => e.id === id);
    if (!found) return apiNotFound(`Equipment ${id as string} not found`);
    return apiOk(found);
  }),

  // ── GET /api/equipment/bookings ─────────────────────────────
  http.get('*/api/v1/equipment/bookings', ({ request }) => {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');

    let bookings = ensureBookings();

    if (patientId) {
      bookings = bookings.filter((b) => b.patientId === patientId);
    }
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    return apiOk(bookings);
  }),

  // ── POST /api/equipment/bookings (create) ───────────────────
  http.post('*/api/v1/equipment/bookings', async ({ request }) => {
    const body = (await request.json()) as {
      equipmentId: string;
      patientId: string;
      startDate: string;
      endDate: string;
      deliveryAddress?: string;
      notes?: string;
    };

    const equip = ensureEquipment().find((e) => e.id === body.equipmentId);
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const booking: MswEquipmentBooking = {
      id: randomId(),
      equipmentId: body.equipmentId,
      patientId: body.patientId,
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: (equip?.pricePerDay ?? 10) * days,
      deposit: 100,
      status: 'pending',
      deliveryAddress: body.deliveryAddress,
      notes: body.notes,
      createdAt: new Date().toISOString(),
    };

    ensureBookings().push(booking);
    return apiOk(booking);
  }),

  // ── PATCH /api/equipment/bookings/:id (update) ──────────────
  http.patch('*/api/v1/equipment/bookings/:id', async ({ params, request }) => {
    const { id } = params;
    const bookings = ensureBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return apiNotFound(`Equipment booking ${id as string} not found`);

    const body = (await request.json()) as Partial<MswEquipmentBooking>;
    bookings[idx] = { ...bookings[idx], ...body };
    return apiOk(bookings[idx]);
  }),

  // ── POST /api/equipment/bookings/:id/cancel ─────────────────
  http.post('*/api/v1/equipment/bookings/:id/cancel', ({ params }) => {
    const { id } = params;
    const bookings = ensureBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return apiNotFound(`Equipment booking ${id as string} not found`);

    bookings[idx] = { ...bookings[idx], status: 'cancelled' };
    return apiOk({ id: bookings[idx].id, status: 'cancelled' });
  }),
];

export function getMockEquipmentPricing(serviceId: string): {
  id: string;
  name: string;
  categoryName: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  deposit: number;
  currency: string;
} | null {
  const detail = ensureDetails().find((item) => item.id === serviceId);

  if (!detail) {
    return null;
  }

  return {
    id: detail.id,
    name: detail.name,
    categoryName: detail.categoryName,
    pricePerDay: detail.pricePerDay,
    pricePerWeek: detail.pricePerWeek,
    pricePerMonth: detail.pricePerMonth,
    deposit: detail.deposit,
    currency: 'TND',
  };
}

/** Called by generic bookings MSW handler to decrement equipment stock. */
export function decrementMockEquipmentStock(serviceId: string): boolean {
  const items = ensureEquipment();
  const item = items.find((e) => e.id === serviceId);
  if (item && item.availableQuantity > 0) {
    item.availableQuantity -= 1;
    // Sync detail cache if it exists
    if (mockEquipmentDetails) {
      const detail = mockEquipmentDetails.find((d) => d.id === serviceId);
      if (detail) detail.availableQuantity = item.availableQuantity;
    }
    return true;
  }
  return false;
}
