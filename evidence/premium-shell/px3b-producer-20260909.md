# PX3B producer evidence — Donna editorial product shell

Date: 2026-09-09 UTC.

## Why this increment exists

Owner visual review rejected the remaining synthetic AI-badge language and requested a forward-only presentation correction before contextual intelligence or final release. The change is intentionally narrower than a redesign of product behavior: Donna remains the same bounded persona, and knowledge/routing/provider/safety authority is unchanged.

## Producer changes

- Replaced the ring/notch SVG avatar contract with one `editorial-monogram` mark: flat cream surface, thin border, restrained side accent, italic `D`, no SVG rings, glow, gradients, or mascot imagery.
- Removed the duplicate welcome-state Donna mark so the header owns the single assistant identity moment.
- Reframed runtime status copy from implementation language (`Live model configured`, `Demo mode`, `Chat unavailable`) to user-facing `Available`, `Demo`, or `Unavailable` while keeping the internal mode contract unchanged.
- Refined the chat shell with a quieter solid surface, tighter border/radius system, layered low-contrast shadow, a small top accent rule, more deliberate composer material, and a rounded-square send control rather than another circular AI motif.
- Increased welcome hierarchy while keeping the composer the first actionable product object.
- Updated reusable avatar schema/profile fixtures and tests; no Cadre-only branching was introduced.

## Failures retained and repaired

The first browser pass after the source edit exposed two useful failures rather than being weakened to pass:

1. The new E2E assertion expected `Available`, but the local test runtime intentionally runs in demo mode. The assertion was corrected to accept only the three public labels (`Available|Demo|Unavailable`) while explicitly forbidding implementation words such as `configured` or `mode`.
2. The readability suite observed the old 11.5px mode label because the first Playwright run was served by a stale previous production build. The source had already moved to 12px. A fresh build was produced and the stale `/workspace` Next server was stopped only after confirming its working directory; no unrelated service was killed.

A subsequent E2E invocation also correctly failed closed when port 3100 was occupied by that stale `/workspace` server. After scoped cleanup and a fresh build, the full browser matrix passed.

## Verification on current source

- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `npm test` — 286/286 PASS across 16 files.
- `npm run build` — PASS on Next.js 16.3.4.
- `npm run test:e2e` — 58/58 PASS after fresh-build/stale-server recovery.
- Product profile contract still proves reuse through Cadre/Donna and Acme/Scout fixtures.

## Clean visual evidence

- `evidence/premium-shell/px3b-final-desktop-20260909.png`
- `evidence/premium-shell/px3b-final-mobile-20260909.png`
- `evidence/premium-shell/px3b-final-geometry-20260909.json`

Final geometry confirms one Donna mark, `editorial-monogram`, zero avatar SVGs, no horizontal overflow, and a 96px desktop / 86px mobile rest-state composer. Evidence captures contain only the rendered product surface; no external tool-call chrome is included.

## Authority boundary

PX3B changes presentation only. It does not add a model, database, retrieval system, routing branch, network action, knowledge source, autonomous tool, booking/portal integration, or new factual claim.
