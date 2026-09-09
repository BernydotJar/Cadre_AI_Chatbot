# Model-comparison evaluator critic — original snapshot

Date: 2026-09-09 UTC. Role: independent evaluator critic, separate from its author.
Verdict: **FAIL — two P2 result-integrity gaps need repair before the primary live evaluation.** The bounded execution controls passed the synthetic checks; no live inference, real environment read or production change was performed.

Reviewed:
- tools/evaluation/compare-models.mjs SHA-256 `35f9055aba4dcf3dbe3250d25acb00bfa2da06ff5b0106ebb7355efaab52144f`
- tools/evaluation/load-ts.mjs SHA-256 `4aa0279be2922190248e50c718e04e31add7ae3b04fb351ad4891d550a4bf0ea`
- docs/model-evaluation-plan.md, plus the actual shared policy, request handler, provider, model profiles and bounded I/O code.

The dry-run passed on the final prespecified questions with 14 cases, nine grounded and five deterministic controls per model. Earlier booking/portal wording limitations were explicitly documented before inference. The source was not modified by this critic.

## P2-1 — empty validation false-positive

In the deterministic branch, `item.id === 'empty' ? response.status === 400 : ...` records `exactPolicy=true` for any reply body with status 400. A synthetic handler wrapper returned `{kind:"error",reply:"Incorrect validation behavior"}` for the empty case. Both models' empty rows still passed, and the report said ALL_CONTRACTS_PASS.

This contradicts the plan's exact validation-policy check. It does not prove the real handler returns that incorrect copy; it demonstrates the evaluator cannot detect the regression. Derive the exact expected validation reply from the canonical request parser or a prespecified expected response and compare the actual full reply plus status/kind.

## P2-2 — final accounting is retained but not adjudicated

The evaluator sets its overall result before reading final key metadata. Its final block records raw safe numeric metadata or UNAVAILABLE but computes no reconciliation/eligibility result. In the synthetic normal run, reservation was $0.045773 with 18 completion attempts. Changing only the final key usage from $0.01 to $0.31 (delta $0.30, above both the reservation and $0.15 cap) still returned ALL_CONTRACTS_PASS. A missing final metadata response also retained that result.

The local attempt/reservation gate itself did not exceed its limits: the $0.30 was deliberately injected metadata, not real spend. Shared-key concurrent traffic or delayed accounting could explain such a real discrepancy, so it should be classified as unexpected/inconclusive instead of attributed to this run without evidence. Add an explicit accounting verdict and comparison/recommendation eligibility gate: retain known response costs, observed key delta, missing telemetry and lag separately; do not call the run decision-ready until those conditions are acceptable. No further inference should follow an accounting stop without a new decision.

## Reporting completion note

The runner retains per-case timings and numeric costs but currently writes no per-model median/p95, token/cost totals or explicit model eligibility. These can be derived without more paid calls from the retained rows, but the promised comparative readout is not complete until that derivation exists. Do not silently exclude failed/timed-out rows or turn missing billing fields into zero.

Also preserve cap terminology: **18 inference /chat/completions HTTP attempts including retries**, not 18 HTTP calls of all types. The normal test made 18 completion calls plus 20 non-inference /key metadata calls (18 provider preflights, before and after). All of these were in-process synthetic fetches here.

## Independent checks and outcomes

Actual command:

```sh
rtk proxy node tools/evaluation/compare-models.mjs --dry-run
rtk proxy node --experimental-vm-modules /tmp/cadre-evaluator-critic-r0IRyH/probe.mjs
```

Dry-run: PLAN_VALIDATED_NO_NETWORK, exit 0. Synthetic harness: exit 0, meaning its safety assertions and false-positive observations completed as specified. Node's experimental VM warning was nonfatal.

The unmodified evaluator ran inside a VM with fake process credentials, fake loadEnvFile, in-process fetch and virtual output writes. Actual repository policy/provider/handler implementations ran. No .env file was read; neither actual application/provider HTTP nor live model use occurred; the evaluator's primary-results.json was not written by these tests. The harness itself and its safe observation JSON were written only to the named temporary directory.

| Synthetic scenario | Completion attempts | PASS / FAIL / NOT_RUN rows | Observation |
|---|---:|---|---|
| Valid payloads | 18 | 28 / 0 / 0 | Shared contract passes; ten deterministic rows have zero inference |
| Tool calls attached to otherwise valid content | 18 | 10 / 18 / 0 | NoToolCalls assertion rejects |
| Legacy function call attached | 18 | 10 / 18 / 0 | Rejected |
| Duplicate fact indices | 18 | 10 / 18 / 0 | Rejected |
| Out-of-range fact index | 18 | 10 / 18 / 0 | Rejected |
| Extra selection-object key | 18 | 10 / 18 / 0 | Rejected; private marker not retained |
| Missing cost | 1 | 0 / 1 / 27 | Stops further inference |
| Cost above conservative estimate | 1 | 0 / 1 / 27 | Stops further inference |
| One explicit 429 then success | 18 | 17 / 1 / 10 | Retry counted; no 19th completion sent |
| Increased synthetic ceiling exceeding run reservation | 0 | 0 / 1 / 27 | Cap refuses before completion fetch |
| Invalid initial allowance/reserve | 0 | No rows; ABORTED | No inference |
| One ambiguous transport exception | 18 | 27 / 1 / 0 | No automatic retry of that request; raw exception marker not retained |
| Incorrect empty-input reply | 18 | 28 / 0 / 0 | **False-positive reproduced** |
| Unexpected final key delta $0.30 | 18 | 28 / 0 / 0 | **Missing accounting adjudication reproduced** |
| Unavailable final key metadata | 18 | 28 / 0 / 0 | Accounting marked UNAVAILABLE, no eligibility consequence |

Every synthetic execution asserted: no more than 18 completion calls, no more than $0.15 reserved, counted attempts equal actual intercepted completion calls, no synthetic secret or reasoning marker in report/logs. Every intercepted actual provider request had max_tokens 256, temperature 0, stream false, strict JSON schema and no tools/functions. Missing/excess cost stopped after one attempt. Definitive retry and ambiguous transport failure were distinguished.

Source review confirms the fixed OpenRouter endpoint, model allowlist/profiles, server-only synthetic/live credential seam, local expiry/reserve checks, bounded response parsing and exact app-owned fact/link composition. The loader is an explicit trusted-repository developer tool, not a request-time user-input loader. It transpiles only paths under local src ending in .ts; it must not be reused as an untrusted-code sandbox.

## Reproducible synthetic harness

Save this code as a temporary .mjs file and run it from the repository root with the command above. It uses only synthetic credentials and controlled fetch; do not replace them with real values for a critic replay. The final write destination is a temporary observation file, not the primary evaluation artifact.

```javascript
import vm from "node:vm";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { loadTs: actualLoadTs } = await import(pathToFileURL(path.join(root, "tools/evaluation/load-ts.mjs")));
const source = readFileSync("tools/evaluation/compare-models.mjs", "utf8");
const secret = "SYNTHETIC_SECRET_DO_NOT_RETAIN_a81e70";
const reasoning = "SYNTHETIC_REASONING_DO_NOT_RETAIN_a81e70";
const baselineHash = createHash("sha256").update(source).digest("hex");
const results = [];
const safeRead = (file) => {
  assert.ok(!String(file).includes(".env"), "No real environment read allowed");
  return readFileSync(file);
};

async function run(mode) {
  let artifact;
  const counts = { completions: 0, metadata: 0, fakeEnvLoads: 0, attemptsAfterStop: 0 };
  const payloads = [];
  const logs = [];
  const realFetch = async (url, options) => {
    assert.ok(String(url).startsWith("https://openrouter.ai/api/v1/"));
    if (String(url).endsWith("/key")) {
      counts.metadata++;
      if (mode === "invalid-initial-budget") return Response.json({ data: { limit: 5, usage: 0, limit_remaining: 0.51, limit_reset: null } });
      if (mode === "after-budget-unavailable" && counts.metadata === 20) return new Response("private account metadata", { status: 500 });
      const usage = mode === "unexpected-after-budget" && counts.metadata === 20 ? 0.31 : 0.01;
      return Response.json({ data: { limit: 5, usage, limit_remaining: 5 - usage, limit_reset: null } });
    }
    assert.equal(String(url), "https://openrouter.ai/api/v1/chat/completions");
    counts.completions++;
    assert.ok(counts.completions <= 18, "No 19th completion request");
    const payload = JSON.parse(options.body);
    payloads.push(payload);
    assert.equal(payload.max_tokens, 256);
    assert.equal(payload.temperature, 0);
    assert.equal(payload.stream, false);
    assert.equal(payload.response_format.type, "json_schema");
    assert.equal(payload.response_format.json_schema.strict, true);
    assert.ok(!payload.tools && !payload.functions);
    if (mode === "retry-attempt-cap" && counts.completions === 1) return new Response("safe rejection", { status: 429, headers: { "retry-after": "0" } });
    if (mode === "transport-error" && counts.completions === 1) throw new Error(secret);
    const data = {
      choices: [{ finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ fact_indices: [0] }), reasoning } }],
      usage: { prompt_tokens: 50, completion_tokens: 10, cost: 0.0001, completion_tokens_details: { reasoning_tokens: 0 }, prompt_tokens_details: { cached_tokens: 0 } },
    };
    if (mode === "tools") data.choices[0].message.tool_calls = [{ id: "forbidden", type: "function", function: { name: "exfiltrate", arguments: secret } }];
    if (mode === "function") data.choices[0].message.function_call = { name: "exfiltrate", arguments: secret };
    if (mode === "duplicate-indices") data.choices[0].message.content = JSON.stringify({ fact_indices: [0, 0] });
    if (mode === "out-of-range") data.choices[0].message.content = JSON.stringify({ fact_indices: [999] });
    if (mode === "extra-key") data.choices[0].message.content = JSON.stringify({ fact_indices: [0], private: secret });
    if (mode === "missing-cost") delete data.usage.cost;
    if (mode === "excess-cost") data.usage.cost = 0.5;
    return Response.json(data);
  };
  const loaded = (file) => {
    const values = actualLoadTs(file);
    if (mode === "reservation-cap" && file === "src/provider/config.ts") return { ...values, MODEL_PROFILES: {
      "openai/gpt-4.1-mini": { inputPriceCeiling: 100, outputPriceCeiling: 100 },
      "google/gemini-3.8-flash": { inputPriceCeiling: 100, outputPriceCeiling: 100 },
    } };
    if (mode === "wrong-empty-copy" && file === "src/server/chat.ts") return { ...values, createChatHandler(options) {
      const handler = values.createChatHandler(options);
      return async (request) => {
        const response = await handler(request);
        if (response.status === 400) return Response.json({ kind: "error", reply: "Incorrect validation behavior" }, { status: 400 });
        return response;
      };
    } };
    return values;
  };
  const environment = { argv: ["node", "synthetic-evaluation", "--live"], env: { OPENROUTER_API_KEY: secret }, exitCode: 0, loadEnvFile(file) { assert.equal(file, ".env.local"); counts.fakeEnvLoads++; }, exit() { throw new Error("Unexpected process exit"); } };
  const context = vm.createContext({
    globalThis: undefined, process: environment, Date, performance, Request, Response, Buffer, AbortSignal, fetch: realFetch,
    console: { log: (text) => logs.push(text) },
  });
  context.globalThis = context;
  const module = new vm.SourceTextModule(source, { context, identifier: "synthetic-evaluator" });
  await module.link((specifier) => {
    const exports = specifier === "node:fs" ? {
      existsSync: () => false, mkdirSync: () => {}, readFileSync: safeRead,
      writeFileSync: (file, data, options) => { assert.equal(file, "evidence/model-comparison/primary-results.json"); assert.equal(options.flag, "wx"); artifact = JSON.parse(data); },
    } : specifier === "node:crypto" ? { createHash } : specifier === "./load-ts.mjs" ? { loadTs: loaded } : undefined;
    assert.ok(exports, `Unexpected module ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () { for (const [key, value] of Object.entries(exports)) this.setExport(key, value); }, { context });
  });
  await module.evaluate();
  assert.ok(artifact);
  assert.equal(counts.fakeEnvLoads, 1);
  assert.ok(artifact.attempts <= 18);
  assert.ok(artifact.reservedDollars <= 0.15);
  assert.equal(artifact.attempts, counts.completions);
  assert.ok(!JSON.stringify({ artifact, logs }).includes(secret), "Secret leaked to retained output");
  assert.ok(!JSON.stringify({ artifact, logs }).includes(reasoning), "Reasoning leaked to retained output");
  const summary = { mode, result: artifact.result, attempts: artifact.attempts, reserved: artifact.reservedDollars, counts, rows: artifact.rows.length, pass: artifact.rows.filter((row) => row.result === "PASS").length, fail: artifact.rows.filter((row) => row.result === "FAIL").length, notRun: artifact.rows.filter((row) => row.result === "NOT_RUN").length, budgetAfter: artifact.budget.after, budgetBefore: artifact.budget.before, perModelSummaryPresent: Boolean(artifact.models || artifact.summary || artifact.perModel) };
  if (mode === "valid") {
    assert.equal(summary.result, "ALL_CONTRACTS_PASS"); assert.equal(summary.pass, 28); assert.equal(counts.completions, 18); assert.equal(counts.metadata, 20);
    assert.ok(artifact.rows.filter((row) => row.layer === "deterministic-control").every((row) => row.attempts === 0));
  }
  if (["tools", "function", "duplicate-indices", "out-of-range", "extra-key"].includes(mode)) { assert.equal(summary.fail, 18); assert.equal(summary.pass, 10); }
  if (["missing-cost", "excess-cost"].includes(mode)) { assert.equal(counts.completions, 1); assert.equal(summary.notRun, 27); }
  if (mode === "retry-attempt-cap") { assert.equal(counts.completions, 18); assert.ok(summary.notRun > 0); assert.equal(artifact.rows[0].attempts, 2); }
  if (mode === "reservation-cap") { assert.equal(counts.completions, 0); assert.equal(summary.notRun, 27); }
  if (mode === "invalid-initial-budget") { assert.equal(counts.completions, 0); assert.equal(summary.result, "ABORTED"); }
  if (mode === "transport-error") { assert.equal(artifact.rows[0].attempts, 1); assert.equal(artifact.rows[0].result, "FAIL"); }
  if (mode === "wrong-empty-copy") summary.emptyRows = artifact.rows.filter((row) => row.case === "empty").map((row) => ({ result: row.result, exactPolicy: row.exactPolicy }));
  results.push(summary);
}

for (const mode of ["valid", "tools", "function", "duplicate-indices", "out-of-range", "extra-key", "missing-cost", "excess-cost", "retry-attempt-cap", "reservation-cap", "invalid-initial-budget", "transport-error", "wrong-empty-copy", "unexpected-after-budget", "after-budget-unavailable"]) await run(mode);
const final = { testedSourceSha256: baselineHash, externalHttpRequests: 0, realEnvReads: 0, actualArtifactWrites: 0, method: "Unmodified evaluator executed in VM with injected in-process fetch/credential/virtual output; actual repository policy/provider/handler used", results };
writeFileSync("/tmp/cadre-evaluator-critic-r0IRyH/results.json", JSON.stringify(final, null, 2) + "\n");
console.log(JSON.stringify(final));
```

Original FAIL evidence must remain immutable after the author repairs the runner. A follow-up independent rerun is required before the primary live comparison. No real model quality, pricing realization, winner or token usage is established by this critic's synthetic checks.

