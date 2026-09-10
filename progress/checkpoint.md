# Resumable checkpoint — Cadre AI Chatbot

Updated: 2026-09-10 UTC. This is a projection; the append-only Graph Harness ledgers are authoritative.

## Terminal state for this session

**CURRENT GRAPH STATE: PX6 REVISION 10 / REVIEW.** Revision 7 passed independent source review, then its detached clean verifier passed Git integrity, locked install, typecheck, lint, 301/301 Vitest, and production build before Playwright finished **61/68 PASS**. Revision 8 mapped the seven retained browser failures: four 320/360px text-spacing cases where the floating sheet collapsed the conversation region to 0, one mobile 15px composer regression, and two mobile requests that hit the shared local E2E rate-limit bucket after desktop. The revision-8 source critic then found one additional pre-send nested-scroll risk at <=430px; revision 9 scoped outer sheet scrolling to started conversations and added an explicit welcome-state regression. Its clean verifier improved to 66/68; only the 320x568 welcome topic remained partially visible at 73.9% because text-spacing left a 34px transcript viewport for a 46px row. Revision 10 expands only very short compact sheets to nearly full viewport height. No PX6 verification, integration-proof, deployment, or release PASS is claimed. The exact next action is the fresh detached clean verifier for revision 10; no runtime PASS is claimed until that matrix is green.

The paragraph below is the retained revision-7 pre-verifier snapshot and is superseded by the current Graph state above; it remains until PX6 verification closes so the failed stage is not rewritten out of the resumable history.

**PX6 REVISION 7 RUNNING — PX5 PUBLIC BASELINE REMAINS GREEN; AUTOMATED CD BLOCKED.** The last released premium baseline remains PX5 revision 4: source `8ae8a3a1b0e53100218930aa893eed90a8592562` passed CI, existing-project deployment, and anonymous 58/58 Playwright. PX6 producer work is complete enough for final review/verification and remains unreleased. Revision 4's full clean verifier reached Playwright after typecheck, lint, 301/301 Vitest, and production build passed, then exposed browser regressions. Revision 5 source `9b3bbd0` repaired those browser issues; the two disputed runtime concerns — ambient-media pause/play reachability and 320/360/760 motion-control/headline separation — were subsequently reproduced **4/4 PASS** in desktop/mobile at final-stage focused verification. Revision 6 (`dfa2952` source repair; `085db5e` review handoff) added the explicit compact-mobile helper assertion. The independent revision-6 Claude source critic found no new product/security defect; it requested release-hygiene repair only: refresh this checkpoint, document the intentional `<=430px` icon-only launcher contract in CSS/docs, and make the retained revision-5 Claude review provenance explicit. Revision 7 repaired those three items and is now RUNNING for independent re-review. **No PX6 full verification, integration-proof, deployment, or release gate PASS is claimed yet.** The exact next action is independent source re-review, followed by the full clean-worktree verification matrix if review passes. G10 remains separately BLOCKED only for automated GitHub production delivery because that environment lacks the existing Vercel binding.

Public alias: `https://cadre-ai-chatbot-tawny.vercel.app`.

Product, contextual extension, CI/CD, n8n, productization and premium increments remain separated in their own ledgers. Existing Git author/committer history is retained as recorded and is not used as proof that a particular human or coding tool executed a change. Actual Claude Code executions are retained separately under `evidence/claude-code/`. This checkpoint intentionally does not embed a self-referential current HEAD; reproduce it with `git rev-parse HEAD`. Main graph sequence is **157**, last event `afc29093-95c1-4994-bb9f-36e7032be67a`. Extension graph sequence is **34**, last event `9db84544-4f7c-42fa-9605-e3f1983740d6`. CI/CD graph sequence is **16**, last event `baedfa77-81c8-4e2b-b1b0-62c31b810180` before the new remote CI/CD evidence is appended. n8n graph sequence is **12**, last event `a35c57ad-30b4-4fd7-aeec-ce11084d239c`. Productization graph sequence is **52**, last event `06a549a2-1108-47c5-b971-2a3faa0e24c6`; P1/P2/P3 are DONE and the public release integration evidence is attached to P3.

Premium graph sequence at this checkpoint is **197**, last event `72c79d44-17df-4fb6-ba0d-0a1864f07a7c`; `PX6-cinematic-proactive-donna` is revision **10 / review**. The r4 and r7 failure evidence, r5 focused reproduction, and r6 critic remain append-only historical evidence rather than being rewritten as PASS.

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
- Latest repaired contextual run: 24/24 synthetic browser checks PASS with zero real-site/API traffic; the original G9 23-check evidence remains historical.
- Latest owner-authorized disposable Chromium installed-site run on `https://cadre.ai/agents#discover-agents`: **17 scoped checks PASS**, exactly **one** fixed preview API request.
- The adapter recognizes only an allowlisted pathname/hash enum; it does not read page text/forms/cookies/storage. On `#discover-agents` the panel uses restrained contextual copy and one fixed grounded question.
- Evidence: `extension/evidence/actual-agents-context-20260909/`, `context-pass-20260909/`, and `granite-context-review-20260909.md`.

Two failed actual-site test attempts are retained: a whole-page overflow assertion incorrectly blamed the extension for Cadre's own 8px baseline; then Page-scope network instrumentation failed to see service-worker traffic. Both test defects were corrected before the final PASS.

## Productization — Knowledge → Persona → Experience

Separate graph `progress/productization-graph.*`: **P1/P2/P3 DONE**, with `verification=PASS`, `code-review=PASS`, `integration-proof=PASS` on every node.

- `ClientConfig` remains the only factual/link/boundary authority and now also owns reviewed `publicHighlights` used by the PX6 website shell.
- `PersonaProfile` adds Donna's English behavior without factual authority. P1's critic found free-form “one step” strings could smuggle multiple instructions/URLs; the repair narrowed them to one short validated question object.
- Donna is `maxSteps=1`: only grounded topics with configured questions can receive one optional follow-up. P2's critic found explicit “no follow-up” requests were ignored; the repair added deterministic opt-out while preserving facts/routing/provider behavior.
- `ExperienceProfile` owns visible identity, copy, theme, avatar, quick prompts and composer/page presentation. `chatExperience()` projects presentation/link/topic metadata plus explicitly reviewed `publicHighlights`; full knowledge entries, routing triggers and persona operating rules remain server-side.
- P3's critic found visible identity could drift from behavior identity; product validation now requires `experience.assistantLabel === persona.name`.
- Fictional Acme Outdoors + Scout proves second-profile projection with no Cadre/Donna presentation leakage; it is not registered in production.
- The released PX5 line used the restrained editorial monogram. The current PX6 producer intentionally moves Cadre to a profile-driven `signal-orb` with idle/shaping states and a floating launcher while Acme/Scout keeps the editorial-monogram path; PX6 has not inherited the earlier browser PASS and remains unverified until its own final matrix runs.
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
- `CLAUDE.md` aligns the implemented architecture, G9/G10/G11 boundaries, actual publication controls, port 3100, provenance rules and takeover docs. Project-scoped Claude helpers are configuration; observed Claude Code executions are retained separately under `evidence/claude-code/`.
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

Separate graph `progress/cicd-graph.*`: **G10 remains BLOCKED at deploy-check**, but the original Git publication blocker is resolved. `verification=PASS`, `code-review=PASS`, `deploy-check=BLOCKED`.

- `.github/workflows/ci.yml`: active remotely. Repaired premium revision-4 push run `34405396973` on source `8ae8a3a1b0e53100218930aa893eed90a8592562` completed SUCCESS, including quality and browser jobs.
- `.github/workflows/deploy-production.yml`: exact-SHA production delivery after successful main CI or manual dispatch. Repaired premium run `34405608879` passed source resolution, release gating and install, then stopped at `Require an existing Vercel project binding` because all three GitHub Actions values were empty; no automated Vercel pull/build/deploy step ran.
- Release safety repair adds `npm run release:gate` before dependency install/Vercel credentials. If `progress/premium-graph.*` exists, every declared premium node must be DONE and no latest gate may be FAIL/BLOCKED; PX5 revision 4 is DONE with current gates PASS, and the repaired release gate now passes only after replaying the prior post-DONE invalidation correctly; automated CD still requires the existing-project GitHub production secrets.
- Existing manual Vercel project binding and repaired premium deployment `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7` remain proven separately; anonymous product/API smoke and 58/58 public Playwright PASS. Adding GitHub production secrets remains a separate infrastructure action rather than a prerequisite for manual existing-project delivery.

## Parallel n8n workstream

Separate graph `progress/n8n-graph.*`: **G11 DONE** with `verification=PASS`, `code-review=PASS`, `integration-proof=PASS`. An isolated second workspace was used so n8n work could not destabilize the main product repository. No existing n8n runtime was found. Docker image extraction failed in the nested sandbox, so the workstream installed n8n **2.38.1** under a private Node **24.9.0** runtime with persistent SQLite data. `/healthz` is PASS. A `Cadre AI Concierge — Human Handoff` workflow was imported and published with `POST /webhook/cadre-handoff`, consent/email/source validation, typed route keys, structured notification payload and controlled 202/400 responses. Live local contract probes passed for qualified lead, client support, missing consent, and invalid email. No real recipient or credential is embedded; email-provider delivery is deliberately not claimed yet.

## Model/cost state

Production default remains `openai/gpt-4.1-mini`; a bounded live production smoke passed through the existing Vercel environment. The optional Gemini 3.8 Flash comparison remains NOT RUN because the chatbot credential is not exported into the local sandbox for that experiment. This does not block the completed core release or extension gate.

Retained observed cost ledger before this increment: user-reported coding spend $7.00; OpenRouter cumulative provider usage $0.001842 at the last metadata read; local Granite has no external inference charge observed. Provider accounting may lag.


## Source publication and remote pipeline — current evidence

The audited Git publisher is restored and remains fast-forward only; no shell-token workaround or history reconstruction was used. Repaired premium source `8ae8a3a1b0e53100218930aa893eed90a8592562` reached remote `main` through that channel, and GitHub CI run `34405396973` completed successfully. The automatically triggered production workflow run `34405608879` passed exact-source resolution, release gating, and install, then failed safely at its existing-project binding preflight because `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` were absent from the GitHub `production` environment. Manual existing-project deployment `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7` and anonymous 58/58 public verification are green; this remains only the G10 automated-deployment blocker.

## Exact resume path

1. Build and clean-room verify the final source archive from the final closure commit with `.git` included and generated/dependency/env/private artifacts excluded.
2. Keep G10 documented as an automated-CD-only blocker until the existing Vercel org/project/token binding is explicitly supplied as GitHub `production` secrets. The product/public path is already green.
3. Append the resulting remote CI/CD evidence to G10 and close its deploy-check only if the automated path succeeds.
4. Rebuild the final source ZIP from the final closure commit with `.git` included and dependencies/build output/env secrets excluded; clean-room verify install/tests/build/browser checks and record checksum.
5. External source submission, Chrome Web Store publication and real n8n email delivery remain separate actions unless explicitly authorized.
