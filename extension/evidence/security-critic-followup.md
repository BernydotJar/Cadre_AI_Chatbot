# Extension security critic — repaired lifecycle follow-up

Date: 2026-09-09 UTC. Role: independent critic/verifier follow-up, not producer self-certification.

**Verdict: PASS for the repaired source/contract lifecycle gate.** The original P2 reproduced in `security-critic.md` no longer reproduces with the documented directional-disconnect semantics. This does **not** clear the separate installed-MV3, actual-origin/CSP/WAR, service-worker-lifetime or Cadre-site gates.

The original FAIL artifact remains unchanged: SHA-256 `1710af1618a25c9f93b8820f71cf845a32a796c1f4f1b37288f13eff2c3ceabe`. This is a new report, not a replacement.

## Repair reviewed

Read the new `extension/src/shared/bridge.ts`, complete directional bridge tests and `extension/evidence/lifecycle-fixer-report.md` before rerunning. Host disposal now explicitly removes its retained slot and disposes the panel. Panel disposal marks closed, clears the pending timer, aborts transport, releases the panel slot, sends CLOSE to its authenticated host and disconnects. Local rejection/CLOSE and remote-disconnect listeners share the same idempotent cleanup. Closed handlers cannot accept more commands.

The patch does not broaden permissions, API endpoint, accepted sender/token boundary, response limits or rendering. The producer's red/green receipts and 22 synthetic UI checks remain attributed to the producer; they are not presented as this verifier's runs.

## Independent actual commands/results

### Extension test suite

```sh
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts
```

Observed **71/71 tests, 3/3 files PASS**, exit 0, 213 ms. This directly exercised the corrected directional mock and new teardown/timer regressions. The Vite future-loader warning was nonfatal.

### Original directional reproductions plus cleanup variants

Using the same independently authored directional Port model as the original critique, changed the expected outcomes to the required fixed behavior and added variants. These are in-process mocks of the generated bridge, **not actual Chrome runtime installation tests**.

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
 assert.equal(reopened.closed,false);assert.deepEqual(reopened.messages,[{type:"READY"}]);h.peerDisconnect();
}
{
 const e=setup(),h=e.host(),p=e.panel();e.register(h);e.connect(p);p.receive(request);
 p.receive({type:"PING",url:"https://evil.invalid"});
 observations.push({case:"invalid command during fetch",panelDisconnected:p.closed,signalAbortedImmediately:e.signal.aborted,fetchCalls:e.calls});
 assert.equal(p.closed,true);assert.equal(e.signal.aborted,true);e.finish();await flush();h.peerDisconnect();
}
{
 const e=setup();
 for(let tab=1;tab<=8;tab++){const h=e.host(tab);e.connect(h);h.receive({type:"REGISTER",token:"invalid"});assert.equal(h.closed,true);}
 const ninth=e.host(9);e.register(ninth);
 observations.push({case:"eight invalid host registrations exhaust slots",ninthValidHostDisconnected:ninth.closed,ninthRegistered:ninth.messages.some(v=>v.type==="REGISTERED"),fetchCalls:e.calls});
 assert.equal(ninth.closed,false);assert.deepEqual(ninth.messages,[{type:"REGISTERED"}]);ninth.peerDisconnect();
}
for(const action of ["close-pending","peer-panel","peer-host","host-invalid"]) {
 const e=setup(),h=e.host(),p=e.panel();e.register(h);e.connect(p);p.receive(request);
 let abortEvents=0;e.signal.addEventListener("abort",()=>abortEvents++);
 if(action==="close-pending")p.receive({type:"CLOSE"});
 if(action==="peer-panel")p.peerDisconnect();
 if(action==="peer-host")h.peerDisconnect();
 if(action==="host-invalid")h.receive({type:"REGISTER",token});
 assert.equal(e.signal.aborted,true);assert.equal(abortEvents,1);
 p.peerDisconnect();h.peerDisconnect();p.disconnect();h.disconnect();
 assert.equal(abortEvents,1);
 const h2=e.host(),p2=e.panel();e.register(h2);e.connect(p2);
 assert.deepEqual(h2.messages,[{type:"REGISTERED"}]);assert.deepEqual(p2.messages,[{type:"READY"}]);
 e.finish();await flush();
 assert.deepEqual(p2.messages,[{type:"READY"}]);
 assert.ok(!p.messages.some(v=>v.type==="CHAT_RESPONSE"||v.type==="CHAT_ERROR"));
 observations.push({case:action,aborted:true,abortEvents,replacementReady:true,lateReplySuppressed:true,fetchCalls:e.calls});
 h2.peerDisconnect();
}
{
 const e=setup(),hosts=[];
 for(let tab=1;tab<=8;tab++){const h=e.host(tab);e.register(h);assert.deepEqual(h.messages,[{type:"REGISTERED"}]);hosts.push(h);}
 const blocked=e.host(9);e.connect(blocked);assert.equal(blocked.closed,true);
 hosts[0].peerDisconnect();
 const admitted=e.host(9);e.register(admitted);assert.deepEqual(admitted.messages,[{type:"REGISTERED"}]);
 observations.push({case:"live eight-tab cap and capacity recovery",ninthBlocked:true,slotFreedOnPeerDisconnect:true,ninthThenRegistered:true,fetchCalls:e.calls});
 for(const h of hosts)h.peerDisconnect();admitted.peerDisconnect();
}
console.log(JSON.stringify({result:"PASS",scope:"generated bridge with documented one-sided disconnect semantics; no installed Chrome runtime",externalHttpRequests:0,inferenceRequests:0,observations}));
})();'
```

Observed exit 0:

```json
{"result":"PASS","scope":"generated bridge with documented one-sided disconnect semantics; no installed Chrome runtime","externalHttpRequests":0,"inferenceRequests":0,"observations":[{"case":"worker CLOSE then same-host reopen","firstPanelClosed":true,"localDisconnectCallbacks":0,"reopenedDisconnected":false,"reopenedReady":true,"fetchCalls":0},{"case":"invalid command during fetch","panelDisconnected":true,"signalAbortedImmediately":true,"fetchCalls":1},{"case":"eight invalid host registrations exhaust slots","ninthValidHostDisconnected":false,"ninthRegistered":true,"fetchCalls":0},{"case":"close-pending","aborted":true,"abortEvents":1,"replacementReady":true,"lateReplySuppressed":true,"fetchCalls":1},{"case":"peer-panel","aborted":true,"abortEvents":1,"replacementReady":true,"lateReplySuppressed":true,"fetchCalls":1},{"case":"peer-host","aborted":true,"abortEvents":1,"replacementReady":true,"lateReplySuppressed":true,"fetchCalls":1},{"case":"host-invalid","aborted":true,"abortEvents":1,"replacementReady":true,"lateReplySuppressed":true,"fetchCalls":1},{"case":"live eight-tab cap and capacity recovery","ninthBlocked":true,"slotFreedOnPeerDisconnect":true,"ninthThenRegistered":true,"fetchCalls":0}]}
```

Eight checked scenarios:

1. Worker CLOSE followed by same-host reopen: replacement gets READY although the locally closed port never receives its own disconnect callback.
2. Invalid command during pending fetch: signal is immediately aborted and channel closes.
3. Eight malformed registrations: ninth valid registration succeeds; no rejected-host capacity leak.
4. CLOSE while pending.
5. Panel peer disconnect while pending.
6. Host peer disconnect while pending.
7. Invalid re-registration of a host with pending panel work.
8. Real eight-slot occupancy: ninth is correctly refused, then succeeds after a peer disconnect frees one slot.

Cases 4–7 verify exactly one abort event despite repeated cleanup, successful replacement host/panel admission, and no post-close CHAT_RESPONSE/CHAT_ERROR from the controlled abort-rejecting transport. The output's `lateReplySuppressed` flag refers to these controlled post-cleanup transport outcomes; it is not a real provider/network timing claim. All fetches were injected in-process promises. No HTTP or inference occurred.

### Reproducible generated output without writes

Repeated the original virtual-filesystem build probe: execute unchanged `extension/build.mjs` twice with real read-only source inputs and virtual writes, then compare every result with the existing generated output.

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

Observed exit 0:

```json
{"result":"PASS","method":"execute unchanged build.mjs twice with virtual writes; compare every output against existing dist","actualBuildFilesystemWrites":0,"files":11,"outputs":[{"name":"config.js","bytes":1167,"sha256":"234e690f18fa1e770063f6fdcaee5d3cb7959ffc8926cc3636595422340ba77c"},{"name":"content-script.js","bytes":6750,"sha256":"fd64f46300767371bbb82234a0c50005a8ddd5a76a0b925f42fab49fca51d2e1"},{"name":"manifest.json","bytes":1193,"sha256":"47bcf96f7cfec7a3f7868baa4f8fac587b9d045ee06f602bb94cc20760042b7c"},{"name":"panel.css","bytes":3782,"sha256":"ea57a7d19f492682b40a141277f2fc47e5c627ffce7762cd54dd779e698a8d72"},{"name":"panel.html","bytes":2060,"sha256":"ad93fc2ee07ab1cbe1a7d4df6097212af0d54c0de46e3bc66caa4014f98520ad"},{"name":"panel.js","bytes":9097,"sha256":"a3f8a13e2647993f73ae53c7574a7b6ee8b399940a4613a9ef3b948d5e8b04e2"},{"name":"service-worker.js","bytes":169,"sha256":"c632b7e7503b501bbca939fa3fbac593d3b9f4ae818585fb04de5578ed545908"},{"name":"shared/bridge.js","bytes":6286,"sha256":"9e9cc6c279c6ee49d3ff2a4e3e1105b7a4b091e4f89b92a6f402a127ba379d7a"},{"name":"shared/contracts.js","bytes":6191,"sha256":"0e7c94b7c1edad97792f6d06c199649d2ff8ef59c8cde3315811af590cc9c6b1"},{"name":"shared/conversation.js","bytes":2106,"sha256":"86cbc972655913d58a1bf67c72121778393c440907243f25d8fdba2e72ee8591"},{"name":"shared/limits.js","bytes":1150,"sha256":"da48518e19548a8df30bab522a430cdc152b99bbdd6727ce111cbb7f66dfa57e"}],"sourceReads":["extension/config.json","extension/src/content-script.ts","extension/src/panel/panel.css","extension/src/panel/panel.html","extension/src/panel/panel.ts","extension/src/service-worker.ts","extension/src/shared/bridge.ts","extension/src/shared/contracts.ts","src/config/cadre.ts","src/core/limits.ts","src/ui/conversation.ts"],"externalHttpRequests":0}
```

All eleven outputs match both virtual builds and disk; only the repaired generated bridge differs from the original output snapshot. No root build or generated filesystem write was performed. Node typeless-module/experimental-VM warnings were nonfatal.

## SHA-256 and evidence preservation

```sh
rtk proxy shasum -a 256 extension/src/shared/bridge.ts extension/tests/bridge.test.ts extension/tests/browser-mock.mjs extension/dist/shared/bridge.js extension/dist/manifest.json extension/evidence/security-critic.md
```

```text
5927ee6355023c0304d362b47429835e2f64b265777fd2b94f9f9647e363011e  extension/src/shared/bridge.ts
ee89a9a233d2cf0542123df48555a6c1397c7a5010158e7f7e7bbcd348aeb400  extension/tests/bridge.test.ts
b87d0d08996dde9498756a5734e4c198664155a3fa5d22473da3c5abb8705ce9  extension/tests/browser-mock.mjs
9e9cc6c279c6ee49d3ff2a4e3e1105b7a4b091e4f89b92a6f402a127ba379d7a  extension/dist/shared/bridge.js
47bcf96f7cfec7a3f7868baa4f8fac587b9d045ee06f602bb94cc20760042b7c  extension/dist/manifest.json
1710af1618a25c9f93b8820f71cf845a32a796c1f4f1b37288f13eff2c3ceabe  extension/evidence/security-critic.md
```

## Remaining gates and limitations

No new source-level issue was reproduced by this follow-up. The documented directionality basis and broader original security inspection remain in `security-critic.md`; the P2 is resolved on the hashes above.

Still **NOT VERIFIED**: actual installed extension identity/origin, Chrome-supplied sender/tab/frame metadata, CSP and web-accessible-resource enforcement, extension cross-origin network permissions, iframe isolation on the real site, MV3 idle lifetime, navigation/BFCache and disable/uninstall behavior. Fake runtime ports do not establish these. No extension was installed in a browser profile and no actual Cadre page was injected.

This verifier did not rerun producer browser screenshots or claim its type/lint/build checks, inspect credentials/environment files, edit source/tests, invoke real API/inference, modify Git/ledger or deploy. The separate model-configuration critique is unrelated evidence and is not an extension pass criterion.

