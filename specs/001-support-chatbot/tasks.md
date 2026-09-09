# 001-support-chatbot Tasks

**Status: `spec_ready` — awaiting human approval. No task below is authorized to start.**

Work is grouped into six deliverable-sized nodes. **Canonical node IDs** are the long forms (`N1-foundation` … `N6-verify-release`), used in `feature_list.json` and, after the transition, in the graph project file; `N1`–`N6` are display aliases for prose. These same definitions — IDs, dependencies, boundaries unchanged — become the graph nodes after approval, following the bootstrap step documented in `plan.md` (D5). Nodes are deliverables, not per-edit steps.

Gating principle: human approval of this spec unlocks all local, mock-first work. U-decisions gate only what they name (see `plan.md`): U3 → deployment, U4 → commits, U1/U2 → provider-specific/live/paid operations. A node whose required checks are incomplete or still authorization-gated stays open (or `blocked`); it is never marked done early, and a pending deploy is never treated as passed.

## N1-foundation (N1) — Application foundation, local

Depends on: human approval of this spec (scope + dependency list). Not gated by any U-decision; committing its results waits on U4, and deployment belongs to `N5-deploy`, not here.

- [ ] T-N1-1 Scaffold Next.js + TypeScript at the repository root; replace the inherited Jekyll `.gitignore` with a Node/Next one; add `.env.example` (names only).
- [ ] T-N1-2 Walking skeleton: page shell + `/api/chat` echo route with schema validation; lint/build/test scripts wired; record real commands in `CLAUDE.md`.

Verification: lint + build + unit test run green locally. Evidence retained.

## N2-knowledge-routing (N2) — Knowledge base and routing

Depends on: N1.

- [ ] T-N2-1 Client config module: brand, supported topics, approved links, knowledge entries with provenance (seeds in `design.md`).
- [ ] T-N2-2 Intent routing and grounded-context assembly over the knowledge set; response policy (grounded / redirect / clarify / decline) as pure functions.
- [ ] T-N2-3 Unit tests for routing and policy, including S6 boundaries and link-allowlist enforcement; a second minimal config fixture exercises the reuse hypothesis (core/config separation) at unit level.

Verification: unit suite green; policy tests cover the evaluation-matrix rows that need no provider.

## N3-chat-api-adapter (N3) — Chat API and provider adapter

Depends on: N1, N2. All work here is mock-first and not gated; only the provider-specific client and any live call wait on U1, and any paid request waits on U2 — until then, mock only, labeled as such.

- [ ] T-N3-1 Provider adapter: narrow interface, real client behind server-side env config, deterministic mock, typed error translation, timeout and bounded retry.
- [ ] T-N3-2 `/api/chat` full pipeline: validate → route → assemble → call adapter → apply policy → bounded response; per-client rate limit with honest documentation.
- [ ] T-N3-3 Integration tests against the mock: happy paths, injection cases, empty/oversized input, provider error/timeout (AC4–AC7).

Verification: integration suite green; config-presence check without printing values.

## N4-ui (N4) — Conversation UI and UX states

Depends on: N3.

- [ ] T-N4-1 One-page chat UI: message list, input, loading, error, retry; keyboard operable; mobile-width friendly; model output rendered as text only.
- [ ] T-N4-2 Browser smoke suite: real conversation flow against the mock, failure and retry states, basic accessibility checks (AC8).

Verification: smoke suite green locally (and against a preview deployment once N5-deploy exists).

## N5-deploy (N5) — Early deployment (authorization-gated)

Depends on: N1 **and U3**. Attempted as soon as U3 resolves; may run in parallel with N2–N4. Explicitly authorization-gated: no deployment before U3, and this node is not done until its checks actually pass.

- [ ] T-N5-1 Configure the approved target and deploy the current state (walking skeleton at minimum); document the deployment pipeline.
- [ ] T-N5-2 Anonymous public-URL verification of the deployment: responds correctly, exposes no credentials or internal errors.

Verification: real deployed-URL check with retained evidence.

## N6-verify-release (N6) — Verification, packaging, release readiness

Depends on: N4 and N5. Live cases additionally need U1 + U2; verified live deployment is mandatory for release.

- [ ] T-N6-1 Run the frozen evaluation matrix live within the approved spend envelope; record model/config, expected vs. observed, and unresolved failures — clearly separated from mock results.
- [ ] T-N6-2 Anonymous deployed-URL verification with a real provider round-trip; no credential or internal-error exposure (AC9).
- [ ] T-N6-3 Component inventory (contract, config surface, invariants, provenance, tests, maturity) added to project docs; README finalized.
- [ ] T-N6-4 Reproducible source archive (AC10), prepared and verified BEFORE requesting closure: build the ZIP outside the source tree with source, lockfile, root `CLAUDE.md` and `plan.md`, tests/specs, sanitized evidence, and usable `.git` history — excluding dependencies, build output, caches, secrets, private inputs, and reference checkouts. Extract into a clean temporary directory; verify Git history and the documented setup/build/smoke checks; record archive size and checksum. Preparation is not authorization to upload or send it.
- [ ] T-N6-5 Release-readiness review against AC1–AC10; present results at the human closure gate.

Verification: all acceptance criteria checked with retained evidence; closure is a human decision.

## Review Tasks (every node)

- [ ] Review against `requirements.md` and `design.md` boundaries.
- [ ] Review verification output; record evidence before the node closes.
- [ ] After the graph transition: per-node producer → critic → fixer → independent verification, with gate evidence recorded in the ledger.

## Stop Conditions

- Ambiguous requirements, scope expansion, or a boundary change → pause, ask, record the decision.
- Missing approval (feature not `approved`, or the specific U-decision unresolved for the operation at hand).
- Verification failure that cannot be repaired within the node's boundary.
- Any need for a new dependency, schema change, or spending beyond the approved envelope.
- A required check is incomplete or authorization-gated → the node stays open or `blocked`; never marked done.
