/**
 * Service Worker Registration Utility
 *
 * Add this to your app's entry point (index.tsx or App.tsx):
 *
 *   import { registerServiceWorker } from './pwa/register-sw'
 *   registerServiceWorker()
 */

interface SWConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export function registerServiceWorker(config?: SWConfig): void {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported');
    return;
  }

  // Only register in production
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
    )
  );

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    if (isLocalhost) {
      // In development, check if SW exists
      checkValidServiceWorker(swUrl, config);
      navigator.serviceWorker.ready.then(() => {
        console.log('[PWA] Service worker ready (localhost)');
      });
    } else {
      // In production, register normally
      registerValidSW(swUrl, config);
    }
  });

  // Online/Offline events
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    config?.onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
    config?.onOffline?.();
  });
}

async function registerValidSW(
swUrl: string,
config?: SWConfig)
: Promise<void> {
  try {
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/'
    });

    console.log('[PWA] Service Worker registered:', registration.scope);

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content available — prompt user to refresh
            console.log('[PWA] New content available; please refresh.');
            config?.onUpdate?.(registration);
          } else {
            // Content cached for offline use
            console.log('[PWA] Content cached for offline use.');
            config?.onSuccess?.(registration);
          }
        }
      };
    };
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
}

async function checkValidServiceWorker(
swUrl: string,
config?: SWConfig)
: Promise<void> {
  try {
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' }
    });

    const contentType = response.headers.get('content-type');
    if (
    response.status === 404 ||
    contentType != null && contentType.indexOf('javascript') === -1)
    {
      // No service worker found — reload
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
    } else {
      registerValidSW(swUrl, config);
    }
  } catch {
    console.log('[PWA] No internet connection. Running in offline mode.');
  }
}

export function unregisterServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.
    then((registration) => registration.unregister()).
    then(() => console.log('[PWA] Service Worker unregistered')).
    catch((error) => console.error('[PWA] Unregister failed:', error));
  }
}

// ============================================
// PUSH NOTIFICATION HELPERS
// ============================================

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log('[PWA] Notification permission:', permission);
  return permission;
}

export async function subscribeToPush(
vapidPublicKey: string)
: Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log('[PWA] Push subscription:', JSON.stringify(subscription));
    return subscription;
  } catch (error) {
    console.error('[PWA] Push subscription failed:', error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// ============================================
// BACKGROUND SYNC HELPERS
// ============================================

export async function registerBackgroundSync(tag: string): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    // @ts-ignore - Background Sync API
    await registration.sync.register(tag);
    console.log('[PWA] Background sync registered:', tag);
    return true;
  } catch (error) {
    console.log('[PWA] Background sync not supported:', error);
    return false;
  }
}

// ============================================
// INSTALL PROMPT HELPER
// ============================================

let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] Install prompt captured');

  // Dispatch custom event for React components to listen to
  window.dispatchEvent(new CustomEvent('pwa:installable'));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  console.log('[PWA] App installed');
  window.dispatchEvent(new CustomEvent('pwa:installed'));
});

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] No install prompt available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] Install prompt outcome:', outcome);
  deferredPrompt = null;
  return outcome === 'accepted';
}

export function isInstallable(): boolean {
  return deferredPrompt !== null;
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true);

}