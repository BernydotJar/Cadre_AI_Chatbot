# Donna Architecture Pack - r15

Status: architecture source model for the frozen PX6 revision-15 release. This file is the source contract for the editable Lucidchart pack.

## Claim legend

- **AS-BUILT / DEPLOYED**: backed by the frozen r15 repository and retained release evidence.
- **AS-BUILT / OPTIONAL**: implemented/tested as a separate adapter or contract, but not part of the public chatbot runtime path.
- **TARGET / NOT DEPLOYED**: proposed AWS hosting/reference architecture only. It is not evidence of an AWS deployment.
- **OPTIONAL FUTURE**: intentionally outside current parity scope and shown only as a possible scale/control enhancement.

Frozen release identity: runtime repair `af7e3ff91ae91fc231defe87fde0139bd1c7f298`, deployed closure `f33461679ebbe5322a9030f1f2b17319874d7e03`, Vercel deployment `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`, public rate-aware Playwright 70/70 PASS.

---

## Page 1 - AS-BUILT / System Context

Purpose: show what exists in the delivered product and which integrations are optional.

### Elements

1. Anonymous visitor - untrusted browser user.
2. Donna web experience - Next.js 16 / React website-first UI hosted on the existing Vercel project.
3. `POST /api/chat` - only public chat runtime endpoint.
4. Deterministic application core - admission, validation, routing, boundary policy, reply composition.
5. Typed knowledge and product profiles - `ClientConfig`, `PersonaProfile`, `ExperienceProfile`, approved links and reviewed `publicHighlights`.
6. `FactSelector` adapter - bounded model-facing capability.
7. OpenRouter - external model provider; current approved model is `openai/gpt-4.1-mini`.
8. Chrome Integration Preview - AS-BUILT / OPTIONAL local adapter; fixed approved origins and fixed Vercel API transport, no host-page scraping.
9. n8n human-handoff contract - AS-BUILT / OPTIONAL contract/runtime prototype; not wired to a real mailbox and not in the public chatbot request path.

### Relationships

- Visitor -> Donna web experience -> `/api/chat` -> deterministic application core.
- Core <-> typed knowledge/product profiles.
- Core -> `FactSelector` only for grounded topics.
- `FactSelector` -> OpenRouter with numbered approved facts and requests fact indices only.
- Returned indices -> core -> exact approved facts/links -> browser UI.
- Chrome preview -> fixed public `/api/chat` endpoint; it does not gain factual authority.
- n8n is shown dashed/optional and not connected as an active delivery path.

### Non-claims

No auth, database, CRM, vector store, persistent chat history, autonomous tool loop, GraphRAG, or real email delivery exists in the r15 public runtime.

---

## Page 2 - AS-BUILT / Runtime & Trust

Purpose: make the deterministic/probabilistic trust boundary explicit.

### Request path

1. User message and bounded history enter the browser UI.
2. `/api/chat` applies content-type, byte, schema/history, rate and deadline admission controls.
3. Core policy classifies deterministic boundaries first: greeting, pricing/account/private, unsupported/unknown, clarification, or grounded topic.
4. Boundary/clarification/greeting paths return deterministic client-owned copy; persona may add only bounded tone where permitted.
5. Grounded path resolves one reviewed knowledge entry and passes only numbered approved facts plus bounded history to `FactSelector`.
6. OpenRouter returns strict JSON fact indices, not free-form business claims.
7. Provider adapter validates indices, deadlines, response shape and spend/budget controls.
8. Core reassembles approved facts and exact allowlisted links.
9. Persona may append at most one preconfigured diagnostic question after a grounded answer, subject to opt-out.
10. UI renders inert text; only exact approved URLs become links.

### Trust zones

- Untrusted: user input, external website/research text before manual promotion, model response.
- Deterministic authority: validation, routing, ClientConfig facts/boundaries, approved-link allowlist, response policy.
- External services: OpenRouter and Vercel.
- Fail-closed rule: malformed/expired/over-budget live provider configuration does not silently fall back to fake live behavior.

### Operational limitation

Application rate-limit and budget reservations are process-local in the current serverless runtime. They are best-effort across horizontal instances; provider-enforced key limits remain the stronger spend boundary.

---

## Page 3 - AS-BUILT / Component Architecture

Purpose: map source ownership and dependency direction.

### Layers

**Presentation**
- `app/` - Next.js App Router shell, page, `/api/chat`, `/api/health`, styling/icon.
- `src/ui/` - reusable Donna/assistant interaction and presentation state.

**Composition & configuration**
- `src/config/` - client facts, provenance, topics, links, public highlights and deterministic boundaries.
- `src/product/` - product registry/composition, PersonaProfile, ExperienceProfile, one-step proactive guidance and safe browser projection.

**Domain/core**
- `src/core/` - validation, deterministic routing, limits/text policy and response rules. No provider credentials or React ownership.

**Server orchestration**
- `src/server/` - HTTP-safe orchestration, IO/error mapping and process-local rate limiting.

**Provider adapters**
- `src/provider/` - `FactSelector` contract, deterministic mock and OpenRouter implementation/configuration.

**Optional adapters**
- `extension/` - Chrome Manifest V3 preview adapter, fixed Cadre origins and fixed endpoint.
- `integrations/n8n/` - consent-checked structured handoff contract prototype; no real recipient/provider integration.

**Governance / delivery**
- `.github/workflows/` - CI plus gated exact-SHA production delivery workflow.
- `graph-harness.*`, `progress/`, `evidence/`, `tools/graph-adapter/` - execution governance only, not chatbot runtime dependencies.

### Dependency direction

Presentation -> server orchestration -> core -> typed configuration/product composition.
Grounded core path -> provider contract -> OpenRouter adapter.
Optional adapters depend on public/capability contracts and do not own core policy.
Governance validates and releases the runtime but is outside request execution.

---

## Page 4 - AS-BUILT / Engineering Control Plane

Purpose: explain how Graph Engineering turned source changes into evidence-backed release state.

### Lifecycle

Owner scope / dated authorization -> Graph Harness node READY -> Producer -> Critic / Red Team -> Fixer when required -> Independent Verifier -> Release Gate -> persistent evidence -> next READY node.

### r15 release path

- r13 invitation change reached independent verification and exposed 68/70 Playwright: mobile nudge hidden by historical `<=430px` CSS.
- r14 repair passed focused checks but independent critic returned CHANGES_REQUESTED for sub-12px important copy.
- r15 repair restored >=12px important mobile invitation/trust copy and kept the launcher icon-only.
- Detached verification: 302/302 Vitest, 70/70 Playwright, 73/73 extension tests, 24/24 synthetic extension checks, build/typecheck/lint/Graph PASS.
- Audited Git publication -> GitHub CI -> repository release gate -> existing Vercel project -> anonymous marker checks -> rate-aware 70/70 public Playwright -> post-DONE integration-proof PASS.

### Explicit operational gap

Automated GitHub production CD is implemented but still fails closed before Vercel because the GitHub `production` environment lacks the existing-project `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` binding. Manual exact-project production delivery is proven. The diagram must show this as an automation gap, not a product/runtime failure.

---

## Page 5 - TARGET / NOT DEPLOYED / AWS Reference Architecture

Purpose: show a credible AWS migration/production target without implying it exists today.

### Design goal

Preserve the current stateless Next.js/Node application, deterministic core, typed configuration and `FactSelector` provider boundary. Migrate hosting/edge/operations first; do not force a database, vector store, auth layer, CRM, or model-provider change merely because AWS is used.

### Proposed request path

Internet user -> Route 53 -> CloudFront -> AWS WAF -> Application Load Balancer -> Amazon ECS service on AWS Fargate tasks in private subnets across two Availability Zones -> external OpenRouter over controlled outbound HTTPS.

### Platform services

- ACM: TLS certificate for the public hostname/CloudFront or ALB as appropriate.
- VPC with two AZs.
- Public subnets: ALB ingress and NAT Gateway egress path.
- Private subnets: ECS/Fargate application tasks.
- ECR: immutable application container images.
- Secrets Manager: `OPENROUTER_API_KEY` and other server-only runtime secrets; never baked into image/source.
- IAM: least-privilege task/deployment roles and GitHub Actions OIDC trust instead of long-lived AWS access keys.
- CloudWatch: application logs, metrics and alarms.
- GitHub Actions: build/test/release gate -> push exact image to ECR -> update ECS service only after gates pass.

### Optional future scale control

ElastiCache/Redis may be introduced later for distributed rate limiting or shared budget reservations if horizontal scale requires stronger cross-instance enforcement. It is **OPTIONAL FUTURE**, not needed for functional parity and not part of r15 AS-BUILT.

### Deliberate omissions

No RDS/Aurora/DynamoDB is required for parity because r15 has no application database. No Bedrock migration is assumed; the existing `FactSelector` keeps OpenRouter as the external provider unless a separately evaluated provider adapter is approved later. No Kubernetes/EKS is required for this small stateless service.

---

## Lucidchart document contract

The canonical architecture deliverable is one editable Lucidchart document titled **Donna Architecture Pack - r15** with seven pages in this order:

1. `AS-BUILT - System Context`
2. `AS-BUILT - Runtime & Trust`
3. `AS-BUILT - Component Architecture`
4. `AS-BUILT - Engineering Control Plane`
5. `TARGET - AWS Reference (NOT DEPLOYED)`
6. `AS-BUILT - Runtime Request Sequence`
7. `AS-BUILT - User Journey & Operating Modes`

Every page carries an explicit truth/status banner or equivalent scope label. The AWS page uses official AWS 2024 Lucid shapes for AWS services/resources. No AWS service is represented as deployed on an AS-BUILT page. Pages 6 and 7 are deliberately part of the same master document so request-time behavior and user-visible operating modes can be reviewed without following a companion-file link.

## Lucidchart delivery artifact

Editable document: `Donna Architecture Pack - r15`

- Canonical Lucid document ID: `bd103b7c-614d-4e48-9cd0-e5ede867f924`
- Edit URL: `https://lucid.app/lucidchart/bd103b7c-614d-4e48-9cd0-e5ede867f924/edit`
- View URL: `https://lucid.app/lucidchart/bd103b7c-614d-4e48-9cd0-e5ede867f924/view`
- Pages: **7**
- Visual QA: all seven pages exported and inspected. Page 6's alternative fragment and Page 7's boundary copy were repaired after visual review for legibility.
- Historical documents `3991f2c1-fc1d-4cad-ab01-eec0d3296bfc` and `66ba9fb3-c567-40b0-9c06-1b40ade57daf` are retained in Lucid as explicitly **Superseded** history and are no longer canonical.

This Lucid artifact is documentation only. It does not modify or redeploy the frozen r15 application.

---

## Page 6 — AS-BUILT Runtime Request Sequence

The sequence page follows the actual frozen r15 request path using lifelines, numbered calls and a visible `alt` fragment.

### Participants

1. User
2. Donna Web UI (`src/ui` + `app/page.tsx`)
3. `POST /api/chat` (`app/api/chat/route.ts`)
4. `createChatHandler` (`src/server/chat.ts`)
5. Policy + Router (`src/core/policy.ts` + `src/core/route.ts`)
6. Client/Product Config (`src/config` + `src/product`)
7. `FactSelector` (`src/provider`)
8. OpenRouter API

### Sequence semantics

User submit -> bounded JSON request -> request deadline/rate/content/schema admission -> active product/client/persona resolution -> deterministic `decide(...)` + `composeReply(...)` -> alternative:

- **grounded:** bounded `FactSelector.selectFacts(...)` -> OpenRouter key metadata check -> strict-schema `/chat/completions` -> validated fact indices -> exact approved fact assembly -> approved links -> optional one configured proactive question;
- **non-grounded:** deterministic greeting/clarification/boundary/unsupported copy -> optional tone-only persona lead.

Both paths converge on app-owned reply composition and safe rendering. Invalid input, timeout, malformed provider output, expired/over-budget configuration and provider faults use controlled fail-closed behavior instead of fabricating a live answer.

## Page 7 — AS-BUILT User Journey & Operating Modes

This page is intentionally non-code-centric. It shows what a visitor can actually do:

- open the public Donna experience without login;
- ask a supported public/business question or select a suggested question/topic;
- receive a grounded answer from reviewed public facts and approved links, optionally followed by one configured question;
- receive deterministic clarification/boundary handling for pricing, account/private, unsupported or ambiguous requests;
- continue within bounded in-request history or leave/reset without persistent cross-session memory in the app.

It also separates the **AS-BUILT / OPTIONAL** Chrome preview and n8n handoff prototype from the normal public website path, and explicitly lists capabilities r15 does not provide.

