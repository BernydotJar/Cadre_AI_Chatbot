# Public production release equivalence — 2026-09-09

## Scope

This record covers the owner-authorized recovery deployment of the reviewed Cadre AI chatbot to the existing Vercel production project. It does not claim GitHub workflow activation, source publication, recruiting submission, Chrome Web Store publication, or real n8n email delivery.

## Reviewed application source

- Application release commit: `f36d2c77500c0db362e702e031ea46a7f257cdf6`
- Commit subject: `fix: allow tracked env template in Vercel bundle`
- Existing Vercel team: `Cadre_AI` / `cadre-ai3`
- Existing Vercel project: `cadre-ai-chatbot`
- Vercel project ID: `prj_n1nwQI54mbIplgaExeVkeNC8hrv2`
- Vercel team ID: `team_rCzpjeIJ3vppzDxebfU2WJoK`
- Public production alias: `https://cadre-ai-chatbot-tawny.vercel.app`

The owner authenticated the Vercel CLI interactively inside the persistent workstation. The local workspace was then linked only to the already-existing `cadre-ai-chatbot` project; no replacement project was created.

## Prebuilt transport repair

The first prebuilt production attempt created deployment `dpl_4Z6PkKibrQkEmQLZzoZR7kq5B7E2` but failed with:

`ENOENT: no such file or directory, lstat '/vercel/path0/.env.example'`

Root cause: Next/Vercel file tracing included the tracked placeholder `.env.example`, while `.vercelignore` denied every `.env*` path. The repair preserved the secret boundary and allowed only the tracked root placeholder:

`!/.env.example`

Real `.env*` files remain excluded. The root `.env.local` created during CLI linking was removed before the successful rebuild; the rebuilt function configs traced `.env.example` and did not trace `.env.local`.

`vercel build --prod` then passed with Next.js 16.3.4, TypeScript, static generation, and serverless output creation.

## Successful production deployment

- Deployment ID: `dpl_ExDWE91vPxtEmLaDG6UBCCTamGLM`
- Immutable deployment URL: `https://cadre-ai-chatbot-3vzgn2fk8-cadre-ai3.vercel.app`
- Target: production
- Status: Ready
- Production alias moved to this deployment: `https://cadre-ai-chatbot-tawny.vercel.app`
- Delivery method: `vercel deploy --prebuilt --prod --scope cadre-ai3 --yes`

The deployment reported `Using prebuilt build artifacts from .vercel/output` and completed successfully.

## Anonymous release-marker verification

Against the public production alias after the deployment:

- `GET /api/health`: PASS — `status=ok`
- `GET /`: PASS — current `Turn AI curiosity` hero present
- stale `YOUR NEXT STEP STARTS HERE` marker: PASS — absent
- `GET /icon.svg`: PASS — SVG emitted
- exact `hello` POST: PASS — `kind=greeting` with the current deterministic first-turn guidance

## Public browser verification

Command:

`E2E_BASE_URL=https://cadre-ai-chatbot-tawny.vercel.app npm run test:e2e`

Result: **50/50 Playwright cases PASS** using one worker across the configured desktop and mobile projects. This includes first impression, real-server routing, loading/duplicate-request protection, retry/cancel/error states, safe link rendering, reset behavior, viewport/readability checks, hydration behavior, keyboard behavior, deadline handling, and mobile coverage.

## Bounded live inference smoke

A single production request for `What does Cadre AI do?` returned `kind=grounded`, a substantive Cadre summary, the AI Strategy capability, and official `https://cadre.ai/` links. The corrected verifier asserted all four properties and passed.

This is bounded release evidence only; it is not a bulk model evaluation and does not change the separately documented optional model-comparison status.

## Remaining external blocker

Production equivalence is now demonstrated for the core chatbot, so the prior stale-alias reason for N6 is cleared. The separate G10 CI/CD graph remains blocked because the dedicated audited Git publication mechanism still reports `GITHUB_TOKEN is required for git_push`; therefore the locally versioned GitHub Actions workflows are not yet active on `origin/main`.
