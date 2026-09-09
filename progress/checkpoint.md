# Resumable checkpoint — Cadre AI Chatbot

_Last updated: 2026-09-08 (after N1 closure; N2 in review). This file is a projection; the ledger owns status._

## Phase

Graph execution (post-bootstrap) over `graph-harness.project.json` + `graph-harness.events.jsonl`, validated with the pinned runtime (Graph-harness-sdlc @ `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`, external checkout, Python 3.11+; on this machine `/opt/homebrew/bin/python3.13`).

## Git

Branch `main` tracking `origin/main` @ `179bf516f5f69bb5b0e3972ce7c269d615b67ccf` (the only commit). ALL implementation work is intentionally uncommitted: commits are gated by the Git author-identity decision (U4). `test.md` at the root is user-owned WIP — never stage, edit, or delete it.

## Node status (ledger)

- N1-foundation: done (evidence + verification/code-review gates PASS; `evidence/N1-foundation/`).
- N2-knowledge-routing: running — implementation and tests complete (48/48), critic review in progress.
- N3, N4: approved, waiting on dependency chain.
- N5-deploy: blocked awaiting deployment authorization (U3).
- N6-verify-release: approved; final release checks additionally need U1/U2 (live) and U3 (deployed).

## Unresolved human decisions (ask in one batch when pausing)

U1 provider/model; U2 numeric spend envelope; U3 deploy platform+account; U4 git author identity; U5 release date (informational). U6 portal URL — not blocking (honest contact fallback shipped).

## How to resume

1. Read `CLAUDE.md`, `plan.md`, this file; run `git status`.
2. Validate ledger: `python3 -m graph_harness --project <APP>/graph-harness.project.json --events <APP>/graph-harness.events.jsonl validate && ... status --pretty` from the pinned runtime checkout.
3. Continue the open node per `specs/001-support-chatbot/tasks.md`; per-node loop = implement → separate-context critic review → fix → verify (`npm run typecheck && npm run lint && npm test && npm run build`) → record evidence (repo-relative artifact paths + explicit sha256) → evaluate gates → transition review/done → checkpoint.
4. Single ledger writer; always pass `--expected-last-event-id`.
5. Local server: `npm run start` on 127.0.0.1:3100 (port 3000 is taken by Docker on this machine).
