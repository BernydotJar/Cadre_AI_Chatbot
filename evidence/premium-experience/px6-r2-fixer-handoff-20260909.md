# PX6 revision-2 fixer handoff — 2026-09-09

Scope: source/test repair only. No product test, browser, provider, build, deploy, or public verification command was executed in this fixer phase.

## Repairs retained forward

- `13f3ef3` raises the new nudge/close/reset interaction targets to the 44 CSS px floor, raises launcher helper copy to 12px, makes the Outcomes navigation anchor generic and conditional on configured outcomes, and adds direct bare-`pricing` coverage.
- `b570a7d` adds an explicit 320/360px chat-header geometry assertion so the larger accessible controls cannot silently overlap the assistant identity or collapse the Donna title below a readable width.
- The generic shell remains profile-driven: client facts/public highlights stay in `ClientConfig`, Donna behavior/tone stays in `PersonaProfile`, and visible copy/prompt/avatar configuration stays in `ExperienceProfile`.
- The original Claude critic failures remain preserved under `evidence/premium-critic/`; this handoff does not convert unexecuted checks into PASS.

## Next lifecycle step

Run one final read-only independent source critique. If no concrete source blocker remains, transition PX6 to review and execute the complete final verification matrix exactly once on a committed clean snapshot.
