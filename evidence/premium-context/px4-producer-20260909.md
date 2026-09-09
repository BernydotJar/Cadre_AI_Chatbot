# PX4 producer evidence — contextual Donna local adapter

Date: 2026-09-09 UTC.

## Scope

PX4 refines presentation only. The existing Manifest V3 adapter already proved exact Cadre origins, fixed endpoint transport, extension-origin panel isolation, volatile conversation state, and a pathname/hash-only context enum. This increment keeps those authority boundaries and makes the local adapter feel like the same Donna product rather than a separate generic AI widget.

## Changes

- Renamed the visible local adapter to `Donna — Cadre AI Local Preview`; removed self-referential candidate wording from current source/UI.
- Replaced the glowing circular launcher/panel marks and concentric welcome signal with the same restrained editorial Donna monogram grammar used by the web shell: flat cream surface, thin border, small red side accent, italic `D`, no ring stack, glow, radial badge, or orbit animation.
- Removed the duplicate large panel signal from the welcome state; header owns Donna identity.
- Simplified topics from two-column cards to one-column editorial rows and changed the send control from gradient red to ink.
- Kept context copy one step proactive and lightly human without creating new authority. `/agents#discover-agents` still maps only from pathname/hash to a fixed enum and a fixed approved question.
- Renamed the textbox accessibility label to `Message Donna` and kept the panel clearly labeled `LOCAL INTEGRATION PREVIEW` so it does not imply Cadre-installed production ownership.

## Authority unchanged

The content script still reads only `location.pathname`, `location.hash`, and the already-approved HTTPS origin. It does not read page text, forms, cookies, account state, storage, arbitrary URLs, or DOM content to decide what Donna says. Context remains presentation metadata only; the request body to the existing API remains bounded conversation messages and the service worker still owns the single fixed endpoint.

No database, RAG/GraphRAG, autonomous action, portal access, booking action, new permission, storage permission, provider secret, or network destination was added.

## Producer verification

- `node extension/build.mjs` — PASS; generated 15 local files without provider config/credentials.
- `npm exec -- vitest run --config extension/vitest.config.ts` — 72/72 PASS.
- `node extension/tests/browser-mock.mjs px4-contextual-donna-20260909` — 23/23 PASS; zero real-site/API traffic.
- `EXTENSION_ACTUAL_SITE=1 node extension/tests/installed-site.mjs px4-actual-site-20260909` — 17 scoped checks PASS on `https://cadre.ai/agents#discover-agents`; exactly one explicit fixed-endpoint API request; no Cadre server/form/cookie/auth/storage mutation.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `npm test` — 286/286 PASS.

## Evidence

- `extension/evidence/px4-contextual-donna-20260909/browser-mock.json`
- `extension/evidence/px4-contextual-donna-20260909/mock-desktop.png`
- `extension/evidence/px4-contextual-donna-20260909/mock-mobile.png`
- `extension/evidence/px4-actual-site-20260909/installed-site.json`
- `extension/evidence/px4-actual-site-20260909/launcher-on-cadre.png`
- `extension/evidence/px4-actual-site-20260909/panel-open-on-cadre.png`
- `extension/evidence/px4-actual-site-20260909/grounded-reply-on-cadre.png`

The actual-site proof is a disposable local extension installation, not a claim that Cadre has installed or endorsed the extension in production.
