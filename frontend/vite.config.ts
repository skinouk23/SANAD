import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const FIXED_CONNECT_SRC = [
  'https://nominatim.openstreetmap.org',
  'https://router.project-osrm.org',
];

const THEME_INIT_SCRIPT_PATH = path.resolve(__dirname, 'public/theme-init.js');

function readThemeInitScript(): string {
  return readFileSync(THEME_INIT_SCRIPT_PATH, 'utf8').trim();
}

function hashInlineScript(script: string): string {
  return createHash('sha256').update(script).digest('base64');
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function resolveApiBaseUrl(mode: string): string {
  const runtimeEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const configuredApiBaseUrl = runtimeEnv.VITE_API_BASE_URL?.trim();

  return configuredApiBaseUrl || '/api/v1';
}

function buildContentSecurityPolicy(
  apiBaseUrl: string,
  options?: { includeDevWebSockets?: boolean; scriptHashes?: string[] },
): string {
  const connectSrc = new Set(["'self'", ...FIXED_CONNECT_SRC]);
  const scriptSrc = new Set(["'self'"]);

  for (const hash of options?.scriptHashes ?? []) {
    scriptSrc.add(`'sha256-${hash}'`);
  }

  if (isAbsoluteUrl(apiBaseUrl)) {
    try {
      connectSrc.add(new URL(apiBaseUrl).origin);
    } catch {
      // Ignore invalid URLs here — runtime env validation will reject them.
    }
  }

  if (options?.includeDevWebSockets) {
    // Vite HMR uses WebSocket connections during local development.
    connectSrc.add('ws:');
    connectSrc.add('wss:');
  }

  // This CSP is injected via <meta http-equiv>, so it should only contain
  // directives that browsers enforce from document-delivered policies.
  // Clickjacking protection must come from deployment-owned response headers.
  return [
    "default-src 'self'",
    `script-src ${Array.from(scriptSrc).join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    `connect-src ${Array.from(connectSrc).join(' ')}`,
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const apiBaseUrl = resolveApiBaseUrl(mode);
  const shouldInjectCspMeta = command !== 'serve';
  const themeInitScript = readThemeInitScript();
  const contentSecurityPolicy = buildContentSecurityPolicy(apiBaseUrl, {
    includeDevWebSockets: command === 'serve',
    scriptHashes: [hashInlineScript(themeInitScript)],
  });

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inline-theme-init',
        transformIndexHtml(html) {
          return html.replace(
            '<script src="/theme-init.js"></script>',
            `<script>${themeInitScript}</script>`,
          );
        },
      },
      ...(shouldInjectCspMeta
        ? [
            {
              name: 'inject-csp-meta',
              transformIndexHtml(html) {
                return {
                  html,
                  tags: [
                    {
                      tag: 'meta',
                      attrs: {
                        'http-equiv': 'Content-Security-Policy',
                        content: contentSecurityPolicy,
                      },
                      injectTo: 'head-prepend',
                    },
                  ],
                };
              },
            },
          ]
        : []),
    ],

    // Path aliases for cleaner imports
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },

    // Proxy API requests to the real backend during development.
    // Allows the frontend to use relative URLs (/api/v1/...) which
    // avoids CORS in dev and mirrors production reverse-proxy setups.
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          // Don't rewrite — backend routes already start with /api/v1
        },
      },
    },

    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
    },

    build: {
      // Raise warning threshold slightly — vendor chunk will be ~400KB
      chunkSizeWarningLimit: 450,

      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — cached across all pages
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],

            // Animation & UI libraries
            'vendor-motion': ['framer-motion'],

            // HTTP & utilities
            'vendor-http': ['axios'],

            // TanStack Query — cached separately from React core
            'vendor-query': ['@tanstack/react-query'],

            // Icons — shared across many pages
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
