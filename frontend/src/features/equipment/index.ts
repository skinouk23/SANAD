/**
 * Equipment Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export * from './schema';
export { equipmentKeys } from './keys';
export { equipmentService } from './service';

export type { EquipmentFilters } from './service';
export {
  equipmentListOptions,
  equipmentPaginatedOptions,
  equipmentDetailOptions,
  equipmentCategoriesOptions,
  featuredEquipmentOptions,
  equipmentSearchOptions,
} from './options';
export { EquipmentForm } from './public/EquipmentForm';
export type { EquipmentFormProps } from './public/EquipmentForm';

// Admin service functions + types
export {
  createEquipmentService,
  updateEquipmentService,
  deleteEquipmentService,
  uploadAndAttachEquipmentMainImage,
} from './admin-service';
export type {
  CreateEquipmentData,
  UpdateEquipmentData,
  EquipmentTypeConfig,
  UploadAndAttachEquipmentMainImageRequest,
} from './admin-service';
