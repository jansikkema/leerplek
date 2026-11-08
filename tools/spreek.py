# Spreek een vaste tekst in met Gemini TTS (besluit 17).
# Gebruik: STIJL="" python3 tools/spreek.py Sulafat audio/<module>/<naam>.mp3 "<tekst>"
# - De sleutel zit NIET in de repository. In de werkomgeving van Claude voegt de netwerkproxy
#   de header x-goog-api-key toe; hier staat alleen een dummy.
# - Geef alleen kale tekst: aanwijzingen over toon worden hardop meegelezen. Zet daarom STIJL="".
# - Begin en eind worden automatisch opgeschoond met tools/schoon.py (Gemini zet daar een korte storing).
# - Controleer elk bestand met tools/hoor.py: het model laat soms het eerste woord weg.
import sys, json, base64, subprocess, urllib.request, tempfile, os
stem, uit, tekst = sys.argv[1], sys.argv[2], sys.argv[3]
MODEL = os.environ.get("TTS_MODEL", "gemini-3.8-flash-tts")
stijl = os.environ.get("STIJL") if os.environ.get("STIJL") is not None else "Lees dit voor in het Nederlands (Nederland), rustig, warm en duidelijk, als een vriendelijke uitleg voor een scholier van 15. Lees precies de tekst, niets toevoegen of weglaten:\n\n"
SYS = os.environ.get("SYS")
body = {"contents": [{"parts": [{"text": stijl + tekst}]}],
        **({"systemInstruction": {"parts": [{"text": SYS}]}} if SYS else {}),
        "generationConfig": {"responseModalities": ["AUDIO"],
          "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": stem}}}}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
  data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
try:
  r = json.load(urllib.request.urlopen(req, timeout=120))
except urllib.error.HTTPError as e:
  sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")
pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as f: f.write(pcm)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f.name, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "24000", "-b:a", "48k", uit], check=True)
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "schoon.py"), uit], check=True)   # storing aan begin en eind eraf
print(uit, round(len(pcm) / 48000, 1), "s")
