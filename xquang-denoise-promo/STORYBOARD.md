---
format: 1080x1920
duration: 47s
message: "Một đầu mối, trọn quy trình — XQuang lo ý tưởng, đạo diễn, quay, dựng và màu từ brief đến bản giao."
arc: "Hook (rhetorical question) → Product intro → One-contact promise → Proof ×3 (call-sheet SCN) → Process → Social proof → CTA"
audience: "Khách doanh nghiệp tại Hải Phòng / miền Bắc cần TVC, nội dung dài hạn"
mode: autonomous
music: none
language: vi
---

# XQuang deNoise — promo 45s (9:16)

Silent build: no narration (`narration: no` in BRIEF.md) and `music: none` — the user lays a platform-native track in TikTok/Reels. All copy is ON-SCREEN text; each frame's `onscreen:` field is cue-segmented (` / ` = one reveal cue). With no voiceover, **the on-screen cues are the pacing track**: reveal each cue at its Scene window below, never all at t=0.

## Video direction

- **Palette (from `frame.md`, by role):** dark register = ground `ink-black #0E0D0C`, text `cream #EDEAE4`, accent `fire-orange #8A6A3C` (brass). Brass register = ground `#8A6A3C`, text `#0E0D0C` (ink-on-brass is absolute; never cream on brass). One register per frame. Rhythm: dark (1) → dark (2) → dark (3) → BRASS (4) → dark (5–8) → BRASS (9). No second hue anywhere (no teal).
- **Type (by role):** display / h1 / h2 = Newsreader lowercase, weight 700–900, negative tracking; label/kicker = IBM Plex Mono uppercase 0.14em. Vietnamese diacritics must render (load Newsreader + IBM Plex Mono from Google Fonts with the `vietnamese` subset). Legibility floor 1.4cqw for any load-bearing line; on 1080-wide canvas keep display lines ≤ 88cqw wide.
- **Recurring device — the call-sheet slate:** every frame opens with its slate kicker (`SCN NN / …`) in IBM Plex Mono, preceded by a 36×2 brass rule stub, top-left at the safe-zone top (~13% height). It enters first via a quick "stamp" (a short scale-down settle + opacity in, `spring-pop-entrance` in its smooth long-tail register — no overshoot). SCN 01→10 is the video's spine.
- **Motion grammar:** smooth long-tail settles (`power3` default; `expo.out` for fast arrivals); display words arrive by a short rise + unblur (`waterfall-entry` / `dynamic-content-sequencing`); in-slot swaps are instant hard cuts (`discrete-text-sequence`). Each cue reveals in its own window, spread across the frame — never front-loaded. Holds are still; the only sanctioned aliveness is a subtle low-amplitude jitter (`sine-wave-loop`, finite).
- **Held / breather frames:** Frame 5 (ORPC) and Frame 8 (clients) are calmer reads; Frame 4 and Frame 9 are the peaks (brass).
- **Texture:** registry component `grain-overlay` mounted once over the whole video at low opacity (~0.08–0.12); heavier (~0.18) inside Frame 4 only. Plus thin vertical scratch lines (1px, cream at ≤15% opacity) that appear on a few index-derived frames — deterministic, never `Math.random`.
- **Safe zones (9:16 feed):** load-bearing text between 12% and 78% of canvas height; side padding 5.5cqw minimum. The bottom ~20% stays clear (TikTok/Reels UI + caption band).
- **Negative list:** no logos (clients are TEXT only; never the Thép Nhật Tiến logo); no website URL; no deposit % / revision count; no view counts or results metrics; no teal/second accent; no bouncy/elastic/back.out overshoot; no lazy breathing; no slow back-half pan/push; no `repeat: -1`, `Math.random`, `Date.now`, CSS transitions/keyframes for motion; no slideshow (front-load then freeze); no screensaver (many elements drifting independently).
- **Numerals allowed on screen:** years, SCN catalogue numbers, step numbers 01–04, "1 tháng", "1 ngày làm việc", the Zalo number. Nothing else.

## Frame 1 — Hook

- scene: Câu hỏi trực diện bung chữ theo từng cụm trên nền đen ấm
- onscreen: "thuê một ê-kíp lớn," / "hay một người" / "làm được cả ê-kíp?"
- voiceover: ""
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Rhetorical question (reframes the buying decision)
- beat: curiosity + tension
- blueprint: kinetic-type-beats (Adapt)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Stop the scroll with the exact question a business owner weighs before hiring production.
keyMessage: There is a third option between a big agency crew and a lone freelancer.

Adapt: keep the statement-builds-across-beats spine with the payoff landing last; three cues stacked left-aligned rather than one centered line swapping. No slate kicker on this frame (cold open) — the slate device starts at Frame 2.
Scene 1 (0.0–1.2s): warm-black field, empty for ~0.3s, then "thuê một ê-kíp lớn," rises + unblurs in cream at h1 scale, left-aligned at ~34% height (`waterfall-entry`, per-word). Asymmetric left 80/20.
Scene 2 (1.2–2.3s): "hay một người" arrives on the line below the same way — the first line dims to ~45% opacity as it lands, so the eye moves down.
Scene 3 (2.3–4.0s): "làm được cả ê-kíp?" lands last at display-leaning scale in brass (the one accent clause) with a slightly faster arrival (`expo.out`); holds still to the cut. Stack occupies ~55% of the frame height band 30–70%.

## Frame 2 — Introducing XQuang

- scene: Slate call-sheet đóng dấu "SCN 01 / HERO / HẢI PHÒNG", tên xquang cỡ display, dòng mô tả dịch vụ
- onscreen: "SCN 01 / HERO / HẢI PHÒNG" / "xquang." / "filmmaker tại hải phòng" / "TVC doanh nghiệp · nội dung dài hạn · MV nghệ sĩ"
- voiceover: ""
- duration: 4s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-intro.html
- type: product_intro
- persuasion: Identity reveal answers the hook
- beat: clarity
- blueprint: titlecard-reveal (Adapt)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Answer the hook with the name — this is the "one person" the question pointed at.
keyMessage: XQuang, filmmaker tại Hải Phòng.

Adapt: the Product_Intro title prelude as ONE card built in three cues (not three hard-cut cards) — slate → name → descriptor, then hold.
Scene 1 (0.0–0.6s): rule stub + slate "SCN 01 / HERO / HẢI PHÒNG" stamps in top-left (~13% height).
Scene 2 (0.6–1.8s): "xquang." arrives at `display` scale (the one display moment), cream, left-anchored at ~40% height, via a blur-snap into focus (scale 1.04→1, blur→0, `power3`); the period in brass.
Scene 3 (1.8–2.8s): "filmmaker tại hải phòng" rises in beneath at `h2` scale, cream.
Scene 4 (2.8–4.0s): a 1px hairline draws left→right under it, then the mono line "TVC DOANH NGHIỆP · NỘI DUNG DÀI HẠN · MV NGHỆ SĨ" types on (label style, cream at ~70%); hold.

## Frame 3 — One contact, whole pipeline

- scene: Dòng neo cố định "một đầu mối." trong khi các vai trò lần lượt thay nhau ở một khe, chốt bằng "từ brief đến bản giao."
- onscreen: "SCN 02 / QUY TRÌNH" / "một đầu mối." / "ý tưởng" / "đạo diễn" / "camera" / "dựng" / "màu" / "từ brief đến bản giao."
- voiceover: ""
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-one-contact.html
- type: benefit_highlight
- persuasion: Friction reduction — one point of contact instead of coordinating a crew
- beat: relief + control
- blueprint: fixed-anchor-cycle (Reproduce — sub-shape A)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Land the value claim (message) by beat 3 — the promise the rest of the video proves. A small mono footnote credits Denoise (core team 4 người) as production support.
keyMessage: Một đầu mối từ brief đến bản giao.

Scene 1 (0.0–1.3s): slate "SCN 02 / QUY TRÌNH" stamps in; then the anchor "một đầu mối." lands at `h1` scale, cream, left-anchored at ~36% height — and PINS (zero movement for the rest of the frame).
Scene 2 (1.3–4.2s): signature move — the slot directly beneath the anchor (brass, `display`-leaning scale) steps through "ý tưởng" → "đạo diễn" → "camera" → "dựng" → "màu" by instant hard cuts, slow→accelerating cadence (~0.8s, 0.65s, 0.5s, 0.45s, then "màu" holds ~0.6s) (`discrete-text-sequence` + `dynamic-content-sequencing`). The slot never touches the anchor.
Scene 3 (4.2–6.0s): the slot clears on a cut; "từ brief đến bản giao." builds word-by-word in cream at `h2` scale under the anchor (`waterfall-entry`) and the lockup holds; at ~5.0s the mono footnote "CÙNG DENOISE · CORE TEAM 4 NGƯỜI" fades in at ~66% height, cream at ~55%. Hold still.

## Frame 4 — SCN: Pullupinmymind

- scene: Call-sheet entry đầy đủ cho MV Pullupinmymind – Rollin trên register đồng; nháy flash trắng như strobe, grain dày hơn
- onscreen: "SCN 03 / MV / 2025" / "pullupinmymind" / "rollin" / "đạo diễn · DOP · quay · dựng · màu" / "studio tối · flash · grain" / "ý tưởng → lên sóng: 1 tháng"
- voiceover: ""
- duration: 7s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/04-pullupinmymind.html
- type: feature_showcase
- persuasion: Show-don't-tell proof — one film where he held every role
- beat: intrigue + confidence
- blueprint: titlecard-reveal (Adapt)
- focal: editorial-flash-overlay (registry block) — camera-flash cut on the title reveal
- asset_candidates:

narrativeRole: The strongest proof of the one-contact promise: a single project where XQuang did direction, DOP, camera, edit and color. Stand-in for real footage — a white flash strobe and heavier grain evoke the MV's dark/flash/grain look (no teal hue: frame.md allows one accent only).
keyMessage: Làm trọn mọi vai, 1 tháng từ ý tưởng tới lên sóng.

Adapt: a call-sheet entry card built cue by cue; the "one move" is the flash-cut reveal of the title. BRASS register (ground #8A6A3C, ink text).
Scene 1 (0.0–0.8s): brass field, heavier grain; slate "SCN 03 / MV / 2025" stamps in top-left in ink at ~55%.
Scene 2 (0.8–2.0s): signature — a neutral-warm camera flash (`editorial-flash-overlay`) pops full-frame and, as it decays, "pullupinmymind" is revealed at `h1`/`display` scale in ink, left-anchored at ~30% height (fit-to-measure: one long word — size so it stays ≤ 88cqw); "rollin" follows in ink ~75% at `h2` beneath it.
Scene 3 (2.0–4.4s): a 1px ink hairline; below it the call-sheet rows arrive one by one (~0.7s apart), mono label left + Newsreader value right: "VAI TRÒ — đạo diễn · DOP · quay · dựng · màu", "CHẤT — studio tối · flash · grain".
Scene 4 (4.4–7.0s): the last row "TIẾN ĐỘ — ý tưởng → lên sóng: 1 tháng" arrives with "1 tháng" in ink at `h3` weight 800; a second, smaller flash blip at ~5.0s (strobe echo); then hold still to the cut.

## Frame 5 — SCN: ORPC

- scene: Call-sheet entry gọn cho ORPC — tên lớn, loại + năm
- onscreen: "SCN 04 / TVC / 2026" / "orpc" / "TVC doanh nghiệp"
- voiceover: ""
- duration: 4s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-orpc.html
- type: social_proof
- persuasion: Authority by association (current corporate TVC)
- beat: trust
- blueprint: titlecard-reveal (Reproduce — calm card)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Proof for the business audience — a current TVC. NAME + TYPE + YEAR ONLY; no case-study claims (case study not written yet).
keyMessage: Đang làm TVC cho doanh nghiệp.

Scene 1 (0.0–0.6s): dark field; slate "SCN 04 / TVC / 2026" stamps in.
Scene 2 (0.6–1.8s): "orpc" fades in at `display` scale (cream) with a subtle 96%→100% scale settle, left-anchored at ~40% height — the one restrained move.
Scene 3 (1.8–4.0s): "TVC doanh nghiệp" slides up into place beneath at `h2` in brass; the card holds still (calm breather frame).

## Frame 6 — Quick reel: three more films

- scene: Ba slate SCN chớp nối tiếp nhau như lật nhanh call sheet
- onscreen: "SCN 05 / TVC / 2025 — thép nhật tiến" / "SCN 06 / TVC / 2023 — thủy sản anh minh" / "SCN 07 / MV / 2025 — còn chờ là còn nhớ"
- voiceover: ""
- duration: 5s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-reel.html
- type: social_proof
- persuasion: Rule of three / breadth (TVC ×2 + MV)
- beat: confidence
- blueprint: kinetic-type-beats (Adapt — in-place card swap)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Breadth at speed — more TVCs across years plus a second MV. Text only; the Thép Nhật Tiến logo is never shown.
keyMessage: Nhiều năm, nhiều ngành, cả TVC lẫn MV.

Adapt: the in-place swap applied to a whole call-sheet entry (slate + title + role line) — three entries occupy the same position, each replaced by an instant hard cut, like flipping call-sheet pages. A mono page counter "05 / 06 / 07" at the top-right steps with each.
Scene 1 (0.0–1.6s): slate "SCN 05 / TVC / 2025" + "thép nhật tiến" (h1, cream, left at ~38%) + mono "TVC DOANH NGHIỆP" beneath.
Scene 2 (1.6–3.2s): hard cut → "SCN 06 / TVC / 2023" + "thủy sản anh minh" + "TVC DOANH NGHIỆP".
Scene 3 (3.2–5.0s): hard cut → "SCN 07 / MV / 2025" + "còn chờ là còn nhớ" + "ĐỒNG ĐẠO DIỄN · QUAY · DỰNG"; hold. Each entry's title arrives with a very short rise (≤0.25s) so the cut reads as a flip, not a slideshow fade.

## Frame 7 — Process in 4 steps

- scene: Danh sách 4 bước quy trình tích lũy dần theo thứ tự, số mono 01–04
- onscreen: "SCN 08 / QUY TRÌNH 4 BƯỚC" / "01 nhận brief & chốt dự án" / "02 tiền kỳ & điều phối" / "03 quay & hậu kỳ" / "04 nghiệm thu & hoàn tất"
- voiceover: ""
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-process.html
- type: benefit_highlight
- persuasion: Risk reversal via a clear, predictable process
- beat: peace of mind
- blueprint: grid-card-assemble (Reproduce — accumulating vertical list)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Remove the business buyer's fear of a messy freelance process. No deposit % and no revision counts on screen.
keyMessage: Quy trình rõ ràng, 4 bước.

Scene 1 (0.0–0.8s): slate "SCN 08 / QUY TRÌNH 4 BƯỚC" stamps in.
Scene 2 (0.8–4.6s): four rows populate a vertical list one per ~0.95s, each a top-border-only row (1px `border-dark` hairline above): big brass mono-numeral "01"…"04" left, Newsreader `h3` step text in cream right. Each row pops into its slot with a short rise; the previous rows stay (co-resident, accumulating). List spans ~22%–70% height.
Scene 3 (4.6–6.0s): all four hold; row "04" hairline turns brass as the completion accent; still hold.

## Frame 8 — Worked with

- scene: Tên khách hàng xếp thành một cột chữ, lần lượt hiện
- onscreen: "SCN 09 / ĐÃ THỰC HIỆN CÙNG" / "ORPC" / "Thép Nhật Tiến" / "AMFCO" / "Rollin" / "Shartnuss" / "Wavy Channel"
- voiceover: ""
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-clients.html
- type: social_proof
- persuasion: Social proof
- beat: trust
- blueprint: grid-card-assemble (Adapt — text-only name wall)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Close the proof section with the full client roll. Names as TEXT only — no logos.
keyMessage: Doanh nghiệp và nghệ sĩ đã tin chọn.

Adapt: the logo wall becomes a typographic roll — six names, no logos.
Scene 1 (0.0–0.6s): slate "SCN 09 / ĐÃ THỰC HIỆN CÙNG" stamps in.
Scene 2 (0.6–2.6s): six names cascade in as a left-aligned column at `h2` scale (lowercase per frame.md is NOT applied to proper names — keep their casing), cream, staggered ~0.3s apart (`waterfall-entry`), each separated by a 1px hairline. Column spans ~22%–72% height.
Scene 3 (2.6–4.0s): hold still (breather before the CTA).

## Frame 9 — CTA

- scene: End card trên register đồng: "gửi brief." cỡ display, cam kết phản hồi, Zalo lớn và rõ
- onscreen: "SCN 10 / WRAP" / "gửi brief." / "denoise phản hồi trong 1 ngày làm việc" / "ZALO 0822 394 289" / "XQUANG · DENOISE PRODUCTION HOUSE · HẢI PHÒNG"
- voiceover: ""
- duration: 7s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/09-cta.html
- type: cta
- persuasion: Friction reduction (fast response promise + one channel)
- beat: urgency-to-act
- blueprint: titlecard-reveal (Adapt — CTA end-card)
- focal: none (typographic)
- asset_candidates:

narrativeRole: Turn interest into a message. Zalo only — no website URL (site not deployed).
keyMessage: Gửi brief qua Zalo 0822 394 289.

Adapt: one end card built in cues instead of a hard-cut chain; BRASS register, ink text.
Scene 1 (0.0–0.6s): brass field; slate "SCN 10 / WRAP" stamps in (ink ~55%).
Scene 2 (0.6–1.8s): "gửi brief." slams in at `display` scale, ink, left-anchored at ~34% height (fast arrival, `expo.out`, no overshoot).
Scene 3 (1.8–2.8s): "denoise phản hồi trong 1 ngày làm việc" rises in beneath at `lead`/`h3` scale, ink ~75%.
Scene 4 (2.8–5.0s): a solid ink block (0 radius) wipes open left→right at ~58% height carrying "ZALO 0822 394 289" in brass-on-ink mono at large size (≥ 5cqw, tabular numerals) — the most legible element in the frame; then the mono sign-off "XQUANG · DENOISE PRODUCTION HOUSE · HẢI PHÒNG" fades in at ~70% height (ink ~55%). Final frame: hold to end (this is the only frame with a real ending — hold, no exit).
