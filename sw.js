// ════════════════════════════════════════════════════════
// KHARCHA TRACKER — Service Worker (sw.js)
// PWA offline support + cache strategy
// ════════════════════════════════════════════════════════

const CACHE_NAME = 'kharcha-v1';
const CACHE_VERSION = '1.0.0';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Google Fonts — cache on first load
  'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap',
];

// ── INSTALL ──────────────────────────────────────────────
// Cache all static assets on first install
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Kharcha PWA v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      // Cache what we can — ignore failures for external URLs
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] Could not cache:', url, err.message)
          )
        )
      );
    }).then(() => {
      // Activate immediately without waiting
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE ─────────────────────────────────────────────
// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Kharcha PWA v' + CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH ────────────────────────────────────────────────
// Cache-first for static assets, network-first for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Google OAuth / Drive API calls — always go to network
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('accounts.google.com') ||
    url.hostname.includes('oauth2.googleapis.com')
  ) {
    return; // Let browser handle normally
  }

  // For Google Fonts — stale-while-revalidate
  if (url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // For app files — Cache First, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache + update in background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => { }); // Ignore network errors
        return cachedResponse;
      }

      // Not in cache — fetch from network
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || !networkResponse.ok) {
          return networkResponse;
        }
        // Cache the new response
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback — return cached index.html
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── BACKGROUND SYNC (future use) ─────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'kharcha-sync') {
    console.log('[SW] Background sync triggered');
  }
});

// ── PUSH NOTIFICATIONS (future use) ──────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Kharcha', {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'kharcha-notification',
  });
});
