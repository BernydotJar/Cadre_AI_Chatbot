# Vercel deployment

Owner-approved target: `Cadre_AI` / `cadre-ai3`. Project: `cadre-ai-chatbot`. Public production alias: https://cadre-ai-chatbot-tawny.vercel.app.

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

Linking with CLI 59.12.0 also downloaded an OIDC token into ignored `.env.local` and appended redundant ignore rules. The existing chatbot keys remained present, mode 0600; values were not displayed. The redundant ignore rules were removed so `.env.example` remains explicitly allowed. Do not run `link` needlessly or use `env pull` to inspect secrets.

## Runtime configuration and limits

Keep `CHAT_PROVIDER=mock` during simulated deployment checks. For authorized live checks use server-only `OPENROUTER_API_KEY`, `OPENROUTER_MODEL=openai/gpt-4.1-mini`, `OPENROUTER_KEY_EXPIRES_AT=2026-09-15T00:00:00Z`, and `CHAT_PROVIDER=openrouter`. Provision secrets through encrypted host environment settings or CLI stdin, never command arguments, public client variables or source files. Environment changes require a new deployment.

For direct Vercel ingress, `CHAT_TRUSTED_IP_HEADER=x-forwarded-for` can enable per-client buckets: Vercel documents that it overwrites this header to prevent spoofing. No external reverse proxy or custom trusted-proxy feature is configured. The application accepts only one valid IP and falls back to a shared bucket otherwise. This remains process-local, resets on new instances, and cannot be claimed as distributed abuse protection. See [Vercel request headers](https://vercel.com/docs/headers/request-headers#x-forwarded-for).

The OpenRouter provider-enforced $5 key limit is the hard inference ceiling; application reserves and rate limits are best effort. Keep $0.50 unused reserve and conservative expiry. No paid add-ons or domain purchase were authorized. The deployment API reports plan `pro`; this is not a promise of zero hosting charges.

## Rollback / stop

If a live check fails, retain evidence and redeploy the last verified source with `CHAT_PROVIDER=mock`; this disables paid inference without pretending it is live. To restore a previous deployment use Vercel's documented rollback command after verifying its exact ID and environment. Do not delete projects or alter other team resources. No Git integration, push, submission or final release closure is implied by this deployment.
