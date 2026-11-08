# leerplek – projectregels

Persoonlijke leerapp ("leren met BTS") voor een leerling in havo 3, gebouwd door haar vader met Claude.
Zij is de eigenaar: zij bepaalt wat er komt (via de ideeënbus in de app), vader brengt de wensen in, Claude bouwt.

## Werkafspraak
- Direct publiceren: na een geslaagde test in iPad-formaat en een privacycontrole gaat een wijziging meteen naar `main` (GitHub Pages). Vader controleert daarna samen met zijn dochter op haar iPad. Gaat er iets mis: terugdraaien met `git revert` en opnieuw publiceren.
- Inhoudelijke twijfel (een begrip, een idee dat botst met een besluit, groot werk) wel eerst aan vader vragen.
- Besluiten staan in `BESLUITEN.md`, open wensen in `WENSEN.md`. Vaste werkwijzen: de skills `leerplek-hoofdstuk` en `leerplek-verbeteren` in `.claude/skills/`.

## Privacy en openbaarheid (deze repository en de site zijn openbaar)
- Geen persoonlijke gegevens in de repository: geen naam, foto's, tekeningen, cijfers of resultaten.
- Tekeningen, ideeën en scores blijven alleen op het apparaat (IndexedDB/localStorage).
- Geen gescande pagina's of letterlijke tekst uit lesboeken; alleen eigen samenvattingen en eigen voorbeelden.
- Geen afbeeldingen, logo's of songteksten van artiesten; de wereld van haar interesses mag als voorbeeldmateriaal in tekst.

## Didactische principes
- De app doet het denkwerk niet voor haar: materiaal maken en vragen stellen, zij geeft de antwoorden.
- Overhoren en zelf uitleggen zitten ingebouwd in vormen die zij leuk vindt (doe-versie, zelf tekenen), niet als quiz.
- Leesdrempel laag: voorleesknop op elk scherm, korte zinnen, Atkinson Hyperlegible, tekstgrootte en extra ruimte instelbaar.
- Toetswoorden uit haar boek zijn leidend; check begrippen tegen het boek.

## Opslag
- Alles staat in IndexedDB (`leerplek`, stores `tekeningen` en `notities`) en localStorage (`lp-*`), alleen op de iPad.
- Back-up: 'Mijn app' → JSON-bestand via het deelmenu naar Bestanden/iCloud Drive; terugzetten voegt samen (nieuwste wint, niets overschreven).
- Items in `notities` hebben `soort`: aantekening | huiswerk | document; pagina's met `strokes`, optioneel `foto` (JPEG dataURL) en `aspect`.
- PDF's worden met pdf.js (vendor/pdfjs, Apache 2.0) omgezet naar afbeeldingen per pagina (max 40).

## Techniek
- Statische site op GitHub Pages, geen buildstap. Installeerbaar op iPad via "Zet op beginscherm" (manifest.json, sw.js).
- `js/leren.js` bevat herbruikbare leervormen (chat, sorteren, begrippenkaarten, rekenen met afbouwende voorbeelden, toetstraining, uit-je-hoofd-tekenen, herhaalplanning naar toetsdatum, lightstick). Een nieuw hoofdstuk levert alleen inhoud (data) aan, zie `js/modules/economie-h4.js` als voorbeeld.
- `js/app.js` is de schil (beginscherm, tekenen, tekeningen, ideeënbus, thema, voorlezen, meten).
- Voorlezen: `App.speak` kiest de beste Nederlandse stem van de iPad (of haar keuze in 'Mijn app'), zet tekens om met `App.spreekbaar` en leest per zin.
- Ingesproken geluid (besluit 17): `App.speak` zoekt bij elke tekst een opname op via een vingerafdruk van stem + tekst (`App.sleutel`); de lijst staat in `js/ingesproken.js`, de bestanden in `audio/z/`. Geen opname, dan de iPad-stem. Standaardstem Sulafat; een persoon in de chat kan een eigen `stem` hebben (Sam: Puck). Werkwijze na elke tekstwijziging of nieuw hoofdstuk: server starten, `node tools/verzamel.js > tools/teksten.json` (per scherm kan ook, en parallel is sneller), dan `python3 tools/maak-audio.py` (inspreken, opschonen met `tools/schoon.py`, controleren, lijst bijwerken). Gewijzigde tekst = nieuwe vingerafdruk, dus opnieuw inspreken; oude bestanden mogen weg.
- `js/nieuw.js` bevat de regels voor het scherm "Wat is er nieuw"; voeg bij elke zichtbare verandering een regel toe.
- Elk hoofdstuk is een los bestand in `js/modules/` dat zich aanmeldt met `App.addModule({...})`; voeg het toe in `index.html` en in de lijst `CORE` in `sw.js`, en verhoog dan `CACHE`. Verhoog `CACHE` (sw.js) en `VERSIE` (app.js) bij elke publicatie altijd samen; de versie staat onderaan 'Mijn app'.
- Geen alert/confirm/prompt: gebruik `App.modal`.
