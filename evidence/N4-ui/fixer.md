# N4 UI fixer handoff

Date: 2026-09-08. Fixer work follows the preserved independent FAIL report in `evidence/N4-ui/critic.md`. This report records implementation and local checks, not independent browser approval.

Only `src/ui/support-chat.tsx` and this report were edited for the fixer assignment. The original producer and critic reports remain intact.

## Changes against the three confirmed findings

1. **P1: Stop initiated an unintended second request.** `stopResponse` now prevents the click's default browser action before aborting. The pending Stop button and idle Send button also have distinct React keys, so React cannot reuse a focused/activated button DOM node while changing its type from button to submit. The existing synchronous operation lock, abort and operation-identity guard remain.
2. **P2: Welcome content initially/reset scrolled past its heading.** The transcript effect explicitly sets `scrollTop = 0` when there are no messages. Follow-latest behavior only applies to a real conversation.
3. **P2: Topic/Retry keyboard activation lost focus.** Request activation hands focus to the stable composer before transient Topic, Retry or Send controls disappear. Stop likewise hands focus to the composer before its button disappears. Focus uses `preventScroll: true`; there is no initial-page autofocus and no focus movement when an asynchronous answer arrives.

## Actual fixer checks

- `rtk proxy npm run typecheck`: passed, exit 0.
- `rtk proxy npm run lint`: passed, exit 0.
- `rtk proxy npm test -- tests/ui/conversation.test.ts`: 1 file, 15 tests passed, exit 0. The pre-existing non-failing Vite native-config-loader warning remains.

No build, server restart, browser test, live inference, environment edit, dependency installation, Git operation, graph mutation or deployment was performed by the fixer. The coordinator owns rebuild and regression coverage. Independent browser re-verification must confirm exactly one request after Stop, zero late assistant replies, retained retry/text, top-aligned initial/reset welcome and stable keyboard focus on desktop and mobile.

Post-fix source SHA-256:

```text
2706a116f8a9e3ce3a38e1beaecdc42ad0e775c9774ccd79809da932ae45b66f  src/ui/support-chat.tsx
```
