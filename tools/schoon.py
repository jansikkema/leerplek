# Haal de storing weg die Gemini TTS aan het begin en eind van elk fragment zet
# (een korte ruisuitbarsting vooraan en een luide ruisstaart achter de laatste stilte).
# Knipt bij de eerste en laatste stilte, fadet zacht in en uit en zet er een korte stilte omheen.
# Gebruik: python3 tools/schoon.py bestand.mp3 [meer.mp3 ...]   (overschrijft het bestand)
import sys, subprocess, struct, math
SR, F = 24000, 240                      # 10 ms per stukje
STIL = -45                              # dB: daaronder is het stilte

def lees(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return list(struct.unpack("<%dh" % (len(raw) // 2), raw))

def db(seg):
    r = math.sqrt(sum(v * v for v in seg) / len(seg)) if seg else 0
    return 20 * math.log10(r / 32768) if r else -120

def schoon(p):
    x = lees(p); fr = [db(x[i:i + F]) for i in range(0, len(x) - F, F)]
    stil = [d < STIL for d in fr]
    # begin: eerste stilte binnen 300 ms, dan de eerste spraak daarna
    b = next((i for i in range(min(30, len(stil))) if stil[i]), 0)
    b = next((i for i in range(b, len(stil)) if not stil[i]), b)
    # eind: laatste stilte van minstens 50 ms in de laatste 800 ms; knip daar
    e = len(stil)
    for i in range(len(stil) - 1, max(len(stil) - 80, b), -1):
        if all(stil[i - k] for k in range(5)):
            e = i - 4; break
    while e > b and stil[e - 1]: e -= 1     # tot het eind van de spraak
    s0, s1 = max(0, b * F - 2 * F), min(len(x), e * F + 6 * F)   # 20 ms ervoor, 60 ms erna
    y = x[s0:s1]; fade = 360                                       # 15 ms
    for i in range(min(fade, len(y))):
        g = i / fade; y[i] = int(y[i] * g); y[-1 - i] = int(y[-1 - i] * g)
    stilte = [0] * (SR // 8)                                       # 125 ms stilte voor en na
    y = stilte + y + stilte
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "48k", p],
                   input=struct.pack("<%dh" % len(y), *y), check=True)
    print(p, f"knip begin {s0 / SR:.2f}s, eind {(len(x) - s1) / SR:.2f}s eraf")

for p in sys.argv[1:]: schoon(p)
