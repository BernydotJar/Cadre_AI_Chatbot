VERDICT: CHANGES_REQUESTED

## Findings (ranked by severity)

**1. HIGH — UX-06 touch-target regressions introduced by this diff (new/changed controls under 44×44 CSS px)**
- `app/premium.css:751-754` — PX6 adds `.reset-button{min-height:40px;padding:7px 9px}`. Because `app/layout.tsx:4-5` loads `globals.css` before `premium.css`, this **overrides** the pre-existing global rule (`app/globals.css:23` → `min-height:44px`) down to 40px for the "New" conversation button. This is a regression, not pre-existing debt: before this diff, `.reset-button` inherited the 44px global rule.
- `app/premium.css:755-766` — new `.chat-close` (× close button) is `width:40px;height:40px`, a brand-new primary, non-inline control below the 44×44 floor.
- `app/premium.css:578-589` — new `.nudge-dismiss` (× dismiss on the pre-chat nudge) is `width:32px;height:32px`, well under the floor.
- CLAUDE.md UX-06 states these targets are a normative product design rule (≥44×44 CSS px for primary non-inline targets), and no e2e assertion protects any of these three controls: `e2e/chat.spec.ts:335-337` checks only the "Send message" button's box size; no test checks `.reset-button`, `.chat-close`, or `.nudge-dismiss`.
- **Minimum repair**: remove or raise the three size overrides to `min-height:44px;min-width:44px` (or equivalent padding), and add an e2e/regression assertion for each new control so this cannot silently regress again.

**2. MEDIUM — Shared shell contains a literal brand string, contradicting the stated architecture invariant**
- `src/ui/support-chat.tsx:375,412` hardcodes `href="#what-cadre-does"` / `id="what-cadre-does"` inside the generic, profile-driven `SupportChat` component. This is a literal "Cadre" token baked into `src/ui/`, which owns "avatar/copy/theme rendering" per CLAUDE.md's ownership table and must not encode a client name.
- This directly contradicts the diff's own doc claim at `docs/productization-architecture.md` (PX6 change): *"The shared UI has no client/persona-name branches."* Source and doc disagree.
- **Minimum repair**: rename the anchor ids to generic tokens (e.g. `#outcomes`, `#how-it-works`) or derive them from `experience`/`productId`, not a literal brand word.

**3. MEDIUM — Functional dead link when `publicHighlights` has no `outcome` entries (breaks the reusability proof)**
- `src/ui/support-chat.tsx:375` unconditionally renders the "Outcomes" nav link pointing at `#what-cadre-does`.
- `src/ui/support-chat.tsx:412` only renders that section `{outcomeHighlights.length > 0 && ...}`.
- `ClientConfig.publicHighlights` is optional (`src/config/types.ts` `publicHighlightSchema` array `.optional()`), and the Acme/Scout fixture (`src/product/fixtures/acme-scout.ts`) defines **no** `publicHighlights` at all — confirmed via `grep -n publicHighlights src/config/fixtures/acme.ts src/product/fixtures/acme-scout.ts` returning nothing. For that profile the "Outcomes" nav link is dead (points at a non-existent id), in the exact fixture whose stated purpose is to prove generic shell reuse (CLAUDE.md: *"the Acme/Scout fixture proves another profile can provide a different theme without editing the shell"*).
- No e2e test exercises the Acme/Scout profile through the browser or clicks this nav link, so this would not be caught by the retained suite even after it runs.
- **Minimum repair**: guard the nav link the same way as the section (`outcomeHighlights.length > 0 && <a href="#...">`), or always render an empty/placeholder outcomes anchor.

**4. LOW — Test-coverage gap for the two literal boundary examples named in this review's scope**
- The brief's two required pricing examples: `is it costly?` is directly tested (`tests/product/donna.test.ts` new test, `e2e/chat.spec.ts` new "pricing is empathetic…" test). The bare word `pricing` is **never sent as a message** in any retained test — only longer phrasings are. Source tracing (`src/config/cadre.ts:201,209` — `"pricing"` is present in both `declineTopics` and `pricingTopics`; `src/core/policy.ts:104-112` checks decline before topic routing) shows it should resolve identically to `"price"`/`"costly"`, but this exact scenario has no retained pass/fail evidence.
- **Minimum repair**: add one direct unit/e2e case sending exactly `"pricing"`.

**5. LOW/informational — New helper copy at 11px not covered by the 12px floor test**
- `app/premium.css:684-689` `.launcher-copy small` (renders `experience.copy.launcherHint`, e.g. "Try a question. I'll keep it grounded.") is 11px, arguably "helper copy" adjacent to the primary chat CTA. `e2e/readability.spec.ts:73` only checks a fixed selector list (`.mode-label, #composer-help, .character-count, .chat-scope, .privacy-note, .error-panel p, .error-panel span, .retry-button`) that does not include this new class, so a genuine sub-12px helper string would pass silently.
- **Minimum repair**: either raise to ≥12px or add it to the readability test's selector list with a documented rationale for exemption.

## Things checked and found sound (no repair needed)
- Authority separation: `boundaryVoiceFor`/`prependBoundaryVoice` (`src/product/conversation.ts`) only fire for `decline`/`redirect` decisions, never touch facts/links, and `composeReply` (`src/core/policy.ts`) still owns the decline/pricing text and the single contact link — traced end-to-end through `src/server/chat.ts:88-101`.
- `publicHighlightSchema`/`quickPrompts`/`boundaryVoice` all reject embedded URLs and newlines (`src/product/types.ts`), and link-domain enforcement is extended to `publicHighlights` in `validateClientConfig` (`src/config/types.ts`), with a positive/negative test in `tests/config/config.test.ts`.
- `pricingTopics` is validated as a required subset of `declineTopics` (`src/config/types.ts`), with a positive test.
- No `crypto`/`Math.random`/`Date.now` calls in render paths of `src/ui/support-chat.tsx`; readiness gating for the new launcher/hero/quick-prompt/nudge buttons reuses the existing hydration-safe `useSyncExternalStore` pattern, avoiding an obvious hydration mismatch.
- Motion budget: only two new `@keyframes` groups exist in `app/premium.css` (`orb-breathe`/`orb-shape`/`orb-lobe-*` for the orb, `launcher-glare` for the sweep), and both are disabled under `@media(prefers-reduced-motion:reduce)` (`app/premium.css:1210-1220`), matching the "maximum two new effects" authorization.
- No Cadre/Donna literal copy strings found in `src/ui/support-chat.tsx` (only the id token in Finding 2), consistent with the profile-driven contract for visible text.

## NOT VERIFIED (explicitly out of scope per instructions / not executed)
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, Playwright, or any provider/browser/deployment command — none were run, per the explicit instruction that the owner deferred all product verification until after critique/fix assembly.
- Actual rendered geometry, computed contrast ratios, or real touch-target measurements in a browser at 320/360/760/1280px — the touch-target findings above are computed from literal CSS `width`/`height`/`min-height` values in source, not from a rendered DOM measurement.
- Runtime hydration mismatch behavior (React dev-mode warnings) — assessed only by static code reading, not by executing the app.
- Screen-reader behavior, focus-order correctness in a real AT, or keyboard traversal beyond static reading of `tabindex`/`aria-*` attributes.
- Whether the automated 288/288 Vitest / 58/58 Playwright / build/typecheck/lint suites currently pass on this exact commit — the evidence files (`evidence/premium-experience/px6-producer-20260909.md`, `evidence/premium-critic/px6-critic-attempts-20260909.md`) themselves state these were intentionally not yet run, and I did not run them either.
- Full line-by-line review of every CSS rule in the 1340-line `app/premium.css` diff (I sampled the sections directly implicated by new PX6 selectors: orb/glare, launcher/nudge/chat-card, breakpoints, reduced-motion, touch targets); a residual layout/contrast defect elsewhere in that file cannot be ruled out from this review alone.
