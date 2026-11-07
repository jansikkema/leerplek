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

## Stap 2 · Akkoord op de aanpak
Laat vader de triage zien en wacht op zijn akkoord voordat je bouwt.

## Stap 3 · Bouwen
- Volg de techniekregels in `CLAUDE.md`: geen buildstap, `App.modal` in plaats van pop-ups, voorleesknop op elk scherm, korte zinnen.
- Raakt het een leervorm? Verander het in `js/leren.js`, zodat alle hoofdstukken meeprofiteren. Controleer dan ook de andere modules.
- Verandert er iets aan de opslag? Houd oude gegevens leesbaar (geen gegevensverlies na de update) en zorg dat de back-up en het terugzetten blijven werken.
- Nieuw bestand? Toevoegen aan `index.html` en aan `CORE` in `sw.js`. Verandert er een bestand? **Verhoog altijd `CACHE` in `sw.js`.**

## Stap 4 · Testen in iPad-formaat
```bash
python3 -m http.server 8123 >/dev/null 2>&1 &
node .claude/skills/leerplek-hoofdstuk/test-ipad.js "" <scratchpad>/schermen
```
- Test alle modules (lege module-id), want een wijziging in `leren.js` of `app.js` raakt alles.
- Speel de veranderde plek met de hand door en bekijk de schermafdrukken (in de scratchpad, nooit in de repository).
- Pencil, voorlezen en het deelmenu kun je hier niet echt testen. Zet die controle op de lijst voor vader (iPad).

## Stap 5 · "Wat is er nieuw"
Voeg één regel toe aan "Wat is er nieuw": datum + één korte zin, in haar taal ("Je kunt nu …"), met ✨ als het uit haar ideeënbus kwam.
- Bestaat dat scherm nog niet? Stel voor het eerst te bouwen (zie `WENSEN.md`). Zet de regel tot die tijd in je bericht aan vader.
- Ideeën die gebouwd zijn: vader zet ze in de ideeënbus op ✅ gebouwd.

## Stap 6 · Documenten bijwerken
- `WENSEN.md`: gebouwd → naar "Gedaan" met datum; "later" → onder "Open" met wat, waarom en hoeveel werk.
- `BESLUITEN.md`: alleen als er iets is besloten dat de volgende keer weer de vraag zou zijn (ook een "niet bouwen" met reden).

## Stap 7 · Akkoord en pushen
1. Laat vader zien wat er veranderd is (korte lijst + een paar schermafdrukken) en wat hij op de iPad moet controleren.
2. Pas na zijn akkoord: commit met een duidelijke Nederlandse boodschap, zonder persoonlijke gegevens.
3. Push naar de werktak van deze sessie. De site wordt pas bijgewerkt na samenvoegen met de tak waar GitHub Pages van publiceert (nu `main`), op verzoek van vader.

## Klaar als
- [ ] Triage besproken met vader, akkoord gekregen.
- [ ] Gebouwd volgens CLAUDE.md, `CACHE` verhoogd.
- [ ] Test in iPad-formaat zonder fouten, veranderde plek met de hand doorgespeeld.
- [ ] Regel in "Wat is er nieuw".
- [ ] `WENSEN.md` en zo nodig `BESLUITEN.md` bijgewerkt.
- [ ] Niets letterlijks uit de ideeënbus of meting in de repository.
- [ ] Akkoord van vader, daarna gecommit en gepusht.
