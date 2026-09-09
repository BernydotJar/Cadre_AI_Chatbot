# Resumable checkpoint — Cadre AI Chatbot

_Last updated: 2026-09-08 (N2 done; N3 verification passed, independent review blocked; Vercel CLI authenticated with a scope mismatch). This file is a projection; the ledger owns status._

## Phase

Graph execution (post-bootstrap) over `graph-harness.project.json` + `graph-harness.events.jsonl`, validated with the pinned runtime (Graph-harness-sdlc @ `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`, external checkout, Python 3.11+; on this machine `/opt/homebrew/bin/python3.13`).

## Git

Branch `main` tracks `origin/main`; local small commits now record recovery, tooling, decisions and verified fixes. U4 is resolved using the configured author. No push or submission authorization is inferred. Existing `test.md` was present at initial recovery but absent on a later read-only check; this continuation did not edit, stage or delete it. Do not recreate it or infer its contents. `.codex` and credentials are ignored and absent from tracked paths.

## Node status (ledger)

- N1-foundation: done (evidence + verification/code-review gates PASS; `evidence/N1-foundation/`).
- N2-knowledge-routing: done — critic/fixer/independent verifier complete; failed reports preserved, follow-up PASS; 114 tests, typecheck, lint and build pass (`evidence/runs/n2-followup/`).
- N3-chat-api-adapter: blocked — 200 tests, typecheck, lint, build and seven local API cases (six grounded live, one deterministic refusal) passed. Code-review gate BLOCKED: producer, critic and UI-research agents stopped with an exhausted-workspace-credit error. Coordinator completed tests and a media-type fix, not an independent review. Source commit `bddb6fe61f4fc5137a5cfe2546eaaac264616e5f`; reports under `evidence/N3-chat-api-adapter/`.
- N4-ui: approved, waiting on N3 closure.
- N5-deploy: blocked — Vercel CLI 59.12.0 login completed via owner-authorized device flow. Supplied `cadre-ai` scope returned `The specified scope does not exist`; accessible team is `Cadre_AI` / `cadre-ai3`. Confirm the intended team before creating/deploying resources. Pro plan is owner-reported, not independently verified.
- N6-verify-release: approved; public/live checks and verified source archive remain pending; no product-completion claim.

## Unresolved human decisions (ask in one batch when pausing)

U1/U2 resolved: OpenRouter exclusively for chatbot responses, $5 total. After the small live run, read-only key metadata showed remaining $4.9993676 and usage $0.0006324 (accounting may lag). Credential is in ignored owner-readable `.env.local`; never print it. Mock remains the saved default; conservative operational expiry 2026-09-15T00:00:00Z despite later API metadata. The coordinator's live loopback server was stopped and port 3100 has no listener. U3 now needs team-scope confirmation, not another login code. UI-agent work and N3 independent verification need restored agent execution. U5 release date is informational; U6 portal URL is covered by honest contact fallback.

## Latest research and tooling

The owner's `t.co/A5lTHM3bvN` reference resolved to `https://lawsofux.com/es/` and was visually inspected. Coordinator-authored `docs/chatbot-ux-assessment.md` cites current primary UX/product/accessibility docs and distinguishes scoped support behavior from frontier agent capabilities. Context7 was not available in the active MCP tools/resources. The autoskills README was inspected, not executed or installed. Vercel CLI was invoked through pinned `npm exec --package=vercel@59.12.0` outside the app; no app dependency, Git remote, cloud resource or deployment was changed. The native `vercel` executable was initially absent.

Session outcome so far: **PARTIAL_WITH_DOCUMENTED_BLOCKERS**. This does not close N3/N4/N5/N6 or the human release gate. Source archive and public deployment remain undone.

## How to resume

1. Read `CLAUDE.md`, `plan.md`, this file; run `git status`.
2. Validate ledger: `python3 -m graph_harness --project <APP>/graph-harness.project.json --events <APP>/graph-harness.events.jsonl validate && ... status --pretty` from the pinned runtime checkout.
3. Continue the open node per `specs/001-support-chatbot/tasks.md`; per-node loop = implement → separate-context critic review → fix → verify (`npm run typecheck && npm run lint && npm test && npm run build`) → record evidence (repo-relative artifact paths + explicit sha256) → evaluate gates → transition review/done → checkpoint.
4. Single ledger writer; always pass `--expected-last-event-id`.
5. Local server: `npm run start` on 127.0.0.1:3100 (port 3000 is taken by Docker on this machine).
6. `npm run verify -- <unique-label>` saves actual sanitized outputs without overwriting old runs. `npm run graph -- ...` uses the pinned external checkout from `GRAPH_HARNESS_RUNTIME` and `GRAPH_PYTHON`; it adds the optimistic event guard and hashes real evidence files. Never run multiple builds or graph writers.
