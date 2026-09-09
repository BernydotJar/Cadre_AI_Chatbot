# Resumable checkpoint — Cadre AI Chatbot

_Last updated: 2026-09-08 (N2 closed after independent verification; N3 running). This file is a projection; the ledger owns status._

## Phase

Graph execution (post-bootstrap) over `graph-harness.project.json` + `graph-harness.events.jsonl`, validated with the pinned runtime (Graph-harness-sdlc @ `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`, external checkout, Python 3.11+; on this machine `/opt/homebrew/bin/python3.13`).

## Git

Branch `main` tracks `origin/main`; local small commits now record recovery, tooling, decisions and verified fixes. U4 is resolved using the configured author. No push or submission authorization is inferred. Existing `test.md` was present at initial recovery but absent on a later read-only check; this continuation did not edit, stage or delete it. Do not recreate it or infer its contents. `.codex` and credentials are ignored and absent from tracked paths.

## Node status (ledger)

- N1-foundation: done (evidence + verification/code-review gates PASS; `evidence/N1-foundation/`).
- N2-knowledge-routing: done — critic/fixer/independent verifier complete; failed reports preserved, follow-up PASS; 114 tests, typecheck, lint and build pass (`evidence/runs/n2-followup/`).
- N3-chat-api-adapter: running — producer implementing bounded provider/server/API with mock tests; coordinator owns build and live checks.
- N4-ui: approved, waiting on N3 closure.
- N5-deploy: blocked awaiting deployment authorization (U3).
- N6-verify-release: approved; public/live checks and verified source archive remain pending; no product-completion claim.

## Unresolved human decisions (ask in one batch when pausing)

U1/U2 resolved: OpenRouter exclusively for chatbot responses, $5 total. Read-only key check confirmed remaining $5, usage $0; no inference spent yet. Credential is in ignored owner-readable `.env.local`; never print it. Mock remains default; conservative operational expiry 2026-09-15T00:00:00Z despite later API metadata. See authorization/provider decision notes. U3 deployment platform/account remains open (Vercel recommended; no resources provisioned). U5 release date is informational; U6 portal URL is covered by honest contact fallback.

## How to resume

1. Read `CLAUDE.md`, `plan.md`, this file; run `git status`.
2. Validate ledger: `python3 -m graph_harness --project <APP>/graph-harness.project.json --events <APP>/graph-harness.events.jsonl validate && ... status --pretty` from the pinned runtime checkout.
3. Continue the open node per `specs/001-support-chatbot/tasks.md`; per-node loop = implement → separate-context critic review → fix → verify (`npm run typecheck && npm run lint && npm test && npm run build`) → record evidence (repo-relative artifact paths + explicit sha256) → evaluate gates → transition review/done → checkpoint.
4. Single ledger writer; always pass `--expected-last-event-id`.
5. Local server: `npm run start` on 127.0.0.1:3100 (port 3000 is taken by Docker on this machine).
6. `npm run verify -- <unique-label>` saves actual sanitized outputs without overwriting old runs. `npm run graph -- ...` uses the pinned external checkout from `GRAPH_HARNESS_RUNTIME` and `GRAPH_PYTHON`; it adds the optimistic event guard and hashes real evidence files. Never run multiple builds or graph writers.
