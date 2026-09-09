# P2 Conversational Red-Team Review

Result: **FAIL — repair required**

Reviewed implementation: `02eeee47a56720889a7605b4f4ba58f05d5bd355`.

## Finding P2-CRIT-001 — Donna ignores explicit proactivity opt-out

Donna is structurally capped to one question and cannot add facts or links, but the producer implementation adds the configured question whenever a supported topic is grounded. A user who explicitly says **“Just answer, no follow-up questions please.”** still receives Donna's proactive question.

A temporary red-team test reproduced this with `What does Cadre do? Just answer, no follow-up questions please.`. Routing remained grounded, but the expected absence of Donna's configured overview question failed (Vitest exit code 1). The temporary test was removed after reproduction; this report preserves the failure.

This does not create a factual-safety violation, but it violates the intended product behavior: Donna should be one step more useful, not insist on taking that step when the user explicitly declines it.

## Required repair

Add a deterministic, narrow opt-out check to the persona guidance helper. Explicit phrases such as `no follow-up`, `no questions`, `don't ask`, `do not ask`, or `just answer` should suppress only the optional persona question. They must not change knowledge routing, factual content, links, boundary precedence, or provider calls. Add permanent tests for opt-out and for a normal grounded question still receiving exactly one Donna step.
