# P1 Fixer Report — Structured One-Step Persona Guidance

Repair commit: `e39954a25e0cb894cfee65ecbfa097c328f3b3fb`

Critic finding P1-CRIT-001 is repaired by replacing free-form proactive strings with a structured `question` object. Validation now enforces:
- product-level `maxSteps <= 1`;
- exactly one question mark at the end;
- maximum 220 characters;
- no URL-shaped content;
- no newlines;
- no sentence/step bundling via `.`, `!`, or `;` before the final question mark;
- topic must exist in the selected `ClientConfig`.

The reproduced URL/bundled-step cases are now permanent regression tests. Focused contract tests pass 7/7, TypeScript passes, and source lint passes after removing only stale generated Vercel output from the verification workspace.
