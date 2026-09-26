#!/usr/bin/env python3
"""
Rebuilds the hero background video as a seamless boomerang loop from the
first ~7s of the source clip (before its camera zoom gets heavy and the
candlesticks turn into a blurry close up), re-encoded with PyAV's bundled
libx264 since no system ffmpeg is available here. Audio is dropped
entirely, the hero <video> is always muted so there's no reason to ship
an unused AAC track.
"""
import sys

import av

SRC = "public/video/hero-background.mp4"
OUT = "public/video/hero-background.mp4.new"
CUT_SECONDS = 7.0
CRF = 26


def main():
    src = av.open(SRC)
    vs = src.streams.video[0]

    frames = []
    for frame in src.decode(vs):
        t = float(frame.pts * vs.time_base)
        if t > CUT_SECONDS:
            break
        frames.append(frame.to_ndarray(format="rgb24"))
    src.close()

    if len(frames) < 2:
        print("Not enough frames decoded, aborting.")
        sys.exit(1)

    # Boomerang: forward, then back down to (but not including) both
    # endpoints, so the loop never holds on a repeated frame.
    sequence = frames + frames[-2:0:-1]
    print(f"forward frames: {len(frames)}, total looped frames: {len(sequence)}")

    out = av.open(OUT, mode="w", format="mp4")
    stream = out.add_stream("libx264", rate=vs.average_rate)
    stream.width = vs.width
    stream.height = vs.height
    stream.pix_fmt = "yuv420p"
    stream.options = {"crf": str(CRF), "preset": "medium", "movflags": "faststart"}

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
