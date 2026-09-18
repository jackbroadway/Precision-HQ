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
4. Trims the source's black fade-in, then loops forward only (no
   boomerang) with a short crossfade at the seam so the cut is
   invisible, encoded with PyAV's bundled libx264, muxed faststart, no
   audio.

   Earlier version boomeranged (played forward then reversed) to get a
   seamless loop, but for footage that reads as continuously scrolling
   in one direction (like this chart ticker), reversing direction at
   each turnaround kills the sense of forward motion and reads as
   "slow". A forward-only loop with a crossfaded seam keeps the
   momentum and is still seamless.
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
FADE_IN_DELTA_THRESHOLD = 0.5  # brightness units/frame; below this, fade-in is over
FADE_IN_SEARCH_WINDOW = 40  # frames; only look for the fade-in this early
CROSSFADE_FRAMES = 8


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


def find_fade_in_end(raw_frames):
    """Skip the source's black fade-in so the loop never sits on a near
    black frame. Finds where brightness stops rising quickly (the
    fade-in ramp), rather than where it nears the clip's overall peak,
    since unrelated gradual brightening later in the clip can be higher
    still without being part of the fade-in at all."""
    window = raw_frames[: FADE_IN_SEARCH_WINDOW + 1]
    brightness = [np.array(f.to_image()).mean() for f in window]
    for i in range(len(brightness) - 3):
        deltas = [brightness[i + k + 1] - brightness[i + k] for k in range(3)]
        if all(d < FADE_IN_DELTA_THRESHOLD for d in deltas):
            return i
    return 0


def crossfade_loop(frames, n):
    """Blend the tail of the sequence into its own head so frame -1
    matches frame 0 almost exactly, the loop cut becomes invisible
    without needing to reverse playback direction."""
    frames = [f.astype(float) for f in frames]
    n = min(n, len(frames) // 2)
    for i in range(n):
        alpha = (i + 1) / n
        pos = len(frames) - n + i
        frames[pos] = frames[pos] * (1 - alpha) + frames[i] * alpha
    return [np.clip(f, 0, 255).astype("uint8") for f in frames]


def main():
    src = av.open(SRC)
    vs = src.streams.video[0]
    watermark_mask = feathered_patch_mask((vs.width, vs.height))

    raw_frames = list(src.decode(vs))
    src.close()
    skip = find_fade_in_end(raw_frames)
    print(f"source frames: {len(raw_frames)}, skipping {skip} fade-in frames")
    raw_frames = raw_frames[skip:]

    frames = []
    for i, frame in enumerate(raw_frames):
        img = frame.to_image()
        graded = process_frame(img, watermark_mask)
        frames.append(np.array(graded))
        if i % 20 == 0:
            print(f"processed frame {i}", flush=True)
    print(f"total frames: {len(frames)}")

    sequence = crossfade_loop(frames, CROSSFADE_FRAMES)
    print(f"looped frames: {len(sequence)} (forward only, crossfaded seam)")

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
