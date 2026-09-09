# Product polish brief — 2026-09-09

## Owner-observed defects

1. A simple `hello` currently falls through to the unsupported-information handoff. This makes the assistant feel brittle before the user reaches any supported journey.
2. The public app has no authored favicon/app icon.
3. The current UI is clean but visually passive. It needs a more memorable agent presence, clearer hierarchy, richer motion/micro-interactions, and stronger perceived product quality while remaining recognizably Cadre.
4. The optional Chrome adapter exists in source but lacks actual installed-browser proof on `cadre.ai`.

## Design direction

Use Cadre's current public visual language as the brand anchor: light/ink surfaces, Inter-family typography where practical, strong red accent, and high-contrast editorial composition. Add an original **Cadre Signal** visual: concentric gradient/orbit layers that imply an active AI system without copying the supplied owl/third-party branding. The signal may animate only when motion is permitted.

Reference intent only (no asset/code copying):

- supplied high-energy chatbot reference — character/agent presence, immediate visual hierarchy, conversational energy;
- `https://orbs.jakubantalik.com/` — thinking-orb interaction idea;
- `https://amicro.vercel.app/` — micro-transition polish;
- `https://design.ricoui.com/brands` — brand-system discipline;
- `https://motion.so/` — later launch/demo motion production, not a runtime dependency.

## Acceptance contract

### Core behavior

- Exact ordinary greetings (`hello`, `hi`, `hey`, common daypart greetings, and `hola`) return a concise welcome with supported starting points and no provider call.
- Mixed or substantive requests still route through normal safety/topic policy; a greeting cannot bypass pricing/account/security boundaries.
- Unsupported substantive questions continue to hand off honestly.

### Web presentation

- Authored favicon/app icon is emitted by the app.
- Desktop initial view has a distinctive Cadre Signal, strong editorial hero, live/demo status, and clear chat focal point.
- Chat header, empty state, message treatment, composer, pending state, links, and recovery states share one visual system.
- Primary suggestions remain the six approved product topics; no fake actions are introduced.
- Motion is subtle, bounded, and disabled/reduced under `prefers-reduced-motion`.
- Existing readability/reflow/accessibility contracts remain intact at 320, 360, 760, 1280+ CSS px.

### Knowledge

- Official Cadre pages are recorded as dated source inventory with concise claim summaries.
- Runtime facts remain curated in `src/config/cadre.ts`; raw webpage text is not used as live prompt context and does not become authority automatically.

### Chrome adapter

- Launcher is visually aligned with the polished web app and remains discreetly labeled as an independent candidate/integration preview.
- Isolated test-profile/browser load on `https://cadre.ai/` proves: one launcher only, open/minimize/close lifecycle, panel rendering, no page overflow/interference, and cleanup on navigation/disable or document refresh.
- API transport remains fixed to the candidate-owned Vercel endpoint; no arbitrary URLs, cookies, browsing history, or OpenRouter key exposure.

### Evidence

Producer -> Granite/source critic -> fixer -> deterministic/browser regression -> independent verifier -> graph gate -> deployment/public proof where authenticated deployment is available.
