# Claude Code independent PX3 final critic — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Snapshot: `d6516e0323d1ed6c0012095872d3d956b7e94090`.
- Mode: fresh project-scoped `critic`, read-only final PX3 design gate.

## Raw reviewer output

This confirms the 8s duration is schema-validated (6–10s) and matches ffprobe evidence. My review is complete.

---

**1. VERDICT: PASS**

**2. P1 mobile overlap: CLOSED**
- Root cause was insufficient bottom padding in the mobile/tablet `.intro` breakpoints reserving no room for the absolutely-positioned `.motion-toggle`. Fix in `app/premium.css` (commit `d6516e0`): `max-width:900px` `.intro` padding-bottom `28px→84px`; `max-width:430px` padding-bottom `21px→76px`.
- `evidence/premium-media/px3-final-responsive-geometry-20260909.json` shows `headingControlOverlap:false` for `motion-1280`, `motion-760`, `motion-360`, `motion-320` (and `horizontalOverflow:false` for all). At 360/320 the button top (`y=279.8`) sits ~12 CSS px below the heading bottom (`y=267.8`).
- Visually corroborated in `px3-final-motion-760…png`, `px3-final-motion-360…png`, `px3-final-motion-320…png`: "Pause" pill sits clear below the headline in all three, no clipping/overlap.
- Regression added at `e2e/chat.spec.ts:62-92` ("ambient motion control never obscures the hero…") computes real heading/control rects at 320/360/760 and asserts non-intersection plus `scrollWidth <= innerWidth`.

**3. P2 width/reduced-motion coverage: CLOSED**
- Missing 760px motion and 320px reduced-motion evidence now exist: `px3-final-motion-760-20260909.png` (video mode, Pause visible, no overlap) and `px3-final-reduced-320-20260909.png` (poster only, no Pause button, no video element) — matching JSON entries `motion-760` and `reduced-320`.
- Same gap is now enforced by code, not just a screenshot: `e2e/chat.spec.ts:83-92` sets 320px viewport, `reducedMotion:"reduce"`, reloads, and asserts `data-motion="poster"`, zero `<video>`, zero ambient-motion button — matching `AmbientMedia` component logic in `src/ui/support-chat.tsx:61-115` (video/button only mounted when `motionAllowed`).

**4. NEW BLOCKING FINDINGS: NONE**
- The reserved bottom padding does not introduce new overflow (`horizontalOverflow:false` at all 6 sampled states) or push the chat card into overlap (workspace is a column flex with `gap`, unaffected by `.intro`'s internal padding).
- Motion content quality check (contact sheet + MAE diff `px3-motion-diff-after-20260909.txt`, normalized frame deltas ≈0.007–0.017) shows real, sober, non-flashy compositional movement — consistent with the prior critic's "premium improvement" conclusion; nothing in this repaired snapshot regresses that (video/poster hashes, byte sizes, and 8s duration are unchanged and still pinned by `tests/product/media-assets.test.ts` and schema `min(6).max(10)` in `src/product/types.ts:68`).
- Minor, non-blocking observation: `.motion-toggle` label text is `11px` (`app/premium.css:56`), below the ≥12px rule reserved for "helper/privacy/mode/boundary copy" — but this is a control label, not that category, and the 44×44 target-size rule (the applicable rule here) is met (`button height:44`, JSON `button.height:44`). Not treated as a blocker.

**5. DESIGN-REVIEW GATE: PASS-ELIGIBLE**
- Both blocking findings from the prior follow-up critic are closed with source-level fix, targeted automated regression, and consistent dedicated screenshot/geometry evidence at the required widths (320/360/760, plus 320 reduced-motion). No new P1/P2 surfaced.

**6. What I did not verify**
- Did not execute `npm run test:e2e`, `npm test`, `npm run build`, `npm run typecheck`, or `npm run lint` myself; I relied on the fixer-reported "286/286 Vitest + 58/58 Playwright PASS" in `evidence/premium-media/px3-layout-repair-20260909.md`, which is fixer self-report, not independent execution. A separate independent verifier run is still required per the checkpoint's own stated next step before PX3 is marked DONE.
- Did not inspect or open `evidence/premium-media/px3-final-motion-1280-20260909.png` or `px3-motion-contact-sheet-20260909.png` (before) — only the "after" contact sheet and 320/360/760/reduced-320 finals as scoped.
- Did not independently regenerate or byte-verify the video/poster hashes in `tests/product/media-assets.test.ts` (trusted the checked-in sha256 pins as-is).
- Did not confirm how `px3-final-responsive-geometry-20260909.json` was generated (no committed script found under that name); I cross-checked its numbers against CSS source and screenshots for internal consistency rather than re-running a capture script.
- Did not perform actual screen-reader, 200%-zoom, or text-spacing-override checks on the ambient control at these widths (out of this brief's scope).
- Did not re-review the broader Donna design-review/PX2 identity gate or PX4 — out of scope for this PX3-only review.
