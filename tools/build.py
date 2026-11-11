#!/usr/bin/env python3
"""Costruisce index.html unendo src/template.html + src/core.js + src/ui.js."""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
t = (root/'src/template.html').read_text(encoding='utf-8')
t = t.replace('/*CORE*/', (root/'src/core.js').read_text(encoding='utf-8'))
t = t.replace('/*UI*/', (root/'src/ui.js').read_text(encoding='utf-8'))
pwa = ('<link rel="manifest" href="manifest.webmanifest">\n'
       '<meta name="theme-color" content="#0B0E24">\n'
       '<meta name="mobile-web-app-capable" content="yes">\n'
       '<meta name="apple-mobile-web-app-capable" content="yes">\n'
       '<link rel="apple-touch-icon" href="icons/icon-192.png">\n'
       '<link rel="icon" href="icons/icon-192.png">\n')
t = t.replace('</head>', pwa + '</head>', 1)
sw = ("<script>try{if('serviceWorker' in navigator)navigator.serviceWorker"
      ".register('sw.js').catch(function(){});}catch(e){}</script>\n")
t = t.replace('</body>', sw + '</body>', 1)
import datetime
stamp = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1))).strftime('%d/%m %H:%M')
t = t.replace('/*BUILD*/', stamp)
(root/'index.html').write_text(t, encoding='utf-8')
print('index.html costruito')
