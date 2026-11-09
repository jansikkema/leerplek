// Inhoudstest voor een hoofdstuk met sommen (L.stappen) en/of toetsvragen (L.toets).
// Vraagt aan het hoofdstuk: _test: { OEFEN, VRAGEN } in App.addModule (zie wiskunde-h1.js).
// Gebruik (vanuit de map van de repository, server op 8123):
//   node .claude/skills/leerplek-hoofdstuk/test-oefenen.js <module-id> [aantal sommen per soort, standaard 400]
// Doet drie dingen:
//  1. per soort som veel nieuwe sommen maken: geen NaN/undefined in de tekst, elk vakje een geldig getal;
//  2. van elke soort de ronde 'Samen' via het scherm invullen met de goede antwoorden: elke stap moet ✓ geven;
//  3. alle toetsvragen beantwoorden via het scherm (rekenen: het goede getal, keuze: de goede knop).
const { chromium, devices } = require("playwright");
const BASIS = process.env.LP_URL || "http://localhost:8123/";
const [, , MOD, N = "400"] = process.argv;
if (!MOD) { console.log("Gebruik: node test-oefenen.js <module-id> [aantal]"); process.exit(1); }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ ...devices["iPad (gen 7)"] }); const p = await ctx.newPage();
  const fouten = []; p.on("pageerror", e => fouten.push(e.message));
  await p.goto(BASIS + "#start"); await p.waitForTimeout(600);
  const heeft = await p.evaluate(m => { const T = (App.module(m) || {})._test || {}; return { oefen: !!T.OEFEN, vragen: !!T.VRAGEN }; }, MOD);

  // 1. generators
  if (heeft.oefen) {
    const r = await p.evaluate(([m, n]) => {
      const T = App.module(m)._test, W = App.Leer.waarde, uit = []; let tel = 0;
      for (const [id, cfg] of Object.entries(T.OEFEN)) for (const S of (cfg.soorten || [cfg])) {
        const lijst = [S.voorbeeld, S.samen]; for (let i = 0; i < n; i++) lijst.push(S.maak());
        for (const q of lijst) {
          tel++;
          const tekst = q.vraag + " " + q.stappen.map(s => s.wat + " " + s.regel + " " + (s.hint || "")).join(" ") + " " + (q.slot || "");
          if (/NaN|undefined|Infinity|null|\[object/.test(tekst)) uit.push(`${id}/${S.naam}: rare tekst: ${tekst.slice(0, 120)}`);
          for (const st of q.stappen) for (const mm of st.regel.matchAll(/\[([^\]]+)\]/g)) {
            const v = mm[1]; if (v === "<" || v === ">" || v.includes("|")) continue;
            if (!isFinite(W(v.replace(/^\+/, "")))) uit.push(`${id}/${S.naam}: vakje ${v} in ${st.regel}`);
          }
        }
      }
      return { tel, uit };
    }, [MOD, +N]);
    console.log(`1. ${r.tel} sommen gemaakt, ${r.uit.length} fouten`); r.uit.slice(0, 10).forEach(x => console.log("   " + x));
    if (r.uit.length) fouten.push("generators");

    // 2. Samen-rondes via het scherm
    const ids = await p.evaluate(m => Object.keys(App.module(m)._test.OEFEN), MOD);
    let rondes = 0, mis = 0;
    for (const id of ids) {
      const n = await p.evaluate(([m, id]) => (App.module(m)._test.OEFEN[id].soorten || [1]).length, [MOD, id]);
      for (let s = 0; s < n; s++) {
        await p.goto(BASIS + "#start"); await p.goto(BASIS + `#${MOD}-${id}`); await p.waitForTimeout(300);
        if (n > 1) await p.click(`[data-s="${s}"]`);
        await p.click('[data-r="1"]'); await p.waitForTimeout(100);
        const stappen = await p.evaluate(([m, id, s]) => { const c = App.module(m)._test.OEFEN[id]; return (c.soorten ? c.soorten[s] : c).samen.stappen.map(x => ({ wat: x.wat, vak: [...x.regel.matchAll(/\[([^\]]+)\]/g)].map(mm => mm[1]) })); }, [MOD, id, s]);
        for (let i = 0; i < stappen.length; i++) {
          const tr = (await p.$$(".trede"))[i]; if (!tr) break;
          if (!(await tr.$(".chk"))) continue;
          const st = stappen[i];
          for (const k of await tr.$$("[data-n]")) if ((await k.getAttribute("data-n")) === st.wat) await k.click();
          let vi = 0, ki = 0; const ins = await tr.$$(".vak-in"), kz = await tr.$$(".teken-kies");
          for (const v of st.vak) {
            if (v === "<" || v === ">" || v.includes("|")) { const g = v.includes("|") ? v.split("|").find(x => x.startsWith("*")).slice(1) : v; for (const bt of await kz[ki].$$("[data-t]")) if ((await bt.getAttribute("data-t")) === g) await bt.click(); ki++; }
            else { await ins[vi].fill(v.replace(/^\+/, "").replace("-", "−")); vi++; }
          }
          await (await tr.$(".chk")).click(); await p.waitForTimeout(60);
          if (!(await tr.$(".goed-t"))) { mis++; console.log(`   FOUT ${id} soort ${s} stap ${i + 1}: ${(await tr.innerText()).replace(/\s+/g, " ").slice(0, 160)}`); }
        }
        if (!(await p.$("#eind .reken-eind"))) { mis++; console.log(`   GEEN EIND ${id} soort ${s}`); }
        rondes++;
      }
    }
    console.log(`2. ${rondes} Samen-rondes via het scherm, ${mis} fouten`); if (mis) fouten.push("samen");
  }

  // 3. toetsvragen
  if (heeft.vragen) {
    const V = await p.evaluate(m => App.module(m)._test.VRAGEN.map(q => ({ id: q.id, vraag: q.vraag, type: q.type, antwoord: q.antwoord, goed: q.goed })), MOD);
    const gezien = new Set(); let mis = 0;
    for (let ronde = 0; ronde < 12 && gezien.size < V.length; ronde++) {
      await p.goto(BASIS + "#start"); await p.goto(BASIS + `#${MOD}-toets`); await p.waitForTimeout(300);
      const go = await p.$("#go") || await p.$("#toch"); if (!go) break; await go.click(); await p.waitForTimeout(200);
      for (let k = 0; k < 8; k++) {
        const t = await p.$(".tvraag .vraag"); if (!t) break;
        const tekst = (await t.innerText()).replace(/\s+/g, " ").trim();
        const q = V.find(x => tekst === x.vraag.replace(/\*\*/g, "").replace(/\s+/g, " ")); if (!q) { console.log("   onbekende vraag:", tekst.slice(0, 60)); break; }
        gezien.add(q.id);
        if (q.type === "reken") {
          const ants = [].concat(q.antwoord);
          for (let i = 0; i < ants.length; i++) { const a = ants[i], s = Number.isInteger(a) ? String(a) : Number.isInteger(a * 3) ? `${a * 3}/3` : String(a).replace(".", ","); await p.fill(`.ant[data-i="${i}"]`, s.replace("-", "−")); }
          await p.click("#chk"); await p.waitForTimeout(50);
          if (!(await p.$(".model.goed"))) { mis++; console.log("   FOUT reken", q.id); }
          await p.click("#vd");
        } else if (q.type === "keuze") {
          await p.click(`.keuze[data-i="${q.goed}"]`); await p.waitForTimeout(40);
          if (!(await p.$(".model.goed"))) { mis++; console.log("   FOUT keuze", q.id); }
          await p.click("#vd");
        } else { await p.click("#zie"); await p.click('[data-o="ken"]'); }
        await p.waitForTimeout(60);
      }
    }
    console.log(`3. ${gezien.size} van ${V.length} toetsvragen beantwoord, ${mis} fouten`); if (mis || gezien.size < V.length) fouten.push("toets");
  }
  if (!heeft.oefen && !heeft.vragen) console.log("Dit hoofdstuk heeft geen _test: { OEFEN, VRAGEN }. Niets getest.");
  await b.close();
  if (fouten.length) { console.log("FOUTEN:", fouten.join(", ")); process.exit(1); }
  console.log("Alles goed.");
})();
