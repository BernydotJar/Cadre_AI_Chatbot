# Independent UI/UX standards critique

Result: **CHANGES_REQUESTED**. One reproduced low-vision layout defect (P2), one acceptance-contract documentation gap (P2), and one readability recommendation (P3). The ordinary desktop/mobile flows are substantially covered; this report is not a WCAG certification or a user study.

Reviewer: separate `uiux_standards_critic` agent, not the UI producer. Audit performed 2026-09-09 UTC (local date 2026-09-08). Source snapshot observed: `48dc22889e934afb4baaa721d4ca3490851d2f64`. No application, configuration, Git, graph, deployment or dependency edits were made by this reviewer. This report is the only authored repository change.

## Scope and evidence

Read the core UI, CSS, page/layout, current CLAUDE.md and plan.md, requirements/design, UX assessment, and existing browser tests. Investigated the anonymous public UI at `https://cadre-ai-chatbot-tawny.vercel.app`, not the optional extension. All `/api/chat` requests were intercepted and fulfilled with synthetic JSON or synthetic 503 responses: **12 intercepted requests across all completed probes; zero upstream chatbot/provider requests and zero paid inference**. No credentials were accessed. Public HTML/assets still came from the public deployment.

Inspected source hashes:

| File | SHA-256 |
|---|---|
| src/ui/support-chat.tsx | 3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051 |
| app/globals.css | ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25 |
| CLAUDE.md | 1e26a9c2d90f0c4cd7b74a4d5fc3fec956d05605c85cffee0e9dd6c8198a4a5e |
| plan.md | 7bc40755f9e4599d641e7d36d2c6267333d305c45ec5c98992be72eeb6b831d6 |

Independent Playwright/Chromium probes used 320×800, 360×800, 760×700 and 1280×900 viewports, followed by short 320×568 and 360×640 checks and one confirmatory geometry run. The first four contexts had no page exceptions. Default, answered, text-spaced answered and text-spaced failed states were measured. Screenshots were visually inspected for 360×800 and 1280×900 defaults, 320×800 text-spaced failure, and both short text-spaced failures. The first Chromium launch was blocked by sandbox MachPortRendezvous permissions before navigation; a scoped approved retry launched successfully. This was an environment failure, not an application failure.

Temporary raw evidence (coordinator may retain selected sanitized artifacts with this report):

| Artifact in /tmp/cadre-uiux-critic-jaezVD/ | SHA-256 |
|---|---|
| probe.mjs | f7dbec40fb5b4d70d1aa42cee5f5f5fae86845ffa7b46feea05de44354dc0975 |
| results.json | 601e499f31e24686106e4608551b5d0e2d069818b442f90c3a4aaa8d0d72f3f1 |
| short-view.mjs | 4fdbd1508675ba7e3b5f30452b1bcb293b10b88a39e4557c610805f129d73600 |
| short-results.json | 48e4d6b6e2a3acce0132b6811861eb1f3cba0dd39282af3b170cfd5592696743 |
| 320x568-spacing-failure.png | 1878d3949f0a9dd1f13d41db442d753038035dae15d1be33afdde8685e1bbe62 |

Commands actually run: `rtk proxy node /tmp/cadre-uiux-critic-jaezVD/probe.mjs` and `rtk proxy node /tmp/cadre-uiux-critic-jaezVD/short-view.mjs` (the latter twice, with geometry fields added before the confirmatory run). All completed with exit 0. These diagnostic scripts measure behavior; exit 0 is not itself a passing accessibility verdict. The entire existing E2E suite was reviewed but not rerun by this critic, and prior agent results are not relabeled as this agent's tests.

## Findings

### UX-F1 — P2: text spacing and error recovery can obscure the transcript

Locations: `app/globals.css:52` (fixed card height/overflow), `app/globals.css:61` (conversation flex area can shrink to zero), `app/globals.css:92` (non-shrinking composer), and `app/globals.css:170` (535 px minimum card on narrow screens).

Reproduction:

1. Open the public app in an isolated Chromium viewport of 320×568 CSS pixels. Intercept `/api/chat` with status 503 and JSON `{ "reply": "Temporary failure.", "kind": "error" }`.
2. Apply only the WCAG text-spacing test properties: `* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }`.
3. Enter `What services does Cadre AI offer?` and send once. The failed draft is restored as two lines and the recovery panel is shown.
4. Inspect or try to read the conversation transcript without dismissing the error or clearing the conversation.

Expected: the transcript, recovery controls, saved draft and privacy notice remain available; document scrolling is acceptable. Content must not disappear behind the composer as text expands.

Observed: the card remains 535 px high. The conversation-space box has height **0 px at y=290**, while the composer starts at **the same y=290** and is **467.5 px** high. The padded transcript's 44 px box extends behind the following composer. At 360×640, only **1 px** of conversation-space remains. The screenshot shows no usable transcript in the failed state. Setting transcript scrollTop to its maximum does not restore visible space. There is no horizontal overflow, demonstrating why the existing document-width assertion misses this defect.

This is a failure of the proposed text-spacing acceptance check and the product's small-viewport/content-preservation intent; it does not invalidate the earlier default-viewport passes. It is not a claim that every WCAG criterion was assessed. Reference: [W3C SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

Recommended repair: allow the card/document to grow when controls consume its height, or reserve meaningful visible transcript space with a layout that can expand. Do not solve it by hiding error/privacy text, removing user spacing, reducing text sizes, or forbidding zoom. Add a deterministic intercepted 320×568 failure-with-restored-multiline-draft regression that asserts visible non-overlapped transcript space and reachable recovery/privacy content. Verify 360×640 and desktop as well.

### UX-F2 — P2: root operating documents have no measurable UI/UX acceptance contract

Locations: `CLAUDE.md:54`, `CLAUDE.md:60`, `CLAUDE.md:72`–`89`; `plan.md:15`, `plan.md:25`, `plan.md:86`–`108`.

Observed: the architecture, boundaries, real agent roles and commands are strong. However, a future producer reading the required resume path receives no concise UI standard, exact layout/contrast/target thresholds, or rule distinguishing checked accessibility from unverified assistive-technology behavior. `docs/chatbot-ux-assessment.md` contains good UX decisions but is not linked as the normative UI read-before-edit contract in CLAUDE.md or a tracked acceptance matrix in plan.md. The public/live/archive status model is stronger than the UX acceptance model.

Expected under the owner's current request: persistent, discoverable rules that both producers and an independent critic can test, with requirement IDs and current evidence status. This is a new documentation gap identified for the requested strengthening, not evidence that the frozen N4 baseline was never approved.

Recommended repair: add the compact durable contract below to CLAUDE.md (or a directly linked canonical contract), and a small evidence/status matrix in plan.md referencing those IDs. Preserve S1–S6 and AC1–AC10 ownership in the frozen spec; do not duplicate mutable milestones or rewrite approval history. New criteria should be explicitly labeled an owner-requested quality clarification, not silently presented as previously verified.

### UX-F3 — P3: consequential helper/privacy text is visually too small

Locations: `app/globals.css:104`, `app/globals.css:111`–`112`, `app/globals.css:183`–`184`.

Observed at 360×800: keyboard help/counter are **8 px**, privacy copy **9 px**, and scope copy **10 px**; 1280×900 privacy copy is also **9 px**. The main hierarchy and spacing are clear, but the least readable text includes the external-model disclosure and the limit of the assistant's authority. Measured color contrast is adequate; this is a product readability recommendation, not a claim that WCAG imposes a universal minimum font size.

Recommended acceptance choice: use at least 12 px for important helper, error-detail, mode, boundary and privacy copy, while keeping the mobile composer at least 16 px. If the owner accepts that design target, fix UX-F1 at the same time and verify expansion rather than trading readability for fitting the existing fixed card.

## Agreed requirement / evidence assessment

| Area | Assessment | Basis and boundary |
|---|---|---|
| Honest scope, mode and contact route (S2–S6, UX brief) | PASS in inspected UI | Explicit no accounts/bookings/assessments; actual mode label; official contact with new-tab cue; no fictitious connected transfer. Does not independently revalidate every business fact. |
| Six supported starts / single primary composer | PASS in inspected defaults | Six actual buttons, labeled input and Send. Lower mobile starts require transcript scrolling; that is not itself a failure. |
| Keyboard, focus, hydration and IME (AC8) | SOURCE/TEST COVERAGE PRESENT | Stable composer focus, no response-arrival focus move, Enter/Shift+Enter/IME logic, disabled pre-hydration controls and prior regressions. Full keyboard and hydration suites not rerun by this critic. |
| Loading, failure, retry, cancellation (AC6/AC8) | PARTIAL | This critic reproduced safe failure + draft restoration with synthetic 503. Existing tests cover retry/cancel/deadline; failure layout has UX-F1. |
| Default reflow, 320/360/760/1280 widths | PASS in measured states | No horizontal document overflow in the four main probes. This is not a physical mobile keyboard, Safari, or 400% browser-zoom test. |
| Text-spacing, short narrow failed state | FAIL | UX-F1; default-width-only tests are insufficient. |
| Primary target size | PASS for inspected rendered controls | Send/contact/retry/reset and topic buttons meet the project's 44 px dimension target in measured states. Inline prose links are not held to the same product target. |
| Text/focus contrast | PASS for sampled tokens | Calculated foreground/background ratios below. This is not an exhaustive contrast audit of every state. |
| Live announcements and errors (UX brief) | SOURCE PRESENT; AT UNVERIFIED | Polite atomic status contains only the latest answer, errors have alerts; transcript is not a live region that reannounces all history. Actual VoiceOver/NVDA speech behavior still requires manual testing. |
| Scroll preservation / reset / bounded history | SOURCE/TEST COVERAGE PRESENT | Existing independent tests are retained; not claimed as new executions here. Short failed-state layout remains a gap. |
| Root documentation standards | FAIL against current owner request | UX-F2. |

Sample sRGB contrast calculations from actual CSS tokens: body `#292d29` on `#fffefa` **13.86:1**; muted text `#62665e` **5.81:1**; accent text `#a34830` **5.90:1**; placeholder `#707468` on white **4.79:1**; focus `#2d675b` on surface **6.50:1**; error text `#803f2d` on `#f9eee7` **6.90:1**. Border `#b8bdb0` on surface is **1.90:1**, a discoverability improvement opportunity, not automatically a failure when contrasting text identifies the control. Decorative topic numbers are aria-hidden and are not the sole topic labels. [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## Proposed compact UI/UX acceptance contract

These are proposed measurable owner-requested quality clarifications. The coordinator should adopt and track them explicitly; this report does not mark unrun checks as passed.

| ID | Durable rule for CLAUDE.md | Evidence required in plan.md |
|---|---|---|
| UX-01 | Clear assistant identity, accurate mock/live/unavailable label, six supported starts, permanent official contact and explicit no-account/no-booking/no-assessment boundary. No nonfunctional controls or fabricated progress. | Desktop/mobile screenshots + S1–S6 UI assertions. |
| UX-02 | Disable sending/typing until hydration owns state. One request at a time. Loading reflects an actual request; Stop aborts, timeout/failure preserves the draft, retry does not duplicate the turn, late responses cannot overwrite reset state. | Mock/intercepted cold-load, duplicate-submit, retry, cancel, timeout and reset regressions; zero paid calls in routine suite. |
| UX-03 | All controls have accessible names and keyboard operation. Enter sends, Shift+Enter adds a line, IME never sends prematurely. Visible focus; stable composer focus after user-activated disappearing controls; no focus theft on response arrival. | Keyboard/IME/focus tests; manual tab-order inspection. |
| UX-04 | Respect a user's transcript reading position; expose keyboard-operable Jump to latest. Keep display/history bounded, disclose truncation, reset local state honestly without claiming provider deletion. | Long-history, reading-position, jump/reset and persistence checks. |
| UX-05 | At 320, 360, 760 and 1280 CSS px widths, default/long/loading/error states reflow without unintended horizontal scrolling or obscured controls. At 320×568 and 360×640, text-spacing overrides must not hide transcript, recovery, draft or privacy. Permit document growth. | Geometry + screenshots + short-viewport text-spacing regressions; separately record a real 200% text/browser-zoom check and 400% reflow check when performed. |
| UX-06 | Normal text contrast ≥4.5:1; large text ≥3:1; required graphical/focus cues ≥3:1. Primary non-inline controls target ≥44×44 CSS px (product rule, stronger than AA's 24 px rule with exceptions). Important helper/privacy copy targets ≥12 px; mobile composer ≥16 px. | Calculated token/state contrast, target bounds, typography and visual QA. Mark the font-size policy as a design target, not a WCAG claim. |
| UX-07 | Expose progress/latest answer without moving focus or repeatedly announcing history; expose errors programmatically. Respect reduced motion. | DOM/ARIA and reduced-motion tests; actual screen-reader check reported as passed, failed or unverified. |
| UX-08 | Render responses as inert text. Only exact approved URLs are clickable with clear destinations; unknown facts/actions redirect honestly. Disclose external model processing and page-local history; never solicit private credentials. | Injection/link/boundary tests, visible privacy inspection, separately authorized bounded live response. |
| UX-09 | A UI change needs producer evidence, independent critique, fixes/regressions, independent verification and real artifact-linked gate decisions. Do not claim full accessibility conformance from smoke tests. | File/commit/deployment identity, commands, outcomes, evidence links, unresolved findings and owner-approved exceptions. |

Standards used to define proposed checks: [Reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Resize Text 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Text Spacing 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [Target Size 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), and [Status Messages 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html). The Understanding documents explain criteria; testing this subset does not establish full conformance.

## Unverified / handoff

No real VoiceOver/NVDA, Safari/Firefox, physical iOS/Android keyboard, browser zoom at 200%/400%, forced-colors, low-vision user study, complete WCAG evaluation, provider quality/latency, or extension UI review was performed. Existing reports cover some independent core behavior; they remain separate evidence. No production source mapping or claim that local HEAD alone proves deployment identity was made.

Next: coordinator fixes UX-F1, strengthens CLAUDE.md/plan.md with an explicit acceptance/evidence contract, decides the UX-F3 design target, and obtains fresh independent verification on the repaired snapshot. Do not close this finding solely because the older 42-test suite passes.
