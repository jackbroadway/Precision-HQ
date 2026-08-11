#!/usr/bin/env python3
"""
Turns a raw FlexClip export into a brand-matched hero background:

1. Masks out the FlexClip watermark (fixed top-right corner) with a
   soft-edged black patch.
2. Detects the baked-in price-change labels (low saturation, high
   value pixels, i.e. white/grey text on a colourful background) and
   smears them into their local surroundings via a masked blur. Not a
   perfect erase, there's no real inpainting available here, but it
   kills their legibility.
3. Duotone-maps every frame from black to the brand's gold, which also
   neutralises the source clip's red/green/blue palette entirely.
4. Builds a seamless boomerang loop (forward, then reversed) and
   encodes with PyAV's bundled libx264, muxed faststart, no audio.
"""
import sys

import av
import numpy as np
from PIL import Image, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/video/hero-background.mp4"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/video/hero-background.mp4.new"

GOLD_DARK = np.array([10, 8, 0], dtype=float)  # brand background #0A0800
GOLD_LIGHT = np.array([228, 200, 119], dtype=float)  # brand gold-bright #E4C877
BLACKPOINT = 0.15
WHITEPOINT = 0.80
GAMMA = 3.0

WATERMARK_BOX = (1060, 0, 1280, 95)  # left, top, right, bottom
CRF = 24


def feathered_patch_mask(size):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    left, top, right, bottom = WATERMARK_BOX
    pad = 25
    box = Image.new("L", (right - left + pad * 2, bottom - top + pad * 2), 255)
    box = box.filter(ImageFilter.GaussianBlur(pad / 2))
    mask.paste(box, (left - pad, top - pad))
    return np.array(mask).astype(float) / 255.0


def text_mask(rgb):
    arr = rgb.astype(int)
    maxc = arr.max(axis=2)
    minc = arr.min(axis=2)
    sat = np.where(maxc > 0, (maxc - minc) / np.maximum(maxc, 1) * 255, 0)
    val = maxc
    mask = (val > 185) & (sat < 60)
    return mask


def process_frame(img: Image.Image, watermark_mask) -> Image.Image:
    rgb = np.array(img)

    # 1. Soften baked-in price labels: blur only where text was detected.
    tmask = text_mask(rgb)
    tmask_img = Image.fromarray((tmask * 255).astype("uint8")).filter(
        ImageFilter.MaxFilter(5)
    )
    tmask_soft = np.array(tmask_img).astype(float) / 255.0
    blurred = np.array(img.filter(ImageFilter.GaussianBlur(9))).astype(float)
    rgb = rgb.astype(float)
    a = tmask_soft[..., None]
    rgb = rgb * (1 - a) + blurred * a

    # 2. Erase the watermark corner with a soft black patch.
    wa = watermark_mask[..., None]
    rgb = rgb * (1 - wa)

    # 3. Duotone: map luminance to brand black -> gold, with a contrast
    # curve so the busy background crushes toward black and only genuinely
    # bright elements (candles, highlights) read as gold.
    luma = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]) / 255.0
    luma = np.clip((luma - BLACKPOINT) / (WHITEPOINT - BLACKPOINT), 0, 1)
    luma = luma**GAMMA
    luma = luma[..., None]
    graded = GOLD_DARK * (1 - luma) + GOLD_LIGHT * luma

    return Image.fromarray(np.clip(graded, 0, 255).astype("uint8"))


def main():
    src = av.open(SRC)
    vs = src.streams.video[0]
    watermark_mask = feathered_patch_mask((vs.width, vs.height))

    frames = []
    for i, frame in enumerate(src.decode(vs)):
        img = frame.to_image()
        graded = process_frame(img, watermark_mask)
        frames.append(np.array(graded))
        if i % 20 == 0:
            print(f"processed frame {i}", flush=True)
    src.close()
    print(f"total frames: {len(frames)}")

    sequence = frames + frames[-2:0:-1]
    print(f"looped frames: {len(sequence)}")

    out = av.open(OUT, mode="w", format="mp4")
    stream = out.add_stream("libx264", rate=vs.average_rate)
    stream.width = vs.width
    stream.height = vs.height
    stream.pix_fmt = "yuv420p"
    stream.options = {"crf": str(CRF), "preset": "medium"}

    for arr in sequence:
        vframe = av.VideoFrame.from_ndarray(arr, format="rgb24")
        for packet in stream.encode(vframe):
            out.mux(packet)
    for packet in stream.encode():
        out.mux(packet)
    out.close()
    print("wrote", OUT)


if __name__ == "__main__":
    main()
