# Claude Code independent PX3 follow-up critic — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Snapshot: `84083a6f61a62085ae5d083124f14f984a06521e`.
- Mode: fresh project-scoped `critic`, high-effort read-only design/accessibility review.

## Raw reviewer output

## VERDICT: CHANGES_REQUESTED

## PREVIOUS FINDINGS 1–5

1. **First loop imperceptible — CLOSED.** `evidence/premium-media/px3-motion-diff-after-20260909.txt` reports sampled-frame MAE of 1.09%–1.74% (vs. the critic's original ~0.10–0.26%), and `px3-motion-contact-sheet-after-20260909.png` visually confirms the horizontal guide line and burgundy plane clearly change position/width across the four quarter-cycle samples. Motion is now visibly perceptible.

2. **Radial/glow → cyberpunk risk — CLOSED.** The contact sheet shows flat vertical planes and one thin horizontal line on a near-black field — no radial arc, bloom, or neon edge. `app/premium.css:1-2` states the design intent explicitly ("Quality comes from hierarchy, whitespace and a quiet signal mark, not glow/chrome"), and `.intro-media video{...filter:saturate(.78) contrast(1.03)}` (line 41) further desaturates the clip.

3. **No deterministic binary guard — CLOSED.** `tests/product/media-assets.test.ts:7-40` pins exact SHA-256 + byte size for both video and poster. Independently reproduced: `sha256sum public/media/donna-ambient-loop.mp4 public/media/donna-ambient-poster.webp` returns hashes identical to the pinned values, and `npx vitest run tests/product/media-assets.test.ts` → 2/2 PASS. Independently ran `ffprobe` on the actual committed file: 8.000000s, 1280x720, h264, single video stream, no audio stream — matches `px3-ffprobe-after-20260909.json` exactly.

4. **No Pause/Stop mechanism — CLOSED as a mechanism, but see new finding below.** `src/ui/support-chat.tsx:109-115` renders a real `<button>` with `aria-pressed`/`aria-label` toggling "Pause ambient motion" / "Play ambient motion", wired to `video.pause()/play()`, and is fully hidden (not just disabled) when `prefers-reduced-motion: reduce` (`app/premium.css:229`, confirmed by `videoCount:0`/`button:null` in the reduced-motion geometry entries). `e2e/chat.spec.ts:42-49` exercises pause/play. The mechanism exists and works, but its **placement** introduces a new mobile defect (Finding P1 below).

5. **No dedicated 320/360 media evidence — CLOSED for existence, with a coverage gap.** `px3-repair-browser-geometry-20260909.json` and matching screenshots now exist for 1440/360/320 motion and 1440/360 reduced-motion, all reporting `horizontalOverflow:false`. However, no 760px sample (required by the UX-05 width set 320/360/760/1280) and no 320px reduced-motion sample were captured — see NEW FINDING P2.

## NEW BLOCKING FINDINGS

**P1 — Pause control visually overlaps and obscures the PX2 hero headline on mobile.** Cropping `evidence/premium-media/px3-repair-motion-mobile-360-20260909.png` at y≈190–270 (3× zoom) shows the "Pause" button rendered directly on top of the final headline line "next move." — the period is fully hidden and the word "move" is partly covered. Root cause: `.motion-toggle` (`app/premium.css:48-65`) is `position:absolute;right:20px;bottom:20px` relative to `.intro`, with no reserved space. At the mobile breakpoint (`app/premium.css:191`, `.intro{min-height:auto...}`) `.intro-description`/`.intro-bottom` are hidden (line 193) but `h1` still renders at `clamp(40px,8vw,58px)` (line 194), so the last wrapped line lands under the fixed-offset button. `px3-repair-browser-geometry-20260909.json` reports **identical** button geometry (top 224.8 / bottom 268.8) for both the 360 and 320 entries, so the same overlap is expected at 320px even though no 320px motion screenshot was supplied to confirm visually. This directly contradicts the review's own criteria ("readable on mobile," "supports rather than competes with the PX2 hero") and the UX-05 "no obscured content" contract. Neither `e2e/chat.spec.ts:30-49` (desktop) nor the same test under the `mobile` Playwright project (`playwright.config.ts:20`, 360×800) asserts non-overlap/bounding-box geometry — only attribute/visibility checks — which is why this shipped despite "56/56 PASS."
**Repair scope:** reserve layout space for the toggle at the mobile breakpoints (e.g., inline-flow placement below the headline, or `padding-bottom`/`margin` on `.intro-copy` sized to the button, or move the control off the text baseline) plus one added geometry assertion (bounding-box non-intersection between `h1` and `.motion-toggle`) at 320/360 to prevent silent regression. This is a small, localized CSS/markup fix, not a re-open of the whole PX3 scope.

**P2 — Incomplete width coverage for the required UX-05 set.** No 760px motion screenshot/geometry and no 320px reduced-motion screenshot/geometry were captured, though 320/360/760/1280 is the contract's stated width set. Given P1's breakpoint-dependent nature, 760px is exactly the size most likely to hide or reveal a related overlap (h1 clamp(40,8vw,58) at 760px ≈ 58px, larger than the 360/320 case).
**Repair scope:** add the missing 760px motion and 320px reduced-motion captures alongside the P1 fix, in the same evidence set.

## VISUAL JUDGMENT

Premium improvement — with one placement caveat. On desktop the motion itself (restrained burgundy/near-black planes, one thin drifting guide line, no radial/bloom) is a genuine, sober upgrade over the prior static loop and stays clearly subordinate to the PX2 headline and copy; the Pause control sits in quiet whitespace below the scope note, not competing with content. On mobile, as currently shipped, the same control is not neutral — it actively obscures the hero headline, which is a regression against "supports rather than competes with the hero," not merely a missed nicety. This is fixable with a small layout change; it does not indict the motion content itself.

## PX3 UNLOCK: NO

Do not hand to the independent verifier until P1 (mobile headline obscuring) is fixed and re-evidenced; P2 (760px + 320-reduced evidence) should be closed in the same pass to avoid another partial-coverage round-trip.

## What I did not verify

- Did not start a live dev server or run Playwright myself to reproduce the overlap interactively; conclusion is drawn from the repair's own committed screenshot (pixel-cropped and geometry-cross-checked), not a fresh live capture, so exact 320px visual overlap is inferred from identical button coordinates rather than directly screenshotted.
- Did not check 760px or other intermediate widths live (no evidence exists for these; flagged as a gap rather than confirmed pass/fail).
- Did not run `npm test` / `npm run test:e2e` / `npm run build` in full myself — relied on the repair note's reported results plus my own scoped `vitest run tests/product/media-assets.test.ts` (2/2 PASS) and an independent `sha256sum`/`ffprobe` check of the committed binaries.
- Did not measure numeric color contrast (e.g., WCAG 1.4.11 non-text contrast) of the Pause button against the moving video background.
- Did not perform actual screen-reader testing of the Pause/Play toggle's live announcement behavior.
- Did not review any code/diff outside the listed files, nor PX2 hero implementation beyond what's shown in the reviewed files.
