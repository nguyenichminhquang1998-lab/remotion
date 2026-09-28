#!/usr/bin/env python3
"""Generate English VO lines via edge-tts, matching SCRIPT.md / mix.py filenames."""
import asyncio, os, ssl

import edge_tts
import edge_tts.communicate as comm

comm._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

VOICE = "en-US-AndrewNeural"
RATE = "+6%"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vo")

LINES = {
    "01-hook": "Hai Phong doesn't wait for the future.",
    "02-identity": "This is Diamond Crown Hai Phong.",
    "03-stats": "One hundred eighty six meters. Forty five and thirty nine floors. Two towers, one skyline.",
    "04-design": "A diagrid crown, rare in Asia, designed for this skyline.",
    "05-lifestyle": "Retail, greenery, life at street level.",
    "06-close": "Diamond Crown Hai Phong. The city's new icon, rising now.",
}


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, text in LINES.items():
        path = os.path.join(OUT_DIR, f"{name}.mp3")
        await edge_tts.Communicate(text, VOICE, rate=RATE, proxy=os.environ.get("HTTPS_PROXY")).save(path)
        print("wrote", path)


asyncio.run(main())
