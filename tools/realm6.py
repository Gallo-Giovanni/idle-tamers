# Sfondo a 6 livelli da un'immagine di ChatGPT con 6 strisce separate da nero:
# trova le strisce, rende trasparente il nero, riduce a pixel veri, rende ripetibile ogni striscia.
# uso: python3 tools/realm6.py immagine cartella_uscita [scala]
import sys, os, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from bg_layers import make
NAMES = ['c1', 'c2', 'mtn', 'mid', 'fg', 'gnd']
def strips(a):
    m = a.max(axis=2); fr = (m > 40).mean(axis=1); runs = []; s = None
    for y, v in enumerate(fr):
        if v > 0.01 and s is None: s = y
        if v <= 0.01 and s is not None:
            if y - s > 8: runs.append((s, y))
            s = None
    if s is not None: runs.append((s, len(fr)))
    return runs
def main(src, out, scale=3.3):
    a = np.array(Image.open(src).convert('RGB')).astype(float)
    runs = strips(a); print('strisce', runs)
    assert len(runs) == 6, 'servono 6 strisce separate'
    from scipy import ndimage
    m = a.max(axis=2)
    # trasparente solo il nero di sfondo collegato ai bordi e agli spazi tra le strisce: rocce e ombre scure dentro i disegni restano piene
    bgm = m < 34; lab, n = ndimage.label(bgm); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    for (y0, y1), (z0, z1) in zip(runs, runs[1:]): edge |= set(np.unique(lab[y1:z0])) - {0}
    al = (~np.isin(lab, list(edge))).astype(float)
    al = np.maximum(al, np.clip((m - 34) / 30, 0, 1))
    rgb = np.where(al[..., None] > 0.01, np.clip(a / np.maximum(al[..., None], 0.01), 0, 255), 0); rgb = np.where(al[..., None] >= 1, a, rgb)
    full = os.path.join(out, 'full.png'); Image.fromarray(np.dstack([rgb, al * 255]).astype('uint8'), 'RGBA').save(full)
    for n, (y0, y1) in zip(NAMES, runs):
        print(n, make(full, (0, max(0, y0 - 2), a.shape[1], min(a.shape[0], y1 + 2)), scale, os.path.join(out, n + '.png'), colors=int(sys.argv[4]) if len(sys.argv) > 4 else 128))
if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 3.3)
