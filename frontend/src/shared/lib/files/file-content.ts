import { buildApiUrl, createApiHeaders, createApiRequestId } from '@/shared/lib/http/transport';
import { getTokenCache } from '@/shared/lib/http/token-cache';

export interface FileContentResponse {
  blob: Blob;
  contentType: string | null;
  fileName: string | null;
}

function getBearerTokenOrThrow(): string {
  const token = getTokenCache();

  if (!token) {
    throw new Error('Session expiree. Veuillez vous reconnecter avant de charger ce fichier.');
  }

  return token;
}

function parseContentDispositionFileName(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const encodedMatch = /filename\*=UTF-8''([^;]+)/i.exec(value);

  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  const plainMatch = /filename="?([^";]+)"?/i.exec(value);
  return plainMatch?.[1] ?? null;
}

async function createFetchError(response: Response): Promise<Error> {
  const text = await response.text().catch(() => '');
  const trimmedText = text.trim();

  return new Error(
    trimmedText || `Le chargement du fichier a echoue avec le statut ${response.status}.`,
  );
}

export async function fetchAuthenticatedFileContentByPath(
  path: string,
  signal?: AbortSignal,
): Promise<FileContentResponse> {
  const token = getBearerTokenOrThrow();
  const requestId = createApiRequestId();
  const response = await fetch(buildApiUrl(path), {
    method: 'GET',
    headers: createApiHeaders(
      {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      {
        includeJsonHeaders: false,
        requestId,
      },
    ),
    credentials: 'omit',
    signal,
  });

  if (!response.ok) {
    throw await createFetchError(response);
  }

  const blob = await response.blob();
  return {
    blob,
    contentType: response.headers.get('Content-Type') ?? blob.type ?? null,
    fileName: parseContentDispositionFileName(response.headers.get('Content-Disposition')),
  };
}

export async function fetchAuthenticatedFileContent(
  fileId: string,
  signal?: AbortSignal,
): Promise<FileContentResponse> {
  return fetchAuthenticatedFileContentByPath(
    `/files/${encodeURIComponent(fileId)}/content`,
    signal,
  );
}
