# N4 final scoped source review

Date: 2026-09-08. Independent critic review of the final localized Jump fixes.

**PASS for this source/test review: no remaining actionable defect found in the examined change.** This phase did not rerun the browser or build. Final runtime confirmation belongs to the separate independent verifier and must be attached before the coordinator treats the N4 gate as complete. This is not a deployment, live-provider, accessibility-conformance or release approval.

The original FAIL reports `critic.md` and `critic-followup.md` are preserved. The former records the initial three defects; the latter records their independently observed resolution and the subsequently reproduced Jump focus defect. This report does not replace either history.

## Latest source changes assessed

Compared with the `2706a116...` snapshot reviewed in `critic-followup.md`, the current `src/ui/support-chat.tsx` implements the additional focused changes requested by the coordinator:

1. `jumpToLatest` focuses the stable composer with `preventScroll: true` before changing `awayFromLatest` and removing the Jump button. The requested scroll-to-bottom remains explicit. This addresses the previously reproduced `BODY` focus loss at the time of user activation, without introducing asynchronous response-arrival autofocus.
2. The transcript `onScroll` handler returns early when no conversation has started, restoring follow-latest state and clearing the away indicator. Empty welcome content can overflow without being mistaken for an earlier part of a chat.
3. The Jump button requires both `started` and `awayFromLatest` to render. This also prevents a delayed/reset scroll-state update from exposing a conversation-only control on the welcome screen.

The earlier fixes remain present: empty welcome state scrolls to zero; Stop prevents default activation and uses a distinct React key from Send; transient request controls hand focus to the composer; operation identity and cancellation checks remain. The helper, server-page, layout and CSS hashes are unchanged from the prior reviewed snapshot, so the current localized change does not alter response validation, approved-link handling, history bounds, provider configuration labels or layout.

No new dependency, data contract, persistence mechanism, credential flow or provider request was introduced by the examined change.

## Tests inspected, not executed in this phase

The current `e2e/chat.spec.ts` contains targeted assertions matching the defects:

- The reading-position scenario first confirms that a new answer does not move the user from older messages, then activates Jump with keyboard Enter, expects composer focus, expects the button to disappear, and checks that the transcript reached the latest content.
- The welcome/reset scenario checks initial and reset `scrollTop = 0`, confirms the heading is inside the transcript boundary, confirms composer focus after reset, and requires no Jump button afterward.
- Existing keyboard topic/retry, Stop, late-response/new-conversation and client-deadline cases remain in the inspected test file. These cover the neighboring behavior the localized fixes must preserve.

These are concrete regression assertions in source, not claimed passing runs by this critic. The independent verifier is responsible for executing the final browser checks against the matching build. The earlier actual critic execution—15 helper tests and the original/follow-up browser probes—is documented in the preserved reports and is not reattributed to this final phase.

## Execution and scope

This phase used `rtk proxy cat`, `rtk proxy sed`, `rtk proxy rg` and `rtk proxy shasum` for read-only inspection of the prior report, changed source and tests. Only this new report was written with `apply_patch`. Tool execution succeeded; there was no credit-related interruption to this review.

No browser launch, server lifecycle action, build, Git/ledger operation, source edit, environment file or secret access, external inference, dependency installation or deployment occurred in this final phase.

## SHA-256 snapshot

```text
a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f  src/ui/support-chat.tsx
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
f246be240304c2e772f1c2d76594ec84535e9b6b563edded3047d88d4fbd6aba  tests/ui/conversation.test.ts
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
f2f5650f9a6a8d72547c066b7ddbcbb5453137b071ed9649edd4f5da40b966b0  evidence/N4-ui/critic.md
4cd084c56e7fade60fcdd89f8d33e1fb923daab371d1b7f9b755d5e25bf33225  evidence/N4-ui/critic-followup.md
```
