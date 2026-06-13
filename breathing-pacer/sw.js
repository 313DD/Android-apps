const CACHE = 'breathing-pacer-v1';
const ASSETS = ['./', './index.html', './manifest.json', './sw.js', './icon.svg'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Navigation requests use network-first so app updates are picked up immediately
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
        return;
    }
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
