# Claude Code independent PX3B product-design critic — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Snapshot: `e75c1e5405117d7e31391d514db14b752a740ee7`.
- Mode: project-scoped `critic`, bounded read-only UI/UX gate.

## Raw reviewer output

VERDICT: PASS

BLOCKERS: NONE

MATRIX:
- Donna identity: `persona-avatar` (support-chat.tsx:44-56; premium.css:87-121) is a flat 34-42px cream square, thin border, single 2px accent tab, italic "D" — no ring/glow/gradient; geometry evidence confirms `markCount:1`, `markSvgCount:0` on both viewports.
- Hero hierarchy: single oversized serif/sans headline ("Turn AI curiosity into a clear next move.") with eyebrow rule dominates the dark panel; clear, uncluttered, legible in evidence PNG.
- Product shell: `.chat-card` (premium.css:123-149) uses restrained border/radius/shadow and a 2px top accent rule rather than badge chrome; reads as a bounded software panel, not a floating widget.
- Composer: rendered first in the at-rest state (support-chat.tsx:355, `renderComposerPanel`), large tappable target (54px send button, premium.css:166), correctly the primary object above the topic list.
- Starter topics: numbered plain-text list with hover accent only (premium.css:178-194), no card/tile decoration — sober, not SaaS-dashboard chrome.
- Status/navigation: mode label rewritten to user-facing `Available/Demo/Unavailable` (support-chat.tsx:275-276) with a small colored dot; no implementation jargon in the rendered string, matching producer claim.
- Ambient integration: `AmbientMedia`/`.intro-media` (support-chat.tsx:58-114; premium.css:32-47) is poster-first, muted, pause-controlled, `prefers-reduced-motion` disables video (premium.css:248-252) — subordinate to text.
- Mobile: geometry JSON shows no `horizontalOverflow`, 86px composer, single mark reused; screenshot shows working stacked layout with legible headline and full-width chat card.
- Accessibility: composer/help text sizes meet the ≥12px/≥16px rules referenced in code comments; motion toggle is 44px min target (premium.css:53-54); focus ring via `--focus` box-shadow (premium.css:198). Contrast of low-opacity hero copy (rgba(...,.58)/.66) was only visually estimated, not measured.
- Reusable-profile boundary: `PersonaAvatar`/`CompanyMark` and theme vars are driven entirely by the `experience` prop (support-chat.tsx:44-56, 278-287), with no Cadre-name branching in this file — consistent with the shared-shell rule.

IMPROVED: Ring/notch SVG avatar is gone entirely (zero avatar SVGs in geometry evidence); only one Donna mark remains (welcome-state duplicate removed); status copy no longer leaks implementation terms (`configured`/`mode`); the send control is a rounded-square rather than another circular AI motif; shell moved from flat demo card to a materially layered surface (border + dual shadow + accent rule) without adding glow/gradient.

RESIDUAL:
- Non-blocking: the dark hero panel shows a faint diagonal warm-light band (ambient poster) that visually echoes the previously rejected glow aesthetic at low intensity; acceptable as "ambient, subordinate" per authorization, but worth watching if future ambient assets get brighter/more saturated.
- Non-blocking: green "Available" status dot is a generic SaaS convention; harmless but not distinctively "editorial."
- Non-blocking: only the at-rest/welcome state was captured in evidence; mid-conversation, error/retry, and focus-visible states were not screenshotted for this gate.

PX3B_UNLOCK: YES

NOT_VERIFIED:
- Actual rendered contrast ratios (measured, not just estimated) for low-opacity hero/scope-note text.
- Mid-conversation, error/retry, stopped-response, and focus-visible visual states (no screenshots provided).
- Real screen-reader/keyboard behavior (per repo policy, must be explicitly labeled unverified rather than assumed from code reading).
- `npm test` / `npm run test:e2e` / typecheck/lint/build were not re-executed independently in this review; producer-reported 286/286 and 58/58 results were read but not reproduced.
- Base chat CSS/typography tokens outside `app/premium.css` (e.g., `.chat-scope`, `.privacy-note` exact font sizes) were not opened, since they are outside the specified file list.
- Actual video ambient asset content/motion (only the static poster is visible in evidence).
