/* Wiskunde – Hoofdstuk 1: Lineaire problemen (havo 3, Getal & Ruimte).
   Bron: de samenvatting en de diagnostische toets van het hoofdstuk in haar boek. Eigen uitleg, eigen voorbeelden en
   eigen getallen; geen tekst en geen opgaven uit het boek.
   Opbouw per paragraaf: schetsbord-filmpje (eerst inspireren) → oefenen stap voor stap (kijk mee → samen → zelf,
   met steeds nieuwe sommen) en waar het past sorteren.
   §1.1 filmpje y = ax + b · sorteren 'welk verband?' · stap voor stap (formule bij een lijn, punt op een lijn, plus: evenwijdig)
   §1.2 filmpje kaartjes voor een tour · stap voor stap (uit een tabel, uit een grafiek met schaal)
   §1.3 filmpje weegschaal + werkschema · stap voor stap (zonder haakjes, met haakjes, plus: breuken)
   §1.4 filmpje snijpunten · stap voor stap (met de assen, van twee lijnen)
   §1.5 filmpje ongelijkheden · sorteren 'klapt het om?' · stap voor stap (rekenen, grafiek)
   §1.6 filmpje merch kopen · stap voor stap (oplossing controleren, berekenen, rc)
   Oefenen: 19 begrippen, 6 uit-je-hoofd-platen, 36 toetsvragen in de stijl van de diagnostische toets.
   Voorlezen: formules worden voluit uitgesproken via zeg() (x = "iks", y = "ij", (2, 5) = "met coördinaten 2 en 5"). */
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

  /* ================= HULP: formules netjes tonen en voluit uitspreken ================= */
  // zeg(): wat de stem zegt bij een tekst met formules. x = "iks", y = "ij", − = "min", (2, 5) = "met coördinaten 2 en 5"
  // (een komma tussen twee getallen leest de stem anders als "komma").
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

  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const kies = a => a[Math.floor(Math.random() * a.length)];
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };
  const ggd = (a, b) => b ? ggd(b, a % b) : Math.abs(a);
  const breuk = (t, n) => { if (n < 0) { t = -t; n = -n; } const g = ggd(t, n) || 1; t /= g; n /= g; return n === 1 ? String(t) : `${t}/${n}`; };
  const min = n => String(n).replace(/^-/, "−");
  const sg = n => n < 0 ? `− ${-n}` : `+ ${n}`;                // "+ 3" of "− 3" achter een term
  function fx(a, b, v = "x") {                                  // "ax + b" netjes; a mag een breuk "p/q" zijn
    const s = String(a), neg = s.startsWith("-"), abs = s.replace(/^-/, "");
    if (s === "0") return min(b);
    let t = (neg ? "−" : "") + (abs === "1" ? v : abs.includes("/") ? `{${abs}}${v}` : abs + v);
    if (b) t += " " + sg(b);
    return t;
  }
  const haakje = (p, q) => `${p === -1 ? "−" : p === 1 ? "" : min(p)}(x ${sg(q)})`;
  // voorleestekst van een stap (voorbeeld): de regel met alles ingevuld
  const vulIn = r => r.replace(/\[([^\]]+)\]/g, (m, v) => {
    if (v.includes("|")) return (v.split("|").find(x => x.startsWith("*")) || "").slice(1);
    if (v.startsWith("+")) { const w = v.slice(1); return w.startsWith("-") ? "− " + w.slice(1) : "+ " + w; }
    return v;
  });
  const klaarZet = q => { q.zeg = zeg(q.vraag); q.stappen.forEach(s => { s.zeg = zeg(s.wat + ". " + vulIn(s.regel).replace(/\{|\}/g, "")); }); return q; };

  /* ================= FILMPJES §1.2 – §1.6 (schetsbord) ================= */
  const rij = (b, i, label, f, o = {}) => {
    const y = (o.y0 || 70) + i * (o.dy || 66);
    if (label) b.tekst(o.lx || 22, y, label, { anker: "start", grootte: 17, c: "zacht", leest: false });
    b.tekst(o.fx || 330, y, f, { anker: "start", grootte: o.g || 30, vet: true, c: o.c });
  };
  function ticket(b, x, y) { b.rh(x, y, 200, 100, { c: "vak" }); b.lijn([[x + 145, y + 6], [x + 145, y + 94]], { c: "zacht", w: 1.6 }); b.tekst(x + 72, y + 62, "TOUR", { vet: true, grootte: 28, c: "vak", leest: false }); }
  function klok(b, x, y) { b.cirkel(x, y, 48); b.lijn([[x, y], [x, y - 32]], { w: 3 }); b.lijn([[x, y], [x + 24, y + 6]], { w: 3 }); }
  function zakje(b, x, y, c) { b.lijn([[x, y], [x + 3, y - 38], [x + 25, y - 38], [x + 28, y]], { c, w: 2.2 }); b.lijn([[x, y], [x + 28, y]], { c, w: 2.2 }); b.tekst(x + 14, y - 12, "x", { grootte: 17, vet: true, c, leest: false }); }
  function stapel(b, x, y, n) { b.rh(x + 4, y - 46, 34, 44, { w: 1.6, c: "zacht" }); b.rh(x, y - 42, 34, 42, { w: 2 }); b.tekst(x + 17, y - 14, String(n), { grootte: 17, vet: true, leest: false }); }
  function weegschaal(b) {   // balk met twee schalen; het steunpunt is een driehoek op een paal
    b.lijn([[230, 185], [230, 410]]); b.lijn([[170, 410], [290, 410]]);
    b.lijn([[206, 190], [230, 162], [254, 190], [206, 190]], { w: 2.2 });
    b.lijn([[40, 160], [420, 160]], { w: 3 });
    b.lijn([[120, 160], [30, 330]], { c: "zacht", w: 1.6 }); b.lijn([[120, 160], [210, 330]], { c: "zacht", w: 1.6 });
    b.lijn([[340, 160], [250, 330]], { c: "zacht", w: 1.6 }); b.lijn([[340, 160], [430, 330]], { c: "zacht", w: 1.6 });
    b.lijn([[22, 330], [218, 330]], { w: 3 }); b.lijn([[242, 330], [438, 330]], { w: 3 });
  }
  const kruis = (b, x, y, w = 28) => { b.lijn([[x - 2, y - 40], [x + w + 2, y + 2]], { c: "rood", w: 3, snel: .5 }); b.lijn([[x + w + 2, y - 40], [x - 2, y + 2]], { c: "rood", w: 3, snel: .5 }); };
  const LINKS = [28, 60, 92, 124, 156], RECHTS = [250, 282];

  const FILM12 = filmZeg({
    mod: MOD, titel: "📊 Lineaire verbanden", intro: "Andere letters, dezelfde lijn. Aan het eind teken jij.", teken: "Wiskunde H1 · lineair verband",
    scenes: [
      { kop: "Kaartjes voor een tour", zinnen: [
        { t: "De voorverkoop voor een tour begint. Er zijn 2000 kaartjes.", teken(b) { ticket(b, 40, 60); b.tekst(140, 215, "2000 kaartjes", { vet: true, grootte: 24 }); } },
        { t: "Elk uur worden er 250 verkocht.", teken(b) { klok(b, 400, 110); b.tekst(400, 215, "−250 per uur", { vet: true, grootte: 24, c: "rood" }); } },
        { t: "Het aantal kaartjes dat over is, noem je K. De tijd in uren noem je t.", teken(b) { b.tekst(560, 90, [["K", "vak"], [" = kaartjes over"]], { anker: "start", vet: true, grootte: 22 }); b.tekst(560, 140, [["t", "vak"], [" = tijd in uren"]], { anker: "start", vet: true, grootte: 22 }); } },
        { t: "Dan geldt: `K = −250t + 2000`. Dat is een **lineair verband** tussen t en K.", teken(b) { L.schets.formule(b, 400, 330, [["K = ", "inkt"], ["−250", "rood"], ["t + ", "inkt"], ["2000", "vak"]], { grootte: 44 }); b.tekst(400, 400, "lineair verband", { vet: true, grootte: 22 }); } }
      ] },
      { kop: "De grafiek, met een schaal", zinnen: [
        { t: "Op de assen staan nu t en K. Let op de schaal: één hokje omhoog is 250 kaartjes.",
          teken(b, S) { S.P = assen(b, { x: 90, y: 40, w: 420, h: 360, xmin: 0, xmax: 9, ymin: 0, ymax: 2250, vrij: true, sy: 250, elky: 2, xnaam: "t", ynaam: "K" }); b.tekst(600, 80, "1 hokje = 250", { grootte: 20, c: "zacht", leest: false }); } },
        { t: "De lijn begint bij 2000. Dus b = 2000.", teken(b, S) { lijnDoor(b, S.P, -250, 2000); const A = S.P(0, 2000); b.cirkel(A[0], A[1], 14, { c: "rood", w: 2.6 }); b.tekst(560, 150, [["b = 2000", "vak"]], { anker: "start", vet: true, grootte: 24 }); } },
        { t: "Ga 4 hokjes naar rechts: dat is 4 uur. De lijn zakt van 2000 naar 1000. Dat is 1000 omlaag.", teken(b, S) { trap(b, S.P, 0, 2000, 4, -1000); } },
        { t: "Dus a = −1000 : 4 = −250. De formule is `K = −250t + 2000`.", teken(b) { b.tekst(560, 210, [["a = −1000 : 4 = ", "inkt"], ["−250", "rood"]], { anker: "start", vet: true, grootte: 22 }); b.tekst(560, 260, "K = −250t + 2000", { anker: "start", vet: true, grootte: 24 }); } },
        { t: "Wanneer zijn alle kaartjes weg? Kijk waar de lijn de t-as raakt: bij t = 8.", teken(b, S) { const A = S.P(8, 0); b.cirkel(A[0], A[1], 14, { c: "rood", w: 2.6 }); b.tekst(560, 330, "na 8 uur uitverkocht", { anker: "start", vet: true, grootte: 22, c: "rood" }); } }
      ] },
      { kop: "Uit een tabel", zinnen: [
        { t: "Een fanclub heeft 120 leden. Elke maand komen er 15 bij.",
          teken(b, S) {
            b.tekst(165, 92, "maanden", { anker: "end", c: "zacht", grootte: 17, leest: false }); b.tekst(165, 132, "leden", { anker: "end", c: "zacht", grootte: 17, leest: false });
            S.t = tabel(b, 175, 64, [["t", 0, 1, 2, 3, 4], ["L", 120, 135, 150, 165, 180]], { kolom: 90 });
            for (let k = 1; k < 5; k++) b.tekst((S.t.kol(k) + S.t.kol(k + 1)) / 2, 175, "+15", { c: "vak", vet: true, grootte: 18, leest: false });
          } },
        { t: "Komt er bij elke stap evenveel bij? Dan is het een lineair verband.", teken(b) { b.tekst(400, 240, "steeds +15, dus lineair ✓", { vet: true, grootte: 24, c: "vak" }); } },
        { t: "Het getal bij t = 0 is b. Wat er steeds bijkomt, is a. Dus `L = 15t + 120`.", teken(b) { L.schets.formule(b, 400, 320, [["L = ", "inkt"], ["15", "vak"], ["t + ", "inkt"], ["120", "rood"]], { grootte: 40 }); } },
        { t: "Hoeveel leden na 12 maanden? Vul t = 12 in: 15 · 12 + 120 = 300.", teken(b) { b.tekst(400, 400, "t = 12:  L = 15 · 12 + 120 = 300", { vet: true, grootte: 24 }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Teken de grafiek van `L = 15t + 120`, voor t van 0 tot 12. Kies zelf een handige schaal.",
          teken(b) { b.tekst(400, 130, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" }); b.tekst(400, 210, "L = 15t + 120", { vet: true, grootte: 34 }); b.tekst(400, 290, "t van 0 tot 12 · kies een handige schaal", { grootte: 20, c: "zacht" }); } }
      ] }
    ]
  });

  const FILM13 = filmZeg({
    mod: MOD, titel: "⚖️ Lineaire vergelijkingen", intro: "Een vergelijking is een weegschaal. Aan het eind los jij er een op.", teken: "Wiskunde H1 · vergelijking",
    scenes: [
      { kop: "Een weegschaal", zinnen: [
        { t: "Een vergelijking is net een weegschaal in evenwicht. Links en rechts wegen even veel.", teken(b) { weegschaal(b); } },
        { t: "Links liggen 5 zakjes met elk x kaarten, en 3 losse kaarten. Rechts liggen 2 zakjes en 15 losse kaarten.",
          teken(b) { LINKS.forEach(x => zakje(b, x, 328)); stapel(b, 182, 328, 3); RECHTS.forEach(x => zakje(b, x, 328)); stapel(b, 330, 328, 15); b.tekst(470, 80, "5x + 3 = 2x + 15", { anker: "start", vet: true, grootte: 30 }); } },
        { t: "Haal links en rechts 2 zakjes weg. Hij blijft in evenwicht: `3x + 3 = 15`.", teken(b) { kruis(b, LINKS[0], 328); kruis(b, LINKS[1], 328); kruis(b, RECHTS[0], 328); kruis(b, RECHTS[1], 328); b.tekst(470, 150, [["3x + 3 = 15", "vak"]], { anker: "start", vet: true, grootte: 30 }); b.tekst(470, 178, "links en rechts − 2x", { anker: "start", grootte: 16, c: "zacht", leest: false }); } },
        { t: "Haal links en rechts 3 losse kaarten weg: `3x = 12`.", teken(b) { kruis(b, 182, 328, 34); b.tekst(470, 230, [["3x = 12", "vak"]], { anker: "start", vet: true, grootte: 30 }); b.tekst(470, 258, "links en rechts − 3", { anker: "start", grootte: 16, c: "zacht", leest: false }); } },
        { t: "Drie zakjes zijn samen 12 kaarten. Eén zakje is dus 12 : 3. Dus `x = 4`.", teken(b) { b.tekst(470, 310, [["x = 4", "rood"]], { anker: "start", vet: true, grootte: 34 }); b.tekst(470, 338, "delen door 3", { anker: "start", grootte: 16, c: "zacht", leest: false }); } },
        { t: "De regel: wat je links doet, doe je ook rechts.", teken(b) { b.tekst(600, 410, "wat je links doet, doe je ook rechts", { vet: true, grootte: 20, c: "vak" }); } }
      ] },
      { kop: "Het werkschema", zinnen: [
        { t: "Met haakjes gebruik je een vast werkschema. Neem `4(x + 1) = 22 − 2(x − 3)`.", teken(b) { rij(b, 0, "", "4(x + 1) = 22 − 2(x − 3)", { fx: 260 }); } },
        { t: "Stap 1: werk de haakjes weg. Let op: −2 keer −3 is +6. Je krijgt `4x + 4 = 22 − 2x + 6`.", teken(b) { rij(b, 1, "1 haakjes wegwerken", [["4x + 4 = 22 − 2x "], ["+ 6", "rood"]], { fx: 260 }); } },
        { t: "Stap 2: herleid beide leden: `4x + 4 = 28 − 2x`.", teken(b) { rij(b, 2, "2 herleiden", "4x + 4 = 28 − 2x", { fx: 260 }); } },
        { t: "Stap 3: zorg dat links alleen een term met x staat, en rechts alleen een getal. Tel links en rechts 2x op en haal er 4 af: `6x = 24`.", teken(b) { rij(b, 3, "3 x links, getal rechts", "6x = 24", { fx: 260 }); } },
        { t: "Stap 4: deel beide leden door het getal voor x: `x = 4`.", teken(b) { rij(b, 4, "4 delen door 6", [["x = 4", "vak"]], { fx: 260 }); } },
        { t: "Controleer: vul x = 4 in. Links: 4 · 5 = 20. Rechts: 22 − 2 · 1 = 20. Het klopt!", teken(b) { b.tekst(260, 425, "check: links 20, rechts 20 ✓", { anker: "start", vet: true, grootte: 22, c: "vak" }); } }
      ] },
      { kop: "Breuken wegwerken", plus: true, zinnen: [
        { t: "Staan er breuken in? Werk ze eerst weg. Neem `½x + 2 = ⅓x + 3`.", teken(b) { b.tekst(400, 110, "½x + 2 = ⅓x + 3", { vet: true, grootte: 40 }); } },
        { t: "Vermenigvuldig alle termen met 6. Dat is het kleinste getal dat door 2 én door 3 te delen is.", teken(b) { b.tekst(400, 190, "alle termen · 6", { vet: true, grootte: 28, c: "rood" }); b.tekst(400, 225, "6 past in 2 én in 3", { grootte: 18, c: "zacht", leest: false }); } },
        { t: "Dan krijg je `3x + 12 = 2x + 18`. Nu gaat het verder zoals altijd: `x = 6`.", teken(b) { b.tekst(400, 300, "3x + 12 = 2x + 18", { vet: true, grootte: 36 }); b.tekst(400, 380, [["x = 6", "vak"]], { vet: true, grootte: 36 }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Los op: `3(x − 4) = 2(x + 1)`. Gebruik het werkschema. Schrijf elke stap op een nieuwe regel.",
          teken(b) { b.tekst(400, 130, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" }); b.tekst(400, 220, "3(x − 4) = 2(x + 1)", { vet: true, grootte: 36 }); b.tekst(400, 300, "haakjes · herleiden · x links · delen", { grootte: 20, c: "zacht" }); } }
      ] }
    ]
  });

  const FILM14 = filmZeg({
    mod: MOD, titel: "✖️ Snijpunten van grafieken", intro: "Waar raakt een lijn de assen, en waar kruisen twee lijnen elkaar?", teken: "Wiskunde H1 · snijpunten",
    scenes: [
      { kop: "Snijpunten met de assen", zinnen: [
        { t: "Neem de lijn `y = 3x − 6`. Waar snijdt hij de x-as en de y-as?",
          teken(b, S) { S.P = assen(b, { x: 60, y: 30, w: 360, h: 400, xmin: -1, xmax: 4, ymin: -7, ymax: 6 }); lijnDoor(b, S.P, 3, -6); b.tekst(470, 70, [["y = 3x − 6", "vak"]], { anker: "start", vet: true, grootte: 30 }); } },
        { t: "Op de x-as is y altijd 0. Dus los op: `3x − 6 = 0`. Dat geeft `x = 2`. Het snijpunt met de x-as is `(2, 0)`.",
          teken(b, S) { const A = S.P(2, 0); b.cirkel(A[0], A[1], 14, { c: "rood", w: 2.6 }); b.tekst(470, 150, "x-as: y = 0", { anker: "start", vet: true, grootte: 22, c: "rood" }); b.tekst(470, 185, "3x − 6 = 0, x = 2", { anker: "start", grootte: 22 }); b.tekst(470, 220, "(2, 0)", { anker: "start", vet: true, grootte: 24 }); } },
        { t: "Op de y-as is x altijd 0. Vul x = 0 in: `y = 3 · 0 − 6 = −6`. Het snijpunt met de y-as is `(0, −6)`.",
          teken(b, S) { const A = S.P(0, -6); b.cirkel(A[0], A[1], 14, { c: "rood", w: 2.6 }); b.tekst(470, 290, "y-as: x = 0", { anker: "start", vet: true, grootte: 22, c: "rood" }); b.tekst(470, 325, "y = 3 · 0 − 6 = −6", { anker: "start", grootte: 22 }); b.tekst(470, 360, "(0, −6)", { anker: "start", vet: true, grootte: 24 }); } }
      ] },
      { kop: "Twee lijnen", zinnen: [
        { t: "Twee lijnen: `k: y = 2x + 1` en `l: y = −x + 7`. Ze snijden elkaar in het punt S.",
          teken(b, S) { S.P = assen(b, { x: 60, y: 30, w: 360, h: 400, xmin: -1, xmax: 5, ymin: -1, ymax: 8 }); lijnDoor(b, S.P, 2, 1); lijnDoor(b, S.P, -1, 7, { c: "rood" }); b.tekst(470, 60, [["k: y = 2x + 1", "vak"]], { anker: "start", vet: true, grootte: 24 }); b.tekst(470, 95, [["l: y = −x + 7", "rood"]], { anker: "start", vet: true, grootte: 24 }); b.stip(...S.P(2, 5), { c: "inkt", r: 7 }); } },
        { t: "In S hebben beide lijnen dezelfde y. Dus stel de formules gelijk: `2x + 1 = −x + 7`.", teken(b) { b.tekst(470, 170, "2x + 1 = −x + 7", { anker: "start", vet: true, grootte: 26 }); } },
        { t: "Los op: `3x = 6`, dus `x = 2`.", teken(b, S) { b.lijn([S.P(2, 0), S.P(2, 5)], { c: "zacht", w: 1.8 }); b.tekst(470, 225, "3x = 6, x = 2", { anker: "start", vet: true, grootte: 26 }); } },
        { t: "De y vind je door x = 2 in een van de formules in te vullen: `y = 2 · 2 + 1 = 5`.", teken(b, S) { b.lijn([S.P(0, 5), S.P(2, 5)], { c: "zacht", w: 1.8 }); b.tekst(470, 280, "y = 2 · 2 + 1 = 5", { anker: "start", vet: true, grootte: 26 }); } },
        { t: "Dus `S(2, 5)`. Eerst x, dan y.", teken(b, S) { const A = S.P(2, 5); b.tekst(A[0] + 14, A[1] - 12, "S(2, 5)", { anker: "start", vet: true, grootte: 22 }); b.tekst(470, 350, [["S(2, 5)", "vak"]], { anker: "start", vet: true, grootte: 34 }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Bereken waar de lijn `y = −2x + 10` de x-as en de y-as snijdt.",
          teken(b) { b.tekst(400, 130, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" }); b.tekst(400, 220, "y = −2x + 10", { vet: true, grootte: 36 }); b.tekst(400, 300, "x-as: y = 0 · y-as: x = 0", { grootte: 22, c: "zacht" }); } }
      ] }
    ]
  });

  const FILM15 = filmZeg({
    mod: MOD, titel: "↔️ Lineaire ongelijkheden", intro: "Geen één antwoord, maar een heel gebied. Let op het teken!", teken: "Wiskunde H1 · ongelijkheid",
    scenes: [
      { kop: "Met grafieken", zinnen: [
        { t: "Een **lineaire ongelijkheid** lijkt op een vergelijking, maar dan met < of >. Neem `−x + 5 < x + 1`.", teken(b) { b.tekst(470, 70, "−x + 5 < x + 1", { anker: "start", vet: true, grootte: 32 }); } },
        { t: "Teken de lijnen `y = −x + 5` en `y = x + 1`. Ze snijden elkaar bij x = 2.",
          teken(b, S) { S.P = assen(b, { x: 60, y: 40, w: 360, h: 380, xmin: -1, xmax: 6, ymin: -1, ymax: 7 }); lijnDoor(b, S.P, -1, 5, { c: "rood" }); lijnDoor(b, S.P, 1, 1); b.tekst(470, 130, [["rood: y = −x + 5", "rood"]], { anker: "start", vet: true, grootte: 22 }); b.tekst(470, 165, [["paars: y = x + 1", "vak"]], { anker: "start", vet: true, grootte: 22 }); b.stip(...S.P(2, 3), { c: "inkt", r: 7 }); b.lijn([S.P(2, 0), S.P(2, 3)], { c: "zacht", w: 1.8 }); } },
        { t: "Waar ligt de lijn van `y = −x + 5` onder die van `y = x + 1`? Rechts van het snijpunt.",
          teken(b, S) { const A = S.P(2, 0), B = S.P(6, 0); b.cirkel(A[0], A[1], 7, { c: "rood", w: 2.6 }); b.pijl([A[0] + 8, A[1]], [B[0], B[1]], { c: "rood", w: 5 }); } },
        { t: "De oplossing is dus `x > 2`.", teken(b) { b.tekst(470, 260, [["x > 2", "rood"]], { anker: "start", vet: true, grootte: 44 }); } }
      ] },
      { kop: "Zonder grafiek", plus: true, zinnen: [
        { t: "Het kan ook zonder grafiek. Je rekent net als bij een vergelijking: `−x + 5 < x + 1`.", teken(b) { rij(b, 0, "", "−x + 5 < x + 1", { fx: 120 }); } },
        { t: "Haal links en rechts x weg, en ook 5: `−2x < −4`.", teken(b) { rij(b, 1, "", "−2x < −4", { fx: 120 }); } },
        { t: "Nu deel je door −2. Dat is een negatief getal. Dan **klapt het ongelijkheidsteken om**: < wordt >.",
          teken(b) { b.tekst(560, 150, "<", { vet: true, grootte: 80, c: "zacht", leest: false }); b.pijl([600, 100], [660, 100], { c: "rood", w: 3 }); b.tekst(700, 150, ">", { vet: true, grootte: 80, c: "rood", leest: false }); b.tekst(630, 205, "delen door −2: teken om!", { vet: true, grootte: 20, c: "rood" }); } },
        { t: "Dus `x > 2`. Hetzelfde antwoord als met de grafiek.", teken(b) { rij(b, 2, "", [["x > 2", "rood"]], { fx: 120, g: 36 }); } },
        { t: "Deel je door een positief getal, dan blijft het teken gewoon staan.", teken(b) { b.tekst(400, 380, "delen door een positief getal: teken blijft", { vet: true, grootte: 22, c: "vak" }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Los op: `−3x + 2 > 11`. Klapt het teken om?",
          teken(b) { b.tekst(400, 130, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" }); b.tekst(400, 220, "−3x + 2 > 11", { vet: true, grootte: 36 }); b.tekst(400, 300, "klapt het teken om?", { grootte: 22, c: "zacht" }); } }
      ] }
    ]
  });

  function poster(b, x, y) { b.rh(x, y, 56, 76, { w: 2.4 }); b.lijn([[x + 8, y + 60], [x + 22, y + 40], [x + 32, y + 52], [x + 48, y + 30]], { c: "vak", w: 2 }); b.cirkel(x + 16, y + 18, 6, { w: 1.6 }); }
  const FILM16 = filmZeg({
    mod: MOD, titel: "🛍️ Vergelijkingen met twee variabelen", intro: "Twee onbekenden, veel oplossingen, en toch weer een lijn.", teken: "Wiskunde H1 · twee variabelen",
    scenes: [
      { kop: "Merch kopen", zinnen: [
        { t: "Je koopt photocards van 2 euro en posters van 4 euro. Je geeft precies 20 euro uit.",
          teken(b) { kaartje(b, 50, 60, -6); kaartje(b, 95, 56, 6); b.tekst(100, 160, "€ 2 per stuk", { grootte: 18, leest: false }); poster(b, 230, 50); b.tekst(258, 160, "€ 4 per stuk", { grootte: 18, leest: false }); b.tekst(470, 110, "samen € 20", { vet: true, grootte: 30, c: "vak" }); } },
        { t: "Noem het aantal photocards x en het aantal posters y. Dan geldt: `2x + 4y = 20`.", teken(b) { L.schets.formule(b, 400, 250, [["2", "inkt"], ["x", "vak"], [" + 4", "inkt"], ["y", "rood"], [" = 20", "inkt"]], { grootte: 44 }); } },
        { t: "Dit is een **vergelijking met twee variabelen**. Er zijn meerdere oplossingen.", teken(b) { b.tekst(400, 310, "vergelijking met twee variabelen", { vet: true, grootte: 22 }); } },
        { t: "Bijvoorbeeld 4 photocards en 3 posters: 2 · 4 + 4 · 3 = 20. Het **getallenpaar** `(4, 3)` is een oplossing.", teken(b) { b.tekst(400, 380, "2 · 4 + 4 · 3 = 20, dus (4, 3) ✓", { vet: true, grootte: 24, c: "vak" }); } }
      ] },
      { kop: "De grafiek is een lijn", zinnen: [
        { t: "Om de lijn te tekenen, maak je een tabel met twee handige punten.",
          teken(b, S) { b.tekst(150, 50, "2x + 4y = 20", { vet: true, grootte: 24 }); S.t = tabel(b, 40, 80, [["x", 0, ""], ["y", "", 0]], { kolom: 70, rij: 44 }); } },
        { t: "Neem x = 0. Dan staat er `4y = 20`, dus `y = 5`.", teken(b, S) { b.tekst(S.t.kol(1), 80 + 44 + 30, "5", { vet: true, grootte: 22, c: "vak", leest: false }); b.tekst(150, 250, "x = 0: 4y = 20, y = 5", { grootte: 18 }); } },
        { t: "Neem y = 0. Dan staat er `2x = 20`, dus `x = 10`.", teken(b, S) { b.tekst(S.t.kol(2), 80 + 30, "10", { vet: true, grootte: 22, c: "vak", leest: false }); b.tekst(150, 285, "y = 0: 2x = 20, x = 10", { grootte: 18 }); } },
        { t: "Zet de punten `(0, 5)` en `(10, 0)` in een assenstelsel en trek de lijn.",
          teken(b, S) { const P = assen(b, { x: 330, y: 50, w: 420, h: 340, xmin: 0, xmax: 11, ymin: 0, ymax: 6, fs: 13 }); b.stip(...P(0, 5)); b.stip(...P(10, 0)); lijnDoor(b, P, -.5, 5, { van: 0, tot: 10 }); } }
      ] },
      { kop: "Herleiden tot y = ax + b", zinnen: [
        { t: "Wil je de richtingscoëfficiënt weten? Herleid de vergelijking dan tot de vorm `y = ax + b`.", teken(b) { rij(b, 0, "", "2x + 4y = 20", { fx: 200 }); } },
        { t: "Haal links en rechts 2x weg: `4y = −2x + 20`.", teken(b) { rij(b, 1, "− 2x", "4y = −2x + 20", { fx: 200, lx: 60 }); } },
        { t: "Deel alles door 4: `y = −½x + 5`.", teken(b) { rij(b, 2, ": 4", [["y = "], ["−½", "rood"], ["x + 5"]], { fx: 200, lx: 60 }); } },
        { t: "De rc is −½. Koop je 2 photocards meer, dan past er 1 poster minder in je budget.", teken(b) { b.tekst(200, 330, [["rc = −½", "rood"]], { anker: "start", vet: true, grootte: 30 }); b.tekst(200, 380, "2 photocards meer = 1 poster minder", { anker: "start", grootte: 20 }); } }
      ] },
      { kop: "Jouw beurt", zinnen: [
        { t: "**Jouw beurt.** Teken de lijn `3x + 2y = 12`. Maak eerst een tabel met x = 0 en y = 0.",
          teken(b) { b.tekst(400, 130, "Jouw beurt ✏️", { vet: true, grootte: 40, c: "vak" }); b.tekst(400, 220, "3x + 2y = 12", { vet: true, grootte: 36 }); tabel(b, 310, 260, [["x", 0, "?"], ["y", "?", 0]], { kolom: 60, rij: 44 }); } }
      ] }
    ]
  });

  /* ================= SORTEREN ================= */
  const SORT11 = {
    titel: "🔀 Welk verband?", uitleg: "Lees de formule of de lijn. In welke bak hoort hij?",
    bakken: [
      { id: "c", icoon: "➖", naam: "constant verband", sub: "y = b, horizontaal" },
      { id: "r", icoon: "↗️", naam: "recht evenredig verband", sub: "y = ax, door de oorsprong" },
      { id: "l", icoon: "📈", naam: "ander lineair verband", sub: "y = ax + b, b is niet 0" }
    ],
    kaarten: [
      { t: "y = 7", bak: "c", uitleg: "Er staat geen x: a = 0. Een horizontale lijn." },
      { t: "y = −4x", bak: "r", uitleg: "b = 0, dus de lijn gaat door de oorsprong." },
      { t: "y = 2x + 1", bak: "l", uitleg: "b = 1, dus de lijn gaat niet door (0, 0)." },
      { t: "Een horizontale lijn door (0, −3)", bak: "c", uitleg: "Horizontaal betekent: a = 0. Dus y = −3." },
      { t: "Een lijn door (0, 0) en (2, 6)", bak: "r", uitleg: "Door de oorsprong: y = 3x." },
      { t: "y = ½x", bak: "r", uitleg: "b = 0. Een breuk als rc mag gewoon." },
      { t: "y = x − 5", bak: "l", uitleg: "b = −5, dus niet door de oorsprong." },
      { t: "Een lijn door (0, 2) met rc 3", bak: "l", uitleg: "b = 2: y = 3x + 2." },
      { t: "K = 300", bak: "c", uitleg: "K verandert nooit: altijd 300." },
      { t: "P = 12t", bak: "r", uitleg: "Andere letters, zelfde idee: b = 0." },
      { t: "y = −x + 4", bak: "l", uitleg: "b = 4, en de lijn daalt." }
    ].map(k => metZeg(k, "t", "uitleg"))
  };
  const SORT15 = {
    titel: "🔄 Klapt het teken om?", plus: true, uitleg: "Je lost een ongelijkheid op. Wat gebeurt er met < of > bij deze stap?",
    bakken: [{ id: "om", icoon: "🔄", naam: "Klapt om", sub: "< wordt >" }, { id: "blijft", icoon: "➡️", naam: "Blijft staan", sub: "niets veranderen" }],
    kaarten: [
      { t: "Beide kanten delen door −2", bak: "om", uitleg: "Delen door een negatief getal." },
      { t: "Beide kanten delen door 3", bak: "blijft", uitleg: "3 is positief." },
      { t: "Beide kanten keer −1", bak: "om", uitleg: "Vermenigvuldigen met een negatief getal." },
      { t: "Links en rechts 5 optellen", bak: "blijft", uitleg: "Optellen en aftrekken veranderen het teken nooit." },
      { t: "Links en rechts 4x aftrekken", bak: "blijft", uitleg: "Ook met x erbij: aftrekken verandert het teken niet." },
      { t: "Links en rechts −7 optellen", bak: "blijft", uitleg: "Optellen blijft optellen, ook van een negatief getal." },
      { t: "Alle termen keer 12, om breuken weg te werken", bak: "blijft", uitleg: "12 is positief." },
      { t: "Beide kanten delen door −5", bak: "om", uitleg: "Delen door een negatief getal." },
      { t: "Van −3x < 6 naar x … −2", bak: "om", uitleg: "Je deelt door −3. Dus x > −2." },
      { t: "Van 4x > −8 naar x … −2", bak: "blijft", uitleg: "Je deelt door 4. Dat het getal −8 negatief is, maakt niet uit! Dus x > −2." }
    ].map(k => metZeg(k, "t", "uitleg"))
  };

  /* ================= STAP VOOR STAP (voorbeeld → samen → zelf, met steeds nieuwe sommen) ================= */
  // §1.1
  function g11formule(p = {}) {
    let dx = p.dx, dy = p.dy, b = p.b;
    if (dx == null) { do { dx = kies([1, 1, 2, 3]); dy = nz(-4, 4); } while (ggd(dx, Math.abs(dy)) !== 1); b = rnd(-3, 4); }
    const a = breuk(dy, dx), ys = [b, b + dy, b + 2 * dy, b - dy];
    const ymin = Math.max(-8, Math.min(-1, ...ys) - 1), ymax = Math.min(8, Math.max(1, ...ys) + 1);
    return klaarZet({
      vraag: "Stel de formule op van de lijn in de figuur.",
      beeld: B => { const P = assen(B, { x: 200, y: 44, w: 400, h: 390, xmin: -1, xmax: Math.max(4, Math.min(6, 2 * dx + 1)), ymin, ymax, fs: 13 }); lijnDoor(B, P, dy / dx, b); },
      stappen: [
        { wat: "Lees b af: waar snijdt de lijn de y-as?", regel: `b = [${b}]`, hint: "Kijk op de verticale as, bij x = 0." },
        { wat: "Zoek een roosterpunt: tel opzij en omhoog", regel: `[${dx}] opzij en [${dy}] omhoog`, hint: "Ga naar rechts tot de lijn precies door een hoek van een hokje gaat. Omlaag tel je als negatief." },
        { wat: "Reken a uit: omhoog gedeeld door opzij", regel: `a = ${min(dy)} : ${dx} = [${a}]`, hint: "Een breuk mag: typ 1/2 of 0,5." },
        { wat: "Schrijf de formule op", regel: `y = [${a}]x [+${b}]`, hint: "Eerst a, dan b. Is b negatief? Typ dan een min." }
      ],
      slot: `De formule is \`y = ${fx(a, b)}\`.`
    });
  }
  function g11punt(p = {}) {
    const a = p.a ?? kies([-1, 1]) * rnd(2, 9), b = p.b ?? nz(-15, 15), k = p.k ?? kies([-1, 1]) * rnd(2, 12), y = a * k + b;
    const type = p.type || kies(["A", "B"]);
    if (type === "A") return klaarZet({
      vraag: `Gegeven is de lijn l: \`y = ${fx(a, b)}\`. Op l ligt het punt A met x-coördinaat ${min(k)}. Bereken de y-coördinaat van A.`,
      stappen: [
        { wat: "Vul de x-coördinaat in de formule in", regel: `y = ${min(a)} · [${k}] ${sg(b)}` },
        { wat: "Reken uit", regel: `y = [${y}]`, hint: `Eerst keer: ${min(a)} · ${min(k)} = ${min(a * k)}. Dan ${sg(b)}.` },
        { wat: "Schrijf het punt op", regel: `A([${k}], [${y}])`, hint: "Eerst x, dan y." }
      ], slot: `Dus A(${min(k)}, ${min(y)}).`
    });
    const yb = p.yb ?? (Math.random() < .5 ? y : y + nz(-5, 5)), op = yb === y;
    return klaarZet({
      vraag: `Onderzoek of het punt B(${min(k)}, ${min(yb)}) op de lijn l: \`y = ${fx(a, b)}\` ligt.`,
      stappen: [
        { wat: "Vul de x-coördinaat in de formule in", regel: `y = ${min(a)} · [${k}] ${sg(b)}` },
        { wat: "Reken uit", regel: `y = [${y}]`, hint: `Eerst keer: ${min(a)} · ${min(k)} = ${min(a * k)}. Dan ${sg(b)}.` },
        { wat: "Vergelijk met de y-coördinaat van B", regel: `${min(y)} en ${min(yb)}: B ligt [${op ? "*op l|niet op l" : "op l|*niet op l"}]` }
      ], slot: op ? "De uitkomst is gelijk aan de y van B, dus B ligt op l." : "De uitkomst is anders dan de y van B, dus B ligt niet op l."
    });
  }
  function g11evenwijdig(p = {}) {
    const a = p.a ?? kies([-1, 1]) * rnd(2, 6), px = p.px ?? nz(-5, 5), b = p.b ?? nz(-10, 10);
    let c = p.c; if (c == null) do c = nz(-9, 9); while (c === b);
    const q = a * px + b;
    return klaarZet({
      vraag: `Lijn k gaat door R(${min(px)}, ${min(q)}) en is evenwijdig met l: \`y = ${fx(a, c)}\`. Stel de formule van k op.`,
      stappen: [
        { wat: "Evenwijdig: neem dezelfde rc", regel: `a = [${a}]`, hint: "Evenwijdige lijnen hebben dezelfde richtingscoëfficiënt." },
        { wat: "Vul de coördinaten van R in", regel: `[${q}] = ${min(a)} · [${px}] + b`, hint: "y van R links, x van R op de plek van x." },
        { wat: "Reken b uit", regel: `b = [${b}]`, hint: `${min(a)} · ${min(px)} = ${min(a * px)}. Wat moet je daarbij doen om ${min(q)} te krijgen?` },
        { wat: "Schrijf de formule op", regel: `k: y = [${a}]x [+${b}]` }
      ], slot: `Dus k: \`y = ${fx(a, b)}\`.`
    });
  }
  // §1.2
  const CONTEXT = [
    { tekst: "Een fanclub houdt bij hoeveel leden er zijn.", V: "L", t: "t in maanden", vraagT: T => `na ${T} maanden`, start: () => 10 * rnd(8, 40), stap: () => 5 * rnd(1, 8) },
    { tekst: "Je spaart voor een concertkaartje.", V: "S", t: "t in weken, S in euro", vraagT: T => `na ${T} weken`, start: () => 5 * rnd(2, 12), stap: () => rnd(4, 15) },
    { tekst: "Een webwinkel verkoopt hoodies van een tour.", V: "H", t: "t in dagen, H = hoodies op voorraad", vraagT: T => `na ${T} dagen`, start: () => 100 * rnd(6, 12), stap: () => -10 * rnd(2, 6) },
    { tekst: "Een stad plant elk jaar bomen bij. t = 0 hoort bij 2024.", V: "N", t: "t in jaren, N = aantal bomen", jaar: 2024, start: () => 100 * rnd(30, 60), stap: () => 25 * rnd(1, 6) }
  ];
  function g12tabel(p = {}) {
    const C = CONTEXT[p.ctx ?? rnd(0, CONTEXT.length - 1)], start = p.start ?? C.start(), stap = p.stap ?? C.stap();
    let T = p.T ?? rnd(8, 16); if (stap < 0) T = Math.min(T, Math.floor(start / -stap));
    const val = stap * T + start, rijen = [["t", 0, 1, 2, 3, 4], [C.V, ...[0, 1, 2, 3, 4].map(t => start + stap * t)]];
    const st = [
      { wat: "Kijk wat er bij elke stap bijkomt", regel: `Steeds [${stap}] erbij`, hint: "Trek twee getallen naast elkaar van elkaar af. Gaat het omlaag? Dan is het negatief." },
      { wat: "Lees b af bij t = 0", regel: `b = [${start}]` },
      { wat: "Schrijf de formule op", regel: `${C.V} = [${stap}]t [+${start}]` }
    ];
    if (C.jaar) st.push({ wat: "Reken t uit voor dat jaar", regel: `t = ${C.jaar + T} − ${C.jaar} = [${T}]` });
    st.push({ wat: "Vul t in en reken uit", regel: `${C.V} = ${min(stap)} · ${T} + ${start} = [${val}]` });
    return klaarZet({
      vraag: `${C.tekst} In de tabel: ${C.t}. Stel de formule van ${C.V} op en bereken ${C.V} ${C.jaar ? "in " + (C.jaar + T) : C.vraagT(T)}.`,
      beeld: B => tabel(B, 40, 20, rijen, { kolom: 120, rij: 52, grootte: 26 }), beeldMaat: { h: 130 },
      stappen: st, slot: `\`${C.V} = ${fx(stap, start, "t")}\` en ${C.V} = ${val}.`
    });
  }
  const PAREN12 = [[400, 40, 0], [300, 30, 0], [600, 40, 0], [500, 50, 0], [200, 40, 0], [100, 30, 400], [200, 40, 600], [300, 50, 800], [100, 20, 500]];
  function g12grafiek(p = {}) {
    const [b, T, yT] = p.b != null ? [p.b, p.T, p.yT] : kies(PAREN12), a = (yT - b) / T, ymax = Math.max(b, yT) + 100;
    return klaarZet({
      vraag: "Stel de formule van N op. Let op de schaal van de assen.",
      beeld: B => { const P = assen(B, { x: 160, y: 44, w: 480, h: 370, xmin: 0, xmax: 60, ymin: 0, ymax, vrij: true, sx: 10, sy: 100, xnaam: "t", ynaam: "N", fs: 14 }); lijnDoor(B, P, a, b, { van: 0, tot: 60 }); },
      stappen: [
        { wat: "Lees b af: waar begint de lijn?", regel: `b = [${b}]` },
        { wat: "Lees een tweede punt af, precies op een hoek", regel: `t = [${T}] en N = [${yT}]`, hint: "Zoek een plek waar de lijn precies door een hoek van het rooster gaat." },
        { wat: "Reken a uit: verschil N gedeeld door verschil t", regel: `a = ${min(yT - b)} : ${T} = [${a}]`, hint: "Gaat de lijn omlaag? Dan is het verschil negatief." },
        { wat: "Schrijf de formule op", regel: `N = [${a}]t [+${b}]` }
      ], slot: `Dus \`N = ${fx(a, b, "t")}\`.`
    });
  }
  // §1.3
  const WERKSCHEMA = { titel: "Werkschema: lineaire vergelijkingen oplossen", stappen: ["Haakjes wegwerken", "Beide leden herleiden", "x-termen naar links, getallen naar rechts", "Delen door het getal voor x"] };
  function g13zonder(p = {}) {
    let a = p.a, c = p.c; if (a == null) do { a = nz(-9, 9); c = nz(-9, 9); } while (Math.abs(a - c) < 2);
    const x = p.x ?? nz(-9, 9), b = p.b ?? nz(-15, 15), d = (a - c) * x + b;
    return klaarZet({
      vraag: `Los op: \`${fx(a, b)} = ${fx(c, d)}\``,
      stappen: [
        { wat: WERKSCHEMA.stappen[2], regel: `[${a - c}]x = [${d - b}]`, hint: `Links en rechts ${c < 0 ? "+ " + (-c) + "x" : "− " + c + "x"}, en links en rechts ${b < 0 ? "+ " + (-b) : "− " + b}.` },
        { wat: WERKSCHEMA.stappen[3], regel: `x = [${x}]`, hint: `Deel ${min(d - b)} door ${min(a - c)}. Min gedeeld door min is plus.` }
      ], slot: `Dus \`x = ${min(x)}\`. Check: vul het in, links en rechts komt ${min(a * x + b)}.`
    });
  }
  function g13haakjes(p = {}) {
    let { pp, q, s, u, x } = p, r;
    if (pp == null) do { pp = rnd(2, 6); q = nz(-6, 6); s = kies([-1, 1]) * rnd(2, 5); u = nz(-6, 6); x = nz(-8, 8); r = pp * (x + q) - s * (x + u); } while (Math.abs(pp - s) < 2 || !r || Math.abs(r) > 40 || !(r + s * u));
    else r = pp * (x + q) - s * (x + u);
    const rechts = `${min(r)} ${s < 0 ? "−" : "+"} ${haakje(Math.abs(s), u)}`;
    return klaarZet({
      vraag: `Los op: \`${haakje(pp, q)} = ${rechts}\``,
      stappen: [
        { wat: WERKSCHEMA.stappen[0], regel: `[${pp}]x [+${pp * q}] = ${min(r)} [+${s}]x [+${s * u}]`, hint: "Vermenigvuldig het getal vóór de haakjes met élke term erbinnen. Let op min keer min." },
        { wat: WERKSCHEMA.stappen[1], regel: `${pp}x ${sg(pp * q)} = [${r + s * u}] [+${s}]x`, hint: "Tel rechts de losse getallen bij elkaar." },
        { wat: WERKSCHEMA.stappen[2], regel: `[${pp - s}]x = [${r + s * u - pp * q}]` },
        { wat: WERKSCHEMA.stappen[3], regel: `x = [${x}]` }
      ], slot: `Dus \`x = ${min(x)}\`.`
    });
  }
  const SCHEMA_BREUK = { titel: "Breuken in een vergelijking", stappen: ["Breuken wegwerken: alle termen keer hetzelfde getal", "x-termen naar links, getallen naar rechts", "Delen door het getal voor x"] };
  function g13breuken(p = {}) {
    const kgv = (a, b) => a * b / ggd(a, b);
    let { m, n, a1, a2, k, b } = p, Lk, x, d;
    for (;;) {
      if (p.m == null) { m = kies([2, 3, 4, 5, 6]); n = kies([2, 3, 4, 5, 6]); a1 = rnd(1, m - 1); a2 = rnd(1, n - 1); k = kies([-2, -1, 1, 2]); b = rnd(1, 6); }
      Lk = kgv(m, n); x = Lk * k; d = (a1 * n - a2 * m) * x / (m * n) + b;
      if (p.m != null || (m !== n && a1 * n !== a2 * m && Lk <= 20 && Number.isInteger(d) && d && ggd(a1, m) === 1 && ggd(a2, n) === 1)) break;
    }
    const A = a1 * Lk / m - a2 * Lk / n, D = d * Lk - b * Lk;
    return klaarZet({
      vraag: `Los op: \`{${a1}/${m}}x ${sg(b)} = {${a2}/${n}}x ${sg(d)}\``,
      stappen: [
        { wat: SCHEMA_BREUK.stappen[0], regel: `Keer [${Lk}]: [${a1 * Lk / m}]x [+${b * Lk}] = [${a2 * Lk / n}]x [+${d * Lk}]`, hint: `Neem het kleinste getal dat door ${m} én door ${n} te delen is. Vergeet de losse getallen niet!` },
        { wat: SCHEMA_BREUK.stappen[1], regel: `[${A}]x = [${D}]` },
        { wat: SCHEMA_BREUK.stappen[2], regel: `x = [${x}]` }
      ], slot: `Dus \`x = ${min(x)}\`.`
    });
  }
  // §1.4
  function g14assen(p = {}) {
    const a = p.a ?? nz(-5, 5), x0 = p.x0 ?? nz(-6, 6), b = p.b ?? -a * x0;
    return klaarZet({
      vraag: `De lijn k: \`y = ${fx(a, b)}\` snijdt de x-as in A en de y-as in B. Bereken de coördinaten van A en B.`,
      stappen: [
        { wat: "Snijpunt met de x-as: neem y = 0 en los op", regel: `${fx(a, b)} = 0, dus x = [${x0}]`, hint: `${min(a)}x = ${min(-b)}. Deel door ${min(a)}.` },
        { wat: "Schrijf het punt op", regel: `A([${x0}], [0])` },
        { wat: "Snijpunt met de y-as: vul x = 0 in", regel: `y = ${min(a)} · 0 ${sg(b)} = [${b}]` },
        { wat: "Schrijf het punt op", regel: `B([0], [${b}])` }
      ], slot: `Dus A(${min(x0)}, 0) en B(0, ${min(b)}).`
    });
  }
  function g14twee(p = {}) {
    let { a1, a2 } = p; if (a1 == null) do { a1 = nz(-5, 5); a2 = nz(-5, 5); } while (Math.abs(a1 - a2) < 2);
    const x = p.x ?? nz(-6, 6), b1 = p.b1 ?? nz(-12, 12), b2 = (a1 - a2) * x + b1, y = a1 * x + b1;
    return klaarZet({
      vraag: `De lijnen k: \`y = ${fx(a1, b1)}\` en l: \`y = ${fx(a2, b2)}\` snijden elkaar in S. Bereken de coördinaten van S.`,
      stappen: [
        { wat: "Stel de formules gelijk", regel: `[${a1}]x [+${b1}] = [${a2}]x [+${b2}]` },
        { wat: "x-termen naar links, getallen naar rechts", regel: `[${a1 - a2}]x = [${b2 - b1}]` },
        { wat: "Delen door het getal voor x", regel: `x = [${x}]` },
        { wat: "Vul x in een van de formules in", regel: `y = ${min(a1)} · ${min(x)} ${sg(b1)} = [${y}]`, hint: "Neem de makkelijkste formule. Beide geven hetzelfde." },
        { wat: "Schrijf het snijpunt op", regel: `S([${x}], [${y}])` }
      ], slot: `Dus S(${min(x)}, ${min(y)}).`
    });
  }
  // §1.5
  const SCHEMA_ONG = { titel: "Ongelijkheid oplossen", stappen: ["x-termen naar links, getallen naar rechts", "Delen door een positief getal: het teken blijft", "Delen door een negatief getal: het teken klapt om"] };
  const om = t => t === "<" ? ">" : "<";
  function g15alg(p = {}) {
    let a = p.a, c = p.c; if (a == null) do { a = nz(-7, 7); c = nz(-7, 7); } while (Math.abs(a - c) < 2);
    const k = p.k ?? nz(-6, 6), b = p.b ?? nz(-12, 12), d = (a - c) * k + b, t = p.t || kies(["<", ">"]), A = a - c, t2 = A < 0 ? om(t) : t;
    return klaarZet({
      vraag: `Los op: \`${fx(a, b)} ${t} ${fx(c, d)}\``,
      stappen: [
        { wat: SCHEMA_ONG.stappen[0], regel: `[${A}]x [${t}] [${d - b}]`, hint: "Net als bij een vergelijking. Het teken blijft hier nog staan." },
        { wat: A < 0 ? SCHEMA_ONG.stappen[2] : SCHEMA_ONG.stappen[1], regel: `x [${t2}] [${k}]`, hint: A < 0 ? `Je deelt door ${min(A)}: een negatief getal!` : `Je deelt door ${A}: een positief getal.` }
      ], slot: `Dus \`x ${t2} ${min(k)}\`.`
    });
  }
  function g15grafiek(p = {}) {
    let { a1, a2 } = p; if (a1 == null) do { a1 = nz(-3, 3); a2 = nz(-3, 3); } while (a1 === a2);
    const x0 = p.x0 ?? rnd(1, 4), y0 = p.y0 ?? rnd(0, 4), b1 = y0 - a1 * x0, b2 = y0 - a2 * x0, t = p.t || kies(["<", ">"]);
    const ant = (a1 - a2 > 0) === (t === "<") ? "<" : ">";   // f1 < f2 ⇔ (a1 − a2)x < b2 − b1
    return klaarZet({
      vraag: `Los op: \`${fx(a1, b1)} ${t} ${fx(a2, b2)}\`. Gebruik de figuur.`,
      beeld: B => { const P = assen(B, { x: 150, y: 44, w: 420, h: 390, xmin: -1, xmax: 6, ymin: -3, ymax: 8, fs: 13 }); lijnDoor(B, P, a1, b1); lijnDoor(B, P, a2, b2, { c: "rood" }); B.tekst(600, 80, `y = ${fx(a1, b1).replace(/[{}]/g, "")}`, { anker: "start", vet: true, c: "vak", grootte: 22, leest: false }); B.tekst(600, 120, `y = ${fx(a2, b2).replace(/[{}]/g, "")}`, { anker: "start", vet: true, c: "rood", grootte: 22, leest: false }); },
      stappen: [
        { wat: "Lees af bij welke x de lijnen elkaar snijden", regel: `x = [${x0}]` },
        { wat: `Kijk waar de lijn van ${fx(a1, b1)} ${t === "<" ? "onder" : "boven"} die van ${fx(a2, b2)} ligt`, regel: `x [${ant}] [${x0}]`, hint: t === "<" ? "Kleiner dan = onder. Links of rechts van het snijpunt?" : "Groter dan = boven. Links of rechts van het snijpunt?" }
      ], slot: `Dus \`x ${ant} ${x0}\`.`
    });
  }
  // §1.6
  function g16controle(p = {}) {
    const a = p.a ?? nz(-6, 6), b = p.b ?? nz(-6, 6), x = p.x ?? nz(-9, 9), y = p.y ?? nz(-9, 9), r = p.r ?? a * x + b * y + (Math.random() < .5 ? 0 : nz(-6, 6)), val = a * x + b * y;
    return klaarZet({
      vraag: `Gegeven is de vergelijking \`${fx(a, 0)} ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${min(r)}\`. Controleer of het getallenpaar (${min(x)}, ${min(y)}) een oplossing is.`,
      stappen: [
        { wat: "Vul x en y in", regel: `${min(a)} · [${x}] ${b < 0 ? "−" : "+"} ${Math.abs(b)} · [${y}]`, hint: "Het eerste getal van het paar is x, het tweede is y." },
        { wat: "Reken uit", regel: `= [${val}]` },
        { wat: "Vergelijk met het getal rechts", regel: `${min(val)} en ${min(r)}: [${val === r ? "*wel een oplossing|geen oplossing" : "wel een oplossing|*geen oplossing"}]` }
      ], slot: val === r ? "Het klopt, dus het is een oplossing." : "Het klopt niet, dus het is geen oplossing."
    });
  }
  function g16bereken(p = {}) {
    const a = p.a ?? kies([-1, 1]) * rnd(2, 6), b = p.b ?? nz(-6, 6), x = p.x ?? nz(-8, 8), y0 = p.y0 ?? nz(-6, 9), r = a * x + b * y0;
    return klaarZet({
      vraag: `Gegeven is \`${fx(a, 0)} ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${min(r)}\`. Bereken de oplossing met y = ${min(y0)}.`,
      stappen: [
        { wat: "Vul de gegeven y in", regel: `${min(a)}x [+${b * y0}] = ${min(r)}`, hint: `${min(b)} · ${min(y0)} = ${min(b * y0)}.` },
        { wat: "x-termen naar links, getallen naar rechts", regel: `[${a}]x = [${r - b * y0}]` },
        { wat: "Delen door het getal voor x", regel: `x = [${x}]` }
      ], slot: `De oplossing is (${min(x)}, ${min(y0)}).`
    });
  }
  function g16rc(p = {}) {
    const a = p.a ?? nz(-6, 6), b = p.b ?? kies([-1, 1]) * rnd(2, 5), r = p.r ?? b * nz(-6, 6), rc = breuk(-a, b);
    return klaarZet({
      vraag: `Bereken de richtingscoëfficiënt van de lijn \`${fx(a, 0)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}y = ${min(r)}\`. Herleid eerst tot y = ax + b.`,
      stappen: [
        { wat: "Zet de x-term aan de andere kant", regel: `[${b}]y = [${-a}]x [+${r}]`, hint: "Links en rechts dezelfde x-term eraf (of erbij). Het teken wisselt." },
        { wat: "Deel alles door het getal voor y", regel: `y = [${rc}]x [+${r / b}]`, hint: `Deel elke term door ${min(b)}. Een breuk mag.` },
        { wat: "Lees de rc af", regel: `rc = [${rc}]` }
      ], slot: `De rc is ${min(rc).replace(/(\d+)\/(\d+)/, "{$1/$2}")}.`
    });
  }

  const OEFEN = {
    oefen11: { titel: "🧮 Stap voor stap: lijnen en formules", intro: "Kies een soort som. Eerst kijk je mee, dan doen we het samen, dan doe je het zelf.", soorten: [
      { naam: "Formule bij een lijn", voorbeeld: g11formule({ dx: 3, dy: 2, b: -1 }), samen: g11formule({ dx: 1, dy: -2, b: 3 }), maak: g11formule },
      { naam: "Punt op een lijn", voorbeeld: g11punt({ a: -4, b: 9, k: 3, type: "A" }), samen: g11punt({ a: 5, b: -12, k: -2, yb: -22, type: "B" }), maak: g11punt },
      { naam: "Evenwijdige lijn", plus: true, voorbeeld: g11evenwijdig({ a: 2, c: 5, px: 3, b: -1 }), samen: g11evenwijdig({ a: -3, c: 1, px: -2, b: 4 }), maak: g11evenwijdig }
    ] },
    oefen12: { titel: "🧮 Stap voor stap: lineaire verbanden", intro: "Uit een tabel of uit een grafiek met een schaal.", soorten: [
      { naam: "Uit een tabel", voorbeeld: g12tabel({ ctx: 0, start: 120, stap: 15, T: 12 }), samen: g12tabel({ ctx: 3, start: 3500, stap: 75, T: 14 }), maak: g12tabel },
      { naam: "Uit een grafiek", voorbeeld: g12grafiek({ b: 400, T: 40, yT: 0 }), samen: g12grafiek({ b: 100, T: 30, yT: 400 }), maak: g12grafiek }
    ] },
    oefen13: { titel: "🧮 Stap voor stap: vergelijkingen oplossen", intro: "Gebruik het werkschema. Kies bij elke stap wat je doet.", soorten: [
      { naam: "Zonder haakjes", schema: WERKSCHEMA, voorbeeld: g13zonder({ a: 7, b: 2, c: 3, x: 4 }), samen: g13zonder({ a: 2, b: -9, c: 6, x: -4 }), maak: g13zonder },
      { naam: "Met haakjes", schema: WERKSCHEMA, voorbeeld: g13haakjes({ pp: 4, q: 1, s: -2, u: -3, x: 4 }), samen: g13haakjes({ pp: 5, q: -2, s: 2, u: 1, x: 6 }), maak: g13haakjes },
      { naam: "Met breuken", plus: true, schema: SCHEMA_BREUK, voorbeeld: g13breuken({ m: 2, n: 3, a1: 1, a2: 2, k: 2, b: 3 }), samen: g13breuken({ m: 5, n: 2, a1: 2, a2: 1, k: 3, b: 1 }), maak: g13breuken }
    ] },
    oefen14: { titel: "🧮 Stap voor stap: snijpunten", intro: "Eerst x, dan y. En schrijf het punt netjes op.", soorten: [
      { naam: "Met de assen", voorbeeld: g14assen({ a: -3, x0: 3 }), samen: g14assen({ a: 4, x0: -2 }), maak: g14assen },
      { naam: "Van twee lijnen", voorbeeld: g14twee({ a1: 3, b1: -2, a2: -1, x: 2 }), samen: g14twee({ a1: 2, b1: 9, a2: 5, x: 2 }), maak: g14twee }
    ] },
    oefen15: { titel: "🧮 Stap voor stap: ongelijkheden", intro: "Met rekenen of met de grafiek. Let op bij delen door een negatief getal.", soorten: [
      { naam: "Met rekenen", plus: true, schema: SCHEMA_ONG, voorbeeld: g15alg({ a: 2, b: 7, c: 5, k: 3, t: ">" }), samen: g15alg({ a: 4, b: -3, c: 1, k: 4, t: "<" }), maak: g15alg },
      { naam: "Met de grafiek", voorbeeld: g15grafiek({ a1: 2, a2: -1, x0: 2, y0: 3, t: ">" }), samen: g15grafiek({ a1: -2, a2: 1, x0: 3, y0: 1, t: "<" }), maak: g15grafiek }
    ] },
    oefen16: { titel: "🧮 Stap voor stap: twee variabelen", intro: "Invullen, oplossen, en herleiden tot y = ax + b.", soorten: [
      { naam: "Is het een oplossing?", voorbeeld: g16controle({ a: 3, b: 2, x: 2, y: 3, r: 12 }), samen: g16controle({ a: 1, b: -4, x: -4, y: 3, r: 8 }), maak: g16controle },
      { naam: "Oplossing berekenen", voorbeeld: g16bereken({ a: 2, b: 3, x: 4, y0: 4 }), samen: g16bereken({ a: 5, b: -2, x: 3, y0: 3 }), maak: g16bereken },
      { naam: "De rc berekenen", voorbeeld: g16rc({ a: 3, b: 2, r: 12 }), samen: g16rc({ a: 4, b: -2, r: 6 }), maak: g16rc }
    ] }
  };

  /* ================= BEGRIPPEN (termen zoals in het boek, eigen uitleg) ================= */
  const BEGRIPPEN = [
    { id: "lineaireformule", icoon: "📈", term: "lineaire formule", uitleg: "Een formule van de vorm y = ax + b. De grafiek is altijd een rechte lijn.", voorbeeld: "y = 2x + 3: je hebt 3 photocards en elke week komen er 2 bij." },
    { id: "rc", icoon: "↗️", term: "richtingscoëfficiënt (rc)", uitleg: "Het getal a in y = ax + b. Ga 1 naar rechts, dan ga je a omhoog. Is a negatief, dan ga je omlaag.", voorbeeld: "y = −2x + 4 heeft rc −2: de lijn daalt." },
    { id: "snijyas", icoon: "🎯", term: "snijpunt met de y-as", uitleg: "Het punt waar de lijn de verticale as raakt. Bij y = ax + b is dat (0, b).", voorbeeld: "y = 3x − 5 snijdt de y-as in (0, −5)." },
    { id: "constant", icoon: "➖", term: "constant verband", uitleg: "Een formule y = b, dus a = 0. De grafiek is een horizontale lijn.", voorbeeld: "y = 4: wat x ook is, y blijft 4." },
    { id: "rechtevenredig", icoon: "📐", term: "recht evenredig verband", uitleg: "Een formule y = ax, dus b = 0. De grafiek is een lijn door de oorsprong.", voorbeeld: "Photocards van €2: prijs = 2 · aantal. Nul kaarten kost nul euro." },
    { id: "oorsprong", icoon: "⭕", term: "oorsprong", uitleg: "Het punt O(0, 0), waar de x-as en de y-as elkaar snijden." },
    { id: "evenwijdig", icoon: "🟰", plus: true, term: "evenwijdig", uitleg: "Evenwijdige lijnen lopen naast elkaar en snijden nooit. Ze hebben dezelfde rc.", voorbeeld: "y = 3x + 1 en y = 3x − 4 zijn evenwijdig." },
    { id: "lineairverband", icoon: "📊", term: "lineair verband", uitleg: "Een verband waarbij de grafiek een rechte lijn is. Bij elke stap komt er evenveel bij of af. De letters mogen anders zijn dan x en y.", voorbeeld: "K = −250t + 2000: elk uur 250 kaartjes minder." },
    { id: "lineairevergelijking", icoon: "⚖️", term: "lineaire vergelijking", uitleg: "Een vergelijking zonder kwadraten, zoals 7x + 2 = 3x + 18. Oplossen = de x vinden waarvoor links en rechts gelijk zijn.", voorbeeld: "7x + 2 = 3x + 18 geeft x = 4." },
    { id: "leden", icoon: "↔️", term: "linkerlid en rechterlid", uitleg: "Wat links van het is-teken staat, is het linkerlid. Wat rechts staat, het rechterlid.", voorbeeld: "Bij 4x + 4 = 28 − 2x is 4x + 4 het linkerlid." },
    { id: "haakjes", icoon: "🧩", term: "haakjes wegwerken", uitleg: "Het getal voor de haakjes keer elke term tussen de haakjes. Let op min keer min is plus.", voorbeeld: "−2(x − 3) = −2x + 6." },
    { id: "herleiden", icoon: "🧹", term: "herleiden", uitleg: "Korter schrijven door gelijksoortige termen samen te nemen. Ook: een vergelijking omschrijven tot y = ax + b.", voorbeeld: "22 − 2x + 6 herleid je tot 28 − 2x." },
    { id: "breuken", icoon: "🍰", plus: true, term: "breuken wegwerken", uitleg: "Vermenigvuldig alle termen met hetzelfde getal, zodat de breuken verdwijnen. Neem het kleinste getal waar alle noemers in passen.", voorbeeld: "½x + 2 = ⅓x + 3: alles keer 6 geeft 3x + 12 = 2x + 18." },
    { id: "snijpunt", icoon: "✖️", term: "snijpunt", uitleg: "Het punt waar twee grafieken elkaar kruisen. Stel de formules gelijk, bereken x en vul x in voor y.", voorbeeld: "y = 2x + 1 en y = −x + 7 snijden in S(2, 5)." },
    { id: "coordinaten", icoon: "📍", term: "coördinaten", uitleg: "Twee getallen die zeggen waar een punt ligt: eerst x (opzij), dan y (omhoog).", voorbeeld: "A(4, 0) ligt 4 naar rechts, op de x-as." },
    { id: "ongelijkheid", icoon: "↔️", term: "lineaire ongelijkheid", uitleg: "Lijkt op een lineaire vergelijking, maar met < of >. De oplossing is een heel gebied, zoals x > 2.", voorbeeld: "−x + 5 < x + 1 geeft x > 2." },
    { id: "omklappen", icoon: "🔄", plus: true, term: "het ongelijkheidsteken klapt om", uitleg: "Deel of vermenigvuldig je beide kanten met een negatief getal, dan wordt < een > (en andersom).", voorbeeld: "−2x < −4 wordt x > 2." },
    { id: "tweevariabelen", icoon: "🛍️", term: "vergelijking met twee variabelen", uitleg: "Een vergelijking met x én y, zoals 2x + 4y = 20. Er zijn veel oplossingen. De grafiek is een lijn.", voorbeeld: "Photocards van €2 en posters van €4, samen €20." },
    { id: "getallenpaar", icoon: "👯", term: "getallenpaar", uitleg: "Een x en een y samen. Het is een oplossing als het klopt in de vergelijking.", voorbeeld: "(4, 3) is een oplossing van 2x + 4y = 20, want 8 + 12 = 20." }
  ].map(k => metZeg(k, "term", "uitleg", "voorbeeld"));

  /* ================= TOETSVRAGEN (in de stijl van de diagnostische toets, eigen getallen) ================= */
  const TIP_REKEN = "<b>Bereken</b> of <b>Los op</b> = elke stap op een nieuwe regel. Gebruik je kladblok. Controleer je antwoord door het in te vullen.";
  const fig = (o, teken) => B => { const P = assen(B, o); teken(P, B); };
  const R = (id, par, vraag, antwoord, uitwerking, extra = {}) => ({ id, par, type: "reken", vraag, antwoord, uitwerking, euro: false, tip: TIP_REKEN, ...extra });
  const K = (id, par, vraag, keuzes, goed, uitleg, extra = {}) => ({ id, par, type: "keuze", vraag, keuzes, goed, uitleg, ...extra });
  const U = (id, par, vraag, antwoord, punten, extra = {}) => ({ id, par, type: "uitleg", vraag, antwoord, punten, ...extra });
  const VRAGEN = [
    U("q1", "§1.1", "Teken in één figuur de lijnen k: y = ½x + 1 en l: y = −2x + 3. Hoe pak je dat aan?", "Maak per lijn een tabel met twee punten. k: (0, 1) en (2, 2). l: (0, 3) en (1, 1). Zet de punten in een assenstelsel en trek de lijnen.", ["Per lijn een tabel met twee punten", "k gaat door (0, 1) en (2, 2)", "l gaat door (0, 3) en (1, 1)"]),
    R("q2", "§1.1", "Gegeven is de lijn l: y = −6x + 11. Op l ligt het punt A met x-coördinaat 9. Bereken de y-coördinaat van A.", -43, "y = −6 · 9 + 11 = −54 + 11 = −43.", { velden: ["y"], hint: "Vul x = 9 in de formule in." }),
    K("q3", "§1.1", "Ligt het punt B(−5, 41) op de lijn l: y = −6x + 11?", ["Nee, want −6 · −5 + 11 = 19", "Nee, want −6 · −5 + 11 = −19", "Ja, want −6 · −5 + 11 = 41", "Ja, want −5 + 41 = 36"], 2, "Min keer min is plus: −6 · −5 = 30. En 30 + 11 = 41. Dat is de y van B."),
    R("q4", "§1.1", "Stel de formule op van de lijn in de figuur. Vul a en b in.", [1.5, -2], "b = −2 (snijpunt met de y-as). 2 opzij, 3 omhoog: a = 3 : 2 = 1½. Dus y = 1½x − 2.",
      { velden: ["a", "b"], toon: "a = 1½ en b = −2", hint: "b lees je af op de y-as. Voor a: zoek een roosterpunt en reken omhoog : opzij.",
        beeld: fig({ x: 200, y: 44, w: 400, h: 390, xmin: -1, xmax: 4, ymin: -3, ymax: 5, fs: 13 }, P => {}), beeldLijn: [1.5, -2] }),
    U("q5", "§1.1", "Welke van deze lijnen hoort bij een recht evenredig verband: y = 4x + 1 of y = 4x? Licht toe.", "y = 4x, want daar is b = 0. De lijn gaat door de oorsprong.", ["y = 4x", "b = 0 / door de oorsprong"]),
    R("q6", "§1.1", "Lijn k is evenwijdig met l: y = 4x − 7 en gaat door R(−3, 2). Stel de formule van k op. Vul a en b in.", [4, 14], "Evenwijdig, dus a = 4. Invullen: 2 = 4 · −3 + b, dus 2 = −12 + b en b = 14. Dus k: y = 4x + 14.", { velden: ["a", "b"], toon: "a = 4 en b = 14", plus: true, hint: "Evenwijdig: zelfde rc. Vul daarna de coördinaten van R in." }),
    K("q7", "§1.1", "Wat is de richtingscoëfficiënt van y = 7 − 2x?", ["7", "−2", "2", "−7"], 1, "De rc is het getal bij x, met zijn teken: −2. Dat de x achteraan staat, maakt niet uit."),
    R("q8", "§1.2", "Stel de formule van N op. Vul a en b in.", [-10, 500], "b = 500. Bij t = 50 is N = 0. a = −500 : 50 = −10. Dus N = −10t + 500.",
      { velden: ["a", "b"], toon: "a = −10 en b = 500", hint: "Let op de schaal. Lees twee punten af die precies op een hoek liggen.",
        beeld: fig({ x: 160, y: 44, w: 480, h: 370, xmin: 0, xmax: 60, ymin: 0, ymax: 600, vrij: true, sx: 10, sy: 100, xnaam: "t", ynaam: "N", fs: 14 }, (P, B) => lijnDoor(B, P, -10, 500, { van: 0, tot: 60 })) }),
    U("q9", "§1.2", "In de tabel zie je de oppervlakte A van een park (in m²) per jaar t. Waarom is er sprake van een lineair verband?", "Bij elke stap van t gaat A met hetzelfde getal omlaag: steeds 25 minder.", ["Steeds hetzelfde verschil", "−25 per jaar"],
      { beeld: B => tabel(B, 40, 20, [["t", 0, 1, 2, 3, 4], ["A", 3600, 3575, 3550, 3525, 3500]], { kolom: 120, rij: 52, grootte: 26 }), beeldMaat: { h: 130 } }),
    R("q10", "§1.2", "Stel de formule van A op (zie de tabel). Vul a en b in.", [-25, 3600], "Steeds 25 minder: a = −25. Bij t = 0 is A = 3600: b = 3600. Dus A = −25t + 3600.",
      { velden: ["a", "b"], toon: "a = −25 en b = 3600", beeld: B => tabel(B, 40, 20, [["t", 0, 1, 2, 3, 4], ["A", 3600, 3575, 3550, 3525, 3500]], { kolom: 120, rij: 52, grootte: 26 }), beeldMaat: { h: 130 } }),
    R("q11", "§1.2", "Er geldt A = −25t + 3600, met t = 0 in 2024. Bereken A in 2040.", 3200, "2040 − 2024 = 16, dus t = 16. A = −25 · 16 + 3600 = −400 + 3600 = 3200.", { velden: ["A"], hint: "Reken eerst t uit: hoeveel jaar na 2024?" }),
    R("q12", "§1.3", "Los op: 6x − 11 = 2x + 13.", 6, "4x = 24, dus x = 6.", { velden: ["x"] }),
    R("q13", "§1.3", "Los op: −3a − 4 = −a + 10.", -7, "Links en rechts + a en + 4: −2a = 14. Delen door −2: a = −7.", { velden: ["a"] }),
    R("q14", "§1.3", "Los op: 2(x + 5) = 8x − 14.", 4, "2x + 10 = 8x − 14. Dan −6x = −24, dus x = 4.", { velden: ["x"] }),
    R("q15", "§1.3", "Los op: −4(2 − x) = 2(3x + 1).", -5, "−8 + 4x = 6x + 2. Dan −2x = 10, dus x = −5.", { velden: ["x"], hint: "−4 keer −x is +4x." }),
    R("q16", "§1.3", "Los op: ⅔x + 1 = ½x + 3.", 12, "Alle termen keer 6: 4x + 6 = 3x + 18. Dus x = 12.", { velden: ["x"], plus: true, hint: "Het kleinste getal waar 3 en 2 in passen, is 6." }),
    K("q17", "§1.3", "Wat is de eerste stap bij het oplossen van 3(x − 2) = 5 − (x + 1)?", ["Delen door 3", "De haakjes wegwerken", "x-termen naar links", "Beide leden herleiden"], 1, "Stap 1 van het werkschema: eerst de haakjes weg."),
    K("q18", "§1.3", "Je werkt de haakjes weg in 5 − 2(x − 4). Wat krijg je?", ["5 − 2x − 8", "5 − 2x + 8", "5 − 2x − 4", "3x − 12"], 1, "−2 keer −4 is +8. Dus 5 − 2x + 8, en dat herleid je tot 13 − 2x."),
    R("q19", "§1.4", "De lijn k: y = −4x + 12 snijdt de x-as in A. Bereken de coördinaten van A.", [3, 0], "Op de x-as is y = 0: −4x + 12 = 0, dus −4x = −12 en x = 3. A(3, 0).", { velden: ["x", "y"], toon: "A(3, 0)" }),
    R("q20", "§1.4", "De lijn k: y = −4x + 12 snijdt de y-as in B. Bereken de coördinaten van B.", [0, 12], "Op de y-as is x = 0: y = −4 · 0 + 12 = 12. B(0, 12).", { velden: ["x", "y"], toon: "B(0, 12)" }),
    R("q21", "§1.4", "De lijnen k: y = −2x + 5 en l: y = 4x + 17 snijden elkaar in S. Bereken de coördinaten van S.", [-2, 9], "−2x + 5 = 4x + 17, dus −6x = 12 en x = −2. y = −2 · −2 + 5 = 9. S(−2, 9).", { velden: ["x", "y"], toon: "S(−2, 9)", hint: "Stel de formules gelijk. Eerst x, dan y." }),
    U("q22", "§1.4", "Waarom stel je de formules gelijk als je het snijpunt van twee lijnen zoekt?", "In het snijpunt hebben beide lijnen dezelfde x én dezelfde y. Dus de formules geven daar hetzelfde getal.", ["Zelfde x en zelfde y", "Dus de formules zijn daar gelijk"]),
    K("q23", "§1.5", "Los op: 2x − 1 > x + 1. Gebruik de figuur.", ["x < 2", "x > 2", "x > 3", "x < 3"], 1, "De lijnen snijden bij x = 2. Rechts daarvan ligt de lijn van 2x − 1 boven die van x + 1.",
      { beeld: fig({ x: 150, y: 44, w: 420, h: 390, xmin: -1, xmax: 5, ymin: -2, ymax: 7, fs: 13 }, (P, B) => { lijnDoor(B, P, 2, -1); lijnDoor(B, P, 1, 1, { c: "rood" }); B.tekst(600, 80, "y = 2x − 1", { anker: "start", vet: true, c: "vak", grootte: 22, leest: false }); B.tekst(600, 120, "y = x + 1", { anker: "start", vet: true, c: "rood", grootte: 22, leest: false }); }) }),
    K("q24", "§1.5", "Los op: 4x − 3 < 7x − 9.", ["x < 2", "x > 2", "x < −2", "x > −2"], 1, "−3x < −6. Delen door −3: het teken klapt om. Dus x > 2.", { plus: true }),
    K("q25", "§1.5", "Los op: 2(a + 4) < a − 3.", ["a < −11", "a > −11", "a < −5", "a > 11"], 0, "2a + 8 < a − 3, dus a < −11. Je deelt niet door een negatief getal, dus het teken blijft.", { plus: true }),
    K("q26", "§1.5", "Los op: 3x > 7x.", ["x > 0", "x < 0", "x > 4", "Er is geen oplossing"], 1, "3x − 7x > 0, dus −4x > 0. Delen door −4: het teken klapt om. x < 0.", { plus: true }),
    U("q27", "§1.5", "Wanneer klapt het ongelijkheidsteken om?", "Als je beide kanten deelt door, of vermenigvuldigt met, een negatief getal.", ["Delen of vermenigvuldigen", "met een negatief getal"], { plus: true }),
    K("q28", "§1.5", "Los op: 1 + 2(x − 4) > −(x − 2).", ["x > 3", "x < 3", "x > 1", "x > −3"], 0, "1 + 2x − 8 > −x + 2, dus 2x − 7 > −x + 2. Dan 3x > 9, dus x > 3.", { plus: true }),
    K("q29", "§1.6", "Is het getallenpaar (15, −4) een oplossing van 2x + 7y = 2?", ["Ja, want 2 · 15 + 7 · −4 = 2", "Nee, want 2 · 15 + 7 · −4 = 58", "Nee, want 15 + −4 = 11"], 0, "30 − 28 = 2. Het klopt, dus het is een oplossing."),
    R("q30", "§1.6", "Gegeven is 3x + 4y = 24. Bereken de oplossing met y = 9.", -4, "3x + 36 = 24, dus 3x = −12 en x = −4.", { velden: ["x"] }),
    U("q31", "§1.6", "Een tas kost €6 en een muts €8. Je koopt x tassen en y mutsen en betaalt €52. Stel een vergelijking op met de variabelen x en y.", "6x + 8y = 52", ["6x voor de tassen", "8y voor de mutsen", "= 52"]),
    R("q32", "§1.6", "Er geldt 6x + 8y = 52 (tassen en mutsen). Je koopt 2 mutsen. Bereken hoeveel tassen je koopt.", 6, "y = 2: 6x + 16 = 52, dus 6x = 36 en x = 6.", { velden: ["x"] }),
    R("q33", "§1.6", "De lijn k: 4x − 5y = 20 snijdt de x-as in B. Bereken de coördinaten van B.", [5, 0], "y = 0: 4x = 20, dus x = 5. B(5, 0).", { velden: ["x", "y"], toon: "B(5, 0)" }),
    R("q34", "§1.6", "De lijn k: 4x − 5y = 20 snijdt de y-as in C. Bereken de coördinaten van C.", [0, -4], "x = 0: −5y = 20, dus y = −4. C(0, −4).", { velden: ["x", "y"], toon: "C(0, −4)" }),
    R("q35", "§1.6", "Bereken de richtingscoëfficiënt van l: 2x + 3y = 9.", -2 / 3, "3y = −2x + 9, dus y = −⅔x + 3. De rc is −⅔.", { velden: ["rc"], toon: "−2/3", hint: "Herleid tot y = ax + b. Een breuk mag: typ −2/3." }),
    R("q36", "§1.6", "Bereken de coördinaten van het snijpunt S van l: x + y = 4 en m: x + 3y = 10.", [1, 3], "l: y = −x + 4. m: y = −⅓x + 3⅓. Of slimmer: trek de vergelijkingen van elkaar af: 2y = 6, dus y = 3 en x = 1. S(1, 3).", { velden: ["x", "y"], toon: "S(1, 3)", hint: "Herleid allebei tot y = ax + b en stel ze gelijk." })
  ];
  VRAGEN.forEach(q => { if (q.beeldLijn) { const [a, b] = q.beeldLijn, o = { x: 200, y: 44, w: 400, h: 390, xmin: -1, xmax: 4, ymin: -3, ymax: 5, fs: 13 }; q.beeld = B => lijnDoor(B, assen(B, o), a, b); } metZeg(q, "vraag", "keuzes"); });

  /* ================= UIT JE HOOFD ================= */
  const GEHEUGEN = [
    { id: "g-ab", icoon: "📈", titel: "a en b in een grafiek", opdracht: "Teken een assenstelsel met een lijn. Laat zien waar je b afleest en hoe je a vindt. Schrijf y = ax + b erbij.",
      model: "<p><b>y = ax + b</b></p><p>b: waar de lijn de <b>y-as snijdt</b>, in (0, b).</p><p>a = de <b>rc</b>: 1 naar rechts, a omhoog. Of: omhoog gedeeld door opzij.</p><p>rc negatief: de lijn daalt.</p>",
      check: ["y = ax + b staat erbij", "b bij het snijpunt met de y-as", "a als trapje: opzij en omhoog", "rc negatief = dalende lijn"] },
    { id: "g-bijzonder", icoon: "📐", titel: "Twee bijzondere lijnen", opdracht: "Teken het constante verband en het recht evenredig verband. Zet bij elk de formule en de naam.",
      model: "<p><b>constant verband</b>: y = b. Horizontale lijn (a = 0).</p><p><b>recht evenredig verband</b>: y = ax. Lijn door de oorsprong (b = 0).</p>",
      check: ["Horizontale lijn met y = b", "Lijn door (0, 0) met y = ax", "Beide namen goed"] },
    { id: "g-werkschema", icoon: "⚖️", titel: "Werkschema vergelijkingen", opdracht: "Schrijf de vier stappen van het werkschema op. Maak er een eigen voorbeeld met haakjes naast.",
      model: "<ol><li>Haakjes wegwerken</li><li>Beide leden herleiden</li><li>x-termen naar links, getallen naar rechts</li><li>Delen door het getal voor x</li></ol><p>Plus: breuken? Eerst alle termen keer hetzelfde getal.</p>",
      check: ["Vier stappen in de goede volgorde", "Min keer min is plus bij haakjes", "Een voorbeeld dat klopt (gecontroleerd)"] },
    { id: "g-snijpunt", icoon: "✖️", titel: "Snijpunten berekenen", opdracht: "Schrijf op hoe je het snijpunt met de x-as, met de y-as en van twee lijnen vindt. Teken een schetsje.",
      model: "<p><b>x-as</b>: neem y = 0 en los op.</p><p><b>y-as</b>: vul x = 0 in.</p><p><b>twee lijnen</b>: stel de formules gelijk, bereken x, vul x in voor y.</p>",
      check: ["x-as: y = 0", "y-as: x = 0", "Twee lijnen: formules gelijkstellen", "Eerst x, dan y"] },
    { id: "g-ongelijk", icoon: "🔄", titel: "Ongelijkheid oplossen", opdracht: "Laat twee manieren zien om een ongelijkheid op te lossen: met grafieken en met rekenen. Wanneer klapt het teken om?",
      model: "<p><b>Met grafieken</b>: zoek het snijpunt, kijk waar de ene lijn onder of boven de andere ligt.</p><p><b>Met rekenen</b>: als een vergelijking. Delen of vermenigvuldigen met een <b>negatief</b> getal: het teken <b>klapt om</b>.</p>",
      check: ["Grafisch: snijpunt en onder/boven", "Rekenen: zoals een vergelijking", "Negatief getal: teken om"] },
    { id: "g-twee", icoon: "🛍️", titel: "Van 2x + 4y = 20 naar een lijn", opdracht: "Maak een tabel met x = 0 en y = 0, teken de lijn en herleid tot y = ax + b.",
      model: "<p>x = 0 geeft y = 5. y = 0 geeft x = 10.</p><p>Lijn door (0, 5) en (10, 0).</p><p>4y = −2x + 20, dus y = −½x + 5. rc = −½.</p>",
      check: ["Tabel met x = 0 en y = 0", "Twee punten en de lijn", "Herleid tot y = ax + b"] }
  ];

  /* ================= STRUCTUUR ================= */
  const STATIONS = [
    { par: "§1.1", icoon: "📈", titel: "De formule y = ax + b", spreek: "De formule ij is a iks plus b", delen: ["film11", "verband11", "oefen11"] },
    { par: "§1.2", icoon: "📊", titel: "Lineaire verbanden", delen: ["film12", "oefen12"] },
    { par: "§1.3", icoon: "⚖️", titel: "Lineaire vergelijkingen", delen: ["film13", "oefen13"] },
    { par: "§1.4", icoon: "✖️", titel: "Snijpunten van grafieken", delen: ["film14", "oefen14"] },
    { par: "§1.5", icoon: "↔️", titel: "Lineaire ongelijkheden", delen: ["film15", "teken15", "oefen15"] },
    { par: "§1.6", icoon: "🛍️", titel: "Vergelijkingen met twee variabelen", delen: ["film16", "oefen16"] }
  ];
  const NAMEN = {
    film11: "§1.1 filmpje", verband11: "§1.1 welk verband?", oefen11: "§1.1 stap voor stap",
    film12: "§1.2 filmpje", oefen12: "§1.2 stap voor stap", film13: "§1.3 filmpje", oefen13: "§1.3 stap voor stap",
    film14: "§1.4 filmpje", oefen14: "§1.4 stap voor stap", film15: "§1.5 filmpje", teken15: "§1.5 klapt het om?", oefen15: "§1.5 stap voor stap",
    film16: "§1.6 filmpje", oefen16: "§1.6 stap voor stap"
  };
  const IDS = { kaarten: BEGRIPPEN.map(k => k.id), vragen: VRAGEN.map(q => q.id) };

  const overzicht = el => L.overzicht(el, {
    mod: MOD, titel: "Wiskunde H1 · Lineaire problemen", spreekTitel: "Wiskunde hoofdstuk één. Lineaire problemen.",
    IDS, STATIONS, NAMEN, GEHEUGEN,
    waarom: [
      "<b>Eerst inspireren, dan trainen:</b> elke paragraaf begint met een schetsbord-filmpje. De grafiek of de som ontstaat lijn voor lijn terwijl de stem uitlegt (Fiorella & Mayer 2016).",
      "<b>Uitgewerkte voorbeelden die afbouwen</b> (kijk mee → samen → zelf): bij nieuwe stof leer je meer van een goed voorbeeld dan van meteen zelf zwoegen. Het voorbeeld verdwijnt stap voor stap (Renkl & Atkinson; worked-example effect).",
      "<b>Kiezen wat je doet</b> bij elke stap: zo leert ze de aanpak (het werkschema), niet alleen het rekenen.",
      "<b>Steeds een nieuwe som</b> bij 'Zelf': vergelijkbaar met de toets, maar nooit dezelfde getallen. Zo oefent ze de aanpak en niet het antwoord.",
      "<b>Toetstraining door elkaar</b> (interleaving): op de toets moet ze zelf herkennen welke aanpak een vraag nodig heeft.",
      "<b>Gespreid herhalen</b> tot de toetsdatum, en <b>uit je hoofd tekenen</b> van de kernschema's.",
      "<b>➕ Plusstof</b> = de stof die in het boek met een plusteken is gemarkeerd: de evenwijdige lijn (§1.1), breuken wegwerken (§1.3) en ongelijkheden oplossen met rekenen, met het omklappen van het teken (§1.5). In de app staat er een gouden label bij."
    ]
  });

  const klaar = id => () => V.klaar(id);
  const naKlaar = (id, tekst) => n => { V.klaar(id); if (n) n.innerHTML = `<p class="soft" style="margin-top:10px">${tekst}</p>`; };
  const film = (F, id) => el => L.schetsbord(el, F, klaar(id));
  const oefen = id => el => L.stappen(el, OEFEN[id], klaar(id));

  App.addModule({
    id: MOD,
    vak: "Wiskunde",
    titel: "H1 Lineaire problemen",
    sub: "Lijnen, formules, vergelijkingen en ongelijkheden.",
    icoon: "📈",
    thuis: ["overzicht"],
    stations: STATIONS,
    meten: ["film11", "verband11", "oefen11", "film13", "oefen13", "film15", "teken15", "oefen15"],
    _test: { OEFEN, zeg, VRAGEN, BEGRIPPEN, FILMS: { film11: FILM11, film12: FILM12, film13: FILM13, film14: FILM14, film15: FILM15, film16: FILM16 } },   // alleen voor de automatische tests (tools en skill)
    status() {
      const v = V.get(), d = v.toets ? Math.ceil((v.toets - Date.now()) / DAG) : null;
      const k = V.teDoen("kaarten", IDS.kaarten, 6).length, q = V.teDoen("vragen", IDS.vragen, 8).length;
      return `${d != null && d >= 0 ? `📅 Toets ${d === 0 ? "vandaag" : d === 1 ? "morgen" : "over " + d + " dagen"} · ` : ""}🔦 ${Math.round(V.beheersing(IDS) * 100)}% opgeladen · vandaag ${k} kaarten, ${Math.min(q, 8)} vragen`;
    },
    onderdelen: [
      { id: "overzicht", naam: "Overzicht", icoon: "🗺️", groep: "", render: overzicht },
      { id: "film11", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Kijk hoe de grafiek van y = ax + b ontstaat. Aan het eind teken jij.", render: film(FILM11, "film11") },
      { id: "verband11", naam: "Welk verband?", icoon: "🔀", groep: "Leren", kort: "Constant, recht evenredig of een ander lineair verband?", render: el => L.sorteer(el, SORT11, naKlaar("verband11", "Volgende stap: zelf formules opstellen.")) },
      { id: "oefen11", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Formule bij een lijn, punt op een lijn, en ➕ evenwijdige lijn.", render: oefen("oefen11") },
      { id: "film12", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Kaartjes voor een tour: een lineair verband met andere letters.", render: film(FILM12, "film12") },
      { id: "oefen12", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Formule uit een tabel of uit een grafiek met een schaal.", render: oefen("oefen12") },
      { id: "film13", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "De weegschaal en het werkschema voor vergelijkingen.", render: film(FILM13, "film13") },
      { id: "oefen13", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Vergelijkingen oplossen, met en zonder haakjes, en ➕ met breuken.", render: oefen("oefen13") },
      { id: "film14", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Snijpunten met de assen en van twee lijnen.", render: film(FILM14, "film14") },
      { id: "oefen14", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Snijpunten berekenen: eerst x, dan y.", render: oefen("oefen14") },
      { id: "film15", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Ongelijkheden: met de grafiek en met rekenen.", render: film(FILM15, "film15") },
      { id: "teken15", naam: "Klapt het om?", icoon: "🔄", groep: "Leren", plus: true, kort: "Bij welke stap klapt het ongelijkheidsteken om?", render: el => L.sorteer(el, SORT15, naKlaar("teken15", "Volgende stap: zelf ongelijkheden oplossen.")) },
      { id: "oefen15", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Ongelijkheden oplossen: met de grafiek, en ➕ met rekenen.", render: oefen("oefen15") },
      { id: "film16", naam: "Filmpje", icoon: "🎬", groep: "Leren", kort: "Merch kopen: een vergelijking met x én y.", render: film(FILM16, "film16") },
      { id: "oefen16", naam: "Stap voor stap", icoon: "🧮", groep: "Leren", kort: "Oplossingen controleren en berekenen, en de rc.", render: oefen("oefen16") },
      { id: "begrippen", naam: "Begrippen", icoon: "🃏", groep: "Oefenen", render: el => L.kaarten(el, MOD, BEGRIPPEN) },
      { id: "geheugen", naam: "Uit je hoofd", icoon: "🧠", groep: "Oefenen", render: el => L.geheugen(el, MOD, GEHEUGEN) },
      { id: "toets", naam: "Toetstraining", icoon: "📝", groep: "Oefenen", render: el => L.toets(el, MOD, VRAGEN) }
    ]
  });
})();
