import type { z } from 'zod';
import type {
  FileMetadataSchema,
  FileScanStatusSchema,
  FileStatusSchema,
  FileUploadResponseSchema,
  ProviderSignupDraftApplicationResponseSchema,
  UploadUseCaseSchema,
} from '@/features/files/schema';
import type { FileContentResponse } from '@/shared/lib/files/file-content';

export type UploadUseCase = z.infer<typeof UploadUseCaseSchema>;
export type FileStatus = z.infer<typeof FileStatusSchema>;
export type FileScanStatus = z.infer<typeof FileScanStatusSchema>;
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
export type FileMetadata = z.infer<typeof FileMetadataSchema>;
export type ProviderSignupDraftApplicationResponse = z.infer<
  typeof ProviderSignupDraftApplicationResponseSchema
>;

export interface FileUploadProgress {
  loadedBytes: number;
  totalBytes: number | null;
  percent: number | null;
}

export interface UploadFileRequest {
  file: File;
  useCase: UploadUseCase;
  relatedPatientId?: string | null;
  relatedProviderId?: string | null;
  relatedServiceId?: string | null;
  relatedBookingId?: string | null;
  relatedApplicationId?: string | null;
  signal?: AbortSignal;
  onUploadProgress?: (progress: FileUploadProgress) => void;
}

export interface ProviderSignupFileUploadRequest {
  applicationId: string;
  uploadToken?: string | null;
  uploadTokenHeaderName?: string | null;
  file: File;
  signal?: AbortSignal;
  onUploadProgress?: (progress: FileUploadProgress) => void;
}

export interface FileMetadataRequest {
  fileId: string;
  signal?: AbortSignal;
}

export interface ProviderSignupFileMetadataRequest {
  applicationId: string;
  fileId: string;
  uploadToken?: string | null;
  uploadTokenHeaderName?: string | null;
  signal?: AbortSignal;
}

export interface CreateProviderSignupApplicationRequest {
  signal?: AbortSignal;
}

export interface ProviderSignupFileUploadResponse extends FileUploadResponse {
  applicationId: string;
}

export type { FileContentResponse };

export interface FileBlobUrlOptions {
  enabled?: boolean;
}
