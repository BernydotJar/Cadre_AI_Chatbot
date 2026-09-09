# Documentation map

Use this page to avoid reading the repository chronologically.

## Start here

| Need | Read |
|---|---|
| Current truth / blocker | `progress/checkpoint.md` |
| Durable agent/developer rules | `CLAUDE.md` |
| Architecture and diagrams | `docs/architecture-overview.md` |
| Mid-developer takeover | `docs/developer-handoff.md` |
| Production closure | `docs/release-runbook.md` |
| Approved product scope | `specs/001-support-chatbot/requirements.md` |
| Detailed module contracts | `docs/component-inventory.md` |
| Deployment specifics | `docs/deploy.md` |
| Source/knowledge provenance | `docs/knowledge-source-audit.md`, `docs/research/` |
| Packaging | `docs/delivery.md` |
| Graph methodology | `docs/engineering-workflow.md` |

## Audit reading order

1. `plan.md` for scope, decisions, milestones and explicit remaining blockers.
2. `CLAUDE.md` for operating rules, context discipline and verification expectations.
3. `specs/001-support-chatbot/requirements.md` for approved behavior.
4. `docs/architecture-overview.md` and `docs/component-inventory.md` for design.
5. `progress/checkpoint.md` plus Graph Harness replay for actual execution state.
6. `evidence/` only for the specific claim being audited; historical FAIL/BLOCKED evidence is intentionally retained.

## Claim discipline

The documentation distinguishes these evidence classes because they are not interchangeable:

- source/unit/integration verification;
- synthetic browser verification;
- live local provider verification;
- installed extension proof on the real public site;
- public deployed-app verification;
- source archive extraction/build verification.

A PASS in one category never silently establishes another.

- [`cinematic-proactive-experience.md`](cinematic-proactive-experience.md) — PX6 page/persona/motion/proactivity contract.
