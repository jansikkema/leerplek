/* doek.js – tekenmotor in Procreate-stijl.
   Gebaren:  2 vingers tikken = terug · 3 vingers tikken = opnieuw · 4 vingers tikken = volledig scherm
             2 vingers knijpen/schuiven = zoomen en verschuiven · pen stil houden aan het eind = rechte lijn
   Zodra de Pencil is gebruikt, tekenen vingers niet meer (handpalm wordt genegeerd).
   Lijnen worden bewaard als gegevens (0..1000 breed), zodat je later verder kunt tekenen. */
(function () {
  const LW = 1000;
  const BRUSHES = {
    pen:     { naam: "Pen",          icoon: "🖊️", druk: 0.9, max: 30 },
    potlood: { naam: "Potlood",      icoon: "✏️", druk: 1.2, max: 20 },
    markeer: { naam: "Markeerstift", icoon: "🖍️", druk: 0,   max: 60, blend: "multiply" },
    gum:     { naam: "Gum",          icoon: "🧽", druk: 0,   max: 90 }
  };
  const KLEUREN = ["#1A1A1A", "#6B6B6B", "#FFFFFF", "#D7263D", "#F46036", "#FFC300", "#2E9E5B", "#20C9A6", "#2F7BE0", "#1B3A8C", "#8E3CF0", "#E8467C", "#8B5A2B", "#FFE14D", "#8CF07A", "#FF8AD8", "#7FD8FF", "#C9A7FF"];

  const state = {
    tool: "pen", color: "#1A1A1A", recent: [],
    b: { pen: { size: 5, alpha: 1 }, potlood: { size: 3, alpha: 0.85 }, markeer: { size: 26, alpha: 0.4 }, gum: { size: 30, alpha: 1 } }
  };
  try { const s = JSON.parse(localStorage.getItem("lp-studio") || "null"); if (s && s.b) Object.assign(state, s); } catch (e) {}
  const saveState = () => { try { localStorage.setItem("lp-studio", JSON.stringify(state)); } catch (e) {} };

  /* ---------- tekenen van lijnen ---------- */
  const widthOf = (st, p) => st.size * (1 + (BRUSHES[st.tool]?.druk || 0) * (p - 0.5));
  function drawSeg(ctx, st, a, b, k) {
    ctx.lineWidth = Math.max(0.5, widthOf(st, (a[2] + b[2]) / 2) * k);
    ctx.beginPath(); ctx.moveTo(a[0] * k, a[1] * k); ctx.lineTo(b[0] * k, b[1] * k); ctx.stroke();
  }
  function drawPath(ctx, st, k) {
    const pts = st.pts; if (!pts.length) return;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = ctx.fillStyle = st.tool === "gum" ? "#000" : st.color;
    if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0][0] * k, pts[0][1] * k, Math.max(0.5, widthOf(st, pts[0][2]) * k / 2), 0, Math.PI * 2); ctx.fill(); }
    for (let i = 1; i < pts.length; i++) drawSeg(ctx, st, pts[i - 1], pts[i], k);
    ctx.restore();
  }
  function paintStroke(ctx, st, k, tmp) {
    if (st.tool === "gum") { ctx.save(); ctx.globalCompositeOperation = "destination-out"; drawPath(ctx, st, k); ctx.restore(); return; }
    if (st.alpha < 1 || st.blend) {
      if (tmp.width !== ctx.canvas.width || tmp.height !== ctx.canvas.height) { tmp.width = ctx.canvas.width; tmp.height = ctx.canvas.height; }
      const t = tmp.getContext("2d"); t.clearRect(0, 0, tmp.width, tmp.height); drawPath(t, st, k);
      ctx.save(); ctx.globalAlpha = st.alpha; ctx.globalCompositeOperation = st.blend || "source-over"; ctx.drawImage(tmp, 0, 0); ctx.restore();
      return;
    }
    drawPath(ctx, st, k);
  }
  function paintBg(ctx, k, papier, img) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h);
    if (img) {
      const sc = Math.min(w / img.width, h / img.height), iw = img.width * sc, ih = img.height * sc;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    } else if (papier === "lijnen") {
      const step = 34 * k; ctx.strokeStyle = "#BFD3EA"; ctx.lineWidth = Math.max(1, 1.2 * k);
      for (let y = step * 2; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = "#F2A7B5"; ctx.beginPath(); ctx.moveTo(70 * k, 0); ctx.lineTo(70 * k, h); ctx.stroke();
    } else if (papier === "ruitjes") {
      const step = 25 * k; ctx.strokeStyle = "#D5DEEA"; ctx.lineWidth = Math.max(1, 1 * k);
      for (let x = step; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = step; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (papier === "stippen") {
      const step = 25 * k; ctx.fillStyle = "#B8C2D3";
      for (let x = step; x < w; x += step) for (let y = step; y < h; y += step) { ctx.beginPath(); ctx.arc(x, y, Math.max(1, 1.6 * k), 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }

  /* ---------- het doek ---------- */
  function Doek(host, o = {}) {
    const aspect = o.aspect || 0.75, LH = LW * aspect;
    host.innerHTML = `<div class="doek-box"><div class="doek-stage"><canvas class="c-bg"></canvas><canvas class="c-ink"></canvas><canvas class="c-live"></canvas></div><div class="doek-toast"></div></div>`;
    const box = host.querySelector(".doek-box"), stage = host.querySelector(".doek-stage"), toast = host.querySelector(".doek-toast");
    const cBg = host.querySelector(".c-bg"), cInk = host.querySelector(".c-ink"), cLive = host.querySelector(".c-live");
    const xBg = cBg.getContext("2d"), xInk = cInk.getContext("2d"), xLive = cLive.getContext("2d");
    const tmp = document.createElement("canvas");
    let strokes = (o.strokes || []).slice(), redoStack = [];
    let papier = o.papier || "wit", foto = null;
    let k = 1, w = 0, h = 0, ox = 0, s = 1, tx = 0, ty = 0;

    function setFoto(url) {
      if (!url) { foto = null; paintBgNow(); return; }
      const im = new Image(); im.onload = () => { foto = im; paintBgNow(); }; im.src = url;
    }
    function paintBgNow() { paintBg(xBg, k, papier, foto); }
    function paintInk() { xInk.clearRect(0, 0, cInk.width, cInk.height); strokes.forEach(st => paintStroke(xInk, st, k, tmp)); }
    function apply() { stage.style.transform = `translate(${ox + tx}px,${ty}px) scale(${s})`; }
    function fit() {
      const bw = host.clientWidth || 600;
      const avail = Math.max(260, o.maxHeight ? o.maxHeight() : 600);
      w = Math.min(bw, avail / aspect); h = w * aspect; ox = (bw - w) / 2;
      box.style.height = h + "px";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      [cBg, cInk, cLive].forEach(c => { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.width = w + "px"; c.style.height = h + "px"; });
      stage.style.width = w + "px"; stage.style.height = h + "px";
      k = (w * dpr) / LW; apply(); paintBgNow(); paintInk();
    }
    let toastT;
    function flash(t) { toast.textContent = t; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("on"), 700); }
    const changed = () => o.onChange && o.onChange();

    function pos(e) {
      const r = cInk.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * LW, y = (e.clientY - r.top) / r.height * LH;
      const p = e.pointerType === "pen" ? (e.pressure || 0.5) : 0.5;
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(p * 100) / 100];
    }

    /* --- lijn tekenen --- */
    let cur = null, holdTimer = null, holdRef = null;
    function startStroke(e) {
      const b = state.b[state.tool], br = BRUSHES[state.tool];
      const p = pos(e);
      cur = { id: e.pointerId, touch: e.pointerType === "touch", line: false,
        st: { tool: state.tool, color: state.color, size: b.size, alpha: state.tool === "gum" ? 1 : b.alpha, blend: br.blend || null, pts: [p] } };
      xLive.clearRect(0, 0, cLive.width, cLive.height);
      cLive.style.opacity = cur.st.alpha; cLive.style.mixBlendMode = cur.st.blend || "normal";
      if (cur.st.tool === "gum") { xInk.save(); xInk.globalCompositeOperation = "destination-out"; drawPath(xInk, cur.st, k); xInk.restore(); }
      else drawPath(xLive, cur.st, k);
      holdRef = p; armHold();
    }
    function armHold() { clearTimeout(holdTimer); holdTimer = setTimeout(makeLine, 550); }
    function makeLine() {
      if (!cur || cur.line || cur.st.tool === "gum") return;
      const pts = cur.st.pts; if (pts.length < 4) return;
      const a = pts[0], b = pts[pts.length - 1];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 25) return;
      cur.st.pts = [a, b]; cur.line = true;
      xLive.clearRect(0, 0, cLive.width, cLive.height); drawPath(xLive, cur.st, k); flash("📏 Rechte lijn");
    }
    function extend(e) {
      let evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; if (!evs.length) evs = [e];
      for (const ev of evs) {
        const p = pos(ev);
        if (cur.line) { cur.st.pts[1] = p; continue; }
        const last = cur.st.pts[cur.st.pts.length - 1];
        if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 0.6) continue;
        cur.st.pts.push(p);
        if (cur.st.tool === "gum") { xInk.save(); xInk.globalCompositeOperation = "destination-out"; xInk.lineCap = "round"; drawSeg(xInk, cur.st, last, p, k); xInk.restore(); }
        else { xLive.save(); xLive.lineCap = "round"; xLive.strokeStyle = cur.st.color; drawSeg(xLive, cur.st, last, p, k); xLive.restore(); }
        if (Math.hypot(p[0] - holdRef[0], p[1] - holdRef[1]) > 6) { holdRef = p; armHold(); }
      }
      if (cur.line) { xLive.clearRect(0, 0, cLive.width, cLive.height); drawPath(xLive, cur.st, k); }
    }
    function endStroke() {
      clearTimeout(holdTimer); if (!cur) return;
      const st = cur.st; cur = null;
      xLive.clearRect(0, 0, cLive.width, cLive.height);
      if (st.tool !== "gum") paintStroke(xInk, st, k, tmp);
      strokes.push(st); redoStack = []; changed();
    }
    function cancelStroke() {
      clearTimeout(holdTimer); if (!cur) return;
      const gum = cur.st.tool === "gum"; cur = null;
      xLive.clearRect(0, 0, cLive.width, cLive.height); if (gum) paintInk();
    }
    function undo() { if (!strokes.length) { flash("Niks meer terug"); return; } redoStack.push(strokes.pop()); paintInk(); changed(); flash("↶ Terug"); }
    function redo() { if (!redoStack.length) { flash("Niks meer opnieuw"); return; } strokes.push(redoStack.pop()); paintInk(); changed(); flash("↷ Opnieuw"); }

    /* --- gebaren --- */
    let penSeen = !!state.penSeen;
    const touches = new Map(); let g = null;
    const now = () => performance.now();
    function two() { const a = [...touches.values()]; return a.length < 2 ? null : { cx: (a[0].x + a[1].x) / 2, cy: (a[0].y + a[1].y) / 2, d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1 }; }
    function baseline() { const t = two(); if (!t || !g) return; Object.assign(g, { c0: t, s0: s, tx0: tx, ty0: ty }); }
    function startGesture() {
      if (!g) { const first = Math.min(...[...touches.values()].map(t => t.t)); g = { max: 0, t0: first, moved: false }; }
      g.max = Math.max(g.max, touches.size); baseline();
    }
    function updateGesture() {
      const t = two(); if (!t || !g || !g.c0) return;
      if (!g.moved && (Math.abs(t.d - g.c0.d) > 14 || Math.hypot(t.cx - g.c0.cx, t.cy - g.c0.cy) > 14)) { g.moved = true; baseline(); return; }
      if (!g.moved || touches.size !== 2) return;
      const r = box.getBoundingClientRect();
      const ns = Math.min(6, Math.max(0.6, g.s0 * t.d / g.c0.d));
      const px = (g.c0.cx - r.left - ox - g.tx0) / g.s0, py = (g.c0.cy - r.top - g.ty0) / g.s0;
      s = ns; tx = t.cx - r.left - ox - ns * px; ty = t.cy - r.top - ns * py; apply();
    }
    function endGesture() {
      const dur = now() - g.t0;
      if (!g.moved && dur < 450) {
        if (g.max === 2) undo(); else if (g.max === 3) redo(); else if (g.max >= 4 && o.onToggleUI) o.onToggleUI();
      }
      if (s < 1.08) resetView();
      g = null;
    }
    function resetView() { stage.style.transition = "transform .25s ease"; s = 1; tx = 0; ty = 0; apply(); setTimeout(() => stage.style.transition = "", 260); }

    function down(e) {
      if (e.pointerType === "pen" && !penSeen) { penSeen = true; state.penSeen = true; saveState(); }
      try { box.setPointerCapture(e.pointerId); } catch (_) {}
      if (e.pointerType === "touch") {
        if (e.width > 45 && e.height > 45) return;           // grote aanraking = handpalm
        touches.set(e.pointerId, { x: e.clientX, y: e.clientY, t: now() });
        if (!penSeen && touches.size === 1 && !g && !cur) { startStroke(e); return; }
        if (cur && cur.touch) cancelStroke();
        if (cur && !cur.touch) return;                        // pen is bezig: vingers negeren
        startGesture(); return;
      }
      if (g || cur) return;
      if (e.button && e.button !== 0) return;
      startStroke(e);
    }
    function move(e) {
      if (e.pointerType === "touch" && touches.has(e.pointerId)) {
        const t = touches.get(e.pointerId); t.x = e.clientX; t.y = e.clientY;
        if (g) { updateGesture(); return; }
      }
      if (cur && cur.id === e.pointerId) extend(e);
    }
    function up(e) {
      if (e.pointerType === "touch" && touches.has(e.pointerId)) {
        touches.delete(e.pointerId);
        if (g) { if (touches.size === 0) endGesture(); else baseline(); return; }
      }
      if (cur && cur.id === e.pointerId) endStroke();
    }
    box.addEventListener("pointerdown", down);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", e => { if (cur && cur.id === e.pointerId) cancelStroke(); touches.delete(e.pointerId); if (g && !touches.size) g = null; });
    box.addEventListener("contextmenu", e => e.preventDefault());
    box.addEventListener("wheel", e => { if (!e.ctrlKey) return; e.preventDefault(); const r = box.getBoundingClientRect(); const ns = Math.min(6, Math.max(1, s * (e.deltaY < 0 ? 1.1 : 0.9))); const px = (e.clientX - r.left - ox - tx) / s, py = (e.clientY - r.top - ty) / s; s = ns; tx = e.clientX - r.left - ox - ns * px; ty = e.clientY - r.top - ns * py; if (s <= 1.01) { s = 1; tx = ty = 0; } apply(); }, { passive: false });

    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    if (o.foto) setFoto(o.foto);
    fit();

    return {
      undo, redo, fit, resetView, flash,
      isEmpty: () => !strokes.length,
      getStrokes: () => strokes.slice(),
      setPapier(p) { papier = p; paintBgNow(); },
      setFoto,
      toImage(W = 1400, type = "image/jpeg") {
        const c = document.createElement("canvas"); c.width = W; c.height = Math.round(W * aspect);
        const kk = W / LW, x = c.getContext("2d"); paintBg(x, kk, papier, foto);
        const ink = document.createElement("canvas"); ink.width = c.width; ink.height = c.height;
        const t2 = document.createElement("canvas"); const xi = ink.getContext("2d");
        strokes.forEach(st => paintStroke(xi, st, kk, t2)); x.drawImage(ink, 0, 0);
        return c.toDataURL(type, 0.85);
      },
      destroy() { clearTimeout(holdTimer); window.removeEventListener("resize", onResize); }
    };
  }

  /* ---------- de werkplaats: knoppen rond het doek ---------- */
  function vslider(el, get, set, min, max) {
    const fill = el.querySelector(".vfill"), th = el.querySelector(".vthumb"), lab = el.querySelector(".vlab");
    function show() { const f = (get() - min) / (max - min); fill.style.height = (f * 100) + "%"; th.style.bottom = `calc(${f * 100}% - 13px)`; if (lab) lab.textContent = el.dataset.k === "alpha" ? Math.round(get() * 100) + "%" : Math.round(get()); }
    function from(e) { const r = el.getBoundingClientRect(); let f = 1 - (e.clientY - r.top) / r.height; f = Math.min(1, Math.max(0, f)); const v = min + f * (max - min); set(el.dataset.k === "alpha" ? Math.round(v * 100) / 100 : Math.round(v * 2) / 2); show(); }
    el.addEventListener("pointerdown", e => { el.setPointerCapture(e.pointerId); el.classList.add("drag"); from(e); });
    el.addEventListener("pointermove", e => { if (el.hasPointerCapture(e.pointerId)) from(e); });
    el.addEventListener("pointerup", () => { el.classList.remove("drag"); saveState(); });
    show(); return { show };
  }

  function Studio(host, o = {}) {
    host.innerHTML = `
      <div class="studio">
        <div class="studio-top">
          <div class="studio-extra"></div>
          <span class="spacer"></span>
          ${Object.entries(BRUSHES).map(([id, b]) => `<button class="dtool" data-tool="${id}" aria-label="${b.naam}">${b.icoon}<span class="tl">${b.naam}</span></button>`).join("")}
          <button class="kleur-dot" aria-label="Kleur kiezen"></button>
          <button class="dtool" data-act="vol" aria-label="Volledig scherm">⤢</button>
          <button class="dtool" data-act="help" aria-label="Gebaren">?</button>
        </div>
        <div class="studio-main">
          <div class="studio-side">
            <div class="vslider" data-k="size" aria-label="Dikte"><div class="vfill"></div><div class="vthumb"></div><div class="vlab"></div></div>
            <div class="vslider" data-k="alpha" aria-label="Dekking"><div class="vfill"></div><div class="vthumb"></div><div class="vlab"></div></div>
            <button class="dtool sq" data-act="undo" aria-label="Terug">↶</button>
            <button class="dtool sq" data-act="redo" aria-label="Opnieuw">↷</button>
          </div>
          <div class="studio-canvas"></div>
        </div>
        <div class="kleur-pop" hidden></div>
      </div>
      <button class="btn vol-uit" hidden>⤡ Knoppen terug</button>`;
    const studio = host.querySelector(".studio"), canvasHost = host.querySelector(".studio-canvas");
    const pop = host.querySelector(".kleur-pop"), volUit = host.querySelector(".vol-uit");
    if (o.extraHtml) { host.querySelector(".studio-extra").innerHTML = o.extraHtml; }

    const doek = Doek(canvasHost, {
      ...o,
      maxHeight: () => window.innerHeight - canvasHost.getBoundingClientRect().top - (window.scrollY || 0) - 14,
      onToggleUI: toggleVol
    });

    const sz = vslider(host.querySelector('[data-k="size"]'), () => state.b[state.tool].size, v => state.b[state.tool].size = Math.max(1, v), 1, 60);
    const al = vslider(host.querySelector('[data-k="alpha"]'), () => state.b[state.tool].alpha, v => state.b[state.tool].alpha = Math.max(0.05, v), 0.05, 1);
    function refresh() {
      host.querySelectorAll("[data-tool]").forEach(b => b.classList.toggle("sel", b.dataset.tool === state.tool));
      host.querySelector(".kleur-dot").style.background = state.color;
      host.querySelector('[data-k="alpha"]').classList.toggle("off", state.tool === "gum");
      sz.show(); al.show();
    }
    host.querySelectorAll("[data-tool]").forEach(b => b.onclick = () => { state.tool = b.dataset.tool; saveState(); refresh(); });
    host.querySelector('[data-act="undo"]').onclick = () => doek.undo();
    host.querySelector('[data-act="redo"]').onclick = () => doek.redo();
    host.querySelector('[data-act="vol"]').onclick = toggleVol;
    volUit.onclick = toggleVol;
    host.querySelector('[data-act="help"]').onclick = help;

    function kiesKleur(c) {
      state.color = c; state.recent = [c, ...state.recent.filter(x => x !== c)].slice(0, 6);
      if (state.tool === "gum") state.tool = "pen";
      saveState(); refresh(); pop.hidden = true;
    }
    host.querySelector(".kleur-dot").onclick = () => {
      if (!pop.hidden) { pop.hidden = true; return; }
      pop.innerHTML = `
        <div class="kleur-grid">${KLEUREN.map(c => `<button data-c="${c}" style="background:${c}" aria-label="kleur"></button>`).join("")}</div>
        ${state.recent.length ? `<p class="soft" style="margin:12px 0 6px;font-size:.8em">Laatst gebruikt</p><div class="kleur-grid">${state.recent.map(c => `<button data-c="${c}" style="background:${c}" aria-label="kleur"></button>`).join("")}</div>` : ""}
        <label class="row" style="margin-top:12px;font-size:.85em">🎨 Eigen kleur <input type="color" value="${state.color}" style="width:56px;height:40px;border:none;background:none"></label>`;
      pop.querySelectorAll("[data-c]").forEach(b => b.onclick = () => kiesKleur(b.dataset.c));
      pop.querySelector("input[type=color]").onchange = e => kiesKleur(e.target.value);
      pop.hidden = false;
    };

    function toggleVol() {
      const on = !studio.classList.contains("vol");
      studio.classList.toggle("vol", on); document.body.classList.toggle("focus-mode", on);
      volUit.hidden = !on; pop.hidden = true;
      setTimeout(() => doek.fit(), 30);
    }
    function help() {
      App.modal(`<h2>Gebaren (net als Procreate)</h2>
        <div class="gebaren">
          <div>✌️ <b>2 vingers tikken</b><br><span class="soft">terug (ongedaan maken)</span></div>
          <div>🤟 <b>3 vingers tikken</b><br><span class="soft">opnieuw</span></div>
          <div>🖐️ <b>4 vingers tikken</b><br><span class="soft">volledig scherm aan/uit</span></div>
          <div>🤏 <b>2 vingers knijpen</b><br><span class="soft">in- en uitzoomen, schuiven</span></div>
          <div>✏️ <b>Pen stil houden</b><br><span class="soft">aan het eind van een lijn: rechte lijn</span></div>
          <div>✋ <b>Hand op het scherm</b><br><span class="soft">mag gewoon, tekent niet</span></div>
        </div>
        <p class="soft" style="font-size:.85em;margin-top:12px">Links: bovenste schuifje is de dikte, onderste de dekking.</p>`, [["Top!", true]]);
    }
    if (!App.store.get("gebaren-gezien", false)) { App.store.set("gebaren-gezien", true); setTimeout(help, 300); }
    refresh();

    return {
      doek, host,
      destroy() { doek.destroy(); document.body.classList.remove("focus-mode"); }
    };
  }

  window.Doek = Doek;
  window.Studio = Studio;
})();
