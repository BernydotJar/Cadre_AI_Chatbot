# Public release drift after product polish — 2026-09-09

Target alias: `https://cadre-ai-chatbot-tawny.vercel.app`

## Anonymous public observations

- `GET /api/health` -> `{"status":"ok"}`.
- Public HTML still contains the old hero markers `A little clarity` and `YOUR NEXT STEP STARTS HERE`.
- Public HTML does not contain the current local hero marker `Turn AI curiosity` / `GUIDED BY VERIFIED CADRE CONTEXT`.
- `POST /api/chat` with exact `hello` still returns the old `kind:"redirect"` unsupported-information handoff.
- Current locally verified source instead returns deterministic `kind:"greeting"`, emits `/icon.svg`, and has the Cadre Signal polish; therefore the public alias is demonstrably not release-equivalent to the reviewed worktree.

## Deployment mechanisms checked

- The connected Vercel integration exposes team `Cadre_AI` (`cadre-ai3`) but currently lists zero projects.
- Its advertised `deploy_to_vercel` action failed before deployment because the connector runtime required hidden `target`, `name`, and `files` fields that are not exposed by the callable schema. No deployment was created.
- The sandbox Vercel CLI remains logged out and has no `.vercel/project.json` or injected connector credential.

## Release decision

Do not relabel the existing public alias as current. Local product development and the Chrome Integration Preview are verified, but N6 `release-check` remains BLOCKED until an authenticated deployment path can deploy this exact reviewed worktree and anonymous public smoke/browser checks pass against that release.
