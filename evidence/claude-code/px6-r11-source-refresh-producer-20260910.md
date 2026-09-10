This all looks correct and self-consistent. Everything is complete. Let me give the final report.

## Summary

**Files changed (all within the allowed list):**
- `src/config/types.ts`
- `src/config/cadre.ts`
- `tests/config/config.test.ts`
- `tests/config/knowledge-refresh.test.ts`
- `tests/core/policy.test.ts`
- `tests/api/chat-route.test.ts`
- `docs/knowledge-source-audit.md`
- `docs/component-inventory.md`
- `docs/cinematic-proactive-experience.md`
- `docs/release-runbook.md`
- `plan.md`

(`CLAUDE.md` was left untouched — nothing in it is made false by this repair.)

**Exact behavioral/contract changes:**
1. `ClientConfig` gains an optional, generic `additionalOfficialDomains: string[]` field. `validateClientConfig` now accepts an approved link whose host matches `officialDomain`, **or** any explicitly declared `additionalOfficialDomains` entry, or a subdomain of either — still rejecting any undeclared/look-alike domain (verified by a new regression using `notgocadre.ai`). No Cadre-specific logic was hardcoded into the validator.
2. Cadre's config now delegates `https://gocadre.ai` explicitly.
3. `publicHighlights` "Track your AI results" now links to the real published CTA destination `https://portal.gocadre.ai/ai-maturity-index` with the honest label "Get Your AI Results" (was a placeholder pointing at `/contact`).
4. `maturity-index` knowledge entry: approved link now points at the real page; facts now state the page is free/~10 minutes/for you and your team, asks for company name, company website, name, work email, and emails a 6-digit code — while still asserting the chatbot cannot run/produce a score. "Scoring weights ... not verified" is now scoped to "beyond the eight-pillar framework" since duration is now a verified fact.
5. `portal` (`client-portal`) knowledge entry: facts now explicitly distinguish the public AI Maturity Index entry point (verified, not a login) from private client-login/account access (still unverified, still handed off via the contact link). The old, now-inaccurate claim "no public portal address is verified" was replaced with "no private client-login address is verified" everywhere it was asserted in tests.
6. `retrievedAt` set to `2026-09-10` on the changed facts/links only; unrelated entries keep `2026-09-09`.
7. Regression tests updated to match the new wording/links, plus a new test asserting delegated-domain approval and look-alike rejection.
8. Docs (`knowledge-source-audit.md`, `component-inventory.md`, `cinematic-proactive-experience.md`, `release-runbook.md`) and `plan.md` updated only where they stated the now-stale "no public portal URL verified" claim or the pre-repair PX6 status; `plan.md` now frames this as revision 11 (bounded source-refresh repair), keeps revision 10 local/CI evidence as historical, and states public equivalence is pending.

**Ambiguity preserved rather than guessed:** I did not claim `portal.gocadre.ai/ai-maturity-index` is a private client-login/account portal — per the coordinator's observation #4, I kept that boundary strictly as "public entry point, not a private client login," and account-specific access still routes to the human contact page with no invented address.

**No tests, lint, typecheck, build, Playwright, release gate, dev server, browser checks, git commands, or deployment were run.** I only read/edited the allowed files.
