# P3 Productization Red-Team Review

Result: **FAIL — repair required**

Reviewed implementation: `4fac5411e1a326023b278f5d7b37a81f9d89841d`.

## Finding P3-CRIT-001 — presentation identity is not bound to persona identity

The shell is correctly profile-driven and the client projection hides persona rules, but the composition validator currently permits a product with persona `Scout` and visible `experience.assistantLabel = "Donna"`. That means behavior and displayed identity can silently drift while every individual schema remains valid.

A temporary red-team test cloned the valid Acme + Scout profile, changed only its visible assistant label to `Donna`, and expected `validateProductProfile` to reject the inconsistent composition. The current validator accepted it, so the test failed as intended (Vitest exit code 1). The temporary test was removed after reproduction.

## Required repair

For this v1 product contract, bind the visible assistant label to the persona name at product-validation time. A later product version can introduce a separately modeled display-name/role alias if needed, but identity drift should not be implicit. Add a permanent regression test.
