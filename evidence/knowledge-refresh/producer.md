# Knowledge refresh implementation

Coordinator implementation, source commit `9b5749c`, 2026-09-08 local / 2026-09-09 UTC.

Reopened N2 through supported graph transitions after the official source audit. Preserved six topics and the existing API, policy and provider interfaces. Added source-backed service context, Hospitality and B2C fit, portal description, maturity-result details and attributed security/privacy text. Removed the unsupported unconditional contact follow-up promise. The new privacy policy link does not assert that Cadre's policy governs this independently hosted app.

The first 233-test run found one old API assertion still expecting the removed security-unknown sentence: 232 PASS, 1 FAIL. Replaced that expectation with the new explicit certification/client-control caveat; the security boundary itself was not relaxed. Subsequent 233 tests, typecheck, lint and build passed in `evidence/runs/knowledge-refresh-final/`. Fifteen new tests cover fit aliases, policy scope, capability boundaries, all-fact retention and complete reply caps.

The coordinator's rebuilt mock-server browser suite passed all 38 desktop/mobile cases; `browser.json` retains that run. Separate critic and verifier reports retain their own actual commands, source hashes and limits. These local results do not establish a deployed/live answer or authorize final release closure.
