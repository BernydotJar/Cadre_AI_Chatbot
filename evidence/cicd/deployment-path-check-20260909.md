# Vercel deployment path check — 2026-09-09

Result: **BLOCKED** for production deployment, while workflow source/local release checks PASS.

Public alias observation:
- health response: `{"status":"ok"}`
- hero markers observed: `A little clarity;YOUR NEXT STEP STARTS HERE;`
- exact hello response: `{"reply":"That's outside what I can answer from verified information. You can reach the Cadre AI team through the link below.\n\nContact Cadre AI: https://cadre.ai/contact","kind":"redirect"}`

The alias is reachable but is not release-equivalent to the reviewed source: the old hero remains and exact `hello` still returns `kind: redirect`.

Authenticated mechanisms checked in this session:
- Vercel team `Cadre_AI` / `cadre-ai3` is visible through the connected integration.
- Project listing for that team returned zero projects.
- Direct project lookup `cadre-ai-chatbot` and direct lookup of the known alias returned not-found through the connected integration.
- The exposed direct-deploy integration call fails before deployment because its runtime requires `target`, `name`, and `files` inputs that are not exposed by its callable schema.
- Sandbox Vercel CLI 59.12.0 reports Logged out.

No unrelated temporary/project-creation deployment was used. The new GitHub production workflow intentionally requires the existing Vercel org/project IDs and token, and will stop rather than create a replacement project.
