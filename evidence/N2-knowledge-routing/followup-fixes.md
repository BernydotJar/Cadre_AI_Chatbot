# N2 follow-up fixes — 2026-09-08

Role: implementer/fixer. This addresses the independent verifier's remaining P2 singular-agent access/status cases. It does not replace prior reports, constitute independent verification, or close N2.

## Narrow repair

- Added singular `my agent` and `my ai agent` to the existing portal keyword family, alongside the existing plural forms. The three reported access/login questions now receive the configured no-access/no-verified-portal boundary and only the approved contact link.
- Added request-shaped personal-agent status phrases to the existing account boundary: `when will my agent` / `when will my ai agent`, `my agent status` / `my ai agent status`, and `is my agent ready` / `is my ai agent ready`. These redirect to the human channel without reporting an invented status or timeline.
- Added regressions for the verifier's exact questions, related sign-in/status wording, and `Can you build an AI agent?`, which retains the overview/services answer.

Authored source/test changes are limited to `src/config/cadre.ts`, `tests/core/route.test.ts`, and `tests/core/policy.test.ts`. No core logic, schema, knowledge facts, links, dependencies, environment, Git history, or ledger changes were made by this follow-up. No network or paid calls were made.

## Actual checks

All commands ran from the repository root using `rtk proxy`.

| Command | Result |
| --- | --- |
| `npm test -- tests/core/route.test.ts tests/core/policy.test.ts` after adding regressions and before config repair | Exit 1 at 19:43:37 America/Guatemala; 12 failed / 71 passed tests across 2 files. Failures reproduced the three exact access/login cases at router and policy level plus six personal status variants. |
| `npm test` after config repair | Exit 0 at 19:43:54; **114 passed tests in 6 files**, Vitest 5.0.0; 322 ms. |
| `npm run typecheck -- --incremental false` | Exit 0, no diagnostics. |
| `npm run lint` | Exit 0, no diagnostics. |

The existing Vite future native-config-loader warning remains non-fatal. No build, browser, provider, or deployment checks were run by this fixer.

The routing vocabulary remains an explicit, finite phrase list. Possessive singular forms follow the same portal-routing convention as existing plural forms; this is not a general parser of arbitrary account-status language. Current account-boundary triggers still outrank normal routing. Independent verification is still required for this changed snapshot.

## SHA-256 snapshot

```text
64d51f114d37ca72d20d80bec139ccae913dd20482ca4f0ad2ad60ab75ada785  src/config/cadre.ts
921b8bc9d9a62b3de47d9113031a91fb1ee2517da5c0a7a0f54134c9a10bb905  tests/core/route.test.ts
d0a4c693fa64a8ffac60b58d4531973d549f6c918d475d015a33a258849e6450  tests/core/policy.test.ts
```
