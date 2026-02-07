// QALQX IRON SHIELD v1.0 (Service Worker)
const CACHE_NAME = 'qalqx-v2-supreme';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './settings.html',
    // We cache critical tools first. The rest load on demand and then stay cached.
    './tools/age.html',
    './tools/math/calc.html',
    './tools/productivity/notes.html',
    './tools/productivity/todo.html',
    './tools/utility/speed.html',
    './tools/utility/system.html'
];

// 1. INSTALL: Cache Core Files
self.addEventListener('install', (e) => {
    console.log('[SW] Installing Iron Shield...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. FETCH: Intercept Requests
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            // Return cached file if found, else fetch from network
            return res || fetch(e.request).then((response) => {
                // Dynamic Caching: If we fetch a new tool, cache it for next time
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

// 3. ACTIVATE: Cleanup Old Caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if(key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
});
