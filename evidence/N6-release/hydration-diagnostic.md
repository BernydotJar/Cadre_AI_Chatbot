# Public first-Enter hydration diagnostic

Role: independent verifier. This report follows the inconclusive single live-browser attempt and preserves `independent-live-browser.md` unchanged.

**Finding: confirmed input-readiness defect.** The public page enables its textarea, Send button and topic buttons in server-rendered HTML before React's input state and handlers are ready. Input entered in that interval changes the DOM but does not update the React draft. The first Enter can add a native newline without creating a chat request. Hydration does not automatically reconcile that typed text with the empty draft.

All diagnostic chat traffic was intercepted and fulfilled synthetically. No real inference request, paid call, environment/credential access, source/test edit, Git/ledger change, build, server change or deployment was performed.

## Actual diagnostic scope

Five fresh anonymous desktop contexts at the public URL:

https://cadre-ai-chatbot-tawny.vercel.app/

- Three ordinary cold `DOMContentLoaded` cases, filling immediately after the Message field became visible.
- One case waiting for an observable client-effect marker before filling: the composer inline height set by the existing React sizing effect.
- One controlled case holding six Next.js script requests, using visible server-rendered controls before releasing the scripts, then inspecting behavior after hydration.

All five completed. Total command duration was 3,509 ms; the 50-second outer deadline did not fire. No fixed-duration sleep was used: comparisons waited on DOM readiness, visible synthetic responses, or animation-frame boundaries. The delayed-script gate was explicitly released. The probe only observed events and DOM state; it did not install native form/input behavior or alter the application.

The inline-height marker is a diagnostic observation tied to the current source's sizing effect, not a recommended permanent readiness API or generic proof that every feature has initialized.

## Reproduced outcomes

| Case/phase | DOM draft | Displayed counter | Client effect marker | API POSTs | Visible user/assistant bubbles |
| --- | --- | --- | --- | ---: | --- |
| Cold fill, 3/3 runs | 20 characters, exact question | 0 / 2,000 | absent | 0 | 0 / 0 |
| Cold first Enter, 3/3 runs | 21 characters, trailing newline | 0 / 2,000 | absent | 0 | 0 / 0 |
| Same runs after hydration | 21 characters, trailing newline | 0 / 2,000 | 66 px inline height | 0 | 0 / 0 |
| Wait for effect, then fill | 20 characters, exact question | 20 / 2,000 | 44 px inline height | 0 before Enter | 0 / 0 |
| Ready first Enter | empty after send | 0 / 2,000 | present | 1 synthetic | 1 / 1 |
| Scripts held: first Enter | 21 characters, trailing newline | 0 / 2,000 | absent | 0 | 0 / 0 |
| Scripts released/hydrated | 21 characters, trailing newline | 0 / 2,000 | 66 px inline height | 0 | 0 / 0 |
| Enter after hydration without refilling | cleared; validation appeared | 0 / 2,000 | present | 0 | 0 / 0 |
| Refill after hydration, then Enter | empty after successful send | 0 / 2,000 | 44 px inline height | 1 synthetic | 1 / 1 |

Before the client effect in all cold/held cases, `textarea.disabled`, `textarea.readOnly`, Send disabled and first-topic disabled were all false. The UI therefore advertised usable controls during the interval that lost input state.

Both successful synthetic requests contained exactly one message with the intended question, `Do you serve hotels?`. There were two intercepted chat POSTs across the entire diagnostic command and no actual chat-server/provider calls.

All five contexts reported:

- No page errors.
- No failed requests.
- No HTTP-error responses for scripts.

Error capture was restricted to safe names, React error codes, URL pathnames without queries, resource types and network error codes; no raw error messages, response text, request bodies, headers or credentials were retained. The diagnostic's synthetic reply was not a live model response.

## Cause and interpretation

The inspected source stores the draft in React state. `onChange` updates it; `onKeyDown` calls `send(draft)` for Enter. The server-rendered controls have no readiness guard. Before those handlers run, filling the visible textarea updates only its DOM value. The unchanged counter independently exposes that the React draft is still empty.

The controlled delayed-JavaScript case demonstrates the mismatch directly. After scripts were released, the visible draft still had 21 characters, but the counter was zero. The next Enter called the now-active React handler with the empty draft, produced validation, and cleared the visible text. Filling again after hydration updated the counter and produced one synthetic request.

This explains a reproducible mechanism for the earlier zero-POST outcome. The original single paid-authorized attempt did not record hydration-marker/counter snapshots, so its exact historical internal state cannot be retroactively proven. The independent original INCONCLUSIVE verdict remains unchanged. Nothing in this diagnostic indicates a provider rejection or credential failure: the failing interaction never reached the chat API.

The current E2E setup uses `page.goto("/")` with the browser's default load wait, whereas the failed standalone attempt used `DOMContentLoaded`. Those are different readiness conditions. Neither a visible field nor a visible live-configuration label establishes that React is ready to accept the first interaction. Earlier loaded-page passes do not cover the controlled pre-hydration gap.

The document-level Enter event observer recorded `defaultPrevented: false` in both cold and successful ready cases; listener ordering makes that field unsuitable as the distinguishing signal. The diagnosis relies on actual draft/counter divergence, native newline, bubbles and intercepted-request counts instead.

## Suggested repair and regression boundary

No fix was applied by this verifier. A focused repair should expose explicit readiness from the initial server-rendered state, prevent activation of the textarea/Send/topic surfaces until the client is ready, and communicate initialization. That avoids accepting text which the application cannot yet retain. Merely slowing the browser test would not correct the enabled pre-hydration UI.

A deterministic regression can hold the initial JavaScript chunks, inspect the server-rendered controls as disabled/not accepting input, release the scripts, wait for the explicit ready state, then fill and press Enter once. It should assert exactly one intercepted POST with the intact question, one user bubble and one response. Existing Stop, reset, IME and keyboard-focus behaviors should remain separately checked.

These are implementation/test recommendations for the coordinator, not changes performed in this task.

## Exact command executed

Exit 0 means the diagnostic completed; the observed product defect is recorded above. All pages and browser instances were closed.

```sh
rtk proxy node -e '
const { chromium } = require("@playwright/test");
const question = "Do you serve hotels?";
const target = "https://cadre-ai-chatbot-tawny.vercel.app/";
let browser;
let timedOut = false;
const results = [];
const started = Date.now();
const timer = setTimeout(() => { timedOut = true; void browser?.close().catch(() => {}); }, 50000);
async function settleFrames(page) {
 await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function snapshot(page, label, apiCount) {
 return page.evaluate(({ label, apiCount, question }) => {
  const input = document.getElementById("message");
  return {
   label, apiCount, draftLength: input.value.length, draftMatchesQuestion: input.value === question,
   draftEndsInNewline: input.value.endsWith("\n"), characterCounter: document.querySelector(".character-count")?.textContent,
   inlineHeight: input.style.height, inputDisabled: input.disabled, inputReadOnly: input.readOnly,
   sendDisabled: document.querySelector('\''[aria-label="Send message"]'\'')?.disabled ?? null,
   topicDisabled: document.querySelector(".topic-button")?.disabled ?? null,
   userBubbles: document.querySelectorAll("[data-role=user]").length,
   assistantBubbles: document.querySelectorAll("[data-role=assistant]").length,
   activeTag: document.activeElement.tagName, activeId: document.activeElement.id,
   validationPresent: Boolean(document.getElementById("message-validation")?.textContent),
   enterEvents: window.hydrationDiagEvents.filter(event => event.kind === "enter"),
  };
 }, { label, apiCount, question });
}
async function run(label, readiness, delayScripts) {
 const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
 const page = await context.newPage();
 page.setDefaultTimeout(7000);
 const faults = { pageErrors: [], failedRequests: [], scriptHttpErrors: [] };
 let apiCount = 0;
 let exactQuestions = 0;
 let heldScripts = 0;
 let release;
 const gate = new Promise(resolve => { release = resolve; });
 await page.addInitScript(() => {
  window.hydrationDiagEvents = [];
  document.addEventListener("keydown", event => {
   if (event.target?.id === "message" && event.key === "Enter") {
    window.hydrationDiagEvents.push({ kind: "enter", defaultPrevented: event.defaultPrevented, isComposing: event.isComposing, keyCode: event.keyCode });
   }
  });
 });
 page.on("pageerror", error => faults.pageErrors.push({ name: error.name, reactCode: error.message.match(/Minified React error #(\d+)/)?.[1] ?? null }));
 page.on("requestfailed", request => faults.failedRequests.push({
  path: new URL(request.url()).pathname, type: request.resourceType(),
  code: request.failure()?.errorText.match(/(?:net::)?ERR_[A-Z0-9_]+/)?.[0] ?? "request_failed",
 }));
 page.on("response", response => {
  if (response.request().resourceType() === "script" && response.status() >= 400) faults.scriptHttpErrors.push({ path: new URL(response.url()).pathname, status: response.status() });
 });
 await page.route("**/*", async route => {
  const request = route.request();
  const url = new URL(request.url());
  if (url.pathname === "/api/chat") {
   if (request.method() === "POST") {
    apiCount++;
    const payload = request.postDataJSON();
    if (payload.messages?.length === 1 && payload.messages[0].content === question) exactQuestions++;
   }
   await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reply: "Synthetic hotel response.", kind: "grounded" }) });
   return;
  }
  if (delayScripts && request.resourceType() === "script" && url.pathname.startsWith("/_next/")) {
   heldScripts++;
   await gate;
  }
  await route.continue();
 });
 const snapshots = [];
 try {
  await page.goto(target, { waitUntil: delayScripts ? "commit" : "domcontentloaded", timeout: 12000 });
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  await input.waitFor({ state: "visible" });
  if (readiness) await page.waitForFunction(() => document.getElementById("message")?.style.height.length > 0);
  snapshots.push(await snapshot(page, "before-fill", apiCount));
  await input.fill(question);
  snapshots.push(await snapshot(page, "after-fill-before-enter", apiCount));
  await input.press("Enter");
  await settleFrames(page);
  if (apiCount > 0) await page.locator("[data-role=assistant]").waitFor({ state: "visible" });
  snapshots.push(await snapshot(page, "after-first-enter", apiCount));
  if (delayScripts) {
   release();
   await page.waitForFunction(() => document.getElementById("message")?.style.height.length > 0);
   await settleFrames(page);
   snapshots.push(await snapshot(page, "after-js-release", apiCount));
   await input.press("Enter");
   await settleFrames(page);
   if (apiCount > 0) await page.locator("[data-role=assistant]").waitFor({ state: "visible" });
   snapshots.push(await snapshot(page, "enter-after-hydration-without-refill", apiCount));
   await input.fill(question);
   await input.press("Enter");
   await page.locator("[data-role=assistant]").waitFor({ state: "visible" });
   snapshots.push(await snapshot(page, "after-hydrated-refill-and-enter", apiCount));
  } else {
   await page.waitForFunction(() => document.getElementById("message")?.style.height.length > 0);
   await settleFrames(page);
   if (apiCount > 0) await page.locator("[data-role=assistant]").waitFor({ state: "visible" });
   snapshots.push(await snapshot(page, "settled-after-hydration", apiCount));
  }
  return { label, readinessWait: readiness, delayScripts, heldScripts, apiCount, exactQuestions, snapshots, faults, completed: true };
 } catch (error) {
  return { label, readinessWait: readiness, delayScripts, heldScripts, apiCount, exactQuestions, snapshots, faults, completed: false, failureName: error.name };
 } finally {
  release();
  await context.close();
 }
}
(async () => {
 browser = await chromium.launch({ headless: true, timeout: 8000 });
 for (const [label, ready, delayed] of [
  ["cold-domcontentloaded-1", false, false],
  ["cold-domcontentloaded-2", false, false],
  ["cold-domcontentloaded-3", false, false],
  ["hydration-effect-ready", true, false],
  ["controlled-delayed-js", false, true],
 ]) results.push(await run(label, ready, delayed));
})().catch(error => { results.push({ setupFailureName: error.name }); process.exitCode = 1; }).finally(async () => {
 clearTimeout(timer);
 if (browser) await browser.close().catch(() => {});
 console.log(JSON.stringify({ target, mode: "all-chat-intercepted", totalMs: Date.now() - started, timedOut, results }));
});
'
```

## Sanitized actual observations

```json
{"target":"https://cadre-ai-chatbot-tawny.vercel.app/","mode":"all-chat-intercepted","totalMs":3509,"timedOut":false,"results":[{"label":"cold-domcontentloaded-1","readinessWait":false,"delayScripts":false,"heldScripts":0,"apiCount":0,"exactQuestions":0,"snapshots":[{"label":"before-fill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"BODY","activeId":"","validationPresent":false,"enterEvents":[]},{"label":"after-fill-before-enter","apiCount":0,"draftLength":20,"draftMatchesQuestion":true,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[]},{"label":"after-first-enter","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"settled-after-hydration","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"66px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]}],"faults":{"pageErrors":[],"failedRequests":[],"scriptHttpErrors":[]},"completed":true},{"label":"cold-domcontentloaded-2","readinessWait":false,"delayScripts":false,"heldScripts":0,"apiCount":0,"exactQuestions":0,"snapshots":[{"label":"before-fill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"BODY","activeId":"","validationPresent":false,"enterEvents":[]},{"label":"after-fill-before-enter","apiCount":0,"draftLength":20,"draftMatchesQuestion":true,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[]},{"label":"after-first-enter","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"settled-after-hydration","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"66px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]}],"faults":{"pageErrors":[],"failedRequests":[],"scriptHttpErrors":[]},"completed":true},{"label":"cold-domcontentloaded-3","readinessWait":false,"delayScripts":false,"heldScripts":0,"apiCount":0,"exactQuestions":0,"snapshots":[{"label":"before-fill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"BODY","activeId":"","validationPresent":false,"enterEvents":[]},{"label":"after-fill-before-enter","apiCount":0,"draftLength":20,"draftMatchesQuestion":true,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[]},{"label":"after-first-enter","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"settled-after-hydration","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"66px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]}],"faults":{"pageErrors":[],"failedRequests":[],"scriptHttpErrors":[]},"completed":true},{"label":"hydration-effect-ready","readinessWait":true,"delayScripts":false,"heldScripts":0,"apiCount":1,"exactQuestions":1,"snapshots":[{"label":"before-fill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"44px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"BODY","activeId":"","validationPresent":false,"enterEvents":[]},{"label":"after-fill-before-enter","apiCount":0,"draftLength":20,"draftMatchesQuestion":true,"draftEndsInNewline":false,"characterCounter":"20 / 2,000","inlineHeight":"44px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[]},{"label":"after-first-enter","apiCount":1,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"44px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":null,"userBubbles":1,"assistantBubbles":1,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"settled-after-hydration","apiCount":1,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"44px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":null,"userBubbles":1,"assistantBubbles":1,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]}],"faults":{"pageErrors":[],"failedRequests":[],"scriptHttpErrors":[]},"completed":true},{"label":"controlled-delayed-js","readinessWait":false,"delayScripts":true,"heldScripts":6,"apiCount":1,"exactQuestions":1,"snapshots":[{"label":"before-fill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"BODY","activeId":"","validationPresent":false,"enterEvents":[]},{"label":"after-fill-before-enter","apiCount":0,"draftLength":20,"draftMatchesQuestion":true,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[]},{"label":"after-first-enter","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"after-js-release","apiCount":0,"draftLength":21,"draftMatchesQuestion":false,"draftEndsInNewline":true,"characterCounter":"0 / 2,000","inlineHeight":"66px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"enter-after-hydration-without-refill","apiCount":0,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"66px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":false,"userBubbles":0,"assistantBubbles":0,"activeTag":"TEXTAREA","activeId":"message","validationPresent":true,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13},{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]},{"label":"after-hydrated-refill-and-enter","apiCount":1,"draftLength":0,"draftMatchesQuestion":false,"draftEndsInNewline":false,"characterCounter":"0 / 2,000","inlineHeight":"44px","inputDisabled":false,"inputReadOnly":false,"sendDisabled":false,"topicDisabled":null,"userBubbles":1,"assistantBubbles":1,"activeTag":"TEXTAREA","activeId":"message","validationPresent":false,"enterEvents":[{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13},{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13},{"kind":"enter","defaultPrevented":false,"isComposing":false,"keyCode":13}]}],"faults":{"pageErrors":[],"failedRequests":[],"scriptHttpErrors":[]},"completed":true}]}
```

## Reviewed local source hashes at diagnostic start

```text
a3fa04964197ec149e88b53769fbab93da15fddb6fcd589508bdc694659b0d8f  src/ui/support-chat.tsx
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
```

These identify reviewed local source; they do not independently establish a deployed commit hash. Instrumented fresh contexts and deliberately delayed scripts establish a reproducible readiness gap, not its prevalence among normal users. No new live-model response, spend result, release pass or source fix is claimed.

