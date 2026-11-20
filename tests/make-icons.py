"""Erzeugt die PNG-Icons (192, 512, maskable 512) direkt mit Pillow.
Motiv wie icons/icon.svg: grüne Pflanzenzelle (abgerundetes Sechseck) mit Zellkern und drei Chloroplasten."""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")

def ellipse_rot(d, cx, cy, rx, ry, ang, fill, s):
    pts = []
    for i in range(72):
        t = 2 * math.pi * i / 72
        x, y = rx * math.cos(t), ry * math.sin(t)
        a = math.radians(ang)
        pts.append(((cx + x * math.cos(a) - y * math.sin(a)) * s, (cy + x * math.sin(a) + y * math.cos(a)) * s))
    d.polygon(pts, fill=fill)

def draw(size, maskable):
    S = 4  # Supersampling
    W = size * S
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = W / 512
    if maskable:
        d.rectangle([0, 0, W, W], fill="#F7F8F5")
        # Motiv auf ca. 70 % verkleinern (Safe Zone)
        k = 0.72; off = 512 * (1 - k) / 2
    else:
        d.rounded_rectangle([0, 0, W, W], radius=96 * s, fill="#F7F8F5")
        k = 1.0; off = 0
    T = lambda x, y: ((off + x * k) * s, (off + y * k) * s)
    hexa = [(168, 76), (356, 68), (444, 246), (368, 436), (160, 444), (68, 258)]
    d.polygon([T(*p) for p in hexa], fill="#DDEFE2")
    d.line([T(*p) for p in hexa + [hexa[0]]], fill="#2E7D4F", width=int(22 * s * k), joint="curve")
    for p in hexa:
        r = 11 * s * k; x, y = T(*p); d.ellipse([x - r, y - r, x + r, y + r], fill="#2E7D4F")
    cx, cy = T(196, 250); r = 58 * s * k; d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#7C5BB0")
    cx, cy = T(208, 238); r = 18 * s * k; d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#4A2F78")
    for (x, y, ang) in [(322, 160, -10), (350, 292, 75), (262, 378, 5)]:
        ellipse_rot(d, off / k + x, off / k + y, 44, 24, ang, "#2E7D4F", s * k)
    return img.resize((size, size), Image.LANCZOS)

draw(192, False).save(os.path.join(OUT, "icon-192.png"))
draw(512, False).save(os.path.join(OUT, "icon-512.png"))
draw(512, True).save(os.path.join(OUT, "icon-maskable-512.png"))
print("Icons erzeugt")
