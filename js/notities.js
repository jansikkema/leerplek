/* notities.js – aantekeningen in de les.
   Per vak, met pagina's om op te schrijven (Pencil), een foto van het bord als achtergrond,
   een tekstvak om te typen of in te spreken, en een lijstje 'snap ik nog niet'.
   Alles wordt automatisch bewaard op het apparaat. */
(function () {
  const { $, $$, esc, store, db, modal, go } = App;
  const STANDAARD_VAKKEN = ["Economie", "Geschiedenis", "Nederlands", "Engels", "Frans", "Duits", "Aardrijkskunde", "Biologie", "Wiskunde", "Natuurkunde", "Scheikunde"];
  const PAPIER = [["lijnen", "📄 Lijntjes"], ["ruitjes", "🔲 Ruitjes"], ["stippen", "⠿ Stippen"], ["wit", "⬜ Leeg"]];
  const vakken = () => store.get("vakken", STANDAARD_VAKKEN);
  const datumKort = t => new Date(t).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });

  /* ===== lijst ===== */
  App.addRoute("notities", el => {
    let filter = store.get("notitie-filter", "alle");
    el.innerHTML = `
      <div class="row" style="justify-content:space-between;margin-bottom:12px">
        <h1 style="margin:0">📒 Aantekeningen</h1>
        <button class="btn" id="nieuw">＋ Nieuwe aantekening</button>
      </div>
      <div class="row" id="filter" style="margin-bottom:14px"></div>
      <div id="vragen"></div>
      <div class="gallery" id="lijst"><div class="empty">Laden…</div></div>`;
    $("#nieuw", el).onclick = nieuw;

    async function show() {
      const all = await db.all("notities");
      const gebruikt = [...new Set(all.map(n => n.vak))];
      $("#filter", el).innerHTML = ["alle", ...gebruikt].map(v => `<button class="chip ${v === filter ? "sel" : ""}" data-f="${esc(v)}">${v === "alle" ? "Alles" : esc(v)}</button>`).join("");
      $$("#filter .chip", el).forEach(b => b.onclick = () => { filter = b.dataset.f; store.set("notitie-filter", filter); show(); });
      const list = all.filter(n => filter === "alle" || n.vak === filter);
      const open = list.filter(n => (n.vragen || "").trim());
      $("#vragen", el).innerHTML = open.length ? `<div class="card" style="padding:16px 18px"><b>❓ Snap ik nog niet</b>
        ${open.map(n => `<div class="vraag-rij" data-id="${n.id}"><span class="soft">${esc(n.vak)} · ${esc(n.titel)}</span><br>${esc(n.vragen.trim()).replace(/\n/g, "<br>")}</div>`).join("")}</div>` : "";
      $$(".vraag-rij", el).forEach(r => r.onclick = () => openNote(r.dataset.id, "vragen"));
      const g = $("#lijst", el);
      if (!list.length) { g.innerHTML = `<div class="empty" style="grid-column:1/-1">Nog geen aantekeningen. Tik op <b>＋ Nieuwe aantekening</b> aan het begin van de les.</div>`; return; }
      g.innerHTML = list.map(n => `<button class="thumb" data-id="${n.id}">
        ${n.thumb ? `<img src="${n.thumb}" alt="">` : `<div class="thumb-leeg">📄</div>`}
        <div class="cap"><b>${esc(n.vak)}</b> · ${esc(n.titel)}${(n.vragen || "").trim() ? " ❓" : ""}
        <small>${datumKort(n.datum)} · ${n.paginas.length} ${n.paginas.length === 1 ? "pagina" : "pagina's"}</small></div></button>`).join("");
      $$(".thumb", g).forEach(b => b.onclick = () => openNote(b.dataset.id));
    }

    async function nieuw() {
      let vak = filter !== "alle" ? filter : (store.get("laatste-vak", vakken()[0]));
      let papier = store.get("laatste-papier", "lijnen");
      let stand = innerWidth > innerHeight ? "liggend" : "staand";
      const p = modal(`<h2>Nieuwe aantekening</h2>
        <p style="margin-bottom:6px"><b>Vak</b></p>
        <div class="row" id="m-vak">${vakken().map(v => `<button class="chip ${v === vak ? "sel" : ""}" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div>
        <input type="text" id="m-ander" placeholder="Ander vak? Typ het hier" style="margin-top:8px">
        <p style="margin:14px 0 6px"><b>Papier</b></p>
        <div class="row" id="m-pap">${PAPIER.map(([id, n]) => `<button class="chip ${id === papier ? "sel" : ""}" data-p="${id}">${n}</button>`).join("")}</div>
        <div class="row" id="m-stand" style="margin-top:8px">${[["staand", "▯ Staand"], ["liggend", "▭ Liggend"]].map(([id, n]) => `<button class="chip ${id === stand ? "sel" : ""}" data-s="${id}">${n}</button>`).join("")}</div>
        <p style="margin:14px 0 6px"><b>Onderwerp</b> <span class="soft">(mag leeg)</span></p>
        <input type="text" id="m-titel" placeholder="Bijvoorbeeld: hoofdstuk 4, de SWOT">`,
        [["Annuleer", null, "ghost"], ["Start ✏️", "ok"]]);
      $$("#m-vak .chip").forEach(b => b.onclick = () => { vak = b.dataset.v; $("#m-ander").value = ""; $$("#m-vak .chip").forEach(x => x.classList.toggle("sel", x === b)); });
      $$("#m-pap .chip").forEach(b => b.onclick = () => { papier = b.dataset.p; $$("#m-pap .chip").forEach(x => x.classList.toggle("sel", x === b)); });
      $$("#m-stand .chip").forEach(b => b.onclick = () => { stand = b.dataset.s; $$("#m-stand .chip").forEach(x => x.classList.toggle("sel", x === b)); });
      const r = await p; if (r !== "ok") return;
      const ander = $("#m-ander").value.trim();
      if (ander) { vak = ander; if (!vakken().includes(ander)) store.set("vakken", [...vakken(), ander]); }
      const titel = $("#m-titel").value.trim() || datumKort(Date.now());
      store.set("laatste-vak", vak); store.set("laatste-papier", papier);
      const n = { id: "n" + Date.now(), vak, titel, datum: Date.now(), bewerkt: Date.now(), papier, aspect: stand === "liggend" ? 0.75 : 1.3, paginas: [{ strokes: [], foto: null }], tekst: "", vragen: "", thumb: null };
      await db.put("notities", n);
      openNote(n.id);
    }
    show();
  });

  function openNote(id, tab) { store.set("open-notitie", id); store.set("notitie-tab", tab || "schrijven"); go("notitie"); }

  /* ===== één aantekening ===== */
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
      el.innerHTML = `
        <div class="note-head">
          <div class="row" style="margin-bottom:10px">
            <span class="chip sel" style="cursor:default">${esc(note.vak)}</span>
            <input type="text" id="titel" class="titel-in" value="${esc(note.titel)}" aria-label="Onderwerp">
            <span class="soft" style="font-size:.85em">${datumKort(note.datum)}</span>
            <button class="chip" id="weg" aria-label="Aantekening weggooien">🗑️</button>
          </div>
          <div class="row" id="tabs" style="margin-bottom:12px">
            <button class="chip" data-t="schrijven">✏️ Schrijven</button>
            <button class="chip" data-t="typen">⌨️ Typen of inspreken</button>
            <button class="chip" data-t="vragen">❓ Snap ik niet<span id="vbadge"></span></button>
          </div>
        </div>
        <div id="pane"></div>`;
      $("#titel", el).oninput = e => { note.titel = e.target.value; saveSoon(); };
      $("#weg", el).onclick = async () => {
        const ok = await modal(`<h2>Weggooien?</h2><p>Deze aantekening (${note.paginas.length} ${note.paginas.length === 1 ? "pagina" : "pagina's"}) is dan echt weg.</p>`, [["Nee", false, "ghost"], ["Ja, weg", true]]);
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
        aspect: note.aspect || 1.3, papier: note.papier, foto: p.foto, strokes: p.strokes, onChange: saveSoon,
        extraHtml: `
          <button class="dtool sq" data-p="prev" aria-label="Vorige pagina">◀</button>
          <span class="pagenr">${pageIdx + 1}/${note.paginas.length}</span>
          <button class="dtool sq" data-p="next" aria-label="Volgende pagina">▶</button>
          <button class="dtool" data-p="add">＋<span class="tl">Pagina</span></button>
          <button class="dtool" data-p="foto" aria-label="Foto van het bord">📷<span class="tl">Bord</span></button>
          <button class="dtool" data-p="share" aria-label="Pagina delen">📤</button>
          <input type="file" accept="image/*" capture="environment" id="fotoin" hidden>`
      });
      const h = ui.host;
      h.querySelector('[data-p="prev"]').disabled = pageIdx === 0;
      h.querySelector('[data-p="next"]').disabled = pageIdx >= note.paginas.length - 1;
      h.querySelector('[data-p="prev"]').onclick = async () => { await saveNow(); pageIdx--; showTab(); };
      h.querySelector('[data-p="next"]').onclick = async () => { await saveNow(); pageIdx++; showTab(); };
      h.querySelector('[data-p="add"]').onclick = async () => { await saveNow(); note.paginas.push({ strokes: [], foto: null }); pageIdx = note.paginas.length - 1; await saveNow(); showTab(); ui.doek.flash("＋ Nieuwe pagina"); };
      h.querySelector('[data-p="share"]').onclick = () => App.shareImage(ui.doek.toImage(1400), `${note.vak} ${note.titel} p${pageIdx + 1}`);
      const fin = h.querySelector("#fotoin");
      h.querySelector('[data-p="foto"]').onclick = async () => {
        if (note.paginas[pageIdx].foto) {
          const k = await modal("<h2>Foto van het bord</h2><p>Deze pagina heeft al een foto.</p>", [["Annuleer", null, "ghost"], ["🗑️ Foto weg", "weg", "ghost"], ["📷 Nieuwe foto", "nieuw"]]);
          if (k === "weg") { note.paginas[pageIdx].foto = null; ui.doek.setFoto(null); saveSoon(); return; }
          if (k !== "nieuw") return;
        }
        fin.click();
      };
      fin.onchange = async e => {
        const f = e.target.files[0]; if (!f) return;
        const data = await App.imageFromFile(f, 1800);
        note.paginas[pageIdx].foto = data; ui.doek.setFoto(data); saveSoon();
        ui.doek.flash("📷 Schrijf erop!");
        fin.value = "";
      };
    }
  });
})();
