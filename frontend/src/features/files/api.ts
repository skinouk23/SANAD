import { api } from '@/api/client';
import {
  FileMetadataSchema,
  FileUploadResponseSchema,
  ProviderSignupDraftApplicationResponseSchema,
} from '@/features/files/schema';
import {
  createFileUploadFormData,
  createProviderSignupFileUploadFormData,
  fetchAuthenticatedFileContent,
  fetchTokenScopedApiResponse,
  postJsonApiResponse,
  postMultipartApiResponse,
} from '@/features/files/lib/file-transport';
import { validateUploadFile } from '@/features/files/lib/file-validation';

import type {
  FileContentResponse,
  FileMetadata,
  FileMetadataRequest,
  FileUploadResponse,
  CreateProviderSignupApplicationRequest,
  ProviderSignupFileMetadataRequest,
  ProviderSignupFileUploadRequest,
  ProviderSignupFileUploadResponse,
  ProviderSignupDraftApplicationResponse,
  UploadFileRequest,
} from '@/features/files/types';
import type { SilentErrorConfig } from '@/api/client';

function encodeId(id: string): string {
  return encodeURIComponent(id);
}

export async function uploadFile({
  file,
  useCase,
  relatedPatientId,
  relatedProviderId,
  relatedServiceId,
  relatedBookingId,
  relatedApplicationId,
  signal,
  onUploadProgress,
}: UploadFileRequest): Promise<FileUploadResponse> {
  validateUploadFile(file, useCase);

  return postMultipartApiResponse({
    path: '/files',
    formData: createFileUploadFormData({
      file,
      useCase,
      relatedPatientId,
      relatedProviderId,
      relatedServiceId,
      relatedBookingId,
      relatedApplicationId,
    }),
    responseSchema: FileUploadResponseSchema,
    includeAuth: true,
    signal,
    onUploadProgress,
  });
}

export async function uploadProviderSignupFile({
  applicationId,
  uploadToken,
  uploadTokenHeaderName,
  file,
  signal,
  onUploadProgress,
}: ProviderSignupFileUploadRequest): Promise<ProviderSignupFileUploadResponse> {
  validateUploadFile(file, 'ProviderSignupDocument');

  const uploadedFile = await postMultipartApiResponse({
    path: `/provider-signup-applications/${encodeId(applicationId)}/files`,
    formData: createProviderSignupFileUploadFormData(file),
    responseSchema: FileUploadResponseSchema,
    includeAuth: false,
    uploadToken,
    uploadTokenHeaderName,
    signal,
    onUploadProgress,
  });

  return {
    ...uploadedFile,
    applicationId,
  };
}

export async function createProviderSignupApplication({
  signal,
}: CreateProviderSignupApplicationRequest = {}): Promise<ProviderSignupDraftApplicationResponse> {
  return postJsonApiResponse({
    path: '/provider-signup-applications',
    body: {},
    responseSchema: ProviderSignupDraftApplicationResponseSchema,
    signal,
  });
}

export async function getFileMetadata(
  fileIdOrRequest: string | FileMetadataRequest,
  signal?: AbortSignal,
): Promise<FileMetadata> {
  const fileId = typeof fileIdOrRequest === 'string' ? fileIdOrRequest : fileIdOrRequest.fileId;
  const requestSignal = typeof fileIdOrRequest === 'string' ? signal : fileIdOrRequest.signal;
  const raw = await api.get<FileMetadata>(`/files/${encodeId(fileId)}`, {
    _silentError: true,
    signal: requestSignal,
  } as SilentErrorConfig);

  return FileMetadataSchema.parse(raw);
}

export async function getProviderSignupFileMetadata({
  applicationId,
  fileId,
  uploadToken,
  uploadTokenHeaderName,
  signal,
}: ProviderSignupFileMetadataRequest): Promise<FileMetadata> {
  return fetchTokenScopedApiResponse({
    path: `/provider-signup-applications/${encodeId(applicationId)}/files/${encodeId(fileId)}`,
    responseSchema: FileMetadataSchema,
    uploadToken,
    uploadTokenHeaderName,
    signal,
  });
}

export async function getFileContent(
  fileId: string,
  signal?: AbortSignal,
): Promise<FileContentResponse> {
  return fetchAuthenticatedFileContent(fileId, signal);
}

export async function deleteFile(fileId: string): Promise<void> {
  await api.delete<void>(`/files/${encodeId(fileId)}`, {
    _silentError: true,
  } as SilentErrorConfig);
}

export const filesApi = {
  uploadFile,
  uploadProviderSignupFile,
  createProviderSignupApplication,
  getFileMetadata,
  getProviderSignupFileMetadata,
  getFileContent,
  deleteFile,
};
