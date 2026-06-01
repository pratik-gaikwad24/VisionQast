/* =========================================================
   VisionQast — Service Worker (sw.js)
   Cache-first for static assets, network-first for HTML
   ========================================================= */

const CACHE_NAME    = 'visionqast-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.svg',
  '/manifest.json',
  '/images/logo.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

/* ── Install: pre-cache static assets ───────────────── */
self.addEventListener('install', event => {
  /* Do NOT call skipWaiting() — avoids forcing a page reload
     when the SW activates mid-session. SW waits until all
     existing tabs are closed before taking over. */
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

/* ── Activate: clean old caches ─────────────────────── */
self.addEventListener('activate', event => {
  /* Do NOT call clients.claim() — avoids hijacking the current
     page and triggering an unexpected browser reload. SW takes
     control on the user's next natural navigation. */
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

/* ── Fetch: strategy per resource type ──────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (except Google Fonts)
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.hostname.includes('fonts.g')) return;

  // HTML — network first, fall back to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Static assets — cache first, fall back to network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
