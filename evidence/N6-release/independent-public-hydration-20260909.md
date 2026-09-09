# Independent public browser verification — hydration release

Date: 2026-09-09 UTC. Role: independent verifier.

**Verdict: PASS for the 38 selected public UI cases, with chat API interception and no live inference in this suite.** All 19 selected cases ran in both desktop and mobile projects. This is fresh evidence after the hydration repair; all prior reports remain unchanged.

## Target and authority

Public target: https://cadre-ai-chatbot-tawny.vercel.app

The coordinator declared deployment READY before execution and supplied deployment ID `dpl_B1pG38nm6xVYSbg1cjSTasgLyxfj`, unique URL `cadre-ai-chatbot-r0tlmahc4-cadre-ai3.vercel.app`, and runtime core identifier `c6f781c`. Those deployment identifiers are coordinator-supplied, not independently read from Vercel by this verifier. This verifier directly exercised the public alias.

No build, local server, deployment, Git/ledger/source/test changes, environment-file read, secret inspection or live model call was made by this suite. Its only project artifact is this newly named report. Normal test artifacts were directed to a unique temporary directory.

## Selection safety and actual commands

Read `playwright.config.ts`, `e2e/chat.spec.ts` and `e2e/hydration.spec.ts`. With an external base URL the configuration does not start a local web server; retries are zero. The exact excluded names were verified:

- `anonymous conversation uses the real server and official links`
- `all six entry points are present and clarification preserves an ordinal follow-up`

Those are the two cases per viewport that send chat requests without interception. Every remaining sending case intercepts `**/api/chat` before sending, either fulfilling a controlled response or aborting the request; the layout-only and JavaScript-disabled cases do not submit. The delayed-JavaScript hydration case also intercepts its first message. Thus the selected suite does not exercise real inference.

Initial selection command:

```sh
rtk proxy env E2E_BASE_URL=https://cadre-ai-chatbot-tawny.vercel.app npm run test:e2e -- --grep-invert 'anonymous conversation|all six entry points' --list
```

It listed exactly 38 cases in two files, then exited 1 because the configured JSON reporter could not open the existing project output path under the resumed sandbox:

```text
Total: 38 tests in 2 files
Error: EPERM: operation not permitted, open '[project]/test-results/e2e-results.json'
```

No browser or network tests ran during that listing. The actual run used a list-only reporter and a unique temporary artifact path, preserving earlier JSON evidence:

```sh
rtk proxy env E2E_BASE_URL=https://cadre-ai-chatbot-tawny.vercel.app npm run test:e2e -- --grep-invert 'anonymous conversation|all six entry points' --reporter=list --output=/tmp/cadre-public-hydration.DwEtAB/artifacts
```

This run used scoped sandbox approval to launch Chromium, fetch the public site and write temporary artifacts. Actual output:

```text
Running 38 tests using 1 worker
38 passed (31.7s)
Exit: 0
```

The NO_COLOR/FORCE_COLOR warning was nonfatal. No failed-test retry occurred.

## Coverage actually passed

The 17 retained chat cases per viewport cover loading and duplicate Enter, failed-turn retry, network failure, Stop and late-output suppression, malformed output, inert model text and exact link allowlisting, blank/multiline/IME input, reset without storage, layout bounds, bounded history/composer, reduced-motion long output, isolation from older operations, Jump-to-latest keyboard focus, welcome/reset position, keyboard Topic/Retry focus, and client timeout.

Both additional hydration cases passed in both viewports:

1. Hold JavaScript chunks, verify visible but disabled textarea, Send and all six topics with Preparing chat guidance and zero requests. Release scripts; wait for editable readiness; fill the exact 20-character question; one Enter yields exactly one intercepted payload and one controlled answer with no page errors.
2. Disable JavaScript in a fresh context that inherits the project viewport; verify disabled chat controls, all six topics and the visible official contact fallback.

Desktop configuration uses Desktop Chrome; mobile uses 360 x 800 with mobile/touch settings. A separate bounded live-browser report records the actual browser version and real one-shot result. The synthetic 38-case suite is not presented as real API or provider verification.

## SHA-256 snapshot and limitations

The following local files matched before and after this run, using:

```sh
rtk proxy shasum -a 256 src/ui/support-chat.tsx e2e/chat.spec.ts e2e/hydration.spec.ts playwright.config.ts
```

```text
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
ef68f6a3a9f78e338ef0b2e93c58698dbab532428a70b9abe8f1b0c902cd0a33  e2e/hydration.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
```

These hashes identify the inspected local source/tests/configuration, not an independent cryptographic attestation of every deployed bundle. Direct public behavior was tested as stated above.

No unit/type/lint/build checks were rerun by this public verification. No additional real conversation is authorized by this report. The single separately authorized live attempt is recorded in `independent-live-hydration-20260909.md`; the older inconclusive attempt and hydration diagnostic are preserved.

