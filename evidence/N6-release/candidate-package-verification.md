# N6 candidate source package — clean extraction verification

Date: 2026-09-09 UTC. Snapshot: `c7880db0a117fcb65bd3bcc41d326c356383c775`.

**Verdict: PASS for candidate-package preparation and clean-room verification.** This is evidence that a source ZIP can be prepared and verified from the named commit; it is not evidence that the archive was uploaded or submitted.

## Preparation boundary

A fresh temporary Git transport clone was created outside the working repository using `--no-local --single-branch --no-tags`, an empty Git template, and `pack.writeReverseIndex=false`. It was detached at the exact snapshot and its origin was set to `https://github.com/BernydotJar/Cadre_AI_Chatbot.git`.

`audit-source.mjs` historically calls commands through `rtk proxy`. This Cloud Sandbox image does not include `rtk`, so a temporary external compatibility shim accepted only the `rtk proxy <command>` shape and executed that command directly. The shim was outside both repository and ZIP. The auditor itself remained the tracked, reviewed version at this snapshot.

## Source/history audit

Audit result: PASS.

- 37 commits.
- 552 physical Git objects; 552 reachable objects.
- 245 historical paths.
- 256 regular files before dependency installation.
- tracked-manifest SHA-256: `144d8b568c96f558e50a9f96012fca73e93ea73eed8db23ef16864f94c63d0c9`.
- findings: none.
- `git fsck --full --strict`: PASS with no output.
- extracted HEAD matched the expected full snapshot; worktree was clean; origin matched the ordinary HTTPS repository URL.
- before dependency installation, no `.env.local`, `.vercel`, `.codex`, `node_modules`, or `.next` path existed in the extracted source.

The prior intentional hostile-URL fixture false positive and its bounded repair are separately retained in `archive-fixture-fix-verifier.md`.

## ZIP safety

Candidate file: `Cadre-AI-chatbot-source-candidate.zip` in a temporary verification directory outside the repository.

- bytes: **2,124,813**.
- SHA-256: `db1a48072f9c03fa85a35e638641c51ec19f912240c58c4e9fa5086af8fc60f7`.
- entries: 325.
- `unzip -t`: PASS; no compressed-data errors.
- independent ZIP entry scan: PASS; no absolute/traversal path and no symlink entry.

## Clean extracted-project verification

The ZIP was extracted into a new empty directory. `E2E_BASE_URL`, provider/model credentials, deployment token variables, and provider-mode overrides were explicitly unset. Verification ran against mock inference only; no public chatbot/provider request was required.

- `npm ci`: PASS; 380 packages installed; npm reported 0 vulnerabilities.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS (`tsc --noEmit`).
- `npm test`: PASS — 11 files / **245 tests**.
- `npm run build`: PASS — Next production build compiled successfully.
- `npm run test:e2e`: PASS — **48/48 Playwright cases** covering desktop/mobile conversation, failure/retry/cancel, hydration, inert model text, keyboard/IME, long history, small-screen text-spacing, and readability checks.

The npm install emitted a deprecation warning for the currently locked ESLint 9.39.5 release; it did not fail lint, tests, typecheck, build, or browser verification. This package check does not upgrade dependencies or expand scope.

## Limits

The archive scanner is pattern-based rather than universal secret detection. The candidate ZIP is an intermediate release artifact: later documentation/ledger closure commits will require a final ZIP from the final closure snapshot if that exact final state is submitted. Preparation does not authorize Git push, recruitment upload, email, or other publication.
