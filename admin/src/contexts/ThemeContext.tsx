import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true
});
export function ThemeProvider({ children }: {children: ReactNode;}) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  // Initialize theme from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('admin-theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches)
      {
        setTheme('light');
      }
    } catch (e) {

      // localStorage not available
    }}, []);
  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('admin-theme', theme);
    } catch (e) {

      // localStorage not available
    }if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);
  const toggleTheme = () => {
    setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
  };
  const isDark = theme === 'dark';
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark
      }}>
      
      {children}
    </ThemeContext.Provider>);

}
export function useTheme() {
  return useContext(ThemeContext);
}