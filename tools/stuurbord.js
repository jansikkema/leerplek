// Stuurbord voor vader: een besloten pagina op claude.ai (bron: tools/stuurbord/pagina.html) met een eigen kleine database.
// Dit script zet de documenten uit de repository klaar als JSON, zodat Claude ze met het gereedschap ArtifactData
// in de database van het stuurbord kan zetten (collectie "documenten").
// Gebruik:  node tools/stuurbord.js <map>     → schrijft <map>/documenten/<id>.json
// Eerste keer: per bestand 'set'. Daarna 'update' (met if_version), dan blijft een wijziging van vader ('concept') staan.
// De punten op het bord (collectie "items"), de vragen ("vragen") en de stand ("stand/nu") staan alleen in de database;
// die werkt Claude aan het eind van een sessie rechtstreeks bij.
const fs = require("fs"), path = require("path");
const HOOFD = path.join(__dirname, "..");
const TAK = process.env.LP_TAK || "main";
const link = pad => `https://github.com/jansikkema/leerplek/blob/${TAK}/${pad}`;
const map = pad => `https://github.com/jansikkema/leerplek/tree/${TAK}/${pad}`;

const G1 = "Afspraken en geheugen", G2 = "Vaste werkwijzen (skills)", G3 = "De app zelf", G4 = "Gereedschap van Claude";
const DOCS = [
  { id: "claude", groep: G1, titel: "Huisregels voor Claude", pad: "CLAUDE.md", lees: true, wat: "Wordt aan het begin van elke chat automatisch gelezen: werkafspraak, privacy, didactiek, techniek." },
  { id: "besluiten", groep: G1, titel: "Besluiten", pad: "BESLUITEN.md", lees: true, wat: "Waarom de app is zoals hij is. Elk besluit met de reden erbij." },
  { id: "wensen", groep: G1, titel: "Wensen", pad: "WENSEN.md", lees: true, wat: "De werkvoorraad: wat nog open staat en wat klaar is." },
  { id: "analyse", groep: G1, titel: "Analyse en voorstellen", pad: "ANALYSE.md", lees: true, wat: "De doorlichting van 12 november met 22 genummerde voorstellen." },
  { id: "skill-hoofdstuk", groep: G2, titel: "Nieuw hoofdstuk maken", pad: ".claude/skills/leerplek-hoofdstuk/SKILL.md", lees: true, wat: "Draaiboek: van foto's of een samenvatting uit het boek naar een hoofdstuk in de app." },
  { id: "skill-verbeteren", groep: G2, titel: "Idee of meting verwerken", pad: ".claude/skills/leerplek-verbeteren/SKILL.md", lees: true, wat: "Draaiboek: van ideeënbus of meetresultaat naar een verbetering." },
  { id: "app-schil", groep: G3, titel: "De schil", pad: "js/app.js", wat: "Beginscherm, navigatie, voorlezen, tekenen, ideeënbus, back-up." },
  { id: "app-leervormen", groep: G3, titel: "De leervormen", pad: "js/leren.js", wat: "Herbruikbare bouwstenen: chat, sorteren, kaarten, schetsbord, stap voor stap, toetstraining." },
  { id: "app-hoofdstukken", groep: G3, titel: "De hoofdstukken", pad: "js/modules", ismap: true, wat: "Per hoofdstuk één bestand met alleen inhoud: Economie H4, Geschiedenis H1, Wiskunde H1." },
  { id: "app-nieuw", groep: G3, titel: "Wat is er nieuw", pad: "js/nieuw.js", wat: "De regels die zij in de app ziet onder 'Wat is er nieuw'." },
  { id: "app-geluid", groep: G3, titel: "Ingesproken stemmen", pad: "audio/z", ismap: true, wat: "De opnames per zin. Welke tekst welke opname heeft, staat in js/ingesproken.js." },
  { id: "app-offline", groep: G3, titel: "Werken zonder internet", pad: "sw.js", wat: "Zorgt dat de app ook zonder wifi start en dat een nieuwe versie binnenkomt." },
  { id: "tools", groep: G4, titel: "Hulpscripts", pad: "tools", ismap: true, wat: "Controle vóór publiceren, teksten verzamelen, inspreken, leesbaarheid meten, dit stuurbord." },
  { id: "tests", groep: G4, titel: "Tests", pad: ".claude/skills/leerplek-hoofdstuk", ismap: true, wat: "Proefdraaien in iPad-formaat, sommen controleren, starten bij slechte wifi." }
];

const uit = process.argv[2];
if (!uit) { console.error("Gebruik: node tools/stuurbord.js <map>"); process.exit(1); }
fs.mkdirSync(path.join(uit, "documenten"), { recursive: true });
const nu = new Date().toISOString();
DOCS.forEach((d, i) => {
  const doc = { titel: d.titel, groep: d.groep, pad: d.pad, wat: d.wat, volgorde: i + 1, link: d.ismap ? map(d.pad) : link(d.pad) };
  if (d.lees) {
    const f = path.join(HOOFD, d.pad);
    if (!fs.existsSync(f)) { console.error("ontbreekt:", d.pad); return; }
    doc.tekst = fs.readFileSync(f, "utf8"); doc.bijgewerkt = nu;
  }
  fs.writeFileSync(path.join(uit, "documenten", d.id + ".json"), JSON.stringify(doc, null, 1));
});
console.log(`${DOCS.length} documenten klaargezet in ${path.join(uit, "documenten")} (links naar tak ${TAK})`);
