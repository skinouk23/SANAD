/**
 * Environment Configuration
 * Centralized access to environment variables with defaults and validation
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
  ENABLE_ANALYTICS: boolean;

  // App Info
  APP_NAME: string;
  APP_VERSION: string;

  // External Services
  GOOGLE_MAPS_API_KEY?: string;
  SENTRY_DSN?: string;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Vite uses import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${key}`] as string || defaultValue;
  }
  // Fallback for other environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`REACT_APP_${key}`] || process.env[key] || defaultValue;
  }
  return defaultValue;
}

/**
 * Parse boolean environment variable
 */
function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Parse number environment variable
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Application environment configuration
 */
export const env: EnvConfig = {
  // Country & Localization
  COUNTRY_CODE: getEnvVar('COUNTRY_CODE', 'TN'),
  DEFAULT_LOCALE: getEnvVar('DEFAULT_LOCALE', 'fr-FR'),

  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://localhost:5001/api/v1'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 5000),
  API_RETRY_ATTEMPTS: getEnvNumber('API_RETRY_ATTEMPTS', 2),
  API_RETRY_DELAY: getEnvNumber('API_RETRY_DELAY', 500),

  // Feature Flags
  ENABLE_MOCK_DATA: getEnvBool('ENABLE_MOCK_DATA', false),
  ENABLE_DEBUG_MODE: getEnvBool('ENABLE_DEBUG_MODE', false),
  ENABLE_ANALYTICS: getEnvBool('ENABLE_ANALYTICS', false),

  // App Info
  APP_NAME: getEnvVar('APP_NAME', 'Care@Home Tunisia'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),

  // External Services
  GOOGLE_MAPS_API_KEY: getEnvVar('GOOGLE_MAPS_API_KEY') || undefined,
  SENTRY_DSN: getEnvVar('SENTRY_DSN') || undefined
};

/**
 * Validate required environment variables
 */
export function validateEnv(): {valid: boolean;errors: string[];} {
  const errors: string[] = [];

  // Required variables
  if (!env.COUNTRY_CODE) {
    errors.push('COUNTRY_CODE is required');
  }

  if (!env.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }

  // Validate country code format
  if (env.COUNTRY_CODE && !/^[A-Z]{2}$/.test(env.COUNTRY_CODE)) {
    errors.push(
      'COUNTRY_CODE must be a 2-letter ISO country code (e.g., TN, FR, US)'
    );
  }

  // Validate API URL format
  if (env.API_BASE_URL && !env.API_BASE_URL.startsWith('http')) {
    errors.push(
      'API_BASE_URL must be a valid URL starting with http:// or https://'
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if running in development mode
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
 * Check if running in production mode
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
 * Log environment configuration (for debugging)
 */
export function logEnvConfig(): void {
  if (env.ENABLE_DEBUG_MODE || isDevelopment()) {
    console.group('🔧 Environment Configuration');
    console.log('Country Code:', env.COUNTRY_CODE);
    console.log('API Base URL:', env.API_BASE_URL);
    console.log('API Timeout:', env.API_TIMEOUT, 'ms');
    console.log('Mock Data Enabled:', env.ENABLE_MOCK_DATA);
    console.log('Debug Mode:', env.ENABLE_DEBUG_MODE);
    console.log('Environment:', isDevelopment() ? 'Development' : 'Production');
    console.groupEnd();
  }
}

export default env;
