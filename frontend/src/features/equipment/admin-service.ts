/**
 * Equipment Admin Service
 *
 * Thin wrappers around the Services API endpoints that build
 * equipment-specific typeConfig for equipment providers.
 */

import {
  addService,
  updateService,
  removeService,
  attachServicePhoto,
} from '@/features/providers/service';
import { uploadFile, waitForFileReady } from '@/features/files';
import type { ServiceDetailResponse, ServicePhotoResponse } from '@/features/services/schema';

// ============================================
// TYPES
// ============================================

export interface EquipmentTypeConfig {
  equipment_type_code: string;
  brand?: string;
  model?: string;
  deposit_amount: number;
  pricing: {
    weekly: number;
    monthly: number;
  };
  specifications?: Record<string, string>;
  features?: string[];
}

export interface CreateEquipmentData {
  name: string;
  description?: string;
  shortDescription?: string;
  pricePerDay: number;
  availableQuantity?: number;
  typeConfig: EquipmentTypeConfig;
}

export interface UpdateEquipmentData {
  name?: string;
  description?: string;
  shortDescription?: string;
  pricePerDay?: number;
  availableQuantity?: number;
  typeConfig?: Partial<EquipmentTypeConfig>;
}

export interface UploadAndAttachEquipmentMainImageRequest {
  serviceId: string;
  file: File;
  signal?: AbortSignal;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create a new equipment service.
 *
 * The backend derives the service category from the authenticated provider,
 * so the frontend only sends the create-service DTO fields plus typeConfig.
 */
export async function createEquipmentService(
  data: CreateEquipmentData,
): Promise<ServiceDetailResponse> {
  return addService({
    name: data.name,
    description: data.description,
    shortDescription: data.shortDescription,
    price: data.pricePerDay,
    typeConfig: data.typeConfig,
  });
}

/** Update an existing equipment service. */
export async function updateEquipmentService(
  id: string,
  data: UpdateEquipmentData,
): Promise<ServiceDetailResponse> {
  return updateService(id, {
    name: data.name,
    description: data.description,
    shortDescription: data.shortDescription,
    price: data.pricePerDay,
    typeConfig: data.typeConfig,
  });
}

/** Delete an equipment service. */
export async function deleteEquipmentService(id: string): Promise<void> {
  return removeService(id);
}

/** Upload a main image asset and attach it to an equipment-backed service. */
export async function uploadAndAttachEquipmentMainImage({
  serviceId,
  file,
  signal,
}: UploadAndAttachEquipmentMainImageRequest): Promise<ServicePhotoResponse> {
  const uploaded = await uploadFile({
    file,
    useCase: 'ServicePhoto',
    relatedServiceId: serviceId,
    signal,
  });

  if (!uploaded.fileId) {
    throw new Error('Equipment image upload did not return a file id.');
  }

  await waitForFileReady(uploaded.fileId, { signal });

  return attachServicePhoto(
    serviceId,
    {
      fileId: uploaded.fileId,
      isMain: true,
      sortOrder: 0,
    },
    {
      signal,
    },
  );
}
