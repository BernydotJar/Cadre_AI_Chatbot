# Archive auditor — final independent repair verification

Date: 2026-09-09 UTC. Role: independent verifier, separate from the earlier retired archive critic/verifier and the coordinator.

**Verdict: PASS for the requested repaired-auditor controls.** A clean synthetic repository and a clean packed transport clone pass. All three deliberately invalid fixtures fail with the expected findings. This is **not a verification of an actual final delivery ZIP** and does not approve distribution.

Earlier `archive-auditor-critic.md` and `archive-auditor-verifier.md` remain unchanged. Their failures are preserved, not reclassified.

## Read-only review and scope

Read the complete current `evidence/N6-release/audit-source.mjs`, `docs/delivery.md`, both earlier reports, and the complete existing four-control probe before execution.

The current auditor splits historical tree records at the first tab, retaining the entire path after it. Only canonical loose objects and pack/idx container names are exempted from raw scanning. Reverse-index files under the object store are now unexpected and scanned rather than trusted from their filename. Delivery instructions use `git -c pack.writeReverseIndex=false clone` because this controlled format does not need optional reverse indices.

All fixture work ran under a fresh directory, `/tmp/cadre-archive-final-verifier.Ht8AZz`, obtained with:

```sh
rtk proxy mktemp -d /tmp/cadre-archive-final-verifier.XXXXXX
```

The existing probe was only read/executed; its earlier repository was not touched. The coordinator's tainted old clone and the application repository's Git were not accessed or changed. Git init/commit/clone commands below operated **only on newly created synthetic fixtures**. System/global Git configuration was disabled for these fixture processes. No actual environment files, credentials, provider inference, external HTTP, dependencies, app build, deployment or ledger activity occurred.

## Four controls — actual execution

```sh
rtk proxy env GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null node /tmp/cadre-archive-verifier-GSeL7e/probe.mjs /tmp/cadre-archive-final-verifier.Ht8AZz '/Users/eduardosacahui/Library/Mobile Documents/com~apple~CloudDocs/Documents/Desktop/Cadre AI/evidence/N6-release/audit-source.mjs'
```

The wrapper completed with exit 0. Its individual auditor exits were parsed and independently checked as `[0, 1, 1, 1]`, not inferred from the wrapper's exit.

| UTC time | Control | Expected | Actual |
|---|---|---|---|
| 04:57:16.222 | Clean one-commit synthetic repository | PASS | PASS / 0; no findings |
| 04:57:16.778 | Arbitrary unindexed object-store file containing a fake pattern | FAIL | FAIL / 1; unexpected-object-store-file and provider-token |
| 04:57:17.301 | Canonical-looking orphan reverse-index file containing a fake pattern | FAIL | FAIL / 1; unexpected-object-store-file and provider-token |
| 04:57:18.286 | Deleted historical `safe<TAB>/.codex/note.md` | FAIL | FAIL / 1; forbidden-historical-path with complete tab-containing pathname |

No fake matching token bytes were printed or retained in this report. Findings identify sanitized rule/path/object information only.

Observed clean snapshot: `107829b87b2e97e90d9e9c2813ede27f785e4545`; 3 physical = 3 reachable objects, 1 commit, 1 historical path, 11 regular files.

Observed historical-negative final snapshot: `5441057dd0683686370b732def5a3926bbe7521c`; 9 physical = 9 reachable objects, 3 commits, 2 historical paths, 17 files. The retained finding targeted commit `73340662769f85bf51942c5aaace42a80c65c376` plus the full `safe<TAB>/.codex/note.md` path.

All these README-only current trees shared tracked-manifest SHA-256 `9cc8d4d800284ff1a6bd4bf555f2d71e85f7dd186dfe182e804602c57d37fb01`. That equality does not hide the forbidden path in history; the repaired check rejects it.

## Fresh packed positive control

Created a separate clean synthetic origin inside the same fresh temporary root; its README was authored with apply_patch. It is not the fixture containing the forbidden historical path. A Node harness invoked these exact scoped Git commands, with system/global configuration disabled:

```sh
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin init --initial-branch=main --template=/tmp/cadre-archive-final-verifier.Ht8AZz/packed-template
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin config user.name 'Synthetic Archive Final Verifier'
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin config user.email synthetic@example.invalid
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin add README.md
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin commit -m 'Synthetic clean packed positive control'
rtk proxy git -c pack.writeReverseIndex=false clone --no-local --single-branch --no-tags --branch main --template=/tmp/cadre-archive-final-verifier.Ht8AZz/packed-template /tmp/cadre-archive-final-verifier.Ht8AZz/packed-origin /tmp/cadre-archive-final-verifier.Ht8AZz/packed-clone
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-clone remote set-url origin https://github.com/BernydotJar/Cadre_AI_Chatbot.git
rtk proxy git -C /tmp/cadre-archive-final-verifier.Ht8AZz/packed-clone rev-parse HEAD
```

The clone operation uses local Git transport with `--no-local`; the later ordinary HTTPS origin is metadata only and was not fetched.

The independent harness asserted exactly one `.pack`, one `.idx`, no `.rev`, and no additional pack-directory entries, then called:

```sh
rtk proxy node '/Users/eduardosacahui/Library/Mobile Documents/com~apple~CloudDocs/Documents/Desktop/Cadre AI/evidence/N6-release/audit-source.mjs' /tmp/cadre-archive-final-verifier.Ht8AZz/packed-clone 5374eab837deb7f07c18a161ae955b10c6155fce
```

Actual auditor output at 04:57:49.361Z: **PASS / exit 0**, no findings, 1 commit, 3 physical = 3 reachable objects, 1 historical path and 10 regular files. Snapshot `5374eab837deb7f07c18a161ae955b10c6155fce`; tracked-manifest SHA-256 `beb9c883b94029dbe1cde7a5e4607a3492f49f046d9c5d644cb556bfc0bb9ad4`.

| Pack file | Bytes | SHA-256 |
|---|---:|---|
| pack-a918797a9aad9b9b6d9d780078dee3e477f4b62d.idx | 1156 | a7c1307afa4d02434d6b40a421516bdc2a8219d45bb1b411080cb23bdbc93f2a |
| pack-a918797a9aad9b9b6d9d780078dee3e477f4b62d.pack | 333 | e8b387c3c377649d03f52fd3bc621bb493e27c12d34786fdf2e23096433d9bc7 |

This positively demonstrates that rejecting object-store `.rev` files is compatible with the documented fresh transport-clone workflow in this environment.

## Source/probe hashes

Command:

```sh
rtk proxy shasum -a 256 evidence/N6-release/audit-source.mjs docs/delivery.md /tmp/cadre-archive-verifier-GSeL7e/probe.mjs
```

```text
68312168a99d8993d36d6fc8e17587342ecfafa54797f42c22e365a906267a59  evidence/N6-release/audit-source.mjs
fc1893f99810146a3d4684fa6c787067be33c7b8c49f0018060cf2982e6c569a  docs/delivery.md
553f3ae6e4afe7e09a5d56e6d643c14f63ae5de98a53fa7dcbc0793ec63470fe  /tmp/cadre-archive-verifier-GSeL7e/probe.mjs
```

## Limitations and required next release evidence

No new concrete defect was found in this bounded review. The previously reproduced full-tab-path, unknown object-store-file and orphan reverse-index gaps are repaired on the specified auditor snapshot.

The original limitations remain: selected literal patterns are not universal secret detection; this auditor is for controlled fresh clones, not an adversarial-repository sandbox; not every possible Git configuration/container case was independently tested. The temporary fixtures remain outside the deliverable and are not source-package inputs.

Actual final ZIP inventory/symlink/traversal checks, extraction into a new directory, expected source/history verification and post-extraction install/test/type/lint/build/mock browser checks are still separate required evidence. No final ZIP was supplied to or examined by this verifier. This report does not authorize submission or claim the package was distributed.

