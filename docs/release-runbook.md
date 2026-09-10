# Release runbook

Purpose: finish the current Cadre AI chatbot release without confusing local readiness with public delivery.

## Current release state

Core N6 production verification and the separate Donna productization release are complete on the **existing** Vercel project. GitHub source publication and CI are active; automated production delivery remains independently gated:

| Gate | Current state | What clears it |
|---|---|---|
| Core N6 release | **DONE** | Existing production alias reverified for the prior core line; release-check PASS and package check PASS |
| Donna productization P1–P3 | **DONE + public PASS** | all gates PASS; 279/279 Vitest; 52/52 local + clean public Playwright; deployment `dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy` on existing project |
| G10 CI/CD deploy-check | **BLOCKED only for automated CD** | product/public delivery PASS; GitHub `production` still lacks the existing-project Vercel org/project/token binding |
| GitHub remote activation | **ACTIVE; latest published PX6 line is historical** | pre-r11 source `69c590b` passed CI run `34442075458`; r12 is now DONE locally and must be published as a new exact closure SHA before CI/deploy/public equivalence. |
| Premium PX2–PX5 | **DONE at PX5 revision 4 / public PASS** | repaired source `8ae8a3a` deployed on existing project; anonymous smoke + **58/58** public Playwright PASS; revision-3 57/58 failure retained |
| Premium PX6 | **DONE locally at revision 12 / public release pending** | all three fresh r12 premium gates PASS; detached verifier **302/302 Vitest + 68/68 Playwright + 73/73 extension tests + 24/24 synthetic browser**; existing-project Vercel prebuild PASS with zero tracked drift. Publish/CI/deploy exact closure SHA, then require current public markers + full anonymous **68/68** Playwright. |
| G9 Chrome preview | DONE | No further action required for core release |
| G11 n8n contract | DONE | Real email delivery is optional and not a core release requirement |

Do not create a new Vercel project or temporary demo URL merely to make the status green. Manual recovery already proved the existing project; future G10 closure must use that same target.

## Release flow

```mermaid
flowchart TD
    A[Clean reviewed local SHA] --> B[Audited fast-forward publication to origin/main]
    B --> C[GitHub CI passes]
    C --> D[Repository release gate passes]
    D --> E[Production environment has existing Vercel org/project/token]
    E --> F[Vercel pull production config]
    F --> G[Vercel build --prod]
    G --> H[Vercel deploy --prebuilt --prod]
    H --> I[Public health + hero + icon + hello markers]
    I --> J[External Playwright/browser verification]
    J --> K[Optional one bounded live-provider smoke]
    K --> L[Clear G10 deploy gate; N6 is already DONE]
    L --> M[Build and verify final source ZIP from closure commit]
```

## 1. Preflight the release SHA

From a clean checkout/worktree:

```sh
git status -sb
git rev-parse HEAD
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run release:gate
node extension/build.mjs
npm exec -- vitest run --config extension/vitest.config.ts
npm run graph -- validate
```

The default Playwright server owns port 3100. Stop an old verifier-owned Next server before running E2E; do not kill unrelated processes blindly.

`release:gate` fails while a declared premium graph is incomplete, has a current non-PASS gate, **or has been invalidated by later failure evidence**. A later repair must append new transitions/gate PASS events before the gate can reopen. That is release protection, not an application regression. Historical source revisions that predate the premium graph pass this check.

## 2. Publish source through the audited path

The local branch must fast-forward `origin/main`; no force push and no history rewrite.

Use the platform-managed/audited Git publication action. If it reports a missing injected token, record the blocker and stop. **Do not expose or reuse a shell token as a workaround.** The publisher was restored on 2026-09-09; remote `main` reached `76e2b75` and CI passed.

After every publication, verify GitHub sees the expected exact SHA and both workflow files. The production workflow must also pass `npm run release:gate` before it reaches Vercel credentials.

## 3. Confirm Vercel binding

Target is the existing `Cadre_AI / cadre-ai3` project `cadre-ai-chatbot`.

The GitHub `production` environment must provide these secret names:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

Do not store values in the repository, logs, evidence, screenshots, or chat.

The production workflow deliberately constructs only an ephemeral `.vercel/project.json`; it does not call `vercel link` or create a replacement project.

## 4. Deploy the exact CI-approved SHA

The committed workflow performs:

```text
vercel pull --environment=production
        |
        v
vercel build --prod
        |
        v
vercel deploy --prebuilt --prod
```

The `--prebuilt` step matters: the artifact built under the reviewed production configuration is the artifact sent to Vercel.

## 5. Verify release markers

A deployment is not accepted merely because the provider reports READY. Public checks must establish release equivalence.

Required markers:

- `GET /api/health` -> `{"status":"ok"}`.
- `/` contains the current PX6 hero marker `From AI curiosity`, the verified product marker `Track your AI results`, and the `Ask Donna` entry point.
- `/` does **not** contain the stale `YOUR NEXT STEP STARTS HERE` marker.
- `/icon.svg` returns the current SVG asset.
- Exact `hello` returns `kind: "greeting"` and the current deterministic welcome rather than the historical redirect.

The workflow already checks these. Retain its receipt.

## 6. Run public browser verification

Once the deployment URL is known and approved:

```sh
E2E_BASE_URL=https://THE-VERIFIED-DEPLOYMENT npm run test:e2e
```

External-server mode can reach the real API/provider. Confirm inference budget/authorization before running it. Keep local intercepted browser evidence and public browser evidence labeled separately.

## 7. Optional bounded live inference

Run only if the chatbot-only allowance remains valid. One small real roundtrip is enough to establish provider-path availability; it is not a benchmark. Record dated usage metadata without exposing the key.

The optional Gemini comparison is not required to release and must not delay closure.

## 8. Close Graph Harness gates

Only after the exact public deployment and required verification pass:

- append new deployment evidence;
- re-evaluate G10 `deploy-check`;
- leave historical N6 PASS evidence unchanged unless a future runtime change explicitly reopens N6;
- transition through supported states only;
- update `progress/checkpoint.md` and projections from the authoritative ledgers.

Never hand-edit the frozen baseline or relabel old BLOCKED evidence.

## 9. Build the final delivery ZIP

The previously tested ZIP is historical because source has changed since it was produced. Rebuild only from the exact closure commit.

Follow `docs/delivery.md`: fresh transport clone, no inherited hooks, usable `.git`, no `.env.local`, `.vercel`, `.codex`, dependencies, caches, generated build output, private inputs, or stale archives. Verify the **extracted ZIP**, not merely the working tree, with Git fsck, locked install, tests, lint, typecheck, build, smoke and checksum.

The final archive is preparation for handoff; it does not itself authorize external upload/submission.

## Rollback

If the new deployment fails a mandatory marker:

1. retain the failed deployment evidence;
2. do not change tests to accept stale behavior;
3. identify whether the fault is source, environment, build, alias/promotion, or provider configuration;
4. restore the last known verified deployment using the authorized Vercel rollback/redeploy mechanism;
5. fix forward through a new reviewed SHA.

For provider-specific instability, explicit mock mode may be used for diagnosis, but never presented as a live release.

## Release owner checklist

- [ ] Local SHA is clean and all mandatory local checks pass.
- [ ] `origin/main` contains that exact SHA through the audited publication mechanism.
- [ ] GitHub CI passed for that SHA.
- [ ] Repository `release:gate` passed for that SHA; no premium node/gate remains open.
- [ ] Existing Vercel project binding is confirmed; no replacement project created.
- [ ] Production secrets exist only in the authorized secret store.
- [ ] Exact prebuilt SHA deployed.
- [ ] Health, hero, icon and greeting markers pass publicly.
- [ ] Public browser verification passes.
- [ ] Graph release gates updated from real evidence.
- [ ] Final ZIP rebuilt and independently verified from the N6 closure commit.
- [ ] Submission/upload remains a separate explicit human action.


## Donna release markers

For the active PX6 line, verify the existing public alias anonymously only after its local gates pass. Minimum markers are: page title `Donna | Cadre AI`, root `data-product="cadre-donna"`, hero `From AI curiosity`, public product section `Track your AI results`, visible `Ask Donna` launcher, simplified `/icon.svg`, healthy `/api/health`, and exact `hello -> kind=greeting`. Behavioral probes must also confirm exactly one configured Donna diagnostic question on a grounded overview answer, no optional follow-up after `Just answer, no follow-up questions please.`, pricing language that contains no fabricated rate, and account/unsupported boundaries that retain only the approved handoff. Then run the **entire current external Playwright matrix**; never reuse an older 52/58-case count as proof for a changed source line.
