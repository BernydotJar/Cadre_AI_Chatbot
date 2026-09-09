VERDICT: CHANGES_REQUESTED

BLOCKERS:
1. **Mode/privacy/boundary copy below the 12px floor (UX-06 violation), present in the exact adapter under review.** `extension/src/panel/panel.css` sets:
   - `.eyebrow{font-size:8px;...}` — this class renders the disclosure label the panel itself now reads as "LOCAL INTEGRATION PREVIEW" (`panel.html:12`, `<p class="eyebrow">LOCAL INTEGRATION PREVIEW</p>`), i.e. exactly the "mode/boundary copy" CLAUDE.md's UX-06 requires to stay ≥12px.
   - `.welcome-kicker{font-size:8px!important;...}` — renders "GROUNDED IN VERIFIED CADRE CONTEXT" (`panel.html:20`).
   - `.context-label{font-size:8px;...}` — renders the per-page context chip, e.g. "CADRE · DISCOVER AGENTS" (`panel.html:21`, confirmed live text via `extension/tests/installed-site.mjs`).
   - `.composer-note{font-size:8px}` — wraps `#privacy` ("No passwords or sensitive details. Replies can be wrong.", `panel.html:38`), i.e. exactly "privacy... copy."
   All four are reproducible in the current tree (`git show HEAD:extension/src/panel/panel.css`); none of the four line diffs in this commit touch the `font-size` declarations — they were already 8px at the prior `PX3B` `DONE` snapshot (`git show b12ce56...:extension/src/panel/panel.css`) and this PX4 commit ships more copy into the same undersized classes (new eyebrow text, new welcome-kicker text, ten new per-route context labels) without correcting size. No test in `browser-mock.mjs`/`installed-site.mjs` asserts these font sizes, so the "72/72" and "17/23" PASS evidence never exercises this rule and cannot be read as covering it.
   Expected: ≥12px for mode/privacy/boundary copy per the project's own normative rule. Observed: 8px, unchanged and now carrying more strings.

NON_BLOCKING:
1. Copy risk: welcome-kicker "GROUNDED IN VERIFIED CADRE CONTEXT" plus status text "Donna is checking verified context…" (`panel.ts:139`) repeats "verified context" language that could be read as implying live page inspection/verification, when the contract is strictly a fixed pathname/hash → enum mapping with no page reads. Recommend rewording to avoid implying page-content verification (e.g. "grounded in Cadre's approved knowledge").
2. `.context-prompt{font-size:11px}` (suggested-question button, e.g. "Ask: What does Cadre AI do?") is just under the 12px helper-copy threshold; borderline, worth bumping alongside the fix above.
3. Rebrand is otherwise consistent: no leftover "candidate"/recruiting language found in extension source, tests, README, or design doc (only an unrelated `candidateHost` variable name in `bridge.ts`, not user-visible).

EVIDENCE_CHECK:
- Reproduced `node extension/build.mjs` → PASS, unpacked manifest name `Donna — Cadre AI Local Preview`, matches `build.test.ts` assertion.
- Reproduced `npm exec -- vitest run --config extension/vitest.config.ts` → 72/72 PASS, matching claimed count.
- Reproduced `node extension/tests/browser-mock.mjs <label>` → 23 checks PASS, 0 real API/site requests, matching `evidence/px4-contextual-donna-20260909/browser-mock.json` (23 entries, all PASS) and the producer's claim.
- `extension/evidence/px4-actual-site-20260909/installed-site.json` shows 17 checks, all PASS or INFO, `liveApiRequests: 1` — internally consistent with the "17 scoped checks, exactly one live request" claim in README/docs/producer note. I did not re-run this (owner-gated, real network to `cadre.ai` and live provider spend); treated as supplied evidence, not independently reproduced.
- `npm run typecheck` and `npm run lint` (whole repo, not extension-scoped) → PASS, consistent with producer's claim.
- `contracts.ts`, `bridge.ts` byte-identical to the prior audited tip `b12ce563...` (confirmed via `git diff` — no output), so the authority boundary (fixed enum, fixed endpoint, no arbitrary URL) is unchanged by this commit, matching the "authority unchanged" claim in `evidence/premium-context/px4-producer-20260909.md`.
- `content-script.ts`'s `pageContext()` function still derives only `location.pathname`/`location.hash` against a fixed switch statement; no DOM/text/cookie/storage read added — matches the contract.
- Contrast spot-checks (WCAG formula) on new/changed panel colors (context-copy, context-label, composer-note, launcher/header marks) all exceed 4.5:1/3:1 — no new contrast defect found; the defect found is font-size, not contrast.

FIX_SCOPE:
Smallest repair: in `extension/src/panel/panel.css`, raise `.eyebrow`, `.welcome-kicker`, `.context-label`, and `.composer-note` (or specifically the `#privacy` text) to `font-size:12px` (adjust surrounding layout/line-height minimally to avoid new overflow at 320/360 CSS px), and bump `.context-prompt` to 12px. Add a regression assertion (unit or `browser-mock.mjs` check) that these elements' computed font-size is ≥12px so this cannot silently regress again. No change needed to `content-script.ts`, `contracts.ts`, `bridge.ts`, or any network/context-authority code — this is presentation-only and stays inside `extension/src/panel/`.

PX4_UNLOCK: NO

NOT_VERIFIED:
- The owner-gated `EXTENSION_ACTUAL_SITE=1 node extension/tests/installed-site.mjs` run was not re-executed (would touch the real `cadre.ai` site and live chatbot budget); its JSON evidence was inspected but not independently reproduced.
- No live-render/visual check (screenshot pixel measurement or Chrome DevTools computed-style capture) of the flagged 8px elements was performed; the finding is based on the CSS source, not a rendered zoom/reflow screenshot at 320/360/760/1280.
- Screen-reader/AT behavior, physical keyboard testing, and cross-browser rendering beyond the recorded Chromium versions were not exercised.
- Whole-repo `npm test`/`npm run build`/Playwright e2e suites were not rerun in this review (out of the bounded scope of the extension diff); only extension-specific unit/mock evidence and repo-wide typecheck/lint were reproduced.
- Whether the PX3B gate that preceded this commit already reviewed and knowingly accepted the 8px sizes (vs. missed them) was not investigated; only the current-tree state was assessed.
