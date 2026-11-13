# Foglio animazioni di un eroe da 96 (PixelLab): fotogrammi su tela 192x192 allineati sui piedi
# ordine: 0 fermo, 1-8 camminata, 9-17 attacco, 18-26 morte
import glob, sys, base64, io
from PIL import Image
def sheet(d, walk_off):
    def place(img, dx, dy):
        c = Image.new('RGBA', (192, 192)); c.alpha_composite(img.convert('RGBA'), (dx, dy)); return c
    att = [place(Image.open(f), 0, 0) for f in sorted(glob.glob(d + '/attack/*.png'))]
    walk = [place(Image.open(f), *walk_off) for f in sorted(glob.glob(d + '/walk/*.png'))]
    die = [place(Image.open(f), 0, 0) for f in sorted(glob.glob(d + '/death/*.png'))]
    fr = [att[0]] + walk + att + die
    sh = Image.new('RGBA', (192 * len(fr), 192))
    for i, f in enumerate(fr): sh.alpha_composite(f, (i * 192, 0))
    return sh, len(fr)
if __name__ == '__main__':
    sh, n = sheet(sys.argv[1], (int(sys.argv[2]), int(sys.argv[3]))); sh.save(sys.argv[1] + '/sheet.png'); print(n, sh.size)
