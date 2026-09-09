# Owner commit plan — 2026-09-09

The 2026-09-09 product-polish changes are intentionally left uncommitted. The current sandbox Git identity is an automated technical identity and must not be changed or used to impersonate the owner. The owner should review each diff and create the commits under the owner's real Git identity/email.

The sequence below keeps behavior changes reviewable and preserves the requested small-commit cadence without rewriting earlier history.

## 1. `fix: make first-turn guidance useful and grounded`

Review/stage:

- `src/core/policy.ts`
- `src/config/cadre.ts`
- `src/ui/conversation.ts`
- `tests/core/policy.test.ts`
- `tests/api/chat-route.test.ts`
- `tests/ui/conversation.test.ts`
- `docs/research/**`
- `evidence/N2-knowledge-routing/**20260909*`

Intent: exact greeting welcome, safety precedence, typed source refresh, regressions. Expected focused proof: 146 tests PASS + Granite policy verdict PASS.

## 2. `feat: polish the Cadre assistant experience`

Review/stage:

- `app/icon.svg`
- `app/globals.css`
- `src/ui/support-chat.tsx`
- `e2e/chat.spec.ts`
- `docs/product-polish-20260909.md`
- `evidence/N4-ui/*20260909*`

Intent: authored icon, original Cadre Signal visual system, first-impression/browser regressions. Expected final core proof: lint/typecheck/build PASS, 256 tests PASS, 50 Playwright PASS, Granite product verdict PASS.

## 3. `feat: complete the Chrome integration preview`

Review/stage:

- `extension/src/**`
- `extension/icons/**`
- `extension/build.mjs`
- `extension/tests/**`
- `extension/README.md`
- `extension/evidence/**20260909*/`
- `progress/extension-graph.events.jsonl`

Intent: polished MV3 launcher/panel, generated icons, installed-site verifier, actual-site proof. Expected proof: 71 extension tests PASS, 22 synthetic browser checks PASS, 15 installed-site checks PASS with exactly one fixed API request.

Do not stage `extension/dist/`; it is generated and remains excluded from the source submission.

## 4. `docs: close polish evidence and release handoff`

Review/stage:

- `CLAUDE.md`
- `README.md`
- `plan.md
- `progress/checkpoint.md`
- `progress/polish-authorization-2026-09-09.md`
- `progress/commit-plan-2026-09-09.md`
- `graph-harness.events.jsonl`
- `evidence/N6-release/public-drift-after-polish-20260909.md`

Intent: persist Graph Harness closure for N2/N4/G9, exact current blocker, resume path, and provenance rule.

## Before every owner commit

- `git diff --cached --check`
- inspect `git diff --cached`
- verify no `.env*`, `.vercel`, `.codex`, secrets, generated `extension/dist`, `node_modules`, `.next`, or private input files are staged
- confirm `git config user.name` and `git config user.email` are the owner's real intended identity; do not guess or synthesize an email

After all four commits, rerun the full verification before any deployment. Do not rebase/amend prior commits merely to hide their original actor metadata.
