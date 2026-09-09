# Claude Code architecture / scope critic — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Mode: project-scoped `critic` agent, read-only brief, no edits/deploy/Graph writes/provider inference authorized.
- Purpose: architecture/scope adversarial review of the committed repository.

## Raw reviewer output

No mention there either — confirms the gap. This is sufficient evidence for the review.

## VERDICT: PASS

The architecture is deliberate, evidence-backed, and matches its own documentation at the code level. I found one real documentation-hygiene defect (not a scope/architecture defect) and it does not block release; it's cheap to fix.

### Findings (ordered by severity)

**1. (Low/Medium — documentation consistency) The primary "current state" recovery document omits the only currently-running node.**
- Evidence: `CLAUDE.md:165` and `docs/developer-handoff.md:9-10` both direct a resuming engineer to `progress/checkpoint.md` as *the* place to find "exact current state and blockers." `plan.md` (Start-or-resume, step 1) does the same. But `progress/checkpoint.md` (read in full above) never mentions `PX2-donna-premium-identity`, the premium graph, or `checkpoint-premium.md` — the active, in-review node with a blocked `design-review` gate lives only in `progress/checkpoint-premium.md`, a file not referenced anywhere in `CLAUDE.md`, `README.md`, `docs/developer-handoff.md`, or `docs/release-runbook.md` (confirmed via `grep -n -i "premium" docs/release-runbook.md` → no output). A developer or reviewer who does exactly what the onboarding docs tell them to do will conclude the project has no active WIP beyond the G10 external credential blocker, contradicting `plan.md`'s own "Next action" section.
- Smallest repair: add one line to `progress/checkpoint.md`'s "Terminal state" section pointing to `progress/checkpoint-premium.md` (mirroring how `plan.md` already cross-references it), and add `progress/checkpoint-premium.md` to the read order in `docs/developer-handoff.md` step 2.

**2. (Low — informational, not a defect) `README.md` presents the release as fully "productized and publicly verified" without any pointer to the in-progress premium graph.**
- Evidence: `README.md:5` claims completion in strongly closed language; no mention of PX2/premium anywhere in `README.md`. This is not contradictory (README correctly scopes itself to the shipped P1-P3 baseline, which *is* done), but a reader relying only on README would not discover that a second, not-yet-promoted visual increment exists on a protected preview.
- Smallest repair: optional one-sentence addition near the top of README, e.g. "A separate premium visual increment is in review on a protected preview; the public alias is unaffected." Not required for correctness since README doesn't claim the premium work is absent — it simply doesn't discuss it.

No other contradictions found between CLAUDE.md, plan.md, and progress/checkpoint.md regarding G9/G10/G11/PX2 status — all three are mutually consistent (G10 blocked-at-deploy-check-only; G9/G11 DONE; PX2 REVIEW/BLOCKED at design-review).

### Verified against code (not just docs)
- **Knowledge → Persona → Experience separation**: `src/product/registry.ts` and `src/product/active.ts` implement a genuinely closed allowlist (`resolveProductProfile` falls back to the default on any unrecognized ID; no dynamic import/path construction from env or request input). `src/product/view.ts`'s `chatExperience()` projects only presentation/link/topic metadata — no facts, provenance, or persona rules reach the browser. This matches the documented claim exactly.
- **Deterministic policy vs. model-assisted selection**: `app/api/chat/route.ts` → `src/server/chat.ts` shows the model (`FactSelector`) is invoked only for `decision.kind === "grounded"`, is given only fact indices to choose an order from, and the server unconditionally re-appends every remaining fact (including boundaries) regardless of what the model selected (`chat.ts:94-98`). This substantiates the "bounded, not vector RAG, not agentic" claim; the model cannot drop a safety boundary or invent content.
- **Persona initiative budget = 1 with opt-out**: `src/product/conversation.ts` enforces `maxSteps < 1` shortcut, a hardcoded opt-out phrase list, only fires on `kind === "grounded"`, and de-duplicates against assistant history. This is a real, narrow, testable invariant, not just a doc claim.
- **Scope boundary (no DB/vector/auth/CRM)**: confirmed by directory layout — no `src/db`, no vector/embedding deps in `package.json` (`dependencies`: `next`, `react`, `react-dom`, `zod` only). Corpus (`src/config/cadre.ts`, 185 lines, 6 topics) is small enough that deterministic routing over vector retrieval is a defensible, not merely asserted, trade-off.
- **Chrome/n8n isolation**: `docs/architecture-overview.md`'s system-context diagram explicitly marks n8n as "not wired into public chatbot" and the extension as a separate origin-scoped adapter; this matches directory separation (`extension/`, `integrations/n8n/`) and separate graph ledgers (`progress/extension-graph.*`, `progress/n8n-graph.*`) distinct from the main/product graphs.
- **Release-state consistency across CLAUDE.md/plan.md/progress**: G9 DONE, G10 blocked-only-at-remote-activation, G11 DONE, PX2 REVIEW/BLOCKED — stated identically in all three, and the premium graph's own event ledger (`progress/premium-graph.events.jsonl`, sequence 14, last event `gate.evaluated ... design-review ... BLOCKED`) matches the prose exactly. No inflation of an unresolved gate into a claimed PASS was found.

### DELIBERATE NON-FEATURES (should explicitly stay out of scope)
- Vector database / embeddings / GraphRAG — corpus is 6 topics, curated; no observed retrieval failure justifies added infrastructure.
- Persistent chat history / database / auth / CRM / analytics.
- Autonomous multi-step agent/tool-calling loop — model performs exactly one narrow task (fact-index selection), never controls routing, network calls, or tool execution.
- Real account access, booking, or maturity-score computation.
- Chrome extension host-page scraping, cookie/storage/tab access, or Web Store publication.
- n8n real email delivery / production credentials.
- Treating the Chrome preview or n8n contract as blocking the mandatory public chatbot release.
- Dynamic product-profile resolution from arbitrary request/env-supplied module paths.

### What I did not verify
- Did not execute `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e`, or any `npm run graph -- ...` command — these were denied by the sandbox's don't-ask-mode policy when attempted (`npm test` invocation was blocked); I relied on static reading of code, the committed graph event ledgers (`progress/*.events.jsonl`), and prior evidence files rather than re-running them. I did not independently reproduce the claimed 279/279 Vitest or 52/52 Playwright counts.
- Did not inspect the live public Vercel deployment or the protected PX2 preview URL (no network egress attempted).
- Did not read `docs/component-inventory.md`, `docs/chatbot-ux-assessment.md`, `specs/001-support-chatbot/{design,tasks}.md`, `src/config/types.ts`, `src/provider/openrouter.ts`, `src/ui/`, or the full `evidence/` tree in detail — sampled only what was needed to test the specific architectural claims above.
- Did not verify Graph Harness `validate`/`status` CLI output directly (tool invocation denied); relied on reading the raw `progress/*-graph.events.jsonl` files instead, which is a reasonable but not identical substitute for the CLI's replay/validation logic.
- Did not check secrets/env handling beyond reading that `.env.local`/`.codex` are gitignored by policy statement; did not run `git status` for untracked secret files beyond the top-level `git status` already shown as clean.
