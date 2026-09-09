# Independent public-evaluator review

Date: 2026-09-08 local / 2026-09-09 UTC. Reviewer: separate `context_docs_critic` agent. **Recheck result: PASS** for the evaluator at the SHA-256 below. This does not establish live inference, anonymous deployed behavior, or release readiness; the coordinator must execute the authorized public evaluation separately.

Reviewed artifact: `evidence/N6-release/public-eval.mjs`.

```text
11ba28096c942dd0c6c031740daec099bc2195ba80adb7e66f3836fe3ffa5676
```

## Original findings retained

The first script revision was not run against any public service by this reviewer. Read-only review and a local extraction of its reply predicates found:

1. **P1 — Unsafe evidence persistence.** Health stored an arbitrary JSON body, and failed chat checks retained unvalidated `kind` text. A server regression exposing secrets could copy them into the evidence artifact.
2. **P2 — False-positive response verification.** The original predicates were reproduced accepting an empty redirect, a decline containing an invented $999 price, a redirect soliciting credentials, and all approved grounded facts plus a fabricated confirmed booking. Status and kind alone did not establish the required behavior.
3. **P2 — Unbounded fetches/body reads.** Health, script, and private-path requests lacked timeouts; response bodies had no size limits.
4. **P2 — Missing post-failure accounting.** Budget-after collection ran only on a completely successful matrix, leaving a failed run without a final observation after possible inference spending.

An intermediate read also identified that a secret in an extra chat-response field could evade reply-only scanning and that default redirect following weakened the fixed-destination constraint. Both were repaired before the recheck snapshot.

## Recheck method

Read the corrected script completely. Ran two `rtk proxy node -e` offline harness invocations, both exit 0. The harness removed import declarations only to provide the corresponding Node functions explicitly, then executed the full script in a VM async wrapper. It preserved the actual local TypeScript loader, configuration, routing/policy, validation, reply comparisons, body reader, checks, failure handling, and finalization logic.

`fetch` returned synthetic `Response` objects. The environment loader was a no-op with a synthetic key; filesystem reads rejected environment-file paths. Delays were immediate callbacks, so this was not a wall-clock spacing test. Artifact writes were captured in memory, and console output was suppressed inside the simulated evaluator. The actual private environment file, credentials, public service, provider API, and `public-live.json` were not read, called, or written by this reviewer.

The valid control used the real policy and validation modules to synthesize the expected wire responses. It ran twice successfully, each time producing exactly **16 chat POSTs, 9 grounded cases, and 2 metadata GETs**. The first run also asserted that every fetch received an abort signal and `redirect: 'error'`, and authorization headers appeared only on the fixed OpenRouter key-metadata endpoint.

## Observed offline outcomes

There were 11 distinct simulated scenarios; the valid control was repeated across both harness invocations.

| Scenario | Expected evaluator result | Observed |
|---|---|---|
| Valid full matrix | PASS | PASS; 16 POST / 9 grounded / 2 budget GET |
| Empty grounded reply | FAIL | FAIL after 1 POST; budget-after attempted |
| Empty S6 redirect | FAIL | FAIL after 7 POSTs; budget-after attempted |
| Invented price in a decline | FAIL | FAIL after 9 POSTs; budget-after attempted |
| Credential request in a redirect | FAIL | FAIL after 7 POSTs; budget-after attempted |
| Extra fabricated booking prose after valid grounded facts | FAIL | FAIL after 1 POST; budget-after attempted |
| Synthetic secret in `kind` | FAIL | FAIL after 1 POST; no raw secret persisted |
| Extra health field containing a synthetic secret | FAIL | FAIL before chat POSTs; no raw secret persisted |
| API body exceeding 65,536 bytes | FAIL | FAIL after 1 POST; budget-after attempted |
| Invalid JSON containing a synthetic secret | FAIL | FAIL after 1 POST; generic error retained |
| Extra chat-response field containing a synthetic secret | FAIL | FAIL after 1 POST; no raw secret persisted |

Every scenario asserted that the captured report contained no synthetic secret. Each run with a successful budget-before observation made its second budget request even when the evaluation failed.

## Resolution assessment

- Health now requires exactly the expected status field and persists only a fixed safe status. Chat responses require exactly `kind` and `reply`; the entire JSON text is scanned, kind is reduced to a fixed enum, and evidence stores checks, lengths, and hashes instead of response bodies.
- Grounded replies must equal a permutation of the complete approved fact set followed by the exact approved link lines. At this snapshot there are at most four facts per topic, so the largest permutation set is 24. Deterministic replies are compared with the real local policy; validation errors use the real request validator. The previously accepted invalid outputs now fail.
- All fetches use a 30-second abort signal and reject redirects. Streamed bytes are bounded: 2 MiB for pages/scripts and private-path responses, 64 KiB for chat, 4 KiB for health, and 16 KiB for budget metadata. Oversized chat-body rejection was exercised offline; abort-signal presence and the configured deadline were checked, without waiting for a real network timeout.
- Budget-after collection is in `finally`, including failed matrices. Failure to obtain that observation marks the run failed. The report keeps the provider-accounting-lag caveat and does not claim an exact per-request invoice.
- The fixed public host, fixed metadata endpoint, 16/9 matrix count, and seven-second spacing formula match the intended bounded check. The script has no upload/deployment operation; local environment contents are not incorporated into outgoing chat payloads or reports.

No unresolved blocking evaluator finding was found at the reviewed hash. Only this report was written for the recheck. No production build, server, Git, ledger, deployment, environment mutation, or real inference operation was performed.
