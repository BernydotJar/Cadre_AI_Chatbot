# Vercel deployment

Owner-approved target: `Cadre_AI` / `cadre-ai3`. Project: `cadre-ai-chatbot`. Public production alias: https://cadre-ai-chatbot-tawny.vercel.app.

## Current delivery status — 2026-09-09

Repaired premium revision-4 source `8ae8a3a1b0e53100218930aa893eed90a8592562` is deployed on the **existing** `Cadre_AI / cadre-ai3 / cadre-ai-chatbot` project as `dpl_EECF4m6NbwdN73j6Z2JxSfVpWbP7`. Anonymous health/page/icon + Donna behavior smoke passes, and the full public Playwright matrix is **58/58 PASS** on `https://cadre-ai-chatbot-tawny.vercel.app`. Clean desktop/mobile captures show the `cadre-donna` product marker, one editorial Donna monogram, the expected composer, poster-only reduced-motion state, and no horizontal overflow.

The earlier revision-3 deployment `dpl_A6CvaDHT34auCMFFoNxnmDvCXCBY` is retained in evidence because its first full public run was **57/58** and exposed the ambient Pause/autoplay cold-load race. Revision 4 repairs that product defect and the release-gate invalidation projection discovered during the same loop. No replacement Vercel project was created.

## GitHub CI/CD

`.github/workflows/ci.yml` is the secret-free verification path for pull requests and `main`: locked install, lint, strict typecheck, unit/integration tests, production build, extension build/tests, Playwright, and a fully synthetic extension browser check. The owner-gated real-site extension test is intentionally excluded from routine CI.

`.github/workflows/deploy-production.yml` is the gated production path. It runs only after successful CI on `main` or manual dispatch, binds the GitHub `production` environment, checks out the exact triggering SHA, and requires repository/environment secrets `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`. It writes only an ephemeral `.vercel/project.json`, then runs `vercel pull --environment=production`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`. It never calls `vercel link` or creates a project. Post-deploy checks require health, the new hero, `/icon.svg`, and deterministic greeting behavior before the workflow reports success.

The workflow source is locally validated and its release-marker contract matches the successfully deployed production build. Manual owner-authorized recovery proved the existing Vercel project binding and prebuilt delivery path. **Automated CD remains blocked at the existing-project binding preflight**: audited publication and GitHub CI are active, but the GitHub `production` environment must hold the existing Vercel org/project/token binding before the production workflow can reach Vercel. Manual existing-project delivery remains independently proven. Use `docs/release-runbook.md` for that automation-only closure path and `progress/checkpoint.md` for current state.

## Earlier core deployment evidence

Deployment `dpl_B1pG38nm6xVYSbg1cjSTasgLyxfj` contains cold-first-message repair `c6f781c`, invoked from CLI snapshot `384f76b`. Node 24.x configuration retained. The reviewed upload contained 26 files / 342,708 bytes and excluded extension, environment, Git, evidence and private inputs. Build and promotion passed without changing environment, dependencies or purchasing resources. Independent verification of this repaired alias passed 38 intercepted browser cases and exactly one real cold-load question, returning HTTP 200/grounded in 1,257 ms from submission. These checks are separate from CLI READY.

Previous deployment `dpl_HJ3h2BuS6BAVpyHsdTZKtZHcjADu` (CLI `a5693d8`, runtime `9b5749c`) introduced the reviewed UI and refreshed knowledge. Its 26-file upload was 342,161 bytes. A later independent browser attempt exposed the initialization gap; its inconclusive/FAIL evidence is retained rather than rewritten as success.

Anonymous verification on 2026-09-09 UTC passed 30 checks: page, health, seven delivered scripts, five private paths, and 16 chat requests. Nine grounded paths used the configured OpenRouter model; the other outcomes were deterministic boundaries, clarification and validation. Every grounded reply exactly matched an ordering of its full approved facts and exact links. Separate public-browser verification passed 34 cases with synthetic responses, not 34 live inferences. See `evidence/N6-release/` for checks, hashes, configuration and independent reports.

After the repaired one-shot conversation, metadata at 2026-09-09T04:39:44.260Z observed cumulative usage $0.001842 and remaining $4.998158; provider accounting can lag. These are dated observations, not a perpetual balance. Operational expiry remains 2026-09-15T00:00:00Z. Do not upload or expose the key to keep the app running afterward.

## First infrastructure check (2026-09-08 local time)

The CLI deployed source commit `7ac6086edc2a54f5d60452b5bd4db46868c6f8af` in explicit mock mode. Vercel reported READY and promoted deployment `dpl_AYJ4NjLYYJxmbWHFBQ65K8GxsJZn`. Its Node setting is `24.x`; Next 16.3.4 compiled, typechecked and generated the scaffold successfully. This establishes the early N5 walking skeleton, not a finished UI or a live-model release.

Anonymous checks of the production alias passed: page and health 200, grounded mock API response 200, empty input 400, non-JSON media 415, no-store API responses; private paths 404; six delivered script files had no credential-shaped content or provider-secret identifiers. Exact results are retained in `evidence/N5-deploy/anonymous-mock.json`.

The immutable deployment URL and automatic team alias redirect anonymous visitors to Vercel SSO. The production alias above is publicly accessible. Protection was not disabled or bypassed; authenticated CLI requests were not counted as anonymous evidence.

## Reproduce

Use official Vercel CLI 59.12.0 outside application dependencies. Authenticate interactively if needed; never pass bearer tokens in commands or commit authentication files. From the app directory:

```sh
rtk proxy env VERCEL_TELEMETRY_DISABLED=1 npm exec --yes --package=vercel@59.12.0 -- vercel whoami
rtk proxy env VERCEL_TELEMETRY_DISABLED=1 npm exec --yes --package=vercel@59.12.0 -- vercel project inspect cadre-ai-chatbot --scope cadre-ai3
rtk proxy env VERCEL_TELEMETRY_DISABLED=1 npm exec --yes --package=vercel@59.12.0 -- vercel deploy --dry --json --scope cadre-ai3
```

Review every file in the dry-run manifest before deploying. `.vercelignore` denies root content by default and includes only app/source/build inputs. No `.env`, `.codex`, `.git`, private inputs, test fixtures or process evidence is uploaded. The first upload contained 24 files, 307,044 bytes. The delivery ZIP is a separate artifact that must include clean Git history; it is never the deployment upload.

`vercel.json` selects Next.js, locked `npm ci`, the build command and a 30-second chat function ceiling. The provider itself has a shorter deadline. Vercel's first deployment is production even without `--prod`; do not use `--public`, which publishes source rather than merely making the app accessible. See [CLI deployment](https://vercel.com/docs/cli/deploy) and [upload exclusions](https://vercel.com/docs/deployments/vercel-ignore).

Linking with CLI 59.12.0 downloaded an OIDC token into ignored `.env.local`; values were not displayed. The temporary root `.env.local` was removed before the production rebuild. A prebuilt deploy then exposed a real transport defect: Next file tracing referenced tracked `.env.example` while `.vercelignore` denied all `.env*`. The bounded fix allows only root `.env.example`; real environment files remain excluded. Do not run `link` needlessly or use env inspection to expose secrets.

## Runtime configuration and limits

Keep `CHAT_PROVIDER=mock` during simulated deployment checks. For authorized live checks use server-only `OPENROUTER_API_KEY`, `OPENROUTER_MODEL=openai/gpt-4.1-mini`, `OPENROUTER_KEY_EXPIRES_AT=2026-09-15T00:00:00Z`, and `CHAT_PROVIDER=openrouter`. Provision secrets through encrypted host environment settings or CLI stdin, never command arguments, public client variables or source files. Environment changes require a new deployment.

For direct Vercel ingress, `CHAT_TRUSTED_PROXY_IP_HEADER=x-forwarded-for` can enable per-client buckets: Vercel documents that it overwrites this header to prevent spoofing. No external reverse proxy or custom trusted-proxy feature is configured. The application accepts only one valid IP and falls back to a shared bucket otherwise. This remains process-local, resets on new instances, and cannot be claimed as distributed abuse protection. See [Vercel request headers](https://vercel.com/docs/headers/request-headers#x-forwarded-for).

The OpenRouter provider-enforced $5 key limit is the hard inference ceiling; application reserves and rate limits are best effort. Keep $0.50 unused reserve and conservative expiry. No paid add-ons or domain purchase were authorized. The deployment API reports plan `pro`; this is not a promise of zero hosting charges.

## Rollback / stop

If a live check fails, retain evidence and redeploy the last verified source with `CHAT_PROVIDER=mock`; this disables paid inference without pretending it is live. To restore a previous deployment use Vercel's documented rollback command after verifying its exact ID and environment. Do not delete projects or alter other team resources. No Git integration, push, submission or final release closure is implied by this deployment.
