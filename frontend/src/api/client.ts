/**
 * API Client
 * Centralized HTTP client with interceptors, retry logic, and error handling
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import type { ApiError, ApiResponse } from '@/shared/schemas/api.schema';
import {
  buildDeviceRefreshTokenRequest,
  clearPersistedAuthSession,
  getStoredRefreshToken,
  persistRefreshedAuthSession,
} from '@/shared/lib/http/auth-session';
import {
  createApiRequestId,
  getApiBaseUrl,
  isAuditDeliveryRequest,
} from '@/shared/lib/http/transport';
import { getSafeUrlContext, runtimeDiagnostics } from '@/shared/lib/monitoring';
import { showErrorToast } from '@/shared/lib/notifications/toast';
import {
  getTokenCache as getCachedAuthToken,
  setTokenCache as setCachedAuthToken,
} from '@/shared/lib/http/token-cache';
import { redactSensitiveData } from '@/utils/security';
import { auditLogger } from '@/utils/audit-logger';

const REFRESH_TOKEN_ENDPOINT = '/Auth/refresh-token';

function isDebugLoggingEnabled(): boolean {
  return env.ENABLE_DEBUG_MODE && import.meta.env.DEV;
}

function summarizeLogValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
    };
  }

  if (typeof value === 'object') {
    return {
      type: 'object',
      keys: Object.keys(redactSensitiveData(value as Record<string, unknown>)).slice(0, 20),
    };
  }

  if (typeof value === 'string') {
    return '[string]';
  }

  return value;
}

function debugInfo(message: string, context?: Record<string, unknown>): void {
  if (!isDebugLoggingEnabled()) {
    return;
  }

  console.info(message, context ? redactSensitiveData(context) : undefined);
}

function debugError(message: string, context?: Record<string, unknown>): void {
  if (!isDebugLoggingEnabled()) {
    return;
  }

  console.error(message, context ? redactSensitiveData(context) : undefined);
}

function shouldAuditApiRequest(
  config: Pick<ExtendedAxiosRequestConfig, 'url'>,
  safeTarget: ReturnType<typeof getSafeUrlContext>,
): boolean {
  return !isAuditDeliveryRequest(safeTarget?.path ?? config.url);
}

export { getCachedAuthToken as getTokenCache, setCachedAuthToken as setTokenCache };

// ============================================
// SILENT REFRESH COORDINATION (fixes #8)
// Ensures only one refresh request is in-flight at a time.
// Concurrent 401s queue behind the first refresh attempt.
// ============================================
let _isRefreshing = false;
let _refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onTokenRefreshed(token: string): void {
  _refreshSubscribers.forEach(({ resolve }) => resolve(token));
  _refreshSubscribers = [];
}

function onTokenRefreshFailed(error: unknown): void {
  _refreshSubscribers.forEach(({ reject }) => reject(error));
  _refreshSubscribers = [];
}

function subscribeTokenRefresh(): Promise<string> {
  return new Promise((resolve, reject) => {
    _refreshSubscribers.push({ resolve, reject });
  });
}

// ============================================
// SAFE-RETRY HELPER (fixes #2)
// Only idempotent methods are safe to retry automatically.
// POST/PUT/PATCH/DELETE could duplicate side-effects
// (e.g. replaying a consumed refresh token triggers stolen-token detection).
// ============================================
const IDEMPOTENT_METHODS = new Set(['get', 'head', 'options']);

function isIdempotent(config: { method?: string }): boolean {
  return IDEMPOTENT_METHODS.has(config.method?.toLowerCase() ?? '');
}

/**
 * Extended config to track retry attempts
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
  _startTime?: number;
  _requestId?: string;
  _silentError?: boolean;
  _skipAuthRefresh?: boolean;
  _isInternalRefreshRequest?: boolean;
  headers: InternalAxiosRequestConfig['headers'];
}

function shouldShowErrorToast(config?: ExtendedAxiosRequestConfig): boolean {
  return !config?._silentError && !config?._isInternalRefreshRequest;
}

function rejectNormalizedApiError(
  error: AxiosError,
  config?: ExtendedAxiosRequestConfig,
): Promise<never> {
  const normalized = normalizeError(error);

  runtimeDiagnostics.captureApiFailure({
    method: config?.method,
    url: config?.url,
    statusCode: normalized.statusCode,
    code: normalized.code,
    retryCount: config?._retryCount,
    requestId: config?._requestId,
  });

  if (shouldShowErrorToast(config)) {
    showErrorToast(normalized);
  }

  return Promise.reject(normalized);
}

/**
 * Pass to api.get/post/etc config to suppress auto-toast on error.
 * @example
 * api.get<MyData>('/endpoint', { _silentError: true } as SilentErrorConfig)
 */
export interface SilentErrorConfig extends AxiosRequestConfig {
  _silentError?: boolean;
  _skipAuthRefresh?: boolean;
  _isInternalRefreshRequest?: boolean;
}

/**
 * Create the base axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-App-Version': env.APP_VERSION,
    },
    // Send cookies/credentials to the API (same-origin or CORS with backend config)
    withCredentials: true,
    // Security: limit max response size (10MB)
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024,
  });

  // ============================================
  // REQUEST INTERCEPTOR
  // ============================================
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const extendedConfig = config as ExtendedAxiosRequestConfig;
      const safeTarget = getSafeUrlContext(config.url);

      // Add timestamp for request duration tracking
      extendedConfig._startTime = Date.now();

      // Add country code header
      if (extendedConfig.headers) {
        extendedConfig.headers['X-Country-Code'] = env.COUNTRY_CODE;
      }

      // Add authentication token from in-memory cache
      const token = getCachedAuthToken();
      if (token && extendedConfig.headers) {
        extendedConfig.headers['Authorization'] = `Bearer ${token}`;
      }

      // Add request ID for tracing (ISO 27001 A.12.4 - Logging)
      if (extendedConfig.headers) {
        extendedConfig._requestId = createApiRequestId();
        extendedConfig.headers['X-Request-ID'] = extendedConfig._requestId;
      }

      // NOTE: X-Content-Type-Options and X-Requested-With are RESPONSE headers
      // set by the server, not request headers. Removed to avoid confusion.

      if (shouldAuditApiRequest(extendedConfig, safeTarget)) {
        // Skip the audit delivery request itself to avoid recursive audit logging.
        auditLogger.log(
          'API_REQUEST',
          `${config.method?.toUpperCase()} ${safeTarget?.path ?? 'unknown'}`,
          {
            severity: 'info',
            resource: 'api',
            details: {
              method: config.method?.toUpperCase(),
              path: safeTarget?.path,
              queryKeys: safeTarget?.queryKeys,
            },
          },
        );
      }

      debugInfo('[api] request', {
        method: config.method?.toUpperCase(),
        path: safeTarget?.path,
        queryKeys: safeTarget?.queryKeys,
        params: summarizeLogValue(config.params),
        data: summarizeLogValue(config.data),
      });

      return extendedConfig;
    },
    (error: AxiosError) => {
      debugError('[api] request-interceptor-error', { message: error.message });
      return Promise.reject(error);
    },
  );

  // ============================================
  // RESPONSE INTERCEPTOR
  // ============================================
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ExtendedAxiosRequestConfig;
      const safeTarget = getSafeUrlContext(config.url);
      const duration = config._startTime ? Date.now() - config._startTime : 0;

      debugInfo('[api] response', {
        method: config.method?.toUpperCase(),
        path: safeTarget?.path,
        queryKeys: safeTarget?.queryKeys,
        status: response.status,
        duration,
        data: summarizeLogValue(response.data),
      });

      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as ExtendedAxiosRequestConfig | undefined;
      const safeTarget = getSafeUrlContext(config?.url);

      if (!config) {
        return rejectNormalizedApiError(error);
      }

      // Initialize retry count
      config._retryCount = config._retryCount || 0;

      debugError('[api] error', {
        method: config.method?.toUpperCase(),
        path: safeTarget?.path,
        queryKeys: safeTarget?.queryKeys,
        status: error.response?.status,
        message: error.message,
        retryCount: config._retryCount,
      });

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;

        // Handle 401 Unauthorized — attempt silent refresh before logout (fixes #8)
        if (status === 401) {
          if (config._skipAuthRefresh) {
            return rejectNormalizedApiError(error, config);
          }

          // Never retry the refresh endpoint itself to avoid infinite loops
          if (config.url?.includes(REFRESH_TOKEN_ENDPOINT)) {
            clearAuthToken();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
            return rejectNormalizedApiError(error, config);
          }

          if (!isIdempotent(config)) {
            return rejectNormalizedApiError(error, config);
          }

          // If a refresh is already in progress, queue this request
          if (_isRefreshing) {
            try {
              const newToken = await subscribeTokenRefresh();
              config.headers['Authorization'] = `Bearer ${newToken}`;
              return client(config);
            } catch {
              return rejectNormalizedApiError(error, config);
            }
          }

          _isRefreshing = true;

          try {
            const storedRefreshToken = await getStoredRefreshToken();
            const refreshResponse = await client.post(
              REFRESH_TOKEN_ENDPOINT,
              await buildDeviceRefreshTokenRequest(storedRefreshToken),
              { _silentError: true, _isInternalRefreshRequest: true } as SilentErrorConfig,
            );

            const responseData = refreshResponse.data?.data;
            const newToken = responseData?.token;

            if (!newToken) {
              throw new Error('Refresh response missing token');
            }

            // Persist the new tokens
            setCachedAuthToken(newToken);
            await persistRefreshedAuthSession(responseData ?? {});

            // Unblock all queued requests
            onTokenRefreshed(newToken);

            // Retry the original request with the new token
            config.headers['Authorization'] = `Bearer ${newToken}`;
            return client(config);
          } catch (refreshError) {
            onTokenRefreshFailed(refreshError);
            clearAuthToken();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
            return rejectNormalizedApiError(error, config);
          } finally {
            _isRefreshing = false;
          }
        }

        // Handle 403 Forbidden
        if (status === 403) {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:forbidden'));
          }
          return rejectNormalizedApiError(error, config);
        }

        // Handle 408 Request Timeout — only retry idempotent methods (fixes #2)
        if (status === 408) {
          if (isIdempotent(config) && config._retryCount < env.API_RETRY_ATTEMPTS) {
            config._retryCount += 1;
            const delay = calculateRetryDelay(config._retryCount);

            debugInfo('[api] retry-timeout', {
              method: config.method?.toUpperCase(),
              path: safeTarget?.path,
              attempt: config._retryCount,
              maxAttempts: env.API_RETRY_ATTEMPTS,
              delay,
            });

            await sleep(delay);
            return client(config);
          }
          return rejectNormalizedApiError(error, config);
        }

        // Handle 429 Too Many Requests — only retry idempotent methods (fixes #9)
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (isIdempotent(config) && retryAfter && config._retryCount < env.API_RETRY_ATTEMPTS) {
            config._retryCount += 1;
            const delay = parseInt(retryAfter, 10) * 1000 || env.API_RETRY_DELAY;
            await sleep(delay);
            return client(config);
          }
        }

        // Handle 5xx Server Errors with retry — only idempotent methods (fixes #2)
        if (status >= 500 && isIdempotent(config) && config._retryCount < env.API_RETRY_ATTEMPTS) {
          config._retryCount += 1;
          const delay = calculateRetryDelay(config._retryCount);

          debugInfo('[api] retry-server-error', {
            method: config.method?.toUpperCase(),
            path: safeTarget?.path,
            attempt: config._retryCount,
            maxAttempts: env.API_RETRY_ATTEMPTS,
            delay,
            status,
          });

          await sleep(delay);
          return client(config);
        }
      }

      // Handle network errors and timeouts with retry — only idempotent methods (fixes #2)
      if (
        isIdempotent(config) &&
        (error.code === 'ECONNABORTED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'ETIMEDOUT')
      ) {
        if (config._retryCount < env.API_RETRY_ATTEMPTS) {
          config._retryCount += 1;
          const delay = calculateRetryDelay(config._retryCount);

          debugInfo('[api] retry-network-error', {
            method: config.method?.toUpperCase(),
            path: safeTarget?.path,
            attempt: config._retryCount,
            maxAttempts: env.API_RETRY_ATTEMPTS,
            delay,
            code: error.code,
          });

          await sleep(delay);
          return client(config);
        }
      }

      return rejectNormalizedApiError(error, config);
    },
  );

  return client;
};

/**
 * Calculate retry delay with exponential backoff
 */
function calculateRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  const baseDelay = env.API_RETRY_DELAY;
  const delay = baseDelay * Math.pow(2, retryCount - 1);
  // Add some jitter to prevent thundering herd
  const jitter = Math.random() * 1000;
  return Math.min(delay + jitter, 30000); // Max 30 seconds
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate unique request ID
 */
function clearAuthToken(): void {
  setCachedAuthToken(null);
  try {
    clearPersistedAuthSession();
  } catch {
    // Ignore storage errors
  }
}

/**
 * Normalize error to consistent ApiError format
 */
function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as Record<string, unknown>;
    return {
      code: (data?.code as string) || `HTTP_${error.response.status}`,
      message: (data?.message as string) || getDefaultErrorMessage(error.response.status),
      details: data?.details as Record<string, unknown> | undefined,
      // Preserve the backend's field-level validation errors (fixes #9).
      // Backend sends ApiResponse.Errors as Record<string, string[]>.
      errors: (data?.errors ?? null) as Record<string, string[] | null> | null | undefined,
      statusCode: error.response.status,
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'La requête a expiré. Veuillez réessayer.',
      statusCode: 408,
    };
  }

  if (error.code === 'ERR_NETWORK') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      statusCode: 0,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || "Une erreur inattendue s'est produite.",
    statusCode: 0,
  };
}

/**
 * Get default error message by status code
 */
function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Requête invalide. Veuillez vérifier vos données.',
    401: 'Session expirée. Veuillez vous reconnecter.',
    403: 'Accès non autorisé.',
    404: 'Ressource non trouvée.',
    409: 'Conflit avec les données existantes.',
    422: 'Données invalides.',
    429: 'Trop de requêtes. Veuillez patienter.',
    500: 'Erreur serveur. Veuillez réessayer plus tard.',
    502: 'Service temporairement indisponible.',
    503: 'Service en maintenance.',
    504: 'Le serveur ne répond pas.',
  };

  return messages[status] || "Une erreur s'est produite.";
}

/**
 * The main API client instance
 */
export const apiClient = createApiClient();

/**
 * Typed API request helpers
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  /**
   * Raw request (returns full response)
   */
  raw: apiClient,
};

export default apiClient;
