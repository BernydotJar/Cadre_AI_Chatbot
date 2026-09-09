# PX3 layout repair — Pause control and full width evidence — 2026-09-09

The second independent Claude Code critic closed all five original media findings but found two new release blockers: the Pause control overlapped the hero headline at compact widths, and the dedicated evidence set omitted 760px motion plus 320px reduced-motion coverage.

## Repair

- Mobile/tablet hero padding now reserves vertical space for the 44px Pause/Play control instead of letting the absolutely positioned utility overlap headline copy.
- Added a deterministic Playwright regression that exercises 320, 360 and 760 CSS px motion layouts, computes heading/control rectangles and fails if they intersect or if the document overflows horizontally.
- The same regression switches to 320px reduced motion and verifies poster-only rendering with zero video and zero motion control.
- Dedicated final geometry/screenshots now cover motion at 1280/760/360/320 and reduced motion at 360/320.

## Verification

- `git diff --check` — PASS.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- targeted responsive media checks — 6/6 PASS across both Playwright projects.
- `npm test` — 16 files / 286 tests PASS.
- `npm run build` — PASS.
- final `npm run test:e2e` — 58/58 PASS.

Dedicated geometry `evidence/premium-media/px3-final-responsive-geometry-20260909.json` reports `headingControlOverlap=false` and `horizontalOverflow=false` for 1280, 760, 360 and 320 motion. At 360 and 320 the button starts 12 CSS px below the headline; reduced-motion 360/320 mount no control/video.

This is fixer evidence. A fresh independent design critic must still confirm P1/P2 are closed and a separate verifier is required before PX3 DONE.
