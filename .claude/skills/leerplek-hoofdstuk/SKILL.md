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
- **Voorlezen overal:** elk scherm heeft een voorleesknop (`.say` met `data-say`, of `App.sayButton`). Schrijf de voorleestekst voor het oor: getallen voluit ("honderdvijftig"), geen haakjes of afkortingen.
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
- **Laat deze lijst aan vader zien voordat je verder bouwt.** Markeer elk begrip waar je twijfelt met ❓ en zeg waarom.

## Stap 2 · Per paragraaf de passende vorm kiezen
Kies vanuit de stof, niet vanuit de vorm. Haar voorkeur: plaat en filmpje eerst.

| Soort stof | Vorm | Waar staat de code |
|---|---|---|
| Twee kanten, voor- en nadelen, een tegenstelling | **chat** (twee personen) + **sorteren** in 2 bakken | `L.chat`, `L.sorteer` |
| Iets dat uit onderdelen bestaat (een plan, een opbouw) | **bouwplan** (blokken met tour-vergelijking) + **sorteren** | nu nog in `economie-h4.js` |
| Een schema of model met vakken (SWOT, kringloop, tabel) | **plaat** met kijk- en doe-versie + **sorteren** | nu nog in `economie-h4.js` |
| Een verloop in stappen, getallen die veranderen, oorzaak → gevolg | **filmpje** (scènes met voorleestekst) | nu nog in `economie-h4.js` |
| Berekeningen | **rekenen**: kijk mee → samen → zelf | `L.rekenen` (kent nu alleen omzet → nettowinst) |

Altijd erbij, per hoofdstuk: **begrippenkaarten** (`L.kaarten`), **uit je hoofd tekenen** (`L.geheugen`) en **toetstraining** (`L.toets`).

Heeft een tweede hoofdstuk de plaat, het filmpje, het bouwplan of een ander soort rekenen nodig? Verplaats die vorm dan eerst naar `js/leren.js` (inhoud als data), in plaats van code te kopiëren. Overleg met vader als dat veel werk is.

Leg de keuze per paragraaf in één regel voor aan vader ("§2: bouwplan + sorteren, want het hoofdstuk beschrijft vier onderdelen van ...").

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
3. Als het scherm "Wat is er nieuw" bestaat: voeg een regel toe ("Nieuw: Geschiedenis H3 …").

## Stap 5 · Testen in iPad-formaat
```bash
python3 -m http.server 8123 >/dev/null 2>&1 &
node .claude/skills/leerplek-hoofdstuk/test-ipad.js <module-id> <scratchpad>/schermen
```
- Het script opent elk onderdeel staand en liggend op iPad-formaat en meldt JavaScript-fouten, lege onderdelen en schermen die breder zijn dan de iPad. Bij "LET OP: geen voorleesknop" moet je dat scherm nalopen.
- Bekijk de schermafdrukken zelf: past alles, is de tekst niet te lang, staat er geen boektekst?
- Speel minstens één keer met de hand door: sorteer een kaart fout en goed, maak een rekenronde af, beantwoord een toetsvraag van elk type.
- Zet de schermafdrukken in de scratchpad, nooit in de repository.

## Stap 6 · Akkoord en pushen
1. Laat vader zien: de begrippenlijst (met ❓), de vormkeuze per paragraaf, en een paar schermafdrukken.
2. Pas na zijn akkoord: commit met een duidelijke Nederlandse boodschap ("Geschiedenis H3: …"), zonder persoonlijke gegevens.
3. Push naar de werktak van deze sessie. De site wordt pas bijgewerkt als die tak is samengevoegd met de tak waar GitHub Pages van publiceert (nu `main`). Dat samenvoegen gebeurt alleen op verzoek van vader.
4. Werk `WENSEN.md` (onder Gedaan) en zo nodig `BESLUITEN.md` bij.

## Klaar als
- [ ] Alle toetswoorden staan letterlijk zoals in het boek; twijfelgevallen zijn met vader besproken.
- [ ] Elke paragraaf heeft een leervorm; het hoofdstuk heeft kaarten, uit je hoofd tekenen en toetstraining.
- [ ] Geen boektekst, geen afbeeldingen van artiesten, geen persoonlijke gegevens.
- [ ] Elk scherm heeft een voorleesknop.
- [ ] Geregistreerd in `index.html` en `sw.js`, `CACHE` verhoogd.
- [ ] Test in iPad-formaat zonder fouten.
- [ ] Akkoord van vader, daarna gecommit en gepusht.
