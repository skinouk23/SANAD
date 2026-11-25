/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

import { arabicTranslations } from '@/i18n/translations/ar';
import { germanTranslations } from '@/i18n/translations/de';
import { englishTranslations } from '@/i18n/translations/en';
import { frenchTranslations } from '@/i18n/translations/fr';
import { dutchTranslations } from '@/i18n/translations/nl';
import { applyLanguageToDocument } from '@/shared/lib/i18n/document';
import { LanguageProvider } from '@/shared/lib/i18n/language-context';
import { resolveDefaultLanguageCode } from '@/shared/lib/i18n/locale-loader';
import { queryClient } from '@/shared/lib/query/client';
import { ThemeProvider } from '@/shared/lib/theme/theme-context';
import type { TranslationKeys } from '@/i18n/types';
import type { I18nState } from '@/shared/lib/i18n/locale-loader';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

const testTranslationsByCode: Record<LanguageCode, TranslationKeys> = {
  'ar-TN': arabicTranslations,
  'de-DE': germanTranslations,
  'en-GB': englishTranslations,
  'fr-FR': frenchTranslations,
  'nl-NL': dutchTranslations,
};

interface TestProvidersProps {
  children: ReactNode;
  initialEntries: string[];
  initialI18nState: I18nState;
  initialLanguageCode: LanguageCode;
  queryClient: QueryClient;
}

export interface TestI18nOptions {
  locale?: LanguageCode;
  initialI18nState?: I18nState;
}

export interface RenderWithProvidersOptions
  extends Omit<RenderOptions, 'wrapper'>, TestI18nOptions {
  route?: string;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function createTestI18nState(code: LanguageCode = resolveDefaultLanguageCode()): I18nState {
  return {
    code,
    translations: testTranslationsByCode[code],
  };
}

export function resolveTestI18nState(options: TestI18nOptions = {}): I18nState {
  const { locale, initialI18nState } = options;
  return initialI18nState ?? createTestI18nState(locale);
}

export function bootstrapTestI18n(options: TestI18nOptions = {}): I18nState {
  const initialI18nState = resolveTestI18nState(options);
  applyLanguageToDocument(initialI18nState.code);
  return initialI18nState;
}

export function createTestQueryClient(): QueryClient {
  const defaultOptions = queryClient.getDefaultOptions();

  return new QueryClient({
    defaultOptions: {
      ...(defaultOptions.queries ? { queries: { ...defaultOptions.queries } } : {}),
      ...(defaultOptions.mutations ? { mutations: { ...defaultOptions.mutations } } : {}),
    },
  });
}

function TestProviders({
  children,
  initialEntries,
  initialI18nState,
  initialLanguageCode,
  queryClient,
}: TestProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider
          initialI18nState={initialI18nState}
          initialLanguageCode={initialLanguageCode}
        >
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const {
    route = '/',
    initialEntries = [route],
    locale,
    initialI18nState,
    queryClient: client,
    ...renderOptions
  } = options;
  const testQueryClient = client ?? createTestQueryClient();
  const testI18nState = bootstrapTestI18n({ locale, initialI18nState });

  return {
    user: userEvent.setup(),
    queryClient: testQueryClient,
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestProviders
          initialEntries={initialEntries}
          initialI18nState={testI18nState}
          initialLanguageCode={testI18nState.code}
          queryClient={testQueryClient}
        >
          {children}
        </TestProviders>
      ),
      ...renderOptions,
    }),
  };
}
