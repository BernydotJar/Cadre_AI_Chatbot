# Resumable checkpoint — Cadre AI Chatbot

Updated: 2026-09-09 UTC. This is a projection; the append-only Graph Harness ledgers are authoritative.

## Terminal state for this session

**PRODUCTIZATION_COMPLETE_AND_PUBLICLY_VERIFIED — EXTERNAL GIT PUBLISHER BLOCKER ONLY.** Core N1–N6 remains complete. Productization P1/P2/P3 are DONE with every blocking gate PASS. Current source passes 279/279 Vitest and 52/52 local Playwright. Reviewed source `7b6004c1fa5b715b1c2775d07981ebac1eee8622` is deployed to the existing Vercel project as `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`; Donna/product/API markers and a clean external 52/52 Playwright matrix PASS on the production alias. G9 Chrome and G11 n8n remain DONE. G10 remains BLOCKED at deploy-check because the audited Git publisher still lacks its platform-managed credential.

Public alias: `https://cadre-ai-chatbot-tawny.vercel.app`.

Product, contextual extension, CI/CD, n8n and documentation increments are split into bounded commits. Existing Git author/committer history is retained as recorded and is not used as proof that a particular human or coding tool executed a change. This checkpoint intentionally does not embed a self-referential current HEAD; reproduce it with `git rev-parse HEAD`. Main graph sequence is **157**, last event `afc29093-95c1-4994-bb9f-36e7032be67a`. Extension graph sequence is **34**, last event `9db84544-4f7c-42fa-9605-e3f1983740d6`. CI/CD graph sequence is **16**, last event `baedfa77-81c8-4e2b-b1b0-62c31b810180`. n8n graph sequence is **12**, last event `a35c57ad-30b4-4fd7-aeec-ce11084d239c`. Productization graph sequence is **52**, last event `06a549a2-1108-47c5-b971-2a3faa0e24c6`; P1/P2/P3 are DONE and the public release integration evidence is attached to P3.

## Main graph

- N1 foundation: **done**.
- N2 knowledge/routing: **done** after 2026-09-09 exact-greeting + public-source repair. `verification=PASS`, `code-review=PASS`.
- N3 chat API/provider: **done**; production default remains `openai/gpt-4.1-mini`.
- N4 UI/UX: **done** after Cadre Signal polish, authored icon and first-impression regressions. `verification=PASS`, `code-review=PASS`.
- N5 early deployment: **done** for the previously authorized deployed line only.
- N6 verification/release: **done**. `verification=PASS`, `code-review=PASS`, `release-check=PASS`; production equivalence, public Playwright 50/50, bounded live grounding, and clean-room package verification are retained as evidence.

Pinned external Graph Harness runtime: `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`. Main baseline remains frozen and the event ledger append-only.

## What changed in the 2026-09-09 polish increment

### First interaction / knowledge

- Exact whole-message greetings (`hello`, `hi`, `hey`, daypart greetings, `hola`) now return a concise deterministic welcome rather than unsupported handoff.
- Pricing/account/private boundaries still execute first; a greeting prefix cannot bypass policy.
- Greeting uses no provider call and emits no arbitrary link.
- Official Cadre research inventory is retained at `docs/research/cadre-public-sources-20260909.json`; runtime authority remains reviewed typed `src/config/cadre.ts`.
- One attributed About-page claim was promoted: Cadre states 100+ high-ROI use cases across 50+ companies.

### Web product

- Original **Cadre Signal** red/ink/cream visual system and animated concentric signal/orbits.
- Authored `app/icon.svg`; production build emits `/icon.svg`.
- Richer hero, chat header, message bubbles, topic cards, pending state and composer while preserving the six approved starts and trust boundaries.
- Reduced-motion support and existing small-screen/readability contracts preserved.

### Chrome Integration Preview

Separate graph `progress/extension-graph.*`: **G9 DONE** with `security-review=PASS`, `independent-verification=PASS`, `integration-proof=PASS`.

- 72/72 extension unit/security/build tests PASS.
- 23/23 synthetic browser checks PASS with zero real-site/API traffic.
- Latest owner-authorized disposable Chromium installed-site run on `https://cadre.ai/agents#discover-agents`: **17 scoped checks PASS**, exactly **one** fixed candidate API request.
- The adapter recognizes only an allowlisted pathname/hash enum; it does not read page text/forms/cookies/storage. On `#discover-agents` the panel uses restrained contextual copy and one fixed grounded question.
- Evidence: `extension/evidence/actual-agents-context-20260909/`, `context-pass-20260909/`, and `granite-context-review-20260909.md`.

Two failed actual-site test attempts are retained: a whole-page overflow assertion incorrectly blamed the extension for Cadre's own 8px baseline; then Page-scope network instrumentation failed to see service-worker traffic. Both test defects were corrected before the final PASS.

## Productization — Knowledge → Persona → Experience

Separate graph `progress/productization-graph.*`: **P1/P2/P3 DONE**, with `verification=PASS`, `code-review=PASS`, `integration-proof=PASS` on every node.

- `ClientConfig` remains the only factual/link/boundary authority.
- `PersonaProfile` adds Donna's English behavior without factual authority. P1's critic found free-form “one step” strings could smuggle multiple instructions/URLs; the repair narrowed them to one short validated question object.
- Donna is `maxSteps=1`: only grounded topics with configured questions can receive one optional follow-up. P2's critic found explicit “no follow-up” requests were ignored; the repair added deterministic opt-out while preserving facts/routing/provider behavior.
- `ExperienceProfile` owns visible identity, copy, theme, avatar and composer presentation. `chatExperience()` projects only presentation/link/topic metadata to the browser.
- P3's critic found visible identity could drift from behavior identity; product validation now requires `experience.assistantLabel === persona.name`.
- Fictional Acme Outdoors + Scout proves second-profile projection with no Cadre/Donna presentation leakage; it is not registered in production.
- Donna UI uses an original orbital-monogram AI-guide avatar and the initial writing prompt `What are you trying to figure out?`. Deterministic desktop/mobile probes recorded no horizontal overflow and a 78px initial composer. Evidence: `evidence/productization/`.
- GraphRAG/vector retrieval remain intentionally out of scope: current corpus is small/curated and deterministic routing has no observed relationship-heavy retrieval failure.

## Final local verification

Core final verification after all code repairs:

- ESLint: PASS.
- strict TypeScript: PASS.
- Vitest: **14 files / 279 tests PASS** on the productized line.
- production Next.js build: PASS; `/icon.svg` emitted.
- Playwright: **52/52 PASS** desktop/mobile on the productized line, including hydration, Donna/profile assertions and 320x568 / 360x640 text-spacing/readability cases.
- N2 focused routing/config/API/UI verification: **146/146 PASS**.
- IBM Granite 3.3 2B bounded N2 policy critic: **VERDICT: PASS**.
- IBM Granite 3.3 2B bounded final product critic: **VERDICT: PASS**.

During the first polish Playwright pass, three useful failures were retained and repaired: stale `.next` made the icon check false-negative; smooth transcript scrolling broke the synchronous Jump-to-latest contract; and the mobile first-impression test targeted the intentionally hidden desktop hero signal. The corrected regression subset passed 4/4 before the full 50/50 suite.

Final local screenshots: `evidence/N4-ui/final-polish-desktop-20260909.png`, `final-polish-mobile-20260909.png`, and `final-polish-greeting-20260909.png`.

## Documentation / handoff reconciliation

The audit-facing documentation now separates durable design from mutable execution state:

- `plan.md` uses a current decision register and identifies only external release delivery as blocking.
- `CLAUDE.md` aligns the implemented architecture, G9/G10/G11 boundaries, actual publication controls, port 3100, provenance rules and takeover docs. Project-scoped Claude helpers are still configuration only unless an actual Claude run is observed.
- `docs/architecture-overview.md` adds system/request/trust-boundary diagrams and brief explanations of bounded inference, fail-closed behavior, adapters, event sourcing, exact-SHA release and process-local controls.
- `docs/developer-handoff.md` gives a mid-level developer a read order, repository map, change recipes, debugging ladder, advanced-concept notes and Definition of Done.
- `docs/release-runbook.md` gives the exact GitHub/Vercel/public-verification/Graph/ZIP closure sequence.
- `docs/README.md` is the documentation navigation/audit reading order.
- The original spec status headers are retained as historical pre-approval text with explicit current-state notes instead of being silently rewritten.

Deterministic documentation audit passed before commit: 26 audit-facing Markdown files, six Mermaid blocks, zero missing local links/unbalanced fences, and all four Graph ledgers validated. The reconciled audit/handoff set was committed as `91ad8cb` (`docs: add architecture and developer handoff`). Two local Granite documentation-critic attempts timed out before returning a verdict; that is retained as an infrastructure limitation and **no Granite PASS is claimed for this documentation increment**. Evidence: `evidence/documentation/`.

## Deployment blocker — current evidence

## Production release — current evidence

Owner-interactive Vercel CLI authentication restored access to the existing `Cadre_AI / cadre-ai3` project `cadre-ai-chatbot` (`prj_n1nwQI54mbIplgaExeVkeNC8hrv2`). No replacement project was created.

The first prebuilt attempt exposed a bounded transport defect: Next file tracing referenced tracked `.env.example` while `.vercelignore` denied all `.env*`. The fix allows only root `.env.example`; real environment files remain excluded. The rebuilt artifact then deployed successfully as `dpl_ExDWE91vPxtEmLaDG6UBCCTamGLM` and Vercel aliased it to `https://cadre-ai-chatbot-tawny.vercel.app`.

Anonymous/public productized release verification after promotion:

- `/api/health`: PASS;
- `Donna | Cadre AI`, `cadre-donna`, visible Donna identity and configured composer prompt: PASS;
- `/icon.svg`: PASS;
- exact `hello`: `kind=greeting` PASS;
- direct grounded Donna question / explicit no-follow-up / pricing-boundary probes: PASS;
- clean public Playwright: **52/52 PASS**;
- deployment identity: `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`, source `7b6004c1fa5b715b1c2775d07981ebac1eee8622`.

Evidence: `evidence/productization/public-release-20260909.md`. N6 remains DONE; the productization graph carries separate post-DONE public integration evidence. Historical core/stale-deployment evidence remains retained rather than overwritten.

## CI/CD workstream

Separate graph `progress/cicd-graph.*`: **G10 BLOCKED only at deploy-check**. `verification=PASS`, `code-review=PASS`, `deploy-check=BLOCKED`.

- `.github/workflows/ci.yml`: secret-free PR/main checks for locked install, lint, strict types, tests, build, Playwright, extension build/tests and synthetic browser proof.
- `.github/workflows/deploy-production.yml`: exact-SHA production delivery after successful main CI or manual dispatch, GitHub `production` environment, required existing Vercel org/project/token, `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`, then health/favicon/hero/hello assertions.
- Local workflow/YAML/release-marker verification PASS; Granite CI/CD critic PASS.
- Manual owner-authorized delivery to the existing project is proven and N6 is closed. G10 remains blocked because the workflows are not yet published to GitHub; its automated production path and GitHub `production` secret binding therefore have not executed remotely.

## Parallel n8n workstream

Separate graph `progress/n8n-graph.*`: **G11 DONE** with `verification=PASS`, `code-review=PASS`, `integration-proof=PASS`. An isolated second workspace was used so n8n work could not destabilize the candidate repo. No existing n8n runtime was found. Docker image extraction failed in the nested sandbox, so the workstream installed n8n **2.38.1** under a private Node **24.9.0** runtime with persistent SQLite data. `/healthz` is PASS. A `Cadre AI Concierge — Human Handoff` workflow was imported and published with `POST /webhook/cadre-handoff`, consent/email/source validation, typed route keys, structured notification payload and controlled 202/400 responses. Live local contract probes passed for qualified lead, client support, missing consent, and invalid email. No real recipient or credential is embedded; email-provider delivery is deliberately not claimed yet.

## Model/cost state

Production default remains `openai/gpt-4.1-mini`; a bounded live production smoke passed through the existing Vercel environment. The optional Gemini 3.8 Flash comparison remains NOT RUN because the chatbot credential is not exported into the local sandbox for that experiment. This does not block the completed core release or extension gate.

Retained observed cost ledger before this increment: user-reported coding spend $7.00; OpenRouter cumulative provider usage $0.001842 at the last metadata read; local Granite has no external inference charge observed. Provider accounting may lag.


## Source publication blocker

Local `main` remains ahead of `origin/main` with no known remote-only commits from the last fetch. Reproduce the exact distance with `git rev-list --left-right --count origin/main...HEAD`. The dedicated audited repository-publication action was retried again from productized public-release closure `8972fad6d8434605699bfc31a5f2f3eeaa630d43` and returned `GITHUB_TOKEN is required for git_push`; evidence is `evidence/cicd/productized-release-publication-retry-20260909.md`, G10 sequence 16, and no shell credential workaround was used. Consequently the new GitHub Actions workflows are versioned and locally verified but are **not active on GitHub yet**. This is an account/tool credential blocker, not additional application development.

## Exact resume path

1. Retry only the dedicated audited Git publication action from the current closure HEAD. Shared/container GitHub authentication is healthy but does **not** inject the token required by that publisher. If it still returns `GITHUB_TOKEN is required for git_push`, retain G10 BLOCKED and request reconnection/authorization of the outer sandbox GitHub publisher channel; do not use shell push/token extraction/API history reconstruction.
2. Rebuild the final candidate ZIP from the final closure commit with `.git` included and dependencies/build output/env secrets excluded; clean-room verify install/tests/build and record checksum.
3. Recruiting upload/email, Chrome Web Store publication and real n8n email delivery remain separate actions unless explicitly authorized.
