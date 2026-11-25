import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme-preference';

function isThemePreference(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  return 'dark';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyThemeToDocument(theme: Theme): void {
  const resolvedTheme = resolveTheme(theme);

  document.documentElement.dataset.themePreference = theme;
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  document.documentElement.classList.toggle('light', resolvedTheme === 'light');
}

function getStoredThemePreference(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors.
  }

  if (typeof document !== 'undefined') {
    const documentPreference = document.documentElement.dataset.themePreference ?? null;
    if (isThemePreference(documentPreference)) {
      return documentPreference;
    }
  }

  return 'system';
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredThemePreference);

  useEffect(() => {
    applyThemeToDocument(theme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors.
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemThemeChange = () => {
      applyThemeToDocument('system');
    };

    handleSystemThemeChange();
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (resolveTheme(currentTheme) === 'dark' ? 'light' : 'dark'));
  }, []);

  const resolvedTheme = resolveTheme(theme);
  const isDark = resolvedTheme === 'dark';

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      isDark,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
