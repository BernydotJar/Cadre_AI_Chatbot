# Resumable checkpoint — Cadre AI Chatbot

_Last updated: 2026-09-08 local time / 2026-09-09 UTC. This is a projection; the append-only graph ledger owns execution status._

## Current outcome

Implementation resumed after the owner's explicit confirmation of Vercel team `Cadre_AI` / `cadre-ai3`. The previous PARTIAL_WITH_DOCUMENTED_BLOCKERS checkpoint remains historical; its two blockers have been resolved. The product is not yet released.

- N1-foundation: done, original evidence and gates retained.
- N2-knowledge-routing: done, real critic/fixer/verifier, including the later singular-access fix.
- N3-chat-api-adapter: done. Separate agents run again: critic reproduced a valid-history UTF-8/JSON serialization P2; fixer commit `8532aee` trims oldest history by actual serialized bytes; independent critic and verifier passed. 203 tests, typecheck, lint and production build passed, plus independent boundary/concurrency probes. Reports in `evidence/N3-chat-api-adapter/`.
- N4-ui: running. Dedicated UI producer owns app/page/layout/styles and src/ui; coordinator owns the Playwright suite. Browser/visual checks and independent UI review remain required.
- N5-deploy: done for the early mock walking skeleton. Approved project `cadre-ai-chatbot`, Vercel Node 24.x / Next.js / Pro metadata. Anonymous page, health, mock API, safe errors, private paths and delivered scripts verified; separate review passed. See `docs/deploy.md` and `evidence/N5-deploy/`.
- N6-verify-release: approved, waits on N4. Finished-UI deployment, live public matrix, archive verification and human release closure remain pending.

Graph validation: 69 events valid, all 20 retained evidence artifacts match their recorded SHA-256 values. Runtime pin: Graph-harness-sdlc `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`, external checkout; never regenerate the baseline or hand-edit events. The installed Graph Engineer skill is not available in this session; the existing pinned project runtime is the actual mechanism used.

## Deployment and credentials

Public production alias: https://cadre-ai-chatbot-tawny.vercel.app. The first deployment is source `7ac6086`, explicit mock mode and scaffold UI. Later local code is not yet represented there. Immutable deployment/team URLs are SSO-protected; anonymous checks used the public alias, never a bypass.

All five production runtime variable names are now provisioned via CLI stdin: `OPENROUTER_API_KEY` (Secret), `OPENROUTER_MODEL`, `OPENROUTER_KEY_EXPIRES_AT`, `CHAT_PROVIDER`, `CHAT_TRUSTED_PROXY_IP_HEADER`. No value was put in arguments or evidence. These settings apply to a future deployment and do not establish live behavior. Local `.env.local` remains mock, mode 0600; Vercel link added a local OIDC token, existing chatbot variables remained present. Never print any credential or include environment files in uploads.

U1/U2: OpenRouter only for chatbot responses, $5 total, keep $0.50 reserve. Last live-local metadata observed usage $0.0006324 / remaining $4.9993676; accounting can lag and must be refreshed for the next live run. Conservative authorization expires 2026-09-15T00:00:00Z despite later provider metadata. No provider key use for coding assistance.

## Git and authority

`main` tracks `origin/main`; focused local commits are authorized and retain actual failure/fix/review chronology. No push, source publication, submission, paid add-on/domain purchase or final release approval is inferred. Existing user-owned `test.md` was present at recovery but absent on a later read-only check; this continuation did not edit, stage or delete it. Do not recreate or infer its contents.

`.codex`, secrets, private inputs, dependencies and outputs are excluded from Git/delivery. The Vercel upload allowlist excludes Git itself and process evidence. The final delivery ZIP is separate and must include usable clean `.git` history. No final ZIP exists yet.

## Current work and next actions

1. Wait for UI producer stable source; run the real browser suite against a production mock build on localhost:3100. Coordinate only one local build/server at a time and preserve unrelated services.
2. Obtain separate UI critic review, fix findings, rerun independent browser/visual checks; then close N4 through the CLI only.
3. Deploy the verified interface; run the frozen live/public matrix within the existing budget, inspect anonymous response/credential boundaries and record evidence separately from mocks.
4. Complete component inventory, README and reproducible ZIP; extract cleanly, verify history/install/build/smoke and record size/SHA-256 before asking for human closure.
5. Keep Git and ledger single-writer. `npm run graph -- ...` validates the external pin, adds the optimistic event guard and hashes existing artifacts. `npm run verify -- unique-label` retains new mock test/typecheck/lint/build output without overwriting historical runs.

Use `CLAUDE.md`, `plan.md`, `specs/001-support-chatbot/README.md` and the authorization amendment together; original three spec headers are historical approved content. Context7 was unavailable, autoskills was inspected but not installed, and `docs/chatbot-ux-assessment.md` contains coordinator research from the inspected Laws of UX reference and primary sources. No fabricated tool/subagent provenance.
