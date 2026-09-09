# G9 installed integration review — 2026-09-09

The Manifest V3 adapter remains an independent local candidate preview. It uses exact Cadre site matches, a closed Shadow DOM launcher, an extension-origin panel, a fixed candidate Vercel API endpoint, text-only rendering, approved-link allowlisting, strict message envelopes, and no tabs/history/cookies/storage/broad-host permissions.

Verification layers:

- extension unit/security/build: 71/71 PASS;
- synthetic HTTPS host + mocked runtime ports: 22 PASS checks, zero actual-site/API requests;
- owner-authorized disposable Chromium installed extension on `https://cadre.ai/`: final run 15 PASS checks and exactly one live request for one approved question.

Two failed actual-site attempts are intentionally retained. The first incorrectly treated Cadre's own 8px document overflow as an extension failure, then the gate was scoped to the injected launcher. The second observed network traffic at Page scope, which cannot see extension service-worker fetches; instrumentation moved to BrowserContext scope. The corrected final run passed.

The test profile was deleted after execution. No Cadre server write, form interaction, cookie/authentication access, persistent extension storage, analytics modification, or Web Store publication occurred.
