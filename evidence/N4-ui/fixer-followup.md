# N4 follow-up repairs — coordinator

Date: 2026-09-08 local / 2026-09-09 UTC. Source base: `df915d2`; documentation snapshot: `6628992`. This is a fixer record, not independent verification.

## Reproduced and repaired

1. The independent verifier found that keyboard activation of **Jump to latest** removed the focused button and left focus on BODY. `jumpToLatest` now focuses the composer with `preventScroll` before hiding that control. The E2E regression uses keyboard Enter and checks the composer focus.
2. The coordinator reproduced a stale Jump control after a long answer followed by New conversation: one Jump button remained on the welcome screen at transcript scrollTop 0. Empty-state scroll events now preserve following-latest state, and the control renders only after a conversation has started. The welcome/reset regression checks its absence.

The prior Stop double-submit, clipped welcome, and topic/Retry keyboard fixes remain unchanged. Earlier FAIL reports are retained, not relabeled.

## Verification chronology and infrastructure

- `npm run verify -- n4-focus-final`: 218 tests, typecheck, lint and production build PASS; retained runner output under `evidence/runs/n4-focus-final/`.
- The subsequent full 38-case Playwright run did not reach app assertions: Chromium startup failed with `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)` after the execution sandbox changed. This is an infrastructure failure, not evidence of 38 app defects or a passing suite. Stats: start `2026-09-09T03:30:20.525Z`, duration 18,353.678 ms, expected 0, unexpected 38.
- During independent follow-up, typecheck encountered four generated `.next/types/* 2.ts` duplicate files. SHA-256 comparisons showed each was identical to its corresponding original. The coordinator moved only those four generated copies into `/tmp/cadre-generated-duplicates-32d6pI/` for recovery; no application source was removed. Their creation cause is not established.
- A separate verifier is rerunning runtime regressions and types. See its new follow-up report for independently observed results; do not infer them from this fixer note.
