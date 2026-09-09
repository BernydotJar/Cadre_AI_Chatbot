# 001-support-chatbot Requirements

**Status: `spec_ready` — awaiting human approval. Not approved for implementation.**

## Summary

A one-page customer-support chatbot for Cadre AI (https://cadre.ai), an AI strategy and implementation consultancy serving B2B clients (professional services, private equity, financial services, real estate, mortgage and lending, construction, retail and e-commerce, manufacturing and logistics). Inbound volume from prospective and existing clients includes recurring questions the bot should answer directly from verified information, so the human team can focus on high-value conversations. When the bot cannot answer from verified information, it must say so and route the person to an official channel — never guess.

## Mode

MVP.

## Supported conversation scenarios

The bot must handle these six scenario families through grounded answers or honest redirection:

| # | Scenario | Required behavior |
|---|----------|-------------------|
| S1 | Prospective client asks what Cadre AI does / whether their industry is a fit | Grounded answer from the knowledge set (services, industries, departments served). |
| S2 | How to talk to an AI strategist | Direct to the verified official contact page (`https://cadre.ai/contact`, CTA "Talk to an AI Strategist"). Never fabricate a scheduling link; never claim a booking was created. |
| S3 | Existing client asks how to access their client portal | Honest boundary: the bot has no portal access, and no public portal URL has been verified for this knowledge set (unresolved decision U6); direct the client to their Cadre contact or the official contact page, without claiming a portal cannot exist. |
| S4 | What the AI Maturity Index is and how to get scored | Explain what is verifiably supported (official CTA "Get Your AI Maturity Index" → contact page); route scoring requests there. No invented methodology, scores, or timelines. |
| S5 | Cadre's approach to model selection and data security | Limited to verified information (e.g., published partner ecosystem and services). Explicitly decline to state certifications, guarantees, or policies that are not in the knowledge set. |
| S6 | Unknown, unsupported, ambiguous, or account-specific questions | Ask one clarifying question when ambiguity is cheap to resolve; otherwise state the boundary and redirect to an official channel. Never solicit credentials or sensitive personal data. |

## Acceptance Criteria

- [ ] AC1 — An anonymous visitor at the public URL can complete a real multi-turn conversation with live model responses.
- [ ] AC2 — Each scenario S1–S6 produces the required behavior above, verified by the evaluation matrix in `design.md`.
- [ ] AC3 — The bot never emits prices, client results, certifications, security guarantees, or links that are not in the approved knowledge set; every rendered link comes from the approved-links list.
- [ ] AC4 — User and retrieved content are treated as data: simple prompt-injection attempts (instruction override, link smuggling, role-play exfiltration) do not break the response policy; model output renders as text, never executable HTML.
- [ ] AC5 — Input, history, and output are bounded; empty and oversized inputs get clear validation feedback.
- [ ] AC6 — Provider failure or timeout yields a safe, friendly error with a retry path; no stack traces, internal details, or secrets reach the client.
- [ ] AC7 — A proportionate public abuse control (per-client rate limit) exists and its limitations are documented honestly.
- [ ] AC8 — Lint and production build pass; unit/integration tests cover validation, routing, response policy, and adapter error translation; a browser smoke check covers a real conversation including loading, failure, and retry states, usable by keyboard and on mobile widths.
- [ ] AC9 — The deployed URL is verified anonymously, including one real server round-trip and confirmation that credentials and internal errors are not exposed.
- [ ] AC10 — A reproducible source archive (ZIP) is prepared and verified BEFORE human closure is requested. Contents: source, lockfile, root `CLAUDE.md` and `plan.md`, tests/specs, sanitized evidence, and a usable `.git` history. Exclusions: dependencies, build output, caches, secrets, private inputs, and reference checkouts. Verification at release: extract into a clean temporary directory, confirm the Git history and the documented setup/build/smoke checks, and record the archive size and checksum. Preparation is not authorization to upload or send the archive.

## Non-Goals

- Database or persistent chat history; user accounts or auth; CRM or ticketing integration; real booking/calendar integration; vector database or embedding search; multi-tenant admin; analytics; voice.
- Creating real bookings, support tickets, portal sessions, or maturity scores. The bot only explains and routes; integrations may be future features with their own specs.

## i18n

- Product copy: English only in the baseline.
- Layout must tolerate long messages and small viewports; validation, error, and empty states have explicit copy.
- Accessibility: labeled controls, keyboard operability, visible focus; checked in the browser smoke suite.

## MVP Criteria

- Bounded scope: this document plus `design.md` file boundaries; anything outside is a scope change requiring human approval.
- Tests and verification: per AC8/AC9, with retained evidence.
- Review evidence: each delivery node (see `tasks.md`) closes with a recorded review before the next starts.
- Known gaps are documented in `plan.md`, not silently absorbed.
