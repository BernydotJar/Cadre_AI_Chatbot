# Claude Code independent PX3 ambient-media critic — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Snapshot: `adea74db532c99260439ff5ab80314212a783a36`.
- Mode: project-scoped `critic`, high-effort read-only design/accessibility review.

## Raw reviewer output

## VERDICT: CHANGES_REQUESTED

## BLOCKING FINDINGS (severity order)

**1. MAJOR — The ambient loop is visually imperceptible; it satisfies the checkbox but does not add atmosphere.**
Evidence (measured on the committed bytes, not just eyeballing):
- Extracted real video frames at t≈0s and t≈8s from `public/media/donna-ambient-loop.mp4` (`ffmpeg -vf select=...`) → raw pixel diff mean **0.04%**, max **2.35%** of full range.
- Full-page evidence screenshots `px3-motion-desktop-20260909.png` (video on) vs `px3-reduced-motion-desktop-20260909.png` (poster only) are visually indistinguishable; raw (non-normalized) pixel diff on the `.intro-media` crop: mean **~0.4%**, max delta only **27/255**.
- `px3-motion-contact-sheet-20260909.png`'s four sampled frames differ from each other by only **0.10%–0.26%** raw mean — indistinguishable by eye, as the file itself shows.
- The 8s/720p/H.264 file is only **14,565 bytes**, itself strong evidence of near-flat content (extreme compressibility).
- CSS further dampens it: `opacity:.74; filter:saturate(.82) contrast(1.04)` plus a `.intro-media::after` dark gradient overlay (`app/premium.css:41-47`).
Net effect delivered to a real user: a plain dark panel functionally identical to the static poster. This fails the review's explicit bar ("reject motion... too subtle to justify itself"; "judge whether this... actually adds atmosphere rather than merely satisfying a checkbox").
*Smallest repair:* either (a) rework the procedural source with a genuinely perceptible, still-sober luminance sweep and re-capture contact-sheet/diff evidence showing real visible motion, or (b) drop `ambientMedia` from `src/product/profiles/cadre-donna.ts` until such a version exists; keep the schema/UI/tests since they're inert and harmless.

**2. MAJOR — Any naive fix for #1 risks resurfacing forbidden neon/cyberpunk styling.**
Level-boosting the raw frame (`convert f_01.png -level 0%,8%`) reveals the underlying, currently-invisible content: a crimson vertical **arc/glow band** plus H.264 macroblock banding, not clean "architectural guide lines" as the producer note (`evidence/premium-media/px3-producer-20260909.md:7`) describes. At today's opacity it's safely sober, but simply raising brightness/opacity to fix #1 would surface exactly the glow/energy-arc register PX3 forbids ("must not bring back cyberpunk/neon AI styling").
*Smallest repair:* if reworking, regenerate with an explicitly reviewed flat/low-key sweep (no radial arc glow, no bitrate-starved banding) rather than amplifying the existing clip.

**3. MODERATE — No automated regression guard ties the binary asset to the declared contract.**
`tests/product/contracts.test.ts` and `tests/product/view.test.ts` only validate the profile's *declared* `durationSeconds`/paths, not the actual `public/media/donna-ambient-loop.mp4` bytes. Nothing in CI would fail if the real file grew, gained an audio track, or drifted from the declared 8s — only the one-time manual `px3-ffprobe-20260909.json` proves today's file is compliant.
*Smallest repair:* add a small vitest that ffprobes the real asset and asserts duration ∈[6,10], zero audio streams, and a byte-size budget.

**4. MODERATE — WCAG 2.2.2 (Pause/Stop/Hide) gap.**
The video autoplays, loops, and runs >5s with no in-page pause control; it's mitigated by `aria-hidden`, decorative status, and reduced-motion fallback, but is not fully addressed for no-preference users, and this mitigation is fragile — it currently "works" partly *because* the motion is imperceptible (Finding 1). SC 2.2.2 is not in CLAUDE.md's declared subset, so this isn't a scope violation, but it's a real unaddressed gap being introduced now.
*Smallest repair:* log it explicitly as an accepted decorative exemption, or add a pause affordance if #1 is fixed by making motion more visible.

**5. MODERATE — Mobile reflow evidence gap for the new element.**
`px3-browser-geometry-20260909.json` only records a 1440px probe (`introWidth: 678.42`, `documentWidth: 1440`, no overflow). No 320/360px sample for `.intro-media`/video exists in that dedicated artifact, despite CLAUDE.md's UX-05 requiring 320/360 reflow checks for new UI. The producer's 56/56 e2e claim (desktop+mobile) is asserted, not shown, in this artifact.
*Smallest repair:* add a 360px (and ideally 320px) geometry sample to the evidence file.

**Note (not blocking):** `evidence/premium-media/px3-motion-contact-sheet-20260909.png` is untracked (`git status --short` shows `??`) — not part of committed HEAD `adea74d`, no recorded generation provenance. Useful for this critique but not registered evidence yet.

## CONTRACT MATRIX

| Dimension | Result | Basis |
|---|---|---|
| Duration 6–10s | PASS | ffprobe `"duration": "8.000000"`; zod `.min(6).max(10)` |
| Audio (muted, no track) | PASS | ffprobe: single video stream, no audio stream; DOM `muted` attr, e2e-asserted |
| No embedded text | PASS | visual inspection of raw + level-boosted frames: abstract gradient/line/arc only |
| Poster/video continuity | PASS | poster vs. frame-0 raw diff mean 0.29%/max 4.3% (imperceptible mismatch); SSR always poster-only, no flash |
| Low payload | PASS (numerically) / **UNENFORCED** (Finding 3) | 14,565B video + 2,494B poster; no CI guard |
| Loop non-aggressive | PASS | start/end frame diff ~0.04% raw — no visible/jarring seam, but inseparable from Finding 1 |
| `prefers-reduced-motion` | PASS | `AmbientMedia` gates via `matchMedia`; defensive CSS `display:none!important`; e2e reload test asserts 0 `<video>` + poster background |
| Local authority boundary | PASS | `localPosterPath`/`localVideoPath` regexes reject traversal (`/media/../x.mp4`) and protocol-relative (`//evil.com/...`) — verified by direct regex test; media is `aria-hidden`, `pointer-events:none` |
| Readability | PASS (by side-effect) | text z-index above media; contrast unaffected because motion is effectively invisible — must be re-checked if Finding 1 is fixed |
| Profile reuse (optional, no bleed) | PASS | schema `.optional()`; `tests/product/view.test.ts` asserts Acme/Scout `ambientMedia` is `undefined` |

## VISUAL JUDGMENT

Should be reworked or removed. As shipped, the loop is not a perceptible cinematic layer — it is measurably (not just subjectively) near-static, indistinguishable from the poster in normal viewing, at a magnitude smaller than typical display noise/dithering. It does not deliver the "large-company/Silicon-Valley cinematic scale" the owner asked for; it delivers a correctly-shaped, correctly-muted, correctly-durationed file that happens to render as almost nothing. Its safety (no neon, no distraction, no legibility harm) is real but is largely a byproduct of that invisibility rather than of deliberate restrained design — level-boosting shows the underlying asset leans toward a glow/arc motif that would need real design discipline, not just an opacity dial, to become both visible and sober.

## PX3 RELEASE RECOMMENDATION: REPAIR REQUIRED

Not DONE-eligible at this snapshot. Finding 1 is a design-intent failure, not a broken build — if the coordinator/owner explicitly decides "intentionally near-invisible atmosphere is acceptable," that is a legitimate call, but it must be a recorded decision (this review was explicitly asked to judge that exact question and answers "reject/rework"), not a silent pass. Findings 3–5 should be closed alongside any rework before independent verifier sign-off.

## What I did not verify
- Did not run `npm run test:e2e`, `npm run build`, `npm run typecheck`, `npm run lint`, or the full `npm test` (284 tests) myself; only independently re-ran `tests/product/contracts.test.ts` + `tests/product/view.test.ts` (11/11 pass, confirmed directly).
- Did not reproduce the producer's claimed 56/56 Playwright pass (desktop+mobile), including the two new ambient-media e2e tests, in a live browser session.
- Did not perform actual assistive-technology (screen reader) testing of the `aria-hidden` media region.
- Did not assess GPU/decode cost or subjective playback smoothness on real hardware/displays — analysis was done on the committed PNG/MP4 bytes via ImageMagick/ffmpeg, not a rendered live session.
- Did not verify provenance/generation method of the untracked contact-sheet PNG.
- Did not inspect Graph Harness/ledger state, spend provider budget, or touch deployment — out of scope per task constraints.
- Did not review all of `app/premium.css` end-to-end for unrelated regressions; only the PX3 diff hunk and its immediate stacking/media-query context.
