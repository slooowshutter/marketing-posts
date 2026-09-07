import struct
import zlib
from pathlib import Path


def chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(path: Path, width: int, height: int, pixel) -> None:
    rows = bytearray()
    for y in range(height):
        rows.append(0)
        for x in range(width):
            rows.extend(pixel(x, y, width, height))
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(rows), 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def clamp(value: float) -> int:
    return max(0, min(255, int(value)))


def mix(a, b, t):
    return tuple(clamp(a[i] + (b[i] - a[i]) * t) for i in range(3))


def circle(x, y, cx, cy, radius):
    dx = x - cx
    dy = y - cy
    return (dx * dx + dy * dy) ** 0.5 / radius


def result_pixel(x, y, w, h):
    t = y / h
    base = mix((12, 28, 42), (18, 92, 98), t)
    d = circle(x, y, w * 0.58, h * 0.42, w * 0.34)
    if d < 1:
        glow = mix((90, 230, 210), (180, 160, 255), d)
        return mix(glow, base, d * 0.35)
    vignette = circle(x, y, w * 0.5, h * 0.5, w * 0.78)
    return mix(base, (8, 12, 20), min(1, max(0, vignette - 0.7) * 2))


def original_pixel(x, y, w, h):
    t = y / h
    base = mix((40, 52, 64), (88, 102, 118), t)
    frame = 70 < x < w - 70 and 120 < y < h - 160
    if frame:
        inner = mix((62, 74, 86), (120, 132, 144), (y - 120) / (h - 280))
        d = circle(x, y, w * 0.48, h * 0.46, w * 0.22)
        if d < 1:
            return mix((150, 164, 176), inner, d)
        return inner
    return mix(base, (24, 30, 38), 0.25)


def still_pixel(x, y, w, h):
    t = (x / w + y / h) / 2
    base = mix((22, 18, 48), (16, 86, 92), t)
    d = circle(x, y, w * 0.42, h * 0.38, w * 0.4)
    if d < 1:
        return mix((210, 140, 255), base, min(1, d))
    return base


ROOT = Path("/workspace/public/tips")
SPECS = {
    "result.png": result_pixel,
    "original.png": original_pixel,
    "still.png": still_pixel,
}

for post in ("polaroid-warm-swap", "terminal-stack-prompt"):
    for name, fn in SPECS.items():
        dest = ROOT / post / name
        write_png(dest, 1080, 1350, fn)
        print(dest, dest.stat().st_size)
