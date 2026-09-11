# AD0 - r15 architecture evidence boundary

Result: PASS

## Frozen AS-BUILT release identity

- Product increment: PX6 revision 15.
- Runtime repair source: `af7e3ff91ae91fc231defe87fde0139bd1c7f298`.
- Published/deployed closure source: `f33461679ebbe5322a9030f1f2b17319874d7e03`.
- Production deployment: `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr`.
- Production alias: `https://cadre-ai-chatbot-tawny.vercel.app`.
- Public equivalence: 70/70 Playwright PASS using separate fresh desktop/mobile rate windows.
- Final source-package snapshot: `19dd2cded2e1f8a483eb58b55719ef8de9cc4cdd`.
- Final package evidence persisted by documentation-only commit `e9001c0`.

## Architecture claim boundary

AS-BUILT diagrams may describe only components proven by source and retained evidence: browser UI, `/api/chat`, deterministic core/policy, typed client/product/persona/experience configuration, bounded `FactSelector`, OpenRouter server-side adapter, Vercel runtime, optional Chrome preview, optional n8n contract, GitHub CI/CD, and Graph Harness/evidence governance.

AWS is not part of the deployed release. Any AWS diagram is a TARGET / NOT DEPLOYED reference and must preserve the current application contracts unless explicitly marked as an optional future enhancement.

No application/runtime file is authorized for modification in this workstream.
