# Cadre AI Chatbot

A grounded support assistant for [Cadre AI](https://cadre.ai), covering services and industry fit, strategist contact, portal access guidance, the AI Maturity Index, model/security questions and honest escalation.

**The chatbot is a reusable Knowledge → Persona → Experience runtime with a verified released PX5 baseline and an active PX6 cinematic/proactive increment.** Cadre composes the English persona **Donna**: deterministic client policy owns facts, links, pricing/account boundaries and reviewed public highlights; Donna may add one configured grounded diagnostic question plus short tone-only boundary empathy without gaining factual authority. The generic shell derives website copy, avatar, quick prompts, theme and composer presentation from `ExperienceProfile`, while a fictional Acme/Scout fixture exercises the same shell without Cadre/Donna presentation literals.

The last released premium baseline remains source `8ae8a3a1b0e53100218930aa893eed90a8592562` on the existing [public chatbot](https://cadre-ai-chatbot-tawny.vercel.app), where anonymous smoke and **58/58** Playwright passed. **PX6 is currently RUNNING and does not inherit that PASS.** Its producer source moves the public surface to a Cadre-native website-first experience with verified outcome/results highlights, a floating `signal-orb` Donna launcher, bounded high-value prompts, `Shaping…` request feedback, empathetic pricing/unknown handoffs, a public `How Donna works` trust section, and a simplified favicon. Product verification is intentionally deferred until the independent critic/fixer assembly is complete; current PX6 status belongs in `progress/checkpoint-premium.md` and the append-only premium Graph ledger. Automated GitHub production CD remains separately blocked only because the GitHub `production` environment lacks the existing Vercel org/project/token binding.

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

Pipeline: active allowlisted product → bounded input → deterministic topic/boundary routing → approved context → mock or server-side model adapter → deterministic fact/link assembly → optional one-question persona guidance / tone-only boundary lead → safe text/link UI. The website shell separately renders only reviewed client-owned `publicHighlights`. The model prioritizes fact indices rather than generating arbitrary business assertions, and Donna's question is application-owned rather than generated. This is **constrained, extractive model-assisted answering**, not vector RAG, GraphRAG or open-ended company expertise.

See the [component inventory](docs/component-inventory.md) for contracts, configuration, invariants, provenance, test coverage and maturity of each module.

Unknown pricing, certifications and private account questions receive deterministic boundary handling and an official contact link. Pricing may acknowledge verified business-outcome framing but never invent a rate. The bot cannot create bookings, access a portal, run an assessment or issue a maturity score. `ClientConfig` owns facts/links/boundaries/public highlights; `PersonaProfile` owns bounded behavior/tone; `ExperienceProfile` owns presentation and quick prompts. The fictional Acme/Scout fixture proves profile/shell reuse at test level, not production multi-tenancy.

## Interface and verification

PX6's responsive surface is website-first: a Cadre-style cinematic editorial hero, verified business-outcome/results sections, a profile-driven floating Donna launcher with an original `signal-orb`, four high-value prompts, a `Shaping…` in-flight state, and a bounded chat panel around the same “What are you trying to figure out?” composer. The conversation still preserves deterministic greeting/boundary paths, six verified topics, multi-turn context, cancellation, saved-draft retry, reset, bounded history and exact approved links. Chat controls remain disabled until the client is ready; a no-JavaScript visitor receives guidance and an official contact link. No conversation is stored by this app after refresh; live messages are processed by external services, and provider retention is not claimed to be zero.

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

Vercel production access is bound to the existing `Cadre_AI / cadre-ai3` project `cadre-ai-chatbot`; no replacement project was created. Repaired premium source `8ae8a3a1b0e53100218930aa893eed90a8592562` passed GitHub CI run `34405396973` and was promoted manually through the existing project to deployment `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7`. Anonymous smoke + **58/58** public Playwright pass there. GitHub automated production run `34405608879` failed safely at its existing-project binding preflight because the `production` environment still lacks the Vercel org/project/token binding. The workflow also runs `npm run release:gate`, which now honors post-DONE Graph invalidation as well as ordinary node/gate state. External submission remains a separate explicit action.

The optional [Chrome integration preview](extension/README.md) is **DONE in its separate Graph Harness ledger** with security-review, independent-verification and integration-proof PASS. It remains a local integration adapter—not a Cadre-installed/endorsed feature—and nothing was published to the Chrome Web Store. Its latest repaired disposable-profile proof is under `extension/evidence/px4-fix-actual-site-20260909/`: the adapter recognizes only approved pathname/hash context, and `/agents#discover-agents` gets contextual local copy plus a fixed grounded question without scraping Cadre page content.


The optional [n8n handoff prototype](integrations/n8n/README.md) is also **DONE at contract level** in its own graph: an isolated n8n 2.38.1 runtime, consent/email/source validation, typed route keys, controlled webhook responses and local live contract probes all pass. It is intentionally not wired to a real Cadre mailbox yet, so the product never claims an email was sent.

## Delivery

The final source ZIP will include usable `.git` history and exclude `.env.local`, `.codex`, dependencies, generated build output, caches and private inputs. A clean-room pre-closure package check now passes; rebuild the handoff ZIP once more from the final closure commit so the archive contains the final premium/release projection. See [delivery instructions](docs/delivery.md) and the package evidence under `evidence/N6-release/`. A post-packaging checksum necessarily sits outside the exact source snapshot; no circular self-hash is claimed. Preparation is not external submission approval.

- [Productization architecture](docs/productization-architecture.md)
- [Documentation map](docs/README.md)
- [Architecture overview + diagrams](docs/architecture-overview.md)
- [Cinematic + proactive experience](docs/cinematic-proactive-experience.md)
- [Developer handoff](docs/developer-handoff.md)
- [Release runbook](docs/release-runbook.md)
- [Canonical specifications](specs/001-support-chatbot/)
- [Requirements recheck](docs/delivery-requirements-recheck.md)
- [UI research](docs/chatbot-ux-assessment.md)
- [Current source audit](docs/knowledge-source-audit.md)
