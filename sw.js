const CACHE = "flying-above-v5";
const LOCAL_FILES = ["./", "./index.html", "./3d.html", "./manifest.webmanifest", "./icon.svg"];
const CDN_FILES = [
  "https://unpkg.com/three@0.180.0/build/three.module.js",
  "https://unpkg.com/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js",
  "https://polyfork.dev/cdn/scrap-built-aeroplane-65ac95.mjs"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL_FILES).then(() =>
    // CDN files are best-effort: one failing must not kill the whole install
    Promise.all(CDN_FILES.map(u => c.add(u).catch(() => {})))
  )).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
