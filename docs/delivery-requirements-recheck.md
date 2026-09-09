# Delivery requirements recheck

Reconciled 2026-09-09 against the supplied v1.1 take-home brief and the current repository/evidence. The private original is not copied into this repository. This is a review map, not an independent release approval.

## Requirement-to-evidence map

| Expectation | Current evidence | Remaining / claim boundary |
|---|---|---|
| Plan before implementation | Root `CLAUDE.md`, `plan.md`, approved specs, dated decisions and graph approval events | Keep projections current; do not rewrite historical approvals |
| Public working chatbot URL | Existing Vercel alias is reachable and health is OK | **BLOCKED for final demo:** alias still serves old hero and `hello -> redirect`; deploy reviewed source first |
| Six supported scenario families | Typed `src/config/cadre.ts`, deterministic routing/policy, API/UI regressions | Maintain source freshness; do not claim unlimited semantic coverage |
| Deliberate architecture | Config/core/provider/server/UI separation plus `docs/architecture-overview.md` and component inventory | Keep optional extension/n8n outside core authority |
| Claude Code workflow/context management | Root `CLAUDE.md`, `.claude/agents/`, `.claude/commands/`, bounded role briefs and review protocol | Configuration is not proof of invocation. Claim actual Claude usage only from a genuine observed run |
| Independent critique/verification | Producer/critic/fixer/verifier artifacts, retained FAIL-to-fix evidence, Granite bounded reviews | A model review is one evidence class; it is not human approval or deployment proof |
| Small authentic commits | Incremental Git history across policy, UI, extension, CI/CD, n8n and docs | Preserve actual technical committer/provenance; no history rewrite |
| Test and inspect output | Current core **256/256** tests, **50/50** Playwright, extension **72/72**, synthetic extension **23/23**, installed-site contextual proof **17/17** | Public release must be retested after current source is deployed |
| Explicit scope decisions | No auth/database/CRM/vector DB/real booking/account access; G9 and G11 isolated as optional workstreams | Do not add scope merely to work around release infrastructure |
| CI/CD maturity | Secret-free GitHub CI + gated exact-SHA Vercel production workflow; local YAML/marker verification + Granite review PASS | Workflows are not active remotely until audited Git publication succeeds; Vercel binding still blocked |
| Lightweight complete source archive | Earlier clean-transport archive was independently verified | It is now historical/intermediate; rebuild from exact closure commit after production equivalence |
| Communication/reasoning | Decision register, architecture/handoff/runbook docs, cost/model plan, source audit, checkpoint and explicit blockers | Keep claims proportional to evidence; surface unknowns rather than smoothing them over |

## Current review dimensions

The brief weights workflow/context management 30%, architecture 25%, development speed/scope 20%, verification 15%, and communication/reasoning 10%. The repository now has direct proof surfaces for each dimension, but two distinctions matter during review:

1. **Claude configuration vs Claude execution.** Project agents/commands show deliberate context design. They do not prove Claude actually ran them. If a genuine Claude Code review is performed later, record that separately rather than retroactively attributing prior work.
2. **Local readiness vs public readiness.** Current source is locally green, but the known public alias is stale. The release runbook intentionally refuses to collapse those into one claim.

## Current acceptance snapshot

- Core lint: PASS.
- Strict typecheck: PASS.
- Core Vitest: **11 files / 256 tests PASS**.
- Production Next.js build: PASS, including `/icon.svg`.
- Playwright desktop/mobile: **50/50 PASS**.
- Chrome Integration Preview: G9 DONE, all three gates PASS; 72 extension tests, 23 synthetic browser checks, 17 installed-site contextual checks.
- n8n human-handoff contract: G11 DONE at contract/runtime-prototype scope; real email delivery intentionally not claimed.
- GitHub/Vercel CI/CD: G10 verification/code-review PASS, deploy-check BLOCKED.
- Main N6 release: verification/code-review PASS, release-check BLOCKED because deployed source is stale.

## Documentation maturity

Use `docs/README.md` as the navigation map. `CLAUDE.md` is durable operating guidance, `plan.md` is the decision/milestone projection, `progress/checkpoint.md` is the resumable current-state projection, and the Graph Harness event logs are authoritative for execution status. `docs/architecture-overview.md`, `docs/developer-handoff.md`, and `docs/release-runbook.md` are intended to let another engineer operate the system without reconstructing the project from chat history.

## Final-delivery closure

The final source ZIP should be created only after the reviewed source is published/deployed to the existing authorized Vercel project, public markers/browser verification pass, and N6/G10 are closed from real evidence. The ZIP must then be rebuilt from that exact closure commit and independently verified after extraction. Preparing it does not authorize recruiting upload/email.
