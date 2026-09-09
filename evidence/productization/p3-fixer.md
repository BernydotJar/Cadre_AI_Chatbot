# P3 Fixer Report — Bind Visible Identity to Persona

Repair commit: `e39a7b47ea49815f206458011c39ff2e4a822fbc`.

P3-CRIT-001 is repaired at the composition boundary. `validateProductProfile()` now requires `experience.assistantLabel` to match `persona.name`; the visible assistant can no longer drift from the behavior profile while both nested schemas remain individually valid.

A permanent regression test mutates a valid product so its presentation label differs from the persona and asserts rejection. The existing fictional Acme/Scout product and Cadre/Donna product both satisfy the identity invariant.

Focused post-repair verification:
- product contracts + Donna + view tests: 23/23 PASS;
- TypeScript PASS;
- source lint PASS;
- `git diff --check` PASS.
