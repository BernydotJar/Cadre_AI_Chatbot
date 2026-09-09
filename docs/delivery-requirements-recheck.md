# Delivery requirements recheck

Reconciled 2026-09-09 against the supplied delivery brief and the current repository/evidence. The private original is not copied into this repository. This is a delivery map, not an independent release approval.

## Requirement-to-evidence map

| Expectation | Current evidence | Remaining / claim boundary |
|---|---|---|
| Plan before implementation | Root `CLAUDE.md`, `plan.md`, approved specs, dated decisions and graph approval events | Keep projections current; do not rewrite historical approvals |
| Public working chatbot URL | Existing Vercel alias serves premium revision 3 while revision 4 is queued for repaired redeploy | **PARTIAL:** current revision-3 deployment smoke passes but retained full premium browser result is **57/58**; final PASS requires revision-4 deployment + anonymous **58/58** |
| Six supported scenario families | Typed `src/config/cadre.ts`, deterministic routing/policy, API/UI regressions | Maintain source freshness; do not claim unlimited semantic coverage |
| Deliberate architecture | Config/core/provider/server/UI separation plus `docs/architecture-overview.md` and component inventory | Keep optional extension/n8n outside core authority |
| Claude Code workflow/context management | Root `CLAUDE.md`, `.claude/agents/`, `.claude/commands/`, bounded role briefs and review protocol | Configuration is not proof of invocation. Claim actual Claude usage only from a genuine observed run |
| Independent critique/verification | Producer/critic/fixer/verifier artifacts, retained FAIL-to-fix evidence, Granite bounded reviews | A model review is one evidence class; it is not human approval or deployment proof |
| Small authentic commits | Incremental Git history across policy, UI, extension, CI/CD, n8n and docs | Preserve actual technical committer/provenance; no history rewrite |
| Test and inspect output | Current repaired premium source **288/288** Vitest + local **58/58** Playwright; extension **72/72**, repaired synthetic extension **24/24**, installed-site contextual proof **17 scoped checks**; current public revision 3 is retained at **57/58** | Local/adapter scopes PASS; public premium equivalence pending revision-4 redeploy |
| Explicit scope decisions | No auth/database/CRM/vector DB/real booking/account access; G9 and G11 isolated as optional workstreams | Do not add scope merely to work around release infrastructure |
| CI/CD maturity | Secret-free GitHub CI + gated exact-SHA Vercel production workflow; existing-project manual prebuild/deploy path proven | GitHub CI is active; automated production CD still stops at existing-project binding preflight because GitHub `production` lacks the Vercel binding |
| Lightweight complete source archive | Fresh pre-closure transport archive independently passes source/history audit and clean extraction verification | Rebuild once from the final closure commit; no additional product work required |
| Communication/reasoning | Decision register, architecture/handoff/runbook docs, cost/model plan, source audit, checkpoint and explicit blockers | Keep claims proportional to evidence; surface unknowns rather than smoothing them over |

## Evidence interpretation boundaries

Two distinctions matter when using this map:

1. **Tool configuration vs observed execution.** Project agents/commands describe the intended workflow; actual model/tool use is claimed only when an observed run and retained artifact support it.
2. **Local readiness vs public readiness.** Revision 4 is independently green locally, but the currently deployed revision 3 has a retained 57/58 public browser result. Public premium equivalence stays open until the repaired exact SHA is deployed and the full anonymous matrix passes.

## Current acceptance snapshot

- Core lint: PASS.
- Strict typecheck: PASS.
- Current premium Vitest: **16 files / 288 tests PASS**.
- Production Next.js build: PASS, including `/icon.svg`.
- Current repaired premium Playwright desktop/mobile: **58/58 PASS locally**; current revision-3 production retains **57/58** pending repaired redeploy.
- Chrome Integration Preview: G9/PX4 contextual scope DONE; 72 extension tests, latest repaired 24 synthetic browser checks, 17 scoped installed-site checks.
- n8n human-handoff contract: G11 DONE at contract/runtime-prototype scope; real email delivery intentionally not claimed.
- GitHub/Vercel CI/CD: GitHub CI is active; G10 deploy-check remains BLOCKED only because GitHub `production` lacks the existing Vercel binding for automated CD.
- Main N6 release: **DONE**; verification/code-review/release-check PASS with public production and package evidence.

## Documentation maturity

Use `docs/README.md` as the navigation map. `CLAUDE.md` is durable operating guidance, `plan.md` is the decision/milestone projection, `progress/checkpoint.md` is the resumable current-state projection, and the Graph Harness event logs are authoritative for execution status. `docs/architecture-overview.md`, `docs/developer-handoff.md`, and `docs/release-runbook.md` are intended to let another engineer operate the system without reconstructing the project from chat history.

## Final-delivery closure

The final source ZIP should be rebuilt from the final premium/release closure commit and independently verified after extraction. G10 remote CI/CD activation may remain separately BLOCKED because the delivery requirements are satisfied by the public app plus source package, but that blocker must remain explicit in the audit trail. Preparing the ZIP does not authorize external upload/submission.
