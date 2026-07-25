const CACHE_NAME = 'market-simulator-v26';
const APP_SHELL = [
  '/game/',
  '/game/index.html',
  '/game/intel.html',
  '/game/trades.html',
  '/game/portfolio.html',
  '/game/store.html',
  '/game/news.html',
  '/game/auth.html',
  '/game/styles.css',
  '/game/app.js',
  '/game/pages.js',
  '/game/news.js',
  '/game/auth.js',
  '/game/icon.svg',
  '/game/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/market/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request);
    }),
  );
});
