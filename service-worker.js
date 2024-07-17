const cacheName = 'visualizations-cache-v1';
const staticAssets = [
    './',
    './index.html',
    './css/style.css',
    './static/js/main.js',
    './static/js/bigBangExplosion.js',
    './static/js/colorfulWaveAnimation.js',
    './static/js/fallingLeaves.js',
    './static/js/galaxySpinner.js',
    './static/js/digitalRain.js',
    './static/js/electricPlasma.js',
    './static/js/hypnoticSpiral.js',
    './static/js/cosmicDust.js',
    './static/js/lavaLamp.js',
    './static/js/mosaicImageEffect.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('fetch', async event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}