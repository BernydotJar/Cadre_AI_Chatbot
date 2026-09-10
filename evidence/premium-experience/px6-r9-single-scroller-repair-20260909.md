# PX6 revision 9 single-scroller repair — 2026-09-09

Source snapshot: `03022df`.

Revision 8's independent Claude source review identified one additional accessibility risk before runtime verification: at `<=430px`, the new outer `.chat-card` vertical scrolling applied before the first send while the welcome `.transcript` was already its own vertical scroller.

Revision 9 closes only that finding:

- the compact outer `.chat-card` may scroll vertically only when `data-started="true"`;
- the unstarted welcome state retains the inherited clipped outer card and the `.transcript` as its single vertical scroller;
- the 320x568 and 360x640 text-spacing regression now explicitly verifies the pre-send contract: outer `overflow-y:hidden`, inner transcript `overflow-y:auto`, the final verified-topic entry can be brought fully into view, and the composer remains fully visible outside that scroller;
- the revision-8 started-state repairs remain intact: 240px minimum conversation region, scrollable compact started sheet under expanded text spacing, 16px mobile composer, and local-only Playwright rate-limit bucket isolation;
- documentation now states the pre-send vs started scrolling contract explicitly.

No factual authority, persona behavior, provider selection, route semantics, API error behavior, or production rate-limit trust/default changed.

Next action: independent source re-review. No revision-9 runtime PASS is claimed here.
