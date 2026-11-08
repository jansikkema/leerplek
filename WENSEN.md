# Wensen

De werkvoorraad van de app. Nieuwe wensen komen meestal uit de ideeënbus.
Per wens: wat, waarom, en hoeveel werk (klein / middel / groot). Klaar? Verplaats naar "Gedaan" met de datum.

Let op: deze repository is openbaar. Beschrijf ideeën in eigen, neutrale woorden; geen letterlijke tekst uit de ideeënbus, geen namen, geen resultaten.

---

## Open

### Video's: proef bij Geschiedenis H1 §1.3
- Vorm `L.video` gebouwd en gepubliceerd (2026-11-08, versie 19). Bij §1.3 de VPRO-video over het begin van de oorlog, goedgekeurd door vader.
- Meten via "Na afloop (voor papa)": opent ze de video uit zichzelf nog eens, en wat weet ze de volgende dag nog? Werkt het, dan wordt het vast onderdeel van elk nieuw hoofdstuk (staat al in de skill).
- Werk: klein. Wacht op: ervaring op de iPad.


### Begrippen van Geschiedenis H1 nalopen tegen het boek
- H1 is gebouwd vanuit de leerdoelen van de docent, zonder het boek. De methode is niet zeker (waarschijnlijk MeMo). De termen zijn de gangbare voor havo 3.
- Nalopen: centralen (of centrale mogendheden), loopgravenoorlog (of stellingenoorlog), Triple Alliantie (of Drievoudig Verbond), dolkstootlegende, neutraliteitspolitiek, en of het boek "aanleiding" en "directe oorzaak" als hetzelfde gebruikt. Staan er begrippen in het boek die nu ontbreken (bijvoorbeeld pan-Slavisme, revanchisme, Spartacusopstand)?
- Werk: klein. Wacht op: de begrippenlijst of samenvatting uit haar boek (foto).

### Geschiedenis H1 inspreken
- 326 teksten (317 verteller, 9 van Sam). Op 2026-11-08 was de daglimiet al bijna op: nog maar 5 ingesproken. De rest leest de iPad-stem tot de volgende run (geplande taak).
- Werk: klein, ongeveer 35 verzoeken.


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
- H4: 172 van 182 teksten ingesproken (2026-11-08); de rest volgt via de geplande taak.
- Gedaan (2026-11-08): wisselende teksten gesplitst, tellers apart; nieuwe opnames op 32 kbps; opnames per hoofdstuk geladen en blijvend bewaard (niet opnieuw downloaden na een update); verzamelaar 40× sneller.
- **Verzamelaar** (`tools/verzamel.js`) klikt willekeurig rond met voorkeuren per leervorm. Een nieuwe leervorm heeft eigen voorkeursknoppen nodig, anders worden teksten gemist. Werk: klein, per nieuwe vorm.
- Op de echte iPad controleren: speelt de chat met ▶ Afspelen automatisch door (iOS is streng met automatisch afspelen)?

### Later: geplande wekelijkse herinnering (back-up en terugblik)
- Nu is er al een melding op het beginscherm als de laatste back-up ouder is dan 7 dagen. Die verschijnt alleen als ze de app opent.
- Een echte melding (pushbericht) op de iPad vraagt een server. Dat botst met besluit 2 (geen server).
- Eenvoudiger alternatief zonder bouwen: een herhalende herinnering in de app Herinneringen of Agenda op de iPad ("zondag: back-up en terugblik"). Eerst dat proberen; pas bouwen als dat niet werkt.
- Werk: geen (alternatief) of groot (pushberichten).

## Voorstellen van Claude (graag beoordelen)

### Leervormen verder herbruikbaar maken
- De plaat (kijk- en doe-versie), het filmpje en het bouwplan staan nu in `economie-h4.js`. Rekenen in `leren.js` kent alleen de rekentrap omzet → nettowinst.
- Voorstel: bij het tweede hoofdstuk dat zo'n vorm nodig heeft, die vorm eerst naar `leren.js` verplaatsen (inhoud als data), in plaats van de code te kopiëren.
- Stand 2026-11-08: plaat, filmpje (scènes), tijdlijn en overzicht staan nu in `leren.js` (voor Geschiedenis H1). H4 kan de plaat en het overzicht ook gaan gebruiken; dat verandert de voorleesteksten van H4 niet als de tekst gelijk blijft. Nog open: bouwplan en andere soorten rekenen.
- Werk: middel, per vorm.

## Gedaan
- **2026-11-08 · Geschiedenis H1 De Eerste Wereldoorlog.** Tijdlijn (vier rondes), plaat 'kruitvat' met twee sorteerrondes, filmpje van Sarajevo tot Versailles, sorteren aanleiding/oorzaak/gevolg, podcast-chat over Weimar, filmpje Italië, plaat Nederland neutraal, oorzaak-lab met vijf sorteerrondes, 35 begrippen, 31 toetsvragen, 6 uit-je-hoofd-platen. Nieuwe vormen in `leren.js`. Voorlezen: WO1 en PSEC worden goed uitgesproken; filmpje leest ook voor bij zelf doorklikken als 'alles automatisch voorlezen' aanstaat.
- **2026-11-08 · Starten bij slechte wifi.** Hooguit 3 seconden wachten op internet, daarna de bewaarde versie. Foutpagina's en inlogpagina's van wifi worden genegeerd. Getest: oude versie 45 s bij trage wifi en vastgelopen bij inlogpagina of storing; nieuwe versie 3 s en 0,1 s.
- **2026-11-08 · Scherm "Wat is er nieuw".** Regels in `js/nieuw.js`, melding op het beginscherm tot ze het gezien heeft, links vanuit de ideeënbus en 'Mijn app'.
- **2026-11-08 · Voorlezen klinkt natuurlijker.** Beste stem automatisch (robot- en grapstemmen overgeslagen), zelf stem en tempo kiezen in 'Mijn app', tekens en bedragen omgezet naar gewone woorden, per zin voorlezen, chat met twee echte stemmen in plaats van verschoven toonhoogte.
- **2026-11-07 · Voorleesknop op elk scherm.** Toegevoegd op Overzicht, het menu van Begrippen, het menu van Uit je hoofd en het startscherm van de Toetstraining (in `leren.js`, dus ook voor volgende hoofdstukken).
- **2026-11-07 · Privacy.** Gezondheidsinformatie uit een opmerking in `leren.js` gehaald. De rekenronde 'Samen' gebruikt nu een verzonnen bedrijfje met ingekochte photocard-houders, niet meer haar eigen tekening. (Oudere versies staan nog in de geschiedenis van Git.)
