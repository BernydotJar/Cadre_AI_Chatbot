# Claude Code independent UI/UX follow-up — PX2 — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Snapshot: `93613c081e7048fe50bf7934079a291f064d92c1`.
- Mode: fresh project-scoped `critic`, high-effort read-only review; no edits/deploy/Graph writes/provider inference authorized.

## Raw reviewer output

## VERDICT: PASS

## PREVIOUS FINDINGS

- **C1 — cyberpunk/circuit avatar**: CLOSED. `src/ui/support-chat.tsx:53-58` now renders one static `signal-ring` circle + one `signal-notch` accent arc + monogram text; `app/premium.css:51-71` sets `filter:none`, no `drop-shadow`, no keyframe animation on `.persona-avatar`/`.persona-signal`. Geometry probe confirms `animatedSignalCount: 0` at both viewports (`evidence/premium-identity/px2-fixer-geometry-20260909.json:33,68`). Screenshots show a plain ring+letterform, no hex frame or glow.
- **C2 — competing double hero**: CLOSED. Only one element is rendered at true hero scale (`h1`, 70–104px, `app/premium.css:39`). The former right-panel hero-scale echo is now `.welcome h3` at `clamp(24px,2.2vw,30px)` (`app/premium.css:115`) and sits after the composer, reading as a supporting label, not a second headline.
- **C3 — composer visually demoted**: CLOSED. `support-chat.tsx:297` renders the composer immediately under the chat header, before welcome copy. `app/premium.css:100-107` enlarges it in the empty state (76px min-height textarea, 18px type, 58px round send button) and geometry confirms `composerPrecedesWelcome: true` both viewports.
- **M1 — avatar repeated 3×**: CLOSED. The large hero-panel avatar instance is gone from `support-chat.tsx`; only the compact header (`line 289`) and welcome (`line 309`) instances remain. Geometry confirms `avatarCount: 2` desktop and mobile.
- **M2 — pre-answer "useful answer" claim**: CLOSED. `src/product/profiles/cadre-donna.ts:73-75` now reads `welcomeLead: "Ask Donna about"`, `welcomeEmphasis: "Cadre AI."` — an honest invitation, confirmed in both screenshots.
- **M3 — stacked ambient decoration**: CLOSED. No `.intro::after` ring or `.hero-signal-stage` gradient remain in `app/premium.css`; `.intro` carries a single background gradient (`premium.css:30`).
- **M4 — mobile double hero / composer below fold**: CLOSED. Mobile geometry shows the composer fully inside the 844px viewport (`top:330.8, bottom:579.5`), before the welcome block (`top:595.5`), with only one full-scale headline above it.
- **M5 — 9–13px topic typography**: CLOSED. `.topic-label{font-size:15px}` (`premium.css:133`, 14px at ≤430px), single-column list, confirmed in both screenshots.
- **M6 — eyebrow/kicker device reused 3× per screen**: **OPEN (partial)**. Reduced from 3 to 2: `experience.copy.eyebrow` (`support-chat.tsx:275`) and `experience.copy.trustLabel` (`support-chat.tsx:281`) still render the same small-caps accent-colored kicker treatment twice within the same dark panel (visible in both screenshots: "GUIDED BY VERIFIED CADRE CONTEXT" and "A TRUSTED STARTING POINT"). The requested repair ("keep the device in one place only") was not fully carried out — this is a real, if minor, residual.

## NEW BLOCKING FINDINGS: NONE

No new P1/P2 visual or interaction defect was found in the reviewed artifacts.

## NON-BLOCKING POLISH

1. `M6` residual — de-style or remove the `trustLabel` eyebrow (`support-chat.tsx:281`, `premium.css:47`) so the small-caps kicker device appears once per screen, as originally requested.
2. `app/globals.css:20` still carries the old glow/orbit/aura avatar CSS (`avatar-breathe`, `avatar-spin`, drop-shadows) that is dead against the current markup (no `.avatar-aura`/`.avatar-orbit`/`.avatar-core` elements are rendered by `PersonaAvatar`). Harmless today, but it's exactly the forbidden "cyberpunk glow" grammar sitting in shared shell CSS — worth pruning to prevent accidental reuse by another profile.
3. `.intro-description` and `.intro-bottom` (the "what Cadre AI does" paragraph and trust/boundary note) are fully hidden at ≤900px (`premium.css:157`); the only remaining boundary statement on tablet/mobile is the composer's `chat-scope` line. Functionally sufficient, but worth a design pass rather than a blunt `display:none`.
4. The welcome heading still uses the same red-emphasis-word convention (`Cadre AI.` in `--accent-dark`) as the parent brand's ordinary marketing pages — now used once, so acceptable, but if further differentiation is wanted this is the remaining instance to reconsider.
5. `.topic-number{font-size:9px}` decorative index digits remain far smaller than the rest of the page's type scale; cosmetic only since the actual topic label is 15px.

## PX3 UNLOCK: YES

C1–C3 (avatar grammar, double-hero split focus, demoted composer) and M1–M5 are closed with concrete CSS/markup/geometry evidence, not just claimed. The page now reads as one dominant editorial statement plus a genuinely tool-forward product card (composer-first, quiet single-mark avatar, single-column starters), on both desktop and mobile fold. The only unresolved item (M6) is a moderate, cosmetic kicker-repetition detail that does not rely on video, motion, or ornament to read as premium — so PX2 is strong enough on its own composition to unlock ambient-media work rather than needing video to mask a weak layout.

## What I did not verify

- Did not execute `npm run typecheck`, `npm run lint`, `npm test`, or `npm run test:e2e`; the 52/52 Playwright pass and focused-regression claims in `evidence/premium-identity/px2-fixer-20260909.md` are the producer/fixer's own record, not independently re-run here.
- Did not open the app in a live browser; assessment is from static screenshots, source, and the single provided geometry JSON (only 1440×1000 and 390×844 were probed there — no 320×568/360×640 text-spacing or 200%/400% zoom check was reproduced independently).
- Did not test keyboard focus order/traversal, screen-reader semantics, or measured (vs. calculated) color contrast in a live renderer.
- Did not check `prefers-reduced-motion` behavior live (no animated elements were found in current markup, so this is low risk, but unverified in-browser).
- Did not review `progress/checkpoint-premium.md` or Graph state for the `design-review=BLOCKED` flag's current status; this review only covers the visual/interaction artifacts specified in the brief.
