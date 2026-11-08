---
name: leerplek-verbeteren
description: Verwerk een idee uit de ideeënbus of een uitkomst van de meting ("Na afloop (voor papa)") tot een verbetering van de leerplek-app. Gebruik deze skill als vader ideeën, klachten of meetresultaten van zijn dochter doorgeeft.
---

# Verbeteren van leerplek

Van ideeënbus of meting naar een nieuwe versie. Lees eerst `CLAUDE.md`, `BESLUITEN.md` en `WENSEN.md`.

## Invoer
- **Ideeënbus:** vader plakt de tekst uit "📤 Stuur naar papa" (soort + idee). Spelling maakt niet uit; lees wat ze bedoelt.
- **Meting:** vader plakt "📤 Stuur resultaten" (per leervorm: hoe leuk 1–5, uit zichzelf opnieuw geopend, wat weet ze de volgende dag nog).
- **Privacy:** deze tekst blijft in het gesprek. Niets ervan komt letterlijk in de repository: geen citaten, geen scores, geen naam. In code, `WENSEN.md`, `BESLUITEN.md` en "Wat is er nieuw" beschrijf je het in eigen, neutrale woorden.

## Stap 1 · Triage
Beoordeel elk idee op drie vragen en zet het resultaat in een tabel voor vader:

| Vraag | Waar let je op |
|---|---|
| **Helpt het leren?** | Past het bij de didactische principes in CLAUDE.md (ophalen, gespreid herhalen, zelf maken, lage leesdrempel)? Neemt de app er denkwerk mee over? Dan niet zo bouwen, maar een variant voorstellen die dat niet doet. |
| **Past het bij haar?** | Haar voorkeursvormen: plaat en filmpje ja, luisteren misschien, overhoorspel en "zelf uitleggen" nee. Voegt het leeswerk toe? Botst het met een besluit in `BESLUITEN.md`? |
| **Hoeveel werk?** | Klein (een uur of minder), middel (een sessie), groot (meerdere sessies of een nieuwe vorm in `leren.js`). |

Ook nagaan: privacy (blijft alles op de iPad?), en of het binnen een statische site zonder server kan.

Uitkomst per idee: **bouwen**, **aangepast bouwen** (zeg hoe en waarom), **later** (naar `WENSEN.md`), of **niet** (met reden, zodat vader het haar kan uitleggen).

**Bij twijfel: vraag vader.** Twijfel is er altijd bij een "niet", bij iets dat een besluit terugdraait, en bij groot werk.

### Meting lezen
- Laag op "leuk" of niet opnieuw geopend: kijk naar de vorm, niet naar de inhoud. Voorstel: dezelfde stof in een vorm die ze wel graag gebruikt.
- Gaten in "wat weet ze nog": kijk naar de begrippen. Voorstel: dat begrip vaker laten terugkomen (extra kaart, sorteerkaart, toetsvraag die het verschil vraagt, of een plek op een uit-je-hoofd-plaat). Geen extra uitleg om te lezen.
- Hoog en opnieuw geopend: noteer in `BESLUITEN.md` dat die vorm werkt (zonder de score), zodat nieuwe hoofdstukken hem ook krijgen.

## Stap 2 · Doorgaan of eerst vragen
Duidelijk geval (bouwen, klein of middel werk, geen botsing met een besluit)? Bouw direct door en zet de triage in je eindbericht.
Twijfel, een "niet", een besluit terugdraaien of groot werk? Leg de triage eerst aan vader voor.

## Stap 3 · Bouwen
- Volg de techniekregels in `CLAUDE.md`: geen buildstap, `App.modal` in plaats van pop-ups, voorleesknop op elk scherm, korte zinnen.
- Raakt het een leervorm? Verander het in `js/leren.js`, zodat alle hoofdstukken meeprofiteren. Controleer dan ook de andere modules.
- Verandert er iets aan de opslag? Houd oude gegevens leesbaar (geen gegevensverlies na de update) en zorg dat de back-up en het terugzetten blijven werken.
- Nieuw bestand? Toevoegen aan `index.html` en aan `CORE` in `sw.js`. Verandert er een bestand? **Verhoog altijd `CACHE` in `sw.js`.**

### Voorleestekst gewijzigd?
Een gewijzigde of nieuwe voorleestekst heeft nog geen opname en klinkt dan met de robotstem. Spreek die teksten in (stap 5b van de skill `leerplek-hoofdstuk`: verzamelen voor alleen de geraakte schermen, dan `python3 tools/maak-audio.py`).

## Stap 4 · Testen in iPad-formaat
```bash
python3 -m http.server 8123 >/dev/null 2>&1 &
node .claude/skills/leerplek-hoofdstuk/test-ipad.js "" <scratchpad>/schermen
```
- Test alle modules (lege module-id), want een wijziging in `leren.js` of `app.js` raakt alles.
- Speel de veranderde plek met de hand door en bekijk de schermafdrukken (in de scratchpad, nooit in de repository).
- Verandert `sw.js`? Draai ook `node .claude/skills/leerplek-hoofdstuk/test-wifi.js` (geen, trage en slechte wifi).
- Pencil, voorlezen en het deelmenu kun je hier niet echt testen. Zet die controle op de lijst voor vader (iPad).

## Stap 5 · "Wat is er nieuw"
Voeg bovenaan `js/nieuw.js` één regel toe: `{ datum: "JJJJ-MM-DD", tekst: "…", idee: true }`. Eén korte zin in haar taal ("Je kunt nu …"). `idee: true` alleen als het uit haar ideeënbus kwam; dan krijgt de regel een ✨. Ze ziet de nieuwe regels als melding op het beginscherm, tot ze het scherm heeft bekeken.
- Ideeën die gebouwd zijn: vader zet ze in de ideeënbus op ✅ gebouwd.

## Stap 6 · Documenten bijwerken
- `WENSEN.md`: gebouwd → naar "Gedaan" met datum; "later" → onder "Open" met wat, waarom en hoeveel werk.
- `BESLUITEN.md`: alleen als er iets is besloten dat de volgende keer weer de vraag zou zijn (ook een "niet bouwen" met reden).

## Stap 7 · Publiceren
1. **Test in iPad-formaat zonder fouten.** Verplicht: zonder geslaagde test wordt niets gepubliceerd. Draai ook `sh tools/check.sh`.
2. **Privacycontrole:** loop `git diff` na op namen, cijfers, resultaten, boektekst en letterlijke tekst uit de ideeënbus of meting.
3. Commit op de werktak met een duidelijke Nederlandse boodschap, zonder persoonlijke gegevens. Push de werktak.
4. **Publiceer direct:** `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (nooit forceren). GitHub Pages zet het binnen ongeveer een minuut live; de iPad krijgt het bij de volgende keer openen.
5. Meld vader wat er nieuw is, met een korte controlelijst voor op haar iPad: app helemaal sluiten en opnieuw openen, en welke schermen ze samen aanklikken.
6. Gaat er iets mis op de iPad: `git revert <commit>` en meteen weer publiceren (stap 4). Meld wat er misging in `WENSEN.md`.

## Klaar als
- [ ] Triage gedaan; bij twijfel eerst aan vader gevraagd.
- [ ] Gebouwd volgens CLAUDE.md, `CACHE` verhoogd.
- [ ] Test in iPad-formaat zonder fouten, veranderde plek met de hand doorgespeeld.
- [ ] Regel in "Wat is er nieuw".
- [ ] `WENSEN.md` en zo nodig `BESLUITEN.md` bijgewerkt.
- [ ] Niets letterlijks uit de ideeënbus of meting in de repository.
- [ ] Privacycontrole gedaan, gepubliceerd naar `main`, controlelijst voor de iPad aan vader gestuurd.
