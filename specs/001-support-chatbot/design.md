# 001-support-chatbot Design

**Status: `spec_ready` — awaiting human approval. Dependencies listed here are proposals, not installed.**

> **Historical status note (2026-09-09):** this header records the pre-approval design state and is retained for audit history. The specification was subsequently approved and executed; current implementation/release status belongs in the Graph Harness ledgers and `progress/checkpoint.md`. Some dependencies/choices below are therefore historical proposals rather than current-state documentation.

## Approach

One Next.js (App Router) + TypeScript application. A single server route handles chat: validate input → route intent → assemble grounded context from the curated knowledge set → call the provider through a narrow adapter → apply the response policy → return a bounded reply. The chat core is client-agnostic; everything Cadre-specific (brand, topics, knowledge, approved links) lives in one configuration module. The reuse hypothesis — a second client should mean a new configuration, not new logic — is exercised at unit level by a second config fixture (T-N2-3); that fixture demonstrates separation of core and config, it does not prove production multi-client reuse.

Deterministic retrieval over a small curated corpus, deliberately: keyword/intent routing over ~20–40 structured entries is inspectable, testable, and cheaper than embedding search, which this corpus size does not justify. This is grounded synthesis, not a vector-database system, and the docs must not call it one.

## Planned repository layout

```
app/                 # Next.js routes: page, chat API route
src/config/          # client config: brand, topics, approved links, knowledge entries
src/core/            # validation, routing, response policy (pure TS, no network)
src/provider/        # provider adapter: interface, real client, mock, error translation
src/ui/              # chat components and UX states
tests/               # unit + integration (mocked provider); browser smoke separately
```

## Files You May Touch (once approved)

- The layout above, plus root project files (`package.json`, lockfile, `tsconfig.json`, `next.config.*`, `.gitignore` replacement, `.env.example`, `README.md`).

## Files You Must Not Touch

- `test.md` (pre-existing working file at the repository root, owned by the repository user).
- `graph-harness.project.json` / `graph-harness.events.jsonl` once created — modified only through the documented graph lifecycle, never edited freely.
- Any `.env*` file other than `.env.example`.

## Data Contracts

```ts
// Knowledge entry — versioned, with provenance
type KnowledgeEntry = {
  id: string;
  topic: string;              // e.g. "services", "industries", "maturity-index"
  facts: string[];            // verified statements only
  approvedLinks: { label: string; url: string }[]; // only these may render
  source: { origin: string; retrievedAt?: string }; // e.g. "https://cadre.ai/", "2026-09-08"
};

// Chat API
type ChatRequest  = { messages: { role: "user" | "assistant"; content: string }[] }; // bounded count & length
type ChatResponse = { reply: string; kind: "grounded" | "redirect" | "clarify" | "decline" | "error" };
// Policy outcomes map 1:1 onto kind: "decline" is a policy refusal (e.g. an unverified
// price/security claim was requested); "error" is a transport/provider failure, never a policy outcome.
```

- History is truncated server-side to a fixed window; output tokens are capped; requests carry timeouts and one bounded retry.
- The system prompt is assembled server-side from config + routed knowledge; client input is interpolated only as data.

## Dependencies (proposed — require approval before install)

- `next`, `react`, `react-dom`, `typescript`
- `zod` (boundary validation)
- Provider SDK — pending decision U1 (adapter interface is SDK-agnostic either way)
- Dev: `vitest` (unit/integration), `@playwright/test` (browser smoke), `eslint`

## Knowledge seeds (verified 2026-09-08 unless marked unresolved)

- Official domain `https://cadre.ai` (`cadreai.com` 301-redirects there).
- Services: AI Strategy (`/strategy`), AI Leadership & Facilitation (`/leadership-facilitation`), AI Engineering (`/ai-engineering`), AI Agents (`/agents`).
- CTAs: "Talk to an AI Strategist" and "Get Your AI Maturity Index" → `/contact`.
- Other official pages: `/case-studies`, `/articles`, `/about`.
- Industries and departments served as published on the site.
- **Unresolved**: public client-portal URL — none has been verified for this knowledge set (U6), so S3 routes to the official contact page without claiming a portal does not exist; third-party scheduling link (none verified; `/contact` is the verified path); certifications/security policy details (none verified — S5 answers stay within verified facts).

## Rate limiting and abuse control

Per-client (IP-keyed) fixed-window limit at the chat route. On typical serverless hosting this state is process-local — a best-effort control, not a guarantee; documented as such (AC7).

## Risks

- Curated corpus can go stale → every entry carries provenance and retrieval date; refresh is a content change, not a code change.
- Provider variability → adapter isolates it; mock keeps the test suite deterministic; live behavior is checked by a small, budgeted evaluation matrix (below) once spending is approved (U2).
- Injection attempts → response policy + data-only interpolation + text-only rendering; covered in the evaluation matrix.

## Verification Plan

Commands (exact scripts confirmed at N1): `npm run lint`, `npm run build`, `npm test` (unit/integration with mocked provider), `npx playwright test` (browser smoke), plus an anonymous check of the deployed URL.

Evaluation matrix (frozen before tuning; mock vs. live results recorded separately):

| Case | Expectation |
|------|-------------|
| S1–S5 happy paths | Grounded answer or verified redirect per requirements |
| S6 unknown / account-specific | Boundary + safe redirect; no credential solicitation |
| Multi-turn ambiguity | One clarifying question, then grounded answer or redirect |
| Unverified price/security claim requested | Explicit decline + redirect |
| Link fabrication pressure ("give me the portal login URL") | Only approved links; honest boundary |
| Prompt injection (override, smuggled instructions in input) | Policy holds; data treated as data |
| Empty / oversized input | Validation feedback, no provider call |
| Provider error / timeout | Safe error + retry path (AC6) |
