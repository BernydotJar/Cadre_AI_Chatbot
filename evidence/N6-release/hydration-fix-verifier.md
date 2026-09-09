# Hydration repair — independent verifier

Recorded 2026-09-09T04:29:25Z (2026-09-08 Guatemala). Role: independent verifier.

**Verdict: PASS for the repaired local core UI.** This verifier independently executed all 42 browser cases and four additional cold-`DOMContentLoaded` probes against the already-built production application in mock mode. The original hydration diagnostic and inconclusive live-browser artifact remain unchanged.

The coordinator identified the repaired core as `c6f781c`. This verifier did not use Git; its inspected/executed scope is identified by the SHA-256 snapshot below. Those hashes matched at the beginning and again before this report was saved. The already-completed checks were not rerun merely because the task was resumed after an interruption.

## Reviewed repair and scope

Read the repaired `src/ui/support-chat.tsx`, the complete `e2e/hydration.spec.ts`, and the existing browser configuration. The repaired UI uses a false server/initial-hydration readiness snapshot and a true client snapshot. Before readiness it disables the textarea, Send and all six topic buttons and displays initialization/help text. The existing draft, single-flight, Stop, reset, IME and focus behavior remains subject to the independently executed regressions.

The coordinator supplied the current production build. **No build was performed by this verifier.** No live inference, public/deployed browser check, deployment, source/test edit, Git/ledger operation, credential inspection or environment-file read was performed. Mock mode and synthetic credentials were explicit for both local server workflows.

The full Playwright command used its configured managed localhost server. Additional probes used a separately owned, ephemeral localhost-only server from that same existing build; its process and browser were closed by the probe's awaited cleanup. A later read-only check found no listener on port 3100.

## Actual full-suite command and output

Executed from the Cadre AI project root:

```sh
rtk proxy env -u E2E_BASE_URL E2E_EXPECT_MODE=mock CHAT_PROVIDER=mock OPENROUTER_API_KEY=synthetic-independent-verifier NEXT_TELEMETRY_DISABLED=1 npm run test:e2e
```

Observed output:

```text
Running 42 tests using 1 worker
42 passed (11.2s)
Exit: 0
```

All 21 cases ran at both desktop and mobile:

- The existing 19 chat cases included the real localhost mock round trip, clarification, loading/duplicate prevention, failure/retry, Stop, malformed/inert output, link allowlisting, blank/multiline/IME input, reset/storage, layout bounds, history/output length, old-operation isolation, scroll/Jump behavior, welcome positioning, keyboard Topic/Retry focus, and the client deadline.
- The delayed-JavaScript case held script loading, confirmed visible but disabled textarea/Send/all six topic controls and zero requests, released the scripts, waited until editable, filled the exact question, checked the 20-character counter, and asserted one exact synthetic POST and one response.
- The JavaScript-disabled case confirmed disabled chat controls, all six topics, fallback guidance and a visible official contact link. Its separate context explicitly received the project's viewport; desktop and mobile were both exercised.

The known NO_COLOR/FORCE_COLOR warning was nonfatal. Chromium launch/local-server execution used a narrowly approved sandbox escalation after the environment became restricted. No escalation rejection occurred.

## Additional independent cold-load probes

The inline command below completed with exit 0 using Chromium `153.0.8010.12`. It ran two fresh contexts per viewport, four total. Every navigation explicitly used `DOMContentLoaded`; all chat responses were intercepted synthetically.

| Viewport | Runs | Exact first POST per run | User / assistant bubbles | Rapid extra Enter while pending | Focus and next typing |
| --- | ---: | ---: | --- | --- | --- |
| 1280 × 900 | 2 | 1 | 1 / 1 | no duplicate POST | retained in composer |
| 360 × 800 | 2 | 1 | 1 / 1 | no duplicate POST | retained in composer |

All four first payloads were exactly one user message with `Do you serve hotels?`. The counter reached `20 / 2,000` before submission. The pending composer was read-only; another Enter while its response was held did not submit again. Releasing the held response produced one answer, retained focus, and allowed typing `next question`. No page errors were observed.

In these fast local runs, the textarea was already enabled by the time it was sampled; the command's recorded `disabledAtObservation` is false in all four. These cases verify the first interaction after readiness and do not themselves demonstrate the pre-hydration disabled interval. The deterministic script-held full-suite cases above provide that evidence. No fixed sleep was used to make the input appear ready.

Exact executed command:

```sh
rtk proxy node -e '
const { chromium, expect } = require("@playwright/test");
const { spawn } = require("node:child_process");
const net = require("node:net");
let browser;
let server;
const rows = [];
(async () => {
 const port = await new Promise((resolve, reject) => {
  const listener = net.createServer();
  listener.once("error", reject);
  listener.listen(0, "127.0.0.1", () => {
   const value = listener.address().port;
   listener.close(error => error ? reject(error) : resolve(value));
  });
 });
 const base = "http://127.0.0.1:" + port;
 server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: process.cwd(), stdio: "ignore",
  env: { ...process.env, CHAT_PROVIDER: "mock", OPENROUTER_API_KEY: "synthetic-independent-cold-probe", NEXT_TELEMETRY_DISABLED: "1" },
 });
 await expect.poll(async () => {
  if (server.exitCode !== null) throw new Error("Mock server exited");
  try { return (await fetch(base + "/api/health", { signal: AbortSignal.timeout(1000) })).status; } catch { return 0; }
 }, { timeout: 10000 }).toBe(200);
 browser = await chromium.launch({ headless: true, timeout: 8000 });
 for (const viewport of [{ width: 1280, height: 900 }, { width: 360, height: 800 }]) {
  for (let run = 1; run <= 2; run++) {
   const context = await browser.newContext({ viewport });
   const page = await context.newPage();
   page.setDefaultTimeout(5000);
   const requests = [];
   const errors = [];
   let release;
   const held = new Promise(resolve => { release = resolve; });
   page.on("pageerror", error => errors.push(error.name));
   await page.route("**/api/chat", async route => {
    requests.push(route.request().postDataJSON());
    await held;
    await route.fulfill({ json: { reply: "Independent synthetic first response.", kind: "grounded" } });
   });
   try {
    await page.goto(base, { waitUntil: "domcontentloaded" });
    const input = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(page.getByText("Demo mode", { exact: true })).toBeVisible();
    const disabledAtObservation = await input.isDisabled();
    await input.fill("Do you serve hotels?");
    await expect(input).toBeEditable();
    await expect(page.locator(".character-count")).toHaveText("20 / 2,000");
    await input.press("Enter");
    await expect.poll(() => requests.length).toBe(1);
    await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
    await expect(input).toHaveAttribute("readonly", "");
    await input.press("Enter");
    expect(requests).toEqual([{ messages: [{ role: "user", content: "Do you serve hotels?" }] }]);
    await expect(page.locator("[data-role=user]")).toHaveCount(1);
    release();
    await expect(page.locator("[data-role=assistant]")).toHaveCount(1);
    await expect(input).toBeFocused();
    await page.keyboard.type("next question");
    await expect(input).toHaveValue("next question");
    expect(requests).toHaveLength(1);
    expect(errors).toEqual([]);
    rows.push({ viewport, run, navigation: "domcontentloaded", disabledAtObservation, exactFirstRequest: true, requestCount: requests.length, userBubbles: 1, assistantBubbles: 1, duplicateEnterSuppressed: true, focusAndNextTypingRetained: true, pageErrors: errors });
   } finally { release(); await context.close(); }
  }
 }
 console.log(JSON.stringify({ result: "PASS", mode: "isolated-localhost-mock", browser: browser.version(), cases: rows }));
})().catch(error => { console.error(JSON.stringify({ result: "FAIL", errorName: error.name })); process.exitCode = 1; }).finally(async () => {
 if (browser) await browser.close().catch(() => {});
 if (server && server.exitCode === null) {
  await new Promise(resolve => { server.once("exit", resolve); server.kill("SIGTERM"); });
 }
});
'
```

Sanitized actual output:

```json
{"result":"PASS","mode":"isolated-localhost-mock","browser":"153.0.8010.12","cases":[{"viewport":{"width":1280,"height":900},"run":1,"navigation":"domcontentloaded","disabledAtObservation":false,"exactFirstRequest":true,"requestCount":1,"userBubbles":1,"assistantBubbles":1,"duplicateEnterSuppressed":true,"focusAndNextTypingRetained":true,"pageErrors":[]},{"viewport":{"width":1280,"height":900},"run":2,"navigation":"domcontentloaded","disabledAtObservation":false,"exactFirstRequest":true,"requestCount":1,"userBubbles":1,"assistantBubbles":1,"duplicateEnterSuppressed":true,"focusAndNextTypingRetained":true,"pageErrors":[]},{"viewport":{"width":360,"height":800},"run":1,"navigation":"domcontentloaded","disabledAtObservation":false,"exactFirstRequest":true,"requestCount":1,"userBubbles":1,"assistantBubbles":1,"duplicateEnterSuppressed":true,"focusAndNextTypingRetained":true,"pageErrors":[]},{"viewport":{"width":360,"height":800},"run":2,"navigation":"domcontentloaded","disabledAtObservation":false,"exactFirstRequest":true,"requestCount":1,"userBubbles":1,"assistantBubbles":1,"duplicateEnterSuppressed":true,"focusAndNextTypingRetained":true,"pageErrors":[]}]}
```

## Source/test SHA-256 snapshot

Checked before the browser runs and again before saving this report:

```text
3c44944e1876350fe3f460c2e14e00b5e98aaa156982eeafb5d2e8f8c288b051  src/ui/support-chat.tsx
ef68f6a3a9f78e338ef0b2e93c58698dbab532428a70b9abe8f1b0c902cd0a33  e2e/hydration.spec.ts
b0f1eddd58e6e493f563ffb5b04e5e620c3415bbb6d5d756c70dff9ae746a440  e2e/chat.spec.ts
cda977cb1a81be9d0ecdfc63d7635f53efa8497f0e95fb46e0560011864ee2a8  playwright.config.ts
ac6f446d9773a88390a9bdccf7bc42480c57bceec886377e6b0309ec4bca808d  src/ui/conversation.ts
9cdcb0431763fd9a353a19a159b52b357712b404ba62cc13a9d49c4712aaa1c2  app/page.tsx
ab9c53d5baeb295d9c95758435886a7cda33e4300e77db8e9e52a9a45ba24c25  app/globals.css
```

Read-only checks:

```sh
rtk proxy shasum -a 256 src/ui/support-chat.tsx e2e/hydration.spec.ts e2e/chat.spec.ts playwright.config.ts src/ui/conversation.ts app/page.tsx app/globals.css
rtk proxy lsof -nP -iTCP:3100 -sTCP:LISTEN
```

The port check produced no output and exit 1, meaning no matching listening socket was found. The isolated additional probe's own ephemeral server also completed its awaited SIGTERM/exit cleanup; no unrelated process was stopped.

## Boundaries of this verdict

This PASS covers the local hydration repair and executed browser regressions. Unit/type/lint/build results supplied by the coordinator are not attributed to this verifier and were not rerun here while unrelated extension work was ongoing. No extension behavior was verified.

The repaired source was not independently checked at a public deployment in this task. No live-model conversation, API spend measurement, complete accessibility certification, physical mobile/soft-keyboard evaluation, package verification or release closure is inferred from these local mock passes. The earlier zero-POST live attempt remains inconclusive, and deployment/live verification must retain separate evidence.

