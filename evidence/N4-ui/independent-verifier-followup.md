# N4 independent verifier — follow-up

Recorded 2026-09-09T03:38:57Z (2026-09-08 Guatemala). Role: the independent verifier that recorded the original localized FAIL in `independent-verifier.md`.

**Verdict: PASS for the corrected local N4 UI behavior and regressions independently checked here.** Jump to latest now retains composer focus and immediate typing. Reset does not leave a ghost Jump control. Stop produces no unsolicited second request or late reply. No unresolved N4 defect was found in this follow-up.

The original FAIL report is preserved unchanged. This follow-up does not retroactively turn its original observations into passes.

## Scope and state

Reviewed the changes to `src/ui/support-chat.tsx` and the relevant `e2e/chat.spec.ts` regressions. `jumpToLatest` now focuses the composer before clearing the Jump state. The scroll handler ignores welcome state, and Jump rendering additionally requires a started conversation.

All browser work used the coordinator-owned, rebuilt production-mode mock server at `http://127.0.0.1:3100`. This verifier did not build, start, stop, reconfigure or deploy a server. The selected E2E cases and additional probe intercepted chat requests with synthetic responses. No live-provider call, environment-file read, credential inspection, source/Git/ledger edit or dependency installation was performed. This report is the only authored file in this follow-up.

The coordinator previously reported a macOS Chromium launcher infrastructure failure. That failure was not reproduced here: the independent probe launched Chromium `153.0.8010.12` successfully through the default execution environment, and the focused E2E run also launched normally. No escalated execution was used. This report makes no claim that the coordinator's earlier unstarted browser cases executed.

The coordinator updated knowledge configuration and added its own tests concurrently after this verifier's initial 218-test run. N4 UI and E2E files stayed frozen: all eight hashes below matched before and after the independent checks. The 218-test result records the suite this verifier actually ran at 03:36:56Z; it does not claim verification of the coordinator's later knowledge-refresh tests. The 15-test UI rerun and final typecheck occurred after the coordinator reported that configuration stable. Browser checks exercised the existing mock build, not the newly refreshed knowledge source.

## Independently executed commands

All commands ran from the Cadre AI project root.

| Exact command | Actual result |
| --- | --- |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm test` | Exit 0; 9 files, 218 tests passed; 405 ms; executed before notification of the concurrent knowledge-refresh changes |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run lint` | Exit 0 |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run typecheck` (first attempt) | Exit 2 due to duplicate generated declaration files under `.next/types`; details retained below |
| `rtk proxy env E2E_BASE_URL=http://127.0.0.1:3100 E2E_EXPECT_MODE=mock npm run test:e2e -- --grep 'reading earlier\|welcome starts\|keyboard topic\|keyboard retry\|cancelling prevents\|new conversation cannot\|client deadline\|loading is announced'` | Exit 0; 16/16 tests passed in 4.2 s, desktop and 360 × 800 mobile |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run typecheck` (after coordinator cleanup) | Exit 0; `tsc --noEmit` |
| `rtk proxy env CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm test -- tests/ui/conversation.test.ts` | Exit 0; 1 file, 15 tests passed; 116 ms |

The 16 focused browser cases covered loading/duplicate-send prevention, Stop/late-output rejection, older in-flight response isolation, keyboard Jump and scroll following, welcome/reset geometry and absence of Jump, keyboard Topic and Retry focus, and client deadline behavior. All eight scenarios passed at both browser viewports.

Nonfatal warnings persisted: the known Vite native-config-loader warning and the Playwright NO_COLOR/FORCE_COLOR warning. They did not prevent the recorded checks from completing.

### Initial typecheck failure and recovery

The first typecheck produced:

```text
.next/types/cache-life.d 2.ts(3,1): error TS6200: Definitions of the following identifiers conflict with those in another file: unstable_cache, updateTag, revalidateTag, revalidatePath, refresh, unstable_noStore, io, cacheTag, unstable_cacheTag, unstable_cacheLife
.next/types/routes.d 2.ts(54,8): error TS2300: Duplicate identifier 'LayoutProps'.
```

Read-only enumeration also found `validator 2.ts` and `root-params.d 2.ts`. This verifier independently confirmed these exact duplicate hashes for the two files named in diagnostics:

```text
4f984436b10cfb43ccf7fc3114dcb851cbefa4d58b7d8ae741aaae0f6e330129  .next/types/cache-life.d 2.ts
4f984436b10cfb43ccf7fc3114dcb851cbefa4d58b7d8ae741aaae0f6e330129  .next/types/cache-life.d.ts
e61dd2ef18c8ca0d04cc3cebc3edeec0f23b1ecd57d6ab432cd1201029d9c4e9  .next/types/routes.d 2.ts
e61dd2ef18c8ca0d04cc3cebc3edeec0f23b1ecd57d6ab432cd1201029d9c4e9  .next/types/routes.d.ts
```

The coordinator then reported verifying all four generated duplicates and moving them recoverably to `/tmp/cadre-generated-duplicates-32d6pI/`. This verifier performed no deletion or move and does not attribute that cleanup to itself. Its subsequent unmodified `npm run typecheck` passed. The failed initial run is retained as an infrastructure/artifact issue, not hidden or reclassified as a passed command. The origin of those duplicate files was not independently established.

## Additional independent browser assertions

The standalone synthetic probe below passed at 1280 × 800 and 360 × 800:

| Check | Desktop observation | Mobile observation |
| --- | --- | --- |
| Focus after keyboard Jump | TEXTAREA#message | TEXTAREA#message |
| Immediate typing | `next question` retained | `next question` retained |
| Gap from transcript bottom after Jump | 0 px | 0 px |
| Reset transcript scrollTop | 0 | 0 |
| Reset welcome heading top vs transcript top | 288.5 >= 227 | 289.984375 >= 241.984375 |
| Ghost Jump after reset and another scroll event | absent | absent |
| Stop requests before explicit Retry | 4 total: 3 completed + 1 stopped | 4 total: 3 completed + 1 stopped |
| Native-fetch abort flags | `[false,false,false,true]` | `[false,false,false,true]` |
| Assistant replies from the stopped request | 0 | 0 |
| User turns after explicit keyboard Retry | 1 | 1 |
| Total requests after explicit Retry | 5 | 5 |

The probe verified exactly one active request was stopped; releasing its held synthetic result did not initiate another request or render late output. The next request happened only after explicit keyboard Retry. Retry preserved the single user turn and composer focus. Browser pages and the browser were closed after the assertions. No screenshots or external-browser session were left by this probe.

Exact independently executed command (exit 0):

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
(async () => {
 const browser = await chromium.launch({ headless: true });
 try {
  console.log(JSON.stringify({ browser: "Chromium", version: browser.version() }));
  for (const viewport of [{ width: 1280, height: 800 }, { width: 360, height: 800 }]) {
   const page = await browser.newPage({ viewport });
   await page.addInitScript(() => {
    const nativeFetch = window.fetch;
    window.verifierSignals = [];
    window.fetch = (resource, options) => {
     if (String(resource).includes("/api/chat")) window.verifierSignals.push(options.signal);
     return nativeFetch(resource, options);
    };
   });
   let calls = 0;
   let hold = false;
   let release;
   const held = new Promise(resolve => { release = resolve; });
   await page.route("**/api/chat", async route => {
    calls++;
    if (hold) {
     await held;
     await route.fulfill({ json: { reply: "Late output must not appear.", kind: "grounded" } }).catch(() => {});
    } else await route.fulfill({ json: { reply: "A grounded paragraph. ".repeat(70), kind: "grounded" } });
   });
   await page.goto("http://127.0.0.1:3100/");
   await expect(page.getByText("Demo mode", { exact: true })).toBeVisible();
   const input = page.getByRole("textbox", { name: "Message", exact: true });
   const region = page.getByRole("region", { name: "Conversation", exact: true });
   const jump = page.getByRole("button", { name: "Jump to latest" });
   const users = page.locator("[data-role=user]");
   const answers = page.locator("[data-role=assistant]");
   const top = () => region.evaluate(el => el.scrollTop);
   await expect.poll(top).toBe(0);
   await expect(jump).toHaveCount(0);
   await region.evaluate(el => el.dispatchEvent(new Event("scroll")));
   await expect(jump).toHaveCount(0);
   for (let turn = 0; turn < 3; turn++) {
    await input.fill("services " + turn);
    await input.press("Enter");
    await expect(answers).toHaveCount(turn + 1);
   }
   await region.evaluate(el => { el.scrollTop = 0; el.dispatchEvent(new Event("scroll")); });
   await expect(jump).toBeVisible();
   await jump.focus();
   await jump.press("Enter");
   await expect(jump).toHaveCount(0);
   await expect(input).toBeFocused();
   const gap = await region.evaluate(el => el.scrollHeight - el.scrollTop - el.clientHeight);
   assert.ok(gap < 5);
   await page.keyboard.type("next question");
   await expect(input).toHaveValue("next question");
   assert.equal(calls, 3);
   const jumpFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }));
   await region.evaluate(el => { el.scrollTop = 0; el.dispatchEvent(new Event("scroll")); });
   await expect(jump).toBeVisible();
   await page.getByRole("button", { name: "New conversation" }).click();
   await expect(users).toHaveCount(0);
   await expect(answers).toHaveCount(0);
   await expect.poll(top).toBe(0);
   await expect(input).toBeFocused();
   await expect(jump).toHaveCount(0);
   await region.evaluate(el => { el.dispatchEvent(new Event("scroll")); });
   await page.waitForTimeout(100);
   await expect(jump).toHaveCount(0);
   const resetGeometry = await region.evaluate(el => ({ scrollTop: el.scrollTop, regionTop: el.getBoundingClientRect().top, headingTop: el.querySelector("h3").getBoundingClientRect().top }));
   assert.ok(resetGeometry.headingTop >= resetGeometry.regionTop);
   hold = true;
   await input.fill("held services request");
   await input.press("Enter");
   await expect.poll(() => calls).toBe(4);
   const stop = page.getByRole("button", { name: "Stop response", exact: true });
   await expect(stop).toBeVisible();
   await stop.click();
   await expect(page.getByRole("button", { name: "Retry response" })).toBeVisible();
   await expect(input).toHaveValue("held services request");
   await expect(input).toBeFocused();
   release();
   await page.waitForTimeout(150);
   assert.equal(calls, 4);
   await expect(answers).toHaveCount(0);
   await expect(users).toHaveCount(1);
   const signalStates = await page.evaluate(() => window.verifierSignals.map(signal => signal.aborted));
   assert.deepEqual(signalStates, [false, false, false, true]);
   hold = false;
   const retry = page.getByRole("button", { name: "Retry response" });
   await retry.focus();
   await retry.press("Enter");
   await expect(answers).toHaveCount(1);
   await expect(users).toHaveCount(1);
   await expect(input).toBeFocused();
   assert.equal(calls, 5);
   console.log(JSON.stringify({ viewport, result: "PASS", jumpFocus, jumpBottomGap: gap, typingRetained: true, resetGeometry, ghostJumpAfterReset: false, stopCallsBeforeRetry: 4, stoppedSignalStates: signalStates, stopLateAnswers: 0, userTurnsAfterRetry: 1, callsAfterExplicitRetry: calls }));
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
'
```

## Verified N4 source SHA-256 snapshot

These hashes were checked before the tests, after the focused browser run, and after the final typecheck. They remained identical.

```text
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
6990df17f301f65c319b67f38d4ee04dcd7780d2380015538012df5689d94e25  app/layout.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f  src/ui/support-chat.tsx
f246be240304c2e772f1c2d76594ec84535e9b6b563edded3047d88d4fbd6aba  tests/ui/conversation.test.ts
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
```

## Limits of the PASS

This is a local N4 follow-up verdict. It does not claim a fresh full 38-case suite on this latest snapshot; the latest independent browser regression run was 16 cases plus the additional focused probe. The original report retains the earlier independently executed 38-case result on its earlier hashes. Build execution remains coordinator-owned; this verifier did not rerun it.

Automated Chromium desktop/mobile checks are basic keyboard, interaction and layout evidence, not full WCAG conformance, assistive-technology testing, physical mobile/soft-keyboard testing or visual design approval. No live-model evaluation, newly refreshed knowledge audit, public/preview deployment smoke, credential-exposure audit, archive verification or release closure was independently performed here. Those require their own retained evidence.
