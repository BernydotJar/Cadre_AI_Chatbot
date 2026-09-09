# Provider decision — N3 implementation checkpoint

Owner-approved provider: OpenRouter, exclusively for chatbot inference. No coding-assistance traffic uses this credential.

## Documentation checkpoint (2026-09-08)

- [API contract](https://openrouter.ai/docs/api_reference/overview): server-side Bearer auth, `POST /api/v1/chat/completions`, non-streaming `choices[].message.content`, usage cost.
- [Structured output](https://openrouter.ai/docs/guides/features/structured-outputs): strict JSON schema plus local validation; require compatible providers.
- [Routing controls](https://openrouter.ai/docs/guides/routing/provider-selection): explicit model, parameter requirements and price ceiling.
- [Key limits](https://openrouter.ai/docs/api_reference/limits): read-only `GET /api/v1/key` confirms provider-enforced key allowance.
- [Selected model](https://openrouter.ai/openai/gpt-4.1-mini): `openai/gpt-4.1-mini`. Public models API independently returned input $0.40 and output $1.60 per million tokens, with structured-output support. These are a dated observation, not a perpetual price guarantee.

## Verified credential metadata (no credential value retained here)

Read-only key check succeeded: limit $5, remaining $5, usage $0, no rolling reset. API metadata reported a later expiry than the supplied seven-day instruction. Treat seven days as the operational deadline; do not extend use based on that discrepancy. No inference charge incurred by this check.

## Bounded integration design

Use built-in server-side fetch; no new SDK or dependency. Unknown, account-specific and refusal paths remain deterministic and spend nothing. Grounded responses use the live model to select relevant fact indices from a routed entry, not write unchecked business claims. Render those selected approved facts with required entry context/boundaries and app-owned approved links. This is intentionally extractive model-assisted answering: safer and less conversational than unconstrained rephrasing. Keep that limitation explicit, not hidden behind a generative-answer claim.

Limit history/input/output; fail closed on invalid model structure, credentials, budget metadata or configuration. At most one bounded retry for an explicitly retryable rejection; no retry after an ambiguous timeout to avoid duplicate spend. Retain $0.50 of allowance; key-side $5 limit is the hard ceiling, in-process counters are only best effort. Tests default to mock with synthetic keys; live evaluation is a small explicit run through the chatbot pipeline, never a coding agent.

Deployment stays independently gated. Do not add Terraform, cloud resources, infrastructure dependencies or a public endpoint merely to exercise the provider.
