# N4 product-polish review — 2026-09-09

## Owner-reproduced issues

- The first `hello` interaction looked like a refusal rather than an assistant welcome.
- No authored application icon was present in the submitted product surface.
- The UI was functional but visually passive relative to the candidate-demo goal.

## Producer increment

- Added an original Cadre Signal visual language (Cadre-red/ink/cream concentric signal/orbits), richer editorial hierarchy, message surfaces, topic cards, composer states and pending feedback.
- Added `app/icon.svg`; the production build emits `/icon.svg`.
- Preserved six canonical starts, safe links, mode/scope disclosures, no-account/no-booking/no-assessment boundaries and reduced-motion behavior.
- Added a first-impression browser regression for icon, visible signal and useful greeting.

## Critic -> fixer evidence retained

1. The first production Playwright run used a pre-polish `.next` build, so the new icon assertion failed. The production bundle was rebuilt before further release testing.
2. After rebuild, `scroll-behavior: smooth` on the transcript made the existing synchronous Jump-to-latest contract asynchronous; desktop/mobile history tests failed. Smooth scrolling was removed from the transcript.
3. The new mobile first-impression test initially selected the desktop hero signal, which is intentionally hidden below 800px. The assertion was narrowed to the always-visible chat-header signal rather than weakening responsive behavior.
4. Focused repairs passed 4/4 before the full suite was rerun.

## Final verification

- ESLint PASS.
- TypeScript strict check PASS.
- Vitest: 11 files / 256 tests PASS.
- Next.js production build PASS and emits `/icon.svg`.
- Playwright: 50/50 PASS across desktop/mobile, including 320x568 and 360x640 readability/text-spacing coverage.
- Final production screenshots are `final-polish-desktop-20260909.png`, `final-polish-mobile-20260909.png`, and `final-polish-greeting-20260909.png`.
- IBM Granite 3.3 2B final bounded critic: `VERDICT: PASS`.

Automated checks do not imply full WCAG conformance, physical-device coverage, or screen-reader verification.
