/* leren.js – herbruikbare leervormen. Elk hoofdstuk levert alleen inhoud (data), deze bouwstenen doen de rest.
   Wetenschappelijke basis (zie ook CLAUDE.md):
   - ophalen uit het geheugen (testing effect) zit in sorteren, kaarten, uit-je-hoofd-tekenen en toetstraining;
   - gespreid herhalen: kaarten en vragen komen terug met groeiende tussenpozen, afgestemd op de toetsdatum;
   - door elkaar oefenen (interleaving) in de toetstraining;
   - uitgewerkte voorbeelden die stap voor stap afbouwen (worked examples / fading) bij rekenen;
   - beeld + woord (dual coding), korte stukjes (segmenting), voorlezen (lagere leesdruk);
   - zelf maken (generation effect): eigen woorden en eigen tekening bij elk begrip;
   - voorbeelden uit haar eigen wereld (context personalization). */
(function () {
  const { $, $$, esc, store, modal } = App;
  const DAG = 864e5;
  const md = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const autoLees = () => store.get("auto-voorlezen", false);
  const zg = (o, veld) => (o.zeg && o.zeg[veld]) || o[veld];   // wat de stem zegt, als dat anders is dan de tekst (formules)

  /* ================= voortgang en herhaalplanning ================= */
  function Voortgang(mod) {
    const key = "voortgang-" + mod;
    const get = () => Object.assign({ kaarten: {}, vragen: {}, gedaan: {}, geheugen: {}, toets: null }, store.get(key, {}));
    return {
      get,
      update(fn) { const v = get(); fn(v); store.set(key, v); return v; },
      klaar(onderdeel) { this.update(v => v.gedaan[onderdeel] = Date.now()); },
      // Leitner: vakje 0..4, tussenpozen in dagen. Vóór de toets komt alles nog minstens één keer terug.
      beoordeel(soort, id, oordeel) {
        this.update(v => {
          const r = v[soort][id] || { box: 0 };
          if (oordeel === "ken") r.box = Math.min(4, r.box + 1);
          else if (oordeel === "nee") r.box = 0;
          const dagen = oordeel === "nee" ? 0 : oordeel === "bijna" ? 1 : [0, 1, 2, 4, 7][r.box];
          let due = Date.now() + dagen * DAG - 3600e3;
          if (v.toets && v.toets - DAG > Date.now() && due > v.toets - DAG) due = v.toets - DAG;
          r.due = due; r.laatst = Date.now(); r.n = (r.n || 0) + 1;
          v[soort][id] = r;
        });
      },
      teDoen(soort, ids, maxNieuw = 6) {
        const v = get()[soort], nu = Date.now();
        const oud = ids.filter(id => v[id] && v[id].due <= nu);
        const nieuw = ids.filter(id => !v[id]).slice(0, maxNieuw);
        return [...oud, ...nieuw];
      },
      beheersing(ids) {
        const v = get(); const all = [...ids.kaarten.map(i => (v.kaarten[i] || { box: 0 }).box), ...ids.vragen.map(i => (v.vragen[i] || { box: 0 }).box)];
        return all.length ? all.reduce((a, b) => a + b, 0) / (all.length * 4) : 0;
      }
    };
  }

  /* ================= lightstick (voortgang in beeld) ================= */
  function lightstick(pct, label = true) {
    const p = Math.max(0, Math.min(1, pct)), h = 70 * p;
    return `<div class="lightstick"><svg viewBox="0 0 80 170" width="64" height="136" aria-hidden="true">
      <defs><radialGradient id="lsg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#B79CFF"/></radialGradient>
      <clipPath id="lsc"><circle cx="40" cy="45" r="36"/></clipPath></defs>
      <circle cx="40" cy="45" r="36" fill="rgba(255,255,255,.08)" stroke="#B79CFF" stroke-width="3"/>
      <rect x="0" y="${81 - h}" width="80" height="${h}" fill="url(#lsg)" clip-path="url(#lsc)" opacity="${0.35 + 0.65 * p}"/>
      ${p >= 1 ? `<circle cx="40" cy="45" r="44" fill="none" stroke="#FFD27A" stroke-width="2" opacity=".8"/>` : ""}
      <rect x="31" y="80" width="18" height="10" rx="3" fill="#8E7BC8"/>
      <rect x="28" y="88" width="24" height="72" rx="10" fill="#3A2E66" stroke="#B79CFF" stroke-width="2"/>
      <circle cx="40" cy="108" r="4" fill="#B79CFF"/></svg>
      ${label ? `<div class="ls-t"><b>${Math.round(p * 100)}%</b><br><span class="soft">opgeladen</span></div>` : ""}</div>`;
  }

  /* ================= kladblok (Pencil) ================= */
  function kladblok(host, aspect = 0.45, opdracht) {
    let ui = null;
    host.innerHTML = `<button class="btn ghost small kb-open">✏️ Kladblok</button><div class="kb"></div>`;
    $(".kb-open", host).onclick = () => {
      if (ui) { ui.destroy(); ui = null; $(".kb", host).innerHTML = ""; $(".kb-open", host).textContent = "✏️ Kladblok"; return; }
      ui = Studio($(".kb", host), { aspect, papier: "ruitjes", opdracht }); $(".kb-open", host).textContent = "✖ Kladblok dicht";
    };
    return { destroy() { if (ui) ui.destroy(); } };
  }

  /* ================= 1. chatverhaal met twee stemmen ================= */
  function chat(el, d, onKlaar) {
    el.innerHTML = `
      <div class="card">
        <div class="row" style="justify-content:space-between;margin-bottom:6px"><h2 style="margin:0">${esc(d.titel)}</h2>
          <div class="row"><button class="btn small" id="cplay">▶ Afspelen</button><button class="btn ghost small" id="csnd">🔊 Geluid aan</button></div></div>
        ${d.intro ? `<p class="soft">${md(d.intro)}</p>` : ""}
        <div class="chat" id="chat"></div>
        <div class="row" style="margin-top:12px"><button class="btn" id="cnext">Volgende 💬</button><span class="soft" id="cprog"></span></div>
      </div>
      <div id="na"></div>`;
    // Twee personen: de gekozen stem en, als die er is, een tweede goede stem. Toonhoogte alleen aanpassen als er maar één stem is
    // (een verschoven toonhoogte klinkt robotachtig).
    const vs = App.nlVoices().filter(v => App.stemKwaliteit(v) > 0), eerste = App.huidigeStem() || vs[0];
    const tweede = vs.find(v => v !== eerste && v.name !== (eerste && eerste.name));
    const stem = { [Object.keys(d.personen)[0]]: { voice: eerste }, [Object.keys(d.personen)[1]]: tweede ? { voice: tweede } : { voice: eerste, pitch: 0.9 } };
    Object.keys(stem).forEach(k => { if (d.personen[k].stem) stem[k].stem = d.personen[k].stem; });   // ingesproken stem per persoon
    let i = 0, playing = false, sound = true, t = null, gehoord = 0;   // gehoord: hoeveel berichten al zijn voorgelezen
    function bubble(m) {
      const p = d.personen[m.van], kant = p.kant || "links";
      const b = document.createElement("div"); b.className = "bubbel " + kant;
      b.innerHTML = `<div class="avatar" style="background:${p.kleur}">${p.emoji}</div><div class="tekst"><small>${esc(p.naam)}</small>${md(m.tekst)}</div>`;
      b.onclick = () => App.speak(m.tekst, null, stem[m.van]);
      $("#chat", el).appendChild(b);
      requestAnimationFrame(() => b.classList.add("in"));
      b.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    function voeg() {
      if (i >= d.berichten.length) return;
      const m = d.berichten[i++]; bubble(m);
      $("#cprog", el).textContent = `${i} / ${d.berichten.length}`;
      if (i >= d.berichten.length) einde();
      return m;
    }
    function einde() { playing = false; clearTimeout(t); $("#cnext", el).hidden = true; $("#cplay", el).textContent = "⟲ Opnieuw"; if (onKlaar) onKlaar($("#na", el)); }
    function stap() {
      if (!playing) return;
      // Staat er een bericht dat nog niet is voorgelezen (zoals het eerste, dat er bij openen al staat)? Dan eerst dat.
      const m = gehoord < i ? d.berichten[i - 1] : voeg(); if (!m) return;
      gehoord = i;
      if (sound) App.speak(m.tekst, () => { if (playing) t = setTimeout(stap, 450); }, stem[m.van]);
      else t = setTimeout(stap, 1400 + m.tekst.length * 40);
    }
    $("#cnext", el).onclick = () => { playing = false; App.stopSpeak(); const m = voeg(); if (m && (sound && autoLees())) { App.speak(m.tekst, null, stem[m.van]); gehoord = i; } };
    $("#cplay", el).onclick = () => {
      if (i >= d.berichten.length) { i = 0; gehoord = 0; $("#chat", el).innerHTML = ""; $("#cnext", el).hidden = false; $("#na", el).innerHTML = ""; }
      if (playing) { playing = false; App.stopSpeak(); $("#cplay", el).textContent = "▶ Afspelen"; return; }
      playing = true; $("#cplay", el).textContent = "⏸ Pauze"; stap();
    };
    $("#csnd", el).onclick = () => { sound = !sound; $("#csnd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) App.stopSpeak(); };
    voeg();
    return () => { playing = false; clearTimeout(t); };
  }

  /* ================= 2. sorteren (één kaart tegelijk, direct uitleg) ================= */
  function sorteer(el, d, onKlaar) {
    let stapel = shuffle(d.kaarten.map((_, i) => i)), fouten = new Set(), telling = {}, wacht = false;
    d.bakken.forEach(b => telling[b.id] = 0);
    function render() {
      if (!stapel.length) return klaar();
      const k = d.kaarten[stapel[0]], gedaan = d.kaarten.length - stapel.length;
      el.innerHTML = `
        <div class="card sorteer">
          <div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(d.titel)} ${d.plus ? '<span class="plus-tag">➕ Plusstof</span>' : ""}</h2><span class="soft">${gedaan} / ${d.kaarten.length}</span></div>
          ${d.uitleg ? `<p class="soft" style="margin-top:6px">${md(d.uitleg)}</p>` : ""}
          <div class="s-kaart" id="sk"><div>${md(k.t)}</div><button class="say-mini" aria-label="Lees voor">🔊</button></div>
          <div class="s-feedback" id="sf" hidden></div>
          <div class="s-bakken" style="grid-template-columns:repeat(${d.bakken.length > 3 ? 2 : d.bakken.length},1fr)">
            ${d.bakken.map(b => `<button class="s-bak" data-b="${b.id}"><span class="ic">${b.icoon}</span><b>${esc(b.naam)}</b>${b.sub ? `<small>${esc(b.sub)}</small>` : ""}<span class="tel">${"●".repeat(telling[b.id])}</span></button>`).join("")}
          </div>
        </div>`;
      $(".say-mini", el).onclick = () => App.speak(zg(k, "t"));
      if (autoLees()) App.speak(zg(k, "t"));
      $$(".s-bak", el).forEach(b => b.onclick = () => kies(b.dataset.b, k));
    }
    async function kies(bak, k) {
      if (wacht) return;
      if (bak === k.bak) {
        wacht = true; telling[bak]++;
        $("#sk", el).classList.add("goed"); $(`[data-b="${bak}"]`, el).classList.add("flits");
        setTimeout(() => { stapel.shift(); wacht = false; render(); }, 650);
      } else {
        fouten.add(stapel[0]);
        const juist = d.bakken.find(b => b.id === k.bak);
        $("#sk", el).classList.add("schud"); setTimeout(() => $("#sk", el) && $("#sk", el).classList.remove("schud"), 400);
        $(`[data-b="${k.bak}"]`, el).classList.add("hint");
        const f = $("#sf", el); f.hidden = false;
        f.innerHTML = `<b>Bijna!</b> Dit hoort bij <b>${juist.icoon} ${esc(juist.naam)}</b>.${k.uitleg ? " " + md(k.uitleg) : ""}<br><button class="btn small" id="sverder" style="margin-top:8px">Oké, verder →</button>`;
        if (autoLees()) App.speak(`Dit hoort bij ${juist.naam}. ${zg(k, "uitleg") || ""}`);
        wacht = true;
        $("#sverder", el).onclick = () => { stapel.push(stapel.shift()); wacht = false; render(); };
      }
    }
    function klaar() {
      const eerste = d.kaarten.length - fouten.size;
      el.innerHTML = `<div class="card sorteer"><h2>🎉 Alles gesorteerd!</h2>
        <p>${eerste} van de ${d.kaarten.length} in één keer goed.${fouten.size ? " De andere kwamen terug tot je ze wist. Zo leer je het juist." : " Sterk!"}</p>
        <div class="row"><button class="btn ghost" id="sopn">🔀 Nog een keer</button></div><div id="na"></div></div>`;
      $("#sopn", el).onclick = () => { stapel = shuffle(d.kaarten.map((_, i) => i)); fouten = new Set(); d.bakken.forEach(b => telling[b.id] = 0); render(); };
      if (onKlaar) onKlaar($("#na", el));
    }
    render();
  }

  /* ================= 3. begrippenkaarten: zelf maken en checken ================= */
  function kaarten(el, mod, lijst) {
    const V = Voortgang(mod);
    const eigenKey = id => `kaart-${mod}-${id}`;
    const eigen = id => store.get(eigenKey(id), {});
    let ui = null;
    const opruimen = () => { if (ui) { ui.destroy(); ui = null; } };

    function menu() {
      opruimen();
      const te = V.teDoen("kaarten", lijst.map(k => k.id));
      el.innerHTML = `
        <div class="card">
          <h2>🃏 Mijn begrippen</h2>
          <button class="say" id="lees-menu">🔊 Lees voor</button>
          <p>Maak van elk begrip <b>jouw kaart</b>: zeg of schrijf het in je eigen woorden, en maak er een klein tekeningetje bij. Wat je zelf maakt, onthoud je beter.</p>
          <div class="row"><button class="btn" id="check">🔁 Check mijn kaarten (${te.length})</button></div>
        </div>
        <div class="kaart-grid">${lijst.map(k => { const e = eigen(k.id), r = V.get().kaarten[k.id];
          return `<button class="kaart-tegel" data-id="${k.id}">${e.thumb ? `<img src="${e.thumb}" alt="">` : `<span class="ic">${k.icoon}</span>`}
            <b>${esc(k.term)}</b>${k.plus ? '<small class="plus-klein">➕ plus</small>' : ""}<small>${e.woorden ? "✍️ " : ""}${e.thumb ? "🎨 " : ""}${r ? "★".repeat(r.box) + "☆".repeat(4 - r.box) : "nieuw"}</small></button>`; }).join("")}</div>`;
      App.sayButton($("#lees-menu", el), () => ["Mijn begrippen. Maak van elk begrip jouw kaart. Zeg of schrijf het in je eigen woorden, en maak er een klein tekeningetje bij. Wat je zelf maakt, onthoud je beter.", `Er staan ${te.length} kaarten klaar om te checken.`, `De begrippen zijn: ${lijst.map(k => zg(k, "term")).join(", ")}.`]);   // vast en wisselend deel apart: het vaste deel krijgt een opname
      $("#check", el).onclick = check;
      $$(".kaart-tegel", el).forEach(b => b.onclick = () => maak(lijst.find(k => k.id === b.dataset.id)));
    }

    function maak(k) {
      opruimen();
      const e = eigen(k.id);
      el.innerHTML = `
        <div class="card kaart-maak">
          <button class="btn ghost small" id="terug">← Alle kaarten</button>
          <div class="km-kop"><span class="ic">${k.icoon}</span><h1>${esc(k.term)}</h1>${k.plus ? '<span class="plus-tag">➕ Plusstof</span>' : ""}</div>
          <button class="say" id="lees">🔊 Lees voor</button>
          <div class="km-blok"><b>Wat is het?</b><p>${md(k.uitleg)}</p></div>
          ${k.voorbeeld ? `<div class="km-blok vb"><b>Voorbeeld</b><p>${md(k.voorbeeld)}</p></div>` : ""}
          <p style="margin:16px 0 6px"><b>✍️ In mijn eigen woorden</b> <span class="soft">(typ of spreek in met 🎤)</span></p>
          <textarea id="woorden" placeholder="Zeg het zoals jij het aan een vriendin zou uitleggen…">${esc(e.woorden || "")}</textarea>
          <p style="margin:16px 0 6px"><b>🎨 Mijn tekeningetje</b> <span class="soft">(een plaatje dat jou helpt herinneren)</span></p>
          <div id="tek">${e.thumb ? `<img src="${e.thumb}" class="km-thumb" alt=""><br>` : ""}<button class="btn ghost small" id="teken">✏️ ${e.thumb ? "Ander tekeningetje" : "Tekenen"}</button></div>
          <div class="row" style="margin-top:16px"><button class="btn" id="bewaar">💾 Bewaar kaart</button><span class="ok" id="ok"></span></div>
        </div>`;
      App.sayButton($("#lees", el), () => `${zg(k, "term")}. ${zg(k, "uitleg")} ${k.voorbeeld ? "Voorbeeld: " + zg(k, "voorbeeld") : ""}`);
      $("#terug", el).onclick = menu;
      $("#woorden", el).oninput = ev => { store.set(eigenKey(k.id), { ...eigen(k.id), woorden: ev.target.value }); };
      let geplakt = null;
      const kOpdracht = { html: `Teken iets dat jou helpt om <b>${esc(k.term)}</b> te onthouden.`, zeg: `Teken iets dat jou helpt om ${zg(k, "term")} te onthouden.` };
      $("#teken", el).onclick = () => {   // eerst Procreate en plakken; het tekenbord van de app als reserve
        $("#tek", el).innerHTML = `<div id="kplak"></div>`;
        ui = { destroy: App.plakBlok($("#kplak", el), {
          opdracht: kOpdracht,
          onPlak: (groot, klein) => { geplakt = klein; $("#kplak", el).insertAdjacentHTML("beforeend", `<img src="${klein}" class="km-thumb" alt="Jouw tekeningetje">`); $(".plak-blok", el).remove(); },
          onZelf: () => {
            $("#tek", el).innerHTML = `<div id="kst"></div>`;
            ui = Studio($("#kst", el), { aspect: 0.6, papier: "wit", strokes: eigen(k.id).strokes || [], opdracht: kOpdracht });
          }
        }) };
      };
      $("#bewaar", el).onclick = () => {
        const nu = eigen(k.id); nu.woorden = $("#woorden", el).value;
        if (geplakt) { nu.thumb = geplakt; delete nu.strokes; }
        else if (ui && ui.doek && !ui.doek.isEmpty()) { nu.strokes = ui.doek.getStrokes(); nu.thumb = ui.doek.toImage(360); }
        store.set(eigenKey(k.id), nu); $("#ok", el).textContent = "✓ Bewaard"; setTimeout(menu, 600);
      };
    }

    function check() {
      opruimen();
      let rij = shuffle(V.teDoen("kaarten", lijst.map(k => k.id)));
      if (!rij.length) { modal(`<h2>Alles gecheckt 😎</h2><p>Je kaarten komen vanzelf terug als het tijd is om ze te herhalen.</p>`, [["Oké", true]]); return; }
      const stats = { ken: 0, bijna: 0, nee: 0 }; const totaal = rij.length;
      function toon() {
        if (!rij.length) return eind();
        const k = lijst.find(x => x.id === rij[0]), e = eigen(k.id), omgekeerd = Math.random() < 0.4;
        el.innerHTML = `
          <div class="card check">
            <div class="row" style="justify-content:space-between"><span class="soft">Kaart ${totaal - rij.length + 1} van ${totaal}</span><button class="btn ghost small" id="stop">Stoppen</button></div>
            <div class="flip" id="flip"><div class="flip-voor">
              ${omgekeerd ? `<p class="soft">Welk begrip is dit?</p><p class="groot-t">${md(k.uitleg)}</p>` : `<p class="soft">Wat betekent dit? Zeg het hardop of in je hoofd.</p><div class="ic">${k.icoon}</div><h1>${esc(k.term)}</h1>`}
            </div></div>
            <div class="row" style="justify-content:center;margin-top:12px"><button class="say" id="lees">🔊 Lees voor</button><button class="btn" id="draai">🔄 Draai om</button></div>
          </div>`;
        App.sayButton($("#lees", el), () => omgekeerd ? zg(k, "uitleg") : zg(k, "term"));
        if (autoLees()) App.speak(omgekeerd ? zg(k, "uitleg") : zg(k, "term"));
        $("#stop", el).onclick = menu;
        $("#draai", el).onclick = () => {
          $("#flip", el).innerHTML = `<div class="flip-achter">
            <h2>${k.icoon} ${esc(k.term)}</h2><p>${md(k.uitleg)}</p>
            ${e.woorden ? `<p class="eigen">✍️ <i>${esc(e.woorden)}</i></p>` : ""}${e.thumb ? `<img src="${e.thumb}" class="km-thumb" alt="">` : ""}</div>`;
          $("#flip", el).classList.add("om");
          $("#draai", el).outerHTML = `<div class="oordeel"><button class="btn ghost" data-o="nee">😕 Nog niet</button><button class="btn ghost" data-o="bijna">🤔 Bijna</button><button class="btn" data-o="ken">😎 Ken ik</button></div>`;
          $$("[data-o]", el).forEach(b => b.onclick = () => {
            const o = b.dataset.o; stats[o]++; V.beoordeel("kaarten", k.id, o);
            const id = rij.shift(); if (o === "nee") rij.push(id);
            toon();
          });
        };
      }
      function eind() {
        el.innerHTML = `<div class="card"><h2>Klaar! 🎉</h2><p>😎 ${stats.ken} · 🤔 ${stats.bijna} · 😕 ${stats.nee}</p>
          <p class="soft">Wat je nog niet wist, kwam meteen terug. Morgen zie je de lastige kaarten opnieuw. Zo blijft het hangen.</p>
          <button class="btn" id="terug">← Mijn kaarten</button></div>`;
        $("#terug", el).onclick = menu;
      }
      toon();
    }
    menu();
    return opruimen;
  }

  /* ================= 4. rekenen: voorbeeld → samen → zelf ================= */
  const getal = s => { if (s == null) return NaN; s = String(s).replace(/[€\s]/g, "").replace(/[−–]/g, "-"); if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, ""); return parseFloat(s.replace(",", ".")); };
  const euro = n => (n < 0 ? "− €" : "€") + Math.abs(n).toLocaleString("nl-NL");
  function trapVan(c) {
    const omzet = c.afzet * c.prijs, inkoop = c.afzet * c.inkoopPerStuk, bruto = omzet - inkoop;
    const kosten = c.kosten.reduce((a, k) => a + k.bedrag, 0), netto = bruto - kosten;
    return { omzet, inkoop, bruto, kosten, netto };
  }
  function rekenen(el, cfg, onKlaar) {
    const NAMEN = ["afzet", "omzet", "inkoopwaarde van de omzet", "brutowinst", "bedrijfskosten", "nettowinst"];
    let ronde = 0;
    const rondes = [
      { mode: "voorbeeld", titel: "1 · Kijk mee", sub: "Ik reken het voor. Tik op ‘Volgende stap’.", c: cfg.voorbeeld },
      { mode: "samen", titel: "2 · Samen", sub: "De eerste stap staat er al. Jij doet de rest.", c: cfg.samen },
      { mode: "zelf", titel: "3 · Zelf", sub: "Nu helemaal zelf. Elke keer een nieuw bedrijfje.", c: null }
    ];
    function render() {
      const R = rondes[ronde]; const c = R.c || cfg.maak();
      const T = trapVan(c);
      const stappen = [
        { naam: "omzet", formule: `afzet × verkoopprijs`, som: `${c.afzet} × ${euro(c.prijs)}`, antwoord: T.omzet, hint: `Vermenigvuldig het aantal (${c.afzet}) met de prijs (${euro(c.prijs)}).` },
        { naam: "brutowinst", formule: `omzet − inkoopwaarde van de omzet`, som: R.mode === "voorbeeld" ? `${euro(T.omzet)} − ${euro(T.inkoop)}` : `${euro(T.omzet)} − (${c.afzet} × ${euro(c.inkoopPerStuk)})`, antwoord: T.bruto, hint: `Reken eerst de inkoopwaarde uit: ${c.afzet} × ${euro(c.inkoopPerStuk)} = ${euro(T.inkoop)}. Haal dat van de omzet af.` },
        { naam: "nettowinst", formule: `brutowinst − bedrijfskosten`, som: R.mode === "voorbeeld" || c.kosten.length === 1 ? `${euro(T.bruto)} − ${euro(T.kosten)}` : `${euro(T.bruto)} − (${c.kosten.map(k => euro(k.bedrag)).join(" + ")})`, antwoord: T.netto, hint: `Tel eerst alle bedrijfskosten op: ${c.kosten.map(k => euro(k.bedrag)).join(" + ")} = ${euro(T.kosten)}.` }
      ];
      el.innerHTML = `
        <div class="card reken">
          <div class="row ronde-rij">${rondes.map((r, i) => `<button class="chip ${i === ronde ? "sel" : ""}" data-r="${i}">${r.titel}</button>`).join("")}</div>
          <p class="soft" style="margin:8px 0 12px">${R.sub}</p>
          <div class="casus"><div class="ic">${c.icoon}</div><div><b>${esc(c.naam)}</b><p style="margin:4px 0 0">${md(c.verhaal)}</p></div><button class="say-mini" id="lc">🔊</button></div>
          <div class="feiten">
            <div><span>Verkocht</span><b>${c.afzet} stuks</b></div>
            <div><span>Prijs per stuk</span><b>${euro(c.prijs)}</b></div>
            <div><span>Inkoop per stuk</span><b>${euro(c.inkoopPerStuk)}</b></div>
            <div><span>Andere kosten</span><b>${c.kosten.map(k => `${esc(k.naam)} ${euro(k.bedrag)}`).join("<br>")}</b></div>
          </div>
          <div id="stappen"></div>
          <div id="eind"></div>
        </div>`;
      $$("[data-r]", el).forEach(b => b.onclick = () => { ronde = +b.dataset.r; render(); });
      App.sayButton($("#lc", el), () => c.verhaal, { audio: null });   // willekeurige som: geen opname
      let s = 0;
      const box = $("#stappen", el);
      function stap(i) {
        const st = stappen[i], gegeven = R.mode === "voorbeeld" || (R.mode === "samen" && i === 0);
        const opties = shuffle([st.naam, ...shuffle(NAMEN.filter(n => n !== st.naam)).slice(0, 2)]);
        const d = document.createElement("div"); d.className = "trede";
        d.innerHTML = `<div class="trede-n">${i + 1}</div><div class="trede-in">
          <div class="formule">${gegeven ? `<b>${st.naam}</b> = ${st.formule}` : `<b>?</b> = ${st.formule.replace(/^/, "")}`}</div>
          <div class="som">${st.som} = ${gegeven ? `<b>${euro(st.antwoord)}</b>` : `<input inputmode="decimal" class="ant" placeholder="€" aria-label="Antwoord">`}</div>
          ${gegeven ? "" : `<div class="naam-kies"><span class="soft">Hoe heet dit bedrag?</span> ${opties.map(o => `<button class="chip small" data-n="${esc(o)}">${esc(o)}</button>`).join("")}</div>
            <div class="row"><button class="btn small chk">Check ✓</button><span class="fb"></span></div>`}
        </div>`;
        box.appendChild(d);
        if (gegeven) {
          if (R.mode === "voorbeeld") App.speak(`${st.naam} is ${st.formule}. ${st.som.replace(/×/g, "keer").replace(/−/g, "min")} is ${euro(st.antwoord)}.`, null, { audio: null });
          return volgende(i, true);
        }
        let naam = null, pogingen = 0;
        $$("[data-n]", d).forEach(b => b.onclick = () => { naam = b.dataset.n; $$("[data-n]", d).forEach(x => x.classList.toggle("sel", x === b)); });
        $(".ant", d).focus({ preventScroll: true });
        $(".chk", d).onclick = () => {
          const v = getal($(".ant", d).value), fb = $(".fb", d);
          const okGetal = Math.abs(v - st.antwoord) < 0.01, okNaam = naam === st.naam;
          if (okGetal && okNaam) {
            fb.innerHTML = `<span class="goed-t">✓ Goed! ${st.naam}${st.naam === "nettowinst" && st.antwoord < 0 ? " is negatief: dat is <b>verlies</b>." : ""}</span>`;
            $(".chk", d).remove(); $(".ant", d).disabled = true; $$("[data-n]", d).forEach(b => b.disabled = true);
            return volgende(i, pogingen === 0);
          }
          pogingen++;
          const wat = !okGetal && !okNaam ? "Het bedrag en de naam kloppen nog niet." : !okGetal ? "De naam klopt! Het bedrag nog niet." : "Het bedrag klopt! Kies nog de goede naam.";
          fb.innerHTML = `<span class="fout-t">${wat}</span> ${pogingen === 1 ? `<br>💡 ${md(st.hint)}` : `<br>Het antwoord is <b>${euro(st.antwoord)}</b> en het heet <b>${st.naam}</b>. Vul het in, dan ga je door.`}`;
        };
      }
      const goed = [];
      function volgende(i, inEens) {
        goed.push(inEens);
        if (i + 1 < stappen.length) {
          if (R.mode === "voorbeeld") { const b = document.createElement("button"); b.className = "btn small"; b.textContent = "Volgende stap →"; b.style.margin = "6px 0 10px 54px"; box.appendChild(b); b.onclick = () => { b.remove(); stap(i + 1); }; }
          else stap(i + 1);
          return;
        }
        const neg = T.netto < 0;
        $("#eind", el).innerHTML = `<div class="reken-eind ${neg ? "neg" : ""}">${neg ? `😬 <b>Verlies</b> van ${euro(-T.netto)}. De bedrijfskosten waren hoger dan de brutowinst.` : `🎉 Nettowinst: <b>${euro(T.netto)}</b>.`}
          <div class="row" style="margin-top:10px">${ronde < 2 ? `<button class="btn" id="vd">Volgende ronde →</button>` : `<button class="btn" id="vd">🎲 Nog een bedrijfje</button>`}</div></div>`;
        if (ronde === 2 && onKlaar) onKlaar();
        $("#vd", el).onclick = () => { if (ronde < 2) ronde++; render(); el.scrollIntoView({ behavior: "smooth" }); };
      }
      stap(0);
    }
    render();
  }

  /* ================= 5. toetstraining (door elkaar, in toetstaal) ================= */
  const TOETSWOORDEN = /\b(Noem|Leg uit|Bereken|Geef|Waarom|Verklaar|Wat is|Wat betekent|Welke|Hoe heet|Los op|Teken|Onderzoek|Controleer|Licht toe|Stel|één|twee|drie|vier|vijf|niet)\b/g;
  const TIPS = {
    noem: "<b>Noem</b> = alleen opschrijven, uitleg is niet nodig. Let op het <b>aantal</b> dat ze vragen!",
    uitleg: "<b>Leg uit</b> = zeg wat het is <b>én</b> waarom. Gebruik <i>want</i>, <i>omdat</i> of <i>dus</i>.",
    reken: "<b>Bereken</b> = schrijf de formule op, vul de getallen in, reken uit. Zet <b>€</b> bij je antwoord.",
    keuze: "Lees <b>alle</b> antwoorden voordat je kiest. Streep weg wat zeker niet klopt."
  };
  function toets(el, mod, vragen, onKlaar) {
    const V = Voortgang(mod);
    let kb = null;
    function start() {
      const te = V.teDoen("vragen", vragen.map(v => v.id), 8);
      if (!te.length) {
        el.innerHTML = `<div class="card"><h2>📝 Toetstraining</h2><button class="say" data-say="Voor nu heb je alle vragen gedaan. Ze komen terug als het tijd is. Je kunt ook toch oefenen, met alles door elkaar.">🔊 Lees voor</button><p>Voor nu heb je alle vragen gedaan 😎 Ze komen terug als het tijd is.</p>
          <button class="btn ghost" id="toch">Toch oefenen (alles door elkaar)</button></div>`;
        App.bindSay(el);
        $("#toch", el).onclick = () => sessie(shuffle(vragen.map(v => v.id)).slice(0, 8));
        return;
      }
      el.innerHTML = `<div class="card"><h2>📝 Toetstraining</h2>
        <button class="say" id="lees-toets">🔊 Lees voor</button>
        <p>Vragen zoals op je toets, <b>door elkaar</b>. Dat voelt lastiger, maar zo leer je kiezen welke aanpak je nodig hebt. Precies wat je op de toets moet doen.</p>
        <p class="soft">Geen punten, geen tijd. Bij elke vraag kun je voorlezen, je kladblok gebruiken en een tip krijgen.</p>
        <button class="btn" id="go">Start (${te.length} vragen)</button></div>`;
      App.sayButton($("#lees-toets", el), () => ["Toetstraining. Vragen zoals op je toets, door elkaar. Dat voelt lastiger, maar zo leer je kiezen welke aanpak je nodig hebt. Precies wat je op de toets moet doen. Geen punten, geen tijd. Bij elke vraag kun je voorlezen, je kladblok gebruiken en een tip krijgen.", `Er staan ${te.length} vragen klaar.`]);
      $("#go", el).onclick = () => sessie(shuffle(te));
    }
    function sessie(rij) {
      const stats = { ken: 0, bijna: 0, nee: 0 }, totaal = rij.length;
      function toon() {
        if (kb) { kb.destroy(); kb = null; }
        if (!rij.length) return eind();
        const q = vragen.find(v => v.id === rij[0]);
        const vraagHtml = md(q.vraag).replace(TOETSWOORDEN, "<mark>$1</mark>");
        el.innerHTML = `
          <div class="card tvraag">
            <div class="row" style="justify-content:space-between"><span class="soft">Vraag ${totaal - rij.length + 1} van ${totaal} · ${esc(q.par || "")} ${q.plus ? '<span class="plus-tag">➕ Plusstof</span>' : ""}</span><button class="btn ghost small" id="stop">Stoppen</button></div>
            <div class="vraag">${vraagHtml}</div>
            <div class="row"><button class="say" id="lees" style="margin:0">🔊 Lees voor</button><button class="btn ghost small" id="tip">💡 Hoe pak ik dit aan?</button></div>
            <div class="tipbox" id="tipbox" hidden>${q.tip || TIPS[q.type] || ""}</div>
            ${q.beeld ? `<div class="opg-beeld" id="tbeeld"></div>` : ""}
            <div id="antw" style="margin-top:12px"></div>
            <div id="kb" style="margin-top:12px"></div>
            <div id="fb"></div>
          </div>`;
        App.sayButton($("#lees", el), () => zg(q, "vraag") + (q.keuzes ? ". " + (zg(q, "keuzes") || q.keuzes).map((k, i) => "ABCD"[i] + ": " + k).join(". ") : ""));
        if (autoLees()) App.speak(zg(q, "vraag"));
        $("#tip", el).onclick = () => { $("#tipbox", el).hidden = !$("#tipbox", el).hidden; };
        $("#stop", el).onclick = start;
        if (q.beeld) schetsStil($("#tbeeld", el), q.beeld, q.beeldMaat);
        kb = kladblok($("#kb", el), 0.45, () => ({ html: vraagHtml + (q.beeld ? `<div class="op-beeld">${$("#tbeeld", el).innerHTML}</div>` : ""), zeg: zg(q, "vraag") }));
        const A = $("#antw", el), F = $("#fb", el);
        const oordeel = (auto) => {
          F.insertAdjacentHTML("beforeend", auto ? `<div class="row" style="margin-top:12px"><button class="btn" id="vd">Volgende →</button></div>` :
            `<p style="margin:14px 0 6px"><b>Hoe ging het?</b></p><div class="oordeel"><button class="btn ghost" data-o="nee">😕 Nog niet</button><button class="btn ghost" data-o="bijna">🤔 Bijna</button><button class="btn" data-o="ken">😎 Ken ik</button></div>`);
          const verder = o => { stats[o]++; V.beoordeel("vragen", q.id, o); const id = rij.shift(); if (o === "nee") rij.push(id); toon(); };
          if (auto) $("#vd", el).onclick = () => verder(auto); else $$("[data-o]", el).forEach(b => b.onclick = () => verder(b.dataset.o));
        };
        if (q.type === "reken") {
          // q.velden = ["x", "y"]: meerdere vakjes (antwoord is dan een lijst). q.euro === false: gewone getallen, ook breuken.
          const velden = q.velden || [null], ants = [].concat(q.antwoord), geld = q.euro !== false;
          A.innerHTML = `<div class="row">${velden.map((v, i) => `${v ? `<span class="veld-n">${esc(v)} =</span>` : ""}<input inputmode="${geld ? "decimal" : "text"}" autocomplete="off" autocapitalize="off" class="ant groot-in" data-i="${i}" placeholder="${geld ? "€ jouw antwoord" : "jouw antwoord"}">`).join("")}<button class="btn" id="chk">Check ✓</button></div>`;
          const toon = q.toon || (geld ? euro(q.antwoord) : ants.join(" en "));
          let p = 0;
          $("#chk", el).onclick = () => {
            const ok = ants.every((a, i) => { const s = $(`.ant[data-i="${i}"]`, el).value; return Math.abs((geld ? getal(s) : waarde(s)) - a) < 0.01; });
            if (ok) { $("#chk", el).remove(); F.innerHTML = `<div class="model goed">✓ Goed! ${md(q.uitwerking)}</div>`; oordeel(p === 0 ? "ken" : "bijna"); }
            else if (++p === 1) F.innerHTML = `<div class="model">Nog niet. 💡 ${md(q.hint || "Kijk nog eens naar de formule.")}</div>`;
            else { $("#chk", el).remove(); F.innerHTML = `<div class="model">Het antwoord is <b>${md(toon)}</b>.<br>${md(q.uitwerking)}</div>`; oordeel("nee"); }
          };
        } else if (q.type === "keuze") {
          A.innerHTML = `<div class="keuzes">${q.keuzes.map((k, i) => `<button class="keuze" data-i="${i}"><b>${"ABCD"[i]}</b> ${md(k)}</button>`).join("")}</div>`;
          $$(".keuze", el).forEach(b => b.onclick = () => {
            const i = +b.dataset.i, ok = i === q.goed;
            $$(".keuze", el).forEach(x => { x.disabled = true; if (+x.dataset.i === q.goed) x.classList.add("goed"); });
            if (!ok) b.classList.add("fout");
            F.innerHTML = `<div class="model ${ok ? "goed" : ""}">${ok ? "✓ Goed! " : "Het goede antwoord is <b>" + "ABCD"[q.goed] + "</b>. "}${md(q.uitleg || "")}</div>`;
            oordeel(ok ? "ken" : "nee");
          });
        } else {
          A.innerHTML = `<p class="soft" style="margin:0 0 8px">Geef eerst zelf antwoord: hardop, in je kladblok of hieronder (🎤 inspreken mag).</p>
            <textarea class="klein-ta" placeholder="Mijn antwoord…"></textarea>
            <button class="btn" id="zie" style="margin-top:8px">👀 Bekijk het antwoord</button>`;
          $("#zie", el).onclick = () => {
            $("#zie", el).remove();
            F.innerHTML = `<div class="model"><b>Een goed antwoord:</b><br>${md(q.antwoord)}
              ${q.punten ? `<p style="margin:10px 0 4px"><b>Check: heb jij dit?</b></p>${q.punten.map((p, i) => `<label class="punt"><input type="checkbox"> ${md(p)}</label>`).join("")}` : ""}</div>`;
            oordeel(null);
          };
        }
      }
      function eind() {
        el.innerHTML = `<div class="card"><h2>Klaar met oefenen 🎉</h2><p>😎 ${stats.ken} · 🤔 ${stats.bijna} · 😕 ${stats.nee}</p>
          <p class="soft">Wat nog niet lukte, komt morgen terug. Elke keer een beetje, dat werkt beter dan alles op de laatste avond.</p>
          <button class="btn" id="opn">↻ Terug naar start</button></div>`;
        $("#opn", el).onclick = start;
        if (onKlaar) onKlaar();
      }
      toon();
    }
    start();
    return () => { if (kb) kb.destroy(); };
  }

  /* ================= 6. uit je hoofd tekenen (vrij ophalen) ================= */
  function geheugen(el, mod, prompts) {
    const V = Voortgang(mod);
    let ui = null;
    const opr = () => { if (ui) { ui.destroy(); ui = null; } };
    function menu() {
      opr();
      const g = V.get().geheugen;
      const sorted = prompts.slice().sort((a, b) => (g[a.id]?.laatst || 0) - (g[b.id]?.laatst || 0));
      el.innerHTML = `<div class="card"><h2>🧠 Uit je hoofd</h2>
        <button class="say" id="lees-geh">🔊 Lees voor</button>
        <p>Teken een plaat <b>zonder te kijken</b>. Daarna vergelijk je. Het voelt moeilijk, en juist dat moeilijke ophalen zorgt dat het blijft hangen.</p>
        <p class="soft">Tip: de bovenste heb je het langst niet gedaan.</p></div>
        <div class="menu-lijst">${sorted.map(p => `<button class="btn ghost geh-kies" data-id="${p.id}"><span style="font-size:1.4em;margin-right:10px">${p.icoon}</span> ${esc(p.titel)}
          <span class="soft" style="margin-left:auto;font-size:.8em">${g[p.id] ? "✓ " + new Date(g[p.id].laatst).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "nog niet"}</span></button>`).join("")}</div>`;
      App.sayButton($("#lees-geh", el), () => ["Uit je hoofd. Teken een plaat zonder te kijken. Daarna vergelijk je. Het voelt moeilijk, en juist dat moeilijke ophalen zorgt dat het blijft hangen. Kies een plaat. De bovenste heb je het langst niet gedaan. De platen zijn:", ...sorted.map(p => p.titel + ".")]);   // volgorde wisselt: elke titel apart
      $$(".geh-kies", el).forEach(b => b.onclick = () => teken(prompts.find(p => p.id === b.dataset.id)));
    }
    function teken(p) {   // eerst Procreate en plakken; het tekenbord van de app als reserve
      opr();
      const opdracht = { html: `<b>${esc(p.titel)}</b><br>${md(p.opdracht)}`, zeg: `${p.titel}. ${p.opdracht}` };
      el.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><b>${p.icoon} Teken uit je hoofd</b><button class="btn ghost small" id="terug">← Terug</button></div>
        <p class="soft" style="margin:6px 0 10px">Niet kijken! Daarna vergelijk je.</p><div id="plak"></div></div>`;
      $("#terug", el).onclick = menu;
      ui = { destroy: App.plakBlok($("#plak", el), { opdracht, onPlak: groot => { opr(); vergelijk(p, groot, null); }, onZelf: () => zelf(p, opdracht) }) };
    }
    function zelf(p, opdracht) {
      opr();
      el.innerHTML = `<div class="card geh-kop"><b>${p.icoon} Teken uit je hoofd: ${esc(p.titel)}</b>
        <div class="row" style="margin-top:10px"><button class="btn" id="klaar">✅ Klaar, laat zien</button><button class="btn ghost small" id="terug">← Terug</button></div></div><div id="st"></div>`;
      ui = Studio($("#st", el), { aspect: 0.75, papier: "wit", opdracht });
      $("#terug", el).onclick = menu;
      $("#klaar", el).onclick = () => { const s = ui.doek.getStrokes(), b = ui.doek.toImage(1200); opr(); vergelijk(p, b, s); };
    }
    function vergelijk(p, beeld, strokes) {
      opr();
      el.innerHTML = `<div class="card"><h2>Vergelijk 🔍</h2>
        <div class="vergelijk"><div><p class="soft">Jouw tekening</p><img src="${beeld}" alt=""></div><div><p class="soft">Zo ziet het eruit</p><div class="model-plaat">${p.model}</div></div></div>
        <p style="margin:14px 0 6px"><b>Wat had je al?</b></p>
        ${p.check.map(c => `<label class="punt"><input type="checkbox"> ${md(c)}</label>`).join("")}
        <div class="row" style="margin-top:14px"><button class="btn" id="bew">💾 Bewaar in Mijn tekeningen</button><button class="btn ghost" id="terug">← Andere plaat</button><span class="ok" id="ok"></span></div></div>`;
      V.update(v => v.geheugen[p.id] = { laatst: Date.now() });
      $("#terug", el).onclick = menu;
      $("#bew", el).onclick = async () => {
        await App.db.put("tekeningen", { id: "t" + Date.now(), datum: Date.now(), titel: "Uit mijn hoofd: " + p.titel, tag: "geheugen", data: beeld, ...(strokes ? { strokes } : {}), aspect: 0.75 });
        $("#ok", el).textContent = "✓ Bewaard";
      };
    }
    menu();
    return opr;
  }

  /* ================= 7. tijdlijn: gebeurtenissen op volgorde zetten ================= */
  // d = { titel, uitleg, rondes: [{ naam, items: [{ wanneer (getal om te sorteren), jaar (tekst), t, uitleg? }] }], alles: aantal voor de ronde 'door elkaar' }
  // Ze tikt steeds de gebeurtenis die het eerst kwam. Goed: hij schuift op de tijdlijn, met jaartal. Fout: hij schudt en ze krijgt een tip.
  function tijdlijn(el, d, onKlaar) {
    const rondes = d.rondes.slice();
    if (d.alles) rondes.push({ naam: "🔀 Alles door elkaar", alles: true });
    let ronde = 0, gelegd = [], over = [], fouten = 0, wacht = false;
    const klaarRondes = new Set();
    function kiesItems(r) {
      if (!r.alles) return r.items.slice();
      const pool = shuffle(d.rondes.flatMap(x => x.items)), jaren = new Set(), uit = [];
      for (const it of pool) { const j = Math.floor(it.wanneer); if (!jaren.has(j)) { jaren.add(j); uit.push(it); } if (uit.length >= d.alles) break; }
      return uit;
    }
    function start(i) { ronde = i; const r = rondes[i]; over = shuffle(kiesItems(r)); gelegd = []; fouten = 0; wacht = false; render(); }
    function render() {
      const r = rondes[ronde];
      el.innerHTML = `
        <div class="card tijdlijn">
          <div class="row ronde-rij">${rondes.map((x, i) => `<button class="chip small ${i === ronde ? "sel" : ""}" data-r="${i}">${esc(x.naam)}${klaarRondes.has(i) ? " ✓" : ""}</button>`).join("")}</div>
          <h2 style="margin:12px 0 4px">${esc(d.titel)}</h2>
          <button class="say" id="lees-tl">🔊 Lees voor</button>
          ${d.uitleg ? `<p class="soft" style="margin-top:0">${md(d.uitleg)}</p>` : ""}
          <ol class="tl-lijn">${gelegd.map(it => `<li><span class="tl-jaar">${esc(it.jaar)}</span><span>${md(it.t)}</span></li>`).join("")}
            ${over.length ? `<li class="tl-leeg"><span class="tl-jaar">?</span><span class="soft">Wat kwam hierna?</span></li>` : ""}</ol>
          <div class="s-feedback" id="tf" hidden></div>
          ${over.length ? `<p style="margin:14px 0 6px"><b>Tik op wat het eerst gebeurde.</b> <span class="soft">(${gelegd.length} / ${gelegd.length + over.length})</span></p>
          <div class="tl-items">${over.map((it, i) => `<div class="tl-item" data-i="${i}"><button class="tl-kies" data-i="${i}">${md(it.t)}</button><button class="say-mini" id="tls-${i}" data-i="${i}" aria-label="Lees voor">🔊</button></div>`).join("")}</div>`
          : `<div class="reken-eind"><b>🎉 Op volgorde!</b> ${fouten ? `${fouten} keer een tip nodig gehad. Doe de ronde later nog eens.` : "In één keer goed. Sterk!"}
              <div class="row" style="margin-top:10px">${ronde + 1 < rondes.length ? `<button class="btn" id="tvolg">Volgende ronde →</button>` : ""}<button class="btn ghost" id="topn">↻ Nog een keer</button></div></div>`}
        </div><div id="na"></div>`;
      App.sayButton($("#lees-tl", el), () => [d.titel + ". " + (d.uitleg || "").replace(/\*\*/g, ""), "Tik op wat het eerst gebeurde."]);
      $$("[data-r]", el).forEach(b => b.onclick = () => start(+b.dataset.r));
      $$(".tl-item .say-mini", el).forEach(b => b.onclick = () => App.speak(over[+b.dataset.i].t));
      $$(".tl-kies", el).forEach(b => b.onclick = () => kies(+b.dataset.i));
      if (!over.length) {
        klaarRondes.add(ronde);
        const v = $("#tvolg", el); if (v) v.onclick = () => start(ronde + 1);
        $("#topn", el).onclick = () => start(ronde);
        if (klaarRondes.size >= d.rondes.length && onKlaar) onKlaar($("#na", el));
      }
    }
    function kies(i) {
      if (wacht) return;
      const eerste = over.reduce((m, it) => it.wanneer < m.wanneer ? it : m, over[0]);
      const it = over[i];
      if (it === eerste) {
        wacht = true; $(`.tl-item[data-i="${i}"]`, el).classList.add("goed");
        setTimeout(() => { gelegd.push(it); over.splice(i, 1); wacht = false; render(); }, 450);
      } else {
        fouten++;
        const b = $(`.tl-item[data-i="${i}"]`, el); b.classList.add("schud"); setTimeout(() => b.classList.remove("schud"), 400);
        const f = $("#tf", el); f.hidden = false;
        const tip = "Nog niet. Dit gebeurde later. Er is iets dat eerder kwam.";
        f.innerHTML = `<b>${tip}</b>${eerste.tip ? `<br>💡 ${md(eerste.tip)}` : ""}`;
        if (autoLees()) App.speak(tip);
      }
    }
    start(0);
  }

  /* ================= 8. filmpje: scènes met beeld, tekst en voorlezen ================= */
  // d = { titel, intro, teken (tag voor 'Ga tekenen'), kaart?, scenes: [{ beeld, jaar?, t (met **vet**), s? (voorleestekst), anim?, kaart? }] }
  // Twee soorten beeld:
  // - beeld: één of meer emoji, gescheiden door spaties. Ze komen na elkaar binnen en bewegen zacht.
  //   anim: "mars" (lopen van links naar rechts), "schud" (trillen), "zoom".
  // - kaart: een spelbord met landen (d.kaart). Per scène: kleur (land → kamp a/b/n), toon, weg, klein (lopen door naar
  //   volgende scènes), en alleen voor deze scène: focus, pijlen, front, iconen.
  //   d.kaart = { landen: { id: { naam, x, y, label?: "boven"|"links"|"rechts", verborgen? } }, kampen: { a: { naam, kleur }, b: {…}, n: {…} } }
  //   pijl = { van, naar, via?: id of [x,y], soort: "oorlog"|"hulp"|"trek"|"geld", label?, lp?: [x,y] (plek van het label), bocht? }
  //   icoon = { e, at: id of [x,y], naar?: id of [x,y], anim?: "puls"|"val" }
  const PIJLKLEUR = { oorlog: "#E5534B", hulp: "#4C8DF6", trek: "#F0A23A", geld: "#E8C547" };
  function kaartBord(K) {
    return `<svg class="kaart-svg" viewBox="0 0 100 66" role="img" aria-label="Kaart van Europa">
      <defs><pattern id="kstip" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".35" class="k-stip"/></pattern></defs>
      <rect x="0" y="0" width="100" height="66" fill="url(#kstip)"/>
      <g class="k-front"></g>
      <g class="k-landen">${Object.entries(K.landen).map(([id, l]) => {
        const regels = l.naam.split("\n"), pos = l.label || "onder";
        const tx = pos === "links" ? -6.2 : pos === "rechts" ? 6.2 : 0, anchor = pos === "links" ? "end" : pos === "rechts" ? "start" : "middle";
        const ty = pos === "boven" ? -6.6 - (regels.length - 1) * 3 : pos === "onder" ? 8.4 : 1 - (regels.length - 1) * 1.5;
        return `<g class="land ${l.verborgen ? "verborgen" : ""}" data-l="${id}" transform="translate(${l.x} ${l.y})"><g class="land-in">
          <circle r="4.6"/><path class="kruis" d="M-3 -3L3 3M3 -3L-3 3"/>
          <text x="${tx}" y="${ty}" text-anchor="${anchor}">${regels.map((r, i) => `<tspan x="${tx}" dy="${i ? 3 : 0}">${esc(r)}</tspan>`).join("")}</text></g></g>`; }).join("")}</g>
      <g class="k-pijlen"></g><g class="k-iconen"></g>
    </svg>
    <div class="k-legenda"></div>`;
  }
  function kaartStand(d, tot) {   // wat doorloopt: kleur, toon, weg, klein (opgeteld tot en met scène 'tot')
    const st = { kleur: {}, toon: new Set(), weg: new Set(), klein: new Set() };
    d.scenes.slice(0, tot + 1).forEach(sc => { const k = sc.kaart; if (!k) return;
      Object.assign(st.kleur, k.kleur || {}); (k.toon || []).forEach(x => st.toon.add(x));
      (k.weg || []).forEach(x => st.weg.add(x)); (k.klein || []).forEach(x => st.klein.add(x)); });
    return st;
  }
  function tekenKaart(box, d, i) {
    const K = d.kaart, k = d.scenes[i].kaart, st = kaartStand(d, i), svg = $("svg", box);
    const punt = p => Array.isArray(p) ? { x: p[0], y: p[1], r: 0 } : { x: K.landen[p].x, y: K.landen[p].y, r: 5.6 };
    $$(".land", svg).forEach(g => {
      const id = g.dataset.l, l = K.landen[id];
      g.setAttribute("class", `land kamp-${st.kleur[id] || "n0"}${l.verborgen && !st.toon.has(id) ? " verborgen" : ""}${st.weg.has(id) ? " weg" : ""}${st.klein.has(id) ? " klein" : ""}${(k.focus || []).includes(id) ? " focus" : ""}`);
      const c = (K.kampen[st.kleur[id]] || {}).kleur; $("circle", g).style.fill = c || "";
    });
    $(".k-pijlen", svg).innerHTML = (k.pijlen || []).map((p, n) => {
      const A = punt(p.van), B = punt(p.naar), kleur = PIJLKLEUR[p.soort || "oorlog"];
      let C;
      if (p.via) { const V = punt(p.via); C = { x: 2 * V.x - (A.x + B.x) / 2, y: 2 * V.y - (A.y + B.y) / 2 }; }
      else { const dx = B.x - A.x, dy = B.y - A.y, b = p.bocht ?? 0.18; C = { x: (A.x + B.x) / 2 - dy * b, y: (A.y + B.y) / 2 + dx * b }; }
      const kort = (P, Q, r) => { const dx = Q.x - P.x, dy = Q.y - P.y, l = Math.hypot(dx, dy) || 1; return { x: P.x + dx / l * r, y: P.y + dy / l * r }; };
      const s = kort(A, C, A.r), e = kort(B, C, B.r + 1.2), hoek = Math.atan2(e.y - C.y, e.x - C.x) * 180 / Math.PI;
      const m = { x: .25 * s.x + .5 * C.x + .25 * e.x, y: .25 * s.y + .5 * C.y + .25 * e.y }, vertraging = 0.3 + n * 0.7;
      return `<g class="pijl ${p.soort || "oorlog"}" style="--kleur:${kleur};--wacht:${vertraging}s">
        <path pathLength="1" d="M${s.x} ${s.y}Q${C.x} ${C.y} ${e.x} ${e.y}"/>
        <path class="punt" d="M0 0L-3 -1.8L-3 1.8z" transform="translate(${e.x} ${e.y}) rotate(${hoek})"/>
        ${p.label ? `<text x="${p.lp ? p.lp[0] : m.x}" y="${p.lp ? p.lp[1] : m.y - 1.6}" text-anchor="middle">${esc(p.label)}</text>` : ""}</g>`;
    }).join("");
    $(".k-front", svg).innerHTML = k.front ? `<polyline pathLength="1" points="${k.front.map(p => p.join(",")).join(" ")}"/>` : "";
    const ic = $(".k-iconen", svg);
    ic.innerHTML = (k.iconen || []).map((x, n) => { const P = punt(x.at);
      return `<g class="k-ico ${x.anim || ""}" style="--wacht:${0.2 + n * 0.4}s" data-n="${n}" transform="translate(${P.x} ${P.y})"><g class="k-ico-in"><text text-anchor="middle" y="2.4">${x.e}</text></g></g>`; }).join("");
    (k.iconen || []).forEach((x, n) => { if (!x.naar) return;
      const A = punt(x.at), B = punt(x.naar), g = $(`[data-n="${n}"] .k-ico-in`, ic);
      setTimeout(() => { if (g.isConnected) { g.style.transition = "transform 1.8s ease-in-out"; g.style.transform = `translate(${B.x - A.x}px, ${B.y - A.y}px)`; } }, 900); });
    const kampen = [...new Set(Object.values(st.kleur))].filter(x => K.kampen[x]);
    $(".k-legenda", box).innerHTML = kampen.map(x => `<span><i style="background:${K.kampen[x].kleur}"></i>${esc(K.kampen[x].naam)}</span>`).join("");
  }

  function filmpje(el, d, onEind) {
    const S = d.scenes.slice();
    if (d.teken) S.push({ beeld: "✏️ 🎨", t: "**Jouw beurt.** Teken één plaatje van wat je onthoudt.", knop: true });
    const D = { ...d, scenes: S };
    el.innerHTML = `
      <div class="card">
        <h1>${esc(d.titel)}</h1>
        ${d.intro ? `<p class="soft">${md(d.intro)}</p>` : ""}
        <div class="stage film">
          <div class="sc-jaar" id="scj"></div>
          ${d.kaart ? `<div class="sc-kaart" id="sck">${kaartBord(d.kaart)}</div>` : ""}
          <div class="sc-beeld" id="scb"></div>
        </div>
        <div class="caption" id="caption"></div>
        <div class="ctrl">
          <button class="btn" id="play">▶ Afspelen</button>
          <button class="btn ghost" id="prev" aria-label="Vorige scène">◀</button>
          <button class="btn ghost" id="nextS" aria-label="Volgende scène">▶|</button>
          <button class="btn ghost" id="snd">🔊 Geluid aan</button>
        </div>
        <div class="sc-punten" id="scp">${S.map((x, i) => `<button data-sc="${i}" aria-label="Scène ${i + 1}${x.jaar ? ", " + esc(x.jaar) : ""}"></button>`).join("")}</div>
      </div>`;
    const spreek = sc => sc.s || sc.t.replace(/\*\*/g, "");
    let sc = 0, playing = false, timer = null, sound = true;
    function draw() {
      const x = S[sc], stage = $(".stage", el), b = $("#scb", el);
      const kaart = !!(d.kaart && x.kaart);
      stage.classList.toggle("met-kaart", kaart);
      stage.style.setProperty("--tint", x.tint || `hsl(${(sc * 37 + 250) % 360} 45% 50%)`);
      if (kaart) tekenKaart($("#sck", el), D, sc);
      const actoren = kaart ? [] : String(x.beeld || "").split(/\s+/).filter(Boolean);
      b.className = "sc-beeld" + (x.anim ? " anim-" + x.anim : "") + (actoren.length > 1 ? " veel" : "");
      b.innerHTML = actoren.map((e, i) => `<span class="actor" style="--i:${i};--n:${actoren.length}"><span>${e}</span></span>`).join("");
      const j = $("#scj", el); j.textContent = x.jaar || ""; j.classList.remove("in"); void j.offsetWidth; if (x.jaar) j.classList.add("in");
      const c = $("#caption", el); c.classList.remove("in"); void c.offsetWidth; c.classList.add("in");
      c.innerHTML = md(x.t) + (x.knop ? `<br><button class="btn small" id="naar-teken" style="margin-top:10px">✏️ Ga tekenen</button>` : "");
      $$("#scp button", el).forEach((p, i) => { p.classList.toggle("gezien", i < sc); p.classList.toggle("nu", i === sc); });
      if (sc === S.length - 1 && onEind) onEind();
      const nt = $("#naar-teken", el); if (nt) nt.onclick = () => { pause(); App.tekenMet(d.teken, { html: `<b>${esc(d.titel)}</b><br>${md(x.t)}`, zeg: spreek(x) }); };
    }
    function advance() { clearTimeout(timer); if (!playing) return; if (sc >= S.length - 1) { pause(); return; } sc++; run(); }
    function run() {
      draw(); App.stopSpeak(); if (!playing) return;
      if (sound) App.speak(spreek(S[sc]), () => { if (playing) timer = setTimeout(advance, 1100); });
      else timer = setTimeout(advance, 3000 + S[sc].t.length * 45);
    }
    function play() { if (sc >= S.length - 1) sc = 0; playing = true; $("#play", el).textContent = "⏸ Pauze"; run(); }
    function pause() { playing = false; clearTimeout(timer); App.stopSpeak(); $("#play", el).textContent = sc >= S.length - 1 ? "⟲ Opnieuw" : "▶ Afspelen"; }
    $("#play", el).onclick = () => playing ? pause() : play();
    const toon = () => { if (playing) return run(); draw(); App.stopSpeak(); if (sound && autoLees()) App.speak(spreek(S[sc])); };   // met 'alles automatisch voorlezen' ook bij zelf doorklikken
    $("#nextS", el).onclick = () => { if (sc < S.length - 1) { sc++; toon(); } };
    $("#prev", el).onclick = () => { if (sc > 0) { sc--; toon(); } };
    $$("#scp button", el).forEach(p => p.onclick = () => { sc = +p.dataset.sc; toon(); });
    $("#snd", el).onclick = () => { sound = !sound; $("#snd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) App.stopSpeak(); };
    draw();
    if (sound && autoLees()) App.speak(spreek(S[0]));
    return () => { playing = false; clearTimeout(timer); };
  }

  /* ================= 9. plaat: kijk-versie en doe-versie ================= */
  // d = { titel, icoon, intro, say, blokken: [{ kop, say, html }], noot, teken }
  // In html staan toetswoorden als <span class="bl">woord</span>. In de doe-versie zijn die verstopt; tik om te checken.
  function plaat(el, d) {
    el.innerHTML = `
      <div class="card">
        <div class="biz"><div class="biz-ico">${d.icoon || "🗺️"}</div><div><h1>${esc(d.titel)}</h1>${d.intro ? `<p class="soft" style="margin:0">${md(d.intro)}</p>` : ""}</div></div>
        ${d.say ? `<button class="say" data-say="${esc(d.say)}" style="margin-top:12px">🔊 Lees voor</button>` : ""}
        <div><div class="switch"><button class="sel" id="m-kijk">👀 Kijk-versie</button><button id="m-doe">✏️ Doe-versie</button></div></div>
        <p class="soft" id="doe-uitleg" style="display:none">Bij de vraagtekens staat een begrip verstopt. Bedenk het zelf. Zeg het hardop of schrijf het op. Tik dan om te checken.</p>
      </div>
      ${d.blokken.map((b, i) => `<div class="card"><h2>${esc(b.kop)}</h2>${b.say ? `<button class="say" id="say-blok-${i}" data-say="${esc(b.say)}">🔊 Lees voor</button>` : ""}${b.html}</div>`).join("")}
      ${d.noot || d.teken ? `<div class="card">${d.noot ? `<p class="note" style="margin-top:0">${md(d.noot)}</p>` : ""}${d.teken ? `<button class="btn ghost" id="teken-plaat">✏️ Teken het zelf</button>` : ""}</div>` : ""}`;
    function setMode(doe) {
      $("#m-kijk", el).classList.toggle("sel", !doe); $("#m-doe", el).classList.toggle("sel", doe);
      $("#doe-uitleg", el).style.display = doe ? "block" : "none";
      $$(".trick", el).forEach(t => t.style.display = doe ? "none" : "block");
      $$(".bl", el).forEach(b => { b.classList.toggle("blank", doe); b.classList.remove("open"); });
    }
    $("#m-kijk", el).onclick = () => setMode(false);
    $("#m-doe", el).onclick = () => setMode(true);
    el.addEventListener("click", e => { const b = e.target.closest(".blank"); if (b) b.classList.toggle("open"); });
    const t = $("#teken-plaat", el); if (t) t.onclick = () => App.tekenMet(d.teken, { html: `Teken de plaat <b>${esc(d.titel)}</b> na, zonder te kijken. Vergelijk daarna.` });
    App.bindSay(el);
  }

  /* ================= 11. video: eerst kijken, dan zelf iets zeggen (besluit 18) ================= */
  // d = { id (YouTube), titel (zoals op YouTube, gecontroleerd door tools/check-video.py), kanaal, start?, eind? (seconden),
  //       intro (waarom kijken, kort), vraag (zij antwoordt zelf, na het kijken) }
  // Privacy: pas na een tik wordt de speler geladen, via youtube-nocookie.com. Geen miniatuur vooraf, dus tot die tik gaat er niets naar Google.
  function video(el, mod, d, onKlaar) {
    const key = `video-${mod}-${d.id}`, eigen = store.get(key, {});
    const duur = d.start != null || d.eind != null ? ` · ${Math.round(((d.eind || 0) - (d.start || 0)) / 60) || 1} min` : "";
    el.innerHTML = `
      <div class="card">
        <h2>📺 Eerst kijken</h2>
        <button class="say" id="lees-video">🔊 Lees voor</button>
        ${d.intro ? `<p>${md(d.intro)}</p>` : ""}
        <div class="video-vak" id="vv"><button class="btn" id="vplay">▶ Speel de video</button>
          <p class="soft" style="margin:8px 0 0;font-size:.85em">${esc(d.titel)} · ${esc(d.kanaal)}${duur}</p></div>
        <p class="soft" style="font-size:.8em;margin:8px 0 0">Video van ${esc(d.kanaal)} op YouTube. Alleen met internet. Ondertiteling aan of uit met de knop CC.</p>
      </div>
      <div class="card" id="vna" ${eigen.antwoord ? "" : "hidden"}>
        <h2>💭 Wat weet je nog?</h2>
        <button class="say" id="lees-vraag">🔊 Lees voor</button>
        <p><b>${md(d.vraag)}</b></p>
        <p class="soft" style="margin:0 0 8px">Zeg het hardop, of schrijf het op (🎤 inspreken mag). Kijken is pas het begin: zelf zeggen laat het blijven hangen.</p>
        <textarea id="vant" placeholder="Wat ik zag…">${esc(eigen.antwoord || "")}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn" id="vklaar">✓ Klaar</button><span class="ok" id="vok"></span></div>
        <div id="na"></div>
      </div>`;
    App.sayButton($("#lees-video", el), () => (d.intro ? d.intro.replace(/\*\*/g, "") + " " : "") + "Tik op Speel de video. Daarna komt er een vraag.");
    App.sayButton($("#lees-vraag", el), () => d.vraag.replace(/\*\*/g, ""));
    $("#vplay", el).onclick = () => {
      if (navigator.onLine === false) { $("#vv", el).insertAdjacentHTML("beforeend", `<p class="fout-t">Geen internet. De video werkt alleen online. De rest van de app werkt wel.</p>`); return; }
      const q = new URLSearchParams({ rel: "0", playsinline: "1", modestbranding: "1", hl: "nl", cc_lang_pref: "nl", autoplay: "1" });
      if (d.start) q.set("start", d.start); if (d.eind) q.set("end", d.eind);
      $("#vv", el).innerHTML = `<div class="video-16x9"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(d.id)}?${q}" title="${esc(d.titel)}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <div class="row" style="margin-top:10px"><button class="btn ghost" id="vgekeken">Klaar met kijken →</button></div>`;
      $("#vgekeken", el).onclick = () => { $("#vna", el).hidden = false; $("#vna", el).scrollIntoView({ behavior: "smooth" }); $("#vant", el).focus({ preventScroll: true }); };
    };
    $("#vant", el).oninput = e => store.set(key, { ...store.get(key, {}), antwoord: e.target.value });
    $("#vklaar", el).onclick = () => { store.set(key, { ...store.get(key, {}), antwoord: $("#vant", el).value, klaar: Date.now() }); $("#vok", el).textContent = "✓ Bewaard"; if (onKlaar) onKlaar($("#na", el)); };
  }

  /* ================= 12. schetsbord: uitlegfilmpje dat lijn voor lijn ontstaat (besluit 20) ================= */
  // d = { mod, titel, intro, teken (tag voor App.tekenMet), scenes: [{ kop, verder?, zinnen: [{ t, s?, teken(b, S) }] }] }
  // Elke zin heeft zijn eigen stuk tekening: dat start tegelijk met de stem. De volgende zin wacht tot stem én
  // tekening klaar zijn, plus een korte pauze (tempo: zij kiest). t = tekst op het scherm (**toetswoord**, `formule`),
  // s = wat de stem zegt (als dat anders is, bijvoorbeeld bij formules). S = gedeeld kladje per scène (bijv. het
  // assenstelsel uit zin 1 dat zin 2 gebruikt). verder: true = de tekening van de vorige scène blijft staan.
  // De tekenaar en de bouwstenen staan in App.Leer.schets, zodat een hoofdstuk alleen tekeninstructies levert.
  const NS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  let zaad = 1;   // vaste zaadjes: elke keer dezelfde 'handgetekende' lijnen
  const R = () => { zaad = (zaad + 0x6D2B79F5) | 0; let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const J = a => (R() * 2 - 1) * a, f1 = n => n.toFixed(1);
  function ruwD(pts, amp = 1.4) {
    let d = "";
    pts.forEach((p, i) => {
      const x = p[0] + J(amp * .6), y = p[1] + J(amp * .6);
      if (i === 0) { d = `M${f1(x)} ${f1(y)}`; return; }
      const q = pts[i - 1], len = Math.hypot(p[0] - q[0], p[1] - q[1]), a = Math.min(amp * 1.6, len * .05) + .4;
      d += ` Q${f1((q[0] + p[0]) / 2 + J(a))} ${f1((q[1] + p[1]) / 2 + J(a))} ${f1(x)} ${f1(y)}`;
    });
    return d;
  }
  function rondD(pts) {
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d;
  }
  function ovaalPts(cx, cy, rx, ry, ruw = .04) {
    const n = 22, a0 = R() * 6.28, pts = [];
    for (let i = 0; i <= n; i++) { const a = a0 + i / n * (Math.PI * 2 + .45), k = 1 + J(ruw); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    return pts;
  }
  const KLEUR = { inkt: "var(--ink)", vak: "var(--vak)", rood: "var(--min)", zacht: "var(--soft)", lijn: "var(--line)" };
  const kl = c => KLEUR[c] || c || KLEUR.inkt;
  class Tekenaar {   // verzamelt alles wat getekend wordt, met een starttijd en duur
    constructor(g) { this.g = g; this.items = []; this.t = 0; }
    in(g, fn) { const oud = this.g; this.g = g; fn(); this.g = oud; }
    wacht(ms) { this.t += ms; }
    lijnPaar(dFn, o = {}) {
      const kleur = kl(o.c), w = o.w || 2.6, els = [];
      for (const pass of [0, 1]) {
        const p = mk("path", { d: dFn(), fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, this.g);
        p.style.stroke = kleur; p.style.strokeWidth = pass ? w * .45 : w; if (pass) p.style.opacity = .55;
        els.push(p);
      }
      const len = els[0].getTotalLength(), dur = Math.max(220, Math.min(1400, len * 1.5 * (o.snel || 1)));
      els.forEach(el => this.items.push({ soort: "lijn", el, at: this.t, dur, len: el.getTotalLength() + 2 }));
      this.t += dur * .85;
      return els;
    }
    lijn(pts, o) { return this.lijnPaar(() => ruwD(pts, o && o.amp), o); }
    ovaal(cx, cy, rx, ry, o = {}) { return this.lijnPaar(() => rondD(ovaalPts(cx, cy, rx, ry, o.ruw)), o); }
    cirkel(cx, cy, r, o) { return this.ovaal(cx, cy, r, r, o); }
    rh(x, y, w, h, o) { return this.lijn([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y - 1]], o); }
    pijl(van, naar, o = {}) {
      this.lijn([van, naar], o);
      const a = Math.atan2(naar[1] - van[1], naar[0] - van[0]), k = o.punt || 12;
      this.lijn([[naar[0] - k * Math.cos(a - .5), naar[1] - k * Math.sin(a - .5)], naar, [naar[0] - k * Math.cos(a + .5), naar[1] - k * Math.sin(a + .5)]], { ...o, snel: .5 });
    }
    // tekst: s is een string of een lijst [[stuk, kleur], ...]; leest = extra leestijd (standaard aan)
    tekst(x, y, s, o = {}) {
      const t = mk("text", { x, y, "text-anchor": o.anker || "middle", "font-size": o.grootte || 20, "font-weight": o.vet ? 700 : 400 }, this.g);
      if (o.draai) t.setAttribute("transform", `rotate(${o.draai} ${x} ${y})`);
      t.style.fill = kl(o.c);
      (Array.isArray(s) ? s : [[s]]).forEach(([stuk, c]) => { const sp = mk("tspan", {}, t); sp.textContent = stuk; if (c) sp.style.fill = kl(c); });
      this.items.push({ soort: "fade", el: t, at: this.t, dur: 500 });
      const woorden = t.textContent.trim().split(/\s+/).length;
      this.t += o.leest === false ? 250 : 450 + woorden * 220;
      return t;
    }
    stip(x, y, o = {}) { const c = mk("circle", { cx: x, cy: y, r: o.r || 6 }, this.g); c.style.fill = kl(o.c || "vak"); this.items.push({ soort: "fade", el: c, at: this.t, dur: 300 }); this.t += 300; return c; }
    stil(fn, dur = 600) {   // alles in fn verschijnt in één keer (rooster, getallen langs een as)
      const g = mk("g", {}, this.g), t0 = this.t, oud = this.items;
      this.items = []; this.in(g, fn); this.items = oud; this.t = t0;
      this.items.push({ soort: "fade", el: g, at: t0, dur }); this.t += dur * .7;
      return g;
    }
    doe(fn) { this.items.push({ soort: "fn", at: this.t, fn }); }
  }
  /* bouwstenen */
  function assen(b, o) {   // o = { x, y, w, h, xmin, xmax, ymin, ymax, stap? (of sx/sy per as), vrij? (eigen schaal per as), elk?/elkx/elky, getallen?, xnaam?, ynaam? } → P(x, y) = punt op het bord
    const sx = o.sx || o.stap || 1, sy = o.sy || o.stap || 1;
    let ex = o.w / (o.xmax - o.xmin), ey = o.h / (o.ymax - o.ymin);
    if (!o.vrij) ex = ey = Math.min(ex, ey);
    const ox = o.x - o.xmin * ex, oy = o.y + o.ymax * ey;
    const P = (x, y) => [ox + x * ex, oy - y * ey];
    P.e = ex; P.o = o;
    const reeks = (van, tot, st) => { const r = []; for (let i = 0; van + i * st <= tot + 1e-9; i++) r.push(+(van + i * st).toFixed(6)); return r; };
    const XS = reeks(o.xmin, o.xmax, sx), YS = reeks(o.ymin, o.ymax, sy);
    b.stil(() => {
      XS.forEach(x => { const l = mk("line", { x1: P(x, 0)[0], y1: P(0, o.ymin)[1], x2: P(x, 0)[0], y2: P(0, o.ymax)[1] }, b.g); l.style.stroke = KLEUR.lijn; l.style.strokeWidth = 1.4; });
      YS.forEach(y => { const l = mk("line", { x1: P(o.xmin, 0)[0], y1: P(0, y)[1], x2: P(o.xmax, 0)[0], y2: P(0, y)[1] }, b.g); l.style.stroke = KLEUR.lijn; l.style.strokeWidth = 1.4; });
    }, 500);
    b.pijl([P(o.xmin, 0)[0] - 6, P(0, 0)[1]], [P(o.xmax, 0)[0] + 18, P(0, 0)[1]], { w: 2.4, punt: 10 });
    b.pijl([P(0, 0)[0], P(0, o.ymin)[1] + 6], [P(0, 0)[0], P(0, o.ymax)[1] - 18], { w: 2.4, punt: 10 });
    b.stil(() => {
      const g = o.getallen !== false, fs = o.fs || 15, ekx = o.elkx || o.elk || 1, eky = o.elky || o.elk || 1;
      const tx = (x, y, s, a) => { const t = mk("text", { x, y, "text-anchor": a || "middle", "font-size": fs }, b.g); t.style.fill = KLEUR.zacht; t.textContent = s; };
      const tk = v => String(v).replace("-", "−");
      if (g) XS.forEach((x, i) => { if (x && !(x === o.xmin && x === -sx) && Math.round((x - o.xmin) / sx) % ekx === 0) tx(P(x, 0)[0], P(0, 0)[1] + fs + 6, tk(x)); });
      if (g) YS.forEach((y, i) => { if (y && !(y === o.ymin && y === -sy) && Math.round((y - o.ymin) / sy) % eky === 0) tx(P(0, 0)[0] - 8, P(0, y)[1] + fs * .35, tk(y), "end"); });
      tx(P(0, 0)[0] - 8, P(0, 0)[1] + fs + 6, "O", "end");
      const n = (x, y, s) => { const t = mk("text", { x, y, "text-anchor": "middle", "font-size": fs + 5, "font-style": "italic", "font-weight": 700 }, b.g); t.style.fill = KLEUR.inkt; t.textContent = s; };
      n(P(o.xmax, 0)[0] + 24, P(0, 0)[1] + 7, o.xnaam || "x");
      n(P(0, 0)[0] + 16, P(0, o.ymax)[1] - 22, o.ynaam || "y");
    }, 500);
    return P;
  }
  function lijnDoor(b, P, a, c, o = {}) {   // de grafiek van y = a·x + c, binnen het assenstelsel
    const { xmin, xmax, ymin, ymax } = P.o;
    let x0 = o.van ?? xmin, x1 = o.tot ?? xmax;
    if (a) { const xa = (ymin - c) / a, xb = (ymax - c) / a; x0 = Math.max(x0, Math.min(xa, xb)); x1 = Math.min(x1, Math.max(xa, xb)); }
    return b.lijn([P(x0, a * x0 + c), P(x1, a * x1 + c)], { c: o.c || "vak", w: o.w || 3.6, amp: .8 });
  }
  function trap(b, P, x, y, dx, dy, o = {}) {   // vanaf (x, y): dx naar rechts, dan dy omhoog (negatief = omlaag), met de getallen erbij
    const c = o.c || "rood", A = P(x, y), B = P(x + dx, y), C = P(x + dx, y + dy);
    b.pijl(A, B, { c, w: 2.6, punt: 9 });
    if (o.getal !== false) b.tekst((A[0] + B[0]) / 2, A[1] + (dy > 0 ? 24 : -10), String(dx).replace("-", "−"), { c, vet: true, grootte: 19, leest: false });
    b.pijl(B, C, { c, w: 2.6, punt: 9 });
    if (o.getal !== false) b.tekst(B[0] + 10, (B[1] + C[1]) / 2 + 7, String(dy).replace("-", "−"), { c, vet: true, grootte: 19, anker: "start", leest: false });
  }
  function tabel(b, x, y, rijen, o = {}) {   // rijen = [["x", 0, 1, 2], ["y", 3, 5, 7]]; kolommen verschijnen één voor één
    const kw = o.kolom || 58, rh = o.rij || 40, n = rijen[0].length;
    b.lijn([[x, y + rh], [x + kw * n, y + rh]], { w: 2.2 });
    b.lijn([[x + kw, y + 4], [x + kw, y + rh * 2 - 4]], { c: "vak", w: 3 });
    for (let k = 0; k < n; k++) rijen.forEach((r, i) => b.tekst(x + kw * k + kw / 2, y + rh * i + rh * .68, String(r[k]).replace("-", "−"),
      { grootte: o.grootte || 21, vet: k === 0, c: k === 0 ? "inkt" : (o.kleur && o.kleur[i]) || "inkt", leest: false }));
    return { kol: k => x + kw * k + kw / 2, rij: i => y + rh * i + rh / 2, kw, rh };
  }

  function formule(b, x, y, delen, o = {}) {   // formule in stukken met eigen kleur; geeft het midden van elk stuk (voor labels eronder)
    const t = b.tekst(x, y, delen, { grootte: 38, vet: true, ...o }), pos = []; let n = 0;
    delen.forEach(([s]) => { try { pos.push((t.getStartPositionOfChar(n).x + t.getEndPositionOfChar(n + s.length - 1).x) / 2); } catch (e) { pos.push(x); } n += s.length; });
    return pos;
  }

  function schetsbord(el, d, onEind) {
    const M = App.module(d.mod) || {}, kleur = App.vakKleur ? App.vakKleur(M) : "#8C6CF0";
    const lijst = d.scenes.flatMap((sc, i) => sc.zinnen.map((z, k) => ({ i, k, z })));
    const TEMPI = [["🐢 Rustig", 1], ["🐌 Heel rustig", 1.4], ["🐇 Vlot", .7]];
    let tempoNr = +store.get("filmtempo", 0) || 0; if (!TEMPI[tempoNr]) tempoNr = 0;
    const T = () => TEMPI[tempoNr][1];
    el.innerHTML = `
      <div class="card schets" style="--vak:${kleur}">
        <h1>${esc(d.titel)}</h1>
        ${d.intro ? `<p class="soft" style="margin-top:0">${md(d.intro)}</p>` : ""}
        <div class="sb-bord"><div class="sb-kop" id="sbk"></div><svg id="sbs" viewBox="0 0 800 450" role="img" aria-label="Schetsbord: de tekening bij de uitleg"></svg></div>
        <div class="caption sb-tekst" id="sbt" aria-live="polite"></div>
        <div class="ctrl">
          <button class="btn" id="play">▶ Afspelen</button>
          <button class="btn ghost" id="prev" aria-label="Vorige zin">◀</button>
          <button class="btn ghost" id="nextS" aria-label="Volgende zin">▶|</button>
          <button class="btn ghost" id="tempo">${TEMPI[tempoNr][0]}</button>
          <button class="btn ghost" id="snd">🔊 Geluid aan</button>
        </div>
        <div class="sc-punten" id="scp">${d.scenes.map((sc, i) => `<button data-sc="${i}" aria-label="Deel ${i + 1}: ${esc(sc.kop || "")}"></button>`).join("")}</div>
        <p class="soft" style="font-size:.8em;margin:10px 0 0">Tik op een streepje om naar dat deel te gaan. Het tempo verandert de pauzes en het tekenen, niet de stem.</p>
      </div>`;
    const svg = $("#sbs", el), stage = mk("g", {}, svg);
    const spreek = z => z.s || z.t.replace(/\*\*|`/g, "");
    const opmaak = t => md(t).replace(/`(.+?)`/g, '<span class="sb-f">$1</span>');
    let nu = -1, playing = false, sound = true, lopend = [], timers = [], beurt = 0;
    function stopAnim() { lopend.forEach(a => a.cancel()); lopend = []; timers.forEach(clearTimeout); timers = []; }
    function speel(items, direct, tempo) {
      let eind = 0;
      for (const it of items) {
        const at = it.at * tempo, dur = (it.dur || 0) * tempo;
        if (it.soort === "fn") { if (!direct) timers.push(setTimeout(it.fn, at)); continue; }
        eind = Math.max(eind, at + dur);
        if (direct) continue;
        if (it.soort === "lijn") { it.el.style.strokeDasharray = it.len; lopend.push(it.el.animate([{ strokeDashoffset: it.len }, { strokeDashoffset: 0 }], { duration: dur, delay: at, fill: "both", easing: "ease-in-out" })); }
        else lopend.push(it.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, delay: at, fill: "both" }));
      }
      return eind;
    }
    function scèneDirect(i, S) {   // een eerdere scène in één keer (voor verder: true)
      if (d.scenes[i].verder && i > 0) scèneDirect(i - 1, S);
      d.scenes[i].zinnen.forEach((z, k) => { zaad = 100 + i * 37 + k * 11; const b = new Tekenaar(stage); z.teken && z.teken(b, S); speel(b.items, true, 1); });
    }
    function toon(n) {   // laat zin n zien: eerdere zinnen van de scène direct, deze zin getekend; geeft de duur van de tekening
      stopAnim(); nu = n; const { i, k } = lijst[n], sc = d.scenes[i], S = {};
      stage.innerHTML = "";
      if (sc.verder && i > 0) scèneDirect(i - 1, S);
      for (let j = 0; j < k; j++) { zaad = 100 + i * 37 + j * 11; const b = new Tekenaar(stage); sc.zinnen[j].teken && sc.zinnen[j].teken(b, S); speel(b.items, true, 1); }
      zaad = 100 + i * 37 + k * 11;
      const b = new Tekenaar(stage); sc.zinnen[k].teken && sc.zinnen[k].teken(b, S);
      const duur = speel(b.items, false, T());
      $("#sbk", el).textContent = (sc.plus ? "➕ Plusstof · " : "") + (sc.kop || ""); $("#sbk", el).hidden = !sc.kop; $("#sbk", el).classList.toggle("plus", !!sc.plus);
      $("#sbt", el).innerHTML = sc.zinnen.slice(0, k + 1).map((z, j) => `<span class="sb-zin ${j === k ? "nu" : ""}">${opmaak(z.t)}</span>`).join(" ")
        + (n === lijst.length - 1 && d.teken ? `<br><button class="btn small" id="naar-teken" style="margin-top:10px">✏️ Ga tekenen</button>` : "");
      $$("#scp button", el).forEach((p, j) => { p.classList.toggle("gezien", j < i); p.classList.toggle("nu", j === i); });
      $("#prev", el).disabled = n === 0; $("#nextS", el).disabled = n === lijst.length - 1;
      const nt = $("#naar-teken", el); if (nt) nt.onclick = () => { pause(); const z = lijst[n].z; App.tekenMet(d.teken, { html: opmaak(z.t), zeg: spreek(z) }); };
      if (n === lijst.length - 1 && onEind) onEind();
      return duur;
    }
    function run(n) {   // afspelen vanaf zin n: tekening en stem tegelijk; verder als allebei klaar zijn
      const mijn = ++beurt; App.stopSpeak();
      const duur = toon(n), z = lijst[n].z;
      let spraak = false, beeld = false;
      const verder = () => {
        if (mijn !== beurt || !playing || !spraak || !beeld) return;
        if (n >= lijst.length - 1) { pause(); return; }
        const nieuwDeel = lijst[n + 1].i !== lijst[n].i;
        timers.push(setTimeout(() => { if (mijn === beurt && playing) run(n + 1); }, (nieuwDeel ? 1600 : 650) * T()));
      };
      timers.push(setTimeout(() => { beeld = true; verder(); }, duur));
      if (sound) App.speak(spreek(z), () => { spraak = true; verder(); });
      else timers.push(setTimeout(() => { spraak = true; verder(); }, (900 + z.t.split(/\s+/).length * 380) * T()));
    }
    function play() { playing = true; $("#play", el).textContent = "⏸ Pauze"; run(nu < 0 || nu >= lijst.length - 1 ? 0 : nu); }
    function pause() { playing = false; beurt++; timers.forEach(clearTimeout); timers = []; App.stopSpeak(); $("#play", el).textContent = nu >= lijst.length - 1 ? "⟲ Opnieuw" : "▶ Afspelen"; }
    function ga(n) { if (playing) return run(n); beurt++; App.stopSpeak(); toon(n); if (sound && autoLees()) App.speak(spreek(lijst[n].z)); }
    $("#play", el).onclick = () => playing ? pause() : play();
    $("#nextS", el).onclick = () => { if (nu < lijst.length - 1) ga(nu + 1); };
    $("#prev", el).onclick = () => { if (nu > 0) ga(nu - 1); };
    $$("#scp button", el).forEach(p => p.onclick = () => ga(lijst.findIndex(x => x.i === +p.dataset.sc)));
    $("#snd", el).onclick = () => { sound = !sound; $("#snd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) App.stopSpeak(); };
    $("#tempo", el).onclick = () => { tempoNr = (tempoNr + 1) % TEMPI.length; store.set("filmtempo", tempoNr); $("#tempo", el).textContent = TEMPI[tempoNr][0]; };
    const start = () => { if (!el.isConnected) return; toon(0); if (sound && autoLees()) App.speak(spreek(lijst[0].z)); };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(start) : start();
    return () => { playing = false; beurt++; stopAnim(); };
  }

  /* ================= 13. stappen: oefenen met een werkschema, voorbeeld → samen → zelf (wiskunde) ================= */
  // Uitgewerkte voorbeelden die afbouwen (worked examples / fading). Per stap kiest zij eerst WAT ze doet (een stap uit
  // het werkschema) en vult dan de getallen in. Zo oefent ze de aanpak én het rekenen.
  // cfg = { titel, intro, schema?: { titel, stappen: [tekst] }, voorbeeld: opgave, samen: opgave, maak: () => opgave }
  // opgave = { vraag, beeld?: b => tekenen (met L.schets), stappen: [{ wat, regel, hint? }], slot? }
  // regel: gewone tekst met [getal] = invulvakje (ook -3, 1/2, 2,5), [<] of [>] = kies het teken, {a/b} = breuk.
  // In 'samen' staat de eerste helft van de stappen er al; in 'zelf' doet zij alles, met steeds een nieuwe som.
  function waarde(s) {   // "−3", "1/2", "-3/4", "1½", "½", "2 1/2", "2,5" → getal
    s = String(s == null ? "" : s).trim().replace(/[−–]/g, "-").replace(/\s+/g, " ").replace(",", ".");
    let m;
    if ((m = s.match(/^(-?)(\d*)\s?½$/))) return (m[1] ? -1 : 1) * ((+m[2] || 0) + .5);
    if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    if ((m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/))) return m[1] / m[2];
    return s === "" ? NaN : Number(s);
  }
  // wiskOpmaak: op tekst die al veilig is (geëscapet); wiskTekst: op ruwe tekst
  const wiskOpmaak = s => s.replace(/(^|[\s(=+·:,])-(?=[\dA-Za-z(])/g, "$1−").replace(/\{(−?-?\d+)\/(\d+)\}/g, '<span class="breuk"><sup>$1</sup><sub>$2</sub></span>');
  const wiskTekst = s => wiskOpmaak(esc(s));
  function schetsStil(host, teken, o = {}) {   // een vaste tekening (zonder animatie) bij een opgave
    const svg = mk("svg", { viewBox: `0 0 ${o.w || 800} ${o.h || 450}`, role: "img", "aria-label": o.label || "Figuur bij de opgave" });
    host.appendChild(svg);
    const M = (App.modules || []).find(m => location.hash.slice(1).startsWith(m.id));   // vakkleur van het hoofdstuk (voor 'vak' in de tekening)
    if (M && App.vakKleur) svg.style.setProperty("--vak", App.vakKleur(M));
    zaad = o.zaad || 7; const b = new Tekenaar(mk("g", {}, svg)); teken(b);
    return svg;
  }
  // Soorten vakjes in een regel: [5] getal · [+-6] term met teken (toont "− 6"; zij typt -6) · [<] of [>] teken kiezen ·
  // [*op l|niet op l] kiezen (het goede antwoord heeft een *).
  function vakje(v) {
    if (v === "<" || v === ">") return { soort: "kies", opties: ["<", ">"], goed: v };
    if (v.includes("|")) { const o = v.split("|"); return { soort: "kies", opties: o.map(x => x.replace(/^\*/, "")), goed: (o.find(x => x.startsWith("*")) || o[0]).replace(/^\*/, "") }; }
    if (/^\+/.test(v)) return { soort: "term", w: v.slice(1) };
    return { soort: "getal", w: v };
  }
  const toonGetal = v => { const m = String(v).match(/^(-?)(\d+)\/(\d+)$/); return m ? (m[1] ? "−" : "") + `{${m[2]}/${m[3]}}` : String(v).replace(/^-/, "−"); };
  const toonVakje = v => v.soort === "kies" ? v.goed : v.soort === "term" ? (waarde(v.w) < 0 ? "− " : "+ ") + toonGetal(String(v.w).replace(/^-/, "")) : toonGetal(v.w);
  function stappen(el, cfg, onKlaar) {
    const SOORTEN = cfg.soorten || [cfg];
    let sn = 0; const rondeVan = SOORTEN.map(() => 0);
    const rondes = [
      { mode: "voorbeeld", titel: "1 · Kijk mee", sub: "Ik doe het voor. Lees mee en tik op ‘Volgende stap’." },
      { mode: "samen", titel: "2 · Samen", sub: "De eerste stappen staan er al. Jij doet de rest." },
      { mode: "zelf", titel: "3 · Zelf", sub: "Nu helemaal zelf. Elke keer een nieuwe som." }
    ];
    const fmt = t => md(t).replace(/`(.+?)`/g, (m, f) => `<span class="sb-f">${wiskOpmaak(f)}</span>`);
    function render() {
      const C = SOORTEN[sn], ronde = rondeVan[sn], R = rondes[ronde];
      const q = R.mode === "voorbeeld" ? C.voorbeeld : R.mode === "samen" ? C.samen : C.maak();
      const n = q.stappen.length, gegevenTot = R.mode === "voorbeeld" ? n : R.mode === "samen" ? Math.max(1, Math.floor(n / 2)) : 0;
      const wats = C.schema ? C.schema.stappen : [...new Set(q.stappen.map(x => x.wat))];
      el.innerHTML = `
        <div class="card reken wstappen">
          <h2 style="margin-top:0">${esc(cfg.titel)}</h2>
          ${cfg.intro ? `<p class="soft" style="margin-top:0">${md(cfg.intro)}</p>` : ""}
          ${SOORTEN.length > 1 ? `<div class="row soort-rij">${SOORTEN.map((x, i) => `<button class="chip ${i === sn ? "sel" : ""}" data-s="${i}">${esc(x.naam)}${x.plus ? " ➕" : ""}</button>`).join("")}</div>` : ""}
          ${C.plus ? `<p style="margin:0 0 8px"><span class="plus-tag">➕ Plusstof</span> <span class="soft">Verdieping uit je boek.</span></p>` : ""}
          <div class="row ronde-rij">${rondes.map((r, i) => `<button class="chip small ${i === ronde ? "sel" : ""}" data-r="${i}">${r.titel}</button>`).join("")}</div>
          <p class="soft" style="margin:8px 0 12px">${R.sub}</p>
          ${C.schema ? `<details class="schema" ${R.mode !== "zelf" ? "open" : ""}><summary>📋 ${esc(C.schema.titel)}</summary><ol>${C.schema.stappen.map(x => `<li>${md(x)}</li>`).join("")}</ol></details>` : ""}
          <div class="opg-vast"><div class="casus"><div class="opg">${fmt(q.vraag)}</div><button class="say-mini" id="lq">🔊</button>${q.beeld ? `<button class="say-mini" id="obt" aria-label="Figuur in- of uitklappen">🖼️</button>` : ""}</div>
          ${q.beeld ? `<div class="opg-beeld" id="ob"></div>` : ""}</div>
          <div id="stappen"></div>
          <div id="eind"></div>
        </div>`;
      $$("[data-s]", el).forEach(b => b.onclick = () => { sn = +b.dataset.s; render(); });
      $$("[data-r]", el).forEach(b => b.onclick = () => { rondeVan[sn] = +b.dataset.r; render(); });
      App.sayButton($("#lq", el), () => q.zeg || q.vraag.replace(/\*\*|`/g, ""), { audio: null });   // sommen wisselen: iPad-stem
      if (q.beeld) { schetsStil($("#ob", el), q.beeld, q.beeldMaat); $("#obt", el).onclick = () => $("#ob", el).classList.toggle("dicht"); }
      const box = $("#stappen", el), goed = [];
      function stap(i) {
        const st = q.stappen[i], gegeven = i < gegevenTot;
        const opties = !gegeven && wats.length >= 3 ? shuffle([st.wat, ...shuffle(wats.filter(w => w !== st.wat)).slice(0, 2)]) : null;
        const vakjes = [];
        const regel = st.regel.split(/(\[[^\]]+\])/).map(stuk => {
          const m = stuk.match(/^\[(.+)\]$/);
          if (!m) return wiskTekst(stuk);
          const v = vakje(m[1]), k = vakjes.push(v) - 1;
          if (gegeven) return `<b class="ingevuld">${wiskTekst(toonVakje(v))}</b>`;
          if (v.soort === "kies") return `<span class="teken-kies" data-b="${k}">${v.opties.map(o => `<button class="chip small" data-t="${esc(o)}">${esc(o)}</button>`).join("")}</span>`;
          return `<input class="ant vak-in" data-b="${k}" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Invullen" placeholder="${v.soort === "term" ? "±" : ""}">`;
        }).join("");
        const d = document.createElement("div"); d.className = "trede";
        d.innerHTML = `<div class="trede-n">${i + 1}</div><div class="trede-in">
          ${opties ? `<div class="naam-kies"><span class="soft">Wat doe je nu?</span> ${opties.map(o => `<button class="chip small" data-n="${esc(o)}">${md(o)}</button>`).join("")}</div>` : `<div class="wat">${md(st.wat)}</div>`}
          <div class="som wisk">${regel}</div>
          ${gegeven ? "" : `<div class="row"><button class="btn small chk">Check ✓</button><span class="fb"></span></div>`}
        </div>`;
        box.appendChild(d);
        if (gegeven) {
          if (R.mode === "voorbeeld") App.speak(st.zeg || st.wat, null, { audio: null });
          return volgende(i, true);
        }
        let naam = opties ? null : st.wat, pogingen = 0;
        const keuze = {};
        $$("[data-n]", d).forEach(b => b.onclick = () => { naam = b.dataset.n; $$("[data-n]", d).forEach(x => x.classList.toggle("sel", x === b)); });
        $$(".teken-kies", d).forEach(t => $$("[data-t]", t).forEach(b => b.onclick = () => { keuze[t.dataset.b] = b.dataset.t; $$("[data-t]", t).forEach(x => x.classList.toggle("sel", x === b)); }));
        $$(".vak-in", d).forEach(inp => inp.onkeydown = e => { if (e.key === "Enter") $(".chk", d).click(); });
        $(".chk", d).onclick = () => {
          const fb = $(".fb", d);
          const ok = vakjes.map((v, k) => v.soort === "kies" ? keuze[k] === v.goed : Math.abs(waarde($(`.vak-in[data-b="${k}"]`, d).value) - waarde(v.w)) < 1e-6);
          const okN = naam === st.wat, allesB = ok.every(Boolean);
          $$(".vak-in", d).forEach(inp => inp.classList.toggle("fout", !ok[+inp.dataset.b] && inp.value !== ""));
          if (allesB && okN) {
            fb.innerHTML = `<span class="goed-t">✓ Goed!</span>`;
            $(".chk", d).remove(); $$(".vak-in", d).forEach(x => x.disabled = true); $$("[data-n],[data-t]", d).forEach(b => b.disabled = true);
            return volgende(i, pogingen === 0);
          }
          pogingen++;
          const wat = !naam ? "Kies eerst wat je doet." : !okN && !allesB ? "De stap en de getallen kloppen nog niet." : !okN ? "De getallen kloppen! De stap nog niet." : "De stap klopt! De getallen nog niet.";
          const juist = st.regel.replace(/\[([^\]]+)\]/g, (m, x) => toonVakje(vakje(x)));
          fb.innerHTML = `<span class="fout-t">${wat}</span>` + (pogingen === 1 ? (st.hint ? `<br>💡 ${fmt(st.hint)}` : "")
            : `<br>Zo moet het: <b>${md(st.wat)}</b><br><b class="wisk">${wiskTekst(juist)}</b><br>Vul het in, dan ga je door.`);
        };
      }
      function volgende(i, inEens) {
        goed.push(inEens);
        if (i + 1 < n) {
          if (R.mode === "voorbeeld") { const b = document.createElement("button"); b.className = "btn small"; b.textContent = "Volgende stap →"; b.style.margin = "6px 0 10px 54px"; box.appendChild(b); b.onclick = () => { b.remove(); stap(i + 1); }; }
          else stap(i + 1);
          return;
        }
        const zelfGoed = goed.slice(gegevenTot).filter(Boolean).length, zelfTotaal = n - gegevenTot;
        $("#eind", el).innerHTML = `<div class="reken-eind">${q.slot ? fmt(q.slot) + "<br>" : ""}
          ${R.mode === "voorbeeld" ? "Zo gaat het. Nu samen." : zelfGoed === zelfTotaal ? "🎉 Alles in één keer goed!" : `🎉 Klaar. ${zelfGoed} van de ${zelfTotaal} stappen in één keer goed. De rest heb je nu ook gezien.`}
          <div class="row" style="margin-top:10px">${ronde < 2 ? `<button class="btn" id="vd">Volgende ronde →</button>` : `<button class="btn" id="vd">🎲 Nog een som</button>`}</div></div>`;
        if (ronde === 2 && onKlaar) onKlaar();
        $("#vd", el).onclick = () => { if (rondeVan[sn] < 2) rondeVan[sn]++; render(); el.scrollIntoView({ behavior: "smooth" }); };
      }
      stap(0);
    }
    render();
  }

  /* ================= 14. formules voorlezen (wiskunde, natuurkunde, scheikunde) ================= */
  // zeg(tekst) geeft wat de stem moet zeggen bij een tekst met formules: x = "iks", y = "ij", − = "min", = "is",
  // (2, 5) = "het punt 2 en 5" (een komma tussen twee getallen wordt anders "komma" uitgesproken).
  // metZeg(o, ...velden) zet o.zeg[veld] waar dat nodig is; de vormen gebruiken dat voor de stem (zg).
  // filmZeg(f) vult bij elke zin van een schetsbord-filmpje de stemtekst s in. Verander je deze regels, dan krijgen
  // de teksten een nieuwe vingerafdruk en moeten ze opnieuw ingesproken worden.
  const BREUK = { 2: "half", 3: "derde", 4: "vierde", 5: "vijfde", 6: "zesde", 8: "achtste", 10: "tiende", 12: "twaalfde" };
  function zeg(t) {
    return String(t).replace(/\*\*|`/g, "").replace(/[−–]/g, "-")
      .replace(/\{(-?\d+)\/(\d+)\}/g, "$1/$2")
      .replace(/getallenpaar \((-?[\d½]+), (-?[\d½]+)\)/g, "getallenpaar $1 en $2")
      .replace(/\b([A-Z])\((-?[\d½\/]+), (-?[\d½\/]+)\)/g, "$1 met coördinaten $2 en $3")
      .replace(/(het )?(punt )?\((-?[\d½\/]+), (-?[\d½\/]+)\)/g, "het punt $3 en $4").replace(/punten het punt/g, "punten").replace(/is het punt/g, "is het punt")
      .replace(/\b1½/g, "anderhalf ").replace(/(\d)½/g, "$1 en een half ").replace(/½/g, "een half ").replace(/⅓/g, "een derde ").replace(/⅔/g, "twee derde ").replace(/¼/g, "een kwart ")
      .replace(/\b(\d+)\/(\d+)(?!\d)/g, (m, a, b) => a === "1" && b === "2" ? "een half " : `${a} ${BREUK[b] || "gedeeld door " + b} `)
      .replace(/(\d)\(/g, "$1 keer (")
      .replace(/(^|[\s(=:,])-\s?/g, "$1min ")
      .replace(/\s=\s/g, " is ").replace(/\s\+\s/g, " plus ").replace(/\s[·×]\s/g, " keer ")
      .replace(/\s<\s/g, " is kleiner dan ").replace(/\s>\s/g, " is groter dan ").replace(/\s:\s(?=\d|min)/g, " gedeeld door ")
      .replace(/(\d)([a-z])\b/g, "$1 $2").replace(/\b([ab])x\b/g, "$1 x")
      .replace(/\bx-/g, "iks-").replace(/\by-/g, "ij-").replace(/\bx\b/g, "iks").replace(/\by\b/g, "ij").replace(/\brc\b/g, "r c")
      .replace(/\s+/g, " ").replace(/\s([.,:?!])/g, "$1").trim();
  }
  const metZeg = (o, ...velden) => { velden.forEach(v => { if (o[v] == null) return; const z = Array.isArray(o[v]) ? o[v].map(zeg) : zeg(o[v]); if (JSON.stringify(z) !== JSON.stringify(o[v])) (o.zeg = o.zeg || {})[v] = z; }); return o; };
  const filmZeg = f => { f.scenes.forEach(sc => sc.zinnen.forEach(z => { if (!z.s) z.s = zeg(z.t); })); return f; };


  /* ================= 10. overzicht van een hoofdstuk (route, vandaag, toetsdatum) ================= */
  // cfg = { mod, titel, spreekTitel, IDS, STATIONS, NAMEN, GEHEUGEN, waarom: [html] }
  // Twee duidelijk verschillende delen: Leren (nieuwe stof, per paragraaf, in de kleur van het vak) en
  // Oefenen (herhalen tot je het kent, in goud). Een paragraaf is één knop en opent de paragraaf.
  function overzicht(el, cfg) {
    const V = Voortgang(cfg.mod), v = V.get(), M = App.module(cfg.mod) || { onderdelen: [], vak: "", icoon: "" };
    const ik = App.ik, kleur = App.vakKleur(M);
    const dagen = v.toets ? Math.ceil((v.toets - Date.now()) / DAG) : null;
    const k = V.teDoen("kaarten", cfg.IDS.kaarten, 6).length, q = V.teDoen("vragen", cfg.IDS.vragen, 8).length;
    const open = cfg.STATIONS.flatMap(s => s.delen).find(d => !v.gedaan[d]);
    const geh = cfg.GEHEUGEN.slice().sort((a, b) => (v.geheugen[a.id]?.laatst || 0) - (v.geheugen[b.id]?.laatst || 0))[0];
    const taken = [];
    if (open) taken.push({ go: open, t: `${cfg.NAMEN[open]}: nieuw stuk leren`, min: 8, soort: "leren" });
    if (k) taken.push({ go: "begrippen", t: `🃏 ${k} begrippen checken`, min: Math.ceil(k * 0.5), soort: "oefen" });
    if (Object.keys(v.gedaan).length >= 2) taken.push({ go: "geheugen", t: `🧠 Uit je hoofd tekenen: ${geh.titel}`, min: 5, soort: "oefen" });
    if (q && Object.keys(v.gedaan).length >= 2) taken.push({ go: "toets", t: `📝 ${Math.min(q, 8)} toetsvragen`, min: Math.min(q, 8) * 1.5, soort: "oefen" });
    const min = Math.round(taken.reduce((a, t) => a + t.min, 0));
    const pct = Math.round(V.beheersing(cfg.IDS) * 100);
    const od = id => M.onderdelen.find(o => o.id === id) || { naam: id, icoon: "" };
    const oefen = M.onderdelen.filter(o => o.groep === "Oefenen");
    const g = v.geheugen || {}, gehLaatst = Object.values(g).reduce((a, x) => Math.max(a, x.laatst || 0), 0);
    const oefenInfo = { begrippen: k ? `${k} klaar om te checken` : "Alles gecheckt 😎", geheugen: gehLaatst ? `Laatst: ${new Date(gehLaatst).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}` : "Nog niet gedaan", toets: q ? `${Math.min(q, 8)} vragen klaar` : "Alles gedaan 😎" };
    el.innerHTML = `
      <div class="card hfd-kop" style="--vak:${kleur}">
        <div class="hfd-kop-boven">
          <div class="hfd-ic groot">${M.icoon}</div>
          <div style="flex:1;min-width:0"><span class="vak-tag">${esc(M.vak)}</span><h1>${esc(cfg.titel.replace(/^[^·]*·\s*/, ""))}</h1>
            <button class="say" id="lees-ov">🔊 Lees voor</button></div>
        </div>
        <div class="hfd-kop-onder">
          ${lightstick(V.beheersing(cfg.IDS))}
          <div style="flex:1;min-width:220px">
            <div class="row"><label for="td"><b>📅 Toets op:</b></label><input type="date" id="td" class="date-in" value="${v.toets ? new Date(v.toets).toISOString().slice(0, 10) : ""}">
              <span class="soft">${dagen == null ? "Vul de datum in, dan plan ik je herhaling." : dagen < 0 ? "De toets is geweest." : dagen === 0 ? "Vandaag! Succes 💜" : dagen === 1 ? "Morgen!" : `Nog ${dagen} dagen.`}</span></div>
            <p class="soft" style="margin:8px 0 0;font-size:.85em">Je lightstick laadt op als je begrippen en toetsvragen echt kent, niet als je alleen leest.</p>
          </div>
        </div>
      </div>
      <div class="card vandaag">
        <h2>${ik("vandaag")} Vandaag ${taken.length ? `<span class="soft" style="font-weight:400;font-size:.75em">· ongeveer ${min} minuten</span>` : ""}</h2>
        ${taken.length ? taken.map((t, i) => `<button class="taak ${t.soort}" data-go="${t.go}"><span class="nr">${i + 1}</span><span class="taak-t">${esc(t.t)}</span>${ik("verder", "chev")}</button>`).join("") : `<p>Alles gedaan voor vandaag 😎 Morgen komt er weer iets terug.</p>`}
        <p class="soft" style="margin:10px 0 0;font-size:.85em">Elke dag een kwartiertje werkt beter dan één lange avond vlak voor de toets.</p>
      </div>
      <div class="deel-kop leren" style="--vak:${kleur}">${ik("leren")}<div><h2>Leren</h2><span>Nieuwe stof, paragraaf voor paragraaf.</span></div></div>
      <div class="par-lijst" style="--vak:${kleur}">${cfg.STATIONS.map((s, i) => {
        const klaar = s.delen.filter(d => v.gedaan[d]).length, alles = klaar === s.delen.length, bezig = klaar && !alles;
        return `<button class="par-kaart ${alles ? "klaar" : bezig ? "bezig" : ""} ${s.delen.includes(open) ? "eerstvolgende" : ""}" data-p="${i + 1}">
          <span class="par-badge">${alles ? ik("check") : esc(s.par || s.icoon)}</span>
          <span class="par-tekst"><b>${s.par ? esc(s.icoon) + " " : ""}${esc(s.titel)}</b>
            <span class="par-stappen">${s.delen.map(d => `<span class="${v.gedaan[d] ? "gedaan" : ""}">${od(d).icoon} ${esc(od(d).naam)}</span>`).join("")}</span></span>
          <span class="par-stand">${klaar}/${s.delen.length}</span>${ik("verder", "chev")}
        </button>`; }).join("")}</div>
      ${oefen.length ? `<div class="deel-kop oefen">${ik("oefenen")}<div><h2>Oefenen</h2><span>Herhalen tot je het kent. Hiermee laadt je lightstick op.</span></div></div>
      <div class="oefen-grid">${oefen.map(o => `<button class="oefen-tegel" data-go="${o.id}"><span class="tile-ic">${o.icoon}</span><b>${esc(o.naam)}</b><small>${oefenInfo[o.id] || ""}</small></button>`).join("")}</div>` : ""}
      <details class="meet" style="margin-top:22px"><summary>🔬 Waarom werkt het zo? (voor papa)</summary>
        <ul class="waarom">${(cfg.waarom || []).map(w => `<li>${w}</li>`).join("")}</ul></details>`;
    // Vast deel apart (krijgt een opname); datum, percentage en taken wisselen en blijven de iPad-stem.
    const dagZin = dagen == null ? "Vul de datum van je toets in, dan plan ik je herhaling." : dagen < 0 ? "De toets is geweest." : dagen === 0 ? "De toets is vandaag. Succes!" : dagen === 1 ? "De toets is morgen." : `Nog ${dagen} dagen tot de toets.`;
    App.sayButton($("#lees-ov", el), () => [cfg.spreekTitel || cfg.titel, dagZin, `Je lightstick is voor ${pct} procent opgeladen.`, taken.length ? "Vandaag, ongeveer " + min + " minuten: " + taken.map(t => t.t).join(". ") + "." : "Alles gedaan voor vandaag."]);
    $$("[data-go]", el).forEach(b => b.onclick = () => App.go(cfg.mod + "-" + b.dataset.go));
    $$("[data-p]", el).forEach(b => b.onclick = () => App.go(cfg.mod + "-p" + b.dataset.p));
    $("#td", el).onchange = e => { V.update(x => x.toets = e.target.value ? new Date(e.target.value + "T08:00:00").getTime() : null); App.go(cfg.mod + "-overzicht"); };
  }

  App.Leer = { Voortgang, lightstick, chat, sorteer, kaarten, rekenen, toets, geheugen, kladblok, tijdlijn, filmpje, plaat, video, schetsbord, stappen, overzicht, md, euro, shuffle, waarde, zeg, metZeg, filmZeg,
    schets: { Tekenaar, mk, assen, lijnDoor, trap, tabel, formule, stil: schetsStil } };
})();
