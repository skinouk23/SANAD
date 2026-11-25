import { z } from 'zod';
import { dateTimeSchema, uuidSchema } from '@/shared/schemas/common';

export const FileIdSchema = z.string().trim().min(1);

export const UploadUseCaseSchema = z.enum([
  'Avatar',
  'ProviderAvatar',
  'Prescription',
  'ProviderCredential',
  'ProviderSignupDocument',
  'ServicePhoto',
  'BookingAttachment',
]);

const uploadUseCaseResponseMap: Record<string, z.infer<typeof UploadUseCaseSchema>> = {
  avatar: 'Avatar',
  provideravatar: 'ProviderAvatar',
  prescription: 'Prescription',
  providercredential: 'ProviderCredential',
  providersignupdocument: 'ProviderSignupDocument',
  servicephoto: 'ServicePhoto',
  bookingattachment: 'BookingAttachment',
};

const UploadUseCaseResponseSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value
    .trim()
    .replace(/[-_\s]/g, '')
    .toLowerCase();
  return uploadUseCaseResponseMap[normalized] ?? value;
}, UploadUseCaseSchema);

export const FileStatusSchema = z.enum([
  'uploading',
  'staged',
  'pending_scan',
  'scanning',
  'scan_failed',
  'ready',
  'rejected',
  'quarantined',
  'deleting',
  'deleted',
]);

export const FileScanStatusSchema = z.enum([
  'not_required',
  'pending',
  'scanning',
  'clean',
  'infected',
  'unsupported',
  'failed',
  'timed_out',
]);

export const FileUploadResponseSchema = z.object({
  fileId: FileIdSchema,
  status: FileStatusSchema,
  scanStatus: FileScanStatusSchema,
  fileName: z.string().trim().min(1),
  contentType: z.string().trim().min(1),
  sizeBytes: z.number().int().nonnegative(),
  createdAt: dateTimeSchema,
});

export const FileMetadataSchema = FileUploadResponseSchema.extend({
  useCase: UploadUseCaseResponseSchema.optional(),
  category: z.string().trim().min(1).nullable().optional(),
  visibility: z.string().trim().min(1).nullable().optional(),
  readyAt: dateTimeSchema.nullable().optional(),
  deletedAt: dateTimeSchema.nullable().optional(),
  rejectionReason: z.string().trim().min(1).nullable().optional(),
  relatedPatientId: uuidSchema.nullable().optional(),
  relatedProviderId: uuidSchema.nullable().optional(),
  relatedServiceId: uuidSchema.nullable().optional(),
  relatedBookingId: uuidSchema.nullable().optional(),
  relatedApplicationId: uuidSchema.nullable().optional(),
});

export const ProviderSignupDraftApplicationResponseSchema = z
  .object({
    applicationId: uuidSchema,
    uploadToken: z.string().trim().min(1),
    uploadTokenExpiresAt: dateTimeSchema.optional(),
    expiresAt: dateTimeSchema.optional(),
    headerName: z.string().trim().min(1),
  })
  .transform((value, ctx) => {
    const uploadTokenExpiresAt = value.uploadTokenExpiresAt ?? value.expiresAt;

    if (!uploadTokenExpiresAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['uploadTokenExpiresAt'],
        message: 'Upload token expiration is required.',
      });

      return z.NEVER;
    }

    return {
      applicationId: value.applicationId,
      uploadToken: value.uploadToken,
      uploadTokenExpiresAt,
      headerName: value.headerName,
    };
  });
