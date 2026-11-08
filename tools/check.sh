#!/bin/sh
# Snelle controle vóór elke publicatie: kloppen alle scripts nog (syntaxis)?
cd "$(dirname "$0")/.." || exit 1
fout=0
for f in sw.js js/*.js js/modules/*.js tools/*.js; do node --check "$f" || fout=1; done
for f in tools/*.py; do python3 -c "import ast,sys; ast.parse(open(sys.argv[1]).read())" "$f" || { echo "fout in $f"; fout=1; }; done
v=$(grep -o 'VERSIE = [0-9]*' js/app.js | grep -o '[0-9]*'); c=$(grep -o 'leerplek-v[0-9]*' sw.js | grep -o '[0-9]*$')
[ "$v" = "$c" ] || { echo "VERSIE ($v) en CACHE ($c) zijn niet gelijk"; fout=1; }
[ $fout = 0 ] && echo "check: alles in orde"
exit $fout
