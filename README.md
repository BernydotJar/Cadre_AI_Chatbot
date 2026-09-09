# Cadre AI Chatbot

A grounded customer-support chatbot for [Cadre AI](https://cadre.ai): it answers common questions from prospective and existing clients using a curated, versioned knowledge set, and redirects honestly when a question is outside its supported scope.

**Status: partial, not released.** The foundation and knowledge-routing nodes are closed. The API/provider implementation passes 200 tests and a small live local smoke run, but its independent-review gate is blocked by unavailable agent execution. The conversation UI, browser suite, public deployment and verified source ZIP remain pending. See [checkpoint](progress/checkpoint.md) and [plan](plan.md).

## Run locally

Use Node 22.12+, 24.x or 26+ as declared in `package.json`; Node 26.5.0 was verified locally. Select and verify Node 24.x for the proposed Vercel target.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run start
```

The server binds to `http://127.0.0.1:3100`. `/` is currently a scaffold, not a finished chat interface. `/api/health` checks application availability only; it does not test the provider.

Default mode is **mock**, requiring no key and making no inference calls. An API smoke request:

```sh
curl http://127.0.0.1:3100/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"What services does Cadre offer?"}]}'
```

The API returns `{ "reply": "...", "kind": "grounded|clarify|redirect|decline|error" }`. All responses are non-cacheable. The UI must render replies as text and only turn exact approved URLs into links.

For authorized live operation, create an ignored `.env.local` using the variable names in [.env.example](.env.example); never overwrite an existing secret file. Set `CHAT_PROVIDER=openrouter`, the approved key/model and operational expiry. Never use `NEXT_PUBLIC_` for a secret. Live mode fails closed on bad configuration or insufficient budget; it never silently falls back to a mock. See [provider decision](progress/provider-decision.md) for the seven-day authorization, $5 cap, reserve and model selection. The credential must not be used for coding assistance.

## Design and limitations

Configuration owns approved facts, URLs and routing vocabulary. Pure conversation logic handles input, topic selection, clarification and boundaries. A narrow server adapter asks the model to prioritize fact indices; the app retains all routed facts and app-owned links. This is intentionally **extractive model-assisted answering**, not general semantic retrieval or unconstrained generated business advice.

Unknown pricing, private accounts and unsupported topics are handled deterministically. There is no authentication, database, persistent conversation storage, real booking, CRM or assessment execution. Process-local admission and budget reservations are best-effort, reset across instances and are not distributed abuse protection. The provider's key-side limit is the hard spending ceiling. Request media type, size, history, output, timeout and retry are bounded; direct anonymous clients can still consume the shared allowance.

## Verification and delivery

`npm run verify -- unique-run-label` retains real mock-test/typecheck/lint/build output under `evidence/runs/`. [N3 evidence](evidence/N3-chat-api-adapter/coordinator-verification.md) separates coordinator verification, live local checks and the blocked independent review. The E2E script is reserved for N4; a completed browser suite is not claimed yet.

Vercel is the proposed first target; the owner supplied `cadre-ai` and reports a Pro plan. CLI authentication succeeded, but that scope does not exist for this session: the accessible team is `Cadre_AI` / `cadre-ai3`. Confirm the intended target before deployment. No cloud resources, pushes, uploads or submissions have been performed. [Hosting tradeoffs](docs/hosting-options.md) explain why Terraform does not automatically make infrastructure provider-neutral. Packaging must retain `.git` and exclude `.env.local`, `.codex`, dependencies, build output and private inputs; no ready-to-submit ZIP exists yet.

- Product plan and decision log: [plan.md](plan.md)
- Canonical specification: [specs/001-support-chatbot/](specs/001-support-chatbot/)
- Contributor and agent guide: [CLAUDE.md](CLAUDE.md)
- Real roles, context and commands: [engineering workflow](docs/engineering-workflow.md)
- Research-informed interface brief: [chatbot UX assessment](docs/chatbot-ux-assessment.md)
