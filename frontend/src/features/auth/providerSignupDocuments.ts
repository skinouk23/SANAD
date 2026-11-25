import {
  createProviderSignupApplication,
  getProviderSignupFileMetadata,
  uploadProviderSignupFile,
  waitForFileReady,
} from '@/features/files';

import type { ProviderRegistrationDocumentReference } from '@/features/auth/schema';

export interface ProviderSignupDocumentUploadInput {
  documentName?: string;
  documentType: string;
  file: File;
}

export interface ProviderSignupDocumentUploadBatchResult {
  applicationId: string;
  providerDocuments: ProviderRegistrationDocumentReference[];
}

function normalizeDocumentName(document: ProviderSignupDocumentUploadInput): string {
  const name = document.documentName?.trim();
  return name || document.file.name;
}

export async function uploadProviderSignupDocuments(
  documents: ProviderSignupDocumentUploadInput[],
): Promise<ProviderSignupDocumentUploadBatchResult> {
  if (documents.length === 0) {
    throw new Error('Ajoutez les documents requis avant de soumettre votre inscription.');
  }

  const providerDocuments: ProviderRegistrationDocumentReference[] = [];
  const draftApplication = await createProviderSignupApplication();

  for (const document of documents) {
    const completedUpload = await uploadProviderSignupFile({
      applicationId: draftApplication.applicationId,
      file: document.file,
      uploadToken: draftApplication.uploadToken,
      uploadTokenHeaderName: draftApplication.headerName,
    });

    await waitForFileReady(completedUpload.fileId, {
      fetchMetadata: (fileId, signal) =>
        getProviderSignupFileMetadata({
          applicationId: draftApplication.applicationId,
          fileId,
          uploadToken: draftApplication.uploadToken,
          uploadTokenHeaderName: draftApplication.headerName,
          signal,
        }),
    });

    providerDocuments.push({
      applicationId: completedUpload.applicationId,
      fileId: completedUpload.fileId,
      documentType: document.documentType,
      documentName: normalizeDocumentName(document),
      fileSizeBytes: document.file.size,
      mimeType: document.file.type || null,
    });
  }

  return {
    applicationId: draftApplication.applicationId,
    providerDocuments,
  };
}
