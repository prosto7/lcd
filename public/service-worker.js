// serviceWorker.js
const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];


// Установка SW
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    )
});

// Прослушивание запросов
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Активация SW
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});
