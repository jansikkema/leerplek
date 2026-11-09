#!/bin/sh
# Snelle controle vóór elke publicatie: kloppen alle scripts nog (syntaxis)?
cd "$(dirname "$0")/.." || exit 1
fout=0
for f in sw.js js/*.js js/modules/*.js tools/*.js; do node --check "$f" || fout=1; done
for f in tools/*.py; do python3 -c "import ast,sys; ast.parse(open(sys.argv[1]).read())" "$f" || { echo "fout in $f"; fout=1; }; done
v=$(grep -o 'VERSIE = [0-9]*' js/app.js | grep -o '[0-9]*'); c=$(grep -o 'leerplek-v[0-9]*' sw.js | grep -o '[0-9]*$')
[ "$v" = "$c" ] || { echo "VERSIE ($v) en CACHE ($c) zijn niet gelijk"; fout=1; }
python3 -I tools/check-video.py || fout=1   # video's nog online en in de app af te spelen? (zonder internet: alleen een melding)
a1=$(grep -o 'AUDIO = "[^"]*"' sw.js | cut -d'"' -f2); a2=$(grep -o 'AUDIOCACHE = "[^"]*"' js/app.js | cut -d'"' -f2)
[ "$a1" = "$a2" ] || { echo "Naam opnameopslag verschilt: sw.js $a1, app.js $a2"; fout=1; }
[ $fout = 0 ] && echo "check: alles in orde"
exit $fout
