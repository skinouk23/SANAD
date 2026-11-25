/**
 * Equipment Service
 * Handles all equipment rental-related API calls
 */

import { api } from '../api/client';
import { env } from '../config/env';
import type {
  Equipment,
  EquipmentBooking,
  PaginatedResponse,
  PaginationParams } from
'../types/api.types';

// ============================================
// MOCK DATA
// ============================================

const randomId = () => Math.random().toString(36).substring(2, 15);
const randomDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

const equipmentCategories = [
'Mobilité',
'Respiratoire',
'Lit médicalisé',
'Monitoring',
'Rééducation',
'Aide quotidienne'];


const equipmentItems = [
{
  name: 'Fauteuil roulant manuel',
  category: 'Mobilité',
  pricePerDay: 15,
  deposit: 100,
  image:
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
},
{
  name: 'Fauteuil roulant électrique',
  category: 'Mobilité',
  pricePerDay: 45,
  deposit: 500,
  image:
  'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop'
},
{
  name: 'Déambulateur',
  category: 'Mobilité',
  pricePerDay: 8,
  deposit: 50,
  image:
  'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop'
},
{
  name: 'Béquilles (paire)',
  category: 'Mobilité',
  pricePerDay: 5,
  deposit: 30,
  image:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'
},
{
  name: "Concentrateur d'oxygène",
  category: 'Respiratoire',
  pricePerDay: 35,
  deposit: 300,
  image:
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop'
},
{
  name: 'Appareil CPAP',
  category: 'Respiratoire',
  pricePerDay: 25,
  deposit: 200,
  image:
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop'
},
{
  name: 'Nébuliseur',
  category: 'Respiratoire',
  pricePerDay: 12,
  deposit: 80,
  image:
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop'
},
{
  name: 'Lit médicalisé électrique',
  category: 'Lit médicalisé',
  pricePerDay: 40,
  deposit: 400,
  image:
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop'
},
{
  name: 'Matelas anti-escarres',
  category: 'Lit médicalisé',
  pricePerDay: 20,
  deposit: 150,
  image:
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&h=300&fit=crop'
},
{
  name: 'Tensiomètre automatique',
  category: 'Monitoring',
  pricePerDay: 5,
  deposit: 40,
  image:
  'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=400&h=300&fit=crop'
},
{
  name: 'Oxymètre de pouls',
  category: 'Monitoring',
  pricePerDay: 4,
  deposit: 30,
  image:
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
},
{
  name: 'Glucomètre',
  category: 'Monitoring',
  pricePerDay: 3,
  deposit: 25,
  image:
  'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=400&h=300&fit=crop'
},
{
  name: 'Pédalier de rééducation',
  category: 'Rééducation',
  pricePerDay: 10,
  deposit: 60,
  image:
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop'
},
{
  name: 'Table de verticalisation',
  category: 'Rééducation',
  pricePerDay: 30,
  deposit: 250,
  image:
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
},
{
  name: 'Siège de douche',
  category: 'Aide quotidienne',
  pricePerDay: 6,
  deposit: 40,
  image:
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop'
},
{
  name: 'Rehausseur WC',
  category: 'Aide quotidienne',
  pricePerDay: 4,
  deposit: 30,
  image:
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop'
}];


let mockEquipment: Equipment[] | null = null;
let mockBookings: EquipmentBooking[] | null = null;

function getMockEquipment(): Equipment[] {
  if (!mockEquipment) {
    mockEquipment = equipmentItems.map((item, i) => ({
      id: `equip_${randomId()}`,
      name: item.name,
      description: `${item.name} de qualité professionnelle, entretenu régulièrement et désinfecté après chaque utilisation.`,
      category: item.category,
      brand: [
      'Invacare',
      'Sunrise Medical',
      'Drive Medical',
      'Philips',
      'ResMed'][
      i % 5],
      model: `Model ${2020 + i % 5}`,
      images: [item.image],
      pricePerDay: item.pricePerDay,
      pricePerWeek: Math.round(item.pricePerDay * 6),
      pricePerMonth: Math.round(item.pricePerDay * 22),
      deposit: item.deposit,
      available: Math.random() > 0.2,
      quantity: Math.floor(Math.random() * 5) + 1,
      availableQuantity: Math.floor(Math.random() * 3) + 1,
      specifications: {
        'Poids max': `${100 + Math.floor(Math.random() * 50)} kg`,
        Dimensions: `${50 + Math.floor(Math.random() * 50)} x ${40 + Math.floor(Math.random() * 30)} cm`
      },
      providerId: `provider_${randomId()}`,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 50) + 5,
      createdAt: randomDate(365)
    }));
  }
  return mockEquipment;
}

function getMockBookings(): EquipmentBooking[] {
  if (!mockBookings) {
    const equipment = getMockEquipment();
    mockBookings = Array.from({ length: 10 }, () => {
      const equip = equipment[Math.floor(Math.random() * equipment.length)];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 14));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: `booking_${randomId()}`,
        equipmentId: equip.id,
        equipment: equip,
        patientId: `patient_${randomId()}`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: equip.pricePerDay * days,
        deposit: equip.deposit,
        status: ['pending', 'confirmed', 'active', 'returned'][
        Math.floor(Math.random() * 4)] as
        any,
        deliveryAddress: `${Math.floor(Math.random() * 100) + 1} Rue de la Liberté, Tunis`,
        createdAt: randomDate(30)
      };
    });
  }
  return mockBookings;
}

// ============================================
// EQUIPMENT ENDPOINTS
// ============================================

export interface EquipmentFilters extends PaginationParams {
  category?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export async function getEquipmentList(
filters?: EquipmentFilters)
: Promise<Equipment[]> {
  if (env.ENABLE_MOCK_DATA) {
    let equipment = getMockEquipment();

    if (filters?.category) {
      equipment = equipment.filter((e) => e.category === filters.category);
    }

    if (filters?.available !== undefined) {
      equipment = equipment.filter((e) => e.available === filters.available);
    }

    if (filters?.minPrice) {
      equipment = equipment.filter((e) => e.pricePerDay >= filters.minPrice!);
    }

    if (filters?.maxPrice) {
      equipment = equipment.filter((e) => e.pricePerDay <= filters.maxPrice!);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      equipment = equipment.filter(
        (e) =>
        e.name.toLowerCase().includes(search) ||
        e.category.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search)
      );
    }

    return equipment;
  }

  try {
    return await api.get<Equipment[]>('/equipment', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockEquipment();
  }
}

export async function getEquipmentPaginated(
filters?: EquipmentFilters)
: Promise<PaginatedResponse<Equipment>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 12;

  const allEquipment = await getEquipmentList(filters);
  const total = allEquipment.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = allEquipment.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function getEquipmentById(
equipmentId: string)
: Promise<Equipment | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockEquipment().find((e) => e.id === equipmentId) || null;
  }

  try {
    return await api.get<Equipment>(`/equipment/${equipmentId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockEquipment().find((e) => e.id === equipmentId) || null;
  }
}

export async function getEquipmentCategories(): Promise<string[]> {
  if (env.ENABLE_MOCK_DATA) {
    return equipmentCategories;
  }

  try {
    return await api.get<string[]>('/equipment/categories');
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return equipmentCategories;
  }
}

export async function getFeaturedEquipment(): Promise<Equipment[]> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockEquipment().
    filter((e) => e.available && e.rating && e.rating >= 4).
    slice(0, 6);
  }

  try {
    return await api.get<Equipment[]>('/equipment/featured');
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockEquipment().slice(0, 6);
  }
}

// ============================================
// BOOKING ENDPOINTS
// ============================================

export interface BookingFilters extends PaginationParams {
  patientId?: string;
  equipmentId?: string;
  status?: string;
}

export async function getEquipmentBookings(
filters?: BookingFilters)
: Promise<EquipmentBooking[]> {
  if (env.ENABLE_MOCK_DATA) {
    let bookings = getMockBookings();

    if (filters?.patientId) {
      bookings = bookings.filter((b) => b.patientId === filters.patientId);
    }

    if (filters?.equipmentId) {
      bookings = bookings.filter((b) => b.equipmentId === filters.equipmentId);
    }

    if (filters?.status) {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    return bookings;
  }

  try {
    return await api.get<EquipmentBooking[]>('/equipment/bookings', {
      params: filters
    });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockBookings();
  }
}

export async function createEquipmentBooking(data: {
  equipmentId: string;
  patientId: string;
  startDate: string;
  endDate: string;
  deliveryAddress?: string;
  notes?: string;
}): Promise<EquipmentBooking | null> {
  if (env.ENABLE_MOCK_DATA) {
    const equipment = getMockEquipment().find((e) => e.id === data.equipmentId);
    if (!equipment) return null;

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const newBooking: EquipmentBooking = {
      id: `booking_${Date.now()}`,
      equipmentId: data.equipmentId,
      equipment,
      patientId: data.patientId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: equipment.pricePerDay * days,
      deposit: equipment.deposit,
      status: 'pending',
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };

    getMockBookings().push(newBooking);
    return newBooking;
  }

  try {
    return await api.post<EquipmentBooking>('/equipment/bookings', data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function updateEquipmentBooking(
bookingId: string,
data: Partial<EquipmentBooking>)
: Promise<EquipmentBooking | null> {
  if (env.ENABLE_MOCK_DATA) {
    const bookings = getMockBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...data };
      return bookings[index];
    }
    return null;
  }

  try {
    return await api.patch<EquipmentBooking>(
      `/equipment/bookings/${bookingId}`,
      data
    );
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function cancelEquipmentBooking(
bookingId: string)
: Promise<boolean> {
  if (env.ENABLE_MOCK_DATA) {
    const bookings = getMockBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'cancelled';
      return true;
    }
    return false;
  }

  try {
    await api.post(`/equipment/bookings/${bookingId}/cancel`);
    return true;
  } catch (error) {
    console.warn('API call failed:', error);
    return false;
  }
}

// ============================================
// SERVICE EXPORT
// ============================================

export const equipmentService = {
  getAll: getEquipmentList,
  getPaginated: getEquipmentPaginated,
  getById: getEquipmentById,
  getCategories: getEquipmentCategories,
  getFeatured: getFeaturedEquipment,
  getBookings: getEquipmentBookings,
  createBooking: createEquipmentBooking,
  updateBooking: updateEquipmentBooking,
  cancelBooking: cancelEquipmentBooking
};

export default equipmentService;