# P1 Contract Red-Team Review

Result: **FAIL — repair required**

Reviewed implementation: `be746da4e90b83b0e3f4287f62418f28060e2772`.

## Finding P1-CRIT-001 — proactive step shape is too permissive

The contract correctly caps `maxSteps` at one and requires a configured client topic, but `proactive.byTopic` is still `Record<string, string>`. A trusted-but-mistaken profile can therefore encode multiple instructions, arbitrary URLs, or action-like copy in the single string while still satisfying the schema. That is weaker than the authorized boundary “one deterministic approved next step; no new facts/actions/links.”

A temporary red-team test supplied `"Do this first. Then visit https://evil.example"` for a valid topic and expected validation to reject it. The current validator accepted it, so the test failed as intended (Vitest exit code 1). The temporary test file was removed after reproduction; the defect is preserved here rather than left as a permanent failing test.

## Required repair

Make proactive guidance structurally narrower for v1: a single bounded **question** object per topic, with no URLs/newlines and a length cap. Runtime behavior in P2 can append at most one such question after a grounded answer. A future action/suggestion type should be a separately reviewed contract, not free-form text.

No finding against ClientConfig ownership, theme hex validation, deep freeze, or the allowlisted registry/fallback behavior.
