# Premium visual audit — Cadre + Donna baseline

Date: 2026-09-09 UTC.

## Owner direction

Target: large typography, sober composition, generous negative space, minimal navigation, cinematic presence, and the product presented as a refined tool. The supplied geometric references show a dark field with thin orbit/polygon geometry, red and cyan luminous accents, and a centered signal/core. They are treated as motion/composition references only; literal neon/cyan cyberpunk styling is not the target.

Ambient-media contract requested by the owner: 6–10 seconds, muted, no embedded text, static poster, `prefers-reduced-motion`, low payload, and no aggressive loop.

## Current public Cadre observations

A fresh Playwright probe against https://cadre.ai/ at 1440×1000 observed:

- body: Arial/Helvetica base, white background;
- hero heading is an H2 set in `Inter Tight`, 60px / 66px, weight 700;
- hero background is a light cream-to-white gradient;
- above the fold, the only image element was the Cadre SVG logo;
- page uses 75 images overall, 127 links, and ~9700px of document height;
- no HTML `<video>` element or iframe was present in the inspected DOM;
- current copy strongly emphasizes strategy + implementation, revenue, profitability/EBITDA, employee elevation, agents/workflows, and measurable outcomes.

Interpretation: Cadre's current site earns visual richness through long-form editorial rhythm, imagery, proof, and business-outcome content. A short standalone assistant cannot simply copy the same 60px type and cream palette and expect equal perceived presence.

## Current public Donna observations

A fresh Playwright probe against the existing production alias at 1440×1000 observed:

- title `Donna | Cadre AI` and `data-product=cadre-donna`;
- body background `#f5f1e8`, Inter/Inter Tight, 15px base;
- hero H1 ~60.5px with tight 0.99 line-height;
- one minimal contact navigation item;
- no image or video elements;
- ~1098px document height;
- current UI is a two-column editorial intro + large chat card;
- existing orbital-monogram avatar is CSS-only and heavily gradient/orbit based.

## Strict diagnosis before implementation

1. **The assistant is polished but still reads as a designed app, not a premium product moment.** The card, topic tiles, multiple borders, gradients and small labels create visible UI density.
2. **The headline is not dominant enough for such a short page.** It is roughly the same scale as Cadre's hero despite Donna lacking the long site's photography/proof rhythm.
3. **The visual system has too many simultaneous motifs.** Serif emphasis, orbital avatar, glass card, radial background, red gradient line, numbered cards and multiple status labels compete.
4. **The avatar is memorable but too illustrative/ornamental for the requested executive/FAANG-adjacent restraint.** Premium identity should become a simpler signal mark that can scale from 20px to hero size.
5. **The current reference images are useful for motion grammar, not art direction.** Thin geometry, one moving tracer, a stable center and dark negative space can work; strong cyan glow + red polygon + full-screen Tron styling would make the product feel like a generic AI demo.
6. **The product should become the tool inside the composition, not a card beside marketing copy.** The first viewport should have one dominant statement and one obvious place to type.

## Proposed premium direction

- Increase desktop display scale to roughly 76–104px with restrained line count and more negative space; keep mobile compact and readable.
- Reduce visible chrome: fewer borders, fewer micro-labels, quieter topic suggestions, less card-on-card composition.
- Make Donna's identity a small, ownable geometric signal mark derived from orbit/core logic, not a mascot.
- Use an ink/dark cinematic field as an atmospheric layer, with Cadre red + warm white as primary motion colors; any mint/cyan tracer is tertiary and subtle.
- Keep the main composer visually dominant and immediately usable.
- Ambient motion should sit behind/around the hero composition, never behind transcript text where it harms legibility.
- Static poster must look intentional enough that reduced-motion users receive the same premium composition.

## Acceptance target for PX2

- one dominant first-viewport hierarchy;
- large editorial type without overflow at 1280/1440;
- minimal navigation and no ornamental dashboard chrome;
- Donna mark recognizable at hero, 48px, and 20px scales;
- current accessibility/single-flight/chat behavior preserved;
- no literal copying of supplied neon references;
- desktop/mobile screenshot evidence plus independent strict design critique retained.
