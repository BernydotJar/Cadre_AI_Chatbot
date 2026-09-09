# Plan — Cadre AI Chatbot

**Status: PRODUCTIZATION_COMPLETE_AND_PUBLICLY_VERIFIED + DOCUMENTED_EXTERNAL_GIT_BLOCKER.** The owner-authorized **Knowledge → Persona → Experience** productization graph is complete: P1, P2 and P3 are DONE with every blocking gate PASS. Cadre composes the English persona **Donna**, whose deterministic initiative is capped to one optional diagnostic question after a grounded answer and can be explicitly declined by the user. The productized source passes 279/279 Vitest tests and 52/52 local Playwright cases, and the clean external 52/52 matrix passes on the existing public Vercel project after promotion of reviewed source `7b6004c1fa5b715b1c2775d07981ebac1eee8622`. G10 remote CI/CD activation remains externally blocked because the dedicated audited `git_push` channel still has no injected `GITHUB_TOKEN`; container/shared GitHub authentication is not equivalent to that release credential.

## Objective

Maintain the shipped Cadre chatbot while productizing it into a reusable profile-driven assistant runtime. A product instance composes a verified `ClientConfig` (knowledge and boundaries), a `PersonaProfile` (voice, initiative budget, approved next-step guidance), and an `ExperienceProfile` (brand copy, theme, avatar, prompts, and presentation). Cadre ships with the English persona **Donna** and remains grounded, bounded, and deployable on the existing infrastructure.

## Scope summary

In scope: single Next.js/TypeScript app; one server-side chat endpoint; curated knowledge with provenance and approved links; deterministic intent routing; narrow mockable provider adapter; bounded input/history/output; honest fallback and escalation; unit/integration tests plus a small browser and live evaluation matrix; public deployment; a reproducible, verified source archive prepared before release closure.

Out of scope (baseline and current productization): database, auth, CRM, real booking/calendar integration, persistent chat history, autonomous actions, arbitrary tool execution, unbounded model-led proactivity, vector database, and GraphRAG. Retrieval remains curated/deterministic for the current corpus; the product boundary may expose a future retrieval adapter without introducing vector/graph infrastructure until the corpus and query shape justify it.

Canonical detail: `specs/001-support-chatbot/requirements.md`. This file is an index and must not restate requirements.

## Evaluation rubric -> review evidence

The candidate guide weights the review 30% Claude Code proficiency, 25% system design/architecture, 20% development speed/scope, 15% code quality/verification, and 10% communication/reasoning. This project therefore keeps the following proof surfaces explicit instead of relying on a polished demo alone.

| Review dimension | Concrete evidence to walk through | Claim boundary |
|---|---|---|
| Claude Code proficiency (30%) | Root `CLAUDE.md`; sequential `plan.md`; project subagents in `.claude/agents/`; project commands in `.claude/commands/`; bounded role briefs; producer/critic/fixer/verifier artifacts; small commits; exact failure-to-repair evidence | Configuration shows the intended Claude workflow; actual Claude invocation/use must still be stated only from observed runs. |
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
| M2 | Knowledge base and routing | node `N2-knowledge-routing` | done: exact greeting/source refresh repair; 146 focused tests + Granite policy review PASS |
| M3 | Chat API and provider adapter (mock-first) | node `N3-chat-api-adapter` | done: model allowlist/evaluator repair independently verified; current productized repository suite 279/279, typecheck, lint and build PASS |
| M4 | Conversation UI and UX states | node `N4-ui` | done baseline; the productized Donna shell preserves the authored icon/UX contracts and the current browser matrix is 52/52 PASS |
| M5 | Early deployment — authorization-gated, attempted as soon as U3 resolves; may run in parallel with M2–M4 | node `N5-deploy` | done: authorized mock scaffold, anonymous checks and separate review PASS |
| M6 | Verification, live evaluation, packaging, release readiness | node `N6-verify-release` | **DONE**: verification/code review/release-check PASS; existing production alias reverified, public Playwright 50/50 PASS, bounded live smoke PASS, package check PASS |
| M7 | Optional contextual Chrome adapter | separate node `G9-extension-adapter` | done: 72 extension tests, 23 synthetic-browser checks, 17 installed-site checks, Granite review PASS |
| M8 | GitHub CI + gated Vercel CD | separate node `G10-vercel-cicd` | **blocked at deploy gate only**: workflow source/local marker contract/Granite review PASS; existing Vercel project is proven manually, but workflows are not active remotely until audited Git publication succeeds |
| M9 | Optional n8n human-handoff contract | separate node `G11-n8n-handoff-contract` | done: isolated n8n 2.38.1 runtime, consent/routing webhook probes and Granite review PASS; real email delivery intentionally not claimed |
| M10 | Reusable product profiles + Donna + generic experience shell | productization nodes `P1-profile-contracts` → `P2-donna-persona` → `P3-generic-experience-shell` | **DONE + publicly verified**: all gates PASS; 279/279 tests; 52/52 local and clean external browser matrix; second-profile reuse proof; Donna avatar/composer + bounded behavior evidence retained |

## Decision register

The table records the **current disposition** of architectural decisions. Historical proposal/approval timing remains in Git and the append-only ledgers; this projection does not rewrite that history.

| ID | Decision | Current disposition |
|----|----------|---------------------|
| D1 | Next.js + TypeScript, single application, server-side chat endpoint | implemented |
| D2 | Curated typed knowledge + deterministic routing; no vector database; do not label the system vector RAG | implemented |
| D3 | Narrow server-side `FactSelector` adapter with deterministic mock and OpenRouter implementation | implemented |
| D4 | No persistence layer, auth, CRM, analytics or account integration in the baseline | accepted scope boundary |
| D5 | Spec-first Graph Engineering with frozen baseline + append-only execution ledger | implemented |
| D6 | Keep the existing working-copy location and document environment caveats rather than relocating it mid-challenge | accepted |
| D7 | Replace inherited Jekyll-oriented ignore rules with the actual Node/Next exclusions | implemented |
| D8 | Keep deployment as an authorization-gated release concern; local development never treats deploy as implicitly passed | implemented |
| D9 | Keep the Chrome Integration Preview in a separate optional graph so it cannot delay the required public chatbot | implemented; G9 DONE |
| D10 | Chrome context may use only an allowlisted pathname/hash enum for local presentation; no host-page scraping | implemented and installed-site verified |
| D11 | GitHub CI is secret-free; production CD deploys an exact SHA to the **existing** Vercel project using `pull -> build --prod -> deploy --prebuilt --prod` and public release-marker checks | implemented; remote activation blocked by source publication, while equivalent manual existing-project delivery is proven |
| D12 | Treat n8n as a replaceable human-handoff adapter, not domain logic or proof of email delivery | contract implemented; G11 DONE |
| D13 | Product instances compose `ClientConfig + PersonaProfile + ExperienceProfile`; the core remains shared | implemented and independently verified |
| D14 | Donna has an **initiative budget of one**: grounded answers may add at most one configured diagnostic question; she cannot add facts, promises, links, actions, or bypass boundaries, and explicit `no follow-up`/`just answer` requests suppress the optional question | implemented; P2 DONE after critic-driven opt-out repair |
| D15 | Keep current retrieval curated and deterministic. Document a future `KnowledgeRetriever` seam, but do **not** add vector search or GraphRAG until corpus size/relationship-heavy queries require it | accepted scope decision |
| D16 | The default Cadre experience becomes persona-forward: a compact, friendly Donna avatar and a generous writing surface are configuration-driven UI elements, not Cadre-specific logic embedded in the shell | implemented; P3 DONE with Acme/Scout second-profile proof |

## Resolved constraints and open questions

| ID | State | Decision / question | Effect now |
|----|-------|---------------------|------------|
| U1 | resolved | OpenRouter selected; production default remains `openai/gpt-4.1-mini` | no development blocker |
| U2 | resolved | $5 chatbot-only inference ceiling, $0.50 reserve, conservative expiry 2026-09-15T00:00:00Z | live checks remain budget-aware |
| U3 | resolved | Production target is `Cadre_AI / cadre-ai3`, existing project `cadre-ai-chatbot` | owner-authenticated CLI binding and production deployment proved the target without creating replacement infrastructure |
| U4 | resolved | Preserve authentic Git provenance; do not rewrite history or use author metadata as proof of who executed a change | current commits retain their actual technical committer |
| U5 | open, informational | Target submission/release date | scheduling only; does not change acceptance criteria |
| U6 | open, non-blocking | Whether Cadre exposes a verified public client-portal URL | keep the honest official-contact fallback until verified |
| U7 | externally blocked | Audited Git publication action requires its platform-managed credential | CI/CD workflows remain local until the channel is restored |
| U8 | resolved | Existing Vercel project became visible/bound through owner-authenticated CLI recovery | core production equivalence and N6 closure completed; G10 still depends on remote workflow activation |

A node whose gated check is pending or externally blocked stays open. A local build, connector team lookup, or provider READY state is never substituted for deployed release evidence.

## Source classification

- **Stakeholder requirements brief** (private): translated into the approved spec; the original private document is not copied into this repository.
- **Approved product baseline**: `specs/001-support-chatbot/` plus recorded approval/graph events. Spec headers that describe pre-approval state are historical text, not current execution state.
- **Official public Cadre sources**: refreshed 2026-09-09 and inventoried under `docs/research/`; only reviewed claims promoted into `src/config/cadre.ts` become runtime authority.
- **Implemented engineering decisions**: source code, tests, workflows and the decision register above. Their existence does not by itself prove deployment.
- **Execution/release evidence**: append-only graph events, `progress/checkpoint.md`, and claim-specific artifacts under `evidence/`. Historical FAIL/BLOCKED evidence is intentionally retained.

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

## Productization plan — Knowledge → Persona → Experience

The productization increment intentionally separates **what is true** from **how the assistant behaves** and **how the product looks**. This avoids turning personality into factual authority and keeps the existing safety model intact.

```text
ProductProfile
├── ClientConfig        # verified facts, topics, approved links, boundaries
├── PersonaProfile      # Donna voice + initiativeBudget=1 + approved next steps
└── ExperienceProfile   # copy, theme, avatar, suggestions, composer presentation
           │
           ▼
Shared conversation/runtime core
           │
           ├── deterministic boundaries and routing
           ├── optional bounded FactSelector
           └── at most one app-owned proactive next step
```

### P1 — Reusable product/profile contracts

- Add validated `PersonaProfile`, `ExperienceProfile`, and `ProductProfile` contracts under `src/product/`.
- Add an allowlisted product registry/factory; no request may select an arbitrary module/path/config.
- Preserve `ClientConfig` as factual authority and keep current provider semantics unchanged.
- Prove a second fictional profile through tests so reuse is demonstrated rather than merely claimed.

### P2 — Donna persona

Donna is defined in English and optimized for **usefulness over information density**. Her operating rules are: understand the actual question, answer from verified context, then—only when useful—move the conversation one step forward with **one configured diagnostic question**. She does not stack follow-ups, invent missing facts, pressure the user, claim actions she cannot perform, or make a decline/redirect sound more authoritative than the underlying policy.

A deterministic `maxSteps=1` is enforced by application code. Topic-specific questions are application-owned copy, structurally constrained to one short question with no URLs or bundled instructions, and appended **after** the grounded factual answer, outside model authority. The latest user message can explicitly opt out (`no follow-up`, `just answer`, etc.). Safety/boundary replies remain dominant and receive no persona question.

### P3 — Persona-forward reusable experience

- `ExperienceProfile` now owns visible assistant identity, metadata/copy, theme tokens, avatar configuration, prompt text and starter-topic presentation.
- Donna is the visible Cadre persona instead of the generic “Cadre AI Assistant”.
- The shared shell renders an original orbital-monogram AI-guide avatar and a generous initial writing surface (“What are you trying to figure out?”); it contains no Cadre/Donna product-name branches.
- `chatExperience()` projects only presentation/link/topic metadata to the browser; facts, provenance, routing triggers and persona operating rules remain server-side.
- The fictional Acme Outdoors + Scout fixture proves a second product can reuse the same composition/view contract without Cadre/Donna presentation leakage; it is not registered in production.
- Visible `assistantLabel` is composition-validated to match `persona.name`, closing identity drift found by the P3 critic.
- Existing accessibility, no-storage behavior, safe-link rendering, request cancellation, bounded transcript/history, and current wire contract remain covered by regression tests.

### Retrieval evolution boundary

Current corpus size and query shapes do not justify GraphRAG. The runtime stays on curated typed knowledge + deterministic routing. A future retrieval seam can support `CuratedKnowledgeRetriever → VectorRetriever/HybridRetriever → GraphRetriever`, but adding infrastructure before observed retrieval failure would violate the challenge's explicit scope discipline.

### Acceptance

Productization and release acceptance are satisfied for the tested web product: the graph is valid with P1–P3 DONE and all blocking gates PASS; 279/279 Vitest and 52/52 local Playwright pass; Acme/Scout proves shell reuse; Donna initiative/opt-out and identity invariants are regression-tested; reviewed source `7b6004c1fa5b715b1c2775d07981ebac1eee8622` is deployed on the existing Vercel project as `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`; anonymous Donna/product/API markers and the clean external 52/52 matrix PASS. GitHub remote publication remains a separate external gate and cannot be simulated with a history-rewriting API workaround.

## Current content and integration decisions

- The owner requested a fresh review of the official Cadre site and the v1.1 brief. Research is recorded in `docs/knowledge-source-audit.md`; the shipped store remains `src/config/cadre.ts`. Admit factual updates only after tests and review, preserving all six topic boundaries.
- `CLAUDE.md` now describes the concrete stack, Graph Engineering lifecycle, real subagent responsibilities, context recovery and verification commands. `docs/delivery-requirements-recheck.md` maps the brief to current evidence and remaining gaps.
- The Chrome adapter is optional stretch work, not a substitute for the public app. G9 runs in its own baseline/ledger under `progress/`, preserving N1–N6 unchanged. On 2026-09-09 the owner authorized actual-site disposable-profile proof; G9 is now DONE with all three gates PASS. It remains labeled an independent “Integration Preview”, not a Cadre-installed/endorsed production feature.
- The 2026-09-09 public research inventory lives at `docs/research/cadre-public-sources-20260909.json`; only reviewed typed claims promoted to `src/config/cadre.ts` enter runtime answers.
- The original core release remains closed. New application work is limited to the explicitly authorized P1–P3 productization graph. Do not add a database, bulk scraper, analytics, auth, CRM, vector store, GraphRAG, autonomous actions, or unrelated scope.

## Delivery risks

### UI/UX acceptance tracking

Owner-requested quality clarification, 2026-09-08. Durable UX-01–09 rules are listed in CLAUDE.md; original S1–S6/AC1–AC10 remain in the approved specification. A previous passing viewport does not close a newly reproduced case.

| IDs | Gate and required proof | Current evidence / next action |
|---|---|---|
| UX-01, UX-08 | Identity/scope, six starts, safe links, privacy; screenshots + scenario/injection tests | Current 279-test / 52-browser suite plus Donna desktop/mobile screenshots; exact hello, Donna identity/one-step guidance, safe-link and scope contracts remain passing |
| UX-02–04 | Cold-load, single flight, retry/Stop/reset, keyboard/IME/focus, scroll/history | Independent 42-case local + four cold probes; 38 repaired-public cases. Preserve regressions when changing layout |
| UX-05 | Four widths + short text-spaced failed/restored-draft states; positive visible transcript geometry and visual QA | PASS for reproduced 320×568 / 360×640 text-spacing defect; readability regression is included in the final 50-case browser suite |
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

Retry only the dedicated audited Git publication action from the current closure HEAD. Shared/container GitHub authentication is healthy, but the latest recorded audited publisher attempt from `8972fad6d8434605699bfc31a5f2f3eeaa630d43` returned `GITHUB_TOKEN is required for git_push`; if that persists, retain G10 BLOCKED and request reconnection/authorization of the **outer sandbox GitHub publisher channel**, not another `gh auth login` inside `/workspace`. Do not use shell `git push`, token extraction, force push, or GitHub Contents API commit reconstruction as a bypass because the candidate ZIP must preserve the authentic local history/SHA chain.

Then rebuild and clean-room verify the candidate ZIP from the final closure commit with `.git` included and dependencies/build output/secrets excluded. Recruiting submission/upload remains a separate explicit action.
