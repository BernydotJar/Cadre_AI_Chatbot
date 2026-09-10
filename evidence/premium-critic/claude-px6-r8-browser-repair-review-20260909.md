## VERDICT: CHANGES_REQUESTED

**Scope note:** this is a static **source review** of commits `fc1e99f` (repair) and `d6ef2fe` (handoff) against HEAD `d6ef2fe`, cross-checked with the retained r7 verifier failure log and the r8 repair note. No tests, build, lint, typecheck, browser, network, deployment, or git-write actions were performed, per instruction.

### Findings

**1. (Medium — untested nested-scroll regression, matches flagged concern #1) `app/premium.css` `@media(max-width:430px) .chat-card{ overflow-y:auto }` (line ~1195) is unconditional on `data-started`, but `.chat-card[data-started="false"] .transcript{ overflow-y:auto }` (lines 804–807) is also unconditional on viewport.**
 - Before this repair, `.chat-card` had `overflow:hidden` at all widths (line 705), so the pre-existing not-started `.transcript` inner scroll was the only scroll container — no nesting.
 - After this repair, at `<=430px` and `data-started="false"` (the welcome/quick-prompt screen, before a user sends the first message), both the outer `.chat-card` and the inner `.transcript` are simultaneously `overflow-y:auto`. If welcome content overflows at 320/360px (plausible under the same 1.5 line-height / 2em paragraph-margin text-spacing stress the revision-8 test applies only to the *started* state), this creates a nested-scroll trap: an inner scrollable region inside an outer scrollable region, which can make the composer/privacy footer unreachable via a single continuous swipe/Page-Down and is a known accessibility anti-pattern.
 - This exact risk is called out in the review brief ("preserve reachable transcript/composer/privacy content ... without creating an inaccessible nested-scroll ... regression") and is not addressed: `e2e/readability.spec.ts` only opens the launcher, sends a message (forcing `data-started="true"`), and then applies text-spacing stress — it never exercises the pre-send welcome state at 320/360 under stress.
 - **Smallest repair:** either (a) scope `.chat-card[data-started="false"] .transcript{overflow-y:auto}` off at `<=430px` (let the single outer `.chat-card` scroll instead), or (b) scope the new `.chat-card{overflow-y:auto}` to `[data-started="true"]` only, and add a regression case in `e2e/readability.spec.ts` for the not-started/welcome state at 320/360 with the same text-spacing stress, asserting no nested/inaccessible scroll and full reachability.

**2. (Low — evidence completeness, not a defect) The revision-8 repair note and diff are internally consistent with r7's exact seven failures and the CSS/config changes map 1:1 to them; however no revision-8 Playwright run has actually been executed yet** (`px6-r8-browser-repair-20260909.md` explicitly states "No revision-8 runtime PASS is claimed"). This review cannot and does not upgrade that to a PASS; it remains an open verification step, not a defect in the source itself.

### Verified as sound (source-review only)

- **Concern (2) — privacy assertion relocation:** legitimate architectural adaptation, not a weakened test. `e2e/readability.spec.ts:47-52` still requires `spaceHeight>=240`, `readableHeight>=144`, no transcript/composer gap, and no horizontal overflow *before* any scroll. Lines 55-68 still require the user turn, retry button, and privacy note each individually reachable via `scrollIntoViewIfNeeded`/`toBeInViewport`, and add an explicit post-scroll geometric containment check (`privacyBox.y+height <= cardBox.y+height+1`) that was not present before. Net effect is equivalent-or-stronger coverage, correctly relocated to match the new scrollable-sheet architecture.
- **Concern (3) — mobile composer 16px:** `.composer textarea{font-size:16px}` is added inside the existing `@media(max-width:760px)` block (app/premium.css ~1134), which is the correct breakpoint scope that previously regressed to 15px per the r7 failure (`Expected: >=16, Received: 15`).
- **Concern (4) — Playwright IP-header isolation:** `playwright.config.ts`'s `localClientHeaders` returns `{}` when `E2E_BASE_URL` is set, and the entire `webServer` block (the only place `CHAT_TRUSTED_PROXY_IP_HEADER` is set) is `externalBase ? undefined : {...}` — so the trust opt-in is emitted only for the local managed server, never for `E2E_BASE_URL` runs. `src/server/rate-limit.ts` and `src/provider/config.ts` are untouched by this diff (confirmed via `git show fc1e99f --stat`); production trust semantics (`clientKey` requires exact opt-in match plus a validated single IP, defaulting to `"global"`) are unchanged.
- **Scope discipline:** `git show fc1e99f --stat` touches only `app/premium.css`, `docs/cinematic-proactive-experience.md`, `e2e/readability.spec.ts`, `playwright.config.ts`, `progress/checkpoint.md` — no factual authority (`src/config`), persona (`src/product`), provider, routing (`src/core`), or API error-semantics files are touched.
- **Checkpoint/ledger accuracy:** `progress/checkpoint.md` at HEAD states sequence 179, last event `48d0313e-...`, revision "8 / running" — this matches `progress/premium-graph.events.jsonl` tail exactly (sequence 178/179, matching event IDs). No stale/inflated claim found; r4/r7 failure evidence is explicitly retained rather than overwritten.

### Not verified (explicit limitations)

- No actual Playwright/Vitest/build/typecheck/lint execution was run against `d6ef2fe`; PASS/FAIL of the mapped repair is unconfirmed by this review.
- Did not visually render or measure actual pixel geometry (min-height, overflow behavior) in a browser; conclusions on the nested-scroll finding are derived from static CSS cascade analysis, not observed DOM measurement.
- Did not review desktop-viewport behavior beyond confirming the new/changed rules are scoped to `<=760px`/`<=430px` media queries.
- Did not check other e2e specs beyond grep for coverage gaps (confirmed `chat.spec.ts`/`hydration.spec.ts` don't cover the not-started welcome state at 320/360 under text-spacing stress, but did not read those files in full).

### Smallest repair scope to reach PASS

Address Finding 1 (nested-scroll at `data-started="false"`, `<=430px`) with either a CSS scope fix or an added regression test proving the welcome state has no inaccessible nested scroll under 320/360 text-spacing stress, then obtain an actual (not just mapped) revision-8 clean verifier run before any release-gate claim.
