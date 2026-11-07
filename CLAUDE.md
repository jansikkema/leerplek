# leerplek – projectregels

Persoonlijke leerapp ("leren met BTS") voor een leerling in havo 3, gebouwd door haar vader met Claude.
Zij is de eigenaar: zij bepaalt wat er komt (via de ideeënbus in de app), vader brengt de wensen in, Claude bouwt.

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

## Techniek
- Statische site op GitHub Pages, geen buildstap. Installeerbaar op iPad via "Zet op beginscherm" (manifest.json, sw.js).
- `js/app.js` is de schil (beginscherm, tekenen, tekeningen, ideeënbus, thema, meten).
- Elk hoofdstuk is een los bestand in `js/modules/` dat zich aanmeldt met `App.addModule({...})`; voeg het toe in `index.html` en in de lijst `CORE` in `sw.js`, en verhoog dan `CACHE`.
- Geen alert/confirm/prompt: gebruik `App.modal`.
