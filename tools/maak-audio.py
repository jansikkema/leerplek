# Spreek alle verzamelde teksten in die nog geen geluid hebben (besluit 17).
#   1. node tools/verzamel.js > tools/teksten.json      (server draaiend in de hoofdmap)
#   2. python3 tools/maak-audio.py                       (maakt audio/z/<sleutel>.mp3 en js/ingesproken.js)
# Teksten met dezelfde stem gaan in bundels (max 8 per verzoek): Gemini laat tussen alinea's een lange pauze,
# daar knippen we. Zo past een heel hoofdstuk ruim in de daglimiet van 100 verzoeken.
# Per stuk: begin en eind opschonen, en laten controleren of alles gezegd is. Afgekeurd = later los opnieuw.
# Lukt de controle na 3 pogingen niet, dan komt de tekst niet in de lijst en leest de iPad-stem hem.
# De sleutel voor Gemini zit niet in de repository: de netwerkproxy van de werkomgeving voegt hem toe.
import json, os, sys, base64, subprocess, tempfile, urllib.request, time, struct, math
from concurrent.futures import ThreadPoolExecutor

HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
Z = os.path.join(ROOT, "audio", "z"); os.makedirs(Z, exist_ok=True)
API = "https://generativelanguage.googleapis.com/v1beta/models/"
# Licht model: klinkt op het gehoor gelijk aan gemini-3.8-flash-tts (getest 2026-11-08) en is goedkoper.
TTS, CHECK = os.environ.get("TTS_MODEL", "gemini-3.8-flash-lite-tts"), "gemini-3.8-flash"
DOEL = os.environ.get("DOEL", Z); os.makedirs(DOEL, exist_ok=True)
BUNDEL, MAXTEKENS = 8, 1000

def post(model, body):
    for poging in range(5):
        req = urllib.request.Request(API + model + ":generateContent", data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
        try: return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            tekst = e.read().decode()
            if e.code == 429 and "per_day" in tekst: raise SystemExit("Daglimiet van " + model + " bereikt; morgen verder.")
            if e.code in (429, 500, 502, 503): time.sleep(10 * (poging + 1)); continue
            raise RuntimeError(f"HTTP {e.code}: {tekst[:300]}")
        except Exception: time.sleep(10 * (poging + 1))
    raise RuntimeError("geen antwoord")

def tts(tekst, stem):
    r = post(TTS, {"contents": [{"parts": [{"text": tekst}]}], "generationConfig": {"responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": stem}}}}})
    return base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])

def bewaar(pcm, uit):
    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as f: f.write(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f.name,
                    "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "24000", "-b:a", "32k", uit], check=True)
    os.unlink(f.name)
    subprocess.run([sys.executable, os.path.join(HIER, "schoon.py"), uit], check=True, capture_output=True)

def inspreken(tekst, stem, uit): bewaar(tts(tekst, stem), uit)

def knip(pcm, n):
    """Knip in n stukken bij de n-1 langste stiltes. None als die niet duidelijk langer zijn dan de rest."""
    if n == 1: return [pcm]
    x = struct.unpack("<%dh" % (len(pcm) // 2), pcm); F = 240
    fr = [math.sqrt(sum(v * v for v in x[i:i + F]) / F) for i in range(0, len(x) - F, F)]
    stil = [20 * math.log10(max(1, r) / 32768) < -45 for r in fr]
    st, i = [], 0
    while i < len(stil):
        if stil[i]:
            j = i
            while j < len(stil) and stil[j]: j += 1
            if i > 0 and j < len(stil): st.append((j - i, i, j))
            i = j
        else: i += 1
    st.sort(reverse=True)
    if len(st) < n - 1: return None
    gekozen, rest = st[:n - 1], st[n - 1:]
    if min(g[0] for g in gekozen) < 45 or (rest and min(g[0] for g in gekozen) < 1.5 * rest[0][0]): return None
    grenzen = [0] + sorted(((a + b) // 2) * F * 2 for _, a, b in gekozen) + [len(pcm)]
    return [pcm[grenzen[k]:grenzen[k + 1]] for k in range(n)]

def klopt(tekst, mp3):
    b = base64.b64encode(open(mp3, "rb").read()).decode()
    r = post(CHECK, {"contents": [{"parts": [{"inlineData": {"mimeType": "audio/mp3", "data": b}}, {"text":
        "Dit geluid had precies deze tekst moeten voorlezen:\n\n" + tekst + "\n\nWordt de hele tekst uitgesproken, met alle woorden, "
        "ook het eerste en het laatste woord, en de juiste getallen? Kleine verschillen in leestekens tellen niet. "
        "Antwoord met JA, of met NEE en daarna wat er mist of anders is."}]}]})
    a = "".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]).strip()
    return a.upper().startswith("JA"), a

def doel(x): return os.path.join(DOEL, x["sleutel"] + ".mp3")

def controleer(x, tmp):
    ok, a = klopt(x["tekst"], tmp)
    if ok: os.replace(tmp, doel(x))
    elif os.path.exists(tmp): os.unlink(tmp)
    return ok, a

def maak_bundel(groep):
    """Spreek een bundel in en knip; geeft de teksten terug die nog niet gelukt zijn."""
    try:
        stukken = knip(tts("\n\n".join(x["tekst"] for x in groep), groep[0]["stem"]), len(groep))
    except Exception as e:
        print("bundel mislukt:", e, flush=True); return groep
    if stukken is None: print("bundel niet te knippen, los opnieuw", flush=True); return groep
    def stuk(paar):   # opschonen en controleren, alle stukken van een bundel tegelijk
        x, pcm = paar; tmp = doel(x) + ".tmp.mp3"
        try:
            bewaar(pcm, tmp); ok, a = controleer(x, tmp)
        except Exception as e: ok, a = False, str(e)
        print(x["sleutel"], "goed (bundel)" if ok else "afgekeurd: " + a[:120], "|", x["tekst"][:60], flush=True)
        return None if ok else x
    with ThreadPoolExecutor(len(groep)) as pool: return [x for x in pool.map(stuk, zip(groep, stukken)) if x]

def maak_los(x):
    for poging in range(2):
        tmp = doel(x) + ".tmp.mp3"
        try:
            inspreken(x["tekst"], x["stem"], tmp); ok, a = controleer(x, tmp)
        except Exception as e: ok, a = False, str(e)
        if ok: print(x["sleutel"], f"goed (los, poging {poging + 1})", "|", x["tekst"][:60], flush=True); return True
    print(x["sleutel"], "MISLUKT: " + a[:150], "|", x["tekst"][:60], flush=True); return False

def bundels(xs):
    groepen = []
    for stem in sorted({x["stem"] for x in xs}):
        g = []
        for x in [x for x in xs if x["stem"] == stem]:
            if g and (len(g) >= BUNDEL or sum(len(y["tekst"]) for y in g) + len(x["tekst"]) > MAXTEKENS): groepen.append(g); g = []
            g.append(x)
        if g: groepen.append(g)
    return groepen

def lijst():
    """Schrijf js/ingesproken.js: per hoofdstuk (module-id) de sleutels, zodat de app ze per hoofdstuk kan voorladen."""
    ks = sorted(f[:-4] for f in os.listdir(Z) if f.endswith(".mp3") and ".tmp" not in f)
    modules = sorted((f[:-3] for f in os.listdir(os.path.join(ROOT, "js", "modules")) if f.endswith(".js")), key=len, reverse=True)
    waar = {}
    try:   # bestaande indeling bewaren voor sleutels die niet (meer) in teksten.json staan
        oud = open(os.path.join(ROOT, "js", "ingesproken.js")).read(); oud = json.loads(oud[oud.index("INGESPROKEN =") + 13:].strip().rstrip(";"))
        if isinstance(oud, dict): waar = {k: d for d, l in oud.items() for k in l}
    except Exception: pass
    try:
        for x in json.load(open(os.path.join(HIER, "teksten.json"))):
            waar[x["sleutel"]] = next((m for m in modules if x["waar"] == m or x["waar"].startswith(m + "-")), "app")
    except Exception: pass
    per = {}
    for k in ks: per.setdefault(waar.get(k, "app"), []).append(k)
    with open(os.path.join(ROOT, "js", "ingesproken.js"), "w") as f:
        f.write("/* Gemaakt door tools/maak-audio.py – niet met de hand bewerken. Per hoofdstuk de sleutels; bestand = audio/z/<sleutel>.mp3 */\n")
        f.write("self.INGESPROKEN = " + json.dumps(per, indent=1) + ";\n")
    return len(ks)

if __name__ == "__main__":
    teksten = json.load(open(os.path.join(HIER, "teksten.json")))
    if len(sys.argv) > 1: teksten = teksten[:int(sys.argv[1])]
    nog = [x for x in teksten if not os.path.exists(doel(x)) and not os.path.exists(os.path.join(Z, x["sleutel"] + ".mp3"))]
    print(len(nog), "teksten nog in te spreken", flush=True); t0 = time.time()
    with ThreadPoolExecutor(4) as pool: over = [x for r in pool.map(maak_bundel, bundels(nog)) for x in r]
    print(len(over), "los opnieuw; bundels klaar na", round(time.time() - t0), "s", flush=True)
    with ThreadPoolExecutor(3) as pool: mislukt = sum(1 for ok in pool.map(maak_los, over) if not ok)
    print("totaal", round(time.time() - t0), "s")
    if DOEL == Z: print(lijst(), "ingesproken,", mislukt, "mislukt")
    else: print("proef klaar in", DOEL, ";", mislukt, "mislukt")
