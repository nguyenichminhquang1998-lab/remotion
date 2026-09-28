#!/usr/bin/env python3
"""Mix VO + music bed + SFX onto the silent render. Usage: mix.py <vo_dir> <out.mp4>"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(ROOT)
vo_dir, out = sys.argv[1], sys.argv[2]
SOURCE_DUR = 47.0
TAIL_FREEZE = 2.0  # hold the last CTA frame so the Zalo number isn't rushed
TOTAL = SOURCE_DUR + TAIL_FREEZE

# (file, start_sec, tempo) — start = frame start + small lead-in; tempo tuned so
# each line ends with a small margin before the next line's start_sec
VO = [
    ("01-hook.mp3", 0.25, 1.01),
    ("02-intro.mp3", 4.3, 1.01),
    ("03-one-contact.mp3", 8.2, 1.0),
    ("04-pullupinmymind.mp3", 14.45, 1.0),
    ("05-orpc.mp3", 22.0, 1.08),
    ("06-reel.mp3", 25.3, 1.0),
    ("07-process.mp3", 30.2, 1.0),
    ("08-clients.mp3", 36.4, 1.0),
    ("09-cta.mp3", 40.3, 1.0),
]
# (file, trim_start, trim_dur, at_sec, gain)
SFX = [
    ("whoosh.mp3", 0.0, 1.45, 3.3, 0.35),
    ("whoosh.mp3", 0.0, 1.45, 13.3, 0.35),
    ("whoosh.mp3", 0.0, 1.45, 20.3, 0.3),
    ("whoosh.mp3", 0.0, 1.45, 24.3, 0.3),
    ("whoosh.mp3", 0.0, 1.45, 39.3, 0.35),
    ("camera_flash.mp3", 0.0, 1.1, 14.78, 0.8),
    ("camera_flash.mp3", 0.0, 0.35, 18.98, 0.45),
    ("chime.mp3", 0.0, 1.08, 42.85, 0.5),
] + [("stamp.mp3", 0.44, 0.35, t, 0.55) for t in (4.1, 8.1, 21.12, 25.1, 26.7, 28.3, 30.1, 36.1, 40.1)]

video = os.path.join(PROJ, "renders", "video.mp4")
music = os.path.join(ROOT, "music", "bed.mp3")
args = ["ffmpeg", "-v", "error", "-y", "-i", video, "-i", music]
fc = [f"[0:v]tpad=stop_mode=clone:stop_duration={TAIL_FREEZE}[vout]"]
vo_labels, sfx_labels = [], []
idx = 2
for name, at, tempo in VO:
    p = os.path.join(vo_dir, name)
    if not os.path.exists(p):
        continue
    args += ["-i", p]
    d = int(at * 1000)
    tempo_f = f"atempo={tempo}," if tempo != 1.0 else ""
    fc.append(f"[{idx}:a]{tempo_f}aresample=48000,adelay={d}|{d}[v{idx}]")
    vo_labels.append(f"[v{idx}]"); idx += 1
for name, ss, dur, at, gain in SFX:
    args += ["-i", os.path.join(ROOT, "sfx", name)]
    d = int(at * 1000)
    fc.append(f"[{idx}:a]atrim={ss}:{ss+dur},asetpts=PTS-STARTPTS,afade=t=out:st={max(dur-0.12,0)}:d=0.12,"
              f"volume={gain},aresample=48000,adelay={d}|{d}[s{idx}]")
    sfx_labels.append(f"[s{idx}]"); idx += 1

fc.append(f"{''.join(vo_labels)}amix=inputs={len(vo_labels)}:normalize=0,volume=1.0,aformat=channel_layouts=stereo,asplit=2[vo][vokey]")
fc.append(f"[1:a]aresample=48000,volume=0.55,afade=t=in:d=0.8,afade=t=out:st={TOTAL-2.5}:d=2.5[mus]")
fc.append("[mus][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[musduck]")
fc.append(f"{''.join(sfx_labels)}amix=inputs={len(sfx_labels)}:normalize=0,aformat=channel_layouts=stereo[sfx]")
fc.append(f"[vo][musduck][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.9,atrim=0:{TOTAL}[aout]")

args += ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]",
         "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", str(TOTAL), out]
subprocess.run(args, check=True)
print("wrote", out, "with", len(vo_labels), "VO lines")
