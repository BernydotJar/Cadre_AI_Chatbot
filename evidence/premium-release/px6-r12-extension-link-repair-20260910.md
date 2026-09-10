# PX6 revision 12 — extension approved-link integration repair

Date: 2026-09-10 UTC

## Failure retained from revision 11

The revision-11 detached verifier on snapshot `8206cd9` passed Git integrity, locked install, typecheck, lint, **302/302 Vitest**, production build, and **68/68 Playwright**. It then failed at `node extension/build.mjs` with `Error: Unexpected approved link` because that build script still required every canonical presentation link to have origin `https://cadre.ai`.

That assumption became stale when revision 11 legitimately added `https://portal.gocadre.ai/ai-maturity-index` as an explicitly delegated approved public destination. The failure is retained in `evidence/premium-verification/px6-r11-clean-verifier-20260910.txt`; it is not relabeled as PASS.

## Repair boundary

The Chrome preview remains an optional local presentation adapter. Revision 12 does **not** add `portal.gocadre.ai` to content-script matches, web-accessible-resource matches, frame ancestors, host permissions, API destinations, or page-context authority. Activation stays exactly on `https://cadre.ai/*` and `https://www.cadre.ai/*`.

Only the build-time validation of links rendered inside the extension panel changes:

- the literal `officialDomain` and optional literal `additionalOfficialDomains` values are parsed to hostnames;
- presentation links must have a non-empty string label;
- links must be valid HTTPS URLs with no username, password, or custom port;
- link hostnames must equal a configured approved hostname or be a subdomain of one;
- the generic validation logic contains no hardcoded `portal.gocadre.ai` or `gocadre.ai` exception;
- the existing exact API endpoint and six-topic checks remain unchanged.

`extension/tests/build.test.ts` adds a regression source assertion that generated `PRESENTATION.links` contains the canonical `Get Your AI Results` link while the generated manifest content-script matches remain exactly the two Cadre site origins.

## Claude Fixer provenance and coordinator correction

Claude Code 2.1.266 was invoked as a bounded Fixer with Read/Edit/Grep/Glob only and no tests, build, Bash, Git, ledger, network, deployment, browser, or secret access. Its output is retained at `evidence/claude-code/px6-r12-extension-link-fixer-20260910.md`.

The coordinator did not accept that first draft unchanged. Static review found that Claude built `approvedHosts` from full strings such as `https://cadre.ai` but compared them directly to `url.hostname` values such as `cadre.ai`; the proposed fix would therefore still have failed. The accepted repair normalizes every configured domain URL with `new URL(domain).hostname` before exact/subdomain matching. This correction was made before any revision-12 test execution.

## Verification boundary

No revision-12 tests, build, extension build, browser check, deployment, or Graph PASS gate is claimed in this handoff. The next step is an independent constrained source critic; only after source review passes will the final detached verifier rerun.
