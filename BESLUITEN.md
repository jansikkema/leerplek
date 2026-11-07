# Besluiten

Waarom de app is zoals hij is. Per besluit: wat we hebben besloten en waarom.
Nieuw besluit of een besluit terugdraaien? Zet het hier, met de datum, en laat het oude staan (doorgestreept) met de reden.

Let op: deze repository is openbaar. Hier staan geen persoonlijke gegevens, cijfers of resultaten.

---

## 1. Een app zonder AI
**Wat:** de app bevat geen chatbot en roept geen AI-dienst aan. Claude bouwt de app (via vader), maar de leerling gebruikt Claude zelf niet.
**Waarom:** Claude is pas vanaf 18 jaar. Daarnaast past het bij de didactiek: de app maakt materiaal en stelt vragen, de leerling denkt zelf. Een AI in de app zou dat denkwerk overnemen.

## 2. Openbare site op GitHub Pages, met strenge privacyregels
**Wat:** de app is een statische site op GitHub Pages, zonder server, zonder account en zonder buildstap. Repository en site zijn openbaar.
**Waarom:** gratis, geen beheer, en installeerbaar op de iPad via "Zet op beginscherm". Omdat alles openbaar is, gelden de regels uit CLAUDE.md: geen naam, foto's, tekeningen, cijfers of resultaten in de repository; geen gescande pagina's of letterlijke tekst uit lesboeken; geen afbeeldingen, logo's of songteksten van artiesten. `robots: noindex` houdt de site uit zoekmachines (dat is geen beveiliging, alleen minder vindbaar).

## 3. Opslag alleen op de iPad, met een wekelijkse back-up naar iCloud
**Wat:** tekeningen, aantekeningen, ideeën en voortgang staan alleen op de iPad (IndexedDB en localStorage). Via 'Mijn app' maakt ze een back-upbestand en bewaart dat met het deelmenu in Bestanden → iCloud Drive. Na 7 dagen zonder back-up verschijnt een herinnering op het beginscherm. Terugzetten voegt samen: het nieuwste wint, niets wordt overschreven.
**Waarom:** zonder server komt er niets persoonlijks buiten de iPad. Nadeel: Safari kan opslag van websites wissen, en een nieuwe iPad begint leeg. De wekelijkse back-up vangt dat op. Samenvoegen in plaats van vervangen voorkomt dat een oude back-up nieuw werk wist.

## 4. Toetstraining zonder punten en zonder tijd
**Wat:** de toetstraining geeft geen cijfer, geen score en geen klok. Na elke vraag kiest ze zelf: 😕 nog niet, 🤔 bijna of 😎 ken ik. Voortgang is zichtbaar als een lightstick die oplaadt.
**Waarom:** het doel is ophalen uit het geheugen oefenen, niet beoordelen. Punten en tijdsdruk maken van oefenen een toets en verhogen de drempel, zeker bij een lagere leessnelheid. Zelf inschatten stuurt de herhaling: wat ze nog niet kent, komt eerder terug.

## 5. Overhoren zit vermomd in vormen die zij leuk vindt
**Wat:** geen apart overhoorspel en geen opdracht "leg het uit". Overhoren zit in de doe-versie van een plaat (begrippen verstopt), uit je hoofd tekenen, sorteren en begrippenkaarten.
**Waarom:** zij koos zelf welke vormen ze wil; een overhoorspel en "zelf uitleggen" vielen af. Het effect van ophalen uit het geheugen (testing effect) blijft zo behouden, in een vorm die ze wél opent.

## 6. Geluid opnemen in de les: bewust niet gebouwd
**Wat:** de app neemt geen geluid op tijdens de les.
**Waarom:** opnemen legt ook de stem van de docent en klasgenoten vast, zonder hun toestemming. Veel scholen verbieden het in hun regels. Aantekeningen maken met de Pencil en huiswerk fotograferen kan wel.

## 7. Leervormen als herbruikbare bouwstenen in `js/leren.js`
**Wat:** chat, sorteren, begrippenkaarten, rekenen met afbouwende voorbeelden, toetstraining, uit je hoofd tekenen, herhaalplanning en de lightstick staan in `js/leren.js`. Een hoofdstuk in `js/modules/` levert alleen inhoud (data). `js/modules/economie-h4.js` is het voorbeeld.
**Waarom:** een nieuw hoofdstuk kost dan vooral inhoud, geen nieuwe code. Een verbetering aan een vorm werkt meteen in alle hoofdstukken.
**Nog niet af:** de plaat, het filmpje en het bouwplan zijn nog per hoofdstuk geschreven, en rekenen kent alleen de rekentrap van omzet naar nettowinst. Zie WENSEN.md.

## 8. Herhalen gespreid tot aan de toetsdatum
**Wat:** kaarten en vragen komen terug na 1, 2, 4 en 7 dagen (Leitner-systeem), en alles komt nog minstens één keer terug vóór de toetsdatum. Ze vult de toetsdatum zelf in de app in.
**Waarom:** gespreid herhalen is een van de best onderbouwde leerstrategieën. Elke dag een kwartier werkt beter dan één lange avond. De datum staat op de iPad, niet in de code.

## 9. Lage leesdrempel als ontwerpregel
**Wat:** voorleesknop op elk scherm, korte zinnen, het lettertype Atkinson Hyperlegible, tekstgrootte en extra letterruimte instelbaar.
**Waarom:** minder leeswerk betekent meer aandacht voor de stof. Voorlezen gebruikt de ingebouwde Nederlandse stem van de iPad, dus er gaat geen tekst naar een externe dienst.

## 10. Toetswoorden uit het boek zijn leidend
**Wat:** begrippen heten in de app precies zoals in haar boek. Uitleg en voorbeelden zijn eigen tekst.
**Waarom:** op de toets wordt het woord uit het boek gevraagd. Een synoniem uit de app kost dan punten. Eigen uitleg voorkomt het overnemen van boektekst.

## 11. Voorbeelden uit haar eigen wereld
**Wat:** voorbeelden komen uit de wereld van K-pop en fans (merch, photocards, tours, dansles), alleen in tekst.
**Waarom:** stof koppelen aan eigen interesses maakt het motiverender en beter te onthouden (context-personalisatie). Geen afbeeldingen, logo's of songteksten van artiesten, vanwege auteursrecht en privacy.

## 12. Zij is de eigenaar, via de ideeënbus
**Wat:** wensen komen uit de ideeënbus in de app. Vader brengt ze in, Claude bouwt, vader keurt goed voordat er iets online komt.
**Waarom:** het is haar app. Eigenaarschap houdt de app in gebruik. Vader bewaakt privacy en didactiek.

## 13. Geen pop-ups van de browser
**Wat:** geen `alert`, `confirm` of `prompt`; altijd `App.modal`.
**Waarom:** browserpop-ups zijn lelijk, niet voor te lezen en werken in een app op het beginscherm van de iPad niet altijd goed.

## 14. Na een update eerst het netwerk, daarna de bewaarde versie
**Wat:** de service worker (`sw.js`) haalt eerst de nieuwste versie op en valt pas terug op de bewaarde versie als er geen internet is.
**Waarom:** een update komt zo direct binnen, en de app werkt toch zonder internet. Bij nieuwe bestanden: toevoegen aan `CORE` en `CACHE` verhogen.
