#!/usr/bin/env python3
"""Generate VO lines via edge-tts, matching the filenames mix.py expects.

Lines that embed English words/phrases (brand name, song title, artist name)
are built by splicing a Vietnamese-voice clip and an English-voice clip per
segment — a single vi-VN voice reads embedded English text with Vietnamese
phonetics (mispronounced), so each language gets its own synthesis call.
"""
import asyncio, os, ssl, subprocess, sys

import edge_tts
import edge_tts.communicate as comm

comm._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

VI_VOICE = "vi-VN-NamMinhNeural"
EN_VOICE = "en-US-GuyNeural"
RATE = "+0%"
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "vo")
TMP_DIR = os.path.join(ROOT, "vo", ".segments")
GAP_MS = 90  # small breath between spliced segments

# Each line is a list of (lang, text) segments in reading order.
# "XQuang" is respelled "Xì Quang" so the Vietnamese voice can say it directly
# (no splice needed — "Xì" is a plain Vietnamese syllable).
LINES = {
    "01-hook": [("vi", "Thuê một ê-kíp lớn, hay một người làm được cả ê-kíp?")],
    "02-intro": [("vi", "Ở Hải Phòng, có một người làm được — Xì Quang.")],
    "03-one-contact": [("vi", "Từ ý tưởng, đạo diễn, quay, dựng, đến chỉnh màu — chỉ một người.")],
    "04-pullupinmymind": [
        ("vi", "MV"),
        ("en", "Pull up in my mind"),
        ("vi", "của"),
        ("en", "Rollin"),
        ("vi", "— Xì Quang tự đạo diễn, quay, dựng, lên màu, chỉ một tháng ra mắt."),
    ],
    "05-orpc": [("vi", "Và TVC mới nhất cho ORPC.")],
    "06-reel": [("vi", "Thép Nhật Tiến, Thủy sản Anh Minh, và Còn Chờ Là Còn Nhớ.")],
    "07-process": [
        ("vi", "Quy trình rõ ràng, bốn bước: nhận"),
        ("en", "brief"),
        ("vi", ", chuẩn bị, quay dựng, bàn giao."),
    ],
    "08-clients": [("vi", "Nhiều doanh nghiệp và nghệ sĩ đã tin tưởng đồng hành.")],
    "09-cta": [
        ("vi", "Gửi"),
        ("en", "brief"),
        ("vi", ", Denoise phản hồi trong một ngày làm việc. Zalo: không tám hai hai, ba chín bốn, hai tám chín."),
    ],
}


async def synth(text: str, voice: str, path: str) -> None:
    await edge_tts.Communicate(text, voice, rate=RATE, proxy=os.environ.get("HTTPS_PROXY")).save(path)


async def build_line(name: str, segments: list[tuple[str, str]]) -> None:
    if len(segments) == 1:
        lang, text = segments[0]
        voice = VI_VOICE if lang == "vi" else EN_VOICE
        await synth(text, voice, os.path.join(OUT_DIR, f"{name}.mp3"))
        return

    seg_paths = []
    for i, (lang, text) in enumerate(segments):
        voice = VI_VOICE if lang == "vi" else EN_VOICE
        p = os.path.join(TMP_DIR, f"{name}-{i}.mp3")
        await synth(text, voice, p)
        seg_paths.append(p)

    # Concat via filter_complex so every segment is resampled to a common
    # format first (mp3 concat demuxer chokes on mismatched encoder params),
    # with a short silence between segments for natural phrasing.
    out_path = os.path.join(OUT_DIR, f"{name}.mp3")
    args = ["ffmpeg", "-v", "error", "-y"]
    for p in seg_paths:
        args += ["-i", p]
    args += ["-f", "lavfi", "-t", f"{GAP_MS/1000}", "-i", "anullsrc=r=24000:cl=mono"]
    gap_idx = len(seg_paths)
    fc_parts = []
    concat_inputs = []
    # edge-tts pads each clip with ~1s of trailing (sometimes leading)
    # silence; trim it so spliced segments sit tight against the GAP_MS
    # silence we insert on purpose, instead of stacking silences.
    trim = (
        "silenceremove=start_periods=1:start_duration=0:start_threshold=-45dB,"
        "areverse,"
        "silenceremove=start_periods=1:start_duration=0:start_threshold=-45dB,"
        "areverse"
    )
    for i in range(len(seg_paths)):
        fc_parts.append(f"[{i}:a]aresample=24000,aformat=channel_layouts=mono,{trim}[a{i}]")
        concat_inputs.append(f"[a{i}]")
        if i < len(seg_paths) - 1:
            concat_inputs.append(f"[{gap_idx}:a]")
    fc_parts.append(f"{''.join(concat_inputs)}concat=n={len(concat_inputs)}:v=0:a=1[out]")
    args += ["-filter_complex", ";".join(fc_parts), "-map", "[out]", out_path]
    subprocess.run(args, check=True)


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(TMP_DIR, exist_ok=True)
    for name, segments in LINES.items():
        await build_line(name, segments)
        print("wrote", os.path.join(OUT_DIR, f"{name}.mp3"))


asyncio.run(main())
