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
  const canSpeak = "speechSynthesis" in window;
  let voice = null;
  function pickVoice() {
    if (!canSpeak) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /^nl(-|_)NL/i.test(v.lang)) || vs.find(v => /^nl/i.test(v.lang)) || null;
  }
  if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function stopSpeak() {
    if (canSpeak) speechSynthesis.cancel();
    $$(".say.speaking").forEach(b => { b.classList.remove("speaking"); b.textContent = b.dataset.label || "🔊 Lees voor"; });
  }
  function speak(text, onend) {
    if (!canSpeak || !text) { onend && onend(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL"; if (voice) u.voice = voice; u.rate = 0.95;
    u.onend = u.onerror = () => onend && onend();
    try { speechSynthesis.speak(u); } catch (e) { onend && onend(); }
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

  /* ---------- thema en tekst ---------- */
  const THEMAS = [
    { id: "nacht", naam: "Nacht", c: ["#1B1530", "#B79CFF", "#271F45"] },
    { id: "zacht", naam: "Zacht", c: ["#FFF4F1", "#C9577A", "#FBE1E8"] },
    { id: "fris", naam: "Fris", c: ["#F0FAF5", "#1F8F67", "#D7F2E6"] },
    { id: "oceaan", naam: "Oceaan", c: ["#0F2233", "#5EC8F2", "#1F4566"] },
    { id: "zon", naam: "Zon", c: ["#FFF6E8", "#C2620F", "#FFE6C7"] }
  ];
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
      <div class="section-title">In de les</div>
      <div class="tiles">
        <button class="tile big" data-go="notities"><div class="ic">📒</div>
          <div style="flex:1;min-width:220px"><div class="nm">Aantekeningen</div>
          <div class="sub">Per vak. Schrijven met je Pencil, een foto van het bord, of inspreken.</div></div></button>
      </div>
      <div class="section-title">Leren</div>
      <div class="tiles">
        ${modules.map(m => `
          <div class="tile big">
            <div class="ic">${m.icoon}</div>
            <div style="flex:1;min-width:220px">
              <div class="nm">${esc(m.vak)} · ${esc(m.titel)}</div>
              <div class="sub">${esc(m.sub || "")}</div>
              <div class="parts">${m.onderdelen.map(o => `<button class="btn small" data-go="${m.id}-${o.id}">${o.icoon} ${esc(o.naam)}</button>`).join("")}</div>
            </div>
          </div>`).join("")}
      </div>
      <div class="section-title">Maken</div>
      <div class="tiles">
        <button class="tile" data-go="tekenen"><div class="ic">✏️</div><div class="nm">Tekenen</div><div class="sub">Met je Pencil, net als in Procreate.</div></button>
        <button class="tile" data-go="tekeningen"><div class="ic">🖼️</div><div class="nm">Mijn tekeningen</div><div class="sub">Alles wat je hebt gemaakt. Ook foto's toevoegen.</div></button>
        <button class="tile" data-go="ideeen"><div class="ic">💡</div><div class="nm">Ideeënbus</div><div class="sub">Wat moet er beter of nieuw? Jij bent de baas.</div></button>
        <button class="tile" data-go="mijn-app"><div class="ic">🎨</div><div class="nm">Mijn app</div><div class="sub">Kleuren en naam van je app.</div></button>
      </div>`;
    $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
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
        <p class="soft" style="margin-top:16px;font-size:.85em">Iets anders veranderen? Zet het in de <a href="#ideeen" style="color:var(--accent)">ideeënbus</a>.</p>
      </div>`;
    $$(".th", el).forEach(b => b.onclick = () => { store.set("thema", b.dataset.t); applyLook(); $$(".th", el).forEach(x => x.classList.toggle("sel", x === b)); });
    $("#naam", el).oninput = e => { store.set("naam", e.target.value || "leren met BTS"); applyLook(); };
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
    $, $$, esc, speak, stopSpeak, canSpeak, sayButton, store, db, modal, meetBlock, go, onLeave,
    shareText, shareImage, imageFromFile,
    tekenMet(tag) { pendingTag = tag || ""; go("tekenen"); },
    addRoute(name, fn) { routes[name] = fn; },
    addModule(m) {
      modules.push(m);
      m.onderdelen.forEach(o => {
        routes[m.id + "-" + o.id] = el => {
          el.innerHTML = `<div class="row" style="margin-bottom:12px">${m.onderdelen.map(x =>
            `<button class="chip ${x.id === o.id ? "sel" : ""}" data-go="${m.id}-${x.id}">${x.icoon} ${esc(x.naam)}</button>`).join("")}</div><div id="mod"></div>`;
          $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
          const r = o.render($("#mod", el));
          el.appendChild(meetBlock(m.id, m.onderdelen.map(x => [x.id, x.icoon + " " + x.naam])));
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
