# Independent model-configuration critic

Date: 2026-09-09 UTC. Role: independent critic of the model configuration increment.

**Verdict: PASS for the reviewed server-only configuration and mocked provider contract. No concrete correctness/security defect was reproduced.** This does not verify the evaluator that the coordinator was still writing, does not establish real model compatibility/pricing, and does not authorize a production model switch.

## Reviewed scope

Read `src/provider/config.ts`, `src/provider/openrouter.ts`, `tests/provider/model-selection.test.ts`, `docs/model-evaluation-plan.md`, the actual construction path in `src/server/chat.ts` and shared deadline/limit helpers. No source, Git, ledger, environment file, deployment, build or live API operation was performed.

The approved configuration has exactly two frozen profiles:

| Model ID | Input routing/reservation ceiling per million tokens | Output ceiling |
|---|---:|---:|
| openai/gpt-4.1-mini (unchanged default) | $0.50 | $2 |
| google/gemini-3.8-flash | $0.80 | $4 |

The values above are configured ceilings, not an independent claim about current market prices. The same profile drives both `provider.max_price` and local estimated reservation. No client request field selects a model: the server environment is validated and passed through the existing handler constructor. Unknown IDs, aliases, inherited property names and whitespace variants are rejected. Nested profiles and the allowlist are frozen.

The prompt/body cap remains 32 KiB, output limit remains 256 tokens, and system instructions, strict JSON Schema, temperature zero, required parameters, denied data collection, no tools, hard allowance/expiry and $0.50 reserve remain in place. Every routed fact is still composed by server policy; model output only orders validated fact indices.

## Actual independent checks

```sh
rtk proxy npm exec -- vitest run tests/provider
```

Observed: **60 tests / 2 files PASS**, exit 0, 232 ms. The Vite future native-loader warning was nonfatal. This is a new run by this critic, not an attribution of the coordinator's 60-test run.

An independent in-process TypeScript loading probe disabled ambient fetch and injected synthetic responses. It checked:

- Unchanged default and frozen exact allowlist.
- Reservation just below/above the required $0.50 plus each profile's estimate.
- Provider cost exceeding its estimate rejected with no retry.
- Nine maximum-length prior messages using Greek alpha, quotes and NUL controls for each profile.
- Actual complete serialized payload bound; final question, all facts, strict schema and other provider controls retained.

Exact command, run from the project root:

```sh
rtk proxy node -e 'const fs=require("node:fs"),path=require("node:path"),Module=require("node:module"),ts=require("typescript"),assert=require("node:assert/strict");
const root=process.cwd(),originalResolve=Module._resolveFilename;
Module._resolveFilename=function(id,...args){return originalResolve.call(this,id.startsWith("@/")?path.join(root,"src",id.slice(2)):id,...args);};
Module._extensions[".ts"]=(mod,file)=>{mod._compile(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);};
const {OpenRouterFactSelector,PROVIDER_LIMITS}=require(path.join(root,"src/provider/openrouter.ts"));
const {MODEL_PROFILES,approvedModel,AUTHORIZED_LIVE_DEADLINE}=require(path.join(root,"src/provider/config.ts"));
const {cadre}=require(path.join(root,"src/config/cadre.ts"));
global.fetch=()=>{throw Error("Real network forbidden in critic probe");};
const question="What services does Cadre AI offer?";
const rows=[];
async function call(model,remaining=5,cost=0,history=[]) {
 const calls=[];let body;
 const fetcher=async(url,init)=>{calls.push({url,method:init.method});if(url.endsWith("/key"))return Response.json({data:{limit:5,usage:5-remaining,limit_remaining:remaining,limit_reset:null}});body=JSON.parse(init.body);return Response.json({choices:[{finish_reason:"stop",message:{role:"assistant",content:'\\''{"fact_indices":[0]}'\\''}}],usage:{prompt_tokens:100,completion_tokens:12,cost}});};
 const clock={now:()=>AUTHORIZED_LIVE_DEADLINE-100000,setTimeout,clearTimeout};
 const selector=new OpenRouterFactSelector({apiKey:"synthetic-critic-only",expiresAt:AUTHORIZED_LIVE_DEADLINE,model,fetch:fetcher,clock});
 let result,code;try{result=await selector.selectFacts({entry:cadre.knowledge[0],messages:[...history,{role:"user",content:question}]});}catch(e){code=e.code;}
 return{result,code,body,calls};
}
(async()=>{
 assert.equal(approvedModel(undefined),"openai/gpt-4.1-mini");
 assert.ok(Object.isFrozen(MODEL_PROFILES));
 for(const profile of Object.values(MODEL_PROFILES))assert.ok(Object.isFrozen(profile));
 for(const invalid of ["__proto__","constructor","","google/gemini-flash-latest","google/gemini-3.8-flash "])assert.throws(()=>approvedModel(invalid));
 for(const model of Object.keys(MODEL_PROFILES)){
  const base=await call(model);assert.deepEqual(base.result,[0]);
  const bytes=Buffer.byteLength(JSON.stringify(base.body)),prices=MODEL_PROFILES[model];
  const estimate=Math.ceil((bytes+1024)*prices.inputPriceCeiling+256*prices.outputPriceCeiling)/1000000;
  const below=await call(model,0.5+estimate-0.000001);assert.equal(below.code,"budget");assert.equal(below.calls.length,1);
  const above=await call(model,0.5+estimate+0.000001);assert.deepEqual(above.result,[0]);assert.equal(above.calls.length,2);
  const overCost=await call(model,5,estimate+0.000001);assert.equal(overCost.code,"invalid_response");assert.equal(overCost.calls.length,2);
  for(const atom of ["α",'\\''"'\\'',"\u0000"]){
   const prior=Array.from({length:9},(_,i)=>({role:i%2?"assistant":"user",content:atom.repeat(2000)}));
   const x=await call(model,5,0,prior);assert.deepEqual(x.result,[0]);
   const size=Buffer.byteLength(JSON.stringify(x.body)),context=JSON.parse(x.body.messages[1].content);
   assert.ok(size<=32768);assert.equal(context.conversation.at(-1).content,question);
   assert.deepEqual(context.facts,cadre.knowledge[0].facts.map((text,index)=>({index,text})));
   assert.equal(x.body.max_tokens,256);assert.equal(x.body.temperature,0);assert.equal(x.body.stream,false);
   assert.deepEqual(x.body.provider.max_price,{prompt:prices.inputPriceCeiling,completion:prices.outputPriceCeiling});
   assert.equal(x.body.provider.data_collection,"deny");assert.equal(x.body.provider.require_parameters,true);
   assert.equal(x.body.response_format.json_schema.strict,true);assert.equal(x.body.tools,undefined);
   rows.push({model,historyAtom:atom==="\u0000"?"NUL":atom,payloadBytes:size,retainedMessages:context.conversation.length,allFacts:true,finalQuestion:true});
  }
  rows.push({model,reservationEstimate:estimate,belowReserve:"blocked-before-inference",aboveReserve:"accepted",overEstimateCost:"rejected-without-retry"});
 }
 assert.equal(PROVIDER_LIMITS.maxPromptBytes,32768);assert.equal(PROVIDER_LIMITS.maxBodyBytes,32768);assert.equal(PROVIDER_LIMITS.maxOutputTokens,256);assert.equal(PROVIDER_LIMITS.reserveDollars,0.5);
 console.log(JSON.stringify({result:"PASS",externalHttpRequests:0,realInferenceAttempts:0,profiles:2,rows}));
})();'
```

Observed exit 0:

```json
{"result":"PASS","externalHttpRequests":0,"realInferenceAttempts":0,"profiles":2,"rows":[{"model":"openai/gpt-4.1-mini","historyAtom":"α","payloadBytes":29976,"retainedMessages":8,"allFacts":true,"finalQuestion":true},{"model":"openai/gpt-4.1-mini","historyAtom":"\"","payloadBytes":25818,"retainedMessages":4,"allFacts":true,"finalQuestion":true},{"model":"openai/gpt-4.1-mini","historyAtom":"NUL","payloadBytes":29781,"retainedMessages":3,"allFacts":true,"finalQuestion":true},{"model":"openai/gpt-4.1-mini","reservationEstimate":0.001875,"belowReserve":"blocked-before-inference","aboveReserve":"accepted","overEstimateCost":"rejected-without-retry"},{"model":"google/gemini-3.8-flash","historyAtom":"α","payloadBytes":29980,"retainedMessages":8,"allFacts":true,"finalQuestion":true},{"model":"google/gemini-3.8-flash","historyAtom":"\"","payloadBytes":25822,"retainedMessages":4,"allFacts":true,"finalQuestion":true},{"model":"google/gemini-3.8-flash","historyAtom":"NUL","payloadBytes":29785,"retainedMessages":3,"allFacts":true,"finalQuestion":true},{"model":"google/gemini-3.8-flash","reservationEstimate":0.003208,"belowReserve":"blocked-before-inference","aboveReserve":"accepted","overEstimateCost":"rejected-without-retry"}]}
```

The base synthetic case estimates were $0.001875 for GPT-4.1 Mini and $0.003208 for Gemini. They are conservative request reservations for this probe, **not observed inference costs**. Every network seam was synthetic; zero external HTTP requests and zero real inference attempts occurred.

Read-only discovery also established that construction lives in `src/server/chat.ts`; exploratory queries for a non-existing `scripts/` directory and `src/provider/factory.ts` returned missing-path errors. These were inspection-path misses, not app/test failures.

## Bounded evaluation preconditions

The prespecified plan correctly separates nine grounded/model-dependent cases and five deterministic controls per model, retains all failures, fixes prompt/temperature/output schema, records actual tokens/costs separately, and forbids silently switching production.

The evaluator implementation was not reviewed here and must independently enforce the following before live execution:

1. Count every POST to the provider completions endpoint at the transport boundary, including the provider's existing single retry on HTTP 429/503, against the **global 18-attempt cap**. A cap on logical cases alone is insufficient.
2. Reserve each attempted inference conservatively against the **global $0.15 experiment cap** and preserve the key's $0.50 reserve. Stop before sending if either cap would be crossed; ambiguous billing must not be counted as free.
3. Keep the model fixed for each intended row, the production environment unchanged, and deterministic controls at zero inference. Rows blocked by the attempt/cost cap remain NOT_RUN.
4. Retain failures/timeouts and actual timing/usage without raw provider errors, secrets or reasoning. Reconcile before/after key usage with reported completion costs and explicitly label any lag.
5. Do not infer real Gemini structured-output support, successful routing under the ceilings, quality, latency or price from these synthetic tests. Those remain the purpose of the bounded live evaluation.

The provider does not perform model fallback; it can repeat a transient rejection with the same model. Its per-selector budget remains best-effort local process state, not a new distributed experiment-wide accounting mechanism.

## SHA-256 snapshot

```sh
rtk proxy shasum -a 256 src/provider/config.ts src/provider/openrouter.ts tests/provider/model-selection.test.ts docs/model-evaluation-plan.md src/server/chat.ts src/core/limits.ts
```

```text
5581eb499e4525e1892a9ffe277b4a5f3296f7a2f6dd84184f1d93631773e907  src/provider/config.ts
bea1f37d621c916c87be93b26bb4954196c6d72b6483f3cc1fd78fab6795eb39  src/provider/openrouter.ts
285b74d658d87ba7dc7e3bb7520a3d7b004ac6e73f39fe5c283238e16c524c22  tests/provider/model-selection.test.ts
0c5914487ca4d63e20c8465210b60c7458173f580237389f6c63cae9fc15051c  docs/model-evaluation-plan.md
dee7bec99d9cdacb0a02a4114798157c179e4a50a69e61f2cbeeb9225f932ebb  src/server/chat.ts
40764d1a65f44cdeaa46a36f91a243a73008f1cbcdd6d36b02c95924e76e7c36  src/core/limits.ts
```

No new model catalog query, credentials, app server, real model request, root build, type/lint run or deployed behavior is claimed by this report. Extension critique and repair evidence are separate.

