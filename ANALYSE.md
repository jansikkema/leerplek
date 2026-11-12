# Analyse en voorstellen (2026-11-12)

Een doorlichting van de app, de werkwijze en de skills, op verzoek van vader. Bedoeld als naslag voor volgende sessies.

**Status: dit zijn voorstellen, geen besluiten.** Bouw hier niets van uit eigen beweging. Vader kiest wat doorgaat; pas dan gaat het naar `WENSEN.md` (werkvoorraad) of `BESLUITEN.md` (besluit). Zet bij een voorstel dat is opgepakt de datum en de uitkomst erbij.

Let op: deze repository is openbaar. Dit bestand beschrijft alles in neutrale woorden; persoonlijke achtergrond staat hier niet en hoort hier niet.

Onderzocht: `BESLUITEN.md`, `WENSEN.md`, beide skills, `js/app.js`, `js/leren.js`, de modules, `sw.js`, de hulpscripts, en alle 61 schermen in iPad-formaat in een testbrowser (niet op haar iPad).

---

## 1. Hoofdlijn

De app is didactisch sterk en technisch verzorgd. Het knelpunt is niet bouwen maar toetsen bij haar.

Langs de keten VOC → Visie → CTQ → Nulmeting → Programma:

| Schakel | Stand op 2026-11-12 | Oordeel |
|---|---|---|
| VOC (haar stem) | Ideeënbus werkt; 7 van de 31 regels in `js/nieuw.js` hebben `idee: true` | Aanwezig, maar de meeste trek komt van vader en Claude |
| Visie | 23 besluiten, onderbouwd | Sterk |
| CTQ (wat moet beter) | Niet benoemd | Open vraag aan vader, zie §6 |
| Nulmeting | Ontbreekt | Grootste gat |
| Programma | 36 versies en 3 hoofdstukken in 5 dagen | Loopt voor op de rest |

In `WENSEN.md` wachten 14 punten op controle op haar iPad. Dat is voorraad die de gebruiker nog niet heeft afgenomen.

## 2. Bevindingen

### Privacy
- **P1 · Oude versies.** Zie `WENSEN.md`, Gedaan 2026-11-07 ("Privacy"). Vader legt aan haar voor of dat zo mag blijven. Zo niet: een nieuwe repository met exact dezelfde naam (dan blijft het adres van de site gelijk en blijven haar gegevens op de iPad staan; vooraf een back-up maken). Niet uit eigen beweging de geschiedenis herschrijven.
- **P2 · Lettertype komt van Google.** `index.html` laadt Atkinson Hyperlegible van fonts.googleapis.com bij elke start. Dat botst met "geen tik = geen contact met Google" (besluit 18). Bij een eerste start zonder internet valt de app terug op Verdana, want het lettertype staat niet in `CORE`.

### Opslag
- **O1 · Stil gegevensverlies mogelijk.** `L.kaarten` bewaart per begrip haar woorden, de lijnen en een miniatuur in localStorage (`lp-kaart-<mod>-<id>`). Safari staat daar ongeveer 5 MB toe, en `store.set` in `js/app.js` slikt een schrijffout zonder melding. Bij ruwweg honderd kaarten met tekening raakt dat vol.
- **O2 · Terugzetten voegt instellingen niet samen.** `zetTerug` neemt een `lp-`-sleutel uit de back-up alleen over als die op de iPad nog niet bestaat. Voor tekeningen en notities geldt "nieuwste wint", voor voortgang dus niet. Op een nieuwe iPad geen probleem.

### Didactiek
- **D1 · Planning drijft op eigen oordeel.** `Voortgang.beoordeel` krijgt bij open vragen alleen 😕 🤔 😎. Leerlingen overschatten zichzelf daarbij structureel (Dunlosky & Rawson, 2012). De afvinkpunten (`punten`) staan er wel, maar tellen niet mee.
- **D2 · Uit je hoofd tekenen telt niet mee.** `L.geheugen` bewaart alleen `laatst`. De sterkste ophaalvorm laadt de lightstick niet op en stuurt de planning niet; de afvinkpunten bij vergelijken worden niet bewaard.
- **D3 · Herhalen stopt bij de toets.** Langste tussenpoos is 7 dagen (`[0, 1, 2, 4, 7]`), daarna gaat het hoofdstuk naar Gedaan. De stof komt terug in toetsweken en in de bovenbouw.
- **D4 · De echte toets komt niet terug in de app.** Er is geen plek om na een toets vast te leggen wat misging en waardoor (niet geweten, verkeerd gelezen, tijd, slordig).
- **D5 · De app plant en kiest voor haar.** Dat verlaagt de drempel, maar ze leert zo niet hoe ze zelf leert. Alles voor haar bouwen schaalt ook niet: tien vakken is zestig tot tachtig hoofdstukken per jaar.
- **D6 · Formuleren van open antwoorden.** Geschiedenis heeft 15 uitlegvragen; op de toets moet ze die schrijven. De app oefent het ophalen, niet het opschrijven in toetstaal. (Redenering, geen onderzoek naar deze app.)

### Leesbaarheid (gemeten met `tools/meet-leesbaarheid.js`)

| Meting | Uitkomst | Richtlijn |
|---|---|---|
| Regellengte | tot 80–91 tekens (schetsbord, video, overzicht) | 60–70 tekens |
| Tekst kleiner dan 16 px | 177 elementen, deels in hoofdletters (`.vak-tag`, `.eyebrow`, `.vk-tekst small`) | minimaal 16 px, geen hoofdletterlabels |
| Contrast te laag | 39 keer in thema Nacht (vooral `.par-badge`, 2,6–3,8 : 1), 173 keer in Zacht (meestal 4,0–4,3 : 1) | 4,5 : 1 |
| Knoppen kleiner dan 44 px | ongeveer 80 (kleine chips 42 px, `.say-mini` 38 px) | 44 px |
| Woorden per scherm | plaat §1.2 361, oorzaak-lab 366, "Wat is er nieuw" 752 | zo kort mogelijk |

- **L1 · Extra letterruimte staat standaard uit.** Het is het enige typografische middel met redelijk bewijs bij zwakke lezers (Zorzi e.a., 2012); speciale lettertypes voegen niets toe (Kuster e.a., 2018). Atkinson Hyperlegible is een prima keuze.
- **L2 · Cursief** voor haar eigen woorden op de achterkant van een kaart (`<i>` in `L.kaarten`); dat leest slechter.
- **L3 · "Wat is er nieuw" leest als logboek voor de bouwer**: 31 regels in 5 dagen, deels technisch.

### Gebruiksgemak
- **G1 · Geen dagplan over hoofdstukken heen.** Elk hoofdstuk heeft een eigen "Vandaag" (`L.overzicht`). Het beginscherm toont per hoofdstuk "vandaag 6 kaarten, 8 vragen"; zij moet zelf kiezen waar ze begint.
- **G2 · Blokken "voor papa" in haar app**: twee per hoofdstukoverzicht (meten en "waarom werkt het zo").
- **G3 · Meten hangt aan vader.** `meetBlock` vraagt sterren, "uit zichzelf nog eens geopend?" en wat ze nog weet. Dat is een schatting achteraf; de app kan openen en heropenen zelf tellen.

### Onderhoud
- **T1 · Omvang geluid.** 28 MB voor drie hoofdstukken (766 bestanden); de Git-opslag was na vijf dagen 38 MB, mede door vervangen opnames. Bij twintig hoofdstukken per jaar komt de grens van GitHub Pages (1 GB) in zicht.
- **T2 · Verzamelaar is niet voorspelbaar.** `tools/verzamel.js` klikt willekeurig rond, met voorkeuren per schermnaam (`VOORKEUR`, tot en met `film11`…`film16`). Een gemiste tekst valt ongemerkt terug op de iPad-stem.
- **T3 · Skills en CLAUDE.md lopen uit elkaar.** `leerplek-hoofdstuk` noemt `economie-h4.js` als voorbeeld (regel 8 en stap 3); `CLAUDE.md` zegt `geschiedenis-h1.js`. De publicatiestappen staan dubbel in beide skills. De alinea over geluid in `CLAUDE.md` is één zin van ruim 250 woorden waarin regels en geschiedenis door elkaar staan.
- **T4 · Controle heeft gaten.** `tools/check.sh` controleert niet of elke module uit `index.html` ook in `CORE` staat. Alleen `wiskunde-h1` heeft `_test`. Er is geen controle op de inhoud zelf (zinslengte, komt elk begrip terug in een vraag of sorteerkaart).
- **T5 · Naam.** "leren met BTS" staat in `index.html` en `manifest.json`. Privé geen punt; bij delen met anderen wel (merknaam).

## 3. Voorstellen

Werk: klein (een uur of minder), middel (een sessie), groot (meerdere sessies).

### Nu: klein en zeker, raakt geen besluit
| Nr | Voorstel | Lost op | Werk |
|---|---|---|---|
| 1 | Oude versies: aan haar voorleggen, daarna niets doen of nieuwe repository | P1 | besluit van haar en vader |
| 2 | Lettertype zelf meeleveren (de licentie staat dat toe) en opnemen in `CORE` | P2 | klein |
| 3 | Kaarttekeningen naar IndexedDB, bestaande gegevens meeverhuizen; schrijffout zichtbaar maken | O1 | klein tot middel (opslag: extra zorg, besluit 15) |
| 4 | Leesronde: lopende tekst maximaal ongeveer 65 tekens breed, niets onder 16 px, geen hoofdletterlabels, cursief weg, contrast van `.par-badge` en thema Zacht herstellen, kleine knoppen naar 44 px. Daarna opnieuw meten. | leesbaarheid, L2 | klein |
| 5 | Afvinkpunten laten meetellen in het oordeel (alles aangevinkt = ken ik, deels = bijna; zij mag bijstellen); uit je hoofd tekenen laten meetellen in lightstick en planning | D1, D2 | klein |

### Daarna: één sessie per stuk
| Nr | Voorstel | Lost op | Werk |
|---|---|---|---|
| 6 | Eén "Vandaag" op het beginscherm: een kwartier, samengesteld over alle hoofdstukken, gewogen naar toetsdatum. Grootste winst voor gebruiksgemak en didactiek tegelijk. | G1 | middel |
| 7 | Onderhoudsstand na de toets: tussenpozen van 14, 30 en 60 dagen, hoofdstukken door elkaar | D3 | middel |
| 8 | Meten zonder vader: de app telt lokaal wat ze opent en heropent, en stelt een dag later zelf drie controlevragen. Blokken "voor papa" naar één eigen scherm. | G2, G3, nulmeting | middel |
| 9 | "Toets terug": na een toets noteert zij per fout de soort. Blijft op de iPad. | D4 | middel |
| 10 | Meelezen met oplichtende zin (staat al in `WENSEN.md`). Voorlezen met meelezen heeft een bescheiden, aangetoond effect op tekstbegrip (Wood e.a., 2018). | leesdrempel | middel |
| 11 | Voorleesteksten rechtstreeks uit de data afleiden (elke leervorm geeft zijn teksten op) in plaats van rondklikken. Levert ook een inhoudscontrole op: zinslengte, en of elk begrip in minstens één vraag of sorteerkaart terugkomt. | T2, T4 | groot |
| 12 | Skills opschonen: derde skill `leerplek-inspreken`, één gedeeld publicatiestuk, `CLAUDE.md` terug naar alleen regels, voorbeeldmodule overal `geschiedenis-h1.js`, één opdracht die alle tests draait, `check.sh` vergelijkt `index.html` met `CORE` | T3, T4 | middel |
| 13 | Geluid buiten de hoofdgeschiedenis houden (eigen repository of tak) vóór de omvang knelt | T1 | middel |

### Werkwijze
| Nr | Voorstel | Waarom |
|---|---|---|
| 14 | Weekritme in plaats van direct publiceren voor nieuwe dingen: één versie per week, tien minuten samen kijken, zij kiest het volgende punt. Reparaties blijven direct. "Klaar" betekent: gezien op haar iPad. Raakt besluit 15. | 36 versies in 5 dagen kan zij niet bijhouden; 14 punten wachten op controle |
| 15 | "Wat is er nieuw" alleen in haar taal, hooguit één regel per dag; technische regels naar het commitbericht | L3 |
| 16 | Nulmeting vóór verdere uitbouw: leertijd per toets, hoe zeker ze zich voelt, gebruik van de app. Resultaten blijven buiten de repository. Vakken zonder app zijn de vergelijking. | CTQ en nulmeting ontbreken |

## 4. Haar sterke kanten benutten

Uitgangspunt: niet vertellen dat moeite met lezen een verborgen talent is; daar is weinig bewijs voor, en een puber prikt erdoorheen. Wel onderbouwd: zelfkennis, initiatief, doorzetten en doelen stellen voorspellen later succes beter dan IQ of cijfers (Raskind e.a., 1999, twintig jaar gevolgd). Daar zit de kans. Alles hieronder blijft op de iPad.

| Nr | Idee | Kern |
|---|---|---|
| 17 | "Zo leer ik"-kaart | Zij stelt uit haar eigen gegevens één pagina samen: wat werkt voor mij, wat heb ik van een docent nodig. Die geeft ze zelf aan haar mentor. |
| 18 | Eigen uitlegfilmpje als slot van een hoofdstuk | Procreate neemt het tekenen zelf op als versneld filmpje; zij spreekt erbij in. Leren door uitleggen (Fiorella & Mayer, 2013) in een vorm die ze wel kiest. Past bij besluit 5 (vermomd), anders dan de afgewezen opdracht "leg het uit". |
| 19 | Mede-onderzoeker | Zij bedenkt zelf een proef ("onthoud ik meer van plaat of filmpje?"); de app meet het een dag later (voorstel 8). |
| 20 | Lege hoofdstukken die zij zelf vult | Eigen begrippen, eigen platen. Zelf materiaal maken is de vaardigheid voor de bovenbouw, en lost D5 op. Past bij besluit 1 (geen AI in de app). |
| 21 | Zij als maker van de app | Haar tekenstijl voor iconen of poppetjes. Botst nu met de regel "geen tekeningen in de repository": eerst een bewust besluit van haar en vader. |
| 22 | Profielkeuze | "Ik ontwerp mijn eigen leerapp" als materiaal voor dat gesprek dit schooljaar. |

## 5. Delen met anderen of commercieel

Stelling: de code is niet het schaarse goed. Schaars zijn de werkwijze (van boek naar hoofdstuk in één sessie, met onderbouwde leervormen) en het eigenaarschap van de leerling.

| Route | Kern | Belemmering |
|---|---|---|
| A · Werkwijze delen | Open sjabloon plus handleiding voor ouder en kind | Weinig omzet; vooral een praktijkverhaal over eigenaarschap en meten |
| B · Makersversie | Lege app waarin leerling, ouder of remedial teacher zelf inhoud zet; scholen als kanaal | Vraagt een bewerkscherm en een echte iPad-app (lost meteen de stemmenkwestie uit besluit 16 op) |
| C · Inhoud per lesmethode | Kant-en-klare hoofdstukken | Rechten van uitgevers, vakinhoudelijke controle, aansprakelijkheid. Alleen op open lesmateriaal of met een uitgever. Juridisch laten toetsen; dit is een inschatting, geen advies. |

Voor alle routes: de naam (T5) kan niet mee, en "haar wereld" (besluit 11) moet een instelling worden. Lokale opslag zonder account (besluit 3) is bij minderjarigen juist een sterk punt.

Advies: nu niet. Eerst de nulmeting (16) en een half jaar gegevens bij haar, dan twee of drie andere leerlingen laten meedoen. Zonder dat is elke belofte ongefundeerd.

## 6. Open vragen aan vader

1. Oude versies (voorstel 1): wat vindt zij?
2. Welke kwaliteitseisen gelden voor haar: cijfers, leertijd, stress, zelfstandigheid? Daar hangt de nulmeting (16) aan.
3. Mogen voorstellen 2 tot en met 5 als eerste gebouwd worden?
4. Weekritme (14): past dat, of blijft direct publiceren de regel?

## 7. Bronnen

Alleen genoemd waar onderzoek bestaat; de rest is redenering vanuit de code en de metingen.

- Dunlosky & Rawson (2012): wie zijn eigen kennis overschat, stopt te vroeg met oefenen.
- Fiorella & Mayer (2013): leren door uit te leggen aan een ander.
- Kuster e.a. (2018): speciale lettertypes verbeteren het lezen niet.
- Raskind, Goldberg, Higgins & Herman (1999): eigenschappen die succes op lange termijn voorspellen.
- Wood, Moxley, Tighe & Wagner (2018): meta-analyse over voorleeshulpmiddelen en tekstbegrip.
- Zorzi e.a. (2012): extra letterruimte helpt zwakke lezers.
- Richtlijn 60–70 tekens per regel, geen cursief, geen hoofdletters: gangbare richtlijnen voor leesbare tekst.

## 8. Opnieuw meten

```bash
python3 -m http.server 8123 >/dev/null 2>&1 &
node tools/meet-leesbaarheid.js
```

Eerste meting (2026-11-12, versie 36): zie de tabel in §2. Draai het script opnieuw na de leesronde (voorstel 4) en zet de nieuwe cijfers hier onder.
