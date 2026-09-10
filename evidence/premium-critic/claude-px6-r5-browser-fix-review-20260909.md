> Provenance: this substantive report came from a separate authenticated Claude Code **2.1.266** CLI invocation that exited successfully using the project `critic` agent, `--effort low`, `--max-budget-usd 0.30`, and `--no-session-persistence`. The preceding `claude-px6-r5-browser-fix-attempt-20260909.md` records an earlier, distinct invocation that aborted after exceeding its USD 0.35 budget. No `--model` value was pinned in the successful invocation; the underlying model identifier was not captured and is not inferred here.

Based on source-level inspection only (no commands executed that run tests/build/lint/typecheck/browser/network/deploy).

## VERDICT: CHANGES_REQUESTED

## Findings (ordered by severity)

**1. High — "motion-control/headline separation" fix is unverified/likely insufficient for the 320px case (app/premium.css:1058, e2e/chat.spec.ts:122-142)**
The patch adds only `.intro-copy{padding-top:64px}` inside the `@media(max-width:760px)` block. The failing assertion compares `.intro h1` boundingBox against `getByRole('button',{name:'Pause ambient motion'})` (`.motion-toggle`, defined separately at premium.css:224 and re-styled at 1221 inside the `prefers-reduced-motion` block, not the 760px block). Pushing `.intro-copy` down 64px only helps if `.motion-toggle` is absolutely positioned relative to `.intro-media` independent of `.intro-copy` flow — nothing in the diff repositions `.motion-toggle` itself, and no rule change is shown for it under `max-width:760px`. The retained failure evidence (px6-r4-clean-verifier-20260909.txt, failures #2/#15) is exactly this assertion at 320/360/760px on both desktop and mobile projects. There is no fresh PASS evidence in the diff or supplied context that re-runs this exact test post-patch.
- Repair scope if still broken: reposition/size `.motion-toggle` (or increase `.intro-copy` offset) so it clears `.intro h1` at 320–760px, then re-run `e2e/chat.spec.ts:120`.

**2. Medium — "ambient media pause/play" locator interception (chat.spec.ts:84) not addressed by this diff**
Retained evidence failures #1/#14 show `getByRole('button',{name:'Pause ambient motion'})` click blocked because `.chat-header`/`.reset-button`/`.site-header` intercept pointer events. The diff only adds `await page.reload();` at the top of this test (chat.spec.ts line ~87) and does not touch z-index/layout of `.chat-header`, `.site-header`, or the motion toggle's stacking context. This is one of the explicitly named issues in the retained failure evidence but is outside the five items the task asked me to confirm — flagging it because CHANGES_REQUESTED items and this evidence file are directly linked, and the task says "against retained failure evidence," so an uncorrected named failure in that same evidence should be surfaced.
- Repair scope: raise/lower stacking order (`z-index`) so `.motion-toggle` is not obscured by header elements when the panel/site-header is present, and confirm with the previously failing command.

**3. Low — hidden-mobile-helper fix is a test relaxation, not a source repair (e2e/readability.spec.ts:70-79)**
The "important helper copy ≥12px" test now wraps the `.launcher-copy small` visibility/size assertion in `if (!isMobile)`, skipping it entirely on mobile rather than confirming mobile has an equivalent ≥12px helper element or intentionally omits it. Source (`support-chat.tsx`) shows no corresponding mobile-visible substitute copy added. This satisfies "stop asserting on a legitimately hidden mobile element" but does not positively demonstrate UX-06 compliance for mobile helper copy — it only avoids testing it.
- Repair scope: either confirm/document in premium.css that this helper text is deliberately not shown on mobile (no equivalent content requiring the 12px rule), or add a mobile-visible substitute and assert it.

## Correctly repaired (source-level, matches intent)

- **Mobile launcher accessible name**: `support-chat.tsx` line ~382 now sets `aria-label={`Ask ${experience.assistantLabel}`}` on `.donna-launcher`, giving a stable, unambiguous accessible name independent of nested/hidden mobile children — consistent with failures #10/#11/#12/#13 in the evidence (name resolution and touch-target selector issues tied to `getByRole('button',{name:/Ask Donna/})` ambiguity).
- **Ambiguous "Ask Donna" test locators**: all `getByRole('button',{name:/Ask Donna/}).last()` call sites in `e2e/chat.spec.ts`, `e2e/hydration.spec.ts`, `e2e/readability.spec.ts` replaced with `.donna-launcher` class locator, removing the source of strict-mode/staleness issues seen in evidence failures #10, #11, #35, #36 area.
- **Ambiguous alert locators**: `getByRole('alert')` replaced with scoped `.error-panel [role=alert]` or `#message-validation`, avoiding collision with Next.js's `#__next-route-announcer__` alert region — directly matches strict-mode-violation failures #4–#7 (retry/blank-input/long-conversation/deadline tests).
- **Profile-driven trust points**: `experienceProfileSchema` now requires `trustPoints` (exactly 4, bounded length), both `cadre-donna.ts` and `acme-scout.ts` fixtures supply distinct profile-owned copy, `support-chat.tsx`'s trust grid renders from `experience.trustPoints` instead of hardcoded English facts, and `tests/product/contracts.test.ts` updated accordingly. This is consistent with the CLAUDE.md rule that presentation/experience content must be profile-driven and that the Acme fixture must prove genuine architecture independence, not be a hidden Cadre-only hardcode.

## Boundary/security check
No changes touch `src/core/`, `src/config/cadre.ts`, `src/provider/`, `src/server/`, routing/policy logic, approved-link handling, or the API contract in the diff. The `contact-link` change only adds an `aria-label`; href/target/rel are unchanged. The `trustPoints` schema addition is bounded (length 4, string length caps) and does not introduce free-form HTML/URLs. No weakening of routing, facts, provider, or security boundaries found in this diff.

## NOT VERIFIED (explicitly not executed per instructions)
- Did not run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, or `npm run test:e2e`. Cannot confirm whether findings #1–#2 above actually still fail or have been resolved by CSS/layout effects not visible from a static diff read (e.g., inherited flex/grid behavior).
- Did not verify actual rendered contrast/box geometry, accessible-name computation in a real browser/AT, or reduced-motion behavior.
- Did not confirm whether a newer verification run superseded `px6-r4-clean-verifier-20260909.txt`; only that file was inspected as instructed.
- Did not inspect `app/premium.css` lines 1-1250 in full for other interacting rules (e.g., `.motion-toggle` absolute positioning source) beyond the grep excerpt shown.
