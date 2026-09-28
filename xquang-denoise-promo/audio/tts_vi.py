#!/usr/bin/env python3
"""Vietnamese TTS via Microsoft neural voices. Usage: tts_vi.py <voice> <rate> <out_dir> <name>=<text> ..."""
import asyncio, os, ssl, sys

import edge_tts
import edge_tts.communicate as comm

# The container's egress proxy re-terminates TLS; trust its CA instead of certifi's bundle.
comm._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")


async def main():
    voice, rate, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    for arg in sys.argv[4:]:
        name, text = arg.split("=", 1)
        path = os.path.join(out_dir, f"{name}.mp3")
        await edge_tts.Communicate(text, voice, rate=rate, proxy=os.environ.get("HTTPS_PROXY")).save(path)
        print("wrote", path)


asyncio.run(main())
