# Strati di sfondo da un'immagine generata (es. ChatGPT): ritaglio, riduzione a pixel veri, giuntura invisibile, palette ridotta
import sys, numpy as np
from PIL import Image
def seamless(a, ov):
    # la coda si sovrappone all'inizio: dove c'è disegno in uno dei due resta pieno (niente nuvole o montagne tagliate),
    # dove ci sono entrambi i colori si mescolano gradualmente; la striscia si ripete senza giunture
    W = a.shape[1]; out = a[:, :W - ov].copy(); w = np.linspace(0, 1, ov)[None, :]
    A, Bv = a[:, W - ov:], a[:, :ov]                      # coda e inizio (alfa premoltiplicato)
    aa, ab = A[:, :, 3] / 255, Bv[:, :, 3] / 255
    wa, wb = aa * (1 - w), ab * w; s = np.maximum(wa + wb, 1e-6)
    al = np.maximum(aa, ab)
    rgbA = A[:, :, :3] / np.maximum(aa, 1e-6)[..., None]; rgbB = Bv[:, :, :3] / np.maximum(ab, 1e-6)[..., None]
    rgb = (rgbA * wa[..., None] + rgbB * wb[..., None]) / s[..., None]
    out[:, :ov, :3] = rgb * al[..., None]; out[:, :ov, 3] = al * 255
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
