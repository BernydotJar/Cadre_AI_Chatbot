# N1-foundation — critic/red-team review and resolution

**Provenance:** review produced by a separate-context AI agent (same model family as the implementer, spawned with an adversarial reviewer prompt and no shared conversation state). This is a distinct-context machine review, not a human review and not an organizationally independent verification. The implementer (this repository's engineering agent) triaged and fixed the findings; resolution verification = full local suite rerun (see sibling evidence files).

## Findings and resolution

| # | Severity | Finding | Resolution |
|---|----------|---------|------------|
| 1 | HIGH | `/api/chat` buffered and JSON-parsed unbounded bodies before any limit applied | FIXED — `LIMITS.maxBodyBytes` (256 KB) enforced before parsing: fast-path Content-Length check plus post-read length check; 413 response. Covered by unit tests and a live 300 KB curl check (HTTP 413 in `server-smoke.txt`). |
| 2 | MEDIUM | `vitest.config.mts` on disk vs `vitest.config.ts` in the frozen graph baseline `allowed_paths` | FIXED — renamed back to `vitest.config.ts`; disk now matches the frozen baseline and the adapter source. (Cosmetic Vite CJS-config deprecation warning accepted.) |
| 3 | MEDIUM | `npm run test:e2e` with no Playwright config collected the Vitest suites and crashed confusingly | FIXED — script now pins `--config=playwright.config.ts`, failing fast and honestly until N4 adds that config. |
| 4 | LOW | `vitest.config.mts` was outside `tsc --noEmit` coverage | FIXED by the same rename (`**/*.ts` now matches). |
| 5 | LOW | `generate.mjs` comment overstated the freeze ("can never be rewritten") | FIXED — comment reworded to what the code enforces; added refusal to overwrite an existing project file without `--force`. |
| 6 | LOW | `next-env.d.ts` not gitignored | FIXED — added to `.gitignore`. |

## Residual risks (acknowledged, not silently absorbed)

- Route-handler tests were missing → ADDED (`tests/api/chat-route.test.ts`: echo shape, 400 JSON/schema paths, 413 both with and without Content-Length, health headers). Suite now 20 tests.
- Frozen `allowed_paths` omit `package.json` for N2–N5: acceptable because all approved dependencies were installed in N1 and later nodes need no new ones; any future dependency change goes through the documented lifecycle (human gate for new dependencies applies anyway).
- `feature_list.json` uses `in_progress` while the graph uses `running`: `feature_list.json` is a projection with its own legacy vocabulary; the ledger is the status owner.
- `historyWindow`, `maxReplyChars`, `requestTimeoutMs` are wired in N3; their comments now say so explicitly.
- Character limits count UTF-16 code units, not bytes; noted in `limits.ts` for N3 cost estimation.

## Verification after fixes

`npm run typecheck` (exit 0), `npm run lint` (exit 0, no warnings), `npm test` (3 files, 20/20), `npm run build` (exit 0), production server smoke on 127.0.0.1:3100 (health 200; valid 200; invalid JSON 400; empty 400; oversized field 400; 300 KB body 413; page 200).
