# Spreek alle verzamelde teksten in die nog geen geluid hebben (besluit 17).
#   1. node tools/verzamel.js > tools/teksten.json      (server draaiend in de hoofdmap)
#   2. python3 tools/maak-audio.py                       (maakt audio/z/<sleutel>.mp3 en js/ingesproken.js)
# Per tekst: inspreken met Gemini TTS, begin en eind opschonen, en laten controleren of alles gezegd is.
# Lukt de controle na 3 pogingen niet, dan komt de tekst niet in de lijst en leest de iPad-stem hem.
# De sleutel voor Gemini zit niet in de repository: de netwerkproxy van de werkomgeving voegt hem toe.
import json, os, sys, base64, subprocess, tempfile, urllib.request, time
from concurrent.futures import ThreadPoolExecutor

HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
Z = os.path.join(ROOT, "audio", "z"); os.makedirs(Z, exist_ok=True)
API = "https://generativelanguage.googleapis.com/v1beta/models/"
TTS, CHECK = "gemini-3.8-flash-tts", "gemini-3.8-flash"

def post(model, body):
    for poging in range(5):
        req = urllib.request.Request(API + model + ":generateContent", data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
        try: return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503): time.sleep(10 * (poging + 1)); continue
            raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:300]}")
        except Exception: time.sleep(10 * (poging + 1))
    raise RuntimeError("geen antwoord")

def inspreken(tekst, stem, uit):
    r = post(TTS, {"contents": [{"parts": [{"text": tekst}]}], "generationConfig": {"responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": stem}}}}})
    pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as f: f.write(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f.name,
                    "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "24000", "-b:a", "48k", uit], check=True)
    os.unlink(f.name)
    subprocess.run([sys.executable, os.path.join(HIER, "schoon.py"), uit], check=True, capture_output=True)

def klopt(tekst, mp3):
    b = base64.b64encode(open(mp3, "rb").read()).decode()
    r = post(CHECK, {"contents": [{"parts": [{"inlineData": {"mimeType": "audio/mp3", "data": b}}, {"text":
        "Dit geluid had precies deze tekst moeten voorlezen:\n\n" + tekst + "\n\nWordt de hele tekst uitgesproken, met alle woorden, "
        "ook het eerste en het laatste woord, en de juiste getallen? Kleine verschillen in leestekens tellen niet. "
        "Antwoord met JA, of met NEE en daarna wat er mist of anders is."}]}]})
    a = "".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]).strip()
    return a.upper().startswith("JA"), a

def maak(x):
    uit = os.path.join(Z, x["sleutel"] + ".mp3")
    if os.path.exists(uit): return x["sleutel"], "bestond al"
    tmp = uit + ".tmp.mp3"
    for poging in range(3):
        try:
            inspreken(x["tekst"], x["stem"], tmp)
            ok, a = klopt(x["tekst"], tmp)
            if ok: os.replace(tmp, uit); return x["sleutel"], f"goed (poging {poging + 1})"
        except Exception as e: a = str(e)
    if os.path.exists(tmp): os.unlink(tmp)
    return x["sleutel"], "MISLUKT: " + a[:200]

def lijst():
    ks = sorted(f[:-4] for f in os.listdir(Z) if f.endswith(".mp3") and ".tmp" not in f)
    with open(os.path.join(ROOT, "js", "ingesproken.js"), "w") as f:
        f.write("/* Gemaakt door tools/maak-audio.py – niet met de hand bewerken. Elke sleutel = audio/z/<sleutel>.mp3 */\n")
        f.write("self.INGESPROKEN = " + json.dumps(ks) + ";\n")
    return len(ks)

if __name__ == "__main__":
    teksten = json.load(open(os.path.join(HIER, "teksten.json")))
    mislukt = 0
    with ThreadPoolExecutor(3) as pool:
        for x, (k, uitslag) in zip(teksten, pool.map(maak, teksten)):
            if uitslag.startswith("MISLUKT"): mislukt += 1
            print(k, uitslag, "|", x["tekst"][:70], flush=True)
    print(lijst(), "ingesproken,", mislukt, "mislukt")
