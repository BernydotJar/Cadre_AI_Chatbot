# Resumable checkpoint — Cadre AI Chatbot

Updated: 2026-09-09 UTC. This is a projection; the append-only Graph Harness ledgers are authoritative.

## Terminal state for this session

**PARTIAL_WITH_DOCUMENTED_BLOCKERS — external release delivery only.** The current local product increment is verified, G9 Chrome and G11 n8n are DONE at their declared optional scopes, and the audit/handoff documentation has been reconciled. N6 `release-check` remains BLOCKED because the known public Vercel alias is demonstrably running the older UI/behavior. G10 is also blocked at deploy-check because the audited Git publication channel currently lacks its platform-managed credential and the connected Vercel integration cannot bind the existing project.

Public alias: `https://cadre-ai-chatbot-tawny.vercel.app`.

Product, contextual extension, CI/CD, n8n and documentation increments are split into bounded commits. Existing Git author/committer history is retained as recorded and is not used as proof that a particular human or coding tool executed a change. This checkpoint intentionally does not embed a self-referential current HEAD; reproduce it with `git rev-parse HEAD`. Main graph sequence remains **149**. Extension graph sequence is **34**, last event `9db84544-4f7c-42fa-9605-e3f1983740d6`. CI/CD graph sequence is **14**, last event `ad80d350-31bd-422a-be23-2c644e837d15`. n8n graph sequence is **12**, last event `a35c57ad-30b4-4fd7-aeec-ce11084d239c`.

## Main graph

- N1 foundation: **done**.
- N2 knowledge/routing: **done** after 2026-09-09 exact-greeting + public-source repair. `verification=PASS`, `code-review=PASS`.
- N3 chat API/provider: **done**; production default remains `openai/gpt-4.1-mini`.
- N4 UI/UX: **done** after Cadre Signal polish, authored icon and first-impression regressions. `verification=PASS`, `code-review=PASS`.
- N5 early deployment: **done** for the previously authorized deployed line only.
- N6 verification/release: **blocked**. `verification=PASS`, `code-review=PASS`, `release-check=BLOCKED` because deployed source is stale.

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

## Final local verification

Core final verification after all code repairs:

- ESLint: PASS.
- strict TypeScript: PASS.
- Vitest: **11 files / 256 tests PASS**.
- production Next.js build: PASS; `/icon.svg` emitted.
- Playwright: **50/50 PASS** desktop/mobile, including hydration and 320x568 / 360x640 text-spacing/readability cases.
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

Anonymous checks against `https://cadre-ai-chatbot-tawny.vercel.app` on 2026-09-09 show:

- `/api/health` is healthy;
- the public HTML still contains **`A little clarity`** and **`YOUR NEXT STEP STARTS HERE`** rather than the Cadre Signal hero;
- exact `hello` still returns the old `kind:"redirect"` unsupported-information response.

Therefore the alias is healthy but **not release-equivalent** to the reviewed worktree. See `evidence/N6-release/public-drift-after-polish-20260909.md`.

Deployment mechanisms checked:

- Connected Vercel team `Cadre_AI` / `cadre-ai3` is visible, but the integration currently returns **zero projects**.
- The exposed `deploy_to_vercel` call failed before deployment because the connector runtime required hidden `target`, `name`, and `files` inputs that its callable schema does not expose.
- Sandbox Vercel CLI 59.12.0 remains `Logged out`; no project binding or connector credential is injected into this workspace.

No anonymous/temporary deployment was substituted because it would not establish equivalence with the authorized production project or its live environment.

## CI/CD workstream

Separate graph `progress/cicd-graph.*`: **G10 BLOCKED only at deploy-check**. `verification=PASS`, `code-review=PASS`, `deploy-check=BLOCKED`.

- `.github/workflows/ci.yml`: secret-free PR/main checks for locked install, lint, strict types, tests, build, Playwright, extension build/tests and synthetic browser proof.
- `.github/workflows/deploy-production.yml`: exact-SHA production delivery after successful main CI or manual dispatch, GitHub `production` environment, required existing Vercel org/project/token, `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`, then health/favicon/hero/hello assertions.
- Local workflow/YAML/release-marker verification PASS; Granite CI/CD critic PASS.
- Actual deploy remains blocked because the connected Vercel team exposes zero projects, direct project/alias lookup fails, the direct-deploy connector schema is unusable here, and sandbox CLI is logged out.

## Parallel n8n workstream

Separate graph `progress/n8n-graph.*`: **G11 DONE** with `verification=PASS`, `code-review=PASS`, `integration-proof=PASS`. An isolated second workspace was used so n8n work could not destabilize the candidate repo. No existing n8n runtime was found. Docker image extraction failed in the nested sandbox, so the workstream installed n8n **2.38.1** under a private Node **24.9.0** runtime with persistent SQLite data. `/healthz` is PASS. A `Cadre AI Concierge — Human Handoff` workflow was imported and published with `POST /webhook/cadre-handoff`, consent/email/source validation, typed route keys, structured notification payload and controlled 202/400 responses. Live local contract probes passed for qualified lead, client support, missing consent, and invalid email. No real recipient or credential is embedded; email-provider delivery is deliberately not claimed yet.

## Model/cost state

Production default remains `openai/gpt-4.1-mini`; the optional Gemini 3.8 Flash comparison remains NOT RUN because the chatbot-only OpenRouter credential is unavailable in this sandbox. This does not block the completed product repair or extension gate.

Retained observed cost ledger before this increment: user-reported coding spend $7.00; OpenRouter cumulative provider usage $0.001842 at the last metadata read; local Granite has no external inference charge observed. Provider accounting may lag.


## Source publication blocker

Local `main` remains ahead of `origin/main` with no known remote-only commits from the last fetch. Reproduce the exact distance with `git rev-list --left-right --count origin/main...HEAD`. The dedicated audited repository-publication action was retried after documentation commit `91ad8cb` and again returned `GITHUB_TOKEN is required for git_push`; no shell credential workaround was used. Consequently the new GitHub Actions workflows are versioned and locally verified but are **not active on GitHub yet**. This is an account/tool credential blocker, not additional application development.

## Exact resume path

1. Use the dedicated audited Git publication action again; if its platform-managed credential is available, fast-forward `main` so the CI/CD workflows exist on GitHub. If the credential is still absent, retain the blocker and do not bypass it.
2. Restore visibility/access to the existing Vercel `cadre-ai-chatbot` project and provision `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` in the GitHub `production` environment; do not create a replacement project merely to make the gate green.
3. Reopen G10/N6 only through supported graph transitions and deploy the exact reviewed SHA through the gated workflow or an equivalent authorized project binding.
4. Repeat anonymous `/`, `/api/health`, exact `hello`, favicon/hero markers, and the 50-case browser/readability matrix against that deployment; run one bounded live-provider round trip only if the chatbot allowance is available.
5. Clear G10 `deploy-check` and N6 `release-check`, transition them to done, update projections, then build and verify a **final** source ZIP from the exact closure commit.
6. If the optional n8n handoff is promoted into the demo, add the `HumanHandoffProvider` application boundary and an approved email provider/recipient; require user consent and successful n8n acknowledgement before claiming a handoff occurred.
7. Recruiting upload/email and Web Store publication remain separate actions unless explicitly authorized.
