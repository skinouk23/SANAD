/**
 * Users MSW Handlers
 *
 * Intercepts patient self-service and patient directory requests used by the
 * legacy users feature. Provider public/self-profile routes are owned by
 * `providers.ts`, and family-circle routes are owned by `family-circle.ts`.
 */

import { http, HttpResponse } from 'msw';
import { generatePatients } from '@/data/mock/generators';
import {
  getPatientPreferences,
  getPatientProfile,
  updatePatientPreferences,
  updatePatientProfile,
} from '@/mocks/handlers/patientProfileStore';
import { apiOk } from '@/mocks/utils';

import type {
  UpdatePatientPreferencesRequest,
  UpdatePatientProfileRequest,
} from '@/features/family-circle/schema';
import type { Patient } from '@/data/mock/types';

// ============================================
// MOCK DATA CACHE (lazily initialised once)
// ============================================

let mockPatients: Patient[] | null = null;
function patients(): Patient[] {
  if (!mockPatients) mockPatients = generatePatients(50);
  return mockPatients;
}

// ============================================
// PAGINATION HELPER
// ============================================

function paginate<T>(items: T[], page = 1, limit = 10) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  };
}

interface Searchable {
  name?: string;
  email?: string;
}

function searchFilter<T extends Searchable>(items: T[], search?: string): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter(
    (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
  );
}

// ============================================
// PATIENT SELF-SERVICE
// ============================================

const patientSelfServiceHandlers = [
  // GET /patients/me
  http.get('*/patients/me', () => {
    return apiOk(getPatientProfile());
  }),

  // PUT /patients/me
  http.put('*/patients/me', async ({ request }) => {
    const data = (await request.json()) as UpdatePatientProfileRequest;
    return apiOk(updatePatientProfile(data));
  }),

  // GET /patients/me/favorites
  http.get('*/patients/me/favorites', () => apiOk([])),

  // POST /patients/me/favorites
  http.post('*/patients/me/favorites', async ({ request }) => {
    const data = (await request.json()) as Record<string, unknown>;
    return apiOk({
      providerId: data.providerId,
      addedAt: new Date().toISOString(),
    });
  }),

  // DELETE /patients/me/favorites/:id
  http.delete('*/patients/me/favorites/:id', () => new HttpResponse(null, { status: 204 })),

  // GET /patients/me/preferences
  http.get('*/patients/me/preferences', () => {
    return apiOk(getPatientPreferences());
  }),

  // PUT /patients/me/preferences
  http.put('*/patients/me/preferences', async ({ request }) => {
    const data = (await request.json()) as UpdatePatientPreferencesRequest;
    return apiOk(updatePatientPreferences(data));
  }),
];

// ============================================
// PATIENT DIRECTORY
// ============================================

const directoryHandlers = [
  // GET /patients
  http.get('*/patients', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? undefined;
    const status = url.searchParams.get('status') ?? undefined;
    const segment = url.searchParams.get('segment') ?? undefined;
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 50);

    let items = searchFilter(patients(), search);
    if (status) items = items.filter((p) => p.status === status);
    if (segment) items = items.filter((p) => p.segment === segment);

    // If page param present, return paginated
    if (url.searchParams.has('page')) {
      return apiOk(paginate(items, page, limit));
    }
    return apiOk(items);
  }),

  // GET /patients/:id
  http.get('*/patients/:id', ({ params }) => {
    const patient = patients().find((p) => p.id === params.id);
    return patient ? apiOk(patient) : new HttpResponse(null, { status: 404 });
  }),

  // PATCH /patients/:id
  http.patch('*/patients/:id', async ({ params, request }) => {
    const data = (await request.json()) as Record<string, unknown>;
    const index = patients().findIndex((p) => p.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    patients()[index] = { ...patients()[index], ...data, updatedAt: new Date().toISOString() };
    return apiOk(patients()[index]);
  }),
];

// ============================================
// EXPORT
// ============================================

export const usersHandlers = [...patientSelfServiceHandlers, ...directoryHandlers];
