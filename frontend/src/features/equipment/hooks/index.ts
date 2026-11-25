/**
 * Equipment Hooks — barrel export
 *
 * All equipment hooks re-exported from domain sub-modules.
 */

// Fetch hooks
export {
  useEquipment,
  useEquipmentItem,
  useEquipmentCategories,
  useFeaturedEquipment,
  useEquipmentSearch,
  usePaginatedEquipment,
} from './useEquipment';

// Pure computation helpers (2)
export { useEquipmentAvailability, useEquipmentCategoryIcon } from './useEquipmentHelpers';

// Admin mutation hooks
export {
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
  useUploadAndAttachEquipmentMainImage,
} from './useEquipmentMutations';
