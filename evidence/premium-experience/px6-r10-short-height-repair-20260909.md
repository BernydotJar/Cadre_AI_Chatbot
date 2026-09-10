# PX6 revision 10 short-height compact geometry repair — 2026-09-09

Source snapshot: `6684266`.

Revision 9's detached clean verifier improved the PX6 browser matrix to 66/68. Every revision-8 defect class was green; the only remaining failures were the new pre-send welcome reachability regression at 320x568 in desktop/mobile projects. Runtime geometry measured the cause rather than relaxing the assertion: under the required text-spacing override, the compact card was ~500px tall, the header ~91.5px, the initial composer ~377px, leaving a 34px transcript viewport for a 46px topic row. The last verified topic could therefore reach only ~73.9% viewport visibility. The same test passed at 360x640.

Revision 10 changes only very short compact viewport geometry:

- at `<=430px` width and `<=590px` height, `.chat-card` uses `height:calc(100dvh - 12px)` instead of the normal `88dvh`;
- taller compact viewports retain the existing 88dvh bubble/sheet presentation;
- the revision-9 single-scroller state split remains unchanged: the unstarted welcome uses the transcript as its single vertical scroller; outer scrolling is enabled only after a conversation starts;
- the 320/360 reachability assertion remains strict and unchanged, including full visibility of the final verified topic and composer in the welcome state;
- all revision-8 fixes remain untouched: 240px started conversation minimum, post-scroll privacy reachability/containment, 16px mobile composer, and local-only E2E rate-limit client isolation.

No factual authority, persona behavior, provider, routing, API semantics, production rate-limit trust/default, or unrelated desktop/taller-mobile layout was changed.

Next action: independent source review. No revision-10 runtime PASS is claimed here.
