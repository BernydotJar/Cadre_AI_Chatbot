# Delivery requirements recheck

Reconciled 2026-09-10 against the supplied delivery brief and the current repository/evidence. The private original is not copied into this repository. This is a delivery map, not an independent release approval.

## Requirement-to-evidence map

| Expectation | Current evidence | Remaining / claim boundary |
|---|---|---|
| Plan before implementation | Root `CLAUDE.md`, `plan.md`, approved specs, dated decisions and graph approval events | Keep projections current; do not rewrite historical approvals |
| Public working chatbot URL | Production alias serves PX6 revision 15 from published closure `f334616` (runtime repair `af7e3ff`) | Deployment `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr` READY; anonymous markers PASS; complete rate-aware public browser coverage **70/70 PASS** (35 desktop + fresh client window + 35 mobile) |
| Six supported scenario families | Typed `src/config/cadre.ts`, deterministic routing/policy, API/UI regressions | Maintain source freshness; do not claim unlimited semantic coverage |
| Deliberate architecture | Config/core/provider/server/UI separation plus `docs/architecture-overview.md` and component inventory | Keep optional extension/n8n outside core authority |
| Claude Code workflow/context management | Root `CLAUDE.md`, `.claude/agents/`, `.claude/commands/`, bounded role briefs and review protocol | Configuration is not proof of invocation. Claim actual Claude usage only from a genuine observed run |
| Independent critique/verification | Producer/critic/fixer/verifier artifacts, retained FAIL-to-fix evidence, Granite bounded reviews | A model review is one evidence class; it is not human approval or deployment proof |
| Small authentic commits | Incremental Git history across policy, UI, extension, CI/CD, n8n and docs | Preserve actual technical committer/provenance; no history rewrite |
| Test and inspect output | PX6 r15 detached source **302/302 Vitest**, local **70/70 Playwright**, extension **73/73**, synthetic extension **24/24**; public complete matrix **70/70** | Retain the r13 **68/70** mobile failure and r14 critic rejection as repair evidence; do not erase or relabel them |
| Explicit scope decisions | No auth/database/CRM/vector DB/real booking/account access; G9 and G11 isolated as optional workstreams | Do not add scope merely to work around release infrastructure |
| CI/CD maturity | Secret-free GitHub CI + gated exact-SHA Vercel production workflow; existing-project manual prebuild/deploy path proven | GitHub CI is active; automated production CD still stops at existing-project binding preflight because GitHub `production` lacks the Vercel binding |
| Lightweight complete source archive | Fresh pre-closure transport archive independently passes source/history audit and clean extraction verification | Rebuild once from the final closure commit; no additional product work required |
| Communication/reasoning | Decision register, architecture/handoff/runbook docs, cost/model plan, source audit, checkpoint and explicit blockers | Keep claims proportional to evidence; surface unknowns rather than smoothing them over |

## Evidence interpretation boundaries

Two distinctions matter when using this map:

1. **Tool configuration vs observed execution.** Project agents/commands describe the intended workflow; actual model/tool use is claimed only when an observed run and retained artifact support it.
2. **Historical baseline vs active release.** PX5 and PX6 revision 12 remain rollback/history lines. PX6 revision 15 is the active deployed release and relies on its own fresh critic, verifier, CI, deployment, and public evidence; no older PASS was reused as r15 proof.

## Current acceptance snapshot

- Core lint: PASS.
- Strict typecheck: PASS.
- PX6 revision-15 Vitest: **302/302 PASS** on the detached final verifier.
- Production Next.js build: PASS, including `/icon.svg`.
- PX6 Playwright: **70/70 local PASS** and complete **70/70 public PASS** (35 desktop + fresh rate window + 35 mobile). The r13 68/70 mobile failure is retained as the defect that triggered r14/r15 repair.
- Chrome Integration Preview: G9/PX4 contextual scope DONE; r15 detached verification passes **73/73 extension tests** and **24/24 synthetic browser** checks; historical installed-site checks remain separate.
- n8n human-handoff contract: G11 DONE at contract/runtime-prototype scope; real email delivery intentionally not claimed.
- GitHub/Vercel CI/CD: GitHub CI is active; G10 deploy-check remains BLOCKED only because GitHub `production` lacks the existing Vercel binding for automated CD.
- Main N6 release: **DONE**; verification/code-review/release-check PASS with public production and package evidence.

## Documentation maturity

Use `docs/README.md` as the navigation map. `CLAUDE.md` is durable operating guidance, `plan.md` is the decision/milestone projection, `progress/checkpoint.md` is the resumable current-state projection, and the Graph Harness event logs are authoritative for execution status. `docs/architecture-overview.md`, `docs/developer-handoff.md`, and `docs/release-runbook.md` are intended to let another engineer operate the system without reconstructing the project from chat history.

## Final-delivery closure

The final source ZIP should be rebuilt from the final premium/release closure commit and independently verified after extraction. G10 remote CI/CD activation may remain separately BLOCKED because the delivery requirements are satisfied by the public app plus source package, but that blocker must remain explicit in the audit trail. Preparing the ZIP does not authorize external upload/submission.
