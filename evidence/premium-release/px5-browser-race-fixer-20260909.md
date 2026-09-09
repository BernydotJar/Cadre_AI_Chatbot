# PX5 fixer — synthetic panel-frame race

Date: 2026-09-09 UTC.

The first detached clean-worktree verification failed after Git integrity, install, typecheck, lint, 286/286 Vitest, production build, extension build, and 72/72 extension tests had passed. The failing synthetic browser assertion searched `page.frames()` immediately after the launcher host grew, which did not guarantee that the newly inserted iframe had completed navigation from `about:blank` to the local mocked panel URL.

## Repair

`extension/tests/browser-mock.mjs` now waits up to three seconds for `framenavigated` to the exact `https://preview.extension.test/panel.html` URL, with the same bounded current-frame fallback already used later in the test for mobile reopen. No product code, permissions, endpoint, context policy, assertion, or timeout around the actual chatbot transport changed.

## Focused verification

- extension build: PASS
- extension Vitest/security/build: 72/72 PASS
- synthetic run `px5-race-fix-a-20260909`: 24/24 PASS, zero real site/API requests
- synthetic run `px5-race-fix-b-20260909`: 24/24 PASS, zero real site/API requests
- `git diff --check`: PASS

A fresh detached clean-worktree verification remains required after this repair is committed. The failed verifier report is retained and not converted into passing evidence.
