/* Proef: een tekening uit Procreate in de app halen en vergelijken met een schets (2026-11-10).
   Drie manieren om de tekening binnen te halen: plakken, slepen (Split View) en kiezen uit Foto's/Bestanden.
   Doel: op haar iPad uitzoeken welke manier werkt en welke zij het fijnst vindt. Daarna wordt de beste
   manier een bouwsteen in leren.js en kan deze proef weg. De tekening blijft op de iPad (alleen bewaard als zij dat kiest). */
(() => {
  const { $, $$, esc } = App;
  const OPDRACHT = "Teken het kruitvat met vier lonten. Schrijf bij elke lont een oorzaak. Wat is de vonk?";
  // De voorbeeldschets, in delen. Elk deel wordt bij 'Stap voor stap' getekend en voorgelezen.
  const DELEN = [
    { zeg: "Het vat. Europa rond 1900 is een kruitvat.", svg: `<path d="M150 210 q60 -14 120 0 l-8 110 q-52 12 -104 0z"/><path d="M154 240 q56 10 112 0"/><path d="M158 292 q52 10 104 0"/><text x="168" y="272">Europa 1900</text>` },
    { zeg: "Lont één: nationalisme.", svg: `<path d="M168 212 q-40 -60 -110 -80"/><text x="8" y="118">🚩 nationalisme</text>` },
    { zeg: "Lont twee: imperialisme.", svg: `<path d="M196 206 q-14 -70 -50 -130"/><text x="40" y="62">🌍 imperialisme</text>` },
    { zeg: "Lont drie: militarisme.", svg: `<path d="M226 206 q14 -70 50 -130"/><text x="250" y="62">⚔️ militarisme</text>` },
    { zeg: "Lont vier: bondgenootschappen.", svg: `<path d="M254 212 q40 -60 110 -80"/><text x="300" y="118">🤝 bondgenoten</text>` },
    { zeg: "En de vonk: de moord in Sarajevo, in 1914.", svg: `<path class="pp-rood" d="M330 300 l-30 -10 l14 -8 l-34 -12"/><text class="pp-rood" x="290" y="352">⚡ Sarajevo 1914</text>` }
  ];
  const uitkomst = [];   // wat er tijdens de proef gebeurde, voor papa
  const log = (manier, ok, extra) => { uitkomst.push(`${manier}: ${ok ? "gelukt" : "niet gelukt"}${extra ? " (" + extra + ")" : ""}`); toonLog(); };
  let el, tekening = null;

  function toonLog() {
    const l = $("#pp-log", el); if (!l) return;
    l.innerHTML = uitkomst.length ? uitkomst.map(u => `<li>${esc(u)}</li>`).join("") : `<li class="soft">Nog niets geprobeerd.</li>`;
  }

  async function binnen(blob, manier) {
    try {
      const ruw = await maat(blob);
      tekening = await App.imageFromFile(blob, 1600);   // witte achtergrond (Procreate kopieert doorzichtig) en kleiner gemaakt
      log(manier, true, ruw);
      vergelijk();
    } catch (e) { log(manier, false, "geen afbeelding"); }
  }
  function maat(blob) {
    return new Promise(res => { const i = new Image(), u = URL.createObjectURL(blob); i.onload = () => { URL.revokeObjectURL(u); res(`${i.width}×${i.height}`); }; i.onerror = () => res("?"); i.src = u; });
  }

  /* ---------- 1. plakken ---------- */
  async function plak() {
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        for (const it of items) {
          const type = it.types.find(t => t.startsWith("image/"));
          if (type) return binnen(await it.getType(type), "Plakken");
        }
        log("Plakken", false, "er stond geen tekening op het klembord");
        return;
      } catch (e) { /* geweigerd of niet mogelijk: dan via het plakvak */ }
    }
    $("#pp-plakvak", el).hidden = false;
    $("#pp-plakvak", el).focus();
  }
  function plakVak(ev) {
    const f = [...(ev.clipboardData?.items || [])].find(i => i.type.startsWith("image/"));
    ev.preventDefault();
    if (f) binnen(f.getAsFile(), "Plakken (lang drukken)"); else log("Plakken (lang drukken)", false, "geen tekening op het klembord");
  }

  /* ---------- 2. slepen ---------- */
  function slepen(zone) {
    ["dragenter", "dragover"].forEach(t => zone.addEventListener(t, e => { e.preventDefault(); zone.classList.add("pp-boven"); }));
    zone.addEventListener("dragleave", () => zone.classList.remove("pp-boven"));
    zone.addEventListener("drop", e => {
      e.preventDefault(); zone.classList.remove("pp-boven");
      const dt = e.dataTransfer;
      const f = [...(dt.files || [])].find(x => x.type.startsWith("image/")) || [...(dt.items || [])].map(i => i.kind === "file" ? i.getAsFile() : null).find(x => x && x.type.startsWith("image/"));
      if (f) binnen(f, "Slepen"); else log("Slepen", false, `er kwam geen afbeelding mee (${[...(dt.types || [])].join(", ") || "leeg"})`);
    });
  }

  /* ---------- vergelijken ---------- */
  function schets(n, nieuw = true) {   // de eerste n delen; met nieuw: het laatste deel wordt getekend
    return `<svg class="pp-schets" viewBox="0 0 470 370" role="img" aria-label="Voorbeeldschets van het kruitvat">
      ${DELEN.slice(0, n).map((d, i) => `<g class="${nieuw && i === n - 1 ? "pp-nieuw" : ""}">${d.svg}</g>`).join("")}</svg>`;
  }
  function vergelijk() {
    const v = $("#pp-vergelijk", el); v.hidden = false;
    v.innerHTML = `
      <h2>🔍 Vergelijk</h2>
      <div class="pp-naast">
        <figure><figcaption class="soft">Jouw tekening</figcaption><img src="${tekening}" alt="Jouw tekening" class="pp-zoom"></figure>
        <figure><figcaption class="soft">Zo kan het ook</figcaption><div class="pp-zoom" id="pp-model">${schets(DELEN.length, false)}</div></figure>
      </div>
      <p class="soft" style="font-size:.85em">Tik op een plaatje om het groot te zien.</p>
      <div class="row"><button class="btn" id="pp-stap">▶ Stap voor stap vergelijken</button><button class="btn ghost" id="pp-bewaar">💾 Bewaar in Mijn tekeningen</button><span class="ok" id="pp-ok"></span></div>
      <div id="pp-stappen"></div>`;
    $$(".pp-zoom", v).forEach(z => z.onclick = () => v.querySelector(".pp-naast").classList.toggle("pp-groot"));
    $("#pp-stap", v).onclick = () => stap(0, 0);
    $("#pp-bewaar", v).onclick = async () => {
      await App.db.put("tekeningen", { id: "t" + Date.now(), datum: Date.now(), titel: "Uit Procreate: het kruitvat", tag: "procreate", data: tekening, aspect: 0.75 });
      $("#pp-ok", v).textContent = "✓ Bewaard";
    };
    v.scrollIntoView({ behavior: "smooth" });
  }
  function stap(i, had) {
    const s = $("#pp-stappen", el);
    if (i >= DELEN.length) {
      $("#pp-model", el).innerHTML = schets(DELEN.length, false);
      s.innerHTML = `<p class="pp-eind">Je had ${had} van de ${DELEN.length} delen 💜</p>`;
      App.speak(`Je had ${had} van de ${DELEN.length} delen.`, null, { audio: null });
      log("Stap voor stap", true, `${had} van ${DELEN.length} 👍`);
      return;
    }
    $("#pp-model", el).innerHTML = schets(i + 1);
    s.innerHTML = `<p><b>Deel ${i + 1} van ${DELEN.length}</b> · Had jij dit ook?</p>
      <div class="row"><button class="btn" data-h="1">👍 Had ik</button><button class="btn ghost" data-h="0">👎 Nog niet</button><button class="say-mini" id="pp-nog" aria-label="Nog eens voorlezen">🔊</button></div>`;
    App.speak(DELEN[i].zeg, null, { audio: null });
    $("#pp-nog", s).onclick = () => App.speak(DELEN[i].zeg, null, { audio: null });
    $$("[data-h]", s).forEach(b => b.onclick = () => stap(i + 1, had + +b.dataset.h));
  }

  App.addRoute("proef-procreate", root => {
    el = root;
    root.innerHTML = `
      <style>
        .pp-manier{display:grid;gap:8px;background:var(--card2);border-radius:16px;padding:14px;margin-top:12px}
        .pp-manier h3{margin:0}
        .pp-manier ol{margin:0;padding-left:22px}
        .pp-vak{border:3px dashed var(--line);border-radius:16px;min-height:120px;display:grid;place-items:center;text-align:center;padding:14px;color:var(--soft)}
        .pp-vak[hidden]{display:none}
        .pp-vak.pp-boven{border-color:var(--accent);background:var(--tint)}
        .pp-naast{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .pp-naast.pp-groot{grid-template-columns:1fr}
        .pp-naast figure{margin:0;display:grid;gap:6px;min-width:0}
        .pp-naast img,.pp-naast .pp-zoom{width:100%;background:#fff;border-radius:12px;cursor:zoom-in}
        .pp-schets{display:block;width:100%;height:auto}
        .pp-schets path{fill:none;stroke:#2a2240;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round}
        .pp-schets text{fill:#2a2240;font:700 17px "Atkinson Hyperlegible",sans-serif}
        .pp-schets .pp-rood{stroke:#d23c3c;fill:none}
        .pp-schets text.pp-rood{fill:#d23c3c;stroke:none}
        .pp-schets .pp-nieuw path{stroke:#7a55e0;stroke-dasharray:1;stroke-dashoffset:1;animation:pp-teken 1.6s ease forwards}
        .pp-schets .pp-nieuw text{fill:#7a55e0;opacity:0;animation:pp-toon .4s 1.2s forwards}
        @keyframes pp-teken{to{stroke-dashoffset:0}}
        @keyframes pp-toon{to{opacity:1}}
        @media (prefers-reduced-motion: reduce){.pp-schets .pp-nieuw path,.pp-schets .pp-nieuw text{animation:none;stroke-dashoffset:0;opacity:1}}
        .pp-eind{font-size:1.2em;font-weight:700}
      </style>
      <div class="card">
        <h1>🧪 Proef: tekenen in Procreate</h1>
        <button class="say" id="pp-lees">🔊 Lees voor</button>
        <p>Teken in Procreate. Haal je tekening hierheen. Probeer de drie manieren: welke is het fijnst?</p>
        <div class="opdracht-strook"><span class="op-ic">✏️</span><div class="op-t">${esc(OPDRACHT)}</div></div>
      </div>
      <div class="card">
        <div class="pp-manier">
          <h3>1 · 📋 Plakken</h3>
          <ol><li>In Procreate: veeg met <b>drie vingers omlaag</b>.</li><li>Tik op <b>Kopieer</b>.</li><li>Kom terug en tik hier:</li></ol>
          <div class="row"><button class="btn" id="pp-plak">📋 Plak mijn tekening</button></div>
          <div class="pp-vak" id="pp-plakvak" contenteditable="true" hidden>Houd je vinger hier en kies <b>Plak</b>.</div>
        </div>
        <div class="pp-manier">
          <h3>2 · ✋ Slepen</h3>
          <ol><li>Zet Procreate en deze app <b>naast elkaar</b> (Split View).</li><li>Houd je tekening vast in de galerij van Procreate.</li><li>Sleep hem in dit vak:</li></ol>
          <div class="pp-vak" id="pp-sleepvak">⬇️ Laat je tekening hier los</div>
        </div>
        <div class="pp-manier">
          <h3>3 · 🖼️ Uit Foto's of Bestanden</h3>
          <ol><li>In Procreate: <b>Deel → JPEG → Bewaar afbeelding</b>.</li><li>Tik hier en kies je tekening:</li></ol>
          <div class="row"><label class="btn">🖼️ Kies mijn tekening<input type="file" accept="image/*" id="pp-kies" hidden></label></div>
        </div>
      </div>
      <div class="card" id="pp-vergelijk" hidden></div>
      <div class="card">
        <h2>📝 Uitkomst (voor papa)</h2>
        <ul id="pp-log"></ul>
        <p style="margin:12px 0 6px"><b>Welke manier vond je het fijnst?</b></p>
        <div class="row" id="pp-fijn">${["📋 Plakken", "✋ Slepen", "🖼️ Foto's"].map(m => `<button class="chip" data-m="${m}">${m}</button>`).join("")}</div>
        <div class="row" style="margin-top:12px"><button class="btn ghost" id="pp-stuur">📤 Stuur uitkomst</button><span class="ok" id="pp-gestuurd"></span></div>
      </div>`;
    App.sayButton($("#pp-lees", root), () => "Proef: tekenen in Procreate. Teken in Procreate. Haal je tekening hierheen. Probeer de drie manieren: welke is het fijnst? De opdracht: " + OPDRACHT, { audio: null });
    $("#pp-plak", root).onclick = plak;
    $("#pp-plakvak", root).addEventListener("paste", plakVak);
    slepen($("#pp-sleepvak", root));
    $("#pp-kies", root).onchange = e => { const f = e.target.files[0]; if (f) binnen(f, "Foto's/Bestanden"); e.target.value = ""; };
    let fijnst = "";
    $$("#pp-fijn .chip", root).forEach(c => c.onclick = () => { fijnst = c.dataset.m; $$("#pp-fijn .chip", root).forEach(x => x.classList.toggle("sel", x === c)); });
    $("#pp-stuur", root).onclick = async () => {
      const r = await App.shareText("Proef Procreate", ["Proef Procreate", ...uitkomst, "Fijnst: " + (fijnst || "-"), navigator.userAgent].join("\n"));
      $("#pp-gestuurd", root).textContent = r ? "✓ " + r : "";
    };
    toonLog();
  });
})();
