// Meet de leesbaarheid van elk scherm in iPad-formaat: woorden, regellengte, kleine tekst, laag contrast, kleine knoppen.
// Gebruik: start eerst een server in de hoofdmap (python3 -m http.server 8123), dan:
//   node tools/meet-leesbaarheid.js [thema...]        (standaard: nacht zacht)
// Uitvoer: totalen per thema en de schermen die het meest opvallen. Eerste meting (2026-11-12): zie ANALYSE.md.
// Let op: dit is een testbrowser, niet haar iPad. Regellengte is een schatting (breedte gedeeld door een halve letterhoogte).
const { chromium, devices } = require("playwright");
const BASIS = process.env.LP_URL || "http://localhost:8123/";
const themas = process.argv.slice(2).length ? process.argv.slice(2) : ["nacht", "zacht"];

function meet() {
  const lum = c => { const a = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * a[0] + .7152 * a[1] + .0722 * a[2]; };
  const rgb = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(",").map(Number); return { c: p.slice(0, 3), a: p[3] === undefined ? 1 : p[3] }; };
  const meng = (v, a, o) => v.map((x, i) => x * a + o[i] * (1 - a));
  const achtergrond = el => {   // null bij een kleurverloop of plaatje: dan is contrast niet te bepalen
    const lagen = [];
    for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== "none") return null; const k = rgb(s.backgroundColor); if (k && k.a > 0) { lagen.push(k); if (k.a >= 1) break; } }
    let basis = [255, 255, 255]; for (const k of lagen.reverse()) basis = meng(k.c, k.a, basis); return basis;
  };
  const view = document.querySelector("#view");
  let klein = 0, laag = 0, regel = 0; const vb = [];
  const w = document.createTreeWalker(view, NodeFilter.SHOW_TEXT), gezien = new Set();
  while (w.nextNode()) {
    const t = w.currentNode.textContent.trim(); if (t.length < 3) continue;
    const el = w.currentNode.parentElement; if (!el || !el.offsetParent || gezien.has(el)) continue; gezien.add(el);
    const s = getComputedStyle(el), fs = parseFloat(s.fontSize);
    if (fs < 16) klein++;
    const b = achtergrond(el), f = rgb(s.color);
    if (b && f) {
      const fc = meng(f.c, f.a * parseFloat(s.opacity || 1), b), l1 = lum(fc), l2 = lum(b), cr = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
      const groot = fs >= 24 || (fs >= 18.66 && +s.fontWeight >= 700);
      if (cr < (groot ? 3 : 4.5)) { laag++; if (vb.length < 3) vb.push(`${cr.toFixed(1)}:1 ${String(el.className).slice(0, 20)} "${t.slice(0, 24)}"`); }
    }
    if (t.length > 60 && /^(P|DIV|LI|SPAN)$/.test(el.tagName)) regel = Math.max(regel, Math.round(Math.min(t.length, el.getBoundingClientRect().width / (fs * 0.5))));
  }
  let knop = 0;
  document.querySelectorAll("#view button, #view a, #view input, #view label.btn, header button").forEach(k => { if (!k.offsetParent) return; const r = k.getBoundingClientRect(); if (r.width < 44 || r.height < 44) knop++; });
  return { woorden: view.innerText.trim().split(/\s+/).length, schermen: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(1), klein, laag, regel, knop, vb };
}

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ ...devices["iPad (gen 7)"] })).newPage();
  await page.goto(BASIS + "#start"); await page.waitForSelector(".tiles");
  const routes = ["start", "mijn-app", "ideeen", "nieuw"];
  for (const m of await page.evaluate(() => App.modules.map(x => x.id))) routes.push(...await page.evaluate(m => App.routesVan(m), m));
  for (const thema of themas) {
    await page.evaluate(t => localStorage.setItem("lp-thema", JSON.stringify(t)), thema);
    const R = [];
    for (const r of routes) { await page.goto(BASIS + "#" + r); await page.reload(); await page.waitForTimeout(300); R.push({ r, ...(await page.evaluate(meet)) }); }
    const som = k => R.reduce((a, x) => a + x[k], 0), top = (k, n = 5) => R.slice().sort((a, b) => b[k] - a[k]).slice(0, n).map(x => `${x.r} (${x[k]})`).join(", ");
    console.log(`\n== Thema ${thema}: ${R.length} schermen ==`);
    console.log(`Tekst kleiner dan 16 px: ${som("klein")} · contrast te laag: ${som("laag")} · knoppen kleiner dan 44 px: ${som("knop")}`);
    console.log(`Langste regels (tekens, richtlijn 60-70): ${top("regel")}`);
    console.log(`Meeste woorden: ${top("woorden")}`);
    console.log(`Langste schermen (in schermhoogtes): ${top("schermen")}`);
    const vb = [...new Set(R.flatMap(x => x.vb))].slice(0, 8); if (vb.length) console.log("Voorbeelden laag contrast:\n  " + vb.join("\n  "));
  }
  await browser.close();
})();
