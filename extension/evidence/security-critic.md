# Extension security critic — original snapshot

Date: 2026-09-09 UTC. Role: independent security critic, separate from the extension producer.

**Verdict: FAIL — one concrete P2 teardown defect blocks the source security/lifecycle gate.** The existing 67 tests pass, but their local-disconnect mock semantics mask the defect. No installed MV3 verification or actual Cadre-site injection was performed. This original report must remain immutable after repair.

The completed producer report `extension/evidence/producer-report.md` was read before this verdict. Its 22 mock-browser checks, typecheck/lint/build observations and screenshots are producer evidence, not runs by this critic.

## P2 — worker-initiated disconnect skips local teardown

Location: `extension/src/shared/bridge.ts` lines 25–35, 50–58 and 93–96; especially the local `disconnect(port)` paths at lines 28, 52 and 58.

The worker puts registered hosts and panel ports into retained state but releases that state and aborts pending work only in its own `onDisconnect` listeners. Calling `Port.disconnect()` locally does not trigger that same endpoint's listener; Chrome delivers the event to the opposite endpoint. This is the documented contract, not an assumption that a real browser was tested. See [Chrome runtime Port](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-Port) and [Chrome message-passing lifetime](https://developer.chrome.com/docs/extensions/develop/concepts/messaging#port-lifetime).

Independent zero-network reproduction against the generated `shared/bridge.js`, with a directional mock following that documented contract:

| Case | Expected cleanup | Observed |
|---|---|---|
| Registered panel sends CLOSE, then a panel reopens under the same host/token | Clear `host.panel`, accept the replacement, emit READY | First port closes; its local disconnect callback count is 0; replacement is disconnected without READY |
| Valid request is pending, then the authenticated panel sends an invalid envelope | Disconnect and abort pending transport immediately | Panel disconnects, but the fetch signal remains un-aborted |
| Eight invalid host registrations followed by one valid host | Rejected hosts release slots | All eight slots remain occupied; the ninth valid host is disconnected without REGISTERED |

These manifestations share one cleanup cause. Normal CLOSE/reopen is directly relevant; the malformed-message cases are robustness/abuse-boundary probes from an already accepted extension channel, **not proof that arbitrary website JavaScript can impersonate an extension sender**. The ignored pending request can continue consuming transport/model work until another cancellation or timeout occurs. No real request was sent during this reproduction.

The current `FakePort.disconnect()` in `extension/tests/bridge.test.ts` fires its own listeners, unlike the documented runtime. The fake browser runtime also fires local disconnect callbacks and does not load the real worker; its passing close/reopen scenario therefore cannot refute this defect.

Repair recommendation: make host/panel teardown explicit and idempotent, call it before every worker-initiated close/rejection and from peer-disconnect listeners, abort current work and release retained slots independently of Chrome callbacks. Add directional endpoint tests for normal CLOSE/reopen, invalid-envelope cancellation, malformed registration capacity recovery, host shutdown and repeated disconnect. No source repair was made by this critic.

## Checks independently performed

1. Read all extension source, configuration, build logic, tests, generated manifest, README, preview design and authorization, plus the completed producer report.
2. Ran the existing extension suite:

```sh
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts
```

Observed: **67 tests / 3 files PASS**, exit 0, 201 ms. The Vite native-loader future-compatibility warning was nonfatal. Tests used synthetic/fake fetch and Chrome interfaces; this is not MV3 installation evidence.

3. Ran the following directional-disconnect probe from the project root:

```sh
rtk proxy node -e 'const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
(async () => {
const { installBridge } = await import(pathToFileURL(path.resolve("extension/dist/shared/bridge.js")).href);
const ext = "abcdefghijklmnopabcdefghijklmnop", token = "a".repeat(32);
const endpoint = "https://cadre-ai-chatbot-tawny.vercel.app/api/chat";
const request = { type:"CHAT_REQUEST", requestId:"12345678-1234-1234-1234-123456789012", payload:{messages:[{role:"user",content:"services"}]} };
class Port {
 constructor(name,sender){this.name=name;this.sender=sender;this.messages=[];this.closed=false;this.ml=[];this.dl=[];this.localDisconnectCallbacks=0;}
 onMessage={addListener:fn=>this.ml.push(fn)};
 onDisconnect={addListener:fn=>this.dl.push(fn)};
 postMessage(v){if(this.closed)throw Error("disconnected");this.messages.push(v);}
 receive(v){if(!this.closed)for(const fn of this.ml)fn(v);}
 disconnect(){this.closed=true;}
 peerDisconnect(){if(this.closed)return;this.closed=true;for(const fn of this.dl){this.localDisconnectCallbacks++;fn();}}
}
function setup(){
 let connected, calls=0, finish, signal;
 const fetcher=(_url,init)=>{calls++;signal=init.signal;return new Promise((resolve,reject)=>{finish=()=>resolve(Response.json({reply:"Controlled",kind:"grounded"}));signal.addEventListener("abort",()=>reject(new DOMException("Aborted","AbortError")));});};
 const runtime={id:ext,onConnect:{addListener:fn=>connected=fn}};
 installBridge(runtime,endpoint,["https://cadre.ai","https://www.cadre.ai"],fetcher);
 const host=(tab=4)=>new Port("cadre-preview-host-v1",{id:ext,url:"https://cadre.ai/",origin:"https://cadre.ai",frameId:0,documentId:"host-"+tab,tab:{id:tab}});
 const panel=(tab=4)=>new Port("cadre-preview-panel-v1",{id:ext,url:"chrome-extension://"+ext+"/panel.html#"+token,origin:"chrome-extension://"+ext,frameId:1,documentId:"panel-"+tab,tab:{id:tab}});
 return {connect:p=>connected(p),host,panel,register(h){connected(h);h.receive({type:"REGISTER",token});},get calls(){return calls;},get signal(){return signal;},finish:()=>finish?.()};
}
const flush=async()=>{for(let n=0;n<20;n++)await Promise.resolve();};
const observations=[];
{
 const e=setup(),h=e.host(),p=e.panel();e.register(h);e.connect(p);assert.deepEqual(p.messages,[{type:"READY"}]);
 p.receive({type:"CLOSE"});p.peerDisconnect();
 const reopened=e.panel();e.connect(reopened);
 observations.push({case:"worker CLOSE then same-host reopen",firstPanelClosed:p.closed,localDisconnectCallbacks:p.localDisconnectCallbacks,reopenedDisconnected:reopened.closed,reopenedReady:reopened.messages.some(v=>v.type==="READY"),fetchCalls:e.calls});
 assert.equal(reopened.closed,true);assert.equal(reopened.messages.length,0);h.peerDisconnect();
}
{
 const e=setup(),h=e.host(),p=e.panel();e.register(h);e.connect(p);p.receive(request);
 p.receive({type:"PING",url:"https://evil.invalid"});
 observations.push({case:"invalid command during fetch",panelDisconnected:p.closed,signalAbortedImmediately:e.signal.aborted,fetchCalls:e.calls});
 assert.equal(p.closed,true);assert.equal(e.signal.aborted,false);e.finish();await flush();h.peerDisconnect();
}
{
 const e=setup();
 for(let tab=1;tab<=8;tab++){const h=e.host(tab);e.connect(h);h.receive({type:"REGISTER",token:"invalid"});assert.equal(h.closed,true);}
 const ninth=e.host(9);e.register(ninth);
 observations.push({case:"eight invalid host registrations exhaust slots",ninthValidHostDisconnected:ninth.closed,ninthRegistered:ninth.messages.some(v=>v.type==="REGISTERED"),fetchCalls:e.calls});
 assert.equal(ninth.closed,true);
}
console.log(JSON.stringify({result:"DEFECT_REPRODUCED",scope:"generated bridge with documented one-sided disconnect semantics; no installed Chrome runtime",externalHttpRequests:0,inferenceRequests:0,observations}));
})();'
```

Observed exit 0 means the reproducer's defect assertions succeeded, not that the application passed:

```json
{"result":"DEFECT_REPRODUCED","scope":"generated bridge with documented one-sided disconnect semantics; no installed Chrome runtime","externalHttpRequests":0,"inferenceRequests":0,"observations":[{"case":"worker CLOSE then same-host reopen","firstPanelClosed":true,"localDisconnectCallbacks":0,"reopenedDisconnected":true,"reopenedReady":false,"fetchCalls":0},{"case":"invalid command during fetch","panelDisconnected":true,"signalAbortedImmediately":false,"fetchCalls":1},{"case":"eight invalid host registrations exhaust slots","ninthValidHostDisconnected":true,"ninthRegistered":false,"fetchCalls":0}]}
```

The one fetch call is an injected in-process promise returning synthetic JSON, not HTTP. The probe resolves its controlled pending promise during cleanup. Node's typeless-module warning was nonfatal.

4. Checked reproducibility without altering the shared generated build. Executed unchanged `build.mjs` twice in a VM with read-only real inputs and virtual filesystem writes; compared all eleven outputs byte-for-byte with each other and the existing `extension/dist`.

```sh
rtk proxy node --experimental-vm-modules -e 'const {readFile,readdir}=require("node:fs/promises");
const path=require("node:path"), {pathToFileURL}=require("node:url"), vm=require("node:vm"), ts=require("typescript"), assert=require("node:assert/strict"), {createHash}=require("node:crypto");
const root=process.cwd(), build=path.join(root,"extension/build.mjs"), dist=path.join(root,"extension/dist");
const hash=x=>createHash("sha256").update(x).digest("hex");
async function generate(){
 const outputs=new Map(),reads=new Set();
 const safeRead=async(file,encoding)=>{const p=String(file);assert.ok(p.startsWith(root+path.sep));assert.ok(!p.split(path.sep).some(v=>v.startsWith(".env")));reads.add(path.relative(root,p));return readFile(p,encoding);};
 const fs={readFile:safeRead,mkdir:async()=>{},writeFile:async(file,data)=>{assert.ok(file.startsWith(dist+path.sep));outputs.set(path.relative(dist,file),Buffer.from(data));},copyFile:async(src,dest)=>{assert.ok(dest.startsWith(dist+path.sep));outputs.set(path.relative(dist,dest),await safeRead(src));}};
 const context=vm.createContext({URL,console:{log:()=>{}}});
 const src=await readFile(build,"utf8");
 const mod=new vm.SourceTextModule(src,{context,identifier:pathToFileURL(build).href,initializeImportMeta:meta=>{meta.url=pathToFileURL(build).href;}});
 await mod.link(spec=>{
  const values=spec==="node:fs/promises"?fs:spec==="node:url"?require("node:url"):spec==="node:path"?{default:path}:spec==="typescript"?{default:ts}:null;
  assert.ok(values,"Unexpected import");
  return new vm.SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v);},{context});
 });
 await mod.evaluate();
 return{outputs,reads:[...reads].sort()};
}
(async()=>{
 const a=await generate(),b=await generate(),actual=(await readdir(dist,{recursive:true,withFileTypes:true})).filter(e=>e.isFile()).map(e=>path.relative(dist,path.join(e.parentPath,e.name))).sort();
 assert.deepEqual([...a.outputs.keys()].sort(),actual);assert.deepEqual([...b.outputs.keys()].sort(),actual);
 const files=[];
 for(const name of actual){const x=a.outputs.get(name),y=b.outputs.get(name),disk=await readFile(path.join(dist,name));assert.deepEqual(x,y);assert.deepEqual(x,disk);files.push({name,bytes:x.length,sha256:hash(x)});}
 console.log(JSON.stringify({result:"PASS",method:"execute unchanged build.mjs twice with virtual writes; compare every output against existing dist",actualBuildFilesystemWrites:0,files:files.length,outputs:files,sourceReads:a.reads,externalHttpRequests:0}));
})();'
```

Observed: **PASS**, exit 0, eleven identical outputs, zero actual build filesystem writes and zero external HTTP requests. First harness attempt failed before generation because the VM did not expose the standard URL global (`ReferenceError: URL is not defined`); adding URL to the isolated harness context, without source changes, yielded the recorded pass. The experimental-VM warning was nonfatal.

Generated output SHA-256 snapshot:

```text
234e690f18fa1e770063f6fdcaee5d3cb7959ffc8926cc3636595422340ba77c  config.js
fd64f46300767371bbb82234a0c50005a8ddd5a76a0b925f42fab49fca51d2e1  content-script.js
47bcf96f7cfec7a3f7868baa4f8fac587b9d045ee06f602bb94cc20760042b7c  manifest.json
ea57a7d19f492682b40a141277f2fc47e5c627ffce7762cd54dd779e698a8d72  panel.css
ad93fc2ee07ab1cbe1a7d4df6097212af0d54c0de46e3bc66caa4014f98520ad  panel.html
a3f8a13e2647993f73ae53c7574a7b6ee8b399940a4613a9ef3b948d5e8b04e2  panel.js
c632b7e7503b501bbca939fa3fbac593d3b9f4ae818585fb04de5578ed545908  service-worker.js
66930d6fa63244dfdd682c84e841d6a5de13200153f8320fb953f8a1ea7e2496  shared/bridge.js
0e7c94b7c1edad97792f6d06c199649d2ff8ef59c8cde3315811af590cc9c6b1  shared/contracts.js
86cbc972655913d58a1bf67c72121778393c440907243f25d8fdba2e72ee8591  shared/conversation.js
da48518e19548a8df30bab522a430cdc152b99bbdd6727ce111cbb7f66dfa57e  shared/limits.js
```

## Other boundaries reviewed

No additional concrete defect was reproduced in these scoped checks:

- Manifest has no general API permissions, tabs/storage/cookies/history/scripting/activeTab access or externally_connectable entry. Content matches are only the two exact HTTPS Cadre origins, top frame, document_idle, isolated world. Host access is only the fixed Vercel origin.
- Worker entrypoint passes its generated constant endpoint; callers cannot supply a URL. Request envelope keys, roles, final user turn, message count/characters and serialized byte cap are checked. Transport uses explicit credentials omission, redirect rejection, no-store and no-referrer. The generated build includes no provider/server module.
- Sender checks require the same extension ID, tab/document identity, allowed top-frame host metadata and registered bounded token. Panel metadata requires a nested extension-origin panel.html URL and the same tab/token, with duplicate panel rejection. Tokens are channel binding, not account authentication.
- Responses are streamed with a 16 KiB byte cap, strict UTF-8/JSON/exact reply-kind schema and a 2,400-character reply bound; errors do not forward upstream bodies. The existing tests exercise these bounds and safe error handling.
- Panel is an extension-origin iframe; text nodes and exact approved link parts are used, with noopener/noreferrer links. No model HTML insertion, page postMessage bridge or reading of host forms/cookies/storage exists in the inspected source.
- Only panel.html is web-accessible on the named Cadre origins; CSP declares local scripts/styles and a fixed connection origin, without unsafe-inline/eval. This is configuration inspection, not proof of installed browser enforcement.
- Core history/clarification/response/link utilities are reused. Build reads literal public display fields through the TypeScript AST, not environment files or executable config.

## Original source SHA-256

Command:

```sh
rtk proxy shasum -a 256 extension/src/shared/bridge.ts extension/src/shared/contracts.ts extension/src/service-worker.ts extension/src/content-script.ts extension/src/panel/panel.ts extension/src/panel/panel.html extension/build.mjs extension/config.json extension/tests/bridge.test.ts extension/tests/browser-mock.mjs
```

```text
97c759a77a7045b46b2b18f3272f714e60f726828dcde8ef0077f57d920d0dbc  extension/src/shared/bridge.ts
0f7aadfa99be1a6118eab605ba258bc9f0bf71fcb24f7d46e67003deab3b958f  extension/src/shared/contracts.ts
0caf21985ce266c21b1c317c69a07287234edd7ecff66df768561b3d202fdb24  extension/src/service-worker.ts
361b5f05a2d95ea77074df359216920743d22fad102297a34929da35a13f4f80  extension/src/content-script.ts
2e505979c9f0afcada7686e554cda5a7670b0d5f43fc5c00b2ebcebf9403797a  extension/src/panel/panel.ts
ad93fc2ee07ab1cbe1a7d4df6097212af0d54c0de46e3bc66caa4014f98520ad  extension/src/panel/panel.html
6a0929cedca39ec18ba9c084cb4f6a4eb67307783f43540b6cfc376f47c0ba7d  extension/build.mjs
923786a07106202bca22fd09dcb53996e63e09d0dae2fc3dddef2eee0187bae9  extension/config.json
fda003184260eab907128c4751423ff5aa3143236c923b9c83007e539f38167c  extension/tests/bridge.test.ts
5a22174ecae70f564633f5dbc427a8f5c7f88bb3a0754ae758bc42b0ddc8461e  extension/tests/browser-mock.mjs
```

## Required gates and honest limitations

Repair and independent rerun are required for the P2. Even after source/mock repair passes, **installed-origin identity, actual CSP/WAR loading, real Chrome sender/frame metadata, service-worker lifecycle, cross-origin permission enforcement, page isolation, navigation/BFCache and disable/uninstall remain unverified installation gates**. No extension was loaded into any browser profile and no actual Cadre page was injected or modified.

No browser-mock script was rerun here because it would overwrite the producer's evidence, and it uses a fake runtime rather than installed MV3. No inference or actual application HTTP occurred in critic tests; the only external research was the official Chrome API documentation used to establish disconnect semantics. The direct API-page open timed out, then official search results supplied the documented contract. No real credentials/environment files, Git/ledger, root build, source edits or deployment were used.

