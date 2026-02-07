// QALQX IRON SHIELD v3.0 (Subpath Compatible)
const CACHE_NAME = 'qalqx-v3-supreme';

// We explicitly use the repository name '/Qalyx/' for GitHub Pages
const GH_PATH = '/Qalyx';

const ASSETS = [
    `${GH_PATH}/`,
    `${GH_PATH}/index.html`,
    `${GH_PATH}/style.css`,
    `${GH_PATH}/app.js`,
    `${GH_PATH}/manifest.json`,
    `${GH_PATH}/settings.html`,
    // Core Tools (Add more as needed, but these are the essentials)
    `${GH_PATH}/tools/productivity/notes.html`,
    `${GH_PATH}/tools/productivity/todo.html`,
    `${GH_PATH}/tools/math/calc.html`,
    `${GH_PATH}/tools/utility/converter.html`
];

// 1. INSTALL
self.addEventListener('install', (e) => {
    console.log('[SW] Installing Iron Shield...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. FETCH
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

// 3. ACTIVATE (Clear old caches)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if(key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
});
