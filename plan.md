# Plan — Cadre AI Chatbot

**Status: approved, implementation resumed.** Execution status is owned by the event ledger; this file and `feature_list.json` are projections. U1–U4 are resolved: OpenRouter, $5 total inference allowance, small local commits, and confirmed Vercel team `Cadre_AI` / `cadre-ai3`. Separate agents are running again. The N3 critic found a serialized-history defect, now repaired and undergoing independent verification. The first N5 mock scaffold is deployed and passes anonymous checks. This is not final release approval. See `progress/authorization-2026-09-08.md`.

## Objective

Ship a one-page grounded customer-support chatbot for Cadre AI, deployed at a public URL: it answers common prospective- and existing-client questions from a curated, versioned knowledge set, and redirects honestly when a question is out of scope.

## Scope summary

In scope: single Next.js/TypeScript app; one server-side chat endpoint; curated knowledge with provenance and approved links; deterministic intent routing; narrow mockable provider adapter; bounded input/history/output; honest fallback and escalation; unit/integration tests plus a small browser and live evaluation matrix; public deployment; a reproducible, verified source archive prepared before release closure.

Out of scope (baseline): database, auth, CRM, real booking/calendar integration, vector database, multi-tenant platform, analytics, persistent chat history.

Canonical detail: `specs/001-support-chatbot/requirements.md`. This file is an index and must not restate requirements.

## Milestones

| # | Milestone | Maps to | Status |
|---|-----------|---------|--------|
| M0 | Repository foundation and canonical spec | this document set | done (approved 2026-09-08) |
| M1 | App foundation, local walking skeleton | node `N1-foundation` | done (ledger: done; evidence/N1-foundation/) |
| M2 | Knowledge base and routing | node `N2-knowledge-routing` | done: critic/fixer/independent verification, 114 tests and production build |
| M3 | Chat API and provider adapter (mock-first) | node `N3-chat-api-adapter` | done: independent critic/fixer/verifier; 203 tests, typecheck, lint and build PASS |
| M4 | Conversation UI and UX states | node `N4-ui` | running: UI producer and browser suite implementation |
| M5 | Early deployment — authorization-gated, attempted as soon as U3 resolves; may run in parallel with M2–M4 | node `N5-deploy` | done: authorized mock scaffold, anonymous checks and separate review PASS |
| M6 | Verification, live evaluation, packaging, release readiness | node `N6-verify-release` | not started |

## Decision log

| ID | Decision | Status |
|----|----------|--------|
| D1 | Next.js + TypeScript, single app, server-side chat endpoint | proposed |
| D2 | Curated structured knowledge + deterministic routing; no vector DB; not labeled "RAG" | proposed |
| D3 | Narrow provider adapter, server-side, mockable; concrete provider is decision U1 | proposed |
| D4 | No persistence layer in the baseline | proposed |
| D5 | Graph execution transition after approval, with a bounded bootstrap step (see below) | proposed |
| D6 | Keep working copy in its current iCloud-synced location; caveat documented in `CLAUDE.md` | accepted |
| D7 | Replace the inherited Jekyll-oriented `.gitignore` with a Node/Next template as part of N1 (it came from the remote's initial commit and is not a stack decision) | proposed |
| D8 | Deployment is its own authorization-gated node (`N5-deploy`) so local scaffold/test/mock work never waits on deployment credentials; verified live deployment remains mandatory for final release | proposed |

## Unresolved decisions (each blocks ONLY what is named; none blocks documentation or local mocked work)

| ID | Decision needed | Blocks (only) |
|----|-----------------|---------------|
| U1 | Resolved: OpenRouter; model selection delegated, inexpensive explicit model preferred | no longer blocks N3; adapter is server-side only |
| U2 | Resolved: $5 total; conservative operational expiry 2026-09-15T00:00:00Z despite later provider metadata | bounded chatbot inference only, retain reserve; never coding assistance |
| U3 | Resolved: owner confirmed `Cadre_AI` / `cadre-ai3` for CLI deployment | no longer blocks N5 or deployed checks; no push/submission/paid add-ons inferred |
| U4 | Resolved: owner requests small commits; existing configured Git identity retained | local commits authorized; no push or submission authorization inferred |
| U5 | Target release date | nothing; informational for scheduling the N6 closure gate |
| U6 | Whether a public client-portal URL exists | not a release blocker — the agreed honest contact fallback covers S3; resolving U6 only refines that answer's wording |

A node whose gated check is still pending stays open — a pending deploy or live check is never treated as passed.

## Source classification

- **Stakeholder requirements brief** (private): summarized into the spec; not stored in this repository.
- **Official public website** `https://cadre.ai` — verified 2026-09-08 (`cadreai.com` 301-redirects there). Verified pages and CTAs are recorded as knowledge seeds in `design.md`, each with a retrieval date.
- Everything else is an engineering proposal, marked as such in the decision log.

## Graph transition decision (D5)

After human approval of `specs/001-support-chatbot`, execution moves to an event-sourced graph ledger validated by the pinned, MIT-licensed runtime at https://github.com/BernydotJar/Graph-harness-sdlc, revision `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`, consumed from a checkout outside this repository (never vendored into the app or its deployment).

**Bootstrap step (post-approval, before graph-driven feature execution; performed under the spec-first discipline of this document set):**

1. Build the minimal application adapter that exports the approved node definitions `N1-foundation` … `N6-verify-release` — IDs, dependencies, boundaries unchanged — from the canonical spec into `graph-harness.project.json` (`graph-harness.project.v1`), with gate definitions requiring real evidence kinds (test output, review report, deploy check).
2. Unit-test the adapter output against the runtime's published `project-v1` schema and validate with the pinned CLI before any event exists.
3. Freeze that file as the initial baseline: every node initialized at `spec_ready` — no node is ever initialized as approved, running, or done.
4. Record the actual human approval as the first ledger events through the documented CLI, then perform only supported lifecycle transitions. Once events exist, the baseline is never regenerated.

**Allowed paths for the bootstrap and subsequent graph bookkeeping:**

- `tools/graph-adapter/**` — adapter source and its tests.
- `graph-harness.project.json` — generated by the adapter, then frozen as the baseline.
- `graph-harness.events.jsonl` — append-only, written only through the runtime CLI, single writer.
- `evidence/**` — sanitized evidence artifacts referenced by gate events (their content hashes must match real files).

**Ownership:** specs own requirements, node/task IDs, dependencies, and boundaries; `graph-harness.project.json` owns the execution definition and initial baseline; CLI-driven append-only event replay owns execution status afterward. This `plan.md` and `feature_list.json` become read-only projections of that status. Node lifecycle: `spec_ready → approved → ready → running → review → done`, with `repair_required` for localized repair. Approval recording alone does not change status; gates require existing evidence artifacts with verified content hashes.

Reproducible validation (Python 3.11+, from the pinned runtime checkout, absolute paths):
`python3 -m graph_harness --project <APP>/graph-harness.project.json --events <APP>/graph-harness.events.jsonl validate` (also `status --pretty`, `ready --pretty`).

Methodology conventions (spec layout, status vocabulary, gate discipline) are adapted from https://github.com/BernydotJar/harness-sdlc at revision `f5960564fd4c75e9e4c467a6445e3e39d5e32f1c`. That repository has no license file at the pinned revision, so no upstream text or templates were copied — only the conventions were re-expressed in this project's own words.

## Risks

- iCloud-hosted working copy: slow I/O and sync artifacts around `node_modules`/`.git` (accepted, documented; D6).
- Serverless rate limiting is process-local, not a hard guarantee — it will be labeled honestly in docs and UI.
- Public site content can change; every knowledge entry carries source and retrieval date.
- Small local live smoke passed; observed cumulative usage $0.0006324, remaining $4.9993676. Provider accounting can lag. Mock, live local, browser and public checks remain separate evidence categories.
- Separate-agent execution recovered in the current run; N3 now has real independent checks. Earlier credit errors remain documented historical evidence.

## Historical bootstrap evidence

- Remote adopted non-destructively: `origin/main` @ `179bf51` ("Initial commit": `README.md`, `.gitignore`); local branch `main` tracks it. Pre-existing untracked `test.md` preserved, unstaged.
- Draft documentation set: `CLAUDE.md`, `plan.md`, `specs/001-support-chatbot/{requirements,design,tasks}.md`, `feature_list.json`, README update — all uncommitted pending approval; corrected after documentation review on 2026-09-08 (packaging criterion, gating separation, graph bootstrap, ID/contract consistency, bounded wording).

## Next action

Complete N4 with separate review, repair and browser verification, then deploy the finished UI and execute N6 live/public checks and verified packaging. Use `docs/chatbot-ux-assessment.md` for the UI brief. `.env.local` still defaults to mock. Historical spec headers and bootstrap proposals are retained as the approved baseline; the ledger and authorization amendment supersede stale wording. Do not regenerate the baseline. Terraform remains deferred; it is not automatic multi-cloud portability. No product release or final archive is claimed.
