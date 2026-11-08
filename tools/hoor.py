# Controle: laat Gemini uitschrijven wat er in een mp3 gezegd wordt.
# Gebruik: python3 tools/hoor.py audio/<module>/<naam>.mp3
import sys, json, base64, urllib.request
b = base64.b64encode(open(sys.argv[1], "rb").read()).decode()
body = {"contents": [{"parts": [{"inlineData": {"mimeType": "audio/mp3", "data": b}},
  {"text": "Schrijf letterlijk uit wat er gezegd wordt (Nederlands), woord voor woord. Let ook op het allereerste en allerlaatste woord."}]}]}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/" + (sys.argv[2] if len(sys.argv)>2 else "gemini-3.8-flash") + ":generateContent",
  data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
try: r = json.load(urllib.request.urlopen(req, timeout=120))
except urllib.error.HTTPError as e: sys.exit(f"HTTP {e.code}: {e.read().decode()[:400]}")
print("".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]))
