# Plan — Cadre AI Chatbot

**Status: PARTIAL_WITH_DOCUMENTED_BLOCKERS.** Execution status is owned by the append-only event ledger; this file and `feature_list.json` are projections. N1–N5 are done. N3 and N4 were reopened for the model-evaluation/readability repairs and independently re-closed. N6 has verification and code-review PASS, but its release-check is BLOCKED because the current reviewed product source is newer than deployed runtime `c6f781c` and this sandbox has no authorized Vercel session/token to deploy and verify the current snapshot. See `evidence/N6-release/deployment-drift-20260909.md`.

## Objective

Ship a one-page grounded customer-support chatbot for Cadre AI, deployed at a public URL: it answers common prospective- and existing-client questions from a curated, versioned knowledge set, and redirects honestly when a question is out of scope.

## Scope summary

In scope: single Next.js/TypeScript app; one server-side chat endpoint; curated knowledge with provenance and approved links; deterministic intent routing; narrow mockable provider adapter; bounded input/history/output; honest fallback and escalation; unit/integration tests plus a small browser and live evaluation matrix; public deployment; a reproducible, verified source archive prepared before release closure.

Out of scope (baseline): database, auth, CRM, real booking/calendar integration, vector database, multi-tenant platform, analytics, persistent chat history.

Canonical detail: `specs/001-support-chatbot/requirements.md`. This file is an index and must not restate requirements.

## Evaluation rubric -> review evidence

The candidate guide weights the review 30% Claude Code proficiency, 25% system design/architecture, 20% development speed/scope, 15% code quality/verification, and 10% communication/reasoning. This project therefore keeps the following proof surfaces explicit instead of relying on a polished demo alone.

| Review dimension | Concrete evidence to walk through | Claim boundary |
|---|---|---|
| Claude Code proficiency (30%) | Root `CLAUDE.md`; this sequential plan; bounded role briefs; producer/critic/fixer/verifier artifacts; small commits; exact failure-to-repair evidence | The workflow contract and artifacts show how AI-assisted work is directed and verified. They do **not** prove a named tool executed; actual tool provenance must be stated from observed runs. |
| System design & architecture (25%) | `specs/001-support-chatbot/design.md`; config/core/provider/UI ownership; deterministic policy around model selection; server-only credential boundary; reuse fixture | Explain why this is constrained model-assisted answering rather than a vector RAG or unrestricted agent, and what would change at scale. |
| Development speed & scope (20%) | Explicit baseline/out-of-scope list; N1-N6 graph; early N5 deployment; stretch extension isolated in its own ledger | Working core beats feature count. Extension, analytics, auth, CRM, persistence and vector search cannot delay core release evidence. |
| Code quality & verification (15%) | Unit/integration/browser/public/archive evidence; retained FAIL-to-fix-to-retest records; typed boundaries; bounded retry/timeouts; secret-safe packaging | Automated checks support only the behavior they exercise; screen readers, physical devices and unexecuted live checks remain unverified. |
| Communication & reasoning (10%) | Decision log, trade-offs, source audit, model/cost ledger, checkpoint, release-readiness report | Be explicit about incomplete work, rejected agent findings, model choice, cost, and what would be done with more time. |

Live-review preparation should use this table as an index, not as a script: demo the public behavior first, then open the exact artifact that proves each engineering claim.

## Milestones

| # | Milestone | Maps to | Status |
|---|-----------|---------|--------|
| M0 | Repository foundation and canonical spec | this document set | done (approved 2026-09-08) |
| M1 | App foundation, local walking skeleton | node `N1-foundation` | done (ledger: done; evidence/N1-foundation/) |
| M2 | Knowledge base and routing | node `N2-knowledge-routing` | done: refreshed official-source content, fresh independent critic/verifier, 233 tests |
| M3 | Chat API and provider adapter (mock-first) | node `N3-chat-api-adapter` | done: model allowlist/evaluator repair independently verified; full suite 245/245, typecheck, lint and build PASS |
| M4 | Conversation UI and UX states | node `N4-ui` | done: hydration + small-screen readability repairs; clean extracted package passes 48/48 browser cases and independent Granite UI review |
| M5 | Early deployment — authorization-gated, attempted as soon as U3 resolves; may run in parallel with M2–M4 | node `N5-deploy` | done: authorized mock scaffold, anonymous checks and separate review PASS |
| M6 | Verification, live evaluation, packaging, release readiness | node `N6-verify-release` | **blocked**: local verification/code-review/package PASS; release-check BLOCKED until current source is deployed and anonymously reverified on authorized Vercel |

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

## Current content and integration decisions

- The owner requested a fresh review of the official Cadre site and the v1.1 brief. Research is recorded in `docs/knowledge-source-audit.md`; the shipped store remains `src/config/cadre.ts`. Admit factual updates only after tests and review, preserving all six topic boundaries.
- `CLAUDE.md` now describes the concrete stack, Graph Engineering lifecycle, real subagent responsibilities, context recovery and verification commands. `docs/delivery-requirements-recheck.md` maps the brief to current evidence and remaining gaps.
- The Chrome adapter is optional stretch work, not a substitute for the public app. The subsequent explicit owner request authorized parallel source/build/mock work: `progress/extension-authorization-2026-09-08.md`. G9 runs in its own baseline/ledger under `progress/`, preserving N1–N6 unchanged. Generic label: “Integration Preview”; actual installation/site proof requires its own gate.
- Prioritize N4 repair and N6 live/public/package proof. Do not add a database or bulk scraper merely to store this small, versioned knowledge set. Do not let extension polish consume the core verification window.

## Delivery risks

### UI/UX acceptance tracking

Owner-requested quality clarification, 2026-09-08. Durable UX-01–09 rules are listed in CLAUDE.md; original S1–S6/AC1–AC10 remain in the approved specification. A previous passing viewport does not close a newly reproduced case.

| IDs | Gate and required proof | Current evidence / next action |
|---|---|---|
| UX-01, UX-08 | Identity/scope, six starts, safe links, privacy; screenshots + scenario/injection tests | Existing core/browser evidence; independent standards critic confirms inspected defaults, not all future states |
| UX-02–04 | Cold-load, single flight, retry/Stop/reset, keyboard/IME/focus, scroll/history | Independent 42-case local + four cold probes; 38 repaired-public cases. Preserve regressions when changing layout |
| UX-05 | Four widths + short text-spaced failed/restored-draft states; positive visible transcript geometry and visual QA | PASS for reproduced 320×568 / 360×640 text-spacing defect; readability regression is included in the 48-case browser suite |
| UX-06 | Contrast samples, ≥44px primary targets, ≥12px important copy, mobile composer ≥16px | PASS for the measured typography/mobile boundaries in `e2e/readability.spec.ts`; broader accessibility is not inferred |
| UX-07 | Status/error semantics and reduced motion; separately executed assistive-technology checks | DOM/source coverage present; actual VoiceOver/NVDA, forced colors and physical keyboard remain UNVERIFIED |
| UX-09 | Distinct roles, immutable FAILs, source/hash/command-specific independent acceptance | PASS for the repaired local boundary; original critic failures are retained and Granite final source review is separate from release authorization |

Actual browser zoom 200%/400%, screen-reader and physical-device checks are not inferred from viewport emulation. Keep these as explicit unverified coverage, not automatic product blockers unless a failing mandatory criterion is observed. The reproduced spacing defect is fixed locally; the remaining requirement is to deploy and reverify that repair on the authorized public release.

### Model and cost comparison

The owner requested a temporary Gemini 3.8 Flash comparison. `docs/model-evaluation-plan.md` defines the same 14-case set, model-independent controls, strict output/CTA/grounding thresholds and an 18-inference-attempt / $0.15 conservative reservation ceiling within the existing $5 allowance. The allowlisted model configuration and evaluator controls are independently verified and N3 is done. The live A/B is **NOT RUN** in this sandbox because the chatbot-only OpenRouter credential is unavailable; no winner is inferred from dry-run data. Production remains unchanged until reviewed live evidence exists. Costs separate reported coding spend from measured chatbot usage and unknown historical tokens.

- iCloud-hosted working copy: slow I/O and sync artifacts around `node_modules`/`.git` (accepted, documented; D6).
- Serverless rate limiting is process-local, not a hard guarantee — it will be labeled honestly in docs and UI.
- Public site content can change; every knowledge entry carries source and retrieval date.
- Small local live smoke passed; observed cumulative usage $0.0006324, remaining $4.9993676. Provider accounting can lag. Mock, live local, browser and public checks remain separate evidence categories.
- Separate-agent execution recovered in the current run; N3 now has real independent checks. Earlier credit errors remain documented historical evidence.

## Historical bootstrap evidence

- Remote adopted non-destructively: `origin/main` @ `179bf51` ("Initial commit": `README.md`, `.gitignore`); local branch `main` tracks it. Pre-existing untracked `test.md` preserved, unstaged.
- Draft documentation set: `CLAUDE.md`, `plan.md`, `specs/001-support-chatbot/{requirements,design,tasks}.md`, `feature_list.json`, README update — all uncommitted pending approval; corrected after documentation review on 2026-09-08 (packaging criterion, gating separation, graph bootstrap, ID/contract consistency, bounded wording).

## Next action

N6 is intentionally terminal at **PARTIAL_WITH_DOCUMENTED_BLOCKERS** in the current environment. To resume: restore an authorized Vercel session/token for the existing `cadre-ai3/cadre-ai-chatbot` project, deploy the current reviewed snapshot, and repeat anonymous public smoke + repaired browser/readability verification against that exact release. If the owner still wants the Gemini comparison, provide the chatbot-only OpenRouter key to the already verified bounded evaluator and run it without model-specific prompt changes. Then reopen N6 through supported graph transitions, clear `release-check`, prepare a final ZIP from the final closure commit, and request human submission approval. No push, upload, email or fabricated tool provenance is inferred.
