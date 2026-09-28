#!/usr/bin/env python3
"""Procedural music bed + SFX for the Diamond Crown Hai Phong promo.

Fully synthesized (numpy) — no sampled/licensed material, since HeyGen's BGM/SFX
catalog needs a sign-in this environment doesn't have. Deterministic (fixed
seed) so re-runs are identical.
"""
import os
import numpy as np
import wave

SR = 44100
rng = np.random.default_rng(20260928)
ROOT = os.path.dirname(os.path.abspath(__file__))


def write_wav(path, stereo, sr=SR):
    stereo = np.clip(stereo, -1.0, 1.0)
    pcm = (stereo * 32767.0).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def mono_to_stereo(x, pan=0.0):
    # pan -1..1
    l = x * (1 - max(0, pan))
    r = x * (1 + min(0, pan))
    return np.stack([l, r], axis=1)


def env_ad(n, sr, attack, decay, curve=2.0):
    a = int(sr * attack)
    d = n - a
    if d < 0:
        a, d = n, 0
    att = np.linspace(0, 1, max(a, 1)) ** (1 / curve)
    dec = np.linspace(1, 0, max(d, 1)) ** curve
    return np.concatenate([att, dec])[:n]


def sine(freq, n, sr=SR, phase=0.0):
    t = np.arange(n) / sr
    return np.sin(2 * np.pi * freq * t + phase)


def noise(n):
    return rng.uniform(-1, 1, n)


def one_pole_lowpass(x, cutoff_hz, sr=SR):
    a = np.exp(-2 * np.pi * cutoff_hz / sr)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a) * x[i] + a * prev
        y[i] = prev
    return y


def one_pole_highpass(x, cutoff_hz, sr=SR):
    return x - one_pole_lowpass(x, cutoff_hz, sr)


# ---------------------------------------------------------------- instruments

def kick(sr=SR, dur=0.32):
    n = int(sr * dur)
    t = np.arange(n) / sr
    f0, f1 = 150.0, 45.0
    freq = f1 + (f0 - f1) * np.exp(-t / 0.045)
    phase = 2 * np.pi * np.cumsum(freq) / sr
    body = np.sin(phase)
    amp = np.exp(-t / 0.16)
    click = noise(n) * np.exp(-t / 0.004)
    return (body * amp * 0.95 + click * 0.35)


def hat(sr=SR, dur=0.05, open_=False):
    n = int(sr * dur)
    x = noise(n)
    x = one_pole_highpass(x, 6000, sr)
    t = np.arange(n) / sr
    decay = 0.14 if open_ else 0.035
    amp = np.exp(-t / decay)
    return x * amp * 0.5


def sub_bass(freq, n, sr=SR):
    t = np.arange(n) / sr
    x = np.sin(2 * np.pi * freq * t)
    x += 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return x


def pluck(freq, sr=SR, dur=0.22):
    n = int(sr * dur)
    t = np.arange(n) / sr
    x = np.sin(2 * np.pi * freq * t)
    x += 0.5 * np.sin(2 * np.pi * freq * 2 * t)
    x += 0.25 * np.sin(2 * np.pi * freq * 3 * t)
    amp = np.exp(-t / 0.09)
    return x * amp


def pad_chord(freqs, n, sr=SR):
    t = np.arange(n) / sr
    x = np.zeros(n)
    for f in freqs:
        x += np.sin(2 * np.pi * f * t) * 0.5
        x += 0.2 * np.sin(2 * np.pi * f * 2 * t)
    return x / len(freqs)


def place(buf, x, start_sample, gain=1.0):
    n = len(x)
    end = start_sample + n
    if end > len(buf):
        x = x[: len(buf) - start_sample]
        end = len(buf)
    if start_sample < 0:
        return
    buf[start_sample:end] += x[: end - start_sample] * gain


# --------------------------------------------------------------------- music

def build_music(total_s=35.0, bpm=126):
    n_total = int(SR * total_s)
    buf = np.zeros(n_total)
    beat = 60.0 / bpm
    six = beat / 4  # 16th note

    def t2s(t):
        return int(t * SR)

    # section energy windows (seconds): (start, end, kick, hats, bass, arp)
    sections = [
        (0.0, 4.0, "sparse"),
        (4.0, 8.7, "build"),
        (8.7, 9.0, "riser1"),
        (9.0, 15.0, "full"),
        (15.0, 21.0, "full2"),
        (21.0, 26.7, "pull-back"),
        (26.7, 27.0, "riser2"),
        (27.0, 30.6, "hit"),
        (30.6, 35.0, "outro"),
    ]

    root = 55.0  # A1
    bass_notes = {"A": 55.0, "C": 65.41, "D": 73.42, "E": 82.41, "G": 98.0}
    prog = ["A", "A", "C", "D"]  # 4-bar-feel loop reused across sections

    beat_i = 0
    tcur = 0.0
    while tcur < total_s - 0.05:
        sec = next((s for s in sections if s[0] <= tcur < s[1]), sections[-1])
        mode = sec[2]
        bar_pos = beat_i % 4
        note_name = prog[(beat_i // 4) % len(prog)]
        bfreq = bass_notes[note_name]

        if mode == "sparse":
            if bar_pos == 0:
                place(buf, kick(dur=0.4) * 0.8, t2s(tcur))
            if bar_pos == 2:
                place(buf, sub_bass(bfreq, t2s(beat * 0.9)) * env_ad(t2s(beat * 0.9), SR, 0.01, beat * 0.85) * 0.35, t2s(tcur))
        elif mode == "build":
            place(buf, kick(), t2s(tcur))
            for k in range(4):
                place(buf, hat(open_=(k == 3)), t2s(tcur + k * six))
            place(buf, sub_bass(bfreq, t2s(beat * 0.95)) * env_ad(t2s(beat * 0.95), SR, 0.01, beat * 0.9) * 0.45, t2s(tcur))
        elif mode.startswith("riser"):
            n = t2s(sec[1] - sec[0])
            if n > 0:
                x = noise(n)
                x = one_pole_highpass(x, 800, SR)
                t = np.arange(n) / SR
                sweep = np.sin(2 * np.pi * (300 + 2500 * (t / (t[-1] + 1e-6))) * t) * 0.3
                amp = np.linspace(0.05, 0.9, n) ** 1.5
                place(buf, (x * 0.6 + sweep) * amp, t2s(sec[0]))
            beat_i += 1
            tcur = sec[1]
            continue
        elif mode in ("full", "full2"):
            place(buf, kick(), t2s(tcur))
            for k in range(4):
                place(buf, hat(open_=(k == 3 and mode == "full2")), t2s(tcur + k * six))
            place(buf, sub_bass(bfreq, t2s(beat * 0.95)) * env_ad(t2s(beat * 0.95), SR, 0.01, beat * 0.9) * 0.5, t2s(tcur))
            arp_notes = [bfreq * 2, bfreq * 2 * 1.19, bfreq * 2 * 1.5, bfreq * 2 * 1.19]
            place(buf, pluck(arp_notes[bar_pos]) * 0.22, t2s(tcur + six * 0.5))
        elif mode == "pull-back":
            if bar_pos % 2 == 0:
                place(buf, kick(dur=0.36) * 0.75, t2s(tcur))
            place(buf, hat(), t2s(tcur + six * 2))
            place(buf, sub_bass(bfreq, t2s(beat * 0.95)) * env_ad(t2s(beat * 0.95), SR, 0.01, beat * 0.9) * 0.4, t2s(tcur))
        elif mode == "hit":
            if bar_pos == 0:
                place(buf, kick(dur=0.45) * 1.0, t2s(tcur))
                chord = pad_chord([bfreq, bfreq * 1.5, bfreq * 2], t2s(beat * 3.9), SR)
                chord *= env_ad(len(chord), SR, 0.02, beat * 3.6) * 0.3
                place(buf, chord, t2s(tcur))
            else:
                place(buf, kick(dur=0.32) * 0.65, t2s(tcur))
            for k in range(4):
                place(buf, hat(), t2s(tcur + k * six))
        elif mode == "outro":
            if bar_pos == 0:
                chord = pad_chord([root, root * 1.5], t2s(sec[1] - tcur), SR)
                chord *= env_ad(len(chord), SR, 0.05, (sec[1] - tcur) * 0.9) * 0.28
                place(buf, chord, t2s(tcur))

        beat_i += 1
        tcur += beat

    # gentle bus filtering + fades
    buf = one_pole_lowpass(buf, 11000, SR)
    fade_out = int(SR * 1.6)
    buf[-fade_out:] *= np.linspace(1, 0, fade_out)
    fade_in = int(SR * 0.15)
    buf[:fade_in] *= np.linspace(0, 1, fade_in)

    peak = np.max(np.abs(buf)) or 1.0
    buf = buf / peak * 0.9
    return mono_to_stereo(buf)


# ------------------------------------------------------------------------ sfx

def sfx_whoosh(dur=0.55):
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = noise(n)
    x = one_pole_highpass(x, 500, SR)
    sweep = np.sin(2 * np.pi * (1800 - 1500 * (t / dur)) * t) * 0.4
    amp = np.sin(np.pi * (t / dur)) ** 0.7
    return mono_to_stereo((x * 0.7 + sweep) * amp * 0.8)


def sfx_flash_hit(dur=0.28):
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = noise(n) * np.exp(-t / 0.02)
    chirp = np.sin(2 * np.pi * (5200 - 4000 * (t / dur)) * t) * np.exp(-t / 0.05)
    return mono_to_stereo((x * 0.8 + chirp * 0.6) * 0.9)


def sfx_glass_chime(dur=1.4):
    n = int(SR * dur)
    t = np.arange(n) / SR
    partials = [1.0, 2.41, 3.6, 5.2]
    x = np.zeros(n)
    for i, p in enumerate(partials):
        f = 1400 * p
        x += np.sin(2 * np.pi * f * t) * (0.5 ** i)
    x *= np.exp(-t / 0.55)
    return mono_to_stereo(x * 0.35)


def sfx_stat_tick(dur=0.14):
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = noise(n) * np.exp(-t / 0.006)
    x = one_pole_highpass(x, 3000, SR)
    blip = np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.03)
    return mono_to_stereo((x * 0.6 + blip * 0.5) * 0.8)


def main():
    music_dir = os.path.join(ROOT, "music")
    sfx_dir = os.path.join(ROOT, "sfx")
    os.makedirs(music_dir, exist_ok=True)
    os.makedirs(sfx_dir, exist_ok=True)

    write_wav(os.path.join(music_dir, "bed.wav"), build_music())
    write_wav(os.path.join(sfx_dir, "whoosh.wav"), sfx_whoosh())
    write_wav(os.path.join(sfx_dir, "flash_hit.wav"), sfx_flash_hit())
    write_wav(os.path.join(sfx_dir, "glass_chime.wav"), sfx_glass_chime())
    write_wav(os.path.join(sfx_dir, "stat_tick.wav"), sfx_stat_tick())
    print("wrote music/bed.wav + sfx/{whoosh,flash_hit,glass_chime,stat_tick}.wav")


if __name__ == "__main__":
    main()
