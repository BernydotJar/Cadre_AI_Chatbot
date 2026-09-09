# N6 candidate source package — pre-closure clean-room verification

Date: 2026-09-09 UTC.

Snapshot: `ca223fb63eb25eaabf0076497a4151750fb3c35a`.

**Verdict: PASS for source-package construction and clean-room verification.** This is the package-check evidence required to close N6. Because the N6 gate event itself is appended after this check, the final handoff ZIP should be rebuilt once more from the closure commit; that later rebuild is a packaging synchronization step, not a new product change.

## Preparation boundary

A fresh Git transport clone was created outside the working repository with `--no-local --single-branch --no-tags`, an empty Git template, and `pack.writeReverseIndex=false`. It was detached at the exact snapshot and its remote was rewritten to the ordinary HTTPS project URL. No credentials, local Vercel binding, `.env.local`, build output, dependency tree, private inputs, or original working-repository reflogs/hooks were copied.

The tracked `audit-source.mjs` requires the historical `rtk proxy` command shape. This workstation does not include `rtk`, so a temporary external shim accepted only `rtk proxy <command>` and executed the requested command. The shim stayed outside both repository and ZIP.

## Source and history audit

Both the pre-archive clone and the newly extracted ZIP passed the tracked source auditor:

- commits: **58**
- physical Git objects: **828**
- reachable Git objects: **828**
- historical paths: **341**
- regular files before dependency installation: **352**
- tracked-manifest SHA-256: `b13b820484068b22036bf9d2272eb2cb78a1a0f1a638aa89c63cae35456a0120`
- findings: **none**
- `git fsck --full --strict`: PASS
- extracted HEAD: exact expected snapshot
- extracted worktree: clean detached HEAD
- origin: ordinary HTTPS repository URL

The scanner is pattern-based rather than universal secret detection; that limitation is unchanged.

## ZIP integrity and safety

Candidate package generated outside tracked source state:

`artifacts/Cadre-AI-chatbot-source-candidate-preclosure.zip`

- bytes: **14,070,455**
- SHA-256: `dbfb7f445255dde9cf4b61935dad16e874929f5a746a5d3640ffcf30960dbb1c`
- ZIP entries: **439**
- `unzip -t`: PASS
- path traversal / absolute path scan: PASS
- symlink entry scan: PASS

The artifact directory is ignored and is not part of the source snapshot.

## Clean extracted-project verification

The archive was extracted into a new empty directory. `E2E_BASE_URL`, OpenRouter credentials/model/expiry, Vercel deployment variables, and inherited live-provider configuration were removed from the verification environment; `CHAT_PROVIDER=mock` was explicit.

Results:

- `npm ci --no-audit --no-fund`: PASS — 380 packages installed
- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm test`: PASS — **11 files / 256 tests**
- `npm run build`: PASS — Next.js 16.3.4 production build
- `npm run test:e2e`: PASS — **50/50 Playwright cases** across desktop/mobile

The locked ESLint package emitted its known deprecation warning and Vitest emitted its known future config-loader warning; neither affected the verification result.

## Release interpretation

This package check proves that the complete candidate source/history at the named snapshot can be transported, extracted, audited, installed, built, and tested independently. It does not claim recruitment submission. After N6 is transitioned to DONE and final projections are committed, rebuild the handoff ZIP from that closure commit and record its final checksum outside the self-referential source snapshot.
