self.addEventListener('install', event => {
  event.waitUntil(async function() {
    let cache = await caches.open('odhad-cached');
    await cache.addAll([
      'index.html',
      'main.css',
      'odhad.js',
      'ton.wav'
    ]);
  }());
});

self.addEventListener('fetch', event => {
  event.respondWith(async function() {
    let cache = await caches.open('odhad-cached');
    let cachedResponse = await cache.match(event.request);
    let networkResponsePromise = fetch(event.request);

    event.waitUntil(async function() {
      let networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    }());

    return cachedResponse || networkResponsePromise;
  }());
});
