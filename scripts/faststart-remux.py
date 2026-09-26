#!/usr/bin/env python3
"""
One-off fix for a hero background video exported with its moov atom
(the index browsers need to know duration/codec/sample offsets) at the
end of the file, after all the raw video data. That forces browsers to
download almost the entire file before they can play anything.

Rewrites the file with moov moved directly before mdat and every
chunk-offset table (stco/co64) inside it shifted to match, without
touching or re-encoding a single video/audio sample. No ffmpeg needed,
this repo intentionally has none installed.
"""
import struct
import sys


def read_boxes(data, start, end):
    boxes = []
    pos = start
    while pos < end:
        size, box_type = struct.unpack(">I4s", data[pos : pos + 8])
        header_len = 8
        if size == 1:
            size = struct.unpack(">Q", data[pos + 8 : pos + 16])[0]
            header_len = 16
        boxes.append((box_type, pos, size, header_len))
        pos += size
    return boxes


def shift_offsets(data, moov_start, moov_end, shift):
    data = bytearray(data)
    for box_type, pos, size, header_len in walk(data, moov_start, moov_end):
        if box_type == b"stco":
            entry_count = struct.unpack(">I", data[pos + 12 : pos + 16])[0]
            off = pos + 16
            for i in range(entry_count):
                (val,) = struct.unpack(">I", data[off : off + 4])
                struct.pack_into(">I", data, off, val + shift)
                off += 4
        elif box_type == b"co64":
            entry_count = struct.unpack(">I", data[pos + 12 : pos + 16])[0]
            off = pos + 16
            for i in range(entry_count):
                (val,) = struct.unpack(">Q", data[off : off + 8])
                struct.pack_into(">Q", data, off, val + shift)
                off += 8
    return bytes(data)


CONTAINER_TYPES = {
    b"moov", b"trak", b"mdia", b"minf", b"stbl", b"edts", b"mvex", b"udta",
}


def walk(data, start, end):
    """Yield every box in the tree, recursing into known container types."""
    for box_type, pos, size, header_len in read_boxes(data, start, end):
        yield box_type, pos, size, header_len
        if box_type in CONTAINER_TYPES:
            inner_start = pos + header_len
            if box_type == b"meta":
                inner_start += 4  # meta has a version/flags field first
            yield from walk(data, inner_start, pos + size)


def main(path):
    with open(path, "rb") as f:
        data = f.read()

    top = read_boxes(data, 0, len(data))
    by_type = {t: (pos, size, header_len) for t, pos, size, header_len in top}

    if b"moov" not in by_type or b"mdat" not in by_type:
        print("Missing moov or mdat box, not a simple case, aborting.")
        sys.exit(1)

    moov_pos, moov_size, _ = by_type[b"moov"]
    mdat_pos, mdat_size, _ = by_type[b"mdat"]

    if moov_pos < mdat_pos:
        print("moov is already before mdat, nothing to do.")
        return

    moov_bytes = data[moov_pos : moov_pos + moov_size]
    shift = moov_size

    # Adjust chunk offsets inside this standalone moov copy before splicing it in.
    fixed_moov = shift_offsets(moov_bytes, 0, len(moov_bytes), shift)

    before_moov = data[:moov_pos]  # everything up to (not including) old moov
    after_moov = data[moov_pos + moov_size :]  # mdat and anything after moov

    # Original layout: [head][mdat ... ][moov]
    # New layout:      [head][moov'][mdat ...]
    # head = everything before mdat; splice moov' right before mdat.
    mdat_rel = mdat_pos  # mdat starts at the same offset in `before_moov + after_moov`...
    # before_moov currently = head + mdat (since moov was after mdat), so split there.
    head = data[:mdat_pos]
    mdat_and_rest = data[mdat_pos:moov_pos]  # mdat body, moov excluded

    new_data = head + fixed_moov + mdat_and_rest

    out_path = path
    with open(out_path, "wb") as f:
        f.write(new_data)

    print(f"Rewrote {path}: moov ({moov_size} bytes) moved before mdat, "
          f"{len(new_data)} bytes total (was {len(data)}).")


if __name__ == "__main__":
    main(sys.argv[1])
