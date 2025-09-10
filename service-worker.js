const CACHE_NAME = 'financas-pro-cache-v8';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching initial assets');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Always ignore non-GET requests and CDN assets
  if (request.method !== 'GET' || url.hostname === 'aistudiocdn.com') {
    return;
  }

  // For the main document and TSX files, use a "Network falling back to Cache" strategy.
  // This ensures users always get the latest version of the app logic if they are online.
  const isAppFile = url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('.tsx');
  if (isAppFile) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // If the network request is successful, cache the new response and return it.
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If the network request fails (e.g., offline), serve the file from the cache.
          return caches.match(request);
        })
    );
    return;
  }

  // For other static assets (JSON locales, icons), use a "Cache first, then update" strategy.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(response => {
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            console.error('ServiceWorker Fetch failed:', err);
            throw err;
        });

        // Return cached response if available, otherwise wait for network
        return response || fetchPromise;
      });
    })
  );
});