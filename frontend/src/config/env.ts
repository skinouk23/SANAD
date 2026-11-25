/**
 * Environment Configuration
 * Centralized access to environment variables with defaults and validation.
 */

interface EnvConfig {
  // Country & Localization
  COUNTRY_CODE: string;
  DEFAULT_LOCALE: string;

  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  API_RETRY_DELAY: number;

  // Feature Flags
  ENABLE_MOCK_DATA: boolean;
  ENABLE_DEBUG_MODE: boolean;
  SHOW_QUERY_DEVTOOLS: boolean;

  // App Info
  APP_NAME: string;
  APP_VERSION: string;

  // External Services
  GOOGLE_MAPS_API_KEY?: string;
}

interface EnvValidationResult {
  valid: boolean;
  errors: string[];
}

function getRuntimeEnvValue(key: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[`VITE_${key}`];
    return typeof value === 'string' ? value : undefined;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env[`REACT_APP_${key}`] || process.env[key] || undefined;
  }

  return undefined;
}

function getEnvVar(key: string, defaultValue = ''): string {
  const value = getRuntimeEnvValue(key);
  return value === undefined || value.trim() === '' ? defaultValue : value;
}

function getEnvBool(key: string, defaultValue = false): boolean {
  const value = getRuntimeEnvValue(key);

  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = getRuntimeEnvValue(key);

  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function validateBooleanEnv(key: string, errors: string[]): void {
  const value = getRuntimeEnvValue(key);

  if (value === undefined || value.trim() === '') {
    return;
  }

  if (!['true', 'false', '1', '0'].includes(value)) {
    errors.push(`${key} must be one of: true, false, 1, 0`);
  }
}

function validatePositiveIntegerEnv(
  key: string,
  errors: string[],
  options?: { min?: number },
): void {
  const value = getRuntimeEnvValue(key);

  if (value === undefined || value.trim() === '') {
    return;
  }

  if (!/^\d+$/.test(value)) {
    errors.push(`${key} must be a positive integer`);
    return;
  }

  const parsed = Number.parseInt(value, 10);
  const minimum = options?.min ?? 0;

  if (parsed <= minimum) {
    const requirement = minimum === 0 ? 'greater than 0' : `greater than ${minimum}`;
    errors.push(`${key} must be ${requirement}`);
  }
}

/**
 * Check if running in development mode.
 */
export function isDevelopment(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }

  return false;
}

/**
 * Check if running in production mode.
 */
export function isProduction(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PROD === true;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }

  return false;
}

/**
 * Application environment configuration.
 */
export const env: EnvConfig = {
  // Country & Localization
  COUNTRY_CODE: getEnvVar('COUNTRY_CODE', 'TN'),
  DEFAULT_LOCALE: getEnvVar('DEFAULT_LOCALE', 'fr-FR'),

  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', '/api/v1'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 5000),
  API_RETRY_ATTEMPTS: getEnvNumber('API_RETRY_ATTEMPTS', 2),
  API_RETRY_DELAY: getEnvNumber('API_RETRY_DELAY', 500),

  // Feature Flags
  ENABLE_MOCK_DATA: getEnvBool('ENABLE_MOCK_DATA', false),
  ENABLE_DEBUG_MODE: getEnvBool('ENABLE_DEBUG_MODE', false),
  SHOW_QUERY_DEVTOOLS: getEnvBool('SHOW_QUERY_DEVTOOLS', false),

  // App Info
  APP_NAME: getEnvVar('APP_NAME', 'Care@Home Tunisia'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),

  // External Services
  GOOGLE_MAPS_API_KEY: getEnvVar('GOOGLE_MAPS_API_KEY') || undefined,
};

export function shouldEnableMockData(): boolean {
  return isDevelopment() && env.ENABLE_MOCK_DATA;
}

/**
 * Validate required environment variables.
 */
export function validateEnv(): EnvValidationResult {
  const errors: string[] = [];

  if (!env.COUNTRY_CODE) {
    errors.push('COUNTRY_CODE is required');
  }

  if (!env.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }

  if (env.COUNTRY_CODE && !/^[A-Z]{2}$/.test(env.COUNTRY_CODE)) {
    errors.push('COUNTRY_CODE must be a 2-letter ISO country code (e.g. TN, FR, US)');
  }

  if (
    env.API_BASE_URL &&
    !env.API_BASE_URL.startsWith('http://') &&
    !env.API_BASE_URL.startsWith('https://') &&
    !env.API_BASE_URL.startsWith('/')
  ) {
    errors.push('API_BASE_URL must start with http://, https://, or /');
  }

  validateBooleanEnv('ENABLE_MOCK_DATA', errors);
  validateBooleanEnv('ENABLE_DEBUG_MODE', errors);
  validateBooleanEnv('SHOW_QUERY_DEVTOOLS', errors);

  validatePositiveIntegerEnv('API_TIMEOUT', errors);
  validatePositiveIntegerEnv('API_RETRY_ATTEMPTS', errors, { min: -1 });
  validatePositiveIntegerEnv('API_RETRY_DELAY', errors);

  if (isProduction() && env.ENABLE_MOCK_DATA) {
    errors.push('ENABLE_MOCK_DATA cannot be enabled in production builds');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log environment configuration for local debugging only.
 */
export function logEnvConfig(): void {
  if (!isDevelopment() || !env.ENABLE_DEBUG_MODE) {
    return;
  }

  console.info('[env] API base URL:', env.API_BASE_URL);
  console.info('[env] Mock data enabled:', shouldEnableMockData());
  console.info('[env] Query devtools enabled:', env.SHOW_QUERY_DEVTOOLS);
  console.info('[env] API timeout:', env.API_TIMEOUT);
}

export default env;
