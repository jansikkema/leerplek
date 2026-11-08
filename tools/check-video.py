# Controleer de YouTube-video's in de hoofdstukken (besluit 18): bestaan ze nog, mogen ze in de app worden
# afgespeeld, en klopt de titel nog met wat vader heeft goedgekeurd?
#   python3 tools/check-video.py              → alle video's uit js/modules/*.js
#   python3 tools/check-video.py <id> [...]   → losse video's (bij het zoeken van kandidaten)
# Video's staan in de modules als  video: { id: "...", titel: "...", kanaal: "...", ... }.
# Gebruikt het oEmbed-adres van YouTube: 200 = bestaat en mag ingesloten worden, 401 = insluiten verboden, 404 = weg.
# Werkt alleen als www.youtube.com bereikbaar is (in de werkomgeving 'leerplek' toegestaan).
import sys, os, re, json, glob, urllib.request, urllib.error, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def oembed(vid):
    u = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote("https://www.youtube.com/watch?v=" + vid)
    try: return 200, json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "leerplek-check"}), timeout=20))
    except urllib.error.HTTPError as e: return e.code, None
    except Exception as e: return 0, {"fout": str(e)}

def uit_modules():
    for f in sorted(glob.glob(os.path.join(ROOT, "js", "modules", "*.js"))):
        for m in re.finditer(r'video:\s*\{\s*id:\s*"([\w-]{11})",\s*titel:\s*"([^"]*)"', open(f, encoding="utf-8").read()):
            yield os.path.basename(f), m.group(1), m.group(2)

if __name__ == "__main__":
    fout = 0
    if len(sys.argv) > 1:
        for vid in sys.argv[1:]:
            code, o = oembed(vid)
            print(f"{vid}  {code}  {(o or {}).get('title', '')}  · {(o or {}).get('author_name', '')}")
    else:
        n = 0
        for f, vid, titel in uit_modules():
            n += 1; code, o = oembed(vid)
            if code == 0: print(f"LET OP: YouTube niet bereikbaar, {vid} niet gecontroleerd ({o['fout'][:80]})")
            elif code != 200: print(f"FOUT {f}: video {vid} ({titel}) is weg of mag niet in de app (code {code})"); fout = 1
            elif o["title"].strip() != titel.strip(): print(f"LET OP {f}: titel van {vid} is veranderd: '{o['title']}' (goedgekeurd: '{titel}')")
        print(f"check-video: {n} video's gecontroleerd" + (", fouten gevonden" if fout else ""))
    sys.exit(fout)
