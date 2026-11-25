
/**
 * Care@Home Tunisia - Service Worker
 * 
 * Caching strategies:
 * - App Shell (HTML, CSS, JS): Cache First
 * - API calls: Network First with cache fallback
 * - Images: Cache First with expiration
 * - Fonts: Cache First (long-lived)
 * 
 * Copy this file to: public/sw.js
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `sanad-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `sanad-dynamic-${CACHE_VERSION}`;
const API_CACHE = `sanad-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `sanad-images-${CACHE_VERSION}`;

// ============================================
// APP SHELL - Files to pre-cache on install
// ============================================
const APP_SHELL = [
'/',
'/index.html',
'/manifest.json'
// Add your built JS/CSS files here after build:
// '/assets/index-[hash].js',
// '/assets/index-[hash].css',
];

// ============================================
// CACHE SIZE LIMITS
// ============================================
const MAX_DYNAMIC_CACHE = 50;
const MAX_API_CACHE = 100;
const MAX_IMAGE_CACHE = 60;
const API_CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE).
    then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL);
    }).
    then(() => {
      // Force activation without waiting
      return self.skipWaiting();
    }).
    catch((error) => {
      console.error('[SW] Pre-cache failed:', error);
    })
  );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys().
    then((cacheNames) => {
      return Promise.all(
        cacheNames.
        filter((name) => {
          // Delete old versioned caches
          return name.startsWith('sanad-') &&
          name !== STATIC_CACHE &&
          name !== DYNAMIC_CACHE &&
          name !== API_CACHE &&
          name !== IMAGE_CACHE;
        }).
        map((name) => {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    }).
    then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH EVENT - Routing & Caching Strategies
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // ---- API Requests: Network First ----
  if (url.pathname.startsWith('/api/') || url.hostname.includes('api.careathome.tn')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, MAX_API_CACHE));
    return;
  }

  // ---- Images: Cache First ----
  if (
  request.destination === 'image' ||
  url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i))
  {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, MAX_IMAGE_CACHE));
    return;
  }

  // ---- Fonts: Cache First (long-lived) ----
  if (
  request.destination === 'font' ||
  url.hostname.includes('fonts.googleapis.com') ||
  url.hostname.includes('fonts.gstatic.com'))
  {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // ---- External CDN resources (Leaflet, etc): Cache First ----
  if (url.hostname.includes('unpkg.com') || url.hostname.includes('cdn.')) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // ---- Navigation requests: Network First with offline fallback ----
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE).
      catch(() => caches.match('/index.html'))
    );
    return;
  }

  // ---- Everything else (JS, CSS): Stale While Revalidate ----
  event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE));
});

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Network First - Try network, fall back to cache
 * Best for: API calls, dynamic content
 */
async function networkFirstStrategy(request, cacheName, maxEntries) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());

      // Trim cache if needed
      if (maxEntries) {
        trimCache(cacheName, maxEntries);
      }
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }

    throw error;
  }
}

/**
 * Cache First - Try cache, fall back to network
 * Best for: Images, fonts, static assets
 */
async function cacheFirstStrategy(request, cacheName, maxEntries) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());

      if (maxEntries) {
        trimCache(cacheName, maxEntries);
      }
    }

    return networkResponse;
  } catch (error) {
    // Return a placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#1e293b" width="200" height="200"/><text fill="#64748b" font-family="sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Hors ligne</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

/**
 * Stale While Revalidate - Serve from cache, update in background
 * Best for: JS, CSS bundles
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).
  then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).
  catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

/**
 * Trim cache to max entries (FIFO)
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxEntries);
  }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'Care@Home Tunisia',
    body: 'Vous avez une nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: data.actions || [
    { action: 'open', title: 'Ouvrir', icon: '/icons/action-open.png' },
    { action: 'dismiss', title: 'Fermer', icon: '/icons/action-close.png' }],

    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ============================================
// NOTIFICATION CLICK
// ============================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).
    then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(targetUrl);
    })
  );
});

// ============================================
// BACKGROUND SYNC (for offline form submissions)
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }

  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncAppointments() {
  try {
    const cache = await caches.open('sanad-pending-sync');
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('[SW] Sync appointments failed:', error);
  }
}

async function syncMessages() {
  try {
    const cache = await caches.open('sanad-pending-messages');
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('[SW] Sync messages failed:', error);
  }
}

console.log('[SW] Service Worker loaded - Care@Home Tunisia v' + CACHE_VERSION);