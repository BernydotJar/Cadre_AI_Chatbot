# Plan — Cadre AI Chatbot

**Status: PX6_REVISION_15_PUBLIC_PASS + FINAL_SOURCE_PACKAGE_PENDING + GITHUB_CI_ACTIVE + AUTOMATED_CD_BINDING_BLOCKED.** Revision 15 is the active public release. The retained lifecycle is r13 68/70 mobile failure -> r14 independent critic CHANGES_REQUESTED -> r15 readable mobile repair. Runtime repair `af7e3ff` is contained in published closure `f334616`, which passed GitHub CI `34562930679`, deployed to the existing Vercel project as `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`, passed anonymous release markers, and passed the complete rate-aware **70/70 public Playwright** matrix. Detached verification remains 302/302 Vitest, 70/70 Playwright, 73/73 extension tests, 24/24 synthetic extension browser, build/typecheck/lint/Graph PASS. Final clean-room source-package verification remains. Automated GitHub CD remains separately blocked because the `production` environment lacks the existing Vercel org/project/token binding.

## Objective

Maintain the shipped Cadre chatbot while productizing it into a reusable profile-driven assistant runtime. A product instance composes a verified `ClientConfig` (knowledge and boundaries), a `PersonaProfile` (voice, initiative budget, approved next-step guidance), and an `ExperienceProfile` (brand copy, theme, avatar, prompts, and presentation). Cadre ships with the English persona **Donna** and remains grounded, bounded, and deployable on the existing infrastructure.

## Scope summary

In scope: single Next.js/TypeScript app; one server-side chat endpoint; curated knowledge with provenance and approved links; deterministic intent routing; narrow mockable provider adapter; bounded input/history/output; honest fallback and escalation; unit/integration tests plus a small browser and live evaluation matrix; public deployment; a reproducible, verified source archive prepared before release closure.

Out of scope (baseline and current productization): database, auth, CRM, real booking/calendar integration, persistent chat history, autonomous actions, arbitrary tool execution, unbounded model-led proactivity, vector database, and GraphRAG. Retrieval remains curated/deterministic for the current corpus; the product boundary may expose a future retrieval adapter without introducing vector/graph infrastructure until the corpus and query shape justify it.

Canonical detail: `specs/001-support-chatbot/requirements.md`. This file is an index and must not restate requirements.

## Review-ready engineering proof surfaces

The project keeps its engineering proof surfaces explicit instead of relying on a polished demo alone. Each claim below must be backed by source, tests, runtime evidence, or an observed tool execution; configuration or naming alone is never treated as proof.

| Engineering dimension | Concrete evidence to walk through | Claim boundary |
|---|---|---|
| AI-assisted engineering workflow | Root `CLAUDE.md`; sequential `plan.md`; project subagents in `.claude/agents/`; project commands in `.claude/commands/`; bounded role briefs; producer/critic/fixer/verifier artifacts; small commits; exact failure-to-repair evidence | Configuration shows the intended Claude workflow; actual Claude invocation/use must still be stated only from observed runs. |
| System design & architecture | `specs/001-support-chatbot/design.md`; config/core/provider/UI ownership; deterministic policy around model selection; server-only credential boundary; reuse fixture | Explain why this is constrained model-assisted answering rather than a vector RAG or unrestricted agent, and what would change at scale. |
| Development speed & scope | Explicit baseline/out-of-scope list; N1-N6 graph; early N5 deployment; stretch extension isolated in its own ledger | Working core beats feature count. Extension, analytics, auth, CRM, persistence and vector search cannot delay core release evidence. |
| Code quality & verification | Unit/integration/browser/public/archive evidence; retained FAIL-to-fix-to-retest records; typed boundaries; bounded retry/timeouts; secret-safe packaging | Automated checks support only the behavior they exercise; screen readers, physical devices and unexecuted live checks remain unverified. |
| Communication & reasoning | Decision log, trade-offs, source audit, model/cost ledger, checkpoint, release-readiness report | Be explicit about incomplete work, rejected agent findings, model choice, cost, and what would be done with more time. |

Use this table as an engineering evidence index: demonstrate behavior first, then open the exact artifact that proves each claim.

## Milestones

| # | Milestone | Maps to | Status |
|---|-----------|---------|--------|
| M0 | Repository foundation and canonical spec | this document set | done (approved 2026-09-08) |
| M1 | App foundation, local walking skeleton | node `N1-foundation` | done (ledger: done; evidence/N1-foundation/) |
| M2 | Knowledge base and routing | node `N2-knowledge-routing` | done: exact greeting/source refresh repair; 146 focused tests + Granite policy review PASS |
| M3 | Chat API and provider adapter (mock-first) | node `N3-chat-api-adapter` | done: model allowlist/evaluator repair independently verified; current repaired premium repository suite 288/288, typecheck, lint and build PASS |
| M4 | Conversation UI and UX states | node `N4-ui` | done baseline; the current premium Donna shell preserves the authored icon/UX contracts and the local browser matrix is 58/58 PASS |
| M5 | Early deployment — authorization-gated, attempted as soon as U3 resolves; may run in parallel with M2–M4 | node `N5-deploy` | done: authorized mock scaffold, anonymous checks and separate review PASS |
| M6 | Verification, live evaluation, packaging, release readiness | node `N6-verify-release` | **DONE**: verification/code review/release-check PASS; existing production alias reverified, public Playwright 50/50 PASS, bounded live smoke PASS, package check PASS |
| M7 | Optional contextual Chrome adapter | separate node `G9-extension-adapter` | done: 72 extension tests, latest repaired 24 synthetic-browser checks, 17 scoped installed-site checks; URL-only context boundary retained |
| M8 | GitHub CI + gated Vercel CD | separate node `G10-vercel-cicd` | **CI ACTIVE / automated deploy gate BLOCKED**: the latest pre-r11 closure source `69c590b` was published through the audited path and GitHub CI run `34442075458` passed. Production workflow run `34442247941` failed closed at the existing-project binding preflight because GitHub `production` lacks `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`. The older PX5 source `8ae8a3a` remains the manually deployed anonymous 58/58 public rollback baseline; no PX6 public equivalence is claimed yet. |
| M9 | Optional n8n human-handoff contract | separate node `G11-n8n-handoff-contract` | done: isolated n8n 2.38.1 runtime, consent/routing webhook probes and Granite review PASS; real email delivery intentionally not claimed |
| M10 | Reusable product profiles + Donna + generic experience shell | productization nodes `P1-profile-contracts` → `P2-donna-persona` → `P3-generic-experience-shell` | **DONE + publicly verified**: all gates PASS; 279/279 tests; 52/52 local and clean external browser matrix; second-profile reuse proof; Donna avatar/composer + bounded behavior evidence retained |
| M11 | Premium Donna experience | premium graph `PX2-donna-premium-identity` → `PX3-ambient-media` → `PX3B-premium-shell-refinement` + `PX4-contextual-donna` → `PX5-premium-release` | **DONE at PX5 revision 4 + public PASS**: all premium gates PASS. Clean detached verification: Git integrity + install + typecheck/lint + **288/288 Vitest** + build + **58/58 Playwright** + **72/72 extension** + **24/24 synthetic**. Repaired source `8ae8a3a` is deployed on the existing Vercel project as `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7`; anonymous smoke + **58/58** public Playwright PASS. Earlier review/test/public failures remain retained as forward-repair evidence. |
| M12 | Cadre-native cinematic + proactive Donna | premium graph `PX6-cinematic-proactive-donna` | **revision 15 DONE + PUBLIC PASS; final source package pending**: r13 invitation work exposed two mobile failures (68/70), r14's first repair was independently rejected for sub-12px important copy, and r15 preserves the icon-only mobile launcher while making the separate nudge compact/readable. Runtime repair `af7e3ff` in closure `f334616` passes 302/302 Vitest, 70/70 local Playwright, 73/73 extension tests, 24/24 synthetic browser, build/typecheck/lint/Graph, all premium gates, GitHub CI `34562930679`, existing-project deployment `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`, anonymous markers, and rate-aware **70/70 public Playwright**. |

## Decision register

The table records the **current disposition** of architectural decisions. Historical proposal/approval timing remains in Git and the append-only ledgers; this projection does not rewrite that history.

| ID | Decision | Current disposition |
|----|----------|---------------------|
| D1 | Next.js + TypeScript, single application, server-side chat endpoint | implemented |
| D2 | Curated typed knowledge + deterministic routing; no vector database; do not label the system vector RAG | implemented |
| D3 | Narrow server-side `FactSelector` adapter with deterministic mock and OpenRouter implementation | implemented |
| D4 | No persistence layer, auth, CRM, analytics or account integration in the baseline | accepted scope boundary |
| D5 | Spec-first Graph Engineering with frozen baseline + append-only execution ledger | implemented |
| D6 | Keep the existing working-copy location and document environment caveats rather than relocating it mid-delivery | accepted |
| D7 | Replace inherited Jekyll-oriented ignore rules with the actual Node/Next exclusions | implemented |
| D8 | Keep deployment as an authorization-gated release concern; local development never treats deploy as implicitly passed | implemented |
| D9 | Keep the Chrome Integration Preview in a separate optional graph so it cannot delay the required public chatbot | implemented; G9 DONE |
| D10 | Chrome context may use only an allowlisted pathname/hash enum for local presentation; no host-page scraping | implemented and installed-site verified |
| D11 | GitHub CI is secret-free; production CD deploys an exact SHA to the **existing** Vercel project using `pull -> build --prod -> deploy --prebuilt --prod` and public release-marker checks | implemented and remotely active; CI passed, the premium graph/repository release gate are now releasable, while automated CD still fails closed before Vercel because production secrets are absent |
| D12 | Treat n8n as a replaceable human-handoff adapter, not domain logic or proof of email delivery | contract implemented; G11 DONE |
| D13 | Product instances compose `ClientConfig + PersonaProfile + ExperienceProfile`; the core remains shared | implemented and independently verified |
| D14 | Donna has an **initiative budget of one**: grounded answers may add at most one configured diagnostic question; she cannot add facts, promises, links, actions, or bypass boundaries, and explicit `no follow-up`/`just answer` requests suppress the optional question | implemented; P2 DONE after critic-driven opt-out repair |
| D15 | Keep current retrieval curated and deterministic. Document a future `KnowledgeRetriever` seam, but do **not** add vector search or GraphRAG until corpus size/relationship-heavy queries require it | accepted scope decision |
| D16 | The default Cadre experience becomes persona-forward: a compact, friendly Donna avatar and a generous writing surface are configuration-driven UI elements, not Cadre-specific logic embedded in the shell | implemented; P3 DONE with Acme/Scout second-profile proof |
| D17 | Premium visual quality comes from hierarchy, reduction, spacing, typography and controlled motion—not dashboard chrome or generic neon AI styling. Uploaded geometric references are motion/composition inspiration only | PX2 DONE; refined further in PX3B |
| D18 | Ambient media, if released, is a 6–10 second muted atmospheric layer with no embedded text, a deliberate poster fallback, low aggression/payload, and `prefers-reduced-motion` behavior | PX3 DONE with Pause/Play, pinned local assets, and responsive evidence |
| D19 | Premium release requires a real independent design review or explicit gated human evaluation. Coordinator self-review and failed/empty model-critic attempts cannot satisfy `design-review` | enforced by premium graph |
| D20 | Donna is an editorial product identity, not a mascot or AI badge: compact monogram/seal, no gradients/glow/ring stacks, one dominant identity moment, and shell quality from typography/material hierarchy | owner-authorized PX3B refinement |

## Resolved constraints and open questions

| ID | State | Decision / question | Effect now |
|----|-------|---------------------|------------|
| U1 | resolved | OpenRouter selected; production default remains `openai/gpt-4.1-mini` | no development blocker |
| U2 | resolved | $5 chatbot-only inference ceiling, $0.50 reserve, conservative expiry 2026-09-15T00:00:00Z | live checks remain budget-aware |
| U3 | resolved | Production target is `Cadre_AI / cadre-ai3`, existing project `cadre-ai-chatbot` | owner-authenticated CLI binding and production deployment proved the target without creating replacement infrastructure |
| U4 | resolved | Preserve authentic Git provenance; do not rewrite history or use author metadata as proof of who executed a change | current commits retain their actual technical committer |
| U5 | open, informational | Target submission/release date | scheduling only; does not change acceptance criteria |
| U6 | open, non-blocking | Whether Cadre exposes a verified public client-portal URL | keep the honest official-contact fallback until verified |
| U7 | resolved | Audited Git publisher credential restored and fast-forward publication succeeded | remote `main` and GitHub CI are active; no shell-token bypass was used |
| U8 | resolved | Existing Vercel project became visible/bound through owner-authenticated CLI recovery | core production equivalence and N6 closure completed on the existing project |
| U9 | externally blocked | GitHub `production` environment does not yet expose `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` to Actions | latest repaired-premium CD run `34405608879` passed exact-source/release-gate/install and stopped at the same preflight; product/public delivery is green, but the missing GitHub production binding remains an external automation blocker |

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
- The shared shell renders a restrained profile-driven editorial monogram and a generous initial writing surface (“What are you trying to figure out?”); it contains no Cadre/Donna product-name branches.
- `chatExperience()` projects only presentation/link/topic metadata to the browser; facts, provenance, routing triggers and persona operating rules remain server-side.
- The fictional Acme Outdoors + Scout fixture proves a second product can reuse the same composition/view contract without Cadre/Donna presentation leakage; it is not registered in production.
- Visible `assistantLabel` is composition-validated to match `persona.name`, closing identity drift found by the P3 critic.
- Existing accessibility, no-storage behavior, safe-link rendering, request cancellation, bounded transcript/history, and current wire contract remain covered by regression tests.

### Retrieval evolution boundary

Current corpus size and query shapes do not justify GraphRAG. The runtime stays on curated typed knowledge + deterministic routing. A future retrieval seam can support `CuratedKnowledgeRetriever → VectorRetriever/HybridRetriever → GraphRetriever`, but adding infrastructure before observed retrieval failure would violate the current scope discipline.

### Acceptance

The earlier P1–P3 productization baseline remains historically verified: 279/279 Vitest, 52/52 local and public Playwright, Acme/Scout reuse, Donna initiative/opt-out, and deployment `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`. Premium PX2–PX5 supersedes that presentation/release line; the current repaired acceptance is 288/288 Vitest + 58/58 local and public Playwright, with revision-4 public equivalence PASS on deployment `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7`. GitHub publication is active and must remain fast-forward/authentic.

## Current content and integration decisions

- The owner requested a fresh review of the official Cadre site and the supplied delivery brief. Research is recorded in `docs/knowledge-source-audit.md`; the shipped store remains `src/config/cadre.ts`. Admit factual updates only after tests and review, preserving all six topic boundaries.
- `CLAUDE.md` now describes the concrete stack, Graph Engineering lifecycle, real subagent responsibilities, context recovery and verification commands. `docs/delivery-requirements-recheck.md` maps delivery requirements to current evidence and remaining gaps.
- The Chrome adapter is optional stretch work, not a substitute for the public app. G9 runs in its own baseline/ledger under `progress/`, preserving N1–N6 unchanged. On 2026-09-09 the owner authorized actual-site disposable-profile proof; G9 is now DONE with all three gates PASS. It remains labeled an independent “Integration Preview”, not a Cadre-installed/endorsed production feature.
- The 2026-09-09 public research inventory lives at `docs/research/cadre-public-sources-20260909.json`; only reviewed typed claims promoted to `src/config/cadre.ts` enter runtime answers.
- The original core and P1–P3 productization releases remain closed baselines. The premium PX2–PX5 increment is now the active release line; do not add a database, bulk scraper, analytics, auth, CRM, vector store, GraphRAG, autonomous actions, or unrelated scope.

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

## Premium experience increment — 2026-09-09

The owner requested a stricter post-productization visual pass with a premium B2B / Silicon Valley standard: large editorial typography, sober composition, generous negative space, minimal navigation, cinematic presence, and Donna appearing as a refined tool rather than a generic chatbot. The current Cadre site was re-reviewed before implementation; its richness comes from editorial rhythm, business-outcome framing, imagery/proof and restrained brand cues rather than neon AI decoration.

The first PX2 producer snapshot was functional and regression-green, but an authenticated Claude Code 2.1.266 `critic` agent independently returned **CHANGES_REQUESTED**. Its concrete findings were that the hex/rings/glow/animated-trace mark read as cyberpunk, the left hero and right welcome competed as two hero moments, the composer was visually demoted, Donna repeated too often, the empty state claimed an answer before a question, and starter typography was too small. Evidence is retained at `evidence/premium-critic/claude-uiux-critique-20260909.md`; the earlier Granite timeouts remain historical blocked evidence rather than a substitute verdict.

`PX2-donna-premium-identity` is **DONE** after separate critic and verifier contexts plus design-review/verification/integration-proof PASS gates. The repaired snapshot uses one quiet static ring + accent notch + D monogram, removes the hero-sized duplicate mark and stacked decoration, keeps one dominant dark editorial company statement, moves the initial composer above welcome guidance, reframes the empty state as `Ask Donna about Cadre AI.`, and uses a one-column 14–15px topic list. The first browser rerun exposed reset-focus and sub-pixel 360x640 visibility regressions; both were fixed without weakening the assertions. Current verification is 283/283 Vitest, typecheck/lint/build PASS, and 52/52 Playwright PASS. Fixer screenshots and geometry live under `evidence/premium-identity/`.

PX3 ambient media is DONE: 8 seconds, muted/no audio track, no embedded text, intentional poster, local pinned assets, Pause/Play, reduced-motion poster-only fallback, bounded payload and responsive non-overlap evidence at 320/360/760/1280. PX3B is a separate owner-authorized quality refinement of Donna identity/product shell; it changes presentation only. PX4 is DONE and remains bounded to the allowlisted pathname/hash enum with no scraping or factual-authority change.

## Next action

Build and independently verify the final source ZIP from the final closure commit with `.git` included and dependency/build/env/private artifacts excluded. Product/public release is complete; G10 remains documented as an automated-CD-only blocker until the existing Vercel binding is provisioned in GitHub `production`.

Then rebuild and clean-room verify the source ZIP from the final closure commit with `.git` included and dependencies/build output/secrets excluded. External submission/upload remains a separate explicit action.

## PX6 — Cadre-native cinematic + proactive Donna increment — 2026-09-09

Owner direction: keep the verified Knowledge → Persona → Experience architecture, but move the public presentation from a static split demo toward an AI-native Cadre property. The page should borrow Cadre's own outcome-first rhythm (revenue, profitability, employee leverage), use the existing local ambient motion as a brand layer, and let Donna enter as a floating conversational product rather than permanently consuming half the viewport.

### /plan

1. **Cadre-native page shell.** Full-width editorial hero, current Cadre palette, local cinematic motion, outcome/proof strip, and a verified “Track your AI results” module. Remove the decorative dash before the verified-context label.
2. **Donna presence.** Floating launcher with an original animated orb/face-like identity, one proactive fact/hint at rest, and a focused open chat panel. Mobile becomes a bounded sheet, not a squeezed desktop card.
3. **Conversation affordance.** Add 3–4 high-value starter prompts and concise context-aware hints. During requests, replace the generic spinner with a Donna “Shaping…” state inspired by thinking-orb interaction language but implemented locally without a new runtime UI dependency.
4. **Commercial empathy without invented claims.** Persona/config owns reviewed tone. Pricing/unknown/account replies acknowledge business value, stay short and human, bridge to verified Cadre outcomes, and still route to the approved contact link rather than fabricating a number or action.
5. **Trust + engineering explanation.** Add a compact “How Donna works” section covering verified knowledge, bounded persona behavior, deterministic routing, and human handoff. Durable docs/persona source must match the runtime.
6. **Microinteraction budget.** Maximum two new effects: Donna orb breathing/shaping + a restrained glare/sheen on the launcher/primary interaction. Existing ambient video remains the only cinematic media layer. Respect reduced motion.
7. **Identity cleanup.** Replace the current favicon with a simpler project-owned Cadre/Donna signal mark.
8. **Verification only after producer completion.** Then run full unit/type/lint/build/browser/extension matrices, an independent design/behavior critic (Claude Code when its authenticated session is available), fixer loop if needed, detached verification, Graph gates, exact-SHA publication, existing-project deployment, and anonymous public equivalence.

Acceptance is evidence-based: no stale static split layout, no decorative dash before the verified-context label, Donna visibly invites interaction, the pricing example becomes empathetic but still bounded, the official tracking-results value proposition is represented with provenance, and reduced-motion remains safe. A PX6 graph revision may reach DONE only after its local critic/verifier/gates pass; public release equivalence is a separate post-DONE requirement and can invalidate the node again if the deployed matrix fails.

### PX6 revision 11 — source-freshness repair — 2026-09-10

Revision 10 reached DONE locally (all three premium gates PASS; clean verifier 301/301 Vitest + 68/68 Playwright) and its audited source `69c590b` passed GitHub CI run `34442075458`; deploy-production run `34442247941` then failed closed at the same pre-existing missing Vercel org/project/token binding as G10. No PX6 public deployment or public equivalence was ever claimed on that revision.

On 2026-09-10 the coordinator supplied fresh observations of the live public Cadre site: the homepage "Track your AI results" section's "Get Your AI Results" CTA now resolves to `https://portal.gocadre.ai/ai-maturity-index`, a Cadre-linked public destination on a separate host from `cadre.ai`. That destination is a public AI Maturity Index sign-up entry point (free, ~10 minutes, asks for company name/website, name, work email, then emails a 6-digit code) — it does **not** establish a verified private client-login/account portal. This made the shipped `portal`, `maturity-index`, and `track-ai-results` facts/links stale, and the Graph was reopened to `repair_required` at revision 11.

This repair is bounded to source freshness and reviewer clarity:

- `src/config/types.ts` adds a generic, explicit `additionalOfficialDomains` allowlist on `ClientConfig`; approved links may match `officialDomain`, any explicitly delegated domain, or a subdomain of either. No client-specific domain is hardcoded in validation, and undeclared foreign domains are still rejected exactly as before.
- `src/config/cadre.ts` delegates the exact observed host `https://portal.gocadre.ai`, points the `track-ai-results` highlight and the `maturity-index` entry's approved link at `https://portal.gocadre.ai/ai-maturity-index` with an honest label, and updates the `portal`/`maturity-index` facts to distinguish the public results/assessment entry point from unverified private client-login/account access (which still hands off to the official contact page). Changed facts carry `retrievedAt: "2026-09-10"`.
- `tests/config/config.test.ts`, `tests/config/knowledge-refresh.test.ts`, `tests/core/policy.test.ts`, and `tests/api/chat-route.test.ts` were updated to assert the new allowlist behavior and fact wording, including a regression that an undeclared look-alike domain (e.g. `notgocadre.ai`) is still rejected.

This repair does not itself claim a new PASS gate, deployment, or public equivalence for revision 11 — independent critic review, any needed fixer pass, independent verification, and Graph gate closure remain pending, consistent with the release boundary recorded in `docs/release-runbook.md`.

### PX6 revision 12 — extension approved-link integration repair — 2026-09-10

Revision 11 source review passed, and its detached final verifier passed Git integrity, locked install, typecheck, lint, **302/302 Vitest**, production build, and **68/68 Playwright** before failing at `node extension/build.mjs`. The optional Chrome preview build still assumed every presentation link had origin `https://cadre.ai`; the new explicitly delegated `https://portal.gocadre.ai/ai-maturity-index` link therefore caused a fail-closed `Unexpected approved link` error.

Revision 12 keeps extension activation strictly on `https://cadre.ai/*` and `https://www.cadre.ai/*`, keeps the API destination and permissions unchanged, and repairs only build-time presentation-link validation. `extension/build.mjs` now derives approved hostnames from literal `ClientConfig.officialDomain` plus optional `additionalOfficialDomains`, requires HTTPS/no credentials/no custom port for rendered links, and preserves exact-host/subdomain matching. `extension/tests/build.test.ts` adds an explicit regression that the delegated Maturity link is present while content-script matches remain the two exact Cadre site origins.

Claude Code 2.1.266 produced the first bounded Fixer draft without running tests. Coordinator review caught a representation bug in that draft: it compared `url.hostname` values against unparsed full domain URLs, which would still have rejected valid links. The accepted source normalizes configured domain URLs to hostnames before matching. Revision 12 subsequently passed independent source review and the fresh detached final verifier: 302/302 Vitest, production build, 68/68 Playwright, extension build, 73/73 extension tests, 24/24 synthetic extension browser, and Graph validation. Existing-project Vercel production pull + prebuild also passed with zero tracked drift. The three r12 local gates are PASS. That separate post-DONE public equivalence step has now also passed on exact runtime source `8043886`, with the rate-aware complete 68/68 external matrix retained alongside the two monolithic 67/68 rate-limit attempts.
