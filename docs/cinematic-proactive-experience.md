# Cinematic + proactive Donna experience

Status: PX6 revision 15 is **DONE + PUBLIC PASS** after the final invitation-polish repair. Runtime repair `af7e3ff` is published in closure `f334616`, deployed through the existing Vercel project as `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`, and passes the complete rate-aware 70/70 public browser matrix. The revision-13/14 failures remain retained in Graph evidence. This document defines the product boundary; Graph evidence decides release status.

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

The results proposition remains bounded: Cadre publicly describes a centralized portal for tools, agents, training, and results. As of the 2026-09-10 source-freshness repair, the highlight's "Get Your AI Results" link uses the actual published CTA destination (`https://portal.gocadre.ai/ai-maturity-index`, with the exact `portal.gocadre.ai` host delegated via `ClientConfig.additionalOfficialDomains`) — a public AI Maturity Index entry point, not a verified private client-login/account portal. This app still does not invent or claim a private account-portal address; account-specific access remains routed to the official Cadre contact link.

## Proactive conversation contract

There are two bounded proactive surfaces:

1. **Before chat:** the floating invitation reuses Donna's profile-driven avatar and the already-validated `ExperienceProfile.quickPrompts`. While chat is closed, the launcher and nudge may advance through those configured labels/messages on a bounded cadence for at most one pass, then stop so a visitor can see concrete things to ask. The nudge keeps the reviewed proof highlight separate as verified context. Rotation makes no API/model call, reads no page/account data, does not personalize, pauses while the invitation is hovered or keyboard-focused, and stays on the first prompt when `prefers-reduced-motion: reduce` is active. Clicking the nudge sends the exact configured prompt through the existing `send()` path.
2. **After a grounded answer:** Donna may append at most one exact configured diagnostic question. Existing opt-out language such as `just answer` or `no follow-up` suppresses it.

Pricing and unsupported claims never become model-led sales copy. Core policy first classifies the request. For pricing, the client-owned response may acknowledge business economics and verified Cadre outcome framing while explicitly stating that no verified price list/rate card is available. Persona may prepend one short empathy lead. The official contact link is still the only handoff.

## Interaction states

Donna uses an original CSS signal orb with two states:

- `idle`: slow breathing motion to signal availability;
- `shaping`: a faster bounded deformation while a request is in flight.

The launcher has one restrained glare sweep. These remain the only PX6 motion effects. Revision 13's suggestion cycling is a discrete application-state change, not a new CSS animation; reduced-motion preference also keeps that suggestion state static. The pre-existing local hero video remains the cinematic media layer. `prefers-reduced-motion` disables orb/glare animation and keeps the poster-only hero behavior.

At `<=430px`, the floating launcher intentionally collapses to the signal orb only: visual launcher text is hidden to preserve the compact control, and the button's `aria-label` remains the authoritative accessible name. The separate pre-chat invitation nudge remains available above that launcher in a compact mobile layout; its question, action, and verified-context copy keep the same >=12px readability floor as other important helper/trust copy.

The compact chat sheet preserves a 240px minimum conversation region after a conversation starts and only then may the outer sheet scroll vertically when user text-spacing overrides expand recovery/composer content. Before the first send, the outer sheet remains clipped and the welcome transcript is the single vertical scroller, avoiding nested scrolling while keeping the composer outside that scroller. Composer text is at least 16px on mobile to avoid browser zoom/readability regressions.

For very short compact viewports (`<=430px` wide and `<=590px` tall), the sheet expands to `calc(100dvh - 12px)` instead of `88dvh`. This preserves a fully navigable welcome-row viewport under enlarged text spacing without changing the normal mobile presentation at taller heights.

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
