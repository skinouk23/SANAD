import { env, isDevelopment, logEnvConfig, shouldEnableMockData, validateEnv } from '@/config/env';
import { applyLanguageToDocument } from '@/shared/lib/i18n/document';
import { getImmediateI18nState, resolveInitialLanguageCode } from '@/shared/lib/i18n/locale-loader';
import { runtimeDiagnostics } from '@/shared/lib/monitoring';
import type { I18nState } from '@/shared/lib/i18n/locale-loader';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

export interface RuntimeBootstrapState {
  initialI18nState: I18nState;
  initialLanguageCode: LanguageCode;
}

function formatValidationError(errors: string[]): Error {
  return new Error(`Invalid environment configuration:\n- ${errors.join('\n- ')}`);
}

export async function initializeRuntime(): Promise<RuntimeBootstrapState> {
  runtimeDiagnostics.initialize();

  const validation = validateEnv();

  if (!validation.valid) {
    const error = formatValidationError(validation.errors);
    runtimeDiagnostics.captureBootstrapFailure(error, { phase: 'env-validation' });
    throw error;
  }

  logEnvConfig();

  let initialI18nState: I18nState;
  let initialLanguageCode: LanguageCode;

  try {
    initialLanguageCode = resolveInitialLanguageCode();

    // Apply persisted lang/dir before mount, but do not block React on a locale chunk.
    applyLanguageToDocument(initialLanguageCode);
    initialI18nState = getImmediateI18nState();
  } catch (error) {
    runtimeDiagnostics.captureBootstrapFailure(error, { phase: 'i18n-runtime' });
    throw error;
  }

  if (!shouldEnableMockData()) {
    if (isDevelopment() && env.ENABLE_DEBUG_MODE) {
      console.info('[boot] Real backend mode');
    }

    return { initialI18nState, initialLanguageCode };
  }

  try {
    const { setupMocks } = await import('@/shared/lib/dev/msw');
    await setupMocks();
  } catch (error) {
    runtimeDiagnostics.captureBootstrapFailure(error, { phase: 'mock-runtime' });
    throw error;
  }

  if (isDevelopment()) {
    console.info('[boot] Mock service worker enabled');
  }

  return { initialI18nState, initialLanguageCode };
}
