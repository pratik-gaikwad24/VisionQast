/* =========================================================
   VisionQast — Service Worker (kill-switch)
   The site no longer uses a service worker. This version
   purges any previously-cached assets and unregisters
   itself so returning visitors always get fresh content.
   ========================================================= */

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll();
    clients.forEach((c) => c.navigate(c.url));
  })());
});

/* Pass-through: never serve from cache */
self.addEventListener('fetch', () => {});
