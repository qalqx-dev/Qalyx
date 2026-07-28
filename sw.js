// QALQX IRON SHIELD v4.0
const CACHE_NAME = 'qalqx-v4-supreme';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './settings.html',
    './faq.html',
    './tools/productivity/notes.html',
    './tools/productivity/todo.html',
    './tools/math/calc.html',
    './tools/utility/converter.html',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    if (request.url.startsWith('chrome-extension://')) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response && response.ok && (request.destination === 'document' || request.destination === 'script' || request.destination === 'style' || request.destination === 'image')) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
