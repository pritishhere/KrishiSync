// KrishiSync Progressive Web App Service Worker
const CACHE_NAME = 'krishisync-app-shell-v1';

// Static App Shell assets to cache during installation
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-512x512-maskable.png',
];

// Service Worker Install Event - Cache App Shell Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching App Shell Static Assets');
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Service Worker Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Service Worker Fetch Event - Handle Caching & Offline Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // RULE 1: Never intercept or cache non-GET requests (POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // RULE 2: Exclude sensitive authentication endpoints, tokens, and backend API requests
  const isApiRequest = url.pathname.startsWith('/api') || url.hostname.includes('localhost') && url.port === '5000';
  const isAuthRequest = url.pathname.includes('/auth') || url.pathname.includes('/login') || url.pathname.includes('/otp');
  
  if (isApiRequest || isAuthRequest) {
    // Network-only for API and Auth requests
    return;
  }

  // RULE 3: Navigation requests (HTML Pages) - Network First with App Shell Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If valid response, update cache in background
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback to cached index.html
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // RULE 4: Static Assets (JS, CSS, Images, Web Fonts) - Cache First with Network Fallback
  const isStaticAsset =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached asset, update in background if online
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {/* Ignore background fetch failure */});
          return cachedResponse;
        }

        // Fallback to network
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});
