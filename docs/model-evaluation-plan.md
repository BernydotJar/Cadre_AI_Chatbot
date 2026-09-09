# Model comparison — bounded chatbot evaluation

Owner requested 2026-09-08: compare `openai/gpt-4.1-mini` and `google/gemini-3.8-flash`, keep server-side selection configurable, retain actual token/cost observations, and decide from evidence. This authorizes the temporary local evaluation, not a production model switch.

## Verified inputs and scope

OpenRouter's public model catalog was read on 2026-09-09 UTC. Both exact IDs are available and advertise JSON Schema/structured outputs. Standard listed input/output prices per million tokens: GPT-4.1 Mini $0.40/$1.60; Gemini 3.8 Flash $0.75/$3.75. These are estimates, not invoices. Sources: https://openrouter.ai/openai/gpt-4.1-mini and https://openrouter.ai/google/gemini-3.8-flash. Promotions, caching and reasoning can change realized charges.

The existing app deliberately routes policy/CTAs deterministically and asks a model only to order approved fact indices. Therefore a better general model cannot be credited with deterministic refusals or CTA decisions. This experiment measures this actual product contract, not general model intelligence or tool-calling quality. Neither a million-token context nor tools are needed here.

## Before implementation and execution

1. Allow only the two reviewed model IDs in server configuration; default stays GPT-4.1 Mini. Keep secrets server-only, expiry, $5 hard allowance and $0.50 reserve unchanged. Model-specific price ceilings must feed both routing and reservation estimates; the old $0.50/$2 ceilings would exclude Gemini.
2. Keep the deployed app and .env.local unchanged. Select models only in each temporary evaluation environment. Preserve existing tests and retain small local commits.
3. Use the same 14 cases per model: six official topics; prompt injection; fake portal destination; resolved clarification; missing price evidence; private-account request; unknown topic; first ambiguity; invalid empty input. Nine cases per model should reach inference; five are deterministic control cases.
4. Use the production request contract: temperature 0, 256 output tokens, strict fact-index JSON Schema, no tools, no arbitrary prose, no provider fallback between models. No model-specific prompt tuning in this primary comparison. Reasoning/default behavior remains a potential compatibility/latency difference and must be reported, not silently hidden.
5. Cap the primary experiment at 18 total inference HTTP attempts and $0.15 conservative incremental reservation. Stop on missing allowance or unexpected accounting; never spend the $0.50 reserve. Do not automatically repeat a whole run. Record any provider retry against the same attempt cap; unexecuted rows remain NOT_RUN.

## Prespecified acceptance and decision

- Every successful grounded case must return every expected fact, no unapproved fact, only exact expected links/CTA, and a valid unique in-range index array. No tool call or unsupported action is accepted.
- All deterministic boundary/clarification/validation controls must match the existing policy exactly and incur zero inference. Report these separately from model-dependent rows.
- All 14 application outcomes must match expected status/kind; require 9/9 grounded contract successes to clear this small sample. A failure or timeout is not silently excluded from latency/cost reporting.
- Every grounded application response must fit the existing 20-second server deadline. Report per-case and median/p95 observed wall time, with small-sample caveats; do not claim statistically significant reliability.
- Retain model, case ID, result, safe failure category/status, tokens (input/output/reasoning/cache when provided), provider-reported cost, allowed-fact/link booleans and response hash. Never persist key, raw private provider errors or reasoning text.
- Reconcile response-reported cost with before/after key usage; lag or missing telemetry is explicit. Do not infer historical tokens by dividing dollars by a single blended price.
- Accounting is a separate eligibility gate: missing metadata, incomplete completion cost, a key delta above the reservation/cap, or a discrepancy greater than $0.000001 blocks a model recommendation. A discrepancy can reflect delayed accounting or other shared-key traffic; do not attribute it to this run without evidence. A later read-only metadata reconciliation may resolve lag without repeating inference. Preserve the original observation.
- Among models clearing all thresholds, retain the lower observed inference cost. A production switch requires reviewed evidence; no claim that both were evaluated until the run completes.

## Cost ledger

Separate the owner's reported $7 Claude Code spend from measured OpenRouter chatbot spend. Token counts for the $7 are unknown unless actual billing/token records are supplied. Hosting and other coding-tool costs remain unavailable, not zero. A subtotal of known costs is not a complete project bill.

## Dry-run findings before any spend

The initial draft question “Can you confirm a booking for me?” did not match the keyword router's `book`/`appointment` phrases and safely routed as unknown. The primary booking case was clarified to “Can you book and confirm an appointment for me?” before executing either model. This exposes a shared keyword-coverage limitation, not a Gemini/GPT quality difference; the comparison does not certify arbitrary paraphrases. The original dry run stopped before reading the credential or using network.

A second draft combined “clients” (industry vocabulary) with “portal” and triggered clarification; the primary case uses the existing public matrix's “Where is the client portal?” question. Both preflight discoveries are shared routing limitations, recorded before any inference rather than attributed to either model. No post-result question replacement is permitted.

Before live execution, the independent evaluator critic reproduced two false positives in a synthetic harness: empty-input copy was checked only by HTTP status, and final accounting did not gate recommendations. The coordinator repaired exact validation-copy comparison and added separate contract/accounting verdicts, per-model totals and descriptive latency summaries. The original failed report remains immutable; a fresh independent follow-up is required before spending.
