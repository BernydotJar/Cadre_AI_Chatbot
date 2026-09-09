# N5 independent review — early walking skeleton

**Result: PASS for the scoped early N5 deployment only.** This verifies an anonymously accessible scaffold and a deployed mock chat round-trip. It does not approve the finished UI, live-model behavior, the latest local source, or release closure.

Reviewer: separate agent from the deployment operator. Public checks started at **2026-09-09T02:39:48.855Z** (2026-09-08 evening, America/Guatemala). Target: `https://cadre-ai-chatbot-tawny.vercel.app`.

## Actual anonymous checks

Requests used Node's built-in fetch with `credentials: "omit"`, no Cookie or Authorization headers, manual redirects, and a 15-second timeout. No browser session, Vercel authentication, CLI credential, or environment file was used. **Exactly one chat POST** was sent; no retry or live-provider invocation was performed by this reviewer.

| Check | Actual result |
| --- | --- |
| `GET /` | 200 HTML, no redirect. Visible page text: `Cadre AI Chatbot` and `The conversation interface ships in a later increment.` |
| `GET /api/health` | 200 JSON, `{"status":"ok"}`, `Cache-Control: no-store`. |
| `POST /api/chat`, `Content-Type: application/json`, one user message `What services does Cadre AI offer?` | 200 JSON, `kind: grounded`, `Cache-Control: no-store`. Reply contained the three approved service-overview facts and the four official strategy, engineering, agents, and leadership/facilitation links. |
| `GET /.env.local` | 404. |
| `GET /.codex/`, then explicit `GET /.codex` | 308 canonical-path redirect to `/.codex`, then 404. No private content returned. |
| `GET /.git/config` | 404. |
| `GET /CLAUDE.md`, `/test.md` | Both 404. |
| `GET /evidence/N5-deploy/upload-dry-run.json` | 404. |
| `GET /src/provider/openrouter.ts`, `/package.json` | Both 404. |
| Six JavaScript bundles referenced by the public page | All 200. No matches for the checked server secret identifiers or OpenRouter credential-shaped pattern. This is a bounded scan, not proof that every possible secret is absent. |
| `GET /_src` | 307 to Vercel's deployment source-view URL. That redirect was not followed or treated as evidence of public source access. |

The prior `anonymous-mock.json` is consistent with this independent round-trip. Its additional empty-input and unsupported-media checks were not repeated, keeping this review to the requested one chat POST.

## Deployment inputs and configuration

Reviewed `.vercelignore`, `vercel.json`, `docs/deploy.md`, `upload-dry-run.json`, `anonymous-mock.json`, and the sanitized `deployment-metadata.json`.

- `.vercelignore` denies root paths by default and admits only application/build inputs. It explicitly excludes nested `.codex`, `.git`, `.env*`, PEM/key files, ZIPs, and the second-client fixture.
- The retained dry-run manifest contains **24 files, 307,044 bytes**. Inspection of every listed path found no `.codex`, `.git`, `.env*`, private inputs, process evidence, test files, or user-owned `test.md`. Its ignored list includes environment files, Git, docs, evidence, process state, tests, and build/cache directories.
- `vercel.json` selects Next.js, locked `npm ci --no-audit --no-fund`, `npm run build`, and a 30-second maximum for the chat function. The app retains its shorter provider deadline.
- Sanitized operator-retained metadata reports deployment `dpl_AYJ4NjLYYJxmbWHFBQ65K8GxsJZn`, READY, production target, Node `24.x`, Next.js, Pro plan, and source commit `7ac6086edc2a54f5d60452b5bd4db46868c6f8af`. This metadata was inspected locally, not independently re-fetched through authenticated Vercel APIs.
- The current deployment instructions use `CHAT_TRUSTED_PROXY_IP_HEADER`, matching the source. The coordinator corrected the initially observed missing `PROXY` segment during review. No outstanding corrective finding remains against the current instructions.

## Source publication and mock-only provisioning evidence

The coordinator provided this sanitized actual deployment invocation:

```sh
rtk proxy env VERCEL_TELEMETRY_DISABLED=1 npm exec --yes --package=vercel@59.12.0 -- vercel deploy --yes --prod --scope cadre-ai3 --env CHAT_PROVIDER=mock --build-env CHAT_PROVIDER=mock
```

It contains **no `--public` flag** and explicitly selects mock mode at runtime and build time. The coordinator also reported no `vercel env add` or environment-creation API operation and no live provider key provisioned to this deployment. The existing local environment was excluded from the upload manifest. These are **coordinator-provided operation records**, not facts that anonymous public requests can independently prove. No authenticated inspection was attempted to convert them into a stronger claim.

## Local versus deployed source and limits

The upload manifest records `src/provider/openrouter.ts` at 9,720 bytes with SHA-1 `2c60969e9c913b7013e4886a4ecbfa749df8263a`. The current local file is 10,230 bytes with SHA-1 `0c2f7171b43e27015ba956a3f9d24788fc1e4665`. This confirms the expected difference after the later N3 prompt-byte fix; the deployed mock check does not verify that newer fix in production.

There is no finished conversation UI on the public page yet. No live inference, paid evaluation, final browser UX suite, source-archive verification, or final acceptance gate is covered by this PASS. Process-local rate limiting and budget reservations retain their documented serverless limitations. No source, cloud setting, environment, Git state, or ledger was changed by this review.
