# PX5 revision 4 engineering red-team review

Date: 2026-09-09 UTC.
Snapshot reviewed: `b8731ced0f754a07683c7c8e8d9da8753227f763`.
Role: critic/red-team review of the repair only; not independent final verification and not public deployment proof.

## Verdict

**PASS for handoff to independent verification.** No concrete blocker remains in the committed repair itself.

## Failure-mode review

### Ambient control intent

The prior implementation made the visible control and the branch condition disagree: React `paused=false` rendered **Pause**, but native `video.paused` could still be `true` while remote autoplay was pending. A Pause click could therefore enter the native-paused branch and issue `play()`.

The repaired implementation branches on the application state that owns the control label. When `paused=false`, the only branch calls `element.pause()`, sets `paused=true`, and returns. When `paused=true`, Play calls `element.play()` and changes state to false only after the promise resolves; rejection keeps the paused state. The deterministic browser regression explicitly forces native `paused=true` while the visible application state still offers Pause, so the original inversion reproduces against the old algorithm but not the repaired one.

No provider, routing, knowledge, persona, API, network, authentication, storage, or media-asset behavior changed.

### Release gate invalidation

The prior gate projected only `node.transitioned` and `gate.evaluated`, so a post-DONE `failure.recorded` + `node.invalidated` could leave stale DONE/PASS state. The repair replays those two event types in ledger order:

- `node.invalidated` -> status `repair_required`;
- `failure.recorded` with `gate_id` -> that gate becomes `FAIL`;
- later legitimate `node.transitioned` and `gate.evaluated` events supersede those projections in normal append-only order.

The new tests prove both directions: previously-DONE + failure/invalidation blocks with incomplete node + FAIL gate, and a subsequent repair + PASS gate + DONE returns to releasable state. On the real revision-4 ledger, `npm run release:gate` now blocks and names both `PX5-premium-release` and `integration-proof=FAIL`.

## Adversarial checks

- Native autoplay still pending before Pause: covered by deterministic E2E regression.
- Explicit Play promise rejection: state remains paused by `.catch(() => setPaused(true))`.
- Post-DONE evidence failure: release gate now revokes the stale DONE projection.
- Later valid repair: append-only later transition/gate events can restore releasability; covered by test.
- Assertion weakening: none; the existing ambient assertions remain and the cold-load condition is added before them.
- Scope expansion: none; the diff is UI control state + verification gate replay + tests/evidence.

## Granite critic signal

A requested local IBM Granite critic was run. The first detailed request timed out. A smaller retry produced a truncated blocker, a follow-up remained incomplete, and a binary query returned `FAIL`; when explicitly required to name one code-level defect, Granite returned `NO_DEFECT_FOUND`. All raw outputs are retained. Because that signal is internally inconsistent, this engineering review does **not** relabel Granite as PASS and does not use it as sole gate evidence.

Independent clean-worktree verification and post-repair public re-deployment remain mandatory.
