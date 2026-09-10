# PX6 revision 11 — source-freshness repair handoff

Date: 2026-09-10 UTC

## Why revision 10 was reopened

PX6 revision 10 had already earned local `design-review=PASS`, `verification=PASS`, and `integration-proof=PASS`. Its detached verifier passed Git integrity, locked install, typecheck, lint, 301/301 Vitest, production build, and 68/68 Playwright. Closure source `69c590b` was published through the audited path and GitHub CI run `34442075458` passed. The automatically triggered production workflow run `34442247941` then failed closed at the existing-project binding preflight because the GitHub `production` environment did not provide `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, or `VERCEL_TOKEN`; no PX6 production deploy/public equivalence was claimed.

Before manual public release, a fresh source audit observed that Cadre's public `Track your AI results` section now links `Get Your AI Results` to `https://portal.gocadre.ai/ai-maturity-index`. The destination presents a public Cadre AI Maturity Index entry flow and states that it is free, takes about 10 minutes, is for the user and their team, requests company name/company website/name/work email, and emails a six-digit code. This evidence does **not** establish a private client-login/account-portal URL.

The premium Graph therefore retained revision-10 PASS evidence as history and appended a new failure/invalidation/repair plan, reopening PX6 as revision 11.

## Bounded repair

Revision 11 changes only source freshness, link authority, regression source, and documentation consistency:

- `ClientConfig` gains a generic optional `additionalOfficialDomains` allowlist, capped at eight entries. Approved links still require HTTPS and must resolve to the primary official host, an explicitly delegated host, or a subdomain of one of those hosts.
- Cadre delegates only the exact observed `https://portal.gocadre.ai` host. This is narrower than trusting all of `gocadre.ai`.
- `Track your AI results` uses the published `Get Your AI Results` destination.
- The `portal` answer distinguishes the public results/Maturity entry point from private client account access. Donna still cannot access accounts, and no private client-login address is asserted.
- The `maturity-index` answer may describe the observed public entry flow, but Donna still cannot run the assessment or produce a score.
- Changed facts/links carry a 2026-09-10 retrieval date.
- Regression source preserves foreign/sibling-host rejection and the account-access boundary.
- `plan.md`, architecture docs, release runbook, `CLAUDE.md`, and checkpoints are reconciled to revision 11 and the exact `69c590b` remote/CI/deploy observations.

No UI layout, signal-orb, animation, persona tone, provider/model, rate-limit behavior, API semantics, dependency, RAG, auth, CRM, analytics, or autonomous-action scope is changed.

## Claude Code provenance and coordinator acceptance

Claude Code 2.1.266 was invoked as a bounded Producer with Read/Edit/Grep/Glob only. Its brief explicitly prohibited tests, lint, typecheck, build, Playwright, release-gate execution, Git/ledger writes, deployment, browser checks, and secret access. Its report is retained at `evidence/claude-code/px6-r11-source-refresh-producer-20260910.md`.

The coordinator did not accept that output blindly. Static diff review found and corrected two material issues before handoff:

1. Claude's first documentation draft incorrectly associated the older PX5 source/CI (`8ae8a3a` / `34405396973`) with the PX6 closure narrative. The correct pre-r11 PX6 remote source and CI are `69c590b` / `34442075458`, with deploy run `34442247941`.
2. Claude initially delegated the broader `gocadre.ai` domain and described it as Cadre-operated. The accepted repair delegates only the exact observed `portal.gocadre.ai` host and uses the evidence-bounded phrase "Cadre-linked public destination" rather than asserting ownership.

A first CLI invocation attempt failed before Claude execution because the variadic `--allowedTools` argument consumed the prompt; it made no source changes and is not presented as an agent result. The successful Producer invocation used stdin and is the only r11 Producer output claimed here.

## Verification boundary

Per the owner-requested lifecycle, no revision-11 product tests have been run during Producer assembly. No r11 runtime/build/browser/deployment PASS is claimed. The next step is an independent read-only Claude Code critic against the committed repair. Only after that critic passes (and any required fixer loop closes) may the complete detached verification matrix run once at the end.