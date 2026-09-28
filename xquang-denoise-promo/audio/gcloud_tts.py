#!/usr/bin/env python3
"""Vietnamese VO via Google Cloud Text-to-Speech. Reads GOOGLE_TTS_API_KEY.
Usage: gcloud_tts.py list | gcloud_tts.py <voice_name> <out_dir> [speaking_rate]"""
import base64, json, os, sys, urllib.request

KEY = os.environ["GOOGLE_TTS_API_KEY"]
API = "https://texttospeech.googleapis.com/v1"

LINES = {
    "01-hook": "Muốn làm một TVC chỉn chu, có nhất thiết phải thuê cả một ê-kíp lớn?",
    "02-intro": "Ở Hải Phòng, có một người làm được việc đó — XQuang.",
    "03-one-contact": "Từ lên ý tưởng, đạo diễn, cầm máy, đến dựng phim và chỉnh màu, anh chị chỉ cần làm việc với một người.",
    "04-pullupinmymind": "Như MV Pull up in my mind của Rollin — XQuang tự tay đạo diễn, quay, dựng và lên màu, chỉ một tháng từ ý tưởng đến lúc lên sóng.",
    "05-orpc": "Hay TVC mới nhất cho ORPC.",
    "06-reel": "Cùng Thép Nhật Tiến, Thủy sản Anh Minh, và MV Còn Chờ Là Còn Nhớ.",
    "07-process": "Quy trình làm việc rõ ràng, chỉ bốn bước: nhận brief, chuẩn bị, quay dựng, và bàn giao.",
    "08-clients": "Nhiều doanh nghiệp và nghệ sĩ đã tin tưởng đồng hành.",
    "09-cta": "Anh chị cứ gửi brief, Denoise sẽ phản hồi trong vòng một ngày làm việc. Liên hệ Zalo: không tám hai hai, ba chín bốn, hai tám chín.",
}


def call(path, body=None):
    sep = "&" if "?" in path else "?"
    req = urllib.request.Request(f"{API}/{path}{sep}key={KEY}",
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        return json.load(r)


if sys.argv[1] == "list":
    for v in call("voices?languageCode=vi-VN")["voices"]:
        print(v["name"], v["ssmlGender"])
    sys.exit()

voice, out_dir = sys.argv[1], sys.argv[2]
rate = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
os.makedirs(out_dir, exist_ok=True)
for name, text in LINES.items():
    res = call("text:synthesize", {
        "input": {"text": text},
        "voice": {"languageCode": "vi-VN", "name": voice},
        "audioConfig": {"audioEncoding": "MP3", "speakingRate": rate, "sampleRateHertz": 48000},
    })
    with open(os.path.join(out_dir, f"{name}.mp3"), "wb") as f:
        f.write(base64.b64decode(res["audioContent"]))
    print("wrote", name)
