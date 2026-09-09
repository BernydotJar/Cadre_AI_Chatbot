# Extension producer handoff — 2026-09-09 UTC

Result: **producer source/build/mock checks PASS; independent security and installed-extension gates NOT RUN**. This report is a producer's observation, not a release approval or independent verifier claim.

## Authorized scope and output

The owner explicitly authorized parallel add-on source/build/mock work. Changes are confined to `extension/**`; the coordinator separately added a generated-output lint ignore and owns all Git/graph writes. No dependencies, API contracts, provider code, environment values or application server were changed here. No actual-site extension installation, Cadre network request, real inference, Git commit/push, deployment or publication was performed by this producer.

Implemented an optional, generically labeled **Integration Preview**: exact two HTTPS Cadre top-frame matches, closed-shadow launcher for style isolation, separate extension-origin iframe for conversation UI, authenticated bounded runtime ports, one fixed configured Vercel API endpoint, restrictive CSP and minimal permissions. No page-script bridge, storage/cookie/history/tabs permissions, arbitrary fetch destination or model HTML. The build reuses core limits/history/reply/link helpers and projects topic labels/exact links from the canonical Cadre config; it does not implement a second domain policy.

Seventeen source/tool/test/documentation files and eleven generated files (39,126 bytes) are listed with SHA-256 in `producer-source-manifest.json`. The manifest excludes this report and evidence self-hashes to avoid a circular provenance claim. Generated `dist/` stays ignored and is not part of the source archive.

## Actual checks on the handoff source

| Check | Command | Observed result |
|---|---|---|
| Build | `rtk proxy node extension/build.mjs` | Exit 0; eleven files; no env/provider config read |
| Unit / contract parity / sender boundary / transport / build guards | `rtk proxy npm exec -- vitest run --config extension/vitest.config.ts` | Exit 0; **67 tests, three files PASS** |
| Repository type compatibility | `rtk proxy npm exec -- tsc --noEmit --incremental false` | Exit 0 |
| Extension lint | `rtk proxy npm exec -- eslint extension` | Exit 0 |
| Synthetic browser UI | `rtk proxy node extension/tests/browser-mock.mjs` | Exit 0; **22 checks PASS**, zero actual-site/API requests |

The Vitest run warned that its `.ts` config's ESM syntax may need an ESM config form when a future Vite major changes its native loader default. It did not fail current execution. No dependency or package mode was changed to suppress it.

The browser script used a temporary Chromium instance, locally intercepted synthetic HTTPS host documents and fake runtime ports. It **did not install MV3** and **did not load Cadre's real website**. Tests covered exact activation, duplicate prevention, a closed shadow root, launcher reconnection after simulated worker idle, six topic labels, style isolation, one Enter request, text-only malicious output, exact-link handling, unchanged host form values, minimize/focus/continuity, reset/empty validation, manual retry without duplicate user bubbles, Stop without resend, close/reopen clearing, mobile containment and host-removal disposal. Screenshots visibly label the synthetic fixture. Producer inspected both generated screenshots.

Artifact SHA-256:

- `browser-mock.json`: `c608374a1fcfbafe56ef16f3b3bf833f96dea6054cb746cd96d7a2a8dbdaa8b3`
- `mock-desktop.png`: `71470017bf04a414c41be29be1dc7a10aea6efdb27c3368dc25aaff2e78f1650`
- `mock-mobile.png`: `375751044d0d0329d17d8b16a8d536b68afaced9bb342a2f4981f747d3f051ae`

## Findings and repairs during production

1. The first build attempt failed with `EPERM` creating `extension/dist`; a scoped filesystem grant resolved the tool environment restriction. This was not an app defect.
2. Initial root typecheck exposed one widened `role` string in panel message construction; the producer added an explicit literal type, then reran the nonincremental repository typecheck successfully. The original incremental command also could not write the root `.tsbuildinfo` under this agent's sandbox; nonincremental checking avoids that unrelated write.
3. Initial synthetic Chromium launch failed before any test with `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)`. A reviewed escalation launched only the temporary mock browser, after which all checks passed. This was infrastructure, not a skipped/pass assertion.
4. Review of Chrome's worker lifecycle identified a launcher-only idle disconnect risk before handoff. The producer added user-driven host re-registration, bounded active-panel runtime-only keepalive, a 30-minute panel lifetime and mock regressions. No automatic API retry was added.
5. Response handling now cancels invalid, error and declared-oversized bodies before returning a safe error; streamed successful bodies are byte-bounded.

## Unverified / required next gates

- Independent security critic must inspect the source and generated manifest, especially sender metadata, token/tab binding, teardown, response caps, no arbitrary proxy and resource exposure. Unit mocks are not proof that Chrome supplies the expected metadata in a real installed extension.
- No real installed MV3 evidence exists for CSP, web-accessible resource loading, extension iframe origin, host permissions, actual service-worker lifetime, cross-origin API access, BFCache/full navigation behavior or disable/uninstall behavior. These require a separately authorized installed-browser test.
- Actual cadre.ai screenshots and live extension round trips were deliberately not produced. Current screenshots are mock fixtures only.
- A malicious host can remove, occlude or imitate the launcher. A closed Shadow DOM is not a security sandbox; iframe same-origin enforcement is the intended conversation boundary and needs installed verification. No broad privacy/compliance guarantee is made.
- Disable/uninstall can leave injected DOM until the already-open page is refreshed. README explicitly requires refresh and does not promise instantaneous cleanup. Closing a panel cancels transport but cannot retract a request the server already received.

Source is ready for **Critic → Fixer → Independent Verifier**. Do not mark the optional extension delivered, production-ready or installed based on this report.
