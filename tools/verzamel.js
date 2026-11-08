// Verzamel alle teksten die de app voorleest, door elk scherm automatisch door te klikken.
// Gebruik: start eerst een server in de hoofdmap (python3 -m http.server 8765), dan:
//   node tools/verzamel.js [routes...]  > tools/teksten.json
// Zonder routes: alle schermen van de app en van elk hoofdstuk.
// Uitvoer: [{ tekst, stem, sleutel, waar }] zonder dubbele. tools/maak-audio.py spreekt ze in.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8765/";
// Per soort scherm: welke knoppen eerst (eerst voorlezen, dan verder). Anders willekeurig.
const VOORKEUR = {
  sorteren: ["#sverder", ".say-mini", ".s-bak"],
  begrippen: [".say", "#lees", "#lees-menu", "#flip", "#draai", "[data-o]", "#ok", "#check", ".kaart-tegel", "#terug"],
  toets: [".say", "#lees", "#tip", "#zie", "#chk", "[data-i]", "[data-o]", "#vd", "#opn"],
  chat: ["#cnext", ".bubble", ".say", "#sverder", ".say-mini", ".s-bak"],
  plaat: [".say", "#sverder", ".say-mini", ".s-bak"]
};
const NIET = /tekenen|teken\b|Ga tekenen|wissen|verwijder|back-up|terugzetten|deel|stuur|instellingen/i;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 820, height: 1180 } });
  p.on("pageerror", e => console.error("fout:", e.message));
  await p.addInitScript(() => {
    window.__opname = [];
    localStorage.setItem("lp-auto-voorlezen", "true");
    // In de testbrowser praat niets; laat elke uitspraak meteen 'klaar' zijn, zodat afspelen doorloopt.
    if (window.speechSynthesis) speechSynthesis.speak = u => setTimeout(() => u.onend && u.onend(), 5);
  });
  await p.goto(BASIS); await p.waitForTimeout(800);
  let routes = process.argv.slice(2);
  if (!routes.length) {
    routes = ["start", "mijn-app", "ideeen", "tekeningen"];   // niet "nieuw": die teksten veranderen bij elke versie
    const mods = await p.evaluate(() => [...document.querySelectorAll("[data-go]")].map(x => x.dataset.go));
    for (const m of new Set(mods.filter(m => m !== "nieuw"))) { await p.goto(BASIS + "#" + m); await p.waitForTimeout(400);
      routes.push(m, ...await p.evaluate(() => [...document.querySelectorAll(".mod-nav [data-go]")].map(x => x.dataset.go))); }
    routes = [...new Set(routes)];
  }
  const alles = new Map();
  for (const r of routes) for (let ronde = 0; ronde < 3; ronde++) {
    await p.goto(BASIS + "#" + r); await p.waitForTimeout(500);
    await p.evaluate(() => { window.__opname = []; });
    const gedaan = new Set();
    for (let stap = 0; stap < 800; stap++) {
      const voorkeur = Object.entries(VOORKEUR).find(([k]) => r.endsWith(k));
      const knop = await p.evaluate(({ niet, gedaan, voorkeur }) => {
        const nietRe = new RegExp(niet, "i");
        const ks = [...document.querySelectorAll("#view button, .modal button, [role=dialog] button, #view .chip, #view [data-i]")]
          .filter(k => k.offsetParent && !k.disabled && !k.closest(".mod-nav") && !k.dataset.go && !nietRe.test(k.textContent));
        const t = document.querySelector("#view").textContent; let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
        const sig = k => (k.id || "") + "|" + k.className.replace(/\b(sel|goed|hint|flits|speaking)\b/g, "") + "|" + k.textContent.trim().slice(0, 60) + "|" + h;
        const nieuw = ks.filter(k => !gedaan.includes(sig(k)));
        let k = null;
        for (const sel of voorkeur || []) { k = nieuw.find(x => x.matches(sel) || x.closest(sel)); if (k) break; }
        if (!k) k = nieuw[Math.floor(Math.random() * nieuw.length)]; if (!k) return null;
        const s = sig(k); k.click(); return s;   // direct klikken: Playwright wacht anders tot 1,5 s per knop
      }, { niet: NIET.source, gedaan: [...gedaan], voorkeur: voorkeur && voorkeur[1] });
      if (!knop) break;
      gedaan.add(knop);
      await p.waitForTimeout(40);
      if (!(await p.evaluate(() => location.hash)).includes(r)) { await p.goto(BASIS + "#" + r); await p.waitForTimeout(300); }
    }
    for (const o of await p.evaluate(() => window.__opname)) if (!alles.has(o.sleutel)) alles.set(o.sleutel, { ...o, waar: r });
    console.error(r, ronde, "→", alles.size, "teksten");
  }
  process.stdout.write(JSON.stringify([...alles.values()], null, 1));
  await b.close();
})();
