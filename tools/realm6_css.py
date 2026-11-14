# genera il CSS dei 6 livelli di un regno e lo mette nel template al posto di quello vecchio
# uso: python3 tools/realm6_css.py rinf art/bg/inferno6 '#2a0d0a' 'linear-gradient(...)'
import sys, re, base64
from PIL import Image
cls, d, fill, sky = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
L = {n: Image.open(f'{d}/{n}.png').size for n in ['c1', 'c2', 'mtn', 'mid', 'fg', 'gnd']}
K = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0  # ingrandimento in scena (1 = pixel dell'immagine, nitido)
W = round(L['c1'][0] * K)
h = {n: round(L[n][1] * K) for n in L}
import numpy as np
def solid(n):  # altezza (css) della base piena di un livello: il livello dietro deve appoggiarsi lì sotto
    a = np.array(Image.open(f'{d}/{n}.png').convert('RGBA'))[..., 3]; cov = (a > 0).mean(axis=1); y = len(cov) - 1
    while y > 0 and cov[y] < 0.5: y -= 1  # righe vuote o sfrangiate in fondo
    top = y; low = 0
    while top >= 0 and low < 3:  # sale finché la striscia è piena (tollera 2 righe un po' bucate)
        low = low + 1 if cov[top] < 0.8 else 0; top -= 1
    return round((y - top - 3) * K)
S = {n: solid(n) for n in ['fg', 'mid', 'mtn']}
bg_ = h['gnd'] - 4; bf = bg_; bm = bf + max(6, S['fg'] - 4); bt = bm + max(6, S['mid'] - 4)
print('basi piene', S, 'bottom fg/mid/mtn', bf, bm, bt)
import io
def enc(n):  # WebP senza perdita: stessa nitidezza del PNG, file molto più leggero
    bf = io.BytesIO(); Image.open(f'{d}/{n}.png').save(bf, 'WEBP', quality=int(sys.argv[6]) if len(sys.argv) > 6 else 92, method=6); return base64.b64encode(bf.getvalue()).decode()
b = {n: enc(n) for n in L}
k = f'r6{cls}'
url = lambda n: f'url(data:image/webp;base64,{b[n]})'
css = f"""/* {cls}: sfondo a 6 livelli (strisce separate da ChatGPT, montate con tools/realm6.py) */
#scene .l6{{display:none}}
#scene.{cls}{{background:{sky}!important;animation:none}}
#scene.{cls} #stage{{height:100%}}
#scene.{cls} #stage>*:not(#units):not(.l6){{display:none!important}}
#scene.{cls} .l6{{display:block;position:absolute;left:0;right:0;image-rendering:auto;background-repeat:repeat-x;pointer-events:none}}
#scene.{cls} .l6.c1{{top:calc(var(--hh,52px) + 6px);height:{h['c1']}px;background-image:{url('c1')};background-size:{W}px {h['c1']}px;animation:{k} 170s linear infinite}}
#scene.{cls} .l6.c2{{top:calc(var(--hh,52px) + {h['c1'] - 10}px);height:{h['c2']}px;background-image:{url('c2')};background-size:{W}px {h['c2']}px;background-position-x:{W // 3}px;opacity:.9;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent);animation:{k} 115s linear infinite}}
#scene.{cls} .l6.mtn{{bottom:{bt}px;height:{h['mtn']}px;background-image:{url('mtn')};background-size:{W}px {h['mtn']}px;animation:{k} calc(130s / var(--ms,1)) linear infinite paused}}
#scene.{cls} .l6.mid{{bottom:{bm}px;height:{h['mid']}px;background-image:{url('mid')};background-size:{W}px {h['mid']}px;animation:{k} calc(48s / var(--ms,1)) linear infinite paused}}
#scene.{cls} .l6.fg{{bottom:{bf}px;height:{h['fg']}px;background-image:{url('fg')};background-size:{W}px {h['fg']}px;animation:{k} calc(22s / var(--ms,1)) linear infinite paused}}
#scene.{cls} .l6.gnd{{bottom:0;height:{h['gnd'] + 6}px;background:{url('gnd')} 0 0/{W}px {h['gnd']}px repeat-x,linear-gradient(transparent {h['gnd'] - 1}px,{fill} {h['gnd'] - 1}px);animation:{k} calc(14s / var(--ms,1)) linear infinite paused}}
#scene.{cls}.march .l6.mtn,#scene.{cls}.march .l6.mid,#scene.{cls}.march .l6.fg,#scene.{cls}.march .l6.gnd{{animation-play-state:running}}
@keyframes {k}{{from{{background-position-x:0}}to{{background-position-x:-{W}px}}}}
"""
p = 'src/template.html'; t = open(p).read()
t = re.sub(r'/\* ' + cls + r': sfondo a 6 livelli.*?@keyframes ' + k + r'\{[^\n]*\n', '', t, flags=re.S)  # rimpiazza la versione precedente
j = t.index('</style>'); t = t[:j] + css + t[j:]
if '<div class="l6 c1"' not in t:
    t = t.replace('<div id="units">', '<div class="l6 c1" aria-hidden="true"></div><div class="l6 c2" aria-hidden="true"></div><div class="l6 mtn" aria-hidden="true"></div><div class="l6 mid" aria-hidden="true"></div><div class="l6 fg" aria-hidden="true"></div><div class="l6 gnd" aria-hidden="true"></div><div id="units">', 1)
open(p, 'w').write(t); print('ok', W, h)
