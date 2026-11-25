import { http, HttpResponse } from 'msw';
import { apiBadRequest, apiNotFound, apiOk, apiUnauthorized } from '@/mocks/utils';

import type { FileMetadata, FileStatus, UploadUseCase } from '@/features/files';

type MockStoredFile = FileMetadata & {
  content: Blob;
  pollCount: number;
};

const files = new Map<string, MockStoredFile>();
const providerSignupUploadTokens = new Map<
  string,
  {
    applicationId: string;
    expiresAt: string;
  }
>();

const PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER = 'X-Provider-Signup-Upload-Token';

function createUuid(): string {
  return crypto.randomUUID?.() ?? '11111111-1111-4111-8111-111111111111';
}

function readStringField(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readUseCase(formData: FormData): UploadUseCase {
  return (readStringField(formData, 'useCase') ?? 'BookingAttachment') as UploadUseCase;
}

function createProviderSignupDraftApplication(): {
  applicationId: string;
  uploadToken: string;
  uploadTokenExpiresAt: string;
  headerName: string;
} {
  const applicationId = createUuid();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const uploadToken = `mock-provider-signup-token.${applicationId}.${createUuid()}`;

  providerSignupUploadTokens.set(uploadToken, {
    applicationId,
    expiresAt,
  });

  return {
    applicationId,
    uploadToken,
    uploadTokenExpiresAt: expiresAt,
    headerName: PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER,
  };
}

function getProviderSignupUploadToken(request: Request): string | null {
  return request.headers.get(PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER);
}

function validateProviderSignupUploadToken(request: Request, applicationId: string) {
  const token = getProviderSignupUploadToken(request);

  if (!token) {
    return apiUnauthorized('Provider signup upload token is required.');
  }

  const tokenRecord = providerSignupUploadTokens.get(token);

  if (!tokenRecord || tokenRecord.applicationId !== applicationId) {
    return apiUnauthorized('Provider signup upload token is invalid.');
  }

  if (Date.parse(tokenRecord.expiresAt) <= Date.now()) {
    providerSignupUploadTokens.delete(token);
    return apiUnauthorized('Provider signup upload token has expired.');
  }

  return null;
}

function getFileStatusForPoll(file: MockStoredFile): FileStatus {
  if (file.status !== 'pending_scan' && file.status !== 'scanning') {
    return file.status;
  }

  if (file.pollCount === 0) {
    return 'pending_scan';
  }

  if (file.pollCount === 1) {
    return 'scanning';
  }

  return 'ready';
}

function createMockStoredFile({
  file,
  useCase,
  relatedApplicationId,
  relatedBookingId,
  relatedPatientId,
  relatedProviderId,
  relatedServiceId,
}: {
  file: File;
  useCase: UploadUseCase;
  relatedApplicationId?: string | null;
  relatedBookingId?: string | null;
  relatedPatientId?: string | null;
  relatedProviderId?: string | null;
  relatedServiceId?: string | null;
}): MockStoredFile {
  const now = new Date().toISOString();
  const contentType = file.type || 'application/octet-stream';

  return {
    fileId: createUuid(),
    useCase,
    category: contentType.startsWith('image/') ? 'image' : 'document',
    visibility: useCase === 'ServicePhoto' || useCase === 'ProviderAvatar' ? 'public' : 'private',
    status: 'pending_scan',
    scanStatus: 'pending',
    fileName: file.name || 'upload.bin',
    contentType,
    sizeBytes: file.size,
    createdAt: now,
    readyAt: null,
    deletedAt: null,
    rejectionReason: null,
    relatedApplicationId,
    relatedBookingId,
    relatedPatientId,
    relatedProviderId,
    relatedServiceId,
    content: file,
    pollCount: 0,
  };
}

function createMockFileContentResponse(file: MockStoredFile, cacheControl: string) {
  file.status = 'ready';
  file.scanStatus = 'clean';
  file.readyAt = file.readyAt ?? new Date().toISOString();

  return new HttpResponse(file.content, {
    status: 200,
    headers: {
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="${file.fileName.replace(/"/g, '')}"`,
      'Cache-Control': cacheControl,
    },
  });
}

function toFileResponse(file: MockStoredFile) {
  return {
    fileId: file.fileId,
    status: file.status,
    scanStatus: file.scanStatus,
    fileName: file.fileName,
    contentType: file.contentType,
    sizeBytes: file.sizeBytes,
    createdAt: file.createdAt,
  };
}

function createMockFileMetadataResponse(file: MockStoredFile) {
  const nextStatus = getFileStatusForPoll(file);
  file.status = nextStatus;
  file.scanStatus =
    nextStatus === 'ready' ? 'clean' : nextStatus === 'scanning' ? 'scanning' : 'pending';
  file.readyAt = nextStatus === 'ready' ? (file.readyAt ?? new Date().toISOString()) : null;
  file.pollCount += 1;

  return apiOk(file);
}

export const fileHandlers = [
  http.post('*/api/v1/provider-signup-applications', () => {
    return apiOk(createProviderSignupDraftApplication());
  }),

  http.post('*/api/v1/files', async ({ request }) => {
    const formData = await request.formData();
    const uploadedFile = formData.get('file');

    if (!(uploadedFile instanceof File)) {
      return apiBadRequest('file is required.', 'file');
    }

    const storedFile = createMockStoredFile({
      file: uploadedFile,
      useCase: readUseCase(formData),
      relatedApplicationId: readStringField(formData, 'relatedApplicationId'),
      relatedBookingId: readStringField(formData, 'relatedBookingId'),
      relatedPatientId: readStringField(formData, 'relatedPatientId'),
      relatedProviderId: readStringField(formData, 'relatedProviderId'),
      relatedServiceId: readStringField(formData, 'relatedServiceId'),
    });

    files.set(storedFile.fileId, storedFile);

    return apiOk(toFileResponse(storedFile));
  }),

  http.post(
    '*/api/v1/provider-signup-applications/:applicationId/files',
    async ({ params, request }) => {
      const formData = await request.formData();
      const uploadedFile = formData.get('file');

      if (!(uploadedFile instanceof File)) {
        return apiBadRequest('file is required.', 'file');
      }

      const applicationId = params.applicationId as string;
      const tokenError = validateProviderSignupUploadToken(request, applicationId);

      if (tokenError) {
        return tokenError;
      }

      const storedFile = createMockStoredFile({
        file: uploadedFile,
        useCase: 'ProviderSignupDocument',
        relatedApplicationId: applicationId,
      });

      files.set(storedFile.fileId, storedFile);

      return apiOk(toFileResponse(storedFile));
    },
  ),

  http.get(
    '*/api/v1/provider-signup-applications/:applicationId/files/:fileId',
    ({ params, request }) => {
      const applicationId = params.applicationId as string;
      const tokenError = validateProviderSignupUploadToken(request, applicationId);

      if (tokenError) {
        return tokenError;
      }

      const file = files.get(params.fileId as string);

      if (!file || file.relatedApplicationId !== applicationId) {
        return apiNotFound('File not found');
      }

      return createMockFileMetadataResponse(file);
    },
  ),

  http.get('*/api/v1/files/:fileId', ({ params }) => {
    const file = files.get(params.fileId as string);

    if (!file) {
      return apiNotFound('File not found');
    }

    return createMockFileMetadataResponse(file);
  }),

  http.get('*/api/v1/files/:fileId/content', ({ params }) => {
    const file = files.get(params.fileId as string);

    if (!file) {
      return apiNotFound('File not found');
    }

    return createMockFileContentResponse(file, 'private, max-age=60');
  }),

  http.get('*/api/v1/files/:fileId/public-content', ({ params }) => {
    const file = files.get(params.fileId as string);

    if (!file) {
      return apiNotFound('File not found');
    }

    if (file.visibility !== 'public') {
      return apiNotFound('File not found');
    }

    return createMockFileContentResponse(file, 'public, max-age=3600');
  }),

  http.delete('*/api/v1/files/:fileId', ({ params }) => {
    const file = files.get(params.fileId as string);

    if (!file) {
      return apiNotFound('File not found');
    }

    file.status = 'deleted';
    file.deletedAt = new Date().toISOString();

    return apiOk(null);
  }),
];
