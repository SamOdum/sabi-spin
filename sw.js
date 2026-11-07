// Sabi Spin service worker: makes the game work offline once it has been opened online.
const CACHE = 'sabi-spin-v3';
const CORE = ['./', './index.html', './questions.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Stale-while-revalidate for our own files: answer instantly from the cache (fast on slow classroom Wi-Fi),
// then fetch a fresh copy in the background so the next launch has any updates.
// Cache first for Google Fonts (they never change for a pinned URL).
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request); if (hit) return hit;
      const res = await fetch(e.request); if (res.ok) await c.put(e.request, res.clone()); return res;
    }).catch(() => new Response('', { status: 503 })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    // ?view=audience is the same page, so ignore the query string when looking it up
    const hit = await c.match(e.request, { ignoreSearch: url.pathname.endsWith('/') || url.pathname.endsWith('.html') });
    const fresh = fetch(e.request).then(res => {
      // Take the copy before handing the response back, so its body is never already used.
      if (res.ok && !url.search) { const copy = res.clone(); c.put(e.request, copy); }
      return res;
    });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    return fresh.catch(() => c.match('./index.html'));
  }));
});
