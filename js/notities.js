/* notities.js – 'Mijn vakken': alles voor school per vak.
   Soorten: ✏️ aantekening (zelf geschreven), 📷 huiswerk (gefotografeerd, met 'af op'-datum),
   📄 document (van de iPad: foto's, plaatjes en PDF's uit andere apps).
   Elk item heeft pagina's; op elke pagina kan ze met de Pencil schrijven, ook op een foto of PDF.
   Alles wordt automatisch bewaard op het apparaat. */
(function () {
  const { $, $$, esc, store, db, modal, go } = App;
  const STANDAARD_VAKKEN = ["Economie", "Geschiedenis", "Nederlands", "Engels", "Frans", "Duits", "Aardrijkskunde", "Biologie", "Wiskunde", "Natuurkunde", "Scheikunde"];
  const PAPIER = [["lijnen", "📄 Lijntjes"], ["ruitjes", "🔲 Ruitjes"], ["stippen", "⠿ Stippen"], ["wit", "⬜ Leeg"]];
  const SOORT = { aantekening: ["✏️", "Aantekening", "Aantekeningen"], huiswerk: ["📷", "Huiswerk", "Huiswerk"], document: ["📄", "Document", "Documenten"] };
  const vakken = () => store.get("vakken", STANDAARD_VAKKEN);
  const datumKort = t => new Date(t).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
  const soortVan = n => n.soort || "aantekening";
  const MAX_PDF = 40;

  /* ===== beelden verwerken ===== */
  function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
  function scanLook(ctx, w, h) {
    // Maakt een foto van papier lichter en scherper: wit wordt wit, inkt wordt donker. Kleuren blijven.
    const d = ctx.getImageData(0, 0, w, h), a = d.data, hist = new Uint32Array(256);
    for (let i = 0; i < a.length; i += 16) hist[(a[i] * 0.299 + a[i + 1] * 0.587 + a[i + 2] * 0.114) | 0]++;
    const tot = hist.reduce((x, y) => x + y, 0); let lo = 0, hi = 255, c = 0;
    for (let i = 0; i < 256; i++) { c += hist[i]; if (c > tot * 0.02) { lo = i; break; } }
    c = 0; for (let i = 255; i >= 0; i--) { c += hist[i]; if (c > tot * 0.25) { hi = i; break; } }
    if (hi - lo < 40) return;
    const f = 255 / (hi - lo);
    for (let i = 0; i < a.length; i += 4) for (let j = 0; j < 3; j++) a[i + j] = Math.max(0, Math.min(255, (a[i + j] - lo) * f));
    ctx.putImageData(d, 0, 0);
  }
  async function processImage(file, { scan = false, max = 1800 } = {}) {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImg(url);
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      if (scan) scanLook(x, c.width, c.height);
      return { data: c.toDataURL("image/jpeg", 0.82), aspect: c.height / c.width };
    } finally { URL.revokeObjectURL(url); }
  }
  async function rotateData(data) {
    const img = await loadImg(data);
    const c = document.createElement("canvas"); c.width = img.height; c.height = img.width;
    const x = c.getContext("2d"); x.translate(c.width, 0); x.rotate(Math.PI / 2); x.drawImage(img, 0, 0);
    return { data: c.toDataURL("image/jpeg", 0.85), aspect: c.height / c.width };
  }
  let pdfReady = null;
  function loadPdfJs() {
    if (pdfReady) return pdfReady;
    pdfReady = new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = "vendor/pdfjs/pdf.min.js";
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs/pdf.worker.min.js"; res(window.pdfjsLib); };
      s.onerror = () => { pdfReady = null; rej(new Error("PDF-lezer kon niet laden")); };
      document.head.appendChild(s);
    });
    return pdfReady;
  }
  async function processPdf(file, onPage) {
    const lib = await loadPdfJs();
    const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    const n = Math.min(pdf.numPages, MAX_PDF), out = [];
    for (let i = 1; i <= n; i++) {
      onPage && onPage(i, n);
      const page = await pdf.getPage(i);
      const v1 = page.getViewport({ scale: 1 }), scale = 1600 / v1.width, vp = page.getViewport({ scale });
      const c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: x, viewport: vp }).promise;
      out.push({ data: c.toDataURL("image/jpeg", 0.82), aspect: c.height / c.width });
    }
    return { pages: out, afgekapt: pdf.numPages > MAX_PDF, totaal: pdf.numPages };
  }
  async function filesToPages(files) {
    const pages = []; let melding = "";
    const list = [...files];
    for (let f = 0; f < list.length; f++) {
      const file = list[f];
      const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      if (isPdf) {
        App.busy(`PDF lezen…`);
        const r = await processPdf(file, (i, n) => App.busy(`PDF lezen… pagina ${i} van ${n}`));
        pages.push(...r.pages);
        if (r.afgekapt) melding = `Deze PDF heeft ${r.totaal} pagina's. De eerste ${MAX_PDF} zijn toegevoegd.`;
      } else if (/^image\//.test(file.type) || /\.(jpe?g|png|heic|gif|webp)$/i.test(file.name)) {
        App.busy(`Afbeelding ${f + 1} van ${list.length}…`);
        try { pages.push(await processImage(file)); } catch (e) { melding = `“${file.name}” kon ik niet openen.`; }
      } else melding = `“${file.name}” is geen foto of PDF. Bewaar het in de andere app als PDF of afbeelding.`;
    }
    App.busy(false);
    return { pages: pages.map(p => ({ strokes: [], foto: p.data, aspect: p.aspect })), melding };
  }

  /* ===== venster: vak, naam en extra's kiezen ===== */
  async function itemModal(kop, opt = {}) {
    let vak = opt.vak || store.get("laatste-vak", vakken()[0]);
    let papier = store.get("laatste-papier", "lijnen");
    let stand = innerWidth > innerHeight ? "liggend" : "staand";
    const p = modal(`<h2>${kop}</h2>
      <p style="margin-bottom:6px"><b>Vak</b></p>
      <div class="row" id="m-vak">${vakken().map(v => `<button class="chip ${v === vak ? "sel" : ""}" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div>
      <input type="text" id="m-ander" placeholder="Ander vak? Typ het hier" style="margin-top:8px">
      ${opt.papier ? `<p style="margin:14px 0 6px"><b>Papier</b></p>
        <div class="row" id="m-pap">${PAPIER.map(([id, n]) => `<button class="chip ${id === papier ? "sel" : ""}" data-p="${id}">${n}</button>`).join("")}</div>
        <div class="row" id="m-stand" style="margin-top:8px">${[["staand", "▯ Staand"], ["liggend", "▭ Liggend"]].map(([id, n]) => `<button class="chip ${id === stand ? "sel" : ""}" data-s="${id}">${n}</button>`).join("")}</div>` : ""}
      <p style="margin:14px 0 6px"><b>${opt.huiswerk ? "Wat is het?" : "Onderwerp"}</b> <span class="soft">(mag leeg)</span></p>
      <input type="text" id="m-titel" value="${esc(opt.titel || "")}" placeholder="${opt.huiswerk ? "Bijvoorbeeld: opdrachten 4.1 t/m 4.5" : "Bijvoorbeeld: hoofdstuk 4"}">
      ${opt.huiswerk ? `<p style="margin:14px 0 6px"><b>Af op</b> <span class="soft">(mag leeg)</span></p><input type="date" id="m-af" class="date-in">` : ""}
      ${opt.info ? `<p class="soft" style="margin-top:12px;font-size:.85em">${opt.info}</p>` : ""}`,
      [["Annuleer", null, "ghost"], [opt.knop || "Bewaar", "ok"]]);
    $$("#m-vak .chip").forEach(b => b.onclick = () => { vak = b.dataset.v; $("#m-ander").value = ""; $$("#m-vak .chip").forEach(x => x.classList.toggle("sel", x === b)); });
    $$("#m-pap .chip").forEach(b => b.onclick = () => { papier = b.dataset.p; $$("#m-pap .chip").forEach(x => x.classList.toggle("sel", x === b)); });
    $$("#m-stand .chip").forEach(b => b.onclick = () => { stand = b.dataset.s; $$("#m-stand .chip").forEach(x => x.classList.toggle("sel", x === b)); });
    const r = await p; if (r !== "ok") return null;
    const ander = $("#m-ander").value.trim();
    if (ander) { vak = ander; if (!vakken().includes(ander)) store.set("vakken", [...vakken(), ander]); }
    store.set("laatste-vak", vak); if (opt.papier) store.set("laatste-papier", papier);
    const af = $("#m-af") && $("#m-af").value ? new Date($("#m-af").value + "T12:00:00").getTime() : null;
    return { vak, titel: $("#m-titel").value.trim(), papier, aspect: stand === "liggend" ? 0.75 : 1.3, af };
  }
  function nieuwItem(soort, k, pages) {
    return { id: "n" + Date.now(), soort, vak: k.vak, titel: k.titel || datumKort(Date.now()), datum: Date.now(), bewerkt: Date.now(),
      papier: soort === "aantekening" ? k.papier : "wit", aspect: k.aspect || 1.3, af: k.af || null, klaar: false,
      paginas: pages && pages.length ? pages : [{ strokes: [], foto: null }], tekst: "", vragen: "", thumb: pages && pages.length ? pages[0].foto : null };
  }

  /* ===== huiswerk fotograferen (één of meer foto's) ===== */
  async function huiswerkFlow(eersteFile) {
    const scan = store.get("scanlook", true);
    App.busy("Foto verwerken…");
    const pages = [await processImage(eersteFile, { scan })];
    App.busy(false);
    while (true) {
      const p = modal(`<h2>📷 Huiswerk</h2>
        <div class="foto-strip">${pages.map(x => `<img src="${x.data}" alt="">`).join("")}</div>
        <p>${pages.length} ${pages.length === 1 ? "foto" : "foto's"}. Nog een bladzijde?</p>
        <label class="row" style="font-size:.9em"><input type="checkbox" id="m-scan" ${scan ? "checked" : ""}> Scan-look (papier lichter, tekst scherper)</label>`,
        [["Annuleer", null, "ghost"], ["Klaar ✓", "klaar"]]);
      const lbl = document.createElement("label"); lbl.className = "btn ghost"; lbl.innerHTML = `📷 Nog een foto<input type="file" accept="image/*" capture="environment" hidden>`;
      $("#modal-btns").insertBefore(lbl, $("#modal-btns").lastElementChild);
      $("#m-scan").onchange = e => store.set("scanlook", e.target.checked);
      const extra = new Promise(res => lbl.querySelector("input").onchange = e => { $("#modal").hidden = true; res(e.target.files[0]); });
      const r = await Promise.race([p, extra]);
      if (r === null) return;
      if (r === "klaar") break;
      if (r instanceof File) { App.busy("Foto verwerken…"); pages.push(await processImage(r, { scan: store.get("scanlook", true) })); App.busy(false); }
    }
    const k = await itemModal("Huiswerk bewaren", { huiswerk: true, knop: "Bewaar" });
    if (!k) return;
    const n = nieuwItem("huiswerk", k, pages.map(p => ({ strokes: [], foto: p.data, aspect: p.aspect })));
    await db.put("notities", n); openNote(n.id);
  }

  /* ===== van de iPad: foto's, plaatjes, PDF's ===== */
  async function importFlow(files) {
    let res;
    try { res = await filesToPages(files); } catch (e) { App.busy(false); await modal(`<h2>Dat lukte niet</h2><p>${esc(e.message || "Het bestand kon niet worden gelezen.")}</p>`, [["Oké", true]]); return; }
    if (!res.pages.length) { await modal(`<h2>Niks toegevoegd</h2><p>${esc(res.melding || "Kies een foto of PDF.")}</p>`, [["Oké", true]]); return; }
    const naam = files[0].name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 60);
    const k = await itemModal(`📥 ${res.pages.length} ${res.pages.length === 1 ? "pagina" : "pagina's"} toevoegen`,
      { titel: /^(IMG|image|photo)\s?\d*/i.test(naam) ? "" : naam, info: res.melding ? esc(res.melding) : "Je kunt straks met je Pencil op elke pagina schrijven." });
    if (!k) return;
    const n = nieuwItem("document", k, res.pages);
    await db.put("notities", n); openNote(n.id);
  }

  /* ===== overzicht ===== */
  App.addRoute("notities", el => {
    let filter = store.get("notitie-filter", "alle"), sfilter = store.get("soort-filter", "alle");
    el.innerHTML = `
      <div class="row" style="justify-content:space-between;margin-bottom:12px">
        <h1 style="margin:0">📚 Mijn vakken</h1>
        <div class="row">
          <button class="btn" id="nieuw">✏️ Aantekening</button>
          <label class="btn ghost">📷 Huiswerk<input type="file" accept="image/*" capture="environment" id="cam" hidden></label>
          <label class="btn ghost">📥 Van iPad<input type="file" accept="image/*,application/pdf,.pdf" multiple id="imp" hidden></label>
        </div>
      </div>
      <div class="row" id="filter" style="margin-bottom:8px"></div>
      <div class="row" id="sfilter" style="margin-bottom:14px"></div>
      <div id="vragen"></div>
      <div class="gallery" id="lijst"><div class="empty">Laden…</div></div>
      <p class="soft" style="font-size:.8em;margin-top:18px">💡 Iets uit een andere app? Kies daar <b>Deel → Bewaar in Bestanden</b> (als PDF of afbeelding), en voeg het hier toe met <b>📥 Van iPad</b>. Een scan maken kan ook in de app Bestanden: tik op ⋯ → <b>Scan documenten</b>.</p>`;
    $("#nieuw", el).onclick = async () => {
      const k = await itemModal("✏️ Nieuwe aantekening", { papier: true, knop: "Start ✏️", vak: filter !== "alle" ? filter : undefined });
      if (!k) return; const n = nieuwItem("aantekening", k); await db.put("notities", n); openNote(n.id);
    };
    $("#cam", el).onchange = e => { const f = e.target.files[0]; e.target.value = ""; if (f) huiswerkFlow(f); };
    $("#imp", el).onchange = e => { const fs = [...e.target.files]; e.target.value = ""; if (fs.length) importFlow(fs); };

    async function show() {
      const all = await db.all("notities");
      const gebruikt = [...new Set(all.map(n => n.vak))];
      $("#filter", el).innerHTML = ["alle", ...gebruikt].map(v => `<button class="chip ${v === filter ? "sel" : ""}" data-f="${esc(v)}">${v === "alle" ? "Alle vakken" : esc(v)}</button>`).join("");
      $("#sfilter", el).innerHTML = ["alle", ...Object.keys(SOORT)].map(s => `<button class="chip small ${s === sfilter ? "sel" : ""}" data-s="${s}">${s === "alle" ? "Alles" : SOORT[s][0] + " " + SOORT[s][2]}</button>`).join("");
      $$("#filter .chip", el).forEach(b => b.onclick = () => { filter = b.dataset.f; store.set("notitie-filter", filter); show(); });
      $$("#sfilter .chip", el).forEach(b => b.onclick = () => { sfilter = b.dataset.s; store.set("soort-filter", sfilter); show(); });
      const list = all.filter(n => (filter === "alle" || n.vak === filter) && (sfilter === "alle" || soortVan(n) === sfilter));
      const open = list.filter(n => (n.vragen || "").trim());
      $("#vragen", el).innerHTML = open.length ? `<div class="card" style="padding:16px 18px"><b>❓ Snap ik nog niet</b>
        ${open.map(n => `<div class="vraag-rij" data-id="${n.id}"><span class="soft">${esc(n.vak)} · ${esc(n.titel)}</span><br>${esc(n.vragen.trim()).replace(/\n/g, "<br>")}</div>`).join("")}</div>` : "";
      $$(".vraag-rij", el).forEach(r => r.onclick = () => openNote(r.dataset.id, "vragen"));
      const g = $("#lijst", el);
      if (!list.length) { g.innerHTML = `<div class="empty" style="grid-column:1/-1">Nog niks hier. Maak een aantekening, fotografeer je huiswerk, of voeg iets toe van je iPad.</div>`; return; }
      g.innerHTML = list.map(n => {
        const s = SOORT[soortVan(n)];
        const af = n.af ? `<span class="af ${n.klaar ? "klaar" : (n.af < Date.now() ? "laat" : "")}">${n.klaar ? "✅ klaar" : "af " + datumKort(n.af)}</span>` : "";
        return `<button class="thumb" data-id="${n.id}">
          ${n.thumb ? `<img src="${n.thumb}" alt="">` : `<div class="thumb-leeg">${s[0]}</div>`}
          <div class="cap">${s[0]} <b>${esc(n.vak)}</b> · ${esc(n.titel)}${(n.vragen || "").trim() ? " ❓" : ""}
          <small>${datumKort(n.datum)} · ${n.paginas.length} ${n.paginas.length === 1 ? "pagina" : "pagina's"} ${af}</small></div></button>`;
      }).join("");
      $$(".thumb", g).forEach(b => b.onclick = () => openNote(b.dataset.id));
    }
    show();
  });

  function openNote(id, tab) { store.set("open-notitie", id); store.set("notitie-tab", tab || "schrijven"); go("notitie"); }

  /* ===== één item ===== */
  App.addRoute("notitie", el => {
    el.innerHTML = `<div class="empty">Laden…</div>`;
    let note = null, pageIdx = 0, ui = null, saveT = null, alive = true;
    let tab = store.get("notitie-tab", "schrijven");

    async function saveNow() {
      clearTimeout(saveT); saveT = null; if (!note) return;
      if (ui && tab === "schrijven") {
        note.paginas[pageIdx].strokes = ui.doek.getStrokes();
        if (pageIdx === 0) note.thumb = ui.doek.toImage(480);
      }
      note.bewerkt = Date.now();
      await db.put("notities", note);
    }
    const saveSoon = () => { clearTimeout(saveT); saveT = setTimeout(saveNow, 700); };
    const flush = () => { if (saveT || ui) saveNow(); };
    document.addEventListener("lp-bewaar", flush);
    App.onLeave(() => { alive = false; document.removeEventListener("lp-bewaar", flush); saveNow(); if (ui) ui.destroy(); });

    (async () => {
      note = await db.get("notities", store.get("open-notitie", ""));
      if (!alive) return;
      if (!note) { go("notities"); return; }
      const s = SOORT[soortVan(note)];
      el.innerHTML = `
        <div class="note-head">
          <div class="row" style="margin-bottom:10px">
            <span class="chip sel" style="cursor:default">${s[0]} ${esc(note.vak)}</span>
            <input type="text" id="titel" class="titel-in" value="${esc(note.titel)}" aria-label="Onderwerp">
            ${soortVan(note) === "huiswerk" ? `<input type="date" id="af" class="date-in" value="${note.af ? new Date(note.af).toISOString().slice(0, 10) : ""}" aria-label="Af op">
              <button class="chip ${note.klaar ? "sel" : ""}" id="klaar">✅ Klaar</button>` : `<span class="soft" style="font-size:.85em">${datumKort(note.datum)}</span>`}
            <button class="chip" id="weg" aria-label="Weggooien">🗑️</button>
          </div>
          <div class="row" id="tabs" style="margin-bottom:12px">
            <button class="chip" data-t="schrijven">✏️ Schrijven</button>
            <button class="chip" data-t="typen">⌨️ Typen of inspreken</button>
            <button class="chip" data-t="vragen">❓ Snap ik niet<span id="vbadge"></span></button>
          </div>
        </div>
        <div id="pane"></div>`;
      $("#titel", el).oninput = e => { note.titel = e.target.value; saveSoon(); };
      if ($("#af", el)) $("#af", el).onchange = e => { note.af = e.target.value ? new Date(e.target.value + "T12:00:00").getTime() : null; saveSoon(); };
      if ($("#klaar", el)) $("#klaar", el).onclick = e => { note.klaar = !note.klaar; e.target.classList.toggle("sel", note.klaar); if (note.klaar && ui) ui.doek.flash("🎉 Goed gedaan!"); saveSoon(); };
      $("#weg", el).onclick = async () => {
        const ok = await modal(`<h2>Weggooien?</h2><p>Dit (${note.paginas.length} ${note.paginas.length === 1 ? "pagina" : "pagina's"}) is dan echt weg.</p>`, [["Nee", false, "ghost"], ["Ja, weg", true]]);
        if (!ok) return;
        const id = note.id; note = null; if (ui) { ui.destroy(); ui = null; }
        await db.del("notities", id); go("notities");
      };
      $$("#tabs .chip", el).forEach(b => b.onclick = async () => { await saveNow(); tab = b.dataset.t; store.set("notitie-tab", tab); showTab(); });
      showTab();
    })();

    function badge() { const b = $("#vbadge", el); if (b) b.textContent = (note.vragen || "").trim() ? " •" : ""; }

    function showTab() {
      $$("#tabs .chip", el).forEach(b => b.classList.toggle("sel", b.dataset.t === tab));
      badge();
      if (ui) { ui.destroy(); ui = null; }
      const pane = $("#pane", el);
      if (tab === "schrijven") return schrijven(pane);
      if (tab === "typen") {
        pane.innerHTML = `<div class="card">
          <div class="row" style="justify-content:space-between;margin-bottom:8px">
            <p style="margin:0">🎤 Tik op de <b>microfoon</b> op je toetsenbord om in te spreken.</p>
            <button class="say" data-label="🔊 Lees mijn tekst voor" style="margin:0">🔊 Lees mijn tekst voor</button>
          </div>
          <textarea id="tekst" class="groot" placeholder="Typ of spreek hier je aantekeningen in. Spelling maakt niks uit.">${esc(note.tekst || "")}</textarea></div>`;
        const t = $("#tekst", pane);
        t.oninput = () => { note.tekst = t.value; saveSoon(); };
        App.sayButton($(".say", pane), () => t.value);
        return;
      }
      pane.innerHTML = `<div class="card">
        <h2>❓ Wat snap ik nog niet?</h2>
        <p class="soft">Schrijf het op. Dan kun je het later vragen aan je docent, of samen met papa uitzoeken.</p>
        <textarea id="vr" class="groot" placeholder="Bijvoorbeeld: wat is het verschil tussen brutowinst en nettowinst?">${esc(note.vragen || "")}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn small" id="stuur">📤 Stuur naar papa</button><span class="ok" id="ok"></span></div></div>`;
      const v = $("#vr", pane);
      v.oninput = () => { note.vragen = v.value; badge(); saveSoon(); };
      $("#stuur", pane).onclick = async () => { if (!v.value.trim()) return; const r = await App.shareText("Snap ik niet", `${note.vak} – ${note.titel}\nSnap ik nog niet:\n${v.value.trim()}`); $("#ok", pane).textContent = r ? "✓ " + r : ""; };
    }

    function schrijven(pane) {
      const p = note.paginas[pageIdx];
      pane.innerHTML = `<div id="studio"></div>`;
      ui = Studio($("#studio", pane), {
        aspect: p.aspect || note.aspect || 1.3, papier: note.papier, foto: p.foto, strokes: p.strokes, onChange: saveSoon,
        extraHtml: `
          <button class="dtool sq" data-p="prev" aria-label="Vorige pagina">◀</button>
          <span class="pagenr">${pageIdx + 1}/${note.paginas.length}</span>
          <button class="dtool sq" data-p="next" aria-label="Volgende pagina">▶</button>
          <button class="dtool" data-p="add" aria-label="Pagina toevoegen">＋<span class="tl">Pagina</span></button>
          <button class="dtool" data-p="meer" aria-label="Meer">⋯</button>
          <input type="file" accept="image/*" capture="environment" id="camin" hidden>
          <input type="file" accept="image/*,application/pdf,.pdf" multiple id="impin" hidden>`
      });
      const h = ui.host;
      h.querySelector('[data-p="prev"]').disabled = pageIdx === 0;
      h.querySelector('[data-p="next"]').disabled = pageIdx >= note.paginas.length - 1;
      h.querySelector('[data-p="prev"]').onclick = async () => { await saveNow(); pageIdx--; showTab(); };
      h.querySelector('[data-p="next"]').onclick = async () => { await saveNow(); pageIdx++; showTab(); };
      h.querySelector('[data-p="add"]').onclick = async () => {
        await saveNow();
        note.paginas.splice(pageIdx + 1, 0, { strokes: [], foto: null, aspect: soortVan(note) === "aantekening" ? null : 1.3 });
        pageIdx++; await saveNow(); showTab(); ui.doek.flash("＋ Nieuwe pagina");
      };
      const cam = h.querySelector("#camin"), imp = h.querySelector("#impin");
      h.querySelector('[data-p="meer"]').onclick = async () => {
        const heeftFoto = !!note.paginas[pageIdx].foto, leeg = !note.paginas[pageIdx].strokes.length && ui.doek.isEmpty();
        const p = modal(`<h2>Pagina ${pageIdx + 1}</h2><div class="menu-lijst">
            <label class="btn ghost">📷 Foto maken als nieuwe pagina<input type="file" accept="image/*" capture="environment" hidden data-m="cam"></label>
            <label class="btn ghost">📥 Pagina's van iPad toevoegen<input type="file" accept="image/*,application/pdf,.pdf" multiple hidden data-m="imp"></label>
            ${heeftFoto && leeg ? `<button class="btn ghost" data-m="draai">↻ Foto draaien</button>` : ""}
            <button class="btn ghost" data-m="share">📤 Deze pagina delen of bewaren</button>
            ${note.paginas.length > 1 ? `<button class="btn ghost" data-m="del">🗑️ Deze pagina weggooien</button>` : ""}
          </div>`, [["Sluit", null, "ghost"]]);
        const kies = new Promise(res => {
          $$("#modal-body [data-m]").forEach(b => {
            if (b.tagName === "INPUT") b.onchange = e => { $("#modal").hidden = true; res({ m: b.dataset.m, files: [...e.target.files] }); };
            else b.onclick = () => { $("#modal").hidden = true; res({ m: b.dataset.m }); };
          });
        });
        const r = await Promise.race([p, kies]); if (!r) return;
        if (r.m === "share") App.shareImage(ui.doek.toImage(1600), `${note.vak} ${note.titel} p${pageIdx + 1}`);
        if (r.m === "draai") { App.busy("Draaien…"); const d = await rotateData(note.paginas[pageIdx].foto); App.busy(false); Object.assign(note.paginas[pageIdx], { foto: d.data, aspect: d.aspect }); if (pageIdx === 0) note.thumb = d.data; await saveNow(); showTab(); }
        if (r.m === "del") {
          const ok = await modal(`<h2>Pagina ${pageIdx + 1} weggooien?</h2>`, [["Nee", false, "ghost"], ["Ja, weg", true]]);
          if (!ok) return; note.paginas.splice(pageIdx, 1); pageIdx = Math.max(0, pageIdx - 1); ui.destroy(); ui = null; await saveNow(); showTab();
        }
        if ((r.m === "cam" || r.m === "imp") && r.files.length) {
          await saveNow();
          let nieuw;
          if (r.m === "cam") { App.busy("Foto verwerken…"); const d = await processImage(r.files[0], { scan: store.get("scanlook", true) }); App.busy(false); nieuw = [{ strokes: [], foto: d.data, aspect: d.aspect }]; }
          else { const res = await filesToPages(r.files); nieuw = res.pages; if (res.melding) await modal(`<p>${esc(res.melding)}</p>`, [["Oké", true]]); }
          if (!nieuw.length) return;
          note.paginas.splice(pageIdx + 1, 0, ...nieuw); pageIdx++;
          if (ui) { ui.destroy(); ui = null; }
          await db.put("notities", note); showTab(); ui.doek.flash(`＋ ${nieuw.length} ${nieuw.length === 1 ? "pagina" : "pagina's"}`);
        }
      };
    }
  });

  /* ===== voor het beginscherm: huiswerk dat binnenkort af moet ===== */
  App.binnenkort = async function () {
    const all = await db.all("notities");
    const grens = Date.now() + 8 * 864e5;
    return all.filter(n => soortVan(n) === "huiswerk" && n.af && !n.klaar && n.af < grens).sort((a, b) => a.af - b.af);
  };
  App.openNote = openNote;
  App.huiswerkFoto = huiswerkFlow;
})();
