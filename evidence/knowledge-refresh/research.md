# Knowledge refresh research evidence

Retrieval date: **2026-09-08**. Evidence type: public official-page review and bounded HTTP/link checks. Outcome: recommendations in [knowledge source audit](../../docs/knowledge-source-audit.md). This is not a runtime, deployment, or release verification.

## Local comparison basis

Read `CLAUDE.md`, `specs/001-support-chatbot/requirements.md`, `src/config/cadre.ts`, and the full configuration, routing, and policy tests under `tests/config/config.test.ts`, `tests/core/route.test.ts`, and `tests/core/policy.test.ts`. A targeted search also located API and browser expectations; those were not executed. The initial requirements header is historical; no status or ledger change was made by this review.

## Source register

The section labels below are locators, not copied page content. Factual summaries and unknown boundaries are centralized in the audit to avoid maintaining a second knowledge corpus.

| Official page | Topic coverage | Locator inspected | Retrieval |
|---|---|---|---|
| [Home](https://cadre.ai/) | Overview, model selection, maturity, contact, portal | Service summaries; model selection block; FAQ; results block; relevant navigation anchors | 2026-09-08 |
| [Strategy](https://cadre.ai/strategy) | Overview, maturity framework, model/security provenance | Eight transformation pillars; partner statement; intensive description; security block | 2026-09-08 |
| [AI Engineering](https://cadre.ai/ai-engineering) | Overview, models/security | Approach selection; automation examples; LLM/security block | 2026-09-08 |
| [AI Agents](https://cadre.ai/agents) | Overview, industries/departments, portal | Offering categories; library filters; results block | 2026-09-08 |
| [Leadership & Facilitation](https://cadre.ai/leadership-facilitation) | Overview, departments | Facilitation approach; formats; department list | 2026-09-08 |
| [Industries](https://cadre.ai/industries) | Industry fit | Industry cards; invitation for unlisted industries | 2026-09-08 |
| [Contact](https://cadre.ai/contact) | Contact, maturity, fit, portal | Public contact page; FAQ; relevant anchors | 2026-09-08 |
| [About](https://cadre.ai/about) | Existing approved link | Page title and public overview | 2026-09-08 |
| [Case Studies](https://cadre.ai/case-studies) | Existing approved link | Page title and examples index; no outcome metrics imported | 2026-09-08 |
| [Privacy Policy](https://cadre.ai/legal/privacy-policy) | Security/unknown boundary | Scope; security; displayed revision date | 2026-09-08 |

## HTTP and anchor observations

A bounded Node `fetch` check, invoked through `rtk proxy node`, issued HEAD requests for the nine non-home URLs above. Each returned HTTP 200 and the final URL exactly matched the requested URL. Official-page text was read using web browsing. There was no recursive traversal, storage of HTML, or download of a page corpus.

The web reader's text omitted the maturity navigation CTA. To resolve that uncertainty, a separate bounded GET read home, strategy, and contact in memory, extracted only relevant anchor labels and `href` values, then discarded the HTML. All three responses were HTTP 200. Home normalized only to the trailing-slash root. On all three pages:

| Anchor purpose | Observed href | Meaning for this audit |
|---|---|---|
| Maturity request | `/contact` | Current navigation validates the configured destination. |
| Strategist conversation | `/contact` | Public handoff, not an observed booking integration. |
| Results portal CTA | `/contact` | Does not disclose a portal login address. |

The exact maturity label was present in HTML although absent from the extracted article text. No portal/login/sign-in anchor was returned by the targeted label filter on those three pages. That check does not prove absence across the site, JavaScript states, private communications, or authenticated systems.

## Evidence limits

- No form was completed or submitted, no login attempted, and no person contacted.
- No private files, secrets, credentials, or model requests were used in this research.
- Claims about service delivery, partnerships, security and outcomes remain company statements. No external audit or partner confirmation was performed.
- No prices, metrics, certification claims, or guessed account links were proposed for runtime admission.
- Only the audit and this evidence file were created. No configuration, source code, Git, ledger, server, or build operation was performed by this research task.
