/**
 * API Client
 * Centralized HTTP client with interceptors, retry logic, and error handling
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig } from
'axios';
import { env } from '../config/env';
import type { ApiError, ApiResponse } from '../types';
import {
  getCsrfToken,
  redactSensitiveData,
  sanitizeObject } from
'../utils/security';
import { auditLogger } from '../utils/audit-logger';
import { buildStoredAdminSession } from '../services/authSession';
import {
  clearStoredAdminSession,
  getAdminAccessToken,
  getStoredAdminSession,
  setStoredAdminSession } from
'../services/adminAuthStorage';
import type { AuthApiResponse } from '../types/auth.types';

/**
 * Extended config to track retry attempts
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
  _startTime?: number;
  _retry?: boolean;
  headers: InternalAxiosRequestConfig['headers'];
}

const AUTH_LOGIN_ENDPOINT = '/auth/login';
const AUTH_REFRESH_ENDPOINT = '/auth/refresh-token';
let refreshSessionPromise: Promise<string | null> | null = null;

/**
 * Create the base axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-App-Version': env.APP_VERSION
    },
    // Security: prevent credentials from being sent to third-party domains
    withCredentials: false,
    // Security: limit max response size (10MB)
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024
  });

  // ============================================
  // REQUEST INTERCEPTOR
  // ============================================
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const extendedConfig = config as ExtendedAxiosRequestConfig;
      // Add timestamp for request duration tracking
      extendedConfig._startTime = Date.now();

      // Add country code header
      if (extendedConfig.headers) {
        extendedConfig.headers['X-Country-Code'] = env.COUNTRY_CODE;
      }

      // Add authentication token if available
      const token = getAuthToken();
      if (token && extendedConfig.headers) {
        extendedConfig.headers['Authorization'] = `Bearer ${token}`;
      }

      // Add request ID for tracing (ISO 27001 A.12.4 - Logging)
      if (extendedConfig.headers) {
        extendedConfig.headers['X-Request-ID'] = generateRequestId();
      }

      // Security: Add CSRF token for state-changing requests
      if (
      extendedConfig.headers &&
      ['post', 'put', 'patch', 'delete'].includes(
        config.method?.toLowerCase() || ''
      ))
      {
        extendedConfig.headers['X-CSRF-Token'] = getCsrfToken();
      }

      // Security: Add security headers
      if (extendedConfig.headers) {
        extendedConfig.headers['X-Content-Type-Options'] = 'nosniff';
        extendedConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      // Security: Sanitize request data to prevent injection (OWASP A3)
      if (extendedConfig.data && typeof extendedConfig.data === 'object') {
        extendedConfig.data = sanitizeObject(extendedConfig.data);
      }

      // Audit: Log API requests (ISO 27001 A.12.4)
      auditLogger.log(
        'API_REQUEST',
        `${config.method?.toUpperCase()} ${config.url}`,
        {
          severity: 'info',
          resource: 'api',
          details: { method: config.method, url: config.url }
        }
      );

      // Log request in debug mode (redact sensitive data)
      if (env.ENABLE_DEBUG_MODE) {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params,
            data: config.data ? redactSensitiveData(config.data) : undefined
          }
        );
      }

      return extendedConfig;
    },
    (error: AxiosError) => {
      console.error('❌ Request interceptor error:', error.message);
      return Promise.reject(error);
    }
  );

  // ============================================
  // RESPONSE INTERCEPTOR
  // ============================================
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ExtendedAxiosRequestConfig;
      const duration = config._startTime ? Date.now() - config._startTime : 0;

      // Log response in debug mode (redact sensitive data)
      if (env.ENABLE_DEBUG_MODE) {
        console.log(
          `✅ API Response: ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`,
          {
            status: response.status,
            data: response.data ?
            redactSensitiveData(response.data) :
            undefined
          }
        );
      }

      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as ExtendedAxiosRequestConfig | undefined;

      if (!config) {
        return Promise.reject(normalizeError(error));
      }

      // Initialize retry count
      config._retryCount = config._retryCount || 0;

      // Log error in debug mode
      if (env.ENABLE_DEBUG_MODE) {
        console.error(
          `❌ API Error: ${config.method?.toUpperCase()} ${config.url}`,
          {
            status: error.response?.status,
            message: error.message,
            retryCount: config._retryCount
          }
        );
      }

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;

        // Handle 401 Unauthorized - clear auth and redirect
        if (status === 401) {
          if (!config._retry && !isAuthRequest(config.url)) {
            config._retry = true;
            const refreshedToken = await refreshAccessToken();

            if (refreshedToken) {
              if (config.headers) {
                config.headers['Authorization'] = `Bearer ${refreshedToken}`;
              }

              return client(config);
            }
          }

          clearAuthToken();
          dispatchUnauthorized();
          return Promise.reject(normalizeError(error));
        }

        // Handle 403 Forbidden
        if (status === 403) {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:forbidden'));
          }
          return Promise.reject(normalizeError(error));
        }

        // Handle 408 Request Timeout
        if (status === 408) {
          if (config._retryCount < env.API_RETRY_ATTEMPTS) {
            config._retryCount += 1;
            const delay = calculateRetryDelay(config._retryCount);

            if (env.ENABLE_DEBUG_MODE) {
              console.log(
                `🔄 Retrying request after 408 timeout (attempt ${config._retryCount}/${env.API_RETRY_ATTEMPTS}) in ${delay}ms`
              );
            }

            await sleep(delay);
            return client(config);
          }
          return Promise.reject(normalizeError(error));
        }

        // Handle 429 Too Many Requests
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter && config._retryCount < env.API_RETRY_ATTEMPTS) {
            config._retryCount += 1;
            const delay = parseInt(retryAfter, 10) * 1000 || env.API_RETRY_DELAY;
            await sleep(delay);
            return client(config);
          }
        }

        // Handle 5xx Server Errors with retry
        if (status >= 500 && config._retryCount < env.API_RETRY_ATTEMPTS) {
          config._retryCount += 1;
          const delay = calculateRetryDelay(config._retryCount);

          if (env.ENABLE_DEBUG_MODE) {
            console.log(
              `🔄 Retrying request (attempt ${config._retryCount}/${env.API_RETRY_ATTEMPTS}) in ${delay}ms`
            );
          }

          await sleep(delay);
          return client(config);
        }
      }

      // Handle network errors and timeouts with retry
      if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ETIMEDOUT')
      {
        if (config._retryCount < env.API_RETRY_ATTEMPTS) {
          config._retryCount += 1;
          const delay = calculateRetryDelay(config._retryCount);

          if (env.ENABLE_DEBUG_MODE) {
            console.log(
              `🔄 Retrying request after network error (attempt ${config._retryCount}/${env.API_RETRY_ATTEMPTS}) in ${delay}ms`
            );
          }

          await sleep(delay);
          return client(config);
        }
      }

      return Promise.reject(normalizeError(error));
    }
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
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function isAuthRequest(url?: string): boolean {
  return url === AUTH_LOGIN_ENDPOINT || url === AUTH_REFRESH_ENDPOINT;
}

function dispatchUnauthorized(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const storedSession = getStoredAdminSession();
  if (!storedSession?.refreshToken) {
    return null;
  }

  if (!refreshSessionPromise) {
    refreshSessionPromise = (async () => {
      try {
        const response = await axios.post<ApiResponse<AuthApiResponse>>(
          `${env.API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`,
          { refreshToken: storedSession.refreshToken },
          {
            timeout: env.API_TIMEOUT,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'X-App-Version': env.APP_VERSION
            }
          }
        );

        const payload = response.data.data;
        if (!payload) {
          throw new Error('Missing refresh payload');
        }

        const refreshedSession = buildStoredAdminSession(payload, storedSession.user);
        setStoredAdminSession(refreshedSession);
        return refreshedSession.token;
      } catch {
        clearStoredAdminSession();
        return null;
      } finally {
        refreshSessionPromise = null;
      }
    })();
  }

  return refreshSessionPromise;
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  return getAdminAccessToken();
}

/**
 * Clear auth token from storage
 */
function clearAuthToken(): void {
  clearStoredAdminSession();
}

/**
 * Normalize error to consistent ApiError format
 */
function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as any;
    return {
      code: data?.code || `HTTP_${error.response.status}`,
      message: data?.message || getDefaultErrorMessage(error.response.status),
      details: data?.details,
      statusCode: error.response.status
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'La requête a expiré. Veuillez réessayer.',
      statusCode: 408
    };
  }

  if (error.code === 'ERR_NETWORK') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      statusCode: 0
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || "Une erreur inattendue s'est produite.",
    statusCode: 0
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
    504: 'Le serveur ne répond pas.'
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
  get: async <T,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  /**
   * POST request
   */
  post: async <T,>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig)
  : Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * PUT request
   */
  put: async <T,>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig)
  : Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * PATCH request
   */
  patch: async <T,>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig)
  : Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  /**
   * DELETE request
   */
  delete: async <T,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  /**
   * Raw request (returns full response)
   */
  raw: apiClient
};

export default apiClient;
