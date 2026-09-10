## Summary of edits

**`extension/build.mjs`** (lines 36–38, now 36–46): replaced the hardcoded `origin !== "https://cadre.ai"` link check with generic validation derived from the literal AST:
- Requires `client.officialDomain` to be a non-empty literal string.
- Reads optional literal `client.additionalOfficialDomains` (defaults to `[]`), validating each entry is a non-empty string.
- Builds `approvedHosts = [officialDomain, ...additionalOfficialDomains]` and an `isApprovedHost(hostname)` check that accepts an exact host match or a subdomain (`hostname.endsWith(".host")`).
- Per-link validation now fails closed on: missing/empty `label`, non-`https:` protocol, embedded username/password, non-default port, or a hostname that isn't one of the approved hosts or their subdomains — with no hardcoded reference to `cadre.ai`, `gocadre.ai`, or `portal.gocadre.ai` anywhere in the generic logic.
- Manifest generation, activation origins (`config.siteOrigins`), API endpoint restriction, and the six-topic check are unchanged.

**`extension/tests/build.test.ts`**: added one new regression test (`"includes the delegated AI Maturity Index portal link while restricting activation to exact Cadre sites"`) that:
- Locates the real `https://portal.gocadre.ai/ai-maturity-index` link object from the imported canonical `cadre` config (no hardcoded label — pulled from source of truth) and asserts it's defined.
- Asserts the generated `PRESENTATION.links` contains that exact link object.
- Re-asserts `manifest.content_scripts` matches are still exactly `["https://cadre.ai/*", "https://www.cadre.ai/*"]`, guarding against activation-origin widening.
- Existing equality-to-canonical-config assertion (`presentation.links` vs. recomputed `cadre` links) was left untouched.

No other files were changed. As instructed, **I did not run any tests, build, lint, typecheck, Playwright, extension build, Bash, or git commands** — this is unverified pending the independent critic/verifier pass.
