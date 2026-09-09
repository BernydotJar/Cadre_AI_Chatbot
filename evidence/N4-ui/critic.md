# N4 independent critic review

Date: 2026-09-08. Role: independent critic, separate from UI producer and coordinator/test author. **Outcome: FAIL on the original source snapshot below: one P1 and two P2 findings.** This is an observed browser review, not a planned check or a pass based on another role's report.

The critic read the approved specification and AC1–AC10, `docs/chatbot-ux-assessment.md`, the UI/page/layout/styles, helper tests, browser tests and Playwright configuration. All shell commands used `rtk proxy`. Only this report was written. No source, environment file, credential, Git, ledger, dependency, build, server lifecycle or deployment was changed. Browser work used the coordinator's existing production-mode mock server at `http://127.0.0.1:3100`; all chat requests in the critic's probes were fulfilled with synthetic responses by Playwright, without live inference.

## P1 — Stop cancels one request and immediately submits a new one

Location: `src/ui/support-chat.tsx:156-159` and `:256-257`.

Reproduced at both 1280 × 800 and 360 × 800. Hold `/api/chat`, send `services`, click `Stop response`, then release the held response. Instead of remaining stopped with a retry option, the UI silently makes a second request and displays `This late answer must not appear.` The first request's abort guard works; the displayed answer belongs to a new, uncancelled request. In live mode this can also initiate additional inference after the user explicitly stopped.

Observed native-fetch signals:

```text
before Stop: [false]
after Stop:  [true, false]
/api/chat calls: 2
assistant messages: 1
visible retry controls: 0
restored draft: empty
```

A separate event-observation probe recorded:

```text
click capture: Stop response, type=button, defaultPrevented=false
click bubble:  Stop response, type=button, defaultPrevented=false
submit capture: Send message, type=submit, defaultPrevented=false
```

The pending and idle branches reuse the button position. Aborting updates state during the click; the button becomes a submit button before browser default activation completes. `stopResponse` does not prevent that default action. Preserve the operation-identity guard, but explicitly prevent the Stop click from submitting and keep the Stop/Send activation lifecycle unambiguous. Regression assertions must include exactly one request after Stop, zero assistant replies from the held request, a retry option and the retained draft; checking only the first abort signal is insufficient.

## P2 — Initial and reset welcome screens start scrolled past their heading

Location: `src/ui/support-chat.tsx:64-68` and `:161-168`.

The follow-latest effect also runs with an empty transcript, so it scrolls the overflowing welcome content to the bottom on initial load and after `New conversation`. This clips the introductory heading instead of showing the intended starting state.

Observed geometry, identical before the first conversation and after reset:

| Viewport | scrollTop | clientHeight | scrollHeight | Transcript top | Welcome heading top |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1280 × 800 | 138 | 351 | 489 | 227 | 150.5 |
| 360 × 800 | 103 | 355 | 458 | 241.98 | 186.98 |

The heading begins above the transcript's clipping boundary. Keep the empty welcome state at `scrollTop = 0`; apply follow-latest behavior only to an actual conversation. Verify both initial load and reset, without relying on Playwright's `toBeVisible()` alone, since that assertion does not require the element to be fully inside an overflow viewport.

## P2 — Keyboard starts and retries lose focus when their buttons disappear

Location: `src/ui/support-chat.tsx:220-224` and `:243-245`, calling `requestReply` at `:87-96` without a focus handoff.

Focus the `what Cadre AI does` suggestion and press Enter. After its answer, `document.activeElement` is `BODY`, on desktop and mobile. Similarly, trigger a synthetic 503, focus `Retry response`, and press Enter: the successful retry also leaves focus on `BODY`. These buttons are removed as the request starts, so keyboard users lose their position rather than continuing at the stable composer. For comparison, `New conversation` correctly leaves focus on `TEXTAREA#message`.

Hand focus to a stable target when activating a control that will disappear, such as the composer, while retaining the current rule against moving focus merely because an asynchronous answer arrived. Verify keyboard topic activation, retry, and continued typing; do not solve this by stealing focus from users who intentionally navigate elsewhere during a request.

## Actual checks and boundaries

Independently executed:

```sh
rtk proxy npm test -- --reporter=dot tests/ui/conversation.test.ts
```

Result: **1 file, 15 tests passed**, exit 0. The existing non-failing Vite configuration-loading warning remains. These tests cover exact URL allowlisting, response discriminator/length validation, bounded outgoing history and clarification retention. They did not catch the browser event lifecycle above.

The critic then executed four inline `rtk proxy node -e` Playwright probes using the installed `@playwright/test` Chromium launcher: initial mobile scroll; held-response Stop at desktop/mobile; click/submit event timeline; keyboard topic/retry focus plus initial/reset scroll. Every page/context/browser created by these probes was closed. The coordinator still owns the server, and no browser remains open from this review.

Useful properties confirmed by source inspection and the helper run:

- Message rendering uses React text nodes, with clickable URLs constrained to the exact approved set and external anchors using `noopener noreferrer`.
- Display history is capped at 40 messages; outbound history is capped at 20 messages and 2,000 characters per message. The first clarification pair is retained separately to support the one-clarification rule.
- An active-operation identity check prevents an old operation from directly overwriting a new conversation. The Stop finding is a second submission, not an absence of that check.
- The server page now checks live configuration before displaying its mode label; mock mode is explicitly labeled, and the page explains external model processing without promising provider retention guarantees.
- IME guards include composition state, `isComposing` and key code 229. Styles include focus treatments, text wrapping, 44 px primary controls and reduced-motion handling. These static properties are not a full accessibility certification.

The earlier interim concerns about a non-string response kind, an empty visible alert and a missing/expired live configuration label were resolved before this frozen snapshot: the helper validates a string enum, empty validation text is hidden by CSS, and the server page checks configuration. They are not additional remaining findings. The coordinator identified some full-suite alert locators matching Next's announcer outside `main`; that test-selector issue is separate from the three product findings above.

The critic did not independently run the full 30-case browser suite, lint, typecheck, production build, bundle scan, real-provider requests or public deployment checks. The coordinator's reported full-suite result is not presented here as this critic's own execution. No screenshot-based visual design approval, WCAG conformance or live deployment completion is claimed.

## Reproduce the Stop finding against the existing mock server

This command observes the real browser event sequence, preserves native fetch behavior and intercepts only chat responses. It does not start a server or use an API credential.

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.addInitScript(() => {
    const original = window.fetch;
    window.criticSignals = [];
    window.criticEvents = [];
    window.fetch = (resource, options) => {
      if (String(resource).includes("/api/chat")) window.criticSignals.push(options.signal);
      return original(resource, options);
    };
    for (const [event, capture] of [["click", true], ["click", false], ["submit", true]]) {
      document.addEventListener(event, e => {
        const button = event === "submit" ? e.submitter : e.target.closest?.("button");
        if (button) window.criticEvents.push({ event, capture,
          label: button.getAttribute("aria-label"), type: button.type,
          defaultPrevented: e.defaultPrevented });
      }, capture);
    }
  });
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let calls = 0;
  await page.route("**/api/chat", async route => {
    calls++;
    await held;
    await route.fulfill({ json: { reply: "This late answer must not appear.", kind: "grounded" } }).catch(() => {});
  });
  await page.goto("http://127.0.0.1:3100/");
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  await input.fill("services");
  await input.press("Enter");
  const stop = page.getByRole("button", { name: "Stop response", exact: true });
  await expect(stop).toBeVisible();
  await stop.click();
  const observations = await page.evaluate(() => ({
    aborted: window.criticSignals.map(signal => signal.aborted),
    events: window.criticEvents
  }));
  release();
  await expect(stop).toHaveCount(0);
  await page.waitForTimeout(150);
  console.log(JSON.stringify({ calls, observations,
    assistant: await page.locator("[data-role=assistant]").allTextContents(),
    retry: await page.getByRole("button", { name: "Retry response" }).count(),
    draft: await input.inputValue() }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

For focus/scroll reproduction, use a fresh page at each viewport with a synthetic successful chat response. Read `.transcript`'s `scrollTop`, `clientHeight`, `scrollHeight` and bounding top, plus `.welcome h3`'s bounding top. Focus the topic button and use `press("Enter")`; after the answer, read `document.activeElement.tagName/id`. Click `New conversation`, then repeat the geometry read. For retry, return 503 once and 200 next, focus `Retry response`, press Enter, wait for the answer, and inspect the active element again.

## Original source snapshot — SHA-256

The production hashes were rechecked after all critic browser probes and remained unchanged.

```text
93a838e78fd177365f5a3284d6ff28c447e3ed0b008d83b0530a6a9cd8d11909  src/ui/support-chat.tsx
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
f246be240304c2e772f1c2d76594ec84535e9b6b563edded3047d88d4fbd6aba  tests/ui/conversation.test.ts
8e88eb5cf7f50b009aac8f5a05e1100e4fea6a5aca0e8f0628efb6c9a91cf19b  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
```

All three findings are unresolved in this original report. Preserve them and append a distinct follow-up after the fixer and independent browser verification, rather than replacing this initial FAIL with an unqualified pass.
