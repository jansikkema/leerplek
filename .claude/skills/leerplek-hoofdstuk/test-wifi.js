// Test van sw.js bij goede wifi, geen wifi, trage wifi (15 s), wifi met inlogpagina en een storing (503).
// Gebruik vanuit de map van de repository: node .claude/skills/leerplek-hoofdstuk/test-wifi.js
// Verwacht: overal "app werkt", trage wifi na ongeveer 3 s, de rest binnen een seconde.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = process.cwd();
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" };
let modus = "goed";
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  const stuur = () => {
    const f = path.join(ROOT, p === "/" ? "/index.html" : p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end("niet gevonden"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); res.end(fs.readFileSync(f));
  };
  if (p === "/sw.js" || modus === "goed") return stuur();
  if (modus === "traag") return setTimeout(stuur, 15000);
  if (modus === "portaal") { res.writeHead(302, { Location: "http://127.0.0.1:8125/inloggen" }); return res.end(); }
  if (modus === "fout") { res.writeHead(503); return res.end("storing"); }
});
const portaal = http.createServer((req, res) => { res.writeHead(200, { "Content-Type": "text/html" }); res.end("<h1>Log in op de schoolwifi</h1>"); });

(async () => {
  await new Promise(r => server.listen(8124, r)); await new Promise(r => portaal.listen(8125, r));
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices["iPad (gen 7)"] });
  const p = await ctx.newPage();
  const U = "http://localhost:8124/";
  await p.goto(U + "#start");
  await p.evaluate(() => navigator.serviceWorker.register("sw.js"));
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload(); await p.waitForSelector(".tiles");
  console.log("bestuurd door service worker:", await p.evaluate(() => !!navigator.serviceWorker.controller));
  const app = async () => (await p.$(".tiles")) && (await p.textContent(".hello h1"));

  for (const [naam, zet] of [
    ["geen wifi", async () => ctx.setOffline(true)],
    ["trage wifi (15 s)", async () => { await ctx.setOffline(false); modus = "traag"; }],
    ["wifi met inlogpagina", async () => { modus = "portaal"; }],
    ["storing (503)", async () => { modus = "fout"; }],
    ["weer goede wifi", async () => { modus = "goed"; }]
  ]) {
    await zet();
    const t = Date.now();
    await p.goto(U + "?n=" + Date.now() + "#economie-h4-overzicht", { timeout: 30000 }).catch(e => console.log("  laadfout:", e.message.split("\n")[0]));
    const ok = await p.waitForSelector("#mod .ov-kop", { timeout: 20000 }).then(() => true).catch(() => false);
    const portal = await p.evaluate(() => document.body.innerText.includes("Log in op de schoolwifi")).catch(() => false);
    console.log(`${naam}: app ${ok ? "werkt" : "WERKT NIET"}${portal ? ", INLOGPAGINA ZICHTBAAR" : ""}, na ${((Date.now() - t) / 1000).toFixed(1)} s`);
  }
  await b.close(); server.close(); portaal.close();
  process.exit(0);
})();
