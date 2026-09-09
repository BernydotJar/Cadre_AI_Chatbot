# Cadre AI Chatbot

A grounded support assistant for [Cadre AI](https://cadre.ai), covering services and industry fit, strategist contact, portal access guidance, the AI Maturity Index, model/security questions and honest escalation.

**The chatbot is now productized and publicly verified as a reusable Knowledge → Persona → Experience runtime.** Cadre composes the English persona **Donna**: she answers from the same verified factual authority and may add at most one application-owned diagnostic question after a grounded answer; users can explicitly ask for no follow-up. The generic shell derives identity, copy, theme, avatar and composer prompt from `ExperienceProfile`, and a fictional Acme/Scout fixture proves second-profile reuse without client-name branching. Current repaired premium-source verification is lint + strict typecheck + production build + **288/288 Vitest tests** + **58/58 Playwright desktop/mobile cases**. The [public chatbot](https://cadre-ai-chatbot-tawny.vercel.app) currently serves premium revision 3 from source `ded08392e2dfea76e4050a234165f5e7b8c4152b`: anonymous product/API smoke passes, but the first full public browser run exposed one ambient Pause/autoplay cold-load race (**57/58**). Revision 4 repairs that race and the release-gate invalidation projection; its clean detached verification is green and it is queued for exact-SHA publication/redeployment. The optional Chrome preview remains 72/72 extension tests + 24/24 repaired synthetic-browser checks + 17 scoped installed-site checks at its declared scope. Audited source publication and remote GitHub CI are active; the premium Graph is releasable again at revision 4, while automated production CD remains blocked only until the existing Vercel binding is supplied through GitHub `production` secrets.

The premium experience graph is complete again at **PX5 revision 4** after retaining the public failure and repairing forward. PX2 Donna identity, PX3 ambient media, PX3B shell refinement, PX4 contextual Donna, and PX5 release integration are DONE with required gates PASS, and `npm run release:gate` now passes locally. The current public revision-3 deployment is not treated as final-equivalent until revision 4 is published, deployed to the existing Vercel project, and the full anonymous 58-case matrix passes.

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

Pipeline: active allowlisted product → bounded input → deterministic topic/boundary routing → approved context → mock or server-side model adapter → deterministic fact/link assembly → optional one-question persona guidance → safe text-only UI. The model prioritizes fact indices rather than generating arbitrary business assertions, and Donna's question is application-owned rather than generated. This is **constrained, extractive model-assisted answering**, not vector RAG, GraphRAG or open-ended company expertise.

See the [component inventory](docs/component-inventory.md) for contracts, configuration, invariants, provenance, test coverage and maturity of each module.

Unknown pricing, certifications and private account questions receive a boundary and official contact link. The bot cannot create bookings, access a portal, run an assessment or issue a maturity score. `ClientConfig` owns facts/links/boundaries; `PersonaProfile` owns bounded behavior; `ExperienceProfile` owns presentation. The fictional Acme/Scout fixture proves profile/shell reuse at test level, not production multi-tenancy.

## Interface and verification

Responsive web chat includes a restrained editorial Donna monogram, authored favicon/app icon, an accessible cinematic ambient layer, a prominent “What are you trying to figure out?” composer, a useful deterministic greeting path, six starting topics, multi-turn context, visible loading, cancellation, saved-draft retry, reset, bounded history and exact approved links. Chat controls remain disabled until the client is ready; a no-JavaScript visitor receives guidance and an official contact link. No conversation is stored by this app after refresh; live messages are processed by external services, and provider retention is not claimed to be zero.

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

No auth, database, CRM, analytics, persistent chat history, vector database, GraphRAG, real booking or assessment integration. Serverless admission and budget reservations are process-local and cannot guarantee distributed abuse protection. The provider's key limit is the hard spending ceiling; anonymous users can consume the shared allowance.

Vercel production access is bound to the existing `Cadre_AI / cadre-ai3` project `cadre-ai-chatbot`; no replacement project was created. Premium source `ded08392e2dfea76e4050a234165f5e7b8c4152b` passed GitHub CI run `34403021494` and was promoted manually to deployment `dpl_A6CvaDHT34auCMFFoNxnmDvCXCBY`. Its marker/API smoke is green, while the retained 57/58 public browser result triggered revision 4 rather than being waived. GitHub automated production run `34403242807` failed safely at its existing-project binding preflight because the `production` environment still lacks the Vercel org/project/token binding. The workflow also runs `npm run release:gate`, which now honors post-DONE Graph invalidation as well as ordinary node/gate state. External submission remains a separate explicit action.

The optional [Chrome integration preview](extension/README.md) is **DONE in its separate Graph Harness ledger** with security-review, independent-verification and integration-proof PASS. It remains a local integration adapter—not a Cadre-installed/endorsed feature—and nothing was published to the Chrome Web Store. Its latest repaired disposable-profile proof is under `extension/evidence/px4-fix-actual-site-20260909/`: the adapter recognizes only approved pathname/hash context, and `/agents#discover-agents` gets contextual local copy plus a fixed grounded question without scraping Cadre page content.


The optional [n8n handoff prototype](integrations/n8n/README.md) is also **DONE at contract level** in its own graph: an isolated n8n 2.38.1 runtime, consent/email/source validation, typed route keys, controlled webhook responses and local live contract probes all pass. It is intentionally not wired to a real Cadre mailbox yet, so the product never claims an email was sent.

## Delivery

The final source ZIP will include usable `.git` history and exclude `.env.local`, `.codex`, dependencies, generated build output, caches and private inputs. A clean-room pre-closure package check now passes; rebuild the handoff ZIP once more from the final closure commit so the archive contains the final premium/release projection. See [delivery instructions](docs/delivery.md) and the package evidence under `evidence/N6-release/`. A post-packaging checksum necessarily sits outside the exact source snapshot; no circular self-hash is claimed. Preparation is not external submission approval.

- [Productization architecture](docs/productization-architecture.md)
- [Documentation map](docs/README.md)
- [Architecture overview + diagrams](docs/architecture-overview.md)
- [Developer handoff](docs/developer-handoff.md)
- [Release runbook](docs/release-runbook.md)
- [Canonical specifications](specs/001-support-chatbot/)
- [Requirements recheck](docs/delivery-requirements-recheck.md)
- [UI research](docs/chatbot-ux-assessment.md)
- [Current source audit](docs/knowledge-source-audit.md)
