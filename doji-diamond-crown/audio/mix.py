#!/usr/bin/env python3
"""Mix VO + music bed + SFX onto the silent render."""
import os, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(ROOT)
TOTAL = 35.0

# (file, start_sec)
VO = [
    ("01-hook.mp3", 0.8),
    ("02-identity.mp3", 5.0),
    ("03-stats.mp3", 9.15),
    ("04-design.mp3", 16.0),
    ("05-lifestyle.mp3", 22.0),
    ("06-close.mp3", 27.6),
]

# (file, trim_start, trim_dur, at_sec, gain)
SFX = [
    ("whoosh.wav", 0.0, 0.55, 3.8, 0.5),
    ("whoosh.wav", 0.0, 0.55, 14.8, 0.4),
    ("whoosh.wav", 0.0, 0.55, 20.8, 0.4),
    ("flash_hit.wav", 0.0, 0.28, 9.0, 0.8),
    ("flash_hit.wav", 0.0, 0.28, 27.0, 0.8),
    ("stat_tick.wav", 0.0, 0.14, 9.15, 0.6),
    ("stat_tick.wav", 0.0, 0.14, 11.0, 0.6),
    ("stat_tick.wav", 0.0, 0.14, 12.85, 0.6),
    ("glass_chime.wav", 0.0, 1.4, 4.3, 0.22),
    ("glass_chime.wav", 0.0, 1.4, 27.6, 0.4),
]

video = os.path.join(PROJ, "renders", "video.mp4")
music = os.path.join(ROOT, "music", "bed.wav")
vo_dir = os.path.join(ROOT, "vo")
sfx_dir = os.path.join(ROOT, "sfx")
out = os.path.join(PROJ, "renders", "final.mp4")

args = ["ffmpeg", "-v", "error", "-y", "-i", video, "-i", music]
fc, vo_labels, sfx_labels = [], [], []
idx = 2
for name, at in VO:
    p = os.path.join(vo_dir, name)
    args += ["-i", p]
    d = int(at * 1000)
    fc.append(f"[{idx}:a]aresample=48000,adelay={d}|{d}[v{idx}]")
    vo_labels.append(f"[v{idx}]"); idx += 1
for name, ss, dur, at, gain in SFX:
    args += ["-i", os.path.join(sfx_dir, name)]
    d = int(at * 1000)
    fc.append(f"[{idx}:a]atrim={ss}:{ss+dur},asetpts=PTS-STARTPTS,afade=t=out:st={max(dur-0.08,0)}:d=0.08,"
              f"volume={gain},aresample=48000,adelay={d}|{d}[s{idx}]")
    sfx_labels.append(f"[s{idx}]"); idx += 1

fc.append(f"{''.join(vo_labels)}amix=inputs={len(vo_labels)}:normalize=0,volume=1.15,aformat=channel_layouts=stereo,asplit=2[vo][vokey]")
fc.append(f"[1:a]aresample=48000,volume=0.5,afade=t=in:d=0.6,afade=t=out:st={TOTAL-2.2}:d=2.2[mus]")
fc.append("[mus][vokey]sidechaincompress=threshold=0.045:ratio=5:attack=25:release=300[musduck]")
fc.append(f"{''.join(sfx_labels)}amix=inputs={len(sfx_labels)}:normalize=0,aformat=channel_layouts=stereo[sfx]")
fc.append(f"[vo][musduck][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.92,atrim=0:{TOTAL}[aout]")

args += ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[aout]",
         "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", str(TOTAL), out]
subprocess.run(args, check=True)
print("wrote", out)
