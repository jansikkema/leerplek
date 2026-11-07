# Wensen

De werkvoorraad van de app. Nieuwe wensen komen meestal uit de ideeënbus.
Per wens: wat, waarom, en hoeveel werk (klein / middel / groot). Klaar? Verplaats naar "Gedaan" met de datum.

Let op: deze repository is openbaar. Beschrijf ideeën in eigen, neutrale woorden; geen letterlijke tekst uit de ideeënbus, geen namen, geen resultaten.

---

## Open

### Begrippen van H4 nalopen tegen het boek
- **4 of 5 P's?** De app gebruikt er vijf (met Personeel) en meldt dat het er soms vier zijn. Check welke het boek en de docent gebruiken. Bij vier: Personeel weghalen uit plaat, sorteren, kaarten, toetsvraag en uit-je-hoofd-plaat.
- **"Inkoopwaarde" bij zelfgemaakte producten.** In de ronde 'Samen' bij rekenen heet het maken van een eigen product de inkoopwaarde. Economisch klopt dat niet helemaal: wie zelf maakt, heeft eerder kosten van grondstoffen of een kostprijs. Check hoe het boek dit noemt, en pas de tekst aan of kies een product dat ze inkoopt.
- Werk: klein. Wacht op: het boek erbij.

### Op de echte iPad controleren
- Pencil-gebaren in tekenen (zoals in Procreate): twee vingers tikken = ongedaan maken, enzovoort.
- Voorlezen: is er een Nederlandse stem, klinkt de chat met twee stemmen goed?
- Deelmenu: back-up bewaren in Bestanden → iCloud Drive, tekening bewaren in Foto's, ideeënbus versturen.
- Het inzoomprobleem: zoomt Safari niet meer per ongeluk in, en werkt A− / A+ wel?
- Werk: klein. Kan alleen op de iPad zelf; de Playwright-test in iPad-formaat vervangt dit niet.

### Scherm "Wat is er nieuw"
- Een scherm (of melding op het beginscherm) dat laat zien wat er is veranderd, met een ✨ bij wat uit haar ideeënbus kwam.
- Waarom: ze ziet dat haar idee echt gebouwd is. Dat versterkt het eigenaarschap en de kans dat ze de ideeënbus blijft gebruiken.
- Voorstel: lijst met regels in de code (datum + korte zin), melding op het beginscherm zolang ze die nog niet gezien heeft, en een koppeling met ✅ gebouwd in de ideeënbus.
- Werk: klein tot middel. **Graag als eerste bouwen:** de skill `leerplek-verbeteren` gaat ervan uit dat dit scherm bestaat.

### Voorleesknop op elk scherm
- De test in iPad-formaat vond vier schermen zonder voorleesknop bij het openen: Overzicht, Begrippen (het menu), Uit je hoofd (het menu) en Toetstraining (het startscherm). CLAUDE.md eist er een op elk scherm.
- Werk: klein.

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

### Privacy: twee plekken nalopen
- `js/leren.js` noemt in een opmerking dyslexie. Dat is gezondheidsinformatie in een openbare repository. Voorstel: neutraal formuleren ("lagere leesdruk").
- In `economie-h4.js` beschrijft de ronde 'Samen' bij rekenen het bedrijfje dat ze zelf tekende, met haar bedragen. Dat is afgeleid van haar eigen werk. Voorstel: vervangen door een verzonnen bedrijfje, of bewust laten staan als jij het onschuldig vindt.
- Werk: klein.

## Gedaan
- (nog leeg)
