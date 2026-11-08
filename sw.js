// Werkt ook zonder internet.
// - Eerst het netwerk proberen (zodat updates direct binnenkomen), maar hooguit WACHT milliseconden:
//   duurt het langer, dan meteen de bewaarde versie. Het netwerk mag op de achtergrond doorladen voor de volgende keer.
// - Alleen goede antwoorden gebruiken en bewaren. Een foutpagina of een omleiding naar een inlogpagina
//   (wifi op school of in de trein) wordt genegeerd.
// - Valt de startpagina terug op de bewaarde versie, dan komt de rest van die keer laden ook uit de bewaarde versie,
//   zodat oude en nieuwe bestanden niet door elkaar raken.
// - Eigen bestanden altijd bij de server nagaan (no-cache), anders geeft de browser tot 10 minuten een oude kopie.
// - Lettertypes van Google: eerst de bewaarde versie (die veranderen niet).
importScripts("js/ingesproken.js");   // lijst met ingesproken teksten; die gaan ook mee voor offline
const CACHE = "leerplek-v14";
const CORE = [
  "./", "./index.html", "./manifest.json", "./css/app.css",
  "./js/ingesproken.js", "./js/app.js", "./js/doek.js", "./js/notities.js", "./js/leren.js", "./js/nieuw.js", "./js/modules/economie-h4.js",
  "./vendor/pdfjs/pdf.min.js", "./vendor/pdfjs/pdf.worker.min.js",
  ...(self.INGESPROKEN || []).map(k => `./audio/z/${k}.mp3`),
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"
];
const WACHT = 3000;
const BEWAARD_MODUS = 30000;
let bewaardTot = 0;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const eigen = url => new URL(url).origin === self.location.origin;
function goed(req, res) {
  if (!res || !res.ok) return false;                                    // foutpagina, of omleiding (status 0)
  if (eigen(req.url) && res.url && !eigen(res.url)) return false;       // omgeleid naar een andere site (inlogpagina)
  return res.type === "basic" || res.type === "cors";
}
function bewaar(req, res) {
  const kopie = res.clone();
  caches.open(CACHE).then(c => c.put(req, kopie)).catch(() => {});
  return res;
}
async function uitBewaard(req) {
  const r = await caches.match(req, { ignoreSearch: true });
  if (r || req.mode !== "navigate") return r;
  return (await caches.match("./index.html")) || caches.match("./");
}
const wacht = ms => new Promise(res => setTimeout(res, ms));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(req.url)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => goed(req, res) ? bewaar(req, res) : res)));
    return;
  }

  const navigatie = req.mode === "navigate";
  // Startpagina viel net terug op de bewaarde versie: dan de rest ook uit de bewaarde versie.
  if (!navigatie && Date.now() < bewaardTot) {
    e.respondWith(uitBewaard(req).then(r => r || fetch(req)));
    return;
  }

  const vers = eigen(req.url) ? fetch(req.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(req);   // niet de 10 minuten oude kopie van de browser
  const netwerk = vers.then(res => { if (!goed(req, res)) throw new Error("geen goed antwoord"); return bewaar(req, res); });
  e.waitUntil(netwerk.catch(() => {}));   // op de achtergrond doorladen, voor de volgende keer

  e.respondWith((async () => {
    const bewaard = await uitBewaard(req);
    if (!bewaard) return netwerk.catch(() => Response.error());
    const snel = await Promise.race([netwerk.catch(() => null), wacht(WACHT).then(() => null)]);
    if (snel) { if (navigatie) bewaardTot = 0; return snel; }
    if (navigatie) bewaardTot = Date.now() + BEWAARD_MODUS;
    return bewaard;
  })());
});
