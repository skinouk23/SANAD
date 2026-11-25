import { RouterProvider } from 'react-router-dom';

import { AppProviders } from '@/app/providers/AppProviders';
import { appRouter } from '@/app/router/router';
import { RouterFallback } from '@/app/router/fallback';
import type { I18nState } from '@/shared/lib/i18n/locale-loader';
import type { LanguageCode } from '@/shared/lib/i18n/languages';

// ============================================
// APP COMPONENT
// ============================================

interface AppProps {
  initialI18nState: I18nState;
  initialLanguageCode: LanguageCode;
}

export function App({ initialI18nState, initialLanguageCode }: AppProps) {
  return (
    <AppProviders initialI18nState={initialI18nState} initialLanguageCode={initialLanguageCode}>
      <RouterProvider router={appRouter} fallbackElement={<RouterFallback />} />
    </AppProviders>
  );
}
