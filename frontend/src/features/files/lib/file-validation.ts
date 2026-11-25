import type { UploadUseCase } from '@/features/files/types';

interface UploadFilePolicy {
  maxBytes: number;
  contentTypes: readonly string[];
  extensions: readonly string[];
}

const MB = 1024 * 1024;

const UPLOAD_FILE_POLICIES: Record<UploadUseCase, UploadFilePolicy> = {
  Avatar: {
    maxBytes: 5 * MB,
    contentTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  ProviderAvatar: {
    maxBytes: 5 * MB,
    contentTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  Prescription: {
    maxBytes: 20 * MB,
    contentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  ProviderCredential: {
    maxBytes: 25 * MB,
    contentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  ProviderSignupDocument: {
    maxBytes: 25 * MB,
    contentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  ServicePhoto: {
    maxBytes: 10 * MB,
    contentTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  BookingAttachment: {
    maxBytes: 25 * MB,
    contentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
};

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
}

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / MB)} MB`;
}

export function getUploadAcceptAttribute(useCase: UploadUseCase): string {
  const policy = UPLOAD_FILE_POLICIES[useCase];
  return [...policy.contentTypes, ...policy.extensions].join(',');
}

export function validateUploadFile(file: File, useCase: UploadUseCase): void {
  const policy = UPLOAD_FILE_POLICIES[useCase];

  if (file.size > policy.maxBytes) {
    throw new Error(`Le fichier depasse la limite de ${formatMegabytes(policy.maxBytes)}.`);
  }

  const extension = getFileExtension(file.name);
  const hasAllowedContentType = file.type ? policy.contentTypes.includes(file.type) : false;
  const hasAllowedExtension = extension ? policy.extensions.includes(extension) : false;

  if (!hasAllowedContentType && !hasAllowedExtension) {
    throw new Error('Type de fichier non autorise pour ce televersement.');
  }
}
