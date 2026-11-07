// Rooktest in iPad-formaat: opent elk onderdeel van elke module en meldt fouten.
// Gebruik (vanuit de map van de repository):
//   python3 -m http.server 8123 >/dev/null 2>&1 &
//   node .claude/skills/leerplek-hoofdstuk/test-ipad.js [module-id] [map-voor-schermafdrukken]
// Zonder module-id worden alle modules getest. Schermafdrukken alleen als je een map opgeeft.
const { chromium, devices } = require("playwright");
const fs = require("fs");
const BASIS = process.env.LP_URL || "http://localhost:8123/";
const [, , alleen, map] = process.argv;

(async () => {
  const browser = await chromium.launch();
  const fouten = [], letop = new Set();
  for (const [toestel, stand] of [["iPad (gen 7)", "staand"], ["iPad (gen 7) landscape", "liggend"]]) {
    const ctx = await browser.newContext({ ...devices[toestel] });
    const page = await ctx.newPage();
    page.on("pageerror", e => fouten.push(`${stand} ${page.url()}: ${e.message}`));
    page.on("console", m => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) fouten.push(`${stand} console: ${m.text()}`); });
    await page.goto(BASIS + "#start");
    await page.waitForSelector(".tiles");
    const routes = await page.evaluate(() => [...document.querySelectorAll("[data-go]")].map(b => b.dataset.go));
    const mods = await page.evaluate(() => [...new Set([...document.querySelectorAll(".tile [data-go]")].map(b => b.dataset.go.split("-").slice(0, -1).join("-")).filter(Boolean))]);
    const doel = alleen ? [alleen] : mods;
    for (const m of doel) {
      await page.goto(BASIS + "#" + m + "-overzicht").catch(() => {});
      const delen = await page.evaluate(m => [...document.querySelectorAll(".mod-nav [data-go]")].map(b => b.dataset.go), m);
      if (!delen.length) fouten.push(`${stand}: module ${m} niet gevonden`);
      for (const r of delen) {
        await page.goto(BASIS + "#" + r); await page.waitForTimeout(250);
        const breed = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
        if (breed) fouten.push(`${stand} #${r}: pagina is breder dan het scherm`);
        const leeg = await page.evaluate(() => !document.querySelector("#mod")?.children.length);
        if (leeg) fouten.push(`${stand} #${r}: onderdeel is leeg`);
        const lees = await page.evaluate(() => !!document.querySelector("#mod .say, #mod .say-mini, #mod #cplay, #mod #play"));
        if (!lees) letop.add(`#${r}: geen voorleesknop zichtbaar bij openen`);
        if (map) { fs.mkdirSync(map, { recursive: true }); await page.screenshot({ path: `${map}/${stand}-${r}.png`, fullPage: true }); }
      }
    }
    await ctx.close();
  }
  await browser.close();
  if (letop.size) console.log("LET OP (controleer met de hand):\n" + [...letop].join("\n"));
  if (fouten.length) { console.log("FOUTEN:\n" + fouten.join("\n")); process.exit(1); }
  console.log("Alles geopend zonder fouten (staand en liggend).");
})();
