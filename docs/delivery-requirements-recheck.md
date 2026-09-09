# Delivery requirements recheck

Reconciled 2026-09-09 against the supplied v1.1 take-home brief and the current repository/evidence. The private original is not copied into this repository. This is a review map, not an independent release approval.

## Requirement-to-evidence map

| Expectation | Current evidence | Remaining / claim boundary |
|---|---|---|
| Plan before implementation | Root `CLAUDE.md`, `plan.md`, approved specs, dated decisions and graph approval events | Keep projections current; do not rewrite historical approvals |
| Public working chatbot URL | Existing Vercel alias is reachable, current, and publicly reverified | **PASS:** health/hero/favicon/greeting markers pass; public Playwright 50/50; bounded grounded live smoke PASS |
| Six supported scenario families | Typed `src/config/cadre.ts`, deterministic routing/policy, API/UI regressions | Maintain source freshness; do not claim unlimited semantic coverage |
| Deliberate architecture | Config/core/provider/server/UI separation plus `docs/architecture-overview.md` and component inventory | Keep optional extension/n8n outside core authority |
| Claude Code workflow/context management | Root `CLAUDE.md`, `.claude/agents/`, `.claude/commands/`, bounded role briefs and review protocol | Configuration is not proof of invocation. Claim actual Claude usage only from a genuine observed run |
| Independent critique/verification | Producer/critic/fixer/verifier artifacts, retained FAIL-to-fix evidence, Granite bounded reviews | A model review is one evidence class; it is not human approval or deployment proof |
| Small authentic commits | Incremental Git history across policy, UI, extension, CI/CD, n8n and docs | Preserve actual technical committer/provenance; no history rewrite |
| Test and inspect output | Current core **256/256** tests, **50/50** Playwright, extension **72/72**, synthetic extension **23/23**, installed-site contextual proof **17/17** | Public release must be retested after current source is deployed |
| Explicit scope decisions | No auth/database/CRM/vector DB/real booking/account access; G9 and G11 isolated as optional workstreams | Do not add scope merely to work around release infrastructure |
| CI/CD maturity | Secret-free GitHub CI + gated exact-SHA Vercel production workflow; local YAML/marker verification + Granite review PASS | Workflows are not active remotely until audited Git publication succeeds; existing Vercel target is now proven through manual authorized recovery |
| Lightweight complete source archive | Fresh pre-closure transport archive independently passes source/history audit and clean extraction verification | Rebuild once from the final closure commit; no additional product work required |
| Communication/reasoning | Decision register, architecture/handoff/runbook docs, cost/model plan, source audit, checkpoint and explicit blockers | Keep claims proportional to evidence; surface unknowns rather than smoothing them over |

## Current review dimensions

The brief weights workflow/context management 30%, architecture 25%, development speed/scope 20%, verification 15%, and communication/reasoning 10%. The repository now has direct proof surfaces for each dimension, but two distinctions matter during review:

1. **Claude configuration vs Claude execution.** Project agents/commands show deliberate context design. They do not prove Claude actually ran them. If a genuine Claude Code review is performed later, record that separately rather than retroactively attributing prior work.
2. **Local readiness vs public readiness.** Both are now evidenced for the core chatbot: local verification is green and the existing production alias is release-equivalent. The runbook still keeps remote CI/CD activation as a separate claim.

## Current acceptance snapshot

- Core lint: PASS.
- Strict typecheck: PASS.
- Core Vitest: **11 files / 256 tests PASS**.
- Production Next.js build: PASS, including `/icon.svg`.
- Playwright desktop/mobile: **50/50 PASS**.
- Chrome Integration Preview: G9 DONE, all three gates PASS; 72 extension tests, 23 synthetic browser checks, 17 installed-site contextual checks.
- n8n human-handoff contract: G11 DONE at contract/runtime-prototype scope; real email delivery intentionally not claimed.
- GitHub/Vercel CI/CD: G10 verification/code-review PASS, deploy-check BLOCKED only because remote workflow activation/source publication is still unavailable.
- Main N6 release: **DONE**; verification/code-review/release-check PASS with public production and package evidence.

## Documentation maturity

Use `docs/README.md` as the navigation map. `CLAUDE.md` is durable operating guidance, `plan.md` is the decision/milestone projection, `progress/checkpoint.md` is the resumable current-state projection, and the Graph Harness event logs are authoritative for execution status. `docs/architecture-overview.md`, `docs/developer-handoff.md`, and `docs/release-runbook.md` are intended to let another engineer operate the system without reconstructing the project from chat history.

## Final-delivery closure

The final source ZIP should now be rebuilt from the N6 closure commit and independently verified after extraction. G10 remote CI/CD activation may remain separately BLOCKED because the candidate requirements are satisfied by the public app plus source package, but that blocker must remain explicit in the audit trail. Preparing the ZIP does not authorize recruiting upload/email.
