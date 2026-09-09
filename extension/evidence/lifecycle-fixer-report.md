# Extension lifecycle repair — 2026-09-09 04:51 UTC

Role: producer acting as Fixer after the separate security critic's original FAIL. **Producer rerun PASS; independent follow-up pending.** No installed MV3 or actual-site claim is made.

## Finding repaired

The independent critic demonstrated that the worker incorrectly depended on its own `onDisconnect` callback after calling `Port.disconnect()` locally. Chrome documents that a local disconnect triggers the opposite endpoint's callback, not this endpoint's callback. The original fake implemented the wrong direction and hid the defect. The original report remains at `security-critic.md`, SHA-256 `1710af1618a25c9f93b8820f71cf845a32a796c1f4f1b37288f13eff2c3ceabe`.

Scoped source changes:

- `src/shared/bridge.ts`: explicit, idempotent host and panel disposal. Every locally rejected registered channel and explicit CLOSE performs teardown before disconnect: release the owned map/slot, clear its timer, abort pending transport and remove the dead panel through its authenticated host. Peer disconnect invokes the same cleanup. Repeated cleanup is harmless. Host disposal explicitly disposes its panel; no local callback is assumed.
- `tests/bridge.test.ts`: local `disconnect()` no longer fires local listeners, `peerDisconnect()` models the opposite endpoint, and `postMessage()` throws on closed ports. Four new regressions cover CLOSE/reopen, invalid-command cancellation/timer release, rejected host capacity recovery and repeated host/panel teardown.
- `tests/browser-mock.mjs`: the mock runtime now distinguishes local and peer disconnect. Each browser run uses a new output directory and refuses to overwrite existing evidence. README documents fresh run labels and the pending independent repair gate.

No permissions, endpoint, manifest, API contract, provider configuration, content-script behavior, panel rendering or core application files were changed by this repair.

## Red → green observations

1. Before changing the bridge, the directional mock plus new regressions produced **66 PASS / 5 FAIL out of 71**. This includes the existing peer-host-disconnect assertion, newly unmasked by the corrected mock, plus the four new tests. Report: `lifecycle-red-tests.json`. Exit 1 is the expected defect evidence, not a pass.
2. Explicit cleanup repaired those cases: **71 / 71 PASS**. The first green run is retained as `lifecycle-green-tests.json`.
3. Root nonincremental TypeScript checking then found three closure-narrowing diagnostics for the already-validated host. Introducing an explicitly narrowed `Host` binding fixed those compile errors without changing the trust check. A rebuild and final suite again produced **71 / 71 PASS**; `lifecycle-final-tests.json`. Typecheck exit 0.
4. Extension ESLint exit 0. Build exit 0; eleven generated files, **39,951 bytes**. No environment/provider files were read.
5. Synthetic browser run `lifecycle-fix` produced **22 PASS**, zero real API requests and zero actual-site requests. Files are under `extension/evidence/lifecycle-fix/`; original producer screenshots and receipts were not overwritten. This mock does not execute the real worker and is not independent evidence of the transport repair; directional worker tests provide that producer-level check.

Exact commands:

```sh
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts --reporter=default --reporter=json --outputFile=extension/evidence/lifecycle-red-tests.json
rtk proxy node extension/build.mjs
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts --reporter=default --reporter=json --outputFile=extension/evidence/lifecycle-green-tests.json
rtk proxy npm exec -- tsc --noEmit --incremental false
rtk proxy node extension/build.mjs
rtk proxy npm exec -- tsc --noEmit --incremental false
rtk proxy npm exec -- vitest run --config extension/vitest.config.ts --reporter=default --reporter=json --outputFile=extension/evidence/lifecycle-final-tests.json
rtk proxy npm exec -- eslint extension
rtk proxy node extension/tests/browser-mock.mjs lifecycle-fix
```

An initial JSON reporter attempt lacked write permission under this agent's new turn and failed with EPERM. Renewing the scoped `extension/` filesystem permission allowed the retained red report. The Vite future native-config warning remained nonfatal. Synthetic Chromium used the previously required reviewed launch escalation; no real HTTP or extension installation was permitted.

## Evidence preservation and stable handoff

`lifecycle-fix-manifest.json` records all current source/output hashes, red/intermediate/final test receipts, fresh synthetic-browser artifacts and original evidence hashes. Key fixed source:

- `src/shared/bridge.ts`: `5927ee6355023c0304d362b47429835e2f64b265777fd2b94f9f9647e363011e`
- `tests/bridge.test.ts`: `ee89a9a233d2cf0542123df48555a6c1397c7a5010158e7f7e7bbcd348aeb400`
- Generated `shared/bridge.js`: `9e9cc6c279c6ee49d3ff2a4e3e1105b7a4b091e4f89b92a6f402a127ba379d7a`

Original `producer-report.md`, `producer-source-manifest.json`, `browser-mock.json`, both screenshots and `security-critic.md` remain unchanged. No Git or graph writes were performed. Source is stable for the independent critic/verifier's directional reproducer rerun.

Installed extension identity, actual CSP/WAR and host-permission enforcement, real service-worker lifetime, actual-site UI/navigation/BFCache and disable/uninstall still require a separately authorized installed-browser gate. Passing this source repair does not close those unverified gates.
