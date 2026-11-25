/**
 * Equipment Hooks
 * Custom React hooks for equipment rental data
 */

import { useCallback, useMemo } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import {
  equipmentService,
  EquipmentFilters,
  BookingFilters } from
'../services/equipment.service';
import type { Equipment, EquipmentBooking } from '../types/api.types';

// ============================================
// EQUIPMENT HOOKS
// ============================================

/**
 * Hook for fetching equipment with filters
 */
export function useEquipment(filters?: EquipmentFilters) {
  const fetchFn = useCallback(
    () => equipmentService.getAll(filters),
    [JSON.stringify(filters)]
  );

  return useApi<Equipment[]>(fetchFn, [JSON.stringify(filters)]);
}

/**
 * Hook for fetching paginated equipment
 */
export function usePaginatedEquipment(initialFilters?: EquipmentFilters) {
  return usePaginatedApi<Equipment, EquipmentFilters>(
    equipmentService.getPaginated,
    initialFilters || { page: 1, limit: 12 }
  );
}

/**
 * Hook for fetching a single equipment item
 */
export function useEquipmentItem(equipmentId: string | undefined) {
  const fetchFn = useCallback(
    () =>
    equipmentId ?
    equipmentService.getById(equipmentId) :
    Promise.resolve(null),
    [equipmentId]
  );

  return useApi<Equipment | null>(fetchFn, [equipmentId], {
    immediate: !!equipmentId
  });
}

/**
 * Hook for fetching equipment categories
 */
export function useEquipmentCategories() {
  return useApi<string[]>(equipmentService.getCategories, []);
}

/**
 * Hook for fetching featured equipment
 */
export function useFeaturedEquipment() {
  return useApi<Equipment[]>(equipmentService.getFeatured, []);
}

/**
 * Hook for searching equipment
 */
export function useEquipmentSearch(query: string) {
  const fetchFn = useCallback(
    () => equipmentService.getAll({ search: query }),
    [query]
  );

  return useApi<Equipment[]>(fetchFn, [query], {
    immediate: query.length >= 2
  });
}

// ============================================
// BOOKING HOOKS
// ============================================

/**
 * Hook for fetching equipment bookings
 */
export function useEquipmentBookings(filters?: BookingFilters) {
  const fetchFn = useCallback(
    () => equipmentService.getBookings(filters),
    [JSON.stringify(filters)]
  );

  return useApi<EquipmentBooking[]>(fetchFn, [JSON.stringify(filters)]);
}

/**
 * Hook for fetching patient's equipment bookings
 */
export function usePatientEquipmentBookings(patientId: string) {
  const fetchFn = useCallback(
    () => equipmentService.getBookings({ patientId }),
    [patientId]
  );

  return useApi<EquipmentBooking[]>(fetchFn, [patientId]);
}

/**
 * Hook for creating an equipment booking
 */
export function useCreateEquipmentBooking() {
  return useMutation(equipmentService.createBooking);
}

/**
 * Hook for updating an equipment booking
 */
export function useUpdateEquipmentBooking() {
  return useMutation(
    ({ id, data }: {id: string;data: Partial<EquipmentBooking>;}) =>
    equipmentService.updateBooking(id, data)
  );
}

/**
 * Hook for cancelling an equipment booking
 */
export function useCancelEquipmentBooking() {
  return useMutation(equipmentService.cancelBooking);
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for calculating rental price
 */
export function useRentalPrice(
equipment: Equipment | null,
startDate: string | null,
endDate: string | null)
{
  return useMemo(() => {
    if (!equipment || !startDate || !endDate) {
      return { days: 0, price: 0, deposit: 0, total: 0 };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return { days: 0, price: 0, deposit: 0, total: 0 };
    }

    let price: number;
    if (days >= 30) {
      // Use monthly rate
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      price =
      months * equipment.pricePerMonth + remainingDays * equipment.pricePerDay;
    } else if (days >= 7) {
      // Use weekly rate
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      price =
      weeks * equipment.pricePerWeek + remainingDays * equipment.pricePerDay;
    } else {
      // Use daily rate
      price = days * equipment.pricePerDay;
    }

    return {
      days,
      price: Math.round(price),
      deposit: equipment.deposit,
      total: Math.round(price) + equipment.deposit
    };
  }, [equipment, startDate, endDate]);
}

/**
 * Hook for equipment availability status
 */
export function useEquipmentAvailability(equipment: Equipment | null) {
  return useMemo(() => {
    if (!equipment) {
      return {
        available: false,
        label: 'Non disponible',
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/20'
      };
    }

    if (!equipment.available || equipment.availableQuantity === 0) {
      return {
        available: false,
        label: 'Indisponible',
        color: 'text-red-500',
        bgColor: 'bg-red-500/20'
      };
    }

    if (equipment.availableQuantity <= 2) {
      return {
        available: true,
        label: `${equipment.availableQuantity} restant(s)`,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/20'
      };
    }

    return {
      available: true,
      label: 'Disponible',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    };
  }, [equipment]);
}

/**
 * Hook for booking status helpers
 */
export function useBookingStatus(status: string) {
  return useMemo(() => {
    const statusConfig: Record<
      string,
      {
        label: string;
        color: string;
        bgColor: string;
        borderColor: string;
      }> =
    {
      pending: {
        label: 'En attente',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/50'
      },
      confirmed: {
        label: 'Confirmée',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50'
      },
      active: {
        label: 'En cours',
        color: 'text-green-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50'
      },
      returned: {
        label: 'Retournée',
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/20',
        borderColor: 'border-slate-500/50'
      },
      cancelled: {
        label: 'Annulée',
        color: 'text-red-500',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50'
      }
    };

    return statusConfig[status] || statusConfig.pending;
  }, [status]);
}

/**
 * Hook for equipment category icon
 */
export function useEquipmentCategoryIcon(category: string) {
  return useMemo(() => {
    const icons: Record<string, string> = {
      Mobilité: '🦽',
      Respiratoire: '💨',
      'Lit médicalisé': '🛏️',
      Monitoring: '📊',
      Rééducation: '🏋️',
      'Aide quotidienne': '🚿'
    };

    return icons[category] || '📦';
  }, [category]);
}