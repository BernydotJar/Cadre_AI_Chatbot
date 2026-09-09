# Chatbot UX assessment and implementation brief

Research date: 2026-09-08. Scope: a small public customer-support chatbot, not a general assistant platform. This is a coordinator-authored assessment of current first-party documentation, not a competitive benchmark, user study or independent audit. A separate research agent was dispatched but stopped because the workspace reported exhausted credits; no completed agent research is claimed.

## What mature chat products do today

Commercial support agents combine knowledge-grounded replies, escalation to people, system integrations and pre-release evaluation. Intercom's Fin describes this broader product surface, including actions, multichannel support, testing and observability. These are the vendor's product descriptions, not evidence that this repository delivers the same capabilities or independently measured resolution rates. For our scope, borrow the visible boundary and dependable fallback, not unsupported enterprise claims. [Fin](https://fin.ai/)

Conversation components now explicitly address suggested starts, input states, sources and navigating a growing transcript. Vercel's AI Elements documents responsive conversation layout and a return-to-bottom control. The pattern is useful; adopting its package is not necessary for a small custom React implementation. A library's claim of accessibility does not replace testing the assembled UI. [AI Elements conversation](https://elements.ai-sdk.dev/components/conversation)

A good AI interface communicates its abilities and makes errors recoverable. Microsoft's evidence-based HAX guidance considers initial use, ongoing interaction, failure and later use. For this product that means a short scope statement, honest uncertainty, explicit retry and an official contact route—not an endless blank prompt or a fake autonomous-work display. [Microsoft HAX](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)

Accessibility must cover changing state, not just static colors. Announce progress and failures without moving keyboard focus; avoid repeatedly announcing the full conversation. W3C's status-message guidance supports programmatically exposed messages without a focus change. Test the actual behavior, and do not call a few smoke checks full WCAG conformance. [Status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

## Applying the owner's Laws of UX reference

The supplied short URL was opened in the browser and resolved to [Laws of UX in Spanish](https://lawsofux.com/es/). Its visual reference was inspected. Use the principles, not copied illustrations or a cloned brand treatment.

| Principle | Concrete UI decision | Verification |
| --- | --- | --- |
| Hick: avoid unnecessary choice complexity | Six short, scenario-aligned starts on the empty state; one primary composer. Collapse introductory content once a conversation starts. | Each suggestion maps to a supported route; no competing settings/model toolbar. |
| Fitts: target size and distance matter | Large send/retry/stop controls near the composer and comfortable spacing. Aim for 44 px primary targets. | Check bounds on mobile and keyboard activation. |
| Jakob: use familiar interaction models | Distinguish user/assistant turns; Enter sends, Shift+Enter adds a line, IME composition never sends accidentally. | Browser interaction tests, no surprise focus jumps. |

Sources: [Hick](https://lawsofux.com/es/ley-de-hick/), [Fitts](https://lawsofux.com/es/ley-de-fitts/), [Jakob](https://lawsofux.com/es/ley-de-jakob/). The 44 px design target is our more generous primary-control choice, not a misstatement of WCAG 2.2 AA's 24 px minimum with specified exceptions. [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## Product decisions: now versus later

Implement in N4 after its prerequisite gate passes:

- A calm, single-purpose support workspace: clear Cadre identity, readable neutral palette, one restrained accent, substantial whitespace and no decorative dashboard metrics.
- Six practical starts: services, industries, strategist call, portal access, maturity index, models/security. Plain language, not technical route names.
- Clear scope: public information only; no account access, actual bookings or assessment execution. Keep the official contact link available as an external route; do not suggest a connected live-human transfer.
- Server-derived mock/live/unavailable label. A mock demo must not look like verified live inference.
- A multiline labeled composer, immediate single-flight submission lock, real request progress, stop/cancel, recoverable error and retry of the same failed turn without duplicating it. A cancellation may still incur a provider charge; do not promise refunds.
- Text-only replies plus clickable links from the app's exact approved URL set. An official destination is not necessarily a citation proving each sentence; avoid a misleading universal 'verified source' badge.
- Page-local conversation state only. Explain that live messages go to an external model service; do not promise zero provider retention, end-to-end encryption or compliance guarantees. Do not solicit private data.
- Respect reading position while new answers arrive; provide a return-to-latest control when needed. Respect reduced motion, visible focus and responsive reflow.

Defer voice, attachments, persistent history, feedback storage, CRM actions, model selection, vector search and autonomous tools. Those need new data/security contracts, approvals and evaluations. Do not add ornamental controls with no working behavior. No reasoning transcript or fabricated typing/progress stages.

## Current architecture versus frontier capability

This implementation routes by curated lexical rules and lets a model prioritize indices of approved facts. It renders all routed facts, including limitations, rather than accepting arbitrary generated prose. This sharply constrains hallucinated business claims and cost, but can feel repetitive, misses unlisted paraphrases and lacks open-ended semantic conversation. It is an extractive, model-assisted support application—not a general reasoning agent or state-of-the-art semantic retrieval system.

Do not hide those limitations behind polished visuals. A later improvement would be an evaluated, bounded semantic intent classifier with an explicit unknown class. It would need paraphrase and adversarial tests, latency/cost comparisons and a reviewed boundary change; not simply a larger model or an unsupported assertion of better quality.

## Verification brief

Run the real local API in mock mode for browser tests, with additional intercepted failures for deterministic recovery testing. Cover all suggestions, a clarification follow-up, unknown/account cases, keyboard/IME, empty and oversized input, duplicate submit, cancellation, retry, session reset, text injection, approved links, long transcript, 360 px layout and reduced motion. Inspect desktop/mobile screenshots visually. Check client bundles for secrets and provider-only modules. Retain actual results; do not claim completed tests from this brief.

Then verify a small live roundtrip and anonymous public deployment separately. A screenshot of a chat bubble, mock suite or reachable health endpoint is not evidence of live chatbot delivery.

## Tooling assessment

Context7 was requested, but no callable Context7 tool or matching MCP resource was available in this session. Primary documentation was read directly; no Context7 invocation is claimed.

[autoskills](https://github.com/midudev/autoskills) is a technology-detecting skill installer and registry, not a UI design itself. Its current README describes manifest/hash checks and a noncommercial license. It was inspected, not executed or installed wholesale. This project does not need a new installer/dependency to apply the documented UX patterns. Any later selected skill requires its own instruction/license review before use.
