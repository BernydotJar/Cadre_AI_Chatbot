# Claude Code release auditor — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Mode: project-scoped `release-auditor`, read-only brief; no source edits/deploy/Graph writes/provider inference authorized.
- External GitHub/CI/CD facts were supplied explicitly and are labeled as coordinator observations.

## Raw reviewer output

## VERDICT: PARTIAL_WITH_DOCUMENTED_BLOCKERS

Independently reproduced facts (not just re-stated from the brief): `git ls-remote origin main` → `76e2b756acf04762627210457e36e800de682b02` (matches local HEAD and `/shared-auth/.../original-git-history.txt`); `gh run view 34382168718` → CI `SUCCESS` (quality + browser jobs both ✓); `gh run view 34382393971` → `deploy` job failed at step "Require an existing Vercel project binding" with `VERCEL_ORG_ID/PROJECT_ID/TOKEN` empty, no later steps ran; `gh api .../environments` → the `production` environment has `protection_rules: []` (no required reviewers); `curl https://cadre-ai-chatbot-tawny.vercel.app/api/health` → `200 {"status":"ok"}`; local `npm run typecheck` → clean; `git ls-files` shows no `node_modules/`, `.next/`, `test-results/`, `artifacts/` tracked, `.git` itself is present and usable (13M, log/fsck-able); `.env.example` contains only placeholders; no tracked secret patterns found.

## Blockers

1. **No delivery ZIP exists for the current closure commit.** `evidence/N6-release/` only contains package-check evidence for `ca223fb...` (58 commits) and `c7880db...` (37 commits) — both far behind current HEAD `76e2b75` (158+ commits, includes the whole premium graph). The delivery contract requires a lightweight ZIP with usable `.git` history at the actual release snapshot; none has been built or checksummed since. Smallest repair: run `docs/delivery.md`'s prep sequence from `76e2b75` (or whatever commit is finally declared closure) and record a fresh checksum/verification report.

2. **Production CD auto-promotion has no gate tied to the design-review block.** `.github/workflows/deploy-production.yml` triggers automatically on `workflow_run` success for `main` with `environment: production`, and that environment has zero protection rules (`protection_rules: []`, confirmed via `gh api`). `plan.md` (M11) and `progress/checkpoint-premium.md` state PX2's premium UI is `REVIEW`/`design-review=BLOCKED` and "must not be promoted until the design gate passes" — but nothing in the actual CI/CD pipeline enforces that. The only thing currently preventing an unreviewed promotion of premium HEAD to the public alias is the *absence* of `VERCEL_ORG_ID/PROJECT_ID/TOKEN`. The moment G10's credential blocker is fixed, the next green CI run will silently deploy the un-gated premium commit, contradicting the documented design-gate discipline. Smallest repair: add a required reviewer to the GitHub `production` environment (or an explicit workflow check reading the premium ledger's `design-review` gate) *before* injecting the Vercel secrets.

## Non-blocking findings

- `progress/checkpoint.md` still does not reference `progress/checkpoint-premium.md`/PX2 anywhere (confirmed by direct read of the file), exactly the gap flagged in `evidence/claude-code/architecture-scope-critic-20260909.md`. That self-critique exists and is real, but its own "smallest repair" (one cross-reference line) has not yet been applied at HEAD `76e2b75`.
- `eslint.config.mjs` ignore list omits `.vercel/**`. Reproducing `npm run lint` in this exact working copy fails with 20 errors, but all of them are inside a stray `.vercel/output/static/_next/**` directory left in the working tree from a prior local `vercel build`/preview session (untracked, gitignored, not part of the source snapshot). CI is unaffected (its runners never contain `.vercel/output` before `npm run lint`), but the ignore list should still list `.vercel/**` defensively.
- The working tree currently contains `.vercel/.env.preview.local` and `.vercel/.env.production.local` (untracked, gitignored — confirmed `git status` clean, contents not inspected per instructions). `docs/delivery.md` correctly forbids "copying the working directory wholesale" and mandates a fresh `git clone` for packaging specifically to avoid this class of leak — that design is validated as necessary by what's actually sitting in this workspace right now. No leak into Git itself was found.
- Deploy-workflow release markers (`Turn AI curiosity` hero text, `/icon.svg`, deterministic `hello`) were checked against current source (`src/product/profiles/cadre-donna.ts:60`) and match — the workflow is not stale relative to source, it simply has never executed end-to-end.
- Optional Gemini 3.8 Flash comparison is explicitly labeled **NOT RUN** in `plan.md` with a stated reason (no exported credential) — correctly meets the "label NOT RUN unless live evidence exists" requirement.
- Public alias (`cadre-ai-chatbot-tawny.vercel.app`) is documented everywhere as serving an **older** productized commit (`7b6004c1...`), not current HEAD (`76e2b75`, which includes the still-unreviewed premium PX2 work). No document found conflates the two; the "source equals deployed" claim is correctly scoped to the older SHA only.

## GIT HISTORY RECOMMENDATION: preserve

The append-only Graph Harness ledgers (`progress/*-graph.events.jsonl`), retained FAIL/BLOCKED evidence (multiple G10 publication retries, the empty/timed-out PX2 critic attempts), and authentic author (`Bernydotjar`) + committer (`ChatGPT Sandbox Agent`) metadata are the primary auditability surface this repository relies on — CLAUDE.md explicitly forbids rewriting that history "to conceal an automated actor" (D5/U4). Nothing found in the tracked history or working tree requires a secret purge. Rewriting would destroy the evidence trail that let this audit distinguish real progress (CI green, git published) from unresolved risk (CD gate, ZIP gap) instead of improving it.

## WHAT TO DEMO

1. `git log --oneline -5` + `git ls-remote origin main` — show local/remote convergence at `76e2b75`.
2. `gh run view 34382168718` (CI success) then `gh run view 34382393971 --log-failed` (CD preflight failure) — the exact, current state of the pipeline.
3. `curl https://cadre-ai-chatbot-tawny.vercel.app/api/health` and a scripted `hello`/grounded/opt-out/pricing-boundary exchange against that alias — the actual mandatory chatbot behavior and boundaries.
4. `progress/checkpoint.md` → `progress/checkpoint-premium.md` → `progress/cicd-graph.events.jsonl` tail — walk the three separate ledgers to show why the premium UI is not on the public alias and why CD is blocked, not silently skipped.
5. `docs/release-runbook.md` §2–5 and `docs/delivery.md` — the documented remaining steps (publish credential repair + gated production environment + fresh ZIP rebuild) that close this out.
6. `.claude/agents/*.md`, `.claude/commands/*.md`, and `evidence/claude-code/architecture-scope-critic-20260909.md` — actual Claude Code provenance evidence, not just configuration.

## What I did not independently verify

- Did not run `npm ci`/full `npm test` (279 cases), `npm run build`, or `npm run test:e2e` (52 browser cases) myself — ran only `typecheck` (PASS) and `lint` (spurious local-only failure explained above, not a source defect). The 279/279 and 52/52 counts remain as-claimed, not re-executed by me.
- Did not extract a clean-room ZIP (none exists yet for current HEAD to extract).
- Did not inspect contents of `.vercel/.env*.local` or any other credential material (by design).
- Did not access or authenticate to the protected PX2 Vercel preview (confirmed only its public 302 SSO-redirect response).
- Did not verify the Chrome extension's disposable-profile actual-site run or the n8n webhook contract firsthand; relied on retained evidence files as described.
- Did not attempt to reproduce Vercel-side deployment state (no Vercel CLI/API access attempted), only GitHub Actions and the public HTTPS alias.
