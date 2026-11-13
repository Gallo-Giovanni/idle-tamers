# Rune animate in pixel art (16x16, 8 frame): pietra scura con un glifo che pulsa di luce e una scintilla
import math, json, sys
from PIL import Image
OUT = '/home/claude/idle-tamers/art/rune/'
RUNES = [('noncomune', '#6CCB5F'), ('rara', '#5B9BFF'), ('epica', '#B07CF0'), ('leggendaria', '#F2994A'), ('mitico', '#FFD34D'), ('astrale', '#FF7AD9'), ('arcano', '#E8334F')]
def line(a, b):
    (x0, y0), (x1, y1) = a, b; n = max(abs(x1 - x0), abs(y1 - y0)); return [(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n)) for i in range(n + 1)] if n else [a]
def L(*segs):
    s = set()
    for a, b in segs: s.update(line(a, b))
    return s
GLYPH = {
 'noncomune': L(((7, 4), (7, 11)), ((8, 6), (10, 4)), ((8, 8), (10, 6))),                       # fehu
 'rara': L(((6, 5), (6, 11)), ((6, 4), (8, 4)), ((9, 5), (10, 7)), ((10, 7), (10, 11))),         # uruz
 'epica': L(((6, 4), (6, 11)), ((7, 6), (9, 7)), ((9, 8), (7, 9))),                              # thurisaz
 'leggendaria': L(((6, 4), (6, 11)), ((7, 5), (9, 7)), ((7, 8), (9, 10))),                       # ansuz
 'mitico': L(((8, 4), (10, 6)), ((10, 6), (8, 8)), ((8, 8), (6, 6)), ((6, 6), (8, 4)), ((7, 9), (6, 11)), ((9, 9), (10, 11))),  # othala
 'astrale': L(((8, 5), (8, 11)), ((7, 6), (6, 4)), ((9, 6), (10, 4))),                           # algiz
 'arcano': L(((10, 4), (6, 7)), ((6, 7), (10, 9)), ((10, 9), (6, 12)))}                          # sowilo
def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def frame(key, col, f, N=8):
    im = Image.new('RGBA', (16, 16)); px = im.load(); c = hx(col)
    inside = lambda x, y: ((x - 7.5) / 6.6) ** 2 + ((y - 8.2) / 7.2) ** 2 <= 1
    for y in range(16):
        for x in range(16):
            if inside(x, y):
                edge = not (inside(x - 1, y) and inside(x + 1, y) and inside(x, y - 1) and inside(x, y + 1))
                base = mix((92, 86, 120), (40, 36, 62), y / 15)
                if x + y < 9: base = mix(base, (140, 134, 170), .5)       # luce in alto a sinistra
                px[x, y] = (*((24, 20, 42) if edge else base), 255)
    g = GLYPH[key]; p = 0.5 + 0.5 * math.sin(2 * math.pi * f / N)    # pulsazione
    for (x, y) in g:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in g and 0 <= q[0] < 16 and 0 <= q[1] < 16 and px[q][3] and px[q][:3] != (24, 20, 42):
                px[q] = (*mix(px[q][:3], c, 0.25 + 0.35 * p), 255)  # alone
    for (x, y) in g: px[x, y] = (*mix(c, (255, 255, 255), 0.15 + 0.5 * p), 255)
    sp = [(12, 3), (13, 2), (12, 3), None, None, None, None, None][f]     # scintilla
    if sp:
        x, y = sp; px[x, y] = (255, 255, 240, 255)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if 0 <= x + dx < 16 and 0 <= y + dy < 16: px[x + dx, y + dy] = (*mix(c, (255, 255, 255), .6), 200 if f == 1 else 120)
    return im
if __name__ == '__main__':
    for key, col in RUNES:
        strip = Image.new('RGBA', (16 * 8, 16))
        for f in range(8): strip.alpha_composite(frame(key, col, f), (16 * f, 0))
        strip.save(OUT + key + '.png')
    # anteprima
    frames = []
    for f in range(8):
        c = Image.new('RGBA', (7 * 16 * 6 + 6 * 12, 16 * 6), (21, 26, 69, 255))
        for i, (key, col) in enumerate(RUNES): c.alpha_composite(frame(key, col, f).resize((96, 96), Image.NEAREST), (i * 108, 0))
        frames.append(c.convert('P', palette=Image.ADAPTIVE))
    frames[0].save('/tmp/rune_prev.gif', save_all=True, append_images=frames[1:], duration=130, loop=0)
