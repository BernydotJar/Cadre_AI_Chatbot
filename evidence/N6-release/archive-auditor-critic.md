# Independent archive auditor critic

Result: **FAIL — two reproducible P2 validation gaps require repair before using this auditor as a package release gate.** This is a review of the auditor and proposed delivery procedure, not a finding that the application repository contains a secret or that a final ZIP is unsafe. No final ZIP was supplied or inspected.

## Scope and reviewed inputs

Reviewed fully on 2026-09-09 UTC, in a separate critic agent:

| Input | SHA-256 |
| --- | --- |
| `evidence/N6-release/audit-source.mjs` | `1519295a559149c4dfa57166dda1bcef9e48ab6896376800beddd9de133508e5` |
| `docs/delivery.md` | `e2ddd946f5dbb51989529070a4efb14fd461f08c7e1d6c1c6600c7241cd6cf47` |
| `evidence/N6-release/archive-auditor-self-check.json` | `1047b0fccf5a2bac003eb957e340b188276e2cd11cb21d7e997add88dbe19362` |

No application source, environment files, credentials or actual secret values were read or modified. No application Git commits, graph events, dependency installation, deployment, provider inference or browser installation occurred. All probes used a new synthetic repository under `/tmp/cadre-archive-critic-dzZfOo/source`, with an empty Git template and fake data. The previously tainted coordinator clone was not touched. This report is the critic's only application-directory write.

## Independent executed controls

Command: `rtk proxy node /tmp/cadre-archive-critic-dzZfOo/probe.mjs /tmp/cadre-archive-critic-dzZfOo <app>/evidence/N6-release/audit-source.mjs`. The probe invokes the auditor through `rtk proxy node` against a locally created synthetic repository and its exact full HEAD SHA. It does not use a real provider credential. The disposable script and repository remain available for a bounded repair verification; neither belongs in the source delivery.

| UTC time | Control | Observed | Expected |
| --- | --- | --- | --- |
| 04:39:30.966 | One clean synthetic commit, ordinary HTTPS origin, only README | PASS / exit 0; 3 physical and 3 reachable objects; 1 historical path; 11 files | PASS |
| 04:39:31.521 | Add a fake provider-pattern token in an arbitrary file beneath `.git/objects/` | PASS / exit 0; still 3 physical and 3 reachable objects; 12 files | FAIL |
| 04:39:32.579 | Commit a forbidden path after a literal tab in its name, then delete it from the current tree | PASS / exit 0; 3 commits, 9 physical and 9 reachable objects; 2 historical paths; 17 files | FAIL |

Positive-control full SHA: `fcfb4a4f17e3f87540e755d2bc9a248e87382269`. Historical-path negative-control full SHA: `1c8ec4943bb407030de06e7bce71eba818f970ab`. Both control snapshots reported tracked-manifest SHA-256 `9cc8d4d800284ff1a6bd4bf555f2d71e85f7dd186dfe182e804602c57d37fb01`. No raw fake token is retained in this report.

## Findings

### P2 — Unindexed files under the objects directory bypass inspection

Location: reviewed auditor lines 39–46 and 69–70.

The filesystem walk skips content scanning for every file whose path starts with `.git/objects/`, on the assumption that `cat-file --batch-all-objects` already scanned it decompressed. That command enumerates recognized Git objects, not every physical file in that directory. `git fsck --full --strict` also accepted the synthetic arbitrary file in this test. Adding `.git/objects/unindexed-note.txt` with a fake provider-token pattern left the audit at PASS despite an additional file being counted.

Impact: an unexpected file, including credential-shaped content, could be packed into the ZIP while both the object-closure comparison and scanner appear clean. A known fresh transport clone makes this less likely, but the same validator is intended to check actual extracted delivery bytes and should reject the condition.

Requested repair: validate the entire `.git/objects/` filesystem structure against narrowly accepted Git object/pack metadata forms. Reject unexpected files before skipping binary object content. Ensure recognized pack/index contents correspond to enumerated objects and preserve scanning of applicable non-object metadata. Do not fix this by treating any arbitrary file under that directory as a trusted binary object.

### P2 — Splitting on every tab truncates historical pathnames

Location: reviewed auditor lines 52–55.

`git ls-tree -r -z` separates metadata from an unquoted pathname with its first tab. A pathname itself may contain tabs. `const [meta, name] = entry.split('\t')` therefore retains only the part preceding the second tab. The synthetic path `safe<TAB>/.codex/note.md` was committed and subsequently removed. At the final clean HEAD, the walk correctly saw no current forbidden file, but historical validation checked `safe` instead of the full forbidden path and returned PASS.

Impact: forbidden historical paths can remain in the delivered Git history without triggering the policy check. This is independently relevant to the requirement to exclude `.codex`, environment files and private inputs throughout history, even when a content-pattern scanner finds no credential.

Requested repair: split each NUL-delimited entry at the first tab only, preserving the complete remaining pathname; validate malformed entries explicitly. Retest with a tab-containing parent directory and a forbidden historical child after that tab, including a deletion in a later commit.

## Other reviewed behavior and limits

- The full expected SHA, clean worktree, exact ordinary origin, allowed-ref names and values, non-shallow state, reachable/physical Git-object closure, per-object inflation/scan, and historical symlink/submodule checks are useful complementary checks. This review does not independently re-execute every one of them.
- Comparing all recognized objects to `rev-list --objects` catches ordinary unreachable objects, but is not by itself a complete filesystem inventory guarantee, as the first control demonstrates.
- The fresh transport clone with an empty template, refusal to update an existing ZIP, pre-extraction entry validation, extracted-source audit before dependency installation, and later mock verification are appropriate boundaries. Those later release steps remain to be executed and evidenced against the actual final archive.
- The current regexes intentionally recognize only selected literal credential forms. Encoded, split, shorter or other-provider secrets may not match; sufficiently long benign examples may match. A PASS must remain a bounded pattern-and-structure result, not a universal secret-free claim. Fixtures and reports must not retain matching fake or real tokens merely to document a test.
- The validator should remain limited to controlled, freshly prepared clones and verified extraction paths. It is not an untrusted-repository sandbox: Git commands run before the existing local-configuration check. Adversarial Git configuration or global/environment Git configuration is outside the executed controls here and should not be treated as certified safe.

## Exit criterion

Repair both P2 gaps, retain this FAIL report, and request a fresh independent report that reruns a clean positive control and both expected-negative controls against the repaired source hash. Then perform the separate actual-ZIP inventory, extraction, history/hash checks and application verification. This review neither authorizes distribution nor closes the final release gate.
