# N4 repaired UI — sandbox regression

Date: 2026-09-09 UTC. Snapshot before documentation-only follow-ups: product code unchanged through current HEAD.

Commands/results executed in the dedicated Cloud Sandbox workspace:

- `npm run lint` — PASS.
- strict typecheck through project verification — PASS.
- `npm test` through project verification — PASS, 11 files / 245 tests.
- production build through project verification — PASS.
- first `npm run test:e2e` — infrastructure FAIL before browser execution because the Playwright-pinned Chromium executable was absent.
- `npm exec -- playwright install chromium --only-shell` — installed the locked browser shell.
- second `npm run test:e2e` — PASS, 48/48 browser cases.

The infrastructure failure is retained rather than rewritten as a product failure or hidden. The successful rerun includes the repaired readability cases at 320x568 and 360x640 with text-spacing overrides plus hydration, keyboard, retry, state, and mobile/desktop coverage.

Independent review is separate: `evidence/N4-ui/granite-ui-critic.md` records IBM Granite 3.3 2B PASS for the reproduced small-screen/readability defect boundary. Screen-reader, physical-device, and actual browser-zoom checks remain explicitly unverified.
