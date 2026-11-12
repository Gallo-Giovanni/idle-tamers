# Genera gli sfondi in pixel art della scena (strati che si ripetono in orizzontale), come data URI PNG
import random, base64, io, json, sys
from PIL import Image

def png(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

def hexc(h, a=255): h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def clouds(W, H, seed, cols):
    r = random.Random(seed); im = Image.new('RGBA', (W, H)); px = im.load()
    for _ in range(4):
        cx, cy, n = r.randrange(W), r.randrange(4, H - 6), r.randrange(3, 6)
        blobs = [(cx + i * r.randrange(4, 7), cy + r.randrange(-2, 2), r.randrange(3, 6)) for i in range(n)]
        for x in range(W):
            for y in range(H):
                for bx, by, br in blobs:
                    dx = min(abs(x - bx), W - abs(x - bx)); dy = (y - by) * 1.6
                    if dx * dx + dy * dy <= br * br and y <= by + 2:
                        px[x, y] = hexc(cols[0] if y < by else cols[1]); break
    return im

def ridge(W, H, seed, base, amp, col, shade=None, snow=None, freq=(2, 5)):
    r = random.Random(seed); im = Image.new('RGBA', (W, H)); px = im.load()
    import math
    k1, k2 = r.choice(freq), r.choice(freq) * 2; p1, p2 = r.random() * 6, r.random() * 6
    for x in range(W):
        h = base + amp * (0.6 * math.sin(2 * math.pi * k1 * x / W + p1) + 0.4 * math.sin(2 * math.pi * k2 * x / W + p2))
        top = int(H - h)
        for y in range(max(0, top), H):
            c = col
            if snow and y < top + 2 and h > base + amp * 0.5: c = snow
            elif shade and (x + y) % 2 == 0 and y > top + 3 and ((x // 6) % 2 == 0): c = shade
            px[x, y] = hexc(c)
    return im

def trees(W, H, seed, cols, n):
    r = random.Random(seed); im = Image.new('RGBA', (W, H)); px = im.load()
    xs = sorted(r.sample(range(4, W - 4), n))
    for x0 in xs:
        rad = r.randrange(4, 7); cy = H - rad - 3
        for dx in range(-rad, rad + 1):
            for dy in range(-rad, rad + 1):
                if dx * dx + dy * dy <= rad * rad:
                    x = (x0 + dx) % W; y = cy + dy
                    if 0 <= y < H: px[x, y] = hexc(cols[2] if dx + dy > rad * 0.6 else cols[1] if dx + dy > -rad * 0.4 else cols[0])
        for y in range(cy + rad - 1, H): px[x0 % W, y] = hexc(cols[3]); px[(x0 + 1) % W, y] = hexc(cols[3])
    return im

def ground(W, H, seed, grass, grass2, dirt, dirt2, stones, flowers):
    r = random.Random(seed); im = Image.new('RGBA', (W, H)); px = im.load()
    for x in range(W):
        g = 3 + (1 if r.random() < 0.3 else 0)
        for y in range(H):
            if y < g: c = grass if y > 0 or r.random() < 0.7 else grass2
            elif y == g: c = grass2
            else: c = dirt2 if r.random() < 0.08 else dirt
            px[x, y] = hexc(c)
        if r.random() < 0.25: px[x, 0] = hexc(grass2)
    for _ in range(W // 10):
        x, y = r.randrange(W), r.randrange(6, H - 1); px[x, y] = hexc(stones[0]); px[(x + 1) % W, y] = hexc(stones[0]); px[x, y + 1] = hexc(stones[1]); px[(x + 1) % W, y + 1] = hexc(stones[1])
    return im

def tufts(W, H, seed, grass, flowers):
    r = random.Random(seed); im = Image.new('RGBA', (W, H)); px = im.load()
    for _ in range(W // 5):
        x = r.randrange(W)
        for k, hgt in enumerate([1, 2, 1]):
            for y in range(H - hgt, H): px[(x + k) % W, y] = hexc(grass)
    for _ in range(W // 14):
        x = r.randrange(W); c = r.choice(flowers)
        px[x, H - 1] = hexc(grass); px[x, H - 2] = hexc(grass); px[x, H - 3] = hexc(c)
        px[(x - 1) % W, H - 3] = hexc(c); px[(x + 1) % W, H - 3] = hexc(c); px[x, H - 4] = hexc(c)
    return im

P1 = dict(
    clouds=clouds(200, 26, 1, ['#FFFFFF', '#DCEBFF']),
    mount=ridge(160, 30, 2, 14, 9, '#A9B8EC', None, '#F4F6FF', (1, 2)),
    hills=ridge(128, 22, 3, 9, 4, '#7CCB6B', '#6BB95E'),
    trees=trees(128, 22, 4, ['#3E9A4E', '#4FB35A', '#6FD06A', '#7A5236'], 7),
    ground=ground(64, 14, 5, '#7DD05F', '#5DB34C', '#9A6A44', '#86593A', ['#B9A58E', '#8C7A66'], None),
    tufts=tufts(64, 5, 6, '#5DB34C', ['#FFE15A', '#FF8FB1', '#FFFFFF']),
)
out = {k: (png(v), v.size) for k, v in P1.items()}
json.dump({k: {'uri': u, 'w': s[0], 'h': s[1]} for k, (u, s) in out.items()}, open(sys.argv[1], 'w'))
print({k: len(u) for k, (u, s) in out.items()})
