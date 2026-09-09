# Engineering workflow

`CLAUDE.md` contains durable project constraints, not a growing transcript. `plan.md` indexes decisions. The three original spec files define approved requirements; the frozen graph definition and append-only event log carry execution state. `progress/checkpoint.md` is a resumable summary, never independent authority to mark a node done.

## Real roles, bounded context

One coordinator owns Git and the graph ledger. Implementers receive the active node, permitted files, frozen acceptance criteria and relevant findings. Critics and verifiers receive a fresh bounded context and may write only their own evidence report, not production code. This separates authorship from review; it does not claim a human or organizational audit.

N2 example: `/root/n2_critic` reproduced four defects on the recovered implementation; `/root/n2_fixer` repaired them and added regressions; `/root/n2_verifier` independently checks the corrected snapshot. Reports retain actual commands and hashes under `evidence/N2-knowledge-routing/`. A task name documents execution provenance; it is not an authenticated human signature. Reports include findings and observable results, never private reasoning transcripts.

## Local commands

Use a Node version accepted by the project's `engines` field (22.12+, 24.x, or 26+); Node 26.5.0 is the locally verified runtime. The installed Vitest 5 toolchain no longer supports Node 20, so the project and lockfile declare the actual development requirement rather than Next.js's lower runtime minimum.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run verify -- unique-run-label
```

`verify` runs the real checks with mock inference and saves sanitized stdout/stderr, exit codes and a timestamp under `evidence/runs/<label>/`. It refuses to overwrite an existing run. A passing mock check never establishes live inference or public deployment.

Graph commands use Python 3.11+ and an external checkout of [Graph Harness](https://github.com/BernydotJar/Graph-harness-sdlc) at `6a5f201e2bc640ac46cc0b4b6a3d11b788555664`:

```sh
export GRAPH_HARNESS_RUNTIME=/absolute/path/to/Graph-harness-sdlc
export GRAPH_PYTHON=python3
npm run graph -- validate
npm run graph -- status --pretty
npm run graph -- ready --pretty
```

The thin adapter checks the pinned revision and tracked cleanliness, supplies an optimistic last-event guard for writes, and hashes existing evidence files. Missing artifacts cannot silently become hash-of-label evidence. Baseline generation refuses once the event log exists. These are actual reusable project commands, not claimed execution of a native slash command.

## Commits and review gates

The first recovery commit honestly captures already-existing foundation and routing WIP. Later commits separate tooling, decisions, fixes, provider integration and UI. Do not backdate or fabricate a task-per-commit history after the fact. Code can be committed while its node awaits independent review; that is not release approval.

Record failed evidence as failed, repair only the implicated files, rerun checks and then evaluate the gate. New evidence never silently overwrites old evidence. Preserve historical runtime events even when wording, prior assumptions or actor names differ from current conventions. Do not rewrite the past to make it look cleaner.

## Secret and delivery boundaries

`.env.local`, `.codex`, deployment metadata, local outputs, dependency trees and build outputs stay ignored. Never stage the user's unrelated working files. Stage explicit paths and scan the staged content before committing. The source archive must retain usable `.git` history, but no private inputs or runtime credential. An archive is preparation, not authority to submit or publish it.
