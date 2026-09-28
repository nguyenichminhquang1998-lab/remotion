---
format: 1080x1920
duration: 35s
message: "Diamond Crown Hai Phong — the tallest icon of a city on the rise."
arc: "Hook (city pace) -> Identity reveal -> Proof (stat grid) -> Design craft -> Lifestyle -> Close (brand hold)"
audience: "Prospective buyers/investors and general audience following Hai Phong's skyline growth"
mode: autonomous
music: modern-driving-electronic
language: en
---

# Diamond Crown Hai Phong — promo 35s (9:16)

English VO throughout (see `SCRIPT.md`). Music bed + SFX are synthesized locally
(no HeyGen sign-in in this environment) — original procedural composition, not a
licensed track. All four frames' backgrounds are the developer's own real CGI
renderings (`assets/images/`) — no invented photography, no stock imagery.

## Video direction

- **Palette (from `frame.md`):** dark register = ground `ink-black #0A0E14`, text
  `cream #F3F5F8`, accent `electric-cyan #35D6FF`. Cyan register (stat cards) =
  ground `#35D6FF`, text `ink #0A0E14` (ink-on-cyan is absolute; never cream on
  cyan). One register per frame — Frame 3 is the only cyan-ground frame.
- **Type:** Space Grotesk for all display/body (lowercase, negative-tracked,
  weight 700-900 for display per `frame.md`); IBM Plex Mono uppercase 0.14em for
  labels/kickers/stat units. Legibility floor 1.4cqw; display lines ≤ 78cqw.
- **Photographic ground:** every non-stat-grid frame's ground is one of the 4
  renderings, full-bleed, with a bottom-anchored dark gradient scrim
  (`linear-gradient(to top, rgba(10,14,20,.92) 0%, rgba(10,14,20,.55) 32%, transparent 62%)`)
  so cream/mono text stays legible without hiding the image. No CSS filter
  stylization beyond exposure/contrast trim — the renderings are already graded.
- **Motion grammar — "fast, modern, city pace":** every image frame runs a
  continuous Ken Burns move (scale 1.06->1.16 or 1.14->1.04, paired with a slow
  directional pan) across its full duration — never a static hold on a photo.
  Type arrives by fast `expo.out` rises/unblurs (0.35-0.5s), no `power3` slow
  settles anywhere in this video — the previous project's slow cinematic pace is
  explicitly NOT this mood. All frame-to-frame cuts are hard cuts
  (`transition_in: cut`, no injected crossfade/wipe — flat-plane doctrine, no
  blur). Frame 3 and Frame 6 each author their OWN opening beat as a fast
  cyan/white flash (2-3 frames, full-frame `opacity` flash on their own internal
  timeline, not a between-frame injector effect) echoing the diagrid's own light.
- **Recurring device — the stat/kicker chrome:** IBM Plex Mono kicker
  (uppercase, 0.14em, cyan on dark) top-left at the safe-zone top (~10% height),
  entering via a quick opacity+2px rise, no elaborate stamp move (that was the
  denoise-promo's device; this system is flatter/faster per `frame.md`).
- **Texture:** none — `frame.md`'s flat-plane rule (no grain/scratch layer here;
  the photographic renderings already carry their own detail).
- **Safe zones (9:16):** load-bearing text between 10% and 76% of canvas height;
  side padding 5.5cqw. Bottom ~18% stays clear (platform UI/caption band).
- **Negative list:** no invented pricing/unit data, no invented contact/CTA (none
  supplied — see `BRIEF.md`), no claim that construction is complete, no DOJI
  corporate logo (not supplied, only the Diamond Crown crown mark already baked
  into `03-hero-dusk.jpg`), no second accent hue, no drop shadows/gradients on
  type, no slow `power3` settles, no `repeat: -1`, `Math.random`, `Date.now`.
- **Numerals allowed on screen:** 186 (m), 45 (floors), 39 (floors), 1.3 (ha) —
  all sourced from verified public reporting on this project (`BRIEF.md`
  Intent). Nothing else numeric.

## Frame 1 — Hook: city pace

- scene: Aerial night rendering, fast punch-in Ken Burns; kinetic type states the hook
- duration: 4s
- transition_in: cut
- status: animated
- voiceover: "Hai Phong doesn't wait for the future."
- src: compositions/frames/01-hook.html
- asset_candidates: assets/images/01-aerial-night.jpg

Cold open on the city itself, not the building — the aerial night shot (river,
towers, elevated highways, dense lights) sells scale and motion before the
building is even named. Kicker "HAI PHONG, VIETNAM" mono top-left at ~0.3s. The
VO line lands as one Space Grotesk `h1` lowercase line, cream, left-anchored at
~45% height, rising in fast (`expo.out`, 0.4s) at ~0.8s and holding to the cut.
Ground pans/scales continuously the whole 4s (slow diagonal drift + 1.06->1.14
scale) — never static.

## Frame 2 — Identity reveal

- scene: Branded hero-dusk rendering; project name confirms the hook's subject
- duration: 5s
- transition_in: cut
- status: animated
- voiceover: "This is Diamond Crown Hai Phong."
- src: compositions/frames/02-identity.html
- asset_candidates: assets/images/03-hero-dusk.jpg

The hero-dusk rendering already carries the DIAMOND CROWN logo mark baked into
the image (top-left) — do not duplicate it as HTML type; let the real asset
carry the brand mark. Add only: mono kicker "DOJILAND" top-right at ~10% height
(entrance ~0.3s), and the VO line as a Space Grotesk `h2` lowercase line, cream,
left-anchored at ~62% height, arriving word-by-word fast (`expo.out`, per-word
stagger 0.08s) starting ~1.0s, holding to the cut. Ground: slow push-in
(1.0->1.08) over the full 5s, no pan (the towers' verticality should read as
stable and monumental against the fast pace elsewhere).

## Frame 3 — Stat grid: the numbers

- scene: Flat cyan-register stat grid — three verified figures, no photo
- duration: 6s
- transition_in: cut
- status: animated
- voiceover: "One hundred eighty six meters. Forty five and thirty nine floors. Two towers, one skyline."
- src: compositions/frames/03-stats.html
- asset_candidates: none (flat cyan ground per frame.md's stat-grid treatment)

The one dense/data frame and the one cyan-ground frame in the video — matches
`frame.md`'s "stat grid is the density exception." Three top-border-only stat
cards stacked vertically (9:16 stacking per `frame.md`'s aspect-ratio table):
**186** + mono unit "METERS TALL" (~0.2s cut-in), **45 / 39** + mono unit
"FLOORS — HOTEL / RESIDENCE" (~2.0s), **1.3** + mono unit "HECTARES" (~3.8s).
Each numeral is Space Grotesk 900 in ink-on-cyan, arriving as a fast hard cut
(no tween-in on the numeral itself, per `frame.md`'s stat-card convention) with
only its supporting label rising in underneath. Hold the full card set from
~4.2s to the cut at 6s.

## Frame 4 — Design craft

- scene: Crown/spire lattice close-up; the design-language claim
- duration: 6s
- transition_in: cut
- status: animated
- voiceover: "A diagrid crown, rare in Asia — designed for this skyline."
- src: compositions/frames/04-design.html
- asset_candidates: assets/images/04-crown-detail.jpg

Back to dark register, back to photographic ground. Mono kicker "DIAGRID FACADE"
top-left (~0.3s). VO line as Space Grotesk `h1` lowercase, cream, left-anchored
at ~58% height, one clause ("rare in Asia") inked cyan per `frame.md`'s
single-accent-clause rule, arriving fast (`expo.out`) at ~1.0s, holding to the
cut. Ground: continuous slow rotate-feel pan (translate diagonally toward the
spire tip) + scale 1.08->1.18 across the full 6s — the fastest/tightest Ken
Burns move in the video, matching this frame's "craft under magnification" beat.

## Frame 5 — Lifestyle at street level

- scene: Plaza/retail podium rendering; life at the base of the towers
- duration: 6s
- transition_in: cut
- status: animated
- voiceover: "Retail, greenery, life at street level."
- src: compositions/frames/05-lifestyle.html
- asset_candidates: assets/images/02-plaza-day.jpg

Daytime warmth is a deliberate beat change (the only daytime frame) — the pace
stays fast even in a calmer register. Mono kicker "GROUND LEVEL" top-left
(~0.3s). VO line as Space Grotesk `h2` lowercase, cream, left-anchored at ~64%
height, rising fast at ~1.0s. Ground: lateral pan left->right (1.05 scale,
constant) across the full 6s, following the plaza's own horizontal sightline.

## Frame 6 — Close: brand hold

- scene: Aerial night rendering (bookend to Frame 1); wordmark + tagline hold
- duration: 8s
- transition_in: cut
- status: animated
- voiceover: "Diamond Crown Hai Phong. The city's new icon, rising now."
- src: compositions/frames/06-close.html
- asset_candidates: assets/images/01-aerial-night.jpg

Bookends the video on the same aerial-night plate as Frame 1 (recognizable
return, not a repeat — slower/wider Ken Burns here signals "arrival" after the
fast middle). No CTA / contact info (none supplied — do not invent one). Beat:
"diamond crown hai phong." lands as Space Grotesk `display` lowercase, cream,
~0.6s in (`expo.out`), left-anchored ~40% height, PINS. "the city's new icon,"
rises beneath at `h2` ~2.0s. ", rising now." completes the line in cyan
(single-accent clause) at ~3.4s. Mono sign-off "DOJILAND · HAI PHONG, VIETNAM"
fades in at ~66% height, cream at ~55%, ~4.5s. Ground: continuous slow
zoom-out-feel drift (1.10->1.02, the one de-escalating move in the video) from
0s, giving the whole close a settling, monumental finish. Hold static (type)
from ~5.0s to the end at 8s — final frame, no exit.
