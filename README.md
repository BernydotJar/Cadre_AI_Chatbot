# Cadre AI Chatbot

A grounded support assistant for [Cadre AI](https://cadre.ai), covering services and industry fit, strategist contact, portal access guidance, the AI Maturity Index, model/security questions and honest escalation.

**Deployed and live-tested; final closure pending.** The [public chatbot](https://cadre-ai-chatbot-tawny.vercel.app) serves the reviewed interface and refreshed knowledge. The cold-first-message repair passed 233 tests, typecheck, lint, build, an independent 42-case local browser suite and four extra cold-load probes. On the repaired public deployment, 38 intercepted browser cases and one separately authorized real conversation passed. The earlier 30-check public/API matrix remains historical evidence for unchanged knowledge/API behavior. Clean source-archive verification and human closure are tracked separately in [the checkpoint](progress/checkpoint.md).

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

The response is `{ "reply": "...", "kind": "grounded|clarify|redirect|decline|error" }`. POST /api/chat is non-cacheable. GET /api/health reports app availability, not provider health.

For authorized live use, configure the server variables named in [.env.example](.env.example), including explicit mode, approved model and expiry. Never overwrite an existing secret file, expose a NEXT_PUBLIC_ credential or place a key in source. Invalid or expired live configuration fails closed; it never silently becomes a mock. Budget and deadline: [provider decision](progress/provider-decision.md).

## Where answers come from

The versioned knowledge store is [src/config/cadre.ts](src/config/cadre.ts), validated by [src/config/types.ts](src/config/types.ts). It separates client facts, routing vocabulary, approved URLs and boundaries from application logic. The [official-source audit](docs/knowledge-source-audit.md) maps every topic to pages, dates and unresolved questions. Research recommendations are not automatically shipped facts.

Pipeline: bounded input → deterministic topic/boundary routing → approved context → mock or server-side model adapter → deterministic fact/link assembly → safe text-only UI. The model prioritizes fact indices rather than generating arbitrary business assertions. This is **constrained, extractive model-assisted answering**, not vector RAG or open-ended company expertise.

See the [component inventory](docs/component-inventory.md) for contracts, configuration, invariants, provenance, test coverage and maturity of each module.

Unknown pricing, certifications and private account questions receive a boundary and official contact link. The bot cannot create bookings, access a portal, run an assessment or issue a maturity score. The second client fixture proves configuration separation at unit level, not production multi-tenancy.

## Interface and verification

Responsive web chat includes six starting topics, multi-turn context, visible loading, cancellation, saved-draft retry, reset, bounded history and exact approved links. Chat controls remain disabled until the client is ready; a no-JavaScript visitor receives guidance and an official contact link. No conversation is stored by this app after refresh; live messages are processed by external services, and provider retention is not claimed to be zero.

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

Vercel deployment is authorized in Cadre_AI / cadre-ai3. [Deployment notes](docs/deploy.md) distinguish the currently deployed snapshot from local changes. No Git push, paid add-on, source publication or final submission is implied.

The optional [Chrome integration preview](docs/extension-preview-design.md) is being implemented and reviewed under its own graph. Its source/build/mock scope is authorized; installation and actual-site behavior are not established by those tests. It remains a local adapter and cannot delay the mandatory public app.

## Delivery

The source ZIP includes usable .git history and excludes .env.local, .codex, dependencies, generated build output, caches and private inputs. It is prepared from an explicit committed snapshot and checked after clean extraction. See [delivery instructions](docs/delivery.md) and the verification receipt supplied alongside the actual ZIP for its snapshot, checksum and observed results. That post-packaging receipt necessarily comes after the source snapshot; no circular self-hash is claimed. Preparation is not submission or human release approval.

- [Canonical specifications](specs/001-support-chatbot/)
- [Requirements recheck](docs/delivery-requirements-recheck.md)
- [UI research](docs/chatbot-ux-assessment.md)
- [Current source audit](docs/knowledge-source-audit.md)
