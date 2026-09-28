#!/usr/bin/env python3
"""Generate VO lines via edge-tts, matching the filenames mix.py expects."""
import asyncio, os, ssl, sys

import edge_tts
import edge_tts.communicate as comm

comm._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

VOICE = "vi-VN-NamMinhNeural"
RATE = "+0%"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vo")

LINES = {
    "01-hook": "Thuê một ê-kíp lớn, hay một người làm được cả ê-kíp?",
    "02-intro": "Ở Hải Phòng, có một người làm được — XQuang.",
    "03-one-contact": "Từ ý tưởng, đạo diễn, quay, dựng, đến chỉnh màu — chỉ một người.",
    "04-pullupinmymind": "MV Pull up in my mind của Rollin — XQuang tự đạo diễn, quay, dựng, lên màu, chỉ một tháng ra mắt.",
    "05-orpc": "Và TVC mới nhất cho ORPC.",
    "06-reel": "Thép Nhật Tiến, Thủy sản Anh Minh, và Còn Chờ Là Còn Nhớ.",
    "07-process": "Quy trình rõ ràng, bốn bước: nhận brief, chuẩn bị, quay dựng, bàn giao.",
    "08-clients": "Nhiều doanh nghiệp và nghệ sĩ đã tin tưởng đồng hành.",
    "09-cta": "Gửi brief, Denoise phản hồi trong một ngày làm việc. Zalo: không tám hai hai, ba chín bốn, hai tám chín.",
}


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, text in LINES.items():
        path = os.path.join(OUT_DIR, f"{name}.mp3")
        await edge_tts.Communicate(text, VOICE, rate=RATE, proxy=os.environ.get("HTTPS_PROXY")).save(path)
        print("wrote", path)


asyncio.run(main())
