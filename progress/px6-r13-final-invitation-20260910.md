# PX6 revision 13 — final invitation polish

Owner-authorized: 2026-09-10.

## Goal

Make Donna visibly invite interaction before the first turn without expanding factual, model, network, or action authority. The existing `signal-orb` and configured `ExperienceProfile.quickPrompts` are the only inputs to this change.

## Acceptance boundary

1. The pre-chat nudge visibly includes Donna's existing profile-driven avatar. Cadre therefore shows the existing `signal-orb`; reusable non-orb profiles continue through the same `PersonaAvatar` component.
2. While chat is closed, the invitation advances through the already-validated `experience.quickPrompts` on a bounded cadence for at most one pass, then stops. The launcher surfaces the current prompt label and the nudge surfaces the current label/message. No model call, API request, page read, personalization, or new factual claim may be used to choose copy.
3. Clicking the current nudge action sends exactly the configured prompt message through the existing `send()` path. It must not construct or mutate a prompt from DOM text.
4. Rotation pauses while the invitation stack has pointer hover or keyboard focus. `prefers-reduced-motion: reduce` keeps the first prompt static. No third CSS motion effect is added: the existing orb state machine and launcher glare remain the only PX6 animation effects.
5. The reviewed proof highlight remains visible in the nudge as verified context, but it is not interleaved with or rewritten into the question.
6. The existing <=430px icon-only launcher contract, static accessible name, hydration guard, keyboard behavior, rate limit, provider boundary, safe links, conversation state, retry/Stop behavior, and public-scope/privacy copy remain unchanged.
7. Add deterministic browser regression coverage for orb-in-nudge, prompt rotation, no pre-click chat traffic, exact configured-prompt submission, pause-on-interaction, and reduced-motion static behavior. Do not run the product test matrix until Producer assembly and independent source critique are complete.
8. r12 public evidence remains historical only. r13 requires fresh design-review, detached verification, exact-SHA CI, existing-project deployment, public markers, rate-aware full public browser equivalence, and a rebuilt clean-room source ZIP before final handoff.

## Challenge alignment

The supplied delivery brief is represented inside the repository by `docs/delivery-requirements-recheck.md`: plan before implementation, a public working chatbot URL, deliberate architecture, observable Claude Code workflow/context management, independent critique/verification, small authentic commits, inspected test output, explicit scope decisions, CI/CD maturity, a lightweight source archive with usable Git history, and clear communication/reasoning. This r13 remains intentionally small so the final handoff strengthens those criteria rather than broadening the product.
