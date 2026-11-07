/* Economie – Hoofdstuk 4: Een eigen bedrijf (LWEO Kopen en Werken, havo 3).
   Eigen samenvatting en eigen voorbeeld ('Purple Cases'); geen tekst uit het boek. */
(function () {
  const { $, $$, speak, stopSpeak, canSpeak } = App;

  /* ===== De plaat: marketingplan ===== */
  function plaat(el) {
    el.innerHTML = `
    <div class="card">
      <div class="biz"><div class="biz-ico">📱</div>
        <div><h1>Jouw bedrijfje: Purple Cases</h1>
        <p class="soft" style="margin:0">Stel: jij verkoopt zelfgemaakte photocard-hoesjes aan K-pop-fans.</p></div></div>
      <p style="margin-top:14px">Hoe zorg je dat het lukt? Daarvoor schrijf je een <b>marketingplan</b>. Daarin staan twee dingen: de <b>SWOT-analyse</b> en de <b>5 P's</b>.</p>
      <button class="say" data-say="Jouw bedrijfje heet Purple Cases. Stel: jij verkoopt zelfgemaakte photocard-hoesjes aan K-pop-fans. Hoe zorg je dat het lukt? Daarvoor schrijf je een marketingplan. Daarin staan twee dingen: de SWOT-analyse, en de vijf P's.">🔊 Lees voor</button>
      <div><div class="switch"><button class="sel" id="m-kijk">👀 Kijk-versie</button><button id="m-doe">✏️ Doe-versie</button></div></div>
      <p class="soft" id="doe-uitleg" style="display:none">Bij de vraagtekens staat het begrip verstopt. Kijk naar het voorbeeld en bedenk het zelf. Schrijf of teken het eerst. Tik dan om te checken.</p>
    </div>

    <div class="card">
      <h2>1 · De SWOT-analyse</h2>
      <button class="say" data-say="De SWOT-analyse. Bovenaan kijk je in de spiegel: naar jezelf. Dat heet intern. Je sterke punten heten sterkten. Bijvoorbeeld: ik weet wat fans mooi vinden. Je zwakke punten heten zwakten. Bijvoorbeeld: ik heb geen ervaring met administratie. Onderaan kijk je uit het raam: naar de wereld buiten jou. Dat heet extern. Goede dingen buiten heten kansen. Bijvoorbeeld: er komt een nieuw album uit, dus fans willen merch. Gevaren buiten heten bedreigingen. Bijvoorbeeld: grote webshops verkopen goedkope hoesjes. Trucje: komt het van jou? Dan is het een sterkte of zwakte. Komt het van buiten? Dan is het een kans of bedreiging.">🔊 Lees voor</button>
      <div class="swot">
        <div class="corner"></div><div class="hd plus">➕ Goed</div><div class="hd min">➖ Niet goed</div>
        <div class="side"><div class="e">🪞</div><b>Spiegel</b><span>kijk naar jezelf</span><span class="soft">= <span class="bl">intern</span></span></div>
        <div class="cell plus"><div class="t"><span class="letter">S</span><span class="bl">Sterkten</span></div><div class="ex">“Ik weet precies wat fans mooi vinden. En ik kan goed tekenen.”</div></div>
        <div class="cell min"><div class="t"><span class="letter">W</span><span class="bl">Zwakten</span></div><div class="ex">“Ik heb geen ervaring met administratie. En weinig tijd naast school.”</div></div>
        <div class="side"><div class="e">🪟</div><b>Raam</b><span>kijk naar buiten</span><span class="soft">= <span class="bl">extern</span></span></div>
        <div class="cell plus"><div class="t"><span class="letter">O</span><span class="bl">Kansen</span></div><div class="ex">“Er komt een nieuw album uit, dus fans willen merch. En fans kopen veel online.”</div></div>
        <div class="cell min"><div class="t"><span class="letter">T</span><span class="bl">Bedreigingen</span></div><div class="ex">“Grote webshops verkopen goedkope hoesjes. En er is officiële merch.”</div></div>
      </div>
      <div class="trick">💡 <b>Trucje:</b> komt het <b>van jou</b>? → sterkte of zwakte. Komt het <b>van buiten</b>? → kans of bedreiging.</div>
    </div>

    <div class="card">
      <h2>2 · De 5 P's</h2>
      <button class="say" data-say="De vijf P's. Tel ze op je hand. Product: wat verkoop je? Een hoesje met eigen ontwerp en glitter, in een cadeauzakje. Prijs: wat kost het? Acht euro. Duurder dan een webshop, want handgemaakt. Plaats: waar kun je het kopen? In je webshop, en op een kraampje bij een fan-meetup. Promotie: hoe hoort de klant ervan? Met TikTok-filmpjes van het maken. Personeel: hoe help je de klant? Snel antwoord geven, en een handgeschreven bedankkaartje. Let op: soms gebruikt je boek vier P's, zonder personeel.">🔊 Lees voor</button>
      <div class="hand"><div class="e">✋</div><div>Tel ze op je hand: <b>vijf vingers, vijf P's.</b></div></div>
      <div class="ps">
        <div class="p"><div class="ic">📦</div><div class="nm bl">Product</div><div class="q">Wat verkoop je?</div><div class="ex">Hoesje met eigen ontwerp en glitter, in een cadeauzakje.</div></div>
        <div class="p"><div class="ic">💶</div><div class="nm bl">Prijs</div><div class="q">Wat kost het?</div><div class="ex">€8. Duurder dan een webshop, want handgemaakt.</div></div>
        <div class="p"><div class="ic">📍</div><div class="nm bl">Plaats</div><div class="q">Waar kun je het kopen?</div><div class="ex">In je webshop en op een kraampje bij een fan-meetup.</div></div>
        <div class="p"><div class="ic">📣</div><div class="nm bl">Promotie</div><div class="q">Hoe hoort de klant ervan?</div><div class="ex">TikTok-filmpjes van het maken.</div></div>
        <div class="p"><div class="ic">🙋</div><div class="nm bl">Personeel</div><div class="q">Hoe help je de klant?</div><div class="ex">Snel antwoord en een handgeschreven bedankkaartje.</div></div>
      </div>
      <p class="note">Soms zijn het 4 P's (zonder Personeel). Check in je boek welke jouw docent gebruikt.</p>
      <div class="row" style="margin-top:14px"><button class="btn ghost" id="teken-plaat">✏️ Teken je eigen SWOT of P's</button></div>
    </div>`;

    function setMode(doe) {
      $("#m-kijk", el).classList.toggle("sel", !doe); $("#m-doe", el).classList.toggle("sel", doe);
      $("#doe-uitleg", el).style.display = doe ? "block" : "none";
      $$(".trick", el).forEach(t => t.style.display = doe ? "none" : "block");
      $$(".bl", el).forEach(b => { b.classList.toggle("blank", doe); b.classList.remove("open"); });
    }
    $("#m-kijk", el).onclick = () => setMode(false);
    $("#m-doe", el).onclick = () => setMode(true);
    el.addEventListener("click", e => { const b = e.target.closest(".blank"); if (b) b.classList.toggle("open"); });
    $("#teken-plaat", el).onclick = () => App.tekenMet("Marketingplan");
  }

  /* ===== Het filmpje: financieel plan ===== */
  function filmpje(el) {
    el.innerHTML = `
    <div class="card">
      <h1>Hoeveel verdien je écht?</h1>
      <p class="soft">Purple Cases, één maand. Kijk hoe het geld verdwijnt… en wat er overblijft.</p>
      <div class="stage">
        <div class="chart"><div class="zero" id="zero"></div>
          ${[0, 1, 2, 3, 4].map(i => `<div class="col" style="left:${i * 20}%;width:20%"><div class="bar ${["b-omzet", "b-inkoop", "b-bruto", "b-kosten", "b-netto"][i]}" id="b${i}"><div class="val"></div></div></div>`).join("")}
        </div>
        <div class="labels" id="labels"><span>Omzet</span><span>Inkoop­waarde</span><span>Bruto­winst</span><span>Bedrijfs­kosten</span><span>Netto­winst</span></div>
      </div>
      <div class="caption" id="caption"></div>
      <div class="ctrl">
        <button class="btn" id="play">▶ Afspelen</button>
        <button class="btn ghost" id="prev" aria-label="Vorige">◀</button>
        <button class="btn ghost" id="nextS" aria-label="Volgende">▶|</button>
        <button class="btn ghost" id="snd">🔊 Geluid aan</button>
        <div class="prog"><i id="progbar"></i></div>
      </div>
    </div>`;

    const MIN = -150, MAX = 1300, pct = v => ((v - MIN) / (MAX - MIN)) * 100;
    $("#zero", el).style.bottom = pct(0) + "%";
    const N = { omzet: [0, 1200], inkoop: [750, 1200], bruto: [0, 750], kosten: [500, 750], netto: [0, 500] };
    const V = { omzet: [0, 320], inkoop: [200, 320], bruto: [0, 200], kosten: [-50, 200], netto: [-50, 0] };
    const eur = n => (n < 0 ? "− €" : "€") + Math.abs(n).toLocaleString("nl-NL");
    const S = [
      { t: `Purple Cases verkoopt deze maand <b>150 hoesjes</b>.<br>Het aantal dat je verkoopt heet de <b>afzet</b>.`, s: "Purple Cases verkoopt deze maand honderdvijftig hoesjes. Het aantal dat je verkoopt, heet de afzet.", bars: {}, lab: 0 },
      { t: `Elk hoesje kost <b>€8</b>. Dus: 150 × €8 = <b>€1.200</b>.<br>Dat is je <b>omzet</b>. <span class="formula">Omzet = afzet × verkoopprijs</span>`, s: "Elk hoesje kost acht euro. Honderdvijftig keer acht is twaalfhonderd euro. Dat is je omzet. Omzet is afzet keer verkoopprijs.", bars: { omzet: N.omzet }, lab: 1 },
      { t: `Maar jij moest de spullen zelf inkopen: <b>€3</b> per hoesje.<br>150 × €3 = <b>€450</b>. Dat heet de <b>inkoopwaarde van de omzet</b>.`, s: "Maar jij moest de spullen zelf inkopen. Drie euro per hoesje. Honderdvijftig keer drie is vierhonderdvijftig euro. Dat heet de inkoopwaarde van de omzet.", bars: { omzet: N.omzet, inkoop: N.inkoop }, lab: 2 },
      { t: `Wat over is: €1.200 − €450 = <b>€750</b>.<br>Dat is je <b>brutowinst</b>. Bruto = er moet nog wat af.`, s: "Wat over is: twaalfhonderd min vierhonderdvijftig is zevenhonderdvijftig euro. Dat is je brutowinst. Bruto betekent: er moet nog wat af.", bars: { omzet: N.omzet, inkoop: N.inkoop, bruto: N.bruto }, lab: 3 },
      { t: `Nu de andere kosten: webshop €40, reclame €110, verzekering €25, verzendmateriaal €75.<br>Samen <b>€250</b>. Dat zijn de <b>bedrijfskosten</b>.`, s: "Nu de andere kosten. Webshop veertig euro. Reclame honderdtien. Verzekering vijfentwintig. Verzendmateriaal vijfenzeventig. Samen tweehonderdvijftig euro. Dat zijn de bedrijfskosten.", bars: { omzet: N.omzet, inkoop: N.inkoop, bruto: N.bruto, kosten: N.kosten }, lab: 4 },
      { t: `€750 − €250 = <b>€500</b>. Dat is je <b>nettowinst</b> 🎉<br><b>Netto</b> = wat je <b>nét</b> overhoudt. Echt voor jou.`, s: "Zevenhonderdvijftig min tweehonderdvijftig is vijfhonderd euro. Dat is je nettowinst. Netto is wat je net overhoudt. Echt voor jou.", bars: N, lab: 5 },
      { t: `<div class="ladder"><div class="rung">① <span class="formula">Omzet</span> = afzet × verkoopprijs</div><div class="rung">② <span class="formula">Brutowinst</span> = omzet − inkoopwaarde van de omzet</div><div class="rung">③ <span class="formula">Nettowinst</span> = brutowinst − bedrijfskosten</div></div>`, s: "Nog één keer de trap. Eén: omzet is afzet keer verkoopprijs. Twee: brutowinst is omzet min inkoopwaarde van de omzet. Drie: nettowinst is brutowinst min bedrijfskosten.", bars: N, lab: 5, long: true },
      { t: `Maar… wat als je er deze maand maar <b>40</b> verkoopt? 😬<br>Omzet €320 − inkoop €120 = brutowinst €200.`, s: "Maar wat als je er deze maand maar veertig verkoopt? Omzet driehonderdtwintig euro. Min inkoop honderdtwintig. Brutowinst tweehonderd euro.", bars: { omzet: V.omzet, inkoop: V.inkoop, bruto: V.bruto }, lab: 3 },
      { t: `De bedrijfskosten blijven <b>€250</b>. Ook als je weinig verkoopt!<br>€200 − €250 = <b>− €50</b>. Dat is <b>verlies</b>. Dit is het <b>risico</b> van een eigen bedrijf.`, s: "De bedrijfskosten blijven tweehonderdvijftig euro. Ook als je weinig verkoopt. Tweehonderd min tweehonderdvijftig is min vijftig euro. Dat is verlies. Dit is het risico van een eigen bedrijf.", bars: V, lab: 5 },
      { t: `✏️ <b>Jouw beurt.</b> Teken één plaatje van wat je onthoudt.<br><button class="btn small" id="naar-teken" style="margin-top:10px">✏️ Ga tekenen</button>`, s: "Jouw beurt. Teken één plaatje van wat je onthoudt.", bars: V, lab: 5 }
    ];
    const KEYS = ["omzet", "inkoop", "bruto", "kosten", "netto"];
    let sc = 0, playing = false, timer = null, sound = canSpeak;
    if (!canSpeak) $("#snd", el).textContent = "🔇 Geen geluid";

    function draw() {
      const sc_ = S[sc];
      KEYS.forEach((k, i) => {
        const b = $("#b" + i, el), r = sc_.bars[k];
        if (r) {
          const lo = Math.min(...r), hi = Math.max(...r);
          b.style.bottom = pct(lo) + "%"; b.style.height = (pct(hi) - pct(lo)) + "%"; b.classList.add("show");
          const amt = (k === "inkoop" || k === "kosten") ? -(hi - lo) : (k === "netto" ? (r[1] === 0 ? r[0] : r[1]) : hi);
          const v = b.querySelector(".val"); v.textContent = eur(amt);
          if (k === "netto") { b.classList.toggle("neg", amt < 0); v.style.top = amt < 0 ? "auto" : "-30px"; v.style.bottom = amt < 0 ? "-30px" : "auto"; }
        } else { b.classList.remove("show"); b.style.height = "0%"; b.style.bottom = pct(0) + "%"; }
      });
      $$("#labels span", el).forEach((s, i) => s.classList.toggle("show", i < sc_.lab));
      $("#caption", el).innerHTML = sc_.t;
      $("#progbar", el).style.width = ((sc + 1) / S.length * 100) + "%";
      const nt = $("#naar-teken", el); if (nt) nt.onclick = () => { pause(); App.tekenMet("Omzet en winst"); };
    }
    function advance() { clearTimeout(timer); if (!playing) return; if (sc >= S.length - 1) { pause(); return; } sc++; run(); }
    function run() {
      draw(); stopSpeak(); if (!playing) return;
      if (sound && canSpeak) speak(S[sc].s, () => { if (playing) timer = setTimeout(advance, 1200); });
      else timer = setTimeout(advance, S[sc].long ? 9000 : 6500);
    }
    function play() { if (sc >= S.length - 1) sc = 0; playing = true; $("#play", el).textContent = "⏸ Pauze"; run(); }
    function pause() { playing = false; clearTimeout(timer); stopSpeak(); $("#play", el).textContent = sc >= S.length - 1 ? "⟲ Opnieuw" : "▶ Afspelen"; }
    $("#play", el).onclick = () => playing ? pause() : play();
    $("#nextS", el).onclick = () => { if (sc < S.length - 1) { sc++; playing ? run() : draw(); } };
    $("#prev", el).onclick = () => { if (sc > 0) { sc--; playing ? run() : draw(); } };
    $("#snd", el).onclick = () => { if (!canSpeak) return; sound = !sound; $("#snd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) stopSpeak(); };
    draw();
    return () => { playing = false; clearTimeout(timer); };
  }

  App.addModule({
    id: "economie-h4",
    vak: "Economie",
    titel: "H4 Een eigen bedrijf",
    sub: "Marketingplan en financieel plan, met je eigen bedrijfje Purple Cases.",
    icoon: "💼",
    onderdelen: [
      { id: "plaat", naam: "De plaat", icoon: "🗺️", render: plaat },
      { id: "filmpje", naam: "Het filmpje", icoon: "🎬", render: filmpje }
    ]
  });
})();
