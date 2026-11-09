# Breng het spreektempo van de opnames naar een rustig niveau (besluit 17).
# In lange bundels gaat de stem sneller praten (gemeten: tot ~17 tekens per seconde, los ~13-14).
# Opnames sneller dan MAX worden vertraagd tot DOEL, met gelijke toonhoogte (ffmpeg atempo).
# Gebruik: python3 tools/tempo.py            (alle opnames uit tools/teksten.json; al rustige worden overgeslagen)
# maak-audio.py roept dit zelf aan na het inspreken.
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
DOEL, MAX, MIN_FACTOR, MARGE = 14.0, 14.5, 0.8, 0.25   # tekens per seconde; MARGE = stilte voor en na (schoon.py)
GEDAAN = os.path.join(HIER, "tempo-gedaan.json")   # opnames die al gemeten zijn: nooit twee keer bewerken

def duur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)

def rustig(x):
    f = os.path.join(ROOT, "audio", "z", x["sleutel"] + ".mp3")
    if not os.path.exists(f) or len(x["tekst"]) < 15: return None       # korte teksten: tempo niet betrouwbaar te meten
    d = duur(f) - MARGE
    if d <= 0: return None
    tps = len(x["tekst"]) / d
    if tps <= MAX: return None
    factor = max(MIN_FACTOR, DOEL / tps)
    tmp = f + ".tempo.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af", f"atempo={factor:.3f}", "-ar", "24000", "-ac", "1", "-b:a", "32k", tmp], check=True)
    os.replace(tmp, f)
    return round(tps, 1)

def alles():
    teksten = json.load(open(os.path.join(HIER, "teksten.json")))
    gedaan = set(json.load(open(GEDAAN))) if os.path.exists(GEDAAN) else set()
    nieuw = [x for x in teksten if x["sleutel"] not in gedaan and os.path.exists(os.path.join(ROOT, "audio", "z", x["sleutel"] + ".mp3"))]
    with ThreadPoolExecutor(8) as pool: r = [t for t in pool.map(rustig, nieuw) if t]
    json.dump(sorted(gedaan | {x["sleutel"] for x in nieuw}), open(GEDAAN, "w"), indent=0)
    print(len(r), "opnames vertraagd" + (f" (waren {min(r)}–{max(r)} tekens/s, nu ~{DOEL})" if r else ""))
    return len(r)

if __name__ == "__main__": alles()
