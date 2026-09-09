# N3 implementation and coordinator verification

Date: 2026-09-08 (local). Source commit: `bddb6fe61f4fc5137a5cfe2546eaaac264616e5f`.

## Provenance and gate status

The real `/root/n3_producer` subagent implemented the provider/server/API modules and initial integration/rate-limit tests. Its turn then stopped with the tool-reported error `Your workspace is out of credits. Add credits to continue.` It did not produce a final completed report. The separately dispatched `/root/n3_critic` and `/root/ui_research` stopped with the same error and produced no completed review or research report.

The coordinator recovered those actual files, finished mock provider tests, reviewed the implementation locally and repaired a request-media-type omission. This is coordinator verification, NOT independent verification or a completed Critic/Red Team gate. No substitute agent run, human approval or authentic review signature is invented. N3 cannot be marked done until a separate-context critic/verifier completes its work.

## Implementation

- `src/provider/`: narrow fact-selector interface, synthetic mock and server-only OpenRouter fetch adapter. It requests strict fact indices and locally rejects bad structures, invalid indices, duplicate indices, HTTP 200 error envelopes, incomplete outputs and unsafe accounting. All approved topic facts and boundaries remain in the answer; links come only from configuration.
- `src/server/`: actual streaming UTF-8 size bounds for requests/upstream responses, cancellation and a total deadline, fixed-window admission with bounded cardinality, safe client errors and no implicit live-to-mock fallback.
- Live preflight requires a finite non-resetting provider key limit <=$5, coherent usage and remaining allowance, plus a $0.50 reserve. Process-local reservations are conservative best effort, not a distributed hard limit. The key-side limit is the hard ceiling.
- One retry only for explicit 429/503 rejection, with bounded delay. Transport/timeout ambiguity, 408/500/502/504 and malformed 200 responses do not retry. Unknown outcomes consume the local reservation conservatively.

## Local review repair

The route originally accepted JSON-shaped bodies with `text/plain`, form media types and `application/jsonp`. Four coordinator regression tests reproduced HTTP 200 where 415 was required. Enforcing the exact `application/json` media type (allowing parameters) prevents browser cross-site simple POSTs from triggering inference; the route does not grant cross-origin preflight access. This is not authentication and does not stop direct non-browser clients. Incoming rejected bodies are cancelled.

Observed command before repair: `npm test -- tests/api/chat-route.test.ts` — 4 failed, 40 passed, exit 1. After repair, `npm run verify -- n3-content-type` passed all 200 tests, typecheck, lint and production build. The earlier `n3-coordinator` run passed 196 tests and is retained rather than overwritten.

## Retained evidence

- `evidence/runs/n3-content-type/summary.json` and four command-output files: actual 200-test/typecheck/lint/build PASS, mock inference.
- `evidence/runs/n3-coordinator/`: earlier 196-test PASS.
- `evidence/N3-chat-api-adapter/live-local.json`: small live local chatbot run, not public deployment or a browser UX check.
- Built client output scan inspected 9 JS/JSON/map files in `.next/static`; no `OPENROUTER_API_KEY`, `OpenRouterFactSelector` or real OpenRouter-key-shaped values found. This covers the current scaffold bundle, not the future N4 UI.
- Staged scan before source commit checked 22 files: no secret-shaped values or prohibited `.codex` / private environment paths.

Source SHA-256:

```text
319549bbb5108a16edea32536e27e16ba2ec4eb9920139d6e875d96ea95a7fcf  src/provider/openrouter.ts
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
e9e58b1e712a34f1ec1d4e02483e939c8b0db6def25c385bb4dfd4bc11cdfd2b  tests/provider/openrouter.test.ts
```

## Remaining gate work

Restore separate-agent execution, run critic probes, repair real findings, obtain independent verification and record hashed evidence before evaluating code-review PASS. N4 remains dependent on N3; the UI research brief can be prepared now, but it does not close either node. No public URL, public roundtrip, finished UI, source ZIP, deployment or submission is claimed.
