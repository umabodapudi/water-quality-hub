const CACHE_NAME = "water-quality-hub-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./report-center.html",
    "./manifest.json",
    "./styles.css",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Install the service worker and cache essential files.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Remove older cache versions.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );

    self.clients.claim();
});

// Use cached files when possible, but update from the network.
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                const responseCopy = networkResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseCopy);
                });

                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
