/* leerplek – de schil van de app.
   Inhoud per hoofdstuk staat in js/modules/*.js en meldt zich aan met App.addModule(...).
   Persoonlijke dingen (tekeningen, aantekeningen, ideeën, scores) blijven alleen op het apparaat. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Safari mag de pagina niet zelf inzoomen (we hebben A− / A+ en zoom in het tekendoek) ---------- */
  ["gesturestart", "gesturechange", "gestureend"].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));

  /* ---------- opslag ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lp-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("lp-" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const STORES = ["tekeningen", "notities"];
  const mem = { tekeningen: [], notities: [] };
  let dbp = null;
  function idb() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      if (!("indexedDB" in window)) return rej("geen idb");
      const r = indexedDB.open("leerplek", 2);
      r.onupgradeneeded = () => STORES.forEach(s => { if (!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s, { keyPath: "id" }); });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    dbp.catch(() => { dbp = null; });
    return dbp;
  }
  const db = {
    async all(store) {
      try { const d = await idb(); return await new Promise((res, rej) => {
        const q = d.transaction(store).objectStore(store).getAll(); q.onsuccess = () => res(q.result.sort((a, b) => b.datum - a.datum)); q.onerror = () => rej(q.error); });
      } catch (e) { return [...mem[store]].sort((a, b) => b.datum - a.datum); }
    },
    async get(store, id) {
      try { const d = await idb(); return await new Promise((res, rej) => {
        const q = d.transaction(store).objectStore(store).get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
      } catch (e) { return mem[store].find(x => x.id === id) || null; }
    },
    async put(store, item) {
      try { const d = await idb(); await new Promise((res, rej) => {
        const t = d.transaction(store, "readwrite"); t.objectStore(store).put(item); t.oncomplete = res; t.onerror = () => rej(t.error); });
      } catch (e) { const L = mem[store], i = L.findIndex(x => x.id === item.id); if (i >= 0) L[i] = item; else L.push(item); }
    },
    async del(store, id) {
      try { const d = await idb(); await new Promise((res, rej) => {
        const t = d.transaction(store, "readwrite"); t.objectStore(store).delete(id); t.oncomplete = res; t.onerror = () => rej(t.error); });
      } catch (e) { const L = mem[store], i = L.findIndex(x => x.id === id); if (i >= 0) L.splice(i, 1); }
    }
  };

  /* ---------- voorlezen ---------- */
  /* De iPad heeft basisstemmen (compact), betere stemmen (enhanced/premium, eerst downloaden)
     en robotstemmen (Eloquence: Eddy, Flo, Reed… en grapstemmen). We kiezen de beste, of de stem die zij koos. */
  const canSpeak = "speechSynthesis" in window;
  const GRAP = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/i;
  function stemKwaliteit(v) {
    const id = (v.voiceURI || "") + " " + v.name;
    if (/eloquence|speech\.synthesis\.voice\./i.test(id) || GRAP.test(v.name)) return 0;
    let q = /premium/i.test(id) ? 3 : /enhanced|verbeterd/i.test(id) ? 2 : 1;
    if (/^nl(-|_)NL/i.test(v.lang)) q += 0.5;
    return q;
  }
  function nlVoices() {
    if (!canSpeak) return [];
    return speechSynthesis.getVoices().filter(v => /^nl/i.test(v.lang)).sort((a, b) => stemKwaliteit(b) - stemKwaliteit(a));
  }
  let voice = null;
  function pickVoice() {
    if (!canSpeak) return;
    const vs = nlVoices(), keuze = store.get("stem", "");
    voice = vs.find(v => v.voiceURI === keuze) || vs[0] || null;
  }
  if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function stopSpeak() {
    if (canSpeak) speechSynthesis.cancel();
    $$(".say.speaking").forEach(b => { b.classList.remove("speaking"); b.textContent = b.dataset.label || "🔊 Lees voor"; });
  }

  /* Tekst omzetten naar iets wat een stem goed kan uitspreken: geen tekens, bedragen voluit, pauzes op de goede plek. */
  function spreekbaar(t) {
    return String(t || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\*\*/g, "")
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}①②③④⑤]/gu, "")
      .replace(/([−–-])\s?€\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{2}))?/g, (m, n, e, c) => `min ${e.replace(/\./g, "")} euro${c && c !== "00" ? " " + c : ""}`)
      .replace(/€\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{2}))?/g, (m, e, c) => `${e.replace(/\./g, "")} euro${c && c !== "00" ? " " + c : ""}`)
      .replace(/\b(\d{1,3})\.(\d{3})\b/g, "$1$2")
      .replace(/\s[×x]\s/g, " keer ").replace(/\s[−–-]\s/g, " min ").replace(/\s=\s/g, " is ").replace(/\s\+\s/g, " plus ").replace(/\s÷\s/g, " gedeeld door ")
      .replace(/§\s?(\d+)/g, "paragraaf $1").replace(/\bH(\d+)\b/g, "hoofdstuk $1").replace(/(\d)\s?%/g, "$1 procent")
      .replace(/\bbijv\./gi, "bijvoorbeeld").replace(/\bo\.a\./gi, "onder andere").replace(/\bd\.w\.z\./gi, "dat wil zeggen")
      .replace(/\s?\(\s?/g, ", ").replace(/\s?\)/g, ",")
      .replace(/\s?[·•→|]\s?/g, ". ").replace(/…/g, ".").replace(/[“”"]/g, "")
      .replace(/([a-zà-ÿ])\/([a-zà-ÿ])/gi, "$1 of $2")
      .replace(/\s*,\s*([.!?:])/g, "$1").replace(/([.!?])\s*[.,]+/g, "$1").replace(/,\s*,/g, ",")
      .replace(/\s+/g, " ").trim();
  }
  // Per zin voorlezen: dat geeft natuurlijke pauzes en de iPad raakt minder snel de draad kwijt bij lange teksten.
  function zinnen(t) { return (t.match(/[^.!?:;]+[.!?:;]*/g) || [t]).map(s => s.trim()).filter(s => /\w/.test(s)); }
  function speak(text, onend, opts = {}) {
    const delen = canSpeak && text ? zinnen(spreekbaar(text)) : [];
    if (!delen.length) { onend && onend(); return; }
    let klaar = false;
    const einde = () => { if (!klaar) { klaar = true; onend && onend(); } };
    const v = opts.voice || voice, rate = opts.rate || store.get("tempo", 0.95), pitch = opts.pitch || 1;
    delen.forEach((zin, i) => {
      const u = new SpeechSynthesisUtterance(zin);
      u.lang = v ? v.lang : "nl-NL"; if (v) u.voice = v; u.rate = rate; u.pitch = pitch;
      u.onerror = einde;
      if (i === delen.length - 1) u.onend = einde;
      try { speechSynthesis.speak(u); } catch (e) { einde(); }
    });
  }
  function sayButton(b, getText) {
    b.onclick = () => {
      if (!canSpeak) { b.textContent = "🔇 Voorlezen werkt hier niet"; return; }
      const was = b.classList.contains("speaking"); stopSpeak(); if (was) return;
      b.classList.add("speaking"); b.textContent = "⏹️ Stop";
      speak(getText(), () => { b.classList.remove("speaking"); b.textContent = b.dataset.label || "🔊 Lees voor"; });
    };
  }
  function bindSay(root) { $$(".say[data-say]", root).forEach(b => sayButton(b, () => b.dataset.say)); }

  /* ---------- venstertje (in plaats van alert/confirm) ---------- */
  function modal(html, buttons) {
    return new Promise(res => {
      $("#modal-body").innerHTML = html;
      $("#modal-btns").innerHTML = "";
      buttons.forEach(([label, val, cls]) => {
        const b = document.createElement("button");
        b.className = "btn " + (cls || ""); b.textContent = label;
        b.onclick = () => { const inp = $("#modal-body input[type=text]"); $("#modal").hidden = true; res(val === "__input" ? (inp ? inp.value : "") : val); };
        $("#modal-btns").appendChild(b);
      });
      $("#modal").hidden = false;
    });
  }

  /* ---------- delen ---------- */
  async function shareText(title, text) {
    if (navigator.share) { try { await navigator.share({ title, text }); return "gedeeld"; } catch (e) { if (e && e.name === "AbortError") return ""; } }
    try { await navigator.clipboard.writeText(text); return "gekopieerd"; } catch (e) {}
    const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); t.remove(); return "gekopieerd"; } catch (e) { t.remove(); return ""; }
  }
  function dataUrlToFile(dataUrl, name) {
    const [head, b64] = dataUrl.split(","); const mime = head.match(/:(.*?);/)[1];
    const bin = atob(b64); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new File([arr], name, { type: mime });
  }
  async function shareImage(dataUrl, titel) {
    const file = dataUrlToFile(dataUrl, (titel || "tekening").replace(/[^\w\- ]/g, "").trim() + ".jpg");
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: titel }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
    await modal(`<img src="${dataUrl}" alt=""><p style="margin-top:10px">Houd je vinger op de afbeelding en kies <b>Bewaar in Foto's</b>.</p>`, [["Oké", true]]);
  }
  function imageFromFile(file, max = 1600) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = rej; img.src = url;
    });
  }

  /* ---------- even geduld ---------- */
  function busy(text) {
    let b = $("#busy");
    if (!b) { b = document.createElement("div"); b.id = "busy"; b.innerHTML = `<div class="busy-box"><div class="spin"></div><div class="busy-t"></div></div>`; document.body.appendChild(b); }
    if (text === false) { b.hidden = true; return; }
    b.querySelector(".busy-t").textContent = text || "Even geduld…"; b.hidden = false;
  }

  /* ---------- back-up ---------- */
  async function maakBackupBestand() {
    const data = { app: "leerplek", versie: 1, datum: Date.now(), instellingen: {}, tekeningen: await db.all("tekeningen"), notities: await db.all("notities") };
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("lp-")) data.instellingen[k] = localStorage.getItem(k); } } catch (e) {}
    const json = JSON.stringify(data);
    const naam = `leerplek-backup-${new Date().toISOString().slice(0, 10)}.json`;
    return { json, naam, mb: (json.length / 1048576).toFixed(1), items: data.tekeningen.length + data.notities.length };
  }
  async function deelBackup(b) {
    for (const type of ["application/json", "text/plain"]) {
      const f = new File([b.json], b.naam, { type });
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        try { await navigator.share({ files: [f], title: "Back-up leerplek" }); store.set("laatste-backup", Date.now()); return "bewaard"; }
        catch (e) { if (e && e.name === "AbortError") return ""; }
      }
    }
    const url = URL.createObjectURL(new Blob([b.json], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = b.naam; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000); store.set("laatste-backup", Date.now()); return "gedownload";
  }
  async function zetTerug(file) {
    let d; try { d = JSON.parse(await file.text()); } catch (e) { throw new Error("Dit is geen back-up van leerplek."); }
    if (!d || d.app !== "leerplek") throw new Error("Dit is geen back-up van leerplek.");
    let n = 0;
    for (const st of ["tekeningen", "notities"]) for (const it of (d[st] || [])) {
      const ex = await db.get(st, it.id);
      if (!ex || (it.bewerkt || it.datum) > (ex.bewerkt || ex.datum)) { await db.put(st, it); n++; }
    }
    for (const [k, v] of Object.entries(d.instellingen || {})) {
      try {
        if (k === "lp-ideeen") {
          const nu = store.get("ideeen", []), ids = new Set(nu.map(i => i.id));
          store.set("ideeen", [...nu, ...JSON.parse(v).filter(i => !ids.has(i.id))]);
        } else if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
      } catch (e) {}
    }
    applyLook(); return n;
  }

  /* ---------- thema en tekst ---------- */
  const THEMAS = [
    { id: "nacht", naam: "Nacht", c: ["#1B1530", "#B79CFF", "#271F45"] },
    { id: "zacht", naam: "Zacht", c: ["#FFF4F1", "#C9577A", "#FBE1E8"] },
    { id: "fris", naam: "Fris", c: ["#F0FAF5", "#1F8F67", "#D7F2E6"] },
    { id: "oceaan", naam: "Oceaan", c: ["#0F2233", "#5EC8F2", "#1F4566"] },
    { id: "zon", naam: "Zon", c: ["#FFF6E8", "#C2620F", "#FFE6C7"] }
  ];
  const TEMPO = [["🐢 Rustig", 0.85], ["🙂 Normaal", 0.95], ["🐇 Vlot", 1.05]];
  function applyLook() {
    const thema = store.get("thema", "nacht");
    THEMAS.forEach(t => document.body.classList.toggle("theme-" + t.id, t.id === thema));
    document.body.classList.toggle("ruim", !!store.get("ruim", false));
    $("#space").classList.toggle("on", !!store.get("ruim", false));
    document.documentElement.style.setProperty("--fs", store.get("fs", 20) + "px");
    $("#appnaam").textContent = store.get("naam", "leren met BTS");
    const m = document.querySelector('meta[name="theme-color"]');
    const t = THEMAS.find(x => x.id === thema); if (m && t) m.content = t.c[0];
  }

  /* ---------- routes ---------- */
  const modules = [];
  const routes = {};
  let leave = [];
  let pendingTag = "", pendingEdit = null;

  function go(name) { if (location.hash === "#" + name) render(); else location.hash = name; }
  function onLeave(fn) { leave.push(fn); }

  function render() {
    stopSpeak();
    const L = leave; leave = []; L.forEach(fn => { try { fn(); } catch (e) {} });
    $("#modal").hidden = true;
    const name = (location.hash || "#start").slice(1) || "start";
    const route = routes[name] || routes.start;
    $("#back").hidden = (route === routes.start);
    const el = $("#view");
    el.innerHTML = `<div class="view-in"></div>`;
    const inner = el.firstElementChild;
    const r = route(inner);
    if (typeof r === "function") onLeave(r);
    bindSay(inner);
    window.scrollTo(0, 0);
  }

  /* ---------- beginscherm ---------- */
  routes.start = el => {
    const uur = new Date().getHours();
    const groet = uur < 12 ? "Goedemorgen" : uur < 18 ? "Hoi" : "Goedenavond";
    el.innerHTML = `
      <div class="hello"><h1>${groet}! 💜</h1><p class="soft">Waar heb je zin in?</p></div>
      <div id="melding"></div>
      <div class="section-title">School</div>
      <div class="tiles">
        <div class="tile big"><div class="ic">📚</div>
          <div style="flex:1;min-width:220px"><div class="nm">Mijn vakken</div>
          <div class="sub">Aantekeningen, huiswerk en documenten per vak. Op alles kun je schrijven met je Pencil.</div>
          <div class="parts">
            <button class="btn small" data-go="notities">📂 Openen</button>
            <label class="btn small">📷 Huiswerk fotograferen<input type="file" accept="image/*" capture="environment" id="snelcam" hidden></label>
          </div></div></div>
      </div>
      <div class="section-title">Leren</div>
      <div class="tiles">
        ${modules.map(m => `
          <div class="tile big">
            <div class="ic">${m.icoon}</div>
            <div style="flex:1;min-width:220px">
              <div class="nm">${esc(m.vak)} · ${esc(m.titel)}</div>
              <div class="sub">${esc(m.sub || "")}</div>
              ${m.status ? `<div class="mod-status">${m.status()}</div>` : ""}
              <div class="parts">${m.onderdelen.filter(o => !m.thuis || m.thuis.includes(o.id)).map(o => `<button class="btn small" data-go="${m.id}-${o.id}">${o.icoon} ${esc(o.thuisNaam || o.naam)}</button>`).join("")}</div>
            </div>
          </div>`).join("")}
      </div>
      <div class="section-title">Maken</div>
      <div class="tiles">
        <button class="tile" data-go="tekenen"><div class="ic">✏️</div><div class="nm">Tekenen</div><div class="sub">Met je Pencil, net als in Procreate.</div></button>
        <button class="tile" data-go="tekeningen"><div class="ic">🖼️</div><div class="nm">Mijn tekeningen</div><div class="sub">Alles wat je hebt gemaakt. Ook foto's toevoegen.</div></button>
        <button class="tile" data-go="ideeen"><div class="ic">💡</div><div class="nm">Ideeënbus</div><div class="sub">Wat moet er beter of nieuw? Jij bent de baas.</div></button>
        <button class="tile" data-go="mijn-app"><div class="ic">🎨</div><div class="nm">Mijn app</div><div class="sub">Kleuren, naam en back-up.</div></button>
      </div>`;
    $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
    $("#snelcam", el).onchange = e => { const f = e.target.files[0]; e.target.value = ""; if (f && App.huiswerkFoto) App.huiswerkFoto(f); };
    (async () => {
      const m = $("#melding", el); if (!m) return;
      let html = "";
      if (App.binnenkort) {
        const L = await App.binnenkort();
        if (L.length) html += `<div class="card soon"><b>📅 Binnenkort af</b>${L.map(n => `<button class="soon-rij" data-id="${n.id}">
          <span class="${n.af < Date.now() - 864e5 ? "laat" : ""}">${new Date(n.af).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}</span>
          <b>${esc(n.vak)}</b> · ${esc(n.titel)}</button>`).join("")}</div>`;
      }
      const nieuw = nieuweRegels();
      if (nieuw.length) html += `<button class="card nieuw-tip" data-go="nieuw">✨ <b>Nieuw in je app:</b> ${esc(nieuw[0].tekst)}${nieuw.length > 1 ? ` <span class="soft">En nog ${nieuw.length - 1} ${nieuw.length === 2 ? "ding" : "dingen"}. Tik hier.</span>` : ""}</button>`;
      const aantal = (await db.all("notities")).length + (await db.all("tekeningen")).length;
      const laatste = store.get("laatste-backup", 0);
      if (aantal >= 3 && Date.now() - laatste > 7 * 864e5) html += `<button class="card backup-tip" data-go="mijn-app">💾 <b>Tijd voor een back-up.</b> <span class="soft">${laatste ? "Je laatste is van " + new Date(laatste).toLocaleDateString("nl-NL", { day: "numeric", month: "long" }) + "." : "Je hebt er nog geen."} Tik hier.</span></button>`;
      m.innerHTML = html;
      $$(".soon-rij", m).forEach(b => b.onclick = () => App.openNote(b.dataset.id));
      $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
    })();
  };

  /* ---------- tekenen ---------- */
  routes.tekenen = el => {
    const tag = pendingTag; pendingTag = "";
    const edit = pendingEdit; pendingEdit = null;
    el.innerHTML = `<div id="studio"></div>`;
    const ui = Studio($("#studio", el), {
      aspect: 0.75, papier: "wit", strokes: edit ? edit.strokes : [],
      extraHtml: `<button class="btn small" id="save">💾 Bewaar</button>`
    });
    $("#save", el).onclick = async () => {
      if (ui.doek.isEmpty()) { await modal("<p>Je hebt nog niks getekend 🙂</p>", [["Oké", true]]); return; }
      const titel = await modal(`<h2>Hoe heet je tekening?</h2><input type="text" placeholder="Bijvoorbeeld: omzet en winst" value="${esc(edit ? edit.titel : tag)}">`, [["Annuleer", null, "ghost"], ["Bewaar", "__input"]]);
      if (titel === null) return;
      await db.put("tekeningen", {
        id: edit ? edit.id : "t" + Date.now(), datum: Date.now(), titel: titel || "Tekening", tag,
        data: ui.doek.toImage(1400), strokes: ui.doek.getStrokes(), aspect: 0.75
      });
      go("tekeningen");
    };
    return () => ui.destroy();
  };

  /* ---------- mijn tekeningen ---------- */
  routes.tekeningen = el => {
    el.innerHTML = `
      <div class="row" style="justify-content:space-between;margin-bottom:14px">
        <h1 style="margin:0">Mijn tekeningen</h1>
        <div class="row">
          <label class="btn ghost small" style="display:inline-flex;align-items:center;cursor:pointer">📷 Foto toevoegen<input type="file" accept="image/*" id="imp" hidden></label>
          <button class="btn small" id="nieuw">✏️ Nieuwe</button>
        </div>
      </div>
      <div class="gallery" id="gal"><div class="empty">Laden…</div></div>`;
    $("#nieuw", el).onclick = () => go("tekenen");
    $("#imp", el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      const data = await imageFromFile(f);
      const titel = await modal(`<h2>Hoe heet deze?</h2><input type="text" placeholder="Naam van je tekening">`, [["Annuleer", null, "ghost"], ["Bewaar", "__input"]]);
      if (titel === null) return;
      await db.put("tekeningen", { id: "t" + Date.now(), datum: Date.now(), titel: titel || "Foto", tag: "", data });
      show();
    };
    async function show() {
      const list = await db.all("tekeningen");
      const g = $("#gal", el);
      if (!list.length) { g.innerHTML = `<div class="empty" style="grid-column:1/-1">Nog geen tekeningen. Maak er een, of voeg een foto toe.</div>`; return; }
      g.innerHTML = list.map(d => `<button class="thumb" data-id="${d.id}"><img src="${d.data}" alt=""><div class="cap">${esc(d.titel)}<small>${new Date(d.datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}</small></div></button>`).join("");
      $$(".thumb", g).forEach(b => b.onclick = () => open(list.find(d => d.id === b.dataset.id)));
    }
    async function open(d) {
      const btns = [["🗑️ Weg", "del", "ghost"], ["📤 Delen of bewaren", "share", "ghost"]];
      if (d.strokes) btns.push(["✏️ Verder tekenen", "edit", "ghost"]);
      btns.push(["Sluit", "x"]);
      const keuze = await modal(`<h2>${esc(d.titel)}</h2><img src="${d.data}" alt="">
        <p class="soft" style="margin-top:10px;font-size:.85em">Tip: houd je vinger op de tekening om hem in Foto's te bewaren.</p>`, btns);
      if (keuze === "share") shareImage(d.data, d.titel);
      if (keuze === "edit") { pendingEdit = d; go("tekenen"); }
      if (keuze === "del") {
        const ok = await modal(`<h2>Weggooien?</h2><p>“${esc(d.titel)}” is dan echt weg.</p>`, [["Nee", false, "ghost"], ["Ja, weg", true]]);
        if (ok) { await db.del("tekeningen", d.id); show(); }
      }
    }
    show();
  };

  /* ---------- ideeënbus ---------- */
  const SOORTEN = [["nieuw", "✨", "Iets nieuws"], ["irritant", "😤", "Dit is irritant"], ["mooier", "🎨", "Mooier maken"], ["vak", "📚", "Ander vak of hoofdstuk"]];
  routes.ideeen = el => {
    let soort = "nieuw";
    el.innerHTML = `
      <div class="card">
        <h1>💡 Ideeënbus</h1>
        <button class="say" data-say="Dit is jouw ideeënbus. Wat moet er nieuw in de app? Wat is irritant? Wat kan mooier? Schrijf het op, of teken het. Papa en Claude bouwen het.">🔊 Lees voor</button>
        <p>Jij bent de baas van deze app. Wat wil je? Papa en Claude bouwen het.</p>
        <p class="soft" style="margin-top:-4px">Wat al gebouwd is, zie je bij <a href="#nieuw" style="color:var(--accent)">✨ Wat is er nieuw</a>.</p>
        <div class="row" id="soorten" style="margin-bottom:10px">${SOORTEN.map(([id, e, n]) => `<button class="chip ${id === soort ? "sel" : ""}" data-s="${id}">${e} ${n}</button>`).join("")}</div>
        <textarea id="tekst" placeholder="Typ of spreek je idee in… (spelling maakt niks uit)"></textarea>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="add">➕ In de bus</button>
          <button class="btn ghost" id="teken">✏️ Teken je idee</button>
        </div>
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between"><h2 style="margin:0">In de bus</h2>
          <div><button class="btn small" id="stuur">📤 Stuur naar papa</button><span class="ok" id="ok"></span></div></div>
        <div id="lijst" style="margin-top:12px"></div>
      </div>`;
    $$("#soorten .chip", el).forEach(b => b.onclick = () => { soort = b.dataset.s; $$("#soorten .chip", el).forEach(x => x.classList.toggle("sel", x === b)); });
    function lijst() {
      const L = store.get("ideeen", []);
      $("#lijst", el).innerHTML = L.length ? L.map(i => {
        const s = SOORTEN.find(x => x[0] === i.soort) || SOORTEN[0];
        return `<div class="idea ${i.klaar ? "klaar" : ""}"><div class="e">${s[1]}</div><div class="tx"><span>${esc(i.tekst)}</span><small>${s[2]} · ${new Date(i.datum).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}${i.klaar ? " · ✅ gebouwd" : ""}</small></div>
          <button class="chip" data-k="${i.id}" aria-label="Gebouwd">✅</button><button class="chip" data-d="${i.id}" aria-label="Weg">🗑️</button></div>`;
      }).join("") : `<div class="empty">Nog leeg. Wat wil jij?</div>`;
      $$("[data-k]", el).forEach(b => b.onclick = () => { const L = store.get("ideeen", []); const i = L.find(x => x.id === b.dataset.k); if (i) i.klaar = !i.klaar; store.set("ideeen", L); lijst(); });
      $$("[data-d]", el).forEach(b => b.onclick = () => { store.set("ideeen", store.get("ideeen", []).filter(x => x.id !== b.dataset.d)); lijst(); });
    }
    $("#add", el).onclick = () => {
      const t = $("#tekst", el).value.trim(); if (!t) return;
      const L = store.get("ideeen", []); L.unshift({ id: "i" + Date.now(), soort, tekst: t, datum: Date.now(), klaar: false });
      store.set("ideeen", L); $("#tekst", el).value = ""; lijst();
    };
    $("#teken", el).onclick = () => { pendingTag = "Idee"; go("tekenen"); };
    $("#stuur", el).onclick = async () => {
      const L = store.get("ideeen", []).filter(i => !i.klaar);
      if (!L.length) { $("#ok", el).textContent = "Bus is leeg"; return; }
      const txt = "Ideeënbus leerplek:\n" + L.map(i => { const s = SOORTEN.find(x => x[0] === i.soort) || SOORTEN[0]; return `- ${s[2]}: ${i.tekst}`; }).join("\n");
      const r = await shareText("Ideeënbus", txt);
      $("#ok", el).textContent = r ? "✓ " + r : "";
    };
    lijst();
  };

  /* ---------- mijn app (ontwerp) ---------- */
  routes["mijn-app"] = el => {
    el.innerHTML = `
      <div class="card">
        <h1>🎨 Mijn app</h1>
        <p>Kies je sfeer. De app verandert meteen mee.</p>
        <div class="themes">${THEMAS.map(t => `<button class="th ${store.get("thema", "nacht") === t.id ? "sel" : ""}" data-t="${t.id}">
          <div class="sw">${t.c.map(c => `<span style="background:${c}"></span>`).join("")}</div><span class="lbl">${t.naam}</span></button>`).join("")}</div>
        <p><label for="naam">Naam van je app</label></p>
        <input type="text" id="naam" value="${esc(store.get("naam", "leren met BTS"))}">
        <p class="soft" style="margin-top:16px;font-size:.85em">Iets anders veranderen? Zet het in de <a href="#ideeen" style="color:var(--accent)">ideeënbus</a>. Wat er al veranderd is: <a href="#nieuw" style="color:var(--accent)">✨ Wat is er nieuw</a>.</p>
      </div>
      <div class="card">
        <h2>🔊 Voorlezen</h2>
        <button class="say" data-say="Voorlezen. Kies de stem die jij het fijnst vindt, en hoe snel hij praat. Tik op Probeer om te luisteren.">🔊 Lees voor</button>
        <p>Kies de stem die jij het fijnst vindt, en hoe snel hij praat.</p>
        <div id="stemmen" class="row"></div>
        <p style="margin:14px 0 6px"><b>Hoe snel?</b></p>
        <div class="row" id="tempo">${TEMPO.map(([n, v]) => `<button class="chip ${store.get("tempo", 0.95) === v ? "sel" : ""}" data-v="${v}">${n}</button>`).join("")}</div>
        <div class="row" style="margin-top:14px"><button class="btn" id="probeer">▶ Probeer</button></div>
        <div id="stemtip"></div>
      </div>
      <div class="card">
        <h2>💾 Back-up</h2>
        <p>Al je aantekeningen, huiswerk en tekeningen staan <b>alleen op deze iPad</b>. Maak elke week een back-up en bewaar die in <b>Bestanden → iCloud Drive</b>. Dan ben je niks kwijt als de app weg is of je een nieuwe iPad krijgt.</p>
        <p class="soft" id="opslag" style="font-size:.85em"></p>
        <div class="row">
          <button class="btn" id="maak">💾 Back-up maken</button>
          <label class="btn ghost">↩️ Back-up terugzetten<input type="file" accept=".json,application/json,text/plain" id="terug" hidden></label>
        </div>
        <p class="ok" id="bok" style="margin:10px 0 0"></p>
      </div>`;
    const laatste = store.get("laatste-backup", 0);
    (async () => {
      let t = laatste ? `Laatste back-up: ${new Date(laatste).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}.` : "Nog geen back-up gemaakt.";
      try { const e = await navigator.storage.estimate(); t += ` In gebruik: ${(e.usage / 1048576).toFixed(0)} MB.`; } catch (e) {}
      const o = $("#opslag", el); if (o) o.textContent = t;
    })();
    $("#maak", el).onclick = async () => {
      busy("Back-up maken…"); const b = await maakBackupBestand(); busy(false);
      const r = await modal(`<h2>Back-up klaar</h2><p>${b.items} dingen, ${b.mb} MB.</p><p>Kies in het volgende scherm <b>Bewaar in Bestanden</b> en dan <b>iCloud Drive</b>.</p>`, [["Annuleer", null, "ghost"], ["📤 Bewaar back-up", "ok"]]);
      if (r !== "ok") return;
      const res = await deelBackup(b); $("#bok", el).textContent = res ? "✓ Back-up " + res : "";
    };
    $("#terug", el).onchange = async e => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      busy("Terugzetten…");
      try { const n = await zetTerug(f); busy(false); $("#bok", el).textContent = `✓ ${n} ${n === 1 ? "ding" : "dingen"} teruggezet. Wat al op de iPad stond, is niet overschreven.`; }
      catch (err) { busy(false); await modal(`<h2>Dat lukte niet</h2><p>${esc(err.message)}</p>`, [["Oké", true]]); }
    };
    function stemmen() {
      const box = $("#stemmen", el); if (!box) return;
      if (!canSpeak) { box.innerHTML = `<p class="soft">Voorlezen werkt niet in deze browser.</p>`; return; }
      const vs = nlVoices().filter(v => stemKwaliteit(v) > 0).slice(0, 8), nu = voice;
      const label = v => stemKwaliteit(v) >= 3 ? "premium ⭐⭐" : stemKwaliteit(v) >= 2 ? "verbeterd ⭐" : "basis";
      box.innerHTML = vs.length ? vs.map((v, i) => `<button class="chip ${nu && v.voiceURI === nu.voiceURI ? "sel" : ""}" data-i="${i}">${esc(v.name)} <small style="opacity:.75">${label(v)}${/BE/i.test(v.lang) ? " · Vlaams" : ""}</small></button>`).join("")
        : `<p class="soft">Nog geen Nederlandse stem gevonden. Zie de tip hieronder.</p>`;
      $$("[data-i]", box).forEach(b => b.onclick = () => { store.set("stem", vs[+b.dataset.i].voiceURI); pickVoice(); stemmen(); stopSpeak(); speak("Hoi! Zo klink ik. Vind je mij fijn om naar te luisteren?"); });
      const goed = vs.some(v => stemKwaliteit(v) >= 2);
      $("#stemtip", el).innerHTML = `<details class="meet" style="margin-top:14px" ${goed ? "" : "open"}><summary>💡 Klinkt het als een robot? Download een betere stem</summary>
        <ol style="margin:10px 0 0;padding-left:22px;line-height:1.6"><li>Open <b>Instellingen</b> op je iPad.</li><li>Ga naar <b>Toegankelijkheid</b> → <b>Gesproken materiaal</b> → <b>Stemmen</b>.</li>
        <li>Kies <b>Nederlands</b>. Tik op een stem en download de versie <b>Verbeterd</b> of <b>Premium</b>, bijvoorbeeld <b>Claire (verbeterd)</b> of <b>Xander (verbeterd)</b>.</li><li>Let op: de <b>Siri</b>-stemmen (Stem 1, Stem 2) werken niet in deze app. Apple laat die alleen door Siri zelf gebruiken.</li><li>Sluit deze app helemaal en open hem opnieuw. Kies hier dan de nieuwe stem.</li></ol></details>`;
    }
    stemmen();
    if (canSpeak) { const h = () => stemmen(); speechSynthesis.addEventListener("voiceschanged", h); onLeave(() => speechSynthesis.removeEventListener("voiceschanged", h)); }
    $$("#tempo .chip", el).forEach(b => b.onclick = () => { store.set("tempo", +b.dataset.v); $$("#tempo .chip", el).forEach(x => x.classList.toggle("sel", x === b)); });
    $("#probeer", el).onclick = () => { stopSpeak(); speak("Purple Cases verkoopt deze maand 150 hoesjes van €8. De omzet is 150 × €8 = €1.200. Dat is afzet keer verkoopprijs."); };
    $$(".th", el).forEach(b => b.onclick = () => { store.set("thema", b.dataset.t); applyLook(); $$(".th", el).forEach(x => x.classList.toggle("sel", x === b)); });
    $("#naam", el).oninput = e => { store.set("naam", e.target.value || "leren met BTS"); applyLook(); };
  };

  /* ---------- wat is er nieuw ---------- */
  // De regels staan in js/nieuw.js (App.nieuw). 'nieuw-gezien' onthoudt de laatste datum die ze heeft gezien.
  const regels = () => (App.nieuw || []).slice().sort((a, b) => b.datum.localeCompare(a.datum));
  const nieuweRegels = () => { const g = store.get("nieuw-gezien", ""); return regels().filter(r => r.datum > g); };
  const datumNL = d => new Date(d + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
  routes.nieuw = el => {
    const L = regels(), nieuw = new Set(nieuweRegels());
    const dagen = [...new Set(L.map(r => r.datum))];
    el.innerHTML = `
      <div class="card">
        <h1>✨ Wat is er nieuw</h1>
        <button class="say" id="lees-nieuw">🔊 Lees voor</button>
        <p>Hier zie je wat er in je app is veranderd. Met een ✨ kwam het uit <b>jouw ideeënbus</b>.</p>
      </div>
      ${dagen.length ? dagen.map(d => `<div class="card"><h2>${esc(datumNL(d).replace(/^./, c => c.toUpperCase()))}</h2>
        ${L.filter(r => r.datum === d).map(r => `<div class="idea ${nieuw.has(r) ? "vers" : "gezien"}"><div class="e">${r.idee ? "✨" : "🛠️"}</div>
          <div class="tx"><span>${esc(r.tekst)}</span>${r.idee ? `<small>Uit jouw ideeënbus</small>` : ""}</div><button class="say-mini" data-t="${esc(r.tekst)}" aria-label="Lees voor">🔊</button></div>`).join("")}</div>`).join("")
      : `<div class="card"><p class="empty">Nog niks nieuws.</p></div>`}
      <div class="card"><p style="margin:0">Heb jij een idee? <button class="btn small" data-go="ideeen">💡 Naar de ideeënbus</button></p></div>`;
    const teLezen = nieuw.size ? [...nieuw] : L.filter(r => r.datum === dagen[0]);
    sayButton($("#lees-nieuw", el), () => `Wat is er nieuw. ${teLezen.map(r => (r.idee ? "Uit jouw ideeënbus: " : "") + r.tekst).join(" ")}`);
    $$(".say-mini", el).forEach(b => b.onclick = () => { stopSpeak(); speak(b.dataset.t); });
    $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
    if (dagen.length) store.set("nieuw-gezien", dagen[0]);
  };

  /* ---------- meten (per module) ---------- */
  function meetBlock(moduleId, onderdelen) {
    const key = "meet-" + moduleId;
    const wrap = document.createElement("details"); wrap.className = "meet";
    function draw(open) {
      const M = store.get(key, {});
      wrap.innerHTML = `<summary>📝 Na afloop (voor papa)</summary>
        <p class="soft" style="margin-top:10px">Per vorm: hoe leuk was het, en wat weet ze de volgende dag nog?</p>
        ${onderdelen.map(([k, n]) => { const m = M[k] || {}; return `
          <div style="margin:12px 0 16px"><b>${n}</b>
            <div class="stars">${[1, 2, 3, 4, 5].map(i => `<button class="star ${(m.leuk || 0) >= i ? "on" : ""}" data-k="${k}" data-s="${i}" aria-label="${i} sterren">⭐</button>`).join("")}</div>
            <div class="row" style="margin-bottom:8px">Uit zichzelf nog eens geopend?
              ${["ja", "nee"].map(v => `<button class="chip ${m.opnieuw === v ? "sel" : ""}" data-k="${k}" data-o="${v}">${v}</button>`).join("")}</div>
            <textarea data-k="${k}" placeholder="Wat weet ze de volgende dag nog? (zonder te kijken)">${esc(m.weet || "")}</textarea></div>`; }).join("")}
        <button class="btn" data-copy>📤 Stuur resultaten</button><span class="ok"></span>`;
      wrap.open = !!open;
      $$(".star", wrap).forEach(b => b.onclick = () => { const M = store.get(key, {}); (M[b.dataset.k] ||= {}).leuk = +b.dataset.s; store.set(key, M); draw(true); });
      $$(".chip", wrap).forEach(b => b.onclick = () => { const M = store.get(key, {}); (M[b.dataset.k] ||= {}).opnieuw = b.dataset.o; store.set(key, M); draw(true); });
      $$("textarea", wrap).forEach(t => t.oninput = () => { const M = store.get(key, {}); (M[t.dataset.k] ||= {}).weet = t.value; store.set(key, M); });
      $("[data-copy]", wrap).onclick = async () => {
        const M = store.get(key, {});
        const txt = [`Resultaten ${moduleId}`, ...onderdelen.map(([k, n]) => { const m = M[k] || {}; return `${n}: ${m.leuk || 0}/5 | opnieuw geopend: ${m.opnieuw || "-"} | weet nog: ${m.weet || "-"}`; })].join("\n");
        const r = await shareText("Resultaten", txt); $(".ok", wrap).textContent = r ? "✓ " + r : "";
      };
    }
    draw(false);
    return wrap;
  }

  /* ---------- publieke functies ---------- */
  window.App = {
    $, $$, esc, speak, stopSpeak, canSpeak, sayButton, nlVoices, spreekbaar, stemKwaliteit, huidigeStem: () => voice, bindSay, store, db, modal, meetBlock, go, onLeave,
    shareText, shareImage, imageFromFile, busy,
    tekenMet(tag) { pendingTag = tag || ""; go("tekenen"); },
    addRoute(name, fn) { routes[name] = fn; },
    addModule(m) {
      modules.push(m);
      m.onderdelen.forEach(o => {
        routes[m.id + "-" + o.id] = el => {
          const groepen = [...new Set(m.onderdelen.map(x => x.groep || ""))];
          el.innerHTML = `<div class="mod-nav">${groepen.map(g => `<div class="row mod-rij">${g ? `<span class="mod-groep">${esc(g)}</span>` : ""}${m.onderdelen.filter(x => (x.groep || "") === g).map(x =>
            `<button class="chip ${x.id === o.id ? "sel" : ""}" data-go="${m.id}-${x.id}">${x.icoon} ${esc(x.naam)}</button>`).join("")}</div>`).join("")}</div><div id="mod"></div>`;
          $$(".mod-nav [data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
          const r = o.render($("#mod", el), { go, moduleId: m.id });
          const meet = m.onderdelen.filter(x => !m.meten || m.meten.includes(x.id));
          if (!m.meten || m.meten.includes(o.id)) el.appendChild(meetBlock(m.id, meet.map(x => [x.id, x.icoon + " " + x.naam])));
          bindSay(el);
          return r;
        };
      });
    },
    start() {
      applyLook();
      $("#back").onclick = () => go("start");
      $("#logo").onclick = () => go("start");
      $("#bigger").onclick = () => { store.set("fs", Math.min(28, store.get("fs", 20) + 2)); applyLook(); };
      $("#smaller").onclick = () => { store.set("fs", Math.max(16, store.get("fs", 20) - 2)); applyLook(); };
      $("#space").onclick = () => { store.set("ruim", !store.get("ruim", false)); applyLook(); };
      window.addEventListener("hashchange", render);
      window.addEventListener("pagehide", () => { const L = leave; leave = []; L.forEach(fn => { try { fn(); } catch (e) {} }); });
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") document.dispatchEvent(new Event("lp-bewaar")); });
      render();
      if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    }
  };
})();
