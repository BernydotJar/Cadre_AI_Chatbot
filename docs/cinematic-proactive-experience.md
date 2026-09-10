# Cinematic + proactive Donna experience

Status: PX6 producer implementation in progress on 2026-09-09. This document defines the product boundary; Graph evidence decides release status.

## Product intent

Donna should feel like a native Cadre AI product surface rather than a static chatbot demo. The surrounding page uses Cadre's verified outcome-first language, the existing local cinematic media, and a compact floating conversation entry point. The chat stays optional: visitors can understand Cadre's public positioning and reach the official contact path without opening Donna.

The visual system is original. Third-party motion, orb, glare, and video references are inspiration for interaction quality only; no third-party component source, brand asset, video, mascot, or page composition is copied into the product.

## Authority model

The runtime still composes three independent layers:

- `ClientConfig` owns facts, provenance, approved URLs, routing boundaries, pricing-boundary copy, and `publicHighlights` used by the surrounding website.
- `PersonaProfile` owns Donna's tone, a one-question initiative budget, and short boundary-empathy leads. Persona copy cannot add facts, URLs, promises, pricing, actions, or permissions.
- `ExperienceProfile` owns presentation, the signal-orb identity, first-turn prompts, motion copy, theme, and shell text.

`chatExperience()` projects presentation plus the reviewed `publicHighlights`; it still does not send private routing triggers, knowledge provenance internals, or persona operating rules to the browser.

## Public highlights

The page may render only `ClientConfig.publicHighlights`. Current Cadre highlights cover three public business outcomes, the published 100+ high-ROI / 50+ companies proof statement, and the public `Track your AI results` proposition. Every optional highlight link must pass the same official-domain allowlist as chat links.

The results proposition remains bounded: Cadre publicly describes a centralized portal for tools, agents, training, and results, but this app does not invent a portal URL or claim account access. The approved next step remains the public Cadre contact route until a public portal URL is verified.

## Proactive conversation contract

There are two bounded proactive surfaces:

1. **Before chat:** the launcher may show one verified public fact and one configured suggested question. It does not infer personal intent or read page/account data.
2. **After a grounded answer:** Donna may append at most one exact configured diagnostic question. Existing opt-out language such as `just answer` or `no follow-up` suppresses it.

Pricing and unsupported claims never become model-led sales copy. Core policy first classifies the request. For pricing, the client-owned response may acknowledge business economics and verified Cadre outcome framing while explicitly stating that no verified price list/rate card is available. Persona may prepend one short empathy lead. The official contact link is still the only handoff.

## Interaction states

Donna uses an original CSS signal orb with two states:

- `idle`: slow breathing motion to signal availability;
- `shaping`: a faster bounded deformation while a request is in flight.

The launcher has one restrained glare sweep. These are the only new PX6 motion effects. The pre-existing local hero video remains the cinematic media layer. `prefers-reduced-motion` disables orb/glare animation and keeps the poster-only hero behavior.

At `<=430px`, the floating launcher intentionally collapses to the signal orb only: visual launcher text is hidden to preserve the compact control, and the button's `aria-label` remains the authoritative accessible name.

The compact chat sheet preserves a 240px minimum conversation region after a conversation starts and may scroll vertically when user text-spacing overrides expand recovery/composer content. This keeps the transcript readable without clipping privacy/retry controls inside a fixed-height mobile sheet. Composer text is at least 16px on mobile to avoid browser zoom/readability regressions.

## Page structure

The page is deliberately website-first:

1. full-width cinematic Cadre hero;
2. business-outcome cards;
3. `Track your AI results` product/value section;
4. `How Donna works` trust/engineering section;
5. floating Donna launcher and bounded chat panel.

The trust section explains verified knowledge, bounded persona behavior, deterministic guardrails, and human handoff in plain product language. It does not expose private process context or claim capabilities the runtime does not have.

## Release constraints

PX6 cannot release on visual impression alone. After the producer implementation is complete, the lifecycle requires independent critique, any necessary repair, full unit/type/lint/build/browser regression, reduced-motion and responsive evidence, Graph gate closure, exact-SHA publication, deployment to the existing Vercel project, and anonymous public equivalence. A public failure invalidates the release again rather than being waived.
