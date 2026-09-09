# N4 independent verifier — original result

Recorded 2026-09-09T03:14:45Z (2026-09-08 Guatemala). Role: independent verifier, separate from producer, critic, fixer and coordinator.

**Verdict: FAIL, localized to the additional Jump to latest keyboard-focus finding below.** The independently executed 218 unit/integration tests, typecheck, lint and all 38 browser cases passed. Those passes do not erase the additional observed issue. Preserve this original result and record any repair/re-verification separately.

## Independent execution and scope

Reviewed approved AC8 and N4 tasks; `app/page.tsx`, `app/layout.tsx`, `app/globals.css`; all `src/ui/` modules and `tests/ui/`; `e2e/chat.spec.ts`, Playwright configuration; and the original critic, fixer and coordinator-findings reports. The original critic's three findings were rechecked by the independently run browser regressions: Stop retained one request with no late answer and preserved retry/draft; initial/reset welcome remained top-aligned; keyboard Topic and Retry activation retained composer focus.

The coordinator owned the existing, rebuilt production-mode mock server at `http://127.0.0.1:3100`. This verifier did not start, stop, rebuild or reconfigure it. The E2E suite used that external URL; its real localhost round trips asserted Demo mode. Additional probes intercepted every chat request with synthetic responses. No live-provider calls, environment-file reads, credential inspection, code/Git/ledger edits, dependency installation or deployment were performed by this verifier. Its only authored file is this report; the test runner generated its normal ignored test results.

The checked source was at commit `df915d2fdb0952f772f00cd0de0e68f1dd5e4e6b` (`feat: add responsive support chat with safe retry and cancellation`). Other agents were updating project documentation. All eight reviewed hashes were unchanged when rechecked after the tests and independent probe.

## Actual commands and results

Commands ran from the project root. The E2E process explicitly used the existing server and did not trigger the Playwright web-server launcher.

| Exact command | Observed output/result |
| --- | --- |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm test` | Exit 0; Vitest 5.0.0; 9 files and 218 tests passed; 385 ms |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run typecheck` | Exit 0; `tsc --noEmit` |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run lint` | Exit 0; `eslint .` |
| `rtk proxy env E2E_BASE_URL=http://127.0.0.1:3100 E2E_EXPECT_MODE=mock npm run test:e2e` | Exit 0; 38 tests passed using 1 worker; 10.4 s |

The browser suite executed all 19 cases at desktop and mobile (360 × 800), including real localhost mock conversation and official links, ordinal clarification, loading and duplicate-submit prevention, failure/retry, Stop/late output, malformed responses, inert HTML and URL allowlisting, blank/multiline/IME entry, reset/no browser storage, width/control sizing, bounded history, long text/reduced motion, overlapping conversation cancellation, scroll following, welcome reset geometry, keyboard Topic/Retry focus, and the client deadline.

Nonfatal warnings: Vitest reported its existing Vite native-config-loader future compatibility warning; Playwright reported the existing NO_COLOR/FORCE_COLOR warning. Neither failed these commands. No build was run by this verifier during N4, and no coordinator build/test result is attributed here.

## P2 — Keyboard Jump to latest loses its focus target

Source: `src/ui/support-chat.tsx:84` (`jumpToLatest`) and `:250` (conditional Jump button).

The Jump handler sets `awayFromLatest` to false and scrolls the transcript. This removes the focused button without handing focus to a stable element. An independent browser probe created three long synthetic replies, scrolled to older messages, focused Jump to latest, and pressed Enter. On both desktop and mobile, scrolling succeeded but the active element became BODY. Typing immediately afterwards did not reach the composer. A subsequent Tab did reach the composer, so the problem is lost activation focus, not an inability to recover with Tab.

Observed results:

| Viewport | Synthetic chat requests | Active element after Enter | Transcript scrollTop | Draft after typing `next question` | Active element after Tab |
| --- | ---: | --- | ---: | --- | --- |
| 1280 × 800 | 3 | BODY, no id | 1462 | empty | TEXTAREA#message |
| 360 × 800 | 3 | BODY, no id | 2506 | empty | TEXTAREA#message |

This is another instance of the disappearing-control focus pattern already repaired for Topic and Retry. Preserve logical keyboard focus on a stable target when Jump is activated, and add a regression that checks focus after the button disappears. The existing scroll-following E2E case checks the scroll position but does not check this keyboard activation/focus behavior.

### Reproducible independent probe

The following command was executed with exit 0. It reports observed focus and typing outcomes; its exit status is not a pass assertion for the lost-focus behavior. Each created page and browser was closed.

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
(async () => {
 const browser=await chromium.launch({ headless:true });
 try {
  for(const viewport of [{width:1280,height:800},{width:360,height:800}]) {
   const page=await browser.newPage({viewport});
   let calls=0;
   await page.route("**/api/chat", route => { calls++; return route.fulfill({json:{reply:"A grounded paragraph. ".repeat(70),kind:"grounded"}}); });
   await page.goto("http://127.0.0.1:3100/");
   const input=page.getByRole("textbox",{name:"Message",exact:true});
   await expect(page.getByText("Demo mode",{exact:true})).toBeVisible();
   for(let turn=0;turn<3;turn++) {
    await input.fill("services "+turn); await input.press("Enter");
    await expect(page.locator("[data-role=assistant]")).toHaveCount(turn+1);
   }
   const region=page.getByRole("region",{name:"Conversation",exact:true});
   await region.evaluate(el=>{el.scrollTop=0;el.dispatchEvent(new Event("scroll"));});
   const jump=page.getByRole("button",{name:"Jump to latest"});
   await expect(jump).toBeVisible(); await jump.focus(); await jump.press("Enter");
   await expect(jump).toHaveCount(0);
   const afterJump=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,scrollTop:document.querySelector(".transcript").scrollTop}));
   await page.keyboard.type("next question");
   const draftAfterTyping=await input.inputValue();
   await page.keyboard.press("Tab");
   const afterTab=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id}));
   console.log(JSON.stringify({viewport,calls,afterJump,draftAfterTyping,afterTab}));
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
'
```

## Original source SHA-256 snapshot

```text
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
2706a116f8a9e3ce3a38e1beaecdc42ad0e775c9774ccd79809da932ae45b66f  src/ui/support-chat.tsx
f246be240304c2e772f1c2d76594ec84535e9b6b563edded3047d88d4fbd6aba  tests/ui/conversation.test.ts
0e4dc393ff6c21f7c238bd8e991b927ad5353378becf1195f965325914cd5139  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
```

## Limits

The automated desktop/mobile checks provide basic keyboard and layout evidence, not a complete accessibility certification, screen-reader study, real-device/soft-keyboard test, or visual design approval. No live model, production public URL, preview-deployment smoke, bundle/credential-exposure audit, archive verification or release closure was independently checked here. N4 needs the localized keyboard-focus repair and a distinct independent follow-up before an unqualified local verifier PASS.

