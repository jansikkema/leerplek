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
- `js/leren.js` bevat herbruikbare leervormen (chat, sorteren, begrippenkaarten, rekenen met afbouwende voorbeelden, toetstraining, uit-je-hoofd-tekenen, herhaalplanning naar toetsdatum, lightstick, tijdlijn, filmpje met scènes, plaat met kijk- en doe-versie, video, overzicht van een hoofdstuk, schetsbord: uitlegfilmpje dat per zin meetekent, bouwstenen in `L.schets`; voorbeeld `js/modules/wiskunde-h1.js`). Video's van YouTube alleen na goedkeuring van vader (besluit 18); `tools/check-video.py` controleert ze. Een nieuw hoofdstuk levert alleen inhoud (data) aan, zie `js/modules/geschiedenis-h1.js` als voorbeeld (gebruikt alleen vormen uit `leren.js`; `economie-h4.js` heeft nog eigen plaat, filmpje en bouwplan).
- `js/app.js` is de schil (beginscherm, tekenen, tekeningen, ideeënbus, thema, voorlezen, meten) en bouwt de navigatie in een hoofdstuk (besluit 19): overzicht → paragraaf (`#<mod>-p<n>`, uit `stations`) → stap, plus Oefenen als apart deel. De terugknop gaat één niveau omhoog. Hoofdstukken staan op het beginscherm in Bezig/Toekomst/Gedaan (`lp-fase`, zij kiest; anders automatisch) en per vak (kleur in `VAKKLEUR`).
- Voorlezen: `App.speak` kiest de beste Nederlandse stem van de iPad (of haar keuze in 'Mijn app'), zet tekens om met `App.spreekbaar` en leest per zin.
- Ingesproken geluid (besluit 17): `App.speak` zoekt bij elke tekst een opname op via een vingerafdruk van stem + tekst (`App.sleutel`); de lijst staat per hoofdstuk in `js/ingesproken.js`, de bestanden in `audio/z/`. Geen opname, dan de iPad-stem. Opnames staan op de iPad in een eigen, blijvende opslag (`leerplek-audio`, wordt bij een nieuwe versie niet gewist) en worden per hoofdstuk geladen zodra het wordt geopend. Tekst met een wisselend deel: geef `App.speak`/`App.sayButton` een lijst `[vast, wisselend]`; tellers ("Er staan N …") zijn voor alle aantallen ingesproken. Willekeurige tekst (sommen in Zelf rekenen): `{ audio: null }`, dan wordt hij nooit ingesproken. Standaardstem Sulafat; een persoon in de chat kan een eigen `stem` hebben (Sam: Puck). Werkwijze na elke tekstwijziging of nieuw hoofdstuk: server starten, `node tools/verzamel.js > tools/teksten.json` (per scherm kan ook, en parallel is sneller), dan `python3 tools/maak-audio.py` (bundels per scherm, max. 12 teksten per verzoek, zodat zinnen die na elkaar klinken uit één opname komen; wordt er één afgekeurd, dan het hele scherm opnieuw; knippen op de pauzes, gehalveerd als knippen niet lukt; bij de daglimiet van 100 verzoeken van het lichte model automatisch verder met het gewone model, samen 200 per dag; het script blijft onder 8 verzoeken per minuut, want geweigerde verzoeken tellen ook mee; een hoofdstuk kost ongeveer 15 verzoeken; daarna opschonen met `tools/schoon.py`, controleren, lijst bijwerken). **Opnames nooit achteraf vertraagd of versneld** (te vreemde effecten, besluit 17). Worden bestaande opnames aangepast (zelfde naam), verhoog dan het nummer van de opnameopslag (`AUDIO` in sw.js en `AUDIOCACHE` in app.js, gelijk; `tools/check.sh` controleert dat), anders houdt de iPad de oude versies. Gewijzigde tekst = nieuwe vingerafdruk, dus opnieuw inspreken; oude bestanden mogen weg.
- `js/nieuw.js` bevat de regels voor het scherm "Wat is er nieuw"; voeg bij elke zichtbare verandering een regel toe.
- Elk hoofdstuk is een los bestand in `js/modules/` dat zich aanmeldt met `App.addModule({...})`; voeg het toe in `index.html` en in de lijst `CORE` in `sw.js`, en verhoog dan `CACHE`. Verhoog `CACHE` (sw.js) en `VERSIE` (app.js) bij elke publicatie altijd samen; de versie staat onderaan 'Mijn app'.
- Geen alert/confirm/prompt: gebruik `App.modal`.
- Vóór elke publicatie: `sh tools/check.sh` (syntaxis van alle scripts, VERSIE gelijk aan CACHE).
