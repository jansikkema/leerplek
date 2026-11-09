# Wensen

De werkvoorraad van de app. Nieuwe wensen komen meestal uit de ideeënbus.
Per wens: wat, waarom, en hoeveel werk (klein / middel / groot). Klaar? Verplaats naar "Gedaan" met de datum.

Let op: deze repository is openbaar. Beschrijf ideeën in eigen, neutrale woorden; geen letterlijke tekst uit de ideeënbus, geen namen, geen resultaten.

---

## Open

### Schetsbord bouwen en testen met een nieuw hoofdstuk (besluit 20)
- **Stand 2026-11-09:** `L.schetsbord` staat in `js/leren.js` (bouwstenen in `L.schets`: tekenaar, assenstelsel, lijn bij een formule, trapje 'opzij en omhoog', tabel, formule in kleuren). Eerste filmpje: Wiskunde H1 §1.1 (y = ax + b), 25 zinnen, elke zin met een eigen stuk tekening dat tegelijk met de stem start. Ingesproken. **Nu testen met haar:** helpt het? Volgt ze de tekening bij de stem? Is de tekst onder het beeld te veel (de zinnen stapelen op, de huidige licht op)? Meten via 'Na afloop (voor papa)' op het overzicht.
- Daarna: de rest van Wiskunde H1 (1.2 t/m 1.6, begrippen, toetstraining), en poppetje/gebouw/ketting uit de proef naar `L.schets` zodat geschiedenis het ook kan gebruiken.
- Stijl is gekozen (proef: `tools/proef/schetsbord.html`). Volgende stap: een vaste vorm `L.schetsbord` in `js/leren.js`, waarbij het hoofdstuk alleen tekeninstructies als data aanlevert. Bouwstenen: poppetje, gebouw, pijl, ketting, kaart, doorsnede met labels, grafiek, rekenstap, zinsdelen.
- Testen met een **nieuw hoofdstuk**, waarin tekst en tekening samen worden gemaakt. In de proef was de stem eerder klaar dan de tekening, omdat bestaande tekst onder een nieuwe animatie stond.
- **Gelijk lopen:** de tekening per zin laten meelopen met de ingesproken tekst (elke zin start zijn stuk tekening; een label verschijnt als het woord klinkt). Daarna pas de leestijd van losse labels afstemmen.
- Tempoknop (Rustig / Heel rustig / Vlot) houden; de standaard is wat zij kiest. Opslag in `lp-tempo`.
- Nog te beoordelen met haar: kan de volledige tekst onder het beeld weg (korte zin + stem, volledige tekst achter een tik)? Helpt de ketting onderaan? Zijn de poppetjes te stijf?
- Daarna: proefscènes voor de andere vakken die binnenkort komen (aardrijkskunde, wiskunde, Duits, natuurkunde), bij stof die ze echt leert. Bestaande filmpjes (Italië, kaartfilmpje §1.3, H4) later overzetten.
- Verzamelaar (`tools/verzamel.js`) heeft voorkeursknoppen voor de nieuwe vorm nodig.
- Werk: groot (de vorm), daarna klein per filmpje. Wacht op: een nieuw hoofdstuk.

### Video's: proef bij Geschiedenis H1 §1.3
- Vorm `L.video` gebouwd en gepubliceerd (2026-11-08, versie 19). Bij §1.3 de VPRO-video over het begin van de oorlog, goedgekeurd door vader.
- Meten via "Na afloop (voor papa)": opent ze de video uit zichzelf nog eens, en wat weet ze de volgende dag nog? Werkt het, dan wordt het vast onderdeel van elk nieuw hoofdstuk (staat al in de skill).
- Werk: klein. Wacht op: ervaring op de iPad.


### Begrippen van Geschiedenis H1 nalopen tegen het boek
- H1 is gebouwd vanuit de leerdoelen van de docent, zonder het boek. De methode is niet zeker (waarschijnlijk MeMo). De termen zijn de gangbare voor havo 3.
- Nalopen: centralen (of centrale mogendheden), loopgravenoorlog (of stellingenoorlog), Triple Alliantie (of Drievoudig Verbond), dolkstootlegende, neutraliteitspolitiek, en of het boek "aanleiding" en "directe oorzaak" als hetzelfde gebruikt. Staan er begrippen in het boek die nu ontbreken (bijvoorbeeld pan-Slavisme, revanchisme, Spartacusopstand)?
- Werk: klein. Wacht op: de begrippenlijst of samenvatting uit haar boek (foto).

### Begrippen van H4 nalopen tegen het boek
- **4 of 5 P's?** De app gebruikt er vijf (met Personeel) en meldt dat het er soms vier zijn. Check welke het boek en de docent gebruiken. Bij vier: Personeel weghalen uit plaat, sorteren, kaarten, toetsvraag en uit-je-hoofd-plaat.
- **"Inkoopwaarde" bij zelfgemaakte producten.** Wie zelf maakt, heeft eerder kosten van grondstoffen of een kostprijs dan een inkoopwaarde. De rekenronde 'Samen' gebruikt nu een ingekocht product, maar het bedrijfje Purple Cases heet "zelfgemaakt" en rekent wel met inkoop. Check hoe het boek dit noemt, en pas zo nodig de plaat, het filmpje en de rekenvoorbeelden aan.
- Werk: klein. Wacht op: het boek erbij.

### Op de echte iPad controleren
- Pencil-gebaren in tekenen (zoals in Procreate): twee vingers tikken = ongedaan maken, enzovoort.
- Voorlezen: is er een Nederlandse stem, klinkt de chat met twee stemmen goed?
- Deelmenu: back-up bewaren in Bestanden → iCloud Drive, tekening bewaren in Foto's, ideeënbus versturen.
- Het inzoomprobleem: zoomt Safari niet meer per ongeluk in, en werkt A− / A+ wel?
- Werk: klein. Kan alleen op de iPad zelf; de Playwright-test in iPad-formaat vervangt dit niet.

### Voorlezen: mooiere stem (wens van haar zelf)
- **Getest op 2026-11-08:** iOS geeft aan websites en beginscherm-apps alleen de basisstemmen door (`compact` Xander, `super-compact` Ellen), ook na het downloaden van de verbeterde stemmen en een herstart. Siri-stemmen zijn nooit beschikbaar voor apps. De app kan hier zelf niets aan doen.
- Nu: de tip in 'Mijn app' verwijst naar Spreek selectie / Spreek scherm van iOS, die wel de verbeterde stemmen gebruiken.
- Opties voor in de app: opgenomen stemmen voor vaste teksten (zie hieronder); een echte app via een app-schil (vraagt een betaald Apple-ontwikkelaarsaccount en bouwen op een Mac in de cloud); een online voorleesdienst (botst met besluit 2 en 3, en mogelijk met 1).
- Werk: zie de opties. Wacht op: besluit van vader.

### Meelezen: de zin die wordt voorgelezen oplichten
- Tijdens voorlezen de zin markeren die op dat moment klinkt. Helpt bij het volgen en verbindt horen met lezen.
- Lastig omdat de voorleestekst nu vaak los staat van de tekst op het scherm. Eerst doen bij de chat en het filmpje, waar tekst en stem al gelijk lopen.
- Werk: middel.

### Opgenomen stemmen: verder uitrollen (besluit 17)
- Stand 2026-11-09: H4 179/180, Geschiedenis H1 314/315, tellers en appschermen compleet. Twee teksten afgekeurd (de stem slaat een woord over of voegt er een toe); die lezen de iPad-stem. Bij de volgende run nog eens proberen.
- **Schermen met zinnen na elkaar opnieuw inspreken in één opname per scherm** (filmpjes, chats en kaartfilmpje van H1, chat van H4). Die komen nu nog uit verschillende verzoeken en kunnen per zin net anders klinken. Het filmpje van H4 is al gedaan (2026-11-09). Werk: klein, ongeveer 15 verzoeken.
- Knippen van bundels gaat nu op de lengte van de teksten (dynamisch programmeren): 270 teksten in ruim 5 minuten met 42 verzoeken (2026-11-09).
- Gedaan (2026-11-08): wisselende teksten gesplitst, tellers apart; nieuwe opnames op 32 kbps; opnames per hoofdstuk geladen en blijvend bewaard (niet opnieuw downloaden na een update); verzamelaar 40× sneller.
- **Verzamelaar** (`tools/verzamel.js`) klikt willekeurig rond met voorkeuren per leervorm. Een nieuwe leervorm heeft eigen voorkeursknoppen nodig, anders worden teksten gemist. Werk: klein, per nieuwe vorm.
- Op de echte iPad controleren: speelt de chat met ▶ Afspelen automatisch door (iOS is streng met automatisch afspelen)?

### Later: geplande wekelijkse herinnering (back-up en terugblik)
- Nu is er al een melding op het beginscherm als de laatste back-up ouder is dan 7 dagen. Die verschijnt alleen als ze de app opent.
- Een echte melding (pushbericht) op de iPad vraagt een server. Dat botst met besluit 2 (geen server).
- Eenvoudiger alternatief zonder bouwen: een herhalende herinnering in de app Herinneringen of Agenda op de iPad ("zondag: back-up en terugblik"). Eerst dat proberen; pas bouwen als dat niet werkt.
- Werk: geen (alternatief) of groot (pushberichten).

## Voorstellen van Claude (graag beoordelen)

### Na de opruimronde: op de iPad nakijken
- Werkt ⋯ (verplaatsen) goed met de vinger, en snapt ze Bezig/Toekomst/Gedaan zonder uitleg?
- Speelt het kaartfilmpje vloeiend op de iPad (pijlen die getekend worden, de kroon die naar Nederland gaat)?
- Mist ze de knoppenrij bovenaan een hoofdstuk? Zo ja: welke sprong maakte ze ermee?
- Werk: klein. Wacht op: samen kijken op de iPad.

### Andere filmpjes ook als kaart of met meer beweging
- Het H4-filmpje (staafjes) beweegt al. Toekomstige hoofdstukken met een verloop in plaats en tijd (aardrijkskunde, geschiedenis) kunnen de kaartvorm gebruiken.
- Vervangen door het schetsbord (besluit 20): de kaart wordt daar een bouwsteen in.
- Werk: klein per filmpje (alleen data).

### Leervormen verder herbruikbaar maken
- De plaat (kijk- en doe-versie), het filmpje en het bouwplan staan nu in `economie-h4.js`. Rekenen in `leren.js` kent alleen de rekentrap omzet → nettowinst.
- Voorstel: bij het tweede hoofdstuk dat zo'n vorm nodig heeft, die vorm eerst naar `leren.js` verplaatsen (inhoud als data), in plaats van de code te kopiëren.
- Stand 2026-11-08: plaat, filmpje (scènes), tijdlijn en overzicht staan nu in `leren.js` (voor Geschiedenis H1). H4 kan de plaat en het overzicht ook gaan gebruiken; dat verandert de voorleesteksten van H4 niet als de tekst gelijk blijft. Nog open: bouwplan en andere soorten rekenen.
- Werk: middel, per vorm.

## Gedaan
- **2026-11-09 · Tikje tussen fragmenten weg (versie 27).** Ingesproken geluid speelt nu via één open geluidskanaal (Web Audio) in plaats van het Audio-element, dat het geluid van de iPad per fragment aan- en uitzette. Tot de eerste tik op het scherm, of als de iPad het kanaal niet opent, speelt het Audio-element zoals voorheen. Daarnaast 15 opnames met een losse tik aan het begin opgeschoond (`tools/tik.py`, draait voortaan automatisch na `maak-audio.py`; plofklanken als t en k blijven staan). Op de iPad nog nalopen: geen tik meer, en klinkt het ook als de iPad op stil staat?
- **2026-11-09 · Schetsbord als vaste vorm, proef met Wiskunde H1 §1.1.** Uitlegfilmpje over y = ax + b dat lijn voor lijn ontstaat: tekening en stem lopen per zin gelijk, tempoknop (pauzes en tekenen, niet de stem), eindigt met zelf tekenen. Nog alleen het filmpje; de rest van het hoofdstuk volgt na de test.
- **2026-11-08 · Chat begon bij het tweede bericht (versie 21).** Het eerste bericht stond er al, maar Afspelen sloeg het over. Nu leest Afspelen eerst het bericht dat er al staat. Zit in `L.chat`, dus geldt voor alle chats.
- **2026-11-08 · Opgeruimd en logischer (vraag van vader).** Beginscherm met Bezig/Toekomst/Gedaan, filter per vak en "Verder waar je was". Hoofdstuk: Leren (paragrafen als knoppen) en Oefenen apart, elk met eigen kleur. Paragraaf als eigen scherm. In een stap: waar je bent, en vorige/volgende. Terugknop één niveau omhoog. Lijniconen voor de navigatie, emoji in zachte vlakken. Filmpje §1.3 op een kaart van Europa met kampen, pijlen en front; Italië-filmpje met meer beweging. H4 gebruikt nu ook het gedeelde overzicht. Zie besluit 19.
- **2026-11-08 · Geschiedenis H1 De Eerste Wereldoorlog.** Tijdlijn (vier rondes), plaat 'kruitvat' met twee sorteerrondes, filmpje van Sarajevo tot Versailles, sorteren aanleiding/oorzaak/gevolg, podcast-chat over Weimar, filmpje Italië, plaat Nederland neutraal, oorzaak-lab met vijf sorteerrondes, 35 begrippen, 31 toetsvragen, 6 uit-je-hoofd-platen. Nieuwe vormen in `leren.js`. Voorlezen: WO1 en PSEC worden goed uitgesproken; filmpje leest ook voor bij zelf doorklikken als 'alles automatisch voorlezen' aanstaat.
- **2026-11-08 · Starten bij slechte wifi.** Hooguit 3 seconden wachten op internet, daarna de bewaarde versie. Foutpagina's en inlogpagina's van wifi worden genegeerd. Getest: oude versie 45 s bij trage wifi en vastgelopen bij inlogpagina of storing; nieuwe versie 3 s en 0,1 s.
- **2026-11-08 · Scherm "Wat is er nieuw".** Regels in `js/nieuw.js`, melding op het beginscherm tot ze het gezien heeft, links vanuit de ideeënbus en 'Mijn app'.
- **2026-11-08 · Voorlezen klinkt natuurlijker.** Beste stem automatisch (robot- en grapstemmen overgeslagen), zelf stem en tempo kiezen in 'Mijn app', tekens en bedragen omgezet naar gewone woorden, per zin voorlezen, chat met twee echte stemmen in plaats van verschoven toonhoogte.
- **2026-11-07 · Voorleesknop op elk scherm.** Toegevoegd op Overzicht, het menu van Begrippen, het menu van Uit je hoofd en het startscherm van de Toetstraining (in `leren.js`, dus ook voor volgende hoofdstukken).
- **2026-11-07 · Privacy.** Gezondheidsinformatie uit een opmerking in `leren.js` gehaald. De rekenronde 'Samen' gebruikt nu een verzonnen bedrijfje met ingekochte photocard-houders, niet meer haar eigen tekening. (Oudere versies staan nog in de geschiedenis van Git.)
