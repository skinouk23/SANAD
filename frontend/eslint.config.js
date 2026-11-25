import js from '@eslint/js';
import { readdirSync } from 'node:fs';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import eslintConfigPrettier from 'eslint-config-prettier';

const featureDirectories = readdirSync(new globalThis.URL('./src/features', import.meta.url), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const sharedUpwardImportPatterns = [
  '@/app/**',
  '@/pages/**',
  '@/features/**',
  '@/components/**',
  '@/contexts/**',
];

const featureDeepImportPatterns = ['@/features/*/*/**'];

const sharedUiBarrelImportPaths = [
  {
    name: '@/shared/ui/primitives',
    message:
      'Use direct primitive imports like "@/shared/ui/primitives/button" to preserve route chunk isolation.',
  },
  {
    name: '@/shared/ui/primitives/index',
    message:
      'Use direct primitive imports like "@/shared/ui/primitives/button" to preserve route chunk isolation.',
  },
  {
    name: '@/shared/ui/composites',
    message:
      'Use direct composite imports like "@/shared/ui/composites/date-picker-field" to avoid pulling unrelated shared UI.',
  },
  {
    name: '@/shared/ui/composites/index',
    message:
      'Use direct composite imports like "@/shared/ui/composites/date-picker-field" to avoid pulling unrelated shared UI.',
  },
];

function restrictedImports(config) {
  if (Array.isArray(config)) {
    return ['error', { patterns: config }];
  }

  return ['error', config];
}

function crossFeatureDeepImportPatterns(currentFeature) {
  return featureDirectories
    .filter((feature) => feature !== currentFeature)
    .map((feature) => ({
      group: [`@/features/${feature}/*/**`],
      message: `Cross-feature imports must use the public API of ${feature}.`,
    }));
}

function featureImportRestrictionConfig(feature) {
  const config = {
    paths: [...sharedUiBarrelImportPaths],
    patterns: [
      {
        group: ['@/app/**', '@/pages/**'],
        message: 'Features cannot import app or page layers.',
      },
      ...crossFeatureDeepImportPatterns(feature),
    ],
  };

  if (feature === 'bookings') {
    config.paths.push(
      {
        name: '@/features/bookings',
        message:
          'Booking internals must not import the bookings root barrel. Use a narrower feature entrypoint or a local module instead.',
      },
      {
        name: '@/features/providers',
        message:
          'Booking internals must use the narrower providers public-api entrypoint instead of the broad providers root barrel.',
      },
    );
  }

  return config;
}

export default tseslint.config(
  // Global ignores
  { ignores: ['dist', 'node_modules', '*.cjs', '.agents/**'] },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  // Service worker files run in a ServiceWorkerGlobalScope, not a browser window
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },

  {
    files: ['**/service-worker.js', '**/sw.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.serviceworker,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Project files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'group', 'groupEnd'] }],
      // Relax unused-vars to match tsc behavior (underscore prefix = intentionally unused)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce @/ alias for cross-directory imports — auto-fixable
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { allowSameFolder: true, rootDir: 'src', prefix: '@' },
      ],
    },
  },

  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        paths: sharedUiBarrelImportPaths,
        patterns: [
          {
            group: sharedUpwardImportPatterns,
            message:
              'Shared code must stay domain-agnostic and cannot import app, pages, features, legacy components, or contexts.',
          },
        ],
      }),
    },
  },

  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        paths: sharedUiBarrelImportPaths,
        patterns: [
          {
            group: featureDeepImportPatterns,
            message:
              'Pages must import feature public entrypoints only. Use the feature barrel or an explicit nested public index.',
          },
        ],
      }),
    },
  },

  ...featureDirectories.map((feature) => ({
    files: [`src/features/${feature}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': restrictedImports(featureImportRestrictionConfig(feature)),
    },
  })),

  {
    files: ['src/features/bookings/flow/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        ...featureImportRestrictionConfig('bookings'),
        paths: [
          ...featureImportRestrictionConfig('bookings').paths,
          {
            name: '@/features/bookings/flow',
            message:
              'Booking flow internals must not import the booking flow barrel. Use local modules or ./internal instead.',
          },
        ],
      }),
    },
  },

  {
    files: ['src/integrations/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        paths: sharedUiBarrelImportPaths,
        patterns: [
          {
            group: sharedUpwardImportPatterns,
            message:
              'Integrations must stay isolated from app, pages, features, legacy components, and contexts. Depend on shared or integration-local adapters instead.',
          },
        ],
      }),
    },
  },

  {
    files: ['src/app/router/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        paths: sharedUiBarrelImportPaths,
        patterns: [
          {
            group: ['@/features/**'],
            message: 'App router is wiring-only and must not import features directly.',
          },
        ],
      }),
    },
  },

  {
    files: ['src/app/**/*.{ts,tsx}'],
    ignores: ['src/app/router/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        paths: sharedUiBarrelImportPaths,
        patterns: [
          {
            group: ['@/pages/**', '@/features/**'],
            message: 'Non-router app code must not import pages or features.',
          },
        ],
      }),
    },
  },

  // Prettier last — disables formatting rules that conflict
  eslintConfigPrettier,
);
