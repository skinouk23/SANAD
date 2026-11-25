// Theme initialization runs before React to avoid a flash of the wrong theme.
// Preference is stored under a neutral key and legacy admin-theme is migrated.
(function () {
  var THEME_STORAGE_KEY = 'theme-preference';
  var LEGACY_THEME_STORAGE_KEY = 'admin-theme';

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function resolveTheme(theme) {
    return theme === 'system' ? getSystemTheme() : theme;
  }

  function applyTheme(theme) {
    var resolvedTheme = resolveTheme(theme);
    document.documentElement.dataset.themePreference = theme;
    document.documentElement.classList.toggle('light', resolvedTheme === 'light');
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }

  try {
    var storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    var legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    var theme = storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : legacyTheme === 'light' || legacyTheme === 'dark'
        ? legacyTheme
        : 'system';

    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    applyTheme(theme);
  } catch {
    applyTheme('system');
  }
})();
