// Service worker dasar untuk caching
const CACHE_NAME = 'fatiha-bookstore-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Tambahkan path ke ikon Anda di sini, contoh:
  // '/icons/icon-192.png',
  // '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Mengambil dari cache jika ada
        }
        return fetch(event.request); // Jika tidak, ambil dari network
      }
    )
  );
});
