const CACHE_NAME = 'market-simulator-v51-store-fallback';
const APP_SHELL = [
  '/game/',
  '/game/index.html',
  '/game/intel.html',
  '/game/trades.html',
  '/game/portfolio.html',
  '/game/store.html',
  '/game/news.html',
  '/game/auth.html',
  '/game/terms.html',
  '/game/privacy.html',
  '/game/disclaimer.html',
  '/game/coming-soon.html',
  '/game/tester-checklist.html',
  '/game/devlog.html',
  '/game/whats-new.html',
  '/game/styles.css',
  '/game/runtime-config.js',
  '/game/mobile-config.json',
  '/game/app.js',
  '/game/pages.js',
  '/game/launch.js',
  '/game/news.js',
  '/game/auth.js',
  '/game/tester-checklist.js',
  '/game/icon.svg',
  '/game/mentavio-logo-board.png',
  '/game/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/market/') || url.pathname.startsWith('/ai/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  const shouldRefresh =
    event.request.mode === 'navigate' ||
    ['document', 'script', 'style', 'worker'].includes(
      event.request.destination,
    );

  if (shouldRefresh) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cachedResponse = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, cachedResponse));
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request);
    }),
  );
});
