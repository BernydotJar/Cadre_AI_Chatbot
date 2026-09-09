# N4 independent critic follow-up

Date: 2026-09-08. Reviewed fixed source: `src/ui/support-chat.tsx` SHA-256 `2706a116f8a9e3ce3a38e1beaecdc42ad0e775c9774ccd79809da932ae45b66f`.

**The three original findings are independently resolved. N4 remains FAIL/open for one additional P2: keyboard focus is lost after Jump to latest.** The original `critic.md` FAIL remains unchanged. This report is not a global N4 pass, release approval or live-provider verification.

## Original findings: verified fixes

I inspected the actual changed source and `fixer.md`, then ran independent Chromium probes against the coordinator's rebuilt production-mode mock server at `http://127.0.0.1:3100`. Every chat request was intercepted and fulfilled with synthetic responses; the probes did not consume the server's rate-limit window or use live inference. All browser contexts created by this critic were closed.

### P1 Stop resubmission — resolved

Tested four cases: 1280 × 800 and 360 × 800, each with mouse click and keyboard Enter activation of Stop. The probe wrapped native fetch only to observe the supplied AbortSignals, retained native browser fetch behavior, observed form submit events, and held the chat response until after Stop.

Every case produced:

```text
chat requests after Stop: 1
native fetch signal states: [true]
form submit events: 0
assistant replies after releasing held response: 0
visible user messages: 1
saved draft: services
Retry response: available
focus: TEXTAREA#message
```

Explicitly activating Retry afterward made exactly the intended second request. Its JSON payload equaled the original request, the UI displayed one assistant response, and focus remained in the composer. The fixed Stop handler prevents default activation before aborting; distinct React keys prevent Stop/Send button reuse. The operation-identity guard remains intact.

### P2 Initial/reset welcome scroll — resolved

Independently measured initial load and reset after one synthetic conversation. Both now start at `scrollTop = 0`, with the heading below the transcript's clipping boundary:

| Viewport | Initial scrollTop | Reset scrollTop | Transcript top | Welcome heading top |
| --- | ---: | ---: | ---: | ---: |
| 1280 × 800 | 0 | 0 | 227 | 288.5 |
| 360 × 800 | 0 | 0 | 241.98 | 289.98 |

The effect now applies bottom-following only when messages exist. The welcome heading was above the clipping boundary in the original review; this is a measured before/after correction.

### P2 Topic/Retry keyboard focus — resolved

At both viewport widths, focusing the first topic and pressing Enter leaves focus on `TEXTAREA#message` after the response. A separate replay of the original failure scenario—synthetic HTTP 503, keyboard activation of Retry, then successful synthetic response—also retains composer focus, produces exactly two identical request payloads and leaves one user/one assistant message.

I additionally held an answer, deliberately focused the header contact link, then released the answer. Focus stayed on that link. The fix therefore hands focus over when a transient control is activated, without stealing it when an asynchronous response arrives.

## Additional P2: Jump to latest loses keyboard focus — still open

The independent verifier first identified this remaining case; this critic then reproduced it independently at both 1280 × 800 and 360 × 800.

Location: `jumpToLatest` and the conditional jump button in `src/ui/support-chat.tsx`.

After a long synthetic response, scroll the transcript away from the latest message, focus `Jump to latest`, and press Enter. The transcript correctly reaches its bottom and the jump button disappears, but `document.activeElement` becomes `BODY` at both widths. Like the original Topic/Retry issue, a keyboard-activated control is unmounted without handing focus to a stable target. The fixed request-activation path is not involved in this control.

Observed:

```text
1280 px: atLatest=true, activeElement=BODY
360 px:  atLatest=true, activeElement=BODY
```

Give this activation a deliberate focus handoff, such as to the stable transcript region, without adding response-arrival autofocus. Add a regression assertion for the active element as well as scroll position. This finding remains open in the source/build reviewed here; a later localized fix requires its own verification.

The independently executed reproducer uses only synthetic browser responses and an existing server:

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1280, 360]) {
      const page = await browser.newPage({ viewport: { width, height: 800 } });
      await page.route("**/api/chat", route => route.fulfill({ json: {
        reply: "Approved synthetic information. ".repeat(60), kind: "grounded"
      } }));
      await page.goto("http://127.0.0.1:3100/");
      const input = page.getByRole("textbox", { name: "Message", exact: true });
      await input.fill("services");
      await input.press("Enter");
      await expect(page.locator("[data-role=assistant]")).toHaveCount(1);
      const transcript = page.locator(".transcript");
      await transcript.evaluate(element => { element.scrollTop = 0; });
      const jump = page.getByRole("button", { name: /Jump to latest/ });
      await expect(jump).toBeVisible();
      await jump.focus();
      await jump.press("Enter");
      await expect(jump).toHaveCount(0);
      console.log(JSON.stringify({ width,
        focus: await page.evaluate(() => document.activeElement?.tagName),
        atLatest: await transcript.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight <= 1)
      }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

## Visual inspection and evidence limits

I viewed the coordinator-created [desktop screenshot](ui-desktop.png) and [mobile screenshot](ui-mobile.png), rather than inferring their content from filenames. In these initial demo-state captures, the identity, heading, six entry points and composer form a clear hierarchy; controls do not visibly overlap, and the heading is no longer clipped by the initial scroll bug. The persistent Demo mode label is visible. This visual inspection covers the captured initial states, not all error, keyboard, device or conversation states, and is not a full accessibility certification.

Actual execution in this follow-up consisted of four `rtk proxy node -e` Chromium probe groups: Stop mouse/keyboard and explicit retry; initial/reset geometry, topic focus and no focus steal on answer arrival; original 503-to-retry focus; and the newly identified Jump control. Every assertion in the first three groups passed. The last group reproduced the open P2.

No build, server start/stop, environment change, dependency install, source edit, Git/ledger operation or deployment was performed by this critic. The coordinator's reported 218-test/build checks and 38-case browser suite were not rerun or claimed as independent execution here. The previously executed 15 helper tests and original source review remain documented in `critic.md`.

## SHA-256 evidence snapshot

Source hashes were read before the probes and the production set was rechecked after the original-three regression probes. Only the support component changed from the original critic production snapshot. The expanded browser test file changed under coordinator ownership.

```text
2706a116f8a9e3ce3a38e1beaecdc42ad0e775c9774ccd79809da932ae45b66f  src/ui/support-chat.tsx
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
f246be240304c2e772f1c2d76594ec84535e9b6b563edded3047d88d4fbd6aba  tests/ui/conversation.test.ts
0e4dc393ff6c21f7c238bd8e991b927ad5353378becf1195f965325914cd5139  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
154d05cae8419553d8fe7b27ba96c36935ec1482852bb885cb01ff6e64d861a8  evidence/N4-ui/ui-desktop.png
c5ad5b7339528957638b0907bf3257745811c4b236b10f6f5f0a5f7e44963be8  evidence/N4-ui/ui-mobile.png
```
