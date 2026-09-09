# N3 independent verifier retry

Verifier: independent `n3_verifier` agent. Recorded 2026-09-09 UTC (2026-09-08 local Guatemala).
Verdict: **PASS for the local, mock-only N3 checks performed below.** No unresolved N3 source defect was found by this verifier.

This is an independently executed verification record. It does not attribute coordinator, producer, fixer, or critic runs to this verifier. The critic communicated a prior valid-history/serialized-prompt failure; this verifier tested the repaired state, not the original failing state.

## Scope and inspected baseline

Read `CLAUDE.md`, the specification index, requirements, design, tasks, and provider decision. Inspected all four `src/provider/` modules, all three `src/server/` modules, `app/api/chat/route.ts`, related core/config modules, provider/API/rate-limit tests, and build/test configuration.

The repair is commit `8532aee2774df2dc674638a6bf0a9560fc87a422` (`fix: bound serialized provider history without losing the current question`). At the final read-only repository check, HEAD was `6415775f82f428dfa197dc92a86b28a14b9f649e`; its later change records deployment documentation. Other agents were working on plan, feature status, and deployment evidence. This verifier made no source, Git, environment, or ledger edits.

Source SHA-256 values checked after the runs:

```text
0ec35ac6af6bdef2786b53ac3f0e677462521ce67910b5c5377a8db7b1de2a87  src/provider/openrouter.ts
d6dc7fd1acb85af0320a3bc6b902620f2e5232000a82512f9fce1e6da6c418e5  src/provider/config.ts
e75f3331c85daa74c8bcd7564291759a2be0300bf81f6cc5f8f0199e32fb5ae5  src/provider/types.ts
7f40b5e9d39add123635a3a53282393fb08527eddbe843d975999dcf2455840f  src/provider/mock.ts
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
33be72335dc4bcbe5d5f0ad7ad1e9245c1ec36f80d4aa55e5481dc773b6a57af  src/server/io.ts
cb2ccc473d6b24ccef30c7b60739030edc0e30e712bc15eae47c9911e6aa03e3  src/server/rate-limit.ts
0d779737aeb71a3c7ecc46ddb10fbdeec2954130de4e198b673d8b689e07860b  app/api/chat/route.ts
```

## Independently executed project checks

Working directory: the Cadre AI project root. Runtime: Node `v26.5.0`.
Tests, lint and typecheck ran after the fixer declared its source stable; build followed those checks, with no concurrent local build arranged with the coordinator.

| Exact command | Observed result |
| --- | --- |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm test` | Exit 0; 8 test files, 203 tests passed; Vitest 5.0.0; duration 443 ms |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run typecheck` | Exit 0; `tsc --noEmit` |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run lint` | Exit 0; `eslint .` |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run build` | Exit 0; Next.js 16.3.4/Turbopack compiled and generated 5 static pages; routes `/`, `/_not-found`, `/api/chat`, `/api/health` listed |
| `rtk proxy git diff --check` | Exit 0, no output |

Vitest emitted a nonfatal future-compatibility warning about ESM syntax in the CommonJS-loaded `vitest.config.ts` and a future Vite native config loader default. It did not fail the current suite.

Next's normal build reported automatic loading of `.env.local`. The build command explicitly set mock mode and a synthetic API key; no environment-file contents or real credential values were inspected or printed by this verifier. No live inference or provider metadata call was made. Real credential presence, live provider behavior and deployed behavior are outside this independent mock verification.

## Additional independent probes against actual source

The inline program below installs a TypeScript-to-CommonJS loader in memory, imports the actual source, and replaces global fetch with a rejecting sentinel. It uses only synthetic, injected responses. No extra test or source file was created.

All seven history cases used 20 publicly valid messages: 19 earlier messages and a final service question near the 2,000-character limit. Assertions checked public schema acceptance, raw request byte allowance, HTTP 200 grounded response, exactly two synthetic calls, complete serialized provider body <= 32 KiB, exact final question, exact newest retained suffix, complete approved facts, and model-selected order.

| Prior/final padding | Retained prompt messages | Full serialized prompt bytes | API status |
| --- | ---: | ---: | ---: |
| Greek alpha | 7 | 29,709 | 200 |
| Double quote | 3 | 25,533 | 200 |
| Backslash | 3 | 25,533 | 200 |
| NUL control character | 2 | 29,464 | 200 |
| CJK character | 5 | 31,615 | 200 |
| Emoji | 7 | 29,695 | 200 |
| Lone surrogate | 2 | 29,464 | 200 |

Further observations, all from this verifier's execution:

- All 6 topic entries preserved their full 16 approved facts and exact app-owned links when a selector prioritized only the last fact. Keeping every fact in a selected entry is intentional. This check makes no semantic RAG or general natural-language coverage claim.
- Invalid UTF-8 returned HTTP 400. An actually oversized stream with a dishonest `content-length: 1` returned HTTP 413 and cancelled the stream.
- Twenty concurrent requests sharing stale synthetic metadata of $0.503 remaining produced 20 key preflights, 1 synthetic completion, and 19 typed budget rejections while the first completion was held open.
- The independent global network sentinel recorded 0 real transport invocations.
- Inline program exit: 0.

Reproducible command, as executed from the project root:

```sh
rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 node -e '
const Module = require("node:module");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = process.cwd();
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(specifier, parent, ...rest) {
  return originalResolve.call(this, specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier, parent, ...rest);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
let forbiddenFetches = 0;
globalThis.fetch = async () => { forbiddenFetches += 1; throw new Error("Forbidden real transport"); };
const { cadre } = require("./src/config/cadre.ts");
const { LIMITS } = require("./src/core/limits.ts");
const { parseChatRequest } = require("./src/core/validate.ts");
const { createChatHandler } = require("./src/server/chat.ts");
const { OpenRouterFactSelector, PROVIDER_LIMITS } = require("./src/provider/openrouter.ts");
const clock = { now: () => Date.parse("2026-09-09T00:00:00Z"), setTimeout, clearTimeout };
const env = { CHAT_PROVIDER: "openrouter", OPENROUTER_API_KEY: "synthetic-independent-verifier", OPENROUTER_KEY_EXPIRES_AT: "2026-09-15T00:00:00Z" };
const metadata = (remaining = 5) => Response.json({ data: { limit: 5, limit_remaining: remaining, usage: 5 - remaining, limit_reset: null } });
const completion = (index = 0) => Response.json({
  choices: [{ finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ fact_indices: [index] }) } }],
  usage: { prompt_tokens: 400, completion_tokens: 12, cost: 0.0002 },
});
const request = (messages) => new Request("http://localhost/api/chat", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages }),
});
(async () => {
  const historyResults = [];
  for (const [label, unit] of [["greek", "\u03b1"], ["quote", '\''"'\''], ["backslash", "\\"], ["nul", "\u0000"], ["cjk", "\u4e2d"], ["emoji", "\ud83d\ude00"], ["lone-surrogate", "\ud800"]]) {
    const prior = Array.from({ length: 19 }, (_, index) => ({
      role: index % 2 ? "assistant" : "user",
      content: String(index).padStart(2, "0") + " " + unit.repeat(Math.floor(1997 / unit.length)),
    }));
    const final = { role: "user", content: "services " + unit.repeat(Math.floor(1991 / unit.length)) };
    const messages = [...prior, final];
    assert.equal(parseChatRequest({ messages }).ok, true, label + " public schema");
    assert.ok(Buffer.byteLength(JSON.stringify({ messages })) <= LIMITS.maxBodyBytes);
    let calls = 0;
    let captured;
    const fetcher = async (url, options) => {
      calls += 1;
      if (String(url).endsWith("/key")) return metadata();
      assert.ok(String(url).endsWith("/chat/completions"));
      captured = options.body;
      return completion(2);
    };
    const response = await createChatHandler({ env, fetch: fetcher, clock })(request(messages));
    const body = await response.json();
    assert.equal(response.status, 200, label + " status");
    assert.equal(body.kind, "grounded");
    assert.equal(calls, 2);
    const payload = JSON.parse(captured);
    const data = JSON.parse(payload.messages[1].content);
    const bytes = Buffer.byteLength(captured);
    assert.ok(bytes <= PROVIDER_LIMITS.maxPromptBytes, label + " payload cap");
    assert.deepEqual(data.conversation.at(-1), final, label + " final intact");
    assert.deepEqual(data.conversation, messages.slice(-data.conversation.length), label + " retained suffix");
    assert.deepEqual(data.facts, cadre.knowledge[0].facts.map((text, index) => ({ index, text })));
    assert.ok(body.reply.startsWith(cadre.knowledge[0].facts[2]));
    for (const fact of cadre.knowledge[0].facts) assert.ok(body.reply.includes(fact));
    historyResults.push({ label, acceptedMessages: messages.length, promptMessages: data.conversation.length, promptBytes: bytes, status: response.status });
  }
  console.log(JSON.stringify({ probe: "serialized-history-regression", result: "PASS", rows: historyResults }));

  let factsChecked = 0;
  for (const entry of cadre.knowledge) {
    const selector = { selectFacts: async () => [entry.facts.length - 1] };
    const response = await createChatHandler({ env: { CHAT_PROVIDER: "mock" }, selector })(request([{ role: "user", content: entry.keywords[0] }]));
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.kind, "grounded");
    assert.ok(body.reply.startsWith(entry.facts.at(-1)));
    for (const fact of entry.facts) { assert.ok(body.reply.includes(fact)); factsChecked += 1; }
    const links = body.reply.match(/https:\/\/\S+/g) || [];
    assert.deepEqual(links, entry.approvedLinks.map(({ url }) => url));
  }
  console.log(JSON.stringify({ probe: "all-topic-facts-and-links", result: "PASS", entries: cadre.knowledge.length, facts: factsChecked }));

  let cancelled = false;
  const badUtf8 = new Request("http://localhost/api/chat", {
    method: "POST", headers: { "content-type": "application/json" },
    body: new Uint8Array([0xff, 0xfe]), duplex: "half",
  });
  const badUtf8Response = await createChatHandler({ env: { CHAT_PROVIDER: "mock" } })(badUtf8);
  assert.equal(badUtf8Response.status, 400);
  const oversize = new Request("http://localhost/api/chat", {
    method: "POST", headers: { "content-type": "application/json", "content-length": "1" },
    body: new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array(LIMITS.maxBodyBytes + 1)); },
      cancel() { cancelled = true; },
    }), duplex: "half",
  });
  const oversizeResponse = await createChatHandler({ env: { CHAT_PROVIDER: "mock" } })(oversize);
  assert.equal(oversizeResponse.status, 413);
  assert.equal(cancelled, true);
  console.log(JSON.stringify({ probe: "actual-body-bytes", result: "PASS", invalidUtf8Status: badUtf8Response.status, lyingLengthOversizeStatus: oversizeResponse.status, oversizeStreamCancelled: cancelled }));

  const gates = [];
  let preflights = 0;
  let inferencePosts = 0;
  const fetcher = async (url) => {
    if (String(url).endsWith("/key")) { preflights += 1; return metadata(0.503); }
    assert.ok(String(url).endsWith("/chat/completions"));
    inferencePosts += 1;
    return new Promise(resolve => gates.push(() => resolve(completion())));
  };
  const selector = new OpenRouterFactSelector({ apiKey: "synthetic-independent-verifier", expiresAt: Date.parse("2026-09-15T00:00:00Z"), clock, fetch: fetcher });
  const input = { entry: cadre.knowledge[0], messages: [{ role: "user", content: "services" }] };
  const pending = Promise.allSettled(Array.from({ length: 20 }, () => selector.selectFacts(input)));
  for (let index = 0; index < 10; index += 1) await new Promise(resolve => setImmediate(resolve));
  assert.ok(gates.length > 0 && gates.length < 20);
  gates.forEach(resolve => resolve());
  const outcomes = await pending;
  const success = outcomes.filter(result => result.status === "fulfilled").length;
  const rejected = outcomes.filter(result => result.status === "rejected");
  assert.equal(preflights, 20);
  assert.equal(inferencePosts, success);
  assert.equal(success + rejected.length, 20);
  for (const result of rejected) assert.equal(result.reason.code, "budget");
  console.log(JSON.stringify({ probe: "concurrent-stale-budget", result: "PASS", availableBeforeReserve: 0.503, preflights, inferencePosts, successes: success, budgetRejections: rejected.length }));
  assert.equal(forbiddenFetches, 0);
  console.log(JSON.stringify({ result: "PASS", realTransportInvocations: forbiddenFetches }));
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

## Review conclusion and limits

The byte-budget repair removes oldest history until the complete serialized payload fits, preserving the final question, full facts, system instruction, and response schema. The final-question-heavy Unicode and JSON-escaping variants above independently passed. Existing regression tests also cover an unfit required context failing before transport.

The inspected pipeline validates input, bounds streams/history/output, uses one request deadline, applies process-local admission, translates provider failures to safe retry copy, validates fact indices, and renders configured facts and approved links. The adapter uses at most one retry for the explicit retryable rejection path and fails closed for malformed responses and unsafe configuration/budget data. The 203-test run covers these implemented branches with mock transport.

This PASS closes only the independently checked local N3 source question. Process-local rate limits and budget reservations retain their documented cross-instance/restart limitations; trusted proxy identity still requires verified deployment ingress. This verifier did not run the live evaluation matrix, a real-provider round trip, browser/keyboard/mobile smoke, deployed credential-exposure checks, archive verification, or release closure. Those outcomes must use their own evidence and required gates.

