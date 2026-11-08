# Wensen

De werkvoorraad van de app. Nieuwe wensen komen meestal uit de ideeënbus.
Per wens: wat, waarom, en hoeveel werk (klein / middel / groot). Klaar? Verplaats naar "Gedaan" met de datum.

Let op: deze repository is openbaar. Beschrijf ideeën in eigen, neutrale woorden; geen letterlijke tekst uit de ideeënbus, geen namen, geen resultaten.

---

## Open

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

### Besluit nodig: opgenomen stemmen voor vaste teksten
- Teksten die niet veranderen (filmpje, chat, plaat) kunnen vooraf worden ingesproken met een natuurlijke computerstem (bijvoorbeeld ElevenLabs) en als geluidsbestand in de app staan. Dat klinkt veel beter dan elke iPad-stem.
- Nadelen: kost tegoed bij die dienst; bij elke tekstwijziging opnieuw maken; wisselende teksten (bedragen in 'Zelf rekenen', het Overzicht) blijven de iPad-stem, dus twee soorten stemmen door elkaar; een paar MB extra. Botst niet met besluit 1 (de app zelf gebruikt dan geen AI), maar wel een nieuw besluit.
- Advies: de verbeterde iPad-stem werkt niet in de app (getest 2026-11-08). Volgende stap: proefstuk met het filmpje van H4.
- Werk: middel.

### Later: geplande wekelijkse herinnering (back-up en terugblik)
- Nu is er al een melding op het beginscherm als de laatste back-up ouder is dan 7 dagen. Die verschijnt alleen als ze de app opent.
- Een echte melding (pushbericht) op de iPad vraagt een server. Dat botst met besluit 2 (geen server).
- Eenvoudiger alternatief zonder bouwen: een herhalende herinnering in de app Herinneringen of Agenda op de iPad ("zondag: back-up en terugblik"). Eerst dat proberen; pas bouwen als dat niet werkt.
- Werk: geen (alternatief) of groot (pushberichten).

## Voorstellen van Claude (graag beoordelen)

### Leervormen verder herbruikbaar maken
- De plaat (kijk- en doe-versie), het filmpje en het bouwplan staan nu in `economie-h4.js`. Rekenen in `leren.js` kent alleen de rekentrap omzet → nettowinst.
- Voorstel: bij het tweede hoofdstuk dat zo'n vorm nodig heeft, die vorm eerst naar `leren.js` verplaatsen (inhoud als data), in plaats van de code te kopiëren.
- Werk: middel, per vorm.

## Gedaan
- **2026-11-08 · Starten bij slechte wifi.** Hooguit 3 seconden wachten op internet, daarna de bewaarde versie. Foutpagina's en inlogpagina's van wifi worden genegeerd. Getest: oude versie 45 s bij trage wifi en vastgelopen bij inlogpagina of storing; nieuwe versie 3 s en 0,1 s.
- **2026-11-08 · Scherm "Wat is er nieuw".** Regels in `js/nieuw.js`, melding op het beginscherm tot ze het gezien heeft, links vanuit de ideeënbus en 'Mijn app'.
- **2026-11-08 · Voorlezen klinkt natuurlijker.** Beste stem automatisch (robot- en grapstemmen overgeslagen), zelf stem en tempo kiezen in 'Mijn app', tekens en bedragen omgezet naar gewone woorden, per zin voorlezen, chat met twee echte stemmen in plaats van verschoven toonhoogte.
- **2026-11-07 · Voorleesknop op elk scherm.** Toegevoegd op Overzicht, het menu van Begrippen, het menu van Uit je hoofd en het startscherm van de Toetstraining (in `leren.js`, dus ook voor volgende hoofdstukken).
- **2026-11-07 · Privacy.** Gezondheidsinformatie uit een opmerking in `leren.js` gehaald. De rekenronde 'Samen' gebruikt nu een verzonnen bedrijfje met ingekochte photocard-houders, niet meer haar eigen tekening. (Oudere versies staan nog in de geschiedenis van Git.)
