# Spreek alle verzamelde teksten in die nog geen geluid hebben (besluit 17).
#   1. node tools/verzamel.js > tools/teksten.json      (server draaiend in de hoofdmap)
#   2. python3 tools/maak-audio.py                       (maakt audio/z/<sleutel>.mp3 en js/ingesproken.js)
# Daglimiet: 100 verzoeken per model per dag. Daarom:
#  - bundels: tot 12 teksten met dezelfde stem in één verzoek; Gemini laat tussen alinea's een lange pauze,
#    daar knippen we. Lukt knippen niet, dan wordt de bundel gehalveerd en opnieuw geprobeerd.
#  - twee modellen: is de daglimiet van het eerste op, dan gaat het verder met het tweede (klinken gelijk).
#  - afgekeurde teksten gaan eerst opnieuw in bundels, pas daarna los.
# Per stuk: begin en eind opschonen, en laten controleren of alles gezegd is.
# Lukt het niet, dan komt de tekst niet in de lijst en leest de iPad-stem hem.
# De sleutel voor Gemini zit niet in de repository: de netwerkproxy van de werkomgeving voegt hem toe.
import json, os, sys, base64, subprocess, tempfile, urllib.request, time, struct, math, threading
from concurrent.futures import ThreadPoolExecutor

HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
Z = os.path.join(ROOT, "audio", "z"); os.makedirs(Z, exist_ok=True)
API = "https://generativelanguage.googleapis.com/v1beta/models/"
# Eerst het lichte model (goedkoper), dan het gewone; ze klinken op het gehoor gelijk (getest 2026-11-08).
MODELLEN = os.environ.get("TTS_MODELLEN", "gemini-3.8-flash-lite-tts,gemini-3.8-flash-tts").split(",")
CHECK = "gemini-3.8-flash"
model_nu, slot = [0], threading.Lock()
class DagLimiet(Exception): pass
# Limieten per spraakmodel (Tier 1, AI Studio → Rate limits): 10 verzoeken per minuut, 10.000 tokens per minuut
# (25 tokens per seconde geluid), 100 per dag. Ook GEWEIGERDE verzoeken tellen mee voor de dag, dus nooit
# tegen de minuutlimiet aan botsen: het script wacht zelf. Ruim onder de grens blijven: 8 per minuut.
PER_MINUUT = int(os.environ.get("PER_MINUUT", 8))
tijden = {}
def wacht_beurt(model):
    """Houd per model hooguit PER_MINUUT verzoeken in de laatste 60 seconden."""
    while True:
        with slot:
            nu = time.time(); t = [x for x in tijden.get(model, []) if nu - x < 60]
            if len(t) < PER_MINUUT: t.append(nu); tijden[model] = t; return
            wacht = 60 - (nu - t[0]) + 0.5
        time.sleep(wacht)
DOEL = os.environ.get("DOEL", Z); os.makedirs(DOEL, exist_ok=True)
BUNDEL, MAXTEKENS = int(os.environ.get("BUNDEL", 12)), 1600   # 1600 tekens ≈ 2 min geluid ≈ 3.000 tokens: ruim onder 10.000 per minuut
verzoeken = {}

def post(model, body):
    spraak = model in MODELLEN
    for poging in range(5):
        if spraak: wacht_beurt(model)
        req = urllib.request.Request(API + model + ":generateContent", data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
        try: return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            tekst = e.read().decode()
            if e.code == 429 and "per_day" in tekst: raise DagLimiet(model)
            if e.code == 429 and spraak:   # minuutlimiet toch geraakt: een volle minuut wachten, telt anders weer mee
                print("minuutlimiet geraakt bij", model, "- even wachten", flush=True); time.sleep(65); continue
            if e.code in (429, 500, 502, 503): time.sleep(10 * (poging + 1)); continue
            raise RuntimeError(f"HTTP {e.code}: {tekst[:300]}")
        except Exception: time.sleep(10 * (poging + 1))
    raise RuntimeError("geen antwoord")

def tts(tekst, stem):
    while True:
        i = model_nu[0]
        if i >= len(MODELLEN): raise DagLimiet("alle modellen")
        try:
            r = post(MODELLEN[i], {"contents": [{"parts": [{"text": tekst}]}], "generationConfig": {"responseModalities": ["AUDIO"],
                    "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": stem}}}}})
            with slot: verzoeken[MODELLEN[i]] = verzoeken.get(MODELLEN[i], 0) + 1
            return base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        except DagLimiet:
            with slot:
                if model_nu[0] == i:
                    model_nu[0] += 1
                    print("daglimiet van", MODELLEN[i], "bereikt" + (", verder met " + MODELLEN[i + 1] if i + 1 < len(MODELLEN) else ""), flush=True)

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
    """Spreek een bundel in en knip; geeft de teksten terug die nog niet gelukt zijn.
    Lukt het knippen niet, dan worden beide helften apart geprobeerd."""
    try:
        stukken = knip(tts("\n\n".join(x["tekst"] for x in groep), groep[0]["stem"]), len(groep))
    except DagLimiet: return groep
    except Exception as e:
        print("bundel mislukt:", e, flush=True); stukken = None
    if stukken is None:
        if len(groep) == 1: return groep
        h = len(groep) // 2; print(f"bundel van {len(groep)} niet te knippen, in tweeën", flush=True)
        return maak_bundel(groep[:h]) + maak_bundel(groep[h:])
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
        except DagLimiet: return False
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
    print(len(over), "opnieuw in bundels; eerste ronde klaar na", round(time.time() - t0), "s", flush=True)
    if over and model_nu[0] < len(MODELLEN):
        with ThreadPoolExecutor(4) as pool: over = [x for r in pool.map(maak_bundel, bundels(over)) for x in r]
    print(len(over), "los opnieuw", flush=True)
    mislukt = 0
    if model_nu[0] < len(MODELLEN):
        with ThreadPoolExecutor(3) as pool: mislukt = sum(1 for ok in pool.map(maak_los, over) if not ok)
    else: mislukt = len(over); print("daglimiet van alle modellen bereikt; draai het script morgen opnieuw", flush=True)
    print("totaal", round(time.time() - t0), "s; verzoeken:", verzoeken)
    if DOEL == Z: print(lijst(), "ingesproken,", mislukt, "mislukt")
    else: print("proef klaar in", DOEL, ";", mislukt, "mislukt")
