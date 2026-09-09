# Resumable checkpoint — Cadre AI Chatbot

Updated: 2026-09-09 UTC. This is a projection; the append-only Graph Harness ledger is authoritative.

## Terminal state for this session

**PARTIAL_WITH_DOCUMENTED_BLOCKERS.** Local product verification is complete and N6 verification/code-review gates are PASS. N6 `release-check` is BLOCKED because the current reviewed product source is newer than the verified public Vercel runtime and this sandbox does not have an authorized Vercel session/token to deploy and reverify the current snapshot.

Public alias: `https://cadre-ai-chatbot-tawny.vercel.app` (read-only smoke still returns `/` 200 and `/api/health` 200).

Latest product/evidence commit before this projection update: `1add2be`. Graph ledger sequence: 131; last event `52e15fbd-ec1a-4e6e-84e6-a68e20ea8331` transitions N6 to `blocked`.

## Main graph

- N1 foundation: **done**.
- N2 knowledge/routing: **done**.
- N3 chat API/provider: **done** after model allowlist/evaluator repair. Independent deterministic follow-up proves exact empty-input policy failures and accounting failures are not false-positive passes.
- N4 UI/UX: **done** after hydration + small-screen readability repairs. Repaired source passes 48/48 Playwright cases and independent Granite UI review.
- N5 early deployment: **done** for the authorized deployed line.
- N6 verification/release: **blocked**. `verification=PASS`, `code-review=PASS`, `release-check=BLOCKED`.

Pinned external Graph Harness runtime: `6a5f201e2bc640ac46cc0b4b6a3d11b788555664` from `BernydotJar/Graph-harness-sdlc`; the baseline remains frozen and the event ledger remains append-only.

## Verification completed

A fresh candidate source package was prepared from `c7880db0a117fcb65bd3bcc41d326c356383c775` and verified from a clean extraction:

- source/history audit: PASS — 37 commits, 552 physical/reachable objects, no findings;
- ZIP entry safety + `unzip -t`: PASS;
- `git fsck --full --strict`: PASS;
- `npm ci`: PASS, npm reported 0 vulnerabilities;
- lint: PASS;
- strict typecheck: PASS;
- unit/integration: **245/245 PASS**;
- production build: PASS;
- browser: **48/48 PASS** desktop/mobile, including hydration and 320x568 / 360x640 text-spacing regressions.

Candidate ZIP observation: 2,124,813 bytes, SHA-256 `db1a48072f9c03fa85a35e638641c51ec19f912240c58c4e9fa5086af8fc60f7`. It is an intermediate verified package, not a submitted artifact and not the final closure snapshot.

## Independent reviewers actually used

- IBM Granite 3.3 2B via local Ollama 0.33.3: UI/readability critic PASS; strengthened `CLAUDE.md`/`plan.md` workflow critic PASS; archive-fixture verifier PASS; final local source/code review PASS; final release critic `PARTIAL_WITH_DOCUMENTED_BLOCKERS`.
- Deterministic isolated evaluator follow-up: PASS with zero external HTTP/real credential reads. It preserved and rejected a Granite evaluator review whose findings contradicted the supplied/current controls rather than relabeling it.

Role labels are not tool provenance. This sandbox did **not** have a Claude Code executable or a verified Claude gateway/bridge, so no work performed here is attributed to Claude. Do not simulate or rewrite history to imply otherwise.

## Model and cost state

Production default remains `openai/gpt-4.1-mini`; `google/gemini-3.8-flash` is allowlisted for the bounded comparison only. The 14-case / 18-attempt / $0.15-reservation evaluator is independently ready, but the live A/B is **NOT RUN** in this sandbox because `OPENROUTER_API_KEY` is unavailable here. No model winner is inferred from dry-run evidence.

Known cost ledger:

- Claude Code development: **$7.00 user-reported**; token count unknown.
- OpenRouter chatbot key: **$0.001842 cumulative provider usage observed** at the last retained metadata read; accounting can lag.
- Known monetary subtotal: **$7.001842**; not a complete project bill.
- OpenRouter remaining allowance observed: **$4.998158** of $5; retain the separate $0.50 reserve.
- Local Granite: no external inference charge observed; local compute/electricity unpriced.

## Deployment blocker

Retained Vercel receipt identifies deployed runtime `c6f781cf588689deee9ae229261effdd08e5d24b`. Current source has later product changes in:

- `app/globals.css`;
- `e2e/readability.spec.ts`;
- `src/provider/config.ts`;
- `src/provider/openrouter.ts`.

Fresh environment observation:

- Vercel CLI 59.12.0 installed;
- `vercel whoami` => Logged out;
- no `.vercel/project.json`;
- no `VERCEL_TOKEN`;
- no `OPENROUTER_API_KEY` / `.env.local` in this checkout.

Do not treat the older deployed PASS as proof that these newer source changes are deployed. See `evidence/N6-release/deployment-drift-20260909.md` and `granite-final-release-critic.md`.

## Exact resume path

1. Restore authorized Vercel CLI access for the existing `cadre-ai3/cadre-ai-chatbot` project without exposing credentials in source/evidence.
2. Reopen N6 only through supported graph transitions.
3. Deploy the reviewed current snapshot (or later reviewed closure snapshot).
4. Re-run anonymous public page/health, repaired browser/readability checks, and a bounded real-provider round-trip against that exact deployment.
5. If still desired, make the chatbot-only OpenRouter credential available to `tools/evaluation/compare-models.mjs` and run the prespecified GPT-4.1-mini vs Gemini 3.8 Flash live comparison. Do not retune questions after seeing results.
6. Clear `release-check`, transition N6 through review/done, update projections, then prepare and verify a **final** ZIP from the exact final closure commit.
7. Git push, recruiting upload/email and other publication remain separate actions unless explicitly authorized.

The optional Chrome Integration Preview remains outside core release acceptance and keeps its own graph/evidence; no unverified installation on `cadre.ai` should be claimed.
