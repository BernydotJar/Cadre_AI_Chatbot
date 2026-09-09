# Archive scan fixture false-positive — fixer and verification

Date: 2026-09-09 UTC.

## Reproduced package-audit failure

The first candidate-package attempt failed before audit because this Cloud Sandbox image does not contain the historical `rtk` wrapper used by `audit-source.mjs`. A temporary compatibility shim was created outside the repository that supports only the expected `rtk proxy <command>` passthrough; the auditor itself was not changed for that environment issue.

With the shim, the fresh transport clone was audited and returned eight `credential-url` findings. All four flagged historical blob IDs mapped to only these tracked extension negative-test/evidence paths:

- `extension/tests/contracts.test.ts`
- `extension/evidence/lifecycle-red-tests.json`
- `extension/evidence/lifecycle-green-tests.json`
- `extension/evidence/lifecycle-final-tests.json`

The source test intentionally rejects the inert hostile-URL fixture `https://user:pass@cadre.ai/`; retained test-result JSON repeats the same literal. No other historical target was implicated.

## Fix

`audit-source.mjs` now removes only that exact inert test literal before running the unchanged credential-URL pattern. Bearer, OpenRouter/provider-token, private-key, Git-history, object-closure, forbidden-path, symlink/hook, and Git-config checks are unchanged. The original repository history was not rewritten.

## Verification

1. Re-ran the repaired auditor against the same fresh transport clone at `fd6be77eee11bc0995f49e9d07bc72f85c07da4f`: **PASS**, 35 commits, 537 physical/reachable objects, 240 historical paths, zero findings.
2. Created a temporary copy outside the repository and added a different synthetic userinfo URL. The auditor exited 1 and retained the `credential-url` finding (plus the expected dirty-clone finding). The general credential-URL rule therefore remains active.
3. IBM Granite 3.3 2B independent verifier, local Ollama 0.33.3, thinking disabled: **PASS**. Raw request/response are `granite-archive-fixture-verifier-{request,response}.json`.

An earlier Granite critic response is also retained as `granite-archive-fixture-critic-{request,response}.json`; its first line requested changes while its body stated the fix was bounded and did not weaken other checks. That internally inconsistent result is preserved and rejected rather than relabeled.

This closes only the synthetic-fixture false positive. A complete candidate ZIP still requires archive creation, entry safety checks, clean extraction, Git/fsck, locked install, lint/typecheck/unit/build/browser verification, size and checksum.
