/* Geschiedenis – Hoofdstuk 1: De Eerste Wereldoorlog (havo 3).
   Gebouwd vanuit de leerdoelen van de docent (1.2 t/m 1.4 en de vaardigheid oorzaken en gevolgen).
   Eigen samenvattingen en eigen voorbeelden; geen tekst uit het boek.
   ⚠️ Toetswoorden uit het boek zijn leidend. De termen hieronder zijn de gangbare termen voor havo 3, nog niet
   nagelopen tegen haar boek (zie WENSEN.md). Wijkt het boek af, pas dan de term aan in BEGRIPPEN en in de teksten.
   Opbouw: tijdlijn (algemeen) · §1.2 plaat 'kruitvat' + sorteren · §1.3 filmpje + sorteren oorzaak/gevolg ·
   §1.4 chat Weimar + filmpje Italië + plaat Nederland · vaardigheid: uitleg + vijf sorteerrondes. */
(function () {
  const { $, $$, esc } = App;
  const L = App.Leer;
  const MOD = "geschiedenis-h1";
  const V = L.Voortgang(MOD);
  const DAG = 864e5;

  /* ================= INHOUD ================= */

  /* ----- Algemeen: tijdlijn ----- */
  const TIJDLIJN = {
    titel: "🕰️ Op volgorde van tijd",
    uitleg: "Drie rondes: vóór, tijdens en na de oorlog. Daarna nog een ronde met alles door elkaar.",
    alles: 7,
    rondes: [
      { naam: "1 · Vóór de oorlog", items: [
        { wanneer: 1871, jaar: "1871", t: "Duitsland wordt één land: het Duitse Keizerrijk. Frankrijk verliest Elzas-Lotharingen." },
        { wanneer: 1882, jaar: "1882", t: "Duitsland, Oostenrijk-Hongarije en Italië sluiten de **Triple Alliantie**." },
        { wanneer: 1898, jaar: "1898", t: "Duitsland begint met een grote oorlogsvloot. De **wapenwedloop** met Groot-Brittannië begint." },
        { wanneer: 1907, jaar: "1907", t: "Frankrijk, Rusland en Groot-Brittannië vormen de **Triple Entente**." },
        { wanneer: 1908, jaar: "1908", t: "Oostenrijk-Hongarije neemt Bosnië in. Servië is woedend." },
        { wanneer: 1912, jaar: "1912 – 1913", t: "Oorlogen op de Balkan. Het Ottomaanse Rijk verliest bijna al zijn land in Europa." }
      ] },
      { naam: "2 · De oorlog", items: [
        { wanneer: 1914.49, jaar: "28 juni 1914", t: "Aanslag in Sarajevo: kroonprins Frans Ferdinand wordt doodgeschoten." },
        { wanneer: 1914.57, jaar: "juli 1914", t: "Oostenrijk-Hongarije verklaart Servië de oorlog." },
        { wanneer: 1914.59, jaar: "augustus 1914", t: "Duitsland valt België binnen. Groot-Brittannië doet mee aan de oorlog." },
        { wanneer: 1914.7, jaar: "september 1914", t: "Slag aan de Marne. Het Duitse plan mislukt. De **loopgravenoorlog** begint." },
        { wanneer: 1916, jaar: "1916", t: "De slagen bij Verdun en aan de Somme. Honderdduizenden doden, bijna geen winst." },
        { wanneer: 1917.3, jaar: "april 1917", t: "De Verenigde Staten doen mee, aan de kant van de **geallieerden**." },
        { wanneer: 1918.2, jaar: "maart 1918", t: "Rusland stopt met de oorlog, na een revolutie." },
        { wanneer: 1918.86, jaar: "11 november 1918", t: "**Wapenstilstand**. De Duitse keizer vlucht naar Nederland." }
      ] },
      { naam: "3 · Na de oorlog", items: [
        { wanneer: 1919, jaar: "1919", t: "Het **Verdrag van Versailles**. Duitsland wordt de **Republiek van Weimar**." },
        { wanneer: 1920, jaar: "1920", t: "De **Volkenbond** begint. Hij moet nieuwe oorlogen voorkomen." },
        { wanneer: 1922, jaar: "1922", t: "**Mars op Rome**. Mussolini wordt premier van Italië." },
        { wanneer: 1923, jaar: "1923", t: "**Hyperinflatie** in Duitsland. Het geld wordt waardeloos." },
        { wanneer: 1925, jaar: "1925", t: "Mussolini maakt van Italië een **dictatuur**." }
      ] }
    ]
  };

  /* ----- §1.2 de plaat: Europa rond 1900 ----- */
  const PLAAT12 = {
    titel: "Europa rond 1900: een kruitvat",
    icoon: "🧨",
    intro: "Europa rond 1900 lijkt rustig. Maar onder de oppervlakte zit veel spanning.",
    say: "Europa rond 1900: een kruitvat. Het lijkt rustig. Maar onder de oppervlakte zit veel spanning. Eén vonk is genoeg voor een ontploffing.",
    teken: "Europa rond 1900",
    blokken: [
      { kop: "1 · Wie had de macht?",
        say: "Wie had de macht? Vijf grote landen. Groot-Brittannië had de grootste vloot en het grootste koloniale rijk. Duitsland was sinds 1871 één land, met een snel groeiende industrie. Duitsland wilde ook koloniën en een grote vloot. Frankrijk had in 1871 de oorlog tegen Duitsland verloren, en Elzas-Lotharingen. Frankrijk wilde dat terug. Rusland was enorm groot, met heel veel soldaten. Rusland voelde zich de beschermer van de Slavische volken. Oostenrijk-Hongarije was een rijk met heel veel volken. Het was bang dat die volken los wilden. Het Ottomaanse Rijk werd steeds zwakker.",
        html: `<div class="lonten">
          <div class="lont"><div class="ic">🇬🇧</div><div class="nm">Groot-Brittannië</div><div class="ex">Grootste vloot en grootste koloniale rijk. Wil dat zo houden.</div></div>
          <div class="lont"><div class="ic">🇩🇪</div><div class="nm">Duitsland</div><div class="ex">Sinds 1871 één land. Industrie groeit snel. Wil ook koloniën en een grote vloot.</div></div>
          <div class="lont"><div class="ic">🇫🇷</div><div class="nm">Frankrijk</div><div class="ex">Verloor in 1871 van Duitsland, en Elzas-Lotharingen. Wil dat terug.</div></div>
          <div class="lont"><div class="ic">🐻</div><div class="nm">Rusland</div><div class="ex">Enorm groot, veel soldaten. Beschermer van de Slavische volken.</div></div>
          <div class="lont"><div class="ic">👑</div><div class="nm">Oostenrijk-Hongarije</div><div class="ex">Rijk met heel veel volken. Bang dat die los willen.</div></div>
          <div class="lont"><div class="ic">🌙</div><div class="nm">Ottomaanse Rijk</div><div class="ex">Wordt steeds zwakker. Verliest land op de Balkan.</div></div>
        </div>` },
      { kop: "2 · Vier lonten aan het kruitvat",
        say: "Vier lonten aan het kruitvat. Eén: nationalisme. Trots op je eigen land of volk, en vinden dat elk volk een eigen staat moet hebben. Twee: imperialisme. Landen strijden om koloniën, grondstoffen en macht buiten Europa. Drie: militarisme. Het leger is heel belangrijk en populair. Landen kopen steeds meer wapens. Dat heet een wapenwedloop. Vier: bondgenootschappen. Landen beloven elkaar te helpen als er oorlog komt.",
        html: `<div class="lonten">
          <div class="lont"><div class="ic">🚩</div><div class="nm bl">nationalisme</div><div class="ex">Trots op je eigen land of volk. Elk volk wil een eigen staat.</div></div>
          <div class="lont"><div class="ic">🌍</div><div class="nm bl">imperialisme</div><div class="ex">Strijd om koloniën, grondstoffen en macht buiten Europa.</div></div>
          <div class="lont"><div class="ic">⚔️</div><div class="nm bl">militarisme</div><div class="ex">Het leger is belangrijk en populair. Meer en meer wapens: een <span class="bl">wapenwedloop</span>.</div></div>
          <div class="lont"><div class="ic">🤝</div><div class="nm bl">bondgenootschappen</div><div class="ex">Landen beloven elkaar te helpen als er oorlog komt.</div></div>
        </div>
        <div class="trick">💡 Elke lont maakt de spanning groter. Er is maar één vonk nodig.</div>` },
      { kop: "3 · Twee kampen",
        say: "Twee kampen. De Triple Alliantie: Duitsland, Oostenrijk-Hongarije en Italië. De Triple Entente: Frankrijk, Rusland en Groot-Brittannië. Waarom? Landen voelden zich bedreigd. Frankrijk en Rusland waren bang voor het sterke Duitsland. Duitsland was bang om omsingeld te worden. Samen ben je sterker, en een vijand denkt wel twee keer na. Maar er zit een gevaar in. Een ruzie tussen twee landen sleept meteen alle bondgenoten mee. Net als dominostenen.",
        html: `<div class="kampen">
          <div class="kamp"><b class="bl">Triple Alliantie</b><ul><li>Duitsland</li><li>Oostenrijk-Hongarije</li><li>Italië</li></ul></div>
          <div class="kamp b"><b class="bl">Triple Entente</b><ul><li>Frankrijk</li><li>Rusland</li><li>Groot-Brittannië</li></ul></div>
        </div>
        <p><b>Waarom?</b> Landen voelden zich bedreigd. Frankrijk en Rusland waren bang voor het sterke Duitsland. Duitsland was bang om omsingeld te worden. Samen ben je sterker. Een vijand denkt dan wel twee keer na.</p>
        <p><b>Het gevaar:</b> een ruzie tussen twee landen sleept alle bondgenoten mee. Net als dominostenen die omvallen.</p>` },
      { kop: "4 · De Balkan",
        say: "De Balkan. Het Ottomaanse Rijk werd zwakker. Volken op de Balkan wilden een eigen staat. Dat is nationalisme. Servië wilde alle Zuid-Slaven in één land. Maar veel Slaven woonden in Oostenrijk-Hongarije. In 1908 nam Oostenrijk-Hongarije ook Bosnië in. Daar woonden veel Serviërs. Servië was woedend. Rusland steunde Servië, want Rusland voelde zich de beschermer van alle Slaven. Duitsland steunde Oostenrijk-Hongarije. Zo werd de Balkan het kruitvat van Europa.",
        html: `<p>Het Ottomaanse Rijk werd zwakker. Volken op de Balkan wilden een eigen staat: <span class="bl">nationalisme</span>.</p>
        <div class="ketting">
          <div>🇷🇸 <b>Servië</b> wil alle Zuid-Slaven in één land.</div>
          <div>👑 Maar veel Slaven wonen in <b>Oostenrijk-Hongarije</b>. Dat neemt in 1908 ook Bosnië in. Servië is woedend.</div>
          <div>🐻 <b>Rusland</b> steunt Servië: beschermer van de Slaven. 🇩🇪 <b>Duitsland</b> steunt Oostenrijk-Hongarije.</div>
        </div>
        <div class="trick">💡 Zo werd de Balkan het <b>kruitvat van Europa</b>: een kleine ruzie daar kon heel Europa in brand zetten.</div>` }
    ],
    noot: "Bij de toets: leg het **verband** tussen nationalisme en de Balkan uit, en **waarom** er bondgenootschappen waren."
  };

  const SORT_KAMP = {
    titel: "🤝 Welk kamp?",
    uitleg: "Hoort het land of de zin bij de Triple Alliantie of bij de Triple Entente?",
    bakken: [{ id: "alliantie", naam: "Triple Alliantie", icoon: "🦅" }, { id: "entente", naam: "Triple Entente", icoon: "🤝" }],
    kaarten: [
      { t: "Duitsland", bak: "alliantie" },
      { t: "Frankrijk", bak: "entente" },
      { t: "Oostenrijk-Hongarije", bak: "alliantie" },
      { t: "Rusland", bak: "entente" },
      { t: "Groot-Brittannië", bak: "entente" },
      { t: "Italië", bak: "alliantie", uitleg: "Italië zat in de Triple Alliantie. In 1915 koos het toch de kant van de geallieerden." },
      { t: "Wil Elzas-Lotharingen terug.", bak: "entente", uitleg: "Dat is Frankrijk, en Frankrijk zat in de Triple Entente." },
      { t: "Voelt zich de beschermer van de Slavische volken.", bak: "entente", uitleg: "Dat is Rusland." },
      { t: "Bouwt een vloot om de Britten bij te houden.", bak: "alliantie", uitleg: "Dat is Duitsland." },
      { t: "Neemt in 1908 Bosnië in.", bak: "alliantie", uitleg: "Dat is Oostenrijk-Hongarije." }
    ]
  };

  const SORT_LONT = {
    titel: "🧨 Welke lont?",
    uitleg: "Bij welke oorzaak van de spanning hoort de zin?",
    bakken: [{ id: "nat", naam: "Nationalisme", icoon: "🚩" }, { id: "imp", naam: "Imperialisme", icoon: "🌍" }, { id: "mil", naam: "Militarisme", icoon: "⚔️" }, { id: "bond", naam: "Bondgenootschappen", icoon: "🤝" }],
    kaarten: [
      { t: "Serviërs willen alle Zuid-Slaven in één eigen land.", bak: "nat" },
      { t: "Veel mensen vinden hun eigen land beter dan andere landen.", bak: "nat" },
      { t: "Frankrijk wil uit trots Elzas-Lotharingen terug.", bak: "nat", uitleg: "Het gaat om trots op het eigen land en eigen grondgebied." },
      { t: "Duitsland wil ook koloniën in Afrika.", bak: "imp" },
      { t: "Landen strijden om grondstoffen en markten buiten Europa.", bak: "imp" },
      { t: "Duitsland en Groot-Brittannië bouwen om het hardst oorlogsschepen.", bak: "mil", uitleg: "Dat is een wapenwedloop, en die hoort bij militarisme." },
      { t: "Generaals hebben veel macht en maken plannen voor een snelle oorlog.", bak: "mil" },
      { t: "Het leger is trots en populair. Jongens moeten in dienst.", bak: "mil" },
      { t: "Duitsland belooft Oostenrijk-Hongarije te helpen, wat er ook gebeurt.", bak: "bond" },
      { t: "Frankrijk en Rusland spreken af elkaar te helpen tegen Duitsland.", bak: "bond" }
    ]
  };

  /* ----- §1.3 het filmpje: van één schot naar een wereldoorlog ----- */
  const FILM13 = {
    titel: "Van één schot naar een wereldoorlog",
    intro: "Hoe begon de oorlog, hoe verliep hij, en hoe liep hij af? Tik op **Afspelen**.",
    teken: "De Eerste Wereldoorlog",
    scenes: [
      { beeld: "⚡", jaar: "28 juni 1914", t: "In Sarajevo schiet een Bosnisch-Servische nationalist de Oostenrijkse kroonprins Frans Ferdinand dood. Dit is de **aanleiding** van de oorlog: de directe oorzaak." },
      { beeld: "📜", jaar: "juli 1914", t: "Oostenrijk-Hongarije geeft Servië de schuld. Het stuurt een **ultimatum**: strenge eisen, met heel weinig tijd. Servië zegt niet overal ja op. Oostenrijk-Hongarije verklaart Servië de oorlog." },
      { beeld: "🪖", jaar: "eind juli – begin augustus 1914", t: "Rusland helpt Servië en begint met de **mobilisatie**: het leger maakt zich klaar voor oorlog. Duitsland helpt Oostenrijk-Hongarije. Het verklaart Rusland en Frankrijk de oorlog." },
      { beeld: "🗺️", jaar: "augustus 1914", t: "Duitsland volgt het **Schlieffenplan**. Eerst Frankrijk snel verslaan, via België. Daarna alle soldaten naar Rusland. Zo wil Duitsland een **tweefrontenoorlog** voorkomen." },
      { beeld: "💥", jaar: "augustus 1914", t: "Duitsland valt het neutrale België binnen. Daarom doet ook Groot-Brittannië mee. De bondgenootschappen werken als dominostenen. Binnen een week zijn alle grote landen in oorlog." },
      { beeld: "⚔️", t: "Twee kampen. De **geallieerden**: Frankrijk, Groot-Brittannië en Rusland, later ook Italië en de Verenigde Staten. De **centralen**: Duitsland, Oostenrijk-Hongarije, het Ottomaanse Rijk en Bulgarije." },
      { beeld: "⛏️", jaar: "september 1914", t: "Bij de Marne houden de Fransen en Britten de Duitsers tegen. Het plan mislukt. Beide legers graven zich in. Het wordt een **loopgravenoorlog**: jarenlang vastzitten, met enorm veel doden." },
      { beeld: "🏭", t: "Het wordt een **totale oorlog**. Het hele land doet mee. Fabrieken maken wapens. Vrouwen doen het werk van de mannen. Voedsel gaat op de bon. **Propaganda** moet iedereen achter de oorlog krijgen. Ook burgers worden doelwit." },
      { beeld: "🇺🇸", jaar: "1917 – 1918", t: "In 1917 doen de Verenigde Staten mee, aan de kant van de geallieerden. Rusland krijgt een revolutie en stopt in 1918 met vechten." },
      { beeld: "🕊️", jaar: "11 november 1918", t: "**Wapenstilstand**. Duitsland kan niet meer. De keizer vlucht naar Nederland. Ongeveer tien miljoen soldaten zijn gesneuveld." },
      { beeld: "✍️", jaar: "1919", t: "Het **Verdrag van Versailles**. Duitsland krijgt de schuld van de oorlog. Het moet **herstelbetalingen** betalen. Het verliest land en al zijn koloniën. Het mag maar een klein leger hebben." },
      { beeld: "🗺️", jaar: "na 1918", t: "Gevolgen voor Europa: vier keizerrijken verdwijnen. Er komen nieuwe landen, zoals Polen en Tsjecho-Slowakije. De **Volkenbond** moet nieuwe oorlogen voorkomen. Veel Duitsers voelen zich vernederd." }
    ]
  };

  const SORT_OORZAAK = {
    titel: "🔎 Aanleiding, oorzaak of gevolg?",
    uitleg: "Is het de **aanleiding** van WO1, een **indirecte oorzaak**, of een **gevolg**?",
    bakken: [{ id: "aan", naam: "Aanleiding", icoon: "⚡", sub: "directe oorzaak" }, { id: "ind", naam: "Indirecte oorzaak", icoon: "🧨", sub: "speelde al langer" }, { id: "gev", naam: "Gevolg", icoon: "➡️", sub: "na de oorlog" }],
    kaarten: [
      { t: "De moord op Frans Ferdinand in Sarajevo.", bak: "aan" },
      { t: "Het nationalisme op de Balkan.", bak: "ind" },
      { t: "De wapenwedloop tussen Duitsland en Groot-Brittannië.", bak: "ind" },
      { t: "De bondgenootschappen.", bak: "ind", uitleg: "Ze waren er al lang voor 1914. Ze zorgden dat de ruzie zich uitbreidde." },
      { t: "De strijd om koloniën.", bak: "ind", uitleg: "Dat is imperialisme. Dat speelde al jaren." },
      { t: "Duitsland moet herstelbetalingen betalen.", bak: "gev" },
      { t: "Oostenrijk-Hongarije valt uit elkaar.", bak: "gev" },
      { t: "De Volkenbond wordt opgericht.", bak: "gev" },
      { t: "Het schot van 28 juni 1914.", bak: "aan", uitleg: "Dat is hetzelfde als de moord in Sarajevo: de vonk." }
    ]
  };

  /* ----- §1.4 chat: de Republiek van Weimar ----- */
  const CHAT = {
    titel: "💬 Podcast: Duitsland na 1918",
    intro: "Sam en Mila maken een podcast voor geschiedenis. Tik op **Volgende** of op **Afspelen**. Tik op een berichtje om het nog een keer te horen.",
    personen: {
      sam: { naam: "Sam", emoji: "🎧", kleur: "#5EC8F2", kant: "links", stem: "Puck" },
      mila: { naam: "Mila", emoji: "💜", kleur: "#B79CFF", kant: "rechts" }
    },
    berichten: [
      { van: "sam", tekst: "Onze podcast gaat over Duitsland na 1918. Wat gebeurde er met de keizer? 🎙️" },
      { van: "mila", tekst: "Die vluchtte naar Nederland. Duitsland werd een republiek: de **Republiek van Weimar**." },
      { van: "sam", tekst: "Waarom heet die zo?" },
      { van: "mila", tekst: "Het nieuwe parlement kwam in 1919 bij elkaar in de stad Weimar. In Berlijn was het te onrustig. Daar maakten ze een nieuwe grondwet." },
      { van: "sam", tekst: "Een democratie dus. Klinkt goed!" },
      { van: "mila", tekst: "Ja, maar het ging vanaf het begin mis. Eerst de **politieke** problemen." },
      { van: "mila", tekst: "Er waren heel veel partijen. Geen enkele partij had de meerderheid. Regeringen vielen steeds." },
      { van: "sam", tekst: "En waren er ook mensen tegen de democratie?" },
      { van: "mila", tekst: "Ja, aan twee kanten. Communisten wilden een revolutie, zoals in Rusland. Rechtse nationalisten wilden een sterke leider terug. Allebei probeerden ze met geweld de macht te pakken." },
      { van: "sam", tekst: "Wat vonden gewone Duitsers van het Verdrag van Versailles?" },
      { van: "mila", tekst: "Een vernedering. En de nieuwe republiek had het getekend. Dus kreeg de republiek de schuld." },
      { van: "mila", tekst: "Veel mensen geloofden de **dolkstootlegende**: het leger was niet verslagen, maar in de rug gestoken door politici thuis." },
      { van: "sam", tekst: "Klopt dat verhaal?" },
      { van: "mila", tekst: "Nee! Het leger kon echt niet meer. Maar het verhaal maakte de republiek zwak." },
      { van: "sam", tekst: "En dan de **economische** problemen? 💸" },
      { van: "mila", tekst: "Duitsland moest **herstelbetalingen** betalen. Dat lukte niet. In 1923 bezetten Frankrijk en België het Ruhrgebied, met de belangrijkste mijnen en fabrieken." },
      { van: "mila", tekst: "De regering drukte steeds meer geld bij. Het geld werd waardeloos: **hyperinflatie**. Een brood kostte miljarden marken." },
      { van: "sam", tekst: "Dus al het spaargeld was weg?" },
      { van: "mila", tekst: "Ja. Vooral de middenklasse verloor alles. Veel mensen vertrouwden de democratie niet meer." },
      { van: "sam", tekst: "Samengevat: politieke problemen én economische problemen 🗳️💸" },
      { van: "mila", tekst: "Precies. En daar maakten extreme partijen later gebruik van." }
    ]
  };

  const SORT_WEIMAR = {
    titel: "🗳️💸 Politiek of economisch?",
    uitleg: "Welk soort probleem had de Republiek van Weimar?",
    bakken: [{ id: "pol", naam: "Politiek probleem", icoon: "🗳️", sub: "macht, regering, partijen" }, { id: "eco", naam: "Economisch probleem", icoon: "💸", sub: "geld, werk, handel" }],
    kaarten: [
      { t: "Heel veel partijen, geen meerderheid.", bak: "pol" },
      { t: "Regeringen vallen steeds.", bak: "pol" },
      { t: "Communisten willen een revolutie.", bak: "pol" },
      { t: "Rechtse nationalisten willen een sterke leider.", bak: "pol" },
      { t: "De dolkstootlegende.", bak: "pol", uitleg: "Het verhaal ondermijnde het vertrouwen in de politici van de republiek." },
      { t: "De herstelbetalingen.", bak: "eco" },
      { t: "De hyperinflatie van 1923.", bak: "eco" },
      { t: "Frankrijk en België bezetten het Ruhrgebied.", bak: "eco", uitleg: "De belangrijkste mijnen en fabrieken lagen stil. Dat raakte vooral de economie." },
      { t: "Spaargeld wordt waardeloos.", bak: "eco" }
    ]
  };

  /* ----- §1.4 filmpje: het fascisme in Italië ----- */
  const FILM_ITALIE = {
    titel: "Italië: van winnaar naar dictatuur",
    intro: "Hoe kwam het **fascisme** op in Italië? Tik op **Afspelen**.",
    teken: "Fascisme in Italië",
    scenes: [
      { beeld: "🇮🇹", jaar: "1918", t: "Italië stond aan de kant van de winnaars. Maar het kreeg minder land dan beloofd. Veel Italianen voelden zich bedrogen." },
      { beeld: "🏚️", jaar: "1919 – 1920", t: "Na de oorlog: veel werklozen, hoge prijzen en stakingen. Arbeiders bezetten fabrieken. Rijke Italianen en de middenklasse waren bang voor een communistische revolutie, zoals in Rusland." },
      { beeld: "👊", t: "Benito Mussolini begon de fascistische partij. Zijn knokploegen, de **zwarthemden**, sloegen stakers en socialisten in elkaar. Hij beloofde orde en een groot, sterk Italië." },
      { beeld: "🚶", jaar: "1922", t: "De **Mars op Rome**. Duizenden fascisten trokken naar Rome. De koning durfde niets te doen. Hij maakte Mussolini premier." },
      { beeld: "🔒", jaar: "1925 – 1926", t: "Mussolini maakte van Italië een **dictatuur**. Andere partijen werden verboden: een **eenpartijstaat**. Kranten mochten alleen schrijven wat hij wilde." },
      { beeld: "📋", t: "Kenmerken van het **fascisme**: extreem nationalisme, één sterke leider, geweld, tegen democratie en tegen communisme. De staat is belangrijker dan het individu." }
    ]
  };

  /* ----- §1.4 plaat: Nederland neutraal ----- */
  const PLAAT_NL = {
    titel: "Waarom bleef Nederland neutraal?",
    icoon: "🇳🇱",
    intro: "Nederland koos geen kant en sloot geen bondgenootschap. Dat heet een **neutraliteitspolitiek**.",
    say: "Waarom bleef Nederland neutraal? Nederland koos geen kant, en sloot geen bondgenootschap. Dat heet een neutraliteitspolitiek.",
    teken: "Nederland neutraal",
    blokken: [
      { kop: "Drie redenen",
        say: "Drie redenen. Eén: Nederland was een klein land met een klein leger. Het kon de grote landen niet aan. Twee: handel. Nederland verdiende veel aan handel met Duitsland en met Groot-Brittannië. Een oorlog met een van de twee kost die handel. Drie: de koloniën. Nederland had Nederlands-Indië, ver weg. Dat kon het zelf niet verdedigen. Neutraal blijven was de beste bescherming.",
        html: `<div class="lonten">
          <div class="lont"><div class="ic">🐭</div><div class="nm">Klein land</div><div class="ex">Een <span class="bl">klein leger</span>. Nederland kon de grote landen niet aan.</div></div>
          <div class="lont"><div class="ic">🚢</div><div class="nm">Handel</div><div class="ex">Veel <span class="bl">handel</span> met Duitsland én Groot-Brittannië. Kies je een kant, dan ben je die handel kwijt.</div></div>
          <div class="lont"><div class="ic">🌴</div><div class="nm">Koloniën</div><div class="ex"><span class="bl">Nederlands-Indië</span> lag ver weg. Dat kon Nederland niet zelf verdedigen.</div></div>
        </div>
        <div class="trick">💡 Ezelsbrug: <b>klein</b>, <b>kopen en verkopen</b>, <b>koloniën</b>. Drie keer K.</div>` },
      { kop: "Neutraal, maar wel last van de oorlog",
        say: "Neutraal, maar wel last van de oorlog. In 1914 riep Nederland toch alle soldaten op, voor het geval dat. Dat is de mobilisatie. Uit België vluchtten honderdduizenden mensen naar Nederland. Er kwam minder voedsel binnen. Eten ging op de bon.",
        html: `<div class="ketting">
          <div>🪖 In 1914 riep Nederland toch alle soldaten op, voor het geval dat: <span class="bl">mobilisatie</span>.</div>
          <div>🏃 Uit België vluchtten honderdduizenden mensen naar Nederland.</div>
          <div>🍞 Er kwam minder voedsel binnen. Eten ging op de bon.</div>
        </div>` }
    ]
  };

  const SORT_14 = {
    titel: "🗺️ Duitsland, Italië of Nederland?",
    uitleg: "Over welk land gaat de zin?",
    bakken: [{ id: "de", naam: "Republiek van Weimar", icoon: "🇩🇪" }, { id: "it", naam: "Italië", icoon: "🇮🇹" }, { id: "nl", naam: "Nederland", icoon: "🇳🇱" }],
    kaarten: [
      { t: "Hyperinflatie: een brood kost miljarden.", bak: "de" },
      { t: "De dolkstootlegende.", bak: "de" },
      { t: "Zwarthemden slaan stakers in elkaar.", bak: "it" },
      { t: "De Mars op Rome.", bak: "it" },
      { t: "Een eenpartijstaat met één sterke leider.", bak: "it" },
      { t: "Koos geen kant in de oorlog.", bak: "nl" },
      { t: "Wilde zijn kolonie in Azië beschermen.", bak: "nl", uitleg: "Nederlands-Indië. Dat was een van de redenen voor de neutraliteitspolitiek." },
      { t: "Moest herstelbetalingen betalen.", bak: "de" },
      { t: "Voelde zich bedrogen: kreeg minder land dan beloofd.", bak: "it" },
      { t: "Ving honderdduizenden Belgische vluchtelingen op.", bak: "nl" }
    ]
  };

  /* ----- Vaardigheid: oorzaken en gevolgen ----- */
  const PLAAT_LAB = {
    titel: "Oorzaken en gevolgen",
    icoon: "🔗",
    intro: "Op de toets moet je oorzaken en gevolgen kunnen **indelen**. Vijf keer een verschil. Eerst een voorbeeld uit de fanwereld, dan uit WO1.",
    say: "Oorzaken en gevolgen. Op de toets moet je oorzaken en gevolgen kunnen indelen. Vijf keer een verschil. Eerst een voorbeeld uit de fanwereld, dan uit de Eerste Wereldoorlog.",
    blokken: [
      { kop: "1 · Aanleiding of indirecte oorzaak",
        say: "Aanleiding of indirecte oorzaak. De aanleiding is de directe oorzaak: de laatste druppel waardoor de emmer overloopt. Een indirecte oorzaak speelde al veel langer: die vulde de emmer. Fanwereld: al weken irritatie in de groepsapp. Dat is een indirecte oorzaak. Dan één gemeen bericht, en de ruzie ontploft. Dat is de aanleiding. De Eerste Wereldoorlog: de moord in Sarajevo is de aanleiding. Nationalisme, imperialisme, militarisme en de bondgenootschappen zijn indirecte oorzaken.",
        html: `<p>De <span class="bl">aanleiding</span> (directe oorzaak) is de laatste druppel. Een <span class="bl">indirecte oorzaak</span> speelde al lang: die vulde de emmer. 🪣</p>
        <div class="pb-rij"><span>💜 Fanwereld</span>Al weken irritatie in de groepsapp (indirect). Dan één gemeen bericht: ruzie (aanleiding).</div>
        <div class="pb-rij"><span>🪖 WO1</span>De moord in Sarajevo (aanleiding). Nationalisme, imperialisme, militarisme, bondgenootschappen (indirect).</div>` },
      { kop: "2 · Bedoeld of onbedoeld gevolg",
        say: "Bedoeld of onbedoeld gevolg. Een bedoeld gevolg is wat iemand wilde bereiken. Een onbedoeld gevolg had niemand gepland. Fanwereld: een groep stopt willekeurige photocards in albums. Bedoeld: fans kopen meer albums. Onbedoeld: stapels ongeopende albums bij het oud papier. De Eerste Wereldoorlog: met het Verdrag van Versailles wilden de winnaars Duitsland zwak maken. Dat was bedoeld. Maar veel Duitsers werden woedend, en gingen extreme partijen steunen. Dat was onbedoeld.",
        html: `<p><span class="bl">Bedoeld</span> = wat iemand wilde bereiken. <span class="bl">Onbedoeld</span> = had niemand gepland.</p>
        <div class="pb-rij"><span>💜 Fanwereld</span>Willekeurige photocards in albums. Bedoeld: fans kopen meer albums. Onbedoeld: stapels albums bij het oud papier.</div>
        <div class="pb-rij"><span>🪖 WO1</span>Verdrag van Versailles. Bedoeld: Duitsland zwak maken. Onbedoeld: woede in Duitsland, steun voor extreme partijen.</div>` },
      { kop: "3 · Direct of indirect gevolg",
        say: "Direct of indirect gevolg. Een direct gevolg komt meteen uit de gebeurtenis zelf. Een indirect gevolg komt via een tussenstap: het is een gevolg van een gevolg. Fanwereld: het concert is uitverkocht. Direct gevolg: de zaal zit vol. Indirect gevolg: alle hotels in de stad zitten vol. De Eerste Wereldoorlog: het Verdrag van Versailles. Direct gevolg: Duitsland moet herstelbetalingen betalen. Indirect gevolg: de hyperinflatie van 1923.",
        html: `<p><span class="bl">Direct gevolg</span> = komt meteen uit de gebeurtenis. <span class="bl">Indirect gevolg</span> = via een tussenstap, een gevolg van een gevolg.</p>
        <div class="pb-rij"><span>💜 Fanwereld</span>Concert uitverkocht → zaal vol (direct) → alle hotels in de stad vol (indirect).</div>
        <div class="pb-rij"><span>🪖 WO1</span>Versailles → herstelbetalingen (direct) → hyperinflatie in 1923 (indirect).</div>` },
      { kop: "4 · Korte of lange termijn",
        say: "Korte of lange termijn. Een gevolg op korte termijn komt meteen, of binnen een paar jaar. Een gevolg op lange termijn komt pas veel later, na tien jaar of meer. Fanwereld: een groep wint een prijs. Korte termijn: de volgende dag trending. Lange termijn: tien jaar later nog steeds wereldberoemd. De Eerste Wereldoorlog: korte termijn: miljoenen doden, keizerrijken vallen. Lange termijn: de woede over Versailles helpt Hitler later aan de macht.",
        html: `<p><span class="bl">Korte termijn</span> = meteen of binnen een paar jaar. <span class="bl">Lange termijn</span> = pas veel later, na tien jaar of meer.</p>
        <div class="pb-rij"><span>💜 Fanwereld</span>Prijs gewonnen → volgende dag trending (kort) → tien jaar later nog steeds wereldberoemd (lang).</div>
        <div class="pb-rij"><span>🪖 WO1</span>Miljoenen doden, keizerrijken vallen (kort). De woede over Versailles helpt Hitler later aan de macht (lang).</div>` },
      { kop: "5 · Vier soorten",
        say: "Vier soorten oorzaken en gevolgen. Politiek-bestuurlijk: over macht, regeringen, wetten, grenzen, oorlog en vrede. Sociaal: over hoe mensen samenleven. Groepen, rijk en arm, de rol van vrouwen. Economisch: over geld, werk, handel en fabrieken. Cultureel: over ideeën, kunst, geloof en hoe mensen denken. Ezelsbrug: P S E C. Plan Snel Een Comeback.",
        html: `<div class="lonten">
          <div class="lont"><div class="ic">🏛️</div><div class="nm bl">politiek-bestuurlijk</div><div class="ex">Macht, regering, wetten, grenzen, oorlog en vrede.</div></div>
          <div class="lont"><div class="ic">👨‍👩‍👧</div><div class="nm bl">sociaal</div><div class="ex">Hoe mensen samenleven: groepen, rijk en arm, de rol van vrouwen.</div></div>
          <div class="lont"><div class="ic">💶</div><div class="nm bl">economisch</div><div class="ex">Geld, werk, handel en fabrieken.</div></div>
          <div class="lont"><div class="ic">🎨</div><div class="nm bl">cultureel</div><div class="ex">Ideeën, kunst, geloof, hoe mensen denken.</div></div>
        </div>
        <div class="trick">💡 Ezelsbrug: <b>P S E C</b> = <b>P</b>lan <b>S</b>nel <b>E</b>en <b>C</b>omeback.</div>` }
    ]
  };

  const LAB = [
    { id: "aanleiding", titel: "🪣 Aanleiding of indirecte oorzaak?", uitleg: "Was het de laatste druppel, of speelde het al langer?",
      bakken: [{ id: "a", naam: "Aanleiding", icoon: "💧", sub: "directe oorzaak" }, { id: "i", naam: "Indirecte oorzaak", icoon: "🪣", sub: "speelde al langer" }],
      kaarten: [
        { t: "WO1 begint. De moord op Frans Ferdinand.", bak: "a" },
        { t: "WO1 begint. Het nationalisme op de Balkan.", bak: "i" },
        { t: "WO1 begint. De wapenwedloop.", bak: "i" },
        { t: "Groot-Brittannië doet mee. Duitsland valt België binnen.", bak: "a", uitleg: "Dat was de directe reden voor de Britten om op 4 augustus 1914 de oorlog te verklaren." },
        { t: "Groot-Brittannië doet mee. Het is al jaren bang voor de Duitse vloot.", bak: "i" },
        { t: "Mussolini wordt premier. De Mars op Rome.", bak: "a" },
        { t: "Mussolini wordt premier. De angst voor een communistische revolutie.", bak: "i" },
        { t: "Mussolini wordt premier. Italianen voelen zich bedrogen na de oorlog.", bak: "i" }
      ] },
    { id: "bedoeld", titel: "🎯 Bedoeld of onbedoeld gevolg?", uitleg: "Wilde iemand dit bereiken, of had niemand het gepland?",
      bakken: [{ id: "b", naam: "Bedoeld", icoon: "🎯" }, { id: "o", naam: "Onbedoeld", icoon: "😬" }],
      kaarten: [
        { t: "Verdrag van Versailles: Duitsland is te zwak voor een nieuwe oorlog.", bak: "b" },
        { t: "Verdrag van Versailles: veel Duitsers zijn woedend en vernederd.", bak: "o" },
        { t: "Schlieffenplan: het Duitse leger trekt snel door België.", bak: "b" },
        { t: "Schlieffenplan: Groot-Brittannië verklaart Duitsland de oorlog.", bak: "o", uitleg: "Duitsland hoopte dat de Britten erbuiten zouden blijven." },
        { t: "Geld bijdrukken: de regering kan haar rekeningen betalen.", bak: "b" },
        { t: "Geld bijdrukken: hyperinflatie, spaargeld wordt waardeloos.", bak: "o" },
        { t: "Bondgenootschappen: vijanden durven niet aan te vallen.", bak: "b" },
        { t: "Bondgenootschappen: een ruzie op de Balkan wordt een wereldoorlog.", bak: "o" }
      ] },
    { id: "direct", titel: "➡️ Direct of indirect gevolg?", uitleg: "Komt het meteen uit de gebeurtenis, of via een tussenstap?",
      bakken: [{ id: "d", naam: "Direct gevolg", icoon: "➡️", sub: "meteen" }, { id: "i", naam: "Indirect gevolg", icoon: "↪️", sub: "via een tussenstap" }],
      kaarten: [
        { t: "Moord in Sarajevo: Oostenrijk-Hongarije stuurt Servië een ultimatum.", bak: "d" },
        { t: "Moord in Sarajevo: Rusland mobiliseert zijn leger.", bak: "i", uitleg: "Rusland reageerde op de oorlog tegen Servië. Dat is een tussenstap." },
        { t: "Verdrag van Versailles: Duitsland moet herstelbetalingen betalen.", bak: "d" },
        { t: "Verdrag van Versailles: hyperinflatie in 1923.", bak: "i", uitleg: "Eerst de herstelbetalingen, toen geld bijdrukken, toen de hyperinflatie." },
        { t: "Hyperinflatie: spaargeld wordt waardeloos.", bak: "d" },
        { t: "Hyperinflatie: mensen verliezen hun vertrouwen in de democratie.", bak: "i" },
        { t: "Duitsland valt België binnen: Belgen vluchten naar Nederland.", bak: "d" },
        { t: "Duitsland valt België binnen: Nederland krijgt minder voedsel en eten gaat op de bon.", bak: "i", uitleg: "De oorlog om Nederland heen maakte de handel en de aanvoer van voedsel moeilijk. Dat is een gevolg via tussenstappen." }
      ] },
    { id: "termijn", titel: "⏳ Korte of lange termijn?", uitleg: "Gevolgen van WO1. Kwam het meteen, of pas veel later?",
      bakken: [{ id: "k", naam: "Korte termijn", icoon: "⚡", sub: "meteen, of binnen een paar jaar" }, { id: "l", naam: "Lange termijn", icoon: "⏳", sub: "tien jaar of meer later" }],
      kaarten: [
        { t: "Ongeveer tien miljoen soldaten zijn gesneuveld.", bak: "k" },
        { t: "Vier keizerrijken vallen uit elkaar.", bak: "k" },
        { t: "Gewonde soldaten komen thuis en vinden geen werk.", bak: "k" },
        { t: "De Duitse keizer vlucht naar Nederland.", bak: "k" },
        { t: "De woede over Versailles helpt Hitler in 1933 aan de macht.", bak: "l" },
        { t: "In 1939 begint de Tweede Wereldoorlog.", bak: "l" },
        { t: "Na de Volkenbond komen in 1945 de Verenigde Naties.", bak: "l" },
        { t: "Ruzie over de nieuwe grenzen van Polen speelt twintig jaar later opnieuw.", bak: "l" }
      ] },
    { id: "psec", titel: "🏛️ Welke soort gevolg?", uitleg: "Gevolgen van WO1. Politiek-bestuurlijk, sociaal, economisch of cultureel?",
      bakken: [{ id: "p", naam: "Politiek-bestuurlijk", icoon: "🏛️" }, { id: "s", naam: "Sociaal", icoon: "👨‍👩‍👧" }, { id: "e", naam: "Economisch", icoon: "💶" }, { id: "c", naam: "Cultureel", icoon: "🎨" }],
      kaarten: [
        { t: "Vier keizerrijken verdwijnen.", bak: "p" },
        { t: "Duitsland wordt een republiek.", bak: "p" },
        { t: "Er komen nieuwe grenzen en nieuwe landen.", bak: "p" },
        { t: "Veel gezinnen moeten verder zonder vader.", bak: "s" },
        { t: "Vrouwen krijgen een andere rol: ze werken buitenshuis.", bak: "s", uitleg: "Het gaat om hoe mensen samenleven en welke rol groepen hebben. Daarom sociaal." },
        { t: "Duitsland moet herstelbetalingen betalen.", bak: "e" },
        { t: "Europese landen hebben grote schulden bij de Verenigde Staten.", bak: "e" },
        { t: "De hyperinflatie in Duitsland.", bak: "e" },
        { t: "Schrijvers en schilders maken somber werk over de oorlog.", bak: "c" },
        { t: "Mensen geloven minder in vooruitgang en techniek.", bak: "c" }
      ] }
  ];

  /* ----- begrippen ----- */
  const BEGRIPPEN = [
    { id: "nationalisme", icoon: "🚩", term: "nationalisme", uitleg: "Je voelt je sterk verbonden met je eigen land of volk. Je vindt dat elk volk een eigen staat moet hebben.", voorbeeld: "Serviërs wilden alle Zuid-Slaven in één eigen land." },
    { id: "imperialisme", icoon: "🌍", term: "imperialisme", uitleg: "Een land probeert macht te krijgen over gebieden buiten het eigen land, zoals koloniën.", voorbeeld: "Duitsland wilde ook koloniën in Afrika, net als Groot-Brittannië en Frankrijk." },
    { id: "militarisme", icoon: "⚔️", term: "militarisme", uitleg: "Het leger is heel belangrijk in een land. Generaals hebben veel macht en oorlog wordt gezien als iets goeds.", voorbeeld: "Rond 1900 waren soldaten in uniform populair en hadden generaals veel invloed." },
    { id: "wapenwedloop", icoon: "🚢", term: "wapenwedloop", uitleg: "Landen proberen elkaar te overtreffen met steeds meer en betere wapens.", voorbeeld: "Duitsland en Groot-Brittannië bouwden om het hardst oorlogsschepen." },
    { id: "bondgenootschap", icoon: "🤝", term: "bondgenootschap", uitleg: "Een afspraak tussen landen om elkaar te helpen als een van hen wordt aangevallen.", voorbeeld: "De Triple Alliantie en de Triple Entente." },
    { id: "alliantie", icoon: "🦅", term: "Triple Alliantie", uitleg: "Bondgenootschap van **Duitsland, Oostenrijk-Hongarije en Italië** (1882).", voorbeeld: "Ezelsbrug: Entente is een Frans woord, dus Frankrijk zit in de Entente. Duitsland zit in het andere kamp." },
    { id: "entente", icoon: "🤝", term: "Triple Entente", uitleg: "Bondgenootschap van **Frankrijk, Rusland en Groot-Brittannië** (1907).", voorbeeld: "Entente is Frans voor 'goede verstandhouding'. Frankrijk zit erin." },
    { id: "aanleiding", icoon: "💧", term: "aanleiding", uitleg: "De **directe oorzaak**: de gebeurtenis waardoor iets op dat moment begint. De laatste druppel.", voorbeeld: "De moord op Frans Ferdinand in Sarajevo (28 juni 1914)." },
    { id: "indirect", icoon: "🪣", term: "indirecte oorzaak", uitleg: "Een oorzaak die al lang speelde en de spanning opbouwde. Hij vulde de emmer.", voorbeeld: "Nationalisme, imperialisme, militarisme en de bondgenootschappen." },
    { id: "ultimatum", icoon: "📜", term: "ultimatum", uitleg: "Een laatste eis met een tijdslimiet. Doe je het niet, dan volgt er iets ergs, zoals oorlog.", voorbeeld: "Oostenrijk-Hongarije stuurde Servië in juli 1914 een ultimatum." },
    { id: "mobilisatie", icoon: "🪖", term: "mobilisatie", uitleg: "Het leger klaarmaken voor oorlog: alle soldaten worden opgeroepen.", voorbeeld: "Rusland mobiliseerde eind juli 1914. Ook neutraal Nederland mobiliseerde." },
    { id: "schlieffen", icoon: "🗺️", term: "Schlieffenplan", uitleg: "Duits plan: eerst snel Frankrijk verslaan via België, daarna alle soldaten naar Rusland.", voorbeeld: "Het mislukte bij de Marne in september 1914." },
    { id: "tweefronten", icoon: "↔️", term: "tweefrontenoorlog", uitleg: "Een oorlog aan twee kanten tegelijk.", voorbeeld: "Duitsland vocht in het westen tegen Frankrijk en Groot-Brittannië, en in het oosten tegen Rusland." },
    { id: "loopgraven", icoon: "⛏️", term: "loopgravenoorlog", uitleg: "Een oorlog waarin de legers zich ingraven in lange greppels. Het front ligt jarenlang bijna stil. Heet ook **stellingenoorlog**.", voorbeeld: "Het westfront van eind 1914 tot 1918." },
    { id: "geallieerden", icoon: "🇫🇷", term: "geallieerden", uitleg: "Het kamp van **Frankrijk, Groot-Brittannië en Rusland**, later ook Italië en de Verenigde Staten.", voorbeeld: "De winnaars van WO1." },
    { id: "centralen", icoon: "🇩🇪", term: "centralen", uitleg: "Het kamp van **Duitsland, Oostenrijk-Hongarije**, het Ottomaanse Rijk en Bulgarije. Ze lagen midden in Europa. Heet ook **centrale mogendheden**.", voorbeeld: "De verliezers van WO1." },
    { id: "totaal", icoon: "🏭", term: "totale oorlog", uitleg: "Een oorlog waarin de hele samenleving meedoet: leger, economie en burgers. Ook burgers worden doelwit.", voorbeeld: "Fabrieken maakten wapens, vrouwen werkten in fabrieken, eten ging op de bon." },
    { id: "propaganda", icoon: "📢", term: "propaganda", uitleg: "Eenzijdige informatie om mensen te laten denken en doen wat de regering wil.", voorbeeld: "Posters die jongens opriepen om soldaat te worden." },
    { id: "wapenstilstand", icoon: "🕊️", term: "wapenstilstand", uitleg: "Afspraak om te stoppen met vechten. Nog geen vrede.", voorbeeld: "11 november 1918." },
    { id: "versailles", icoon: "✍️", term: "Verdrag van Versailles", uitleg: "Het vredesverdrag met Duitsland (1919). Duitsland kreeg de schuld, moest betalen, verloor land en koloniën en mocht maar een klein leger hebben.", voorbeeld: "Veel Duitsers noemden het een vernedering." },
    { id: "herstel", icoon: "💰", term: "herstelbetalingen", uitleg: "Geld dat Duitsland moest betalen voor de schade van de oorlog.", voorbeeld: "Vooral aan Frankrijk en België." },
    { id: "volkenbond", icoon: "🌐", term: "Volkenbond", uitleg: "Organisatie van landen (vanaf 1920) die samen nieuwe oorlogen moest voorkomen.", voorbeeld: "Een voorloper van de Verenigde Naties." },
    { id: "weimar", icoon: "🏛️", term: "Republiek van Weimar", uitleg: "De democratische republiek in Duitsland van 1919 tot 1933. Genoemd naar de stad waar de grondwet werd gemaakt.", voorbeeld: "Had politieke én economische problemen." },
    { id: "dolkstoot", icoon: "🗡️", term: "dolkstootlegende", uitleg: "Het verzonnen verhaal dat het Duitse leger niet verslagen was, maar in de rug gestoken door politici thuis.", voorbeeld: "Het maakte de nieuwe republiek zwak." },
    { id: "hyperinflatie", icoon: "📈", term: "hyperinflatie", uitleg: "Prijzen stijgen extreem snel. Het geld wordt bijna waardeloos.", voorbeeld: "Duitsland 1923: een brood kostte miljarden marken." },
    { id: "fascisme", icoon: "👊", term: "fascisme", uitleg: "Extreem nationalistisch idee: één sterke leider, geweld, tegen democratie en communisme. De staat is belangrijker dan het individu.", voorbeeld: "Italië onder Mussolini." },
    { id: "mars", icoon: "🚶", term: "Mars op Rome", uitleg: "In 1922 trokken duizenden fascisten naar Rome. De koning maakte Mussolini daarna premier.", voorbeeld: "De aanleiding voor de machtsovername van Mussolini." },
    { id: "dictatuur", icoon: "🔒", term: "dictatuur", uitleg: "Eén persoon of één partij heeft alle macht. Er is geen vrijheid van meningsuiting.", voorbeeld: "Italië vanaf 1925." },
    { id: "eenpartij", icoon: "1️⃣", term: "eenpartijstaat", uitleg: "Een land waar maar één politieke partij is toegestaan.", voorbeeld: "In Italië mocht na 1926 alleen de fascistische partij bestaan." },
    { id: "neutraliteit", icoon: "🇳🇱", term: "neutraliteitspolitiek", uitleg: "Geen kant kiezen in conflicten en geen bondgenootschappen sluiten.", voorbeeld: "Nederland: klein leger, veel handel, koloniën beschermen." },
    { id: "bedoeld", icoon: "🎯", term: "bedoeld en onbedoeld gevolg", uitleg: "**Bedoeld**: wat iemand wilde bereiken. **Onbedoeld**: had niemand gepland.", voorbeeld: "Versailles: Duitsland zwak (bedoeld), woede in Duitsland (onbedoeld)." },
    { id: "directgevolg", icoon: "↪️", term: "direct en indirect gevolg", uitleg: "**Direct**: komt meteen uit de gebeurtenis. **Indirect**: via een tussenstap, een gevolg van een gevolg.", voorbeeld: "Versailles → herstelbetalingen (direct) → hyperinflatie (indirect)." },
    { id: "termijn", icoon: "⏳", term: "korte en lange termijn", uitleg: "**Korte termijn**: meteen of binnen een paar jaar. **Lange termijn**: pas veel later.", voorbeeld: "Miljoenen doden (kort). Woede over Versailles helpt Hitler aan de macht (lang)." },
    { id: "psec", icoon: "🏛️", term: "politiek-bestuurlijk, sociaal, economisch, cultureel", uitleg: "Vier soorten oorzaken en gevolgen. **Politiek-bestuurlijk**: macht en regering. **Sociaal**: hoe mensen samenleven. **Economisch**: geld en werk. **Cultureel**: ideeën en kunst.", voorbeeld: "Ezelsbrug PSEC: Plan Snel Een Comeback." }
  ];

  /* ----- toetsvragen ----- */
  const VRAGEN = [
    { id: "t1", par: "Tijd", type: "keuze", vraag: "Welke volgorde klopt?", keuzes: ["Triple Alliantie → moord in Sarajevo → Verdrag van Versailles → Mars op Rome", "Moord in Sarajevo → Triple Alliantie → Mars op Rome → Verdrag van Versailles", "Triple Alliantie → Verdrag van Versailles → moord in Sarajevo → Mars op Rome", "Mars op Rome → Triple Alliantie → moord in Sarajevo → Verdrag van Versailles"], goed: 0, uitleg: "1882 → 1914 → 1919 → 1922." },
    { id: "t2", par: "Tijd", type: "noem", vraag: "Zet in de goede volgorde: hyperinflatie in Duitsland, wapenstilstand, Triple Entente, Duitsland valt België binnen.", antwoord: "Triple Entente (1907) → Duitsland valt België binnen (1914) → wapenstilstand (1918) → hyperinflatie (1923).", punten: ["Triple Entente eerst", "Hyperinflatie als laatste"] },
    { id: "v1", par: "§1.2", type: "noem", vraag: "Noem de drie landen van de Triple Alliantie en de drie landen van de Triple Entente.", antwoord: "Triple Alliantie: Duitsland, Oostenrijk-Hongarije, Italië. Triple Entente: Frankrijk, Rusland, Groot-Brittannië.", punten: ["Alliantie: Duitsland, Oostenrijk-Hongarije, Italië", "Entente: Frankrijk, Rusland, Groot-Brittannië"] },
    { id: "v2", par: "§1.2", type: "uitleg", vraag: "Leg uit waarom er rond 1900 een systeem van bondgenootschappen in Europa was.", antwoord: "Landen voelden zich **bedreigd**, bijvoorbeeld Frankrijk en Rusland door het sterke Duitsland. **Samen** sta je sterker, **dus** durft een vijand minder snel aan te vallen.", punten: ["Landen voelden zich bedreigd", "Samen sterker / afschrikken"] },
    { id: "v3", par: "§1.2", type: "uitleg", vraag: "Leg uit waarom de bondgenootschappen de kans op een grote oorlog groter maakten.", antwoord: "Landen hadden beloofd elkaar te helpen. **Daardoor** sleepte een ruzie tussen twee landen meteen alle bondgenoten mee, als dominostenen.", punten: ["Beloofd elkaar te helpen", "Kleine ruzie → alle bondgenoten doen mee"] },
    { id: "v4", par: "§1.2", type: "uitleg", vraag: "Leg het verband uit tussen nationalisme en de situatie op de Balkan rond 1900.", antwoord: "Het Ottomaanse Rijk werd zwakker. Volken op de Balkan wilden een **eigen staat** (nationalisme). Servië wilde alle Zuid-Slaven in één land, **maar** veel Slaven woonden in Oostenrijk-Hongarije. Rusland steunde Servië. **Daardoor** liep de spanning hoog op.", punten: ["Volken willen een eigen staat", "Servië tegen Oostenrijk-Hongarije", "Rusland steunt Servië"] },
    { id: "v5", par: "§1.2", type: "keuze", vraag: "Duitsland en Groot-Brittannië bouwen steeds meer oorlogsschepen. Welk begrip past hierbij?", keuzes: ["wapenwedloop", "imperialisme", "nationalisme", "bondgenootschap"], goed: 0, uitleg: "Elkaar overtreffen met wapens heet een wapenwedloop. Dat hoort bij militarisme." },
    { id: "v6", par: "§1.2", type: "uitleg", vraag: "Leg uit waarom Frankrijk rond 1900 vijandig was tegenover Duitsland.", antwoord: "Frankrijk had in 1871 de oorlog tegen Duitsland verloren, **en daarbij** Elzas-Lotharingen. Frankrijk wilde dat gebied terug.", punten: ["Verloren in 1871", "Elzas-Lotharingen terug"] },
    { id: "v7", par: "§1.2", type: "keuze", vraag: "Europese landen strijden om koloniën en grondstoffen in Afrika. Welk begrip past hierbij?", keuzes: ["militarisme", "imperialisme", "nationalisme", "neutraliteitspolitiek"], goed: 1, uitleg: "Macht zoeken buiten je eigen land, zoals koloniën: imperialisme." },
    { id: "v8", par: "§1.3", type: "uitleg", vraag: "Leg uit wat het verschil is tussen de aanleiding en een indirecte oorzaak van WO1. Geef van beide een voorbeeld.", antwoord: "De **aanleiding** is de directe oorzaak waardoor de oorlog op dat moment begon: de moord in Sarajevo. Een **indirecte oorzaak** speelde al langer en bouwde de spanning op, bijvoorbeeld nationalisme of de wapenwedloop.", punten: ["Aanleiding = directe oorzaak, moord in Sarajevo", "Indirect = speelde al langer, met voorbeeld"] },
    { id: "v9", par: "§1.3", type: "noem", vraag: "Noem drie indirecte oorzaken van de Eerste Wereldoorlog.", antwoord: "Drie van: nationalisme · imperialisme · militarisme (wapenwedloop) · bondgenootschappen.", punten: ["Je hebt er **drie** genoemd"] },
    { id: "v10", par: "§1.3", type: "uitleg", vraag: "Leg uit waarom Duitsland met het Schlieffenplan door België trok.", antwoord: "Duitsland wilde **eerst snel Frankrijk verslaan** en daarna tegen Rusland vechten, **om** een tweefrontenoorlog te voorkomen. Via België was de snelste weg naar Parijs.", punten: ["Snel Frankrijk verslaan", "Tweefrontenoorlog voorkomen"] },
    { id: "v11", par: "§1.3", type: "uitleg", vraag: "Leg uit waarom de oorlog in het westen een loopgravenoorlog werd.", antwoord: "Het Schlieffenplan **mislukte** bij de Marne (1914). **Daarna** groeven beide legers zich in. Geen van beide kon doorbreken, **dus** zat het front jarenlang vast.", punten: ["Plan mislukt bij de Marne", "Legers graven zich in, front zit vast"] },
    { id: "v12", par: "§1.3", type: "uitleg", vraag: "Leg uit dat de Eerste Wereldoorlog een totale oorlog was. Geef twee voorbeelden.", antwoord: "De **hele samenleving** deed mee, niet alleen het leger. Bijvoorbeeld: fabrieken maakten wapens · vrouwen namen het werk van mannen over · eten ging op de bon · propaganda · burgers werden doelwit.", punten: ["Hele samenleving doet mee", "Twee voorbeelden"] },
    { id: "v13", par: "§1.3", type: "keuze", vraag: "Wat is een tweefrontenoorlog?", keuzes: ["Een oorlog tussen twee landen", "Een oorlog aan twee kanten tegelijk", "Een oorlog in twee loopgraven", "Een oorlog die twee keer begint"], goed: 1, uitleg: "Duitsland moest vechten in het westen (Frankrijk) én in het oosten (Rusland)." },
    { id: "v14", par: "§1.3", type: "noem", vraag: "Noem drie regels uit het Verdrag van Versailles voor Duitsland.", antwoord: "Drie van: Duitsland krijgt de schuld · herstelbetalingen · land kwijt (bijvoorbeeld Elzas-Lotharingen) · alle koloniën kwijt · klein leger.", punten: ["Je hebt er **drie** genoemd"] },
    { id: "v15", par: "§1.3", type: "noem", vraag: "Noem twee gevolgen van WO1 voor Europa.", antwoord: "Twee van: miljoenen doden · vier keizerrijken verdwijnen · nieuwe landen (zoals Polen) · de Volkenbond · grote schulden.", punten: ["Je hebt er **twee** genoemd", "Voor Europa, niet alleen Duitsland"] },
    { id: "v16", par: "§1.3", type: "keuze", vraag: "Welke landen hoorden bij de centralen?", keuzes: ["Frankrijk en Rusland", "Duitsland en Oostenrijk-Hongarije", "Groot-Brittannië en de Verenigde Staten", "Italië en Frankrijk"], goed: 1, uitleg: "De centralen lagen midden in Europa: Duitsland en Oostenrijk-Hongarije (met het Ottomaanse Rijk en Bulgarije)." },
    { id: "v17", par: "§1.4", type: "uitleg", vraag: "Leg uit waarom de Republiek van Weimar grote politieke problemen had. Noem er twee.", antwoord: "Twee van: veel partijen, geen meerderheid, **dus** regeringen vielen steeds · extremisten links en rechts wilden met geweld de macht · de republiek kreeg de schuld van Versailles · de dolkstootlegende.", punten: ["Twee politieke problemen", "Met omdat/dus erbij"] },
    { id: "v18", par: "§1.4", type: "uitleg", vraag: "Leg uit hoe de hyperinflatie van 1923 ontstond.", antwoord: "Duitsland moest **herstelbetalingen** betalen en de Ruhr werd bezet. De regering **drukte steeds meer geld bij**. **Daardoor** werd het geld waardeloos.", punten: ["Herstelbetalingen / Ruhrbezetting", "Geld bijdrukken → waardeloos"] },
    { id: "v19", par: "§1.4", type: "uitleg", vraag: "Leg uit wat de dolkstootlegende is en waarom die slecht was voor de republiek.", antwoord: "Het verhaal dat het leger niet verslagen was, **maar** in de rug was gestoken door politici thuis. **Daardoor** kregen de democratische politici de schuld en vertrouwden mensen de republiek niet.", punten: ["Leger 'in de rug gestoken'", "Republiek krijgt de schuld"] },
    { id: "v20", par: "§1.4", type: "uitleg", vraag: "Beschrijf hoe in Italië het fascisme opkwam.", antwoord: "Italianen voelden zich **bedrogen** na de oorlog. Er was **werkloosheid** en **angst voor communisme**. Mussolini beloofde orde; zijn zwarthemden gebruikten geweld. Na de **Mars op Rome** (1922) werd hij premier en later dictator.", punten: ["Ontevreden en bang voor communisme", "Mars op Rome 1922", "Dictatuur"] },
    { id: "v21", par: "§1.4", type: "noem", vraag: "Noem drie kenmerken van het fascisme.", antwoord: "Drie van: extreem nationalisme · één sterke leider · geweld · tegen democratie · tegen communisme · de staat boven het individu · één partij.", punten: ["Je hebt er **drie** genoemd"] },
    { id: "v22", par: "§1.4", type: "uitleg", vraag: "Leg uit waarom Nederland begin twintigste eeuw een neutraliteitspolitiek voerde. Geef twee redenen.", antwoord: "Twee van: Nederland was **klein** met een klein leger · Nederland **handelde** veel met Duitsland én Groot-Brittannië · Nederland wilde zijn **koloniën** (Nederlands-Indië) beschermen.", punten: ["Twee redenen", "Klein / handel / koloniën"] },
    { id: "v23", par: "§1.4", type: "keuze", vraag: "Wat gebeurde er bij de Mars op Rome (1922)?", keuzes: ["Italiaanse soldaten vielen Oostenrijk aan", "Fascisten trokken naar Rome en Mussolini werd premier", "De koning van Italië vluchtte naar Nederland", "Italië trad toe tot de Triple Entente"], goed: 1, uitleg: "De koning durfde niets te doen en maakte Mussolini premier." },
    { id: "w1", par: "Vaardigheid", type: "keuze", vraag: "Door het Verdrag van Versailles moest Duitsland herstelbetalingen betalen. Daardoor kwam er later hyperinflatie. Wat is de hyperinflatie voor gevolg van het verdrag?", keuzes: ["Een direct gevolg", "Een indirect gevolg", "Een bedoeld gevolg", "De aanleiding"], goed: 1, uitleg: "Er zit een tussenstap tussen: eerst de herstelbetalingen, dan de hyperinflatie." },
    { id: "w2", par: "Vaardigheid", type: "keuze", vraag: "De winnaars wilden Duitsland zwak maken. Maar veel Duitsers werden er woedend door. Wat is die woede?", keuzes: ["Een bedoeld gevolg", "Een onbedoeld gevolg", "Een indirecte oorzaak", "Een gevolg op korte termijn"], goed: 1, uitleg: "De woede was niet de bedoeling van de makers van het verdrag." },
    { id: "w3", par: "Vaardigheid", type: "keuze", vraag: "Na de oorlog maakten kunstenaars veel sombere schilderijen. Wat voor soort gevolg is dat?", keuzes: ["politiek-bestuurlijk", "sociaal", "economisch", "cultureel"], goed: 3, uitleg: "Kunst en ideeën horen bij cultureel." },
    { id: "w4", par: "Vaardigheid", type: "keuze", vraag: "Vier keizerrijken verdwijnen na WO1. Wat voor soort gevolg is dat?", keuzes: ["politiek-bestuurlijk", "sociaal", "economisch", "cultureel"], goed: 0, uitleg: "Het gaat over macht en wie er regeert." },
    { id: "w5", par: "Vaardigheid", type: "uitleg", vraag: "Leg uit wat het verschil is tussen een gevolg op korte en op lange termijn. Geef bij WO1 van allebei een voorbeeld.", antwoord: "**Korte termijn**: meteen of binnen een paar jaar, bijvoorbeeld miljoenen doden of keizerrijken die vallen. **Lange termijn**: pas veel later, bijvoorbeeld de woede over Versailles die Hitler later aan de macht helpt.", punten: ["Verschil in tijd uitgelegd", "Van allebei een voorbeeld"] },
    { id: "w6", par: "Vaardigheid", type: "uitleg", vraag: "Leg uit wat het verschil is tussen een direct en een indirect gevolg.", antwoord: "Een **direct** gevolg komt meteen uit de gebeurtenis zelf. Een **indirect** gevolg komt via een tussenstap: het is een gevolg van een gevolg.", punten: ["Direct = meteen", "Indirect = via een tussenstap"] }
  ];

  /* ----- uit je hoofd ----- */
  const MODEL = {
    lonten: `<div class="mp-4"><div>🧨 Europa rond 1900 = kruitvat</div><div>🚩 Nationalisme</div><div>🌍 Imperialisme</div><div>⚔️ Militarisme (wapenwedloop)</div><div>🤝 Bondgenootschappen</div><div>⚡ Vonk: moord in Sarajevo, 1914</div></div>`,
    kampen: `<div class="mp-kamp"><div><b>Triple Alliantie</b><br>Duitsland<br>Oostenrijk-Hongarije<br>Italië</div><div><b>Triple Entente</b><br>Frankrijk<br>Rusland<br>Groot-Brittannië</div></div>`,
    ketting: `<div class="mp-ketting"><div>1 Moord in Sarajevo (28 juni 1914)</div><div>2 Ultimatum, oorlog tegen Servië</div><div>3 Rusland mobiliseert</div><div>4 Duitsland verklaart Rusland en Frankrijk de oorlog</div><div>5 Schlieffenplan: door België</div><div>6 Groot-Brittannië doet mee</div></div>`,
    versailles: `<div class="mp-4"><div>✍️ Verdrag van Versailles (1919)</div><div>Duitsland krijgt de schuld</div><div>Herstelbetalingen</div><div>Land kwijt (Elzas-Lotharingen e.a.)</div><div>Alle koloniën kwijt</div><div>Klein leger</div></div>`,
    weimar: `<div class="mp-kamp"><div><b>🗳️ Politiek</b><br>veel partijen, geen meerderheid<br>extremisten links en rechts<br>schuld van Versailles<br>dolkstootlegende</div><div><b>💸 Economisch</b><br>herstelbetalingen<br>Ruhr bezet (1923)<br>hyperinflatie (1923)<br>spaargeld weg</div></div>`,
    soorten: `<div class="mp-4"><div>Aanleiding ↔ indirecte oorzaak</div><div>Bedoeld ↔ onbedoeld gevolg</div><div>Direct ↔ indirect gevolg</div><div>Korte ↔ lange termijn</div><div>P S E C: politiek-bestuurlijk, sociaal, economisch, cultureel</div></div>`
  };
  const GEHEUGEN = [
    { id: "lonten", icoon: "🧨", titel: "Het kruitvat met vier lonten", opdracht: "Teken een kruitvat. Teken vier lonten en schrijf bij elke lont een oorzaak. Wat is de vonk?", model: MODEL.lonten, check: ["Nationalisme", "Imperialisme", "Militarisme", "Bondgenootschappen", "De vonk: moord in Sarajevo"] },
    { id: "kampen", icoon: "🤝", titel: "De twee kampen", opdracht: "Teken twee groepen. Welke landen horen in de Triple Alliantie, welke in de Triple Entente?", model: MODEL.kampen, check: ["Duitsland, Oostenrijk-Hongarije, Italië", "Frankrijk, Rusland, Groot-Brittannië", "De goede namen erboven"] },
    { id: "ketting", icoon: "⛓️", titel: "De kettingreactie van 1914", opdracht: "Teken dominostenen. Hoe ging het van één schot naar een wereldoorlog?", model: MODEL.ketting, check: ["Moord in Sarajevo", "Ultimatum aan Servië", "Rusland mobiliseert", "Schlieffenplan door België", "Groot-Brittannië doet mee"] },
    { id: "versailles", icoon: "✍️", titel: "Het Verdrag van Versailles", opdracht: "Teken het verdrag. Wat moest Duitsland allemaal?", model: MODEL.versailles, check: ["Schuld van de oorlog", "Herstelbetalingen", "Land en koloniën kwijt", "Klein leger"] },
    { id: "weimar", icoon: "🏛️", titel: "De problemen van Weimar", opdracht: "Teken twee kolommen: politiek en economisch. Welke problemen had de Republiek van Weimar?", model: MODEL.weimar, check: ["Minstens twee politieke problemen", "Herstelbetalingen", "Hyperinflatie 1923"] },
    { id: "soorten", icoon: "🔗", titel: "Soorten oorzaken en gevolgen", opdracht: "Schrijf de vijf verschillen op, met bij elk een voorbeeld uit WO1.", model: MODEL.soorten, check: ["Aanleiding en indirecte oorzaak", "Bedoeld en onbedoeld", "Direct en indirect", "Korte en lange termijn", "PSEC"] }
  ];

  const IDS = { kaarten: BEGRIPPEN.map(b => b.id), vragen: VRAGEN.map(v => v.id) };
  const STATIONS = [
    { par: "", titel: "Op volgorde van tijd", icoon: "🕰️", delen: ["tijdlijn"] },
    { par: "§1.2", titel: "Spanningen in Europa", icoon: "🧨", delen: ["kruitvat", "kampen"] },
    { par: "§1.3", titel: "De Eerste Wereldoorlog", icoon: "🪖", delen: ["oorlog", "oorzaken"] },
    { par: "§1.4", titel: "Europa na de oorlog", icoon: "🏛️", delen: ["weimar", "italie", "nederland"] },
    { par: "", titel: "Vaardigheid: oorzaken en gevolgen", icoon: "🔗", delen: ["lab"] }
  ];
  const NAMEN = { tijdlijn: "🕰️ Tijdlijn", kruitvat: "🧨 Het kruitvat", kampen: "🔀 Sorteren", oorlog: "🎬 Filmpje", oorzaken: "🔀 Oorzaak of gevolg", weimar: "💬 Weimar", italie: "🎬 Italië", nederland: "🇳🇱 Nederland", lab: "🔗 Oorzaak-lab", begrippen: "🃏 Begrippen", geheugen: "🧠 Uit je hoofd", toets: "📝 Toetstraining" };

  /* ================= ONDERDELEN ================= */
  const volgendeKnop = (na, id, tekst) => {
    if (!na) return;
    na.innerHTML = `<div class="card volgende"><b>Goed bezig! 🎉</b> ${tekst || ""}<div class="row" style="margin-top:10px"><button class="btn" id="vk">${NAMEN[id]} →</button><button class="btn ghost" id="vo">🗺️ Overzicht</button></div></div>`;
    $("#vk", na).onclick = () => App.go(MOD + "-" + id);
    $("#vo", na).onclick = () => App.go(MOD + "-overzicht");
  };
  const na = el => { const d = document.createElement("div"); el.appendChild(d); return d; };

  const overzicht = el => L.overzicht(el, {
    mod: MOD, titel: "Geschiedenis H1 · De Eerste Wereldoorlog", spreekTitel: "Geschiedenis hoofdstuk één. De Eerste Wereldoorlog.",
    IDS, STATIONS, NAMEN, GEHEUGEN,
    waarom: [
      "<b>Ophalen uit je geheugen</b> (tijdlijn, sorteren, kaarten, uit je hoofd tekenen, toetsvragen) leert meer dan herlezen.",
      "<b>Gespreid herhalen:</b> kaarten en vragen komen terug na 1, 2, 4 en 7 dagen, en altijd nog vóór de toets.",
      "<b>Door elkaar oefenen</b> in de toetstraining: lastiger, maar je leert kiezen welke aanpak een vraag nodig heeft.",
      "<b>Oorzaak en gevolg als vaardigheid:</b> steeds hetzelfde soort keuze maken (sorteren), met uitleg bij elke fout.",
      "<b>Beeld én woord, korte stukjes, voorlezen:</b> minder leesdruk, meer begrip.",
      "<b>Voorbeelden uit haar eigen wereld</b> alleen bij de vaardigheid, om het verschil te snappen. De oorlog zelf blijft serieus.",
      "<b>Toetstaal oefenen:</b> 'noem', 'leg uit', 'beschrijf' worden gemarkeerd en uitgelegd."
    ]
  });

  const tijdlijn = el => L.tijdlijn(el, TIJDLIJN, n => { V.klaar("tijdlijn"); volgendeKnop(n, "kruitvat", "Volgende stop: Europa rond 1900."); });

  const kruitvat = el => { L.plaat(el, PLAAT12); V.klaar("kruitvat"); volgendeKnop(na(el), "kampen", "Bekeken? Test jezelf met sorteren."); };

  function kampen(el) {
    el.innerHTML = `<div id="a"></div><div id="b"></div>`;
    L.sorteer($("#a", el), SORT_KAMP, n => {
      n.innerHTML = `<button class="btn" id="nb">Nu de vier lonten →</button>`;
      $("#nb", n).onclick = () => { $("#a", el).innerHTML = ""; L.sorteer($("#b", el), SORT_LONT, n2 => { V.klaar("kampen"); volgendeKnop(n2, "oorlog", "Volgende stop: de oorlog zelf."); }); };
    });
  }

  const oorlog = el => { const r = L.filmpje(el, FILM13, () => V.klaar("oorlog")); volgendeKnop(na(el), "oorzaken", "Nu jij: oorzaak of gevolg?"); return r; };

  const oorzaken = el => L.sorteer(el, SORT_OORZAAK, n => { V.klaar("oorzaken"); volgendeKnop(n, "weimar", "Volgende stop: Duitsland na de oorlog."); });

  function weimar(el) {
    return L.chat(el, CHAT, n => {
      const s = document.createElement("div"); n.appendChild(s);
      L.sorteer(s, SORT_WEIMAR, n2 => { V.klaar("weimar"); volgendeKnop(n2, "italie", "Volgende stop: Italië."); });
      s.scrollIntoView({ behavior: "smooth" });
    });
  }

  const italie = el => { const r = L.filmpje(el, FILM_ITALIE, () => V.klaar("italie")); volgendeKnop(na(el), "nederland", "Volgende stop: Nederland."); return r; };

  function nederland(el) {
    L.plaat(el, PLAAT_NL);
    const s = na(el);
    s.innerHTML = `<button class="btn" id="go">🔀 Nu jij: Duitsland, Italië of Nederland?</button>`;
    $("#go", s).onclick = () => { L.sorteer(s, SORT_14, n => { V.klaar("nederland"); volgendeKnop(n, "lab", "Laatste stop: oorzaken en gevolgen."); }); s.scrollIntoView({ behavior: "smooth" }); };
  }

  function lab(el) {
    const gedaan = () => V.get().lab || {};
    function menu() {
      L.plaat(el, PLAAT_LAB);
      const m = na(el), g = gedaan();
      m.innerHTML = `<div class="card"><h2>🔀 Nu jij: vijf sorteerrondes</h2>
        <button class="say" data-say="Nu jij. Vijf sorteerrondes. Kies er een. Elke ronde oefent één verschil.">🔊 Lees voor</button>
        <div class="lab-menu">${LAB.map(r => `<button class="btn ghost" data-lab="${r.id}" style="text-align:left">${esc(r.titel)}${g[r.id] ? " ✓" : ""}</button>`).join("")}</div></div>`;
      App.bindSay(m);
      $$("[data-lab]", m).forEach(b => b.onclick = () => ronde(LAB.find(r => r.id === b.dataset.lab)));
    }
    function ronde(r) {
      el.innerHTML = `<button class="btn ghost small" id="terug" style="margin-bottom:12px">← Alle rondes</button><div id="s"></div>`;
      $("#terug", el).onclick = menu;
      L.sorteer($("#s", el), r, n => {
        V.update(v => { v.lab = v.lab || {}; v.lab[r.id] = Date.now(); });
        if (LAB.every(x => gedaan()[x.id])) V.klaar("lab");
        const volgende = LAB.find(x => !gedaan()[x.id]);
        n.innerHTML = `<div class="row" style="margin-top:10px">${volgende ? `<button class="btn" id="vr">${esc(volgende.titel)} →</button>` : ""}<button class="btn ghost" id="al">← Alle rondes</button></div>`;
        if (volgende) $("#vr", n).onclick = () => ronde(volgende);
        $("#al", n).onclick = menu;
      });
      el.scrollIntoView({ behavior: "smooth" });
    }
    menu();
  }

  const begrippen = el => L.kaarten(el, MOD, BEGRIPPEN);
  const geheugen = el => L.geheugen(el, MOD, GEHEUGEN);
  const toetsDeel = el => L.toets(el, MOD, VRAGEN);

  App.addModule({
    id: MOD,
    vak: "Geschiedenis",
    titel: "H1 De Eerste Wereldoorlog",
    sub: "Van kruitvat tot Weimar, plus oorzaken en gevolgen.",
    icoon: "🪖",
    thuis: ["overzicht"],
    meten: ["tijdlijn", "kruitvat", "kampen", "oorlog", "oorzaken", "weimar", "italie", "nederland", "lab"],
    status() {
      const v = V.get(), d = v.toets ? Math.ceil((v.toets - Date.now()) / DAG) : null;
      const k = V.teDoen("kaarten", IDS.kaarten, 6).length, q = V.teDoen("vragen", IDS.vragen, 8).length;
      return `${d != null && d >= 0 ? `📅 Toets ${d === 0 ? "vandaag" : d === 1 ? "morgen" : "over " + d + " dagen"} · ` : ""}🔦 ${Math.round(V.beheersing(IDS) * 100)}% opgeladen · vandaag ${k} kaarten, ${Math.min(q, 8)} vragen`;
    },
    onderdelen: [
      { id: "overzicht", naam: "Overzicht", thuisNaam: "Start hier", icoon: "🗺️", groep: "", render: overzicht },
      { id: "tijdlijn", naam: "Tijdlijn", icoon: "🕰️", groep: "Leren", render: tijdlijn },
      { id: "kruitvat", naam: "Kruitvat", icoon: "🧨", groep: "Leren", render: kruitvat },
      { id: "kampen", naam: "Sorteren", icoon: "🔀", groep: "Leren", render: kampen },
      { id: "oorlog", naam: "Filmpje", icoon: "🎬", groep: "Leren", render: oorlog },
      { id: "oorzaken", naam: "Oorzaak of gevolg", icoon: "🔎", groep: "Leren", render: oorzaken },
      { id: "weimar", naam: "Weimar", icoon: "💬", groep: "Leren", render: weimar },
      { id: "italie", naam: "Italië", icoon: "🎬", groep: "Leren", render: italie },
      { id: "nederland", naam: "Nederland", icoon: "🇳🇱", groep: "Leren", render: nederland },
      { id: "lab", naam: "Oorzaak-lab", icoon: "🔗", groep: "Leren", render: lab },
      { id: "begrippen", naam: "Begrippen", icoon: "🃏", groep: "Oefenen", render: begrippen },
      { id: "geheugen", naam: "Uit je hoofd", icoon: "🧠", groep: "Oefenen", render: geheugen },
      { id: "toets", naam: "Toetstraining", icoon: "📝", groep: "Oefenen", render: toetsDeel }
    ]
  });
})();
