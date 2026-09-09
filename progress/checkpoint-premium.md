# Premium experience checkpoint — Donna

Updated: 2026-09-09 UTC. The premium Graph ledger is authoritative for this increment.

- Graph: `progress/premium-graph.project.json` + `progress/premium-graph.events.jsonl`.
- Current node: `PX2-donna-premium-identity` — **RUNNING (FIXER)** after a real independent Claude Code visual critic returned `CHANGES_REQUESTED`; the prior `design-review=BLOCKED` gate remains uncleared until a fresh review passes.
- PX3 ambient media, PX4 contextual Donna, and PX5 premium release are APPROVED but dependency-locked.
- Independent critic: authenticated Claude Code 2.1.266, project `critic` agent, high-effort read-only review. Evidence: `evidence/premium-critic/claude-uiux-critique-20260909.md`. It rejected the glowing hex/circuit avatar, duplicate hero hierarchy, demoted composer, repeated mark/kicker treatment, and tiny starter typography.
- Fixer source: removed glow/hex/animated traces and the hero-size Donna mark; the signal is now one static ring + accent notch + monogram. The composer precedes welcome content, starter topics are one-column 14–15px rows, and empty-state copy is an invitation rather than a pre-answer claim.
- Verification after the repair: 283/283 Vitest, typecheck PASS, lint PASS, build PASS, final 52/52 Playwright PASS. The first browser rerun exposed reset-focus and sub-pixel 360x640 readability defects; both are retained in `evidence/premium-identity/px2-fixer-20260909.md` and repaired before the final PASS.
- Deterministic screenshot/geometry evidence: `donna-premium-fixer-{desktop,mobile}-20260909.png` and `px2-fixer-geometry-20260909.json`; both viewports have no horizontal overflow, two visible Donna marks, zero animated signal descendants, and the composer precedes welcome guidance.
- Earlier Granite design-critic attempts remain historical blocked evidence; they are not used now that a real Claude Code critic produced a usable verdict.
- Public production alias remains on the previously verified productized release; premium WIP has **not** been promoted. The earlier protected preview still represents the pre-fix `0aec124` snapshot and is not current fixer evidence.
- Audited Git publication is restored and GitHub CI is active. Automated production delivery is now protected by `npm run release:gate`, which must remain BLOCKED until PX2–PX5 are DONE and all latest premium gates pass.


Next safe action: commit the fixer snapshot, run a fresh independent Claude Code UI/UX critic against the repaired source/screenshots, and either repair its concrete findings or record a real PASS. PX2 cannot close and PX3/PX4 cannot unlock until `design-review` is PASS.
