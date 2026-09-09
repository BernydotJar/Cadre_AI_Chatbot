# P2 Producer Report — Donna Bounded Guidance

Implementation commit: `02eeee47a56720889a7605b4f4ba58f05d5bd355`

Implemented:
- allowlisted Cadre + Donna product profile as the safe deployment default;
- original English Donna persona with application-owned operating principles;
- four topic-specific diagnostic questions, each validated by the P1 one-question contract;
- no proactive step for strategist booking or portal topics because the verified answer already contains the appropriate handoff/access boundary;
- server integration that appends a persona question only after a grounded factual answer;
- repeat suppression when the same assistant question already exists in supplied history;
- explicit `ClientConfig` injection remains a no-persona compatibility/test seam.

Verification:
- focused Donna + product contracts: 17/17 PASS;
- full Vitest suite: 13 files / 273 tests PASS;
- TypeScript PASS;
- source lint PASS;
- production Next.js build PASS;
- `git diff --check` PASS.

The live model still selects only approved fact indexes. It cannot generate, alter, or select Donna's proactive copy.
