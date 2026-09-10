## PX6 Revision 11 — Independent Source Critic Report

**Verdict: PASS** (source review only — does not substitute for the mandatory final detached runtime verifier)

Reviewed via Read/Grep/Glob only, no Bash/git/tests. Findings below are informational; none are blocking.

### 1. Least privilege of `additionalOfficialDomains` — Confirmed
`src/config/cadre.ts:36` delegates exactly `["https://portal.gocadre.ai"]`. `src/config/types.ts:139-149` matches a link host only when it equals a declared host or ends with `.{declared-host}` — this rejects bare `gocadre.ai` and sibling hosts (`other.gocadre.ai`). `tests/config/config.test.ts:27-41` adds a regression proving delegated-subdomain approval and sibling-host rejection; the pre-existing foreign-domain test (`config.test.ts:59-66`) is untouched.

### 2. Factual authority — Confirmed
`cadre.ts:160-186` states only what was supplied: public CTA → `portal.gocadre.ai/ai-maturity-index`; free, ~10 min, for you and your team; asks company name/website/name/work email; emails a 6-digit code. No ownership, private-login, score, SLA, booking, or security overclaim. The doc comment at `cadre.ts:29-35` explicitly disclaims ownership of the wider `gocadre.ai` domain and calls the host "Cadre-linked," not Cadre-owned.

### 3. Product behavior boundaries — Confirmed
`client-portal` (`cadre.ts:149-167`) keeps `approvedLinks` pointed only at the contact page — it does not surface the maturity/portal link as a login destination — and states plainly "does not have access to client portals or account systems" and "no private client-login address is verified." `maturity-index` (`cadre.ai:170-187`) may link to the public entry flow but states "does not collect that information in chat" and "cannot run the assessment or produce a score." `tests/core/policy.test.ts:49-65` (agent-dashboard/login phrasing) asserts replies stay grounded with `reply.links` equal to `[cadre.contact]` only — no misdirection to the maturity CTA for login-style requests.

### 4. Generic architecture — Confirmed
`additionalOfficialDomains` is a generic, capped (`max(8)`) optional field on `ClientConfig` (`types.ts:62-70`); the validator loop (`types.ts:130-149`) has no Cadre-specific branching — same generic subdomain-matching pattern used for `officialDomain`.

### 5. Regression-source quality — No weakening found
`tests/config/config.test.ts`, `tests/config/knowledge-refresh.test.ts`, `tests/core/policy.test.ts`, `tests/api/chat-route.test.ts` all retain prior assertions (foreign-domain rejection, pricing-boundary linkage, duplicate-topic rejection, fixture reuse) and add new coverage for delegated-vs-sibling-host approval and the updated wording. No deleted or loosened assertion found.

### 6. Documentation/governance consistency — Confirmed
`CLAUDE.md`, `plan.md:247-259`, `progress/checkpoint.md`, `progress/checkpoint-premium.md:14`, `docs/release-runbook.md:14,16`, `docs/architecture-overview.md:19`, `docs/knowledge-source-audit.md:7`, `docs/component-inventory.md:23`, `docs/cinematic-proactive-experience.md:133` all consistently describe: revision-10 historical local PASS (301/301 Vitest + 68/68 Playwright), `69c590b`/CI `34442075458` PASS, deploy run `34442247941` failed-closed on the missing Vercel binding, no PX6 public deployment/equivalence claimed, and revision 11 as in-progress with no r11 runtime PASS claimed. Ledger tail (`progress/premium-graph.events.jsonl:204-208`) matches: `failure.recorded` → `node.invalidated` → `repair.plan_created` → `node.transitioned(running)` → `evidence.recorded(implementation_summary, PASS)`, with no design-review/verification gate yet for revision 11 — consistent with this critic being the next step.

- **Minor/informational:** `plan.md:18` and `progress/checkpoint-premium.md:18` still say the next action is to critique "committed r11 source `ed43a8b`," while current HEAD is `b3d30f7` (a docs/evidence-only commit recording the handoff). No source drift found between the two commits — not a defect, just slightly stale phrasing that should be updated to `b3d30f7` once this review closes.
- **Informational:** the raw Producer report (`evidence/claude-code/px6-r11-source-refresh-producer-20260910.md:22`) still says "Cadre's config now delegates `https://gocadre.ai` explicitly" — this is the Producer's rejected first draft, not the shipped state. The correction is honestly documented in `evidence/premium-release/px6-r11-source-freshness-repair-20260910.md:35` and matches ledger event 207. No repair needed; a reader who opens only the raw Producer file in isolation could misread it, but the correction is recorded adjacently.

### 7. Scope — Confirmed
Diff bounded to `src/config/{cadre.ts,types.ts}`, four test files, docs, `plan.md`, `progress/`, and evidence files. No UI/orb/glare/video/persona/provider/rate-limit/API/dependency changes observed in the areas checked.

### 8. Claude workflow provenance — Honestly represented
The coordinator's handoff doc explicitly discloses that it statically corrected two material Producer errors (mislabeled CI/source SHA, overbroad `gocadre.ai` delegation) before acceptance, and that no r11 runtime PASS is claimed. This matches CLAUDE.md's "preserve rejected reviews with the reason for rejection."

### What I did NOT verify
- Did not run tests, typecheck, lint, build, Playwright, or `release:gate`.
- Did not browse `cadre.ai` or `portal.gocadre.ai` — treated coordinator-supplied observations as given inputs, not independently confirmed.
- Did not inspect `src/product/`, `src/core/policy.ts` internals, or the extension tree beyond confirming no portal/gocadre references appear there.
- Did not verify GitHub Actions run data or SHAs against the actual remote.
- Did not access secrets/.env files.
- Note: a prior, separate critic attempt (`evidence/premium-critic/claude-px6-r11-source-refresh-review-attempt-20260910.md`, untracked) used Bash for `git diff`/`git log`, violating the read-only constraint given to it, and self-disclosed that violation; its intended output destination (`evidence/premium-critic/claude-px6-r11-source-refresh-review-20260910.md`) is empty. This review was conducted independently and did not rely on that attempt's conclusions, only cross-checked them after reaching my own findings.

A PASS here is source-review only; the mandatory detached runtime verifier (Vitest/Playwright/typecheck/lint/build) still must run before revision 11 can close.
