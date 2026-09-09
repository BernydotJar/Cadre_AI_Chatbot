# Independent archive auditor repair verification

Result: **FAIL — both original regressions are repaired, but one immediately adjacent P2 container-validation gap remains.** This report does not modify or supersede the original critic evidence. No actual delivery ZIP was examined.

## Scope

The separate critic/verifier agent reread the complete repaired `evidence/N6-release/audit-source.mjs`, SHA-256 `d0975ac39293d6cfa50a2529df9616a7ed584d360635b536f0904f8dc9eb404b`, and executed fresh synthetic controls on 2026-09-09 UTC. The original report `archive-auditor-critic.md` remains unchanged.

Executed command: `rtk proxy node /tmp/cadre-archive-verifier-GSeL7e/probe.mjs /tmp/cadre-archive-verifier-GSeL7e <app>/evidence/N6-release/audit-source.mjs`.

The test created a new synthetic repository in `/tmp/cadre-archive-verifier-GSeL7e/source`, an empty Git template, a fixed ordinary project origin and fake fixture data. No actual environment files, API keys, application source or original Git history were read or changed. There was no dependency installation, deployment, inference, graph write or application commit. Only this unique report was written inside the application directory. The temporary probe and fixtures are not delivery inputs.

## Actual results

| UTC time | Control | Expected | Observed |
| --- | --- | --- | --- |
| 04:42:28.153 | Clean one-commit synthetic repository | PASS | PASS / exit 0; 3 physical = 3 reachable objects; 11 files |
| 04:42:28.720 | Arbitrary `.git/objects/unindexed-note.txt` with fake provider-pattern text | FAIL | FAIL / exit 1; `unexpected-object-store-file` and `provider-token` |
| 04:42:29.274 | Fake content in canonical-looking orphan reverse-index filename | FAIL | **PASS / exit 0; no findings**; 3 physical = 3 reachable objects; 12 files |
| 04:42:30.286 | Deleted historical path `safe<TAB>/.codex/note.md` | FAIL | FAIL / exit 1; `forbidden-historical-path` preserves the full pathname |

Baseline snapshot: `ad98775c2f4e47e1c84884c9e34e0d17ce639283`.
Historical-path final snapshot: `f74bea5cc765f3967493964c1a26fa46f31bb9cf`.
Tracked-manifest SHA-256 for both final README-only trees: `9cc8d4d800284ff1a6bd4bf555f2d71e85f7dd186dfe182e804602c57d37fb01`.

The original two reproductions now behave correctly. First-tab-only slicing preserves forbidden historical children after a tab, and unknown ordinary files below `.git/objects/` are both rejected and scanned. The clean positive control still passes.

## Remaining P2: canonical-looking orphan `.rev` is trusted without verification

The repaired `objectContainer` regular expression accepts any path shaped like `.git/objects/pack/pack-<40 hex digits>.rev` and skips its bytes. The new adjacent control inserted a file with that pattern using forty zeroes as its stem, no paired `.pack` or `.idx`, and fake provider-pattern text as its content. The auditor still returned PASS. `cat-file --batch-all-objects` did not enumerate this arbitrary reverse-index file and `fsck --full --strict` accepted the repository in this environment. There was no real provider token.

This is the same inventory boundary as the original unindexed-file finding: a recognized filename shape is insufficient evidence that the file was inspected as part of a valid Git object container. The ZIP could include bytes not covered by either object enumeration or the raw scan.

Requested bounded repair: for this controlled source-delivery format, reject reverse-index files if they are unnecessary, or validate that each allowed reverse index belongs to an existing validated pack/index pair and that its own structure/integrity is verified. Keep the strict rejection of unknown files and ensure the canonical-name check cannot alone classify arbitrary bytes as already inspected. Apply equivalent validation to any other binary metadata type that remains exempt from raw scanning.

## Limits and next verification

The scope was the requested clean positive control, both prior negative controls and one directly adjacent reverse-index control. This is not a universal Git security or secret-detection assessment. The controlled-clone, regex-detection and actual-archive limitations in the original critic report still apply.

Retain this failed repair-verification report. After the remaining gap is addressed, independently rerun these four controls against the new source hash, including the successful clean control. Actual ZIP entry checks, clean extraction, exact source-history verification and application tests remain separate release evidence.
