/**
 * Service Catalog MSW Handlers
 *
 * Intercepts all /api/.../service-catalog/* requests during development.
 * Returns realistic mock data shaped to match the Zod schemas.
 */

import { http } from 'msw';
import { servicesData, getServiceById, getServicesByCategory } from '@/data/services.data';
import type { Service } from '@/data/services.types';
import type {
  PatientServiceItemResponse,
  PatientServiceDetailResponse,
  ServiceCategoryGroupResponse,
} from '@/features/services/schema';
import { apiOk, apiNotFound } from '@/mocks/utils';

// ============================================
// MAPPING HELPERS
// ============================================

function toCatalogItem(s: Service): PatientServiceItemResponse {
  return {
    id: s.id,
    name: s.name,
    shortDescription: s.description,
    category: s.type,
    price: s.basePrice,
    priceType: s.priceUnit ?? null,
    currency: s.currency,
    serviceLocation: s.serviceLocation ?? null,
    requiresPrescription: s.requiresPrescription ?? false,
    isUrgent: false,
    durationMinutes: s.durationMinutes ?? null,
    imageUrl: null,
    typeConfig: s.typeConfig ?? null,
    provider: undefined,
  };
}

function toDetailResponse(s: Service): PatientServiceDetailResponse {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    shortDescription: s.description,
    category: s.type,
    price: s.basePrice,
    priceType: s.priceUnit ?? null,
    currency: s.currency,
    minPrice: null,
    maxPrice: s.maxPrice ?? null,
    durationMinutes: s.durationMinutes ?? null,
    minDurationMinutes: null,
    maxDurationMinutes: null,
    serviceLocation: s.serviceLocation ?? null,
    requiresPrescription: s.requiresPrescription ?? false,
    requiresMedicalHistory: false,
    isUrgent: false,
    ageRestrictionMin: null,
    ageRestrictionMax: null,
    imageUrl: null,
    galleryUrls: [],
    provider: undefined,
  };
}

// ============================================
// HANDLERS
// ============================================

export const serviceHandlers = [
  // ── GET /service-catalog/categories ─────────────────────────
  http.get('*/api/v1/service-catalog/categories', () => {
    const groups: ServiceCategoryGroupResponse[] = [
      {
        displayGroup: 'Medical',
        categories: [
          {
            code: 'nursing',
            label: 'Soins infirmiers',
            description: 'Injections, pansements, perfusions, prise de sang.',
            icon: 'syringe',
            color: '#06b6d4,#3b82f6',
            badge: null,
            displayOrder: 1,
            minPrice: 40,
            maxPrice: 150,
          },
          {
            code: 'doctor',
            label: 'Médecin à domicile',
            description: 'Généraliste ou spécialiste. Consultations à domicile.',
            icon: 'stethoscope',
            color: '#3b82f6,#06b6d4',
            badge: null,
            displayOrder: 4,
            minPrice: 80,
            maxPrice: 200,
          },
          {
            code: 'laboratory',
            label: 'Analyses laboratoire',
            description: 'Analyses médicales, prélèvements à domicile, résultats en ligne.',
            icon: 'flask-conical',
            color: '#3b82f6,#6366f1',
            badge: 'Nouveau',
            displayOrder: 9,
            minPrice: 15,
            maxPrice: 300,
          },
          {
            code: 'radiology',
            label: 'Radiologie',
            description: 'Radio, échographie, scanner, IRM. Rendez-vous rapides.',
            icon: 'scan',
            color: '#a855f7,#6366f1',
            badge: 'Nouveau',
            displayOrder: 10,
            minPrice: 50,
            maxPrice: 500,
          },
          {
            code: 'ambulance',
            label: 'Transport sanitaire',
            description: 'Transport médicalisé, hôpital\u2013domicile, inter-cliniques.',
            icon: 'ambulance',
            color: '#ef4444,#f43f5e',
            badge: 'Premium',
            displayOrder: 11,
            minPrice: 80,
            maxPrice: 300,
          },
          {
            code: 'checkup',
            label: 'Bilan de Santé',
            description: 'Prise de constantes, tension, glycémie.',
            icon: 'thermometer',
            color: '#22c55e,#10b981',
            badge: null,
            displayOrder: 15,
            minPrice: 25,
            maxPrice: 100,
          },
          {
            code: 'pharmacy',
            label: 'Pharmacie',
            description: 'Services pharmaceutiques, dépistages, livraison de médicaments.',
            icon: 'pill',
            color: '#22c55e,#14b8a6',
            badge: null,
            displayOrder: 18,
            minPrice: 5,
            maxPrice: 50,
          },
        ],
      },
      {
        displayGroup: 'Daily',
        categories: [
          {
            code: 'elderly_care',
            label: 'Aide aux personnes âgées',
            description: 'Toilette, habillage, repas, compagnie.',
            icon: 'heart',
            color: '#f43f5e,#ec4899',
            badge: null,
            displayOrder: 2,
            minPrice: 30,
            maxPrice: 100,
          },
          {
            code: 'maternity',
            label: 'Aide maternité',
            description: 'Suivi post-natal, allaitement, soins bébé.',
            icon: 'baby',
            color: '#f59e0b,#f97316',
            badge: null,
            displayOrder: 5,
            minPrice: 50,
            maxPrice: 150,
          },
          {
            code: 'night_care',
            label: 'Garde de nuit',
            description: 'Surveillance et assistance nocturne (12h).',
            icon: 'user-check',
            color: '#6366f1,#a855f7',
            badge: null,
            displayOrder: 6,
            minPrice: 100,
            maxPrice: 200,
          },
          {
            code: 'equipment_rental',
            label: 'Location matériel médical',
            description: 'Fauteuils roulants, lits, dispositifs médicaux à domicile.',
            icon: 'accessibility',
            color: '#64748b,#3b82f6',
            badge: null,
            displayOrder: 13,
            minPrice: 15,
            maxPrice: 80,
          },
          {
            code: 'medical_companion',
            label: 'Accompagnement Médical',
            description: 'Accompagnement hôpital, rendez-vous, démarches administratives.',
            icon: 'hand-heart',
            color: '#14b8a6,#06b6d4',
            badge: null,
            displayOrder: 16,
            minPrice: 20,
            maxPrice: 60,
          },
          {
            code: 'babysitting',
            label: 'Baby Sitting',
            description: "Garde d'enfants à domicile par des professionnels qualifiés.",
            icon: 'smile',
            color: '#ec4899,#f43f5e',
            badge: 'Nouveau',
            displayOrder: 17,
            minPrice: 15,
            maxPrice: 40,
          },
          {
            code: 'funeral',
            label: 'Services Funéraires',
            description: 'Accompagnement et organisation des obsèques avec dignité.',
            icon: 'flower-2',
            color: '#64748b,#6b7280',
            badge: null,
            displayOrder: 19,
            minPrice: null,
            maxPrice: null,
          },
        ],
      },
      {
        displayGroup: 'Rehabilitation',
        categories: [
          {
            code: 'physiotherapy',
            label: 'Kinésithérapie',
            description: 'Rééducation motrice, respiratoire, massage.',
            icon: 'activity',
            color: '#3b82f6,#a855f7',
            badge: null,
            displayOrder: 3,
            minPrice: 50,
            maxPrice: 120,
          },
          {
            code: 'chronic_care',
            label: 'Soins maladies chroniques',
            description: 'Diabète, HTA, cancer. Forfaits hebdomadaires/mensuels.',
            icon: 'calendar',
            color: '#a855f7,#ec4899',
            badge: 'Abonnement',
            displayOrder: 8,
            minPrice: 150,
            maxPrice: 500,
          },
        ],
      },
      {
        displayGroup: 'Wellness',
        categories: [
          {
            code: 'psychology',
            label: 'Psychologie',
            description: 'Dépression seniors, aidants familiaux. Séances à domicile.',
            icon: 'brain',
            color: '#ec4899,#f43f5e',
            badge: null,
            displayOrder: 7,
            minPrice: 70,
            maxPrice: 150,
          },
          {
            code: 'nutrition',
            label: 'Nutrition/Diététique',
            description: 'Repas diabétiques, pauvres en sel, post-hospitalisation.',
            icon: 'utensils-crossed',
            color: '#f59e0b,#eab308',
            badge: null,
            displayOrder: 12,
            minPrice: 10,
            maxPrice: 50,
          },
          {
            code: 'gym',
            label: 'Coach sportif santé',
            description: 'Fitness, musculation, cours collectifs. Abonnements flexibles.',
            icon: 'trophy',
            color: '#f59e0b,#f97316',
            badge: 'Nouveau',
            displayOrder: 14,
            minPrice: 80,
            maxPrice: 250,
          },
          {
            code: 'veterinary',
            label: 'Vétérinaire',
            description: 'Soins vétérinaires, vaccination, chirurgie, toilettage et urgences.',
            icon: 'paw-print',
            color: '#10b981,#22c55e',
            badge: null,
            displayOrder: 20,
            minPrice: 30,
            maxPrice: 200,
          },
        ],
      },
    ];
    return apiOk(groups);
  }),

  // ── GET /service-catalog/:id ────────────────────────────────
  http.get('*/api/v1/service-catalog/:id', ({ params }) => {
    const id = params.id as string;
    const service = getServiceById(id);
    if (!service) return apiNotFound(`Service '${id}' not found`);
    return apiOk(toDetailResponse(service));
  }),

  // ── GET /service-catalog (paginated catalog) ────────────────
  http.get('*/api/v1/service-catalog', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const providerId = url.searchParams.get('providerId');
    const search = url.searchParams.get('search');
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '12');

    let services = [...servicesData];

    if (category) {
      services = getServicesByCategory(category);
    }

    if (providerId) {
      const providerScopedServices = services.filter(
        (service) => service.providerId === providerId,
      );
      services =
        providerScopedServices.length > 0
          ? providerScopedServices
          : services.filter((service) => !service.providerId);
    } else {
      services = services.filter((service) => !service.providerId);
    }

    if (search) {
      const q = search.toLowerCase();
      services = services.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      );
    }

    const total = services.length;
    const start = (page - 1) * limit;
    const paged = services.slice(start, start + limit);

    return apiOk({
      items: paged.map(toCatalogItem),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }),
];
