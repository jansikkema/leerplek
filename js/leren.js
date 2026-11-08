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
          <div class="row"><button class="btn small" id="cplay">▶ Afspelen</button><button class="btn ghost small" id="csnd">${App.canSpeak ? "🔊 Geluid aan" : "🔇 Geen geluid"}</button></div></div>
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
    let i = 0, playing = false, sound = App.canSpeak, t = null;
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
      if (!playing) return; const m = voeg(); if (!m) return;
      if (sound) App.speak(m.tekst, () => { if (playing) t = setTimeout(stap, 450); }, stem[m.van]);
      else t = setTimeout(stap, 1400 + m.tekst.length * 40);
    }
    $("#cnext", el).onclick = () => { playing = false; App.stopSpeak(); const m = voeg(); if (m && (sound && autoLees())) App.speak(m.tekst, null, stem[m.van]); };
    $("#cplay", el).onclick = () => {
      if (i >= d.berichten.length) { i = 0; $("#chat", el).innerHTML = ""; $("#cnext", el).hidden = false; $("#na", el).innerHTML = ""; }
      if (playing) { playing = false; App.stopSpeak(); $("#cplay", el).textContent = "▶ Afspelen"; return; }
      playing = true; $("#cplay", el).textContent = "⏸ Pauze"; stap();
    };
    $("#csnd", el).onclick = () => { if (!App.canSpeak) return; sound = !sound; $("#csnd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) App.stopSpeak(); };
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
      App.sayButton($("#lees-menu", el), () => `Mijn begrippen. Maak van elk begrip jouw kaart. Zeg of schrijf het in je eigen woorden, en maak er een klein tekeningetje bij. Wat je zelf maakt, onthoud je beter. Er staan ${te.length} kaarten klaar om te checken. De begrippen zijn: ${lijst.map(k => k.term).join(", ")}.`);
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
      App.sayButton($("#lc", el), () => c.verhaal);
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
          if (R.mode === "voorbeeld") App.speak(`${st.naam} is ${st.formule}. ${st.som.replace(/×/g, "keer").replace(/−/g, "min")} is ${euro(st.antwoord)}.`);
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
        <button class="say" data-say="Toetstraining. Vragen zoals op je toets, door elkaar. Dat voelt lastiger, maar zo leer je kiezen welke aanpak je nodig hebt. Precies wat je op de toets moet doen. Geen punten, geen tijd. Bij elke vraag kun je voorlezen, je kladblok gebruiken en een tip krijgen. Er staan ${te.length} vragen klaar.">🔊 Lees voor</button>
        <p>Vragen zoals op je toets, <b>door elkaar</b>. Dat voelt lastiger, maar zo leer je kiezen welke aanpak je nodig hebt. Precies wat je op de toets moet doen.</p>
        <p class="soft">Geen punten, geen tijd. Bij elke vraag kun je voorlezen, je kladblok gebruiken en een tip krijgen.</p>
        <button class="btn" id="go">Start (${te.length} vragen)</button></div>`;
      App.bindSay(el);
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
      App.sayButton($("#lees-geh", el), () => `Uit je hoofd. Teken een plaat zonder te kijken. Daarna vergelijk je. Het voelt moeilijk, en juist dat moeilijke ophalen zorgt dat het blijft hangen. Kies een plaat. De bovenste heb je het langst niet gedaan. De platen zijn: ${sorted.map(p => p.titel).join(". ")}.`);
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

  App.Leer = { Voortgang, lightstick, chat, sorteer, kaarten, rekenen, toets, geheugen, kladblok, md, euro, shuffle };
})();
