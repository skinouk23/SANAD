import { z } from 'zod';
import { getTokenCache } from '@/api/client';
import { buildApiUrl, createApiHeaders, createApiRequestId } from '@/shared/lib/http/transport';
import { fetchAuthenticatedFileContent } from '@/shared/lib/files/file-content';

import type { FileUploadProgress } from '@/features/files/types';

const FILE_UPLOAD_TIMEOUT_MS = 120_000;
const PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER = 'X-Provider-Signup-Upload-Token';

const ApiErrorEnvelopeSchema = z.object({
  message: z.string().nullable().optional(),
  errors: z.record(z.string(), z.array(z.string()).nullable()).nullable().optional(),
  code: z.string().nullable().optional(),
});

interface MultipartRequestOptions<TResponse> {
  path: string;
  formData: FormData;
  responseSchema: z.ZodType<TResponse>;
  includeAuth: boolean;
  uploadToken?: string | null;
  uploadTokenHeaderName?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
  onUploadProgress?: (progress: FileUploadProgress) => void;
}

interface JsonRequestOptions<TResponse> {
  path: string;
  body: unknown;
  responseSchema: z.ZodType<TResponse>;
  signal?: AbortSignal;
}

interface TokenScopedRequestOptions<TResponse> {
  path: string;
  responseSchema: z.ZodType<TResponse>;
  uploadToken?: string | null;
  uploadTokenHeaderName?: string | null;
  signal?: AbortSignal;
}

export function getBearerTokenOrThrow(): string {
  const token = getTokenCache();

  if (!token) {
    throw new Error('Session expiree. Veuillez vous reconnecter avant de televerser ce fichier.');
  }

  return token;
}

function appendOptionalFormField(
  formData: FormData,
  name: string,
  value: string | null | undefined,
) {
  if (value === null || value === undefined || value.trim().length === 0) {
    return;
  }

  formData.append(name, value);
}

function parseApiResponseData<TResponse>(
  responseText: string,
  responseSchema: z.ZodType<TResponse>,
): TResponse {
  const parsed = JSON.parse(responseText) as { data?: unknown };
  const data = Object.prototype.hasOwnProperty.call(parsed, 'data') ? parsed.data : parsed;

  return responseSchema.parse(data);
}

function getFirstValidationMessage(errors: Record<string, string[] | null> | null | undefined) {
  if (!errors) {
    return null;
  }

  for (const value of Object.values(errors)) {
    const message = value?.find((item) => item.trim().length > 0);

    if (message) {
      return message;
    }
  }

  return null;
}

function createHttpError(status: number, responseText: string): Error {
  const parsed = ApiErrorEnvelopeSchema.safeParse(safeJsonParse(responseText));

  if (parsed.success) {
    const validationMessage = getFirstValidationMessage(parsed.data.errors);
    const message = validationMessage ?? parsed.data.message;

    if (message) {
      return new Error(message);
    }
  }

  return new Error(`La requete fichier a echoue avec le statut ${status}.`);
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function createFileUploadFormData({
  file,
  useCase,
  relatedPatientId,
  relatedProviderId,
  relatedServiceId,
  relatedBookingId,
  relatedApplicationId,
}: {
  file: File;
  useCase: string;
  relatedPatientId?: string | null;
  relatedProviderId?: string | null;
  relatedServiceId?: string | null;
  relatedBookingId?: string | null;
  relatedApplicationId?: string | null;
}): FormData {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('useCase', useCase);
  appendOptionalFormField(formData, 'relatedPatientId', relatedPatientId);
  appendOptionalFormField(formData, 'relatedProviderId', relatedProviderId);
  appendOptionalFormField(formData, 'relatedServiceId', relatedServiceId);
  appendOptionalFormField(formData, 'relatedBookingId', relatedBookingId);
  appendOptionalFormField(formData, 'relatedApplicationId', relatedApplicationId);

  return formData;
}

export function createProviderSignupFileUploadFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('file', file);

  return formData;
}

export function postMultipartApiResponse<TResponse>({
  path,
  formData,
  responseSchema,
  includeAuth,
  uploadToken,
  uploadTokenHeaderName,
  signal,
  timeoutMs = FILE_UPLOAD_TIMEOUT_MS,
  onUploadProgress,
}: MultipartRequestOptions<TResponse>): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const requestId = createApiRequestId();
    const xhr = new XMLHttpRequest();
    const headers = createApiHeaders(
      {
        Accept: 'application/json',
      },
      {
        includeJsonHeaders: false,
        requestId,
      },
    );

    if (includeAuth) {
      headers.set('Authorization', `Bearer ${getBearerTokenOrThrow()}`);
    }

    if (uploadToken) {
      headers.set(uploadTokenHeaderName || PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER, uploadToken);
    }

    xhr.open('POST', buildApiUrl(path), true);
    xhr.timeout = timeoutMs;
    xhr.withCredentials = false;

    headers.forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.upload.onprogress = (event) => {
      if (!onUploadProgress) {
        return;
      }

      const totalBytes = event.lengthComputable ? event.total : null;
      onUploadProgress({
        loadedBytes: event.loaded,
        totalBytes,
        percent: totalBytes ? Math.round((event.loaded / totalBytes) * 100) : null,
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(parseApiResponseData(xhr.responseText, responseSchema));
        } catch (error) {
          reject(error);
        }
        return;
      }

      reject(createHttpError(xhr.status, xhr.responseText));
    };

    xhr.onerror = () => {
      reject(new Error('Erreur de connexion pendant le televersement du fichier.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Le televersement du fichier a expire. Veuillez reessayer.'));
    };

    xhr.onabort = () => {
      reject(new Error('Televersement annule.'));
    };

    const abortUpload = () => {
      xhr.abort();
    };

    if (signal?.aborted) {
      reject(new Error('Televersement annule.'));
      return;
    }

    signal?.addEventListener('abort', abortUpload, { once: true });
    xhr.onloadend = () => {
      signal?.removeEventListener('abort', abortUpload);
    };

    try {
      xhr.send(formData);
    } catch (error) {
      signal?.removeEventListener('abort', abortUpload);
      reject(error);
    }
  });
}

export async function postJsonApiResponse<TResponse>({
  path,
  body,
  responseSchema,
  signal,
}: JsonRequestOptions<TResponse>): Promise<TResponse> {
  const requestId = createApiRequestId();
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: createApiHeaders(undefined, {
      includeAuth: false,
      includeJsonHeaders: true,
      requestId,
    }),
    body: JSON.stringify(body),
    credentials: 'omit',
    signal,
  });

  if (!response.ok) {
    throw await createFetchError(response);
  }

  return parseApiResponseData(await response.text(), responseSchema);
}

export async function fetchTokenScopedApiResponse<TResponse>({
  path,
  responseSchema,
  uploadToken,
  uploadTokenHeaderName,
  signal,
}: TokenScopedRequestOptions<TResponse>): Promise<TResponse> {
  const requestId = createApiRequestId();
  const headers = createApiHeaders(undefined, {
    includeAuth: false,
    includeJsonHeaders: true,
    requestId,
  });

  if (uploadToken) {
    headers.set(uploadTokenHeaderName || PROVIDER_SIGNUP_UPLOAD_TOKEN_HEADER, uploadToken);
  }

  const response = await fetch(buildApiUrl(path), {
    method: 'GET',
    headers,
    credentials: 'omit',
    signal,
  });

  if (!response.ok) {
    throw await createFetchError(response);
  }

  return parseApiResponseData(await response.text(), responseSchema);
}

export { fetchAuthenticatedFileContent };

async function createFetchError(response: Response): Promise<Error> {
  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    return createHttpError(response.status, await response.text());
  }

  const text = await response.text().catch(() => '');
  const trimmedText = text.trim();

  return new Error(
    trimmedText || `Le chargement du fichier a echoue avec le statut ${response.status}.`,
  );
}
