# N3 independent critic retry

Date: 2026-09-08. Role: independent Critic/Red Team, separate from producer and coordinator. Outcome: **FAIL — one actionable P2 remains** on the source hashes below. No P0/P1 issue found in the examined paths.

This is an actual read-only inspection and independently executed mock review, not the earlier interrupted attempt. Production source, dependencies, Git, graph state, builds, deployment and credentials were not modified or used by this critic. Only this report was created. No `.env.local`, credential values or private input documents were read. No live provider requests occurred; probes supplied synthetic configuration and transport and replaced global fetch with a function that throws.

## P2: accepted conversation history becomes a misleading provider outage

Location: `src/provider/openrouter.ts:128-130`, with history selection at lines 81-84 and error translation in `src/server/chat.ts:24-30`.

The API accepts up to 20 messages of 2,000 UTF-16 units each and a 256 KiB body, then forwards up to 10 messages. However, the adapter nests the conversation JSON inside another JSON string and caps the serialized provider payload at 32 KiB. A history can pass every public input check and still fail this internal cap. That local input overflow becomes `ProviderError("invalid_response")`, which the handler reports as HTTP 503 with “Chat is temporarily unavailable. Please try again…”. Retrying the same conversation cannot work, and the response gives the user no useful way to shorten or reset it. Mock mode accepts the same history, so ordinary mock conversation checks hide the failure.

Independent observed probe:

| History, followed by final user `services` | Request bytes | Public schema | HTTP status | Mock transport calls |
| --- | ---: | --- | ---: | ---: |
| Nine prior 2,000-character ASCII messages | 18,332 | valid | 200 | 2 |
| Nine prior 2,000-character Greek-alpha messages | 36,332 | valid | 503 | 0 |
| Nine prior 2,000-character quote messages | 36,332 | valid | 503 | 0 |

Each row uses a fresh handler, so this is not rate limiting. The failing requests are under the body limit, and the final question is a supported scenario. This affects AC5's clear validation feedback and the intended server-side history truncation, rather than producing a grounding or spending escape.

Recommended bounded fix: remove oldest provider-history messages until the fully serialized payload fits, retaining the final user question and all approved facts/schema. The deterministic policy can still see the full validated history. Alternatively, surface a specific safe 400 validation response when input cannot fit. Keep the existing byte, token, cost and timeout caps. Add regression coverage for Unicode and escaped JSON histories that pass public validation. No dependency or public response-schema change is needed.

## Checks executed

From the repository root:

```sh
rtk proxy npm test -- --reporter=verbose tests/provider/openrouter.test.ts tests/api/chat-route.test.ts tests/server/rate-limit.test.ts
```

Result: **3 files, 92 tests passed**, exit 0. Vitest emitted a non-failing warning about future Vite native config loading; this run used the current working configuration.

Additional independently authored probes ran in two `rtk proxy node -e` invocations using the installed TypeScript compiler for in-memory module transpilation. They created no test files and did not invoke the network:

- A stalled provider response body reached the shared 20,000 ms deadline using an injected clock, returned the typed `timeout` error, invoked stream cancellation exactly once, and left zero clock timers.
- Twenty concurrent calls sharing one adapter and synthetic remaining allowance of $0.503 made 20 metadata checks but only one inference request; 19 rejected with `budget`. This verifies the process-local reservation behavior, not a distributed hard cap.
- All six topic entries returned 200 when the selector prioritized only the last fact; every approved fact in each selected entry remained in the reply. Reply lengths were 307–550 characters. Preserving all facts is intentional extractive model-assisted behavior, not a defect.
- A request with declared `content-length: 1` and actual body larger than 256 KiB returned 413. Invalid UTF-8 returned 400.
- Missing content type, `application/jsonp`, and `application/json, text/plain` returned 415. Case-insensitive `Application/JSON; charset=utf-8` returned 200. The JSON content-type guard exists in the reviewed source.
- The table above reproduced the unresolved history serialization failure with synthetic live-mode configuration and zero upstream calls in both failing cases.

Existing tests independently rerun here also cover malformed completion schemas, duplicate/out-of-range fact indices, impossible cost/token metadata, a maximum of one retry for explicit 429/503 rejection, no retry for ambiguous timeout/network/permanent failures, safe exception redaction, incoming stream timeout, bounded clients, proxy opt-in, canonical multi-turn clarification and injection pressure.

## Reproducer for the unresolved finding

Run the following command from the repository root. This reproducer uses only installed dependencies, source reads, synthetic configuration and in-memory responses. It does not load environment files.

```sh
rtk proxy node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = process.cwd();
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, parent, ...rest) {
  return resolve.call(this, id.startsWith("@/") ? path.join(root, "src", id.slice(2)) : id, parent, ...rest);
};
require.extensions[".ts"] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename
);
global.fetch = async () => { throw new Error("UNEXPECTED REAL FETCH BLOCKED"); };
const { createChatHandler } = require("./src/server/chat.ts");
const { parseChatRequest } = require("./src/core/validate.ts");
const now = Date.parse("2026-09-09T00:00:00Z");
const clock = { now: () => now, setTimeout, clearTimeout };
const env = {
  CHAT_PROVIDER: "openrouter",
  OPENROUTER_API_KEY: "synthetic-only",
  OPENROUTER_KEY_EXPIRES_AT: "2026-09-15T00:00:00Z"
};
(async () => {
  for (const [label, char] of [["ASCII", "a"], ["Greek", "α"], ["quote", String.fromCharCode(34)]]) {
    let calls = 0;
    const messages = Array.from({ length: 9 }, (_, i) => ({
      role: i % 2 ? "assistant" : "user", content: char.repeat(2000)
    }));
    messages.push({ role: "user", content: "services" });
    assert.equal(parseChatRequest({ messages }).ok, true);
    const body = JSON.stringify({ messages });
    const fetcher = async (url) => {
      calls++;
      return String(url).endsWith("/key")
        ? Response.json({ data: { limit: 5, limit_remaining: 5, usage: 0, limit_reset: null } })
        : Response.json({
            choices: [{ finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ fact_indices: [0] }) } }],
            usage: { prompt_tokens: 400, completion_tokens: 12, cost: 0.0002 }
          });
    };
    const response = await createChatHandler({ env, clock, fetch: fetcher })(new Request("http://localhost/api/chat", {
      method: "POST", headers: { "content-type": "application/json" }, body
    }));
    console.log(JSON.stringify({ label, bytes: Buffer.byteLength(body), status: response.status, calls, response: await response.json() }));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

## Scope and limitations

Read `CLAUDE.md`, the specification index, requirements, design and tasks, and `progress/provider-decision.md`; inspected provider, server, API-route, core/config source and relevant tests. The historical draft specification headers were interpreted using the approved index. The review did not use another role's report as evidence of passing tests.

No evidence was found that the current route returns credentials, upstream raw error text or model-authored business claims. Source inspection found provider imports confined to server/API paths and no client module consuming them. This is source-level evidence: no browser bundle, deployment, real provider availability, key metadata or public ingress behavior was verified by this critic. The UI was still a placeholder in the inspected snapshot, and N4/N5/N6 are outside this N3 review.

The rate limiter and local reserve are explicitly best effort and process-local. The configured provider-side $5 key limit is the intended hard ceiling; this critic did not read or independently verify the actual key. No auth, database or distributed limiter is demanded for this anonymous MVP. Existing deliberate extraction and all-fact retention remain within the approved provider decision.

The P2 remains unresolved in this report. Re-run the reproducer and targeted tests after the fix, and record a separate fixer/verification outcome against the new source hashes before closing N3.

## SHA-256 snapshot

The production hashes were checked again after the independent probes and were unchanged during the review.

```text
d6dc7fd1acb85af0320a3bc6b902620f2e5232000a82512f9fce1e6da6c418e5  src/provider/config.ts
e75f3331c85daa74c8bcd7564291759a2be0300bf81f6cc5f8f0199e32fb5ae5  src/provider/types.ts
7f40b5e9d39add123635a3a53282393fb08527eddbe843d975999dcf2455840f  src/provider/mock.ts
319549bbb5108a16edea32536e27e16ba2ec4eb9920139d6e875d96ea95a7fcf  src/provider/openrouter.ts
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
33be72335dc4bcbe5d5f0ad7ad1e9245c1ec36f80d4aa55e5481dc773b6a57af  src/server/io.ts
cb2ccc473d6b24ccef30c7b60739030edc0e30e712bc15eae47c9911e6aa03e3  src/server/rate-limit.ts
0d779737aeb71a3c7ecc46ddb10fbdeec2954130de4e198b673d8b689e07860b  app/api/chat/route.ts
e9e58b1e712a34f1ec1d4e02483e939c8b0db6def25c385bb4dfd4bc11cdfd2b  tests/provider/openrouter.test.ts
6d23f67c800a8f6047d74c3780287c190cfe7e8eea6ecc71451e89abf0d67f12  tests/api/chat-route.test.ts
9c18d0c5216765e9f77c8951841b8febd7e974c0e4bec6dcd652030b15a5d3ad  tests/server/rate-limit.test.ts
```

## Independent follow-up — 2026-09-08, after the fixer change

**Current N3 critic outcome: PASS for the fixed snapshot below. The original P2 is resolved.** The initial FAIL and reproduction above are retained as historical review evidence; this follow-up does not retroactively change that result. No remaining actionable N3 issue was found in this scoped mock review. This is not release, deployment, UI or real-provider approval.

I inspected the changed `requestPayload` implementation directly. It measures the complete serialized request, drops only the oldest history item while over the byte cap, and reserializes after each removal. The final question, configured facts, system prompt, strict selection schema and pricing controls remain present. The handler still applies deterministic policy to the full validated history before forwarding the bounded provider window.

I independently reran the original Unicode/escaping cases against `createChatHandler` with synthetic OpenRouter configuration and transport, plus a control-character case that expands further in nested JSON. Every public request remained schema-valid. Results:

| History character | HTTP status | Mock transport calls | Serialized provider bytes | Messages retained |
| --- | ---: | ---: | ---: | ---: |
| ASCII `a` | 200 | 2 | 19,860 | 10 |
| Greek alpha | 200 | 2 | 29,781 | 8 |
| Quote | 200 | 2 | 25,623 | 4 |
| NUL control character | 200 | 2 | 29,586 | 3 |

All four payloads were at or below 32,768 bytes. Explicit assertions checked that retained conversation equaled the original newest suffix, the final `services` message was exact, all topic facts were exact and present in the response, and the complete system message, response schema and provider controls matched the ASCII control payload. A separate canonical clarification followed by `the second one` returned 200 and the industries entry. These were executed in an inline `rtk proxy node -e` probe with in-memory TypeScript loading and global real fetch disabled, using the same bootstrap and request construction as the reproducer above.

I also reran:

```sh
rtk proxy npm test -- --reporter=dot tests/provider/openrouter.test.ts tests/api/chat-route.test.ts tests/server/rate-limit.test.ts
```

Result: **3 files, 95 tests passed**, exit 0. This includes the two new serialization regressions and the fail-closed check for a required context that cannot fit even after all older history is removed. The previously reported non-failing Vite configuration warning remains. I did not run or claim the full-project tests, typecheck or build performed by other roles.

The only changed hashes in the reviewed N3 production/test set are:

```text
0ec35ac6af6bdef2786b53ac3f0e677462521ce67910b5c5377a8db7b1de2a87  src/provider/openrouter.ts
1692fe95a0317874f37bc602780badf42ba659ffec986dc829271ea9ad0fd20a  tests/provider/openrouter.test.ts
```

All other hashes listed in the initial snapshot were rechecked and remain the same. No source fix, deployment, credential read, external inference or graph/Git mutation was performed by this critic.
