Good — evidence is properly recorded as FAIL against the pre-fix commit, preserving history. That satisfies the "preserve original failure evidence" requirement. Now I have enough to write the final report.

## VERDICT: CHANGES_REQUESTED

All five prior findings are functionally repaired in source, but none have been runtime-verified, and I found one new residual risk plus one gap in the repair's own regression coverage.

### Findings (ranked by severity)

**1. MEDIUM — Repair correctness for all 5 findings is source-only; no runtime proof exists yet that the repair actually renders/passes**
- `git diff a6a2e96b..13f3ef3` shows the CSS/TSX/test edits are internally consistent with the critic's asks, but `progress/premium-graph.events.jsonl:122` only records the pre-fix FAIL; there is no new `evidence.recorded` entry for the repaired commit `13f3ef3` in the ledger, and `plan.md`/`progress/checkpoint-premium.md` still describe PX6 as producer-stage with "no PX6 verification/design/integration gate claimed yet." This is expected per the task framing (this is pre-verification review), but it means every fix below is a static-read pass, not a green test run.
- **Minimum repair**: none — this is the expected next step (independent verifier), not a defect. Flagging so it is not mistaken for a closed loop.

**2. LOW — New touch-target regression test has an implicit ordering dependency not defensively isolated**
- `e2e/chat.spec.ts` new test "new PX6 chat controls preserve 44px touch targets" asserts `.nudge-dismiss` is present at initial load (`src/ui/support-chat.tsx:458-459`, gated only by `!nudgeDismissed`), then opens chat via `getByRole("button", {name:/Ask Donna/}).last()`, then submits `"services"` and expects `"New conversation"` to appear before measuring `.reset-button`. This chains three UI-state assumptions (nudge visible pre-open, launcher accessible-name match, reset button appears only `{started && ...}` per line 480) into one test with no intermediate `await expect(...).toBeVisible()` isolation before the very first `boundingBox()` call on `.nudge-dismiss`. If the nudge is not visible for any reason (e.g., a future default in `nudgeDismissed` initial state, or launcher-open behavior that also sets `nudgeDismissed`), `boundingBox()` returns `null` and the test fails at the correct point — so this is not a false-pass risk, only a maintainability/diagnosability note.
- **Minimum repair**: none required before merge; optionally split into three focused tests for clearer failure isolation. Not a release blocker.

**3. LOW / new-regression watch — 4px-per-button growth in `.chat-header-actions` at the 430px mobile breakpoint is not covered by any explicit assertion**
- `app/premium.css:751-766`: `.reset-button` grew from `min-height:40px` (no min-width) to `min-height:44px;min-width:44px`, and `.chat-close` grew from `40×40` to `44×44`. Combined with `gap:5px` (`app/premium.css:746-750`), `.chat-header-actions` content width grows from ~85px to ~93px (+8px).
- At `max-width:430px` (`app/premium.css:1136-1210`), `.chat-card` becomes edge-to-edge (`left:0;right:0`) so the header's available width is the full 320/360px viewport minus `.chat-header{padding:11px 12px}` (`app/premium.css:1189`), i.e. ~296/336px shared between `.chat-identity` (avatar + title/mode-label, `min-width:0` per `app/globals.css:22`) and the now-wider actions cluster.
- `.chat-identity` has `min-width:0`, so it should shrink/ellipsis rather than force document-level overflow, and the existing `e2e/readability.spec.ts` `documentWidth <= viewportWidth` assertion (line 47, unchanged by this diff) would still catch a true horizontal-scroll regression. But no test measures whether the title/mode-label become illegibly truncated or visually collide with the now-wider action buttons specifically at 320×568/360×640 — this is a plausible but unconfirmed presentation regression introduced by the very fix meant to satisfy UX-06.
- **Minimum repair**: add one geometry assertion (e.g., non-overlap of `.chat-identity` and `.chat-header-actions` bounding boxes, or a minimum legible width for `.chat-header h2`) at 320/360 in the existing viewport loop in `e2e/readability.spec.ts`, or confirm via an actual 320/360 screenshot before this is treated as closed.

### Confirmed repairs (source-verified, not yet runtime-verified)

1. **44px targets** — `app/premium.css`: `.nudge-dismiss` 32→44px, `.nudge-action` min-height 42→44px, `.reset-button` min-height 40→44px + `min-width:44px` added, `.chat-close` 40→44px. A new regression test (`e2e/chat.spec.ts`, "new PX6 chat controls preserve 44px touch targets") asserts all three previously-flagged selectors ≥44×44. Matches CLAUDE.md UX-06.
2. **Generic/conditional outcomes anchor** — `src/ui/support-chat.tsx:375-376,412`: nav link and section id both renamed to `#outcomes`/`id="outcomes"`, and the nav link is now gated by the same `outcomeHighlights.length > 0` condition as the section, eliminating both the literal-brand-token finding and the dead-link-on-empty-highlights finding in one change (confirmed no remaining `what-cadre-does` references repo-wide except inside the retained evidence file, which is correct — history must not be edited).
3. **Exact bare `'pricing'` coverage** — `tests/product/donna.test.ts:89-93`: test converted to `it.each(["Is it costly?", "pricing"])`, sending the literal bare word through the real handler and asserting the same decline/business-outcome copy.
4. **Launcher helper ≥12px** — `app/premium.css:686-689`: `.launcher-copy small` 11px→12px; `e2e/readability.spec.ts:67-69` adds a direct computed-style assertion on `.launcher-copy small` ≥12px, closing the prior sub-12px gap in the selector list.
5. **No new client/persona literal leakage in the generic shell** — confirmed by repo-wide grep: no remaining hardcoded `cadre`/`donna`-specific id/token was introduced by this diff in `src/ui/support-chat.tsx`; the only prior literal (`#what-cadre-does`) was the one removed.

### Minimum repair scope (summary)
- Finding 1 (verification gap): none — proceed to independent verifier/runtime execution; do not label PX6 DONE until that run is recorded.
- Finding 2 (test ordering): optional test-hygiene split, not blocking.
- Finding 3 (mobile header crowding): add one explicit non-overlap/legibility assertion at 320/360 in `e2e/readability.spec.ts`, or produce an actual screenshot, before treating the 44px repair as fully closed at the smallest supported viewport.

### Explicitly NOT VERIFIED (no command executed)
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` — not run.
- `npm run test:e2e` / Playwright — the new/edited tests (`e2e/chat.spec.ts` 44px-targets test, `e2e/readability.spec.ts` 12px launcher-hint test, `tests/product/donna.test.ts` bare-`pricing` case) were not executed; pass/fail is inferred from static reading only.
- Actual rendered geometry, computed font sizes, computed contrast, or bounding-box measurements in a real browser at 320/360/760/1280 — all target-size and font-size conclusions above are derived from literal CSS values, not measured DOM output.
- Whether `.chat-header-actions` visually overlaps `.chat-identity` at 320×568/360×640 (Finding 3) — flagged as a risk from static CSS/width arithmetic only, not confirmed by rendering.
- Extension/browser/synthetic suites (72/72, 24/24), Graph gate state, and deployment/public equivalence — untouched by this diff and not re-run.
- Whether `progress/`/graph ledger events exist for this exact repaired commit `13f3ef3` beyond the pre-fix FAIL already retained at `13f3ef3`'s parent — I did not find a new evidence event for the repaired commit in `progress/premium-graph.events.jsonl`, and did not write one (out of scope for this role).
