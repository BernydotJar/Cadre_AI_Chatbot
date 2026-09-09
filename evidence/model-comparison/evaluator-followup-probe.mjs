import vm from "node:vm";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { loadTs: actualLoadTs } = await import(pathToFileURL(path.join(root, "tools/evaluation/load-ts.mjs")));
const source = readFileSync("tools/evaluation/compare-models.mjs", "utf8");
const sourceSha256 = createHash("sha256").update(source).digest("hex");
const results = [];

async function run(mode) {
  let artifact;
  const counts = { completions: 0, metadata: 0, envLoads: 0 };
  const realFetch = async (url, options) => {
    assert.ok(String(url).startsWith("https://openrouter.ai/api/v1/"));
    if (String(url).endsWith("/key")) {
      counts.metadata++;
      if (mode === "after-budget-unavailable" && counts.metadata === 20) return new Response("safe failure", { status: 500 });
      let usage = 0.01;
      if (counts.metadata === 20) usage = mode === "unexpected-after-budget" ? 0.31 : 0.0118;
      return Response.json({ data: { limit: 5, usage, limit_remaining: 5 - usage, limit_reset: null } });
    }
    assert.equal(String(url), "https://openrouter.ai/api/v1/chat/completions");
    counts.completions++;
    assert.ok(counts.completions <= 18);
    return Response.json({
      choices: [{ finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ fact_indices: [0] }) } }],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 10,
        cost: 0.0001,
        completion_tokens_details: { reasoning_tokens: 0 },
        prompt_tokens_details: { cached_tokens: 0 },
      },
    });
  };

  const loaded = (file) => {
    const values = actualLoadTs(file);
    if (mode === "wrong-empty-copy" && file === "src/server/chat.ts") {
      return {
        ...values,
        createChatHandler(options) {
          const handler = values.createChatHandler(options);
          return async (request) => {
            const response = await handler(request);
            if (response.status === 400) return Response.json({ kind: "error", reply: "Incorrect validation behavior" }, { status: 400 });
            return response;
          };
        },
      };
    }
    return values;
  };

  const environment = {
    argv: ["node", "synthetic-evaluation", "--live"],
    env: { OPENROUTER_API_KEY: "synthetic-followup-key" },
    exitCode: 0,
    loadEnvFile(file) { assert.equal(file, ".env.local"); counts.envLoads++; },
    exit() { throw new Error("Unexpected process exit"); },
  };
  const context = vm.createContext({
    globalThis: undefined,
    process: environment,
    Date,
    performance,
    Request,
    Response,
    Buffer,
    AbortSignal,
    fetch: realFetch,
    console: { log() {} },
  });
  context.globalThis = context;

  const module = new vm.SourceTextModule(source, { context, identifier: "synthetic-evaluator-followup" });
  await module.link((specifier) => {
    const exports = specifier === "node:fs" ? {
      existsSync: () => false,
      mkdirSync: () => {},
      readFileSync,
      writeFileSync: (file, data, options) => {
        assert.equal(file, "evidence/model-comparison/primary-results.json");
        assert.equal(options.flag, "wx");
        artifact = JSON.parse(data);
      },
    } : specifier === "node:crypto" ? { createHash }
      : specifier === "./load-ts.mjs" ? { loadTs: loaded }
        : undefined;
    assert.ok(exports, `Unexpected module ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  assert.ok(artifact);
  assert.equal(counts.envLoads, 1);
  assert.equal(counts.completions, 18);
  assert.equal(artifact.attempts, 18);

  const summary = {
    mode,
    result: artifact.result,
    accounting: artifact.accounting.verdict,
    recommendation: artifact.recommendation,
    decisionEligible: artifact.perModel.map(({ model, decisionEligible }) => ({ model, decisionEligible })),
    emptyRows: artifact.rows.filter((row) => row.case === "empty").map((row) => ({ result: row.result, exactPolicy: row.exactPolicy, zeroInference: row.zeroInference })),
    counts,
  };

  if (mode === "valid") {
    assert.equal(artifact.result, "ALL_CONTRACTS_PASS");
    assert.equal(artifact.accounting.verdict, "RECONCILED");
    assert.ok(artifact.perModel.every((model) => model.decisionEligible));
    assert.ok(artifact.recommendation.model);
  } else if (mode === "wrong-empty-copy") {
    assert.ok(summary.emptyRows.every((row) => row.result === "FAIL" && row.exactPolicy === false && row.zeroInference === true));
    assert.equal(artifact.result, "COMPARISON_WITH_FAILURES");
    assert.ok(artifact.perModel.every((model) => !model.decisionEligible));
    assert.equal(artifact.recommendation.model, null);
  } else if (mode === "unexpected-after-budget") {
    assert.equal(artifact.accounting.verdict, "UNEXPECTED_KEY_DELTA");
    assert.equal(artifact.result, "ACCOUNTING_NOT_RECONCILED");
    assert.ok(artifact.perModel.every((model) => !model.decisionEligible));
    assert.equal(artifact.recommendation.model, null);
  } else if (mode === "after-budget-unavailable") {
    assert.equal(artifact.accounting.verdict, "METADATA_UNAVAILABLE");
    assert.equal(artifact.result, "ACCOUNTING_NOT_RECONCILED");
    assert.ok(artifact.perModel.every((model) => !model.decisionEligible));
    assert.equal(artifact.recommendation.model, null);
  }
  results.push(summary);
}

for (const mode of ["valid", "wrong-empty-copy", "unexpected-after-budget", "after-budget-unavailable"]) await run(mode);
const report = {
  result: "PASS",
  testedSourceSha256: sourceSha256,
  externalHttpRequests: 0,
  realCredentialReads: 0,
  modes: results,
};
writeFileSync("evidence/model-comparison/evaluator-followup-results.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
