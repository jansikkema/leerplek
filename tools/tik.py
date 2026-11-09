# Haal losse tikken aan het begin van opnames weg (2026-11-09).
# Een tik = een korte uitschieter (hooguit 12 ms) vlak vóór de spraak, met stilte ervoor en minstens 24 ms rust erna.
# Begint de tekst met een plofklank (p, t, k, b, d), dan is zo'n uitschieter de klank zelf: die blijft staan.
# Gebruik: python3 tools/tik.py [--fix] [bestand.mp3 ...]   (zonder bestanden: alle opnames in audio/z)
# Zonder --fix alleen een lijst. Met --fix wordt de tik weggehaald (zacht in- en uitgefade stilte) en het bestand opnieuw bewaard.
# Let op: is een bestaande opname aangepast, verhoog dan het nummer van de opnameopslag (AUDIO in sw.js, AUDIOCACHE in app.js).
import sys, os, json, glob, subprocess, struct
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
SR, F = 24000, 48                      # 2 ms per stukje
PLOF = tuple("ptkbdPTKBD")

def lees(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return list(struct.unpack("<%dh" % (len(raw) // 2), raw))

def tikken(x, tot=0.4):
    pk = [max(abs(v) for v in x[i:i + F]) for i in range(0, len(x) - F, F)]
    n, i, uit = len(pk), 0, []
    while i < n and i * F / SR < tot:
        if pk[i] > 1500:
            j = i
            while j < n and pk[j] > 1500: j += 1
            na = 0
            while j + na + 2 < n and pk[j + na + 2] < 600 and na < 40: na += 1
            voor = 0
            while i - voor - 3 >= 0 and pk[i - voor - 3] < 600 and voor < 40: voor += 1
            if j - i <= 6 and na >= 12 and voor >= 12: uit.append((i, j))
            i = j
        else: i += 1
    return uit

def herstel(p, x, stukken):
    for i, j in stukken:
        a, b = max(0, (i - 3) * F), min(len(x), (j + 3) * F)
        r = 72                                   # 3 ms in- en uitfaden rond het stille stuk
        for k in range(a, b): x[k] = 0
        for k in range(r):
            if a - r + k >= 0: x[a - r + k] = int(x[a - r + k] * (1 - k / r))
            if b + k < len(x): x[b + k] = int(x[b + k] * k / r)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "48k", p],
                   input=struct.pack("<%dh" % len(x), *x), check=True)

if __name__ == "__main__":
    fix = "--fix" in sys.argv
    bestanden = [a for a in sys.argv[1:] if a != "--fix"] or sorted(glob.glob(os.path.join(ROOT, "audio", "z", "*.mp3")))
    try: tekst = {x["sleutel"]: x["tekst"] for x in json.load(open(os.path.join(HIER, "teksten.json")))}
    except Exception: tekst = {}
    for p in bestanden:
        k = os.path.basename(p)[:-4]; t = tekst.get(k, "")
        x = lees(p); s = tikken(x)
        if not s: continue
        if t.lstrip().startswith(PLOF) or not t:
            print(k, "uitschieter aan het begin, maar", "begint met een plofklank" if t else "tekst onbekend", "→ blijft |", t[:50]); continue
        print(k, "tik op", ", ".join(f"{i * F / SR:.3f}s" for i, _ in s), "→", "weggehaald" if fix else "gevonden", "|", t[:50])
        if fix: herstel(p, x, s)
