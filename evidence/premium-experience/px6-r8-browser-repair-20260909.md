# PX6 revision 8 browser-verifier repair — 2026-09-09

Source snapshot: `fc1e99f`.

Revision 7's detached clean verifier passed Git integrity, locked install, typecheck, lint, 301/301 Vitest, and production build, then Playwright finished 61/68 with seven retained failures. This repair is limited to those failure classes.

## Repair mapping

1. **Text-spacing geometry at 320/360px (4 failures).** PX6's floating chat override had replaced the baseline started-conversation `min-height:240px` with `min-height:0`, allowing the conversation region to collapse when user text-spacing overrides expanded the recovery/composer area. Revision 8 restores the 240px minimum after a conversation starts. At `<=430px` the fixed sheet can scroll vertically with `overscroll-behavior:contain`, so expanded recovery/privacy content remains reachable instead of being clipped by `overflow:hidden`. The readability assertion still requires a >=240px conversation region and >=144px readable transcript; the privacy-bound check now occurs after `scrollIntoViewIfNeeded`, matching the scrollable-sheet architecture rather than requiring all expanded content to fit simultaneously inside one viewport.
2. **Mobile composer font size (1 failure).** The premium override had reduced the base mobile textarea from 16px to 15px. Revision 8 restores 16px at `<=760px`, retaining the anti-zoom/readability contract.
3. **Two mobile 429 failures caused by E2E bucket contamination.** Production code is unchanged. The local Playwright server already exercises the real process-local limiter; revision 8 configures that local test ingress to trust `x-real-ip` and assigns RFC 5737 documentation-only client IPs separately to desktop and mobile projects. Synthetic client headers are emitted only when `E2E_BASE_URL` is absent, so public/external Playwright runs never send them. Production continues to ignore proxy headers unless its real ingress explicitly opts in.

No factual authority, persona policy, provider selection, routing, API error semantics, or production rate-limit defaults were changed.

Next action: independent source critic of the revision-8 repair, then focused reproduction/full clean verifier only if the critic passes. No revision-8 runtime PASS is claimed by this artifact.
