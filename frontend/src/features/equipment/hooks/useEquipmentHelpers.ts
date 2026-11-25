/**
 * Equipment Helper Hooks (pure computation)
 *
 * These hooks are pure useMemo wrappers — they do NOT use TanStack Query.
 * Ported from src/hooks/useEquipment.ts utility hooks.
 */

import { useMemo } from 'react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import type { EquipmentResponse, EquipmentDetailResponse } from '@/features/equipment/schema';

// ============================================
// AVAILABILITY
// ============================================

/**
 * Derive availability status label and colors from an equipment item.
 * Accepts either a catalog item (EquipmentResponse) or a detail item
 * (EquipmentDetailResponse). Availability is derived from availableQuantity.
 */
export function useEquipmentAvailability(
  equipment: EquipmentResponse | EquipmentDetailResponse | null,
) {
  const { t } = useLanguage();
  return useMemo(() => {
    if (!equipment) {
      return {
        available: false,
        label: t.equipment.notAvailable,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
      };
    }

    if (equipment.availableQuantity === 0) {
      return {
        available: false,
        label: t.equipment.unavailable,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      };
    }

    if (equipment.availableQuantity <= 2) {
      return {
        available: true,
        label: `${equipment.availableQuantity} ${t.equipment.remaining}`,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
      };
    }

    return {
      available: true,
      label: t.equipment.available,
      color: 'text-success',
      bgColor: 'bg-success/10',
    };
  }, [equipment, t]);
}

// ============================================
// CATEGORY ICON
// ============================================

/**
 * Map a category name to its emoji icon.
 */
export function useEquipmentCategoryIcon(category: string) {
  return useMemo(() => {
    const icons: Record<string, string> = {
      mobilite: '🦽',
      respiratoire: '💨',
      lit_medicalise: '🛏️',
      monitoring: '📊',
      reeducation: '🏋️',
      aide_quotidienne: '🚿',
    };

    return icons[category] || '📦';
  }, [category]);
}
