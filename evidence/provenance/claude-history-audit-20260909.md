# Claude Code provenance and engineering-history audit — 2026-09-09

- Runtime: Claude Code 2.1.266, authenticated first-party session.
- Mode: project-scoped `release-auditor`, high-effort read-only audit.
- Scope excludes Claude transcript/history directories, interview material, secrets, writes, deployment, and Graph mutation.

## Raw auditor output

## 1. PROVENANCE VERDICT: **NEEDS_CORRECTION**

The Git lineage itself is authentic and unbroken (no rewrite/orphan evidence). The correction needed is documentation drift: `CLAUDE.md` and `plan.md` state the remote `main` "reached `76e2b756...`" — that was true at the moment a prior review recorded it, but it is no longer the current state. Live `git ls-remote origin main` (network-reachable, executed now) returns `b12ce563ccd680b27b4d707bcde5520f4f65dbe5` ("ci: gate premium production delivery"), one commit past `76e2b756`. Local HEAD (`d6516e0`) is a further 6 commits ahead of that and unpushed (`git status`: "ahead of 'origin/main' by 6 commits"). No secrets, no history rewriting, no unrelated/fabricated origin.

## 2. SNAPSHOT RELATIONSHIP (exact hashes)

- `/workspace` HEAD: `d6516e0323d1ed6c0012095872d3d956b7e94090` (82 commits total).
- `/shared-auth/.../original-repo` HEAD: `76e2b756acf04762627210457e36e800de682b02` (75 commits), whose own `origin` remote is a local path (`.../Desktop/Cadre AI`) — i.e., it is a clone of the same lineage, not an independent project.
- `git merge-base` of the two HEADs = `76e2b756...` itself, and `git merge-base --is-ancestor 76e2b756 HEAD` succeeds. A line-by-line hash comparison of `git log` for both repos up to `76e2b756` is **identical**, confirming byte-for-byte shared history, not a parallel/forked reconstruction.
- `original-git-history.txt` (599 lines) matches the same commit range and ends at `76e2b756`; `original-working-tree-status.txt` shows that repo was clean (`## main...origin/main`).
- Conclusion: the "original-repo" is a **prior snapshot/ancestor checkout** of this exact repository, not a separate origin. `/workspace` is 7 commits further along; of those, 1 (`b12ce563`) is already pushed to GitHub, the remaining 6 are local-only. **No claim of "source equals deployed" may be applied to current HEAD** — the previously verified public alias serves an older commit (`7b6004c1...`), well behind both `76e2b756` and current HEAD.

## 3. HISTORY SHAPE

- 82 commits, 2026-09-08 17:17 → 2026-09-09 18:38, no gaps/squashes detected in the ancestor chain; `git fsck`/`count-objects` show a clean, small (16M/12M) pack with only harmless dangling blobs.
- Commit granularity is small and topical (typically single-purpose `feat:`/`fix:`/`docs:`/`chore:`/`test:`/`ci:` commits, several minutes apart), consistent with an iterative producer→critic→fixer loop rather than large dumps. Representative progression: `179bf51` (Initial commit) → `bddb6fe` (feat: bounded OpenRouter fact selection) → `df915d2` (feat: responsive chat UI) → `9232593` (feat: extension preview) → `f3aeecb` (chore: add Claude review helpers) → `7158463`/`b12ce563` (ci: gated Vercel delivery) → `be746da`…`c04f652` (product-profile/persona/experience productization) → `0aec124`…`d6516e0` (premium identity/ambient-media cycle).
- Author field: 69 `Bernydotjar` + 1 `BernydotJar` (human) + 12 `ChatGPT Sandbox Agent`. Committer field: 29 `Bernydotjar`, 1 `GitHub` (the squash-merged initial commit), and **52 `ChatGPT Sandbox Agent <chatgpt-sandbox@example.invalid>`**. The transition to the sandbox-agent committer begins at `6072f1c` (2026-09-09 05:42). This is a factual, observable split — it does **not** by itself prove which underlying model wrote any diff (CLAUDE.md's own caveat, U4), and it explicitly is **not** Claude-authored/committed metadata for the majority of the later history, despite `.claude/` assets and `evidence/claude-code/*` also being present.
- One commit message (`f1aa373`) is anomalously narrative/first-person for a subject line ("The addon also passed the security review... I'm keeping the failures, fixes, and results of each agent separately.") — a documentation-quality defect, not a security issue (diff contains no secrets).

## 4. CLAUDE WORKFLOW ASSETS actually present

- `/workspace/.claude/agents/{critic,verifier,release-auditor}.md` and `/workspace/.claude/commands/{model-compare,recover,release-check,verify}.md` exist, are identical in `original-repo`, and were added in commit `f3aeecb` ("chore: add Claude review helpers"). This proves **configuration/intent** for a Claude-Code-shaped workflow, nothing more — presence of a `.md` role brief is not evidence that any given commit was produced under it.
- `CLAUDE.md` and `plan.md` exist at repo root and are internally cross-referenced (spec-first → graph execution → checkpoint).
- `evidence/claude-code/architecture-scope-critic-20260909.md` and `evidence/claude-code/release-auditor-20260909.md` are genuine, dated, first-person tool-session records (self-reported runtime: "Claude Code 2.1.266, authenticated first-party session") containing independently reproduced facts (e.g., a live `git ls-remote`, `gh run view`, `curl` health check) alongside explicit "what I did not verify" sections. These read as authentic bounded-agent outputs, not fabricated pass/fail labels — they retain FAIL/BLOCKED and self-critical findings rather than only favorable claims. They **prove that a Claude Code session ran these two specific reviews on 2026-09-09**; they do **not** prove Claude Code (vs. the ChatGPT-labeled committer) authored the surrounding feature/fix commits — those two provenance facts must be kept separate, which the repo's own files already caution.
- Evidence of an actual critic→fixer loop closing a documented gap: the critic (`architecture-scope-critic-20260909.md`) found that `progress/checkpoint.md` omitted any reference to `progress/checkpoint-premium.md`; the subsequent `release-auditor-20260909.md` confirmed the repair had **not yet** landed at HEAD `76e2b75`; commit `93613c0` (after `76e2b756`, before current HEAD) then added the missing cross-reference line to `progress/checkpoint.md`. This is a genuine, dated, verifiable fix cycle — good evidence for the "understandable iterate loop" claim, current only as of `93613c0`.

## 5. DOCUMENTATION DRIFT findings (exact references, smallest fix)

1. **`CLAUDE.md:158` and `CLAUDE.md:165`, `plan.md:3`** state "remote `main` reached `76e2b756...`". Live `git ls-remote origin main` now returns `b12ce563...` (already one commit further, itself pushed). **Fix:** update both files to cite `b12ce563` (or whatever the actual current `origin/main` tip is at time of edit) and note local HEAD is `d6516e0`, 6 commits ahead of `origin/main` and unpublished.
2. **`plan.md:3` / `CLAUDE.md:165`** describe status as of "2026-09-09" without noting the 6 further unpushed commits (`93613c0`…`d6516e0`, the ambient-media/PX3 finishing work). **Fix:** add one line noting local HEAD `d6516e0` is ahead of published `origin/main`, so premium/PX3 completion claims for those commits are local-only until pushed.
3. **`evidence/claude-code/release-auditor-20260909.md`** correctly scoped "source equals deployed" only to the *older* `7b6004c1...` alias and flagged the missing fresh delivery ZIP for `76e2b75`+ — that caveat is still true and now applies with a larger gap (current HEAD is 7 commits past `76e2b75`, 8 past the deployed `7b6004c1`). No file currently states this gap explicitly for present HEAD; **fix:** add a one-line note wherever release-readiness is asserted (e.g., `progress/checkpoint.md` terminal-state section) that no ZIP/checksum has been produced since `76e2b75`, and current HEAD is further ahead still.
4. Minor: commit `f1aa373`'s subject line is not corrected retroactively (rewriting history is not warranted for a wording issue) — flag only as a style lesson for future commits, no file change needed.

## 6. SAFE FORWARD-CURATION actions

- Update the two hash citations in `CLAUDE.md`/`plan.md` (item 1/2 above) as plain forward edits — no rewrite of history required or justified.
- Add the missing checkpoint/ZIP-currency cross-reference (item 3) as a new forward commit.
- **History rewriting is NOT justified**: no secrets found in tracked files or `.env.example`; `.git` is intact (fsck clean aside from harmless dangling blobs); author/committer metadata (including the `ChatGPT Sandbox Agent` committer) is exactly the kind of authenticity signal CLAUDE.md itself says must be preserved ("must not be cited as proof... never rewrite earlier author/committer history to conceal an automated actor"). Squashing or rewriting would destroy the only evidence trail that lets this and prior audits distinguish real progress from unresolved risk.
- Do not merge/fast-forward `main` to current HEAD as part of this audit — that is a publish action outside this read-only role.

## 7. Claims we should NOT make

- Do **not** claim current HEAD (`d6516e0`) or even `76e2b756` is "on `origin/main`" — live `ls-remote` shows `origin/main` is `b12ce563`, and 6 further commits are local-only.
- Do **not** claim "source equals deployed" for anything past `7b6004c1fa5b715b1c2775d07981ebac1eee8622` — that remains the only commit tied to actual deployment evidence (`dpl_DMA3WxfAfMgwc7kZLueKctx6kfsy`); all later commits (productization polish, premium PX2/PX3 work, CI-gate work) have no deployment evidence and must stay labeled as not deployed.
- Do **not** cite the `ChatGPT Sandbox Agent` or `Bernydotjar` commit metadata as proof that Claude (or any specific model) wrote those 52/29 commits respectively — committer/author identity is not tool provenance.
- Do **not** cite `.claude/agents/*.md` or `.claude/commands/*.md` as evidence a given commit was produced by that workflow — they prove configuration/intent only; the two dated files under `evidence/claude-code/` are the only items that constitute actual observed Claude Code execution, and only for the two specific review tasks they document.
- Do **not** repeat "GitHub CI is green on `76e2b756`" as the current CI state without re-checking — that fact is stale relative to the newer pushed commit `b12ce563`, whose own CI/CD result was not verified in this audit (this audit intentionally stayed within Git-metadata sources and did not query GitHub Actions/Vercel).
- Any model comparison (e.g., Gemini) must remain labeled **NOT RUN**, as `plan.md` already correctly states — no live evidence of such a run was found here.
