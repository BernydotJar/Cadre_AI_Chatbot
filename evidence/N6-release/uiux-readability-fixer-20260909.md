# UI readability repair — fixer handoff

Status: **IMPLEMENTED; INDEPENDENT VERIFICATION PENDING**.

This is the `uiux_standards_critic` agent acting in its subsequently assigned **Fixer** role. The original critique remains immutable; this agent's own repair checks are not independent verification. Scope is UX-F1/F3 only. The coordinator owns the CLAUDE.md/plan.md contract, Git, graph events, and release decisions.

## Changes

- `app/globals.css`: remove the fixed overall card-height ceiling, keep a responsive non-shrinking transcript area with a 240 px minimum, and let the card/document grow when error text, restored multiline drafts or user text spacing need more room. Transcript scrolling remains bounded; existing reading-position and Jump to latest behavior is unchanged.
- Raise important mode, helper, privacy, boundary, validation, recovery, history and message-author text to at least 12 px. Keep the mobile composer at 16 px. Composer metadata can wrap. This is the owner's adopted readability design target, not a claim that WCAG mandates a minimum font size.
- `e2e/readability.spec.ts`: six new executions across desktop/mobile projects. Two short viewport cases use WCAG text-spacing properties plus synthetic 503 responses and restored multiline drafts; they assert at least 240 px conversation space, at least 144 px usable transcript area, no composer overlap, privacy inside the card, no horizontal overflow, and full visibility of the turn/retry/privacy after document scrolling. A typography case checks consequential text at 12 px and the mobile composer at 16 px.

No business facts, routes, topics, response handling, provider settings or secrets were edited. `src/ui/support-chat.tsx` is unchanged. No dependency, deployment, Git or graph changes were made by this fixer.

## Verification actually performed

| Check | Result |
|---|---|
| New readability tests against the pre-repair production build | Expected RED: 6/6 failed; short conversation space was 0/1 px and mode text was 10 px. |
| `rtk proxy npm run build` after CSS repair | PASS, exit 0. Initial sandbox `.next/trace` EPERM was resolved with scoped project write permission before the successful run. |
| `rtk proxy npm run typecheck` | PASS, exit 0. |
| `rtk proxy npm exec -- eslint e2e/readability.spec.ts src/ui/support-chat.tsx` | PASS, exit 0. |
| Full `rtk proxy npm run lint` | FAIL outside this repair: current parallel evaluator WIP `tools/evaluation/load-ts.mjs:14`, `@next/next/no-assign-module-variable`. Coordinator notified; this fixer did not edit the evaluator. Same finding remained on the final retry. |
| First full mock browser suite | PASS: 48/48, zero skipped/flaky/unexpected. |
| Final full mock suite after tightening the new visibility assertions to ratio 1 | PASS: **48/48**, 13.101 s, start 2026-09-09T04:59:13.066Z. This includes all pre-existing 42 cases and the six new executions. |
| `rtk proxy git diff --check -- app/globals.css e2e/readability.spec.ts` | PASS. |
| Separate local visual inspection | Reviewed repaired 360×800 and 1280×900 defaults plus 320×568 text-spaced failed state. The short failure now retains 240 px transcript space; the card grows to 928.5 px and privacy remains inside it. Scroll the document to reach content rather than hiding it. |
| Owned server/browser cleanup | Browsers closed; temporary server PID 18303 terminated. Managed test servers exited; final `lsof` found no listener on 3100. |

All routine tests used the managed localhost **mock** provider and/or intercepted synthetic chat responses. The separate local visual probe made one intercepted synthetic 503 call. **No external model requests and no paid inference** were performed by this fixer. Public deployment remains unchanged by this work. A denied first standalone localhost server launch and consequent connection-refused visual attempt were infrastructure failures, then retried with scoped approval; the successful captures used only localhost.

The full-page failure screenshot shows the fixed skip-link within the document capture after automatic scrolling; that capture is not a separate focus-state test. Use the measured viewport geometry and passing non-overlap/full-visibility assertions for the reported layout result, and retain independent keyboard verification.

## Handoff hashes and retained raw evidence

| Artifact | SHA-256 |
|---|---|
| app/globals.css | f7b5159eff097cbfb692e8098b486cb5c7bc76d407383f3275dc4f105122c4f4 |
| e2e/readability.spec.ts | 0e907be819577701998e35018db5b33d3823b9d5459833951715a259ee5170b7 |
| src/ui/support-chat.tsx (unchanged) | 3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051 |
| evidence/N6-release/uiux-standards-critic.md (unchanged) | 1a22a8f75875c352bd93962fc85e40c7fb01422bca6153865b1e3a995ee39ad1 |
| /tmp/cadre-uiux-critic-jaezVD/readability-red.json | 68a2af022a7edb17f7ac6b4da923b97cb32b8f5e744a8b08a94f0ebb7b25193a |
| /tmp/cadre-uiux-critic-jaezVD/readability-final.json | 1974ced203bd9a1ff07e737d5b4ca40d3bf5d5771b342c37a72a9f81c0250915 |
| /tmp/cadre-uiux-critic-jaezVD/fixer-visual.json | a39b6d218c988f779db9dd765dc864f3cb81c6e5576437f259140254a5427ed0 |

The coordinator may retain sanitized raw JSON and selected PNGs with the release evidence. The temporary directory also contains the visual probe script and `fixed-360-default.png`, `fixed-1280-default.png`, `fixed-320-spacing-failure.png`.

Next: a different agent independently reviews and verifies the repaired source/build, the coordinator resolves the unrelated evaluator lint finding, and the adopted UX contract is linked to actual evidence. Physical-device keyboards, real screen-reader behavior, 200%/400% browser zoom and full accessibility conformance remain unverified. This handoff does not close the release gate or claim production deployment.
