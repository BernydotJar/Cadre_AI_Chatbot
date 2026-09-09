# P3 Producer Report — Profile-Driven Donna Experience

Implementation commit: `4fac5411e1a326023b278f5d7b37a81f9d89841d`.

Implemented:
- `chatExperience()` server projection so the browser receives presentation/link/topic metadata but not verified facts, routing triggers, provenance, or persona operating rules;
- profile-driven page metadata, copy, assistant label, avatar, theme tokens, topic starters, composer placeholder, pending text, scope/privacy copy, and footer;
- original code-owned orbital monogram avatar for Donna (`D`) with compact/header, welcome, and hero variants; it is explicitly an AI-guide visual, not a depiction of a real person;
- larger initial composer with the prompt `What are you trying to figure out?`;
- reusable company monogram and no client/persona-name branching in `SupportChat`;
- fictional Acme Outdoors + Scout profile as an architecture/test fixture that is not in the production registry;
- second-profile projection test proving no Cadre/Donna presentation leakage;
- profile theme validation expanded to background/surface/text/muted/accent/focus tokens.

Verification on the producer line:
- full Vitest: 14 files / 278 tests PASS;
- TypeScript PASS;
- source lint PASS;
- Next.js production build PASS;
- Playwright: 52/52 desktop/mobile PASS;
- deterministic browser snapshot probe: title `Donna | Cadre AI`, product `cadre-donna`, Donna heading, 3 avatar instances, 78px initial composer, no horizontal overflow on desktop/mobile;
- screenshots: `evidence/productization/p3-ui/donna-desktop-20260909.png` and `donna-mobile-20260909.png`.

The first expanded browser run produced 50/52 because an added real-server E2E consumed the intentionally process-local 10 requests/minute global rate bucket before the mobile project. Runtime behavior was already covered in P2 API/unit tests, so the new P3 browser test was correctly changed to an intercepted presentation test instead of weakening or bypassing the production rate limiter. The complete browser suite then passed 52/52.
