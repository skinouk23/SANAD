
# 📱 Care@Home Tunisia — PWA Setup Guide

Complete guide to deploy Care@Home as a Progressive Web App on Android and iOS.

---

## 📋 Table of Contents

1. [Quick Start](#1-quick-start)
2. [File Structure](#2-file-structure)
3. [Step-by-Step Setup](#3-step-by-step-setup)
4. [Icon Generation](#4-icon-generation)
5. [HTML Meta Tags](#5-html-meta-tags)
6. [Vite Plugin Setup](#6-vite-plugin-setup)
7. [Service Worker Registration](#7-service-worker-registration)
8. [Push Notifications](#8-push-notifications)
9. [Install Prompt (A2HS)](#9-install-prompt-a2hs)
10. [Testing PWA](#10-testing-pwa)
11. [Deploy to App Stores](#11-deploy-to-app-stores)
12. [Capacitor (Native Wrapper)](#12-capacitor-native-wrapper)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Quick Start

```bash
# Install dependencies
npm install -D vite-plugin-pwa

# Generate icons (see Section 4)
# Add meta tags to index.html (see Section 5)
# Configure vite.config.ts (see Section 6)
# Register SW in app (see Section 7)

# Build and test
npm run build
npx serve dist
```

---

## 2. File Structure

After setup, your project should look like:

```
public/
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-maskable-192x192.png
│   ├── icon-maskable-512x512.png
│   ├── apple-touch-icon.png (180x180)
│   ├── shortcut-services.png (96x96)
│   ├── shortcut-appointments.png (96x96)
│   ├── shortcut-emergency.png (96x96)
│   ├── shortcut-messages.png (96x96)
│   └── badge-72x72.png
├── screenshots/
│   ├── home-mobile.png (390x844)
│   ├── services-mobile.png (390x844)
│   └── home-desktop.png (1280x720)
├── favicon.ico
├── apple-touch-icon.png
└── sw.js (if using manual SW instead of vite-plugin-pwa)

src/
├── pwa/
│   ├── register-sw.ts
│   ├── manifest.json (reference)
│   ├── service-worker.js (reference)
│   └── vite-pwa-config.ts (reference)
```

---

## 3. Step-by-Step Setup

### Option A: Using `vite-plugin-pwa` (Recommended)

The plugin auto-generates the manifest and service worker.

```bash
npm install -D vite-plugin-pwa
```

### Option B: Manual Service Worker

Copy `pwa/service-worker.js` → `public/sw.js`
Copy `pwa/manifest.json` → `public/manifest.json`

---

## 4. Icon Generation

### From a 512x512 source icon:

**Option 1: Online Tool**
1. Go to [https://realfavicongenerator.net](https://realfavicongenerator.net)
2. Upload your 512x512 icon
3. Configure for all platforms
4. Download and extract to `public/icons/`

**Option 2: CLI Tool**
```bash
npm install -D pwa-asset-generator

npx pwa-asset-generator ./src/assets/logo.png ./public/icons \
  --background "#0f172a" \
  --padding "20%" \
  --type png \
  --manifest ./public/manifest.json
```

**Option 3: Sharp (Node.js script)**
```js
// scripts/generate-icons.js
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  for (const size of sizes) {
    await sharp('src/assets/icon-source.png')
      .resize(size, size)
      .png()
      .toFile(`public/icons/icon-${size}x${size}.png`);
  }
  // Maskable icons (with padding)
  for (const size of [192, 512]) {
    await sharp('src/assets/icon-source.png')
      .resize(Math.round(size * 0.6), Math.round(size * 0.6))
      .extend({
        top: Math.round(size * 0.2),
        bottom: Math.round(size * 0.2),
        left: Math.round(size * 0.2),
        right: Math.round(size * 0.2),
        background: { r: 6, g: 182, b: 212, alpha: 1 } // cyan-500
      })
      .png()
      .toFile(`public/icons/icon-maskable-${size}x${size}.png`);
  }
}
generate();
```

### Apple Touch Icon
```bash
# 180x180 for iOS
cp public/icons/icon-192x192.png public/apple-touch-icon.png
# Or generate specifically at 180x180
```

---

## 5. HTML Meta Tags

Add these to your `index.html` `<head>`:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#06b6d4" />
  <meta name="background-color" content="#0f172a" />
  <meta name="description" content="Care@Home Tunisia - Soins à domicile. Trouvez un professionnel de santé qualifié." />
  
  <!-- iOS Meta Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Sanad" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- iOS Splash Screens (optional but recommended) -->
  <!-- iPhone 14 Pro Max (430x932) -->
  <link rel="apple-touch-startup-image" 
        media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        href="/splash/apple-splash-1290-2796.png" />
  <!-- iPhone 14 Pro (393x852) -->
  <link rel="apple-touch-startup-image"
        media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        href="/splash/apple-splash-1179-2556.png" />
  <!-- iPhone 13/14 (390x844) -->
  <link rel="apple-touch-startup-image"
        media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        href="/splash/apple-splash-1170-2532.png" />
  
  <!-- Android Meta Tags -->
  <meta name="mobile-web-app-capable" content="yes" />
  
  <!-- Microsoft Tile -->
  <meta name="msapplication-TileColor" content="#06b6d4" />
  <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
  
  <title>Care@Home Tunisia - Sanad</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>
```

---

## 6. Vite Plugin Setup

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Import the config from pwa/vite-pwa-config.ts
// Or paste the pwaConfig object directly here

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'Care@Home Tunisia - Sanad',
        short_name: 'Sanad',
        description: 'Soins à domicile en Tunisie',
        theme_color: '#06b6d4',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        lang: 'fr',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.careathome\.tn\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
    }),
  ],
})
```

---

## 7. Service Worker Registration

### With vite-plugin-pwa (automatic):
The plugin handles registration automatically. No code needed.

### Manual registration (add to index.tsx):

```tsx
// index.tsx
import { registerServiceWorker } from './pwa/register-sw'

// After render
registerServiceWorker({
  onSuccess: () => {
    console.log('App ready for offline use')
  },
  onUpdate: (registration) => {
    // Show "New version available" toast
    if (confirm('Nouvelle version disponible. Mettre à jour ?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  },
  onOffline: () => {
    // Show offline indicator
  },
  onOnline: () => {
    // Hide offline indicator
  },
})
```

---

## 8. Push Notifications

### Server Setup (Node.js):
```bash
npm install web-push
```

```js
// Generate VAPID keys (run once)
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public:', vapidKeys.publicKey);
console.log('Private:', vapidKeys.privateKey);
```

### Client Setup:
```tsx
import { requestNotificationPermission, subscribeToPush } from './pwa/register-sw'

async function enableNotifications() {
  const permission = await requestNotificationPermission()
  if (permission === 'granted') {
    const subscription = await subscribeToPush('YOUR_VAPID_PUBLIC_KEY')
    // Send subscription to your server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    })
  }
}
```

### Notification Types for Care@Home:
- 🔔 Appointment confirmations
- ⏰ Appointment reminders (30 min before)
- 💬 New messages from provider/patient
- 📍 Provider en route / arrived
- 💳 Payment received
- ⭐ Review request after service

---

## 9. Install Prompt (A2HS)

Create a React component for the install banner:

```tsx
// components/InstallPrompt.tsx
import { useState, useEffect } from 'react'
import { promptInstall, isInstallable, isStandalone } from '../pwa/register-sw'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isStandalone()) return // Already installed
    
    const handler = () => setShow(true)
    window.addEventListener('pwa:installable', handler)
    
    // Check if already installable
    if (isInstallable()) setShow(true)
    
    return () => window.removeEventListener('pwa:installable', handler)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 shadow-2xl">
      <button onClick={() => setShow(false)} className="absolute top-2 right-2 text-white/70">
        <X className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold">Installer Sanad</h3>
          <p className="text-white/80 text-sm">Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button
          onClick={async () => {
            const accepted = await promptInstall()
            if (accepted) setShow(false)
          }}
          className="px-4 py-2 bg-white text-cyan-600 rounded-xl font-bold text-sm"
        >
          Installer
        </button>
      </div>
    </div>
  )
}
```

---

## 10. Testing PWA

### Chrome DevTools:
1. Open DevTools → Application tab
2. Check: Manifest, Service Workers, Cache Storage
3. Use Lighthouse → PWA audit

### Testing Checklist:
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] App works offline (basic navigation)
- [ ] Install prompt appears
- [ ] Icons display correctly
- [ ] Theme color matches
- [ ] Push notifications work
- [ ] Background sync works
- [ ] Lighthouse PWA score > 90

### Test on Real Devices:
```bash
# Build and serve locally
npm run build
npx serve dist -s

# Use ngrok for mobile testing
npx ngrok http 3000
# Open the ngrok URL on your phone
```

---

## 11. Deploy to App Stores

### Google Play Store (TWA):

```bash
# Option 1: PWABuilder (easiest)
# Go to https://pwabuilder.com
# Enter your deployed URL
# Download Android package
# Upload to Google Play Console

# Option 2: Bubblewrap CLI
npm install -g @nicolo-ribaudo/bubblewrap
bubblewrap init --manifest https://your-domain.com/manifest.json
bubblewrap build
# Generates app-release-signed.apk
```

### Apple App Store:
PWAs can't be directly published to the App Store. Use **Capacitor**:

```bash
# See Section 12 below
```

---

## 12. Capacitor (Native Wrapper)

For full native app experience on both Android and iOS:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Sanad" "tn.careathome.sanad" --web-dir dist

# Add platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios

# Install useful plugins
npm install @capacitor/push-notifications
npm install @capacitor/geolocation
npm install @capacitor/camera
npm install @capacitor/haptics
npm install @capacitor/status-bar
npm install @capacitor/splash-screen

# Build web app, then sync
npm run build
npx cap sync

# Open in IDE
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode
```

### capacitor.config.ts:
```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tn.careathome.sanad',
  appName: 'Sanad',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a',
    },
  },
};

export default config;
```

---

## 13. Troubleshooting

| Issue | Solution |
|-------|----------|
| SW not registering | Must be served over HTTPS (or localhost) |
| Manifest not detected | Check `<link rel="manifest">` path in HTML |
| Icons not showing | Verify icon paths match manifest; clear cache |
| iOS no install prompt | iOS doesn't support `beforeinstallprompt`; show manual instructions |
| Offline not working | Check SW fetch handler; verify cache names |
| Update not applying | Call `skipWaiting()` in SW; prompt user to refresh |
| Push not working | Check VAPID keys; verify notification permission |
| White screen on install | Ensure `start_url` is cached in SW |

### iOS-Specific Notes:
- iOS Safari has limited PWA support
- No push notifications on iOS PWA (use Capacitor for this)
- No background sync on iOS
- Add to Home Screen is manual (Share → Add to Home Screen)
- Consider showing iOS-specific install instructions

### Useful Commands:
```bash
# Check Lighthouse PWA score
npx lighthouse https://your-domain.com --only-categories=pwa

# Generate splash screens for iOS
npx pwa-asset-generator logo.png ./public/splash --splash-only --background "#0f172a"

# Test service worker locally
npx serve dist -s -l 3000
```

---

## Summary: Recommended Deployment Path

1. **Now**: Deploy web app via Magic Patterns DEPLOY button
2. **Phase 1**: Add PWA support (manifest + service worker + meta tags)
3. **Phase 2**: Add push notifications (Firebase Cloud Messaging)
4. **Phase 3**: Wrap with Capacitor for native features
5. **Phase 4**: Publish to Google Play (TWA or Capacitor) and Apple App Store (Capacitor)

Total estimated setup time: **2-4 hours** for basic PWA, **1-2 days** for full Capacitor native app.
