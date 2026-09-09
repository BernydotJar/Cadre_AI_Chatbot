# Owner authorization — product polish and extension integration proof

Date: 2026-09-09 (America/Guatemala)

The owner explicitly requested that the existing Cadre AI chatbot be finished as a visually impressive product rather than stopping at the current functional baseline. The owner supplied the current-product screenshot, a high-energy chatbot visual reference, and the public Cadre site, and asked to use browser/Chrome QA plus the local IBM Granite critic.

Authorized work in this increment:

- Repair the current greeting behavior so ordinary greetings such as `hello` receive a useful assistant welcome rather than an immediate human handoff.
- Add a real application favicon/app icon and stronger Cadre-aligned visual identity.
- Rework the existing web UI with richer hierarchy, an original animated assistant/orb treatment, micro-interactions, polished responsive behavior, and stronger agent presence without copying third-party mascot/brand assets.
- Refresh the curated public Cadre research notes from official `cadre.ai` pages and retain provenance in the repository; runtime answers must remain curated and bounded.
- Continue the existing Manifest V3 Chrome extension as a stretch integration adapter and perform isolated test-profile/browser proof on the public `cadre.ai` site. The extension must remain local, reversible, fixed-destination, and must not modify Cadre servers, cookies, forms, analytics, authentication, or user data.
- Use the installed local `ibm/granite3.3:2b` model as an independent source/UX critic and retain its findings as evidence.
- Run the existing unit, integration, browser, build, graph, and extension security gates after each bounded repair.
- Deploy through an already authorized Cadre Vercel mechanism if a valid authenticated deployment path is available, then verify the exact public release.

Still not authorized by this message:

- Chrome Web Store publication.
- Git push/source publication.
- Purchasing services/domains or expanding the existing inference budget.
- Falsifying or rewriting Git/tool provenance. The requested product ownership is the owner's, but existing technical commit metadata is not to be rewritten to claim a different historical actor.

The requested working style remains small, reviewable increments with preserved failures/fixes/evidence.
