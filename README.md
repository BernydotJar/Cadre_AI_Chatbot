# Cadre AI Chatbot

A grounded support assistant for [Cadre AI](https://cadre.ai), covering services and industry fit, strategist contact, portal access guidance, the AI Maturity Index, model/security questions and honest escalation.

**Core product release verification is complete.** The reviewed chatbot fixes the first-turn `hello` experience, adds an authored app icon and an original Cadre Signal visual system, and passes lint, strict typecheck, production build, **256/256 unit/integration tests** and **50/50 Playwright desktop/mobile cases**. The optional Manifest V3 Integration Preview is also locally verified: **72 extension tests**, **23 synthetic-browser checks** and a **17-check** disposable Chromium run on `cadre.ai/agents#discover-agents` all pass. The [public chatbot](https://cadre-ai-chatbot-tawny.vercel.app) now serves the reviewed interface: health/hero/favicon/greeting checks pass, the full public Playwright matrix passes **50/50**, and a bounded grounded live smoke passes. Exact state and remaining CI publication blocker: [checkpoint](progress/checkpoint.md).

## Run locally

Use the Node engine declared in package.json; local verification uses Node 26.5.0. Vercel is configured for Node 24.x.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run start
```

Open http://127.0.0.1:3100. Default mode is **mock**: no provider key or inference charge. If an existing environment explicitly enables live mode, set CHAT_PROVIDER=mock for local checks. The UI labels its actual configured mode.

```sh
curl http://127.0.0.1:3100/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"What services does Cadre offer?"}]}'
```

The response is `{ "reply": "...", "kind": "greeting|grounded|clarify|redirect|decline|error" }`. POST /api/chat is non-cacheable. GET /api/health reports app availability, not provider health.

For authorized live use, configure the server variables named in [.env.example](.env.example), including explicit mode, approved model and expiry. Never overwrite an existing secret file, expose a NEXT_PUBLIC_ credential or place a key in source. Invalid or expired live configuration fails closed; it never silently becomes a mock. Budget and deadline: [provider decision](progress/provider-decision.md).

## Where answers come from

The versioned knowledge store is [src/config/cadre.ts](src/config/cadre.ts), validated by [src/config/types.ts](src/config/types.ts). It separates client facts, routing vocabulary, approved URLs and boundaries from application logic. The [official-source audit](docs/knowledge-source-audit.md) maps every topic to pages, dates and unresolved questions; the dated 2026-09-09 [public-source inventory](docs/research/cadre-public-sources-20260909.json) records the latest official pages inspected. Research notes are not automatically shipped facts.

Pipeline: bounded input → deterministic topic/boundary routing → approved context → mock or server-side model adapter → deterministic fact/link assembly → safe text-only UI. The model prioritizes fact indices rather than generating arbitrary business assertions. This is **constrained, extractive model-assisted answering**, not vector RAG or open-ended company expertise.

See the [component inventory](docs/component-inventory.md) for contracts, configuration, invariants, provenance, test coverage and maturity of each module.

Unknown pricing, certifications and private account questions receive a boundary and official contact link. The bot cannot create bookings, access a portal, run an assessment or issue a maturity score. The second client fixture proves configuration separation at unit level, not production multi-tenancy.

## Interface and verification

Responsive web chat includes an original Cadre Signal visual system, authored favicon/app icon, a useful deterministic greeting path, six starting topics, multi-turn context, visible loading, cancellation, saved-draft retry, reset, bounded history and exact approved links. Chat controls remain disabled until the client is ready; a no-JavaScript visitor receives guidance and an official contact link. No conversation is stored by this app after refresh; live messages are processed by external services, and provider retention is not claimed to be zero.

```sh
npm run verify -- unique-run-label
npm exec -- playwright install chromium --only-shell
npm run test:e2e
```

Build before E2E. The default Playwright configuration owns a mock production server on port 3100; do not start another server there simultaneously. An explicit E2E_BASE_URL targets an existing server and some tests make real API calls, so a live target requires budget-aware authorization.

Sanitized command outputs live under evidence/runs/. Original failures and repairs remain under evidence/N4-ui/. Unit/mock, browser, live-local, public deployment and archive verification are separate claims.

## Engineering and scope

[CLAUDE.md](CLAUDE.md) is the concise onboarding contract: stack, boundaries, knowledge editing, security, commands and context recovery. [plan.md](plan.md) indexes decisions. Approved specs define scope; the frozen graph and append-only events record actual execution.

Graph Engineering uses real producer, critic, fixer and independent-verifier roles with hashed evidence and gated closure. The pinned external runtime, provenance, commands and actual role examples are documented in [engineering workflow](docs/engineering-workflow.md). A role label or committed command definition alone is not execution evidence.

No auth, database, CRM, analytics, persistent chat history, vector database, real booking or assessment integration. Serverless admission and budget reservations are process-local and cannot guarantee distributed abuse protection. The provider's key limit is the hard spending ceiling; anonymous users can consume the shared allowance.

Vercel production access was restored through owner-interactive CLI authentication and bound to the existing `Cadre_AI / cadre-ai3` project `cadre-ai-chatbot`; no replacement project was created. The reviewed prebuilt artifact was promoted to the existing production alias and independently reverified. [Release evidence](evidence/N6-release/public-release-equivalence-20260909.md) records the deployment and public checks. GitHub CI/CD is also versioned: CI is secret-free, while production CD requires the existing Vercel org/project/token through the GitHub `production` environment. The local branch remains ahead of `origin/main`, and the audited publication action still lacks its injected GitHub token, so those workflows are not active remotely yet. No source publication or recruiting submission is implied.

The optional [Chrome integration preview](extension/README.md) is **DONE in its separate Graph Harness ledger** with security-review, independent-verification and integration-proof PASS. It remains a local candidate adapter—not a Cadre-installed/endorsed feature—and nothing was published to the Chrome Web Store. Its latest disposable-profile proof is under `extension/evidence/actual-agents-context-20260909/`: the adapter recognizes only approved pathname/hash context, and `/agents#discover-agents` gets contextual local copy plus a fixed grounded question without scraping Cadre page content.


The optional [n8n handoff prototype](integrations/n8n/README.md) is also **DONE at contract level** in its own graph: an isolated n8n 2.38.1 runtime, consent/email/source validation, typed route keys, controlled webhook responses and local live contract probes all pass. It is intentionally not wired to a real Cadre mailbox yet, so the product never claims an email was sent.

## Delivery

The final source ZIP will include usable `.git` history and exclude `.env.local`, `.codex`, dependencies, generated build output, caches and private inputs. A clean-room pre-closure package check now passes; rebuild the handoff ZIP once more from the final closure commit so the archive contains the final N6 projection. See [delivery instructions](docs/delivery.md) and the package evidence under `evidence/N6-release/`. A post-packaging checksum necessarily sits outside the exact source snapshot; no circular self-hash is claimed. Preparation is not submission or recruiting upload approval.

- [Documentation map](docs/README.md)
- [Architecture overview + diagrams](docs/architecture-overview.md)
- [Developer handoff](docs/developer-handoff.md)
- [Release runbook](docs/release-runbook.md)
- [Canonical specifications](specs/001-support-chatbot/)
- [Requirements recheck](docs/delivery-requirements-recheck.md)
- [UI research](docs/chatbot-ux-assessment.md)
- [Current source audit](docs/knowledge-source-audit.md)
