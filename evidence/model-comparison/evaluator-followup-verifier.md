# Model-comparison evaluator — independent follow-up verification

Date: 2026-09-09 UTC. Role: independent deterministic verifier after the original evaluator critic reproduced two result-integrity defects.

**Verdict: PASS for evaluator/control readiness. No live Gemini/GPT comparison was performed by this verifier.**

Reviewed current `tools/evaluation/compare-models.mjs` SHA-256 `2ce909b6818f601b2a76f6c1a0b1dc1e7c3922570af9cf1a212c0aef14ac8f97`. The verifier executed the unmodified evaluator in an isolated Node VM with synthetic credentials, in-process synthetic OpenRouter responses, virtual artifact writes, and the actual repository policy/provider/handler modules. External HTTP requests: 0. Real credential reads: 0.

Command:

```sh
node --experimental-vm-modules evidence/model-comparison/evaluator-followup-probe.mjs
```

Result: exit 0. Machine-readable output: `evidence/model-comparison/evaluator-followup-results.json`.

Four targeted modes passed their assertions:

1. **Valid reconciled control:** 18 synthetic completion attempts, 20 synthetic metadata reads, all contracts pass, accounting `RECONCILED`, both models decision-eligible.
2. **Wrong empty-input copy:** both empty rows fail `exactPolicy` while retaining `zeroInference=true`; both models become decision-ineligible; recommendation is null.
3. **Unexpected final key delta:** accounting becomes `UNEXPECTED_KEY_DELTA`; overall result becomes `ACCOUNTING_NOT_RECONCILED`; both models decision-ineligible; recommendation is null.
4. **Unavailable final metadata:** accounting becomes `METADATA_UNAVAILABLE`; overall result becomes `ACCOUNTING_NOT_RECONCILED`; both models decision-ineligible; recommendation is null.

This directly closes the two earlier reproduced false positives: empty validation is no longer status-only, and accounting is now an eligibility gate rather than passive telemetry.

A separate IBM Granite 3.3 2B review was also retained under `evidence/N3-chat-api-adapter/granite-evaluator-verifier-{request,response}.json`. Granite returned `CHANGES_REQUESTED`, but its findings contradicted the supplied/current controls (for example, it claimed failed models could be included even though `decisionEligible` excludes them). That model review is preserved as a rejected critic result, not relabeled as a pass and not used as gate evidence.

Live A/B remains a distinct authorized operation that needs the OpenRouter credential in the executing environment. This verification establishes only that the bounded evaluator is ready to run it safely.
