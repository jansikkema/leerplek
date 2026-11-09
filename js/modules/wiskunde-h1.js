/* Wiskunde – Hoofdstuk 1: Lineaire problemen (havo 3, Getal & Ruimte).
   Bron: de samenvatting van het hoofdstuk in haar boek. Eigen uitleg en eigen voorbeelden; geen tekst uit het boek.
   Eerste proef van het schetsbord (besluit 20): alleen het uitlegfilmpje bij §1.1, om te testen of tekenen + stem helpt.
   Komt het goed aan, dan volgen de andere paragrafen (1.2 lineaire verbanden, 1.3 vergelijkingen, 1.4 snijpunten,
   1.5 ongelijkheden, 1.6 vergelijkingen met twee variabelen) en de vaste oefenvormen.
   Opbouw: §1.1 schetsbord 'De formule y = ax + b' (photocards sparen → tabel → grafiek → a en b → dalende lijn →
   constante en recht evenredig verband → van lijn naar formule → zelf tekenen).
   Voorlezen: t = tekst op het scherm, s = wat de stem zegt (formules voluit: x = "iks", y = "ij"). */
(function () {
  const L = App.Leer;
  const { mk, assen, lijnDoor, trap, tabel, formule } = L.schets;
  const MOD = "wiskunde-h1";
  const V = L.Voortgang(MOD);
  const DAG = 864e5;

  /* ----- kleine tekeningen ----- */
  function kaartje(b, x, y, hoek, c) {   // photocard: kaartje met een rondje (hoofd) en schoudertjes
    const g = mk("g", { transform: `rotate(${hoek} ${x + 22} ${y + 31})` }, b.g);
    b.in(g, () => { b.rh(x, y, 44, 62, { c, w: 2.4 }); b.cirkel(x + 22, y + 24, 8, { c, w: 1.8 }); b.lijn([[x + 9, y + 50], [x + 22, y + 37], [x + 35, y + 50]], { c, w: 1.8 }); });
  }

  /* ----- §1.1 het filmpje ----- */
  const FILM11 = {
    mod: MOD,
    titel: "📈 De formule y = ax + b",
    intro: "Kijk en luister. Alles wordt stap voor stap getekend. Aan het eind teken jij.",
    teken: "Wiskunde H1 · y = ax + b",
    scenes: [
      { kop: "Photocards sparen", zinnen: [
        { t: "Je spaart photocards. Je hebt er al 3.", s: "Je spaart photocards. Je hebt er al drie.",
          teken(b) { kaartje(b, 40, 70, -8); kaartje(b, 80, 62, 2); kaartje(b, 120, 70, 10); b.tekst(105, 175, "start: 3", { vet: true, c: "rood" }); } },
        { t: "Elke week koop je er 2 bij.", s: "Elke week koop je er twee bij.",
          teken(b) { kaartje(b, 210, 230, -6, "vak"); kaartje(b, 252, 226, 6, "vak"); b.tekst(250, 330, "+2 per week", { vet: true, c: "vak" }); } },
        { t: "Hoeveel heb je na een paar weken? Maak een tabel.", s: "Hoeveel heb je na een paar weken? Maak een tabel.",
          teken(b, S) {
            b.tekst(445, 70, "weken", { anker: "end", c: "zacht", grootte: 17, leest: false }); b.tekst(445, 110, "kaarten", { anker: "end", c: "zacht", grootte: 17, leest: false });
            S.tab = tabel(b, 455, 42, [["x", 0, 1, 2, 3], ["y", 3, 5, 7, 9]]);
            for (let k = 1; k < 4; k++) b.tekst((S.tab.kol(k) + S.tab.kol(k + 1)) / 2, 150, "+2", { c: "vak", vet: true, grootte: 17, leest: false });
          } },
        { t: "Elke week komen er 2 bij. Dat schrijf je als formule: `y = 2x + 3`.", s: "Elke week komen er twee bij. Dat schrijf je als formule: ij is twee iks plus drie.",
          teken(b, S) {
            const p = formule(b, 600, 270, [["y = ", "inkt"], ["2", "vak"], ["x + ", "inkt"], ["3", "rood"]], { grootte: 46 });
            b.pijl([p[1], 300], [p[1] - 40, 345], { c: "vak", w: 2.2, punt: 9 }); b.tekst(p[1] - 50, 372, "erbij per week", { c: "vak", grootte: 17, vet: true });
            b.pijl([p[3], 300], [p[3] + 30, 345], { c: "rood", w: 2.2, punt: 9 }); b.tekst(p[3] + 45, 372, "start", { c: "rood", grootte: 17, vet: true });
            S.f = p;
          } },
        { t: "Zo'n formule heet een **lineaire formule**.",
          teken(b) { b.rh(470, 222, 260, 66, { c: "zacht", w: 2 }); b.tekst(600, 420, "lineaire formule", { vet: true, grootte: 24 }); } }
      ] },
      { kop: "De grafiek", zinnen: [
        { t: "Teken een assenstelsel. Horizontaal de x-as, verticaal de y-as.", s: "Teken een assenstelsel. Horizontaal de iks-as, verticaal de ij-as.",
          teken(b, S) { S.P = assen(b, { x: 250, y: 40, w: 500, h: 385, xmin: -1, xmax: 5, ymin: -1, ymax: 11 }); } },
        { t: "Twee punten zijn genoeg. Neem uit de tabel `(0, 3)` en `(3, 9)`.", s: "Twee punten zijn genoeg. Neem uit de tabel het punt nul, drie en het punt drie, negen.",
          teken(b, S) {
            const P = S.P;
            tabel(b, 40, 60, [["x", 0, 3], ["y", 3, 9]], { kolom: 50 });
            b.stip(...P(0, 3));
            b.lijn([P(3, 0), P(3, 9)], { c: "zacht", w: 1.6, snel: .5 }); b.lijn([P(0, 9), P(3, 9)], { c: "zacht", w: 1.6, snel: .5 });
            b.stip(...P(3, 9)); b.tekst(P(3, 9)[0] + 12, P(3, 9)[1] + 22, "(3, 9)", { anker: "start", grootte: 17, vet: true, leest: false });
          } },
        { t: "Trek een rechte lijn door de twee punten. De grafiek van een lineaire formule is altijd een **lijn**.",
          teken(b, S) { lijnDoor(b, S.P, 2, 3); b.tekst(560, 70, [["y = 2x + 3", "vak"]], { vet: true, grootte: 26, anker: "start" }); } }
      ] },
      { kop: "Wat zijn a en b?", verder: true, zinnen: [
        { t: "Kijk waar de lijn de y-as snijdt: bij 3. Daar begon je mee.", s: "Kijk waar de lijn de ij-as snijdt: bij drie. Daar begon je mee.",
          teken(b, S) { const A = S.P(0, 3); b.cirkel(A[0], A[1], 15, { c: "rood", w: 2.6 }); b.tekst(A[0] - 30, A[1] + 7, "b = 3", { anker: "end", vet: true, c: "rood", grootte: 22 }); } },
        { t: "Ga vanaf dat punt 1 naar rechts. Dan moet je 2 omhoog om weer op de lijn te komen.", s: "Ga vanaf dat punt één naar rechts. Dan moet je twee omhoog om weer op de lijn te komen.",
          teken(b, S) { trap(b, S.P, 0, 3, 1, 2); } },
        { t: "Dat getal 2 heet de **richtingscoëfficiënt**, kort: rc. Hoe groter de rc, hoe steiler de lijn.", s: "Dat getal twee heet de richtingscoëfficiënt, kort: r c. Hoe groter de r c, hoe steiler de lijn.",
          teken(b) { b.tekst(560, 130, [["rc = 2", "rood"]], { vet: true, grootte: 26, anker: "start" }); b.tekst(560, 162, "richtingscoëfficiënt", { grootte: 17, anker: "start", c: "zacht" }); } },
        { t: "Dat werkt bij elke formule `y = ax + b`. Het getal a is de rc. Het getal b is waar de lijn de y-as snijdt.", s: "Dat werkt bij elke formule ij is a iks plus b. Het getal a is de r c. Het getal b is waar de lijn de ij-as snijdt.",
          teken(b) {
            b.rh(540, 205, 240, 200, { c: "zacht", w: 2 });
            const p = formule(b, 660, 260, [["y = ", "inkt"], ["a", "vak"], ["x + ", "inkt"], ["b", "rood"]], { grootte: 40 });
            b.tekst(555, 315, [["a", "vak"], [" = de rc"]], { anker: "start", grootte: 19, vet: true });
            b.tekst(555, 350, [["b", "rood"], [": waar de lijn"]], { anker: "start", grootte: 19, vet: true });
            b.tekst(574, 378, "de y-as snijdt", { anker: "start", grootte: 19, vet: true });
          } }
      ] },
      { kop: "Een lijn die omlaag gaat", zinnen: [
        { t: "Neem nu `y = −2x + 4`. Begin op de y-as, in het punt `(0, 4)`.", s: "Neem nu de formule ij is min twee iks plus vier. Begin op de ij-as, in het punt nul, vier.",
          teken(b, S) {
            S.P = assen(b, { x: 60, y: 35, w: 330, h: 390, xmin: -1, xmax: 4, ymin: -4, ymax: 5 });
            b.tekst(470, 90, [["y = ", "inkt"], ["−2", "rood"], ["x + ", "inkt"], ["4", "vak"]], { vet: true, grootte: 36, anker: "start" });
            const A = S.P(0, 4); b.stip(...A); b.tekst(A[0] - 14, A[1] - 8, "(0, 4)", { anker: "end", grootte: 17, vet: true, leest: false });
          } },
        { t: "De rc is −2. Dus: 1 naar rechts, 2 omlaag. En nog een keer.", s: "De r c is min twee. Dus één naar rechts, en twee omlaag. En nog een keer.",
          teken(b, S) { trap(b, S.P, 0, 4, 1, -2); b.stip(...S.P(1, 2)); b.wacht(300); trap(b, S.P, 1, 2, 1, -2); b.stip(...S.P(2, 0)); } },
        { t: "Trek de lijn. Is de rc negatief, dan gaat de lijn **omlaag**.", s: "Trek de lijn. Is de r c negatief, dan gaat de lijn omlaag.",
          teken(b, S) {
            lijnDoor(b, S.P, -2, 4);
            b.tekst(470, 200, "rc negatief:", { vet: true, grootte: 22, anker: "start", c: "rood" });
            b.tekst(470, 232, "de lijn gaat omlaag", { grootte: 22, anker: "start" });
            b.pijl([500, 270], [580, 340], { c: "rood", w: 3 });
          } }
      ] },
      { kop: "Twee bijzondere lijnen", zinnen: [
        { t: "Is a = 0? Dan staat er `y = b`. Bijvoorbeeld `y = 3`.", s: "Is a gelijk aan nul? Dan staat er ij is b. Bijvoorbeeld ij is drie.",
          teken(b, S) { S.A = assen(b, { x: 50, y: 50, w: 280, h: 280, xmin: -1, xmax: 4, ymin: -1, ymax: 5, fs: 13 }); lijnDoor(b, S.A, 0, 3); b.tekst(S.A(2.6, 3)[0], S.A(0, 3)[1] - 12, "y = 3", { vet: true, c: "vak", grootte: 20 }); } },
        { t: "Je krijgt een horizontale lijn. Dit heet het **constante verband**.",
          teken(b) { b.tekst(190, 415, "het constante verband", { vet: true, grootte: 21 }); } },
        { t: "Is b = 0? Dan staat er `y = ax`. Bijvoorbeeld `y = 2x`.", s: "Is b gelijk aan nul? Dan staat er ij is a iks. Bijvoorbeeld ij is twee iks.",
          teken(b, S) { S.B = assen(b, { x: 450, y: 50, w: 280, h: 280, xmin: -1, xmax: 4, ymin: -1, ymax: 5, fs: 13 }); lijnDoor(b, S.B, 2, 0); b.tekst(S.B(2.5, 5)[0] + 18, S.B(0, 4.6)[1], "y = 2x", { vet: true, c: "vak", grootte: 20, anker: "start" }); } },
        { t: "Die lijn gaat door de **oorsprong**, het punt `(0, 0)`. Dit heet het **recht evenredig verband**.", s: "Die lijn gaat door de oorsprong, het punt nul, nul. Dit heet het recht evenredig verband.",
          teken(b, S) { const O = S.B(0, 0); b.cirkel(O[0], O[1], 15, { c: "rood", w: 2.6 }); b.tekst(O[0] + 60, O[1] + 40, "oorsprong", { c: "rood", vet: true, grootte: 17, anker: "start" }); b.tekst(600, 415, "het recht evenredig verband", { vet: true, grootte: 21 }); } }
      ] },
      { kop: "Andersom: van lijn naar formule", zinnen: [
        { t: "Andersom kan ook. Je ziet een lijn en je zoekt de formule.",
          teken(b, S) { S.P = assen(b, { x: 60, y: 40, w: 340, h: 385, xmin: -1, xmax: 5, ymin: -1, ymax: 5 }); lijnDoor(b, S.P, .5, 1); b.tekst(470, 80, "y = ? x + ?", { vet: true, grootte: 34, anker: "start" }); } },
        { t: "Stap 1: waar snijdt de lijn de y-as? Bij 1. Dus `b = 1`.", s: "Stap één: waar snijdt de lijn de ij-as? Bij één. Dus b is één.",
          teken(b, S) { const A = S.P(0, 1); b.cirkel(A[0], A[1], 15, { c: "rood", w: 2.6 }); b.tekst(470, 150, [["1. ", "zacht"], ["b = 1", "rood"]], { vet: true, grootte: 26, anker: "start" }); } },
        { t: "Stap 2: zoek een punt waar de lijn precies door een hoek van een hokje gaat. Hier: 2 naar rechts en 1 omhoog.", s: "Stap twee: zoek een punt waar de lijn precies door een hoek van een hokje gaat. Hier is dat twee naar rechts en één omhoog.",
          teken(b, S) { b.stip(...S.P(2, 2)); trap(b, S.P, 0, 1, 2, 1); b.tekst(470, 210, [["2. ", "zacht"], ["2 opzij, 1 omhoog", "inkt"]], { vet: true, grootte: 22, anker: "start" }); } },
        { t: "Stap 3: a = omhoog gedeeld door opzij. Dat is 1 : 2. Dus `a = ½`.", s: "Stap drie: a is omhoog gedeeld door opzij. Dat is één gedeeld door twee. Dus a is een half.",
          teken(b) { b.tekst(470, 270, [["3. ", "zacht"], ["a = 1 : 2 = ½", "vak"]], { vet: true, grootte: 26, anker: "start" }); b.tekst(500, 300, "omhoog gedeeld door opzij", { grootte: 16, anker: "start", c: "zacht", leest: false }); } },
        { t: "De formule is `y = ½x + 1`.", s: "Dus de formule is: ij is een half iks plus één.",
          teken(b) { b.tekst(470, 380, [["y = ", "inkt"], ["½", "vak"], ["x + ", "inkt"], ["1", "rood"]], { vet: true, grootte: 40, anker: "start" }); b.lijn([[465, 395], [700, 393]], { c: "vak", w: 3 }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Teken zelf de grafiek van `y = 3x − 2`. Begin met een tabel met twee punten.", s: "Jouw beurt. Teken zelf de grafiek van ij is drie iks min twee. Begin met een tabel met twee punten.",
          teken(b) {
            b.tekst(400, 110, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" });
            b.tekst(400, 180, "y = 3x − 2", { vet: true, grootte: 34 });
            tabel(b, 310, 230, [["x", "?", "?"], ["y", "?", "?"]], { kolom: 60, rij: 44 });
            b.tekst(400, 380, "Daarna: assenstelsel, twee punten, lijn.", { grootte: 19, c: "zacht" });
          } }
      ] }
    ]
  };

  /* ================= STRUCTUUR ================= */
  const STATIONS = [
    { par: "§1.1", icoon: "📈", titel: "De formule y = ax + b", delen: ["film11"] }
  ];
  const NAMEN = { film11: "📈 Filmpje y = ax + b" };
  const IDS = { kaarten: [], vragen: [] };

  const overzicht = el => L.overzicht(el, {
    mod: MOD, titel: "Wiskunde H1 · Lineaire problemen", spreekTitel: "Wiskunde hoofdstuk één. Lineaire problemen.",
    IDS, STATIONS, NAMEN, GEHEUGEN: [],
    waarom: [
      "<b>Proef met het schetsbord:</b> de grafiek ontstaat lijn voor lijn terwijl de stem uitlegt. Een schema zien ontstaan werkt beter dan het af zien (Fiorella & Mayer 2016).",
      "<b>Tekening en stem lopen per zin gelijk:</b> elke zin heeft zijn eigen stuk tekening. Zo hoeft ze niet te zoeken waar de stem het over heeft.",
      "<b>Eigen tempo:</b> met de tempoknop worden de pauzes en het tekenen langzamer; de stem zelf blijft gewoon.",
      "<b>Eindigt met zelf tekenen:</b> kijken is pas het begin; zelf de grafiek maken laat het blijven hangen.",
      "<b>Om te meten:</b> vul na afloop 'Na afloop (voor papa)' in. Wat weet ze de volgende dag nog van a en b?"
    ]
  });

  const film11 = el => L.schetsbord(el, FILM11, () => V.klaar("film11"));

  App.addModule({
    id: MOD,
    vak: "Wiskunde",
    titel: "H1 Lineaire problemen",
    sub: "Proef: het filmpje over y = ax + b.",
    icoon: "📈",
    thuis: ["overzicht"],
    stations: STATIONS,
    meten: ["film11"],
    status() {
      const v = V.get(), d = v.toets ? Math.ceil((v.toets - Date.now()) / DAG) : null;
      return `${d != null && d >= 0 ? `📅 Toets ${d === 0 ? "vandaag" : d === 1 ? "morgen" : "over " + d + " dagen"} · ` : ""}${v.gedaan.film11 ? "🎬 Filmpje gezien" : "🎬 Begin met het filmpje"}`;
    },
    onderdelen: [
      { id: "overzicht", naam: "Overzicht", icoon: "🗺️", groep: "", render: overzicht },
      { id: "film11", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Kijk hoe de grafiek van y = ax + b ontstaat. Aan het eind teken jij.", render: film11 }
    ]
  });
})();
