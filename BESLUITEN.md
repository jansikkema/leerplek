# Besluiten

Waarom de app is zoals hij is. Per besluit: wat we hebben besloten en waarom.
Nieuw besluit of een besluit terugdraaien? Zet het hier, met de datum, en laat het oude staan (doorgestreept) met de reden.

Let op: deze repository is openbaar. Hier staan geen persoonlijke gegevens, cijfers of resultaten.

---

## 1. Een app zonder AI
**Wat:** de app bevat geen chatbot en roept geen AI-dienst aan. Claude bouwt de app (via vader), maar de leerling gebruikt Claude zelf niet.
**Waarom:** Claude is pas vanaf 18 jaar. Daarnaast past het bij de didactiek: de app maakt materiaal en stelt vragen, de leerling denkt zelf. Een AI in de app zou dat denkwerk overnemen.

## 2. Openbare site op GitHub Pages, met strenge privacyregels
**Wat:** de app is een statische site op GitHub Pages, zonder server, zonder account en zonder buildstap. Repository en site zijn openbaar.
**Waarom:** gratis, geen beheer, en installeerbaar op de iPad via "Zet op beginscherm". Omdat alles openbaar is, gelden de regels uit CLAUDE.md: geen naam, foto's, tekeningen, cijfers of resultaten in de repository; geen gescande pagina's of letterlijke tekst uit lesboeken; geen afbeeldingen, logo's of songteksten van artiesten. `robots: noindex` houdt de site uit zoekmachines (dat is geen beveiliging, alleen minder vindbaar).

## 3. Opslag alleen op de iPad, met een wekelijkse back-up naar iCloud
**Wat:** tekeningen, aantekeningen, ideeën en voortgang staan alleen op de iPad (IndexedDB en localStorage). Via 'Mijn app' maakt ze een back-upbestand en bewaart dat met het deelmenu in Bestanden → iCloud Drive. Na 7 dagen zonder back-up verschijnt een herinnering op het beginscherm. Terugzetten voegt samen: het nieuwste wint, niets wordt overschreven.
**Waarom:** zonder server komt er niets persoonlijks buiten de iPad. Nadeel: Safari kan opslag van websites wissen, en een nieuwe iPad begint leeg. De wekelijkse back-up vangt dat op. Samenvoegen in plaats van vervangen voorkomt dat een oude back-up nieuw werk wist.

## 4. Toetstraining zonder punten en zonder tijd
**Wat:** de toetstraining geeft geen cijfer, geen score en geen klok. Na elke vraag kiest ze zelf: 😕 nog niet, 🤔 bijna of 😎 ken ik. Voortgang is zichtbaar als een lightstick die oplaadt.
**Waarom:** het doel is ophalen uit het geheugen oefenen, niet beoordelen. Punten en tijdsdruk maken van oefenen een toets en verhogen de drempel, zeker bij een lagere leessnelheid. Zelf inschatten stuurt de herhaling: wat ze nog niet kent, komt eerder terug.

## 5. Overhoren zit vermomd in vormen die zij leuk vindt
**Wat:** geen apart overhoorspel en geen opdracht "leg het uit". Overhoren zit in de doe-versie van een plaat (begrippen verstopt), uit je hoofd tekenen, sorteren en begrippenkaarten.
**Waarom:** zij koos zelf welke vormen ze wil; een overhoorspel en "zelf uitleggen" vielen af. Het effect van ophalen uit het geheugen (testing effect) blijft zo behouden, in een vorm die ze wél opent.

## 6. Geluid opnemen in de les: bewust niet gebouwd
**Wat:** de app neemt geen geluid op tijdens de les.
**Waarom:** opnemen legt ook de stem van de docent en klasgenoten vast, zonder hun toestemming. Veel scholen verbieden het in hun regels. Aantekeningen maken met de Pencil en huiswerk fotograferen kan wel.

## 7. Leervormen als herbruikbare bouwstenen in `js/leren.js`
**Wat:** chat, sorteren, begrippenkaarten, rekenen met afbouwende voorbeelden, toetstraining, uit je hoofd tekenen, herhaalplanning en de lightstick staan in `js/leren.js`. Een hoofdstuk in `js/modules/` levert alleen inhoud (data). `js/modules/economie-h4.js` is het voorbeeld.
**Waarom:** een nieuw hoofdstuk kost dan vooral inhoud, geen nieuwe code. Een verbetering aan een vorm werkt meteen in alle hoofdstukken.
**Nog niet af:** het bouwplan is nog per hoofdstuk geschreven, en rekenen kent alleen de rekentrap van omzet naar nettowinst. Sinds Geschiedenis H1 (2026-11-08) staan de plaat (kijk- en doe-versie), het filmpje met scènes, de tijdlijn en het overzicht als data-vormen in `leren.js`; H4 gebruikt nog zijn eigen versies (de staafjesfilm blijft eigen code). Zie WENSEN.md.

## 8. Herhalen gespreid tot aan de toetsdatum
**Wat:** kaarten en vragen komen terug na 1, 2, 4 en 7 dagen (Leitner-systeem), en alles komt nog minstens één keer terug vóór de toetsdatum. Ze vult de toetsdatum zelf in de app in.
**Waarom:** gespreid herhalen is een van de best onderbouwde leerstrategieën. Elke dag een kwartier werkt beter dan één lange avond. De datum staat op de iPad, niet in de code.

## 9. Lage leesdrempel als ontwerpregel
**Wat:** voorleesknop op elk scherm, korte zinnen, het lettertype Atkinson Hyperlegible, tekstgrootte en extra letterruimte instelbaar.
**Waarom:** minder leeswerk betekent meer aandacht voor de stof. Voorlezen gebruikt de ingebouwde Nederlandse stem van de iPad, dus er gaat geen tekst naar een externe dienst.

## 10. Toetswoorden uit het boek zijn leidend
**Wat:** begrippen heten in de app precies zoals in haar boek. Uitleg en voorbeelden zijn eigen tekst.
**Waarom:** op de toets wordt het woord uit het boek gevraagd. Een synoniem uit de app kost dan punten. Eigen uitleg voorkomt het overnemen van boektekst.

## 11. Voorbeelden uit haar eigen wereld
**Wat:** voorbeelden komen uit de wereld van K-pop en fans (merch, photocards, tours, dansles), alleen in tekst.
**Waarom:** stof koppelen aan eigen interesses maakt het motiverender en beter te onthouden (context-personalisatie). Geen afbeeldingen, logo's of songteksten van artiesten, vanwege auteursrecht en privacy.

## 12. Zij is de eigenaar, via de ideeënbus
**Wat:** wensen komen uit de ideeënbus in de app. Vader brengt ze in, Claude bouwt, vader keurt goed voordat er iets online komt.
**Waarom:** het is haar app. Eigenaarschap houdt de app in gebruik. Vader bewaakt privacy en didactiek.

## 13. Geen pop-ups van de browser
**Wat:** geen `alert`, `confirm` of `prompt`; altijd `App.modal`.
**Waarom:** browserpop-ups zijn lelijk, niet voor te lezen en werken in een app op het beginscherm van de iPad niet altijd goed.

## 14. Na een update eerst het netwerk, daarna de bewaarde versie
**Wat:** de service worker (`sw.js`) haalt eerst de nieuwste versie op, maar wacht daar hooguit 3 seconden op. Duurt het langer, is er geen internet, een foutpagina of een omleiding naar een inlogpagina (wifi op school of in de trein), dan gebruikt hij de bewaarde versie. Valt de startpagina terug, dan komt de rest van die keer laden ook uit de bewaarde versie. (Aangescherpt 2026-11-08.)
**Waarom:** een update komt zo direct binnen, en de app werkt toch zonder internet. Zonder wachttijd bleef de app bij slechte wifi lang leeg, en bij wifi met een inlogpagina toonde hij die pagina in plaats van de app. Oude en nieuwe bestanden mogen niet door elkaar raken. Bij nieuwe bestanden: toevoegen aan `CORE` en `CACHE` verhogen.

## 15. Direct publiceren, samen controleren op de iPad
**Wat (2026-11-07):** na een geslaagde test in iPad-formaat en een privacycontrole gaat een wijziging meteen naar `main` en dus naar de iPad. Vader en dochter controleren het daarna samen op haar iPad. Gaat er iets mis, dan wordt de wijziging teruggedraaid (`git revert`) en opnieuw gepubliceerd.
**Waarom:** een aparte voorbeeldsite en een akkoordstap vooraf kosten meer moeite dan ze opleveren. Echt controleren kan alleen op haar iPad (Pencil, voorlezen, deelmenu), en samen kijken past bij haar rol als eigenaar. De risico's zijn klein: haar gegevens staan op de iPad en worden door een update niet aangeraakt, en terugdraaien kost een minuut. Wijzigingen aan de opslag krijgen daarom extra zorg.

## 16. Voorlezen met de stemmen van de iPad zelf
**Wat (2026-11-08):** de app gebruikt de Nederlandse stemmen die op de iPad staan. Hij kiest de beste (premium, dan verbeterd, dan basis; robot- en grapstemmen nooit). Zij kan zelf een stem en tempo kiezen. Tekst wordt eerst omgezet naar uitspreekbare woorden en per zin voorgelezen.
**Waarom:** gratis, werkt zonder internet en er gaat geen tekst naar een externe dienst. De kwaliteit hangt af van welke stem er op de iPad staat, daarom staat in de app uitgelegd hoe je een betere stem downloadt. Opgenomen stemmen voor vaste teksten zijn een open vraag (zie WENSEN.md).
**Aanvulling (2026-11-08):** getest op het apparaat: iOS geeft websites en beginscherm-apps alleen de basisstemmen. Verbeterde en Siri-stemmen zijn voor de app onbereikbaar. Zie besluit 17.

## 17. Vaste teksten vooraf ingesproken met Gemini TTS
**Wat (2026-11-08):** vaste voorleesteksten worden vooraf ingesproken met Gemini TTS (eerst 3.8 Flash TTS; sinds 2026-11-08 standaard 3.8 Flash-Lite TTS, dat op het gehoor niet verschilt en goedkoper is), stem Sulafat (haar keuze uit drie, blind beluisterd). Elke tekst die de app voorleest krijgt een vingerafdruk (stem + tekst); bestaat er een opname (`audio/z/`, lijst in `js/ingesproken.js`), dan speelt de app die, anders leest de iPad-stem dezelfde tekst. Zo werkt het overal zonder per scherm iets te bouwen. Wisselende tekst (haar eigen antwoorden, tellers) blijft de iPad-stem. In de chat praat Sam met stem Puck, ook haar keuze uit drie.
**Waarom:** het was haar eigen wens: de basisstem klinkt als een robot, en betere stemmen zijn in een webapp niet te krijgen (besluit 16). Een echte app vraagt een Mac en een betaald ontwikkelaarsaccount; een live voorleesdienst stuurt tekst naar buiten. Vooraf inspreken houdt de app zonder AI (besluit 1): alleen onze eigen lesstof gaat eenmalig naar Google, nooit iets van haar. De sleutel staat alleen in de werkomgeving van Claude, nooit in de repository.
**Let op:** het model leest aanwijzingen over toon hardop mee; geef alleen de kale tekst. Het zet een korte storing aan begin en eind (wordt weggeknipt) en slaat soms een woord over (elke opname wordt gecontroleerd; afgekeurd = iPad-stem). Gratis laag is te krap (10 per dag); er is een betaalaccount met budget. Ook betaald geldt 100 verzoeken per model per dag. Daarom: teksten bundelen (max. 12 per verzoek) en op de pauzes knippen, en bij de daglimiet doorschakelen naar het tweede model (samen 200 per dag). Limieten per spraakmodel (Tier 1): 10 per minuut, 10.000 tokens per minuut, 100 per dag; ook geweigerde verzoeken tellen mee voor de dag, dus het script blijft zelf onder 8 per minuut. Eén opname per scherm: elk verzoek levert een net iets andere versie van een stem op. Teksten die direct na elkaar klinken (filmpje, chat) komen daarom uit één verzoek; wordt er één afgekeurd, dan wordt het hele scherm opnieuw ingesproken (2026-11-09). ~~Spreektempo kunstmatig vertragen (tools/tempo.py)~~ teruggedraaid op 2026-11-09: op gehoor gaf het te vreemde effecten (vader). **Opnames worden nooit achteraf vertraagd of versneld**; ze klinken zoals Gemini ze maakt. In bundels praat de stem iets sneller dan los (~15–17 tegen ~13–14 tekens per seconde); dat accepteren we. Beeld blijft synchroon: elk volgend beeld wacht op het einde van de opname. Bewust niet: meerdere Google-projecten of sleutels om de limiet te omzeilen (strijdig met de voorwaarden).

## 18. Video's van YouTube: één per paragraaf, als opstapje, pas na goedkeuring van vader
**Wat (2026-11-08):** een hoofdstuk mag per paragraaf één korte video hebben (vorm `L.video`), vóór de leervorm. Daarna volgt altijd een vraag die zij zelf beantwoordt. Claude zoekt twee of drie kandidaten (Nederlandstalig, liefst publieke omroep of een docent), vader bekijkt ze en kiest. Pas dan komt de video in de app. De speler laadt pas na een tik, via youtube-nocookie.com, zonder miniatuur vooraf, met een begin- en eindtijd waar dat helpt. `tools/check-video.py` (ook in `tools/check.sh`) controleert bij elke publicatie of de video nog bestaat, in de app mag worden afgespeeld en dezelfde titel heeft.
**Waarom:** "eerst inspireren, dan trainen": een video maakt nieuwsgierig en geeft beeld bij de stof. Maar kijken voelt als leren en levert minder op dan zelf ophalen; daarom één video, kort, met direct een vraag erna, en geen videobibliotheek. In de app afspelen en niet doorlinken, omdat de YouTube-app na afloop meteen nieuwe video's aanbiedt. Claude kan video's niet bekijken (alleen titel, kanaal en lengte), dus vader keurt de inhoud. Geen tik = geen contact met Google; na de tik wel (besluit 2: zo min mogelijk, niet nul). Engelse kanalen met een automatisch vertaalde titel vallen af: het geluid blijft Engels.

## 19. Vaste opbouw: hoofdstuk → paragraaf → stap, met Leren en Oefenen apart
**Wat (2026-11-08):** elk hoofdstuk heeft dezelfde opbouw. Het overzicht toont **Leren** (de paragrafen, elk één knop, in de kleur van het vak) en **Oefenen** (begrippen, uit je hoofd, toetstraining, in goud). Een paragraaf heeft een eigen scherm met zijn stappen op een rij. In een stap staat bovenaan waar je bent (paragraaf en stap x van y) en onderaan vorige en volgende, ook over de paragraafgrens heen. De terugknop gaat één niveau omhoog. Op het beginscherm staan de hoofdstukken in drie bakken: Bezig, Toekomst en Gedaan, met een filter per vak. Zij verplaatst zelf (⋯); zonder eigen keuze gaat een hoofdstuk naar Gedaan als de toets een dag voorbij is. "Na afloop (voor papa)" staat alleen nog op het overzicht. "Alles automatisch voorlezen" staat in Mijn app, omdat het voor de hele app geldt.
**Waarom:** vader zag dat de app rommelig was: een muur van knoppen, Leren en Oefenen niet te onderscheiden, een paragraaf niet aan te klikken en in een stap niet te zien waar je bent. Een vaste, voorspelbare opbouw kost minder denkwerk aan de app zelf, zodat de aandacht naar de stof gaat (minder extraneous cognitive load). Leren en Oefenen apart past bij "eerst inspireren, dan trainen": eerst nieuwe stof, daarna ophalen. De ordening op fase en vak is haar keuze, omdat het haar app is (besluit 12); de automatische standaard voorkomt dat ze moet opruimen voordat ze kan beginnen.
**Ook:** het filmpje kan een kaart als spelbord tonen (landen, kampen, pijlen, een front) en meerdere bewegende beelden per scène. Geen echte landkaart: een spelbord is duidelijk genoeg voor "wie tegen wie" en vraagt geen kaartmateriaal van anderen.

## 20. Uitlegfilmpjes in schetsbordstijl
**Wat (2026-11-08):** uitlegfilmpjes en animaties krijgen voor alle vakken één stijl: het **schetsbord**. Alles wordt lijn voor lijn getekend terwijl de stem uitlegt, met handgetekende lijnen (licht bibberig, dubbele streek) maar gewone letters in Atkinson Hyperlegible. Figuren zijn eenvoudige poppetjes, ook echte personen (herkenbaar aan een bijschrift, kroon of zwart hemd). Drie kleuren: inkt, de vakkleur en rood voor geweld of verbod. Beweging alleen als die iets betekent (een mars, trillen bij geweld, een stempel). Waar het past groeit onderaan een oorzakenketen mee, en het filmpje eindigt met "teken het zelf na". Woorden krijgen leestijd (ongeveer 1 s plus 0,4 s per woord) en zij kiest het tempo (Rustig / Heel rustig / Vlot). Proef: `tools/proef/schetsbord.html` (Italië-filmpje).
**Waarom:** de emoji in de filmpjes waren versiering naast de tekst; ze lieten niet zien wat tot wat leidt. Bewegend beeld helpt alleen als het de verandering zelf toont (Höffler & Leutner 2007). Een schema zien ontstaan werkt beter dan het af zien (Fiorella & Mayer 2016), en het laat zien hoe zij het zelf kan tekenen: dat sluit aan op uit je hoofd tekenen. Eenvoudige lijnen zijn na te tekenen en eerlijk te vergelijken met haar eigen tekening. Eén stijl werkt voor elk soort uitleg (oorzaak en gevolg, kaart, doorsnede, grafiek, rekenstap, zinsbouw) en heeft geen beeldmateriaal van anderen nodig. Bewust niet: illustraties laten maken met AI (historische fouten, wisselende stijl, gemaakte portretten van echte personen, te druk om na te tekenen) en echte video's renderen (geen tekstgrootte, geen eigen tempo, zwaar). Echte historische bronnen kunnen wel, als apart bronmoment. Samen met haar bekeken: stijl goed; de eerste versie ging te snel, vooral bij woorden.
**Nog open:** stem en tekening liepen in de proef niet gelijk (de stem was eerder klaar), omdat de bestaande tekst achteraf onder een nieuwe animatie is gezet. Bij een nieuw hoofdstuk tekst en tekening samen ontwerpen en de tekening per zin laten meelopen. Zie WENSEN.md.
