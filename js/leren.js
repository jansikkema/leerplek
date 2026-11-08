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
  function kladblok(host, aspect = 0.45) {
    let ui = null;
    host.innerHTML = `<button class="btn ghost small kb-open">✏️ Kladblok</button><div class="kb"></div>`;
    $(".kb-open", host).onclick = () => {
      if (ui) { ui.destroy(); ui = null; $(".kb", host).innerHTML = ""; $(".kb-open", host).textContent = "✏️ Kladblok"; return; }
      ui = Studio($(".kb", host), { aspect, papier: "ruitjes" }); $(".kb-open", host).textContent = "✖ Kladblok dicht";
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
          <div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(d.titel)}</h2><span class="soft">${gedaan} / ${d.kaarten.length}</span></div>
          ${d.uitleg ? `<p class="soft" style="margin-top:6px">${md(d.uitleg)}</p>` : ""}
          <div class="s-kaart" id="sk"><div>${md(k.t)}</div><button class="say-mini" aria-label="Lees voor">🔊</button></div>
          <div class="s-feedback" id="sf" hidden></div>
          <div class="s-bakken" style="grid-template-columns:repeat(${d.bakken.length > 3 ? 2 : d.bakken.length},1fr)">
            ${d.bakken.map(b => `<button class="s-bak" data-b="${b.id}"><span class="ic">${b.icoon}</span><b>${esc(b.naam)}</b>${b.sub ? `<small>${esc(b.sub)}</small>` : ""}<span class="tel">${"●".repeat(telling[b.id])}</span></button>`).join("")}
          </div>
        </div>`;
      $(".say-mini", el).onclick = () => App.speak(k.t);
      if (autoLees()) App.speak(k.t);
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
        if (autoLees()) App.speak(`Dit hoort bij ${juist.naam}. ${k.uitleg || ""}`);
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
            <b>${esc(k.term)}</b><small>${e.woorden ? "✍️ " : ""}${e.thumb ? "🎨 " : ""}${r ? "★".repeat(r.box) + "☆".repeat(4 - r.box) : "nieuw"}</small></button>`; }).join("")}</div>`;
      App.sayButton($("#lees-menu", el), () => ["Mijn begrippen. Maak van elk begrip jouw kaart. Zeg of schrijf het in je eigen woorden, en maak er een klein tekeningetje bij. Wat je zelf maakt, onthoud je beter.", `Er staan ${te.length} kaarten klaar om te checken.`, `De begrippen zijn: ${lijst.map(k => k.term).join(", ")}.`]);   // vast en wisselend deel apart: het vaste deel krijgt een opname
      $("#check", el).onclick = check;
      $$(".kaart-tegel", el).forEach(b => b.onclick = () => maak(lijst.find(k => k.id === b.dataset.id)));
    }

    function maak(k) {
      opruimen();
      const e = eigen(k.id);
      el.innerHTML = `
        <div class="card kaart-maak">
          <button class="btn ghost small" id="terug">← Alle kaarten</button>
          <div class="km-kop"><span class="ic">${k.icoon}</span><h1>${esc(k.term)}</h1></div>
          <button class="say" id="lees">🔊 Lees voor</button>
          <div class="km-blok"><b>Wat is het?</b><p>${md(k.uitleg)}</p></div>
          ${k.voorbeeld ? `<div class="km-blok vb"><b>Voorbeeld</b><p>${md(k.voorbeeld)}</p></div>` : ""}
          <p style="margin:16px 0 6px"><b>✍️ In mijn eigen woorden</b> <span class="soft">(typ of spreek in met 🎤)</span></p>
          <textarea id="woorden" placeholder="Zeg het zoals jij het aan een vriendin zou uitleggen…">${esc(e.woorden || "")}</textarea>
          <p style="margin:16px 0 6px"><b>🎨 Mijn tekeningetje</b> <span class="soft">(een plaatje dat jou helpt herinneren)</span></p>
          <div id="tek">${e.thumb ? `<img src="${e.thumb}" class="km-thumb" alt=""><br>` : ""}<button class="btn ghost small" id="teken">✏️ ${e.thumb ? "Aanpassen" : "Tekenen"}</button></div>
          <div class="row" style="margin-top:16px"><button class="btn" id="bewaar">💾 Bewaar kaart</button><span class="ok" id="ok"></span></div>
        </div>`;
      App.sayButton($("#lees", el), () => `${k.term}. ${k.uitleg} ${k.voorbeeld ? "Voorbeeld: " + k.voorbeeld : ""}`);
      $("#terug", el).onclick = menu;
      $("#woorden", el).oninput = ev => { store.set(eigenKey(k.id), { ...eigen(k.id), woorden: ev.target.value }); };
      $("#teken", el).onclick = () => {
        $("#tek", el).innerHTML = `<div id="kst"></div>`;
        ui = Studio($("#kst", el), { aspect: 0.6, papier: "wit", strokes: eigen(k.id).strokes || [] });
      };
      $("#bewaar", el).onclick = () => {
        const nu = eigen(k.id); nu.woorden = $("#woorden", el).value;
        if (ui && !ui.doek.isEmpty()) { nu.strokes = ui.doek.getStrokes(); nu.thumb = ui.doek.toImage(360); }
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
        App.sayButton($("#lees", el), () => omgekeerd ? k.uitleg : k.term);
        if (autoLees()) App.speak(omgekeerd ? k.uitleg : k.term);
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
  const TOETSWOORDEN = /\b(Noem|Leg uit|Bereken|Geef|Waarom|Verklaar|Wat is|Wat betekent|Welke|Hoe heet|één|twee|drie|vier|vijf|niet)\b/g;
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
            <div class="row" style="justify-content:space-between"><span class="soft">Vraag ${totaal - rij.length + 1} van ${totaal} · ${esc(q.par || "")}</span><button class="btn ghost small" id="stop">Stoppen</button></div>
            <div class="vraag">${vraagHtml}</div>
            <div class="row"><button class="say" id="lees" style="margin:0">🔊 Lees voor</button><button class="btn ghost small" id="tip">💡 Hoe pak ik dit aan?</button></div>
            <div class="tipbox" id="tipbox" hidden>${TIPS[q.type] || ""}</div>
            <div id="antw" style="margin-top:12px"></div>
            <div id="kb" style="margin-top:12px"></div>
            <div id="fb"></div>
          </div>`;
        App.sayButton($("#lees", el), () => q.vraag + (q.keuzes ? ". " + q.keuzes.map((k, i) => "ABCD"[i] + ": " + k).join(". ") : ""));
        if (autoLees()) App.speak(q.vraag);
        $("#tip", el).onclick = () => { $("#tipbox", el).hidden = !$("#tipbox", el).hidden; };
        $("#stop", el).onclick = start;
        kb = kladblok($("#kb", el));
        const A = $("#antw", el), F = $("#fb", el);
        const oordeel = (auto) => {
          F.insertAdjacentHTML("beforeend", auto ? `<div class="row" style="margin-top:12px"><button class="btn" id="vd">Volgende →</button></div>` :
            `<p style="margin:14px 0 6px"><b>Hoe ging het?</b></p><div class="oordeel"><button class="btn ghost" data-o="nee">😕 Nog niet</button><button class="btn ghost" data-o="bijna">🤔 Bijna</button><button class="btn" data-o="ken">😎 Ken ik</button></div>`);
          const verder = o => { stats[o]++; V.beoordeel("vragen", q.id, o); const id = rij.shift(); if (o === "nee") rij.push(id); toon(); };
          if (auto) $("#vd", el).onclick = () => verder(auto); else $$("[data-o]", el).forEach(b => b.onclick = () => verder(b.dataset.o));
        };
        if (q.type === "reken") {
          A.innerHTML = `<div class="row"><input inputmode="decimal" class="ant groot-in" placeholder="€ jouw antwoord"><button class="btn" id="chk">Check ✓</button></div>`;
          let p = 0;
          $("#chk", el).onclick = () => {
            const v = getal($(".ant", el).value);
            if (Math.abs(v - q.antwoord) < 0.01) { $("#chk", el).remove(); F.innerHTML = `<div class="model goed">✓ Goed! ${md(q.uitwerking)}</div>`; oordeel(p === 0 ? "ken" : "bijna"); }
            else if (++p === 1) F.innerHTML = `<div class="model">Nog niet. 💡 ${md(q.hint || "Kijk nog eens naar de formule.")}</div>`;
            else { $("#chk", el).remove(); F.innerHTML = `<div class="model">Het antwoord is <b>${euro(q.antwoord)}</b>.<br>${md(q.uitwerking)}</div>`; oordeel("nee"); }
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
    function teken(p) {
      opr();
      el.innerHTML = `<div class="card geh-kop"><b>${p.icoon} Teken uit je hoofd: ${esc(p.titel)}</b><br><span class="soft">${md(p.opdracht)}</span>
        <div class="row" style="margin-top:10px"><button class="btn" id="klaar">✅ Klaar, laat zien</button><button class="btn ghost small" id="terug">← Terug</button></div></div><div id="st"></div>`;
      ui = Studio($("#st", el), { aspect: 0.75, papier: "wit" });
      $("#terug", el).onclick = menu;
      $("#klaar", el).onclick = () => vergelijk(p);
    }
    function vergelijk(p) {
      const strokes = ui.doek.getStrokes(), beeld = ui.doek.toImage(1200);
      opr();
      el.innerHTML = `<div class="card"><h2>Vergelijk 🔍</h2>
        <div class="vergelijk"><div><p class="soft">Jouw tekening</p><img src="${beeld}" alt=""></div><div><p class="soft">Zo ziet het eruit</p><div class="model-plaat">${p.model}</div></div></div>
        <p style="margin:14px 0 6px"><b>Wat had je al?</b></p>
        ${p.check.map(c => `<label class="punt"><input type="checkbox"> ${md(c)}</label>`).join("")}
        <div class="row" style="margin-top:14px"><button class="btn" id="bew">💾 Bewaar in Mijn tekeningen</button><button class="btn ghost" id="terug">← Andere plaat</button><span class="ok" id="ok"></span></div></div>`;
      V.update(v => v.geheugen[p.id] = { laatst: Date.now() });
      $("#terug", el).onclick = menu;
      $("#bew", el).onclick = async () => {
        await App.db.put("tekeningen", { id: "t" + Date.now(), datum: Date.now(), titel: "Uit mijn hoofd: " + p.titel, tag: "geheugen", data: beeld, strokes, aspect: 0.75 });
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
      const nt = $("#naar-teken", el); if (nt) nt.onclick = () => { pause(); App.tekenMet(d.teken); };
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
    const t = $("#teken-plaat", el); if (t) t.onclick = () => App.tekenMet(d.teken);
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
      <div class="deel-kop oefen">${ik("oefenen")}<div><h2>Oefenen</h2><span>Herhalen tot je het kent. Hiermee laadt je lightstick op.</span></div></div>
      <div class="oefen-grid">${oefen.map(o => `<button class="oefen-tegel" data-go="${o.id}"><span class="tile-ic">${o.icoon}</span><b>${esc(o.naam)}</b><small>${oefenInfo[o.id] || ""}</small></button>`).join("")}</div>
      <details class="meet" style="margin-top:22px"><summary>🔬 Waarom werkt het zo? (voor papa)</summary>
        <ul class="waarom">${(cfg.waarom || []).map(w => `<li>${w}</li>`).join("")}</ul></details>`;
    // Vast deel apart (krijgt een opname); datum, percentage en taken wisselen en blijven de iPad-stem.
    const dagZin = dagen == null ? "Vul de datum van je toets in, dan plan ik je herhaling." : dagen < 0 ? "De toets is geweest." : dagen === 0 ? "De toets is vandaag. Succes!" : dagen === 1 ? "De toets is morgen." : `Nog ${dagen} dagen tot de toets.`;
    App.sayButton($("#lees-ov", el), () => [cfg.spreekTitel || cfg.titel, dagZin, `Je lightstick is voor ${pct} procent opgeladen.`, taken.length ? "Vandaag, ongeveer " + min + " minuten: " + taken.map(t => t.t).join(". ") + "." : "Alles gedaan voor vandaag."]);
    $$("[data-go]", el).forEach(b => b.onclick = () => App.go(cfg.mod + "-" + b.dataset.go));
    $$("[data-p]", el).forEach(b => b.onclick = () => App.go(cfg.mod + "-p" + b.dataset.p));
    $("#td", el).onchange = e => { V.update(x => x.toets = e.target.value ? new Date(e.target.value + "T08:00:00").getTime() : null); App.go(cfg.mod + "-overzicht"); };
  }

  App.Leer = { Voortgang, lightstick, chat, sorteer, kaarten, rekenen, toets, geheugen, kladblok, tijdlijn, filmpje, plaat, video, overzicht, md, euro, shuffle };
})();
