# N6 release critic — original prerelease review

Recorded 2026-09-09 UTC (2026-09-08 Guatemala). Role: independent release critic, distinct from the coordinator and browser verifier.

**Verdict: FAIL, localized P2 — the public cold-load interface can accept and lose the first message before hydration.** The source/API checks and retained public API matrix passed, but they do not erase this subsequently reproduced UI defect. A local readiness repair has been inspected statically; its runtime verification and deployment are not established by this report. Preserve this original finding and record a dated follow-up after those checks.

AC10 archive verification and human closure remain pending independently. This report does not authorize closure, submission, upload, a source publication or additional inference.

## P2: enabled server-rendered controls can lose the initial message

Affected reviewed UI snapshot: `src/ui/support-chat.tsx`, SHA-256 `a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f`. The initial textarea, Send button and topic buttons were enabled in server-rendered HTML. The actual draft and Enter submission depend on React `onChange`/`onKeyDown` handlers. A visible control and the “Live model configured” label did not establish input readiness.

The independent browser verifier's [retained diagnostic](hydration-diagnostic.md) provides the reproduction command and observations. This critic read that report and independently inspected the implicated source; the five browser probes belong to that verifier, not this critic.

- Three fresh public `DOMContentLoaded` runs accepted the 20-character question `Do you serve hotels?` into the DOM while the React-backed counter stayed `0 / 2,000`. Enter inserted a native newline, and no POST or message bubble appeared. The mismatch remained after hydration.
- Holding six initial JavaScript requests reproduced the gap deterministically. After releasing them, a further Enter without refilling cleared the visible text and produced empty-input validation, still with zero POSTs. Refilling after hydration then produced exactly one synthetic request.
- A control case that waited for an observed client effect before filling sent one synthetic request successfully. All diagnostic chat requests were intercepted; there were two synthetic POSTs in total and no real provider requests. No page, failed-request or script-HTTP errors were observed.

Expected: controls must not accept a draft before the application can retain and submit it, or an equivalent reliable mechanism must preserve that draft and first submission. Observed: apparently usable controls accepted text which the application did not own and could subsequently discard. This is a concrete first-interaction defect affecting AC1/AC8, not a provider error or a demand for broader product scope. Its frequency among ordinary users was not measured.

The preceding [single live-browser attempt](independent-live-browser.md) remains **INCONCLUSIVE**: one Enter, zero observed chat POSTs, no response, 25,958 ms elapsed, no retry. The diagnostic establishes a reproducible mechanism for that outcome, but the original attempt did not capture enough internal state to prove its exact historical cause. It must not be relabeled a completed live conversation.

### Repair inspected, not yet released by this review

The coordinator has added stable `useSyncExternalStore` snapshots: false for server/initial hydration and true for the client. `Topic`, textarea and `Send` are disabled until ready, with preparation/contact guidance. The existing Stop keys/prevent-default behavior, single-flight identity, reset, IME logic and activation-time focus handoffs remain intact. Static inspection found no additional blocking problem in this focused repair.

The new `e2e/hydration.spec.ts` holds Next.js chunks before inspecting server-rendered controls; after release it waits for editability, verifies the 20-character React counter and asserts one exact synthetic request. A separate no-JavaScript case checks disabled chat controls and the visible official contact link. These are appropriate regression boundaries, not evidence that the tests have already passed. At initial test review, the no-JavaScript case created a new context without explicitly inheriting the project's viewport; this was communicated as a test-attribution improvement, not a second product blocker.

Repair snapshot inspected:

```text
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
ef68f6a3a9f78e338ef0b2e93c58698dbab532428a70b9abe8f1b0c902cd0a33  e2e/hydration.spec.ts
```

Required follow-up: actual repaired-build regressions, independent verification, updated deployment evidence and a bounded public first-interaction check. Waiting longer in a test alone would not repair the enabled pre-hydration controls. No build, server or deployment operation was performed by this critic.

## Own checks actually executed in this review

All shell commands used `rtk proxy`. This critic read `CLAUDE.md`, the specification index/requirements/design/tasks, README, plan, checkpoint, delivery recheck, deployment documentation, relevant source/tests and the cited evidence. It ran SHA-256 comparisons, read-only JSON assertions, and eight in-memory source probes. It did not run the full test suite, a browser, a build, Git, graph replay, the public evaluator, a budget lookup or any external request.

The source probes loaded the actual TypeScript modules through an in-memory CommonJS loader. Every handler received an explicit synthetic environment. The live-shaped adapter probes received synthetic metadata/completion responses; global fetch was replaced with a rejecting sentinel. No environment file or real credential was read, and no probe file was created.

| Own source probe | Actual observation |
| --- | --- |
| `text/plain` simple POST | HTTP 415; zero selector calls |
| Empty message | HTTP 400; zero selector calls |
| 2,001-character message | HTTP 400; zero selector calls |
| 262,145-byte body with dishonest `content-length: 1` | HTTP 413; zero selector calls |
| Selector throws a synthetic private-detail exception | HTTP 503; one selector call; detail absent from response |
| Expired live configuration | HTTP 503; zero selector calls; no mock fallback |
| Nine 2,000-character Greek-history messages plus current `services` | HTTP 200; complete serialized prompt 29,950 bytes; eight retained messages; final question and all current facts retained |
| Same history with double quotes / nested escaping | HTTP 200; complete serialized prompt 25,792 bytes; four retained messages; final question and all current facts retained |

The six error responses had `kind: error` and `cache-control: no-store`. The two adapter cases each made exactly two synthetic fetch calls. **Global real-fetch sentinel count: 0. Command exit: 0.** These are mock/source probes, not live-model evidence or a fresh timeout/retry test. Existing independently executed deadline/retry/concurrency tests are referenced separately below.

The additional read-only JSON assertion command checked the exact ordered set of 16 chat case IDs, all 30 `pass: true` flags, all nine grounded cases, exact-reply/fact/link flags and response-hash shapes. It also checked both retained metadata observations for limit 5, no rolling reset, reserve >= 0.50, consistent usage plus remaining allowance, and nondecreasing usage. **Exit 0.** These assertions validate retained-artifact consistency; they do not reproduce remote requests.

### Source-probe reproduction

Executed as `rtk proxy node -e` with the following JavaScript; line breaks below are for readability. It uses no environment loader or real transport.

```js
const Module = require("node:module"), fs = require("node:fs"), path = require("node:path");
const assert = require("node:assert/strict"), ts = require("typescript");
const root = process.cwd(), resolve = Module._resolveFilename;
Module._resolveFilename = function(specifier, parent, ...rest) {
  return resolve.call(this, specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier, parent, ...rest);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
let realFetches = 0;
globalThis.fetch = async () => { realFetches++; throw Error("Forbidden external transport"); };
const { createChatHandler } = require("./src/server/chat.ts"), { cadre } = require("./src/config/cadre.ts");
const request = (messages, type = "application/json") => new Request("http://mock.local/api/chat", {
  method: "POST", headers: { "content-type": type }, body: JSON.stringify({ messages }),
});
const user = content => ({ role: "user", content });
const findings = [];
async function errorProbe(id, req, expected, options = {}) {
  let calls = 0;
  const handler = createChatHandler({ env: { CHAT_PROVIDER: "mock" }, selector: {
    selectFacts: async () => { calls++; throw Error("synthetic-private-provider-detail"); },
  }, ...options });
  const response = await handler(req), data = await response.json();
  assert.equal(response.status, expected, id);
  assert.equal(data.kind, "error");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(!JSON.stringify(data).includes("synthetic-private-provider-detail"));
  if (expected !== 503) assert.equal(calls, 0);
  findings.push({ id, status: response.status, selectorCalls: calls });
}
(async () => {
  await errorProbe("cross-site-simple-content-type", request([user("services")], "text/plain"), 415);
  await errorProbe("empty", request([user("")]), 400);
  await errorProbe("2001-character-message", request([user("a".repeat(2001))]), 400);
  await errorProbe("oversized-actual-body", new Request("http://mock.local/api/chat", {
    method: "POST", headers: { "content-type": "application/json", "content-length": "1" }, body: "a".repeat(262145),
  }), 413);
  await errorProbe("unexpected-provider-exception-redacted", request([user("services")]), 503);
  await errorProbe("expired-live-mode-no-mock-fallback", request([user("services")]), 503, {
    env: { CHAT_PROVIDER: "openrouter", OPENROUTER_API_KEY: "synthetic-release-critic", OPENROUTER_KEY_EXPIRES_AT: "2026-09-01T00:00:00Z" },
  });
  const clock = { now: () => Date.parse("2026-09-09T00:00:00Z"), setTimeout, clearTimeout };
  for (const [label, unit] of [["greek", "α"], ["nested-escaping", String.fromCharCode(34)]]) {
    const prior = Array.from({ length: 9 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: unit.repeat(2000) }));
    const final = user("services");
    let captured, calls = 0;
    const fetcher = async (url, options) => {
      calls++;
      if (String(url).endsWith("/key")) return Response.json({ data: { limit: 5, limit_remaining: 5, usage: 0, limit_reset: null } });
      captured = options.body;
      return Response.json({ choices: [{ finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ fact_indices: [0] }) } }],
        usage: { prompt_tokens: 400, completion_tokens: 12, cost: 0.0002 } });
    };
    const response = await createChatHandler({ env: { CHAT_PROVIDER: "openrouter", OPENROUTER_API_KEY: "synthetic-release-critic",
      OPENROUTER_KEY_EXPIRES_AT: "2026-09-15T00:00:00Z" }, clock, fetch: fetcher })(request([...prior, final]));
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.kind, "grounded");
    assert.equal(calls, 2);
    assert.ok(Buffer.byteLength(captured) <= 32768);
    const context = JSON.parse(JSON.parse(captured).messages[1].content);
    assert.deepEqual(context.conversation.at(-1), final);
    const entry = cadre.knowledge.find(e => e.topic === "overview");
    assert.deepEqual(context.facts.map(f => f.text), entry.facts);
    for (const fact of entry.facts) assert.ok(data.reply.includes(fact));
    findings.push({ id: label, status: response.status, promptBytes: Buffer.byteLength(captured), retainedMessages: context.conversation.length, fullFacts: true });
  }
  assert.equal(realFetches, 0);
  console.log(JSON.stringify({ result: "PASS", probes: findings, realFetches }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
```

## Acceptance and evidence map

| Criterion | Evidence reviewed and bounded conclusion |
| --- | --- |
| AC1 — anonymous live multi-turn | The coordinator's public API matrix completed clarification followed by a grounded answer. Public UI behavior was checked separately with interception. The independent real-browser attempt obtained no POST; the subsequent confirmed cold-load finding keeps browser-first-interaction acceptance open. |
| AC2 — S1–S6 | Public matrix includes six grounded topic paths, account/unknown redirects and multi-turn ambiguity; all exact expected replies passed. Fresh [knowledge critic](../knowledge-refresh/critic.md) and [independent verifier](../knowledge-refresh/independent-verifier.md) cover the refreshed source. This is bounded scenario coverage, not broad semantic understanding. |
| AC3 — approved facts/links | Server constructs replies only from configured facts and links, retaining every routed fact. The live evaluator compares exact permutations of all approved facts plus exact links, rather than accepting keyword mentions. Source/API and retained matrix pass; this does not independently establish every external company's claim as true. |
| AC4 — injection/text rendering | Public override/link-pressure cases pass. API validation and deterministic assembly prevent model prose/URLs from becoming authoritative output; public UI tests render hostile HTML inertly and allowlist exact links using synthetic responses. This is not a universal adversarial guarantee. |
| AC5 — bounds | Actual-byte limits, strict message schema, serialized-prompt trimming and reply cap are implemented. Own eight probes and [N3 independent probes](../N3-chat-api-adapter/independent-verifier-retry.md) support the boundaries; live empty/oversized cases both returned 400. |
| AC6 — failure/timeout/retry | Static failure translation plus own redaction/expired-config probes pass. N3 independent mock tests cover shared deadlines, cancellation, one bounded explicit-rejection retry and ambiguous-failure accounting; N4/public UI synthetic tests cover saved-draft retry and late-output rejection. Public matrix did not deliberately induce provider outages/timeouts; those rows remain mock/intercepted evidence. |
| AC7 — abuse control | Ten requests/minute, bounded client buckets, explicit trusted-proxy-header opt-in and global fallback are implemented and tested. Limits reset per process/instance, and anonymous users share the provider allowance. No distributed protection or authentication is claimed or required here. |
| AC8 — quality/browser | Retained latest pre-readiness runner has 233 tests, typecheck, lint and build, all exit 0. N4 independent follow-up has 16 final-snapshot cases plus targeted probes; its earlier 38-case run is not relabeled a final-snapshot rerun. Coordinator reports its own complete 38 run separately. Public 34 intercepted cases passed. None covered the newly confirmed pre-hydration gap; the readiness repair needs fresh checks. |
| AC9 — public roundtrip/exposure | Coordinator matrix verifies anonymous page/health, real chat POSTs, seven initial script bodies and five private paths returning 404. Adapter/server fail closed with static errors. These checks remain valid for their dated deployment; they are not an independent browser/live completion or exhaustive secret audit. |
| AC10 — source ZIP | **Pending, outside this critic task.** No archive was created, extracted, installed, built, smoked or checksum-verified by this critic. A source-history pattern scan is not archive verification. Human closure remains pending. |

The [public API artifact](public-live.json) records 30/30 checks, including 16 chat POSTs (nine grounded), seven initial client scripts, five private-path 404s and two validation 400s. Chat elapsed times were 273–1,646 ms. The evaluator source matches its [independent red-team review](evaluator-review.md): exact schemas/replies, bounded fetches/streams, no redirects, sanitized evidence, and after-budget observation even on failure. The script was read, never executed by this critic.

The matrix ran from `2026-09-09T03:54:36.114Z` to `03:56:23.988Z`. Its provider metadata observed cumulative usage rising from $0.0006324 to $0.0017316 and remaining allowance $4.9982684, with a $5 non-resetting limit. The difference, $0.0010992, is an observed metadata delta, not an exact per-request invoice; accounting can lag or include other authorized traffic. This critic performed no fresh budget lookup. Adapter reservations are process-local; the provider key limit is the intended cross-process hard ceiling, and cancellation is not a refund guarantee.

The [34-case public browser report](independent-browser.md) explicitly excluded the four real-API cases. Its screenshots and anonymous initial-page observations support deployed UI/layout, not 34 model calls. The [deployment receipt](deployment.json) associates the checked alias with READY deployment `dpl_HJ3h2BuS6BAVpyHsdTZKtZHcjADu`, coordinator source `a5693d8`, runtime-content source `9b5749c`. This critic did not query Vercel or independently prove remote source identity from local hashes.

## Documentation and delivery consistency

The initially inspected checkpoint still described N4 running and the old scaffold as current. This was reported to the coordinator, then the updated checkpoint/README/delivery recheck were read again: they distinguish the current public matrix, intercepted browser evidence, pending archive and human closure. This initial documentation issue was resolved during review and is not a second open finding. Those documents will need another dated update for this newly discovered readiness repair and its eventual deployment.

[Component inventory](../../docs/component-inventory.md) covers contracts, config surfaces, invariants, provenance, tests and maturity for config/core/provider/server/UI/process tooling. This critic authored it in a prior bounded producer task; this was a consistency read, **not independent review of its own production**. A separate reviewer must own any independent documentation gate.

The docs correctly distinguish extractive fact ordering from semantic/vector RAG; the second-client unit fixture from production reuse; and process-local controls from global enforcement. No accounts, authentication, portal session, booking creation, assessment execution or persistent conversation store are implied. The optional extension remains a design proposal. No missing enterprise feature is being imposed on this anonymous MVP.

## Hash and provenance snapshot

The unchanged API/provider hashes match the prior independent N3 report. The knowledge hash matches the fresh knowledge review. The earlier UI/E2E hashes matched the N4/public-browser reports before the explicitly noted readiness change.

```text
59ad7adde6f453f193376339b4244c7e1d60f3de245579813b0e9b78ae1f703e  src/config/cadre.ts
0ec35ac6af6bdef2786b53ac3f0e677462521ce67910b5c5377a8db7b1de2a87  src/provider/openrouter.ts
d6dc7fd1acb85af0320a3bc6b902620f2e5232000a82512f9fce1e6da6c418e5  src/provider/config.ts
e75f3331c85daa74c8bcd7564291759a2be0300bf81f6cc5f8f0199e32fb5ae5  src/provider/types.ts
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
33be72335dc4bcbe5d5f0ad7ad1e9245c1ec36f80d4aa55e5481dc773b6a57af  src/server/io.ts
cb2ccc473d6b24ccef30c7b60739030edc0e30e712bc15eae47c9911e6aa03e3  src/server/rate-limit.ts
0d779737aeb71a3c7ecc46ddb10fbdeec2954130de4e198b673d8b689e07860b  app/api/chat/route.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
11ba28096c942dd0c6c031740daec099bc2195ba80adb7e66f3836fe3ffa5676  evidence/N6-release/public-eval.mjs
bb6ffb233c6acceb29d65f6498499b3764fbb584f2d7c864f7b4a1c8426ab883  evidence/N6-release/public-live.json
5f55ab90f927ddf9e8e530c95fbfc31792e28355394cae4b5231df86305084cd  evidence/N6-release/deployment.json
55b935677b66d6c74cf229d6ec71c05a2b997e31bd3f380c698bdc4f1f94f9b9  evidence/N6-release/independent-live-browser.md
5ce43530bb400295ee4842d35aeff2d56b0be119be33dcaa3f27647402089f94  evidence/N6-release/hydration-diagnostic.md
d0176ced2a9d6e3cad6c60fd0bd3a62887956eae6aa0d5d5d6750373b320d4d2  docs/component-inventory.md
```

Only this report was authored in this release-critic task. Original FAIL/INCONCLUSIVE evidence remains unchanged. No current global N6 PASS, package completion or human approval is asserted.
