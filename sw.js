// Werkt ook zonder internet: eerst het netwerk proberen (zodat updates direct binnenkomen),
// en als dat niet lukt de laatst bewaarde versie gebruiken.
const CACHE = "leerplek-v4";
const CORE = [
  "./", "./index.html", "./manifest.json", "./css/app.css",
  "./js/app.js", "./js/doek.js", "./js/notities.js", "./js/leren.js", "./js/modules/economie-h4.js",
  "./vendor/pdfjs/pdf.min.js", "./vendor/pdfjs/pdf.worker.min.js",
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
