# Hydration repair — independent source/test critique

Recorded 2026-09-09 UTC (2026-09-08 Guatemala). Role: independent critic; not the repair author or its browser verifier.

**Verdict: PASS for this focused source and regression-test review.** No remaining defect was identified in the inspected readiness change. The [original release FAIL](release-critic.md), [zero-POST live-browser attempt](independent-live-browser.md) and [confirmed diagnostic](hydration-diagnostic.md) remain unchanged. This is not a global N6 PASS or a claim that the public deployment already contains the repair.

## Inspected repair

`src/ui/support-chat.tsx` now uses module-stable `useSyncExternalStore` functions: the server snapshot is false and the client snapshot is true. Initial server HTML and the first hydration render therefore agree on disabled chat controls, with the client snapshot enabling them after initialization. This avoids taking ownership of an already editable DOM draft only after input was entered.

The guard covers all three initial input surfaces: textarea, each topic button and Send. The textarea placeholder and associated help text communicate preparation and a reload/contact fallback. The official contact anchor remains available without JavaScript; existing global disabled-button styling also communicates the disabled state.

The change does not add an automatic submission, a native DOM event workaround, a timer-based readiness guess or a new dependency. It does not reset readiness when clearing a conversation. Existing single-flight ownership, operation identity, Stop `preventDefault` and distinct keys, saved retry, IME handling, bounded history, exact links and activation-time focus handoffs remain intact in the inspected source. No new server, provider, budget or credential boundary is introduced.

## Regression-test critique

The new `e2e/hydration.spec.ts` is separate from the older loaded-page `beforeEach`, so it can inspect the vulnerable phase rather than waiting past it.

- The cold-load test installs JavaScript interception before navigation, waits only for the document commit/visible SSR controls, confirms at least one script is held, and asserts disabled textarea, Send and all six topics with zero chat requests.
- It explicitly releases the script gate, waits for editability, fills the exact 20-character question and checks the React-backed counter before one Enter. The expected request array contains exactly one intact user message, and the synthetic answer must render without a page error. The gate is released in `finally` as well.
- The no-JavaScript test checks disabled controls, all six topics, preparation/contact guidance and the exact visible official contact anchor. The final test now passes the project `viewport` into its new browser context, resolving the initial review concern that both project runs would otherwise use the default viewport.

Both tests are non-paid checks. The cold-load chat route is intercepted; the no-JavaScript page cannot invoke the client chat handler. They test initialization and the first successful interaction, not unrestricted no-JavaScript chat support or comprehensive accessibility conformance.

## Evidence inspected versus work performed

This critic read the final source/test changes and the retained coordinator outputs in [hydration-final](../runs/hydration-final/summary.json). Those outputs record mock-mode `npm test` (233 tests in 10 files), typecheck, lint and production build, all exit 0. The build lists the page, chat and health routes. The existing nonfatal Vite future-config-loader warning remains.

The coordinator additionally reported its full 42-case browser run passing in 11.4 seconds (its session 80993). That is coordinator execution, not a test this critic ran or a substitute for the separate verifier. This critic did not inspect a newly retained raw 42-case browser artifact in this follow-up, so that result is explicitly attributed to the coordinator's report.

Actual commands in this follow-up were read-only `rtk proxy cat`, `rtk proxy rg` and `rtk proxy shasum -a 256` over the named files. No browser, test suite, build, server, deployment, Git, ledger, environment-file read, budget lookup or real network request was performed by this critic. Its earlier eight mock API/source probes remain in the original release report and were not rerun or relabeled here.

## Reviewed final hashes

```text
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
ef68f6a3a9f78e338ef0b2e93c58698dbab532428a70b9abe8f1b0c902cd0a33  e2e/hydration.spec.ts
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
5e2997f5c7b39e76d3d6af0abe8d2746df4734a299662961a79eed565aa5de53  evidence/N6-release/release-critic.md
```

Only this follow-up report was authored for this source-review step. The original FAIL hash was checked and remained unchanged.

## Remaining gates

The independent runtime verifier must check the repaired build, followed by the authorized deployment/public first-interaction verification and appropriate updated evidence. Prior 30-case live/API results and 34 intercepted public-UI results remain dated evidence for their earlier deployment; they do not prove deployment of this changed UI. Archive verification, final release review and human closure remain pending. Separately authorized extension and project-management work are not incorporated into this core-chatbot gate.
