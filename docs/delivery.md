# Source delivery and review

The delivery is the public PX6 revision-12 web app plus a lightweight source ZIP with usable Git history. Runtime source `8043886` is deployed and publicly verified at `https://cadre-ai-chatbot-tawny.vercel.app`; deployment `dpl_FGqGheG1GSx8EmUEJvd4rhEsdKYh`. The optional Chrome Integration Preview is DONE in its separate graph and generated `extension/dist` remains excluded; the optional n8n handoff contract is tracked source but is not evidence of real email delivery. The final ZIP may include a later **documentation/evidence-only** closure commit after `8043886`; that does not create a new runtime release as long as no application/runtime file changed, and the package must record `8043886` as the deployed runtime source. Preparation does not authorize external upload/submission or Web Store publication.

## Package contents and exclusions

Include tracked application source, lockfile, `CLAUDE.md`, `plan.md`, tests, specifications, component inventory, sanitized reports and the real `.git` history. Include `.env.example` placeholders only. Exclude `.env.local`, `.codex`, `.vercel`, private documents, unrelated WIP, dependencies, generated output and caches. Do not copy the working directory wholesale.

Prepare from an explicit full commit SHA using new `mktemp -d` staging/extraction directories and a fresh local Git transport clone with `--no-local --single-branch --no-tags`. Use an empty template directory so global/local hook templates are not inherited, and `-c pack.writeReverseIndex=false` for this clone only: optional reverse-index files are unnecessary for delivery and the bounded validator deliberately rejects them. Unlike copying `.git`, this transfers the selected branch history without copying the original reflogs, hooks, credentials or unreachable objects. Inspect copied refs and every historical tree path, not just one name per blob. Scan every physical object, including commit/tag messages, plus Git metadata for credential patterns; compare physical objects to the expected reachable closure. Reject unexpected refs/objects, symlinks, alternates, shallow/promisor dependencies and custom hooks. In the staging clone, set the remote to the ordinary HTTPS project URL, without credentials. Never rewrite the original repository's history for packaging.

Reproducible preparation sequence (replace absolute paths and the snapshot with verified values):

```sh
git -c pack.writeReverseIndex=false clone --no-local --single-branch --no-tags --branch main --template=/private/tmp/empty-template /absolute/path/to/source /private/tmp/staging/cadre-ai-chatbot
git -C /private/tmp/staging/cadre-ai-chatbot checkout --detach VERIFIED_COMMIT
git -C /private/tmp/staging/cadre-ai-chatbot remote set-url origin https://github.com/BernydotJar/Cadre_AI_Chatbot.git
cd /private/tmp/staging
zip -X -q -r /absolute/path/to/Cadre-AI-chatbot-source.zip cadre-ai-chatbot
unzip -q /absolute/path/to/Cadre-AI-chatbot-source.zip -d /private/tmp/clean-verification
```

Refuse an existing output ZIP before running `zip`: updating an old archive can preserve stale excluded entries. The archive is reproducible from a named source snapshot; ZIP byte identity across separate clones is not promised because Git metadata/file times can differ. Record the actual SHA-256 and bytes of the supplied file. Pattern scanning is not universal secret detection. Capture any matched content in memory only and report sanitized rule/path/object IDs, never secret values.

## Verify the delivered artifact, not the working tree

Before extraction, run `unzip -t` and reject unsafe/absolute/traversal or symlink entries. In the new extraction: inspect Git status/history and metadata, run `git fsck --full --strict`, confirm the expected snapshot, install locked dependencies with `npm ci`, run tests/typecheck/lint/build in explicit mock mode, and smoke the production server including a cold first interaction. Unset any inherited `E2E_BASE_URL` so mock verification cannot call the public provider. Keep the server on a confirmed unused port and stop only the verifier-owned process afterward. Logs remain outside the extraction. Install/build artifacts are created after extraction; never add them back to the ZIP.

Normal app setup does not need the Graph Harness runtime. To replay graph commands, use the pinned external runtime described in `docs/engineering-workflow.md`; it is not a deployed dependency and is intentionally not copied into this package. Every recorded evidence file must match its ledger hash.

## Deliberate limitations

Six-topic, keyword-based retrieval and extractive fact ordering favor traceability over broad conversational flexibility. The chatbot cannot use client accounts, book calls or score assessments. There is no server chat database, but external services may process or retain submitted data. Rate limiting and application budget reservations are process-local. The temporary live allowance stops no later than `2026-09-15T00:00:00Z`; continued live operation requires separately authorized credentials and configuration.

Browser evidence covers Chromium desktop/mobile viewports and keyboard interactions, not a full accessibility audit or physical-device coverage. The mobile topic area scrolls internally. Pricing, certifications and deployment-specific security guarantees are intentionally not inferred from marketing material.

Current package result, exact snapshot and checksum belong in `evidence/N6-release/` and the resumable checkpoint. A prepared archive is not evidence that it was submitted.
