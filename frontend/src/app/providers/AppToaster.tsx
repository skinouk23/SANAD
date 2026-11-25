import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useTheme } from '@/shared/lib/theme/theme-context';
import { Toaster } from '@/shared/ui/primitives/sonner';

/**
 * App-level bridge that provides Sonner with active app context values.
 *
 * Mount once inside both ThemeProvider and LanguageProvider.
 */
export function AppToaster() {
  const { dir } = useLanguage();
  const { theme } = useTheme();

  return <Toaster dir={dir} theme={theme} />;
}
