/* Economie – Hoofdstuk 4: Een eigen bedrijf (LWEO Kopen en Werken, havo 3).
   Eigen samenvattingen en eigen voorbeelden ('Purple Cases' e.d.); geen tekst uit het boek.
   ⚠️ Toetswoorden uit het boek zijn leidend: pas hieronder aan als het boek andere woorden gebruikt.
   Opbouw: §1 loondienst of eigen baas · §2 ondernemingsplan · §3 marketingplan (SWOT, 5 P's) · §4 financieel plan. */
(function () {
  const { $, $$, esc, store, speak, stopSpeak, canSpeak } = App;
  const L = App.Leer;
  const MOD = "economie-h4";
  const V = L.Voortgang(MOD);
  const DAG = 864e5;

  /* ================= INHOUD ================= */

  const CHAT = {
    titel: "💬 Loondienst of eigen baas?",
    intro: "Mila en Sam zijn allebei fan. Sam heeft een bijbaan, Mila wil iets voor zichzelf beginnen. Tik op **Volgende** of op **Afspelen**. Tik op een berichtje om het nog een keer te horen.",
    personen: {
      sam: { naam: "Sam", emoji: "🎧", kleur: "#5EC8F2", kant: "links", stem: "Puck" },   // ingesproken stem (haar keuze)
      mila: { naam: "Mila", emoji: "💜", kleur: "#B79CFF", kant: "rechts" }
    },
    berichten: [
      { van: "sam", tekst: "Ik heb een bijbaan! Bij de merchwinkel in de stad 🛍️" },
      { van: "mila", tekst: "Leuk! Dus je werkt voor een baas?" },
      { van: "sam", tekst: "Ja. Ik ben **werknemer**. De winkel is mijn **werkgever**. Dat heet werken in **loondienst**." },
      { van: "mila", tekst: "En wat krijg je daarvoor?" },
      { van: "sam", tekst: "Elke maand een vast **loon**. Ook als het een keer rustig is in de winkel." },
      { van: "mila", tekst: "En als je ziek bent?" },
      { van: "sam", tekst: "Dan betaalt mijn werkgever gewoon door. En ik heb **vakantiedagen** 🏖️" },
      { van: "mila", tekst: "Ik wil liever mijn eigen bedrijfje. Hoesjes maken voor photocards 📱" },
      { van: "sam", tekst: "Dan ben je **zelfstandig ondernemer**. Je eigen baas!" },
      { van: "mila", tekst: "Precies. Ik bepaal zelf wat ik maak en wanneer ik werk. **Vrijheid**! En als het goed loopt, kan ik veel verdienen: **winst**." },
      { van: "sam", tekst: "Maar wat als niemand iets koopt? 😬" },
      { van: "mila", tekst: "Dan heb ik geen inkomen. Of ik maak **verlies**. Gaat het heel slecht, dan kan ik **failliet** gaan. Dat heet het **ondernemersrisico**." },
      { van: "sam", tekst: "Bij mij draagt de werkgever dat risico. Niet ik." },
      { van: "mila", tekst: "Klopt. En ik moet zelf een **verzekering** regelen. Voor als ik ziek word of niet meer kan werken: **arbeidsongeschiktheid**." },
      { van: "sam", tekst: "Dus: loondienst = zekerheid. Eigen baas = vrijheid, maar ook risico ⚖️" },
      { van: "mila", tekst: "Ja! Maar ik ga het toch proberen. Eerst maak ik een goed plan… 📋" }
    ]
  };

  const SORT_LOON = {
    titel: "⚖️ Waar hoort het bij?",
    uitleg: "Lees de kaart (of tik op 🔊) en tik op de goede kant.",
    bakken: [{ id: "loon", naam: "Loondienst", icoon: "🏢", sub: "werknemer" }, { id: "eigen", naam: "Eigen baas", icoon: "🚀", sub: "zelfstandig ondernemer" }],
    kaarten: [
      { t: "Elke maand een vast loon", bak: "loon" },
      { t: "Zelf beslissen wat je doet", bak: "eigen" },
      { t: "De werkgever draagt het risico", bak: "loon", uitleg: "Als werknemer krijg je je loon, ook als de winkel slecht draait." },
      { t: "Kans op een hoog inkomen (winst)", bak: "eigen" },
      { t: "Doorbetaald worden als je ziek bent", bak: "loon" },
      { t: "Zelf een verzekering regelen voor arbeidsongeschiktheid", bak: "eigen", uitleg: "Een ondernemer heeft geen werkgever die doorbetaalt. Die moet dat zelf regelen." },
      { t: "Risico op faillissement", bak: "eigen" },
      { t: "Geen vast inkomen", bak: "eigen" },
      { t: "Vakantiedagen zijn geregeld", bak: "loon" },
      { t: "Vrijheid", bak: "eigen" }
    ]
  };

  const PLAN = [
    { id: "ondernemer", icoon: "🙋", naam: "De ondernemer", vraag: "Wie ben je en wat kun je?", tour: "Wie staan er op het podium? Wat kunnen ze?", vb: "Ik kan goed tekenen en ik weet wat fans mooi vinden." },
    { id: "regels", icoon: "📜", naam: "Regels en vergunningen", vraag: "Welke wetten gelden er? Welke papieren heb je nodig?", tour: "Mag het concert in dat stadion? Is er een vergunning van de gemeente?", vb: "Ik schrijf me in bij de Kamer van Koophandel. Voor een kraampje op de markt vraag ik een vergunning aan." },
    { id: "marketing", icoon: "📣", naam: "Het marketingplan", vraag: "Hoe trek je klanten?", tour: "Hoe horen fans van de tour? Wat kost een kaartje?", vb: "Mijn SWOT-analyse en mijn 5 P's: prijs €8, TikTok-filmpjes, een webshop…" },
    { id: "financieel", icoon: "💶", naam: "Het financieel plan", vraag: "Is er genoeg geld? Ga je winst maken?", tour: "Levert de tour meer op dan hij kost?", vb: "Ik reken uit: omzet − inkoopwaarde = brutowinst − bedrijfskosten = nettowinst." }
  ];

  const SORT_PLAN = {
    titel: "🧱 In welk deel van het plan?",
    uitleg: "Purple Cases schrijft een ondernemingsplan. Waar hoort elke zin?",
    bakken: PLAN.map(p => ({ id: p.id, naam: p.naam.replace(/^(De |Het )/, ""), icoon: p.icoon })),
    kaarten: [
      { t: "Ik ben creatief en kan goed tekenen.", bak: "ondernemer" },
      { t: "Ik heb al eens een kraampje gehad op een fan-meetup.", bak: "ondernemer", uitleg: "Je ervaring zegt iets over jou als ondernemer." },
      { t: "Ik schrijf me in bij de Kamer van Koophandel.", bak: "regels" },
      { t: "Voor een kraam op de markt heb ik een vergunning van de gemeente nodig.", bak: "regels" },
      { t: "Ik maak TikTok-filmpjes om klanten te trekken.", bak: "marketing", uitleg: "Klanten trekken = marketing (de P van Promotie)." },
      { t: "Mijn hoesjes kosten €8.", bak: "marketing", uitleg: "De prijs is een van de 5 P's, en die horen in het marketingplan." },
      { t: "Ik maak een SWOT-analyse.", bak: "marketing" },
      { t: "Ik heb €200 nodig om materiaal te kopen.", bak: "financieel" },
      { t: "Ik reken uit of ik winst ga maken.", bak: "financieel" },
      { t: "Ik schat hoeveel hoesjes ik per maand verkoop.", bak: "financieel", uitleg: "Met de verwachte afzet reken je de omzet uit. Dat is rekenwerk voor het financieel plan." }
    ]
  };

  const SORT_SWOT = {
    titel: "🪞🪟 SWOT: sterkte, zwakte, kans of bedreiging?",
    uitleg: "Nieuw bedrijfje: **Dance Lab**, K-pop-danslessen in het dorpshuis. Komt het van jou (spiegel) of van buiten (raam)? Is het goed of niet goed?",
    bakken: [{ id: "S", naam: "Sterkte", icoon: "💪", sub: "van jou · goed" }, { id: "W", naam: "Zwakte", icoon: "🩹", sub: "van jou · niet goed" }, { id: "O", naam: "Kans", icoon: "🌟", sub: "van buiten · goed" }, { id: "T", naam: "Bedreiging", icoon: "⛈️", sub: "van buiten · niet goed" }],
    kaarten: [
      { t: "Ik kan heel goed dansen en uitleggen.", bak: "S" },
      { t: "De zaal in het dorpshuis is klein.", bak: "W", uitleg: "Het gaat over jouw eigen bedrijf, dus intern. En het is een minpunt." },
      { t: "K-pop-dansen wordt steeds populairder.", bak: "O", uitleg: "Een ontwikkeling in de markt (buiten jou) waar je gebruik van kunt maken." },
      { t: "Er opent een grote dansschool in de stad.", bak: "T", uitleg: "Een concurrent komt van buiten en is een gevaar." },
      { t: "Ik heb weinig geld voor reclame.", bak: "W" },
      { t: "Veel scholen zoeken leuke workshops.", bak: "O" },
      { t: "De huur van zalen gaat omhoog.", bak: "T" },
      { t: "Mijn lessen zijn heel gezellig, leerlingen nemen vriendinnen mee.", bak: "S" }
    ]
  };

  const SORT_5P = {
    titel: "✋ Bij welke P hoort het?",
    uitleg: "Nog steeds **Dance Lab**. Welk marketinginstrument zet de ondernemer hier in?",
    bakken: [{ id: "product", naam: "Product", icoon: "📦" }, { id: "prijs", naam: "Prijs", icoon: "💶" }, { id: "plaats", naam: "Plaats", icoon: "📍" }, { id: "promotie", naam: "Promotie", icoon: "📣" }, { id: "personeel", naam: "Personeel", icoon: "🙋" }],
    kaarten: [
      { t: "Een workshop kost €12.", bak: "prijs" },
      { t: "Filmpjes van de lessen op Instagram.", bak: "promotie" },
      { t: "De lessen zijn in het dorpshuis.", bak: "plaats" },
      { t: "90 minuten dansen, en je krijgt een filmpje van je eigen optreden.", bak: "product", uitleg: "Wat je precies krijgt (en de extra service) is het product." },
      { t: "De leraren zijn vriendelijk en helpen iedereen.", bak: "personeel" },
      { t: "Korting als je een vriendin meeneemt.", bak: "prijs" },
      { t: "Flyers ophangen op school.", bak: "promotie" },
      { t: "Je kunt de les ook online volgen.", bak: "plaats", uitleg: "Waar (of hoe) klanten het product krijgen = plaats. Online is ook een plaats." }
    ]
  };

  const REKEN = {
    voorbeeld: { naam: "Purple Cases", icoon: "📱", verhaal: "Je verkoopt deze maand 150 photocard-hoesjes van €8. Jij kocht elk hoesje in voor €3.", afzet: 150, prijs: 8, inkoopPerStuk: 3, kosten: [{ naam: "webshop", bedrag: 40 }, { naam: "reclame", bedrag: 110 }, { naam: "verzekering", bedrag: 25 }, { naam: "verzendmateriaal", bedrag: 75 }] },
    samen: { naam: "Photocard-houders", icoon: "📇", verhaal: "Je koopt photocard-houders in voor €2 per stuk. Je verkoopt ze voor €3. Deze maand verkoop je er 100. Je verzekering kost €50.", afzet: 100, prijs: 3, inkoopPerStuk: 2, kosten: [{ naam: "verzekering", bedrag: 50 }] },
    maak() {
      const T = [
        { naam: "Lightstick-hoesjes", icoon: "🔦", ding: "lightstick-hoesjes", p: [6, 8, 10, 12], i: [2, 3, 4] },
        { naam: "Zelfgemaakte fan-zines", icoon: "📰", ding: "fan-zines", p: [4, 5, 6], i: [1, 2] },
        { naam: "Armbandjes met namen", icoon: "📿", ding: "armbandjes", p: [3, 4, 5], i: [1, 2] },
        { naam: "Stickervellen", icoon: "✨", ding: "stickervellen", p: [2, 3, 4], i: [1] },
        { naam: "Bubble tea op de fan-meetup", icoon: "🧋", ding: "bekers bubble tea", p: [4, 5, 6], i: [2, 3] },
        { naam: "Tote bags met eigen tekening", icoon: "👜", ding: "tassen", p: [12, 15, 18], i: [5, 6, 8] }
      ];
      const r = a => a[Math.floor(Math.random() * a.length)];
      const t = r(T), prijs = r(t.p), ink = Math.min(r(t.i), prijs - 1), afzet = (4 + Math.floor(Math.random() * 26)) * 10;
      const bruto = afzet * (prijs - ink), verlies = Math.random() < 0.25;
      const doel = verlies ? bruto + (2 + Math.floor(Math.random() * 8)) * 10 : Math.max(30, Math.round(bruto * (0.3 + Math.random() * 0.4) / 5) * 5);
      const soorten = ["huur kraam", "reclame", "verzekering", "webshop", "verzendkosten", "energie"];
      const k1 = Math.round(doel * 0.5 / 5) * 5, k2 = Math.round(doel * 0.3 / 5) * 5, k3 = Math.max(5, doel - k1 - k2);
      const namen = L.shuffle(soorten).slice(0, 3);
      return { naam: t.naam, icoon: t.icoon, verhaal: `Je verkoopt ${afzet} ${t.ding} van €${prijs}. Jij betaalt zelf €${ink} per stuk.`, afzet, prijs, inkoopPerStuk: ink,
        kosten: [{ naam: namen[0], bedrag: k1 }, { naam: namen[1], bedrag: k2 }, { naam: namen[2], bedrag: k3 }] };
    }
  };

  const BEGRIPPEN = [
    { id: "loondienst", icoon: "🏢", term: "loondienst", uitleg: "Je werkt als **werknemer** voor een **werkgever** en krijgt elke maand een vast **loon**.", voorbeeld: "Sam werkt in de merchwinkel en krijgt elke maand loon." },
    { id: "ondernemer", icoon: "🚀", term: "zelfstandig ondernemer", uitleg: "Je bent je eigen baas en hebt een eigen bedrijf.", voorbeeld: "Mila met haar bedrijfje Purple Cases." },
    { id: "risico", icoon: "🎢", term: "ondernemersrisico", uitleg: "Het risico dat je als ondernemer **verlies** maakt of zelfs **failliet** gaat.", voorbeeld: "Als niemand hoesjes koopt, heeft Mila geen inkomen." },
    { id: "faillissement", icoon: "💥", term: "faillissement", uitleg: "Een bedrijf kan zijn rekeningen niet meer betalen en moet stoppen.", voorbeeld: "Een kledingwinkel gaat failliet en sluit de deuren." },
    { id: "arbeidsongeschikt", icoon: "🩼", term: "arbeidsongeschiktheid", uitleg: "Je kunt door ziekte of een ongeluk (een tijd) niet werken. Een ondernemer moet zich hier **zelf** voor verzekeren.", voorbeeld: "Mila breekt haar pols en kan een tijd geen hoesjes maken." },
    { id: "ondernemingsplan", icoon: "📋", term: "ondernemingsplan", uitleg: "Een plan dat je schrijft vóórdat je een bedrijf start. Ook wel **bedrijfsplan**. Vier delen: de ondernemer, regels en vergunningen, het marketingplan, het financieel plan.", voorbeeld: "Zoals een K-popgroep een tour pas start met een goed plan." },
    { id: "vergunning", icoon: "📜", term: "vergunning", uitleg: "Toestemming (vaak van de **gemeente**) om iets te mogen doen.", voorbeeld: "Een vergunning voor een kraampje op de markt." },
    { id: "marketingplan", icoon: "📣", term: "marketingplan", uitleg: "Het deel van je plan over **hoe je klanten trekt**. Met de SWOT-analyse en de marketingmix (de 5 P's).", voorbeeld: "Purple Cases: TikTok-filmpjes, prijs €8, een webshop." },
    { id: "swot", icoon: "🪞", term: "SWOT-analyse", uitleg: "Sterkten en zwakten (**intern**: van jou) en kansen en bedreigingen (**extern**: van buiten).", voorbeeld: "Spiegel = intern, raam = extern." },
    { id: "intern", icoon: "🪞", term: "intern / extern", uitleg: "**Intern** = binnen je eigen bedrijf (sterkten, zwakten). **Extern** = buiten je bedrijf, in de markt (kansen, bedreigingen).", voorbeeld: "'Ik kan goed tekenen' is intern. 'Er komt een concurrent' is extern." },
    { id: "marketingmix", icoon: "✋", term: "marketingmix (5 P's)", uitleg: "De instrumenten om je product te verkopen: **Product, Prijs, Plaats, Promotie, Personeel**. Soms 4 P's (zonder Personeel).", voorbeeld: "Tel ze op je hand: vijf vingers, vijf P's." },
    { id: "afzet", icoon: "📦", term: "afzet", uitleg: "Het **aantal stuks** dat je verkoopt.", voorbeeld: "Purple Cases verkoopt 150 hoesjes: de afzet is 150." },
    { id: "omzet", icoon: "💰", term: "omzet", uitleg: "Het **totale bedrag** dat je binnenkrijgt met verkopen (zonder btw). **Omzet = afzet × verkoopprijs.**", voorbeeld: "150 × €8 = €1.200 omzet." },
    { id: "inkoopwaarde", icoon: "🧾", term: "inkoopwaarde van de omzet", uitleg: "Wat jij zelf hebt betaald voor de producten die je **verkocht** hebt.", voorbeeld: "150 hoesjes × €3 = €450 inkoopwaarde." },
    { id: "brutowinst", icoon: "🥈", term: "brutowinst", uitleg: "Wat over is als je de inkoopwaarde van de omzet eraf haalt. **Brutowinst = omzet − inkoopwaarde van de omzet.** Bruto = er moet nog wat af.", voorbeeld: "€1.200 − €450 = €750 brutowinst." },
    { id: "bedrijfskosten", icoon: "🏠", term: "bedrijfskosten", uitleg: "Alle **andere** kosten om je bedrijf te runnen: huur, reclame, energie, verzekeringen.", voorbeeld: "Webshop €40 + reclame €110 + verzekering €25 + verzendmateriaal €75 = €250." },
    { id: "nettowinst", icoon: "🥇", term: "nettowinst", uitleg: "Wat je **echt** overhoudt. **Nettowinst = brutowinst − bedrijfskosten.** Is het negatief? Dan maak je **verlies**.", voorbeeld: "€750 − €250 = €500 nettowinst." }
  ];

  const VRAGEN = [
    { id: "v1", par: "§1", type: "noem", vraag: "Noem twee voordelen van werken in loondienst.", antwoord: "Bijvoorbeeld: je krijgt elke maand een vast loon · je wordt doorbetaald als je ziek bent · je hebt vakantiedagen · de werkgever draagt het risico.", punten: ["Je hebt er **twee** genoemd", "Het zijn voordelen voor de **werknemer**"] },
    { id: "v2", par: "§1", type: "noem", vraag: "Noem twee nadelen of risico's van een eigen bedrijf.", antwoord: "Bijvoorbeeld: geen vast inkomen · kans op verlies of faillissement · je moet zelf een verzekering regelen (ziekte, arbeidsongeschiktheid).", punten: ["Je hebt er **twee** genoemd"] },
    { id: "v3", par: "§1", type: "uitleg", vraag: "Leg uit wat het ondernemersrisico is.", antwoord: "Het risico dat een ondernemer **verlies** maakt of zelfs **failliet** gaat, **omdat** hij geen vast inkomen heeft en zelf alle risico draagt.", punten: ["Verlies of faillissement genoemd", "Je zegt **waarom** (omdat…)"] },
    { id: "v4", par: "§1", type: "uitleg", vraag: "Leg uit waarom een zelfstandig ondernemer zelf een verzekering voor arbeidsongeschiktheid regelt.", antwoord: "Omdat hij **geen werkgever** heeft die doorbetaalt. Als hij niet kan werken, heeft hij **geen inkomen**.", punten: ["Geen werkgever die doorbetaalt", "Anders geen inkomen"] },
    { id: "v5", par: "§2", type: "noem", vraag: "Uit welke vier onderdelen bestaat een ondernemingsplan?", antwoord: "1 De ondernemer · 2 Regels en vergunningen · 3 Het marketingplan · 4 Het financieel plan.", punten: ["De ondernemer", "Regels en vergunningen", "Marketingplan", "Financieel plan"] },
    { id: "v6", par: "§2", type: "uitleg", vraag: "Waarom schrijft een ondernemer een ondernemingsplan voordat hij begint?", antwoord: "Om **vooraf** goed na te denken of zijn idee **haalbaar** is (komen er klanten, mag het, maakt hij winst?).", punten: ["Vooraf nadenken", "Haalbaar"] },
    { id: "v7", par: "§2", type: "keuze", vraag: "In welk deel van het ondernemingsplan staat dat je een vergunning van de gemeente nodig hebt?", keuzes: ["De ondernemer", "Regels en vergunningen", "Het marketingplan", "Het financieel plan"], goed: 1, uitleg: "Wetten en papieren die je nodig hebt, horen bij regels en vergunningen." },
    { id: "v8", par: "§3", type: "keuze", vraag: "Een ondernemer schrijft: “Er opent binnenkort een grote concurrent in de buurt.” Wat is dit in de SWOT-analyse?", keuzes: ["Sterkte", "Zwakte", "Kans", "Bedreiging"], goed: 3, uitleg: "Het komt van **buiten** (extern) en is **negatief**: een bedreiging." },
    { id: "v9", par: "§3", type: "uitleg", vraag: "Leg uit wat het verschil is tussen een sterkte en een kans.", antwoord: "Allebei positief. Een **sterkte** is **intern** (iets van het bedrijf zelf). Een **kans** is **extern** (een ontwikkeling buiten het bedrijf, in de markt).", punten: ["Sterkte = intern", "Kans = extern"] },
    { id: "v10", par: "§3", type: "noem", vraag: "Noem de vijf P's van de marketingmix.", antwoord: "Product · Prijs · Plaats · Promotie · Personeel.", punten: ["Alle vijf", "Tip: tel ze op je hand ✋"] },
    { id: "v11", par: "§3", type: "keuze", vraag: "Een ondernemer verkoopt zijn producten alleen via een webshop. Bij welke P hoort dit?", keuzes: ["Product", "Prijs", "Plaats", "Promotie"], goed: 2, uitleg: "**Waar** het product te koop is = Plaats. Een webshop is ook een plaats." },
    { id: "v12", par: "§3", type: "keuze", vraag: "Welke zin is een zwakte?", keuzes: ["“Ik heb nog geen ervaring met administratie.”", "“Er is veel vraag naar duurzame producten.”", "“Ik kan heel goed programmeren.”", "“De huur van winkels stijgt.”"], goed: 0, uitleg: "Een zwakte is intern (van jezelf) en negatief." },
    { id: "v13", par: "§4", type: "reken", vraag: "Een bakker verkoopt 400 broden voor €3 per stuk. Bereken de omzet.", antwoord: 1200, hint: "Omzet = afzet × verkoopprijs.", uitwerking: "Omzet = afzet × verkoopprijs = 400 × €3 = **€1.200**." },
    { id: "v14", par: "§4", type: "reken", vraag: "De omzet is €1.200. De inkoopwaarde van de omzet is €500. Bereken de brutowinst.", antwoord: 700, hint: "Brutowinst = omzet − inkoopwaarde van de omzet.", uitwerking: "Brutowinst = €1.200 − €500 = **€700**." },
    { id: "v15", par: "§4", type: "reken", vraag: "De brutowinst is €700. De huur is €250, energie kost €80 en de verzekering €40. Bereken de nettowinst.", antwoord: 330, hint: "Tel eerst alle bedrijfskosten op. Nettowinst = brutowinst − bedrijfskosten.", uitwerking: "Bedrijfskosten = €250 + €80 + €40 = €370. Nettowinst = €700 − €370 = **€330**." },
    { id: "v16", par: "§4", type: "reken", vraag: "Een ondernemer heeft een omzet van €2.000. Hij verkoopt zijn product voor €25 per stuk. Bereken de afzet (in stuks).", antwoord: 80, hint: "Omzet = afzet × prijs, dus afzet = omzet ÷ prijs.", uitwerking: "Afzet = €2.000 ÷ €25 = **80 stuks**. (Hier geen € bij: het is een aantal.)" },
    { id: "v17", par: "§4", type: "reken", vraag: "De brutowinst is €600 en de bedrijfskosten zijn €750. Bereken de nettowinst.", antwoord: -150, hint: "Nettowinst = brutowinst − bedrijfskosten. Wat als de kosten groter zijn?", uitwerking: "€600 − €750 = **− €150**. De nettowinst is negatief: de ondernemer maakt **verlies**." },
    { id: "v18", par: "§4", type: "uitleg", vraag: "Leg uit wat het verschil is tussen brutowinst en nettowinst.", antwoord: "Bij de **brutowinst** is alleen de inkoopwaarde van de omzet eraf. Bij de **nettowinst** zijn ook de **bedrijfskosten** eraf. De nettowinst is wat de ondernemer echt overhoudt.", punten: ["Brutowinst = omzet − inkoopwaarde", "Nettowinst: ook de bedrijfskosten eraf"] },
    { id: "v19", par: "§4", type: "keuze", vraag: "Welke kosten horen bij de bedrijfskosten?", keuzes: ["De huur van het pand", "De inkoop van de verkochte producten", "De afzet"], goed: 0, uitleg: "Huur is een bedrijfskost. De inkoop van verkochte producten is de **inkoopwaarde van de omzet**, dat is iets anders." },
    { id: "v20", par: "§4", type: "keuze", vraag: "Is de omzet inclusief of exclusief btw?", keuzes: ["Inclusief btw", "Exclusief btw"], goed: 1, uitleg: "Omzet is **altijd exclusief** btw. De btw is niet van de ondernemer: die draagt hij af aan de Belastingdienst." }
  ];

  const MODEL = {
    plan: `<div class="mp-4">${PLAN.map((p, i) => `<div><b>${i + 1} ${p.icoon} ${esc(p.naam)}</b><br><small>${esc(p.vraag)}</small></div>`).join("")}</div>`,
    swot: `<div class="mp-swot"><div class="mp-h"></div><div class="mp-h">➕</div><div class="mp-h">➖</div><div class="mp-h">🪞 intern</div><div>S Sterkten</div><div>W Zwakten</div><div class="mp-h">🪟 extern</div><div>O Kansen</div><div>T Bedreigingen</div></div>`,
    p5: `<div class="mp-4">✋ ${["📦 Product", "💶 Prijs", "📍 Plaats", "📣 Promotie", "🙋 Personeel"].map(x => `<div>${x}</div>`).join("")}</div>`,
    trap: `<div class="mp-trap"><div>① <b>Omzet</b> = afzet × verkoopprijs</div><div>② <b>Brutowinst</b> = omzet − inkoopwaarde van de omzet</div><div>③ <b>Nettowinst</b> = brutowinst − bedrijfskosten</div><div class="soft">negatief = verlies</div></div>`,
    weegschaal: `<div class="mp-weeg"><div><b>🏢 Loondienst</b><br>vast loon · doorbetaald bij ziekte · vakantiedagen · werkgever draagt risico</div><div><b>🚀 Eigen baas</b><br>vrijheid · kans op winst · geen vast inkomen · risico op verlies/faillissement · zelf verzekeren</div></div>`
  };
  const GEHEUGEN = [
    { id: "weeg", icoon: "⚖️", titel: "Loondienst of eigen baas", opdracht: "Teken een weegschaal. Links loondienst, rechts eigen baas. Zet aan elke kant wat erbij hoort.", model: MODEL.weegschaal, check: ["Vast loon bij loondienst", "Vrijheid en kans op winst bij eigen baas", "Risico: verlies of faillissement", "Zelf verzekeren als ondernemer"] },
    { id: "plan", icoon: "🧱", titel: "De 4 delen van het ondernemingsplan", opdracht: "Teken vier blokken of een tour-plan. Welke vier delen zijn er?", model: MODEL.plan, check: ["De ondernemer", "Regels en vergunningen", "Marketingplan", "Financieel plan"] },
    { id: "swot", icoon: "🪞", titel: "De SWOT met spiegel en raam", opdracht: "Teken het vak met vier hokjes. Waar staat intern, waar extern?", model: MODEL.swot, check: ["Sterkten en zwakten = intern", "Kansen en bedreigingen = extern", "Goed links, niet goed rechts"] },
    { id: "p5", icoon: "✋", titel: "De 5 P's", opdracht: "Teken je hand. Bij elke vinger één P.", model: MODEL.p5, check: ["Product", "Prijs", "Plaats", "Promotie", "Personeel"] },
    { id: "trap", icoon: "🪜", titel: "De rekentrap: van omzet naar nettowinst", opdracht: "Teken de trap of de staafjes uit het filmpje, met de formules.", model: MODEL.trap, check: ["Omzet = afzet × prijs", "Brutowinst = omzet − inkoopwaarde van de omzet", "Nettowinst = brutowinst − bedrijfskosten", "Negatief = verlies"] }
  ];

  const IDS = { kaarten: BEGRIPPEN.map(b => b.id), vragen: VRAGEN.map(v => v.id) };
  const STATIONS = [
    { par: "§1", titel: "Loondienst of eigen baas?", icoon: "⚖️", delen: ["chat"] },
    { par: "§2", titel: "Het ondernemingsplan", icoon: "🧱", delen: ["bouwplan"] },
    { par: "§3", titel: "Het marketingplan", icoon: "📣", delen: ["plaat", "sorteren"] },
    { par: "§4", titel: "Het financieel plan", icoon: "💶", delen: ["filmpje", "rekenen"] }
  ];
  const NAMEN = { chat: "💬 Chat", bouwplan: "🧱 Bouwplan", plaat: "🗺️ De plaat", sorteren: "🔀 Sorteren", filmpje: "🎬 Filmpje", rekenen: "🧮 Zelf rekenen", begrippen: "🃏 Begrippen", geheugen: "🧠 Uit je hoofd", toets: "📝 Toetstraining" };

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
    $("#teken-plaat", el).onclick = () => App.tekenMet("Marketingplan"); App.toonTekening($("#teken-plaat", el), "Marketingplan");
  }

  /* ===== Het filmpje: financieel plan ===== */
  function filmpje(el, onEind) {
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
    let sc = 0, playing = false, timer = null, sound = true;

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
      if (sc === S.length - 1 && onEind) onEind();
      const nt = $("#naar-teken", el); if (nt) { nt.onclick = () => { pause(); App.tekenMet("Omzet en winst"); }; App.toonTekening(nt, "Omzet en winst"); }
    }
    function advance() { clearTimeout(timer); if (!playing) return; if (sc >= S.length - 1) { pause(); return; } sc++; run(); }
    function run() {
      draw(); stopSpeak(); if (!playing) return;
      if (sound) speak(S[sc].s, () => { if (playing) timer = setTimeout(advance, 1200); });
      else timer = setTimeout(advance, S[sc].long ? 9000 : 6500);
    }
    function play() { if (sc >= S.length - 1) sc = 0; playing = true; $("#play", el).textContent = "⏸ Pauze"; run(); }
    function pause() { playing = false; clearTimeout(timer); stopSpeak(); $("#play", el).textContent = sc >= S.length - 1 ? "⟲ Opnieuw" : "▶ Afspelen"; }
    $("#play", el).onclick = () => playing ? pause() : play();
    $("#nextS", el).onclick = () => { if (sc < S.length - 1) { sc++; playing ? run() : draw(); } };
    $("#prev", el).onclick = () => { if (sc > 0) { sc--; playing ? run() : draw(); } };
    $("#snd", el).onclick = () => { sound = !sound; $("#snd", el).textContent = sound ? "🔊 Geluid aan" : "🔇 Geluid uit"; if (!sound) stopSpeak(); };
    draw();
    return () => { playing = false; clearTimeout(timer); };
  }


  /* ================= ONDERDELEN ================= */
  const volgendeKnop = (na, id, tekst) => {
    if (!na) return;
    na.innerHTML = `<div class="card volgende"><b>Goed bezig! 🎉</b> ${tekst || ""}<div class="row" style="margin-top:10px"><button class="btn" id="vk">${NAMEN[id]} →</button><button class="btn ghost" id="vo">🗺️ Overzicht</button></div></div>`;
    $("#vk", na).onclick = () => App.go(MOD + "-" + id);
    $("#vo", na).onclick = () => App.go(MOD + "-overzicht");
  };

  const overzicht = el => L.overzicht(el, {
    mod: MOD, titel: "Economie H4 · Een eigen bedrijf", spreekTitel: "Economie hoofdstuk vier. Een eigen bedrijf.",
    IDS, STATIONS, NAMEN, GEHEUGEN,
    waarom: [
      "<b>Ophalen uit je geheugen</b> (sorteren, kaarten, uit je hoofd tekenen, toetsvragen) leert meer dan herlezen. Dat is een van de best onderbouwde leerstrategieën.",
      "<b>Gespreid herhalen:</b> kaarten en vragen komen terug na 1, 2, 4 en 7 dagen, en altijd nog vóór de toets.",
      "<b>Door elkaar oefenen</b> in de toetstraining: lastiger, maar je leert kiezen welke aanpak een vraag nodig heeft.",
      "<b>Uitgewerkte voorbeelden die afbouwen</b> bij rekenen: eerst kijken, dan samen, dan zelf.",
      "<b>Beeld én woord, korte stukjes, voorlezen:</b> minder leesdruk, meer begrip.",
      "<b>Zelf maken:</b> eigen woorden en een eigen tekening bij elk begrip.",
      "<b>Voorbeelden uit haar eigen wereld:</b> stof gekoppeld aan interesses blijkt motiverender en beter te onthouden.",
      "<b>Toetstaal oefenen:</b> 'noem', 'leg uit', 'bereken' worden gemarkeerd en uitgelegd, zodat de toets geen verrassing is."
    ]
  });

  function chatDeel(el) {
    return L.chat(el, CHAT, na => {
      V.klaar("chat-gelezen");
      const s = document.createElement("div"); na.appendChild(s);
      L.sorteer(s, SORT_LOON, na2 => { V.klaar("chat"); volgendeKnop(na2, "bouwplan", "Volgende stop: het plan van Mila."); });
      s.scrollIntoView({ behavior: "smooth" });
    });
  }

  function bouwplan(el) {
    el.innerHTML = `
      <div class="card">
        <h1>🧱 Het ondernemingsplan</h1>
        <button class="say" data-say="Een K-popgroep gaat pas op tour met een goed plan. Een ondernemer begint pas een bedrijf met een goed plan: het ondernemingsplan. Het heet ook wel bedrijfsplan. Het plan dwingt je om vooraf na te denken: is mijn idee haalbaar? Het plan heeft vier delen. Ezelsbruggetje: Wie ben ik? Mag het? Hoe trek ik klanten? Verdien ik er wat aan?">🔊 Lees voor</button>
        <p>Een K-popgroep gaat pas op tour met een goed plan. Een ondernemer begint pas een bedrijf met een goed plan: het <b>ondernemingsplan</b> (ook: <b>bedrijfsplan</b>).</p>
        <p>Waarom? Het plan dwingt je om <b>vooraf</b> na te denken: is mijn idee <b>haalbaar</b>?</p>
        <div class="trick">💡 <b>Vier vragen, vier delen:</b> Wie ben ik? · Mag het? · Hoe trek ik klanten? · Verdien ik er wat aan?</div>
      </div>
      <div class="plan-blokken">${PLAN.map((p, i) => `
        <div class="plan-blok">
          <div class="pb-kop"><span class="pb-nr">${i + 1}</span><span class="ic">${p.icoon}</span><b>${esc(p.naam)}</b></div>
          <p class="pb-vraag">${esc(p.vraag)}</p>
          <div class="pb-rij"><span>🎤 Tour</span>${esc(p.tour)}</div>
          <div class="pb-rij"><span>📱 Purple Cases</span>${esc(p.vb)}</div>
          <button class="say-mini" data-i="${i}" aria-label="Lees voor">🔊</button>
        </div>`).join("")}</div>
      <div id="srt"></div>`;
    $$(".plan-blok .say-mini", el).forEach(b => b.onclick = () => { const p = PLAN[+b.dataset.i]; App.speak(`${p.naam}. ${p.vraag} Bij een tour: ${p.tour} Bij Purple Cases: ${p.vb}`); });
    const s = $("#srt", el);
    s.innerHTML = `<button class="btn" id="go">🔀 Nu jij: sorteer de zinnen</button>`;
    $("#go", s).onclick = () => { L.sorteer(s, SORT_PLAN, na => { V.klaar("bouwplan"); volgendeKnop(na, "plaat", "Volgende stop: het marketingplan."); }); s.scrollIntoView({ behavior: "smooth" }); };
  }

  function sorteren(el) {
    el.innerHTML = `<div id="a"></div><div id="b"></div>`;
    L.sorteer($("#a", el), SORT_SWOT, na => {
      na.innerHTML = `<button class="btn" id="nb">Nu de 5 P's →</button>`;
      $("#nb", na).onclick = () => { $("#a", el).innerHTML = ""; L.sorteer($("#b", el), SORT_5P, na2 => { V.klaar("sorteren"); volgendeKnop(na2, "filmpje", "Volgende stop: het geld."); }); };
    });
  }

  function rekenen(el) {
    el.innerHTML = `<div class="card"><h1>🧮 Zelf rekenen</h1><p>Drie rondes: <b>kijk mee</b> → <b>samen</b> → <b>zelf</b>. Bij elke stap kies je ook hoe het bedrag heet. Op de toets moet je die woorden kennen.</p></div><div id="r"></div>`;
    L.rekenen($("#r", el), REKEN, () => V.klaar("rekenen"));
  }

  const begrippen = el => L.kaarten(el, MOD, BEGRIPPEN);
  const geheugen = el => L.geheugen(el, MOD, GEHEUGEN);
  const toetsDeel = el => L.toets(el, MOD, VRAGEN);

  const plaatDeel = el => { V.klaar("plaat"); return plaat(el); };
  const filmDeel = el => filmpje(el, () => { V.klaar("filmpje"); });

  App.addModule({
    id: MOD,
    vak: "Economie",
    titel: "H4 Een eigen bedrijf",
    sub: "Alle vier de paragrafen, met je eigen bedrijfje Purple Cases.",
    icoon: "💼",
    thuis: ["overzicht"],
    stations: STATIONS,
    meten: ["chat", "bouwplan", "plaat", "sorteren", "filmpje", "rekenen"],
    status() {
      const v = V.get(), d = v.toets ? Math.ceil((v.toets - Date.now()) / DAG) : null;
      const k = V.teDoen("kaarten", IDS.kaarten, 6).length, q = V.teDoen("vragen", IDS.vragen, 8).length;
      return `${d != null && d >= 0 ? `📅 Toets ${d === 0 ? "vandaag" : d === 1 ? "morgen" : "over " + d + " dagen"} · ` : ""}🔦 ${Math.round(V.beheersing(IDS) * 100)}% opgeladen · vandaag ${k} kaarten, ${Math.min(q, 8)} vragen`;
    },
    onderdelen: [
      { id: "overzicht", naam: "Overzicht", icoon: "🗺️", groep: "", render: overzicht },
      { id: "chat", naam: "Chat", icoon: "💬", groep: "Leren", kort: "Loondienst of eigen baas? Lees mee en sorteer.", render: chatDeel },
      { id: "bouwplan", naam: "Bouwplan", icoon: "🧱", groep: "Leren", kort: "De vier delen van het ondernemingsplan.", render: bouwplan },
      { id: "plaat", naam: "De plaat", icoon: "🗺️", groep: "Leren", kort: "SWOT en de 5 P's. Kijk-versie en doe-versie.", render: plaatDeel },
      { id: "sorteren", naam: "Sorteren", icoon: "🔀", groep: "Leren", kort: "Sterkte of zwakte? Welke P?", render: sorteren },
      { id: "filmpje", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Van omzet naar nettowinst, met staafjes.", render: filmDeel },
      { id: "rekenen", naam: "Zelf rekenen", icoon: "🧮", groep: "Leren", kort: "Kijk mee, samen, dan zelf.", render: rekenen },
      { id: "begrippen", naam: "Begrippen", icoon: "🃏", groep: "Oefenen", render: begrippen },
      { id: "geheugen", naam: "Uit je hoofd", icoon: "🧠", groep: "Oefenen", render: geheugen },
      { id: "toets", naam: "Toetstraining", icoon: "📝", groep: "Oefenen", render: toetsDeel }
    ]
  });
})();
