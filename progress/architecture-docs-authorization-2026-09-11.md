# Donna Architecture & Documentation authorization

Date: 2026-09-11 UTC.

Owner instruction: finish the architecture/documentation task using Graph Engineering and Lucidchart MCP, with the released Donna r15 implementation frozen as the evidence baseline and AWS shown only as a separate TARGET / NOT DEPLOYED view.

## Frozen source boundary

- Public runtime release: PX6 revision 15.
- Runtime repair source: `af7e3ff91ae91fc231defe87fde0139bd1c7f298`.
- Published/deployed release closure: `f33461679ebbe5322a9030f1f2b17319874d7e03`.
- Public deployment: `dpl_DHvLHiEaTGgtDJNXEENugKER8HLr` on the existing `cadre-ai3 / cadre-ai-chatbot` Vercel project.
- Public verification: rate-aware 70/70 Playwright PASS.
- Documentation/evidence baseline after final package closure: `e9001c0` and descendants in this documentation-only workstream.

No application/runtime behavior may be changed by this workstream. Architecture statements labeled AS-BUILT must resolve to current repository source/evidence. AWS material must be labeled TARGET / NOT DEPLOYED and must not be presented as production evidence.
