# Local CI/CD producer evidence — 2026-09-09

Scope: repository workflow source only. No deployment credential was available to this sandbox and no unrelated Vercel project was created.

## CI

`.github/workflows/ci.yml` is secret-free. On PRs and pushes to `main` it uses Node 24, installs the lockfile, runs lint, strict typecheck, unit/integration tests, production build, extension build/tests, Playwright desktop/mobile, and the synthetic extension browser lifecycle. Actual-site extension proof is deliberately excluded from routine CI.

## CD

`.github/workflows/deploy-production.yml` runs after a successful `CI` workflow on `main` or by manual dispatch. The job is bound to GitHub environment `production`, refuses to continue unless `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` are present, writes only an ephemeral `.vercel/project.json`, pulls the existing production environment, prebuilds, and deploys that exact output. It never executes `vercel link` or `vercel project add`, so missing project access cannot silently create a replacement project.

Post-deploy checks require `/api/health`, `/icon.svg`, the Cadre Signal hero marker, and deterministic `hello -> kind:greeting`. This makes the previously observed stale alias detectable in the delivery pipeline.
