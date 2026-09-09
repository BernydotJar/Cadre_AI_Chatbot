# PX3 producer evidence — accessible ambient media — 2026-09-09

Scope: optional presentation media for the Cadre Donna experience only. No knowledge, routing, persona initiative, provider, account, extension, or action authority changes.

## Design and provenance

The ambient layer is an original procedural asset generated locally with FFmpeg from gradients, fine architectural guide lines and a restrained vignette. It uses no external footage, stock imagery, copied brand asset, embedded text, faces, or audio. The visual purpose is atmosphere behind the existing editorial hero, not a second focal point.

Assets:

- `public/media/donna-ambient-loop.mp4` — H.264, 1280x720, 24 fps, exactly 8.000 seconds, one video stream, no audio stream, 14,565 bytes.
- `public/media/donna-ambient-poster.webp` — static first-frame fallback, 2.5 KB.

FFprobe evidence: `evidence/premium-media/px3-ffprobe-20260909.json`.

## Product boundary

`ExperienceProfile.ambientMedia` is optional and validates only local `/media/` poster/video paths. Video duration metadata is constrained to 6–10 seconds. Cadre enables the local assets; the Acme/Scout reuse fixture leaves ambient media undefined. The browser receives only presentation paths/duration, not new factual authority.

The UI starts from a poster-only SSR/hydration-safe state. After hydration it checks `prefers-reduced-motion: reduce`; only no-preference users get a mounted `video`. The video is `muted`, `autoplay`, `loop`, `playsInline`, metadata-preloaded, pointer-inert and `aria-hidden`. Reduced-motion users keep the poster and the video element is not mounted. A CSS reduced-motion rule also hides video as a defensive fallback.

## Verification

- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- focused product contracts/view — 11/11 PASS.
- `npm test` — 15 files / 284 tests PASS.
- `npm run build` — PASS.
- first E2E attempt after build — infrastructure BLOCKED because a verifier-owned Next server still held port 3100; process ownership was inspected before stopping only the `/workspace` server.
- final `npm run test:e2e` — 56/56 PASS, including normal ambient media and reduced-motion poster-only cases in both desktop/mobile projects.
- deterministic browser probe — normal motion mounts one playing muted/looping local video; reduced motion mounts zero videos and retains the local poster; both have no horizontal overflow.

Browser evidence:

- `evidence/premium-media/px3-browser-geometry-20260909.json`
- `evidence/premium-media/px3-motion-desktop-20260909.png`
- `evidence/premium-media/px3-reduced-motion-desktop-20260909.png`

Asset SHA-256:

- video: `46624079374a591625e749afc4860614afccbe857be92d7ed9f885494087b894`
- poster: `82cc5ca46cb35190f612204582f0fa39c9ad8e7689a5689b1a76bdcdd737c9e1`

This is producer evidence, not design-review or independent-verifier evidence. PX3 must still pass a separate critic and verifier before DONE.
