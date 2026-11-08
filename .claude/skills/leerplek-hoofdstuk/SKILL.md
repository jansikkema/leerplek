---
name: leerplek-hoofdstuk
description: Maak een nieuw hoofdstuk (module) voor de leerplek-app, uitgaande van foto's of een samenvatting van een hoofdstuk uit het lesboek, plus de toetsdatum en de leerdoelen. Gebruik deze skill als vader een nieuw hoofdstuk, vak of toets aanlevert.
---

# Nieuw hoofdstuk voor leerplek

Van boekmateriaal naar een module in `js/modules/`. Lees eerst `CLAUDE.md`, `BESLUITEN.md` en `js/modules/economie-h4.js` (het voorbeeld).

## Vaste regels (gelden bij elke stap)
- **Geen boektekst.** Foto's van het boek zijn alleen bronmateriaal in deze sessie. Ze komen nooit in de repository. Uitleg, voorbeelden en vragen schrijf je zelf.
- **Toetswoorden wel letterlijk.** Het begrip (de term) neem je precies over zoals het boek het schrijft, inclusief spelling en lidwoord. Alleen de uitleg is eigen tekst.
- **Voorbeelden uit haar wereld:** K-pop, fans, merch, photocards, tours, dansen. Alleen in tekst; geen afbeeldingen, logo's of songteksten van artiesten, geen echte namen van leden.
- **Voorlezen overal:** elk scherm heeft een voorleesknop (`.say` met `data-say`, of `App.sayButton`). Schrijf de voorleestekst voor het oor: korte zinnen die eindigen op een punt (de app leest per zin, met een pauze ertussen). Tekens als €, ×, −, =, §, H4 en haakjes zet `App.spreekbaar` zelf om; controleer bij twijfel met `App.spreekbaar("…")` in de browser.
- **Voorleestekst die ingesproken kan worden.** Elke vaste voorleestekst krijgt een opname (besluit 17). Zet wisselende stukken (tellers als "er staan 7 kaarten klaar", haar eigen antwoorden, datums) in een **apart deel**: `App.speak([vast, wisselend])` of `App.sayButton(knop, () => [vast, wisselend])`. Een telling met een beperkt aantal waarden kun je voor alle waarden laten inspreken; echt willekeurige tekst krijgt `{ audio: null }`. Anders verandert de vingerafdruk steeds en valt de hele zin terug op de robotstem.
- **Vaste stemmen.** Verteller: Sulafat (standaard). Personen in een chat krijgen `stem: "<Gemini-stem>"` in `personen`. Hergebruik bekende personen met hun stem (Sam = Puck, Mila = verteller). Een nieuw personage? Laat haar blind kiezen uit drie proefstemmen (zie stap 5b).
- **Korte zinnen.** Eén gedachte per zin. Vetgedrukt (`**...**`) alleen voor toetswoorden.
- **De app denkt niet voor haar.** Zij geeft de antwoorden; de app maakt materiaal en stelt vragen.
- **Geen overhoorspel, geen opdracht "leg het uit"** als losse vorm. Overhoren zit in de doe-versie, sorteren, kaarten, uit je hoofd tekenen en de toetstraining (zonder punten of tijd).
- **Bij twijfel over een begrip: vraag het vader.** Bijvoorbeeld als het boek een woord anders gebruikt dan gangbaar, als een foto onleesbaar is, of als twee bronnen verschillen. Gok niet.
- **Geen persoonlijke gegevens** in code of commitberichten: geen naam, cijfers, resultaten, en de toetsdatum niet in de code (die vult zij zelf in de app in).

## Stap 0 · Invoer controleren
Nodig: vak, hoofdstuknummer en -titel, het materiaal (foto's of samenvatting), de toetsdatum en de leerdoelen (of de toetsstof volgens de docent).
- Ontbreekt iets wezenlijks, of is de omvang onduidelijk (welke paragrafen tellen mee)? Vraag het eerst.
- Gebruik de toetsdatum alleen om de omvang te plannen: hoeveel dagen zijn er, past alles in een kwartier per dag?

## Stap 1 · Begrippen en toetswoorden uit het boek halen
- Maak per paragraaf een lijst: **term (letterlijk uit het boek)** · eigen uitleg in één of twee korte zinnen · eigen voorbeeld uit haar wereld · emoji als icoon.
- Haal ook de toetstaal eruit: welke soorten vragen stelt het boek (noem, leg uit, bereken, waarom, welke)?
- Formules: noteer ze precies in de woorden van het boek (zoals "omzet = afzet × verkoopprijs").
- Twijfel je over een begrip? Markeer het met ❓ en **vraag het vader voordat je verder bouwt**. Zonder twijfel bouw je door.

## Stap 2 · Per paragraaf de passende vorm kiezen
Kies vanuit de stof, niet vanuit de vorm. Haar voorkeur: plaat en filmpje eerst.

| Soort stof | Vorm | Waar staat de code |
|---|---|---|
| Twee kanten, voor- en nadelen, een tegenstelling | **chat** (twee personen) + **sorteren** in 2 bakken | `L.chat`, `L.sorteer` |
| Iets dat uit onderdelen bestaat (een plan, een opbouw) | **bouwplan** (blokken met tour-vergelijking) + **sorteren** | nu nog in `economie-h4.js` |
| Een schema of model met vakken (SWOT, kringloop, tabel) | **plaat** met kijk- en doe-versie + **sorteren** | `L.plaat` (blokken met `<span class="bl">`) |
| Een verloop in stappen, getallen die veranderen, oorzaak → gevolg | **filmpje** (scènes met beeld, jaartal en voorleestekst) | `L.filmpje` (staafjesfilm H4: eigen code) |
| Gebeurtenissen op volgorde van tijd | **tijdlijn** (rondes, tik wat het eerst kwam) | `L.tijdlijn` |
| Berekeningen | **rekenen**: kijk mee → samen → zelf | `L.rekenen` (kent nu alleen omzet → nettowinst) |

Overzicht van het hoofdstuk: `L.overzicht` (zie `geschiedenis-h1.js`). Altijd erbij, per hoofdstuk: **begrippenkaarten** (`L.kaarten`), **uit je hoofd tekenen** (`L.geheugen`) en **toetstraining** (`L.toets`).

Heeft een tweede hoofdstuk de plaat, het filmpje, het bouwplan of een ander soort rekenen nodig? Verplaats die vorm dan eerst naar `js/leren.js` (inhoud als data), in plaats van code te kopiëren. Overleg met vader als dat veel werk is.

Noteer de keuze per paragraaf in één regel voor je eindbericht aan vader ("§2: bouwplan + sorteren, want het hoofdstuk beschrijft vier onderdelen van ...").

## Stap 3 · Inhoud maken
Maak `js/modules/<vak>-h<nummer>.js` (bijvoorbeeld `geschiedenis-h3.js`) naar het model van `economie-h4.js`:
- **BEGRIPPEN**: `{ id, icoon, term, uitleg, voorbeeld }`. `term` letterlijk uit het boek.
- **VRAGEN** in toetstaal, door elkaar te oefenen, ongeveer 4 tot 6 per paragraaf:
  - `noem`: `{ id, par, type: "noem", vraag, antwoord, punten: [...] }`. Zet het aantal in de vraag ("Noem twee …").
  - `uitleg`: idem, met in `antwoord` het *omdat/want* en in `punten` wat er minimaal in moet.
  - `reken`: `{ ..., antwoord: <getal>, hint, uitwerking }`.
  - `keuze`: `{ ..., keuzes: [...], goed: <index>, uitleg }`.
  - Neem minstens één vraag op die het verschil vraagt tussen twee begrippen die op elkaar lijken; daar vallen punten.
- **GEHEUGEN** (uit-je-hoofd-platen): `{ id, icoon, titel, opdracht, model, check: [...] }`. Eén per kernschema. `model` is een eenvoudige HTML-weergave van wat er op de plaat hoort; `check` zijn de punten die ze daarna zelf afvinkt.
- **STATIONS** (de route door het hoofdstuk), **NAMEN**, `overzicht` met toetsdatum en lightstick, en `App.addModule({...})` met `id`, `vak`, `titel`, `sub`, `icoon`, `thuis: ["overzicht"]`, `meten` (de leervormen die vader wil laten beoordelen), `status()` en `onderdelen`.
- Bovenaan het bestand een opmerking: bron (methode en hoofdstuk), "eigen samenvattingen en voorbeelden, geen tekst uit het boek", en de opbouw per paragraaf.

## Stap 4 · Registreren
1. `index.html`: `<script src="js/modules/<bestand>.js"></script>` vóór `<script>App.start();</script>`.
2. `sw.js`: voeg `"./js/modules/<bestand>.js"` toe aan `CORE` en **verhoog `CACHE`** (bijvoorbeeld `leerplek-v4` → `leerplek-v5`).
3. `js/nieuw.js`: voeg bovenaan een regel toe, bijvoorbeeld `{ datum: "2026-12-01", tekst: "Nieuw: Geschiedenis H3. Start bij het Overzicht." }`.

## Stap 5 · Testen in iPad-formaat
```bash
python3 -m http.server 8123 >/dev/null 2>&1 &
node .claude/skills/leerplek-hoofdstuk/test-ipad.js <module-id> <scratchpad>/schermen
```
- Het script opent elk onderdeel staand en liggend op iPad-formaat en meldt JavaScript-fouten, lege onderdelen en schermen die breder zijn dan de iPad. Bij "LET OP: geen voorleesknop" moet je dat scherm nalopen.
- Bekijk de schermafdrukken zelf: past alles, is de tekst niet te lang, staat er geen boektekst?
- Speel minstens één keer met de hand door: sorteer een kaart fout en goed, maak een rekenronde af, beantwoord een toetsvraag van elk type.
- Zet de schermafdrukken in de scratchpad, nooit in de repository.

## Stap 5b · Inspreken (natuurlijke stem)
Doe dit pas als de teksten definitief zijn: elke tekstwijziging betekent opnieuw inspreken.
1. Server draaien op poort 8765, dan per scherm parallel verzamelen (sneller), bijvoorbeeld:
   `echo <module-id>-chat <module-id>-plaat … | tr ' ' '\n' | xargs -P5 -I{} sh -c "node tools/verzamel.js {} > <scratchpad>/v/{}.json"`
   en samenvoegen tot `tools/teksten.json` (dubbele sleutels eruit). Controleer het aantal per scherm: lijkt een scherm onvolledig (bijv. minder sorteerkaarten dan in de data), voeg dan in `VOORKEUR` in `tools/verzamel.js` de juiste knoppen voor die leervorm toe.
2. `python3 tools/maak-audio.py`: bundels van 12 teksten, knippen op de pauzes, opschonen, laten controleren. Daglimiet: 100 verzoeken per model per dag, het script schakelt zelf door naar het tweede model (samen 200). Een hoofdstuk kost ongeveer 15 verzoeken. Zijn beide op, dan stopt het; draai het de volgende dag opnieuw (bestaande opnames worden overgeslagen). Test niet onnodig met echte verzoeken: proefjes tellen mee voor de limiet.
3. Afgekeurde teksten blijven de iPad-stem. Kijk in de uitvoer waarom (vaak een Engels uitgesproken vakterm of een afgebroken woord) en draai ze nog eens.
4. Test of de schermen opnames afspelen (netwerkverzoeken naar `audio/z/` in Playwright) en dat de chat de juiste stem per persoon gebruikt.
5. Ruim opnames op die bij geen enkele tekst meer horen (oude vingerafdrukken), zodat de app niet onnodig groot wordt.

## Stap 6 · Documenten bijwerken en publiceren
Werk eerst `WENSEN.md` (onder Gedaan) en zo nodig `BESLUITEN.md` bij, zodat ze in dezelfde publicatie meegaan. Daarna:

1. **Test in iPad-formaat zonder fouten.** Verplicht: zonder geslaagde test wordt niets gepubliceerd. Draai ook `sh tools/check.sh` (syntaxcontrole van alle scripts, ook de hulpscripts in `tools/`).
2. **Privacycontrole:** loop `git diff` na op namen, cijfers, resultaten, boektekst en letterlijke tekst uit de ideeënbus of meting.
3. Commit op de werktak met een duidelijke Nederlandse boodschap, zonder persoonlijke gegevens. Push de werktak.
4. **Publiceer direct:** `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (nooit forceren). GitHub Pages zet het binnen ongeveer een minuut live; de iPad krijgt het bij de volgende keer openen.
5. Meld vader wat er nieuw is, met een korte controlelijst voor op haar iPad: app helemaal sluiten en opnieuw openen, en welke schermen ze samen aanklikken.
6. Gaat er iets mis op de iPad: `git revert <commit>` en meteen weer publiceren (stap 4). Meld wat er misging in `WENSEN.md`.

Noem in je eindbericht ook de vormkeuze per paragraaf.

## Klaar als
- [ ] Alle toetswoorden staan letterlijk zoals in het boek; twijfelgevallen zijn met vader besproken.
- [ ] Elke paragraaf heeft een leervorm; het hoofdstuk heeft kaarten, uit je hoofd tekenen en toetstraining.
- [ ] Geen boektekst, geen afbeeldingen van artiesten, geen persoonlijke gegevens.
- [ ] Elk scherm heeft een voorleesknop.
- [ ] Vaste voorleesteksten zijn ingesproken en gecontroleerd; wisselende stukken staan los.
- [ ] Geregistreerd in `index.html` en `sw.js`, `CACHE` verhoogd.
- [ ] Test in iPad-formaat zonder fouten.
- [ ] Privacycontrole gedaan, gepubliceerd naar `main`, controlelijst voor de iPad aan vader gestuurd.
