/**
 * Vite PWA Plugin Configuration
 *
 * USAGE: Copy this into your vite.config.ts
 *
 * 1. Install: npm install -D vite-plugin-pwa
 * 2. Import in vite.config.ts:
 *    import { VitePWA } from 'vite-plugin-pwa'
 * 3. Add to plugins array: VitePWA(pwaConfig)
 */

// Copy this object into your vite.config.ts plugins
export const pwaConfig = {
  registerType: 'autoUpdate' as const,
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],

  manifest: {
    name: 'Care@Home Tunisia - Sanad',
    short_name: 'Sanad',
    description: 'La première plateforme de soins à domicile en Tunisie.',
    theme_color: '#06b6d4',
    background_color: '#0f172a',
    display: 'standalone' as const,
    orientation: 'portrait-primary' as const,
    scope: '/',
    start_url: '/',
    lang: 'fr',
    categories: ['health', 'medical', 'lifestyle'],

    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],

    shortcuts: [
      {
        name: 'Trouver un soignant',
        short_name: 'Services',
        url: '/services',
        icons: [{ src: '/icons/shortcut-services.png', sizes: '96x96' }],
      },
      {
        name: 'Mes rendez-vous',
        short_name: 'RDV',
        url: '/patient-dashboard',
        icons: [{ src: '/icons/shortcut-appointments.png', sizes: '96x96' }],
      },
      {
        name: 'Urgence',
        short_name: 'Urgence',
        url: '/ambulance',
        icons: [{ src: '/icons/shortcut-emergency.png', sizes: '96x96' }],
      },
    ],
  },

  workbox: {
    // Pre-cache these file types
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

    // Runtime caching rules
    runtimeCaching: [
      {
        // API calls - Network First
        urlPattern: /^https:\/\/api\.careathome\.tn\/.*$/,
        handler: 'NetworkFirst' as const,
        options: {
          cacheName: 'sanad-api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 5 * 60, // 5 minutes
          },
          networkTimeoutSeconds: 10,
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Google Fonts stylesheets
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        // Google Fonts webfont files
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // CDN resources (Leaflet, etc.)
        urlPattern: /^https:\/\/unpkg\.com\/.*/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'cdn-cache',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        // Images
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'sanad-images',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },

  // Dev options
  devOptions: {
    enabled: false, // Set to true to test SW in dev
    type: 'module' as const,
  },
};

/**
 * EXAMPLE vite.config.ts:
 *
 * import { defineConfig } from 'vite'
 * import react from '@vitejs/plugin-react'
 * import { VitePWA } from 'vite-plugin-pwa'
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     VitePWA(pwaConfig),
 *   ],
 * })
 */
