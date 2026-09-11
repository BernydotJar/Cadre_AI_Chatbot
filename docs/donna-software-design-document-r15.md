# Software Design Document — Donna / Cadre AI Conversational Experience

**System:** Cadre AI Chatbot — Donna product profile  
**Release:** PX6 revision 15  
**Document version:** 1.0  
**Status:** Active — AS-BUILT engineering handoff  
**Date:** 2026-09-11  
**Repository:** `BernydotJar/Cadre_AI_Chatbot`  
**Canonical architecture:** [Donna Architecture Pack - r15](https://lucid.app/lucidchart/bd103b7c-614d-4e48-9cd0-e5ede867f924/edit)

> **Truth rule.** Unless explicitly labelled **TARGET / NOT DEPLOYED**, this document describes the frozen Donna PX6 revision-15 application and retained release evidence. Optional adapters are labelled **AS-BUILT / OPTIONAL**. This SDD does not turn a prototype, target architecture, or documented possibility into a deployed capability.

---

## 1. Document Control

| Field | Value |
| --- | --- |
| Document title | Software Design Document — Donna / Cadre AI Conversational Experience |
| Product | Cadre AI Chatbot — Donna |
| Release baseline | PX6 revision 15 |
| Status | Active |
| Version | 1.0 |
| Date | 2026-09-11 |
| Primary audience | Engineering, Product, Solution Architecture, Security/IT, technical reviewers |
| Runtime repair source | `af7e3ff91ae91fc231defe87fde0139bd1c7f298` |
| Published r15 closure | `f33461679ebbe5322a9030f1f2b17319874d7e03` |
| Existing Vercel project | `Cadre_AI / cadre-ai3 / cadre-ai-chatbot` |
| r15 deployment | `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr` |
| Production alias | `https://cadre-ai-chatbot-tawny.vercel.app` |
| Architecture pack | Lucid `bd103b7c-614d-4e48-9cd0-e5ede867f924`, seven pages |

### 1.1 Revision History

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 1.0 | 2026-09-11 | Engineering | Formal r15 SDD assembled from frozen source, retained release evidence, architecture contract, and unified Lucid master. |

### 1.2 Documentation Truth Labels

| Label | Meaning |
| --- | --- |
| **AS-BUILT / DEPLOYED** | Present in the frozen r15 public runtime and supported by source/release evidence. |
| **AS-BUILT / OPTIONAL** | Implemented/tested adapter or contract, but not part of the normal public website runtime. |
| **KNOWN GAP** | Verified limitation that remains open or intentionally accepted. |
| **TARGET / NOT DEPLOYED** | Future/reference architecture only; not running today. |
| **OPTIONAL FUTURE** | Deliberately deferred enhancement and not required for parity. |

---

## 2. Introduction

### 2.1 Purpose

This SDD is the formal engineering reference for Donna, the Cadre AI public conversational experience at PX6 revision 15. It consolidates product boundaries, architecture, component ownership, runtime contracts, model/provider integration, security/trust controls, UI behavior, deployment posture, quality evidence, operational limitations, and handoff references into one technical source.

The design separates **factual/business authority** from **conversational presentation**. The application owns topic routing, reviewed facts, approved links, pricing/account boundaries, and final reply construction. On supported grounded topics, the external model adapter is limited to selecting the relevance order of existing approved fact indices.

### 2.2 Scope

**In scope:**

- Next.js 16 / React 19 public web experience.
- Dynamic server page and floating Donna chat interface.
- Node.js `POST /api/chat` and `GET /api/health` routes.
- Deterministic validation, topic routing, business boundaries, clarification policy, and reply composition.
- Typed client, persona, and experience profiles.
- Curated six-topic Cadre knowledge configuration with provenance and approved links.
- Mock and OpenRouter `FactSelector` implementations.
- Request, body, history, output, deadline, budget, and best-effort rate controls.
- Client-side ephemeral conversation state, retry/stop/reset behavior, keyboard/mobile/reduced-motion handling.
- Graph Engineering evidence and release-gate workflow.
- GitHub CI and exact-SHA Vercel deployment design.
- **AS-BUILT / OPTIONAL** Chrome Integration Preview.
- **AS-BUILT / OPTIONAL** n8n human-handoff contract prototype.
- **TARGET / NOT DEPLOYED** AWS hosting reference architecture.

**Out of scope / not present in r15:**

- User authentication or authorization.
- Private client/account lookup.
- CRM access or mutation.
- Application database for chat sessions.
- Persistent cross-session conversation memory.
- Vector database, embeddings, semantic RAG, GraphRAG, or live document ingestion.
- Arbitrary webpage scraping.
- Autonomous tool execution or transactions.
- Real email delivery or a production human-handoff provider.
- Booking creation or maturity-assessment scoring inside Donna.
- Production AWS deployment.
- Full accessibility certification or physical-device certification.

### 2.3 Definitions and Acronyms

| Term | Meaning |
| --- | --- |
| Donna | Cadre conversational persona composed by the `cadre-donna` product profile. |
| `ClientConfig` | Typed client factual authority: topics, facts, links, boundaries, provenance, public highlights. |
| `PersonaProfile` | Bounded conversational behavior/tone and at most one configured proactive question per topic. |
| `ExperienceProfile` | Presentation contract: avatar, theme, website copy, quick prompts, trust points, ambient media. |
| `FactSelector` | Provider-neutral interface returning approved fact indices only. |
| Grounded | A routed request that matches one configured knowledge entry. |
| Boundary | Deterministic handling for pricing/unverified, account/private, unsupported, or unresolved ambiguity. |
| Fail closed | Reject/return controlled unavailable behavior rather than silently widening capability or substituting an invalid live mode with mock. |
| PX6 r15 | Current public Donna release line described by this SDD. |
| Graph Harness | External pinned execution/governance runtime used for engineering evidence, not a deployed chatbot dependency. |

### 2.4 Primary References

- `README.md` — product framing, runtime/release identity, local run path.
- `docs/component-inventory.md` — component contracts, invariants, maturity and test coverage.
- `docs/donna-architecture-pack-r15.md` — source-backed diagram semantics and target distinction.
- `docs/knowledge-source-audit.md` — factual provenance and knowledge-refresh boundaries.
- `docs/engineering-workflow.md` — Graph Engineering operating discipline.
- `docs/release-runbook.md` and `docs/deploy.md` — production and verification flow.
- `extension/README.md` — optional Chrome preview contract.
- `integrations/n8n/README.md` — optional handoff prototype contract.
- `progress/checkpoint.md` and retained evidence — current release evidence.

---

## 3. System Overview

### 3.1 Product Intent

Donna is a public, website-first conversational guide for Cadre AI. It helps a visitor understand verified public information and choose a sensible next step without presenting the model as an unrestricted company expert or an account-capable agent.

A visitor can read the Cadre/Donna landing experience, open Donna from several entry points, ask naturally or choose a suggested/verified topic, receive a grounded answer built from reviewed facts and approved links, receive at most one configured Donna follow-up question on eligible grounded topics, and receive deterministic clarification/boundary handling when the request leaves verified scope.

### 3.2 Delivered Product Persona

Donna is configured as a calm, perceptive, concise, confident, lightly witty guide. These traits do not grant factual authority. The persona layer may add bounded tone and one app-owned proactive question, but cannot alter routing, facts, URLs, pricing classification, account/private boundaries, provider credentials, or transactional authority.

### 3.3 Supported Knowledge Topics

| Topic | User-facing label | Purpose |
| --- | --- | --- |
| `overview` | what Cadre AI does | Services, business-impact framing, strategy/engineering/agents/leadership. |
| `industries` | industries we serve | Published industry and departmental fit. |
| `strategist-call` | booking a strategist call | Explains the official contact path; Donna does not book. |
| `portal` | client portal access | Public portal/result-entry context plus explicit no-account-access boundary. |
| `maturity-index` | the AI Maturity Index | Public assessment description; no in-chat assessment/scoring. |
| `models-security` | models and data security | Bounded published/company-provided model/security context with explicit qualification. |

### 3.4 Public Product Posture

- Anonymous public website; no Donna login or user identity is required.
- Public chat is informational and bounded to reviewed/configured knowledge.
- The normal web runtime stores no conversation in an application database or browser storage after refresh.
- Live-mode messages are sent to an external model service; users are warned not to submit private details.
- Provider/platform logging or retention is not represented as zero.
- Health availability is distinct from provider readiness.
- Optional Chrome and n8n adapters are not core public-runtime features.

### 3.5 Architecture Drivers

| Driver | Design implication |
| --- | --- |
| Grounded business truth | Facts and links are versioned, typed, source-attributed application configuration. |
| Bounded model authority | Model returns fact indices only; it cannot add business prose, links, tools, or actions. |
| Honest capability boundaries | Pricing, account/private, unsupported and ambiguity paths are deterministic. |
| Safe anonymous access | Input/body/history/reply bounds, JSON-only POST, best-effort rate limiting. |
| Fail-closed live operation | Unknown mode, missing/expired credentials/model or invalid provider responses become controlled errors. |
| Low operational complexity | Stateless Node/Next runtime; no app database required for r15 parity. |
| Reusable productization | `ClientConfig`, `PersonaProfile`, and `ExperienceProfile` are separate typed contracts. |
| Evidence-backed delivery | CI, browser tests, Graph lifecycle, exact-SHA deployment and retained failure/repair evidence. |
| Explicit future-state separation | AWS reference is visibly TARGET / NOT DEPLOYED. |

---

## 4. Architectural Design

### 4.1 Canonical Lucid Master

**Donna Architecture Pack - r15**  
`https://lucid.app/lucidchart/bd103b7c-614d-4e48-9cd0-e5ede867f924/edit`

| Page | Truth label | Purpose |
| --- | --- | --- |
| 1 | AS-BUILT | System context and external actors/services. |
| 2 | AS-BUILT | Runtime authority and trust boundaries. |
| 3 | AS-BUILT | Source/component ownership and dependency direction. |
| 4 | AS-BUILT / Engineering | Graph Engineering control plane and release evidence. |
| 5 | TARGET / NOT DEPLOYED | AWS hosting reference. |
| 6 | AS-BUILT | Detailed runtime request sequence. |
| 7 | AS-BUILT / User View | Visitor journey and operating modes. |

### 4.2 High-Level Topology

```text
Anonymous Visitor
      |
      v
Donna Web Experience (Next.js / React / Vercel)
      |
      v
POST /api/chat
      |
      v
Server Admission + Deterministic Core
      |                  \
      |                   +--> Typed Client/Product/Persona Configuration
      |
      +-- grounded only --> FactSelector --> OpenRouter
      |                         |
      |                         +--> approved fact indices only
      |
      +-- non-grounded ------> deterministic app-owned copy
      |
      v
Exact approved fact/link composition + safe UI projection
```

### 4.3 Runtime Authority Boundary

**Application-controlled:** JSON/request admission; message schema/limits; topic/business-boundary routing; factual corpus; destinations/links; clarification; pricing/private/unsupported responses; Donna proactive question text; final reply assembly; clickable URL allowlist.

**Model-controlled:** on grounded topics only, a strict JSON array ordering/selecting existing approved fact indices.

The server preserves every fact from the routed entry: selected facts are first and the remaining approved facts follow. The model changes relevance order, not the factual or destination set.

### 4.4 Architectural Layers

| Layer | Primary sources | Responsibility |
| --- | --- | --- |
| Presentation | `app/`, `src/ui/` | Website, chat, local interaction state, safe text/link projection. |
| Server orchestration | `src/server/`, `app/api/` | Admission, body/deadline/rate controls, provider selection, error mapping. |
| Domain/core | `src/core/` | Validation, normalization, deterministic routing and policy. |
| Client knowledge | `src/config/` | Reviewed facts, provenance, routing vocabulary, approved links, boundaries/highlights. |
| Product composition | `src/product/` | Client + persona + experience composition and browser projection. |
| Provider adapter | `src/provider/` | Mock/OpenRouter FactSelector contract, response/budget/deadline rules. |
| Optional integrations | `extension/`, `integrations/n8n/` | Local Chrome presentation adapter and isolated handoff prototype. |
| Engineering control plane | Graph files, `tools/graph-adapter/`, workflows, `progress/`, `evidence/` | Verification/release governance; not request-time runtime. |

### 4.5 Statelessness and Persistence

The public r15 app is intentionally stateless across browser refreshes and has no application database for conversations. Client page state holds the active transcript; up to 40 messages may remain visible in the page; outbound API history is capped at 20; provider context is capped at the most recent 10 and trimmed further by prompt-byte budget. A clarification pair is held during the active page session. No `localStorage`, `sessionStorage`, Firestore, SQL, Redis, or vector store is required for the public r15 chat.

This app-level statelessness is not a claim that hosting or external model providers retain no logs/data.

---

## 5. Frontend Design

### 5.1 Technology

- Next.js `^16.3.4` App Router.
- React / React DOM `^19.2.8`.
- TypeScript `^6.0.3`.
- Project CSS in `app/globals.css` and `app/premium.css`.
- Dynamic root page so provider mode/status derives from request-time server configuration rather than a stale build snapshot.

### 5.2 Page Composition

The main page renders Cadre branding/navigation, the editorial hero, `Ask Donna`, the official `Talk to an AI Strategist` contact path, reviewed outcome/proof/product sections, a `How Donna works` trust section, the floating Donna launcher and suggestion card, and the chat card with mode status, welcome content, quick prompts, verified-topic browser, transcript, composer, privacy/scope note, and recovery controls.

### 5.3 Chat Entry Points

A visitor may start the same core chat flow through the hero button, floating launcher, rotating suggestion action, quick prompt cards, `Browse verified topics`, the results-section Donna action, or the free-text composer. All paths ultimately POST the same bounded message-history contract to `/api/chat`.

### 5.4 Composer and Interaction Rules

- Empty messages are blocked with user-facing validation.
- Maximum message length is 2,000 characters.
- `Enter` sends; `Shift + Enter` inserts a new line.
- IME composition is protected from accidental submit.
- One request is in flight per page at a time.
- While pending, Send becomes `Stop response`.
- Failed turns retain the user's message and expose `Retry response`.
- `New` clears active-page conversation and clarification state.
- Closing or pressing `Escape` restores focus to the launcher.
- `Jump to latest` appears when the user scrolls away from recent messages.

### 5.5 Safe Reply Rendering

Replies are rendered as React text nodes. URL-like tokens become clickable only when the complete URL exactly matches an approved application link. External links use `target="_blank"` plus `rel="noopener noreferrer"`. Arbitrary HTML returned through a response is not executed.

### 5.6 Mode Labels

| Internal state | Public UI label |
| --- | --- |
| Valid OpenRouter live config | `Available` |
| Explicit/default mock | `Demo` |
| Invalid/unknown/unavailable configuration | `Unavailable` |
| Request in progress | `Shaping a grounded answer` |

Demo mode states that sample answers are used and no live model is called. Unavailable mode retains the official contact path.

### 5.7 Motion and Accessibility-Oriented Controls

`prefers-reduced-motion: reduce` suppresses ambient motion and rotating invitation behavior. When motion is allowed, a visible `Pause`/`Play` control governs ambient video. The page includes a skip link, ARIA-labelled chat/transcript controls, live-status announcements, deliberate focus restoration, and automated keyboard/desktop/mobile Chromium coverage. These measures do not constitute formal accessibility certification.

---

## 6. Backend and Runtime Design

### 6.1 Chat Route

`app/api/chat/route.ts` selects the Node.js runtime and delegates POST handling to `createChatHandler()` from `src/server/chat.ts`.

### 6.2 Request Processing Order

1. Create a total request deadline.
2. Check the best-effort rate bucket.
3. Require `Content-Type: application/json`.
4. Read the body with a raw byte limit before full JSON parse.
5. Validate `{ messages }` with Zod.
6. Resolve the active product/client/persona from the closed registry.
7. Resolve provider mode; invalid live configuration fails closed.
8. Deterministically decide the reply class.
9. For grounded requests only, call the selected `FactSelector` with bounded history.
10. Validate fact indices.
11. Reassemble exact application facts and approved links.
12. Optionally append one configured proactive question unless suppressed by user phrasing/history.
13. Optionally prepend a short persona tone lead to non-grounded boundaries.
14. Enforce final reply-size bounds without truncating required facts/links.
15. Return non-cacheable JSON.
16. Map failures to static safe copy/status codes.

### 6.3 API Limits

| Control | r15 value | Enforcement |
| --- | ---: | --- |
| Maximum messages/request | 20 | Zod request schema |
| Maximum characters/message | 2,000 | Zod + UI |
| Maximum raw request body | 256 KiB | Streamed body reader |
| Provider history window | 10 messages | Server/provider |
| Maximum reply | 2,400 characters | Server + UI response parser |
| Server/provider deadline | 20 seconds | Abort/deadline helpers |
| Client timeout | 25 seconds | UI |
| Rate bucket | 10 requests / 60 seconds | Process-local server limiter |
| Tracked client buckets | 1,024 then overflow bucket | Process-local server limiter |

### 6.4 Error Envelope

Failures use the same bounded public shape:

```json
{
  "reply": "safe human-readable copy",
  "kind": "error"
}
```

| Condition | HTTP | Behavior |
| --- | ---: | --- |
| Invalid JSON / validation | 400 | Controlled validation copy |
| Request body too large | 413 | Ask user to shorten request |
| Non-JSON content type | 415 | Require JSON |
| Rate bucket exceeded | 429 | Controlled busy/retry copy; `Retry-After` when applicable |
| Client cancellation on server path | 499 | Controlled cancelled copy |
| Deadline exceeded | 504 | Controlled timeout copy |
| Provider/config/unavailable/invalid response | 503 | Controlled temporary-unavailable copy |

Raw provider error bodies, credentials, or caught request objects are not exposed through public error copy.

### 6.5 Health Route

`GET /api/health` returns `{ "status": "ok" }` with `cache-control: no-store`. This proves route availability only; it does not probe model-provider readiness, credential expiry, key allowance, or grounded live-answer capability.

---

## 7. Deterministic Conversation Core

### 7.1 Validation Contract

Accepted chat messages have exactly `role: "user" | "assistant"` and bounded string `content`. The last message must be from the user. Content is trimmed, nonempty, and length-bounded.

### 7.2 Text Normalization

Routing/boundary comparisons lowercase, apply Unicode NFKD normalization, remove invisible format characters and combining marks, convert punctuation/non-alphanumeric separators to spaces, and collapse whitespace. Whole-phrase matching reduces punctuation/invisible-character bypasses of configured boundary triggers.

### 7.3 Routing

`routeMessage` scores configured topic keywords/labels deterministically. Overlapping aliases count once for a matched span. No positive hit returns `unknown`; one clear leader returns `match`; tied leaders return `ambiguous`. This is inspectable phrase routing, not semantic/vector retrieval, so legitimate paraphrases outside configured vocabulary can miss a supported topic.

### 7.4 Boundary Precedence

Before ordinary topic routing:

1. Account/private triggers produce `redirect(account-specific)`.
2. Unverified/pricing/certification/guarantee triggers produce `decline`.
3. Exact whole-message greetings produce `greeting`.
4. Remaining messages go through topic routing.

This prevents a nearby supported topic from answering a request that should be treated as private/account-specific or unverifiable.

### 7.5 Clarification

A tied topic result may receive one canonical clarification. A subsequent ordinal selection can resolve against the immediately preceding canonical clarification pair. Clarification state arrives from client-supplied history and is forgeable; this may affect clarify-versus-redirect behavior but cannot create new facts, URLs, credentials, or account authority.

---

## 8. Configuration and Knowledge Design

### 8.1 `ClientConfig`

`ClientConfig` is the client factual/business authority consumed by the core. It includes client/bot identity, official and explicitly delegated domains, canonical contact link, reviewed public highlights, knowledge entries, decline/pricing/account triggers, and deterministic escalation/decline/pricing copy.

### 8.2 `KnowledgeEntry`

Each entry contains stable ID, routing topic, user-facing label, routing vocabulary, verified fact strings, approved links, and source origin with optional retrieval date.

### 8.3 Configuration Invariants

Validation at module load rejects invalid non-HTTPS links, links outside official/delegated domains, duplicate IDs/topics/highlight IDs, empty-normalized keywords/triggers, cross-topic duplicate normalized keywords, exact boundary/keyword collisions, and pricing triggers not also declared as decline triggers. The validated result is deep-frozen.

### 8.4 Provenance

Runtime facts live in version-controlled TypeScript. Cadre entries record source origins and retrieval dates. Public-web statements and company-provided profile statements are distinguished. Research notes do not become runtime facts automatically; promotion requires a reviewed configuration change and validation/test path.

### 8.5 Product Composition

```text
ClientConfig       -> facts, links, boundaries, provenance
PersonaProfile     -> tone + at most one configured proactive question
ExperienceProfile  -> web copy, quick prompts, avatar, trust points, theme/media
```

The browser receives only a safe presentation projection. Verified fact bodies, routing triggers, persona operating principles, and provider credentials remain server-side.

### 8.6 Product Registry

The deployed registry contains explicitly imported profiles and defaults to `cadre-donna`. An unknown deployment-time product ID cannot become a module path or arbitrary remote configuration; it resolves to the explicit default. A fictional Acme/Scout fixture validates separation in tests and is not evidence of production multi-tenant operation.

---

## 9. AI / Provider Integration Design

### 9.1 Provider Abstraction

The model integration sits behind `FactSelector.selectFacts(...) -> Promise<readonly number[]>`. `MockFactSelector` is fully local; `OpenRouterFactSelector` uses the external provider with metadata/model/schema/cost validation.

### 9.2 Provider Mode

`CHAT_PROVIDER` supports undefined/`mock` for local mock and `openrouter` for the live path only when live configuration is valid. Any other value is unavailable/fail-closed. Invalid or expired live configuration does not silently revert to mock.

### 9.3 Approved Models

The current default/primary model is `openai/gpt-4.1-mini`. `google/gemini-3.8-flash` is separately allowlisted for controlled evaluation. Its presence in the allowlist is not evidence that it is the deployed production selection.

### 9.4 Live Configuration Guard

Live OpenRouter requires server-only `OPENROUTER_API_KEY`, an approved `OPENROUTER_MODEL`, valid `OPENROUTER_KEY_EXPIRES_AT`, and `CHAT_PROVIDER=openrouter`. For this release line, the owner-authorized operational deadline is capped at `2026-09-15T00:00:00Z`; missing, invalid, past, or beyond-cap expiry fails closed.

### 9.5 Grounded Provider Payload

The adapter submits bounded conversation history, one routed topic label, numbered approved fact strings, instructions treating conversation/facts as untrusted data, and a strict JSON schema requiring `fact_indices`. It asks the provider to choose existing indices only and forbids adding facts, URLs, tools, or free-form answer prose.

### 9.6 Provider Response Validation

A valid selection is a nonempty array of unique integers within `[0, factCount - 1]` and cannot exceed the configured fact count. Malformed successful responses fail as `invalid_response`.

### 9.7 Provider Bounds

| Bound | Value |
| --- | ---: |
| Maximum provider response body | 32 KiB |
| Maximum serialized prompt | 32 KiB |
| Maximum output tokens | 256 |
| Maximum retry delay | 2 seconds |
| Automatic retry | At most once, explicit 429/503 only |
| Local unused reserve | $0.50 |
| Maximum accepted provider key limit metadata | $5 |
| Default-model input price ceiling | $0.50 / million tokens |
| Default-model output price ceiling | $2 / million tokens |

Ambiguous transport failures/timeouts and malformed HTTP-200 output do not automatically retry because inference/billing may already have occurred.

### 9.8 Budget Caveat

Application budget reservations are process-local. Restarts and parallel serverless instances do not share them; the provider-enforced key limit is therefore the stronger cross-instance spend boundary. This is best-effort cost protection, not globally coordinated accounting.

---

## 10. Interface Design

### 10.1 `POST /api/chat`

Request:

```json
{
  "messages": [
    { "role": "user", "content": "What services does Cadre offer?" }
  ]
}
```

Successful response:

```json
{
  "reply": "...",
  "kind": "greeting|grounded|clarify|redirect|decline"
}
```

Failure responses retain the same envelope with `kind: "error"`. Responses are non-cacheable.

### 10.2 `GET /api/health`

Response: `{ "status": "ok" }`, non-cacheable. Provider readiness is intentionally outside this contract.

### 10.3 Browser Projection

`chatExperience(profile)` exposes only product ID, client name, contact link, deduplicated approved links, reviewed public highlights, topic IDs/labels, and `ExperienceProfile`. Raw fact bodies, routing triggers, persona operating principles, and provider secrets are not required by the browser.

---

## 11. Security and Trust Design

### 11.1 Security Model

Donna r15 is an anonymous public informational application, not an authenticated client system. Its trust design focuses on bounded input, deterministic factual authority, server-only provider credentials, explicit private/account boundaries, safe output projection, cost/deadline controls, and least-capability optional integrations.

### 11.2 Input Boundary

- JSON-only chat POST.
- Actual UTF-8 byte cap before complete JSON parse.
- Message count/length/schema bounds.
- Last-message-is-user invariant.
- Text normalization for routing and boundary matching.
- Client text is data and cannot inject new configuration, URLs, or executable code paths.

### 11.3 Credential Boundary

Provider secrets are server-only environment variables. The application does not use a public provider credential, commit a key, or send it to client code. Static error copy prevents upstream exception/request details from being reflected to the visitor.

### 11.4 Browser Output Boundary

- React text rendering; no model-generated HTML execution.
- Clickable URLs require an exact match against application-approved links.
- Approved links must satisfy `ClientConfig` official/delegated-domain validation.
- External links use safe target/rel attributes.

### 11.5 Cross-Site Request Posture

The chat route requires JSON and does not grant permissive cross-origin preflight access. This limits ordinary drive-by browser use from unrelated origins but is **not authentication**.

### 11.6 Rate Limiting

The application uses a 10-request/60-second process-local fixed window. Without verified trusted-ingress header configuration, requests share a global bucket. With explicit trusted `x-forwarded-for` or `x-real-ip`, only one syntactically valid single IP is accepted as client identity.

**KNOWN GAP:** process-local rate state resets and is not coordinated across serverless instances; it must not be represented as distributed abuse prevention.

### 11.7 Privacy Boundary

The product tells visitors that the chat is for public information only, does not access accounts/bookings/assessments, should not receive private details, sends messages to an external model service when live mode is active, and keeps no application chat history after refresh. The application does not claim zero retention by external providers or hosting infrastructure.

### 11.8 Transaction Boundary

The public r15 chat does not change account/login state, book meetings, execute or score assessments, mutate CRM, send email, modify files, or perform autonomous tool actions. When verified context ends, Donna redirects to an approved human/contact path rather than claiming an action occurred.

---

## 12. Optional Integration Adapters

### 12.1 Chrome Integration Preview — AS-BUILT / OPTIONAL

The Manifest V3 preview is an independent local presentation adapter, not the primary product and not a Cadre-installed/endorsed production feature.

Its boundaries include exact approved Cadre activation origins, one fixed Vercel API destination, no wildcard-subdomain access, no storage/tabs/history/cookies/scripting/activeTab/debugger permissions, no host-page text/form/cookie/storage scraping, URL-path/hash-only presentation context, volatile conversation state, and no Chrome Web Store publication claim.

### 12.2 n8n Handoff Contract — AS-BUILT / OPTIONAL

The n8n artifact models a future `HumanHandoffProvider` boundary. It is credential-free and validates explicit contact consent plus a bounded structured payload. It does **not** establish that a real email, CRM record, meeting, provider, or recipient is configured. The public Donna application is not wired to this workflow in r15.

---

## 13. Quality Assurance and Verification

### 13.1 Layered Verification

| Layer | Main tooling | Purpose |
| --- | --- | --- |
| Unit/integration | Vitest | Core routing/policy/config/provider/server/UI helper invariants. |
| Browser | Playwright | Website/chat behavior, desktop/mobile, failure recovery, keyboard/interaction. |
| Extension unit | Vitest extension config | Manifest/contract/adapter boundaries. |
| Extension browser | Synthetic + disposable installed-site checks | Context, worker/panel lifecycle, fixed-endpoint behavior. |
| Static | TypeScript + ESLint | Type and lint gates. |
| Build | Next.js production build | Packaging/runtime compilation. |
| Release | GitHub CI + release gate | Exact source line and Graph state. |
| Governance | Graph Harness | Role-separated evidence, gates, retained failures/repairs, terminal state. |

### 13.2 r15 Detached Verification

Retained r15 verification reports:

- **302/302 Vitest PASS**
- **70/70 Playwright PASS**
- **73/73 extension tests PASS**
- **24/24 synthetic extension checks PASS**
- production build PASS
- typecheck PASS
- lint PASS
- Graph validation PASS

Public release verification passed the complete rate-aware **70/70** external Playwright matrix using fresh client-rate windows instead of weakening the production 10-request/60-second control.

### 13.3 Retained Failure/Repair Evidence

The release record retains non-PASS intermediate states: r13 exposed a 68/70 mobile invitation defect; r14 repaired the targeted defect but critic review rejected sub-12px copy; r15 repaired readability and passed final verification/gates. The evidence model therefore distinguishes having tests from actually clearing review after repair.

### 13.4 CI

`.github/workflows/ci.yml` runs locked install, lint, typecheck, Vitest, production build, extension build/tests, Playwright, and the synthetic extension browser check on pull requests and pushes to `main`. Browser-failure evidence is uploaded when a job fails.

### 13.5 Truth Labelling Rule

Release/documentation claims must keep separate: local/mock vs. live/provider evidence; application health vs. provider health; source vs. deployed exact SHA; optional adapter vs. public runtime; target architecture vs. deployed architecture; and prepared package vs. externally submitted artifact.

---

## 14. Non-Functional Requirements and Characteristics

### 14.1 Reliability

Deterministic policy paths do not require inference. Grounded live paths fail closed on invalid provider configuration/response. Client/server timeouts and explicit cancellation bound long requests. Failed UI turns can be retried explicitly. Provider automatic retry is narrow. The last verified public deployment can be restored/redeployed through the documented Vercel procedure.

### 14.2 Performance Bounds

- Server/provider deadline: 20 seconds.
- Client timeout: 25 seconds.
- Provider prompt/output/body caps constrain request growth.
- Ordinary configuration/topic lookup requires no application database/network retrieval.

No SLA or guaranteed percentile latency is established by r15 evidence.

### 14.3 Scalability

The chat runtime is session-stateless and compatible with serverless horizontal execution, but rate-limit state and application budget reservations are not shared and no distributed session/abuse-control store exists. The absence of a database reduces complexity while intentionally excluding persistent authenticated personalization.

### 14.4 Observability

The application exposes liveness and retains CI/deployment/test evidence. It does not define an in-application product-analytics platform, persistent conversation analytics, or distributed tracing layer in r15.

**KNOWN GAP:** privacy-reviewed product analytics and distributed runtime telemetry remain future work.

### 14.5 Maintainability

Maintainability is supported by typed contracts, deep-frozen validated client config, pure conversation-core functions, provider abstraction, profile-driven presentation, documented components, CI/Graph evidence, and optional integrations kept outside core runtime authority.

---

## 15. Deployment and Release View

### 15.1 Runtime Hosting — AS-BUILT

The verified r15 product uses the existing Vercel project:

- scope: `Cadre_AI / cadre-ai3`
- project: `cadre-ai-chatbot`
- public alias: `https://cadre-ai-chatbot-tawny.vercel.app`
- r15 deployment: `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`

### 15.2 Runtime Versions

The package engine accepts `^22.12.0 || ^24.0.0 || >=26.0.0`; CI uses Node 24 and the Vercel project is configured for Node 24.x.

### 15.3 Runtime Environment Variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `CHAT_PROVIDER` | `mock` or `openrouter` | Unknown values fail closed. |
| `OPENROUTER_API_KEY` | Live server-side credential | Never public/client-side. |
| `OPENROUTER_MODEL` | Approved provider model | Default `openai/gpt-4.1-mini`; alternate is evaluation-only unless separately approved. |
| `OPENROUTER_KEY_EXPIRES_AT` | Operational live expiry | Must be finite, future, and no later than the authorized cap. |
| `CHAT_TRUSTED_PROXY_IP_HEADER` | Optional trusted ingress client-IP header | Only `x-forwarded-for` or `x-real-ip`; use only with verified ingress semantics. |
| `CHATBOT_PRODUCT_PROFILE` | Select explicit product profile | Unknown IDs resolve to the explicit default. |

### 15.4 Automated Production Workflow

The production workflow selects the exact CI-approved SHA, requires releasable Graph state, requires existing Vercel bindings, writes only an ephemeral `.vercel/project.json`, pulls production configuration, builds for production, deploys prebuilt output, and verifies health/page/icon/deterministic-hello release markers.

### 15.5 KNOWN GAP — GitHub Production Secret Binding

Automated CD currently fails closed before Vercel because the GitHub `production` environment lacks the existing-project `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` bindings. Manual exact-project production delivery has been independently proven. This is an automation/configuration gap, not an unresolved r15 application-runtime defect.

---

## 16. TARGET / NOT DEPLOYED — AWS Reference Architecture

Canonical Lucid Page 5 defines a future hosting reference only:

```text
Internet User
 -> Route 53
 -> CloudFront
 -> AWS WAF
 -> Application Load Balancer
 -> ECS/Fargate across two AZs
 -> controlled NAT egress
 -> OpenRouter
```

Supporting reference services are ECR, IAM/OIDC, Secrets Manager, and CloudWatch. ElastiCache is **OPTIONAL FUTURE** only if distributed runtime controls become necessary.

Parity deliberately does **not** require RDS/Aurora/DynamoDB, Bedrock, EKS/Kubernetes, authentication, CRM, or a vector store. No AWS deployment is claimed by this SDD.

---

## 17. Risk Register

| ID | Risk | Likelihood | Impact | Current mitigation / posture | Open follow-up |
| --- | --- | --- | --- | --- | --- |
| R1 | Process-local rate limiting can be bypassed by horizontal instance distribution/restart. | Medium | Medium/High | 10/min local bucket plus provider-side key limit; explicit documentation. | Add distributed limiter only when scale/abuse requires it. |
| R2 | Process-local budget reservation is not global accounting. | Medium | High | Conservative reserve; metadata validation; accepted key limit capped at $5. | Use external/global budget control for higher-risk spend. |
| R3 | Curated keyword routing can miss legitimate paraphrases. | Medium | Medium | Six verified topics, test corpus, deterministic clarification/redirect. | Expand evaluated vocabulary or add separately constrained retrieval. |
| R4 | Knowledge can become stale while code/tests remain green. | Medium | High | Provenance/retrieval dates + source audit; research is not auto-promoted. | Establish dated editorial refresh cadence. |
| R5 | External provider can be unavailable, malformed, slow, or rate-limited. | Medium | Medium | Typed errors, strict response/body validation, deadline, narrow retry, deterministic non-grounded paths. | Add operational monitoring when scale warrants it. |
| R6 | Live credential expiry intentionally stops live mode. | Certain by configured deadline | Medium | Fail-closed config and explicit unavailable UI/contact path. | Reauthorize/rotate through an approved secret process for continued live operation. |
| R7 | Client-supplied clarification history is forgeable. | Medium | Low | It can only affect clarify/redirect selection among existing configured topics; no authority is gained. | Add server state only if higher-stakes state becomes necessary. |
| R8 | Users may submit private details to an anonymous public chat. | Medium | High | Privacy warning, account/private boundary, no account access. | Consider stronger privacy UX/policy review for broader rollout. |
| R9 | Provider/platform retention is outside app-level volatile history. | Medium | High | UI states external model processing; no zero-retention claim. | Confirm contractual provider controls before enterprise retention claims. |
| R10 | Automated CD is blocked by missing GitHub production Vercel bindings. | High/current | Medium | Fails before deploy; manual existing-project delivery proven. | Bind existing secrets and rerun exact-SHA workflow. |
| R11 | Chrome preview may be misread as a Cadre-installed production integration. | Medium | Medium | Local-preview labels, exact origin/API boundaries, no Web Store claim. | Retain OPTIONAL truth label in demos/docs. |
| R12 | Browser tests are not full accessibility/physical-device certification. | Medium | Medium | Keyboard, reduced motion, ARIA/focus, desktop/mobile Chromium coverage. | Add formal audit/device matrix if contract requires it. |
| R13 | Alternate model may change relevance ordering/cost envelope. | Low unless switched | Medium | Exact model allowlist + model-specific price ceilings. | Run separate evaluation before production switch. |
| R14 | No product analytics/distributed tracing limits long-term operational insight. | Medium | Medium | CI/evidence + health route exist; no false analytics claim. | Add privacy-reviewed telemetry in a new scoped workstream. |

---

## 18. Operational and Maintenance Guidance

### 18.1 Local Run

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run start
```

Default local provider mode is mock. Open `http://127.0.0.1:3100`.

### 18.2 Pre-Release Validation

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run release:gate
node extension/build.mjs
npm exec -- vitest run --config extension/vitest.config.ts
```

For an external public target, verification must respect the production 10-request/60-second per-client window; do not weaken runtime safeguards to make verification pass.

### 18.3 Knowledge Change Procedure

1. Verify the source and retrieval date.
2. Update only the relevant `ClientConfig` entry/public highlight.
3. Preserve uncertainty/attribution where sources do not establish a guarantee.
4. Keep links inside configured official/delegated domains.
5. Run config/core/API/browser tests.
6. Run the applicable Graph lifecycle and retain evidence.
7. Deploy only the accepted exact SHA.

### 18.4 Provider Change Procedure

A provider/model change requires an approved model/profile, price/output constraints, structured-output compatibility, malformed/timeout/retry/budget tests, a dated live evaluation when production behavior is claimed, updated documentation/evidence, and release-gate approval. It is not a copy-only change.

---

## 19. Known Gaps and Deliberate Non-Goals

### 19.1 Known Gaps

- Distributed abuse/rate control is absent; current limiter is process-local.
- Distributed budget reservation is absent; provider key controls are the stronger global spend boundary.
- GitHub production CD lacks Vercel secret bindings.
- Product analytics/distributed tracing are not part of r15.
- Knowledge freshness depends on editorial/source review, not automated ingestion.
- Full accessibility/device certification has not been established.

### 19.2 Deliberate Non-Goals at r15

Persistent memory, user accounts, CRM/private-data access, vector/GraphRAG retrieval, autonomous tools, transactional email/booking/assessment behavior, live webpage scraping, production AWS migration, and unrestricted generative business answers are outside r15.

---

## 20. Appendix A — Top Files to Know

| # | File | Why it matters |
| ---: | --- | --- |
| 1 | `README.md` | Product/release truth and local run path. |
| 2 | `src/config/cadre.ts` | Cadre facts, topics, links, highlights, provenance and boundaries. |
| 3 | `src/config/types.ts` | `ClientConfig` schema and trust invariants. |
| 4 | `src/product/profiles/cadre-donna.ts` | Donna persona, proactive questions and experience copy. |
| 5 | `src/product/types.ts` | Persona/experience/product schemas. |
| 6 | `src/core/policy.ts` | Deterministic decision and reply policy. |
| 7 | `src/core/route.ts` | Deterministic topic scoring/ambiguity. |
| 8 | `src/core/validate.ts` | Chat request schema. |
| 9 | `src/server/chat.ts` | Public request orchestration and error mapping. |
| 10 | `src/server/io.ts` | Bounded body reading, deadlines and cancellation. |
| 11 | `src/server/rate-limit.ts` | Process-local request admission. |
| 12 | `src/provider/openrouter.ts` | Live FactSelector transport, schema, budget and retry rules. |
| 13 | `src/provider/config.ts` | Provider modes, model allowlist and live expiry guard. |
| 14 | `src/ui/support-chat.tsx` | Main public web/chat UI and interaction state. |
| 15 | `src/ui/conversation.ts` | Browser history shaping and approved-link rendering. |
| 16 | `.github/workflows/ci.yml` | CI quality/browser gates. |
| 17 | `.github/workflows/deploy-production.yml` | Exact-SHA gated Vercel path. |
| 18 | `docs/donna-architecture-pack-r15.md` | Architecture truth contract and Lucid master. |
| 19 | `docs/release-runbook.md` | Release/recovery procedure. |
| 20 | `progress/architecture-docs-graph.*` | Documentation Graph state and event ledger. |

---

## 21. Appendix B — Runtime Request Sequence

Canonical Lucid Page 6 shows:

```text
User
 -> Donna Web UI
 -> POST /api/chat
 -> createChatHandler
 -> Client/Product Config resolution
 -> Policy + Router

alt grounded
  -> FactSelector
  -> OpenRouter strict-schema request
  <- validated fact indices
  -> deterministic exact fact/link assembly
else deterministic non-grounded
  -> greeting / clarification / pricing-account-private / unsupported copy
end

-> safe browser projection

opt failure
  -> controlled error mapping / fail closed
end
```

---

## 22. Appendix C — User Journey Summary

Canonical Lucid Page 7 provides the non-technical operational view:

```text
Open Donna -> Ask/select question -> Classify request
                  |                      |
                  |                      +-> Supported -> grounded facts/links -> optional one question
                  |                      |
                  |                      +-> Boundary/ambiguous -> deterministic controlled response
                  |
                  +-> Continue/reset/leave; no application cross-session memory
```

Optional Chrome/n8n previews are deliberately outside the primary journey.

---

## 23. Sign-off

This SDD is the formal technical reference for the **frozen Donna PX6 revision-15** runtime and its documented optional/target architecture boundaries as of 2026-09-11.

Material changes to runtime behavior, factual authority, provider/model policy, persistence, authentication, private-data access, transactional tools, integrations, hosting architecture, or release controls require a new scoped Graph lifecycle and corresponding SDD revision. Documentation-only changes must not silently relabel TARGET/OPTIONAL behavior as AS-BUILT.
