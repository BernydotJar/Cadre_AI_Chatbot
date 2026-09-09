# PX5 revision 4 fixer — public ambient control + release-gate invalidation

Date: 2026-09-09 UTC.

The exact premium closure `ded08392e2dfea76e4050a234165f5e7b8c4152b` was deployed to the existing Vercel project as `dpl_A6CvaDHT34auCMFFoNxnmDvCXCBY`. Anonymous marker/API smoke passed, but the first full public browser matrix returned **57/58 PASS**. Desktop cold-load reproduction showed the visible `Pause ambient motion` control could leave application state at `video` because `toggleMotion()` branched on the native media element's transient `paused` flag while autoplay was still pending.

The post-DONE Graph invalidation also exposed a fail-closed defect in `tools/release/check-premium-gate.mjs`: it tracked only `node.transitioned` and `gate.evaluated`, so a later `failure.recorded` + `node.invalidated` did not revoke an earlier DONE/PASS projection.

## Repairs

1. `AmbientMedia.toggleMotion()` now branches on the application-owned `paused` state that drives the visible control. A visible Pause action always calls `pause()` and records `paused=true`, even if native autoplay has not started. A visible Play action calls `play()` and clears the paused state only after the play promise resolves; a rejection leaves the UI paused.
2. The ambient E2E test now deterministically forces the native video into `paused=true` while the application control still offers Pause before clicking it. This reproduces the remote cold-load race against the old implementation and passes only when user intent wins.
3. The premium release gate now treats `node.invalidated` as `repair_required` and `failure.recorded` with a `gate_id` as an active FAIL until later repair transitions/gate evaluations supersede them.
4. Release-gate tests cover both post-DONE invalidation blocking and the later repaired/re-gated DONE state.

## Fixer matrix

`evidence/premium-release/px5-public-repair-matrix-20260909.txt` records:

- typecheck PASS
- lint PASS
- **288/288 Vitest PASS** (release-gate suite grows from 4 to 6 tests)
- production build PASS
- **58/58 local Playwright PASS** including the deterministic autoplay-pending case on desktop/mobile
- extension build PASS
- **72/72 extension tests PASS**
- fresh synthetic extension **24/24 PASS**, zero real site/API requests
- premium Graph VALID
- repository `release:gate` correctly **BLOCKED** while PX5 revision 4 is RUNNING, with both the incomplete node and `integration-proof=FAIL` reported.

This is fixer evidence only. A fresh independent review and clean verification are still required before re-deployment.
