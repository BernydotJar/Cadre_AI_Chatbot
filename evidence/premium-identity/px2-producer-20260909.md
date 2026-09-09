# PX2 producer evidence — Donna premium identity

Date: 2026-09-09 UTC.
Node: `PX2-donna-premium-identity`.

## Scope implemented

- Re-reviewed the current public Cadre site before editing Donna.
- Added a bounded premium-experience Graph and owner authorization rather than reopening the completed productization graph.
- Replaced the glossy/ornamental Donna avatar internals with one original SVG signal mark: thin hexagonal frame, concentric rings, restrained red/warm-white traces, central monogram node.
- Added `app/premium.css` as a separate reviewable override layer imported after the stable baseline CSS.
- Raised desktop first-view display typography to a measured ~96.5px at 1440px, moved the editorial introduction into an ink cinematic field, removed competing serif emphasis, reduced chrome, converted six starter cards into quiet ruled rows, and kept the initial composer visually dominant.
- Preserved profile-driven identity: no client/persona-name branch was added to the shared React shell.
- Treated the supplied neon geometry only as motion/composition reference; no literal cyan/red Tron/cyberpunk palette was adopted.

## Deterministic verification

Final source checks after repair:

- `npm test`: 14 files / 279 tests PASS.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS after removing stale generated `.vercel/output` from the lint surface.
- `npm run build`: PASS.
- `npm run test:e2e`: 52/52 PASS desktop/mobile.
- `git diff --check`: PASS.

Measured browser geometry after repair:

- 1440×1000: document scrollWidth = viewport width; H1 ≈ 96.5px; initial composer ≈ 92px; signal mark 240×240; six starter topics.
- 390×844: document scrollWidth = viewport width; H1 ≈ 42.9px; initial composer ≈ 92px; compact dark editorial hero above the tool; six starter topics.

Screenshots:

- `evidence/premium-identity/donna-premium-desktop-20260909.png`
- `evidence/premium-identity/donna-premium-mobile-20260909.png`

## Retained defect and fixer action

The first complete Playwright run after the premium CSS returned 48/52 PASS. Four failures shared one symptom: page-level horizontal overflow in desktop/reduced-motion/320px/360px cases.

The cause was deterministic: `.intro::after` was absolutely positioned with a negative right inset but the premium `.intro` override had lost `position: relative`; the decorative pseudo-element therefore positioned against a broader containing block and expanded `html.scrollWidth`.

Fix: restore `position: relative` on `.intro`. Focused overflow/readability regressions then passed 10/10, followed by the complete 52/52 matrix.

## Design-review boundary

Producer verification is **not** independent design approval. The local Granite critic runtime did not return a usable verdict; details are retained in `evidence/premium-critic/granite-uiux-critique-20260909.md`. PX2 must remain outside DONE until a real independent critic or explicit gated human evaluation reviews the snapshot.
