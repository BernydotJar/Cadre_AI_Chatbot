# Premium experience checkpoint — Donna

Updated: 2026-09-09 UTC. The premium Graph ledger is authoritative for this increment.

- Graph: `progress/premium-graph.project.json` + `progress/premium-graph.events.jsonl`.
- Current node: `PX2-donna-premium-identity` — **DONE**. `design-review=PASS`, `verification=PASS`, and `integration-proof=PASS` are backed by separate Claude Code critic/verifier contexts plus live-render geometry and the full regression suite.
- PX3 ambient media is **RUNNING / second fixer complete pending fresh review**. The first critic rejected imperceptible motion; the second critic confirmed the content repair but found mobile Pause overlap + incomplete width evidence. Both are now repaired and regression-green. PX4 remains READY; PX5 remains dependency-locked.
- Independent critic: authenticated Claude Code 2.1.266, project `critic` agent, high-effort read-only review. Evidence: `evidence/premium-critic/claude-uiux-critique-20260909.md`. It rejected the glowing hex/circuit avatar, duplicate hero hierarchy, demoted composer, repeated mark/kicker treatment, and tiny starter typography.
- Fixer source: removed glow/hex/animated traces and the hero-size Donna mark; the signal is now one static ring + accent notch + monogram. The composer precedes welcome content, starter topics are one-column 14–15px rows, and empty-state copy is an invitation rather than a pre-answer claim. The follow-up critic PASS is retained at `evidence/premium-critic/claude-uiux-followup-20260909.md`.
- Verification after the repair: 283/283 Vitest, typecheck PASS, lint PASS, build PASS, final 52/52 Playwright PASS. The first browser rerun exposed reset-focus and sub-pixel 360x640 readability defects; both are retained in `evidence/premium-identity/px2-fixer-20260909.md` and repaired before the final PASS.
- Deterministic screenshot/geometry evidence: `donna-premium-fixer-{desktop,mobile}-20260909.png` and `px2-fixer-geometry-20260909.json`; both viewports have no horizontal overflow, two visible Donna marks, zero animated signal descendants, and the composer precedes welcome guidance.
- Earlier Granite design-critic attempts remain historical blocked evidence; they are not used now that real Claude Code critic evidence includes both the first CHANGES_REQUESTED verdict and the repaired-snapshot PASS.
- Public production alias remains on the previously verified productized release; premium WIP has **not** been promoted. The earlier protected preview still represents the pre-fix `0aec124` snapshot and is not current fixer evidence.
- Final PX2 verifier evidence: `evidence/premium-critic/claude-px2-final-verifier-20260909.md`; it independently reran typecheck, lint, 283 tests, build, 52/52 Playwright, premium/root Graph validation, and a live DOM/CSS geometry probe on committed `f3bb865`.
- PX3 first producer: original 8s loop was technically compliant but the independent critic measured it as visually imperceptible and requested repair. The fixer regenerated flat perceptible motion (no glow), added a 44px Pause/Play control, pinned reviewed media bytes/hashes in CI tests, and added 320/360 dedicated evidence. Current repair verification is 286/286 Vitest + 56/56 Playwright PASS; see `evidence/premium-media/px3-repair-20260909.md`.
- Audited Git publication is restored and GitHub CI is active. Automated production delivery is protected by `npm run release:gate`, which remains BLOCKED until PX3–PX5 are DONE and all latest premium gates pass.


Next safe action: commit the second PX3 fixer snapshot, run a fresh independent critic focused on the mobile Pause layout + 320/360/760 evidence, then require a separate verifier before PX3 DONE.
