# Strati di sfondo da un'immagine generata (es. ChatGPT): ritaglio, riduzione a pixel veri, giuntura invisibile, palette ridotta
import sys, numpy as np
from PIL import Image
def seamless(a, ov):
    # sovrappone la coda all'inizio con una dissolvenza: la striscia si ripete senza giunture
    W = a.shape[1]; out = a[:, :W - ov].copy(); w = np.linspace(0, 1, ov)[None, :, None]
    out[:, :ov] = a[:, W - ov:] * (1 - w) + a[:, :ov] * w
    return out
def make(src, box, scale, out, ov=0.12, colors=40):
    s = Image.open(src).convert('RGBA').crop(box)
    W, H = s.size; w, h = round(W / scale), round(H / scale)
    a = np.array(s).astype(float); al = a[:, :, 3:4] / 255; a[:, :, :3] *= al  # alfa premoltiplicato
    small = np.array(Image.fromarray(a.clip(0, 255).astype('uint8'), 'RGBA').resize((w, h), Image.LANCZOS) if scale != 1 else Image.fromarray(a.clip(0, 255).astype('uint8'), 'RGBA')).astype(float)
    if ov: small = seamless(small, int(w * ov))
    al = small[:, :, 3:4] / 255; rgb = np.where(al > 0.02, small[:, :, :3] / np.maximum(al, 0.02), 0)
    alpha = (small[:, :, 3] > (230 if scale == 1 else 110)).astype('uint8') * 255  # a piena risoluzione si taglia il bordo scuro sfumato verso il nero
    im = Image.fromarray(np.dstack([rgb.clip(0, 255).astype('uint8'), alpha]), 'RGBA')
    if not colors: im.save(out); return im.size  # 0 = tutti i colori dell'originale
    q = im.convert('RGB').quantize(colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGBA')
    q.putalpha(Image.fromarray(alpha)); q.save(out); return q.size
if __name__ == '__main__':
    print(make(sys.argv[1], tuple(map(int, sys.argv[2].split(','))), float(sys.argv[3]), sys.argv[4]))
