import { env } from '@/config/env';
import { getTokenCache } from '@/shared/lib/http/token-cache';

export const AUDIT_DELIVERY_PATH = '/audit/events';
export const AUDIT_DELIVERY_HEADER_NAME = 'X-Audit-Delivery';
export const AUDIT_DELIVERY_HEADER_VALUE = 'true';

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function extractPathname(path: string): string {
  try {
    return new URL(path, 'http://localhost').pathname;
  } catch {
    return path.split(/[?#]/, 1)[0] ?? path;
  }
}

export function getApiBaseUrl(): string {
  return normalizeBaseUrl(env.API_BASE_URL);
}

export function isAuditDeliveryRequest(path: string | null | undefined): boolean {
  if (!path) {
    return false;
  }

  const pathname = normalizePath(extractPathname(path)).replace(/\/+$/, '');
  return pathname.endsWith(AUDIT_DELIVERY_PATH);
}

export function createApiRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function buildApiUrl(path: string): string {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const baseUrl = getApiBaseUrl();
  const normalizedPath = normalizePath(path);

  if (!baseUrl) {
    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath}`;
}

export function createApiHeaders(
  headers: HeadersInit | undefined,
  options?: {
    includeAuth?: boolean;
    includeJsonHeaders?: boolean;
    requestId?: string;
  },
): Headers {
  const result = new Headers(headers);

  if (options?.includeJsonHeaders !== false) {
    if (!result.has('Accept')) {
      result.set('Accept', 'application/json');
    }

    if (!result.has('Content-Type')) {
      result.set('Content-Type', 'application/json');
    }
  }

  result.set('X-App-Version', env.APP_VERSION);
  result.set('X-Country-Code', env.COUNTRY_CODE);

  if (options?.requestId) {
    result.set('X-Request-ID', options.requestId);
  }

  if (options?.includeAuth) {
    const token = getTokenCache();

    if (token && !result.has('Authorization')) {
      result.set('Authorization', `Bearer ${token}`);
    }
  }

  return result;
}

export async function postApiJson<TResponse>(
  path: string,
  body: unknown,
  options?: {
    headers?: HeadersInit;
    includeAuth?: boolean;
    keepalive?: boolean;
    signal?: AbortSignal;
    requestId?: string;
  },
): Promise<{ data: TResponse | null; requestId: string; response: Response }> {
  const requestId = options?.requestId ?? createApiRequestId();
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: createApiHeaders(options?.headers, {
      includeAuth: options?.includeAuth,
      includeJsonHeaders: true,
      requestId,
    }),
    body: JSON.stringify(body),
    credentials: 'include',
    keepalive: options?.keepalive,
    signal: options?.signal,
  });

  if (response.status === 204) {
    return { data: null, requestId, response };
  }

  const contentType = response.headers.get('Content-Type') ?? '';

  if (!contentType.includes('application/json')) {
    return { data: null, requestId, response };
  }

  const data = (await response.json()) as TResponse;
  return { data, requestId, response };
}
